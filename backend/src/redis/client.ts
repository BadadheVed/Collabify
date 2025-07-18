import Redis from "ioredis";
const REDIS_URL = process.env.REDIS_URL;
if (!REDIS_URL) {
  throw new Error("❌ REDIS_URL is not defined in environment variables");
}

const redisClient = new Redis(REDIS_URL);
export default redisClient;
