import {
  IsEmail,
  IsString,
  MinLength,
  IsOptional,
  IsEnum,
  Matches,
} from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { UserRole } from "../../../domain/entities/user.entity";

export class RegisterDto {
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
    enum: UserRole,
    default: UserRole.CUSTOMER,
  })
  @IsEnum(UserRole)
  @IsOptional()
  role?: UserRole;

  @ApiProperty({ description: "اسم المتجر (للتجار فقط)", required: false })
  @IsString()
  @IsOptional()
  storeName?: string;

  @ApiProperty({
    description: "رابط المتجر المختصر (للتجار فقط)",
    required: false,
  })
  @IsString()
  @IsOptional()
  @Matches(/^[a-z0-9-]+$/, {
    message: "الرابط المختصر يجب أن يحتوي على أحرف صغيرة وأرقام وشرطات فقط",
  })
  storeSlug?: string;
}
