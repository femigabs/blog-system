import { Injectable } from '@nestjs/common';

@Injectable()
export class ResponseService {
  generateSuccessResponse(data: any, message: string) {
    return {
      status: 'success',
      message,
      data,
    };
  }

  generateErrorResponse(message: string) {
    return {
      status: 'error',
      message,
      data: null,
    };
  }
}
