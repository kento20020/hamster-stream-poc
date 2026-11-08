import type { JsonStore } from "../kv";
import { DiscordApiError, DiscordErrorCode, type DiscordApi, type WebhookExecuteInput } from "./client";
import type { Message } from "./types";

const WEBHOOK_NAME = "AI投稿";

interface StoredWebhook {
  id: string;
  token: string;
}

/**
 * チャンネルごとに Webhook を1つ作って使い回す。スレッドへは親チャンネルの Webhook に thread_id を付けて投稿する。
 * KV の webhook:{channelId} に ID とトークンを置く（秘密として扱う）。消されていたら作り直す。
 */
export class WebhookManager {
  constructor(
    private readonly discord: DiscordApi,
    private readonly kv: JsonStore,
    /** この Bot のアプリケーションID。自分が作った Webhook だけを使う */
    private readonly applicationId: string,
  ) {}

  private key(channelId: string): string {
    return `webhook:${channelId}`;
  }

  async getFor(channelId: string, options: { refresh?: boolean } = {}): Promise<StoredWebhook> {
    if (!options.refresh) {
      const cached = await this.kv.get<StoredWebhook>(this.key(channelId));
      if (cached?.id && cached.token) return cached;
    }
    const existing = (await this.discord.listChannelWebhooks(channelId)).find(
      (w) => w.type === 1 && w.application_id === this.applicationId && typeof w.token === "string",
    );
    const hook = existing ?? (await this.discord.createWebhook(channelId, WEBHOOK_NAME));
    if (!hook.token) throw new Error("Discord が Webhook のトークンを返しませんでした");
    const stored = { id: hook.id, token: hook.token };
    await this.kv.put(this.key(channelId), stored);
    return stored;
  }

  /** channelId はスレッドの親（Webhook を持つチャンネル）。スレッドへは input.threadId で送る */
  async execute(channelId: string, input: WebhookExecuteInput): Promise<Message> {
    let hook = await this.getFor(channelId);
    try {
      return await this.discord.executeWebhook(hook.id, hook.token, input);
    } catch (err) {
      const gone =
        err instanceof DiscordApiError &&
        (err.code === DiscordErrorCode.UnknownWebhook || (err.status === 404 && err.code === undefined) || err.status === 401);
      if (!gone) throw err;
      // 誰かが Webhook を消した。作り直して1回だけ再試行する
      await this.kv.delete(this.key(channelId));
      hook = await this.getFor(channelId, { refresh: true });
      return this.discord.executeWebhook(hook.id, hook.token, input);
    }
  }
}
