import { IsEmail, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class LoginDto {
  @ApiProperty({ description: "البريد الإلكتروني" })
  @IsEmail()
  email: string;

  @ApiProperty({ description: "كلمة المرور" })
  @IsString()
  password: string;
}

export class LoginResponseDto {
  @ApiProperty({ description: "رمز الوصول" })
  accessToken: string;

  @ApiProperty({ description: "رمز التحديث" })
  refreshToken: string;

  @ApiProperty({ description: "معلومات المستخدم" })
  user: {
    id: number;
    name: string;
    email: string;
    role: string;
    status: string;
  };
}
