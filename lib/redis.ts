import { Redis } from "@upstash/redis";

const getRedisUrl = () => {
  if (process.env.UPSTASH_REDIS_URL) {
    return process.env.UPSTASH_REDIS_URL;
  }

  throw new Error("UPSTASH_REDIS_URL is not defined");
};

const getRedisToken = () => {
  if (process.env.UPSTASH_REDIS_TOKEN) {
    return process.env.UPSTASH_REDIS_TOKEN;
  }

  throw new Error("UPSTASH_REDIS_TOKEN is not defined");
};

export const redis = new Redis({
  url: getRedisUrl(),
  token: getRedisToken(),
});
