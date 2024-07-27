import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { IS_PUBLIC_KEY } from './decorators/public.decorator';
import { UserService } from '../user/user.service';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private reflector: Reflector,
    private userService: UserService
  ) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);

    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET,
      });

      const user = await this.userService.findOneByUserId(payload.userId);

      if (!user) throw new UnauthorizedException('Invalid User');

      // 💡 We're assigning the user to the request object here
      // so that we can access it in our route handlers
      request['user'] = user;

    } catch (error) {
      let message = 'Invalid Authorization Token';
      if (error?.name === 'TokenExpiredError') message = 'Your session has expired, please login again'
      throw new UnauthorizedException(message);
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const auth_token = request.headers.authorization;
    if (!auth_token) throw new UnauthorizedException('Authorization token is required');

    const [type, token] = auth_token?.split(' ') ?? [];
    if (type !== 'Bearer') throw new UnauthorizedException('Format is Authorization Bearer [token]');

    return token;
  }
}