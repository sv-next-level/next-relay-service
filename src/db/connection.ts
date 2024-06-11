import { CONNECTION } from "@/common/db/mongo/connection";
import { ModelDefinition } from "@nestjs/mongoose";

export interface MongooseDbSchema {
  connectionName: string;
  models: ModelDefinition[];
}

export enum MONGOOSE_DB_CONNECTION {
  MAIN = CONNECTION.RELAY_SERVICE_MAIN,
}

export const MONGOOSE_DB_SCHEMA = {};

export enum REDIS_DB_CONNECTION {
  MAIN = CONNECTION.RELAY_SERVICE_MAIN,
}
