import { Module } from "@nestjs/common";
import { EmailService } from "./services/email.service";
import { SmsService } from "./services/sms.service";
import { NotificationService } from "./services/notification.service";

@Module({
  providers: [EmailService, SmsService, NotificationService],
  exports: [EmailService, SmsService, NotificationService],
})
export class MessagingModule {}
