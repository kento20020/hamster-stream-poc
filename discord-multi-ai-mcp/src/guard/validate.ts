/** 入力の検証（純粋関数）。 */
import { isSnowflake } from "../discord/snowflake";
import { errors } from "./errors";

/** Discord の1投稿の上限 */
export const MESSAGE_MAX = 2000;
/** スレッド名の上限 */
export const THREAD_NAME_MAX = 100;

/** 文字数は UTF-16 の長さで数える（絵文字を多めに数えるので、Discord の上限より必ず安全側） */
export function textLength(text: string): number {
  return text.length;
}

export function requireSnowflake(value: string, label: string): string {
  const trimmed = value.trim();
  if (!isSnowflake(trimmed)) {
    throw errors.invalid(`${label} はDiscordのID（数字15〜25桁）で指定してください（今: ${value.slice(0, 40)}）。`, "list_channels や read_messages でIDを調べられます。");
  }
  return trimmed;
}

export function validateContent(content: string, max = MESSAGE_MAX): string {
  const trimmed = content.replace(/\s+$/u, "");
  if (trimmed.trim() === "") {
    throw errors.invalid("本文が空です。", "投稿する本文を入れてください。");
  }
  const length = textLength(trimmed);
  if (length > max) throw errors.tooLong(length, max);
  return trimmed;
}

export function validateTitle(title: string): string {
  const trimmed = title.replace(/\s+/gu, " ").trim();
  if (trimmed === "") throw errors.invalid("タイトルが空です。", "タイトルを入れてください。");
  if (textLength(trimmed) > THREAD_NAME_MAX) {
    throw errors.invalid(`タイトルが長すぎます（${textLength(trimmed)}字。上限は${THREAD_NAME_MAX}字）。`, `${THREAD_NAME_MAX}字以内にしてください。`);
  }
  return trimmed;
}

/**
 * リアクションの絵文字。Unicode の絵文字（👍）か、サーバーのカスタム絵文字（name:id）。
 * <:name:id> の形で来たら name:id に直す。
 */
export function normalizeEmoji(emoji: string): string {
  const trimmed = emoji.trim();
  const custom = /^<a?:([A-Za-z0-9_]{2,32}):(\d{15,25})>$/.exec(trimmed);
  if (custom) return `${custom[1]}:${custom[2]}`;
  if (/^[A-Za-z0-9_]{2,32}:\d{15,25}$/.test(trimmed)) return trimmed;
  if (trimmed !== "" && textLength(trimmed) <= 16 && /\p{Extended_Pictographic}|\p{Regional_Indicator}|[#*0-9]️?⃣/u.test(trimmed)) {
    return trimmed;
  }
  throw errors.invalid(
    `絵文字「${trimmed.slice(0, 20)}」は使えません。`,
    "👍 のような絵文字そのものか、サーバーのカスタム絵文字（name:id）を指定してください。",
  );
}

export function isHttpsUrl(value: string): boolean {
  try {
    return new URL(value).protocol === "https:";
  } catch {
    return false;
  }
}
