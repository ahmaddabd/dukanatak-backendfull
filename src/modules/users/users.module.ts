import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "../../core/domain/entities/user.entity";
import { UsersService } from "./services/users.service";
import { UsersController } from "./controllers/users.controller";
import { CustomCacheModule } from "../../infrastructure/caching/cache.module";
import { UsersRepository } from "./repositories/users.repository";

@Module({
  imports: [TypeOrmModule.forFeature([User]), CustomCacheModule],
  controllers: [UsersController],
  providers: [UsersService, UsersRepository],
  exports: [UsersService],
})
export class UsersModule {}
