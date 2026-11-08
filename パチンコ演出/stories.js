// パチンコ演出の話。どの話も最後は pachi.js の ending(r) (家族ラッシュ → 図柄の結果) につながる。
// r: "big" 大当たり / "mid" 当たり / "miss" ハズレ。途中の期待度は予告の色 (青<緑<赤<金<虹) で見せる。
// 話の決まりごと: 「家族が閉じこめられている → 親ががんばる → PUSH で決め → 出られた数が結果」。
// 出られた家族は、どの話でも右上から左下へ走り抜ける (ending)。
document.head.insertAdjacentHTML("beforeend", `<style>
#s .bar{background:linear-gradient(90deg,#7d8798,#f2f5fa 45%,#8c96a6);border-radius:3px;box-shadow:0 0 0 1.5px #262b36}
#s .rail{background:linear-gradient(#f2f5fa,#9aa4b4 60%,#6c7686);border-radius:6px;box-shadow:0 0 0 2px #262b36}
#s .tray{background:linear-gradient(#7cc0ff,#2f74e0 55%,#1b4fb0);border:3px solid #0e2a66;border-radius:4px 4px 16px 16px}
#s .door{border:7px solid #c3ccd8;border-radius:6px;box-shadow:0 0 0 2px #262b36,inset 0 0 0 2px #262b36;transform-origin:0 50%}
#s .eyes{width:22px;height:8px;animation:blink 3s infinite}#s .eyes i{top:0;width:7px;height:7px;border-radius:50%;background:#fff;box-shadow:0 0 6px #fffa}#s .eyes i+i{left:14px}
#s .gauge .tr{left:0;top:0;width:46px;height:290px;background:#000a;border:4px solid #fff;border-radius:23px;overflow:hidden;box-shadow:0 0 0 3px #0008}
#s .gauge .tr b{left:0;bottom:0;width:100%;height:0;transition:height .5s cubic-bezier(.2,1.4,.4,1);background:linear-gradient(#9ad4ff,#1b6fe0)}
#s .gauge .tr b.rbg{background:${RAINBOW};background-size:300% 100%}
#s .gauge span{left:23px;top:-30px;translate:-50% 0;font-size:18px;white-space:nowrap;-webkit-text-stroke:4px #000;paint-order:stroke fill}
#s .gauge i{left:23px;top:298px;translate:-50% 0;font-style:normal;font-size:24px;white-space:nowrap;-webkit-text-stroke:5px #000;paint-order:stroke fill;color:#ffd23c}
#s .sign{padding:3px 12px;background:#d01818;border:3px solid #fff;border-radius:6px;font-size:21px;color:#fff;white-space:nowrap;transform-origin:50% -16px;animation:swing 1.6s ease-in-out infinite}
@keyframes swing{0%,100%{transform:rotate(-6deg)}50%{transform:rotate(6deg)}}
#s .shutter{background:repeating-linear-gradient(#aab4c2 0 14px,#7a8596 14px 17px,#cfd6e0 17px 20px);border-bottom:8px solid #59606c}
#s .lab{padding:3px 10px;background:#000b;border-radius:8px;font-size:20px;white-space:nowrap}
#s .step{padding:1px 10px;border-radius:8px;font-size:18px;white-space:nowrap;border:3px solid #fff;color:#fff;-webkit-text-stroke:4px #0009;paint-order:stroke fill;transition:opacity .2s}
#s .btn{border-radius:0 0 34px 34px;background:radial-gradient(circle at 50% 20%,#ff9a9a,#e01818 55%,#8a0000);border:4px solid #4a0000;border-top:0;font-size:17px;color:#fff;text-align:center;line-height:34px;-webkit-text-stroke:3px #600;paint-order:stroke fill}
</style>`);

// ゲージ (縦)。set(0〜100, 予告の色)
const gauge = (label, x = 884, y = 112) => {
  const g = add(`<div class=gauge><div class=tr><b></b></div><span>${label}</span><i>0%</i></div>`, `left:${x}px;top:${y}px;z-index:30`);
  const f = g.querySelector("b"), pc = g.querySelector("i");
  return { set(v, col) {
    f.style.height = v + "%"; pc.textContent = v >= 100 ? "MAX!!" : Math.round(v) + "%";
    if (col) { f.className = col === "rainbow" ? "rbg" : ""; f.style.background = col === "rainbow" ? "" : chBG(col); }
    if (v >= 100) anim(g, [{ transform: "scale(1.25)" }, { transform: "none" }], 300);
  } };
};
// 錠前 (予告の色)
const lockSVG = col => {
  const id = "lk" + col, stops = col === "rainbow" ? ["#ff5a5a", "#ffd23c", "#5dff8f", "#59c8ff", "#b07bff"].map((c, i) => `<stop offset="${i / 4}" stop-color="${c}"/>`).join("")
    : `<stop offset="0" stop-color="#fff"/><stop offset=".35" stop-color="${CH_HEX[col]}"/><stop offset="1" stop-color="${CH_HEX[col]}"/>`;
  return `<defs><linearGradient id="${id}" ${col === "rainbow" ? 'x2="1" y2="0"' : 'x2="0" y2="1"'}>${stops}</linearGradient></defs>
    <path d="M15 32V20a13 13 0 0 1 26 0v12" fill="none" stroke="#262b36" stroke-width="10"/><path d="M15 32V20a13 13 0 0 1 26 0v12" fill="none" stroke="#d5dce6" stroke-width="6"/>
    <rect x="3" y="30" width="50" height="38" rx="9" fill="url(#${id})" stroke="#262b36" stroke-width="3"/><rect x="3" y="52" width="50" height="16" rx="8" fill="#0003"/>
    <circle cx="28" cy="45" r="5.5" fill="#222"/><rect x="25.5" y="47" width="5" height="11" rx="2" fill="#222"/>`;
};
// 回し車
const wheelSVG = () => `<circle r="100" fill="none" stroke="#e7b347" stroke-width="12"/><circle r="100" fill="none" stroke="#7a5212" stroke-width="2.5"/>` +
  Array.from({ length: 28 }, (_, i) => { const a = i / 28 * 6.283; return `<line x1="${(Math.cos(a) * 88).toFixed(1)}" y1="${(Math.sin(a) * 88).toFixed(1)}" x2="${(Math.cos(a) * 100).toFixed(1)}" y2="${(Math.sin(a) * 100).toFixed(1)}" stroke="#b8862a" stroke-width="4"/>`; }).join("") +
  Array.from({ length: 6 }, (_, i) => { const a = i / 6 * 6.283; return `<line x1="0" y1="0" x2="${(Math.cos(a) * 94).toFixed(1)}" y2="${(Math.sin(a) * 94).toFixed(1)}" stroke="#e7b347" stroke-width="7"/>`; }).join("") +
  `<circle r="14" fill="#b8862a" stroke="#7a5212" stroke-width="3"/>`;
