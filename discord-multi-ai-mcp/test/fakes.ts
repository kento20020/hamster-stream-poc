/** テスト用の偽の Discord・回数制限・設定 */
import type { Config } from "../src/config";
import { DiscordApiError, type DiscordApi, type WebhookExecuteInput } from "../src/discord/client";
import { snowflakeFromDate } from "../src/discord/snowflake";
import { ChannelType, type Channel, type Guild, type GuildMember, type Message, type ThreadList, type Webhook } from "../src/discord/types";
import type { RateLimiterApi, RateLimitResult } from "../src/guard/rate-limit";
import { Permission } from "../src/guard/permissions";

export const IDS = {
  guild: "100000000000000001",
  app: "100000000000000002",
  owner: "100000000000000003",
  category: "100000000000000010",
  otherCategory: "100000000000000011",
  ideas: "100000000000000020",
  summaries: "100000000000000021",
  chat: "100000000000000022",
  secret: "100000000000000023",
  outside: "100000000000000024",
  roleSpeak: "100000000000000030",
  roleSummary: "100000000000000031",
  roleSecret: "100000000000000032",
  alice: "100000000000000040",
  bob: "100000000000000041",
  carol: "100000000000000042",
  ken: "100000000000000043",
};

export function testConfig(overrides: Partial<Config> = {}): Config {
  return {
    publicUrl: "https://mcp.example.com",
    mcpResource: "https://mcp.example.com/mcp",
    guildId: IDS.guild,
    clientId: IDS.app,
    aiCategoryId: IDS.category,
    ideasChannelId: IDS.ideas,
    summariesChannelId: IDS.summaries,
    roleSpeakId: IDS.roleSpeak,
    roleSummaryId: IDS.roleSummary,
    aiKinds: [
      { id: "claude", label: "Claude" },
      { id: "chatgpt", label: "ChatGPT" },
      { id: "gemini", label: "Gemini" },
      { id: "muse", label: "Muse" },
    ],
    rateLimitUserPerMinute: 6,
    rateLimitChannelPerMinute: 20,
    logRetentionDays: 90,
    permissionCacheSeconds: 180,
    ...overrides,
  };
}

const EVERYONE_PERMS = (Permission.ViewChannel | Permission.ReadMessageHistory | Permission.SendMessages).toString();

export class FakeDiscord implements DiscordApi {
  // 1時間前の時刻から始まるID（my_mentions の期間の判定が本物と同じになるように）
  private nextId = BigInt(snowflakeFromDate(new Date(Date.now() - 3600_000)));
  guild: Guild = {
    id: IDS.guild,
    name: "テストサーバー",
    owner_id: IDS.owner,
    roles: [
      { id: IDS.guild, name: "@everyone", permissions: EVERYONE_PERMS, position: 0 },
      { id: IDS.roleSpeak, name: "AI-発言", permissions: "0", position: 1 },
      { id: IDS.roleSummary, name: "AI-まとめ", permissions: "0", position: 2 },
      { id: IDS.roleSecret, name: "運営", permissions: "0", position: 3 },
    ],
  };
  channels: Channel[] = [
    { id: IDS.category, type: ChannelType.GuildCategory, name: "AI用", guild_id: IDS.guild },
    { id: IDS.otherCategory, type: ChannelType.GuildCategory, name: "雑談", guild_id: IDS.guild },
    { id: IDS.ideas, type: ChannelType.GuildForum, name: "ideas", parent_id: IDS.category, guild_id: IDS.guild, position: 1 },
    { id: IDS.summaries, type: ChannelType.GuildForum, name: "summaries", parent_id: IDS.category, guild_id: IDS.guild, position: 2 },
    { id: IDS.chat, type: ChannelType.GuildText, name: "ai-chat", parent_id: IDS.category, guild_id: IDS.guild, position: 3 },
    {
      id: IDS.secret,
      type: ChannelType.GuildText,
      name: "ai-運営",
      parent_id: IDS.category,
      guild_id: IDS.guild,
      position: 4,
      permission_overwrites: [
        { id: IDS.guild, type: 0, allow: "0", deny: Permission.ViewChannel.toString() },
        { id: IDS.roleSecret, type: 0, allow: Permission.ViewChannel.toString(), deny: "0" },
      ],
    },
    { id: IDS.outside, type: ChannelType.GuildText, name: "雑談", parent_id: IDS.otherCategory, guild_id: IDS.guild },
  ];
  threads = new Map<string, Channel>();
  messages = new Map<string, Message[]>();
  members = new Map<string, GuildMember>();
  webhooks = new Map<string, Webhook[]>();
  executed: Array<{ webhookId: string; input: WebhookExecuteInput; message: Message }> = [];
  reactions: Array<{ channelId: string; messageId: string; emoji: string }> = [];
  calls: string[] = [];
  /** 次の executeWebhook を1回だけ 404 にする（Webhook が消された想定） */
  failNextWebhookWith404 = false;

