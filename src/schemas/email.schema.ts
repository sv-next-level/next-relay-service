import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

import { EMAIL_TYPE, EMAIL_VENDOR_TYPE, SERVICE_TYPE } from "@/constants";

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
    enum: EMAIL_VENDOR_TYPE,
    default: EMAIL_VENDOR_TYPE.SMTP_EMAIL,
  })
  vendor_type: EMAIL_VENDOR_TYPE;

  @Prop({ type: String, enum: EMAIL_TYPE, required: true })
  email_type: EMAIL_TYPE;

  @Prop({ type: String, enum: SERVICE_TYPE, required: true })
  requesting_service_type: SERVICE_TYPE;
}

export const emailSchema = SchemaFactory.createForClass(Email);

export type emailDocument = Email & Document & { _id: string };

export const EMAIL_MODEL = Email.name;
