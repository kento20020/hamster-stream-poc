/**
 * Discord マルチAI MCPサーバー（Cloudflare Workers）。
 *
 * Worker 1つの中を4層に分けている：
 *   入口     … OAuth（認可サーバー＋リソースサーバー）と個人用トークン。/mcp/{AIの種類} でAIを見分ける
 *   セッション … リクエストごとに MCP サーバーを作る（createMcpHandler。状態はD1/KV/DOに置く）
 *   ガード   … 本人確認・レベル・AI用カテゴリ・閲覧権限・回数制限・入力の検証（service.ts）
 *   実行     … Discord REST / Webhook / 監査ログ
 */
import { D1AuditStore } from "./audit/store";
import { getAuthorizationServer, handleAuthorize, handleCallback } from "./auth/authorization";
import { handleTokens } from "./auth/token-pages";
import { ConfigError, loadConfig, type Config } from "./config";
import type { Env } from "./env";
import { getResourceServer } from "./mcp/endpoint";
import { errorPage } from "./web/html";
import { homePage } from "./web/pages";

export { RateLimiter } from "./guard/rate-limit-do";

const PRM_PREFIX = "/.well-known/oauth-protected-resource";

/**
 * 保護リソースのメタデータは /.well-known/oauth-protected-resource/mcp にある。
 * クライアントによってはパスを付けずに、または /mcp/claude を付けて探しに来るので、同じものを返す。
 */
function normalizeMetadataRequest(request: Request, url: URL): Request {
  if (url.pathname === PRM_PREFIX || url.pathname.startsWith(`${PRM_PREFIX}/mcp/`)) {
    const rewritten = new URL(url);
    rewritten.pathname = `${PRM_PREFIX}/mcp`;
    return new Request(rewritten, request);
  }
  return request;
}

async function route(request: Request, env: Env, ctx: ExecutionContext, cfg: Config): Promise<Response> {
  const url = new URL(request.url);
  const path = url.pathname;

  if (path === "/" && request.method === "GET") return homePage(cfg);
  if (path === "/authorize") return handleAuthorize(request, env, cfg);
  if (path === "/callback") return handleCallback(request, env, cfg, ctx);
  if (path === "/tokens" || path.startsWith("/tokens/")) return handleTokens(request, env, cfg, ctx);
  if (path === "/mcp" || path.startsWith("/mcp/") || path.startsWith(PRM_PREFIX)) {
    return getResourceServer(cfg).fetch(normalizeMetadataRequest(request, url), env, ctx);
  }
  // /.well-known/oauth-authorization-server, /oauth/token, /oauth/register など
  return getAuthorizationServer(cfg).fetch(request, env, ctx);
}

export default {
  async fetch(request, env, ctx): Promise<Response> {
    let cfg: Config;
    try {
      cfg = loadConfig(env);
    } catch (err) {
      if (err instanceof ConfigError) {
        console.error("config error:", err.message);
        return errorPage("設定が足りません", `サーバーの設定に問題があります：${err.message}`, 500);
      }
      throw err;
    }
    try {
      return await route(request, env, ctx, cfg);
    } catch (err) {
      console.error("unhandled error", err);
      return errorPage("エラー", "サーバーで予期しないエラーが起きました。少し待ってからもう一度試してください。", 500);
    }
  },

  /** 毎日：古い書き込みログと、期限切れのOAuthデータを消す */
  async scheduled(_controller, env, ctx): Promise<void> {
    const cfg = loadConfig(env);
    const cutoff = Date.now() - cfg.logRetentionDays * 24 * 60 * 60 * 1000;
    const deleted = await new D1AuditStore(env.DB).purgeLogsOlderThan(cutoff);
    console.log(`purged ${deleted} audit log rows older than ${cfg.logRetentionDays} days`);
    ctx.waitUntil(getAuthorizationServer(cfg).purgeExpiredData(env).then((r) => console.log("oauth purge", JSON.stringify(r))));
  },
} satisfies ExportedHandler<Env>;
