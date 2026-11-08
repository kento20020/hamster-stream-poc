import type {
  AllowedMentions,
  Channel,
  DiscordUser,
  Guild,
  GuildMember,
  Message,
  ThreadList,
  Webhook,
} from "./types";

const API_BASE = "https://discord.com/api/v10";
const USER_AGENT = "DiscordBot (https://github.com/kento20020/discord-multi-ai-mcp, 0.1.0)";

/** Discord が 429 を返し、待ち時間がサーバー側で待てる長さを超えたとき。 */
export class DiscordRateLimitError extends Error {
  constructor(
    readonly retryAfterSeconds: number,
    readonly global: boolean,
  ) {
    super(`Discord rate limited (retry after ${retryAfterSeconds}s)`);
  }
}

/** Discord が 2xx 以外を返したとき。code は Discord の JSON エラーコード（例: 10003 Unknown Channel）。 */
export class DiscordApiError extends Error {
  constructor(
    readonly status: number,
    readonly code: number | undefined,
    message: string,
  ) {
    super(`Discord API ${status}${code !== undefined ? ` (${code})` : ""}: ${message}`);
  }
}

/** Discord の JSON エラーコードのうち、扱いを変えるもの */
export const DiscordErrorCode = {
  UnknownChannel: 10003,
  UnknownMember: 10007,
  UnknownMessage: 10008,
  UnknownWebhook: 10015,
  UnknownUser: 10013,
  MissingAccess: 50001,
  MissingPermissions: 50013,
  ThreadArchived: 50083,
  ThreadLocked: 160005,
} as const;

export interface WebhookExecuteInput {
  content: string;
  username: string;
  avatarUrl?: string;
  threadId?: string;
  /** フォーラムチャンネルで新しい投稿（スレッド）を作るときの名前 */
  threadName?: string;
  allowedMentions?: AllowedMentions;
}

/** サービス層が使う Discord の操作。テストではこれを差し替える。 */
export interface DiscordApi {
  getGuild(guildId: string): Promise<Guild>;
  getGuildChannels(guildId: string): Promise<Channel[]>;
  getActiveThreads(guildId: string): Promise<ThreadList>;
  getArchivedPublicThreads(channelId: string, limit: number): Promise<ThreadList>;
  getChannel(channelId: string): Promise<Channel>;
  getMember(guildId: string, userId: string): Promise<GuildMember>;
  getMessages(
    channelId: string,
    options: { limit: number; before?: string; after?: string },
  ): Promise<Message[]>;
  getMessage(channelId: string, messageId: string): Promise<Message>;
  createThread(channelId: string, name: string): Promise<Channel>;
  addReaction(channelId: string, messageId: string, emoji: string): Promise<void>;
  listChannelWebhooks(channelId: string): Promise<Webhook[]>;
  createWebhook(channelId: string, name: string): Promise<Webhook>;
  executeWebhook(webhookId: string, webhookToken: string, input: WebhookExecuteInput): Promise<Message>;
}

export interface DiscordClientOptions {
  fetch?: typeof fetch;
  sleep?: (ms: number) => Promise<void>;
  /** 429 のとき、この長さまではサーバー側で待って再試行する */
  maxWaitMs?: number;
  maxRetries?: number;
}

type Auth = { kind: "bot" } | { kind: "bearer"; token: string } | { kind: "none" };

interface RequestOptions {
  query?: Record<string, string | number | boolean | undefined>;
  body?: unknown;
  auth?: Auth;
  /** 監査ログ（Discord側）に残る理由 */
  reason?: string;
}

const defaultSleep = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

/** Discord REST API の薄いクライアント。429 の待ち時間を守って再試行する。 */
export class DiscordClient implements DiscordApi {
  private readonly fetchImpl: typeof fetch;
  private readonly sleep: (ms: number) => Promise<void>;
  private readonly maxWaitMs: number;
  private readonly maxRetries: number;

  constructor(
    private readonly botToken: string,
    options: DiscordClientOptions = {},
  ) {
    this.fetchImpl = options.fetch ?? ((input, init) => fetch(input, init));
    this.sleep = options.sleep ?? defaultSleep;
    this.maxWaitMs = options.maxWaitMs ?? 5000;
    this.maxRetries = options.maxRetries ?? 3;
  }

