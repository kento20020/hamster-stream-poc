/** 個人トークンのページ用の、署名付きクッキーのセッション（HMAC-SHA256）。 */

const encoder = new TextEncoder();

export function base64url(bytes: Uint8Array): string {
  let bin = "";
  for (const b of bytes) bin += String.fromCharCode(b);
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

export function fromBase64url(text: string): Uint8Array {
  const b64 = text.replace(/-/g, "+").replace(/_/g, "/") + "===".slice((text.length + 3) % 4);
  const bin = atob(b64);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

export function randomToken(bytes = 32): string {
  const buf = new Uint8Array(bytes);
  crypto.getRandomValues(buf);
  return base64url(buf);
}

async function hmacKey(secret: string): Promise<CryptoKey> {
  return crypto.subtle.importKey("raw", encoder.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign", "verify"]);
}

export async function hmac(secret: string, data: string): Promise<string> {
  const sig = await crypto.subtle.sign("HMAC", await hmacKey(secret), encoder.encode(data));
  return base64url(new Uint8Array(sig));
}

export async function signValue(secret: string, payload: unknown): Promise<string> {
  const body = base64url(encoder.encode(JSON.stringify(payload)));
  return `${body}.${await hmac(secret, `v1.${body}`)}`;
}

export async function verifyValue<T>(secret: string, token: string | undefined | null): Promise<T | null> {
  if (!token) return null;
  const [body, sig, extra] = token.split(".");
  if (!body || !sig || extra !== undefined) return null;
  let sigBytes: Uint8Array;
  try {
    sigBytes = fromBase64url(sig);
  } catch {
    return null;
  }
  // crypto.subtle.verify は比較を一定時間で行う
  const ok = await crypto.subtle.verify("HMAC", await hmacKey(secret), sigBytes, encoder.encode(`v1.${body}`));
  if (!ok) return null;
  try {
    return JSON.parse(new TextDecoder().decode(fromBase64url(body))) as T;
  } catch {
    return null;
  }
}

export interface Session {
  sid: string;
  uid: string;
  username: string;
  name: string;
  /** 期限（ms） */
  exp: number;
}

export const SESSION_COOKIE = "__Host-dmai-session";
export const LOGIN_STATE_COOKIE = "__Host-dmai-login";

export function readCookie(request: Request, name: string): string | undefined {
  const header = request.headers.get("Cookie");
  if (!header) return undefined;
  for (const part of header.split(";")) {
    const [k, ...v] = part.trim().split("=");
    if (k === name) return v.join("=");
  }
  return undefined;
}

export function cookie(name: string, value: string, maxAgeSeconds: number, sameSite: "Lax" | "Strict" = "Lax"): string {
  return `${name}=${value}; Path=/; Secure; HttpOnly; SameSite=${sameSite}; Max-Age=${maxAgeSeconds}`;
}

export async function readSession(request: Request, secret: string, now = Date.now()): Promise<Session | null> {
  const session = await verifyValue<Session>(secret, readCookie(request, SESSION_COOKIE));
  if (!session || typeof session.exp !== "number" || session.exp < now) return null;
  return session;
}

export async function csrfToken(secret: string, session: Session): Promise<string> {
  return hmac(secret, `csrf.${session.sid}`);
}

export async function checkCsrf(secret: string, session: Session, token: string | null): Promise<boolean> {
  if (!token) return false;
  const expected = await csrfToken(secret, session);
  if (expected.length !== token.length) return false;
  let diff = 0;
  for (let i = 0; i < expected.length; i++) diff |= expected.charCodeAt(i) ^ token.charCodeAt(i);
  return diff === 0;
}
