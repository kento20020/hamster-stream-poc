/**
 * 認可サーバー（AIアプリにMCP用のトークンを発行する）。ログインそのものは Discord OAuth に任せる。
 *
 * 流れ：/authorize（同意画面）→ Discord ログイン → /callback（メンバー確認）→ AIアプリへ戻る
 * 同意を先に取ってから Discord に送るので、別のクライアントが前回の許可に便乗する「混乱した代理」問題を防げる。
 */
import {
  AuthorizationError,
  authorizationErrorRedirect,
  OAuthAuthorizationServer,
  type ConsentDescription,
} from "@cloudflare/workers-oauth-provider";
import type { Config } from "../config";
import type { AuthProps, Env } from "../env";
import { errorPage, html, page } from "../web/html";
import { completeDiscordLogin, discordAuthorizeUrl } from "./discord-oauth";

export const MCP_SCOPE = "mcp";

let cached: { key: string; server: OAuthAuthorizationServer<Env> } | undefined;

export function getAuthorizationServer(cfg: Config): OAuthAuthorizationServer<Env> {
  const key = `${cfg.publicUrl}|${cfg.mcpResource}`;
  if (cached?.key === key) return cached.server;
  const server = new OAuthAuthorizationServer<Env>({
    issuer: cfg.publicUrl,
    resources: [cfg.mcpResource],
    defaultResource: cfg.mcpResource,
    scopesSupported: [MCP_SCOPE],
    // Claude などが使う Client ID Metadata Document と、古いクライアント向けの動的登録の両方に対応
    clientIdMetadataDocumentEnabled: true,
    clientRegistrationEndpoint: "/oauth/register",
    accessTokenTTL: 60 * 60,
    refreshTokenTTL: 60 * 60 * 24 * 30,
  });
  cached = { key, server };
  return server;
}

function consentPage(details: ConsentDescription, handle: string, headers: Headers): Response {
  return page(
    "接続の確認",
    html`<h1>AIアプリの接続を許可しますか？</h1>
      <div class="card">
        <p><strong>${details.clientName}</strong>${details.clientDomain ? html`（<span class="mono">${details.clientDomain}</span>）` : ""}
          が、あなたのDiscordアカウントでこのサーバーのAI用チャンネルを読み書きしようとしています。</p>
        <p>許可すると、接続の情報が <strong class="mono">${details.redirectHost}</strong> に送られます。</p>
        ${details.redirectIsLoopback
          ? html`<p class="warn">送り先はこのパソコンの中のアプリです。自分で起動したアプリか確かめてください。</p>`
          : ""}
        ${details.clientDomain ? "" : html`<p class="muted">アプリの名前は、アプリが自分で名乗っているものです。心当たりがない場合は許可しないでください。</p>`}
        <ul class="muted">
          <li>投稿は「あなたの名前の○○（AI）」という名義で出ます</li>
          <li>できることは、あなたのDiscordのロール（AI-発言・AI-まとめ）で決まります</li>
          <li>次の画面でDiscordにログインし、サーバーのメンバーか確かめます</li>
        </ul>
      </div>
      <form method="post" action="/authorize" class="row">
        <input type="hidden" name="handle" value="${handle}">
        <button class="primary" name="decision" value="approve">Discordでログインして許可</button>
        <button name="decision" value="deny">許可しない</button>
      </form>`,
    { headers },
  );
}

function authError(err: unknown): Response {
  if (err instanceof AuthorizationError) {
    // ライブラリが送り先を確かめたときだけ、クライアントにリダイレクトする
    if (err.redirectTo) return Response.redirect(err.redirectTo, 302);
    return errorPage("接続できません", err.description ?? "認可リクエストが正しくありません。");
  }
  throw err;
}

export async function handleAuthorize(request: Request, env: Env, cfg: Config): Promise<Response> {
  const oauth = getAuthorizationServer(cfg).getOAuthApi(env);
  try {
    if (request.method === "GET") {
      const authRequest = await oauth.parseAuthRequest(request);
      const details = await oauth.describeConsent(authRequest);
      const consent = await oauth.beginConsent(authRequest);
      return consentPage(details, consent.handle, consent.headers);
    }
    if (request.method !== "POST") return new Response("Method Not Allowed", { status: 405 });

    const form = await request.formData();
    const handle = String(form.get("handle") ?? "");
    if (form.get("decision") !== "approve") {
      const denied = await oauth.denyConsent(request, handle);
      return new Response(null, { status: 302, headers: denied.headers });
    }
    const approved = await oauth.approveConsent(request, handle, { scope: [MCP_SCOPE] });
    const { state, headers } = await oauth.beginUpstream(approved.request, { headers: approved.headers });
    headers.set("Location", discordAuthorizeUrl(cfg, `${cfg.publicUrl}/callback`, state));
    return new Response(null, { status: 302, headers });
  } catch (err) {
    return authError(err);
  }
}

export async function handleCallback(request: Request, env: Env, cfg: Config, ctx: ExecutionContext): Promise<Response> {
  const oauth = getAuthorizationServer(cfg).getOAuthApi(env);
  try {
    const { request: original, headers } = await oauth.finishUpstream(request);
    const url = new URL(request.url);
    const code = url.searchParams.get("code");
    if (!code) {
      // Discord 側で「キャンセル」が押された。AIアプリに access_denied で戻す
      const redirect = new Headers(headers);
      redirect.set("Location", authorizationErrorRedirect(original, "access_denied", "Discordでのログインがキャンセルされました"));
      return new Response(null, { status: 302, headers: redirect });
    }
    const login = await completeDiscordLogin(cfg, env.DISCORD_CLIENT_SECRET, code, `${cfg.publicUrl}/callback`, (p) => ctx.waitUntil(p));
    if (!login.ok) {
      return login.reason === "not_member"
        ? errorPage("使えません", "このDiscordアカウントは対象のサーバーのメンバーではありません。", 403)
        : errorPage("ログインに失敗しました", "Discordでのログインに失敗しました。AIアプリからもう一度接続してください。", 502);
    }
    const props: AuthProps = {
      userId: login.user.id,
      username: login.user.username,
      displayName: login.displayName,
      via: "oauth",
    };
    const { redirectTo } = await oauth.completeAuthorization({
      request: original,
      userId: login.user.id,
      metadata: { username: login.user.username },
      scope: original.scope.length ? original.scope : [MCP_SCOPE],
      props,
    });
    headers.set("Location", redirectTo);
    return new Response(null, { status: 302, headers });
  } catch (err) {
    return authError(err);
  }
}
