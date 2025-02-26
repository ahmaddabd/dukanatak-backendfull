import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from "@nestjs/common";
import { Request, Response } from "express";

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const message =
      exception instanceof HttpException
        ? exception.message
        : "Internal server error";

    const errorResponse = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      message: message,
      ...(process.env.NODE_ENV === "development" && {
        stack: exception instanceof Error ? exception.stack : undefined,
      }),
    };

    // تسجيل الخطأ مع معلومات إضافية
    this.logger.error(
      `[${request.method}] ${request.url} - Status: ${status} - ${message}`,
      exception instanceof Error ? exception.stack : undefined,
      HttpExceptionFilter.name
    );

    response.status(status).json(errorResponse);
  }
}
