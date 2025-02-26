import { DeepPartial } from "typeorm";

export interface IBaseRepository<T> {
  findById(id: string): Promise<T>;
  findOne(conditions: any): Promise<T>;
  findAll(options?: any): Promise<T[]>;
  create(data: DeepPartial<T>): Promise<T>;
  update(id: string, data: DeepPartial<T>): Promise<T>;
  delete(id: string): Promise<void>;
  count(conditions?: any): Promise<number>;
  exists(conditions: any): Promise<boolean>;
  findWithPagination(options: {
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
  }>;
}
