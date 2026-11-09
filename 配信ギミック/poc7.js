// 配信ハム PoC 第7弾: 全自動卵割り機を動かすハム。poc.js / poc2.js / poc3.js / zari.js の部品を使う。
{
const MX = 440, MY = 236; // 機械の左上 (ハムの左隣)。機械は 270×300
const L = `stroke=${INK} stroke-width=4 stroke-linejoin=round`;
const EGG = "M20 2C32 2 38 22 38 32C38 43 30 48 20 48C10 48 2 43 2 32C2 22 8 2 20 2Z";
const eggSvg = gold => `<svg viewBox="0 0 40 50" style="left:0;top:0;width:100%;height:100%;overflow:visible">${gold ? `<defs><radialGradient id=kgold cx=.35 cy=.3><stop offset=0 stop-color=#fff6c0 /><stop offset=.5 stop-color=#ffcf33 /><stop offset=1 stop-color=#c98a00 /></radialGradient></defs>` : ""}
  <path d="${EGG}" fill=${gold ? "url(#kgold)" : "#fff6e0"} stroke=${INK} stroke-width=3.5 /><ellipse cx=13 cy=18 rx=4 ry=7 fill=#fff opacity=.75 /></svg>`;
const SHELL_L = "M20 48C10 48 2 43 2 32C2 22 8 2 20 2L17 12L22 19L16 26L23 33L17 40Z", SHELL_R = "M20 2C32 2 38 22 38 32C38 43 30 48 20 48L17 40L23 33L16 26L22 19L17 12Z";
const shellSvg = (d, col = "#fff6e0") => `<svg viewBox="0 0 40 50" style="left:0;top:0;width:100%;height:100%;overflow:visible"><path d="${d}" fill=${col} stroke=${INK} stroke-width=3.5 /></svg>`;
const yolkSvg = `<svg viewBox="0 0 40 30" style="left:0;top:0;width:100%;height:100%;overflow:visible"><path d="M4 18Q2 6 18 6Q38 4 36 18Q36 28 20 27Q4 28 4 18Z" fill=#fffdf5 stroke=${INK} stroke-width=2.5 /><circle cx=20 cy=16 r=8 fill=#ffc21a stroke=${INK} stroke-width=2.5 /><circle cx=17 cy=13 r=2 fill=#fff /></svg>`;
const gearSvg = col => `<svg viewBox="-20 -20 40 40" style="left:0;top:0;width:100%;height:100%;overflow:visible"><g fill=${col} stroke=${INK} stroke-width=2.5>${[0, 45, 90, 135].map(a => `<rect x=-4 y=-19 width=8 height=38 rx=2 transform="rotate(${a})" />`).join("")}<circle r=13 /></g><circle r=4 fill=${INK} /></svg>`;
// ハムの黄色いヘルメット (ハム画像の座標)
const HELMET = `<path d="M300 360Q300 120 620 110Q940 120 940 360Z" fill=#ffd23c stroke=${INK} stroke-width=16 /><path d="M620 122V350" stroke=#f2b600 stroke-width=34 /><rect x=262 y=338 width=716 height=52 rx=24 fill=#f2b600 stroke=${INK} stroke-width=14 />`;
const yolkEl = (x, y, w = 40, parent = s) => add(`<div>${yolkSvg}</div>`, `left:${x}px;top:${y}px;width:${w}px;height:${w * .75}px;z-index:11`, parent);
const sfx = (t, x, y, size = 30, col = "#fff") => say(t, x, y, { size, color: col, ms: 550 });

// 全自動卵割り機。左の部分 (卵の棚・筒・受け皿・ボウル) と右の部分 (柱・腕・表示・ボタン・歯車・札) を別々に動かせる
const machine = () => {
  const root = add(`<div></div>`, `left:${MX}px;top:${MY}px;width:270px;height:300px;z-index:9`);
  const part = () => add(`<div></div>`, "left:0;top:0;width:270px;height:300px", root);
  const lp = part(), rp = part();
  add(`<svg viewBox="0 0 270 300" style="left:0;top:0;width:270px;height:300px;overflow:visible">
    <rect x=8 y=272 width=166 height=24 rx=6 fill=#6b7c8f ${L} /><rect x=16 y=66 width=20 height=208 fill=#93a7bc ${L} /><rect x=8 y=52 width=152 height=22 rx=6 fill=#7d92a8 ${L} />
    <path d="M10 48L126 30V52H10Z" fill=#c9a46a ${L} />${[18, 46].map(x => `<path d="${EGG}" transform="translate(${x} 4) scale(.62)" fill=#fff6e0 stroke=${INK} stroke-width=5 />`).join("")}
    <rect x=88 y=74 width=32 height=62 rx=6 fill=#dff3ff fill-opacity=.45 stroke=${INK} stroke-width=3 /><path d="M84 176Q104 196 124 176" fill=#b8c6d4 ${L} /><path d="M104 190V214" stroke=${INK} stroke-width=6 /></svg>`, "", lp);
  add(`<svg viewBox="0 0 270 300" style="left:0;top:0;width:270px;height:300px;overflow:visible">
    <rect x=166 y=272 width=96 height=24 rx=6 fill=#6b7c8f ${L} /><rect x=172 y=66 width=20 height=208 fill=#93a7bc ${L} /><rect x=154 y=52 width=50 height=22 rx=6 fill=#7d92a8 ${L} />
    <rect x=200 y=104 width=62 height=128 rx=8 fill=#cfd9e3 ${L} /><rect x=207 y=114 width=48 height=30 rx=4 fill=#0f2a1c stroke=${INK} stroke-width=3 />
    <circle cx=231 cy=196 r=17 fill=#e53935 ${L} /><text x=231 y=224 text-anchor=middle font-size=9 font-weight=900 fill=${INK}>START</text>
    ${[0, 1, 2, 3].map(k => `<circle cx=${180 + (k % 2) * 4} cy=${100 + k * 46} r=2.5 fill=${INK} />`).join("")}</svg>`, "", rp);
  // ボウル (割った黄身がたまる)
  const bowl = add(`<div><svg viewBox="0 0 120 56" style="left:0;top:0;width:120px;height:56px;overflow:visible"><path d="M6 10Q60 70 114 10Z" fill=#f2f6fa ${L} /><path d="M16 22Q60 50 104 22" fill=none stroke=#7fb3e0 stroke-width=5 /></svg></div>`, "left:44px;top:226px;width:120px;height:56px", lp);
  // 腕 (右の柱が支点。休みは上げた角度、叩くと受け皿の卵の頭に当たる)
  const arm = add(`<div><svg viewBox="0 0 96 14" style="left:0;top:0;width:96px;height:14px;overflow:visible"><rect x=10 y=3 width=84 height=8 rx=3 fill=#b0bfcd stroke=${INK} stroke-width=3 />
    <rect x=0 y=-9 width=16 height=32 rx=4 fill=#8a6a44 stroke=${INK} stroke-width=3 /><circle cx=89 cy=7 r=7 fill=#5d6d7e stroke=${INK} stroke-width=3 /></svg></div>`,
    "left:86px;top:77px;width:96px;height:14px;transform-origin:100% 50%;transform:rotate(20deg)", rp);
  const disp = add(`<div>000</div>`, "left:207px;top:114px;width:48px;height:30px;text-align:center;font:900 17px/30px monospace;color:#6dff9a", rp);
  const plate = add(`<div>全自動卵割り機</div>`, `left:124px;top:4px;width:144px;height:36px;background:#fff8e6;border:4px solid ${INK};border-radius:6px;text-align:center;font-size:17px;line-height:28px;color:${INK}`, rp);
  const gears = [[206, 44, 38, "#d8b45a", 1], [238, 70, 26, "#c79a3a", -1]].map(([x, y, w, c, d]) => { const g = add(`<div>${gearSvg(c)}</div>`, `left:${x}px;top:${y}px;width:${w}px;height:${w}px`, rp);
    g.animate([{ transform: "rotate(0)" }, { transform: `rotate(${d * 360}deg)` }], { duration: 2400, iterations: Infinity }); return g; });
  let n = 0;
  const m = { root, lp, rp, bowl, arm, disp, plate, gears,
    count(t) { disp.textContent = typeof t === "number" ? String(t).padStart(3, "0") : t; },
    async press() { // ハムが赤いボタンを押す
      const b = add(`<div></div>`, "left:214px;top:179px;width:34px;height:34px;border-radius:50%;background:#fff;opacity:.8", rp); fade(b, 300); sfx("ポチッ", MX + 231, MY + 168, 22); await wait(250); },
    drop(gold = false, w = 30) { // 棚から卵を1つ落とし、受け皿に止める
      const e = add(`<div>${eggSvg(gold)}</div>`, `left:${MX + 104 - w / 2}px;top:${MY + 140 + 37.5 - w * 1.25}px;width:${w}px;height:${w * 1.25}px;z-index:10`);
      anim(e, [{ transform: "translate(6px,-140px) rotate(-30deg)" }, { transform: "translate(0,-60px) rotate(10deg)", offset: .55 }, { transform: "translateY(4px)", offset: .85 }, { transform: "none" }], 520, { easing: "ease-in" }); return e; },
    async strike(ms = 300) { // 腕を振り下ろす (当たる瞬間に戻る)
      await anim(arm, [{ transform: "rotate(20deg)" }, { transform: "rotate(-36deg)" }], ms / 2, { easing: "ease-in" }); },
    async lift(ms = 200) { await anim(arm, [{ transform: "rotate(-36deg)" }, { transform: "rotate(20deg)" }], ms); },
    async crack(e) { // 卵を割る: 殻が左右に飛び、黄身がボウルへ落ちる
      await m.strike(); sfx("パカッ", MX + 60, MY + 128, 28); const r = e.getBoundingClientRect ? null : null; const x = parseFloat(e.style.left), y = parseFloat(e.style.top), w = parseFloat(e.style.width); e.remove();
      for (const [d, k] of [[SHELL_L, -1], [SHELL_R, 1]]) { const sh = add(`<div>${shellSvg(d)}</div>`, `left:${x}px;top:${y}px;width:${w}px;height:${w * 1.25}px;z-index:10`);
        anim(sh, [{ transform: "none", opacity: 1 }, { transform: `translate(${k * 30}px,${-10}px) rotate(${k * 40}deg)`, opacity: 1, offset: .3 }, { transform: `translate(${k * 46}px,70px) rotate(${k * 120}deg)`, opacity: 0 }], 700).then(() => sh.remove()); }
      const yk = yolkEl(MX + 84, MY + 150, 40); m.lift();
      await anim(yk, [{ transform: "none" }, { transform: "translateY(66px)" }], 330, { easing: "ease-in" }); yk.remove();
      add(`<div>${yolkSvg}</div>`, `left:${16 + (n * 23) % 62}px;top:${-6 - Math.floor(n / 3) * 7}px;width:34px;height:26px`, bowl); n++; }
  };
  return m;
};
const stage = t => label(t, `left:${MX + 6}px;top:${MY - 38}px;font-size:20px;z-index:16`);

Object.assign(scenes, {
  async k_wage() { // K01 賃金は殻: キルのたびに卵を割る。ボウルは社長が持っていき、ハムの取り分は殻
    const h = ham(N), m = machine(); ov(h, HELMET); await wait(700);
    for (let i = 1; i <= 3; i++) { chip(i === 1 ? "キル" : `キル ×${i}`); await m.press(); hop(h, 16); const e = m.drop(); await wait(560); await m.crack(e); m.count(i); await wait(450); }
    chip("給料日"); const boss = zari(170, 350, 104, { acc: "tie", face: "evil", z: 14 });
    await anim(boss, [{ transform: "translateX(-320px)" }, { transform: "none" }], 700); bubble("ご苦労", 222, 318, 1000); await wait(700);
    // ボウルごと持っていく
    const bx = MX + 44, by = MY + 226; m.bowl.style.zIndex = 15; await anim(m.bowl, [{ transform: "none" }, { transform: `translate(${170 + 60 - bx}px,${350 + 40 - by}px)` }], 450);
    const out = `translate(${170 + 60 - bx - 420}px,${350 + 40 - by}px)`;
    anim(m.bowl, [{ transform: `translate(${170 + 60 - bx}px,${350 + 40 - by}px)` }, { transform: out }], 900, { easing: "ease-in" }); await anim(boss, [{ transform: "none" }, { transform: "translateX(-420px)" }], 900, { easing: "ease-in" });
    // ハムの前の皿に殻が落ちてくる
    const pl = add(`<div><svg viewBox="0 0 120 30" style="left:0;top:0;width:120px;height:30px;overflow:visible"><ellipse cx=60 cy=15 rx=56 ry=12 fill=#fff ${L} /><ellipse cx=60 cy=13 rx=36 ry=6 fill=none stroke=#cfd9e3 stroke-width=3 /></svg></div>`, `left:${HX + 52}px;top:${HY + 196}px;width:120px;height:30px;z-index:12`);
    pop(pl); await wait(250);
    for (let i = 0; i < 6; i++) { const sh = add(`<div>${shellSvg(i % 2 ? SHELL_R : SHELL_L)}</div>`, `left:${HX + 70 + i * 13}px;top:${HY + 180}px;width:22px;height:28px;z-index:13`);
      anim(sh, [{ transform: "translateY(-260px) rotate(0)" }, { transform: `translateY(0) rotate(${(i % 2 ? 1 : -1) * 30}deg)` }], 420, { easing: "ease-in", delay: i * 90, fill: "both" }); }
    await wait(800); const lb = label("本日の賃金：殻 3個", `left:${HX - 150}px;top:${HY + 120}px;font-size:22px`); pop(lb);
    ov(h, tears); await wait(700); bubble("…カルシウムは とれます", 800, 236, 1600); await wait(1900);
  },

});
}
