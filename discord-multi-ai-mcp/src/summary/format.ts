/** 投稿文の整形（純粋関数）。まとめの書式、AI名義の表示名、2000字ごとの分割。 */
import { MESSAGE_MAX } from "../guard/validate";

/** Webhook の表示名の上限 */
export const WEBHOOK_NAME_MAX = 80;

/** Discord の Markdown として効いてしまう記号を無効にする（名前などに使う） */
export function escapeMarkdown(text: string): string {
  return text.replace(/([\\*_~`|>\[\]()#-])/g, "\\$1");
}

/**
 * 「AさんのClaude（AI）」の形の表示名。人間と見分けがつくよう、必ず（AI）で終わる。
 * Discord は Webhook 名に "discord" と "clyde" を含められないので、そこだけ置き換える。
 */
export function aiPostName(ownerName: string, aiLabel: string): string {
  const suffix = `の${aiLabel}（AI）`;
  const clean = (s: string) =>
    s
      .replace(/[\r\n\t]+/g, " ")
      .replace(/discord/gi, (m) => m.replace(/o/i, "0"))
      .replace(/clyde/gi, (m) => m.replace(/e/i, "3"))
      .trim();
  const owner = clean(ownerName) || "だれか";
  const tail = clean(suffix);
  const room = WEBHOOK_NAME_MAX - tail.length;
  const ownerPart = Array.from(owner).length > room ? Array.from(owner).slice(0, Math.max(1, room - 1)).join("") + "…" : owner;
  return `${ownerPart}${tail}`;
}

/**
 * Discord の1投稿の上限で分ける。なるべく行の切れ目で分け、長すぎる1行だけは途中で切る。
 * サロゲートペア（絵文字など）の途中では切らない。
 */
export function splitForDiscord(text: string, max = MESSAGE_MAX): string[] {
  const chunks: string[] = [];
  let current = "";
  const pushCurrent = () => {
    if (current.trim() !== "") chunks.push(current.replace(/\n+$/, ""));
    current = "";
  };
  for (const line of text.split("\n")) {
    const candidate = current === "" ? line : `${current}\n${line}`;
    if (candidate.length <= max) {
      current = candidate;
      continue;
    }
    pushCurrent();
    if (line.length <= max) {
      current = line;
      continue;
    }
    // 1行が上限を超える場合は文字単位で切る
    let piece = "";
    for (const ch of Array.from(line)) {
      if (piece.length + ch.length > max) {
        chunks.push(piece);
        piece = "";
      }
      piece += ch;
    }
    current = piece;
  }
  pushCurrent();
  return chunks;
}

/** Discord のタイムスタンプ記法。見る人それぞれの時刻で表示される */
export function discordTimestamp(ms: number, style: "f" | "R" | "d" = "f"): string {
  return `<t:${Math.floor(ms / 1000)}:${style}>`;
}

export interface IdeaStarterInput {
  topic: string;
  createdBy: string;
  previousSummary?: { title: string; link: string } | null;
}

/** お題スレッドの最初の発言（お題 + 参加のしかた） */
export function formatIdeaStarter(input: IdeaStarterInput): string {
  const lines = [`## お題`, input.topic.trim(), ""];
  if (input.previousSummary) {
    lines.push(`前回のまとめ：[${escapeMarkdown(input.previousSummary.title)}](${input.previousSummary.link})`, "");
  }
  lines.push(
    `### 参加のしかた`,
    `- 自分のAIに「このスレッドのアイデア出しに参加して」と頼む（MCPの read_messages → post_message / reply）`,
    `- 1回の投稿に1〜3案。ほかの案への賛成や発展は reply かリアクションで`,
    `- まとめ役（AI-まとめ ロール）が create_summary_thread で #summaries にまとめます`,
    `-# 立てた人：${escapeMarkdown(input.createdBy)}`,
  );
  return lines.join("\n");
}

export interface SummaryIdea {
  idea: string;
  proposer: string;
  link: string;
}

export interface SummaryInput {
  title: string;
  sourceTitle: string;
  sourceLink: string;
  points: string[];
  ideas: SummaryIdea[];
  nextActions: string[];
  summarizedBy: string;
  nowMs: number;
  /** 既存のまとめスレッドへの追記なら true */
  isUpdate: boolean;
}

function oneLine(text: string): string {
  return text.replace(/\s*\n\s*/g, " ").trim();
}

/** まとめの決まった書式。どのAIがまとめても同じ形になる */
export function formatSummary(input: SummaryInput): string {
  const lines: string[] = [];
  if (input.isUpdate) {
    lines.push(`# 更新：${oneLine(input.title)}`);
  } else {
    lines.push(`# ${oneLine(input.title)}`);
  }
  lines.push(`元のお題：[${escapeMarkdown(oneLine(input.sourceTitle))}](${input.sourceLink})`, "");

  lines.push("## 論点");
  if (input.points.length === 0) lines.push("- （なし）");
  for (const p of input.points) lines.push(`- ${oneLine(p)}`);
  lines.push("");

  lines.push("## アイデア");
  if (input.ideas.length === 0) lines.push("（なし）");
  input.ideas.forEach((idea, i) => {
    lines.push(`${i + 1}. ${oneLine(idea.idea)}`);
    lines.push(`  -# 発案：${escapeMarkdown(idea.proposer)}・[元の発言](${idea.link})`);
  });
  lines.push("");

  lines.push("## 次にやること");
  if (input.nextActions.length === 0) lines.push("- （なし）");
  for (const a of input.nextActions) lines.push(`- ${oneLine(a)}`);
  lines.push("");

  lines.push(`-# まとめ：${escapeMarkdown(input.summarizedBy)}・${discordTimestamp(input.nowMs)}`);
  return lines.join("\n");
}

export function replyPrefix(targetLabel: string, targetLink: string): string {
  return `> ↪ ${escapeMarkdown(targetLabel)} への返信 ${targetLink}\n`;
}

export function summaryBackLink(link: string, isUpdate: boolean): string {
  return isUpdate ? `📝 このお題のまとめを更新しました → ${link}` : `📝 このお題のまとめはこちら → ${link}`;
}
