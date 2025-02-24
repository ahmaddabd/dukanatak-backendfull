
import { CustomerStore } from '../entities/customer-store.entity';

export interface ICustomerStoreRepository {
  linkCustomerToStore(customerId: string, storeId: string): Promise<CustomerStore>;
  findStoresByCustomer(customerId: string): Promise<CustomerStore[]>;
}
