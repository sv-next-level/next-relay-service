import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";

import { EmailController, EmailService } from ".";
import { MONGOOSE_DB_CONNECTION } from "@/db/connection";
import { EMAIL_SCHEMA_NAME, EmailSchema } from "@/db/mongo/model";

@Module({
  imports: [
    MongooseModule.forFeature(
      [{ name: EMAIL_SCHEMA_NAME, schema: EmailSchema }],
      MONGOOSE_DB_CONNECTION.MAIN
    ),
  ],
  controllers: [EmailController],
  providers: [EmailService],
  exports: [EmailService],
})
export class EmailModule {}
