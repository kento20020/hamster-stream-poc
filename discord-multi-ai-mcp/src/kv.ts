/**
 * KV の薄いラッパー。キーの頭で用途を分ける：
 *   role:{userId}              ロールと権限レベル（数分で切れるキャッシュ）
 *   perm:{userId}:{channelId}  そのチャンネルを見られるか（数分で切れるキャッシュ）
 *   webhook:{channelId}        WebhookのIDとトークン（秘密。消えたら作り直す）
 *   user:{userId}              表示名、AIのアイコン（本人が変えるまで）
 *   pat:{hash}                 個人トークン（ハッシュだけ保存。本人が失効させるまで）
 *   patlist:{userId}           本人が発行した個人トークンの一覧（画面表示用）
 *   cache:*                    サーバー情報・チャンネル一覧の短いキャッシュ
 */
export interface JsonStore {
  get<T>(key: string): Promise<T | null>;
  put(key: string, value: unknown, options?: { ttlSeconds?: number }): Promise<void>;
  delete(key: string): Promise<void>;
}

/** KV の expirationTtl の最小値 */
export const KV_MIN_TTL = 60;

export class KvJsonStore implements JsonStore {
  constructor(private readonly kv: KVNamespace) {}

  async get<T>(key: string): Promise<T | null> {
    return (await this.kv.get<T>(key, "json")) ?? null;
  }

  async put(key: string, value: unknown, options: { ttlSeconds?: number } = {}): Promise<void> {
    const ttl = options.ttlSeconds;
    await this.kv.put(key, JSON.stringify(value), ttl ? { expirationTtl: Math.max(KV_MIN_TTL, Math.ceil(ttl)) } : undefined);
  }

  async delete(key: string): Promise<void> {
    await this.kv.delete(key);
  }
}

/** テストやリクエスト内のメモ用 */
export class MemoryJsonStore implements JsonStore {
  readonly data = new Map<string, unknown>();

  async get<T>(key: string): Promise<T | null> {
    return this.data.has(key) ? (structuredClone(this.data.get(key)) as T) : null;
  }

  async put(key: string, value: unknown): Promise<void> {
    this.data.set(key, structuredClone(value));
  }

  async delete(key: string): Promise<void> {
    this.data.delete(key);
  }
}

export interface UserSettings {
  /** 投稿名に使う表示名（未設定ならサーバーのニックネーム） */
  displayName?: string;
  /** AIの種類ごとのアイコン画像URL（https） */
  avatars?: Record<string, string>;
}
