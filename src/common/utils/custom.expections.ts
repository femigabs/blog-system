// src/exceptions/custom-exceptions.ts
import { HttpException, HttpStatus } from '@nestjs/common';

export class CustomHttpException extends HttpException {
  constructor(message: string, statusCode: HttpStatus) {
    super(message, statusCode);
  }
}

export class UniqueConstraintViolationException extends CustomHttpException {
  constructor(message: string) {
    super(message, HttpStatus.CONFLICT);
  }
}

export class ResourceNotFoundException extends CustomHttpException {
  constructor(message: string = 'Resource not found') {
    super(message, HttpStatus.NOT_FOUND);
  }
}

export class CustomBadRequestException extends CustomHttpException {
  constructor(message: string = 'Error processing request') {
    super(message, HttpStatus.BAD_REQUEST);
  }
}
