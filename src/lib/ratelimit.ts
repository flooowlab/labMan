const buckets = new Map<string, { tokens: number; last: number }>();

/**
 * Token-bucket rate limiter. Returns false when the key is over its limit.
 * Apply at the top of sensitive handlers (e.g. login): rateLimit(`login:${ip}`, 5).
 */
export function rateLimit(key: string, maxPerMinute: number): boolean {
  const now = Date.now();
  const b = buckets.get(key) ?? { tokens: maxPerMinute, last: now };
  b.tokens = Math.min(
    maxPerMinute,
    b.tokens + ((now - b.last) / 60_000) * maxPerMinute,
  );
  b.last = now;
  if (b.tokens < 1) {
    buckets.set(key, b);
    return false;
  }
  b.tokens -= 1;
  buckets.set(key, b);
  return true;
}
