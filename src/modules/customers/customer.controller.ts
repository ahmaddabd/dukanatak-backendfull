
import { Controller, Post, Body, ValidationPipe, UsePipes } from '@nestjs/common';
import { CustomerService } from './customer.service';
import { RequestOtpDto } from './dto/request-otp.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('customers')
@Controller('customers')
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @Post('request-otp')
  @ApiOperation({ summary: 'Request OTP for login/registration' })
  @ApiResponse({ status: 200, description: 'OTP sent successfully.' })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  @UsePipes(new ValidationPipe())
  requestOtp(@Body() requestOtpDto: RequestOtpDto) {
    return this.customerService.requestOtp(requestOtpDto.phoneNumber);
  }

  @Post('verify-otp')
  @ApiOperation({ summary: 'Verify OTP and login/register' })
  @ApiResponse({ status: 200, description: 'OTP verified successfully. Returns JWT.' })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  @UsePipes(new ValidationPipe())
  verifyOtp(@Body() verifyOtpDto: VerifyOtpDto) {
    return this.customerService.verifyOtp(verifyOtpDto.phoneNumber, verifyOtpDto.otpCode);
  }
}
