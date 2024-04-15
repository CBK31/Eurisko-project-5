import { HttpException, HttpStatus } from '@nestjs/common';

// export class CUSTOM_UserNotFoundException extends HttpException {
//   constructor(userName: string) {
//     super(`User with ID ${userName} not found`, HttpStatus.NOT_FOUND);
//   }
// }

export class UserAlreadyExistsException extends HttpException {
  constructor(email: string) {
    super(`User with email ${email} already exists`, HttpStatus.FORBIDDEN);
  }
}

// export class unAuthorizedException extends HttpException {
//   constructor() {
//     super('unauthorized access', HttpStatus.UNAUTHORIZED);
//   }
// }
// export class unAuthenticateException extends HttpException {
//   constructor() {
//     super('unauthenticated', 401);
//   }
// }

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
export class noAccountFoundForSecurity extends HttpException {
  constructor() {
    super(
      `If your account exists, you will receive an OTP shortly`,
      HttpStatus.OK,
    );
  }
}
