// 配信ハム PoC: ビッツやチャネポで出せる演出を、視聴者にどう見せるか (⑤〜⑩ の6案)。
// poc.js / poc2.js / poc3.js の部品を使い、scenes に足す。⑨ の「発動中」は仮の演出 (FX)、⑩ の大技は既存の合体ロボを流す。
{
document.head.insertAdjacentHTML("beforeend", `<style>
#s .chip{display:none}
#s .st *{position:static}
.mcue{left:14px;top:420px;padding:5px 14px;background:#000b;border:2px solid #fff8;border-radius:18px;font-size:18px;line-height:24px;z-index:70;white-space:nowrap}
.mb{color:#cdb0ff}.mp{color:#ffd24d}
.ml .mb{color:#6d28d9}.ml .mp{color:#b86e00}
.mtag{padding:1px 8px;border-radius:7px;background:#7c3aed;color:#fff;font-size:14px}
</style>`);

// 画面に出す演出の一覧。名前・値段・ビッツ (b) / チャネポ (p) はここだけ直せば全部に反映される
// fx は ⑨ の「発動中」で流す仮の演出、ms はそのだいたいの長さ (進み具合のバー用)
const MENU = [
  { name: "ネガ反転", cost: 50, cur: "b", icon: "🌓", fx: "nega", ms: 1300, line: "たった{p}で、<br>画面 ひっくり返せるんだけどな…" },
  { name: "ドブ川の氾濫", cost: 100, cur: "b", icon: "🌊", fx: "flood", ms: 4800, line: "{p}で、<br>ドブ川 あふれさせちゃおっか" },
  { name: "デカハム出現", cost: 200, cur: "b", icon: "🐹", fx: "bigham", ms: 3800, line: "…{p}くれたら、<br>でっかくなっちゃうよ?" },
  { name: "ダメージ音", cost: 100, cur: "p", icon: "🔊", fx: "damage", ms: 3000, line: "{p}で、<br>健に 変な音 鳴らしちゃう?" },
  { name: "メック自爆", cost: 200, cur: "p", icon: "💣", fx: "mech", ms: 4300, line: "…{p}で、<br>ドカーンって いけるよ?" },
  { name: "ハム大脱走", cost: 300, cur: "p", icon: "🏃", fx: "escape", ms: 4600, line: "{p}あったら、<br>仲間と 大脱走するのに…" },
  { name: "デッドアイ", cost: 400, cur: "p", icon: "🎯", fx: "deadeye", ms: 4300, line: "…{p}で、<br>ぜんぶ 狙い撃ち してあげる" },
];
const BITS = MENU.filter(it => it.cur === "b"), PTS = MENU.filter(it => it.cur === "p");
const mk = it => it.cur === "b" ? "mb" : "mp";
const pr = it => `<span class=${mk(it)}>${it.cur === "b" ? "◆" : "●"}${it.cost.toLocaleString()}</span>`; // ◆300
const pw = it => `<span class=${mk(it)}>${it.cost.toLocaleString()}${it.cur === "b" ? "ビッツ" : "pt"}</span>`; // 200ビッツ / 300pt
const cname = it => it.cur === "b" ? "ビッツ" : "チャネポ";
// 見本の説明 (何が起きたか) は左下に出す。左上や右上は、試す表示の置き場所なのであけておく
let mc; const cue = t => { if (mc) mc.remove(); mc = add(`<div class="mcue st">🎮 ${t}</div>`); anim(mc, [{ transform: "translateX(-120%)" }, { transform: "none" }], 170); };
// 演出 (既存のシーンや仮の演出) を1回流し、そのとき作られたものを片づける。左下の説明 (mc) は残す
const tidy = before => { for (const c of [...s.children]) if (!before.has(c) && c !== mc) c.remove(); };
const runScene = async key => { const before = new Set(s.children); await scenes[key](); tidy(before); };
const runFx = async (it, h, n = 1) => { const before = new Set(s.children); await FX[it.fx](h, n); tidy(before); h.getAnimations().forEach(a => a.cancel()); h.img.style.filter = ""; h.style.zIndex = 10; };
const flashW = (ms = 220, z = 25) => fade(layer(`background:#fff;z-index:${z}`), ms);
// ハムの絵柄に合わせる手描き風の日本語フォント (Google Fonts)。ページに1回だけ読み込む
if (!document.getElementById("mfont")) document.head.insertAdjacentHTML("beforeend", `<link id=mfont rel=stylesheet href="https://fonts.googleapis.com/css2?family=Yusei+Magic&family=Zen+Maru+Gothic:wght@700;900&family=Klee+One:wght@600&family=Kiwi+Maru:wght@500&family=Yomogi&family=M+PLUS+Rounded+1c:wght@800&display=swap">`);
// 胸の前 (顔のすぐ下) でボードを両手で持つ。ボードの幅はハムと同じくらい。M11〜M16 で共通
// 返す bd にボードの中身を描く。前足は wrap の上に乗るので、bd を回しても前足は回らない
const chestBoard = (opt = {}) => {
  const up = opt.up ?? 66, BW = Math.round(opt.w ?? HW + 4), BH = Math.round(opt.h ?? 142), bx = HX + HW / 2 - BW / 2, by = HY + HH - BH, h = ham(N);
  const wrap = add(`<div></div>`, `left:${bx}px;top:${by}px;width:${BW}px;height:${BH}px;z-index:12`);
  const bd = add(`<div></div>`, "left:0;top:0;width:100%;height:100%", wrap);
  const paws = [-1, 1].map(d => add(`<svg viewBox="0 0 40 56" style="overflow:visible"><path d="M${d < 0 ? 26 : 14} 4Q${d < 0 ? 4 : 36} 6 ${d < 0 ? 6 : 34} 28Q${d < 0 ? 4 : 36} 50 ${d < 0 ? 26 : 14} 52Z" fill=#fbcbc3 stroke=${INK} stroke-width=4 />
    <path d="M${d < 0 ? 24 : 16} 18H${d < 0 ? 32 : 8}M${d < 0 ? 24 : 16} 28H${d < 0 ? 33 : 7}M${d < 0 ? 24 : 16} 38H${d < 0 ? 32 : 8}" stroke=${INK} stroke-width=3 stroke-linecap=round /></svg>`,
    `left:${d < 0 ? -22 : BW - 18}px;top:${BH / 2 - 28}px;width:40px;height:56px;z-index:5`, wrap));
  const raise = async () => { anim(h, [{ transform: "none" }, { transform: `translateY(-${up}px)` }], 350); await anim(wrap, [{ transform: "translateY(170px)" }, { transform: "translateY(-8px)", offset: .8 }, { transform: "none" }], 420); };
  const lower = async () => { anim(wrap, [{ transform: "none" }, { transform: "translateY(170px)" }], 350, { easing: "ease-in" }); await anim(h, [{ transform: `translateY(-${up}px)` }, { transform: "none" }], 350); };
  const place = () => { h.style.transform = `translateY(-${up}px)`; }; // 持ち上げた状態ですぐ置く (ずっと出しておくとき)
  const bob = (px = 10, ms = 480) => anim(wrap, [{ transform: "none" }, { transform: `translateY(${px}px)`, offset: .5 }, { transform: "none" }], ms); // 持ち直す小さな上下
  return { h, wrap, bd, paws, BW, BH, bx, by, raise, lower, bob, place };
};

// ⑨ で「発動中」に流す仮の演出。本番は健が作った演出に置きかえる
const FX = {
  async nega(h, n) { const g = gameBg(), inv = "invert(1) hue-rotate(180deg)"; g.style.zIndex = 2; // ネガ反転 (回数ぶん)
    for (let i = 0; i < n; i++) { flashW(200); g.style.filter = h.img.style.filter = inv; say("ネガ反転!", 420, 230, { size: 60, color: "#fff", ms: 700 }); await wait(800); g.style.filter = h.img.style.filter = ""; await wait(500); } },
  async flood(h) { // ドブ川の氾濫
    const w = add(`<div><div style="left:0;top:-14px;width:960px;height:16px;background:radial-gradient(circle at 20px 0,#0000 13px,#6b5a2e 14px) 0 0/40px 16px repeat-x"></div>
      ${["🥫", "👢", "🐟", "🗑️", "🦆"].map((e, i) => `<div class=bob style="left:${50 + i * 150}px;top:-30px;font-size:34px;animation-delay:${-i * .3}s">${e}</div>`).join("")}</div>`,
      "left:0;top:540px;width:960px;height:300px;background:linear-gradient(#6b5a2e,#3a3016);z-index:20");
    h.style.zIndex = 19; say("ドブ川が 氾濫!!", 420, 150, { size: 54, color: "#e8d28a", ms: 1600 });
    anim(w, [{ transform: "none" }, { transform: "translateY(-250px)" }], 900); await anim(h, [{ transform: "none" }, { transform: "translateY(-150px)" }], 900);
    const bb = h.animate([{ transform: "translateY(-150px)" }, { transform: "translateY(-138px) rotate(4deg)" }, { transform: "translateY(-150px)" }], { duration: 1100, iterations: Infinity });
    bubble("ぷかぷか…", 790, 120, 1600); await wait(2200); bb.cancel();
    anim(w, [{ transform: "translateY(-250px)" }, { transform: "none" }], 800, { easing: "ease-in" }); await anim(h, [{ transform: "translateY(-150px)" }, { transform: "none" }], 800, { easing: "ease-in" }); },
  async bigham(h) { // デカハム出現
    say("デカハム 出現!!", 360, 130, { size: 60, ms: 1700 }); await anim(h, [{ transform: "none" }, { transform: "scale(2.5)" }], 700, { easing: "cubic-bezier(.3,1.5,.5,1)" });
    flashW(260); say("ドーン!!", 300, 300, { size: 84, color: "#fff", ms: 900 }); await wait(1900);
    await anim(h, [{ transform: "scale(2.5)" }, { transform: "none" }], 500, { easing: "ease-in" }); },
  async damage(h) { // ダメージ音 (見本なので音のかわりに絵で)
    const ic = add(`<div>🔊</div>`, "left:440px;top:170px;font-size:80px;z-index:30"); pop(ic);
    for (let i = 0; i < 3; i++) { const r = add(`<div></div>`, "left:500px;top:210px;width:40px;height:40px;border-radius:50%;border:5px solid #fff;z-index:29");
      anim(r, [{ transform: "scale(1)", opacity: 1 }, { transform: "scale(5)", opacity: 0 }], 800, { delay: i * 200, fill: "both" }).then(() => r.remove()); }
    const v = layer("box-shadow:inset 0 0 140px 40px #ff0000aa;z-index:24"); say("グワッ!!", 620, 310, { size: 72, color: "#ff6a5a", ms: 1000 }); shake(h);
    await wait(1200); fade(v, 400); bubble("……今の音、なに?", 760, 250, 1200); await wait(1500); },
  async mech(h) { // メック自爆 (爆弾の絵で代用)
    const b = add(`<div>💣</div>`, "left:410px;top:190px;font-size:120px;z-index:30"), lb = label("自爆まで", "left:418px;top:150px;font-size:24px;z-index:31");
    await pop(b); const tr = b.animate([{ transform: "translateX(-4px)" }, { transform: "translateX(4px)" }], { duration: 90, iterations: Infinity });
    for (const n of ["3", "2", "1"]) { say(n, 620, 260, { size: 90, color: "#ff5a4a", ms: 600 }); await wait(700); }
    tr.cancel(); b.remove(); lb.remove(); const f = layer("background:#fff;z-index:40"); say("ドカーン!!", 480, 260, { size: 96, color: "#ffb02e", ms: 1100, z: 41 });
    for (let i = 0; i < 8; i++) { const p = add(`<div></div>`, `left:${rnd(340, 540)}px;top:${rnd(160, 280)}px;width:90px;height:90px;border-radius:50%;background:#8a8a8acc;z-index:39`);
      anim(p, [{ transform: "scale(.3)", opacity: 1 }, { transform: `translate(${rnd(-120, 120)}px,${rnd(-100, 40)}px) scale(2.2)`, opacity: 0 }], 1400).then(() => p.remove()); }
    await anim(f, [{ opacity: 1 }, { opacity: 0 }], 900); h.img.style.filter = "brightness(.55)"; bubble("ケホッ", 790, 250, 900); await wait(1100); },
  async escape(h) { // ハム大脱走
    say("ハム 大脱走!!", 420, 150, { size: 58, ms: 1700 }); bubble("みんな、今だ!", 790, 250, 900); await wait(500);
    for (let i = 0; i < 9; i++) wait(i * 230).then(() => { const w = rnd(60, 100), x0 = 980, e = pic(N, x0, rnd(470, 535) - w * 1271 / 1237, w, `z-index:${15 + Math.round(w / 20)}`);
      anim(e, Array.from({ length: 11 }, (_, k) => ({ transform: `translate(${-(x0 + 140) * k / 10}px,${k % 2 ? -12 : 0}px)` })), rnd(1500, 2000), { easing: "linear" }).then(() => e.remove()); });
    await wait(400); await walk(h, 0, -960, 1800, 9); await wait(500); await walk(h, 260, 0, 700, 4); bubble("…やっぱり 右下がいいや", 760, 250, 1100); await wait(1200); },
  async deadeye(h) { // デッドアイ (照準がたまって、まとめて撃つ)
    const v = layer("background:#3a000088;z-index:22"); anim(v, [{ opacity: 0 }, { opacity: 1 }], 300); say("狙いを定めて…", 420, 120, { size: 44, color: "#ffb3a0", ms: 1500 });
    const ts = [[450, 284], [330, 310], [610, 250]].map(([x, y]) => add(`<div><svg viewBox="0 0 100 100" style="left:0;top:0;width:100%;height:100%;overflow:visible"><circle cx=50 cy=50 r=40 fill=none stroke=#ff5a4a stroke-width=6 stroke-dasharray=252 stroke-dashoffset=252 transform="rotate(-90 50 50)" /><path d="M50 2V22M50 78V98M2 50H22M78 50H98" stroke=#ff5a4a stroke-width=6 /></svg></div>`, `left:${x - 40}px;top:${y - 40}px;width:80px;height:80px;z-index:23`));
    ts.forEach(t => t.querySelector("circle").animate([{ strokeDashoffset: 252 }, { strokeDashoffset: 0 }], { duration: 1500, fill: "forwards" })); await wait(1700);
    for (const t of ts) { flashW(120); say("バン!", parseFloat(t.style.left) + 40, parseFloat(t.style.top) - 6, { size: 46, color: "#fff", ms: 500 }); t.remove(); await wait(320); }
    fade(v, 400); bubble("決まった…", 790, 250, 1100); await wait(1300); },
};

Object.assign(scenes, {
  async m_sign() { // ⑤ ハムが看板を持って1つずつ紹介
    const h = ham(N); cue("見本: 2秒ごとに次の演出へ（本番は9秒ごと）");
    const g = add(`<div></div>`, `left:${HX + 14}px;top:${HY + 160}px;width:0;height:0;z-index:12`);
    add(`<div></div>`, `left:-6px;top:-150px;width:12px;height:150px;background:#8a5a30;border:2px solid ${INK}`, g);
    const bd = add(`<div class="st ml"></div>`, `right:-74px;bottom:140px;width:248px;background:#fff8e6;border:5px solid ${INK};border-radius:12px;overflow:hidden;text-align:center;color:#2a1a14`, g);
    add(`<div></div>`, `left:-17px;top:-16px;width:34px;height:34px;border-radius:50%;background:#fbcbc3;border:4px solid ${INK}`, g);
    const set = i => { const it = MENU[i];
      bd.innerHTML = `<div style="background:${it.cur === "b" ? "#7c3aed" : "#d98e04"};color:#fff;font-size:16px;line-height:26px">${cname(it)}で</div>
        <div style="font-size:46px;line-height:54px">${pr(it)}</div><div style="font-size:26px;line-height:32px">${it.icon} ${it.name}</div>
        <div style="font-size:12px;line-height:22px;letter-spacing:4px;color:#a08a70">${MENU.map((_, j) => j === i ? "●" : "○").join("")}</div>`; };
    set(0); anim(g, [{ transform: "translateY(130px) rotate(-8deg)" }, { transform: "translateY(-14px) rotate(3deg)", offset: .7 }, { transform: "none" }], 300);
    const Y = a => `perspective(700px) rotateY(${a}deg)`;
    for (let i = 1; i < MENU.length; i++) { await wait(2000);
      await anim(bd, [{ transform: Y(0) }, { transform: Y(90) }], 150, { easing: "ease-in" }); set(i);
      anim(g, [{ transform: "rotate(-4deg)" }, { transform: "none" }], 300); await anim(bd, [{ transform: Y(-90) }, { transform: Y(0) }], 170); }
    await wait(2400);
  },

  async m_talk() { // ⑥ ハムの吹き出しで宣伝
    const h = ham(N); let t = 3730; // 配信の経過秒
    const clock = () => `${Math.floor(t / 3600)}:${String(Math.floor(t / 60) % 60).padStart(2, "0")}:${String(t % 60).padStart(2, "0")}`;
    cue(`配信 ${clock()}`); await wait(900);
    for (const [i, gap] of [[2, 160], [0, 150], [5, 0]]) { const it = MENU[i];
      const blush = ov(h, `<ellipse cx=290 cy=650 rx=86 ry=42 fill=#ff7f9a opacity=.5 /><ellipse cx=920 cy=650 rx=86 ry=42 fill=#ff7f9a opacity=.5 />`);
      anim(h, [{ transform: "none" }, { transform: "rotate(-4deg)" }], 300); say("ぼそっ", HX + 168, HY + 14, { size: 24, color: "#fff", ms: 900 }); await wait(250);
      const b = add(`<div class="st ml">${it.line.replace("{p}", pw(it))}<i style="position:absolute;right:30px;bottom:-14px;width:24px;height:24px;background:#fff;border:solid ${INK};border-width:0 4px 4px 0;transform:rotate(45deg)"></i></div>`,
        `right:${960 - HX - 70}px;bottom:${540 - HY + 8}px;background:#fff;color:#333;border:4px solid ${INK};border-radius:18px;padding:10px 18px;font-size:22px;line-height:1.5;white-space:nowrap;z-index:30;transform-origin:85% 100%`);
      anim(b, [{ transform: "scale(.3)", opacity: 0 }, { transform: "none", opacity: 1 }], 220);
      await wait(4000); fade(b, 300); blush.remove(); anim(h, [{ transform: "rotate(-4deg)" }, { transform: "none" }], 300);
      if (!gap) break;
      await wait(500); const t0 = t, later = `（${Math.floor(gap / 60)}分${gap % 60 ? gap % 60 + "秒" : ""}後）`;
      for (let k = 1; k <= 10; k++) { t = t0 + Math.round(gap * k / 10); mc.innerHTML = `🎮 配信 ${clock()}${later}`; await wait(60); }
      await wait(500); }
    await wait(1000);
  },

  async m_ticker() { // ⑦ 一番上の細い帯 (ページごとに切り替え)。真ん中の OW の目標表示はあけておく
    ham(N); cue("見本: 5秒ごとにページが切り替わる");
    const H = 30, seg = css => add(`<div class=st></div>`, `top:0;height:${H}px;overflow:hidden;z-index:60;font-size:16px;white-space:nowrap;${css}`);
    const L = seg("left:0;width:400px;background:linear-gradient(90deg,#0c0e18f2 94%,#0c0e1800)");
    const R = seg("left:572px;width:388px;background:linear-gradient(270deg,#0c0e18f2 90%,#0c0e1800)");
    const item = it => `${pr(it)} ${it.name}`, line = (html, pad) => `<div style="position:absolute;left:0;top:0;width:100%;height:${H}px;line-height:${H}px;${pad}">${html}</div>`;
    const io = (e, a, b) => anim(e, [{ transform: `translateY(${a}px)` }, { transform: `translateY(${b}px)` }], 260, { easing: "ease-in-out" });
    const pages = [["◆ビッツ", "#7c3aed", BITS.slice(0, 2), BITS.slice(2)], ["●チャネポ", "#b87800", PTS.slice(0, 2), PTS.slice(2)]]; let cur = [];
    for (let n = 0; n < pages.length; n++) { const [tag, col, l, r] = pages[n];
      const nl = add(line(`<span class=mtag style="background:${col}">${tag}</span> ` + l.map(item).join(" ・ "), "padding-left:10px"), "", L);
      const nr = add(line(r.map(item).join(" ・ ") + `<span style="position:absolute;right:12px;top:0;color:#aab">${n + 1}/${pages.length}</span>`, "padding-left:40px"), "", R);
      cur.forEach(e => io(e, 0, -H).then(() => e.remove())); io(nl, H, 0); io(nr, H, 0); cur = [nl, nr];
      await wait(5000); }
  },

  async m_phase() { // ⑧ 試合中は小さく、合間は大きく
    const g = gameBg(), h = ham(N);
    const tab = add(`<div class=st>🎁 演出あり ${pr(BITS[0])}〜 ${pr(PTS[0])}〜</div>`, `left:14px;top:14px;padding:4px 14px;background:#0c0e18e6;border:2px solid #b388ff;border-radius:16px;font-size:18px;line-height:24px;z-index:60;white-space:nowrap`);
    tab.animate([{ boxShadow: "0 0 0 #b388ff00" }, { boxShadow: "0 0 14px #b388ffcc" }, { boxShadow: "0 0 0 #b388ff00" }], { duration: 1600, iterations: Infinity });
    const slots = MENU.map(it => `<div style="display:flex;flex-direction:column;align-items:center;justify-content:center;background:#fff;border:2px solid #8fb3c9;border-radius:8px;color:#222">
      <div style="font-size:32px;line-height:38px">${it.icon}</div><div style="font-size:15px;line-height:20px">${it.name}</div>
      <div style="margin-top:3px;padding:0 9px;border-radius:9px;background:${it.cur === "b" ? "#3b1d78" : "#5c3d00"};font-size:16px;line-height:22px">${pr(it)}</div>
      <div class=lamp style="width:12px;height:12px;margin-top:4px;border-radius:50%;background:#7a2a2a;border:2px solid #3a1010"></div></div>`).join("") +
      `<div style="display:flex;flex-direction:column;align-items:center;justify-content:center;background:#dde6ec;border:2px dashed #8fb3c9;border-radius:8px;color:#7a8a96"><div style="font-size:28px;line-height:36px">🔒</div><div style="font-size:15px">近日追加</div></div>`;
    const vm = add(`<div class=st>
      <div style="position:absolute;left:0;top:0;width:100%;height:100%;border-radius:22px;background:linear-gradient(#d8414c,#8f1d27);border:5px solid ${INK}"></div>
      <div style="position:absolute;left:0;top:10px;width:100%;text-align:center;font-size:26px;color:#fff;-webkit-text-stroke:5px #5a0d14;paint-order:stroke fill">🐹 ハムの演出じはんき</div>
      <div style="position:absolute;left:22px;top:52px;width:536px;height:236px;padding:7px;display:grid;grid-template-columns:repeat(4,1fr);grid-template-rows:1fr 1fr;gap:7px;background:linear-gradient(160deg,#eef8ff,#b7d6ee);border:4px solid ${INK};border-radius:10px">${slots}</div>
      <div style="position:absolute;left:22px;top:300px;width:536px;height:36px;line-height:30px;text-align:center;background:#2a0b10;border:3px solid ${INK};border-radius:8px;font-size:17px"><span class=mb>◆ビッツ</span> か <span class=mp>●チャネポ</span> で発動</div>
    </div>`, `left:120px;top:60px;width:580px;height:352px;z-index:60;transform-origin:0 0;opacity:0`);
    const lamps = vm.querySelectorAll(".lamp"); let li = 0;
    const blink = setInterval(() => { lamps.forEach((l, j) => l.style.background = j === li % lamps.length ? "#ffe066" : "#7a2a2a"); li++; }, 160);
    const T0 = `translate(${14 - 120}px,${14 - 60}px) scale(.3)`;
    const open = () => { anim(tab, [{ opacity: 1 }, { opacity: 0 }], 150); return anim(vm, [{ transform: T0, opacity: 0 }, { transform: "scale(1.03)", opacity: 1, offset: .7 }, { transform: "none", opacity: 1 }], 340); };
    const close = () => { anim(tab, [{ opacity: 0 }, { opacity: 1 }], 200, { delay: 220 }); return anim(vm, [{ transform: "none", opacity: 1 }, { transform: T0, opacity: 0 }], 260, { easing: "ease-in" }); };
    const lab = add(`<div class=t></div>`, "left:640px;top:448px;translate:-50% -50%;font-size:30px;color:#fff;z-index:55");
    pop(tab); cue("試合中: 小さなタブだけ"); await wait(3400);
    cue("リスポーン待ち: 大きく"); g.style.filter = "grayscale(1) brightness(.7)"; await open();
    for (let n = 5; n >= 1; n--) { lab.textContent = `リスポーンまで ${n}`; await wait(900); }
    cue("復帰: タブに戻る"); lab.textContent = ""; g.style.filter = "none"; await close(); await wait(2800);
    cue("マッチング待ち: 大きく"); await open(); bubble("どれにする?", 830, 262, 1800);
    for (let sec = 38; sec <= 46; sec += 2) { lab.textContent = `マッチング中 0:${sec}`; await wait(900); }
    cue("試合開始: タブに戻る"); lab.textContent = "試合開始!"; await close(); await wait(1500); clearInterval(blink);
  },

  async m_board() { // ⑪ 胸の前でボードをめくって1つずつ紹介。めくると、金と銀の飾りで値段と名前が出る
    const { h, wrap, bd, BW, BH, bx, by, raise, lower, bob } = chestBoard(), S3 = 3;
    cue("見本: 2秒ごとにボードをめくる（本番は9秒ごと）");
    bd.style.cssText += ";border-radius:12px;box-shadow:0 6px 16px #000a";
    const cv = add(`<canvas width=${BW * S3} height=${BH * S3}></canvas>`, "left:0;top:0;width:100%;height:100%;border-radius:12px", bd), c = cv.getContext("2d"); c.scale(S3, S3);
    const rr = (x, y, w, hh, r) => { c.beginPath(); c.roundRect(x, y, w, hh, r); };
    const felt = (a, b) => { c.clearRect(0, 0, BW, BH); const g = c.createRadialGradient(BW * .4, BH * .3, 8, BW / 2, BH / 2, BW * .7); g.addColorStop(0, a); g.addColorStop(1, b); rr(0, 0, BW, BH, 14); c.fillStyle = g; c.fill();
      for (let i = 0; i < 260; i++) { c.fillStyle = `rgba(255,255,255,${Math.random() * .05})`; c.fillRect(Math.random() * BW, Math.random() * BH, 1.2, 1.2); } };
    // 文字を小さく描いて、点の位置ごとに「文字にかかっているか」を調べ、かかっていれば金か銀の飾りを置く
    const oc = document.createElement("canvas"), o = oc.getContext("2d", { willReadFrequently: true });
    const studs = (text, x0, y0, w, hh, step) => { w = Math.round(w); hh = Math.round(hh); oc.width = w; oc.height = hh; let fs = hh;
      do { o.font = `900 ${fs}px "Yu Gothic",Meiryo,sans-serif`; fs -= 1; } while (o.measureText(text).width > w * .97 && fs > 8);
      o.fillStyle = "#000"; o.textAlign = "center"; o.textBaseline = "middle"; o.fillText(text, w / 2, hh / 2 + hh * .04);
      const d = o.getImageData(0, 0, w, hh).data, on = (x, y) => x >= 0 && y >= 0 && x < w && y < hh && d[(Math.floor(y) * w + Math.floor(x)) * 4 + 3] > 110, r = step * .46;
      for (let y = step / 2; y < hh; y += step) for (let x = step / 2; x < w; x += step) {
        if (![[0, 0], [-r * .6, 0], [r * .6, 0], [0, -r * .6], [0, r * .6]].some(([dx, dy]) => on(x + dx, y + dy))) continue;
        const k = (Math.floor(x * 7 + y * 13) % 10 + 10) % 10, X = x0 + x, Y = y0 + y;
        const g = c.createRadialGradient(X - r * .35, Y - r * .35, r * .1, X, Y, r);
        const cols = k < 6 ? ["#fff7cf", "#f0c548", "#7a5a12"] : k < 9 ? ["#ffffff", "#cfd5db", "#5d646c"] : ["#f3ecd2", "#d6cba4", "#8c8264"];
        g.addColorStop(0, cols[0]); g.addColorStop(.45, cols[1]); g.addColorStop(1, cols[2]); c.fillStyle = g; c.beginPath(); c.arc(X, Y, r, 0, 7); c.fill(); } };
    const blank = () => felt("#2b2b2e", "#101012");
    const show = it => { felt("#4b4b4e", "#2a2a2d");
      rr(7, 7, 56, 18, 6); c.fillStyle = it.cur === "b" ? "#7c3aed" : "#d98e04"; c.fill();
      c.fillStyle = "#fff"; c.font = `900 12px "Yu Gothic",Meiryo,sans-serif`; c.textAlign = "center"; c.textBaseline = "middle"; c.fillText(cname(it), 35, 16.5);
      studs(it.cur === "b" ? `◆${it.cost}` : `${it.cost}pt`, 68, 4, BW - 76, 44, 4); studs(it.name, 6, 52, BW - 12, 84, 3); };
    const sparkle = () => [[bx + 6, by + 4], [bx + BW - 6, by + 8], [bx + 10, by + BH - 6], [bx + BW - 10, by + BH - 4]].forEach(([x, y], i) => {
      const e = add(`<div>✦</div>`, `left:${x}px;top:${y}px;translate:-50% -50%;font-size:${rnd(22, 34)}px;color:#fff3c0;text-shadow:0 0 10px #ffd86b;z-index:14`);
      anim(e, [{ transform: "scale(.2)", opacity: 1 }, { transform: "scale(1.2) rotate(40deg)", opacity: 1, offset: .5 }, { transform: "scale(.3)", opacity: 0 }], 500, { delay: i * 60, fill: "both" }).then(() => e.remove()); });
    const P = a => `perspective(900px) rotateX(${a}deg)`;
    const flip = async draw => { bob();
      await anim(bd, [{ transform: P(0), filter: "none" }, { transform: P(88), filter: "brightness(.5)" }], 200, { easing: "ease-in" }); draw();
      await anim(bd, [{ transform: P(-88), filter: "brightness(.5)" }, { transform: P(10), filter: "none", offset: .7 }, { transform: P(0), filter: "none" }], 300); };
    blank(); await raise(); await wait(700);
    for (const it of MENU) { await flip(() => show(it)); sparkle(); await wait(2000); }
    await flip(blank); await wait(400);
    await lower(); await wait(700);
  },

  async m_queue() { // ⑨ いま発動中と順番待ち (キュー)
    const h = ham(N), q = [];
    const qp = add(`<div class=st><div style="display:inline-block;font-size:14px;line-height:20px;color:#fff;padding:0 10px;border-radius:7px;background:#0c0e18dd">演出キュー</div></div>`, `left:630px;top:84px;width:318px;z-index:60;opacity:0;transition:opacity .25s`);
    const row = r => { const on = r === q[0];
      r.el.style.background = on ? "#2b2410ee" : "#0c0e18dd"; r.el.style.borderLeftColor = on ? "#ffd23c" : "#667";
      r.el.children[0].innerHTML = on ? `<span style="color:#ffd23c">▶ 発動中</span>` : `<span style="color:#aab">次</span>`;
      r.el.children[1].textContent = r.it.name + (r.n > 1 ? ` ×${r.n}` : ""); };
    const push = (it, user) => { const last = q[q.length - 1];
      if (last && last !== q[0] && last.it === it && last.user === user) { last.n++; row(last); anim(last.el, [{ transform: "scale(1.06)" }, { transform: "none" }], 220); return; }
      const el = add(`<div style="position:relative;display:grid;grid-template-columns:76px 1fr 60px 58px;align-items:center;height:34px;margin-top:5px;padding:0 10px 0 8px;border-left:5px solid #667;border-radius:8px;font-size:15px;overflow:hidden">
        <span></span><span></span><span style="color:#d6d8e6;font-size:14px">${user}</span><span style="text-align:right">${pr(it)}</span>
        <i style="position:absolute;left:0;bottom:0;height:3px;width:100%;background:#ffd23c;transform:scaleX(0);transform-origin:0 0"></i></div>`, "", qp);
      const r = { it, user, n: 1, el }; q.push(r); row(r); qp.style.opacity = 1;
      anim(el, [{ transform: "translateX(40px)", opacity: 0 }, { transform: "none", opacity: 1 }], 220); };
    const runTop = async () => { const r = q[0]; row(r);
      r.el.querySelector("i").animate([{ transform: "scaleX(0)" }, { transform: "scaleX(1)" }], { duration: r.it.ms * (r.it.fx === "nega" ? r.n : 1), fill: "forwards" });
      await runFx(r.it, h, r.n);
      bubble(`${r.user}さん、ありがとう!`, 812, 262, 1200); hop(h, 26); await wait(1300);
      q.shift(); await anim(r.el, [{ opacity: 1, height: "34px", marginTop: "5px" }, { opacity: 0, height: "0px", marginTop: "0px" }], 240); r.el.remove();
      if (q.length) row(q[0]); else qp.style.opacity = 0; };
    const [nega, , big, , mech] = MENU, ev = (it, user, note = "") => { cue(`${pr(it)} ${user} が ${it.name}${note}`); push(it, user); };
    await wait(800); ev(big, "たろう"); await wait(300);
    wait(1100).then(() => ev(nega, "はなこ")); wait(1700).then(() => ev(nega, "はなこ", "（2回目）")); wait(2300).then(() => ev(nega, "はなこ", "（3回目）"));
    wait(3000).then(() => ev(mech, "じろう"));
    while (q.length) await runTop();
    await wait(700);
  },

  async m_goal() { // ⑩ みんなで貯めるゲージ (満タンで大技)
    let h = ham(N), v = 1240; const MAX = 2000, COL = "linear-gradient(90deg,#6d28d9,#c084fc)";
    const gp = add(`<div class=st>
      <div style="display:flex;justify-content:space-between;font-size:18px;line-height:26px"><span class=gname>🤖 合体ロボまで</span><span class=gval></span></div>
      <div style="position:relative;height:16px;margin-top:4px;border-radius:8px;background:#ffffff26;overflow:hidden">
        <i class=gfill style="position:absolute;left:0;top:0;height:100%;width:0;border-radius:8px;background:${COL};transition:width .45s ease-out"></i>
        ${[25, 50, 75].map(p => `<i style="position:absolute;left:${p}%;top:0;width:2px;height:100%;background:#0c0e1888"></i>`).join("")}</div>
      <div style="font-size:12px;line-height:20px;color:#b9bcd0;margin-top:2px;white-space:nowrap">ビッツで貯まる・満タンで発動・配信終了でリセット</div></div>`,
      `left:14px;top:14px;width:330px;padding:7px 12px 6px;background:#0c0e18e6;border:2px solid #b388ff99;border-radius:10px;z-index:60`);
    const name = gp.querySelector(".gname"), val = gp.querySelector(".gval"), fill = gp.querySelector(".gfill");
    const show = () => { val.innerHTML = `<span class=mb>◆${v.toLocaleString()}</span> / ${MAX.toLocaleString()}`; fill.style.width = `${v / MAX * 100}%`; };
    show(); await wait(900);
    for (const [user, n] of [["たろう", 100], ["はなこ", 300], ["じろう", 60], ["ゆうき", 300]]) {
      cue(`<span class=mb>◆${n}</span> ${user} がゲージに`); const v0 = v;
      for (let k = 1; k <= 8; k++) { v = Math.round(v0 + n * k / 8); show(); await wait(45); }
      const f = add(`<div class=t>+${n}</div>`, `left:${28 + 306 * v / MAX}px;top:52px;translate:-50% 0;font-size:24px;color:#cdb0ff;z-index:61`);
      anim(f, [{ transform: "none", opacity: 1 }, { transform: "translateY(-26px)", opacity: 0 }], 900).then(() => f.remove());
      const tg = add(`<div class=lab>${user} +${n}</div>`, "left:16px;top:104px;font-size:15px;z-index:61"); wait(1000).then(() => fade(tg));
      hop(h, 18); if (v < MAX) bubble(`あと ◆${(MAX - v).toLocaleString()}!`, 830, 262, 900); await wait(1250); }
    fill.style.background = "linear-gradient(90deg,#ffb300,#ffe066)";
    gp.animate([{ boxShadow: "0 0 0 #ffd23c00" }, { boxShadow: "0 0 26px #ffd23c" }, { boxShadow: "0 0 0 #ffd23c00" }], { duration: 500, iterations: 3 });
    say("満タン!!", 480, 210, { size: 76, ms: 1000 }); await wait(1100);
    name.textContent = "🤖 合体ロボ 発動中…"; cue("ゲージ満タン → 合体ロボ発動"); h.remove(); await runScene("robot"); h = ham(N);
    v = 0; fill.style.transition = "none"; fill.style.background = COL; show(); fill.offsetWidth; fill.style.transition = "width .45s ease-out";
    name.textContent = "🤖 次の合体ロボまで"; bubble("みんな、ありがとう!", 812, 262, 1400); hop(h, 30); await wait(1800);
  },
});
window.MK = { MENU, BITS, PTS, pr, pw, cname, cue, chestBoard, flashW };
}
