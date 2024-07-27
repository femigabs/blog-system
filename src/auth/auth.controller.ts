import { Controller, Get, Post, Body, UseGuards, Request, HttpException, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from '../auth/auth.service';
import { JoiValidationPipe, ResponseService } from '../common/utils';
import { createUserSchema, loginUserSchema } from '../validations';
import { CreateUserDto, LoginUserDto } from '../dtos';
import { Public } from '../auth/decorators/public.decorator';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private readonly responseService: ResponseService,
  ) { }

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body(new JoiValidationPipe(loginUserSchema)) body: LoginUserDto) {
    try {
      const user = await this.authService.login(body);

      return this.responseService.generateSuccessResponse(
        user,
        'User logged in successfully'
      );
    } catch (error) {
      throw error;
    }
  }

  @Public()
  @Post('register')
  async register(@Body(new JoiValidationPipe(createUserSchema)) body: CreateUserDto) {
    try {
      const user = await this.authService.register(body);

      return this.responseService.generateSuccessResponse(
        user,
        'User created successfully'
      );
    } catch (error) {
      throw error;
    }
  }
}
