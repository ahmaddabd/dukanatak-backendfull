import {
  Controller,
  Post,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
} from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse } from "@nestjs/swagger";
import { Throttle, ThrottlerGuard } from "@nestjs/throttler";
import { AuthService } from "./auth.service";
import { RegisterDto } from "./dto/register.dto";
import { LoginDto, LoginResponseDto } from "./dto/login.dto";

@ApiTags("المصادقة")
@Controller("auth")
@UseGuards(ThrottlerGuard)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("register")
  @Throttle({ default: { ttl: 60000, limit: 5 } })
  @ApiOperation({ summary: "تسجيل مستخدم جديد" })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: "تم تسجيل المستخدم بنجاح",
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: "بيانات غير صالحة",
  })
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post("login")
  @HttpCode(HttpStatus.OK)
  @Throttle({ default: { ttl: 60000, limit: 5 } })
  @ApiOperation({ summary: "تسجيل الدخول" })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "تم تسجيل الدخول بنجاح",
    type: LoginResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: "بيانات الاعتماد غير صالحة",
  })
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Post("refresh")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "تحديث رمز الوصول" })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "تم تحديث رمز الوصول بنجاح",
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: "رمز التحديث غير صالح",
  })
  async refresh(@Body("refresh_token") refreshToken: string) {
    return this.authService.refreshToken(refreshToken);
  }
}
