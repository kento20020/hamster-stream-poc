// パチンコ演出 PoC の土台。どの話も最後は ending(r) (家族ラッシュ → 図柄の結果) で終わる。
// ページ: <script src="pachi.js"></script><script src="stories.js"></script><script>play("cage")</script>
// 背景は配信演出と同じ OW のプレイ画面 (../配信ギミック/ow_bg.png)。話ごとの背景は塗らず、小道具だけを上に置く
// URL: ?r=big|mid|miss で結果を固定 (なければ毎回抽選)。&debug=1 で計測を画面に出す。&mini=1 で右下の小窓で小さく流す。
const HAM = "../通常ハム.png";
const W = 960, H = 540, CX = W / 2, CY = H / 2, INK = "#331c16";
const IW = 1237, IH = 1271, RAT = IW / IH; // ハム画像の大きさ
const Q = new URLSearchParams(location.search), DEBUG = Q.get("debug") === "1";
const FIXED = ["big", "mid", "miss"].includes(Q.get("r")) ? Q.get("r") : null;
const MINI = Q.get("mini") === "1", MS = .42; // mini=1: 右下の小窓で小さく流す版。MS は小窓の大きさ (画面に対する割合)

// ★ 結末のタイミング。ここを変えると全部の話に効く
const CFG = {
  total: 4000, // 最初のハムが画面に入ってから、最後のハムが出ていくまで (ミリ秒)
  hide: 2000,  // 大当たりで、ど真ん中がハムで隠れている長さ。total の真ん中 (2秒) をはさんで 1〜3秒になる
  odds: { big: 34, mid: 33, miss: 33 }, // 結果をおまかせにしたときの出やすさ (見本なので実機よりずっと当たる)
};
const RES = { big: "大当たり", mid: "当たり", miss: "ハズレ" };

// ===== 予告の色。右ほど期待できる。虹は大当たりだけ =====
const CH = ["blue", "green", "red", "gold", "rainbow"];
const CH_NAME = { blue: "青", green: "緑", red: "赤", gold: "金", rainbow: "虹" };
const CH_HEX = { blue: "#38a2ff", green: "#34e07a", red: "#ff3d3d", gold: "#ffcf33", rainbow: "#ff7ad9" };
const CH_W = { big: [3, 10, 37, 35, 15], mid: [14, 34, 40, 12, 0], miss: [50, 34, 16, 0, 0] };
const wpick = ws => { let x = Math.random() * ws.reduce((a, b) => a + b, 0); for (let i = 0; i < ws.length; i++) if ((x -= ws[i]) < 0) return i; return ws.length - 1; };
const lotColor = r => CH[wpick(CH_W[r])];
const RAINBOW = "linear-gradient(90deg,#ff5a5a,#ffb43c,#fff04d,#5dff8f,#59c8ff,#b07bff,#ff5a5a)";
const chBG = c => c === "rainbow" ? RAINBOW : `repeating-linear-gradient(100deg,#0002 0 26px,#0000 26px 52px),linear-gradient(${{ blue: "#9ad4ff,#1b6fe0 55%,#0a3a9a", green: "#a8ffc4,#14b85a 55%,#06642e", red: "#ffb0b0,#e01818 55%,#7a0606", gold: "#fff3b0,#ffb800 55%,#9a5a00", silver: "#fff,#9aa6b8 55%,#4a5568" }[c]})`;

// 文字の塗り (メタリック) とフチの色
const FILL = {
  gold: "linear-gradient(#fffbe6 8%,#ffe45c 38%,#ff9f0a 58%,#fff1a8 61%,#ffb81c 100%)",
  red: "linear-gradient(#fff2f2 8%,#ff7a7a 38%,#d40000 58%,#ff9a9a 61%,#b30000 100%)",
  blue: "linear-gradient(#f0f8ff 8%,#7cc6ff 38%,#0a5ad6 58%,#a6dcff 61%,#0b47a8 100%)",
  green: "linear-gradient(#f0fff3 8%,#7dffa4 38%,#05a845 58%,#b2ffc9 61%,#04863a 100%)",
  silver: "linear-gradient(#fff 8%,#dfe6ee 38%,#8a96a8 58%,#f2f5f8 61%,#aab4c2 100%)",
  white: "linear-gradient(#fff 45%,#d6def0)",
  rainbow: RAINBOW,
};
const STROKE = { gold: "#5a2a00", red: "#3a0000", blue: "#001a4a", green: "#003014", silver: "#1a2030", white: "#1a1430", rainbow: "#24104a" };

