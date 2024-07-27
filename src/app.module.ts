import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { PostModule } from './post/post.module';
import { HttpExceptionFilter, ResponseService } from './common/utils';
import { UserController } from './user/user.controller';
import { PostController } from './post/post.controller';
import { UserService } from './user/user.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule, 
    AuthModule, 
    UserModule, 
    PostModule
  ],
  controllers: [AppController, UserController, PostController],
  providers: [AppService, ResponseService, UserService, {
    provide: APP_FILTER,
    useClass: HttpExceptionFilter,
  }],
})
export class AppModule { }
