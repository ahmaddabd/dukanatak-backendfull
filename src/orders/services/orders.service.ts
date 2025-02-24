import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateOrderDto } from '../dto/create-order.dto';
import { UpdateOrderDto } from '../dto/update-order.dto';
import { OrderEntity } from '../entities/order.entity';
import { Product } from '../../domain/entities/product.entity';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(OrderEntity)
    private ordersRepository: Repository<OrderEntity>,
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
  ) {}

  async createOrder(createOrderDto: CreateOrderDto): Promise<OrderEntity> {
    let totalAmount = 0;
    for (const item of createOrderDto.items) {
      const product = await this.productRepository.findOne({ where: { id: item.productId } });
      if (!product) {
        throw new NotFoundException('Product not found');
      }
      totalAmount += product.price * item.quantity;
    }
    
    const order = this.ordersRepository.create({
      ...createOrderDto,
      totalAmount,
    });
    return this.ordersRepository.save(order);
  }

  async getOrderById(id: string): Promise<OrderEntity> {
    const order = await this.ordersRepository.findOne({ where: { id }, relations: ['items'] });
    if (!order) {
      throw new NotFoundException('Order not found');
    }
    return order;
  }

  async updateOrder(id: string, updateOrderDto: UpdateOrderDto): Promise<OrderEntity> {
    await this.ordersRepository.update(id, updateOrderDto);
    return this.getOrderById(id);
  }

  async deleteOrder(id: string): Promise<void> {
    const result = await this.ordersRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('Order not found');
    }
  }
}
