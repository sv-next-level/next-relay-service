import {
  MongooseOptionsFactory,
  MongooseModuleOptions,
} from "@nestjs/mongoose";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class MongooseRelayConfigService implements MongooseOptionsFactory {
  constructor(private readonly configService: ConfigService) {}

  createMongooseOptions():
    | MongooseModuleOptions
    | Promise<MongooseModuleOptions> {
    const uri = this.configService.get("RELAY.dbUri");

    return {
      uri,
    };
  }
}
