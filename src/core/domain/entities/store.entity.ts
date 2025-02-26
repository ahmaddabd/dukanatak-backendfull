import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  JoinColumn,
} from "typeorm";
import { User } from "./user.entity";
import { Category } from "./category.entity";
import { CustomerStore } from "./customer-store.entity";
import { Product } from "./product.entity";

export enum StoreStatus {
  PENDING = "pending",
  ACTIVE = "active",
  REJECTED = "rejected",
  SUSPENDED = "suspended",
}

export enum StoreTheme {
  DEFAULT = "default",
  MODERN = "modern",
  CLASSIC = "classic",
  MINIMAL = "minimal",
}

@Entity()
export class Store {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ unique: true })
  name: string;

  @Column({ unique: true })
  slug: string;

  @Column({ type: "enum", enum: StoreStatus, default: StoreStatus.PENDING })
  status: StoreStatus;

  @OneToOne(() => User)
  @JoinColumn()
  owner: User;

  @Column({ nullable: true })
  logo: string;

  @Column({ nullable: true })
  banner: string;

  @Column({ type: "text", nullable: true })
  description: string;

  @Column({ type: "enum", enum: StoreTheme, default: StoreTheme.DEFAULT })
  theme: StoreTheme;

  @Column({ type: "jsonb", nullable: true })
  settings: {
    currency: string;
    language: string;
    timezone: string;
    paymentMethods: string[];
    shippingMethods: string[];
    inventory: {
      lowStockThreshold: number;
      notifyLowStock: boolean;
      autoHideOutOfStock: boolean;
    };
  };

  @Column({ type: "jsonb", nullable: true })
  contact: {
    email: string;
    phone: string;
    address: string;
    socialMedia: {
      facebook?: string;
      instagram?: string;
      twitter?: string;
    };
  };

  @Column({ type: "jsonb", nullable: true })
  customDomain: {
    domain: string;
    verified: boolean;
    sslEnabled: boolean;
  };

  @OneToMany(() => Category, (category) => category.store)
  categories: Category[];

  @OneToMany(() => Product, (product) => product.store)
  products: Product[];

  @OneToMany(() => CustomerStore, (customerStore) => customerStore.store)
  customerStores: CustomerStore[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
