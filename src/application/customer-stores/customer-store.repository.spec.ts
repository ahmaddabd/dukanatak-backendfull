
import { Test } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomerStoreRepository } from './customer-store.repository';
import { CustomerStore } from '../../domain/entities/customer-store.entity';

describe('CustomerStoreRepository', () => {
  let repository: CustomerStoreRepository;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [TypeOrmModule.forRoot({
        type: 'sqlite',
        database: ':memory:',
        dropSchema: true,
        entities: [CustomerStore],
        synchronize: true,
        logging: false,
      }), TypeOrmModule.forFeature([CustomerStoreRepository])],
    }).compile();

    repository = moduleRef.get<CustomerStoreRepository>(CustomerStoreRepository);
  });

  it('should link customer to store', async () => {
    const customerStore = await repository.linkCustomerToStore('cust123', 'store123');
    expect(customerStore).toHaveProperty('customerId', 'cust123');
    expect(customerStore).toHaveProperty('storeId', 'store123');
  });

  it('should find stores by customer', async () => {
    await repository.linkCustomerToStore('cust123', 'store123');
    const stores = await repository.findStoresByCustomer('cust123');
    expect(stores.length).toBeGreaterThan(0);
    expect(stores[0]).toHaveProperty('storeId', 'store123');
  });
});
