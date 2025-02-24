
import { Injectable } from '@nestjs/common';
import { CustomerStoreRepository } from '../../infrastructure/repositories/customer-store.repository';

@Injectable()
export class CustomerStoreService {
  constructor(private readonly customerStoreRepository: CustomerStoreRepository) {}

  async linkCustomerToStore(customerId: string, storeId: string) {
    return this.customerStoreRepository.linkCustomerToStore(customerId, storeId);
  }

  async getStoresByCustomer(customerId: string) {
    return this.customerStoreRepository.findStoresByCustomer(customerId);
  }
}
