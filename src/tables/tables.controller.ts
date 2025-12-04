import { Controller, Get, Post, Body, UseGuards, Put, Param } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/role.guard';
import { Roles } from 'src/roles.decorator';
import { TablesService } from './tables.service';
import type { TablesCreateInput } from 'src/generated/prisma/models';
import { Role, TableStatus } from 'src/generated/prisma/enums';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('tables')
export class TablesController {
    constructor(private tableService: TablesService) {}

    @Roles(Role.WAITER)
    @Get()
    async getTables() {
        return this.tableService.getAllTables(); 
    }

    @Roles(Role.ADMIN)
    @Post('createTable')
    async createTable(@Body() data: TablesCreateInput) {
        return this.tableService.createTable(data);
    }

    @Roles(Role.WAITER)
    @Put('updateStatus/:id')
    async updateTableStatus(@Body('status') status: TableStatus, @Param('id') id: string) {
        return this.tableService.updateTableStatus(id, status);
    }
}
