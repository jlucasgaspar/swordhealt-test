import { Response } from 'express';
import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const statusCode = exception?.response?.statusCode || 500;
    let message = 'Internal Server Error';

    if (exception?.response?.message) {
      message = exception.response.message;
    } else if (exception?.message) {
      message = exception.message;
    }

    return response.status(statusCode).json({
      message,
      statusCode,
    });
  }
}
