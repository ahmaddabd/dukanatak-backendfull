import { Entity, PrimaryGeneratedColumn, OneToOne, JoinColumn, OneToMany, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Customer } from './customer.entity';
import { CartItem } from './cart-item.entity';

@Entity()
export class Cart {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  customerId: string;

  @Column()
  storeId: string;

  @OneToOne(() => Customer, customer => customer.cart, { eager: true })
  @JoinColumn()
  customer: Customer;

  @OneToMany(() => CartItem, item => item.cart, { cascade: true, eager: true })
  items: CartItem[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
