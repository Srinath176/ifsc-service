import dotenv from "dotenv";

dotenv.config();

export const config = {
  port: process.env.PORT || 9000,
  mongoDb: {
    uri: process.env.MONGO_DB_URI,
  },
  redis: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
    password: process.env.REDIS_PASSWORD,
  },
  cache: {
    ttl: process.env.CACHE_TTL_SECONDS || 3600, //1 hour
    updateDays: process.env.UPDATE_DATA_DAYS || 7,
  },
};
