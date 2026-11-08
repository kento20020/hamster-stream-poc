import type { Env } from "./env";

export interface AiKind {
  /** URLのパスに使う名前（/mcp/{id}） */
  id: string;
  /** 投稿名に使う表示名（「AさんのClaude（AI）」の Claude の部分） */
  label: string;
}

export interface Config {
  publicUrl: string;
  /** MCPのリソースURL（OAuthトークンの宛先）。/mcp/{AIの種類} はこの下にぶら下がる */
  mcpResource: string;
  guildId: string;
  clientId: string;
  aiCategoryId: string;
  ideasChannelId: string;
  summariesChannelId: string;
  roleSpeakId: string;
  roleSummaryId: string;
  aiKinds: AiKind[];
  rateLimitUserPerMinute: number;
  rateLimitChannelPerMinute: number;
  logRetentionDays: number;
  permissionCacheSeconds: number;
}

export class ConfigError extends Error {}

const SNOWFLAKE = /^\d{15,25}$/;

function requireSnowflake(env: Env, key: keyof Env): string {
  const value = String(env[key] ?? "").trim();
  if (!SNOWFLAKE.test(value)) {
    throw new ConfigError(`${String(key)} が設定されていません（DiscordのID：数字15〜25桁）`);
  }
  return value;
}

function intVar(env: Env, key: keyof Env, fallback: number, min: number): number {
  const raw = String(env[key] ?? "").trim();
  if (raw === "") return fallback;
  const n = Number.parseInt(raw, 10);
  if (!Number.isFinite(n) || n < min) {
    throw new ConfigError(`${String(key)} は ${min} 以上の整数にしてください（今: ${raw}）`);
  }
  return n;
}

export function parseAiKinds(raw: string): AiKind[] {
  const kinds: AiKind[] = [];
  const seen = new Set<string>();
  for (const part of raw.split(",")) {
    const trimmed = part.trim();
    if (!trimmed) continue;
    const [idRaw, ...labelParts] = trimmed.split(":");
    const id = (idRaw ?? "").trim().toLowerCase();
    const label = labelParts.join(":").trim() || id;
    if (!/^[a-z0-9][a-z0-9-]{0,31}$/.test(id)) {
      throw new ConfigError(`AI_KINDS の「${trimmed}」が不正です。パスは英小文字・数字・ハイフンにしてください`);
    }
    if (seen.has(id)) throw new ConfigError(`AI_KINDS に「${id}」が重複しています`);
    seen.add(id);
    kinds.push({ id, label });
  }
  if (kinds.length === 0) throw new ConfigError("AI_KINDS が空です");
  return kinds;
}

export function normalizePublicUrl(raw: string): string {
  let url: URL;
  try {
    url = new URL(raw.trim());
  } catch {
    throw new ConfigError(`PUBLIC_URL が URL になっていません（今: ${raw}）`);
  }
  const loopback = ["localhost", "127.0.0.1", "[::1]"].includes(url.hostname);
  if (url.protocol !== "https:" && !(url.protocol === "http:" && loopback)) {
    throw new ConfigError("PUBLIC_URL は https にしてください（http はローカル開発の localhost だけ）");
  }
  if (url.pathname !== "/" || url.search || url.hash) {
    throw new ConfigError("PUBLIC_URL はオリジンだけにしてください（例: https://mcp.example.com）");
  }
  return url.origin;
}

let cache: { env: Env; config: Config } | undefined;

/** env から設定を読む。必須の値が欠けていたら ConfigError。 */
export function loadConfig(env: Env): Config {
  if (cache && cache.env === env) return cache.config;
  const publicUrl = normalizePublicUrl(env.PUBLIC_URL ?? "");
  const config: Config = {
    publicUrl,
    mcpResource: `${publicUrl}/mcp`,
    guildId: requireSnowflake(env, "DISCORD_GUILD_ID"),
    clientId: requireSnowflake(env, "DISCORD_CLIENT_ID"),
    aiCategoryId: requireSnowflake(env, "AI_CATEGORY_ID"),
    ideasChannelId: requireSnowflake(env, "IDEAS_CHANNEL_ID"),
    summariesChannelId: requireSnowflake(env, "SUMMARIES_CHANNEL_ID"),
    roleSpeakId: requireSnowflake(env, "ROLE_SPEAK_ID"),
    roleSummaryId: requireSnowflake(env, "ROLE_SUMMARY_ID"),
    aiKinds: parseAiKinds(env.AI_KINDS ?? ""),
    rateLimitUserPerMinute: intVar(env, "RATE_LIMIT_USER_PER_MINUTE", 6, 1),
    rateLimitChannelPerMinute: intVar(env, "RATE_LIMIT_CHANNEL_PER_MINUTE", 20, 1),
    logRetentionDays: intVar(env, "LOG_RETENTION_DAYS", 90, 1),
    permissionCacheSeconds: intVar(env, "PERMISSION_CACHE_SECONDS", 180, 60),
  };
  for (const key of ["DISCORD_BOT_TOKEN", "DISCORD_CLIENT_SECRET"] as const) {
    if (!env[key]) throw new ConfigError(`秘密情報 ${key} が入っていません（wrangler secret put ${key}）`);
  }
  if (!env.COOKIE_SECRET || env.COOKIE_SECRET.length < 32) {
    throw new ConfigError("秘密情報 COOKIE_SECRET は32文字以上にしてください（wrangler secret put COOKIE_SECRET）");
  }
  cache = { env, config };
  return config;
}

export function findAiKind(config: Config, id: string): AiKind | undefined {
  return config.aiKinds.find((k) => k.id === id);
}
