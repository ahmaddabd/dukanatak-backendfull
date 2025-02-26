import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  ManyToMany,
  JoinTable,
} from "typeorm";
import { Store } from "./store.entity";
import { Category } from "./category.entity";

export enum ProductStatus {
  DRAFT = 'draft',
  ACTIVE = 'active',
  OUT_OF_STOCK = 'out_of_stock',
  HIDDEN = 'hidden',
}

export enum ProductType {
  PHYSICAL = 'physical',
  DIGITAL = 'digital',
  SERVICE = 'service',
}

@Entity()
export class Product {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  name: string;

  @Column({ unique: true })
  sku: string;

  @Column("decimal")
  price: number;

  @Column({ default: 0 })
  quantity: number;

  @Column({ nullable: true })
  sku: string;

  @Column("simple-array", { nullable: true })
  images: string[];

  @ManyToOne(() => Store, { eager: true })
  store: Store;

  @ManyToOne(() => Category, { eager: true })
  category: Category;

  @Column({ default: 0 })
  quantityAvailable: number; // Add this property

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
