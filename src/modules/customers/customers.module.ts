import { OtpService } from './otp.service';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Customer } from '../../domain/entities/customer.entity';
import { CustomerRepository } from '../../infrastructure/repositories/customer.repository';
import { CustomerService } from './customer.service';
import { CustomerController } from './customer.controller';
import { JwtModule } from '@nestjs/jwt';
import { RedisModule } from '../../redis/redis.module';
import * as dotenv from 'dotenv';

dotenv.config();

@Module({
  imports: [
    TypeOrmModule.forFeature([Customer]),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1d' },
    }),
    RedisModule,
  ],
  controllers: [CustomerController],
  providers: [CustomerService, CustomerRepository, OtpService],
  exports: [CustomerService],
})
export class CustomersModule {}
