import { Controller, Get, Post, Body, UseGuards, Request, HttpCode, HttpStatus } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ResponseService } from '../common/utils';

@Controller('user')
export class UserController {
  constructor(
    private readonly responseService: ResponseService,
  ) { }

  @HttpCode(HttpStatus.OK)
  @Get('profile')
  @UseGuards(JwtAuthGuard)
  getProfile(@Request() req) {
    return this.responseService.generateSuccessResponse(
      req.user,
      'User profile fetched successfully'
    );
  }
}
