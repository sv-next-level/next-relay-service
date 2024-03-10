interface keyValue {
  [key: string]: string;
}

export const env: keyValue = {
  ENVIRONMENT: String(process.env.ENVIRONMENT),
  NEXT_RELAY_SERVICE_PORT: String(process.env.NEXT_RELAY_SERVICE_PORT),
};

export const files: keyValue = {
  LOCAL_LOG: String(process.env.LOCAL_LOG),
  DATABASE_LOG: String(process.env.DATABASE_LOG),
  LOG_FILE_NAME: String(process.env.LOG_FILE_NAME),
};

export const smtpMail: keyValue = {
  SMTP_EMAIL: String(process.env.SMTP_EMAIL),
  SMTP_PASSWORD: String(process.env.SMTP_PASSWORD),
};

export const dashboardDb: keyValue = {
  RELAY_MONGODB_URI: String(process.env.RELAY_MONGODB_URI),
  RELAY_DATABASE_NAME: String(process.env.RELAY_DATABASE_NAME),
  RELAY_MONGODB_CONFIG: String(process.env.RELAY_MONGODB_CONFIG),
};

export const urls: keyValue = {
  RELAY_MONGODB_URI: String(
    `${dashboardDb.RELAY_MONGODB_URI}/${dashboardDb.RELAY_DATABASE_NAME}?${dashboardDb.RELAY_MONGODB_CONFIG}`
  ),
};

export const github: keyValue = {
  GITHUB_CLIENT_ID: String(process.env.GITHUB_CLIENT_ID),
  GITHUB_CLIENT_SECRET: String(process.env.GITHUB_CLIENT_SECRET),
};

export const google: keyValue = {
  GOOGLE_CLIENT_ID: String(process.env.GOOGLE_CLIENT_ID),
  GOOGLE_CLIENT_SECRET: String(process.env.GOOGLE_CLIENT_SECRET),
};

export const logger: keyValue = {
  LOG_LEVEL: String(process.env.LOG_LEVEL),
  LOCAL_LOG: String(process.env.LOCAL_LOG),
  DATABASE_LOG: String(process.env.DATABASE_LOG),
  LOG_FILE_NAME: String(process.env.LOG_FILE_NAME),
};