  async request<T>(method: string, path: string, options: RequestOptions = {}): Promise<T> {
    const url = new URL(API_BASE + path);
    for (const [key, value] of Object.entries(options.query ?? {})) {
      if (value !== undefined) url.searchParams.set(key, String(value));
    }
    const headers = new Headers({ "User-Agent": USER_AGENT });
    const auth = options.auth ?? { kind: "bot" };
    if (auth.kind === "bot") headers.set("Authorization", `Bot ${this.botToken}`);
    if (auth.kind === "bearer") headers.set("Authorization", `Bearer ${auth.token}`);
    if (options.body !== undefined) headers.set("Content-Type", "application/json");
    if (options.reason) headers.set("X-Audit-Log-Reason", encodeURIComponent(options.reason));

    let serverErrorRetried = false;
    for (let attempt = 0; ; attempt++) {
      const res = await this.fetchImpl(url.toString(), {
        method,
        headers,
        body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
      });

      if (res.status === 429) {
        const data = (await res.json().catch(() => ({}))) as { retry_after?: number; global?: boolean };
        const header = Number(res.headers.get("Retry-After"));
        const retryAfter = typeof data.retry_after === "number" ? data.retry_after : Number.isFinite(header) ? header : 1;
        const waitMs = Math.ceil(retryAfter * 1000);
        if (waitMs <= this.maxWaitMs && attempt < this.maxRetries) {
          await this.sleep(waitMs);
          continue;
        }
        throw new DiscordRateLimitError(Math.max(1, Math.ceil(retryAfter)), Boolean(data.global));
      }

      if (res.status >= 500 && !serverErrorRetried) {
        serverErrorRetried = true;
        await this.sleep(500);
        continue;
      }

      if (res.status === 204) return undefined as T;

      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as { code?: number; message?: string };
        throw new DiscordApiError(res.status, data.code, data.message ?? res.statusText);
      }
      return (await res.json()) as T;
    }
  }

  // ---- ユーザーのアクセストークンで呼ぶもの（ログイン時だけ） ----

  getCurrentUser(userAccessToken: string): Promise<DiscordUser> {
    return this.request("GET", "/users/@me", { auth: { kind: "bearer", token: userAccessToken } });
  }

  getCurrentUserMember(userAccessToken: string, guildId: string): Promise<GuildMember> {
    return this.request("GET", `/users/@me/guilds/${guildId}/member`, {
      auth: { kind: "bearer", token: userAccessToken },
    });
  }

  // ---- Bot トークンで呼ぶもの ----

  getGuild(guildId: string): Promise<Guild> {
    return this.request("GET", `/guilds/${guildId}`);
  }

  getGuildChannels(guildId: string): Promise<Channel[]> {
    return this.request("GET", `/guilds/${guildId}/channels`);
  }

  getActiveThreads(guildId: string): Promise<ThreadList> {
    return this.request("GET", `/guilds/${guildId}/threads/active`);
  }

  getArchivedPublicThreads(channelId: string, limit: number): Promise<ThreadList> {
    return this.request("GET", `/channels/${channelId}/threads/archived/public`, { query: { limit } });
  }

  getChannel(channelId: string): Promise<Channel> {
    return this.request("GET", `/channels/${channelId}`);
  }

  getMember(guildId: string, userId: string): Promise<GuildMember> {
    return this.request("GET", `/guilds/${guildId}/members/${userId}`);
  }

  getMessages(channelId: string, options: { limit: number; before?: string; after?: string }): Promise<Message[]> {
    return this.request("GET", `/channels/${channelId}/messages`, {
      query: { limit: Math.min(100, Math.max(1, options.limit)), before: options.before, after: options.after },
    });
  }

  getMessage(channelId: string, messageId: string): Promise<Message> {
    return this.request("GET", `/channels/${channelId}/messages/${messageId}`);
  }

  /** 普通のチャンネルに公開スレッドを作る（フォーラムは Webhook の thread_name で作る） */
  createThread(channelId: string, name: string): Promise<Channel> {
    return this.request("POST", `/channels/${channelId}/threads`, {
      body: { name, type: 11, auto_archive_duration: 10080 },
      reason: "AIのお題・まとめスレッド",
    });
  }

  async addReaction(channelId: string, messageId: string, emoji: string): Promise<void> {
    await this.request("PUT", `/channels/${channelId}/messages/${messageId}/reactions/${encodeURIComponent(emoji)}/@me`);
  }

  listChannelWebhooks(channelId: string): Promise<Webhook[]> {
    return this.request("GET", `/channels/${channelId}/webhooks`);
  }

  createWebhook(channelId: string, name: string): Promise<Webhook> {
    return this.request("POST", `/channels/${channelId}/webhooks`, {
      body: { name },
      reason: "AI名義で投稿するためのWebhook",
    });
  }

  executeWebhook(webhookId: string, webhookToken: string, input: WebhookExecuteInput): Promise<Message> {
    return this.request("POST", `/webhooks/${webhookId}/${webhookToken}`, {
      auth: { kind: "none" },
      query: { wait: true, thread_id: input.threadId },
      body: {
        content: input.content,
        username: input.username,
        avatar_url: input.avatarUrl,
        thread_name: input.threadName,
        // @everyone・@here・ロール・ユーザーへの通知を一切飛ばさない
        allowed_mentions: input.allowedMentions ?? { parse: [] },
      },
    });
  }
}
