
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { CustomerStore } from '../../domain/entities/customer-store.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { ICustomerStoreRepository } from '../../domain/repositories/customer-store.repository.interface';

@Injectable()
export class CustomerStoreRepository implements ICustomerStoreRepository {
  constructor(
    @InjectRepository(CustomerStore)
    private readonly repository: Repository<CustomerStore>,
  ) {}

  async linkCustomerToStore(customerId: string, storeId: string): Promise<CustomerStore> {
    const customerStore = this.repository.create({ customer: { id: customerId }, store: { id: storeId } });
    return this.repository.save(customerStore);
  }

  async findStoresByCustomer(customerId: string): Promise<CustomerStore[]> {
    return this.repository.find({ where: { customer: { id: customerId } } });
  }
}
