import { describe, expect, it } from "vitest";
import { createPat, hashPat, listPats, revokePat, validatePat } from "../src/auth/pat";
import { normalizePublicUrl, parseAiKinds } from "../src/config";
import { DiscordClient, DiscordRateLimitError } from "../src/discord/client";
import { dateFromSnowflake, snowflakeFromDate } from "../src/discord/snowflake";
import type { Guild, GuildMember } from "../src/discord/types";
import { errorResult } from "../src/guard/errors";
import { BOT_PERMISSIONS, canView, computeChannelPermissions, levelFromRoles, Permission } from "../src/guard/permissions";
import { slidingWindow } from "../src/guard/rate-limit";
import { normalizeEmoji, validateContent, validateTitle } from "../src/guard/validate";
import { MemoryJsonStore } from "../src/kv";
import { aiPostName, formatSummary, splitForDiscord } from "../src/summary/format";
import { html } from "../src/web/html";
import { checkCsrf, csrfToken, signValue, verifyValue, type Session } from "../src/web/session";

const G = "100000000000000001";
const guild: Guild = {
  id: G,
  name: "g",
  owner_id: "900000000000000000",
  roles: [
    { id: G, name: "@everyone", permissions: (Permission.ViewChannel | Permission.ReadMessageHistory).toString(), position: 0 },
    { id: "200000000000000001", name: "運営", permissions: "0", position: 1 },
    { id: "200000000000000002", name: "管理者", permissions: Permission.Administrator.toString(), position: 2 },
  ],
};
const member = (roles: string[]): GuildMember => ({ roles });
const deny = (id: string, type: 0 | 1, flag: bigint) => ({ id, type, allow: "0", deny: flag.toString() });
const allow = (id: string, type: 0 | 1, flag: bigint) => ({ id, type, allow: flag.toString(), deny: "0" });

describe("権限の計算", () => {
  const U = "300000000000000001";
  it("@everyone の権限で見られる", () => {
    expect(canView(computeChannelPermissions(guild, U, member([]), {}))).toBe(true);
  });
  it("@everyone を拒否し、ロールで許可したチャンネル", () => {
    const ch = { permission_overwrites: [deny(G, 0, Permission.ViewChannel), allow("200000000000000001", 0, Permission.ViewChannel)] };
    expect(canView(computeChannelPermissions(guild, U, member([]), ch))).toBe(false);
    expect(canView(computeChannelPermissions(guild, U, member(["200000000000000001"]), ch))).toBe(true);
  });
  it("メンバー個人の拒否はロールの許可より強い", () => {
    const ch = { permission_overwrites: [allow("200000000000000001", 0, Permission.ViewChannel), deny(U, 1, Permission.ViewChannel)] };
    expect(canView(computeChannelPermissions(guild, U, member(["200000000000000001"]), ch))).toBe(false);
  });
  it("ロールの許可と拒否が両方あれば許可が勝つ（ロールどうしは許可優先）", () => {
    const ch = {
      permission_overwrites: [deny("200000000000000001", 0, Permission.ViewChannel), allow("200000000000000003", 0, Permission.ViewChannel)],
    };
    expect(canView(computeChannelPermissions(guild, U, member(["200000000000000001", "200000000000000003"]), ch))).toBe(true);
  });
  it("管理者とサーバーの持ち主は常に見られる", () => {
    const ch = { permission_overwrites: [deny(G, 0, Permission.ViewChannel)] };
    expect(canView(computeChannelPermissions(guild, U, member(["200000000000000002"]), ch))).toBe(true);
    expect(canView(computeChannelPermissions(guild, guild.owner_id, member([]), ch))).toBe(true);
  });
  it("見られないチャンネルでは、ほかの権限も無いのと同じ", () => {
    const ch = { permission_overwrites: [deny(G, 0, Permission.ViewChannel)] };
    expect(computeChannelPermissions(guild, U, member([]), ch)).toBe(0n);
  });
  it("ロールからレベルを出す（AI-まとめは AI-発言を含む）", () => {
    expect(levelFromRoles([], "1", "2")).toBe(0);
    expect(levelFromRoles(["1"], "1", "2")).toBe(1);
    expect(levelFromRoles(["2"], "1", "2")).toBe(2);
    expect(levelFromRoles(["1", "2"], "1", "2")).toBe(2);
  });
  it("Botに付ける権限に危ないものが入っていない", () => {
    expect(BOT_PERMISSIONS & Permission.Administrator).toBe(0n);
    expect(BOT_PERMISSIONS.toString()).toBe("309774634048");
  });
});

