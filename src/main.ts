import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ValidationPipe } from "@nestjs/common";
import { GlobalExceptionFilter } from "./shared/filters/global-exception.filter";
import { RateLimitMiddleware } from "./shared/middleware/rate-limit.middleware";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
import { LoggerService } from "./infrastructure/logging/logger.service";
import helmet from "helmet";
import compression from "compression";
import * as dotenv from "dotenv";
import { HttpExceptionFilter } from "./shared/filters/http-exception.filter";
import { ValidationFilter } from "./shared/filters/validation.filter";
import { TransformInterceptor } from "./shared/interceptors/transform.interceptor";

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: new LoggerService(),
    cors: {
      origin: process.env.ALLOWED_ORIGINS?.split(",") || "*",
      methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
      credentials: true,
    },
  });

  // إضافة middleware للأمان
  app.use(helmet());
  app.use(compression());

  // إضافة الفلاتر العامة
  app.useGlobalFilters(new HttpExceptionFilter(), new ValidationFilter());

  // إضافة interceptors
  app.useGlobalInterceptors(new TransformInterceptor());

  // تكوين التحقق من الصحة
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    })
  );

  // إعداد Swagger
  const config = new DocumentBuilder()
    .setTitle("Dukanatak API")
    .setDescription("توثيق واجهة برمجة التطبيقات لمنصة دكانتك")
    .setVersion("1.0")
    .addBearerAuth()
    .addTag("المصادقة", "عمليات المصادقة وإدارة المستخدمين")
    .addTag("المتاجر", "إدارة المتاجر والمنتجات")
    .addTag("الطلبات", "إدارة الطلبات والشحن")
    .addTag("المدفوعات", "معالجة المدفوعات")
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api", app, document);

  // إعداد معالجة الأخطاء العامة
  app.useGlobalFilters(new GlobalExceptionFilter());

  // تطبيق محدد معدل الطلبات
  app.use(new RateLimitMiddleware().use);

  const port = process.env.PORT || 3000;
  await app.listen(port);

  const logger = new LoggerService();
  logger.log(`التطبيق يعمل على: http://localhost:${port}`);
  logger.log(`توثيق Swagger متاح على: http://localhost:${port}/api`);
}

bootstrap();
