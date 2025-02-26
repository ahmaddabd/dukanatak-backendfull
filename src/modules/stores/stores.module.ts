import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Store } from "../../domain/entities/store.entity";
import { StoreRepository } from "../../infrastructure/repositories/store.repository";
import { StoreService } from "./store.service";
import { StoreController } from "./store.controller";
import { IStoreRepository } from "../../domain/repositories/store.repository.interface";

@Module({
  imports: [TypeOrmModule.forFeature([Store])],
  controllers: [StoreController],
  providers: [
    StoreService,
    {
      provide: "IStoreRepository",
      useClass: StoreRepository,
    },
  ],
  exports: [StoreService],
})
export class StoresModule {}
