import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

import { AppService } from "@/app.service";
import { AppController } from "@/app.controller";
import configuration from "@/config/configuration";
import { validate } from "@/config/env.validation";
import { EmailModule } from "@/email/email.module";
import { DatabaseModule } from "@/infra/mongoose/database.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      load: configuration,
      expandVariables: true,
      isGlobal: true,
      cache: true,
      validate,
    }),
    DatabaseModule,
    EmailModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
