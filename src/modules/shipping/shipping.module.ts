import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Shipping } from "../../domain/entities/shipping.entity";
import { Order } from "../../domain/entities/order.entity";
import { Store } from "../../domain/entities/store.entity";
import { ShippingController } from "./shipping.controller";
import { ShippingService } from "./shipping.service";
import { CreateShippingHandler } from "./commands/handlers/create-shipping.handler";
import { GetShippingDetailsHandler } from "./queries/handlers/get-shipping-details.handler";

const CommandHandlers = [CreateShippingHandler];
const QueryHandlers = [GetShippingDetailsHandler];

@Module({
  imports: [TypeOrmModule.forFeature([Shipping, Order, Store])],
  controllers: [ShippingController],
  providers: [ShippingService, ...CommandHandlers, ...QueryHandlers],
  exports: [ShippingService],
})
export class ShippingModule {}
