// Serverless Memory Rate Limiter for API Routes

const ipHitsMap = new Map<string, { count: number; expiresAt: number }>();

export function checkRateLimit(ip: string, maxRequests = 20, windowMs = 60000): { allowed: boolean; remaining: number } {
  const now = Date.now();
  const entry = ipHitsMap.get(ip);

  if (!entry || now > entry.expiresAt) {
    ipHitsMap.set(ip, { count: 1, expiresAt: now + windowMs });
    return { allowed: true, remaining: maxRequests - 1 };
  }

  if (entry.count >= maxRequests) {
    return { allowed: false, remaining: 0 };
  }

  entry.count += 1;
  return { allowed: true, remaining: maxRequests - entry.count };
}
