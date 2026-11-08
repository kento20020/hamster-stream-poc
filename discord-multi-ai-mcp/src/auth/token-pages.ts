/**
 * /tokens：個人用トークン（Muse など向け）の発行・失効と、投稿名・AIアイコンの設定。
 * このページ自体も Discord でログインし、サーバーのメンバーだけが使える。
 */
import type { Config } from "../config";
import type { Env } from "../env";
import { isHttpsUrl } from "../guard/validate";
import { KvJsonStore, type UserSettings } from "../kv";
import { errorPage, html, page } from "../web/html";
import { mcpUrl } from "../web/pages";
import {
  checkCsrf,
  cookie,
  csrfToken,
  LOGIN_STATE_COOKIE,
  randomToken,
  readCookie,
  readSession,
  SESSION_COOKIE,
  signValue,
  verifyValue,
  type Session,
} from "../web/session";
import { completeDiscordLogin, discordAuthorizeUrl } from "./discord-oauth";
import { createPat, listPats, revokePat } from "./pat";

const SESSION_SECONDS = 60 * 60;

function redirect(location: string, setCookies: string[] = []): Response {
  const headers = new Headers({ Location: location, "Cache-Control": "no-store" });
  for (const c of setCookies) headers.append("Set-Cookie", c);
  return new Response(null, { status: 303, headers });
}

async function tokensPage(cfg: Config, env: Env, session: Session, flash?: { token?: string; aiKind?: string; message?: string }): Promise<Response> {
  const kv = new KvJsonStore(env.KV);
  const [tokens, settings] = await Promise.all([listPats(kv, session.uid), kv.get<UserSettings>(`user:${session.uid}`)]);
  const csrf = await csrfToken(env.COOKIE_SECRET, session);
  const labelOf = (id: string) => cfg.aiKinds.find((k) => k.id === id)?.label ?? id;

  return page(
    "個人用トークンと投稿名",
    html`<h1>個人用トークンと投稿名</h1>
      <div class="row muted">${session.name}（@${session.username}）としてログイン中
        <form method="post" action="/tokens/logout"><input type="hidden" name="csrf" value="${csrf}"><button>ログアウト</button></form></div>

      ${flash?.message ? html`<div class="card"><p class="ok">${flash.message}</p></div>` : ""}
      ${flash?.token
        ? html`<div class="card">
            <p><strong>新しいトークン</strong>（この画面を閉じると二度と表示されません。今すぐAIアプリに登録してください）</p>
            <code class="token">${flash.token}</code>
            <p>接続URL：<code>${mcpUrl(cfg, flash.aiKind ?? "")}</code></p>
            <p class="muted">AIアプリでは「Authorization: Bearer トークン」として送る設定にしてください。このトークンはこのURL（${labelOf(flash.aiKind ?? "")}）でだけ使えます。</p>
          </div>`
        : ""}

      <h2>個人用トークン</h2>
      <p class="muted">OAuthで接続できるアプリ（Claude・ChatGPTなど）には不要です。トークンを持っている人は誰でもあなたの名義で使えるので、人に見せないでください。</p>
      <div class="card">
        ${tokens.length === 0
          ? html`<p class="muted">まだ発行していません。</p>`
          : html`<table>
              <tr><th>名前</th><th>AI</th><th>発行日</th><th></th></tr>
              ${tokens.map(
                (t) => html`<tr>
                  <td>${t.label}<br><span class="muted mono">…${t.hint}</span></td>
                  <td>${labelOf(t.aiKind)}</td>
                  <td>${new Date(t.createdAt).toISOString().slice(0, 10)}</td>
                  <td><form method="post" action="/tokens/revoke">
                    <input type="hidden" name="csrf" value="${csrf}">
                    <input type="hidden" name="hash" value="${t.hash}">
                    <button>失効させる</button></form></td>
                </tr>`,
              )}
            </table>`}
      </div>
      <form method="post" action="/tokens/create" class="card">
        <input type="hidden" name="csrf" value="${csrf}">
        <label for="ai">AIの種類</label>
        <select id="ai" name="ai_kind">${cfg.aiKinds.map((k) => html`<option value="${k.id}">${k.label}</option>`)}</select>
        <label for="label">トークンの名前（自分用のメモ）</label>
        <input id="label" name="label" maxlength="40" placeholder="例: スマホのMuse" required>
        <p><button class="primary">発行する</button></p>
      </form>

      <h2>投稿名とアイコン</h2>
      <form method="post" action="/tokens/settings" class="card">
        <input type="hidden" name="csrf" value="${csrf}">
        <label for="dn">投稿名に使う名前（空ならサーバーのニックネーム）</label>
        <input id="dn" name="display_name" maxlength="32" value="${settings?.displayName ?? ""}" placeholder="${session.name}">
        <p class="muted">投稿は「名前のClaude（AI）」のように出ます。</p>
        ${cfg.aiKinds.map(
          (k) => html`<label for="av-${k.id}">${k.label} のアイコン画像URL（https、任意）</label>
            <input id="av-${k.id}" name="avatar_${k.id}" maxlength="300" value="${settings?.avatars?.[k.id] ?? ""}" placeholder="https://...">`,
        )}
        <p><button class="primary">保存する</button></p>
      </form>
      <p class="muted"><a href="/">接続URLの一覧へ</a></p>`,
  );
}

