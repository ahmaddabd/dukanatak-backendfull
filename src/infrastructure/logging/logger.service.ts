import {
  Injectable,
  Logger,
  LoggerService as NestLoggerService,
} from "@nestjs/common";

@Injectable()
export class LoggerService implements NestLoggerService {
  private readonly logger = new Logger();

  log(message: string, context?: string) {
    this.logger.log(message, context);
  }

  error(message: string, trace?: string, context?: string) {
    this.logger.error(message, trace, context);
  }

  warn(message: string, context?: string) {
    this.logger.warn(message, context);
  }

  debug(message: string, context?: string) {
    this.logger.debug(message, context);
  }

  verbose(message: string, context?: string) {
    this.logger.verbose(message, context);
  }

  // تسجيل أحداث العمل
  logBusinessEvent(event: string, data: any, context?: string) {
    this.logger.log(
      `Business Event: ${event} - Data: ${JSON.stringify(data)}`,
      context
    );
  }

  // تسجيل أحداث الأمان
  logSecurityEvent(event: string, data: any, context?: string) {
    this.logger.warn(
      `Security Event: ${event} - Data: ${JSON.stringify(data)}`,
      context
    );
  }

  // تسجيل أداء النظام
  logPerformance(operation: string, duration: number, context?: string) {
    this.logger.debug(`Performance: ${operation} took ${duration}ms`, context);
  }
}
