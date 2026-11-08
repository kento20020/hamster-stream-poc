/**
 * 個人用トークン（PAT）。OAuth がうまく動かないAIアプリ（Muse など）向けに、Bearer トークンを発行する。
 * KV にはトークンのハッシュだけを保存する（pat:{hash}）。本人が失効させるまで使える。
 */
import type { AuthProps } from "../env";
import type { JsonStore } from "../kv";
import { randomToken } from "../web/session";

export const PAT_PREFIX = "dmai_";
const MAX_TOKENS_PER_USER = 10;

export interface PatRecord {
  userId: string;
  username: string;
  displayName: string;
  aiKind: string;
  label: string;
  createdAt: number;
}

export interface PatListItem {
  hash: string;
  aiKind: string;
  label: string;
  createdAt: number;
  /** 見分けるための末尾4文字 */
  hint: string;
}

export function generatePat(): string {
  return `${PAT_PREFIX}${randomToken(32)}`;
}

export function looksLikePat(token: string): boolean {
  return token.startsWith(PAT_PREFIX) && /^[A-Za-z0-9_-]{40,80}$/.test(token);
}

export async function hashPat(token: string): Promise<string> {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(token));
  return [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

export async function listPats(kv: JsonStore, userId: string): Promise<PatListItem[]> {
  return (await kv.get<PatListItem[]>(`patlist:${userId}`)) ?? [];
}

export async function createPat(
  kv: JsonStore,
  owner: { userId: string; username: string; displayName: string },
  aiKind: string,
  label: string,
  now = Date.now(),
): Promise<{ token: string; item: PatListItem }> {
  const list = await listPats(kv, owner.userId);
  if (list.length >= MAX_TOKENS_PER_USER) {
    throw new Error(`トークンは1人${MAX_TOKENS_PER_USER}個までです。使っていないものを失効させてください。`);
  }
  const token = generatePat();
  const hash = await hashPat(token);
  const record: PatRecord = { ...owner, aiKind, label, createdAt: now };
  await kv.put(`pat:${hash}`, record);
  const item: PatListItem = { hash, aiKind, label, createdAt: now, hint: token.slice(-4) };
  await kv.put(`patlist:${owner.userId}`, [...list, item]);
  return { token, item };
}

export async function revokePat(kv: JsonStore, userId: string, hash: string): Promise<boolean> {
  const list = await listPats(kv, userId);
  const target = list.find((i) => i.hash === hash);
  if (!target) return false;
  const record = await kv.get<PatRecord>(`pat:${hash}`);
  // 他人のトークンは消せない
  if (record && record.userId !== userId) return false;
  await kv.delete(`pat:${hash}`);
  await kv.put(
    `patlist:${userId}`,
    list.filter((i) => i.hash !== hash),
  );
  return true;
}

/**
 * Bearer トークンが PAT なら検証して props を返す。トークンに結び付いたAIの種類と、接続URLのAIの種類が違えば拒否する。
 */
export async function validatePat(kv: JsonStore, token: string, pathAiKind: string | undefined): Promise<AuthProps | null> {
  if (!looksLikePat(token)) return null;
  const record = await kv.get<PatRecord>(`pat:${await hashPat(token)}`);
  if (!record) return null;
  if (pathAiKind !== undefined && record.aiKind !== pathAiKind) return null;
  return {
    userId: record.userId,
    username: record.username,
    displayName: record.displayName,
    via: "pat",
    patAiKind: record.aiKind,
  };
}
