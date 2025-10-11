import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status: number;
    let message: string | object;
    let errorCode: string | undefined;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();
      
      if (typeof exceptionResponse === 'string') {
        message = exceptionResponse;
      } else if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
        const responseObj = exceptionResponse as any;
        message = responseObj.message || responseObj.error || 'An error occurred';
        errorCode = responseObj.errorCode;
      } else {
        message = 'An error occurred';
      }
    } else {
      status = HttpStatus.INTERNAL_SERVER_ERROR;
      message = 'Internal server error';
      
      // Log unexpected errors with stack trace
      this.logger.error(
        `Unexpected error: ${exception instanceof Error ? exception.message : 'Unknown error'}`,
        exception instanceof Error ? exception.stack : exception
      );
    }

    // Log HTTP errors for monitoring (except 4xx client errors)
    if (status >= 500) {
      this.logger.error(
        `HTTP ${status} Error: ${JSON.stringify(message)} - ${request.method} ${request.url}`,
        exception instanceof Error ? exception.stack : undefined
      );
    } else if (status >= 400 && status < 500) {
      this.logger.warn(
        `HTTP ${status} Error: ${JSON.stringify(message)} - ${request.method} ${request.url}`
      );
    }

    const errorResponse = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      message,
      ...(errorCode && { errorCode }),
      // Only include stack trace in development
      ...(process.env.NODE_ENV === 'development' && exception instanceof Error && {
        stack: exception.stack
      }),
    };

    response.status(status).json(errorResponse);
  }
}
