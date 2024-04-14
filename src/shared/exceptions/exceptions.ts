import { HttpException, HttpStatus } from '@nestjs/common';

export class unAuthorizedException extends HttpException {
  constructor() {
    super('unauthorized access', HttpStatus.UNAUTHORIZED);
  }
}
export class unAuthenticateException extends HttpException {
  constructor() {
    super('unauthenticated', 401);
  }
}
