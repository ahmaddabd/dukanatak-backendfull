import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrdersController } from './controllers/orders.controller';
import { OrdersService } from './services/orders.service';
import { OrderEntity } from './entities/order.entity';
import { OrderItemEntity } from './entities/order-item.entity';
import { Product } from '../domain/entities/product.entity';

@Module({
  imports: [TypeOrmModule.forFeature([OrderEntity, OrderItemEntity, Product])],
  controllers: [OrdersController],
  providers: [OrdersService],
})
export class OrdersModule {}
