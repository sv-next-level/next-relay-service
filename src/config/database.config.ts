import { registerAs } from "@nestjs/config";

import { ENVIRONMENT } from "@/constants";

export const RELAY_DB_CONFIG = registerAs("RELAY", () => {
  return {
    MONGODB_URI: process.env["RELAY_MONGODB_URI"],
    DATABASE_NAME: process.env["RELAY_DATABASE_NAME"],
    MONGODB_CONFIG: process.env["RELAY_MONGODB_CONFIG"],
    MONGODB_LOCAL_URI: "mongodb://localhost:27017",

    isLocal() {
      return process.env["NODE_ENV"] === ENVIRONMENT.LOCAL;
    },

    getRelayDbUri() {
      return this.isLocal() ? this.MONGODB_LOCAL_URI : this.MONGODB_URI;
    },

    get dbUri() {
      return `${this.getRelayDbUri()}/${this.DATABASE_NAME}?${this.MONGODB_CONFIG}`;
    },
  };
});