const sparkCol = col => col === "rainbow" ? pick(["#ff5a5a", "#ffd23c", "#5dff8f", "#59c8ff", "#c07bff"]) : CH_HEX[col];
// オーラ (予告の色)
const aura = (x, y, size, col, parent = s, z = 5) => add(`<div class="pulse"></div>`, `left:${x - size / 2}px;top:${y - size / 2}px;width:${size}px;height:${size}px;border-radius:50%;z-index:${z};` +
  (col === "rainbow" ? "background:conic-gradient(#ff5a5a,#ffd23c,#5dff8f,#59c8ff,#c07bff,#ff5a5a);filter:blur(22px);opacity:.85" : `background:radial-gradient(circle,${CH_HEX[col]}ee 0,${CH_HEX[col]}66 38%,${CH_HEX[col]}00 70%)`), parent);
// 入れ物 (檻・部屋) の中のハムを、画面の上に出し直す (飛び出すときに切れないように)
const free = (k, ox = 0, oy = 0) => { const n = ham(k.px + ox, k.py + oy, k.h, { z: 50, tint: k.tint }); face(n, ...k.fn); k.remove(); return n; };
// 家族がカメラに向かって飛び出す (ここから家族ラッシュにつながる)
const leapOut = (hs, gap = 70) => hs.forEach((k, i) => wait(i * gap).then(() => { act(k, ""); face(k, "happy", "open"); mv(k, k.px + rnd(-90, 90), k.py + 150, 430, { k: k.k * 3.2, arc: 70, fade: 1 }); }));

