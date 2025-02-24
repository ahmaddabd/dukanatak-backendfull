
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from '../../domain/entities/product.entity';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { Store } from '../../domain/entities/store.entity';
import { Category } from '../../domain/entities/category.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Product, Store, Category])],
  controllers: [ProductController],
  providers: [ProductService],
})
export class ProductsModule {}
