import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpException,
    HttpStatus,
  } from '@nestjs/common';
  import { Response } from 'express';
  import { Prisma } from '@prisma/client';
  import {
    UniqueConstraintViolationException,
    ResourceNotFoundException,
    CustomBadRequestException,
  } from './custom.expections';
  
  @Catch()
  export class HttpExceptionFilter implements ExceptionFilter {
    catch(exception: any, host: ArgumentsHost) {
      const ctx = host.switchToHttp();
      const response = ctx.getResponse<Response>();
  
      let status: number;
      let message: string;
  
      if (exception instanceof HttpException) {
        status = exception.getStatus();
        const responseMessage = exception.getResponse();
        message =
          typeof responseMessage === 'string'
            ? responseMessage
            : (responseMessage as any).message;
      } else if (exception instanceof Prisma.PrismaClientKnownRequestError) { // handle prisma errors
        switch (exception.code) {
          case 'P2002':
            const fields = (exception.meta as any)?.target ?? [];
            const fieldMessage = fields.length
              ? `${fields[0]} already exist`
              : 'Resource already exist';
            const uniqueConstraintViolationException = new UniqueConstraintViolationException(fieldMessage);
            status = uniqueConstraintViolationException.getStatus();
            message = uniqueConstraintViolationException.message;
            break;
          case 'P2025':
            const resourceNotFoundException = new ResourceNotFoundException('Resource not found or you are not authorized to perform action');
            status = resourceNotFoundException.getStatus();
            message = resourceNotFoundException.message;
            break;
          default:
            const badRequestException = new CustomBadRequestException();
            status = badRequestException.getStatus();
            message = badRequestException.message;
            break;
        }
      } else {
        status = HttpStatus.INTERNAL_SERVER_ERROR;
        message = 'Internal server error';
      }
  
      response.status(status).json({
        status: 'error',
        data: null,
        message,
      });
    }
  }
  
