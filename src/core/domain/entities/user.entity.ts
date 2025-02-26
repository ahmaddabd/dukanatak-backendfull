import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
} from "typeorm";
import { Store } from "./store.entity";

export enum UserRole {
  ADMIN = "admin",
  MERCHANT = "merchant",
  CUSTOMER = "customer",
}

export enum UserStatus {
  ACTIVE = "active",
  PENDING = "pending",
  BLOCKED = "blocked",
}

@Entity()
export class User {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ type: "enum", enum: UserRole, default: UserRole.CUSTOMER })
  role: UserRole;

  @Column({ type: "enum", enum: UserStatus, default: UserStatus.PENDING })
  status: UserStatus;

  @Column({ nullable: true })
  phone: string;

  @OneToOne(() => Store, (store) => store.owner, { nullable: true })
  store: Store;

  @Column({ nullable: true })
  avatar: string;

  @Column({ default: false })
  emailVerified: boolean;

  @Column({ default: false })
  phoneVerified: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ type: "jsonb", nullable: true })
  settings: {
    notifications: boolean;
    language: string;
    theme: string;
  };
}
