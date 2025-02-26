import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from "@nestjs/common";
import { UserRepository } from "../../infrastructure/repositories/user.repository";
import { StoreRepository } from "../../infrastructure/repositories/store.repository";
import { CustomerRepository } from "../../infrastructure/repositories/customer.repository";
import { Store } from "../../domain/entities/store.entity";
import { Customer } from "../../domain/entities/customer.entity";

@Injectable()
export class AdminService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly storeRepository: StoreRepository,
    private readonly customerRepository: CustomerRepository
  ) {}

  async approveStore(storeId: string): Promise<void> {
    await this.storeRepository.updateStatus(storeId, "active");
  }

  async rejectStore(storeId: string): Promise<void> {
    await this.storeRepository.updateStatus(storeId, "rejected");
  }

  async getAllUsers() {
    return this.userRepository.findAll();
  }

  async getAllStores() {
    return this.storeRepository.findAll();
  }

  async blockUser(adminId: string, userId: string): Promise<void> {
    const admin = await this.userRepository.findById(adminId);
    const userToBlock = await this.userRepository.findById(userId);
    if (!admin || !userToBlock) throw new NotFoundException("User not found");
    if (admin.role !== "admin")
      throw new ForbiddenException("Permission denied");
    if (userToBlock.role === "admin")
      throw new ForbiddenException("Cannot block another admin");
    await this.userRepository.updateStatus(userId, false);
  }

  async unblockUser(userId: string): Promise<void> {
    await this.userRepository.updateStatus(userId, true);
  }

  async changeUserRole(userId: string, role: string): Promise<void> {
    await this.userRepository.updateRole(userId, role);
  }

  async getUserById(userId: string) {
    return this.userRepository.findById(userId);
  }

  async deleteUser(userId: string): Promise<void> {
    await this.userRepository.delete(userId);
  }

  async getStoreById(storeId: string): Promise<Store> {
    const store = await this.storeRepository.findById(storeId);
    if (!store) throw new NotFoundException("Store not found");
    return store;
  }

  async getCustomers(): Promise<Customer[]> {
    return this.customerRepository.find();
  }

  async getCustomerById(customerId: string): Promise<Customer> {
    const customer = await this.customerRepository.findOne({
      where: { id: customerId },
    });
    if (!customer) throw new NotFoundException("Customer not found");
    return customer;
  }
}
