import { DynamicModule, Module } from "@nestjs/common";
import { RedisService } from "./redis.service";
import * as dotenv from "dotenv";

dotenv.config();

export interface RedisModuleOptions {
  config: {
    host: string;
    port: number;
  };
}

@Module({
  providers: [
    {
      provide: "REDIS_OPTIONS",
      useValue: {
        config: {
          host: process.env.REDIS_HOST || "localhost",
          port: parseInt(process.env.REDIS_PORT || "6379"),
        },
      },
    },
    RedisService,
  ],
  exports: [RedisService],
})
export class RedisModule {
  static forRoot(options?: RedisModuleOptions): DynamicModule {
    return {
      module: RedisModule,
      global: true,
      providers: [
        {
          provide: "REDIS_OPTIONS",
          useValue: options || {
            config: {
              host: process.env.REDIS_HOST || "localhost",
              port: parseInt(process.env.REDIS_PORT || "6379"),
            },
          },
        },
        RedisService,
      ],
      exports: [RedisService],
    };
  }
}
