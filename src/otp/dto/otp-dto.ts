import { IsEmail, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class SendOtpDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;
}

export class VerifyOtpDto extends SendOtpDto {
  @IsNotEmpty()
  @IsString()
  verificationToken: string;

  @IsNotEmpty()
  @IsNumber()
  otpCode: number;
}
