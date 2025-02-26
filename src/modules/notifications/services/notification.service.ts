import { Injectable, OnModuleInit } from "@nestjs/common";
import { EventBus } from "../../../infrastructure/events/event.bus";
import {
  OrderCreatedEvent,
  PaymentCompletedEvent,
  ShipmentCreatedEvent,
} from "../../../infrastructure/events/integration-events";
import { EmailService } from "../../../infrastructure/messaging/services/email.service";
import { LoggerService } from "../../../infrastructure/logging/logger.service";

@Injectable()
export class NotificationService implements OnModuleInit {
  constructor(
    private readonly eventBus: EventBus,
    private readonly emailService: EmailService,
    private readonly logger: LoggerService
  ) {}

  onModuleInit() {
    // الاشتراك في الأحداث
    this.subscribeToEvents();
  }

  private subscribeToEvents() {
    // معالجة حدث إنشاء الطلب
    this.eventBus.subscribe<OrderCreatedEvent>(
      "order.created",
      async (event) => {
        this.logger.log(
          `Processing order created event for order ${event.orderId}`,
          "NotificationService"
        );
        await this.handleOrderCreated(event);
      }
    );

    // معالجة حدث اكتمال الدفع
    this.eventBus.subscribe<PaymentCompletedEvent>(
      "payment.completed",
      async (event) => {
        this.logger.log(
          `Processing payment completed event for order ${event.orderId}`,
          "NotificationService"
        );
        await this.handlePaymentCompleted(event);
      }
    );

    // معالجة حدث إنشاء الشحنة
    this.eventBus.subscribe<ShipmentCreatedEvent>(
      "shipment.created",
      async (event) => {
        this.logger.log(
          `Processing shipment created event for order ${event.orderId}`,
          "NotificationService"
        );
        await this.handleShipmentCreated(event);
      }
    );
  }

  private async handleOrderCreated(event: OrderCreatedEvent) {
    try {
      // إرسال إشعار بإنشاء الطلب
      await this.emailService.sendEmail(
        "customer@example.com", // يجب استبدالها ببريد العميل الفعلي
        "تم إنشاء طلبك بنجاح",
        `
        <h1>تم استلام طلبك</h1>
        <p>رقم الطلب: ${event.orderId}</p>
        <p>عدد المنتجات: ${event.products.length}</p>
        `
      );
    } catch (error) {
      this.logger.error(
        "Failed to send order creation notification",
        error.stack
      );
    }
  }

  private async handlePaymentCompleted(event: PaymentCompletedEvent) {
    try {
      // إرسال إشعار باكتمال الدفع
      await this.emailService.sendEmail(
        "customer@example.com",
        "تم استلام الدفع بنجاح",
        `
        <h1>تم استلام الدفع</h1>
        <p>رقم الطلب: ${event.orderId}</p>
        <p>المبلغ: ${event.amount}</p>
        `
      );
    } catch (error) {
      this.logger.error(
        "Failed to send payment completion notification",
        error.stack
      );
    }
  }

  private async handleShipmentCreated(event: ShipmentCreatedEvent) {
    try {
      // إرسال إشعار بإنشاء الشحنة
      await this.emailService.sendEmail(
        "customer@example.com",
        "تم إنشاء شحنتك",
        `
        <h1>تم إنشاء شحنتك</h1>
        <p>رقم الطلب: ${event.orderId}</p>
        <p>رقم الشحنة: ${event.shipmentId}</p>
        <p>العنوان: ${event.address}</p>
        `
      );
    } catch (error) {
      this.logger.error(
        "Failed to send shipment creation notification",
        error.stack
      );
    }
  }
}
