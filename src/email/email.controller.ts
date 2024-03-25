import { Body, Controller, Post } from "@nestjs/common";

import { EMAIL_TYPE } from "@/constants";
import { EmailService } from "@/email/email.service";
import { emailDocument } from "@/schemas/email.schema";
import { ResendEmailDTO, SendEmailDTO, VerifyEmailDTO } from "@/dtos";

@Controller("email")
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

  /**
   * steps:
   * 1. DTO will validate data
   * 2. Email data should saved in db
   * 3. Create email template as per email type
   * 4. Send email and update data in db
   * 5. Return relay id
   * @param sendEmailDto
   * @returns
   */
  @Post("send")
  async send(@Body() sendEmailDto: SendEmailDTO): Promise<{
    relayId: string;
  }> {
    try {
      // Save email details in db
      const savedEmailData: emailDocument =
        await this.emailService.saveEmailData(sendEmailDto);

      // TODO: Create email template as per email type

      // Send email
      const sendedEmailData: any = await this.emailService.sendEmail(
        savedEmailData.to,
        savedEmailData.email_type,
        savedEmailData.data
      );

      // Update in db
      const updateData = {
        message_id: sendedEmailData.messageId,
        vendor_reponse: sendedEmailData.response,
      };
      const updatedRelayId: string = await this.emailService.updateEmailData(
        savedEmailData._id,
        updateData
      );

      // Send updated relay id
      return {
        relayId: updatedRelayId,
      };
    } catch (error) {
      console.log("🚀 ~ TransactionController ~ error:", error);
    }
  }

  /**
   * steps:
   * 1. DTO will validate data
   * 2. Fetch relay transaction by relay id
   * 3. Compare expire time with current time
   * 4. Compare OTP if it is otp transaction
   * 5. Return verification [true | false]
   * @param verifyEmailDto
   * @returns
   */
  @Post("verify")
  async verify(@Body() verifyEmailDto: VerifyEmailDTO): Promise<{
    success: boolean;
    message: string;
  }> {
    try {
      // Fetch relay transaction by relay id
      const relayTransaction: emailDocument =
        await this.emailService.getRelayTransaction(verifyEmailDto.relayId);
      if (!relayTransaction) {
        return { success: false, message: "Invalid relayId!" };
      }

      // Compare expire time with current time
      const current_time: Date = new Date();
      const is_expired: boolean = relayTransaction.expires_after < current_time;
      if (is_expired) {
        return { success: false, message: "Transaction expired!" };
      }

      // Compare OTP if it is there
      const is_otp_transaction: boolean =
        relayTransaction.email_type === EMAIL_TYPE.OTP_2FA;
      if (is_otp_transaction) {
        const is_otp_valid: boolean =
          verifyEmailDto?.data === relayTransaction.data;
        if (is_otp_valid) {
          return { success: true, message: "OTP verified!" };
        } else {
          return { success: false, message: "Invalid OTP!" };
        }
      }

      return { success: true, message: "Transaction not expired!" };
    } catch (error) {
      console.log("🚀 ~ TransactionController ~ error:", error);
    }
  }

  /**
   * steps:
   * 1. DTO will validate data
   * 2. Fetch relay transaction by relay id
   * 3. Create email template as per email type
   * 4. Send email and update db
   * 5. Return relay id
   * @param resendEmailDto
   * @returns
   */
  @Post("resend")
  async resend(@Body() resendEmailDto: ResendEmailDTO): Promise<{
    relayId?: string;
    success?: boolean;
    message?: string;
  }> {
    try {
      // Fetch relay transaction by relay id
      const relayTransaction: emailDocument =
        await this.emailService.getRelayTransaction(resendEmailDto.relayId);
      if (!relayTransaction) {
        return { success: false, message: "Invalid relayId!" };
      }

      // TODO: Create email template as per email type

      // Resend email
      const sendedEmailData: any = await this.emailService.sendEmail(
        relayTransaction.to,
        relayTransaction.email_type,
        resendEmailDto.data
      );

      const updateData = {
        data: resendEmailDto.data,
        message_id: sendedEmailData.messageId,
        vendor_reponse: sendedEmailData.response,
        expires_after: new Date(
          Date.now() + resendEmailDto.expires_after * 1000
        ),
      };
      const updatedRelayId: string = await this.emailService.updateEmailData(
        relayTransaction._id,
        updateData
      );

      // Send updated relay id
      return {
        relayId: updatedRelayId,
      };
    } catch (error) {
      console.log("🚀 ~ TransactionController ~ error:", error);
    }
  }
}
