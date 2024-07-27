import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) { }

  async findAll() {
    return this.prisma.user.findMany({
      select: {
        id: true,
        firstName: true,
        lastName: true
      },
    
    });
  }

  async findOneByUserId(userId: number) {
    return this.prisma.user.findUnique({ 
      where: { id: userId }, 
      select: {
        id: true,
        username: true,
        firstName: true,
        lastName: true
      } 
    });
  }
}
