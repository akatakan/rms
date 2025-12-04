import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { PaymentsCreateInput, PaymentsUpdateInput, PaymentsWhereUniqueInput } from 'src/generated/prisma/models';

@Injectable()
export class PaymentsService {
    constructor(private databaseService: DatabaseService) { }

    async getAllPayments() {
        return this.databaseService.payments.findMany({where: {is_deleted: false}});
    }

    async getPaymentById(id: string) {
        return this.databaseService.payments.findUnique({
            where: { id },
        });
    }

    async createPayment(data: PaymentsCreateInput) {
        return this.databaseService.payments.create({
            data,
        });
    }

    async updatePayment(where: PaymentsWhereUniqueInput, data: PaymentsUpdateInput) {
        return this.databaseService.payments.update({
            where,
            data,
        });
    }

    async softDeletePayment(where: PaymentsWhereUniqueInput) {
        return this.databaseService.payments.update({
            where: where,
            data: { 
                is_deleted: true,
                deletedAt: new Date(),
            },
        });
    }

}
