import { Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ConfigService } from "@nestjs/config";
import { Twilio } from "twilio";
import {
  Notification,
  NotificationType,
  NotificationChannel,
  NotificationStatus,
} from "../../domain/entities/notification.entity";
import { User } from "../../domain/entities/user.entity";
import { Order } from "../../domain/entities/order.entity";
import {
  Shipping,
  ShippingStatus,
} from "../../domain/entities/shipping.entity";

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);
  private readonly twilioClient: Twilio;

  constructor(
    @InjectRepository(Notification)
    private readonly notificationRepository: Repository<Notification>,
    private readonly configService: ConfigService
  ) {
    this.twilioClient = new Twilio(
      this.configService.get("TWILIO_ACCOUNT_SID"),
      this.configService.get("TWILIO_AUTH_TOKEN")
    );
  }

  async createShippingNotification(
    recipient: User,
    shipping: Shipping,
    type: NotificationType,
    channel: NotificationChannel = NotificationChannel.SMS
  ): Promise<Notification> {
    const notification = this.notificationRepository.create({
      recipient,
      type,
      channel,
      shipping,
      order: shipping.order,
    });

    // تحديد عنوان ورسالة الإشعار بناءً على نوعه
    switch (type) {
      case NotificationType.SHIPPING_STATUS:
        notification.title = "تحديث حالة الشحنة";
        notification.message = `تم تحديث حالة شحنتك رقم ${shipping.trackingDetails.trackingNumber} إلى ${shipping.status}`;
        break;
      case NotificationType.DELIVERY_ASSIGNED:
        notification.title = "تم تعيين مندوب التوصيل";
        notification.message = `تم تعيين مندوب التوصيل ${shipping.deliveryDetails.driverName} لشحنتك رقم ${shipping.trackingDetails.trackingNumber}. رقم الهاتف: ${shipping.deliveryDetails.driverPhone}`;
        break;
      case NotificationType.DELIVERY_STARTED:
        notification.title = "بدء التوصيل";
        notification.message = `بدأ مندوب التوصيل رحلته لتوصيل شحنتك رقم ${shipping.trackingDetails.trackingNumber}`;
        break;
      case NotificationType.DELIVERY_COMPLETED:
        notification.title = "تم التوصيل";
        notification.message = `تم توصيل شحنتك رقم ${shipping.trackingDetails.trackingNumber} بنجاح`;
        break;
      case NotificationType.DELIVERY_FAILED:
        notification.title = "فشل التوصيل";
        notification.message = `تعذر توصيل شحنتك رقم ${shipping.trackingDetails.trackingNumber}. سيتم إعادة المحاولة قريباً`;
        break;
    }

    const savedNotification = await this.notificationRepository.save(
      notification
    );
    await this.sendNotification(savedNotification);
    return savedNotification;
  }

  private async sendNotification(notification: Notification): Promise<void> {
    try {
      switch (notification.channel) {
        case NotificationChannel.SMS:
          await this.sendSMS(notification);
          break;
        case NotificationChannel.WHATSAPP:
          await this.sendWhatsApp(notification);
          break;
        // يمكن إضافة قنوات أخرى هنا
      }

      notification.status = NotificationStatus.SENT;
      await this.notificationRepository.save(notification);
    } catch (error) {
      this.logger.error(
        `فشل إرسال الإشعار ${notification.id}: ${error.message}`,
        error.stack
      );
      notification.status = NotificationStatus.FAILED;
      notification.metadata = {
        ...notification.metadata,
        errorMessage: error.message,
        retryCount: (notification.metadata?.retryCount || 0) + 1,
      };
      await this.notificationRepository.save(notification);
    }
  }

  private async sendSMS(notification: Notification): Promise<void> {
    await this.twilioClient.messages.create({
      body: notification.message,
      to: notification.recipient.phone,
      from: this.configService.get("TWILIO_PHONE_NUMBER"),
    });
  }

  private async sendWhatsApp(notification: Notification): Promise<void> {
    await this.twilioClient.messages.create({
      body: notification.message,
      to: `whatsapp:${notification.recipient.phone}`,
      from: `whatsapp:${this.configService.get("TWILIO_WHATSAPP_NUMBER")}`,
    });
  }

  async getNotificationsByUser(userId: string): Promise<Notification[]> {
    return this.notificationRepository.find({
      where: { recipient: { id: userId } },
      order: { createdAt: "DESC" },
      relations: ["shipping", "order"],
    });
  }

  async markNotificationAsRead(
    notificationId: string,
    userId: string
  ): Promise<Notification> {
    const notification = await this.notificationRepository.findOne({
      where: { id: notificationId, recipient: { id: userId } },
    });

    if (!notification) {
      throw new Error("الإشعار غير موجود");
    }

    notification.status = NotificationStatus.READ;
    return this.notificationRepository.save(notification);
  }
}
