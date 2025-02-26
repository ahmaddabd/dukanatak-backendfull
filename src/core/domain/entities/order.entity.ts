import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
} from "typeorm";
import { User } from "./user.entity";
import { Store } from "./store.entity";
import { Payment } from "./payment.entity";

export enum OrderStatus {
  PENDING = "pending", // في انتظار الدفع
  CONFIRMED = "confirmed", // تم تأكيد الطلب
  PROCESSING = "processing", // جاري التجهيز
  SHIPPED = "shipped", // تم الشحن
  DELIVERED = "delivered", // تم التوصيل
  CANCELLED = "cancelled", // ملغي
  REFUNDED = "refunded", // تم الاسترجاع
}

@Entity()
export class Order {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ unique: true })
  orderNumber: string;

  @ManyToOne(() => User)
  customer: User;

  @ManyToOne(() => Store)
  store: Store;

  @Column({ type: "enum", enum: OrderStatus, default: OrderStatus.PENDING })
  status: OrderStatus;

  @Column("decimal", { precision: 10, scale: 2 })
  subtotal: number;

  @Column("decimal", { precision: 10, scale: 2 })
  tax: number;

  @Column("decimal", { precision: 10, scale: 2 })
  shippingCost: number;

  @Column("decimal", { precision: 10, scale: 2 })
  total: number;

  @Column({ type: "jsonb", nullable: true })
  shippingAddress: {
    fullName: string;
    phone: string;
    address: string;
    city: string;
    region: string;
    postalCode?: string;
  };

  @Column({ type: "jsonb", nullable: true })
  billingAddress: {
    fullName: string;
    phone: string;
    address: string;
    city: string;
    region: string;
    postalCode?: string;
  };

  @OneToMany(() => OrderItem, (item) => item.order, { cascade: true })
  items: OrderItem[];

  @OneToOne(() => Payment, (payment) => payment.order)
  payment: Payment;

  @Column({ type: "jsonb", nullable: true })
  metadata: {
    notes?: string;
    giftMessage?: string;
    source?: string;
    trackingNumber?: string;
  };

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

@Entity()
export class OrderItem {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ManyToOne(() => Order, (order) => order.items)
  order: Order;

  @Column()
  productId: string;

  @Column()
  productName: string;

  @Column()
  sku: string;

  @Column("decimal", { precision: 10, scale: 2 })
  price: number;

  @Column()
  quantity: number;

  @Column("decimal", { precision: 10, scale: 2 })
  total: number;

  @Column({ type: "jsonb", nullable: true })
  variant: {
    id: string;
    name: string;
    options: { [key: string]: string };
  };
}
