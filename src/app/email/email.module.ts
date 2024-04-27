import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";

import { EmailController, EmailService } from ".";
import { DATABASE_CONNECTION_NAME } from "@/constants";
import { EMAIL_MODEL, emailSchema } from "@/schemas/email.schema";

@Module({
  imports: [
    MongooseModule.forFeature(
      [{ name: EMAIL_MODEL, schema: emailSchema }],
      DATABASE_CONNECTION_NAME.RELAY_DB
    ),
  ],
  controllers: [EmailController],
  providers: [EmailService],
  exports: [EmailService],
})
export class EmailModule {}
