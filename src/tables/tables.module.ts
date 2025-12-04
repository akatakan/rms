import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { TablesController } from './tables.controller';
import { TablesService } from './tables.service';

@Module({
    imports: [DatabaseModule],
    providers: [TablesService],
    controllers: [TablesController],
})
export class TablesModule {}
