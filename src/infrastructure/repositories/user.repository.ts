
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from '../../domain/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UserRepository {
  constructor(
    @InjectRepository(User)
    private readonly repository: Repository<User>,
  ) {}

  async updateStatus(userId: string, isActive: boolean) {
    await this.repository.update(userId, { isActive });
  }

  async updateRole(userId: string, role: string) {
    await this.repository.update(userId, { role });
  }

  async delete(userId: string) {
    await this.repository.delete(userId);
  }

  async findAll() {
    return this.repository.find();
  }

  async findById(userId: string) {
    return this.repository.findOne({ where: { id: userId } });
  }

  async findByEmail(email: string) {
    return this.repository.findOne({ where: { email } });
  }
}
