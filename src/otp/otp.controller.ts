import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { OtpService } from './otp.service';
import { LoginUserDto } from 'src/user/dto/user.dto';
import { SendOtpDto, VerifyOtpDto } from './dto/otp-dto';

@Controller('otp')
export class OtpController {
  constructor(private readonly otpService: OtpService) {}

  @Post('resend')
  @HttpCode(HttpStatus.OK)
  async resend(@Body() sendOtpDto: SendOtpDto) {
    return await this.otpService.resendOtp(sendOtpDto.email);
  }
  @Post('verify')
  @HttpCode(HttpStatus.OK)
  async verify(@Body() verifyOtpDto: VerifyOtpDto) {
    return await this.otpService.verifyOtp(verifyOtpDto);
  }
}
