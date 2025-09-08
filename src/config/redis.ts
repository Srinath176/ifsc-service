import Redis from "ioredis";
import { config } from "./env";

class RedisClient {
  private client: Redis;

  constructor() {
    this.client = new Redis({
      host: config.redis.host,
      port: config.redis.port,
      password: config.redis.password,
      retryStrategy: (times) => {
        const delay = Math.min(times * 50, 2000);
        return delay;
      },
    });

    this.client.on("connect", () => {
      console.log("Redis connected successfully");
    });

    this.client.on("error", (error) => {
      console.error("Redis connection error:", error);
    });
  }

  getClient(): Redis {
    return this.client;
  }

  async connectRedis() {
    try {
      await this.client.connect();
      console.log("Redis Connected Succesfully");
    } catch (error) {
      console.error("Redis connection error:", error);
    }
  }

  async disconnect(): Promise<void> {
    await this.client.quit();
  }
}

export const redisClient = new RedisClient();
