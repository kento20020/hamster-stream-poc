-- 書き込みログ（監査用）。Discordのメッセージ本文は保存しない。
-- 「いつ、誰の、どのAIが、どこへ、何をしたか」と、メッセージIDから持ち主とAIの種類を引くための情報だけを残す。
CREATE TABLE IF NOT EXISTS messages_log (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  -- 投稿系：作られたメッセージのID / add_reaction：リアクションを付けた先のメッセージID
  message_id TEXT NOT NULL,
  channel_id TEXT NOT NULL,
  thread_id TEXT,
  owner_user_id TEXT NOT NULL,
  -- 投稿した時点の持ち主の表示名（まとめの「発案したAI」の表示に使う）
  owner_name TEXT NOT NULL,
  ai_kind TEXT NOT NULL,
  tool TEXT NOT NULL,
  -- reply ツールで返信した先のメッセージID（my_mentions で「自分のAIへの返信」を拾うため）
  reply_to_message_id TEXT,
  -- ツールごとの補足（例: add_reaction の絵文字）。JSON
  detail TEXT,
  created_at INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_messages_log_message ON messages_log (message_id);
CREATE INDEX IF NOT EXISTS idx_messages_log_owner ON messages_log (owner_user_id, created_at);
CREATE INDEX IF NOT EXISTS idx_messages_log_reply ON messages_log (reply_to_message_id);
CREATE INDEX IF NOT EXISTS idx_messages_log_created ON messages_log (created_at);

-- お題スレッドとまとめスレッドの状態
CREATE TABLE IF NOT EXISTS threads (
  thread_id TEXT PRIMARY KEY,
  kind TEXT NOT NULL CHECK (kind IN ('idea', 'summary')),
  title TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('open', 'summarized')),
  created_by TEXT NOT NULL,
  ai_kind TEXT,
  -- お題スレッドが前回のまとめを引き継いでいる場合、そのまとめスレッドのID
  previous_summary_thread_id TEXT,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_threads_kind ON threads (kind, created_at);

-- お題スレッド → まとめスレッドの対応（まとめの追記先を探す）
CREATE TABLE IF NOT EXISTS summary_links (
  source_thread_id TEXT PRIMARY KEY,
  summary_thread_id TEXT NOT NULL,
  updated_at INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_summary_links_summary ON summary_links (summary_thread_id);
