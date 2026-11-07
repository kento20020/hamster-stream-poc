// 配信ハムのアイデアが面白いかを見るための PoC。play("シーン名") でループ再生する。
const N = "../通常ハム.png", R1 = "../成金2.png", R2 = "../成金.png";
const INK = "#331c16", HH = 230, HW = HH * 1237 / 1271, HX = 960 - 16 - HW, HY = 540 - 6 - HH;

document.head.insertAdjacentHTML("beforeend", `<style>
html,body{margin:0;height:100%;background:#111;overflow:hidden}
#s{position:absolute;left:0;top:0;width:960px;height:540px;overflow:hidden;transform-origin:0 0;color:#fff;
 background:#171d2c url(ow_bg.png) center/cover;font:900 28px "Yu Gothic",Meiryo,sans-serif}
#s *{position:absolute;box-sizing:border-box}
.t{white-space:nowrap;-webkit-text-stroke:7px #3a0a00;paint-order:stroke fill;text-shadow:0 3px 0 #0007}
.chip{left:14px;top:14px;padding:7px 16px;background:#000b;border:2px solid #fff8;border-radius:20px;font-size:21px;z-index:50;white-space:nowrap}
.c{width:28px;height:28px;border-radius:50%;background:#fc3;border:3px solid #a06a00;color:#8a5400;font-size:15px;line-height:21px;text-align:center}
.card{width:120px;height:124px;background:#223;border:3px solid #667;border-radius:12px;filter:brightness(.4);transition:transform .06s}
.card.on{filter:none;transform:scale(1.14);border-color:#fd3;background:#fd6;box-shadow:0 0 18px #fd3;z-index:3}
.bub{background:#fff;color:#222;padding:8px 16px;border-radius:16px;font-size:24px;white-space:nowrap;z-index:30}
.lab{font-size:22px;background:#000a;padding:4px 12px;border-radius:8px;white-space:nowrap;z-index:15}
.sp{background:repeating-linear-gradient(95deg,#a00 0 18px,#e22 18px 30px,#600 30px 44px);background-size:300px 100%;animation:ln .25s linear infinite}
.trem{animation:trem .13s infinite}.bob{animation:bob 1.3s ease-in-out infinite}.wig{animation:wig .14s infinite}
.puff{transform-box:fill-box;transform-origin:center;animation:puff 1.5s ease-in-out infinite}
.dr{animation:dr .8s linear infinite}
@keyframes trem{50%{transform:translateX(3px)}}@keyframes bob{50%{transform:translateY(6px) rotate(2deg)}}
@keyframes wig{50%{transform:translate(-5px,3px) rotate(-2deg)}}@keyframes puff{0%,100%{transform:scale(.5)}50%{transform:scale(1.2)}}
@keyframes dr{to{transform:translateY(110px);opacity:0}}@keyframes ln{to{background-position:-300px 0}}
</style>`);
const s = document.createElement("div"); s.id = "s"; document.body.append(s);
const fit = () => { const k = Math.min(innerWidth / 960, innerHeight / 540); s.style.transform = `translate(${(innerWidth - 960 * k) / 2}px,${(innerHeight - 540 * k) / 2}px) scale(${k})`; }; // 全画面でも中央に置く
addEventListener("resize", fit); fit();

const wait = ms => new Promise(r => setTimeout(r, ms));
const rnd = (a, b) => a + Math.random() * (b - a);
const add = (html, css = "", parent = s) => {
  const t = document.createElement("template"); t.innerHTML = html.trim();
  const e = t.content.firstChild; e.style.cssText += css; parent.append(e); return e;
};
const anim = (e, kf, ms = 350, o = {}) =>
  e.animate(kf, { duration: ms, easing: "ease-out", fill: "forwards", ...o }).finished.catch(() => {});
