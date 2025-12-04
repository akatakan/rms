import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Users } from 'src/generated/prisma/client';
import { UsersService } from 'src/users/users.service';
import { compare} from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
    ) {}

    async validateUser(username: string, password: string): Promise<any> {
        const user = await this.usersService.findByUsername(username);
        if (user && await compare(password, user.password_hash)) {
            const { password_hash, ...result } = user;
            return result;
        }
        return null;
    }

    async login(user: Users){
        const payload = { username: user.username, sub: user.id , role: user.role};
        return {
            access_token: this.jwtService.sign(payload),
        }
    }
}
