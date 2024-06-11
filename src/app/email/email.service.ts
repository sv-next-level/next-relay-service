import { Model } from "mongoose";
import * as nodemailer from "nodemailer";
import { ConfigService } from "@nestjs/config";
import { InjectModel } from "@nestjs/mongoose";
import { Injectable, Logger } from "@nestjs/common";

import { SendEmailDTO } from "@/dto";
import { OTP, PASSWORD } from "@/common/notification";
import {
  email2FACodeTemplate,
  emailCreatePasswordTemplate,
  emailForgotPasswordTemplate,
} from "@/templates/email";
import { MONGOOSE_DB_CONNECTION } from "@/db/connection";
import { EMAIL_SCHEMA_NAME, EmailDocument } from "@/db/mongo/model";

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;
  private logger: Logger = new Logger("email.service");

  constructor(
    @InjectModel(EMAIL_SCHEMA_NAME, MONGOOSE_DB_CONNECTION.MAIN)
    private readonly emailModel: Model<EmailDocument>,
    private readonly configService: ConfigService
  ) {
    try {
      this.logger.debug({
        message: "Entering constructor of email service",
      });

      this.connectEmailTransporter();
      this.verifyEmailTransporter();
    } catch (error) {
      this.logger.error({
        message: "Error saving email data",
        error: error,
      });
    }
  }

  async getRelayTransaction(relayId: string): Promise<EmailDocument> {
    try {
      this.logger.debug({
        message: "Entering getRelayTransaction",
        relayId: relayId,
      });

      const relayTransaction: EmailDocument =
        await this.emailModel.findById(relayId);
      this.logger.log({
        message: "After getting relay transaction",
        relayTransaction: relayTransaction,
      });

      return relayTransaction;
    } catch (error) {
      this.logger.error({
        message: "Error getting relay transaction",
        relayId: relayId,
        error: error,
      });
    }
  }

  async saveEmailData(emailData: SendEmailDTO): Promise<EmailDocument> {
    try {
      this.logger.debug({
        message: "Entering saveEmailData",
        emailData: emailData,
      });

      const data = {
        to: emailData.to,
        from: this.configService.get("SMTP_EMAIL"),
        type: emailData.type,
        data: emailData.data.otp,
        action: emailData.action,
        requesting_service: emailData.requesting_service,
      };

      const newEmail = await this.emailModel.create(data);

      this.logger.log({
        message: "After saving email data",
        newEmail: newEmail,
      });

      return newEmail;
    } catch (error) {
      this.logger.error({
        message: "Error saving email data",
        error: error,
      });
    }
  }

  getEmailHtmlTemplate(action: string, data: string): string {
    try {
      this.logger.debug({
        message: "Entering getEmailHtmlTemplate",
        action: action,
        data: data,
      });
      switch (action) {
        case OTP.TWO_FACTOR_AUTHENTICATION:
          return email2FACodeTemplate(data);
        case PASSWORD.CREATE:
          return emailCreatePasswordTemplate(JSON.parse(data).link);
        case PASSWORD.FORGOT:
          return emailForgotPasswordTemplate(JSON.parse(data).link);
        default:
          return "";
      }
    } catch (error) {
      this.logger.error({
        message: "Error selecting email template",
        action: action,
        error: error,
      });
    }
  }

  async sendEmail(
    recipient: string,
    subject: string,
    message: string
  ): Promise<any> {
    try {
      const from: string = this.configService.get<string>("SMTP.EMAIL");
      this.logger.debug({
        message: "Entering sendEmail",
        recipient: recipient,
        subject: subject,
        from: from,
      });

      const sendResult: any = await this.transporter.sendMail({
        from: from,
        to: recipient,
        subject: subject,
        html: message,
      });
      this.logger.log({
        message: "After sending email",
        result: sendResult.response,
      });

      return sendResult;
    } catch (error) {
      this.logger.error({
        message: "Error sending email",
        subject: subject,
        error: error,
      });
    }
  }

  async updateEmailData(relayId: string, updateData: any): Promise<string> {
    try {
      this.logger.debug({
        message: "Entering updateEmailData",
        updateData: updateData,
        relayId: relayId,
      });

      const updatedData: EmailDocument =
        await this.emailModel.findByIdAndUpdate(relayId, updateData);
      this.logger.log({
        message: "After updating email data",
        updatedData: updatedData,
        relayId: relayId,
      });

      return updatedData._id;
    } catch (error) {
      this.logger.error({
        message: "Error updating email data",
        relayId: relayId,
        error: error,
      });
    }
  }

  connectEmailTransporter() {
    try {
      this.logger.debug({ message: "Entering connectEmailTransporter" });

      this.transporter = nodemailer.createTransport({
        //   host: "smtp.example.com",
        //   port: 587,
        //   secure: false,
        service: "gmail",
        auth: {
          user: this.configService.get<string>("SMTP.EMAIL"),
          pass: this.configService.get<string>("SMTP.PASSWORD"),
        },
      });
    } catch (error) {
      this.logger.error({
        message: "Error connecting email transporter",
        error: error,
      });
    }
  }

  async verifyEmailTransporter() {
    try {
      this.logger.debug({ message: "Entering verifyEmailTransporter" });

      const verification: boolean = await this.transporter.verify();

      if (verification) {
        this.logger.log({
          message: "Email transporter verification successful",
          verification: verification,
        });
      } else {
        this.logger.warn({
          message: "Email transporter verification failed",
          verification: verification,
        });
      }
    } catch (error) {
      this.logger.error({
        message: "Error verifying email transporter",
        error: error,
      });
    }
  }
}
