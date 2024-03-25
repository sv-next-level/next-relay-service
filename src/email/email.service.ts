import { Model } from "mongoose";
import * as nodemailer from "nodemailer";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { InjectModel } from "@nestjs/mongoose";

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

  constructor(
    @InjectModel(EMAIL_MODEL, DATABASE_CONNECTION_NAME.RELAY_DB)
    private readonly emailModel: Model<emailDocument>,
    private readonly configService: ConfigService
  ) {
    this.transporter = nodemailer.createTransport({
      //   host: "smtp.example.com",
      //   port: 587,
      //   secure: false,
      service: "gmail",
      auth: {
        user: configService.get<string>("SMTP.EMAIL"),
        pass: configService.get<string>("SMTP.PASSWORD"),
      },
    });
  }

  async getRelayTransaction(relayId: string): Promise<emailDocument> {
    try {
      const relayTransaction: emailDocument =
        await this.emailModel.findById(relayId);

      return relayTransaction;
    } catch (error) {
      console.log("🚀 ~ EmailService ~ saveEmailData ~ error:", error);
    }
  }

  async saveEmailData(emailData: SendEmailDTO): Promise<emailDocument> {
    try {
      const newEmail = new this.emailModel({
        ...emailData,
        expires_after: new Date(Date.now() + emailData.expires_after * 1000),
      });
      const savedEmailData: emailDocument = await newEmail.save();
      return savedEmailData;
    } catch (error) {
      console.log("🚀 ~ EmailService ~ saveEmailData ~ error:", error);
    }
  }

  getEmailHtmlTemplate(email_type: string, data: string): string {
    try {
      switch (email_type) {
        case EMAIL_TYPE.OTP_2FA:
          return email2FACodeTemplate(data);
        case EMAIL_TYPE.CREATE_PW:
          return emailCreatePasswordTemplate(data);
        case EMAIL_TYPE.FORGOT_PW:
          return emailForgotPasswordTemplate(data);
        default:
          return "";
      }
    } catch (error) {
      console.log("🚀 ~ EmailService ~ getEmailHtmlTemplate ~ error:", error);
    }
  }

  async sendEmail(
    recipient: string,
    subject: string,
    message: string
  ): Promise<any> {
    try {
      const sendResult = await this.transporter.sendMail({
        from: this.configService.get<string>("SMTP.EMAIL"),
        to: recipient,
        subject: subject,
        html: message,
      });

      return sendResult;
    } catch (error) {
      console.log("🚀 ~ EmailService ~ sendEmail ~ error:", error);
    }
  }

  async updateEmailData(relayId: string, updateData: any): Promise<string> {
    try {
      const updatedEmailData = await this.emailModel.findByIdAndUpdate(
        relayId,
        updateData
      );
      return updatedEmailData._id;
    } catch (error) {
      console.log("🚀 ~ EmailService ~ saveEmailData ~ error:", error);
    }
  }

  async verifyEmailTransporter() {
    await this.transporter.verify();
  }
}
