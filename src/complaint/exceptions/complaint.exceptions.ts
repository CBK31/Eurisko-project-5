import { HttpException, HttpStatus } from '@nestjs/common';

export class CategoryNotFoundException extends HttpException {
  constructor(categoryId: string) {
    super(`category id : ${categoryId} not found`, HttpStatus.BAD_REQUEST);
  }
}

export class complaintNotFoundException extends HttpException {
  constructor(email: string) {
    super(`complaint id : ${email} not found`, HttpStatus.BAD_REQUEST);
  }
}

export class notStatusSpecifiedException extends HttpException {
  constructor() {
    super(`no status specified in status array`, HttpStatus.BAD_REQUEST);
  }
}
