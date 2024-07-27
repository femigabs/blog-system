import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { HelperService } from '../common/utils';
import { APP_GUARD } from '@nestjs/core';
import { PrismaModule } from '../prisma/prisma.module';
import { JwtAuthGuard } from './jwt-auth.guard';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    UserModule,
    PrismaModule,
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: process.env.JWT_EXPIRE },
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    // {
    //   provide: APP_GUARD,
    //   useClass: JwtAuthGuard,
    // },
    HelperService
  ],
  exports: [AuthService, HelperService],
})

export class AuthModule { }
