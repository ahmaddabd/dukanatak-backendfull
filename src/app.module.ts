import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AuthModule } from "./application/auth/auth.module";
import { StoresModule } from "./application/stores/stores.module";
import { CustomersModule } from "./application/customers/customers.module";
import { CustomerStoresModule } from "./application/customer-stores/customer-stores.module";
import { AdminModule } from "./application/admin/admin.module";
import { RedisModule } from "./redis/redis.module";
import { CartsModule } from "./application/carts/carts.module";
import * as dotenv from "dotenv";

dotenv.config();

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: "postgres",
      url: process.env.DATABASE_URL,
      entities: [__dirname + "/**/*.entity{.ts,.js}"],
      synchronize: false,
    }),
    RedisModule.forRoot({
      config: {
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT || '6379'),
      },
    }),
    AuthModule,
    StoresModule,
    CustomersModule,
    CustomerStoresModule,
    CartsModule,
    AdminModule,
  ],
})
export class AppModule {}
