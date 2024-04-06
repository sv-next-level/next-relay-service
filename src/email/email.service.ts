import { Model } from "mongoose";
import * as nodemailer from "nodemailer";
import { ConfigService } from "@nestjs/config";
import { InjectModel } from "@nestjs/mongoose";
import { Injectable, Logger } from "@nestjs/common";

import { SendEmailDTO } from "@/dtos";
import { DATABASE_CONNECTION_NAME, EMAIL_TYPE } from "@/constants";
import { EMAIL_MODEL, emailDocument } from "@/schemas/email.schema";
import {
  email2FACodeTemplate,
  emailCreatePasswordTemplate,
  emailForgotPasswordTemplate,
} from "@/templates/email";

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;
  private logger: Logger = new Logger("email.service");

  constructor(
    @InjectModel(EMAIL_MODEL, DATABASE_CONNECTION_NAME.RELAY_DB)
    private readonly emailModel: Model<emailDocument>,
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

  async getRelayTransaction(relayId: string): Promise<emailDocument> {
    try {
      this.logger.debug({
        message: "Entering getRelayTransaction",
        relayId: relayId,
      });

      const relayTransaction: emailDocument =
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

  async saveEmailData(emailData: SendEmailDTO): Promise<emailDocument> {
    try {
      this.logger.debug({
        message: "Entering saveEmailData",
        emailData: emailData,
      });
      const expiresAfter = new Date(
        Date.now() + emailData.expires_after * 1000
      );
      const newEmail = new this.emailModel({
        ...emailData,
        expires_after: expiresAfter,
      });

      const savedEmailData: emailDocument = await newEmail.save();
      this.logger.log({
        message: "After saving email data",
        savedEmailData: savedEmailData,
      });

      return savedEmailData;
    } catch (error) {
      this.logger.error({
        message: "Error saving email data",
        error: error,
      });
    }
  }

  getEmailHtmlTemplate(email_type: string, data: string): string {
    try {
      this.logger.debug({
        message: "Entering getEmailHtmlTemplate",
        email_type: email_type,
        data: data,
      });
      switch (email_type) {
        case EMAIL_TYPE.OTP_2FA:
          return email2FACodeTemplate(data);
        case EMAIL_TYPE.CREATE_PW:
          return emailCreatePasswordTemplate(JSON.parse(data).link);
        case EMAIL_TYPE.FORGOT_PW:
          return emailForgotPasswordTemplate(JSON.parse(data).link);
        default:
          return "";
      }
    } catch (error) {
      this.logger.error({
        message: "Error selecting email template",
        email_type: email_type,
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

      const updatedData: emailDocument =
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
