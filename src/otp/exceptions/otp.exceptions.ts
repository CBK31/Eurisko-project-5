import { HttpException, HttpStatus } from '@nestjs/common';

export class otpAlreadyExistAndValidException extends HttpException {
  constructor() {
    super(
      `otp already exist and valid , cannot forget password , resend your valid OTP`,
      HttpStatus.FORBIDDEN,
    );
  }
}

export class InvalidOtpException extends HttpException {
  constructor() {
    super(`OTP verification failed`, HttpStatus.FORBIDDEN);
  }
}
