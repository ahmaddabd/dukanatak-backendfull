import { Module, Global } from "@nestjs/common";
import { EventBus } from "../events/event.bus";
import { LoggerService } from "../logging/logger.service";
import { CacheService } from "../../shared/services/cache.service";
import { EmailService } from "../messaging/services/email.service";

@Global()
@Module({
  providers: [EventBus, LoggerService, CacheService, EmailService],
  exports: [EventBus, LoggerService, CacheService, EmailService],
})
export class IntegrationModule {}
