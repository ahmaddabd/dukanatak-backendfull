import { Repository, DeepPartial, FindOptionsWhere } from "typeorm";
import { NotFoundException } from "@nestjs/common";
import { IBaseRepository } from "../../domain/repositories/base.repository.interface";

export abstract class BaseRepository<T> implements IBaseRepository<T> {
  constructor(private readonly repository: Repository<T>) {}

  async findById(id: string): Promise<T> {
    const entity = await this.repository.findOne({
      where: { id } as FindOptionsWhere<T>,
    });
    if (!entity) {
      throw new NotFoundException(`الكيان برقم ${id} غير موجود`);
    }
    return entity;
  }

  async findOne(conditions: any): Promise<T> {
    const entity = await this.repository.findOne({ where: conditions });
    if (!entity) {
      throw new NotFoundException(`الكيان غير موجود`);
    }
    return entity;
  }

  async findAll(options?: any): Promise<T[]> {
    return this.repository.find(options);
  }

  async create(data: DeepPartial<T>): Promise<T> {
    const entity = this.repository.create(data);
    return this.repository.save(entity as DeepPartial<T>);
  }

  async update(id: string, data: DeepPartial<T>): Promise<T> {
    const entity = await this.findById(id);
    Object.assign(entity, data);
    return this.repository.save(entity as DeepPartial<T>);
  }

  async delete(id: string): Promise<void> {
    const entity = await this.findById(id);
    await this.repository.remove(entity);
  }

  async count(conditions?: any): Promise<number> {
    return this.repository.count({ where: conditions });
  }

  async exists(conditions: any): Promise<boolean> {
    const count = await this.count(conditions);
    return count > 0;
  }

  async findWithPagination(options: {
    page?: number;
    limit?: number;
    conditions?: any;
    order?: any;
    relations?: string[];
  }): Promise<{
    items: T[];
    total: number;
    page: number;
    pageCount: number;
  }> {
    const page = options.page || 1;
    const limit = options.limit || 10;
    const skip = (page - 1) * limit;

    const [items, total] = await this.repository.findAndCount({
      where: options.conditions,
      order: options.order,
      relations: options.relations,
      skip,
      take: limit,
    });

    return {
      items,
      total,
      page,
      pageCount: Math.ceil(total / limit),
    };
  }

  protected getRepository(): Repository<T> {
    return this.repository;
  }
}