document.head.insertAdjacentHTML("beforeend", `<style>
html,body{margin:0;height:100%;background:#000;overflow:hidden}
#s{position:absolute;left:0;top:0;width:960px;height:540px;overflow:hidden;transform-origin:0 0;color:#fff;background:#171d2c url(../配信ギミック/ow_bg.png) center/cover;
 font:900 28px "Yu Gothic","Hiragino Sans","Hiragino Kaku Gothic ProN",Meiryo,sans-serif;user-select:none;-webkit-user-select:none}
:is(#s,#ov) *{position:absolute;box-sizing:border-box}
:is(#s,#ov) .ham{transform-origin:50% 100%}
:is(#s,#ov) .ham div{left:0;top:0;width:100%;height:100%;transform-origin:50% 100%}
:is(#s,#ov) .ham img,:is(#s,#ov) .ham svg{left:0;top:0;width:100%;height:100%;overflow:visible}
:is(#s,#ov) .bt{white-space:nowrap;line-height:1.15;translate:-50% -50%;filter:drop-shadow(0 5px 0 #0009)}
:is(#s,#ov) .bt>span{position:relative;display:block;color:var(--sc);-webkit-text-stroke:var(--sw) var(--sc);paint-order:stroke fill}
:is(#s,#ov) .bt>span+span{position:absolute;left:0;top:0;color:transparent;-webkit-text-stroke:0;background:var(--fill);-webkit-background-clip:text;background-clip:text}
:is(#s,#ov) .rbw{background-size:300% 100% !important;animation:rbw 1.2s linear infinite}
@keyframes rbw{to{background-position:-300% 0}}
:is(#s,#ov) .bub{background:#fff;color:#2a1a10;padding:5px 14px;border-radius:16px;font-size:22px;white-space:nowrap;translate:-50% -100%;border:3px solid ${INK};z-index:75}
:is(#s,#ov) .bub::after{content:"";position:absolute;left:50%;bottom:-13px;margin-left:-8px;border:8px solid transparent;border-top-color:${INK}}
:is(#s,#ov) .wig{animation:wig .09s linear infinite}@keyframes wig{0%,100%{transform:rotate(-5deg) translateX(-3px)}50%{transform:rotate(5deg) translateX(3px)}}
:is(#s,#ov) .trem{animation:trem .12s linear infinite}@keyframes trem{50%{transform:translateX(2px)}}
:is(#s,#ov) .run{animation:run .15s ease-in-out infinite}@keyframes run{50%{transform:translateY(-9%) rotate(-4deg)}}
:is(#s,#ov) .cheer{animation:cheer .38s ease-in-out infinite}@keyframes cheer{50%{transform:translateY(-28%) scale(1.04,.96)}}
:is(#s,#ov) .bob{animation:bob .9s ease-in-out infinite}@keyframes bob{50%{transform:translateY(-4%)}}
:is(#s,#ov) .pulse{animation:pulse .5s ease-in-out infinite}@keyframes pulse{50%{transform:scale(1.12);opacity:.7}}
:is(#s,#ov) .spin{animation:spin .7s linear infinite}@keyframes spin{to{transform:rotate(360deg)}}
:is(#s,#ov) .blink{animation:blink 3s infinite}@keyframes blink{0%,92%,100%{transform:scaleY(1)}95%{transform:scaleY(.1)}}
:is(#s,#ov) .dr{animation:dr .8s linear infinite}@keyframes dr{to{transform:translateY(160px);opacity:0}}
:is(#s,#ov) .rbg{background:${RAINBOW};background-size:300% 100%;animation:rbw 1s linear infinite}
:is(#s,#ov) .mini{display:flex;align-items:center;gap:4px;padding:4px 6px;background:#000b;border:2px solid #fff8;border-radius:10px}
:is(#s,#ov) .mini b,:is(#s,#ov) .mini i{position:relative}
:is(#s,#ov) .mini b{width:34px;height:42px;background:linear-gradient(#fff,#dfe3ee);font-size:32px;line-height:42px;text-align:center;border-radius:6px;-webkit-text-stroke:2px #fff;paint-order:stroke fill}
:is(#s,#ov) .mini i{font-style:normal;font-size:15px;color:#ffd23c;margin-right:3px;animation:pulse .5s infinite}
:is(#s,#ov) .reel{width:152px;height:196px;border-radius:20px;background:linear-gradient(#fff,#e4e8f2);border:7px solid #2a1650;box-shadow:inset 0 -16px 0 #0000001a,0 10px 0 #0006}
:is(#s,#ov) .reel b{left:0;right:0;top:0;text-align:center;font-size:168px;line-height:182px;-webkit-text-stroke:7px #2a0a10;paint-order:stroke fill}
:is(#s,#ov) .reel.on{animation:glow .5s ease-in-out infinite alternate}@keyframes glow{to{box-shadow:0 0 34px 10px #fff6a0,0 10px 0 #0006}}
:is(#s,#ov) .push{width:120px;height:120px;translate:-50% -50%;border-radius:50%;cursor:pointer;background:radial-gradient(circle at 40% 30%,#ffc2c2,#ff2a2a 45%,#9a0000 82%);border:6px solid #fff;box-shadow:0 0 0 6px #b00000,0 0 34px #ff3030;animation:pulse .45s ease-in-out infinite}
:is(#s,#ov) .push span{left:0;right:0;top:38px;text-align:center;font-size:30px;color:#fff;-webkit-text-stroke:5px #600;paint-order:stroke fill}
:is(#s,#ov) .push i{inset:-8px;border-radius:50%;border:4px solid #fff;animation:ring 1s ease-out infinite}:is(#s,#ov) .push i+i{animation-delay:.5s}
@keyframes ring{from{transform:scale(1);opacity:.9}to{transform:scale(1.9);opacity:0}}
:is(#s,#ov) .cut .ln{left:0;top:0;width:100%;height:100%;background:repeating-linear-gradient(90deg,#fff0 0 70px,#fff4 70px 76px);animation:ln .25s linear infinite}@keyframes ln{to{background-position:-76px 0}}
:is(#s,#ov) .cnt{padding:5px 14px;background:#000c;border:2px solid #ffd23c;border-radius:12px;font-size:20px;color:#fff;white-space:nowrap}
:is(#s,#ov) .cnt b{position:relative;color:#ffd23c;font-size:28px}:is(#s,#ov) .cnt small,:is(#s,#ov) .cnt span{position:relative;font-size:16px;color:#ccd}
:is(#s,#ov) .dbg{position:absolute;width:250px;padding:8px 10px;background:#000d;border:1px solid #6cf;border-radius:8px;font:bold 14px/1.5 Consolas,monospace;color:#cfe}
:is(#s,#ov) .dbg div{position:relative}:is(#s,#ov) .dbg .bar{height:12px;margin-top:4px;background:#234;border-radius:3px}:is(#s,#ov) .dbg .bar i{position:absolute;top:0;height:100%}
/* 小窓版: OW の画面 (#tv) の右下に小窓 (#win)。中身はいつもの 960×540 の舞台 (#s) を縮めたもの */
#tv{position:absolute;left:0;top:0;width:960px;height:540px;overflow:hidden;transform-origin:0 0;background:#171d2c url(../配信ギミック/ow_bg.png) center/cover}
#win{position:absolute;left:-14px;top:-14px;width:960px;height:540px;transform:scale(${MS});transform-origin:100% 100%;scale:0;opacity:0}
#win #s{border-radius:30px;background:rgba(14,10,32,.5);-webkit-backdrop-filter:blur(5px);backdrop-filter:blur(5px);box-shadow:0 0 0 9px #fff,0 0 0 18px #d0103a,0 18px 40px #000c}
#rest{position:absolute;left:720px;top:304px;width:224px;transform-origin:50% 100%}
#ov{position:absolute;left:0;top:0;width:960px;height:540px;overflow:hidden;pointer-events:none}
:is(#s,#ov) .stars{animation:spin .6s linear infinite}:is(#s,#ov) .stars i{font-style:normal;color:#ffe14d;font-size:30px;-webkit-text-stroke:2px #6a4300;paint-order:stroke fill;translate:-50% -50%}
</style>`);
// 目のフタ用のグラデーション (目の上は灰色、下は白い毛)。ページ全体で1つ
document.body.insertAdjacentHTML("beforeend", `<svg width="0" height="0" style="position:absolute"><defs><linearGradient id="eyefur" x1="0" y1="0" x2="0" y2="1"><stop offset=".84" stop-color="#bfb8b6"/><stop offset=".84" stop-color="#fbf5e9"/></linearGradient></defs></svg>`);
const s = document.createElement("div"); s.id = "s";
const TV = MINI ? document.createElement("div") : null, WIN = MINI ? document.createElement("div") : null, REST = MINI ? document.createElement("img") : null, OV = MINI ? document.createElement("div") : null;
// 小窓版: ふだんは右下にいつものハム (REST)。小窓 (WIN) の上に、画面全体をおおう透明な層 (OV) を重ね、最後の家族ラッシュだけはそこで走らせる
if (MINI) { TV.id = "tv"; WIN.id = "win"; REST.id = "rest"; OV.id = "ov"; REST.src = HAM; document.body.append(TV); TV.append(REST, WIN, OV); WIN.append(s); }
else document.body.append(s);
// K: 舞台の 1px が画面で何 px か、KT: 画面全体の 1px が画面で何 px か (どちらも canvas の細かさに使う)、KP: 舞台を揺らすときの単位
let K = 1, KT = 1, KP = 1;
const fit = () => { const k = Math.min(innerWidth / W, innerHeight / H); (MINI ? TV : s).style.transform = `translate(${(innerWidth - W * k) / 2}px,${(innerHeight - H * k) / 2}px) scale(${k})`; K = MINI ? k * MS : k; KT = k; KP = MINI ? 1 : k; };
addEventListener("resize", fit); fit();