const ham = src => {
  const h = add(`<div><img src="${src}" style="width:100%;height:100%"></div>`,
    `left:${HX}px;top:${HY}px;width:${HW}px;height:${HH}px;transform-origin:50% 100%;z-index:10`);
  h.img = h.firstChild; return h;
};
const P = (x, y) => [HX + x / 1237 * HW, HY + y / 1271 * HH]; // 元画像の座標 → 画面の座標
const ov = (h, inner) => add(`<svg viewBox="0 0 1237 1271" style="left:0;top:0;width:100%;height:100%;overflow:visible">${inner}</svg>`, "", h);
const hop = (h, px = 40) => anim(h, [{ transform: "none" }, { transform: `translateY(${-px}px)`, offset: .4 }, { transform: "none" }], 420);
const shake = h => anim(h, [-14, 12, -9, 7, 0].map(x => ({ transform: `translateX(${x}px)` })), 320, { easing: "linear" });
let ch;
const chip = t => { if (ch) ch.remove(); ch = add(`<div class=chip>🎮 ${t}</div>`); anim(ch, [{ transform: "translateX(-120%)" }, { transform: "none" }], 170); };
const say = (txt, x, y, o = {}) => {
  const e = add(`<div class=t>${txt}</div>`, `left:${x}px;top:${y}px;translate:-50% -50%;font-size:${o.size || 46}px;color:${o.color || "#ffd23c"};z-index:${o.z || 30}`);
  anim(e, [{ transform: "scale(2.4)", opacity: 0 }, { transform: "scale(1)", opacity: 1 }], 160, { easing: "ease-in" });
  if (o.ms !== 0) wait(o.ms || 900).then(() => anim(e, [{ opacity: 1 }, { opacity: 0 }], 170).then(() => e.remove()));
  return e;
};
const coin = (x, y) => add(`<div class=c>¥</div>`, `left:${x}px;top:${y}px;z-index:20`);
const rain = (n = 26) => { for (let i = 0; i < n; i++) { const c = coin(rnd(0, 950), -40);
  anim(c, [{ transform: "none" }, { transform: `translateY(620px) rotateY(${rnd(700, 1500)}deg)` }], rnd(1100, 1700), { delay: rnd(0, 700), easing: "linear" }).then(() => c.remove()); } };
const burst = (x, y, n = 16) => { for (let i = 0; i < n; i++) { const c = coin(x, y), a = rnd(0, 6.28), r = rnd(110, 280);
  anim(c, [{ transform: "none" }, { transform: `translate(${Math.cos(a) * r}px,${Math.sin(a) * r - 70}px)`, offset: .5 },
    { transform: `translate(${Math.cos(a) * r * 1.2}px,${Math.sin(a) * r + 260}px)`, opacity: 0 }], 900).then(() => c.remove()); } };
const swap = (h, src, good) => { h.img.src = src; hop(h, good ? 60 : 12);
  if (good) anim(h.img, [{ transform: "scale(1.35)", filter: "brightness(2.4)" }, { transform: "none", filter: "none" }], 380);
  else anim(h.img, [{ filter: "grayscale(1) brightness(.6)" }, { filter: "none" }], 600); };

const line = `fill=none stroke=${INK} stroke-width=15 stroke-linecap=round`;
const MIDX = [380, 828];
const whiteEyes = MIDX.map(x => `<circle cx=${x} cy=488 r=84 fill=#fff stroke=${INK} stroke-width=14 /><circle cx=${x} cy=488 r=8 fill=${INK} />`).join("");
const closedEyes = `<defs><linearGradient id=g x2=0 y2=1><stop offset=.62 stop-color=#aaa1a0 /><stop offset=.62 stop-color=#fbf5e9 /></linearGradient></defs>` +
  MIDX.map(x => `<circle cx=${x} cy=488 r=91 fill=url(#g) /><path d="M${x - 70} 478Q${x} 540 ${x + 70} 478" ${line} />`).join("");
const hideMouth = `<ellipse cx=600 cy=650 rx=128 ry=44 fill=#fbf5e9 />`;
const frown = hideMouth + `<path d="M515 674Q600 612 685 674" ${line} />`;
const openMouth = hideMouth + `<ellipse cx=600 cy=662 rx=66 ry=54 fill=#c9485b stroke=${INK} stroke-width=14 />`;
const tears = MIDX.map(x => `<path class=dr d="M${x} 575q-24 40 0 56q24-16 0-56" fill=#7cc4ff stroke=${INK} stroke-width=6 />`).join("");

