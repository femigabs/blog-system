import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from '../src/user/user.service';
import { PrismaService } from '../src/prisma/prisma.service';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from '../src/auth/auth.service';
import { HelperService } from '../src/common/utils';

describe('UserService', () => {
  let service: UserService;
  let authService: AuthService;
  let prisma: PrismaService;

  interface UserEntity {
    id?: number;
    firstName: string;
    lastName: string;
    username: string;
    password: string;
    authorId?: number;
};

  let userData: UserEntity = {
    firstName: 'John',
    lastName: 'Doe',
    username: 'testuser3',
    password: "Password7$"
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        JwtModule.register({
          global: true,
          secret: process.env.JWT_SECRET,
          signOptions: { expiresIn: process.env.JWT_EXPIRE },
        })
      ],
      providers: [UserService, AuthService, PrismaService, HelperService],
    }).compile();

    service = module.get<UserService>(UserService);
    prisma = module.get<PrismaService>(PrismaService);
    authService = module.get<AuthService>(AuthService);
  });

  it('should create a new user', async () => {
    const response = await authService.register(userData);
    expect(response.firstName).toBe(userData.firstName);
    expect(response.lastName).toBe(userData.lastName);
    userData.authorId = response.id;
  });

  it('should find all users', async () => {
    const users = await service.findAll();
    expect(users.length).toBeGreaterThan(0);
  });

  it('should find one user by user ID', async () => {
    const userId = 1;
    const user = await service.findOneByUserId(userId);
    expect(user.id).toBe(userId);
  });
});