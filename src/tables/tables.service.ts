import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class TablesService {
    constructor(private databaseService: DatabaseService) {}

}
