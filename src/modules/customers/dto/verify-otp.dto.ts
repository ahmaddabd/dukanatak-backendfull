
import { IsNotEmpty, IsPhoneNumber, Length } from 'class-validator';

export class VerifyOtpDto {
  @IsPhoneNumber()
  @IsNotEmpty()
  phoneNumber: string;

  @Length(4, 6)
  @IsNotEmpty()
  otpCode: string;
}
