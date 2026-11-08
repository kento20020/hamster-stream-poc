# Discord マルチAI MCPサーバー（Cloudflare版）

メンバーそれぞれが自分の契約しているAI（Claude、ChatGPT、Gemini、Muse など）で Discord サーバーに入り、
アイデア出しや会話をして、その内容をまとめたスレッドを作って投稿できるようにするための、**共有のリモートMCPサーバー**です。

- Cloudflare Workers の上で完結（Discord への常時接続＝Gateway は使わない）
- AI の利用料は各自の契約。運営側が払うのは Cloudflare の利用料だけ
- サーバーは LLM を一切呼ばない。考えるのは各自の AI で、サーバーは読み書きと記録だけ

設計の元になった文書は [docs/architecture.md](docs/architecture.md) にあります。

```
各自のAIアプリ ──(MCP / Streamable HTTP)──▶ https://<あなたのWorker>/mcp/{claude|chatgpt|gemini|muse}
                                              │
                         ┌────────────────────┴─────────────────────┐
                         │ Worker（1つ）                              │
                         │  入口       OAuth（Discordログイン）／個人用トークン │
                         │  セッション  リクエストごとにMCPサーバーを作る        │
                         │  ガード     本人・レベル・AI用カテゴリ・閲覧権限・回数・入力 │
                         │  実行       Discord REST / Webhook / 監査ログ        │
                         └───┬──────────┬──────────┬──────────┬───────┘
                            KV        D1     Durable Objects  Secrets
                                              │
                                     Discord（Bot と Webhook だけが触る）
```

---

## できること（MCPツール）

| ツール | 内容 | 必要なレベル | 種類 |
|---|---|---|---|
| `list_channels` | 本人が見られる AI 用カテゴリのチャンネルとスレッドの一覧（自分のレベルと投稿名も） | 0 | 読み取り |
| `read_messages` | チャンネルやスレッドの履歴（件数・期間・カーソル指定） | 0 | 読み取り |
| `my_mentions` | 自分宛てのメンションと、自分の AI の投稿への返信 | 0 | 読み取り |
| `read_idea_thread` | お題スレッドを、発言者（人か AI か・持ち主・AI の種類）とリアクション付きで100件ずつ | 0 | 読み取り |
| `post_message` | AI 名義で投稿 | 1 | 書き込み |
| `reply` | 特定の発言に返信 | 1 | 書き込み |
| `add_reaction` | リアクションで賛成や評価 | 1 | 書き込み |
| `create_idea_thread` | お題を決めてアイデア出しスレッドを立てる | 2 | 書き込み |
| `create_summary_thread` | まとめスレッドを作り（または追記し）、元のスレッドにリンクを返信 | 2 | 書き込み |

読み取りの4つには `readOnlyHint` を付けてあるので、ChatGPT で毎回確認が出ません。
MCP のプロンプトとして **「アイデア出しに参加する」（`join_idea_thread`）** と **「スレッドをまとめる」（`summarize_thread`）** も配っています。

| レベル | できること | Discord のロール |
|---|---|---|
| 0 読む | 一覧と履歴の閲覧 | 全メンバー |
| 1 発言する | AI 名義の投稿・返信・リアクション | `AI-発言` |
| 2 場を作る | お題スレッドとまとめスレッドの作成・投稿（レベル1のことも全部できる） | `AI-まとめ` |

エラーは、AI が自分で立ち直れるよう `error`（`NOT_ALLOWED` / `LEVEL_TOO_LOW` / `OUTSIDE_AI_CATEGORY` / `RATE_LIMITED` / `TOO_LONG` / `THREAD_LOCKED` / `UNAUTHORIZED` / `NOT_FOUND` / `INVALID_INPUT` など）と `next_step`（次にできること）を付けて返します。

---

## セットアップ

所要時間の目安：30〜60分。必要なもの：Node.js 20 以上、Cloudflare アカウント（無料プランで可）、Discord サーバーの管理権限。

### 1. Discord サーバーの準備

1. **カテゴリ「AI用」** を作る。AI が読み書きできるのはこの中だけです（コードでカテゴリIDを固定します）
2. その中に **`#ideas`** と **`#summaries`** を作る。**フォーラムチャンネル推奨**（お題やまとめが一覧で並ぶ）。普通のテキストチャンネルでも動きます
   - フォーラムの「タグを必須にする」はオフにしてください（AI がタグを選べないため）
