/** 監査ログとスレッドの状態（D1）。 */

/** 「AIが投稿した」と見なすツール（add_reaction は投稿ではない） */
export const POSTING_TOOLS = ["post_message", "reply", "create_idea_thread", "create_summary_thread"] as const;
export type WriteTool = (typeof POSTING_TOOLS)[number] | "add_reaction";

export interface LogEntry {
  messageId: string;
  channelId: string;
  threadId?: string | null;
  ownerUserId: string;
  ownerName: string;
  aiKind: string;
  tool: WriteTool;
  replyToMessageId?: string | null;
  detail?: Record<string, unknown> | null;
  createdAt?: number;
}

export interface Attribution {
  messageId: string;
  ownerUserId: string;
  ownerName: string;
  aiKind: string;
  tool: WriteTool;
  replyToMessageId: string | null;
  threadId: string | null;
  channelId: string;
}

export interface ThreadRecord {
  threadId: string;
  kind: "idea" | "summary";
  title: string;
  status: "open" | "summarized";
  createdBy: string;
  aiKind: string | null;
  previousSummaryThreadId: string | null;
  createdAt: number;
  updatedAt: number;
}

export interface AuditStore {
  log(entries: LogEntry[]): Promise<void>;
  /** メッセージIDから、AIの投稿の持ち主とAIの種類を引く（AIの投稿でないものは入らない） */
  attributions(messageIds: string[]): Promise<Map<string, Attribution>>;
  /** add_reaction で各AIが付けたリアクションを数える（Botのリアクションは1つにまとまってしまうため） */
  aiReactions(messageIds: string[]): Promise<Map<string, Record<string, number>>>;
  getThread(threadId: string): Promise<ThreadRecord | null>;
  getThreads(threadIds: string[]): Promise<Map<string, ThreadRecord>>;
  upsertThread(record: ThreadRecord): Promise<void>;
  setThreadStatus(threadId: string, status: ThreadRecord["status"]): Promise<void>;
  getSummaryLink(sourceThreadId: string): Promise<string | null>;
  setSummaryLink(sourceThreadId: string, summaryThreadId: string): Promise<void>;
  purgeLogsOlderThan(cutoffMs: number): Promise<number>;
}

const CHUNK = 90; // D1 のバインド変数の上限（100）より少なく

function chunks<T>(items: T[], size: number): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < items.length; i += size) out.push(items.slice(i, i + size));
  return out;
}

interface LogRow {
  message_id: string;
  owner_user_id: string;
  owner_name: string;
  ai_kind: string;
  tool: WriteTool;
  reply_to_message_id: string | null;
  thread_id: string | null;
  channel_id: string;
}

interface ThreadRow {
  thread_id: string;
  kind: "idea" | "summary";
  title: string;
  status: "open" | "summarized";
  created_by: string;
  ai_kind: string | null;
  previous_summary_thread_id: string | null;
  created_at: number;
  updated_at: number;
}

