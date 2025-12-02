import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { User } from 'src/generated/prisma/client';
import { UserCreateInput, UserOrderByWithRelationInput, UserUpdateInput, UserWhereInput, UserWhereUniqueInput } from 'src/generated/prisma/models';

@Injectable()
export class UsersService {
    constructor(private databaseService: DatabaseService) {}

    async getUsers(params:{
        skip?: number;
        take?: number;
        cursor?: UserWhereUniqueInput;
        where?: UserWhereInput;
        orderBy?: UserOrderByWithRelationInput;
    }) : Promise<User[]> {
        const { skip, take, cursor, where, orderBy } = params;
        return this.databaseService.user.findMany({
            skip,
            take,
            cursor,
            where,
            orderBy,
        });
    }

    async findByUsername(username: string) : Promise<User | null> {
        return this.databaseService.user.findUnique({
            where: { username },
        });
    }

    async createUser(data: UserCreateInput) : Promise<User> {
        return this.databaseService.user.create({
            data,
        });
    }

    async updateUser(
        where: UserWhereUniqueInput,
        data: UserUpdateInput
    ): Promise<User> {
        return this.databaseService.user.update({
            where,
            data,
        });
    }

    async deleteUser(where: UserWhereUniqueInput) : Promise<User> {
        return this.databaseService.user.delete({
            where,
        });
    }
}
