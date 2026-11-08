import { DiscordApiError, DiscordErrorCode, DiscordRateLimitError } from "../discord/client";

/** AIに返すエラーの種類。AIが自分で立ち直せるよう、理由と次にできることを付けて返す。 */
export type ErrorCode =
  | "NOT_ALLOWED"
  | "LEVEL_TOO_LOW"
  | "OUTSIDE_AI_CATEGORY"
  | "RATE_LIMITED"
  | "TOO_LONG"
  | "THREAD_LOCKED"
  | "UNAUTHORIZED"
  | "NOT_FOUND"
  | "INVALID_INPUT"
  | "DISCORD_ERROR"
  | "SERVER_MISCONFIGURED";

export class ToolError extends Error {
  constructor(
    readonly code: ErrorCode,
    message: string,
    /** AIに伝える「次にできること」 */
    readonly nextStep: string,
    readonly extra: Record<string, unknown> = {},
  ) {
    super(message);
  }
}

export const errors = {
  notAllowed: (what = "そのチャンネル") =>
    new ToolError(
      "NOT_ALLOWED",
      `${what}は、あなた（このAIの持ち主）のDiscordアカウントでは見られないため使えません。`,
      "list_channels で使えるチャンネルとスレッドを確かめてください。",
    ),
  levelTooLow: (needed: number, roleLabel: string, current: number) =>
    new ToolError(
      "LEVEL_TOO_LOW",
      `この操作にはレベル${needed}が必要です（今はレベル${current}）。`,
      `持ち主にDiscordの「${roleLabel}」ロールが必要です。サーバーの管理者に頼んでください。`,
      { required_level: needed, current_level: current, required_role: roleLabel },
    ),
  outsideAiCategory: () =>
    new ToolError(
      "OUTSIDE_AI_CATEGORY",
      "AIが読み書きできるのは「AI用」カテゴリの中のチャンネルとスレッドだけです。",
      "list_channels に出てくるチャンネルかスレッドを指定してください。",
    ),
  rateLimited: (retryAfterSeconds: number, scope: "user" | "channel" | "discord") =>
    new ToolError(
      "RATE_LIMITED",
      scope === "user"
        ? "あなたの投稿回数が上限に達しました。"
        : scope === "channel"
          ? "このチャンネルへの投稿回数が上限に達しました。"
          : "Discord側の回数制限に当たりました。",
      `${retryAfterSeconds}秒ほど待ってから、もう一度試してください。`,
      { retry_after_seconds: retryAfterSeconds, scope },
    ),
  tooLong: (length: number, max: number) =>
    new ToolError(
      "TOO_LONG",
      `本文が長すぎます（${length}字。上限は${max}字）。`,
      `${max}字以内に縮めるか、何回かに分けて投稿してください。`,
      { length, max },
    ),
  threadLocked: () =>
    new ToolError(
      "THREAD_LOCKED",
      "このスレッドはロックされているため書き込めません。",
      "create_idea_thread で新しいお題スレッドを立ててください（レベル2が必要）。",
    ),
  unauthorized: () =>
    new ToolError(
      "UNAUTHORIZED",
      "接続が切れたか、持ち主がDiscordサーバーにいません。",
      "AIアプリの設定からこのコネクタに接続し直してください。サーバーを抜けた場合は使えません。",
    ),
  notFound: (what: string) =>
    new ToolError("NOT_FOUND", `${what}が見つかりません。`, "IDを確かめてください。list_channels や read_messages でIDを調べられます。"),
  invalid: (message: string, nextStep: string) => new ToolError("INVALID_INPUT", message, nextStep),
};

/** Discord のエラーを AI 向けのエラーに変える */
export function fromDiscordError(err: unknown): ToolError | undefined {
  if (err instanceof DiscordRateLimitError) return errors.rateLimited(err.retryAfterSeconds, "discord");
  if (err instanceof DiscordApiError) {
    if (err.code === DiscordErrorCode.ThreadLocked) return errors.threadLocked();
    if (err.code === DiscordErrorCode.ThreadArchived) return errors.threadLocked();
    if (err.status === 404) return errors.notFound("指定したチャンネル・メッセージ");
    if (err.status === 401) {
      return new ToolError(
        "SERVER_MISCONFIGURED",
        "BotのトークンがDiscordに受け付けられませんでした。",
        "AIの側では直せません。サーバーの管理者に、DISCORD_BOT_TOKEN の設定を確かめてもらってください。",
        { discord_status: err.status },
      );
    }
    if (err.status === 403) {
      return new ToolError(
        "DISCORD_ERROR",
        "Botにこの操作の権限がありません。",
        "サーバーの管理者に、BotのロールとAI用カテゴリの権限設定を確かめてもらってください。",
        { discord_status: err.status, discord_code: err.code },
      );
    }
    return new ToolError("DISCORD_ERROR", "Discordとの通信に失敗しました。", "少し待ってからもう一度試してください。", {
      discord_status: err.status,
      discord_code: err.code,
    });
  }
  return undefined;
}

export interface ToolResultShape {
  [key: string]: unknown;
  content: Array<{ type: "text"; text: string }>;
  isError?: boolean;
}

export function errorResult(err: unknown): ToolResultShape {
  const toolError = err instanceof ToolError ? err : fromDiscordError(err);
  if (toolError) {
    return {
      isError: true,
      content: [
        {
          type: "text",
          text: JSON.stringify({
            error: toolError.code,
            message: toolError.message,
            next_step: toolError.nextStep,
            ...toolError.extra,
          }),
        },
      ],
    };
  }
  console.error("unexpected tool error", err);
  return {
    isError: true,
    content: [
      {
        type: "text",
        text: JSON.stringify({
          error: "SERVER_ERROR",
          message: "サーバーで予期しないエラーが起きました。",
          next_step: "少し待ってからもう一度試してください。続く場合はサーバーの管理者に伝えてください。",
        }),
      },
    ],
  };
}

export function okResult(data: unknown): ToolResultShape {
  return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
}
