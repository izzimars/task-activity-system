import Redis from "ioredis";
import { config } from "../../../config/env";
import { logger } from "../../../config/logger";

class RedisService {
  public readonly publisher: Redis;
  public readonly subscriber: Redis;

  constructor() {
    const options = {
      host: config.redis.host,
      port: config.redis.port,
      password: config.redis.password
    };

    this.publisher = new Redis(options);
    this.subscriber = new Redis(options);

    this.publisher.on("connect", () => logger.info("Redis publisher connected"));
    this.subscriber.on("connect", () => logger.info("Redis subscriber connected"));

    this.publisher.on("error", (error) => logger.error("Redis publisher error", { error: error.message }));
    this.subscriber.on("error", (error) => logger.error("Redis subscriber error", { error: error.message }));
  }

  async publish(channel: string, payload: unknown): Promise<void> {
    await this.publisher.publish(channel, JSON.stringify(payload));
  }
}

export const redisService = new RedisService();
