import * as nodemailer from "nodemailer";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;

  constructor(private readonly configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      //   host: "smtp.example.com",
      //   port: 587,
      //   secure: false,
      service: "gmail",
      auth: {
        user: configService.get<string>("SMTP_EMAIL"),
        pass: configService.get<string>("SMTP_PASSWORD"),
      },
    });
  }

  async sendMail(recipient: string, subject: string, message: string) {
    const sendResult = await this.transporter.sendMail({
      from: this.configService.get<string>("SMTP_EMAIL"),
      to: recipient,
      subject: subject,
      html: message,
    });

    return sendResult;
  }

  async verifyTransporter() {
    await this.transporter.verify();
  }
}