export async function handleTokens(request: Request, env: Env, cfg: Config, ctx: ExecutionContext): Promise<Response> {
  const url = new URL(request.url);
  const path = url.pathname.replace(/\/+$/, "") || "/tokens";
  const secret = env.COOKIE_SECRET;

  if (path === "/tokens/login" && request.method === "GET") {
    const state = randomToken(24);
    const signed = await signValue(secret, { state, exp: Date.now() + 10 * 60 * 1000 });
    return redirect(discordAuthorizeUrl(cfg, `${cfg.publicUrl}/tokens/callback`, state), [cookie(LOGIN_STATE_COOKIE, signed, 600)]);
  }

  if (path === "/tokens/callback" && request.method === "GET") {
    const saved = await verifyValue<{ state: string; exp: number }>(secret, readCookie(request, LOGIN_STATE_COOKIE));
    const state = url.searchParams.get("state");
    const clearState = cookie(LOGIN_STATE_COOKIE, "", 0);
    if (!saved || saved.exp < Date.now() || !state || saved.state !== state) {
      return errorPage("ログインできません", "ログインの有効期限が切れたか、別のブラウザで開かれました。もう一度ログインしてください。");
    }
    const code = url.searchParams.get("code");
    if (!code) return redirect("/", [clearState]);
    const login = await completeDiscordLogin(cfg, env.DISCORD_CLIENT_SECRET, code, `${cfg.publicUrl}/tokens/callback`, (p) => ctx.waitUntil(p));
    if (!login.ok) {
      return login.reason === "not_member"
        ? errorPage("使えません", "このDiscordアカウントは対象のサーバーのメンバーではありません。", 403)
        : errorPage("ログインに失敗しました", "Discordでのログインに失敗しました。もう一度試してください。", 502);
    }
    const session: Session = {
      sid: randomToken(16),
      uid: login.user.id,
      username: login.user.username,
      name: login.displayName,
      exp: Date.now() + SESSION_SECONDS * 1000,
    };
    return redirect("/tokens", [clearState, cookie(SESSION_COOKIE, await signValue(secret, session), SESSION_SECONDS)]);
  }

  const session = await readSession(request, secret);

  if (path === "/tokens" && request.method === "GET") {
    if (!session) {
      return page(
        "個人用トークン",
        html`<h1>個人用トークンと投稿名</h1>
          <div class="card"><p>Discordでログインすると、OAuthで接続できないAIアプリ（Muse など）用のトークンの発行と、投稿名の設定ができます。</p>
          <p><a class="button primary" href="/tokens/login">Discordでログイン</a></p></div>
          <p class="muted"><a href="/">接続URLの一覧へ</a></p>`,
      );
    }
    return tokensPage(cfg, env, session);
  }

  if (request.method !== "POST") return new Response("Not Found", { status: 404 });
  if (!session) return redirect("/tokens");
  const form = await request.formData();
  if (!(await checkCsrf(secret, session, form.get("csrf")?.toString() ?? null))) {
    return errorPage("やり直してください", "フォームの有効期限が切れました。ページを開き直してください。", 403);
  }
  const kv = new KvJsonStore(env.KV);

  if (path === "/tokens/logout") {
    return redirect("/tokens", [cookie(SESSION_COOKIE, "", 0)]);
  }

  if (path === "/tokens/create") {
    const aiKind = String(form.get("ai_kind") ?? "");
    if (!cfg.aiKinds.some((k) => k.id === aiKind)) return errorPage("発行できません", "AIの種類を選んでください。");
    const label = String(form.get("label") ?? "").trim().slice(0, 40) || "トークン";
    try {
      const { token } = await createPat(kv, { userId: session.uid, username: session.username, displayName: session.name }, aiKind, label);
      return tokensPage(cfg, env, session, { token, aiKind });
    } catch (err) {
      return errorPage("発行できません", err instanceof Error ? err.message : "トークンを発行できませんでした。");
    }
  }

  if (path === "/tokens/revoke") {
    const ok = await revokePat(kv, session.uid, String(form.get("hash") ?? ""));
    return tokensPage(cfg, env, session, { message: ok ? "トークンを失効させました。" : "そのトークンは見つかりませんでした。" });
  }

  if (path === "/tokens/settings") {
    const displayName = String(form.get("display_name") ?? "")
      .replace(/[\r\n\t]+/g, " ")
      .trim()
      .slice(0, 32);
    const avatars: Record<string, string> = {};
    for (const k of cfg.aiKinds) {
      const value = String(form.get(`avatar_${k.id}`) ?? "").trim();
      if (!value) continue;
      if (!isHttpsUrl(value) || value.length > 300) return errorPage("保存できません", `${k.label} のアイコンは https で始まるURLにしてください。`);
      avatars[k.id] = value;
    }
    const settings: UserSettings = { ...(displayName ? { displayName } : {}), ...(Object.keys(avatars).length ? { avatars } : {}) };
    await kv.put(`user:${session.uid}`, settings);
    return tokensPage(cfg, env, session, { message: "保存しました。次の投稿から反映されます。" });
  }

  return new Response("Not Found", { status: 404 });
}
