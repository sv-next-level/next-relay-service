import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { ConfigService } from "@nestjs/config";
import { MongooseModule } from "@nestjs/mongoose";

import { AppService } from "@/app.service";
import { AppController } from "@/app.controller";
import { MailService } from "./mail/mail.service";
import { validate } from "@/config/env.validation";
import { TransactionModule } from "@/transaction/transaction.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      validate,
    }),
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri:
          configService.get<string>("RELAY_MONGODB_URI") +
          "/" +
          configService.get<string>("RELAY_DATABASE_NAME") +
          "?" +
          configService.get<string>("RELAY_MONGODB_CONFIG"),
      }),
    }),
    TransactionModule,
  ],
  controllers: [AppController],
  providers: [AppService, MailService],
})
export class AppModule {}
