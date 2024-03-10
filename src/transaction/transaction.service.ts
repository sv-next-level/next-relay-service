import { Model } from "mongoose";
import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { emailDataType } from "@/dtos/transaction.dto";
import { Transaction } from "@/schemas/transaction.schema";

@Injectable()
export class TransactionService {
  constructor(
    @InjectModel(Transaction.name) private transactionModel: Model<Transaction>
  ) {}

  async findTransactionById(transactionId: string): Promise<Transaction> {
    const existingTransaction =
      await this.transactionModel.findById(transactionId);
    return existingTransaction;
  }

  methodWiseSeparation(sendTransactionData: Transaction): emailDataType {
    const emailData: emailDataType = {
      list: sendTransactionData.to.email,
      subject: sendTransactionData.comminucation_mode,
      message: sendTransactionData.data,
    };

    return emailData;
  }

  async createTransaction(transactionData: Transaction): Promise<any> {
    try {
      const transaction = await this.transactionModel.create(transactionData);

      return transaction._id;
    } catch (error) {
      console.log(
        "🚀 ~ TransactionService ~ createTransaction ~ error:",
        error
      );
    }
  }
}