  id(): string {
    this.nextId += 4194304n; // 1ms ぶん
    return this.nextId.toString();
  }

  addMember(userId: string, roles: string[], nick: string | null = null, globalName: string | null = null): void {
    this.members.set(userId, { roles, nick, user: { id: userId, username: `user${userId.slice(-2)}`, global_name: globalName } });
  }

  addThread(parentId: string, name: string, options: { locked?: boolean; archived?: boolean } = {}): Channel {
    const id = this.id();
    const thread: Channel = {
      id,
      type: ChannelType.PublicThread,
      name,
      parent_id: parentId,
      guild_id: IDS.guild,
      last_message_id: id,
      thread_metadata: { archived: options.archived ?? false, locked: options.locked ?? false },
    };
    this.threads.set(id, thread);
    this.messages.set(id, []);
    return thread;
  }

  addMessage(channelId: string, author: { id: string; name: string; bot?: boolean; webhook?: boolean }, content: string, extra: Partial<Message> = {}): Message {
    const id = extra.id ?? this.id();
    const message: Message = {
      id,
      channel_id: channelId,
      type: 0,
      author: { id: author.id, username: author.name, global_name: author.webhook ? null : author.name, bot: author.bot || author.webhook },
      content,
      timestamp: new Date().toISOString(),
      ...(author.webhook ? { webhook_id: "999" } : {}),
      ...extra,
    };
    const list = this.messages.get(channelId) ?? [];
    list.push(message);
    this.messages.set(channelId, list);
    const thread = this.threads.get(channelId);
    if (thread) thread.last_message_id = id;
    const channel = this.channels.find((c) => c.id === channelId);
    if (channel) channel.last_message_id = id;
    return message;
  }

  async getGuild(): Promise<Guild> {
    this.calls.push("getGuild");
    return structuredClone(this.guild);
  }

  async getGuildChannels(): Promise<Channel[]> {
    this.calls.push("getGuildChannels");
    return structuredClone(this.channels);
  }

  async getActiveThreads(): Promise<ThreadList> {
    this.calls.push("getActiveThreads");
    return { threads: [...this.threads.values()].filter((t) => !t.thread_metadata?.archived).map((t) => structuredClone(t)) };
  }

  async getArchivedPublicThreads(channelId: string): Promise<ThreadList> {
    return { threads: [...this.threads.values()].filter((t) => t.parent_id === channelId && t.thread_metadata?.archived) };
  }

  async getChannel(channelId: string): Promise<Channel> {
    this.calls.push(`getChannel:${channelId}`);
    const t = this.threads.get(channelId) ?? this.channels.find((c) => c.id === channelId);
    if (!t) throw new DiscordApiError(404, 10003, "Unknown Channel");
    return structuredClone(t);
  }

  async getMember(_guildId: string, userId: string): Promise<GuildMember> {
    this.calls.push(`getMember:${userId}`);
    const m = this.members.get(userId);
    if (!m) throw new DiscordApiError(404, 10007, "Unknown Member");
    return structuredClone(m);
  }

