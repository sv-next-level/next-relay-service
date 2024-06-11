import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

import { SERVICE } from "@/common/server/service";
import { EMAIL_ACTION, EMAIL_VENDOR, TYPE } from "@/common/notification";

@Schema({
  timestamps: true,
})
export class Email {
  @Prop({ type: String, required: true })
  to: string;

  @Prop({ type: String, required: true })
  from: string;

  @Prop({ type: String, enum: TYPE, required: true })
  type: string;

  @Prop({ type: String, enum: EMAIL_ACTION, required: true })
  action: string;

  @Prop({ type: Object, required: true })
  data: any;

  @Prop({ type: String })
  message_id: string;

  @Prop({ type: Date })
  expiresAt: Date;

  @Prop({ type: String })
  vendor_reponse: string;

  @Prop({
    type: String,
    enum: EMAIL_VENDOR,
  })
  vendor_type: string;

  @Prop({ type: String, enum: SERVICE, required: true })
  requesting_service: string;
}

export const EMAIL_SCHEMA_NAME: string = Email.name;

export const EmailSchema = SchemaFactory.createForClass(Email);

export type EmailDocument = Email & Document & { _id: string };
