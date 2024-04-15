import { HttpException, HttpStatus } from '@nestjs/common';

export class UserAlreadyExistsException extends HttpException {
  constructor(email: string) {
    super(`User with email ${email} already exists`, HttpStatus.FORBIDDEN);
  }
}

export class userNotFoundException extends HttpException {
  constructor(email: string) {
    super(`User with email ${email} not found`, HttpStatus.BAD_REQUEST);
  }
}

export class wrongEmailOrPasswordException extends HttpException {
  constructor() {
    super(`wrong email or password`, HttpStatus.BAD_REQUEST);
  }
}

export class UserIdNotFoundException extends HttpException {
  constructor() {
    super(`user id not found`, HttpStatus.BAD_REQUEST);
  }
}

export class noAccountFoundForSecurity extends HttpException {
  constructor() {
    super(
      `If your account exists, you will receive an OTP shortly`,
      HttpStatus.OK,
    );
  }
}

export class resetPasswordException extends HttpException {
  constructor() {
    super(`reset password failed `, HttpStatus.BAD_REQUEST);
  }
}

export class refreshTokenOrUserInvalidException extends HttpException {
  constructor() {
    super(`can not generate access token , log in again`, HttpStatus.FORBIDDEN);
  }
}

export class PasswordUnmatchException extends HttpException {
  constructor() {
    super(`incorrect password`, HttpStatus.BAD_REQUEST);
  }
}