describe("入力の検証", () => {
  it("2000字までは通る", () => {
    expect(validateContent("あ".repeat(2000))).toHaveLength(2000);
    expect(() => validateContent("あ".repeat(2001))).toThrow(/長すぎ/);
    expect(() => validateContent("   ")).toThrow(/空/);
  });
  it("絵文字は UTF-16 で数えるので安全側", () => {
    expect(() => validateContent("😀".repeat(1001))).toThrow();
  });
  it("タイトルは100字まで、改行はつぶす", () => {
    expect(validateTitle(" a\n b ")).toBe("a b");
    expect(() => validateTitle("x".repeat(101))).toThrow();
  });
  it("絵文字の形", () => {
    expect(normalizeEmoji("👍")).toBe("👍");
    expect(normalizeEmoji("🇯🇵")).toBe("🇯🇵");
    expect(normalizeEmoji("<:party:123456789012345678>")).toBe("party:123456789012345678");
    expect(normalizeEmoji("party:123456789012345678")).toBe("party:123456789012345678");
    expect(() => normalizeEmoji("thumbsup")).toThrow();
  });
});

describe("整形", () => {
  it("AI名義の表示名", () => {
    expect(aiPostName("Aさん", "Claude")).toBe("AさんのClaude（AI）");
    expect(aiPostName("Discord好き", "Claude")).toBe("Disc0rd好きのClaude（AI）");
    const long = aiPostName("あ".repeat(100), "ChatGPT");
    expect(long.length).toBeLessThanOrEqual(80);
    expect(long.endsWith("のChatGPT（AI）")).toBe(true);
  });
  it("2000字ごとに、行の切れ目で分ける", () => {
    const text = Array.from({ length: 50 }, (_, i) => `${i}: ${"x".repeat(95)}`).join("\n");
    const chunks = splitForDiscord(text);
    expect(chunks.length).toBeGreaterThan(1);
    for (const c of chunks) expect(c.length).toBeLessThanOrEqual(2000);
    expect(chunks.join("\n")).toBe(text);
  });
  it("長すぎる1行も切る。絵文字の途中では切らない", () => {
    const chunks = splitForDiscord("😀".repeat(1500));
    for (const c of chunks) {
      expect(c.length).toBeLessThanOrEqual(2000);
      expect(c).not.toMatch(/[\uD800-\uDBFF]$/);
    }
    expect(chunks.join("")).toBe("😀".repeat(1500));
  });
  it("まとめの書式", () => {
    const text = formatSummary({
      title: "お題：まとめ",
      sourceTitle: "お題",
      sourceLink: "https://discord.com/channels/1/2",
      points: ["論点1"],
      ideas: [{ idea: "案", proposer: "AさんのClaude（AI）", link: "https://discord.com/channels/1/2/3" }],
      nextActions: ["次"],
      summarizedBy: "BさんのChatGPT（AI）",
      nowMs: 1_700_000_000_000,
      isUpdate: false,
    });
    expect(text).toContain("# お題：まとめ");
    expect(text).toContain("## 論点\n- 論点1");
    expect(text).toContain("1. 案\n  -# 発案：AさんのClaude（AI）・[元の発言](https://discord.com/channels/1/2/3)");
    expect(text).toContain("## 次にやること\n- 次");
    expect(text).toContain("<t:1700000000:f>");
  });
});

describe("回数制限（スライディングウィンドウ）", () => {
  it("上限までは通り、超えたら何秒後かを返す", () => {
    let hits: number[] = [];
    for (let i = 0; i < 3; i++) {
      const r = slidingWindow(hits, 1000 + i * 1000, 3, 60_000);
      expect(r.result.ok).toBe(true);
      hits = r.hits;
    }
    const blocked = slidingWindow(hits, 10_000, 3, 60_000);
    expect(blocked.result).toEqual({ ok: false, remaining: 0, retryAfterSeconds: 51 });
    expect(slidingWindow(blocked.hits, 61_001, 3, 60_000).result.ok).toBe(true);
  });
});

