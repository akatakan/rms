import { Controller, Get, Post, Body, UseGuards, Put, Param, Patch } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/role.guard';
import { Roles } from 'src/roles.decorator';
import { TablesService } from './tables.service';
import type { TablesCreateInput, TablesUpdateInput } from 'src/generated/prisma/models';
import { Role, TableStatus } from 'src/generated/prisma/enums';
import { Tables } from 'src/generated/prisma/client';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('tables')
export class TablesController {
    constructor(private tableService: TablesService) {}

    @Roles(Role.WAITER)
    @Get()
    async getTables() : Promise<Tables[]> {
        return this.tableService.getAllTables({
            orderBy: {id:'asc'}
        }); 
    }

    @Roles(Role.ADMIN)
    @Post('createTable')
    async createTable(@Body() data: TablesCreateInput) {
        return this.tableService.createTable(data);
    }

    @Roles(Role.WAITER)
    @Patch('updateStatus/:id')
    async updateTableStatus(@Body('status') status: TableStatus, @Param('id') id: string) {
        return this.tableService.updateTableStatus(id, status);
    }

    @Roles(Role.ADMIN)
    @Patch(':id')
    async updateTable(@Param('id') id: string, @Body() data: TablesUpdateInput) {
        return this.tableService.updateTable({ id }, data);
    }
}
