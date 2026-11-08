import { DurableObject } from "cloudflare:workers";
import type { Env } from "../env";
import { slidingWindow, type RateLimitResult, type RateLimiterApi } from "./rate-limit";

/**
 * 1つのキー（ユーザー1人、またはチャンネル1つ）ごとに1つ作られる Durable Object。
 * 同じキーへの呼び出しは1か所で順番に処理されるので、同時に投稿されても数え漏れが起きない。
 */
export class RateLimiter extends DurableObject<Env> {
  async hit(limit: number, windowSeconds: number): Promise<RateLimitResult> {
    const now = Date.now();
    const windowMs = windowSeconds * 1000;
    const stored = (await this.ctx.storage.get<number[]>("hits")) ?? [];
    const { hits, result } = slidingWindow(stored, now, limit, windowMs);
    await this.ctx.storage.put("hits", hits);
    // 使われなくなったら記録を消す（短期間だけ持つ）
    await this.ctx.storage.setAlarm(now + windowMs + 1000);
    return result;
  }

  override async alarm(): Promise<void> {
    await this.ctx.storage.deleteAll();
  }
}

export class DurableObjectRateLimiter implements RateLimiterApi {
  constructor(private readonly namespace: DurableObjectNamespace<RateLimiter>) {}

  async hit(key: string, limit: number, windowSeconds: number): Promise<RateLimitResult> {
    const stub = this.namespace.get(this.namespace.idFromName(key));
    return stub.hit(limit, windowSeconds);
  }
}
