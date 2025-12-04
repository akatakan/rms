import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { DatabaseModule } from './database/database.module';
import { ConfigModule } from '@nestjs/config';
import { TablesService } from './tables/tables.service';
import { TablesController } from './tables/tables.controller';
import { TablesModule } from './tables/tables.module';
import { PaymentsModule } from './payments/payments.module';

@Module({
  imports: [UsersModule, AuthModule, DatabaseModule,ConfigModule.forRoot({
    isGlobal: true,
  }), TablesModule, PaymentsModule],
  controllers: [AppController, TablesController],
  providers: [AppService, TablesService],
})
export class AppModule {}
