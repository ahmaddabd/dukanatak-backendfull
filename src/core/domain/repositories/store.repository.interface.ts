import { Store } from '../entities/store.entity';
import { CreateStoreDto } from '../../application/stores/dto/create-store.dto';

export interface IStoreRepository {
  create(storeDto: CreateStoreDto): Promise<Store>;
  save(store: Store): Promise<Store>;
  findById(id: string): Promise<Store | null>;
  findBySlug(slug: string): Promise<Store | null>;
  findAll(): Promise<Store[]>;
  delete(id: string): Promise<void>;
  updateStatus(id: string, status: 'active' | 'pending' | 'rejected'): Promise<void>;
}
