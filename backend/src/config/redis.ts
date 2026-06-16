import { createClient } from "redis";
import dotenv from "dotenv";

dotenv.config();

export const redisClient = createClient({ url: process.env.REDIS_URL });

redisClient.on("error", (error) => {
  // eslint-disable-next-line no-console
  console.error("Redis connection error:", error);
});

export async function initializeRedis() {
  if (!redisClient.isOpen) {
    await redisClient.connect();
  }
}
