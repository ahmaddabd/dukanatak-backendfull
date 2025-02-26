import { Injectable, NotFoundException, Inject } from "@nestjs/common";
import { IStoreRepository } from "../../domain/repositories/store.repository.interface";
import { CreateStoreDto } from "./dto/create-store.dto";
import { UpdateStoreDto } from "./dto/update-store.dto";
import { Store } from "../../domain/entities/store.entity";

@Injectable()
export class StoreService {
  constructor(
    @Inject("IStoreRepository")
    private readonly storeRepository: IStoreRepository
  ) {}

  async create(createStoreDto: CreateStoreDto): Promise<Store> {
    return this.storeRepository.create(createStoreDto);
  }

  async update(id: string, updateStoreDto: UpdateStoreDto): Promise<Store> {
    const store = await this.storeRepository.findById(id);
    if (!store) throw new NotFoundException("Store not found");
    Object.assign(store, updateStoreDto);
    return this.storeRepository.save(store);
  }

  async delete(id: string): Promise<void> {
    return this.storeRepository.delete(id);
  }

  async approveStore(id: string): Promise<void> {
    return this.storeRepository.updateStatus(id, "active");
  }

  async getStore(id: string): Promise<Store> {
    const store = await this.storeRepository.findById(id);
    if (!store) throw new NotFoundException("Store not found");
    return store;
  }

  async isSlugAvailable(slug: string): Promise<boolean> {
    const store = await this.storeRepository.findBySlug(slug);
    return store === null;
  }
}
