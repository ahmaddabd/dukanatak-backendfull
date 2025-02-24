
import { IsNotEmpty, IsPhoneNumber } from 'class-validator';

export class RequestOtpDto {
  @IsPhoneNumber()
  @IsNotEmpty()
  phoneNumber: string;
}
