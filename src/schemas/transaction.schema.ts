import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

export enum Vendors {
  SMTP_EMAIL = "SMTP Email",
}

export enum Services {
  TRADING = "next-trading-service",
  DASHBOARD = "next-dashboard-service",
}

export enum Transactions {
  ACTIVE = "Active",
  EXPIRED = "Expired",
}

export enum Communications {
  OTP_2FA = "2FA OTP",
  FORGOT_PW = "Forgot Password",
  CREATE_PW = "Create Password",
}

export enum Methods {
  SMS = "SMS",
  EMAIL = "EMAIL",
  WHATSAPP = "WHATSAPP",
}

export class To {
  @Prop({ type: [String], required: true })
  email: String[];

  // sms?: string[];
  // whatsapp?: string[];
}

@Schema({
  timestamps: true,
})
export class Transaction {
  @Prop({ type: Object, required: true })
  to?: To;

  // @Prop({ type: String, required: true })
  // from?: String;

  @Prop({ type: String, required: true })
  data?: String;

  @Prop({ type: Number, default: 0 })
  retry?: Number;

  @Prop({ type: [String], enum: Methods, required: true })
  methods?: Methods[];

  // @Prop({ type: Date, required: true })
  // expires_at?: Date;

  // @Prop({ type: String, enum: Vendors, required: true })
  // vendor_name?: Vendors;

  // @Prop({ type: String, required: true })
  // vendor_code?: String;

  // @Prop({ type: String, required: true })
  // vendor_message?: String;

  // @Prop({ type: String, required: true })
  // response_code?: String;

  // @Prop({ type: String, required: true })
  // response_message?: String;

  @Prop({ type: String, enum: Services, required: true })
  requesting_service?: Services;

  // @Prop({ type: String, enum: Transactions, required: true })
  // transaction_status?: Transactions;

  @Prop({ type: String, enum: Communications, required: true })
  comminucation_mode?: Communications;

  // For future use
  // @Prop({ type: Date, required: true })
  // resend_expires_at?: Date;
}

export const transactionSchema = SchemaFactory.createForClass(Transaction);
