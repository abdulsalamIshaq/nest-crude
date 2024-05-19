import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { Response } from 'express';
import { ResponseDto } from '../dto/response.dto';

@Catch(HttpException)
export class HttpExceptionFilter
  extends BaseExceptionFilter
  implements ExceptionFilter
{
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const statusCode = exception.getStatus();
    const exceptionResponse = exception.getResponse();

    const errorResponse: ResponseDto = {
      success: false,
      code: statusCode,
      message: (exceptionResponse as any).message || exceptionResponse,
    };

    if (statusCode == HttpStatus.BAD_REQUEST) {
      errorResponse.errors =
        typeof exceptionResponse.message == 'string'
          ? [exceptionResponse.message]
          : exceptionResponse.message;

      errorResponse.message = exceptionResponse.error;
    }
    return response.status(statusCode).json(errorResponse);
  }
}
