import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from "typeorm";
import { Store } from "./store.entity";
import { Category } from "./category.entity";

@Entity()
export class Product {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  description: string;

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
