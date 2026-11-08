/** 投稿回数の制限。数えるのは Durable Object（rate-limit-do.ts）、計算はここの純粋関数。 */

export interface RateLimitResult {
  ok: boolean;
  remaining: number;
  retryAfterSeconds: number;
}

/**
 * スライディングウィンドウ。hits は過去の投稿時刻（ms）。
 * 上限内なら今回の時刻を足した配列を返す。
 */
export function slidingWindow(
  hits: number[],
  now: number,
  limit: number,
  windowMs: number,
): { hits: number[]; result: RateLimitResult } {
  const recent = hits.filter((t) => now - t < windowMs).sort((a, b) => a - b);
  if (recent.length >= limit) {
    const oldest = recent[recent.length - limit] ?? now;
    const retryAfterSeconds = Math.max(1, Math.ceil((oldest + windowMs - now) / 1000));
    return { hits: recent, result: { ok: false, remaining: 0, retryAfterSeconds } };
  }
  recent.push(now);
  return { hits: recent, result: { ok: true, remaining: limit - recent.length, retryAfterSeconds: 0 } };
}

/** サービス層が使う回数制限。key は "user:{id}" や "channel:{id}"。 */
export interface RateLimiterApi {
  hit(key: string, limit: number, windowSeconds: number): Promise<RateLimitResult>;
}
