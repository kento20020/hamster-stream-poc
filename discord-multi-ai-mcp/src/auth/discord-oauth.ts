/** Discord OAuth（ログイン）。本人確認とサーバーのメンバーかどうかの確認だけに使い、Discordのトークンは保存しない。 */
import type { Config } from "../config";
import { DiscordApiError, DiscordClient } from "../discord/client";
import type { DiscordUser, GuildMember } from "../discord/types";

export const DISCORD_SCOPES = ["identify", "guilds.members.read"];

export function discordAuthorizeUrl(cfg: Config, redirectUri: string, state: string): string {
  const url = new URL("https://discord.com/oauth2/authorize");
  url.searchParams.set("response_type", "code");
  url.searchParams.set("client_id", cfg.clientId);
  url.searchParams.set("scope", DISCORD_SCOPES.join(" "));
  url.searchParams.set("redirect_uri", redirectUri);
  url.searchParams.set("state", state);
  // 一度許可した人には確認画面を出さない
  url.searchParams.set("prompt", "none");
  return url.toString();
}

export type DiscordLoginResult =
  | { ok: true; user: DiscordUser; member: GuildMember; displayName: string }
  | { ok: false; reason: "not_member" | "exchange_failed" };

async function revoke(cfg: Config, clientSecret: string, token: string): Promise<void> {
  const body = new URLSearchParams({ token, token_type_hint: "access_token" });
  await fetch("https://discord.com/api/v10/oauth2/token/revoke", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${btoa(`${cfg.clientId}:${clientSecret}`)}`,
    },
    body,
  }).catch(() => undefined);
}

/** 認可コードをトークンに替え、本人とメンバー情報を取る。使い終わったDiscordのトークンはすぐ失効させる */
export async function completeDiscordLogin(
  cfg: Config,
  clientSecret: string,
  code: string,
  redirectUri: string,
  waitUntil: (p: Promise<unknown>) => void,
): Promise<DiscordLoginResult> {
  const tokenRes = await fetch("https://discord.com/api/v10/oauth2/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${btoa(`${cfg.clientId}:${clientSecret}`)}`,
    },
    body: new URLSearchParams({ grant_type: "authorization_code", code, redirect_uri: redirectUri }),
  });
  if (!tokenRes.ok) {
    console.warn("discord token exchange failed", tokenRes.status);
    return { ok: false, reason: "exchange_failed" };
  }
  const { access_token: accessToken } = (await tokenRes.json()) as { access_token?: string };
  if (!accessToken) return { ok: false, reason: "exchange_failed" };

  const client = new DiscordClient("");
  try {
    const user = await client.getCurrentUser(accessToken);
    let member: GuildMember;
    try {
      member = await client.getCurrentUserMember(accessToken, cfg.guildId);
    } catch (err) {
      if (err instanceof DiscordApiError && (err.status === 404 || err.status === 403)) return { ok: false, reason: "not_member" };
      throw err;
    }
    const displayName = member.nick || user.global_name || user.username;
    return { ok: true, user, member, displayName };
  } finally {
    waitUntil(revoke(cfg, clientSecret, accessToken));
  }
}
