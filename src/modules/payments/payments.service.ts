import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import {
  Payment,
  PaymentStatus,
  PaymentMethod,
  PaymentCurrency,
} from "../../domain/entities/payment.entity";
import { Order, OrderStatus } from "../../domain/entities/order.entity";
import { User, UserRole } from "../../domain/entities/user.entity";

@Injectable()
export class PaymentsService {
  constructor(
    @InjectRepository(Payment)
    private readonly paymentRepository: Repository<Payment>,
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>
  ) {}

  async createPayment(
    orderId: string,
    paymentData: {
      method: PaymentMethod;
      currency: PaymentCurrency;
      billingDetails: {
        name: string;
        email: string;
        phone: string;
        address: {
          line1: string;
          line2?: string;
          city: string;
          region: string;
          postalCode?: string;
          country: string;
        };
      };
      paymentDetails?: {
        transferNumber?: string;
        bankName?: string;
        branchName?: string;
        accountNumber?: string;
        transferDate?: Date;
        senderName?: string;
        attachmentUrl?: string;
      };
    },
    currentUser: User
  ): Promise<Payment> {
    const order = await this.orderRepository.findOne({
      where: { id: orderId },
      relations: ["customer", "store"],
    });

    if (!order) {
      throw new NotFoundException("الطلب غير موجود");
    }

    if (
      order.customer.id !== currentUser.id &&
      currentUser.role !== UserRole.ADMIN
    ) {
      throw new BadRequestException("لا يمكنك الدفع لهذا الطلب");
    }

    if (order.status !== OrderStatus.PENDING) {
      throw new BadRequestException(
        "لا يمكن الدفع لهذا الطلب في حالته الحالية"
      );
    }

    const existingPayment = await this.paymentRepository.findOne({
      where: { order: { id: orderId } },
    });

    if (existingPayment) {
      throw new BadRequestException("يوجد عملية دفع بالفعل لهذا الطلب");
    }

    // تحديد حالة الدفع الأولية بناءً على طريقة الدفع
    let initialStatus = PaymentStatus.PENDING;
    if (paymentData.method === PaymentMethod.CASH_ON_DELIVERY) {
      initialStatus = PaymentStatus.AWAITING_VERIFICATION;
    } else if (
      [
        PaymentMethod.BANK_TRANSFER,
        PaymentMethod.MONEY_TRANSFER,
        PaymentMethod.WESTERN_UNION,
        PaymentMethod.MONEY_GRAM,
      ].includes(paymentData.method)
    ) {
      if (!paymentData.paymentDetails) {
        throw new BadRequestException("يجب إدخال تفاصيل التحويل");
      }
      initialStatus = PaymentStatus.AWAITING_VERIFICATION;
    }

    const payment = this.paymentRepository.create({
      order,
      method: paymentData.method,
      currency: paymentData.currency,
      amount: order.total,
      status: initialStatus,
      billingDetails: paymentData.billingDetails,
      paymentDetails: paymentData.paymentDetails,
      metadata: {
        ipAddress: "::1",
        userAgent: "API",
        notes: `تم إنشاء الدفع باستخدام ${paymentData.method}`,
      },
    });

    const savedPayment = await this.paymentRepository.save(payment);

    // تحديث حالة الطلب
    if (paymentData.method === PaymentMethod.CASH_ON_DELIVERY) {
      order.status = OrderStatus.CONFIRMED;
    } else {
      order.status = OrderStatus.PENDING;
    }
    await this.orderRepository.save(order);

    return savedPayment;
  }

  async verifyPayment(
    paymentId: string,
    verificationData: {
      notes?: string;
      attachments?: string[];
    },
    currentUser: User
  ): Promise<Payment> {
    const payment = await this.paymentRepository.findOne({
      where: { id: paymentId },
      relations: ["order", "order.store", "order.store.owner"],
    });

    if (!payment) {
      throw new NotFoundException("عملية الدفع غير موجودة");
    }

    if (
      currentUser.role !== UserRole.ADMIN &&
      payment.order.store.owner.id !== currentUser.id
    ) {
      throw new BadRequestException("ليس لديك صلاحية للتحقق من هذه العملية");
    }

    if (payment.status !== PaymentStatus.AWAITING_VERIFICATION) {
      throw new BadRequestException(
        "لا يمكن التحقق من هذه العملية في حالتها الحالية"
      );
    }

    payment.status = PaymentStatus.COMPLETED;
    payment.verificationDetails = {
      verifiedBy: currentUser.id,
      verifiedAt: new Date(),
      notes: verificationData.notes,
      attachments: verificationData.attachments,
    };

    const savedPayment = await this.paymentRepository.save(payment);

    // تحديث حالة الطلب
    payment.order.status = OrderStatus.PROCESSING;
    await this.orderRepository.save(payment.order);

    return savedPayment;
  }

  async refundPayment(
    paymentId: string,
    refundReason: string,
    currentUser: User
  ): Promise<Payment> {
    const payment = await this.paymentRepository.findOne({
      where: { id: paymentId },
      relations: ["order", "order.store", "order.store.owner"],
    });

    if (!payment) {
      throw new NotFoundException("عملية الدفع غير موجودة");
    }

    if (
      currentUser.role !== UserRole.ADMIN &&
      payment.order.store.owner.id !== currentUser.id
    ) {
      throw new BadRequestException("ليس لديك صلاحية لاسترجاع هذه العملية");
    }

    if (payment.status !== PaymentStatus.COMPLETED) {
      throw new BadRequestException(
        "لا يمكن استرجاع هذه العملية في حالتها الحالية"
      );
    }

    payment.status = PaymentStatus.REFUNDED;
    payment.refundReason = refundReason;

    const savedPayment = await this.paymentRepository.save(payment);

    // تحديث حالة الطلب
    payment.order.status = OrderStatus.REFUNDED;
    await this.orderRepository.save(payment.order);

    return savedPayment;
  }

  async getPaymentDetails(
    paymentId: string,
    currentUser: User
  ): Promise<Payment> {
    const payment = await this.paymentRepository.findOne({
      where: { id: paymentId },
      relations: [
        "order",
        "order.customer",
        "order.store",
        "order.store.owner",
      ],
    });

    if (!payment) {
      throw new NotFoundException("عملية الدفع غير موجودة");
    }

    if (
      currentUser.role !== UserRole.ADMIN &&
      payment.order.customer.id !== currentUser.id &&
      payment.order.store.owner.id !== currentUser.id
    ) {
      throw new BadRequestException("ليس لديك صلاحية لعرض تفاصيل هذه العملية");
    }

    return payment;
  }
}
