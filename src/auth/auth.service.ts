import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto, LoginUserDto } from '../dtos';
import { HelperService } from '../common/utils';
import { LoginUserEntity, UserEntity } from 'src/entities';

@Injectable()
export class AuthService {
    constructor(
        private prisma: PrismaService,
        private helperService: HelperService
    ) { }

    async validateUser(username: string, pass: string): Promise<UserEntity> {
        const user = await this.prisma.user.findUnique({ where: { username } });
        if (!user) {
            throw new UnauthorizedException('Invalid login credentials');
        };

        const isValid = await this.helperService.comparePassword(pass, user.password);
        if (!isValid) {
            throw new UnauthorizedException('Invalid login credentials');
        };

        const { password, salt, deletedAt, ...result } = user;
        return result;
    }

    async login(body: LoginUserDto): Promise<LoginUserEntity> {
        const user = await this.validateUser(body.username, body.password);
        const payload = { username: user.username, userId: user.id };

        const token = await this.helperService.generateToken(payload);

        return {
            ...user,
            token
        };
    }

    async register(payload: CreateUserDto): Promise<UserEntity> {
        const { password: plainPassword, username, firstName, lastName } = payload;
        const data = await this.helperService.hashPassword(plainPassword);

        const user = await this.prisma.user.create({
            data: {
                username,
                password: data.hash,
                salt: data.salt,
                firstName,
                lastName
            },
        });

        const { password, salt, deletedAt, ...newUser } = user;

        return newUser;
    }
}