const scenes = {
  async win() { // 連勝で出世
    const h = ham(N), b = add(`<div class=lab>0連勝</div>`, `left:${HX - 60}px;top:${HY - 20}px`);
    const step = async (ev, src, label, good) => { await wait(1250); chip(ev); swap(h, src, good); b.textContent = label;
      if (good) { say("出世!!", 560, 240); burst(...P(600, 600)); } else { say("降格…", 560, 240, { color: "#9db4d8" }); shake(h); } };
    await step("勝ち", R1, "1連勝", 1); await step("勝ち", R2, "2連勝!!", 1); rain();
    await step("負け", R1, "連勝ストップ", 0); await step("負け", N, "元通り", 0); await wait(1000);
  },
  async broke() { // 破産ハム
    const h = ham(R2); await wait(1000); chip("負け"); say("転落!!", 520, 220, { color: "#ff6a5a" }); burst(...P(600, 700), 26); shake(h);
    await wait(500); await anim(h, [{ transform: "none" }, { transform: "translateY(40px) rotate(14deg)", opacity: .2 }], 280);
    h.img.src = N; ov(h, frown); anim(h, [{ transform: "translateY(-50px)", opacity: 0 }, { transform: "none", opacity: 1 }], 300);
    const label = add(`<div class=lab>所持金 ¥0</div>`, `left:${HX - 70}px;top:${HY - 16}px`);
    await wait(1100); chip("負け"); label.textContent = "借金 ¥50,000"; h.img.style.filter = "saturate(.45)"; ov(h, tears);
    ov(h, `<path d="M120 770Q600 650 1140 770L1205 1125L1010 1060L900 1190L705 1090L520 1205L395 1080L190 1185Z" fill=#8a6a4a stroke=${INK} stroke-width=15 />
      <rect x=720 y=850 width=150 height=120 fill=#b08d5f stroke=${INK} stroke-width=9 transform="rotate(12 790 900)" /><rect x=280 y=900 width=120 height=100 fill=#6e553b stroke=${INK} stroke-width=9 />`);
    say("ボロ布…", 560, 250, { color: "#c9b28f" });
    await wait(1300); chip("負け"); label.textContent = "借金 ¥300,000";
    ov(h, `<path d="M20 740L-90 640H290L400 740Z" fill=#d6a86c stroke=${INK} stroke-width=15 /><path d="M1215 740L1330 640H950L840 740Z" fill=#d6a86c stroke=${INK} stroke-width=15 />
      <rect x=20 y=740 width=1195 height=531 fill=#c9975c stroke=${INK} stroke-width=16 /><rect x=540 y=740 width=150 height=170 fill=#e6c592 />
      <text x=618 y=1110 text-anchor=middle font-size=150 font-weight=900 fill=#6b4522>ハム</text>`);
    h.classList.add("trem");
    add(`<div class=bub>お恵みを…</div>`, `left:${HX - 150}px;top:${HY + 70}px;background:#d6a86c;border:3px solid ${INK}`);
    await wait(1900);
  },
  async bank() { // ハム銀行
    const h = ham(N); let yen = 0, kills = 0, deaths = 0;
    const b = add(`<div class=t>¥0</div>`, `right:${HW + 36}px;bottom:26px;font-size:46px;color:#ffe066;z-index:15`);
    const evs = [["キル", 10000], ["キル", 10000], ["デス", -5000], ["キル", 10000], ["デス", -5000], ["デス", -5000], ["トリプルキル", 30000]];
    for (const [name, v] of evs) { await wait(720); chip(name); yen += v; v > 0 ? kills++ : deaths++; b.textContent = `${yen < 0 ? "-" : ""}¥${Math.abs(yen).toLocaleString()}`;
      const f = say(`${v > 0 ? "+" : "-"}¥${Math.abs(v).toLocaleString()}`, 640, 400, { size: 36, color: v > 0 ? "#7dff8a" : "#ff6a5a", ms: 500 });
      anim(f, [{ top: "400px" }, { top: "340px" }], 650); if (v > 0) { hop(h, 30); burst(...P(600, 600), 5); } else shake(h); }
    await wait(900); chip("配信終了"); h.img.src = R1; rain(36);
    const p = add(`<div></div>`, `left:210px;top:90px;width:540px;height:330px;background:#141021ee;border:5px solid #fc3;border-radius:22px;z-index:40`);
    add(`<div>本日の収支</div>`, "left:0;right:0;top:22px;text-align:center;font-size:42px;color:#ffd23c", p);
    add(`<div>キル ${kills}　/　デス ${deaths}</div>`, "left:0;right:0;top:106px;text-align:center;font-size:28px", p);
    add(`<div class=t>+¥${yen.toLocaleString()}</div>`, "left:0;right:0;top:170px;text-align:center;font-size:68px;color:#7dff8a", p);
    anim(p, [{ transform: "scale(.4)", opacity: 0 }, { transform: "none", opacity: 1 }], 280, { easing: "cubic-bezier(.2,1.5,.4,1)" });
    await wait(2300);
  },
  async sword() { // 育つ大剣 (デザインはオリジナル)
    const h = ham(N); let len = 44;
    const sw = add(`<div></div>`, `left:${HX + 34}px;bottom:96px;width:0;height:0;transform:rotate(-7deg);z-index:12`);
    const edge = `drop-shadow(3px 0 ${INK}) drop-shadow(-3px 0 ${INK}) drop-shadow(0 -3px ${INK})`;
    const bw = add(`<div><div style="left:0;top:0;width:100%;height:100%;background:linear-gradient(90deg,#fff 0 47%,#8ea1b8 53%);clip-path:polygon(50% 0,100% 34px,100% 100%,0 100%,0 34px)"></div></div>`,
      `left:-21px;bottom:12px;width:42px;height:${len}px;filter:${edge};transition:height .16s cubic-bezier(.2,1.6,.4,1)`, sw);
    add(`<div></div>`, `left:-11px;top:6px;width:22px;height:70px;background:repeating-linear-gradient(#7a4a28 0 8px,#4a2a16 8px 14px);border:3px solid ${INK}`, sw);
    add(`<div></div>`, `left:-56px;top:-12px;width:112px;height:22px;background:linear-gradient(#ffe680,#d99a10);border:4px solid ${INK};border-radius:11px`, sw);
    add(`<div></div>`, `left:-9px;top:-16px;width:18px;height:30px;border-radius:50% 50% 50% 50%/65% 65% 35% 35%;background:#3a3030;border:3px solid #fff`, sw); // ひまわりの種の飾り
    add(`<div></div>`, `left:-24px;top:22px;width:48px;height:44px;border-radius:50%;background:#fbcbc3;border:4px solid ${INK}`, sw);
    for (let i = 1; i <= 8; i++) { await wait(i === 1 ? 800 : 480); chip(`キル ×${i}`); len += 50; bw.style.height = len + "px"; hop(h, 18);
      if (i < 8) say(`${i}キル`, HX - 90, 340, { size: 34, ms: 330 }); else say("天井到達!!", 520, 70, { size: 58, ms: 1000 }); }
    await wait(1300); chip("デス"); say("ポッキリ…", 480, 300, { color: "#9db4d8", size: 56 }); shake(h);
    const fr = bw.cloneNode(true); fr.style.bottom = "62px"; fr.style.height = len - 50 + "px"; sw.append(fr); bw.style.height = "50px";
    await anim(fr, [{ transform: "none" }, { transform: "translate(-120px,-20px) rotate(-55deg)", offset: .3 }, { transform: "translate(-320px,520px) rotate(-200deg)" }], 900, { easing: "ease-in" });
    await wait(900);
  },
  async soul() { // 魂抜けハム
    const h = ham(N), [mx, my] = P(600, 650);
    for (const [leave, label] of [[-170, "チーン…"], [-470, "昇天…"]]) {
      await wait(1100); chip("デス"); shake(h); const eyes = ov(h, whiteEyes + openMouth); h.img.style.filter = "saturate(.2) brightness(1.08)";
      say(label, 540, 270, { color: "#cfe0ff", ms: 1200 });
      const so = add(`<img src="${N}">`, `left:${mx - 42}px;top:${my - 42}px;width:84px;filter:grayscale(1) brightness(1.8);opacity:.85;z-index:20`);
      await anim(so, [0, 1, 2, 3, 4].map(i => ({ transform: `translate(${i % 2 ? 26 : -22}px,${leave * i / 4}px) scale(${.3 + i * .18})` })), 1500, { easing: "ease-in-out" });
      await wait(450); chip("復活");
      await anim(so, [{ transform: `translate(0,${leave}px) scale(1)` }, { transform: "scale(.2)" }], 210, { easing: "ease-in" });
      so.remove(); eyes.remove(); h.img.style.filter = "none"; hop(h, 70); say("復活!!", 540, 270, { ms: 600 });
    }
    await wait(800);
  },
  async sleep() { // マッチング待ちで寝る
    const h = ham(N), lab = add(`<div class=lab>マッチング中 0:00</div>`, `left:${HX - 170}px;top:${HY + 24}px`); let bub, web, z = 0, eyes;
    for (let sec = 0; sec <= 210; sec += 5) { lab.textContent = `マッチング中 ${Math.floor(sec / 60)}:${String(sec % 60).padStart(2, "0")}`;
      if (sec === 25) { eyes = ov(h, closedEyes); h.classList.add("bob"); }
      if (sec >= 25 && sec % 25 === 0) { const q = add(`<div class=t>Z</div>`, `left:${HX + 40 + (z++ % 3) * 18}px;top:${HY + 10}px;font-size:${22 + z % 3 * 8}px;color:#bcd`);
        anim(q, [{ transform: "none", opacity: 1 }, { transform: "translate(-40px,-70px)", opacity: 0 }], 900).then(() => q.remove()); }
      if (sec === 75) bub = ov(h, `<circle class=puff cx=650 cy=610 r=78 fill=#bfe6ffbb stroke=#7fb7da stroke-width=7 />`);
      if (sec === 150) web = add(`<svg viewBox="0 0 200 200" style="left:${HX - 30}px;top:${HY - 40}px;width:${HW + 60}px;height:${HH + 40}px;overflow:visible"></svg>`, "z-index:14");
      if (sec === 150) web.innerHTML = [0, 1, 2, 3, 4, 5].map(i => { const a = i * .3, x = 200 - 200 * Math.cos(a), y = 200 * Math.sin(a); return `<path d="M200 0L${x} ${y}" stroke=#fffc stroke-width=1.4 />`; }).join("") +
        [50, 95, 140].map(r => `<path d="${[0, 1, 2, 3, 4, 5].map(i => { const a = i * .3; return `${i ? "L" : "M"}${200 - r * Math.cos(a)} ${r * Math.sin(a)}`; }).join("")}" fill=none stroke=#fffc stroke-width=1.4 />`).join("");
      await wait(115); }
    chip("マッチ成立"); bub.remove(); h.classList.remove("bob"); eyes.remove(); lab.remove(); say("!?", 640, 250, { size: 90, color: "#ff5a4a", ms: 800 });
    anim(h, [{ transform: "none" }, { transform: "translateY(-120px) scale(1.15)", offset: .35 }, { transform: "none" }], 500);
    await anim(web, [{ transform: "none", opacity: 1 }, { transform: "translateY(400px) rotate(30deg)", opacity: 0 }], 800, { easing: "ease-in" }); await wait(900);
  },
  async afk() { // 離席の代打
    const h = ham(N); await wait(800); chip("離席");
    const chair = add(`<svg viewBox="0 0 400 420"><rect x=70 y=70 width=260 height=350 rx=60 fill=#2b2b38 stroke=${INK} stroke-width=8 /><rect x=120 y=0 width=160 height=100 rx=34 fill=#c62828 stroke=${INK} stroke-width=8 />
      <rect x=95 y=120 width=30 height=300 fill=#c62828 /><rect x=275 y=120 width=30 height=300 fill=#c62828 /><rect x=10 y=270 width=60 height=30 rx=12 fill=#555 stroke=${INK} stroke-width=6 /><rect x=330 y=270 width=60 height=30 rx=12 fill=#555 stroke=${INK} stroke-width=6 /></svg>`,
      "left:300px;top:110px;width:400px;height:430px;z-index:5;opacity:0");
    anim(h, [{ transform: "none" }, { transform: "translate(-333px,-8px) scale(1.5)" }], 420); anim(chair, [{ opacity: 0 }, { opacity: 1 }], 300); await wait(450);
    const pad = ov(h, `<rect x=360 y=800 width=480 height=180 rx=85 fill=#39405a stroke=${INK} stroke-width=15 /><circle cx=490 cy=880 r=32 fill=#222 /><circle cx=740 cy=860 r=20 fill=#e55 /><circle cx=785 cy=905 r=20 fill=#5be /><circle cx=380 cy=840 r=78 fill=#fbcbc3 stroke=${INK} stroke-width=14 /><circle cx=825 cy=840 r=78 fill=#fbcbc3 stroke=${INK} stroke-width=14 />`);
    pad.classList.add("wig");
    const sign = say("代打ハム", 500, 66, { size: 62, ms: 0, color: "#fff" }); const lab = add(`<div class=lab>離席 0:00</div>`, "right:30px;top:20px");
    const bubs = ["ランクは任せろ", "このボタン何?", "勝手にウルト撃った", "なんか勝ってる"];
    for (let i = 0; i < bubs.length; i++) { const b = add(`<div class=bub>${bubs[i]}</div>`, "left:640px;top:190px"); anim(b, [{ transform: "scale(.3)" }, { transform: "none" }], 170); lab.textContent = `離席 ${i + 1}:${i * 17 + 12}`; await wait(1050); b.remove(); }
    chip("戻った"); pad.remove(); sign.remove(); lab.remove(); say("おかえり〜", 500, 90, { ms: 800, color: "#fff" });
    anim(h, [{ transform: "translate(-333px,-8px) scale(1.5)" }, { transform: "none" }], 420); await anim(chair, [{ opacity: 1 }, { opacity: 0 }], 300); await wait(1000);
  },
  async ult() { // ウルトのカットイン
    const h = ham(N);
    for (const text of ["本気、出す。", "頬袋、全開。"]) { await wait(1200); chip("ウルト");
      const fl = add(`<div></div>`, "left:0;top:0;width:960px;height:540px;background:#fff;z-index:24"); anim(fl, [{ opacity: .85 }, { opacity: 0 }], 220).then(() => fl.remove());
      const b = add(`<div class=sp></div>`, "left:-40px;width:1040px;bottom:40px;height:256px;overflow:hidden;z-index:25;border:solid #fd3;border-width:6px 0");
      const face = add(`<div><img src="${N}" style="width:100%;height:100%"></div>`, "right:90px;top:-135px;width:600px;height:616px", b);
      ov(face, `<path d="M300 350L470 400M905 350L735 400" stroke=${INK} stroke-width=34 stroke-linecap=round />`);
      await anim(b, [{ transform: "translateX(110%) skewY(-5deg)" }, { transform: "skewY(-5deg)" }], 130);
      const g = add(`<div class=t>✦</div>`, `right:325px;top:90px;font-size:110px;color:#fff;-webkit-text-stroke:0;z-index:5`, b);
      anim(g, [{ transform: "scale(0) rotate(0)" }, { transform: "scale(1.5) rotate(90deg)", offset: .5 }, { transform: "scale(0) rotate(180deg)" }], 480);
      const t = say(text, 260, 372, { size: 66, ms: 0, color: "#fff", z: 31 });
      h.style.filter = "drop-shadow(0 0 16px gold)"; await wait(900); t.remove();
      await anim(b, [{ transform: "skewY(-5deg)" }, { transform: "translateX(-110%) skewY(-5deg)" }], 130, { easing: "ease-in" }); b.remove(); h.style.filter = "none"; }
    await wait(800);
  },
  async gacha() { // どっち!?ガチャ
    const h = ham(N);
    for (const [name, a, b, win, msg] of [["たろう", N, R1, 0, "ハズレ…"], ["はなこ", N, R1, 1, "成金!!"], ["じろう", R1, R2, 1, "超成金!!"], ["ゆうき", R1, R2, 1, "JACKPOT!!"]]) {
      await wait(500); chip(`投げ銭 ${name}さん`);
      const card = (src, x) => add(`<div class=card><img src="${src}" style="left:4px;top:4px;width:106px;height:110px"></div>`, `left:${x}px;top:330px;z-index:18`);
      const cs = [card(a, 400), card(b, 545)], d = say("どっち!?", 530, 280, { ms: 0, size: 52 });
      let cur = 1; const set = i => { cur = i; cs[i].classList.add("on"); cs[1 - i].classList.remove("on"); };
      for (const ms of [170, 140, 110, 90, 90, 90, 110, 140, 190, 280]) { set(1 - cur); await wait(ms); }
      if (cur !== win) { set(win); await wait(380); }
      d.remove(); swap(h, win ? b : a, win); say(msg, 530, 240, { size: win ? 64 : 48, color: win ? "#ffd23c" : "#9db4d8" }); if (win) rain(); await wait(1000);
      cs.forEach(c => c.remove());
      if (msg === "JACKPOT!!") { const v = add(`<video src="jackpot.mp4" muted autoplay style="width:100%;height:100%"></video>`, "left:0;top:0;width:960px;height:540px;z-index:40"); await wait(3000); v.remove(); }
      h.img.src = N;
    }
  },
  async seed() { // 種やり
    const h = ham(N), m = ov(h, openMouth), [mx, my] = P(600, 660); m.style.opacity = 0; let n = 0, flying = 0;
    const cnt = add(`<div class=t>種 ×0</div>`, `left:${HX - 130}px;top:${HY + 80}px;font-size:34px;z-index:15`);
    const toss = async name => { const x = rnd(30, 560), y = rnd(40, 280); flying++; m.style.opacity = 1;
      const e = add(`<div><svg viewBox="0 0 40 60" style="left:0;top:0;width:32px;height:48px"><path d="M20 2C38 24 36 54 20 58C4 54 2 24 20 2Z" fill=#3a3030 stroke=#fff stroke-width=3 /><path d="M14 16L12 50M26 16L28 50" stroke=#eee stroke-width=3 /></svg></div>`, "left:0;top:0;width:32px;height:48px;z-index:25");
      const tag = add(`<div class=lab>${name}</div>`, `left:${x - 20}px;top:${y - 40}px;font-size:18px`);
      await anim(e, [{ transform: `translate(${x}px,${y}px) rotate(0)` }, { transform: `translate(${(x + mx) / 2}px,${Math.min(y, my) - 110}px) rotate(360deg)` }, { transform: `translate(${mx - 16}px,${my - 24}px) rotate(720deg) scale(.6)` }], 640, { easing: "linear" });
      e.remove(); tag.remove(); cnt.textContent = `種 ×${++n}`;
      anim(h, [{ transform: "none" }, { transform: "scale(1.09,.93)" }, { transform: "none" }, { transform: "scale(1.06,.95)" }, { transform: "none" }], 420, { easing: "linear" });
      if (--flying === 0) wait(300).then(() => { if (!flying) m.style.opacity = 0; }); };
    for (const name of ["たろう", "はなこ", "じろう"]) { await wait(650); chip(`!たね ${name}`); await toss(name); }
    await wait(800); chip("!たね ×8 大盤振る舞い"); say("連投!!", 430, 90, { ms: 900 });
    await Promise.all("ゆうき,みき,けん,さき,りょう,あや,しん,まい".split(",").map((name, i) => wait(i * 170).then(() => toss(name)))); await wait(1200);
  },
};
async function play(key) { for (;;) { s.innerHTML = ""; await scenes[key](); await wait(500); } }
