import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { TableStatus } from 'src/generated/prisma/enums';
import { TablesCreateInput, TablesOrderByWithRelationInput, TablesUpdateInput, TablesWhereInput, TablesWhereUniqueInput } from 'src/generated/prisma/models';

@Injectable()
export class TablesService {
    constructor(private databaseService: DatabaseService) {}

    async getAllTables(params:{
            skip?: number;
            take?: number;
            cursor?: TablesWhereUniqueInput;
            where?: TablesWhereInput;
            orderBy?: TablesOrderByWithRelationInput;
        }) {
        const { skip, take, cursor, where, orderBy } = params;
        return this.databaseService.tables.findMany({
            skip,
            take,
            cursor,
            where,
            orderBy,
            include:{
                location:{
                    select:{
                        location:true
                    }
                }
            }
        });
    }

    async getTableById(id: string) {
        return this.databaseService.tables.findUnique({ where: { id } });
    }

    async createTable(data: TablesCreateInput){
        return this.databaseService.tables.create({ data });
    }

    async updateTable(where: TablesWhereUniqueInput, data: TablesUpdateInput){
        return this.databaseService.tables.update({ where, data });
    }

    async deleteTable(where: TablesWhereUniqueInput){
        return this.databaseService.tables.delete({ where });
    }

    async updateTableStatus(id: string, status: TableStatus){
        return this.databaseService.tables.update({
            where: { id },
            data: { status },
        });
    }
}
