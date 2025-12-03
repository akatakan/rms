import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { TablesController } from './tables.controller';

@Module({
    imports: [DatabaseModule],
    controllers: [TablesController],
})
export class TablesModule {}
