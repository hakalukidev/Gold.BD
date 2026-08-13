import { redis } from "@/lib/redis";

/**
 * Fixed-window rate limiter backed by Redis. Cheap and good enough for an
 * MVP; swap for a sliding-window/token-bucket implementation if bursts at
 * the window boundary become a real problem.
 */
export async function checkRateLimit(
  key: string,
  limit: number,
  windowSeconds: number
): Promise<{ allowed: boolean; remaining: number }> {
  const redisKey = `ratelimit:${key}`;
  const count = await redis.incr(redisKey);
  if (count === 1) {
    await redis.expire(redisKey, windowSeconds);
  }
  return { allowed: count <= limit, remaining: Math.max(0, limit - count) };
}