  async getMessages(channelId: string, options: { limit: number; before?: string; after?: string }): Promise<Message[]> {
    this.calls.push(`getMessages:${channelId}`);
    let list = [...(this.messages.get(channelId) ?? [])].sort((a, b) => (BigInt(a.id) < BigInt(b.id) ? -1 : 1));
    if (options.after) {
      list = list.filter((m) => BigInt(m.id) > BigInt(options.after!)).slice(0, options.limit);
    } else {
      if (options.before) list = list.filter((m) => BigInt(m.id) < BigInt(options.before!));
      list = list.slice(-options.limit);
    }
    // Discord と同じく新しい順で返す
    return structuredClone(list.reverse());
  }

  async getMessage(channelId: string, messageId: string): Promise<Message> {
    const m = this.messages.get(channelId)?.find((x) => x.id === messageId);
    if (!m) throw new DiscordApiError(404, 10008, "Unknown Message");
    return structuredClone(m);
  }

  async createThread(channelId: string, name: string): Promise<Channel> {
    this.calls.push(`createThread:${channelId}`);
    return this.addThread(channelId, name);
  }

  async addReaction(channelId: string, messageId: string, emoji: string): Promise<void> {
    const m = this.messages.get(channelId)?.find((x) => x.id === messageId);
    if (!m) throw new DiscordApiError(404, 10008, "Unknown Message");
    this.reactions.push({ channelId, messageId, emoji });
  }

  async listChannelWebhooks(channelId: string): Promise<Webhook[]> {
    this.calls.push(`listChannelWebhooks:${channelId}`);
    return structuredClone(this.webhooks.get(channelId) ?? []);
  }

  async createWebhook(channelId: string, name: string): Promise<Webhook> {
    this.calls.push(`createWebhook:${channelId}`);
    const hook: Webhook = { id: this.id(), type: 1, channel_id: channelId, name, token: `tok-${channelId}-${this.nextId}`, application_id: IDS.app };
    this.webhooks.set(channelId, [...(this.webhooks.get(channelId) ?? []), hook]);
    return structuredClone(hook);
  }

  async executeWebhook(webhookId: string, webhookToken: string, input: WebhookExecuteInput): Promise<Message> {
    if (this.failNextWebhookWith404) {
      this.failNextWebhookWith404 = false;
      throw new DiscordApiError(404, 10015, "Unknown Webhook");
    }
    const hook = [...this.webhooks.values()].flat().find((w) => w.id === webhookId && w.token === webhookToken);
    if (!hook || !hook.channel_id) throw new DiscordApiError(404, 10015, "Unknown Webhook");
    let channelId = hook.channel_id;
    if (input.threadName) {
      channelId = this.addThread(hook.channel_id, input.threadName).id;
    } else if (input.threadId) {
      const thread = this.threads.get(input.threadId);
      if (!thread || thread.parent_id !== hook.channel_id) throw new DiscordApiError(400, 10003, "Unknown Channel");
      if (thread.thread_metadata?.locked) throw new DiscordApiError(403, 160005, "Thread is locked");
      channelId = input.threadId;
    }
    // フォーラムの最初の発言はスレッドと同じID
    const forumStarter = Boolean(input.threadName);
    const message = this.addMessage(
      channelId,
      { id: webhookId, name: input.username, webhook: true },
      input.content,
      forumStarter ? { id: channelId } : {},
    );
    this.executed.push({ webhookId, input, message });
    return structuredClone(message);
  }
}

export class FakeRateLimiter implements RateLimiterApi {
  counts = new Map<string, number>();
  constructor(private readonly overrides: Record<string, number> = {}) {}
  async hit(key: string, limit: number): Promise<RateLimitResult> {
    const max = this.overrides[key] ?? limit;
    const n = (this.counts.get(key) ?? 0) + 1;
    if (n > max) return { ok: false, remaining: 0, retryAfterSeconds: 42 };
    this.counts.set(key, n);
    return { ok: true, remaining: max - n, retryAfterSeconds: 0 };
  }
}
