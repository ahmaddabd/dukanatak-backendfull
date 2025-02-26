import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";
import {
  Shipping,
  ShippingMethod,
  ShippingStatus,
  DeliveryZone,
} from "../../domain/entities/shipping.entity";
import { Order, OrderStatus } from "../../domain/entities/order.entity";
import { User, UserRole } from "../../domain/entities/user.entity";
import { NotificationsService } from "../notifications/notifications.service";
import {
  NotificationType,
  NotificationChannel,
} from "../../domain/entities/notification.entity";
import { UnitOfWork } from "../../infrastructure/database/unit-of-work";
import { ShippingRepository } from "../../infrastructure/repositories/shipping.repository";

@Injectable()
export class ShippingService {
  constructor(
    private readonly unitOfWork: UnitOfWork,
    private readonly shippingRepository: ShippingRepository,
    private readonly notificationsService: NotificationsService
  ) {}

  private calculateShippingCost(
    deliveryZone: DeliveryZone,
    method: ShippingMethod,
    metadata?: {
      packageWeight?: number;
      packageDimensions?: {
        length: number;
        width: number;
        height: number;
      };
    }
  ): number {
    // هنا يمكن إضافة منطق حساب تكلفة الشحن حسب المنطقة والوزن والأبعاد
    const baseCost = {
      [DeliveryZone.DAMASCUS]: 5000,
      [DeliveryZone.ALEPPO]: 7000,
      [DeliveryZone.HOMS]: 6000,
      [DeliveryZone.LATAKIA]: 6000,
      [DeliveryZone.HAMA]: 6000,
      [DeliveryZone.TARTUS]: 6000,
      [DeliveryZone.DARAA]: 7000,
      [DeliveryZone.IDLIB]: 8000,
      [DeliveryZone.RAQQA]: 8000,
      [DeliveryZone.DEIR_EZ_ZOR]: 8000,
      [DeliveryZone.HASAKA]: 8000,
      [DeliveryZone.QUNEITRA]: 7000,
      [DeliveryZone.SWEIDA]: 7000,
      [DeliveryZone.DAMASCUS_COUNTRYSIDE]: 5500,
    }[deliveryZone];

    let additionalCost = 0;

    if (metadata?.packageWeight && metadata.packageWeight > 5) {
      additionalCost += (metadata.packageWeight - 5) * 1000; // 1000 ل.س لكل كيلو إضافي
    }

    if (method === ShippingMethod.STORE_DELIVERY) {
      additionalCost += 2000; // تكلفة إضافية للتوصيل الخاص
    }

    return baseCost + additionalCost;
  }

  async createShipping(
    orderId: string,
    shippingData: {
      method: ShippingMethod;
      deliveryZone: DeliveryZone;
      deliveryAddress: {
        fullName: string;
        phone: string;
        alternativePhone?: string;
        address: string;
        city: string;
        region: string;
        landmark?: string;
        notes?: string;
      };
      metadata?: {
        packageWeight?: number;
        packageDimensions?: {
          length: number;
          width: number;
          height: number;
        };
        isFragile?: boolean;
        requiresRefrigeration?: boolean;
        specialHandling?: string[];
      };
    },
    currentUser: User
  ): Promise<Shipping> {
    return this.unitOfWork.withRepositories(async (repositories) => {
      const order = await repositories.order.findOne({
        where: { id: orderId },
        relations: ["store", "store.owner"],
      });

      if (!order) {
        throw new NotFoundException("الطلب غير موجود");
      }

      if (
        currentUser.role !== UserRole.ADMIN &&
        order.store.owner.id !== currentUser.id
      ) {
        throw new BadRequestException("ليس لديك صلاحية لإنشاء شحنة لهذا الطلب");
      }

      const cost = this.calculateShippingCost(
        shippingData.deliveryZone,
        shippingData.method,
        shippingData.metadata
      );

      const shipping = repositories.shipping.create({
        order,
        store: order.store,
        method: shippingData.method,
        status: ShippingStatus.PENDING,
        deliveryZone: shippingData.deliveryZone,
        cost,
        deliveryAddress: shippingData.deliveryAddress,
        metadata: shippingData.metadata,
        trackingDetails: {
          trackingNumber: `SH-${Date.now()}-${Math.floor(
            Math.random() * 1000
          )}`,
          trackingHistory: [
            {
              status: ShippingStatus.PENDING,
              timestamp: new Date(),
              notes: "تم إنشاء الشحنة",
            },
          ],
        },
      });

      order.status = OrderStatus.PROCESSING;
      await repositories.order.save(order);

      return shipping;
    });
  }

  async updateShippingStatus(
    shippingId: string,
    status: ShippingStatus,
    updateData: {
      location?: string;
      notes?: string;
      deliveryDetails?: {
        driverId?: string;
        driverName?: string;
        driverPhone?: string;
        vehicleType?: string;
        vehicleNumber?: string;
        estimatedDeliveryTime?: Date;
        actualDeliveryTime?: Date;
      };
    },
    currentUser: User
  ): Promise<Shipping> {
    return this.unitOfWork.withRepositories(async (repositories) => {
      const shipping = await this.shippingRepository.findById(shippingId);

      if (
        currentUser.role !== UserRole.ADMIN &&
        shipping.store.owner.id !== currentUser.id
      ) {
        throw new BadRequestException("ليس لديك صلاحية لتحديث حالة الشحنة");
      }

      shipping.status = status;
      if (updateData.deliveryDetails) {
        shipping.deliveryDetails = {
          ...shipping.deliveryDetails,
          ...updateData.deliveryDetails,
        };
      }

      shipping.trackingDetails.trackingHistory.push({
        status,
        timestamp: new Date(),
        location: updateData.location,
        notes: updateData.notes,
      });

      const savedShipping = await repositories.shipping.save(shipping);

      // إرسال إشعارات للعميل
      switch (status) {
        case ShippingStatus.IN_TRANSIT:
          await this.notificationsService.createShippingNotification(
            shipping.order.customer,
            shipping,
            NotificationType.DELIVERY_STARTED
          );
          break;
        case ShippingStatus.DELIVERED:
          await this.notificationsService.createShippingNotification(
            shipping.order.customer,
            shipping,
            NotificationType.DELIVERY_COMPLETED
          );
          shipping.order.status = OrderStatus.DELIVERED;
          await repositories.order.save(shipping.order);
          break;
        case ShippingStatus.FAILED:
          await this.notificationsService.createShippingNotification(
            shipping.order.customer,
            shipping,
            NotificationType.DELIVERY_FAILED
          );
          break;
        default:
          await this.notificationsService.createShippingNotification(
            shipping.order.customer,
            shipping,
            NotificationType.SHIPPING_STATUS
          );
      }

      return savedShipping;
    });
  }

  async getShippingDetails(
    shippingId: string,
    currentUser: User
  ): Promise<Shipping> {
    const shipping = await this.shippingRepository.findById(shippingId);

    if (
      currentUser.role !== UserRole.ADMIN &&
      shipping.store.owner.id !== currentUser.id &&
      shipping.order.customer.id !== currentUser.id
    ) {
      throw new BadRequestException("ليس لديك صلاحية للوصول إلى هذه الشحنة");
    }

    return shipping;
  }

  async calculateEstimatedCost(
    deliveryZone: DeliveryZone,
    method: ShippingMethod,
    metadata?: {
      packageWeight?: number;
      packageDimensions?: {
        length: number;
        width: number;
        height: number;
      };
    }
  ): Promise<{ cost: number }> {
    const cost = this.calculateShippingCost(deliveryZone, method, metadata);
    return { cost };
  }
}
