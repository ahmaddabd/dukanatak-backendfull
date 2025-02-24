import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { UserRepository } from '../../infrastructure/repositories/user.repository';
import { StoreRepository } from '../../infrastructure/repositories/store.repository';
import { CustomerRepository } from '../../infrastructure/repositories/customer.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../../domain/entities/user.entity';
import { Store } from '../../domain/entities/store.entity';
import { Customer } from '../../domain/entities/customer.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Store, Customer])],
  controllers: [AdminController],
  providers: [AdminService, UserRepository, StoreRepository, CustomerRepository],
})
export class AdminModule {}
