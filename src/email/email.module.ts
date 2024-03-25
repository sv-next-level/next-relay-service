import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { MongooseModule } from "@nestjs/mongoose";

import { EmailService } from "@/email/email.service";
import { DATABASE_CONNECTION_NAME } from "@/constants";
import { EmailController } from "@/email/email.controller";
import { EMAIL_MODEL, emailSchema } from "@/schemas/email.schema";

@Module({
  imports: [
    MongooseModule.forFeature(
      [{ name: EMAIL_MODEL, schema: emailSchema }],
      DATABASE_CONNECTION_NAME.RELAY_DB
    ),
  ],
  controllers: [EmailController],
  providers: [EmailService, ConfigService],
  exports: [EmailService],
})
export class EmailModule {}
