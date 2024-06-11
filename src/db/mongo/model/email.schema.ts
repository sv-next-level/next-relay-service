import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

import { SERVICE } from "@/common/server/service";
import { EMAIL_VENDOR, EMAIL_ACTION } from "@/common/notification";

@Schema({
  timestamps: true,
})
export class Email {
  @Prop({ type: String, required: true })
  to: string;

  @Prop({ type: String })
  from?: string;

  @Prop({ type: String, required: true })
  data: string;

  @Prop({ type: Date, required: true })
  expires_after?: Date;

  @Prop({ type: String })
  response_code?: string;

  @Prop({ type: String })
  response_message?: string;

  @Prop({ type: String })
  message_id?: string;

  @Prop({ type: String })
  vendor_reponse?: string;

  @Prop({
    type: String,
    enum: EMAIL_VENDOR,
    default: EMAIL_VENDOR.SMTP_EMAIL,
  })
  vendor_type: string;

  @Prop({ type: String, enum: EMAIL_ACTION, required: true })
  email_type: string;

  @Prop({ type: String, enum: SERVICE, required: true })
  requesting_service_type: string;
}

export const EMAIL_SCHEMA_NAME: string = Email.name;

export const EmailSchema = SchemaFactory.createForClass(Email);

export type EmailDocument = Email & Document & { _id: string };
