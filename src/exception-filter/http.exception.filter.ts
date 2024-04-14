import {
  HttpException,
  ArgumentsHost,
  Logger,
  Catch,
  ExceptionFilter,
} from '@nestjs/common';
import { Request, Response } from 'express';
@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  Logger = new Logger();

  constructor() {}
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();
    this.Logger.error(
      `${request.method} ${request.originalUrl} ${status} error : ${exception.message}`,
    );
    const errorDetails = exception.getResponse();
    response.status(status).json({ error: true, errorDetails });
  }
}
