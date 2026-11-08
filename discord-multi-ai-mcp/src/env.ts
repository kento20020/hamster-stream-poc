import type { RateLimiter } from "./guard/rate-limit-do";

/** Worker のバインディングと設定値。wrangler.jsonc の vars と `wrangler secret put` の秘密情報。 */
export interface Env {
  // バインディング
  OAUTH_KV: KVNamespace;
  KV: KVNamespace;
  DB: D1Database;
  RATE_LIMITER: DurableObjectNamespace<RateLimiter>;

  // vars（秘密ではない設定）
  PUBLIC_URL: string;
  DISCORD_GUILD_ID: string;
  DISCORD_CLIENT_ID: string;
  AI_CATEGORY_ID: string;
  IDEAS_CHANNEL_ID: string;
  SUMMARIES_CHANNEL_ID: string;
  ROLE_SPEAK_ID: string;
  ROLE_SUMMARY_ID: string;
  AI_KINDS: string;
  RATE_LIMIT_USER_PER_MINUTE: string;
  RATE_LIMIT_CHANNEL_PER_MINUTE: string;
  LOG_RETENTION_DAYS: string;
  PERMISSION_CACHE_SECONDS: string;

  // Workers Secrets（コードやリポジトリに置かない）
  DISCORD_BOT_TOKEN: string;
  DISCORD_CLIENT_SECRET: string;
  COOKIE_SECRET: string;
}

/** OAuth の props（completeAuthorization で暗号化して保存され、毎回の呼び出しで復号される）。 */
export interface AuthProps {
  /** Discord ユーザーID */
  userId: string;
  /** Discord のユーザー名（@で始まる一意の名前） */
  username: string;
  /** ログイン時点の表示名（サーバーのニックネーム > グローバル表示名 > ユーザー名） */
  displayName: string;
  /** どの方法で接続したか */
  via: "oauth" | "pat";
  /** 個人トークン（PAT）の場合だけ：そのトークンに結び付いたAIの種類 */
  patAiKind?: string;
}
