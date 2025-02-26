import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Order, OrderStatus } from "../../../core/domain/entities/order.entity";
import { User } from "../../../core/domain/entities/user.entity";
import { Store } from "../../../core/domain/entities/store.entity";
import { EventBus } from "../../../infrastructure/events/event.bus";
import { OrderCreatedEvent } from "../events/order-created.event";
import { CreateOrderDto } from "../dto/create-order.dto";
import { UpdateOrderDto } from "../dto/update-order.dto";
import { CacheService } from "../../../shared/services/cache.service";
import { LoggerService } from "../../../infrastructure/logging/logger.service";

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Store)
    private readonly storeRepository: Repository<Store>,
    private readonly eventBus: EventBus,
    private readonly cacheService: CacheService,
    private readonly logger: LoggerService
  ) {}

  async create(createOrderDto: CreateOrderDto): Promise<Order> {
    const customer = await this.userRepository.findOne({
      where: { id: createOrderDto.customerId },
    });
    const store = await this.storeRepository.findOne({
      where: { id: createOrderDto.storeId },
    });

    if (!customer || !store) {
      throw new Error("Customer or store not found");
    }

    const order = this.orderRepository.create({
      customer,
      store,
      orderNumber: this.generateOrderNumber(),
      status: OrderStatus.PENDING,
      items: createOrderDto.items.map((item) => ({
        productId: item.productId,
        productName: item.productName,
        sku: item.sku,
        price: item.price,
        quantity: item.quantity,
        total: item.price * item.quantity,
        variant: item.variant,
      })),
      subtotal: createOrderDto.items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      ),
      tax: createOrderDto.tax,
      shippingCost: createOrderDto.shippingCost,
      total:
        createOrderDto.items.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0
        ) +
        createOrderDto.tax +
        createOrderDto.shippingCost,
      shippingAddress: createOrderDto.shippingAddress,
      billingAddress: createOrderDto.billingAddress,
      metadata: createOrderDto.metadata,
    });

    const savedOrder = await this.orderRepository.save(order);

    this.eventBus.publish(
      new OrderCreatedEvent({
        orderId: savedOrder.id,
        customerId: customer.id,
        storeId: store.id,
        total: savedOrder.total,
        status: savedOrder.status,
      })
    );

    return savedOrder;
  }

  async findAll(): Promise<Order[]> {
    return this.orderRepository.find({
      relations: ["customer", "store", "items", "payment"],
    });
  }

  async findOne(id: string): Promise<Order> {
    return this.orderRepository.findOne({
      where: { id },
      relations: ["customer", "store", "items", "payment"],
    });
  }

  async update(id: string, updateOrderDto: UpdateOrderDto): Promise<Order> {
    const order = await this.orderRepository.findOne({ where: { id } });
    if (!order) {
      throw new Error("Order not found");
    }

    Object.assign(order, updateOrderDto);
    return this.orderRepository.save(order);
  }

  async remove(id: string): Promise<void> {
    await this.orderRepository.delete(id);
  }

  private generateOrderNumber(): string {
    return `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  }

  async getOrderById(id: string): Promise<Order> {
    // محاولة الحصول من الذاكرة المؤقتة أولاً
    const cached = await this.cacheService.get<Order>(`order:${id}`);
    if (cached) {
      return cached;
    }

    const order = await this.orderRepository.findOne({
      where: { id },
      relations: ["items"],
    });
    if (order) {
      // حفظ في الذاكرة المؤقتة
      await this.cacheService.set(`order:${id}`, order, 3600);
    }

    if (!order) {
      throw new NotFoundException("Order not found");
    }
    return order;
  }

  async updateOrder(
    id: string,
    updateOrderDto: UpdateOrderDto
  ): Promise<Order> {
    await this.orderRepository.update(id, updateOrderDto);

    // حذف من الذاكرة المؤقتة لضمان التحديث
    await this.cacheService.delete(`order:${id}`);

    return this.getOrderById(id);
  }

  async deleteOrder(id: string): Promise<void> {
    const result = await this.orderRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException("Order not found");
    }
    await this.cacheService.delete(`order:${id}`);
  }
}
