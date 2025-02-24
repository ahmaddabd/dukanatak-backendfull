import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { IStoreRepository } from '../../domain/repositories/store.repository.interface';
import { Store } from '../../domain/entities/store.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateStoreDto } from '../../application/stores/dto/create-store.dto';

@Injectable()
export class StoreRepository implements IStoreRepository {
  constructor(
    @InjectRepository(Store)
    private readonly repository: Repository<Store>,
  ) {}

  async create(storeDto: CreateStoreDto): Promise<Store> {
    const store = this.repository.create(storeDto);
    return this.repository.save(store);
  }

  async save(store: Store): Promise<Store> {
    return this.repository.save(store);
  }

  async findById(id: string): Promise<Store | null> {
    return this.repository.findOne({ where: { id } });
  }

  async findBySlug(slug: string): Promise<Store | null> {
    return this.repository.findOne({ where: { slug } });
  }

  async findAll(): Promise<Store[]> {
    return this.repository.find();
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }

  async updateStatus(id: string, status: 'active' | 'pending' | 'rejected'): Promise<void> {
    await this.repository.update(id, { status });
  }
}
