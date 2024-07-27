import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthService } from '../auth/auth.service';
import { HelperService, ResponseService } from '../common/utils';

@Module({
  imports: [PrismaModule],
  providers: [AuthService, UserService, ResponseService, HelperService],
  exports: [AuthService, UserService, ResponseService, HelperService],
})
export class UserModule {}
