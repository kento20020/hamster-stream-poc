/**
 * MCPエンドポイント（リソースサーバー）。
 * トークンの宛先は /mcp ひとつにし、/mcp/{AIの種類} をその下にぶら下げる。
 * どのAIからの呼び出しかはURLのパスで決まる。
 */
import { OAuthResourceServer, type OAuthResourceContext } from "@cloudflare/workers-oauth-provider";
import { createMcpHandler } from "agents/mcp/server";
import { D1AuditStore } from "../audit/store";
import { getAuthorizationServer, MCP_SCOPE } from "../auth/authorization";
import { PAT_PREFIX, validatePat } from "../auth/pat";
import { findAiKind, loadConfig, type Config } from "../config";
import { DiscordClient } from "../discord/client";
import type { AuthProps, Env } from "../env";
import { DurableObjectRateLimiter } from "../guard/rate-limit-do";
import { KvJsonStore } from "../kv";
import { DiscordAiService } from "../service";
import { mcpUrl } from "../web/pages";
import { buildMcpServer } from "./server";

const KIND_PATH = /^\/mcp\/([a-z0-9][a-z0-9-]{0,31})\/?$/;

export function aiKindFromPath(pathname: string): string | undefined {
  return KIND_PATH.exec(pathname)?.[1];
}

function json(status: number, body: unknown): Response {
  return new Response(JSON.stringify(body, null, 2), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8" },
  });
}

async function handleMcp(request: Request, env: Env, ctx: OAuthResourceContext<AuthProps>): Promise<Response> {
  const cfg = loadConfig(env);
  const url = new URL(request.url);
  const kindId = aiKindFromPath(url.pathname);
  const kind = kindId ? findAiKind(cfg, kindId) : undefined;
  if (!kind) {
    return json(404, {
      error: "unknown_ai_kind",
      message: "接続URLは /mcp/{AIの種類} です。",
      urls: cfg.aiKinds.map((k) => ({ ai: k.label, url: mcpUrl(cfg, k.id) })),
    });
  }
  const props = ctx.props;
  const service = new DiscordAiService(
    {
      config: cfg,
      discord: new DiscordClient(env.DISCORD_BOT_TOKEN),
      kv: new KvJsonStore(env.KV),
      audit: new D1AuditStore(env.DB),
      rateLimiter: new DurableObjectRateLimiter(env.RATE_LIMITER),
    },
    { userId: props.userId, username: props.username, displayName: props.displayName, aiKind: kind },
  );
  const handler = createMcpHandler(() => buildMcpServer(service), {
    route: url.pathname,
    allowedHostnames: [new URL(cfg.publicUrl).hostname],
  });
  return handler(request, env, ctx);
}

let cached: { key: string; server: OAuthResourceServer<Env, AuthProps> } | undefined;

export function getResourceServer(cfg: Config): OAuthResourceServer<Env, AuthProps> {
  const key = `${cfg.publicUrl}|${cfg.mcpResource}`;
  if (cached?.key === key) return cached.server;
  const authorizationServer = getAuthorizationServer(cfg);
  const server = new OAuthResourceServer<Env, AuthProps>({
    resourceMetadata: {
      resource: cfg.mcpResource,
      authorization_servers: [cfg.publicUrl],
      bearer_methods_supported: ["header"],
      resource_name: "Discord マルチAI",
    },
    requiredScopes: [MCP_SCOPE],
    validateToken: (env, request) => async (resource, token) => {
      // 個人用トークン（Muse など）。形で見分けて、自分で検証する
      if (token.startsWith(PAT_PREFIX)) {
        const props = await validatePat(new KvJsonStore(env.KV), token, aiKindFromPath(new URL(request.url).pathname));
        return props ? { props, audience: resource, scope: [MCP_SCOPE], userId: props.userId } : null;
      }
      return authorizationServer.validateToken<AuthProps>(resource, token, env);
    },
    handler: { fetch: handleMcp },
  });
  cached = { key, server };
  return server;
}