Object.assign(scenes, {
  // ===== P01 檻からの大脱走 =====
  // 親と子どもたちが檻に捕まっている。かじる → 回し車で体当たり → 気合いため → 最後の体当たり (PUSH)。
  // 檻ごと吹き飛べば全員 / 扉が半分開けば半分 / びくともしなければ隙間から1〜2匹だけ。
  async cage(r) {
    const col = lotColor(r), missN = Math.random() < .7 ? 2 : 1;
    note(`錠前と気合いの色: ${CH_NAME[col]}`);
    add(`<div></div>`, "left:250px;top:0;width:460px;height:440px;background:linear-gradient(#fff3c430,#fff3c400);clip-path:polygon(40% 0,60% 0,100% 100%,0 100%);z-index:1"); // スポットライト
    reach(r);
    const g = gauge("脱出ゲージ");
    // 檻 (cg の中で重なり順を決める)
    const cg = add(`<div></div>`, "left:0;top:0;width:960px;height:540px;z-index:5");
    add(`<div></div>`, "left:220px;top:400px;width:520px;height:60px;border-radius:50%;background:radial-gradient(closest-side,#000b,#0000);z-index:0", cg); // 檻の影
    const back = add(`<div></div>`, "left:276px;top:112px;width:408px;height:272px;background:linear-gradient(#1c1634,#2e2450 62%,#75593a 86%,#93714a);z-index:1", cg);
    const eyes = Array.from({ length: 34 }, () => add(`<div class=eyes><i></i><i></i></div>`, `left:${rnd(290, 660)}px;top:${rnd(160, 320)}px;z-index:2;animation-delay:-${rnd(0, 3).toFixed(2)}s;opacity:${rnd(.45, 1).toFixed(2)}`, cg)); // 暗がりに子どもがいっぱい
    const kids = [[314, 392, 80], [648, 392, 82], [364, 394, 70], [598, 394, 72], [338, 368, 62], [624, 366, 60]].map(([x, y, h], i) => {
      const k = ham(x, y, h, { z: y > 380 ? 4 : 3, parent: cg, tint: (i % 3) + 1 }); face(k, "white", "sweat"); act(k, "trem"); return k; });
    const P = ham(480, 394, 172, { z: 6, parent: cg }); face(P, "brows");
    const bars = [];
    for (let x = 286; x <= 676; x += 30) { const d = x > 396 && x < 566; bars.push(add(`<div class=bar></div>`, `left:${x - 2.5}px;top:112px;width:5px;height:${d ? 66 : 272}px;z-index:8`, cg)); }
    for (const y of [200, 300]) for (const x of [278, 562]) bars.push(add(`<div class=bar></div>`, `left:${x}px;top:${y}px;width:120px;height:5px;z-index:8`, cg));
    bars.push(add(`<div class=rail></div>`, "left:268px;top:98px;width:424px;height:18px;z-index:9", cg));
    const handle = add(`<svg viewBox="0 0 200 60"><path d="M30 60V42Q100 -16 170 42V60" fill="none" stroke="#c9d1dc" stroke-width="10"/></svg>`, "left:380px;top:46px;width:200px;height:60px;z-index:9", cg);
    const sign = add(`<div class=sign>捕獲中</div>`, "left:443px;top:58px;z-index:10", cg);
    add(`<div class=tray></div>`, "left:262px;top:380px;width:436px;height:48px;z-index:9", cg);
    const door = add(`<div class=door>${[16, 48, 80, 112].map(x => `<div class=bar style="left:${x}px;top:0;width:5px;height:100%"></div>`).join("")}<div class=bar style="left:0;top:96px;width:100%;height:5px"></div></div>`, "left:398px;top:176px;width:168px;height:208px;z-index:10", cg);
    const lock = add(`<svg viewBox="0 0 56 70">${lockSVG(col)}</svg>`, `left:536px;top:248px;width:58px;height:72px;z-index:11;filter:drop-shadow(0 0 8px ${col === "rainbow" ? "#fff" : CH_HEX[col]})`, cg);

    // 1) 檻が落ちてくる
    anim(cg, [{ transform: "translateY(-560px)" }, { transform: "none", offset: .62 }, { transform: "translateY(-26px)", offset: .8 }, { transform: "none" }], 760, { easing: "ease-in" });
    await wait(480); quake(320, 9); for (const x of [280, 400, 560, 680]) puff(x, 422, 4); big("ガシャン!!", 480, 478, { size: 44, fill: "silver", ms: 650 });
    await wait(700);
    big("ハム一家を救え!!", 480, 478, { size: 50, fill: "gold", ms: 1500 });
    bub("パパぁ〜!", 340, 300, 1200); bub("こわいよ〜", 630, 300, 1200);
    face(P, "brows", "grit"); act(P, "trem");
    await wait(800); act(P, ""); bub("いま出してやるからな!", 480, 200, 1000);
    await wait(1000);

    // 2) 鉄の棒をかじる
    await mv(P, 350, 394, 420, { arc: 24 });
    pose(P, "rotate(-10deg)", 120); act(P, "wig");
    big("ガジガジガジ…", 250, 160, { size: 36, fill: "white", ms: 1100 });
    const iv = every(45, () => bits(rnd(298, 312), rnd(250, 330), 2, { colors: ["#c9d1dc", "#8a94a4", "#fff"], min: 3, max: 7, dmin: 20, dmax: 80, z: 20, dir: Math.PI * .85, spread: 1.2 }));
    g.set(10); await wait(500); g.set(22); await wait(600);
    clearInterval(iv); act(P, ""); pose(P, "none", 150);
    add(`<div></div>`, "left:302px;top:282px;width:8px;height:14px;background:#2a2040;z-index:8", cg); // 歯形
    g.set(Math.round(rnd(25, 31)));
    face(P, "sad", "sweat", "frown"); bub("か、かたい…", 350, 196, 800); await wait(800);

    // 3) 回し車で勢いをつけて、横の棒に体当たり
    const stand = add(`<svg viewBox="0 0 230 140"><path d="M115 10L40 135M115 10L190 135" stroke="#8a6a3a" stroke-width="12" stroke-linecap="round"/></svg>`, "left:470px;top:262px;width:230px;height:126px;z-index:4", cg);
    const wheel = add(`<svg viewBox="-110 -110 220 220">${wheelSVG()}</svg>`, "left:470px;top:150px;width:230px;height:230px;z-index:5", cg);
    anim(wheel, [{ transform: "scale(0) rotate(-90deg)" }, { transform: "none" }], 300, { easing: "cubic-bezier(.3,1.6,.5,1)", fill: "none" });
    face(P, "brows", "open");
    await mv(P, 585, 366, 520, { arc: 120, k: .78 });
    act(P, "run"); face(P, "brows", "grit", "sweat");
    const sp = wheel.animate([{ transform: "rotate(0)" }, { transform: "rotate(360deg)" }], { duration: 800, iterations: Infinity });
    const tx = big("ブォォォン!!", 590, 118, { size: 48, fill: "white" });
    for (let i = 0; i < 12; i++) { sp.playbackRate = 1 + i * .6; if (i % 3 === 0) puff(585, 372, 2); await wait(95); }
    g.set(44); tx.remove();
    act(P, ""); sp.playbackRate = 9; face(P, "white", "yell");
    poseSet(P, "none", "50% 60%"); pose(P, "rotate(-720deg)", 400, { easing: "linear" });
    await mv(P, 318, 330, 400, { arc: 150, k: .9 });
    impact(300, 268); quake(380, 12); big("ドガッ!!", 260, 190, { size: 60, fill: "red", ms: 800 });
    bars.slice(0, 6).forEach((b, i) => anim(b, [{ transform: "none" }, { transform: `translateX(${-16 + i * 2.4}px) rotate(${-4 + i * .6}deg)` }], 140));
    poseSet(P, "none"); face(P, "dizzy", "open"); let sr = stars(P);
    await mv(P, 340, 394, 260, { k: 1 });
    anim(wheel, [{ opacity: 1 }, { opacity: 0, transform: "translate(30px,40px) rotate(30deg)" }], 500); anim(stand, [{ opacity: 1 }, { opacity: 0 }], 500);
    g.set(Math.round(rnd(52, 62)));
    await wait(650); sr.remove(); wheel.remove(); stand.remove();

    // 4) 気合いため (予告の色)
    face(P, "brows", "grit");
    await mv(P, 480, 394, 420, { arc: 30 });
    const au = aura(480, 300, 380, col, cg, 5);
    pose(P, "scale(1.12,.86)", 300);
    kids.forEach(k => { act(k, "cheer"); face(k, "happy", "open"); });
    bub("パパ! パパ!", 340, 300, 1300); bub("がんばれー!", 640, 300, 1300);
    big("気合い", 480, 150, { size: 78, fill: col, ms: 1300 });
    const kv = every(110, () => kira(rnd(380, 580), rnd(180, 380), sparkCol(col), rnd(30, 60)));
    const gv = r === "big" ? (Math.random() < .7 ? 100 : Math.round(rnd(88, 98))) : r === "mid" ? Math.round(rnd(72, 96)) : Math.round(rnd(38, 86));
    g.set(gv, col); note(`脱出ゲージ: ${gv >= 100 ? "MAX (大当たりだけ)" : gv + "%"}`);
    await wait(1400); clearInterval(kv);

    // 5) 決め: 最後の体当たり (PUSH)
    await cutin("最後の体当たり!!", col);
    await push(1500);
    au.remove(); face(P, "brows", "yell"); pose(P, "none", 80);
    await mv(P, 480, 430, 190, { k: 1.55, ease: "ease-in" });
    flash("#fff", 320); quake(520, 14); impact(480, 280, col === "rainbow" ? "#fff" : CH_HEX[col], 320);
    big("ドォン!!", 480, 150, { size: 110, fill: col === "rainbow" ? "rainbow" : "white", ms: 420 });
    await wait(450);

    // 6) 結果 → 出られた家族が走り出す
    if (r === "big") {
      bits(565, 284, 28, { colors: ["#ffe14d", "#fff", sparkCol(col)], min: 6, max: 16, dmin: 90, dmax: 280, grav: 140, z: 30 }); lock.remove();
      anim(door, [{ transform: "none", opacity: 1 }, { transform: "translate(-30px,70px) scale(2.6) rotate(-28deg)", opacity: 0 }], 520, { easing: "ease-in" });
      bars.forEach(b => { const bx = b.offsetLeft + b.offsetWidth / 2 - 480; anim(b, [{ opacity: 1 }, { transform: `translate(${bx * rnd(1.4, 2.6)}px,${rnd(-260, 100)}px) rotate(${rnd(-170, 170)}deg)`, opacity: 0 }], rnd(450, 750)); });
      for (const e of [sign, handle]) anim(e, [{ opacity: 1 }, { transform: `translate(${rnd(-60, 60)}px,-220px) rotate(${rnd(-200, 200)}deg)`, opacity: 0 }], 600);
      flash("#ffe680", 420, .8);
      mv(P, 480, 400, 260, { k: 1.1 }); face(P, "happy", "yell");
      kids.forEach(k => { act(k, "cheer"); face(k, "happy", "open"); });
      big("全員脱出!!", 480, 112, { size: 90, fill: "rainbow", ms: 1500 });
      g.set(100, "rainbow"); note("結果: 檻ごと吹き飛んだ → 全員");
      await wait(1000);
      [...eyes, back].forEach(e => anim(e, [{ opacity: 1 }, { opacity: 0, transform: "scale(1.3)" }], 400));
      leapOut([...kids, P]); await wait(520); flash("#fff", 240);
    } else if (r === "mid") {
      anim(lock, [{ transform: "none" }, { transform: "translate(40px,180px) rotate(220deg)", opacity: .3 }], 640, { easing: "ease-in" });
      big("ガチャッ", 610, 230, { size: 34, fill: "white", ms: 600 });
      anim(door, [{ transform: "perspective(700px) rotateY(0)" }, { transform: "perspective(700px) rotateY(58deg)" }], 460, { easing: "cubic-bezier(.3,1.6,.5,1)" });
      mv(P, 480, 400, 260, { k: 1.05 }); face(P, "brows", "yell"); bub("今のうちだ!!", 480, 160, 900);
      big("半分いける!!", 480, 112, { size: 76, fill: "gold", ms: 1300 });
      kids.slice(0, 4).forEach(k => { act(k, "cheer"); face(k, "happy", "open"); });
      kids.slice(4).forEach(k => { act(k, "trem"); face(k, "white", "sweat"); });
      note("結果: 扉が半分開いた → 半分");
      await wait(950);
      leapOut([...kids.slice(0, 4), P]); await wait(480); flash("#fff", 240);
    } else {
      face(P, "dizzy", "open"); poseSet(P, "none", "50% 55%"); pose(P, "rotate(-100deg)", 380);
      await mv(P, 470, 384, 380, { k: .95, arc: 110 });
      quake(200, 5); puff(470, 392, 5); sr = stars(P);
      kira(565, 280, "#fff", 70); big("ガチッ", 610, 230, { size: 32, fill: "silver", ms: 700 });
      big("ビクともしない…", 480, 112, { size: 52, fill: "silver", ms: 1500 });
      note(`結果: 扉はびくともしない → ${missN}匹だけ`);
      kids.forEach(k => { act(k, "trem"); face(k, "white", "sweat"); });
      await wait(900);
      for (const k of kids.slice(0, missN)) { // 棒のすき間から、むにゅっと抜け出す
        face(k, "brows", "grit"); act(k, ""); poseSet(k, "none");
        pose(k, "scale(.4,1.08)", 160); await mv(k, k.px, 432, 260);
        k.style.zIndex = 12; pose(k, "none", 140, { easing: "cubic-bezier(.3,1.8,.5,1)" });
        big("ぷにっ", k.px, 336, { size: 28, fill: "white", ms: 500 });
        face(k, "white", "sweat"); await wait(220);
        act(k, "run"); mv(k, 1010, 470, 650, { ease: "ease-in" });
        await wait(250);
      }
      await wait(650);
    }
    await ending(r, { missN, onMiss: () => {
      sr.remove(); poseSet(P, "none"); mv(P, 480, 394, 300, { k: 1 }); face(P, "sad", "stream", "frown"); act(P, "trem");
      bub("みんな…ごめんよ…", 480, 196, 2000);
      kids.slice(missN).forEach(k => face(k, "shut", "stream"));
    } });
  },

  // ===== P02 回し車でシャッターを上げろ =====
  // 子どもたちは右上の「こども部屋」に閉じこめられている。親が回し車を回すほど鎖が巻かれてシャッターが上がる。
  // 全開なら全員 / 途中で止まれば半分 / 回しすぎて親が放り出され、シャッターが落ちたら下のすき間から1〜2匹。
  async wheel(r) {
    const col = lotColor(r), missN = Math.random() < .7 ? 2 : 1;
    note(`回し車の光: ${CH_NAME[col]}`);
    add(`<div></div>`, "left:120px;top:472px;width:340px;height:44px;border-radius:50%;background:radial-gradient(closest-side,#000a,#0000);z-index:1"); // 回し車の影
    reach(r);
    // こども部屋 (右上) とシャッター
    const room = add(`<div></div>`, "left:610px;top:52px;width:310px;height:210px;background:radial-gradient(ellipse at 50% 100%,#3a2a1a,#0d0805 70%);border:10px solid #8a6a44;border-top:0;overflow:hidden;z-index:3;box-shadow:0 0 0 3px #2a1a0c");
    const eyes = Array.from({ length: 26 }, () => add(`<div class=eyes><i></i><i></i></div>`, `left:${rnd(10, 260)}px;top:${rnd(16, 110)}px;animation-delay:-${rnd(0, 3).toFixed(2)}s;opacity:${rnd(.45, 1).toFixed(2)}`, room));
    const kids = [[42, 200, 70], [96, 202, 62], [150, 200, 74], [204, 202, 64], [256, 200, 70]].map(([x, y, h], i) => { const k = ham(x, y, h, { parent: room, z: 3, tint: (i % 3) + 1 }); face(k, "white", "sweat"); act(k, "trem"); return k; });
    const sh = add(`<div class=shutter></div>`, "left:0;top:0;width:100%;height:100%;z-index:5", room);
    add(`<div></div>`, "left:598px;top:22px;width:334px;height:38px;background:linear-gradient(#cfd6e0,#7a8596);border:3px solid #262b36;border-radius:8px;z-index:6");
    add(`<div>こども部屋</div>`, "left:765px;top:25px;translate:-50% 0;font-size:21px;color:#26303c;z-index:7");
    const pc = add(`<div class=lab>シャッター 0%</div>`, "left:640px;top:272px;z-index:7");
    let cur = 0;
    const setSh = (p, ms = 500) => { anim(sh, [{ transform: `translateY(${-cur}%)` }, { transform: `translateY(${-p}%)` }], ms, { easing: "cubic-bezier(.3,1.3,.5,1)" }); cur = p; pc.textContent = `シャッター ${Math.round(p)}%`; };
    // 回し車と鎖
    const wcx = 290, wcy = 318;
    add(`<svg viewBox="0 0 300 200"><path d="M150 10L50 195M150 10L250 195" stroke="#a07840" stroke-width="16" stroke-linecap="round"/></svg>`, `left:${wcx - 150}px;top:${wcy}px;width:300px;height:176px;z-index:3`);
    const wh = add(`<svg viewBox="-110 -110 220 220">${wheelSVG()}</svg>`, `left:${wcx - 150}px;top:${wcy - 150}px;width:300px;height:300px;z-index:4`);
    const chs = add(`<svg viewBox="0 0 960 540"><path d="M${wcx} ${wcy}L590 40L640 40" fill="none" stroke="#c9d1dc" stroke-width="6" stroke-dasharray="10 6"/><circle cx="590" cy="40" r="14" fill="#7a8596" stroke="#262b36" stroke-width="3"/></svg>`, "left:0;top:0;width:960px;height:540px;z-index:2");
    const chain = chs.querySelector("path");
    const P = ham(560, 490, 150, { z: 8 }); face(P, "brows");

    // 1) 導入
    big("シャッターを上げろ!!", 300, 80, { size: 50, fill: "gold", ms: 1500 });
    await wait(500);
    bub("パパー! あけてー!", 765, 362, 1300);
    face(P, "brows", "grit"); await wait(500); bub("まかせろ!", 560, 320, 900);
    await wait(900);
    face(P, "brows", "open");
    await mv(P, wcx, 444, 520, { arc: 130 });
    act(P, "run"); face(P, "brows", "grit");
    const spin = wh.animate([{ transform: "rotate(0)" }, { transform: "rotate(360deg)" }], { duration: 900, iterations: Infinity });
    const cha = chain.animate([{ strokeDashoffset: 0 }, { strokeDashoffset: -32 }], { duration: 400, iterations: Infinity });
    const speed = v => { spin.playbackRate = v; cha.playbackRate = v; };
    // 2) 3段階で速くなる (3段目で予告の色)
    big("ガラ…ガラ…", 765, 316, { size: 30, fill: "white", ms: 900 }); setSh(12);
    await wait(1100);
    speed(2.2); face(P, "brows", "open", "sweat"); bub("ゼェ…ゼェ…", wcx, 250, 900); setSh(27);
    kids.forEach(k => face(k, "white", "open"));
    await wait(1100);
    speed(3.6); wh.style.filter = `drop-shadow(0 0 12px ${sparkCol(col)}) drop-shadow(0 0 26px ${sparkCol(col)})`;
    big("まだまだぁ!!", 300, 110, { size: 62, fill: col, ms: 1200 });
    const kv = every(90, () => kira(wcx + rnd(-150, 150), wcy + rnd(-150, 150), sparkCol(col), rnd(26, 50)));
    setSh(r === "miss" ? 34 : 42); kids.forEach(k => { act(k, "cheer"); face(k, "happy", "open"); });
    await wait(1200); clearInterval(kv);
    // 3) 決め: 全力疾走 (PUSH)
    await cutin("全力疾走!!", col);
    await push(1500);
    speed(9); face(P, "brows", "yell"); P.b.style.filter = "blur(1.5px)";
    const fire = add(`<div class=pulse></div>`, `left:${wcx - 172}px;top:${wcy - 172}px;width:344px;height:344px;border-radius:50%;z-index:3;background:radial-gradient(circle,#fff0 54%,#ffb43c 61%,#ff5a1a 67%,#ff5a1a00 76%)`);
    quake(700, 5); big("うおおおお!!", 300, 110, { size: 54, fill: "red", ms: 800 });
    for (let i = 0; i < 8; i++) { puff(wcx + rnd(-60, 60), 474, 2, "#ffcf99"); await wait(80); }
    fire.remove(); P.b.style.filter = "";
    // 4) 結果
    const out = n => kids.slice(0, n).map(k => free(k, 610 + 10, 52)); // 部屋の外に出し直す
    if (r === "big") {
      flash("#fff", 300); quake(500, 12);
      anim(sh, [{ transform: `translateY(${-cur}%)` }, { transform: "translateY(-160%)" }], 300, { easing: "ease-in" }); pc.textContent = "シャッター 100%";
      big("ガシャーン!!", 765, 150, { size: 52, fill: "white", ms: 800 });
      room.style.background = "radial-gradient(ellipse at 50% 80%,#fffbe0,#ffd36b 50%,#c07a20)"; eyes.forEach(e => e.remove());
      speed(1.5); act(P, "cheer"); face(P, "happy", "yell");
      kids.forEach(k => { act(k, "cheer"); face(k, "happy", "open"); });
      big("シャッター全開!!", 380, 150, { size: 76, fill: "rainbow", ms: 1500 }); note("結果: シャッター全開 → 全員");
      await wait(1000);
      leapOut([...out(5), P]); await wait(520); flash("#fff", 240);
    } else if (r === "mid") {
      setSh(55, 400); await wait(380); quake(260, 7); big("ガコン!", 765, 150, { size: 44, fill: "white", ms: 700 });
      anim(sh, [-6, 6, -4, 3, 0].map(x => ({ transform: `translate(${x}px,-55%)` })), 300, { easing: "linear" });
      speed(1); act(P, ""); face(P, "brows", "yell"); bub("半分でも行けー!!", wcx, 250, 1000);
      big("半分開いた!", 360, 150, { size: 72, fill: "gold", ms: 1400 }); note("結果: シャッターが途中で止まった → 半分");
      kids.slice(0, 3).forEach(k => { act(k, "cheer"); face(k, "happy", "open"); });
      await wait(950);
      leapOut([...out(3), P]); await wait(480); flash("#fff", 240);
    } else {
      speed(12); act(P, ""); face(P, "white", "yell"); poseSet(P, "none", "50% 55%"); pose(P, "rotate(1080deg)", 600, { easing: "linear" });
      await mv(P, 480, 330, 600, { arc: 120, k: 2.6 }); // 放り出されて画面にベチッ
      poseSet(P, "scale(1.3,.8)", "50% 50%"); face(P, "shut", "grit", "sweat"); flash("#fff", 200, .6); quake(300, 10);
      big("ベチッ!!", 480, 120, { size: 70, fill: "white", ms: 700 });
      setSh(0, 160); speed(.3); big("ガシャン", 765, 150, { size: 40, fill: "silver", ms: 700 }); kids.forEach(k => { act(k, "trem"); face(k, "white", "sweat"); });
      await wait(500);
      mv(P, 480, 1000, 1100, { ease: "ease-in" }).then(() => P.remove()); // 画面からずり落ちて消える
      big("…しまった", 380, 220, { size: 50, fill: "silver", ms: 1400 }); note(`結果: 親が放り出された → ${missN}匹だけ`);
      await wait(700);
      for (let i = 0; i < missN; i++) { // シャッターの下から、むにゅっと出てくる
        const k = ham(700 + i * 90, 270, 64, { z: 9, tint: i + 2 }); face(k, "brows", "grit"); poseSet(k, "scale(1.6,.25)");
        pose(k, "none", 260, { easing: "cubic-bezier(.3,1.8,.5,1)" }); big("むにゅっ", 700 + i * 90, 210, { size: 26, fill: "white", ms: 500 });
        await wait(300); face(k, "white", "sweat"); act(k, "run");
        mv(k, 990, 490, 700, { arc: 60 }); await wait(250);
      }
      await wait(700);
    }
    await ending(r, { missN, onMiss: () => {
      const q = ham(330, 490, 150, { z: 9 }); face(q, "sad", "stream", "frown"); act(q, "trem");
      anim(q, [{ transform: "translateY(200px)" }, { transform: "none" }], 400); bub("ごめんよぉ…", 330, 320, 1800);
    } });
  },

  // ===== P03 トランポリンでボタンを押せ =====
  // 子どもたちは高い棚の上の檻。親がトランポリンで跳ぶたびに STEP が上がる (ステップアップ予告)。
  // 最後の大ジャンプでボタンを頭で押せば全員 / かすれば半分 / 棚にぶつかったら1〜2匹だけ落ちてくる。
  async jump(r) {
    const top = r === "big" ? wpick([0, 0, 0, 10, 60, 30]) : r === "mid" ? wpick([0, 0, 0, 45, 55, 0]) : wpick([0, 0, 40, 45, 15, 0]);
    const SC = ["", "blue", "green", "red", "gold", "rainbow"], col = SC[top], missN = Math.random() < .7 ? 2 : 1;
    note(`STEP ${top} まで (${CH_NAME[col]})`);
    add(`<div></div>`, "left:210px;top:454px;width:340px;height:40px;border-radius:50%;background:radial-gradient(closest-side,#000a,#0000);z-index:1"); // トランポリンの影
    reach(r);
    // 棚と檻 (右上)
    add(`<div></div>`, "left:590px;top:118px;width:370px;height:22px;background:linear-gradient(#c08a52,#8a5a2c);border:3px solid #4a2c12;z-index:4");
    add(`<svg viewBox="0 0 60 60"><path d="M0 0H60L0 60Z" fill="#8a5a2c" stroke="#4a2c12" stroke-width="4"/></svg>`, "left:900px;top:140px;width:60px;height:60px;z-index:3;transform:scaleX(-1)");
    const cage = add(`<div></div>`, "left:690px;top:6px;width:250px;height:114px;z-index:3;transform-origin:50% 100%");
    add(`<div></div>`, "left:0;top:0;width:250px;height:110px;background:linear-gradient(#2a2030,#4a3a40);border-radius:6px", cage);
    const kids = [[66, 108, 50], [104, 108, 46], [142, 108, 52], [180, 108, 46], [218, 108, 50], [86, 84, 40], [160, 84, 42]].map(([x, y, h], i) => { const k = ham(x, y, h, { parent: cage, z: y > 100 ? 3 : 2, tint: (i % 3) + 1 }); face(k, "white", "sweat"); act(k, "trem"); return k; });
    for (let x = 52; x < 250; x += 16) add(`<div class=bar></div>`, `left:${x}px;top:0;width:5px;height:110px;z-index:5`, cage);
    add(`<div class=rail></div>`, "left:-4px;top:-6px;width:258px;height:12px;z-index:6", cage);
    add(`<div class=rail></div>`, "left:-4px;top:104px;width:258px;height:10px;z-index:6", cage);
    const door = add(`<div class=door>${[8, 22].map(x => `<div class=bar style="left:${x}px;top:0;width:5px;height:100%"></div>`).join("")}</div>`, "left:0;top:6px;width:48px;height:98px;z-index:6", cage);
    const btn = add(`<div class=btn>ひらく</div>`, "left:608px;top:140px;width:70px;height:36px;z-index:5");
    add(`<svg viewBox="0 0 100 40"><path d="M50 4V22" stroke="#4a2c12" stroke-width="5"/><path d="M50 22H100" stroke="#4a2c12" stroke-width="5" stroke-dasharray="6 5"/></svg>`, "left:640px;top:104px;width:100px;height:40px;z-index:2");
    // 高さのものさしと STEP
    const STEPY = [0, 296, 256, 218, 182, 148]; // 頭のてっぺんが届く高さ (ボタンの下は 176)
    add(`<div></div>`, "left:52px;top:140px;width:10px;height:330px;background:#fff9;border:2px solid #7a5a3a;border-radius:5px;z-index:2");
    const tags = STEPY.map((y, i) => i && add(`<div class="step ${SC[i] === "rainbow" ? "rbg" : ""}">STEP${i}</div>`, `left:70px;top:${y - 13}px;z-index:2;opacity:.3;${SC[i] === "rainbow" ? "" : `background:${CH_HEX[SC[i]]}`}`));
    // トランポリン
    const tx = 380, ty = 450;
    add(`<svg viewBox="0 0 300 60"><path d="M30 0L10 56M270 0L290 56M150 0V56" stroke="#2a3a5a" stroke-width="10" stroke-linecap="round"/></svg>`, `left:${tx - 150}px;top:${ty - 4}px;width:300px;height:26px;z-index:4`);
    const mat = add(`<div></div>`, `left:${tx - 140}px;top:${ty - 16}px;width:280px;height:34px;border-radius:50%;background:radial-gradient(#3a3a4a,#16161e);border:8px solid #2a6ad8;z-index:5`);
    const P = ham(tx, ty - 2, 104, { z: 7 }); face(P, "brows");
    const dip = (k = 1) => { anim(mat, [{ transform: "none" }, { transform: `translateY(${10 * k}px) scaleY(${1 - .4 * k})` }, { transform: "none" }], 280, { fill: "none" }); };
    const hopTo = async (topY, ms, flips = 0) => { // 頭のてっぺんが topY に届くまで跳ぶ
      pose(P, "scale(1.18,.8)", 90); dip(); await wait(90);
      pose(P, "scale(.9,1.12)", 120);
      if (flips) { poseSet(P, "none", "50% 50%"); pose(P, `rotate(${-360 * flips}deg)`, ms * .9, { easing: "ease-in-out" }); }
      await mv(P, tx, topY + P.h, ms / 2, { ease: "cubic-bezier(.2,.8,.4,1)" });
      await mv(P, tx, ty - 2, ms / 2, { ease: "cubic-bezier(.6,0,.8,.4)" });
      poseSet(P, "scale(1.15,.84)"); dip(); pose(P, "none", 160);
    };

    // 1) 導入
    big("ボタンを押して 家族を出せ!!", 520, 250, { size: 44, fill: "gold", ms: 1500 });
    bub("パパー!", 640, 76, 1200);
    await wait(700); face(P, "brows", "grit"); pose(P, "scale(.9,1.15)", 200); await wait(250); pose(P, "none", 200); await wait(500);
    // 2) STEP が上がっていく
    for (let i = 1; i <= top; i++) {
      tags[i].style.opacity = 1; anim(tags[i], [{ transform: "scale(1.6)" }, { transform: "none" }], 220, { fill: "none" });
      big(`STEP${i}`, 200, STEPY[i], { size: 40 + i * 4, fill: SC[i], ms: 650 });
      if (i === 5) { flash("#fff", 300); big("確定!?", 480, 330, { size: 60, fill: "rainbow", ms: 900 }); }
      if (i >= 3) face(P, "brows", "yell");
      await hopTo(STEPY[i], 640 + i * 30, i >= 4 ? 2 : i === 3 ? 1 : 0);
      if (i === 3) kids.forEach(k => { act(k, "cheer"); face(k, "happy", "open"); });
    }
    if (top < 5) { pose(P, "rotate(-12deg)", 120); big("グラッ…", tx, 300, { size: 34, fill: "white", ms: 600 }); await wait(420); pose(P, "none", 150); }
    // 3) 決め: 大ジャンプ (PUSH)
    await cutin("大ジャンプ!!", col);
    await push(1500);
    face(P, "brows", "yell"); pose(P, "scale(1.3,.62)", 260); anim(mat, [{ transform: "none" }, { transform: "translateY(16px) scaleY(.4)" }], 260); await wait(280);
    anim(mat, [{ transform: "translateY(16px) scaleY(.4)" }, { transform: "none" }], 200); pose(P, "scale(.85,1.2)", 120);
    // 4) 結果
    if (r === "big") {
      await mv(P, 643, 280, 360, { ease: "cubic-bezier(.2,.8,.4,1)" }); pose(P, "none", 80);
      impact(643, 176, "#ffe14d", 260); flash("#fff", 260); quake(400, 9);
      anim(btn, [{ transform: "none" }, { transform: "translateY(-12px) scaleY(.5)" }], 120); btn.style.filter = "brightness(1.6)";
      big("ポチッ!!", 643, 240, { size: 56, fill: "red", ms: 900 });
      anim(door, [{ transform: "none" }, { transform: "perspective(500px) rotateY(-80deg)" }], 380, { easing: "cubic-bezier(.3,1.6,.5,1)" });
      kids.forEach(k => { act(k, "cheer"); face(k, "happy", "open"); });
      mv(P, tx, ty - 2, 420, { arc: 40, ease: "ease-in" }); face(P, "happy", "yell"); act(P, "cheer");
      big("全員脱出!!", 430, 270, { size: 90, fill: "rainbow", ms: 1500 }); note("結果: ボタンを頭で押した → 全員");
      await wait(1000);
      leapOut([...kids.map(k => free(k, 690, 6)), P]); await wait(520); flash("#fff", 240);
    } else if (r === "mid") {
      await mv(P, 628, 302, 360, { ease: "cubic-bezier(.2,.8,.4,1)" }); pose(P, "rotate(12deg)", 100);
      kira(640, 182, "#fff", 60); anim(btn, [{ transform: "none" }, { transform: "translateY(-5px) scaleY(.8)" }], 120);
      big("カチ…", 660, 230, { size: 40, fill: "white", ms: 800 });
      anim(door, [{ transform: "none" }, { transform: "perspective(500px) rotateY(-42deg)" }], 600, { easing: "ease-out" });
      mv(P, tx, ty - 2, 420, { arc: 30, ease: "ease-in" }); pose(P, "none", 200); face(P, "brows", "yell");
      big("半分ひらいた!", 430, 270, { size: 72, fill: "gold", ms: 1400 }); note("結果: ボタンをかすった → 半分");
      kids.slice(0, 4).forEach(k => { act(k, "cheer"); face(k, "happy", "open"); });
      await wait(950);
      leapOut([...kids.slice(0, 4).map(k => free(k, 690, 6)), P]); await wait(480); flash("#fff", 240);
    } else {
      await mv(P, 602, 248, 360, { ease: "cubic-bezier(.2,.8,.4,1)" });
      impact(602, 140, "#fff", 200); quake(380, 10); face(P, "dizzy", "yell"); big("ゴン!!", 560, 190, { size: 60, fill: "white", ms: 800 });
      anim(cage, [0, -5, 4, -3, 2, 0].map(d => ({ transform: `rotate(${d}deg)` })), 600, { easing: "linear" });
      poseSet(P, "none", "50% 50%"); pose(P, "rotate(-540deg)", 700, { easing: "linear" });
      await mv(P, 560, 470, 700, { arc: 30, ease: "ease-in" });
      poseSet(P, "rotate(-90deg)", "50% 50%"); puff(560, 470, 5); const sr = stars(P);
      big("届かない…", 430, 270, { size: 52, fill: "silver", ms: 1500 }); note(`結果: 棚にぶつかった → ${missN}匹だけ`);
      kids.forEach(k => { act(k, "trem"); face(k, "white", "sweat"); });
      await wait(700);
      for (const k of kids.slice(0, missN).map(k => free(k, 690, 6))) { // 檻のすき間からこぼれ落ちる
        pose(k, "scale(.5,1.1)", 120); await mv(k, k.px, 148, 220); pose(k, "none", 120);
        big("ぽてっ", k.px, 90, { size: 26, fill: "white", ms: 500 }); act(k, "run");
        mv(k, 1000, 160, 600, { ease: "ease-in" }); await wait(260);
      }
      await wait(650);
      return ending(r, { missN, onMiss: () => { sr.remove(); poseSet(P, "none"); face(P, "sad", "stream", "frown"); act(P, "trem"); bub("届かなかった…", 560, 330, 1800); } });
    }
    await ending(r, { missN });
  },

  // ===== P00 結末だけ (タイミングの確認用) =====
  async only(r) {
    reach(r);
    add(`<div class=lab>家族ラッシュ (結末だけ)</div>`, "left:480px;top:240px;translate:-50% -50%;font-size:30px;color:#cfe0ff;z-index:2");
    add(`<div class=lab>今回: ${RES[r]}</div>`, "left:480px;top:292px;translate:-50% -50%;font-size:24px;color:#ffd23c;z-index:2");
    await wait(1300);
    await ending(r, { missN: Math.random() < .7 ? 2 : 1 });
  },
});
