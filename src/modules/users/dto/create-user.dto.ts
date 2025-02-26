import { ApiProperty } from "@nestjs/swagger";
import {
  IsString,
  IsEmail,
  MinLength,
  IsOptional,
  IsEnum,
  Matches,
  IsBoolean,
} from "class-validator";
import { ROLES } from "../../../core/constants/common.constants";

export class CreateUserDto {
  @ApiProperty({ description: "اسم المستخدم" })
  @IsString()
  @MinLength(3)
  name: string;

  @ApiProperty({ description: "البريد الإلكتروني" })
  @IsEmail()
  email: string;

  @ApiProperty({ description: "كلمة المرور" })
  @IsString()
  @MinLength(8)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message:
      "كلمة المرور ضعيفة - يجب أن تحتوي على حروف كبيرة وصغيرة وأرقام ورموز",
  })
  password: string;

  @ApiProperty({ description: "رقم الهاتف", required: false })
  @IsString()
  @IsOptional()
  phone?: string;

  @ApiProperty({
    description: "نوع المستخدم",
    enum: ROLES,
    default: ROLES.CUSTOMER,
  })
  @IsEnum(ROLES)
  @IsOptional()
  role?: keyof typeof ROLES;

  @ApiProperty({ description: "الصورة الشخصية", required: false })
  @IsString()
  @IsOptional()
  avatar?: string;

  @ApiProperty({ description: "تفعيل البريد الإلكتروني", default: false })
  @IsBoolean()
  @IsOptional()
  emailVerified?: boolean;

  @ApiProperty({ description: "تفعيل رقم الهاتف", default: false })
  @IsBoolean()
  @IsOptional()
  phoneVerified?: boolean;

  @ApiProperty({ description: "إعدادات المستخدم", required: false })
  @IsOptional()
  settings?: {
    notifications: boolean;
    language: string;
    theme: string;
  };
}