// ===== 小道具 =====
const wait = ms => new Promise(r => setTimeout(r, ms));
const rnd = (a, b) => a + Math.random() * (b - a);
const pick = a => a[Math.floor(Math.random() * a.length)];
const lerp = (a, b, p) => a + (b - a) * p;
const ease = p => p < .5 ? 2 * p * p : 1 - (-2 * p + 2) ** 2 / 2;
const TIMERS = new Set();
const every = (ms, f) => { const id = setInterval(f, ms); TIMERS.add(id); return id; };
const add = (html, css = "", parent = s) => {
  const t = document.createElement("template"); t.innerHTML = html.trim();
  const e = t.content.firstChild; e.style.cssText += css; parent.append(e); return e;
};
const anim = (e, kf, ms = 350, o = {}) => e.animate(kf, { duration: ms, easing: "ease-out", fill: "forwards", ...o }).finished.catch(() => {});
const tell = o => { try { if (parent !== window) parent.postMessage({ pachi: o }, "*"); } catch (e) {} }; // 一覧ページに知らせる
const note = text => tell({ phase: "note", text }); // 予告の中身など
const flash = (c = "#fff", ms = 260, o = .9) => { const f = add(`<div></div>`, `left:0;top:0;width:960px;height:540px;background:${c};z-index:88;pointer-events:none`); anim(f, [{ opacity: o }, { opacity: 0 }], ms).then(() => f.remove()); };
const quake = (ms = 400, px = 8) => s.animate(Array.from({ length: 9 }, (_, i) => ({ translate: i === 8 ? "0 0" : `${rnd(-px, px) * KP}px ${rnd(-px, px) * KP}px` })), { duration: ms, easing: "linear" });
// 大きい文字 (パチンコっぽいメタリック文字)。fill: gold / red / blue / green / silver / white / rainbow
const big = (txt, x, y, o = {}) => {
  const f = o.fill || "gold", sz = o.size || 64;
  const e = add(`<div class=bt><span>${txt}</span><span class="${f === "rainbow" ? "rbw" : ""}">${txt}</span></div>`,
    `left:${x}px;top:${y}px;font-size:${sz}px;--fill:${FILL[f]};--sc:${o.stroke || STROKE[f]};--sw:${o.sw || Math.max(5, Math.round(sz / 6))}px;z-index:${o.z || 80}`, o.parent);
  if (o.pop !== false) anim(e, [{ transform: "scale(2.6)", opacity: 0 }, { transform: "scale(.92)", opacity: 1, offset: .7 }, { transform: "none", opacity: 1 }], 230, { fill: "none" });
  if (o.ms) wait(o.ms).then(() => anim(e, [{ opacity: 1 }, { opacity: 0, transform: "scale(1.15)" }], 180).then(() => e.remove()));
  return e;
};
const bub = (txt, x, y, ms = 1100, o = {}) => {
  const b = add(`<div class=bub>${txt}</div>`, `left:${x}px;top:${y}px;font-size:${o.size || 22}px;z-index:${o.z || 76}`);
  anim(b, [{ transform: "scale(.3)" }, { transform: "none" }], 160, { fill: "none" });
  if (ms) wait(ms).then(() => b.remove());
  return b;
};
// 破片・ほこり・火花。dir を渡すとその向きに飛ぶ
const bits = (x, y, n, o = {}) => {
  for (let i = 0; i < n; i++) {
    const sz = rnd(o.min || 5, o.max || 12), c = add(`<div></div>`, `left:${x}px;top:${y}px;width:${sz}px;height:${sz}px;border-radius:${o.round ? "50%" : "2px"};background:${pick(o.colors || ["#c9d1dc"])};z-index:${o.z || 74}`, o.parent);
    const a = o.dir !== undefined ? o.dir + rnd(-(o.spread ?? .6), o.spread ?? .6) : rnd(0, 6.283), d = rnd(o.dmin || 40, o.dmax || 140);
    anim(c, [{ transform: "none", opacity: 1 }, { transform: `translate(${Math.cos(a) * d}px,${Math.sin(a) * d + (o.grav ?? 60)}px) rotate(${rnd(-400, 400)}deg) scale(${o.grow || 1})`, opacity: 0 }],
      rnd(400, o.ms || 800), { easing: "cubic-bezier(.2,.7,.4,1)" }).then(() => c.remove());
  }
};
const puff = (x, y, n = 6, col = "#e9dfcf", parent) => bits(x, y, n, { round: 1, colors: [col], min: 14, max: 30, dmin: 15, dmax: 70, grav: -20, grow: 1.8, ms: 700, z: 30, parent });
const starPath = (n, R, r) => Array.from({ length: n * 2 }, (_, i) => { const a = i * Math.PI / n, d = i % 2 ? r : R; return `${i ? "L" : "M"}${(Math.cos(a) * d).toFixed(1)} ${(Math.sin(a) * d).toFixed(1)}`; }).join("") + "Z";
const impact = (x, y, c = "#fff", sz = 240) => { const e = add(`<svg viewBox="-50 -50 100 100"><path d="${starPath(12, 50, 20)}" fill="${c}" stroke="#0005" stroke-width="2"/></svg>`, `left:${x - sz / 2}px;top:${y - sz / 2}px;width:${sz}px;height:${sz}px;z-index:84`); anim(e, [{ transform: "scale(.2)", opacity: 1 }, { transform: "scale(1.15) rotate(20deg)", opacity: 0 }], 380).then(() => e.remove()); };
const kira = (x, y, c = "#fff", sz = 60) => { const e = add(`<div>✦</div>`, `left:${x}px;top:${y}px;font-size:${sz}px;line-height:1;color:${c};translate:-50% -50%;z-index:83;text-shadow:0 0 16px ${c}`); anim(e, [{ transform: "scale(.2)", opacity: 1 }, { transform: "scale(1.1)", opacity: 1, offset: .4 }, { transform: "scale(.3) rotate(90deg)", opacity: 0 }], 320).then(() => e.remove()); };

// ===== ハム (DOM)。外側=移動と大きさ、p=姿勢、b=小刻みな動き(クラス) =====
const TINT = ["", "sepia(.55) saturate(1.6) hue-rotate(-6deg) brightness(1.03)", "sepia(.85) saturate(1.25) brightness(.8)", "sepia(.3) saturate(.8) brightness(1.13)"]; // 灰・金・茶・クリーム
const ham = (x, y, h, o = {}) => { // (x, y) は足元のまん中、h は高さ
  const w = h * RAT, e = add(`<div class=ham><div><div><img src="${HAM}" draggable="false"></div></div></div>`,
    `left:${x - w / 2}px;top:${y - h}px;width:${w}px;height:${h}px;z-index:${o.z ?? 10}`, o.parent);
  e.p = e.firstChild; e.b = e.p.firstChild; Object.assign(e, { w, h, fx: x, fy: y, px: x, py: y, k: 1, pz: "none", faces: [], fn: [], tint: o.tint || 0 });
  if (o.tint) e.b.style.filter = TINT[o.tint];
  return e;
};
// 移動。(x, y) は足元。o.arc で山なり、o.k で大きさ、o.fade で消える
const mv = (h, x, y, ms = 400, o = {}) => {
  const x0 = h.px, y0 = h.py, k0 = h.k, k1 = o.k ?? k0, n = o.arc ? 12 : 1;
  const kf = Array.from({ length: n + 1 }, (_, i) => { const p = i / n;
    return { transform: `translate(${lerp(x0, x, p) - h.fx}px,${lerp(y0, y, p) - (o.arc || 0) * Math.sin(Math.PI * p) - h.fy}px) scale(${lerp(k0, k1, p)})`, opacity: o.fade ? 1 - p : 1 }; });
  Object.assign(h, { px: x, py: y, k: k1 });
  return anim(h, kf, ms, { easing: o.ease || (o.arc ? "linear" : "ease-in-out") });
};
const pose = (h, t, ms = 200, o = {}) => { const a = anim(h.p, [{ transform: h.pz }, { transform: t }], ms, o); h.pz = t; return a; };
const poseSet = (h, t = "none", origin = "50% 100%") => { h.p.getAnimations().forEach(a => a.cancel()); h.p.style.transformOrigin = origin; h.p.style.transform = t; h.pz = t; };
const act = (h, cls = "") => { h.b.className = cls; };

