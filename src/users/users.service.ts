import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { Users } from 'src/generated/prisma/client';
import { UsersCreateInput, UsersOrderByWithRelationInput, UsersUpdateInput, UsersWhereInput, UsersWhereUniqueInput } from 'src/generated/prisma/models';

@Injectable()
export class UsersService {
    constructor(private databaseService: DatabaseService) {}

    async getUsers(params:{
        skip?: number;
        take?: number;
        cursor?: UsersWhereUniqueInput;
        where?: UsersWhereInput;
        orderBy?: UsersOrderByWithRelationInput;
    }) : Promise<Users[]> {
        const { skip, take, cursor, where, orderBy } = params;
        return this.databaseService.users.findMany({
            skip,
            take,
            cursor,
            where,
            orderBy,
        });
    }

    async findByUsername(username: string) : Promise<Users | null> {
        return this.databaseService.users.findUnique({
            where: { username },
        });
    }

    async createUser(data: UsersCreateInput) : Promise<Users> {
        return this.databaseService.users.create({
            data,
        });
    }

    async updateUser(
        where: UsersWhereUniqueInput,
        data: UsersUpdateInput
    ): Promise<Users> {
        return this.databaseService.users.update({
            where,
            data,
        });
    }

    async deleteUser(where: UsersWhereUniqueInput) : Promise<Users> {
        return this.databaseService.users.delete({
            where,
        });
    }
}
