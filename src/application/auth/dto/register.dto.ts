
import { IsEmail, IsNotEmpty, MinLength, IsIn } from 'class-validator';

export class RegisterDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @IsIn(['merchant', 'customer'])
  @IsNotEmpty()
  role: 'merchant' | 'customer';
}
