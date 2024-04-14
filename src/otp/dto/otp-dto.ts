import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsString,
  Length,
} from 'class-validator';

export class SendOtpDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;
}
export class GenerateOtpDto extends SendOtpDto {
  @IsNotEmpty()
  @IsNumber()
  id: string;
}

export class VerifyOtpDto extends SendOtpDto {
  @IsNotEmpty()
  @IsString()
  verificationToken: string;

  @IsNotEmpty()
  @Length(4)
  @IsNumber()
  otpCode: number;
}
