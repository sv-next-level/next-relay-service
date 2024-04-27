import { Body, Controller, Logger, Post } from "@nestjs/common";

import { EMAIL_TYPE } from "@/constants";
import { EmailService } from "@/app/email/email.service";
import { emailDocument } from "@/schemas/email.schema";
import { ResendEmailDTO, SendEmailDTO, VerifyEmailDTO } from "@/dtos";
import { BadRequest, IApiResponse, InternalServerError, OK } from "@/utils";

@Controller("email")
export class EmailController {
  private logger: Logger = new Logger("email.controller");
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
  async send(@Body() sendEmailDto: SendEmailDTO): Promise<IApiResponse> {
    try {
      this.logger.debug({
        message: "Entering send",
        emailData: sendEmailDto,
      });

      // Save email details in db
      const savedEmailData: emailDocument =
        await this.emailService.saveEmailData(sendEmailDto);

      // Create email template as per email type
      const emailHtmlTemplate: string = this.emailService.getEmailHtmlTemplate(
        savedEmailData.email_type,
        savedEmailData.data
      );
      if (!emailHtmlTemplate) {
        this.logger.warn({
          message: "Email template could not be found",
          requesting_service: sendEmailDto.requesting_service_type,
          email_type: sendEmailDto.email_type,
        });
      }

      // Send email
      const sendedEmailData: any = await this.emailService.sendEmail(
        savedEmailData.to,
        savedEmailData.email_type,
        emailHtmlTemplate
      );

      // Update in db
      const expiresAfter = new Date(
        Date.now() + sendEmailDto.expires_after * 1000
      );
      const updateData: any = {
        message_id: sendedEmailData.messageId,
        vendor_reponse: sendedEmailData.response,
        expires_at: expiresAfter,
      };

      const updatedRelayId: string = await this.emailService.updateEmailData(
        savedEmailData._id,
        updateData
      );

      this.logger.log({
        message: "Sending email relay id",
        relay_id: updatedRelayId,
        expires_after: expiresAfter,
      });

      const data = {
        message: "Email sent successfully",
        relay_id: updatedRelayId,
        expires_after: expiresAfter,
      };

      return OK(data);
    } catch (error) {
      this.logger.error({
        message: "Error sending email",
        requesting_service: sendEmailDto.requesting_service_type,
        email_type: sendEmailDto.email_type,
        error: error,
      });

      return InternalServerError(error);
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
  async verify(@Body() verifyEmailDto: VerifyEmailDTO): Promise<IApiResponse> {
    try {
      this.logger.debug({
        message: "Entering verify",
        verifyEmailDto: verifyEmailDto,
      });

      // Fetch relay transaction by relay id
      const relayTransaction: emailDocument =
        await this.emailService.getRelayTransaction(verifyEmailDto.relayId);
      if (!relayTransaction) {
        this.logger.warn({
          message: "Invalid relayId!",
          relay_id: verifyEmailDto.relayId,
        });

        const data = {
          message: "Invalid relayId!",
          result: false,
        };

        return OK(data);
      }

      // Compare expire time with current time
      const current_time: Date = new Date();
      const is_expired: boolean = relayTransaction.expires_after < current_time;

      if (is_expired) {
        this.logger.warn({
          message: "Transaction expired!",
          expires_after: relayTransaction.expires_after,
          relay_id: verifyEmailDto.relayId,
          is_expired: is_expired,
        });

        const data = {
          message: "Transaction expired!",
          result: false,
        };

        return OK(data);
      }

      // Compare OTP if it is there
      const is_otp_transaction: boolean =
        relayTransaction.email_type === EMAIL_TYPE.OTP_2FA;

      if (is_otp_transaction) {
        const is_otp_valid: boolean =
          verifyEmailDto?.data === relayTransaction.data;

        if (is_otp_valid) {
          this.logger.log({
            message: "OTP verified!",
            relay_id: verifyEmailDto.relayId,
            is_otp_valid: is_otp_valid,
          });

          const data = {
            message: "OTP verified!",
            result: true,
          };

          return OK(data);
        } else {
          this.logger.warn({
            message: "Invalid OTP!",
            relay_id: verifyEmailDto.relayId,
            is_otp_valid: is_otp_valid,
          });

          const data = {
            message: "Invalid OTP!",
            result: false,
          };

          return OK(data);
        }
      }

      this.logger.log({
        message: "Transaction not expired!",
        expires_after: relayTransaction.expires_after,
        relay_id: verifyEmailDto.relayId,
        is_expired: is_expired,
      });

      const data = {
        message: "Transaction not expired!",
        result: true,
      };

      return OK(data);
    } catch (error) {
      this.logger.error({
        message: "Error verifying email",
        error: error,
      });

      return InternalServerError(error);
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
  async resend(@Body() resendEmailDto: ResendEmailDTO): Promise<IApiResponse> {
    try {
      this.logger.debug({
        message: "Entering resend",
        resendEmailDto: resendEmailDto,
      });

      // Fetch relay transaction by relay id
      const relayTransaction: emailDocument =
        await this.emailService.getRelayTransaction(resendEmailDto.relayId);
      if (!relayTransaction) {
        this.logger.warn({
          message: "Invalid relayId!",
          relay_id: resendEmailDto.relayId,
        });

        const data = {
          message: "Invalid relayId!",
        };

        throw BadRequest(data);
      }

      // Create email template as per email type
      const emailHtmlTemplate: string = this.emailService.getEmailHtmlTemplate(
        relayTransaction.email_type,
        resendEmailDto.data
      );
      if (!emailHtmlTemplate) {
        this.logger.warn({
          message: "Email template could not be found",
          requesting_service: relayTransaction.requesting_service_type,
          email_type: relayTransaction.email_type,
        });
      }

      // Resend email
      const sendedEmailData: any = await this.emailService.sendEmail(
        relayTransaction.to,
        relayTransaction.email_type,
        emailHtmlTemplate
      );

      const expiresAfter = new Date(
        Date.now() + resendEmailDto.expires_after * 1000
      );
      const updateData: any = {
        data: resendEmailDto.data,
        message_id: sendedEmailData.messageId,
        vendor_reponse: sendedEmailData.response,
        expires_after: expiresAfter,
      };
      const updatedRelayId: string = await this.emailService.updateEmailData(
        relayTransaction._id,
        updateData
      );

      this.logger.log({
        message: "Sending email relay id",
        relay_id: updatedRelayId,
        expires_after: expiresAfter,
      });

      const data = {
        message: "Email resent successfully",
        relay_id: updatedRelayId,
        expires_after: expiresAfter,
      };

      return OK(data);
    } catch (error) {
      this.logger.error({
        message: "Error resending email",
        relayId: resendEmailDto.relayId,
        error: error,
      });

      return InternalServerError(error);
    }
  }
}
