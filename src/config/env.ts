import dotenv from "dotenv";

dotenv.config();

export const config = {
  port: process.env.PORT || 9000,
  mongoDb: {
    uri: process.env.MONGO_DB_URI,
  },
  redis: {
    host: process.env.REDIS_HOST,
    port: Number(process.env.REDIS_PORT),
    password: process.env.REDIS_PASSWORD,
  },
  cache: {
    ttl: Number(process.env.CACHE_TTL_SECONDS), //5 minutes
    updateDays: Number(process.env.DB_DATA_VALIDITY),
  },
  razorpay:{
    api:process.env.RAZORPAY_BASE_URL
  }
};
