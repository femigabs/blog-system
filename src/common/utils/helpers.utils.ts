import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { PasswordEntity, TokenEntity } from '../../entities';

@Injectable()
export class HelperService {
    constructor(
        private jwtService: JwtService
    ) { }
    async hashPassword(password: string): Promise<PasswordEntity> {
        const saltRounds = 10;
        const salt = bcrypt.genSaltSync(saltRounds);

        const hash = bcrypt.hashSync(password, salt);
        return { hash, salt };
    };

    async comparePassword(password: string, hashedPassword: string): Promise<boolean> {
        const validPassword = bcrypt.compareSync(password, hashedPassword);
        if (validPassword) {
            return true;
        }
        return false;
    };

    async generateToken(payload: TokenEntity): Promise<string> {
        return this.jwtService.signAsync(payload);
    };
}
