import { HttpException, HttpStatus } from '@nestjs/common';

export class CategoryNotFoundException extends HttpException {
  constructor(id: string) {
    super(`Category with ID "${id}" not found`, HttpStatus.FORBIDDEN);
  }
}
