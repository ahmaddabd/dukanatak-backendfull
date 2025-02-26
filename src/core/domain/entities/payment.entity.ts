import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
} from "typeorm";
import { Order } from "./order.entity";

export enum PaymentMethod {
  CASH_ON_DELIVERY = "cash_on_delivery",
  BANK_TRANSFER = "bank_transfer",
  MONEY_TRANSFER = "money_transfer",
  WESTERN_UNION = "western_union",
  MONEY_GRAM = "money_gram",
  E_WALLET = "e_wallet",
  STORE_CREDIT = "store_credit",
}

export enum PaymentStatus {
  PENDING = "pending",
  PROCESSING = "processing",
  COMPLETED = "completed",
  FAILED = "failed",
  REFUNDED = "refunded",
  CANCELLED = "cancelled",
  AWAITING_VERIFICATION = "awaiting_verification",
}

export enum PaymentCurrency {
  SYP = "SYP",
  USD = "USD",
}

@Entity()
export class Payment {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @OneToOne(() => Order, (order) => order.payment)
  @JoinColumn()
  order: Order;

  @Column({ type: "enum", enum: PaymentMethod })
  method: PaymentMethod;

  @Column({ type: "enum", enum: PaymentStatus, default: PaymentStatus.PENDING })
  status: PaymentStatus;

  @Column("decimal", { precision: 10, scale: 2 })
  amount: number;

  @Column({ type: "enum", enum: PaymentCurrency, default: PaymentCurrency.SYP })
  currency: PaymentCurrency;

  @Column("decimal", { precision: 10, scale: 2, nullable: true })
  exchangeRate: number;

  @Column({ type: "jsonb", nullable: true })
  paymentDetails: {
    transactionId?: string;
    provider?: string;
    transferNumber?: string;
    bankName?: string;
    branchName?: string;
    accountNumber?: string;
    transferDate?: Date;
    senderName?: string;
    receiverName?: string;
    transferAmount?: number;
    transferCurrency?: string;
    attachmentUrl?: string;
  };

  @Column({ type: "jsonb", nullable: true })
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

  @Column({ nullable: true })
  refundReason?: string;

  @Column({ type: "jsonb", nullable: true })
  verificationDetails: {
    verifiedBy?: string;
    verifiedAt?: Date;
    notes?: string;
    attachments?: string[];
  };

  @Column({ type: "jsonb", nullable: true })
  metadata: {
    ipAddress?: string;
    userAgent?: string;
    risk?: {
      score: number;
      level: "low" | "medium" | "high";
      factors?: string[];
    };
    notes?: string;
  };

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
