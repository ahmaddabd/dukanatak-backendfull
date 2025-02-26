import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Order } from "../../core/domain/entities/order.entity";
import { User } from "../../core/domain/entities/user.entity";
import { Store } from "../../core/domain/entities/store.entity";
import { OrdersService } from "./services/orders.service";
import { OrdersController } from "./controllers/orders.controller";
import { EventBusModule } from "../../infrastructure/events/event-bus.module";
import { CacheModule } from "../../infrastructure/cache/cache.module";
import { LoggerModule } from "../../infrastructure/logging/logger.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([Order, User, Store]),
    EventBusModule,
    CacheModule,
    LoggerModule,
  ],
  controllers: [OrdersController],
  providers: [OrdersService],
  exports: [OrdersService],
})
export class OrdersModule {}
