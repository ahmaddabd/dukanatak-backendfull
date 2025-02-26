import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '../../domain/entities/product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Store } from '../../domain/entities/store.entity';
import { Category } from '../../domain/entities/category.entity';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(Store)
    private readonly storeRepository: Repository<Store>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  async create(dto: CreateProductDto): Promise<Product> {
    const store = await this.storeRepository.findOne({ where: { id: dto.storeId } });
    if (!store) throw new NotFoundException('Store not found');

    const category = await this.categoryRepository.findOne({ where: { id: dto.categoryId } });
    if (!category) throw new NotFoundException('Category not found');

    const product = this.productRepository.create({ ...dto, store, category });
    return this.productRepository.save(product);
  }
  
  async update(id: string, dto: UpdateProductDto): Promise<Product> {
    const product = await this.productRepository.findOne({ where: { id } });
    if (!product) throw new NotFoundException('Product not found');

    Object.assign(product, dto);
    return this.productRepository.save(product);
  }

  async getProductById(productId: string): Promise<Product | null> {
    return this.productRepository.findOne({ 
      where: { id: productId }, 
      relations: ['store', 'category'] 
    });
  }

  async getProductsByStore(storeId: string): Promise<Product[]> {
    return this.productRepository.find({ 
      where: { store: { id: storeId } },
      relations: ['store', 'category']
    });
  }

  async deleteProduct(productId: string): Promise<void> {
    await this.productRepository.delete(productId);
  }
}
