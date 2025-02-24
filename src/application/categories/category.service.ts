
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from '../../domain/entities/category.entity';
import { CreateCategoryDto } from './dto/create-category.dto';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
  ) {}

  async createCategory(dto: CreateCategoryDto, storeId: string): Promise<Category> {
    const category = this.categoryRepository.create({ ...dto, store: { id: storeId } });
    return this.categoryRepository.save(category);
  }

  async getCategoriesByStore(storeId: string): Promise<Category[]> {
    return this.categoryRepository.find({ where: { store: { id: storeId } } });
  }
}
