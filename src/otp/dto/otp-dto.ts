import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsString,
  Length,
  Max,
  Min,
  MinLength,
} from 'class-validator';

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
  // @Min(999) I'm unsure if detailing that much (min and max) exposes a vulnerability.
  // @Max(10000)
  otpCode: number;
}
