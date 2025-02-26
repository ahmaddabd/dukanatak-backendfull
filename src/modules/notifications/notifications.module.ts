import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule } from "@nestjs/config";
import { Notification } from "../../domain/entities/notification.entity";
import { NotificationsService } from "./notifications.service";
import { NotificationService } from "./services/notification.service";
import { IntegrationModule } from "../../infrastructure/integration/integration.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([Notification]),
    ConfigModule,
    IntegrationModule,
  ],
  providers: [NotificationsService, NotificationService],
  exports: [NotificationsService],
})
export class NotificationsModule {}
