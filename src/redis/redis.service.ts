import { Injectable, OnModuleInit, OnModuleDestroy, Inject } from "@nestjs/common";
import { createClient, RedisClientType } from "redis";
import { RedisModuleOptions } from "./redis.module";

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private client: RedisClientType;

  constructor(@Inject('REDIS_OPTIONS') private options: RedisModuleOptions) {}

  async onModuleInit() {
    const { host, port } = this.options.config;
    this.client = createClient({
      url: `redis://${host}:${port}`,
    });
    await this.client.connect();
  }

  async onModuleDestroy() {
    await this.client.disconnect();
  }

  async set(key: string, value: string) {
    await this.client.set(key, value);
  }

  async get(key: string): Promise<string | null> {
    return this.client.get(key);
  }

  async del(key: string) {
    await this.client.del(key);
  }

  async expire(key: string, seconds: number) {
    await this.client.expire(key, seconds);
  }
}
