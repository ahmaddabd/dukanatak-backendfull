import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany } from 'typeorm';
import { User } from './user.entity';
import { Category } from './category.entity';
import { CustomerStore } from './customer-store.entity';

@Entity()
export class Store {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  name: string;

  @Column({ unique: true })
  slug: string;

  @Column({ default: 'pending' })
  status: 'active' | 'pending' | 'rejected';

  @ManyToOne(() => User, { eager: true })
  owner: User;

  @OneToMany(() => Category, category => category.store)
  categories: Category[];

  @OneToMany(() => CustomerStore, customerStore => customerStore.store)
  customerStores: CustomerStore[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
