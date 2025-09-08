import Redis from "ioredis";
import { config } from "./env";

/**
 * Singleton Redis client wrapper.
 * Handles connection, retries, and exposes a single shared client.
 */
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

  /**
   * Returns the Redis client instance for performing operations.
   */
  getClient(): Redis {
    return this.client;
  }

  /**
   * Gracefully disconnects the Redis client.
   */
  async disconnect(): Promise<void> {
    await this.client.quit();
  }
}

export const redisClient = new RedisClient();