// 表情 (元画像の座標で描く)
const EY = [380, 828], EC = 495;
const stk = (w, c = INK) => `fill="none" stroke="${c}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"`;
const cover = EY.map(x => `<circle cx="${x}" cy="${EC}" r="101" fill="url(#eyefur)"/>`).join("");
const mouthCover = `<ellipse cx="600" cy="652" rx="130" ry="46" fill="#fbf5e9"/>`;
const spiral = (x, y) => "M" + Array.from({ length: 34 }, (_, i) => { const a = i * .55, r = 6 + i * 2.6; return `${(x + Math.cos(a) * r).toFixed(1)} ${(y + Math.sin(a) * r).toFixed(1)}`; }).join("L");
const FACE = {
  happy: cover + EY.map(x => `<path d="M${x - 66} 530Q${x} 424 ${x + 66} 530" ${stk(20)}/>`).join(""),
  shut: cover + `<path d="M318 440L430 495L318 550M890 440L778 495L890 550" ${stk(20)}/>`,
  white: EY.map(x => `<circle cx="${x}" cy="${EC}" r="92" fill="#fff" stroke="${INK}" stroke-width="14"/><circle cx="${x}" cy="${EC}" r="10" fill="${INK}"/>`).join(""),
  dizzy: cover + EY.map(x => `<path d="${spiral(x, EC)}" ${stk(11)}/>`).join(""),
  brows: `<path d="M250 330L478 412M987 330L759 412" ${stk(40)}/>`,
  sad: `<path d="M262 410L470 336M975 410L767 336" ${stk(32)}/>`,
  open: mouthCover + `<ellipse cx="600" cy="668" rx="62" ry="54" fill="#c9485b" stroke="${INK}" stroke-width="14"/>`,
  yell: mouthCover + `<path d="M500 630Q600 612 700 630Q690 805 600 805Q510 805 500 630Z" fill="#c9485b" stroke="${INK}" stroke-width="15"/><path d="M546 765Q600 726 654 765Q630 795 600 795Q570 795 546 765Z" fill="#ff8a9a"/>`,
  frown: mouthCover + `<path d="M520 686Q600 626 680 686" ${stk(15)}/>`,
  grit: mouthCover + `<rect x="512" y="628" width="176" height="62" rx="20" fill="#fff" stroke="${INK}" stroke-width="13"/><path d="M556 630V688M600 630V688M644 630V688" ${stk(9)}/>`,
  tears: EY.map(x => `<path class="dr" d="M${x} 585q-26 44 0 60q26-16 0-60" fill="#7cc4ff" stroke="${INK}" stroke-width="6"/>`).join(""),
  stream: EY.map(x => `<path d="M${x - 34} 570Q${x - 50} 900 ${x - 72} 1180H${x + 40}Q${x + 30} 900 ${x + 34} 570Z" fill="#8fd0ffd0" stroke="#3a8ac8" stroke-width="8"/>`).join(""),
  sweat: `<path d="M1090 290q-46 80 0 112q46-32 0-112" fill="#a8e4ff" stroke="${INK}" stroke-width="8"/>`,
  blush: `<ellipse cx="255" cy="655" rx="95" ry="55" fill="#ff7a8a" opacity=".55"/><ellipse cx="985" cy="655" rx="95" ry="55" fill="#ff7a8a" opacity=".55"/>`,
};
const face = (h, ...names) => { h.fn = names; h.faces.forEach(f => f.remove()); h.faces = names.filter(Boolean).map(n => add(`<svg viewBox="0 0 ${IW} ${IH}">${FACE[n]}</svg>`, "", h.b)); };
// ぐるぐる星 (目を回したとき)
const stars = h => { const w = add(`<div></div>`, "left:50%;top:-6%;width:0;height:0;transform:scaleY(.42)", h); const e = add(`<div class=stars>${[0, 1, 2].map(i => `<i style="left:${Math.cos(i * 2.09) * 60}px;top:${Math.sin(i * 2.09) * 60}px">★</i>`).join("")}</div>`, "left:0;top:0;width:0;height:0", w); return w; };

// ===== 左上の小さい図柄 (リーチ中)。真ん中だけ回っている =====
let REACH = null;
function reach(r) {
  const d = r === "big" ? (Math.random() < .6 ? 7 : pick([1, 3, 5])) : r === "mid" ? pick([2, 3, 4, 5, 6]) : pick([1, 2, 3, 4, 5, 6, 7]);
  const fin = r === "miss" ? (d % 7) + 1 : d, colr = n => n % 2 ? "#e0102a" : "#1060e0";
  const el = add(`<div class=mini><i>リーチ</i><b>${d}</b><b>${d}</b><b>${d}</b></div>`, "left:12px;top:10px;z-index:91");
  const [, a, m, c] = el.children; a.style.color = c.style.color = colr(d);
  let n = 0; const iv = every(70, () => { const k = (n++ % 7) + 1; m.textContent = k; m.style.color = colr(k); });
  return REACH = { d, fin, el, stop() { clearInterval(iv); m.textContent = fin; m.style.color = colr(fin); anim(m, [{ transform: "scale(1.6)" }, { transform: "none" }], 220); }, hide() { clearInterval(iv); el.remove(); } };
}

// ===== PUSH ボタン (押す / スペース / Enter / 一覧ページから。押さなくても時間で進む) =====
let pushHook = null;
addEventListener("keydown", e => { if ((e.code === "Space" || e.code === "Enter") && pushHook) { e.preventDefault(); pushHook(); } else { if (e.code === "Space") e.preventDefault(); tell({ phase: "key", key: e.key, code: e.code }); } }); // 一覧ページのキー操作が、中をクリックした後も効くように
addEventListener("message", e => { if (e.data && e.data.pachi === "push" && pushHook) pushHook(); });
async function push(ms = 1500, label = "押せ!!") {
  const b = add(`<div class=push><i></i><i></i><span>PUSH</span></div>`, "left:480px;top:440px;z-index:92");
  const t = big(label, 480, 350, { size: 40, fill: "white", z: 92 });
  await new Promise(res => { let done = false; const go = () => { if (done) return; done = true; if (pushHook === go) pushHook = null; res(); }; pushHook = go; b.onpointerdown = go; wait(ms).then(go); });
  t.remove(); b.style.animation = "none";
  await anim(b, [{ transform: "scale(1)" }, { transform: "scale(.82)", filter: "brightness(1.8)" }, { transform: "scale(1.4)", opacity: 0 }], 180);
  b.remove();
}
// 帯のカットイン (予告の色で塗る)
async function cutin(txt, col, o = {}) {
  const y = o.y ?? 165, b = add(`<div class="cut ${col === "rainbow" ? "rbg" : ""}"><div class=ln></div></div>`, `left:-40px;width:1040px;top:${y}px;height:210px;overflow:hidden;z-index:86;border:solid #fff;border-width:6px 0;transform:skewY(-6deg);${col === "rainbow" ? "" : `background:${chBG(col)}`}`);
  const f = ham(770, 440, 560, { parent: b, z: 2 }); face(f, ...(o.face || ["brows", "yell"])); act(f, "trem");
  await anim(b, [{ transform: "skewY(-6deg) translateX(110%)" }, { transform: "skewY(-6deg)" }], 150);
  flash("#fff", 160, .5);
  const t = big(txt, 380, y + 105, { size: o.size || 70, fill: col, z: 87 });
  await wait(o.ms || 1000); t.remove();
  await anim(b, [{ transform: "skewY(-6deg)" }, { transform: "skewY(-6deg) translateX(-110%)" }], 150, { easing: "ease-in" }); b.remove();
}

