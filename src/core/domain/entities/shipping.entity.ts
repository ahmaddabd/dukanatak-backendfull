import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { Order } from "./order.entity";
import { Store } from "./store.entity";

export enum ShippingMethod {
  STORE_DELIVERY = "store_delivery", // توصيل المتجر الخاص
  LOCAL_SHIPPING = "local_shipping", // شركة شحن محلية
  PICKUP = "pickup", // استلام من المتجر
}

export enum ShippingStatus {
  PENDING = "pending", // قيد الانتظار
  PROCESSING = "processing", // قيد المعالجة
  IN_TRANSIT = "in_transit", // قيد التوصيل
  DELIVERED = "delivered", // تم التوصيل
  FAILED = "failed", // فشل التوصيل
  RETURNED = "returned", // مرتجع
}

export enum DeliveryZone {
  DAMASCUS = "damascus", // دمشق
  ALEPPO = "aleppo", // حلب
  HOMS = "homs", // حمص
  LATAKIA = "latakia", // اللاذقية
  HAMA = "hama", // حماة
  TARTUS = "tartus", // طرطوس
  DARAA = "daraa", // درعا
  IDLIB = "idlib", // إدلب
  RAQQA = "raqqa", // الرقة
  DEIR_EZ_ZOR = "deir_ez_zor", // دير الزور
  HASAKA = "hasaka", // الحسكة
  QUNEITRA = "quneitra", // القنيطرة
  SWEIDA = "sweida", // السويداء
  DAMASCUS_COUNTRYSIDE = "damascus_countryside", // ريف دمشق
}

@Entity()
export class Shipping {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @OneToOne(() => Order)
  @JoinColumn()
  order: Order;

  @ManyToOne(() => Store)
  store: Store;

  @Column({ type: "enum", enum: ShippingMethod })
  method: ShippingMethod;

  @Column({
    type: "enum",
    enum: ShippingStatus,
    default: ShippingStatus.PENDING,
  })
  status: ShippingStatus;

  @Column({ type: "enum", enum: DeliveryZone })
  deliveryZone: DeliveryZone;

  @Column("decimal", { precision: 10, scale: 2 })
  cost: number;

  @Column({ type: "jsonb" })
  deliveryAddress: {
    fullName: string;
    phone: string;
    alternativePhone?: string;
    address: string;
    city: string;
    region: string;
    landmark?: string; // علامة مميزة
    notes?: string; // ملاحظات التوصيل
  };

  @Column({ type: "jsonb", nullable: true })
  deliveryDetails: {
    driverId?: string; // معرف السائق
    driverName?: string; // اسم السائق
    driverPhone?: string; // رقم هاتف السائق
    vehicleType?: string; // نوع المركبة
    vehicleNumber?: string; // رقم المركبة
    estimatedDeliveryTime?: Date; // وقت التوصيل المتوقع
    actualDeliveryTime?: Date; // وقت التوصيل الفعلي
  };

  @Column({ type: "jsonb", nullable: true })
  trackingDetails: {
    trackingNumber?: string; // رقم التتبع
    trackingUrl?: string; // رابط التتبع
    trackingHistory: {
      status: ShippingStatus;
      timestamp: Date;
      location?: string;
      notes?: string;
    }[];
  };

  @Column({ type: "jsonb", nullable: true })
  returnDetails?: {
    reason: string;
    notes?: string;
    returnedAt: Date;
    receivedAt?: Date;
    condition?: string;
  };

  @Column({ type: "jsonb", nullable: true })
  metadata: {
    packageWeight?: number; // وزن الطرد
    packageDimensions?: {
      length: number;
      width: number;
      height: number;
    };
    isFragile?: boolean; // قابل للكسر
    requiresRefrigeration?: boolean; // يحتاج تبريد
    specialHandling?: string[]; // تعليمات خاصة
  };

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
