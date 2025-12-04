import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { TableStatus } from 'src/generated/prisma/enums';
import { TablesCreateInput, TablesWhereUniqueInput } from 'src/generated/prisma/models';

@Injectable()
export class TablesService {
    constructor(private databaseService: DatabaseService) {}

    async getAllTables() {
        return this.databaseService.tables.findMany();
    }

    async getTableById(id: string) {
        return this.databaseService.tables.findUnique({ where: { id } });
    }

    async createTable(data: TablesCreateInput){
        return this.databaseService.tables.create({ data });
    }

    async updateTable(where: TablesWhereUniqueInput, data: TablesCreateInput){
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