// ===== 共通の結末: 家族ラッシュ。ハムが右上から左下へ走り抜ける =====
// 座標: u = 右上の角から左下の角へ向かう距離 (0〜DIAG)、v = それに直角なずれ (右下が+)。画面の真ん中は u=DIAG/2, v=0
const DIAG = Math.hypot(W, H), DX = -W / DIAG, DY = H / DIAG, NX = H / DIAG, NY = W / DIAG, HALF_V = W * H / DIAG;
const RB = 0.41; // 体の円の半径 ÷ 高さ (画像の不透明な部分にすっぽり入る円)
const xy = (u, v) => [W + u * DX + v * NX, u * DY + v * NY];
const persp = u => 0.86 + 0.32 * Math.min(1.2, Math.max(-0.2, u / DIAG)); // 奥 (右上) は小さく、手前 (左下) は大きく
const inView = (x, y, h, up = 0) => { const w = h * RAT * 1.04; return x + w / 2 > 0 && x - w / 2 < W && y + 0.512 * h > 0 && y - 0.488 * h * 1.04 - up < H; }; // (x, y) = 体の中心
// レーン v を走る高さ h0 のハムが、画面に入る u と出る u
function span(v, h0, up) {
  const vis = (u, ux) => { const [x, y] = xy(u, v), k = persp(u); return inView(x, y, h0 * k, ux * k); };
  let a = null, b = null;
  for (let u = -500; u <= DIAG + 500; u += 6) if (vis(u, 0)) { a = u; break; }
  if (a === null) return null;
  for (let u = DIAG + 500; u >= -500; u -= 6) if (vis(u, up)) { b = u; break; }
  let lo = a - 6, hi = a; for (let i = 0; i < 12; i++) { const m = (lo + hi) / 2; vis(m, 0) ? hi = m : lo = m; } a = hi;
  lo = b; hi = b + 6; for (let i = 0; i < 12; i++) { const m = (lo + hi) / 2; vis(m, up) ? lo = m : hi = m; } b = lo;
  return [a, b];
}
const rng = (...ks) => { let h = 2166136261; for (const x of ks) { h = Math.imul(h ^ (x + 0x9e3779b9), 2246822507); h = Math.imul(h ^ (h >>> 13), 3266489909); h ^= h >>> 16; }
  let a = h >>> 0; return () => { a = (a + 0x6D2B79F5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; };

const GAP = 84; // 大当たりの群れの、ハムどうしの間隔 (px)。小さいほどぎっしり
const SPINE = 64; // 背骨 (真ん中を通る列) の間隔 (px)
const MID_KEEP = .42; // 当たりで走る子どもの割合 (大当たりの群れから、まばらに残す)
// 走り方を決める。大当たりの群れを作り、ど真ん中が隠れる長さが CFG.hide になるよう群れの長さを合わせる。
// 当たりはその群れから半分だけ残す (まばら)。ハズレは1〜2匹を手で動かす
function plan(r, missN = 2) {
  const tot = CFG.total / 1000, seed = (Math.random() * 1e9) | 0, cells = new Map();
  const faceOf = (R, kind) => { const x = R(); return kind === "big" ? (x < .45 ? "happy" : x < .65 ? "shout" : "normal") : (x < .45 ? "normal" : x < .75 ? "happy" : x < .9 ? "shout" : "scared"); };
  const cell = (j, i, c0, v0, rowH) => {
    const key = j * 4096 + i; let k = cells.get(key);
    if (!k) {
      const R = rng(seed, j, i), sp = R();
      k = { c: c0 + (R() - .5) * GAP * .4, v: v0 + (R() - .5) * rowH * .4, h0: 128 + R() * 52, spd: 1 + (R() - .5) * .08, keep: R(), tint: Math.floor(R() * 4),
        ph: R() * 6.28, hz: 5.2 + R() * 2.2, hop: 7 + R() * 9, tsr: R(), fBig: faceOf(R, "big"), fMid: faceOf(R, "mid"),
        sp: sp < .07 ? "flip" : sp < .12 ? "roll" : sp < .18 ? "leap" : sp < .24 ? "seed" : "" };
      k.span = span(k.v, k.h0, k.hop + 6); cells.set(key, k);
    }
    return k;
  };
  const hero = { c: -GAP * .9, v: 0, h0: 225, spd: 1, hero: 1, ph: 0, hz: 4.6, hop: 12, tint: 0, sp: "", fBig: "shout", fMid: "shout" };
  const mom = { v: 0, h0: 205, spd: 1, mom: 1, ph: 1.5, hz: 4.6, hop: 10, tint: 1, sp: "", fBig: "happy", fMid: "happy" };
  hero.span = span(hero.v, hero.h0, hero.hop + 6); mom.span = span(mom.v, mom.h0, mom.hop + 6);
  // 背骨: 真ん中を通る道 (v≒0) に、すき間なく並ぶ列。ど真ん中がとぎれずに隠れるようにする
  const spine = i => {
    const key = -1 - i; let k = cells.get(key);
    if (!k) { const R = rng(seed, 999, i); k = { c: i * SPINE, v: i % 2 ? 11 : -11, h0: 150 + R() * 16, spd: 1, keep: R(), tint: Math.floor(R() * 4), ph: R() * 6.28, hz: 5.4 + R() * 1.6, hop: 5, tsr: 0, fBig: faceOf(R, "big"), fMid: faceOf(R, "mid"), sp: "" };
      k.span = span(k.v, k.h0, k.hop + 6); cells.set(key, k); }
    return k;
  };
  const make = L => {
    const a = [hero], rowH = GAP * .87, vmax = HALF_V + 80;
    for (let j = 0; ; j++) { const v = -vmax + j * rowH; if (v > vmax) break;
      for (let i = 0; ; i++) { const c = (j % 2) * GAP / 2 + i * GAP; if (c > L) break; if (Math.abs(v) < rowH * .5) continue; const k = cell(j, i, c, v, rowH); if (k.span) a.push(k); } }
    for (let i = 0; i * SPINE <= L; i++) a.push(spine(i));
    mom.c = L + GAP * .9; a.push(mom); return a;
  };
  const timing = list => { // 最初のハムが入る瞬間を0秒、最後のハムが出る瞬間を tot 秒にする
    const T0 = Math.min(...list.map(k => (k.span[0] + k.c) / k.spd)), T1 = Math.max(...list.map(k => (k.span[1] + k.c) / k.spd));
    return { list, T0, rate: (T1 - T0) / tot, u: (k, t) => (T0 + t * (T1 - T0) / tot) * k.spd - k.c };
  };
  const hidden = P => { // ど真ん中が隠れている長さ (秒)。2秒に一番近い区間 (0.08秒未満のすき間はつなぐ)
    const near = P.list.filter(k => Math.abs(k.v) < RB * k.h0 * 1.25), dt = .004, runs = [];
    let a = null;
    for (let t = 0; t <= tot + 1e-9; t += dt) {
      const c = near.some(k => { const u = P.u(k, t), [x, y] = xy(u, k.v); return Math.hypot(x - CX, y - CY) < RB * k.h0 * persp(u); });
      if (c && a === null) a = t; if (!c && a !== null) { const last = runs[runs.length - 1]; if (last && a - last[1] < .08) last[1] = t; else runs.push([a, t]); a = null; }
    }
    if (a !== null) runs.push([a, tot]);
    const m = runs.reduce((best, x) => { const d = x[0] <= tot / 2 && tot / 2 <= x[1] ? 0 : Math.min(Math.abs(x[0] - tot / 2), Math.abs(x[1] - tot / 2)); return !best || d < best.d ? { d, x } : best; }, null);
    return m ? m.x[1] - m.x[0] : 0;
  };
  let lo = 300, hi = 2000, B = null;
  for (let it = 0; it < 14; it++) { const L = (lo + hi) / 2, P = timing(make(L)); P.hide = hidden(P); P.L = L; if (P.hide < CFG.hide / 1000) lo = L; else hi = L; if (!B || Math.abs(P.hide - CFG.hide / 1000) < Math.abs(B.hide - CFG.hide / 1000)) B = P; }
  const family = B.list.filter(k => !k.hero && !k.mom).length;
  let P;
  if (r === "big") P = B;
  else if (r === "mid") P = timing(B.list.filter(k => k.hero || (!k.mom && k.keep < MID_KEEP)));
  else P = missPlan(missN);
  P.family = family; P.kids = P.list.filter(k => !k.hero && !k.mom).length;
  for (const k of P.list) {
    k.face = r === "big" ? k.fBig : r === "mid" ? k.fMid : k.face;
    if (k.span && P.T0 !== undefined && k.sp && k.sp !== "seed" && k.sp !== "roll") { // 特技 (宙返り・大ジャンプ) は画面の中で終わるときだけ
      const ti = ((k.span[0] + k.c) / k.spd - P.T0) / P.rate, to = ((k.span[1] + k.c) / k.spd - P.T0) / P.rate, d = k.sp === "flip" ? .5 : .6, room = to - ti - d - .35;
      if (room > 0) k.ts = ti + .15 + room * k.tsr; else k.ts = -9;
    }
  }
  return P;
}
// ハズレ: 1匹目はとぼとぼ、2匹目は途中で転んでから出ていく
function missPlan(n) {
  const tot = CFG.total / 1000;
  const A = { v: 30, h0: 122, spd: 1, hop: 7, hz: 3.6, ph: 0, tint: 2, face: "cry", sp: "" };
  const B = { v: -70, h0: 110, spd: 1, hop: 10, hz: 6.2, ph: 1, tint: 3, face: "scared", sp: "" };
  const a = span(A.v, A.h0, A.hop + 6), b = span(B.v, B.h0, B.hop + 6);
  if (n < 2) { A.uf = t => lerp(a[0], a[1], t / tot); return { list: [A], u: (k, t) => k.uf(t), rate: (a[1] - a[0]) / tot }; }
  A.uf = t => lerp(a[0], a[1], t / 2.5);
  const t1 = .85, t2 = 2.15, t3 = 2.85, m = lerp(b[0], b[1], .5);
  B.uf = t => t < t2 ? lerp(b[0], m, (t - t1) / (t2 - t1)) : t < t3 ? m + 34 * Math.min(1, (t - t2) / .16) : lerp(m + 34, b[1], (t - t3) / (tot - t3));
  B.trip = [t2, t3];
  return { list: [A, B], u: (k, t) => k.uf(t), rate: (a[1] - a[0]) / 2.5 };
}

// ラッシュ用のハムの絵 (表情 × 毛色) を先に作っておく
let SPR = null;
const FILTER_OK = (() => { try { const c = document.createElement("canvas").getContext("2d"); c.filter = "blur(1px)"; return c.filter === "blur(1px)"; } catch (e) { return false; } })();
const TINT_MUL = ["", "#ffcf96", "#c99466", "#fff3e2"]; // ctx.filter が使えないブラウザ用
const RFACE = { normal: [], happy: ["happy", "open"], shout: ["brows", "yell"], cry: ["shut", "stream", "frown"], scared: ["white", "sweat", "open"] };
const loadImg = src => new Promise(r => { const i = new Image(); i.onload = () => r(i); i.onerror = () => r(null); i.src = src; });
const svgURL = inner => "data:image/svg+xml;charset=utf-8," + encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${IW} ${IH}" width="${IW}" height="${IH}"><defs><linearGradient id="eyefur" x1="0" y1="0" x2="0" y2="1"><stop offset=".84" stop-color="#bfb8b6"/><stop offset=".84" stop-color="#fbf5e9"/></linearGradient></defs>${inner}</svg>`);
async function loadSprites() {
  if (SPR) return SPR;
  const img = await loadImg(HAM), SH = 320, SW = Math.round(SH * RAT), out = {};
  for (const [name, parts] of Object.entries(RFACE)) {
    const fi = parts.length ? await loadImg(svgURL(parts.map(p => FACE[p].replace(/ class="dr"/g, "")).join(""))) : null;
    const base = document.createElement("canvas"); base.width = SW; base.height = SH; const b = base.getContext("2d");
    if (img) b.drawImage(img, 0, 0, SW, SH); else { b.fillStyle = "#bbb"; b.beginPath(); b.arc(SW / 2, SH / 2, SW * .45, 0, 7); b.fill(); }
    if (fi) b.drawImage(fi, 0, 0, SW, SH);
    out[name] = TINT.map((f, i) => {
      if (!i) return base;
      const c = document.createElement("canvas"); c.width = SW; c.height = SH; const g = c.getContext("2d");
      if (FILTER_OK) { g.filter = f; g.drawImage(base, 0, 0); }
      else { g.drawImage(base, 0, 0); g.globalCompositeOperation = "multiply"; g.fillStyle = TINT_MUL[i]; g.fillRect(0, 0, SW, SH); g.globalCompositeOperation = "destination-in"; g.drawImage(base, 0, 0); }
      return c;
    });
  }
  return SPR = out;
}

// ラッシュ本体。4秒 (CFG.total) のあいだ毎フレーム描き、実際に見えた時間とど真ん中が隠れた時間を測る
function rush(P, r, o = {}) {
  const tot = CFG.total / 1000;
  // 小窓版でも、ラッシュは画面全体 (OV) を走る。大きい版は舞台 (s) の上
  const host = MINI ? OV : s;
  const cv = add(`<canvas></canvas>`, "left:0;top:0;width:960px;height:540px;z-index:60;pointer-events:none", host);
  const sc = Math.min(2.5, Math.max(1, (MINI ? KT : K) * (devicePixelRatio || 1)));
  cv.width = Math.round(W * sc); cv.height = Math.round(H * sc);
  const g = cv.getContext("2d");
  // 数と計測は、小窓版では小窓の外 (数は小窓のすぐ上、計測は左上) に出す
  const cnt = add(`<div class=cnt>子ども脱出 <b>0</b><small> / ${P.family}匹</small></div>`, MINI ? "right:14px;bottom:250px;z-index:90" : "right:14px;bottom:12px;z-index:90", host), num = cnt.querySelector("b");
  const dbg = DEBUG ? add(`<div class=dbg></div>`, MINI ? "left:12px;top:60px;z-index:96" : "right:12px;top:10px;z-index:96", host) : null;
  let byPix = DEBUG; // 実際の絵の色で真ん中を調べる (file:// で開くと調べられないので円で計算)
  const st = { first: null, last: null, runs: [], cov: 0, by: "" };
  const lines = r === "miss" ? [] : Array.from({ length: 18 }, () => ({ u: rnd(-300, DIAG), v: rnd(-HALF_V, HALF_V), len: rnd(90, 230) }));
  const dust = [], seen = new Set(), grid = [];
  if (DEBUG) for (let gy = 15; gy < H; gy += 30) for (let gx = 15; gx < W; gx += 30) grid.push([gx, gy]);
  let n = 0, swapped = false, prev = 0, hideFrom = null, frames = 0;
  const font = sz => `900 ${sz}px "Yu Gothic","Hiragino Sans",Meiryo,sans-serif`;
  const label = (txt, x, y, sz = 22, col = "#fff") => { g.font = font(sz); g.textAlign = "center"; g.lineJoin = "round"; g.lineWidth = sz / 3.2; g.strokeStyle = "#2a0800"; g.strokeText(txt, x, y); g.fillStyle = col; g.fillText(txt, x, y); };
  return new Promise(res => {
    let t0 = null;
    const frame = now => {
      if (t0 === null) t0 = now;
      const t = (now - t0) / 1000, dt = Math.min(.05, t - prev); prev = t; frames++;
      g.setTransform(sc, 0, 0, sc, 0, 0); g.clearRect(0, 0, W, H);
      const env = Math.sin(Math.PI * Math.min(1, Math.max(0, t / tot)));
      if (r === "big") { g.fillStyle = `rgba(14,6,26,${(.38 * env).toFixed(3)})`; g.fillRect(0, 0, W, H); }
      // 集中線
      g.strokeStyle = "rgba(255,255,255,.3)"; g.lineWidth = 3; g.lineCap = "round"; g.beginPath();
      for (const l of lines) { l.u += P.rate * 1.9 * dt; if (l.u - l.len > DIAG + 60) { l.u = rnd(-260, -60); l.v = rnd(-HALF_V, HALF_V); l.len = rnd(90, 230); } const [x1, y1] = xy(l.u, l.v), [x2, y2] = xy(l.u - l.len, l.v); g.moveTo(x1, y1); g.lineTo(x2, y2); }
      g.stroke();
      // ハムの位置
      const vis = [];
      for (const k of P.list) {
        const u = P.u(k, t), kk = persp(u), h = k.h0 * kk, w = h * RAT, [x, y] = xy(u, k.v);
        const ph = t * k.hz * 6.283 + k.ph, sn = Math.sin(ph), gnd = (1 - Math.abs(sn)) ** 6;
        let hop = Math.abs(sn) * k.hop * kk, rot = -.16 + Math.sin(ph * 2) * .05, sx = 1 + .07 * gnd, sy = 1 - .08 * gnd, say = "";
        if (k.sp === "flip" && t > k.ts && t < k.ts + .5) { const p = (t - k.ts) / .5; rot -= 6.283 * ease(p); hop += Math.sin(Math.PI * p) * 55 * kk; }
        else if (k.sp === "roll") { rot = -t * 9 + k.ph; hop = 0; sx = sy = 1; }
        else if (k.sp === "leap" && t > k.ts && t < k.ts + .6) { const p = (t - k.ts) / .6; hop += Math.sin(Math.PI * p) * 95 * kk; rot -= .35 * Math.sin(Math.PI * p); }
        if (k.trip && t > k.trip[0] && t < k.trip[1]) { const p = t - k.trip[0], q = k.trip[1] - t; rot = -1.45 * Math.min(1, p / .12, q / .18); hop = 0; sx = sy = 1; if (p < .6) say = "べちっ"; }
        if (k.hero) say = r === "big" ? "みんな、走れーっ!!" : "行けるやつは行けーっ!";
        if (k.mom) say = "全員いるー?";
        const cy = y - hop;
        if (!inView(x, cy, h * 1.2)) { k.prevS = sn; continue; }
        vis.push({ k, x, y, cy, h, w, hop, rot, sx, sy, say });
        if (inView(x, cy, h)) { if (st.first === null) st.first = t; st.last = t; if (!seen.has(k)) { seen.add(k); if (!k.hero && !k.mom) num.textContent = ++n; } }
        if (k.prevS !== undefined && Math.sign(sn) !== Math.sign(k.prevS) && Math.random() < .35 && k.sp !== "roll" && hop < 4) dust.push({ x: x + w * .25, y: y + h * .5, r: h * .07, t });
        k.prevS = sn;
      }
      // 土ぼこりと影
      for (let i = dust.length - 1; i >= 0; i--) { const d = dust[i], p = (t - d.t) / .4; if (p > 1) { dust.splice(i, 1); continue; } g.fillStyle = `rgba(236,224,206,${(.5 * (1 - p)).toFixed(3)})`; g.beginPath(); g.arc(d.x + p * 18, d.y - p * 12, d.r * (1 + 2 * p), 0, 6.283); g.fill(); }
      vis.sort((a, b) => a.y + a.h * .512 - (b.y + b.h * .512));
      g.fillStyle = "rgba(0,0,0,.22)";
      for (const v of vis) { const f = Math.max(.4, 1 - v.hop / v.h * 1.5); g.beginPath(); g.ellipse(v.x, v.y + v.h * .5, v.w * .34 * f, v.h * .07 * f, 0, 0, 6.283); g.fill(); }
      // ハム (足が地面から離れないよう、つぶれた分だけ下げる)
      for (const v of vis) {
        g.save(); g.translate(v.x, v.cy + (1 - v.sy) * v.h * .512); g.rotate(v.rot); g.scale(v.sx, v.sy);
        g.drawImage(SPR[v.k.face][v.k.tint], -v.w / 2, -v.h * .488, v.w, v.h);
        if (v.k.sp === "seed") { g.translate(0, -v.h * .5); g.rotate(.5); g.fillStyle = "#3a3030"; g.strokeStyle = "#fff"; g.lineWidth = 2; g.beginPath(); g.ellipse(0, 0, v.h * .07, v.h * .14, 0, 0, 6.283); g.fill(); g.stroke(); }
        g.restore();
      }
      for (const v of vis) if (v.say) label(v.say, Math.min(W - 120, Math.max(120, v.x)), Math.max(30, v.cy - v.h * .62), v.k.trip ? 26 : 22, v.k.trip ? "#ffe14d" : "#fff");
      // 計測: ど真ん中が隠れているか
      let covered = vis.some(v => Math.hypot(v.x - CX, v.cy - CY) < RB * v.h * Math.min(v.sx, v.sy));
      if (byPix) { try { covered = g.getImageData(Math.floor(cv.width / 2), Math.floor(cv.height / 2), 1, 1).data[3] >= 250; st.by = "実際の絵"; } catch (e) { byPix = false; } }
      if (!st.by || !byPix) st.by = "体の円で計算";
      if (covered && hideFrom === null) hideFrom = t;
      if (!covered && hideFrom !== null) { st.runs.push([hideFrom, t]); hideFrom = null; }
      if (DEBUG && frames % 2 === 0) {
        const c = grid.filter(([gx, gy]) => vis.some(v => Math.hypot(v.x - gx, v.cy - gy) < RB * v.h)).length / grid.length;
        st.cov = Math.max(st.cov, c);
        const runs = [...st.runs, ...(hideFrom !== null ? [[hideFrom, t]] : [])];
        dbg.innerHTML = `<div>経過 ${t.toFixed(2)} / ${tot.toFixed(2)} 秒</div><div>ど真ん中: ${covered ? "<b style='color:#f66'>隠れている</b>" : "見えている"}</div><div>画面の埋まり ${Math.round(c * 100)}% (最大 ${Math.round(st.cov * 100)}%)</div><div>見えているハム ${vis.length}匹</div>` +
          `<div class=bar>${runs.map(([a, b]) => `<i style="left:${a / tot * 100}%;width:${(Math.min(b, tot) - a) / tot * 100}%;background:#f66"></i>`).join("")}<i style="left:${Math.min(100, t / tot * 100)}%;width:2px;background:#fff"></i></div>`;
      }
      if (r === "big") s.style.translate = `${(rnd(-3, 3) * env * KP).toFixed(1)}px ${(rnd(-3, 3) * env * KP).toFixed(1)}px`;
      if (!swapped && t >= tot / 2) { swapped = true; o.swap && o.swap(); }
      if (t < tot + .12) return requestAnimationFrame(frame);
      if (hideFrom !== null) st.runs.push([hideFrom, t]);
      s.style.translate = ""; cv.remove(); dbg && dbg.remove();
      const main = st.runs.reduce((m, x) => x[1] - x[0] > (m ? m[1] - m[0] : 0) ? x : m, null);
      Object.assign(st, { dur: st.first === null ? 0 : st.last - st.first, hideA: main ? main[0] : null, hideB: main ? main[1] : null, kids: n, family: P.family });
      // 大当たりは全員の数を出す (画面の角を一瞬で通るハムは、数えそこねることがあるので)
      cnt.innerHTML = r === "big" ? `子ども <b>${P.family}</b><small>匹</small> 全員脱出!!` : r === "mid" ? `子ども <b>${n}</b><small> / ${P.family}匹 脱出</small>` : `<b>${n}</b><small>匹だけ… (${P.family}匹中)</small>`;
      res(st);
    };
    requestAnimationFrame(frame);
  });
}

// 大当たり・当たりの画面 (ラッシュでど真ん中が隠れた瞬間に、裏で入れかえる)
function resultScene(r, d) {
  const B = r === "big", colr = n => n % 2 ? "#e0102a" : "#1060e0";
  const root = add(`<div></div>`, `left:0;top:0;width:960px;height:540px;z-index:40;overflow:hidden;background:${B ? "radial-gradient(circle at 50% 45%,rgba(255,246,200,.9) 0,rgba(255,190,40,.62) 26%,rgba(214,80,10,.38) 58%,rgba(70,10,0,.62) 100%)" : "radial-gradient(circle at 50% 45%,rgba(236,248,255,.9) 0,rgba(110,200,255,.6) 26%,rgba(20,90,210,.36) 58%,rgba(4,16,60,.62) 100%)"}`); // 背景の OW が透けて見える
  const rays = add(`<div></div>`, "left:-520px;top:-730px;width:2000px;height:2000px;border-radius:50%;background:repeating-conic-gradient(#ffffff2e 0 6deg,#ffffff00 6deg 15deg)", root);
  rays.animate([{ transform: "rotate(0)" }, { transform: "rotate(360deg)" }], { duration: B ? 8000 : 14000, iterations: Infinity });
  const reels = [0, 1, 2].map(i => add(`<div class=reel><b style="color:${colr(d)}">${d}</b></div>`, `left:${480 + (i - 1) * 172 - 76}px;top:150px`, root));
  const m = reels[1].firstChild; let n = 0; const iv = every(60, () => { const k = (n++ % 7) + 1; m.textContent = k; m.style.color = colr(k); });
  if (!B) anim(root, [{ opacity: 0 }, { opacity: 1 }], 300);
  return { root, stop() {
    clearInterval(iv); m.textContent = d; m.style.color = colr(d);
    flash("#fff", 320); quake(320, 6); anim(reels[1], [{ transform: "scale(1.35)" }, { transform: "none" }], 260);
    reels.forEach(e => e.classList.add("on"));
    big(B ? "大当たり!!" : "当たり!", 480, 78, { size: B ? 96 : 80, fill: B ? "rainbow" : "gold", z: 45 });
    big(B ? "一家全員 大脱走!!" : "半分 脱出成功!", 480, 418, { size: 44, fill: B ? "gold" : "white", z: 45 });
    if (B) for (let i = 0; i < 70; i++) { const c = add(`<div></div>`, `left:${rnd(0, 950)}px;top:-20px;width:${rnd(8, 14)}px;height:${rnd(12, 22)}px;background:${pick(["#ff5a5a", "#ffd23c", "#5dff8f", "#59c8ff", "#c07bff", "#fff"])};z-index:46`, root);
      anim(c, [{ transform: "none" }, { transform: `translate(${rnd(-80, 80)}px,600px) rotate(${rnd(400, 1200)}deg)` }], rnd(1400, 2400), { delay: rnd(0, 900), easing: "linear" }).then(() => c.remove()); }
  } };
}

// 地鳴り (ラッシュの直前。4秒には入れない)
async function rumble(r) {
  // ハムが来る右上に出す。小窓版は画面全体の右上 (OV)
  const parent = MINI ? OV : s;
  if (r === "miss") { big("トコ…トコ…", 820, 56, { size: 30, fill: "silver", ms: 900, parent }); await wait(500); return; }
  const tx = big(r === "big" ? "ドドドドドド!!" : "ドドドド…", 740, 60, { size: r === "big" ? 50 : 38, fill: "white", ms: 1300, parent }); tx.classList.add("trem");
  quake(520, r === "big" ? 7 : 4);
  for (let i = 0; i < 8; i++) wait(i * 50).then(() => puff(rnd(860, 950), rnd(10, 70), 2, undefined, parent));
  await wait(520);
}

// ★ 全部の話で共通の結末。o.missN: ハズレで出てくる数 (1 か 2)、o.onMiss: ハズレの後の画面
async function ending(r, o = {}) {
  await loadSprites();
  const P = plan(r, o.missN ?? 2);
  await rumble(r);
  let RS = null; const story = [...s.children]; // ラッシュの前からある物 (話の小道具)
  const res = await rush(P, r, { swap: () => { if (r !== "miss") {
    story.forEach(e => anim(e, [{ opacity: 1 }, { opacity: 0 }], r === "big" ? 1 : 300).then(() => { e.style.visibility = "hidden"; })); // 図柄の画面は半透明なので、裏の小道具は消す
    RS = resultScene(r, REACH ? REACH.d : 7); REACH && REACH.hide(); } } });
  tell({ phase: "rush", r, st: res });
  if (r === "miss") {
    REACH && REACH.stop(); o.onMiss && o.onMiss();
    big("ハズレ…", 480, 470, { fill: "silver", size: 56, z: 85 });
    await wait(2300);
  } else { RS.stop(); await wait(r === "big" ? 2700 : 2300); }
}

// ===== くり返し再生 =====
const scenes = {};
// 小窓版: 右下のハムがはねて引っこみ、小窓が開く / 終わったら閉じてハムが戻る
async function openWin() {
  REST.animate([{ transform: "none" }, { transform: "translateY(-40px) scale(1.05)", offset: .4 }, { transform: "translateY(30px) scale(.6)", opacity: 0 }], { duration: 320, fill: "forwards", easing: "ease-in" });
  await wait(180);
  await WIN.animate([{ scale: "0", opacity: 0 }, { scale: "1.08", opacity: 1, offset: .7 }, { scale: "1", opacity: 1 }], { duration: 340, fill: "forwards", easing: "ease-out" }).finished;
}
async function closeWin() {
  OV.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 260, fill: "forwards" });
  await WIN.animate([{ scale: "1", opacity: 1 }, { scale: "0", opacity: 0 }], { duration: 260, fill: "forwards", easing: "ease-in" }).finished;
  REST.animate([{ transform: "translateY(30px) scale(.6)", opacity: 0 }, { transform: "translateY(-30px)", opacity: 1, offset: .6 }, { transform: "none", opacity: 1 }], { duration: 360, fill: "forwards" });
  await wait(1300);
}
async function play(key) {
  await loadSprites();
  if (MINI) await wait(900); // 最初は右下にいつものハムだけ
  for (;;) {
    TIMERS.forEach(clearInterval); TIMERS.clear(); s.getAnimations().forEach(a => a.cancel());
    s.innerHTML = ""; s.style.background = ""; s.style.translate = ""; REACH = null; pushHook = null;
    if (MINI) { OV.getAnimations().forEach(a => a.cancel()); OV.innerHTML = ""; }
    add(`<div></div>`, "left:0;top:0;width:960px;height:540px;z-index:0;background:radial-gradient(ellipse 75% 70% at 50% 50%,rgba(10,6,24,.12) 0,rgba(10,6,24,.55) 100%)"); // 背景は OW のプレイ画面。周りを少し暗くして演出を見やすく
    const r = FIXED || ["big", "mid", "miss"][wpick([CFG.odds.big, CFG.odds.mid, CFG.odds.miss])];
    tell({ phase: "start", r, key });
    if (MINI) await openWin();
    await scenes[key](r);
    if (MINI) await closeWin(); else await wait(500);
  }
}
