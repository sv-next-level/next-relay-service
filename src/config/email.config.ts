import { registerAs } from "@nestjs/config";

export const EMAIL_CONFIG = registerAs("SMTP", () => {
  return {
    EMAIL: process.env["SMTP_EMAIL"],
    PASSWORD: process.env["SMTP_PASSWORD"],
  };
});