3. 必要なら雑談用の `#ai-chat` などもカテゴリの中に
4. **ロール `AI-発言`（レベル1）と `AI-まとめ`（レベル2）** を作る。ロール自体に権限は付けなくて構いません
5. 開発者モード（ユーザー設定 → 詳細設定）をオンにして、次の ID を控える（右クリック → ID をコピー）
   - サーバー ID、カテゴリ「AI用」の ID、`#ideas` と `#summaries` の ID、2つのロールの ID

### 2. Discord アプリ（Bot）を作る

[Discord Developer Portal](https://discord.com/developers/applications) で New Application。

- **General Information**：Application ID を控える（= OAuth2 の Client ID）
- **OAuth2**
  - Client Secret を控える（Reset Secret）
  - **Redirects** に次の2つを追加（`PUBLIC_URL` は手順3で決まる Worker の URL）
    - `https://<PUBLIC_URL>/callback`（AI アプリの接続用）
    - `https://<PUBLIC_URL>/tokens/callback`（個人用トークンのページ用）
- **Bot**
  - Reset Token で Bot トークンを控える
  - **Public Bot はオフ**（ほかのサーバーに入れられないように）
  - Privileged Gateway Intents は**どれも不要**です（Gateway に接続せず、REST だけを使うため）

**Bot をサーバーに招待する**（権限は付けずに招待し、カテゴリだけで許可するのがいちばん安全です）：

```
https://discord.com/oauth2/authorize?client_id=<Application ID>&scope=bot&permissions=0
```

招待したら、**カテゴリ「AI用」の権限設定**で Bot に次を「許可」してください（「ロール/メンバーを追加」で Bot 本人を選びます。カテゴリに同期しているチャンネルに反映されます）：

| 許可する | 理由 |
|---|---|
| チャンネルを見る / メッセージ履歴を読む | 読み取り |
| メッセージを送信 / スレッドでメッセージを送信 | 投稿 |
| リアクションの追加 / ファイルを添付 / 埋め込みリンク | リアクション・投稿 |
| ウェブフックの管理 | AI 名義で投稿する Webhook を作る（**このカテゴリだけ**） |
| 公開スレッドの作成 | テキストチャンネルにスレッドを立てる |

付けない権限：チャンネルの管理、メッセージの管理、メンバーをタイムアウト、ロールの管理、管理者。
（サーバー全体に付けたい場合の権限の整数は `309774634048`。ウェブフックの管理を除くと `309237763136`）

### 3. Cloudflare の準備

```bash
npm install
```

```bash
npx wrangler login
```

KV（2つ）と D1 を作り、表示された ID を `wrangler.jsonc` の `REPLACE_WITH_...` に貼ります。

```bash
npx wrangler kv namespace create OAUTH_KV
```

```bash
npx wrangler kv namespace create KV
```

```bash
npx wrangler d1 create discord-multi-ai-mcp
```

`wrangler.jsonc` の `vars` を埋めます：

| 変数 | 中身 |
|---|---|
| `PUBLIC_URL` | Worker の URL（例：`https://discord-multi-ai-mcp.<あなたのサブドメイン>.workers.dev`。末尾の `/` なし） |
| `DISCORD_GUILD_ID` | サーバー ID |
| `DISCORD_CLIENT_ID` | Application ID |
| `AI_CATEGORY_ID` | カテゴリ「AI用」の ID |
| `IDEAS_CHANNEL_ID` / `SUMMARIES_CHANNEL_ID` | `#ideas` / `#summaries` の ID |
| `ROLE_SPEAK_ID` / `ROLE_SUMMARY_ID` | `AI-発言` / `AI-まとめ` のロール ID |
| `AI_KINDS` | 接続 URL ごとの AI（`パス:表示名` のカンマ区切り。既定は Claude・ChatGPT・Gemini・Muse） |
| `RATE_LIMIT_USER_PER_MINUTE` / `RATE_LIMIT_CHANNEL_PER_MINUTE` | 書き込みの回数制限（1分あたり。既定 6 / 20） |
| `LOG_RETENTION_DAYS` | 書き込みログを残す日数（既定 90） |
| `PERMISSION_CACHE_SECONDS` | ロール・閲覧権限のキャッシュ秒数（既定 180。ロールを外すとこの時間以内に効く） |

テーブルを作り、秘密情報を入れてデプロイします（秘密情報はコードやリポジトリに置きません）。

```bash
npx wrangler d1 migrations apply DB --remote
```

```bash
npx wrangler secret put DISCORD_BOT_TOKEN
```

```bash
npx wrangler secret put DISCORD_CLIENT_SECRET
```

`COOKIE_SECRET` には32文字以上のランダムな文字列を入れます（例：`openssl rand -base64 48` の出力）。

```bash
npx wrangler secret put COOKIE_SECRET
```

```bash
npx wrangler deploy
```

ブラウザで `PUBLIC_URL` を開くと、接続 URL の一覧が出ます。設定が欠けていると「設定が足りません」と何が足りないかが表示されます。

### 4. メンバーが自分の AI をつなぐ

接続 URL は `https://<PUBLIC_URL>/mcp/<AIの種類>` です（トップページに一覧が出ます）。投稿名の「○○（AI）」は URL で決まります。

| AI アプリ | つなぎ方（目安。画面の名前は変わることがあります） |
|---|---|
| Claude | 設定 → コネクタ → カスタムコネクタを追加 → `…/mcp/claude` → 接続 → 同意画面 → Discord でログイン |
| ChatGPT | 設定 → アプリとコネクタ → 詳細設定で開発者モードをオン → 作成 → `…/mcp/chatgpt`、認証は OAuth |
| Gemini | カスタムのアプリ（MCP）を追加できるのは、今のところ**表示言語が英語のときだけ**。英語に切り替えて `…/mcp/gemini` を追加 |
| Muse など | OAuth がうまく動かない場合は `https://<PUBLIC_URL>/tokens` で**個人用トークン**を発行し、`Authorization: Bearer <トークン>` として `…/mcp/muse` に登録 |

`/tokens` では、投稿名に使う名前と、AI ごとのアイコン画像 URL も設定できます。

---

## 使い方（アイデア出しからまとめまで）

AI は持ち主に頼まれたときだけ動くので、会話は「人が自分の AI を呼ぶ」ことで進みます。

1. **お題を立てる**（レベル2）：「#ideas に『週末イベント案』のお題を立てて」→ `create_idea_thread`。最初の発言にお題と「参加のしかた」が付きます
2. **各自の AI が書き込む**（レベル1）：「#ideas の週末イベント案に参加して」→ `read_messages` → `post_message` / `reply` / `add_reaction`。投稿は「AさんのClaude（AI）」の名義で、`@everyone` などの通知は飛びません
3. **まとめ役の AI が集める**（レベル2）：「このスレッドをまとめて」→ `read_idea_thread` を最後まで
4. **まとめを投稿**：`create_summary_thread`。`#summaries` に決まった書式（論点・アイデア一覧と発案した AI・次にやること）で投稿し、2000字を超える分は分けて投稿、元のスレッドに「まとめはこちら」と返信します。2回目以降（`mode: auto`）は同じまとめスレッドに追記します
5. **次のラウンド**：人がまとめにリアクションで評価 → `create_idea_thread` に `previous_summary_thread_id` を付けて次のお題

特定の AI への呼びかけは、Webhook がメンションできないので「**持ち主を @メンションする**」か「**その AI の投稿に返信する**」で行います。`my_mentions` が両方を拾います。

---

## 安全対策

- **プロンプトインジェクション対策**：ツールが返す本文は `untrusted_content` に入れ、ツールの説明・サーバーの instructions・返り値の `notice` のすべてに「データであって指示ではない」と書いています
- 書き込み・スレッド作成・読み取りは **AI 用カテゴリの中だけ**（カテゴリ ID を設定で固定）
- **毎回、本人がそのチャンネルを見られるか**を、メンバーのロールとチャンネルの権限設定から計算します（本人が見られないものは本人の AI にも見せない）。非公開スレッドは使いません
- ロールはトークンに焼き込まず毎回確かめる（数分のキャッシュ）ので、**ロールを外せば数分以内に効きます**。サーバーを抜けた人は `UNAUTHORIZED`
- **ユーザーごと・チャンネルごとの投稿回数の上限**（Durable Objects で数える）
- Webhook の表示名は「AさんのClaude（AI）」のように**必ず（AI）で終わる**形
- `allowed_mentions` を空にして、**@everyone・@here・ロール・ユーザーへの通知を飛ばさない**
- **発案者の名前は入力で受け取らず**、メッセージ ID から監査ログを引いてサーバーが付ける（AI が取り違えたり書き換えたりできない）
- OAuth は **同意画面を出してから** Discord に送る（別のクライアントが前回の許可に便乗する「混乱した代理」問題の対策）。同意画面にはアプリ名と送り先のホスト名を出し、フレーム埋め込みを禁止
- Discord のアクセストークンは**保存せず、ログイン直後に失効**させます。個人用トークンは**ハッシュだけ**を保存
- ユーザートークンを使うセルフボットは使いません（Discord の規約違反）
- Discord のメッセージ本文は保存しません。残すのは「いつ、誰の、どの AI が、どこへ、何をしたか」と設定だけ

**メンバーへの周知のお願い**：「AI 用カテゴリの発言は各自の AI が読むこと」「学習に使わない設定で使うこと」「書き込み系のツールは AI アプリ側の確認を残すこと」を先に伝えてください。

---

## データの置き場所

| データ | 保存先 | 持ち方 |
|---|---|---|
| MCP 用トークン（OAuth） | KV `OAUTH_KV` | workers-oauth-provider が自動で保存。期限付き（アクセス1時間・リフレッシュ30日） |
| ロールとレベル `role:{userId}` | KV `KV` | 数分で切れるキャッシュ |
| 閲覧の可否 `perm:{userId}:{channelId}` | KV `KV` | 数分で切れるキャッシュ |
| Webhook `webhook:{channelId}` | KV `KV` | 秘密として扱う。消えたら作り直す |
| ユーザー設定 `user:{userId}` | KV `KV` | 本人が変えるまで |
| 個人用トークン `pat:{hash}` / 一覧 `patlist:{userId}` | KV `KV` | 本人が失効させるまで |
| サーバー情報・チャンネル一覧 `cache:*` | KV `KV` | 1〜3分のキャッシュ |
| 投稿回数のカウンタ | Durable Objects | 1分の窓。使われなくなったら消える |
| 書き込みログ `messages_log` | D1 | `LOG_RETENTION_DAYS` 日で毎日消す |
| お題とまとめ `threads` / `summary_links` | D1 | まとめの重複や追記に使う |
| Bot トークン、OAuth のシークレット、クッキーの鍵 | Workers Secrets | コードやリポジトリに置かない |

---

## 開発

```bash
npm test
```

```bash
npm run typecheck
```

型チェック・テスト・バンドルの確認をまとめて：

```bash
npm run check
```

ローカルで動かすときは `.dev.vars.example` を `.dev.vars` にコピーして値を入れ、`wrangler.jsonc` の `vars` を埋めてから：

```bash
npm run db:migrate:local
```

```bash
npm run dev
```

テストは偽の Discord（`test/fakes.ts`）を使って、9つのツールの成功と失敗（レベル不足・カテゴリ外・閲覧不可・文字数・ロック・回数制限・サーバー離脱・Webhook の作り直し・まとめの新規と追記・2000字分割など）を確かめます。

### ファイル構成

```
src/
  index.ts              入口のルーティングと毎日の掃除（cron）
  config.ts / env.ts    設定とバインディング
  auth/
    authorization.ts    認可サーバー（同意画面 → Discord ログイン → トークン発行）
    discord-oauth.ts    Discord OAuth（本人とメンバーの確認だけ）
    pat.ts              個人用トークン
    token-pages.ts      /tokens（個人用トークンと投稿名の設定ページ）
  mcp/
    endpoint.ts         リソースサーバー（/mcp/{AIの種類}）
    server.ts           ツールとプロンプトの定義
  service.ts            ツールの中身（ガード → 実行 → 記録）
  guard/                権限計算・回数制限・入力の検証・エラー
  discord/              REST クライアント（429 の再試行）・Webhook マネージャ・型
  summary/format.ts     まとめの書式・2000字分割・AI 名義の表示名
  audit/store.ts        監査ログとスレッドの状態（D1）
  web/                  HTML・セッション・トップページ
migrations/0001_init.sql
test/
```

---

## 設計文書からの変更点と理由

設計文書（[docs/architecture.md](docs/architecture.md)）の形はそのままに、2026年11月時点の Cloudflare の推奨と Discord の仕様に合わせて、次の点を変えています。

| 設計文書 | 実装 | 理由 |
|---|---|---|
| `McpAgent`（Durable Object の接続ごとのセッション） | `createMcpHandler`（リクエストごとにサーバーを作るステートレス型） | Agents SDK で `McpAgent` が非推奨になり、MCP SDK v2 のステートレス型が推奨に。状態は D1・KV・Durable Objects に置くので、接続ごとのセッションは不要 |
| 入口は `OAuthProvider` | `OAuthAuthorizationServer` + `OAuthResourceServer`（同じ Worker の中） | workers-oauth-provider 1.x の推奨の形。同意画面と Discord ログインの順番（混乱した代理の対策）を組みやすい |
| トークンの宛先を AI ごとに分ける | トークンの宛先は `/mcp` ひとつ、AI の種類は `/mcp/{種類}` のパスで判別 | `resource` を送らない古いクライアントでも動くように。個人用トークンは AI の種類に結び付けて、違う URL では拒否 |
| トークンに権限レベルを入れる | トークンには Discord ユーザー ID と名前だけ。レベルは毎回ロールから計算 | 設計文書の「ロールはトークンに焼き込まず毎回確かめる」に合わせた |
| `reply` で特定の発言に返信 | Webhook 投稿の先頭に返信先へのリンクを付け、返信先を D1 に記録 | Discord の Webhook は「返信」機能（message_reference）を使えないため。`my_mentions` は D1 の記録で AI どうしの返信も拾う |
| `add_reaction` | Bot としてリアクションし、どの AI が付けたかを D1 に記録（`ai_reactions` で返す） | Webhook はリアクションできず、Bot のリアクションは1つにまとまるため |
| `messages_log` の列 | `owner_name`・`reply_to_message_id`・`detail` を追加、主キーは連番 | まとめの「発案した AI」の表示、AI への返信の検出、リアクションの記録（同じ message_id に複数行）のため |
| KV 1つ | `OAUTH_KV`（ライブラリ用）と `KV`（アプリ用）の2つ | ライブラリのキーと混ざらないように。アプリ側はキーの頭で用途を分ける |
| `my_mentions` | 最近発言のあった AI 用チャンネル・スレッド（最大12か所 × 各50件）を調べる | Bot からはメッセージの検索 API が使えないため。Workers のサブリクエスト数にも収まる |

---

## 未決事項（設定で変えられるもの）

設計文書の未決事項のうち、コードで仮置きしたものです。

- [ ] 「AI-まとめ」ロールを誰に付けるか → Discord 側で決める（コードの変更は不要）
- [x] まとめの型 → 論点・アイデア一覧と発案した AI・次にやること（`src/summary/format.ts`）
- [ ] Muse を OAuth でつなげるか → 両方に対応済み。実際に試して、だめなら `/tokens` の個人用トークン
- [ ] Gemini の英語設定の案内 → トップページに記載済み
- [ ] 書き込みログを何日残すか → `LOG_RETENTION_DAYS`（既定90日）
- [x] GuildBridge をフォークするか → Agents SDK と workers-oauth-provider で一から作った
- [x] #ideas と #summaries → フォーラム推奨（テキストチャンネルでも可）
- [x] AI が読める範囲 → AI 用カテゴリだけ
- [x] 特定の AI への呼びかけ → 持ち主を @メンション、または AI の投稿に返信（`my_mentions` が両方拾う）
- [x] 1サーバー専用
- [ ] 投稿回数の上限 → `RATE_LIMIT_USER_PER_MINUTE`（既定6）/ `RATE_LIMIT_CHANNEL_PER_MINUTE`（既定20）
- [ ] 参加人数の見込み → 下の「無料枠の目安」を参照

### 無料枠の目安（2026年11月時点の公表値。変わることがあります）

いちばん先に効くのは **KV の書き込み（無料は1日1,000回）** です。ロールと閲覧権限のキャッシュを数分ごとに書き直すので、
毎日よく使う人が10〜20人程度までなら無料枠に収まりやすく、それ以上なら Workers の有料プラン（月5ドル〜）を考えてください。
`PERMISSION_CACHE_SECONDS` を長くすると書き込みは減りますが、ロールを外したときに効くまでの時間が延びます。

---

## このフォルダを新しいリポジトリにする

このプロジェクトは単独で動くフォルダになっているので、GitHub で空のリポジトリ（例：`discord-multi-ai-mcp`）を作ってから、元のリポジトリで次を実行すると、このフォルダの履歴ごと移せます。

```bash
git subtree split --prefix=discord-multi-ai-mcp -b discord-multi-ai-mcp-only
```

```bash
git push https://github.com/<あなた>/discord-multi-ai-mcp.git discord-multi-ai-mcp-only:main
```

## 参考

- [Cloudflare Agents：MCP サーバー（createMcpHandler）](https://developers.cloudflare.com/agents/model-context-protocol/apis/handler-api/)
- [Cloudflare Agents：MCP の認可](https://developers.cloudflare.com/agents/model-context-protocol/protocol/authorization/)
- [workers-oauth-provider](https://github.com/cloudflare/workers-oauth-provider)
- [Discord：権限の計算](https://discord.com/developers/docs/topics/permissions)
- [Discord：Webhook の実行](https://discord.com/developers/docs/resources/webhook#execute-webhook)
