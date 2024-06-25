import { Redis } from "@upstash/redis";

if (!process.env.UPSTASH_REDIS_REST_URL) {
  throw new Error("redis rest url required.");
}

if (!process.env.UPSTASH_REDIS_REST_TOKEN) {
  throw new Error("redis rest token required.");
}

export const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});
