import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { ThrottlerModule } from "@nestjs/throttler";
import * as dotenv from "dotenv";

import { AuthModule } from "./modules/auth/auth.module";
import { StoresModule } from "./modules/stores/stores.module";
import { CustomersModule } from "./modules/customers/customers.module";
import { CustomerStoresModule } from "./modules/customer-stores/customer-stores.module";
import { AdminModule } from "./modules/admin/admin.module";
import { CartsModule } from "./modules/carts/carts.module";
import { ProductsModule } from "./modules/products/products.module";
import { PaymentsModule } from "./modules/payments/payments.module";
import { ShippingModule } from "./modules/shipping/shipping.module";
import { UsersModule } from "./modules/users/users.module";
import { OrdersModule } from "./modules/orders/orders.module";
import { NotificationsModule } from "./modules/notifications/notifications.module";
import { CategoriesModule } from "./modules/categories/categories.module";

import { RedisModule } from "./infrastructure/caching/redis/redis.module";
import { dataSourceOptions } from "./config/data-source";
import { CustomCacheModule } from "./infrastructure/caching/cache.module";
import { DatabaseModule } from "./infrastructure/database/database.module";
import appConfig from "./core/config/app.config";

dotenv.config();

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig],
    }),
    TypeOrmModule.forRoot(dataSourceOptions),
    DatabaseModule,
    RedisModule.forRoot({
      config: {
        host: process.env.REDIS_HOST || "localhost",
        port: parseInt(process.env.REDIS_PORT || "6379"),
      },
    }),
    CustomCacheModule,
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 10,
      },
    ]),
    // وحدات المصادقة والمستخدمين
    AuthModule,
    UsersModule,
    AdminModule,

    // وحدات الأعمال الأساسية
    StoresModule,
    ProductsModule,
    CategoriesModule,

    // وحدات العملاء والطلبات
    CustomersModule,
    CustomerStoresModule,
    CartsModule,
    OrdersModule,

    // وحدات المدفوعات والشحن
    PaymentsModule,
    ShippingModule,

    // وحدات الإشعارات
    NotificationsModule,
  ],
})
export class AppModule {}
