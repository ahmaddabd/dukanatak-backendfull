
import { Entity, ManyToOne, CreateDateColumn, PrimaryColumn, Column } from 'typeorm';
import { Customer } from './customer.entity';
import { Store } from './store.entity';

@Entity()
export class CustomerStore {
  @PrimaryColumn()
  customerId: string;

  @PrimaryColumn()
  storeId: string;

  @ManyToOne(() => Customer, customer => customer.customerStores, { eager: true })
  customer: Customer;

  @ManyToOne(() => Store, store => store.id, { eager: true })
  store: Store;

  @Column({ nullable: true })
  address?: string;

  @CreateDateColumn()
  createdAt: Date;
}
