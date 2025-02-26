
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cart } from '../../domain/entities/cart.entity';
import { CartItem } from '../../domain/entities/cart-item.entity';
import { Product } from '../../domain/entities/product.entity';
import { Customer } from '../../domain/entities/customer.entity';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Cart, CartItem, Product, Customer])],
  controllers: [CartController],
  providers: [CartService],
})
export class CartsModule {}
