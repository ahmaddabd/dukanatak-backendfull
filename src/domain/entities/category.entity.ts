
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany } from 'typeorm';
import { Store } from './store.entity';

@Entity('categories')
export class Category {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @ManyToOne(() => Store, store => store.categories)
  store: Store;

  @Column({ nullable: true })
  parentId?: string;

  @OneToMany(() => Category, category => category.parent)
  children: Category[];

  @ManyToOne(() => Category, category => category.children)
  parent?: Category;
}
