import { Customer } from '../entities/customer.entity';

export interface ICustomerRepository {
  findByPhoneNumber(phoneNumber: string): Promise<Customer | null>;
  createOrUpdateOtp(phoneNumber: string, otpCode: string, otpExpiresAt: Date): Promise<Customer>;
  verifyOtp(phoneNumber: string, otpCode: string): Promise<boolean>;
  find(): Promise<Customer[]>;
  findOne(options: any): Promise<Customer | null>;
  save(customer: Customer): Promise<Customer>;
  delete(id: string): Promise<void>;
}
