import { Injectable } from '@nestjs/common';
import { RedisService } from '../../redis/redis.service';

@Injectable()
export class OtpService {
  constructor(private readonly redisService: RedisService) {}

  async generateOtp(phoneNumber: string): Promise<string> {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    await this.storeOtp(phoneNumber, otp);
    return otp;
  }

  async storeOtp(phoneNumber: string, otp: string, expiresInSeconds: number = 300): Promise<void> {
    await this.redisService.set(`otp:${phoneNumber}`, otp);
    await this.redisService.expire(`otp:${phoneNumber}`, expiresInSeconds);
  }

  async verifyOtp(phoneNumber: string, otp: string): Promise<boolean> {
    const storedOtp = await this.redisService.get(`otp:${phoneNumber}`);
    if (storedOtp === otp) {
      await this.removeOtp(phoneNumber);
      return true;
    }
    return false;
  }

  async removeOtp(phoneNumber: string): Promise<void> {
    await this.redisService.del(`otp:${phoneNumber}`);
  }
}
