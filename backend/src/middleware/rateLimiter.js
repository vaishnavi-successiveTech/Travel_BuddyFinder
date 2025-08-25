// Simple per-process limiter: good enough for dev/MVP (upgrade later)
let hits = 0; let windowStart = Date.now();
export function rateLimiter(maxPerMin = 120) {
  return (req, res, next) => {
    const now = Date.now();
    if (now - windowStart > 60_000) { windowStart = now; hits = 0; }
    hits++;
    if (hits > maxPerMin) return res.status(429).json({ error: "Too many requests" });
    next();
  };
}
