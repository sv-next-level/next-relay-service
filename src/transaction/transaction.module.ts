import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";

import { MailService } from "@/mail/mail.service";
import { transactionSchema } from "@/schemas/transaction.schema";
import { TransactionService } from "@/transaction/transaction.service";
import { TransactionController } from "@/transaction/transaction.controller";

@Module({
  imports: [
    MongooseModule.forFeature(
      [{ name: "Transaction", schema: transactionSchema }],
      process.env.RELAY_DATABASE_NAME
    ),
  ],
  controllers: [TransactionController],
  providers: [TransactionService, MailService],
})
export class TransactionModule {}
