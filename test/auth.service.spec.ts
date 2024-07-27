import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../src/auth/auth.service';
import { PrismaService } from '../src/prisma/prisma.service';
import { JwtModule } from '@nestjs/jwt';
import { HelperService } from '../src/common/utils';
import { LoginUserEntity } from '../src/entities';

describe('AuthService', () => {
  let service: AuthService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        JwtModule.register({
          global: true,
          secret: process.env.JWT_SECRET,
          signOptions: { expiresIn: process.env.JWT_EXPIRE },
        })
      ],
      providers: [AuthService, PrismaService, HelperService],
    }).compile();

    service = module.get<AuthService>(AuthService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should create a new user', async () => {
    const userData = {
      firstName: 'John',
      lastName: 'Doe',
      username: 'testuser1',
      password: "Password7$"
    };

    const response = await service.register(userData);
    expect(response.firstName).toBe(userData.firstName);
    expect(response.lastName).toBe(userData.lastName);
  });

  it('should throw error if username already exist', async () => {
    const userData = {
      firstName: 'John',
      lastName: 'Doe',
      username: 'testuser1',
      password: "Password7$"
    };
    try {
      const response = await service.register(userData);
    } catch (error) {
      expect(error.code).toContain('P2002');
    }
  });

  it('should create login successfully', async () => {
    const userData = {
      username: 'testuser1',
      password: "Password7$"
    };

    try {
      const response = await service.login(userData);
      expect(response.username).toBe(userData.username);
    } catch (error) {

    }
  });

  it('should throw error if username does not exist', async () => {
    const userData = {
      username: 'testuser10',
      password: "Password7$"
    };

    try {
      const response = await service.login(userData);
    } catch (error) {
      expect(error.message).toContain('Invalid login credentials');
    }
  });

  it('should throw error if password is invalid', async () => {
    const userData = {
      username: 'testuser1',
      password: "Password780$"
    };

    try {
      const response = await service.login(userData);
    } catch (error) {
      expect(error.message).toContain('Invalid login credentials');
    }
  });
});