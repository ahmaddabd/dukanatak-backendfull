
import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { CustomerRepository } from '../../infrastructure/repositories/customer.repository';
import { JwtService } from '@nestjs/jwt';
import { OtpService } from './otp.service';
import { Twilio } from 'twilio';

@Injectable()
export class CustomerService {
  constructor(
    private readonly customerRepository: CustomerRepository,
    private readonly jwtService: JwtService,
    private readonly otpService: OtpService,
  ) {}

  async sendOtpSMS(phoneNumber: string, otpCode: string): Promise<void> {
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const fromNumber = process.env.TWILIO_PHONE_NUMBER;

    const client = new Twilio(accountSid, authToken);

    await client.messages.create({
      body: `Your verification code for Dukanatak is ${otpCode}`,
      from: fromNumber,
      to: phoneNumber,
    });
  }

  async requestOtp(phoneNumber: string) {
    const otpCode = await this.otpService.generateOtp(phoneNumber);
    await this.sendOtpSMS(phoneNumber, otpCode);
    return { message: 'OTP sent successfully' };
  }

  async verifyOtp(phoneNumber: string, otpCode: string) {
    const customer = await this.customerRepository.findByPhoneNumber(phoneNumber);
    if (!customer) throw new NotFoundException('Customer not found');

    const isValid = await this.otpService.verifyOtp(phoneNumber, otpCode);
    if (!isValid) throw new BadRequestException('Invalid or expired OTP');

    const payload = { sub: customer.id, phone: customer.phoneNumber };
    const access_token = this.jwtService.sign(payload);
    return { access_token };
  }
}
