import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Post,
} from "@nestjs/common";
import { isMongoIdValid } from "@/dtos/misc.dto";
import { MailService } from "@/mail/mail.service";
import { Transaction } from "@/schemas/transaction.schema";
import { TransactionService } from "@/transaction/transaction.service";
import { emailDataType, sendTransactionDto } from "@/dtos/transaction.dto";

@Controller("transaction")
export class TransactionController {
  constructor(
    private transactionService: TransactionService,
    private mailService: MailService
  ) {}

  @Get(":transactionId")
  async findTransactionById(
    @Param("transactionId") transactionId: string
  ): Promise<Transaction> {
    const is_transaction_id_is_valid: boolean = isMongoIdValid(transactionId);
    if (!is_transaction_id_is_valid) {
      throw new BadRequestException("Invalid transaction id!");
    }
    return this.transactionService.findTransactionById(transactionId);
  }

  @Post("send")
  async sendTransaction(
    @Body() sendTransactionData: sendTransactionDto
  ): Promise<Transaction> {
    try {
      const emailData: emailDataType =
        this.transactionService.methodWiseSeparation(sendTransactionData);

      let emailSended;
      for (const email of emailData.list) {
        emailSended = await this.mailService.sendMail(
          email as string,
          emailData.subject as string,
          emailData.message as string
        );
      }

      const transactionId =
        this.transactionService.createTransaction(sendTransactionData);

      return transactionId;
    } catch (error) {
      console.log("🚀 ~ TransactionController ~ error:", error);
    }
  }
}
