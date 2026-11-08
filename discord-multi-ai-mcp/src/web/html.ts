/** 自動でエスケープする小さな HTML テンプレート。クライアントが名乗る名前なども安全に出せる。 */

export class SafeHtml {
  constructor(readonly value: string) {}
  toString(): string {
    return this.value;
  }
}

export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function render(value: unknown): string {
  if (value instanceof SafeHtml) return value.value;
  if (Array.isArray(value)) return value.map(render).join("");
  if (value === null || value === undefined || value === false) return "";
  return escapeHtml(String(value));
}

export function html(strings: TemplateStringsArray, ...values: unknown[]): SafeHtml {
  let out = strings[0] ?? "";
  values.forEach((value, i) => {
    out += render(value) + (strings[i + 1] ?? "");
  });
  return new SafeHtml(out);
}

const STYLE = `
:root{--bg:#f6f6f8;--fg:#1d1d22;--muted:#5d5d6b;--card:#fff;--line:#dcdce4;--accent:#5865f2;--accent-fg:#fff;--warn:#b54708;--ok:#067647}
@media (prefers-color-scheme:dark){:root{--bg:#16161b;--fg:#ececf1;--muted:#a3a3b2;--card:#202028;--line:#33333f;--accent:#7983f5;--accent-fg:#0d0d12;--warn:#f79009;--ok:#47cd89}}
*{box-sizing:border-box}
body{margin:0;background:var(--bg);color:var(--fg);font:16px/1.7 system-ui,-apple-system,"Hiragino Sans","Noto Sans JP",sans-serif}
main{max-width:720px;margin:0 auto;padding:32px 16px 64px}
h1{font-size:1.5rem;line-height:1.3;margin:0 0 16px}
h2{font-size:1.15rem;margin:32px 0 8px}
p{margin:8px 0}
.card{background:var(--card);border:1px solid var(--line);border-radius:12px;padding:16px 20px;margin:16px 0}
.muted{color:var(--muted);font-size:.92rem}
.warn{color:var(--warn)}
.ok{color:var(--ok)}
code,.mono{font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:.9em;word-break:break-all}
.token{display:block;padding:12px;border-radius:8px;border:1px dashed var(--line);background:var(--bg);user-select:all}
button,.button{display:inline-block;font:inherit;border-radius:8px;padding:8px 16px;border:1px solid var(--line);background:var(--card);color:var(--fg);cursor:pointer;text-decoration:none}
button.primary,.button.primary{background:var(--accent);color:var(--accent-fg);border-color:var(--accent)}
.row{display:flex;gap:8px;flex-wrap:wrap;align-items:center}
label{display:block;margin:8px 0 4px;font-size:.92rem}
input,select{font:inherit;width:100%;padding:8px 10px;border-radius:8px;border:1px solid var(--line);background:var(--bg);color:var(--fg)}
table{width:100%;border-collapse:collapse;font-size:.92rem}
td,th{border-bottom:1px solid var(--line);padding:8px 4px;text-align:left;vertical-align:top}
ul{padding-left:1.2em}
`;

export function page(title: string, body: SafeHtml, init: { status?: number; headers?: Headers } = {}): Response {
  const headers = new Headers(init.headers);
  headers.set("Content-Type", "text/html; charset=utf-8");
  headers.set("Cache-Control", "no-store");
  headers.set("X-Content-Type-Options", "nosniff");
  headers.set("Referrer-Policy", "no-referrer");
  if (!headers.has("X-Frame-Options")) headers.set("X-Frame-Options", "DENY");
  headers.set(
    "Content-Security-Policy",
    "default-src 'none'; style-src 'unsafe-inline'; img-src 'self' https:; frame-ancestors 'none'; base-uri 'none'",
  );
  const doc = html`<!doctype html>
<html lang="ja">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex">
<title>${title}</title>
<style>${new SafeHtml(STYLE)}</style>
</head>
<body><main>${body}</main></body>
</html>`;
  return new Response(doc.value, { status: init.status ?? 200, headers });
}

export function errorPage(title: string, message: string, status = 400): Response {
  return page(title, html`<h1>${title}</h1><div class="card"><p>${message}</p></div><p><a href="/">トップへ</a></p>`, { status });
}
