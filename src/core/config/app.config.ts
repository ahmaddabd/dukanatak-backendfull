import { registerAs } from "@nestjs/config";

export default registerAs("app", () => ({
  environment: process.env.NODE_ENV || "development",
  port: parseInt(process.env.PORT, 10) || 3005,
  apiPrefix: "api/v1",

  database: {
    url: process.env.DATABASE_URL,
  },

  redis: {
    host: process.env.REDIS_HOST || "localhost",
    port: parseInt(process.env.REDIS_PORT, 10) || 6379,
  },

  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: "1h",
    refreshExpiresIn: "7d",
  },

  twilio: {
    accountSid: process.env.TWILIO_ACCOUNT_SID,
    authToken: process.env.TWILIO_AUTH_TOKEN,
    phoneNumber: process.env.TWILIO_PHONE_NUMBER,
  },
}));
