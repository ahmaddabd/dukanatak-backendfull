import { DynamicModule, Module } from '@nestjs/common';
import { RedisService } from './redis.service';

export interface RedisModuleOptions {
  config: {
    host: string;
    port: number;
  };
}

@Module({})
export class RedisModule {
  static forRoot(options: RedisModuleOptions): DynamicModule {
    return {
      module: RedisModule,
      providers: [
        {
          provide: 'REDIS_OPTIONS',
          useValue: options,
        },
        RedisService,
      ],
      exports: [RedisService],
    };
  }
}
