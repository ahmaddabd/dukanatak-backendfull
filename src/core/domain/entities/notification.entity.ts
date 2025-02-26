import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from "typeorm";
import { User } from "./user.entity";
import { Order } from "./order.entity";
import { Shipping } from "./shipping.entity";

export enum NotificationType {
  SHIPPING_STATUS = "shipping_status",
  DELIVERY_ASSIGNED = "delivery_assigned",
  DELIVERY_STARTED = "delivery_started",
  DELIVERY_COMPLETED = "delivery_completed",
  DELIVERY_FAILED = "delivery_failed",
  ORDER_STATUS = "order_status",
}

export enum NotificationChannel {
  SMS = "sms",
  WHATSAPP = "whatsapp",
  EMAIL = "email",
  IN_APP = "in_app",
}

export enum NotificationStatus {
  PENDING = "pending",
  SENT = "sent",
  FAILED = "failed",
  DELIVERED = "delivered",
  READ = "read",
}

@Entity()
export class Notification {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ManyToOne(() => User)
  recipient: User;

  @Column({ type: "enum", enum: NotificationType })
  type: NotificationType;

  @Column({ type: "enum", enum: NotificationChannel })
  channel: NotificationChannel;

  @Column({
    type: "enum",
    enum: NotificationStatus,
    default: NotificationStatus.PENDING,
  })
  status: NotificationStatus;

  @Column()
  title: string;

  @Column()
  message: string;

  @ManyToOne(() => Order, { nullable: true })
  order?: Order;

  @ManyToOne(() => Shipping, { nullable: true })
  shipping?: Shipping;

  @Column({ type: "jsonb", nullable: true })
  metadata: {
    templateId?: string;
    variables?: { [key: string]: string };
    retryCount?: number;
    errorMessage?: string;
    deliveryStatus?: string;
    deliveryTimestamp?: Date;
  };

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
