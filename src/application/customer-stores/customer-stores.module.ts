import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomerStoreService } from './customer-store.service';
import { CustomerStoreRepository } from '../../infrastructure/repositories/customer-store.repository';
import { CustomerStore } from '../../domain/entities/customer-store.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CustomerStore])],
  providers: [CustomerStoreService, CustomerStoreRepository],
  exports: [CustomerStoreService],
})
export class CustomerStoresModule {}