function toThread(row: ThreadRow): ThreadRecord {
  return {
    threadId: row.thread_id,
    kind: row.kind,
    title: row.title,
    status: row.status,
    createdBy: row.created_by,
    aiKind: row.ai_kind,
    previousSummaryThreadId: row.previous_summary_thread_id,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export class D1AuditStore implements AuditStore {
  constructor(private readonly db: D1Database) {}

  async log(entries: LogEntry[]): Promise<void> {
    if (entries.length === 0) return;
    const now = Date.now();
    const stmt = this.db.prepare(
      `INSERT INTO messages_log (message_id, channel_id, thread_id, owner_user_id, owner_name, ai_kind, tool, reply_to_message_id, detail, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    );
    await this.db.batch(
      entries.map((e) =>
        stmt.bind(
          e.messageId,
          e.channelId,
          e.threadId ?? null,
          e.ownerUserId,
          e.ownerName,
          e.aiKind,
          e.tool,
          e.replyToMessageId ?? null,
          e.detail ? JSON.stringify(e.detail) : null,
          e.createdAt ?? now,
        ),
      ),
    );
  }

  async attributions(messageIds: string[]): Promise<Map<string, Attribution>> {
    const result = new Map<string, Attribution>();
    const unique = [...new Set(messageIds)];
    const tools = POSTING_TOOLS.map(() => "?").join(",");
    for (const part of chunks(unique, CHUNK)) {
      const placeholders = part.map(() => "?").join(",");
      const { results } = await this.db
        .prepare(
          `SELECT message_id, owner_user_id, owner_name, ai_kind, tool, reply_to_message_id, thread_id, channel_id
           FROM messages_log WHERE message_id IN (${placeholders}) AND tool IN (${tools})`,
        )
        .bind(...part, ...POSTING_TOOLS)
        .all<LogRow>();
      for (const row of results) {
        result.set(row.message_id, {
          messageId: row.message_id,
          ownerUserId: row.owner_user_id,
          ownerName: row.owner_name,
          aiKind: row.ai_kind,
          tool: row.tool,
          replyToMessageId: row.reply_to_message_id,
          threadId: row.thread_id,
          channelId: row.channel_id,
        });
      }
    }
    return result;
  }

  async aiReactions(messageIds: string[]): Promise<Map<string, Record<string, number>>> {
    const result = new Map<string, Record<string, number>>();
    const unique = [...new Set(messageIds)];
    for (const part of chunks(unique, CHUNK)) {
      const placeholders = part.map(() => "?").join(",");
      const { results } = await this.db
        .prepare(
          `SELECT message_id, json_extract(detail, '$.emoji') AS emoji, COUNT(DISTINCT owner_user_id || ':' || ai_kind) AS n
           FROM messages_log WHERE tool = 'add_reaction' AND message_id IN (${placeholders})
           GROUP BY message_id, emoji`,
        )
        .bind(...part)
        .all<{ message_id: string; emoji: string | null; n: number }>();
      for (const row of results) {
        if (!row.emoji) continue;
        const counts = result.get(row.message_id) ?? {};
        counts[row.emoji] = row.n;
        result.set(row.message_id, counts);
      }
    }
    return result;
  }

  async getThread(threadId: string): Promise<ThreadRecord | null> {
    const row = await this.db.prepare(`SELECT * FROM threads WHERE thread_id = ?`).bind(threadId).first<ThreadRow>();
    return row ? toThread(row) : null;
  }

  async getThreads(threadIds: string[]): Promise<Map<string, ThreadRecord>> {
    const result = new Map<string, ThreadRecord>();
    for (const part of chunks([...new Set(threadIds)], CHUNK)) {
      const placeholders = part.map(() => "?").join(",");
      const { results } = await this.db
        .prepare(`SELECT * FROM threads WHERE thread_id IN (${placeholders})`)
        .bind(...part)
        .all<ThreadRow>();
      for (const row of results) result.set(row.thread_id, toThread(row));
    }
    return result;
  }

  async upsertThread(r: ThreadRecord): Promise<void> {
    await this.db
      .prepare(
        `INSERT INTO threads (thread_id, kind, title, status, created_by, ai_kind, previous_summary_thread_id, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
         ON CONFLICT (thread_id) DO UPDATE SET title = excluded.title, status = excluded.status, updated_at = excluded.updated_at`,
      )
      .bind(r.threadId, r.kind, r.title, r.status, r.createdBy, r.aiKind, r.previousSummaryThreadId, r.createdAt, r.updatedAt)
      .run();
  }

  async setThreadStatus(threadId: string, status: ThreadRecord["status"]): Promise<void> {
    await this.db.prepare(`UPDATE threads SET status = ?, updated_at = ? WHERE thread_id = ?`).bind(status, Date.now(), threadId).run();
  }

  async getSummaryLink(sourceThreadId: string): Promise<string | null> {
    const row = await this.db
      .prepare(`SELECT summary_thread_id FROM summary_links WHERE source_thread_id = ?`)
      .bind(sourceThreadId)
      .first<{ summary_thread_id: string }>();
    return row?.summary_thread_id ?? null;
  }

  async setSummaryLink(sourceThreadId: string, summaryThreadId: string): Promise<void> {
    await this.db
      .prepare(
        `INSERT INTO summary_links (source_thread_id, summary_thread_id, updated_at) VALUES (?, ?, ?)
         ON CONFLICT (source_thread_id) DO UPDATE SET summary_thread_id = excluded.summary_thread_id, updated_at = excluded.updated_at`,
      )
      .bind(sourceThreadId, summaryThreadId, Date.now())
      .run();
  }

  async purgeLogsOlderThan(cutoffMs: number): Promise<number> {
    const res = await this.db.prepare(`DELETE FROM messages_log WHERE created_at < ?`).bind(cutoffMs).run();
    return res.meta.changes ?? 0;
  }
}

/** テスト用 */
export class MemoryAuditStore implements AuditStore {
  readonly entries: LogEntry[] = [];
  readonly threads = new Map<string, ThreadRecord>();
  readonly links = new Map<string, string>();

  async log(entries: LogEntry[]): Promise<void> {
    for (const e of entries) this.entries.push({ ...e, createdAt: e.createdAt ?? Date.now() });
  }

  async attributions(messageIds: string[]): Promise<Map<string, Attribution>> {
    const ids = new Set(messageIds);
    const result = new Map<string, Attribution>();
    for (const e of this.entries) {
      if (!ids.has(e.messageId) || e.tool === "add_reaction") continue;
      result.set(e.messageId, {
        messageId: e.messageId,
        ownerUserId: e.ownerUserId,
        ownerName: e.ownerName,
        aiKind: e.aiKind,
        tool: e.tool,
        replyToMessageId: e.replyToMessageId ?? null,
        threadId: e.threadId ?? null,
        channelId: e.channelId,
      });
    }
    return result;
  }

  async aiReactions(messageIds: string[]): Promise<Map<string, Record<string, number>>> {
    const ids = new Set(messageIds);
    const seen = new Map<string, Set<string>>();
    for (const e of this.entries) {
      if (e.tool !== "add_reaction" || !ids.has(e.messageId)) continue;
      const emoji = String(e.detail?.emoji ?? "");
      const key = `${e.messageId}\u0000${emoji}`;
      const who = seen.get(key) ?? new Set<string>();
      who.add(`${e.ownerUserId}:${e.aiKind}`);
      seen.set(key, who);
    }
    const result = new Map<string, Record<string, number>>();
    for (const [key, who] of seen) {
      const [messageId, emoji] = key.split("\u0000") as [string, string];
      const counts = result.get(messageId) ?? {};
      counts[emoji] = who.size;
      result.set(messageId, counts);
    }
    return result;
  }

  async getThread(threadId: string): Promise<ThreadRecord | null> {
    return this.threads.get(threadId) ?? null;
  }

  async getThreads(threadIds: string[]): Promise<Map<string, ThreadRecord>> {
    const result = new Map<string, ThreadRecord>();
    for (const id of threadIds) {
      const t = this.threads.get(id);
      if (t) result.set(id, t);
    }
    return result;
  }

  async upsertThread(record: ThreadRecord): Promise<void> {
    const existing = this.threads.get(record.threadId);
    this.threads.set(record.threadId, existing ? { ...existing, title: record.title, status: record.status, updatedAt: record.updatedAt } : record);
  }

  async setThreadStatus(threadId: string, status: ThreadRecord["status"]): Promise<void> {
    const t = this.threads.get(threadId);
    if (t) this.threads.set(threadId, { ...t, status, updatedAt: Date.now() });
  }

  async getSummaryLink(sourceThreadId: string): Promise<string | null> {
    return this.links.get(sourceThreadId) ?? null;
  }

  async setSummaryLink(sourceThreadId: string, summaryThreadId: string): Promise<void> {
    this.links.set(sourceThreadId, summaryThreadId);
  }

  async purgeLogsOlderThan(cutoffMs: number): Promise<number> {
    const before = this.entries.length;
    const keep = this.entries.filter((e) => (e.createdAt ?? 0) >= cutoffMs);
    this.entries.splice(0, this.entries.length, ...keep);
    return before - keep.length;
  }
}