describe("Discordクライアント", () => {
  it("429 は待ち時間を守って再試行する", async () => {
    const waits: number[] = [];
    let n = 0;
    const client = new DiscordClient("t", {
      sleep: async (ms) => void waits.push(ms),
      fetch: (async () => {
        n++;
        if (n === 1) return new Response(JSON.stringify({ retry_after: 1.2, global: false }), { status: 429 });
        return new Response(JSON.stringify({ id: "1" }), { status: 200 });
      }) as typeof fetch,
    });
    await expect(client.getChannel("1")).resolves.toEqual({ id: "1" });
    expect(waits).toEqual([1200]);
  });
  it("長すぎる 429 は待たずに RATE_LIMITED にする", async () => {
    const client = new DiscordClient("t", {
      sleep: async () => undefined,
      fetch: (async () => new Response(JSON.stringify({ retry_after: 30 }), { status: 429 })) as typeof fetch,
    });
    const err = await client.getChannel("1").catch((e) => e);
    expect(err).toBeInstanceOf(DiscordRateLimitError);
    const result = errorResult(err);
    expect(JSON.parse(result.content[0]!.text)).toMatchObject({ error: "RATE_LIMITED", retry_after_seconds: 30 });
  });
  it("Bot トークンとメンション無効を送る", async () => {
    const seen: Array<{ url: string; init: RequestInit }> = [];
    const client = new DiscordClient("BOT", {
      fetch: (async (url: string, init: RequestInit) => {
        seen.push({ url, init });
        return new Response(JSON.stringify({ id: "9", channel_id: "1" }), { status: 200 });
      }) as unknown as typeof fetch,
    });
    await client.getChannel("1");
    await client.executeWebhook("w", "tok", { content: "@everyone", username: "x", threadId: "5" });
    expect(new Headers(seen[0]!.init.headers).get("Authorization")).toBe("Bot BOT");
    expect(new Headers(seen[1]!.init.headers).get("Authorization")).toBeNull();
    expect(seen[1]!.url).toBe("https://discord.com/api/v10/webhooks/w/tok?wait=true&thread_id=5");
    expect(JSON.parse(String(seen[1]!.init.body)).allowed_mentions).toEqual({ parse: [] });
  });
});

describe("snowflake", () => {
  it("日時と相互に変換できる", () => {
    const d = new Date("2026-11-08T00:00:00Z");
    expect(dateFromSnowflake(snowflakeFromDate(d)).toISOString()).toBe(d.toISOString());
  });
});

describe("設定", () => {
  it("AI_KINDS を読む", () => {
    expect(parseAiKinds("claude:Claude, chatgpt:ChatGPT,muse")).toEqual([
      { id: "claude", label: "Claude" },
      { id: "chatgpt", label: "ChatGPT" },
      { id: "muse", label: "muse" },
    ]);
    expect(() => parseAiKinds("Bad Kind:x")).toThrow();
    expect(() => parseAiKinds("a:x,a:y")).toThrow();
  });
  it("PUBLIC_URL は https（localhost だけ http 可）", () => {
    expect(normalizePublicUrl("https://mcp.example.com/")).toBe("https://mcp.example.com");
    expect(normalizePublicUrl("http://localhost:8787")).toBe("http://localhost:8787");
    expect(() => normalizePublicUrl("http://mcp.example.com")).toThrow();
    expect(() => normalizePublicUrl("https://mcp.example.com/sub")).toThrow();
  });
});

describe("個人用トークンとセッション", () => {
  it("発行・検証・AIの種類の一致・失効", async () => {
    const kv = new MemoryJsonStore();
    const owner = { userId: "1", username: "ken", displayName: "けん" };
    const { token, item } = await createPat(kv, owner, "muse", "スマホ");
    expect(token.startsWith("dmai_")).toBe(true);
    expect(item.hash).toBe(await hashPat(token));
    // 平文は保存しない
    expect(JSON.stringify([...kv.data])).not.toContain(token);
    expect(await validatePat(kv, token, "muse")).toMatchObject({ userId: "1", via: "pat", patAiKind: "muse" });
    expect(await validatePat(kv, token, "claude")).toBeNull();
    expect(await validatePat(kv, "dmai_" + "x".repeat(43), "muse")).toBeNull();
    expect(await revokePat(kv, "2", item.hash)).toBe(false);
    expect(await revokePat(kv, "1", item.hash)).toBe(true);
    expect(await validatePat(kv, token, "muse")).toBeNull();
    expect(await listPats(kv, "1")).toEqual([]);
  });
  it("署名付きの値は改ざんすると読めない", async () => {
    const signed = await signValue("s".repeat(32), { a: 1 });
    expect(await verifyValue("s".repeat(32), signed)).toEqual({ a: 1 });
    expect(await verifyValue("t".repeat(32), signed)).toBeNull();
    const [body, sig] = signed.split(".");
    expect(await verifyValue("s".repeat(32), `${body}x.${sig}`)).toBeNull();
  });
  it("CSRFトークンはセッションごと", async () => {
    const secret = "s".repeat(32);
    const a: Session = { sid: "a", uid: "1", username: "u", name: "n", exp: 0 };
    const b: Session = { ...a, sid: "b" };
    const token = await csrfToken(secret, a);
    expect(await checkCsrf(secret, a, token)).toBe(true);
    expect(await checkCsrf(secret, b, token)).toBe(false);
  });
});

describe("HTML", () => {
  it("差し込んだ値はエスケープされる", () => {
    expect(html`<p>${'<script>alert("x")</script>'}</p>`.value).toBe("<p>&lt;script&gt;alert(&quot;x&quot;)&lt;/script&gt;</p>");
  });
});
