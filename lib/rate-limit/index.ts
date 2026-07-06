import "server-only";

type Bucket = { count: number; resetAt: number };

declare global {
   
  var __rateLimitBuckets: Map<string, Bucket> | undefined;
}

const buckets = global.__rateLimitBuckets ?? new Map<string, Bucket>();
global.__rateLimitBuckets = buckets;

/**
 * Best-effort in-memory fixed-window limiter. Works within a single Node
 * process (e.g. `next start`, a long-lived container). On multi-instance
 * serverless deploys each instance has its own memory, so this is not a
 * hard guarantee — swap for Upstash Redis before relying on it in production.
 */
export function checkRateLimit(key: string, limit: number, windowMs: number) {
  const now = Date.now();
  const bucket = buckets.get(key);

  if (!bucket || bucket.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { success: true, remaining: limit - 1 };
  }

  if (bucket.count >= limit) {
    return { success: false, remaining: 0, retryAfterMs: bucket.resetAt - now };
  }

  bucket.count += 1;
  return { success: true, remaining: limit - bucket.count };
}

export function rateLimitKey(requestHeaders: Headers, scope: string) {
  const ip =
    requestHeaders.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    requestHeaders.get("x-real-ip") ??
    "unknown";
  return `${scope}:${ip}`;
}
