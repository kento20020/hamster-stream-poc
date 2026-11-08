// 配信ハム PoC 第2弾。poc.js の部品を使い、scenes に足す。
const bubble = (txt, x, y, ms = 1100) => {
  const b = add(`<div class=bub>${txt}</div>`, `left:${x}px;top:${y}px;translate:-50% 0`);
  anim(b, [{ transform: "scale(.3)" }, { transform: "none" }], 170);
  if (ms) wait(ms).then(() => b.remove());
  return b;
};
const walk = (h, x0, x1, ms = 700, n = 4) => anim(h, Array.from({ length: n * 2 + 1 }, (_, i) =>
  ({ transform: `translate(${x0 + (x1 - x0) * i / (n * 2)}px,${i % 2 ? -14 : 0}px)` })), ms, { easing: "linear" });
const flash = (x0 = 560, x1 = 940, y0 = 240, y1 = 520, col = "#fff") => {
  const f = add(`<div>✦</div>`, `left:${rnd(x0, x1)}px;top:${rnd(y0, y1)}px;font-size:${rnd(50, 100)}px;color:${col};z-index:28;text-shadow:0 0 18px ${col}`);
  anim(f, [{ transform: "scale(.2)", opacity: 1 }, { transform: "scale(1.1)", opacity: 1, offset: .4 }, { transform: "scale(.4)", opacity: 0 }], 280).then(() => f.remove());
};
const crumb = (x, y) => {
  const c = add(`<div></div>`, `left:${x}px;top:${y}px;width:${rnd(6, 14)}px;height:${rnd(6, 14)}px;background:${["#7fb4d8", "#d6e6ee", "#7a8a6a"][Math.floor(rnd(0, 3))]};z-index:20`);
  anim(c, [{ transform: "none" }, { transform: `translate(${rnd(-60, 60)}px,${rnd(-70, -20)}px) rotate(200deg)`, offset: .4 },
    { transform: `translate(${rnd(-90, 90)}px,${rnd(60, 160)}px) rotate(500deg)`, opacity: 0 }], 550).then(() => c.remove());
};
// 動かせるゲーム画面 (投げ飛ばす、傾ける、縮めるなどに使う)
const gameBg = () => add(`<div></div>`, "left:0;top:0;width:960px;height:540px;z-index:1;background:#171d2c url(ow_bg.png) center/cover");

Object.assign(scenes, {
  async retire() { // 引退会見ハム
    const h = ham(N), n = add(`<div class=lab>本日の引退 0回</div>`, "right:16px;top:16px");
    const rounds = [
      ["引退します", "今の心境は?", "種も喉を通りません", "復帰します"],
      ["今度こそ引退します", "前回の引退は?", "あれは練習です", "復帰しました"],
      ["本当に最後です", "3回目ですが?", "数えないでください", "ファンの声に応えて"],
    ];
    for (let i = 0; i < rounds.length; i++) {
      const [a, q, ans, back] = rounds[i];
      await wait(1000); chip("やらかし"); shake(h); await wait(350);
      const set = [
        add(`<div><div style="left:0;right:0;top:4px;text-align:center;font-size:30px;color:#ffe066">緊急 引退会見</div></div>`, `left:${HX - 120}px;top:${HY - 74}px;width:${HW + 136}px;height:${HH + 80}px;background:linear-gradient(#1c3a6e,#12264a);border:4px solid #c9a227;z-index:5`),
        add(`<div></div>`, `left:${HX - 120}px;top:${HY + 150}px;width:${HW + 136}px;height:90px;background:#fff;border:4px solid ${INK};z-index:12`),
        add(`<svg viewBox="0 0 120 50"><path d="M20 50V16M60 50V12M100 50V16" stroke=#222 stroke-width=6 /><circle cx=20 cy=12 r=11 fill=#222 /><circle cx=60 cy=9 r=11 fill=#555 /><circle cx=100 cy=12 r=11 fill=#222 /></svg>`, `left:${HX + 49}px;top:${HY + 108}px;width:120px;height:50px;z-index:13`),
      ];
      const eyes = ov(h, closedEyes + tears);
      say(a, 320, 190, { size: 54, color: "#fff", ms: 1500 }); n.textContent = `本日の引退 ${i + 1}回`;
      await anim(h, [{ transform: "none" }, { transform: "translateY(26px) scaleY(.8)" }], 350);
      const fl = setInterval(flash, 130); await wait(1300); clearInterval(fl);
      anim(h, [{ transform: "translateY(26px) scaleY(.8)" }, { transform: "none" }], 250);
      bubble("記者「" + q + "」", 320, 270, 1500); await wait(800); bubble(ans, 470, 345, 1000); await wait(1100);
      chip("次の試合"); set.forEach(e => e.remove()); eyes.remove(); hop(h, 60);
      say(back, 440, 240, { size: 56, color: "#7dff8a", ms: 1000 }); await wait(1100);
    }
    await wait(500);
  },

  async flee() { // 夜逃げハム
    const h = ham(N);
    await wait(900); chip("ランクダウン"); say("ランク降格…", 440, 230, { color: "#9db4d8", size: 56, ms: 1000 }); shake(h); await wait(1100);
    const night = add(`<div><div style="left:120px;top:60px;width:84px;height:84px;border-radius:50%;background:#ffe9a8;box-shadow:0 0 30px #ffe9a8"></div></div>`, "left:0;top:0;width:960px;height:540px;background:#050a1ee8;z-index:8");
    await anim(night, [{ opacity: 0 }, { opacity: 1 }], 450);
    say("今だ…", 560, 250, { color: "#cfe0ff", size: 40, ms: 700 });
    await anim(h, [0, -7, 7, -7, 7, 0].map(d => ({ transform: `rotate(${d}deg)` })), 800, { easing: "linear" });
    const pack = ov(h, `<circle cx=1040 cy=350 r=270 fill=#2e7d4f stroke=${INK} stroke-width=15 /><path d="M880 230q60 60 130 0M1060 460q60-60 130 0M1090 240q50 50 110 0" fill=none stroke=#fff stroke-width=14 stroke-linecap=round />`); h.prepend(pack);
    const strap = ov(h, `<path d="M1060 560Q860 800 600 790M160 560Q340 800 600 790" fill=none stroke=#2e7d4f stroke-width=52 stroke-linecap=round /><ellipse cx=600 cy=795 rx=70 ry=52 fill=#2e7d4f stroke=${INK} stroke-width=12 />`);
    hop(h, 30); bubble("お世話になりました", 640, 240, 900); await wait(1000);
    await walk(h, 0, 300, 900, 5);
    const letter = add(`<div><div style="left:58px;top:18px;writing-mode:vertical-rl;font-size:27px;color:${INK};letter-spacing:3px;white-space:nowrap">探さないでください</div><div style="left:14px;bottom:16px;writing-mode:vertical-rl;font-size:20px;color:${INK};white-space:nowrap">ハムより</div></div>`,
      `left:770px;top:210px;width:130px;height:310px;rotate:-3deg;background:#fff8e6;border:3px solid ${INK};z-index:12`);
    await anim(letter, [{ transform: "translateY(-540px) rotate(8deg)" }, { transform: "none" }], 700, { easing: "ease-in" });
    const lab = add(`<div class=lab>行方不明 3分</div>`, "left:560px;top:230px");
    for (const t of ["行方不明 1時間", "行方不明 2週間"]) { await wait(800); lab.textContent = t; }
    await wait(800); chip("勝ち"); lab.remove(); pack.remove(); strap.remove();
    anim(night, [{ opacity: 1 }, { opacity: 0 }], 300);
    walk(h, 300, 0, 800, 4); await wait(420);
    anim(letter, [{ transform: "none" }, { transform: "translate(40px,120px) scale(.1) rotate(200deg)", opacity: 0 }], 260);
    await wait(420); bubble("ちょっとコンビニに", 620, 250, 1500); await wait(1600);
  },

  async flip() { // ちゃぶ台返しハム
    add(`<div><div style="left:0;top:0;width:100%;height:68%;background:#dccda8"></div>
      <div style="left:0;top:68%;width:100%;height:32%;background:repeating-linear-gradient(90deg,#b8b67a 0 6px,#aaa86c 6px 12px)"></div>
      <div style="left:0;top:66%;width:100%;height:14px;background:#7a4a28"></div>
      <div style="left:400px;top:30px;width:150px;height:270px;background:#f6f1e2;border:6px solid #5a3a20;color:#222;writing-mode:vertical-rl;font-size:64px;line-height:136px;text-align:center">忍耐</div></div>`, "left:0;top:0;width:960px;height:540px;z-index:0");
    const g = gameBg(), h = ham(N); g.style.transformOrigin = "0 100%";
    await wait(900); chip("デス ×12"); shake(h); say("……", 480, 240, { color: "#fff", ms: 800 }); await wait(900);
    chip("ブチギレ"); h.classList.add("trem");
    const face = ov(h, frown + `<text x=930 y=270 font-size=240>💢</text>`);
    say("もう…", 430, 230, { color: "#ff6a5a", size: 60, ms: 800 }); await wait(950);
    h.classList.remove("trem");
    await anim(h, [{ transform: "none" }, { transform: "scale(1.18,.72)" }], 170);
    say("やってられるかぁ!!", 400, 170, { size: 72, color: "#ff5a4a", ms: 1200, z: 40 });
    anim(h, [{ transform: "scale(1.18,.72)" }, { transform: "translateY(-70px) scale(.92,1.16)", offset: .35 }, { transform: "none" }], 700);
    for (const x of "🍵🍚🥢🍙🍵") { const e = add(`<div>${x}</div>`, `left:${rnd(520, 760)}px;top:420px;font-size:44px;z-index:20`);
      anim(e, [{ transform: "none" }, { transform: `translate(${rnd(-300, 60)}px,-${rnd(220, 360)}px) rotate(${rnd(200, 600)}deg)`, offset: .45 }, { transform: `translate(${rnd(-420, 80)}px,240px) rotate(900deg)` }], 1200).then(() => e.remove()); }
    await anim(g, [{ transform: "none" }, { transform: "rotate(-14deg)", offset: .28 }, { transform: "translate(-220px,-820px) rotate(-100deg)" }], 850, { easing: "cubic-bezier(.4,.1,.6,1)" });
    say("ハァ…ハァ…", 480, 340, { size: 44, color: "#fff", ms: 1200 });
    anim(h, [{ transform: "none" }, { transform: "scale(1.06,.94)" }, { transform: "none" }, { transform: "scale(1.06,.94)" }, { transform: "none" }], 1100, { easing: "linear" });
    await wait(1300); chip("我に返る"); face.remove();
    bubble("……すみません", 600, 250, 1100); await wait(1200);
    say("いそいそ", 360, 200, { size: 40, color: "#fff", ms: 1000 });
    walk(h, 0, -40, 1100, 5);
    await anim(g, [{ transform: "translateX(-980px)" }, { transform: "translate(-24px,8px) rotate(1.6deg)" }], 1100, { easing: "ease-in-out" });
    await wait(450); anim(h, [{ transform: "translateX(-40px)" }, { transform: "none" }], 150);
    await anim(g, [{ transform: "translate(-24px,8px) rotate(1.6deg)" }, { transform: "translate(-8px,3px) rotate(.7deg)" }], 140); await wait(380);
    hop(h, 24); await anim(g, [{ transform: "translate(-8px,3px) rotate(.7deg)" }, { transform: "none" }], 140);
    say("ヨシ", 600, 250, { size: 44, color: "#fff", ms: 800 }); await wait(1000);
  },

  async excuse() { // 言い訳ハム
    const h = ham(N); let cur;
    const lab = add(`<div class=lab>デス 0</div>`, "right:16px;top:16px");
    const hold = (txt, size) => { if (cur) cur.remove();
      cur = add(`<div><div style="left:-6px;top:-150px;width:12px;height:150px;background:#8a5a30;border:2px solid ${INK}"></div>
        <div style="right:-60px;bottom:140px;background:#fff8e6;color:#222;border:5px solid ${INK};border-radius:10px;padding:10px 18px;white-space:nowrap;font-size:${size}px">${txt}</div>
        <div style="left:-17px;top:-16px;width:34px;height:34px;border-radius:50%;background:#fbcbc3;border:4px solid ${INK}"></div></div>`, `left:${HX + 14}px;top:${HY + 160}px;width:0;height:0;z-index:12`);
      anim(cur, [{ transform: "translateY(110px) rotate(-8deg)" }, { transform: "translateY(-14px) rotate(3deg)", offset: .7 }, { transform: "none" }], 240); };
    const rows = [["正面から撃たれた", "ラグい", 42], ["屋外で撃たれた", "太陽がまぶしい", 42], ["棒立ちで撃たれた", "種を食べてた", 42], ["崖から落ちた", "重力が強い", 42], ["味方を見捨てた", "作戦です", 42],
      ["また死んだ", "僕は悪くない", 50], ["また死んだ", "僕は悪くない", 64], ["また死んだ", "僕は悪くない!!", 84]];
    for (let i = 0; i < rows.length; i++) { await wait(i < 5 ? 1150 : 800); chip("デス: " + rows[i][0]); shake(h); lab.textContent = `デス ${i + 1}`; hold(rows[i][1], rows[i][2]); }
    h.classList.add("trem"); await wait(1700);
  },

  async judge() { // 審査員ハム
    const h = ham(N);
    add(`<div>審査員</div>`, `left:${HX - 30}px;top:${HY + 176}px;width:${HW + 46}px;height:60px;background:#7a4a28;border:4px solid ${INK};text-align:center;font-size:30px;line-height:50px;z-index:13`);
    const rows = [["ナイス4キル", 2, "雑"], ["ただ歩いた", 10, "美しい…"], ["神エイムで逆転", 1, "調子に乗るな"], ["壁にぶつかった", 9, "勇気がある"], ["何もしてない", 10, "これが答えだ"]];
    for (const [ev, pt, cm] of rows) {
      await wait(700); chip(ev); say(ev, 330, 170, { size: 46, color: "#fff", ms: 1900 }); await wait(800);
      const high = pt >= 9, p = add(`<div><div style="left:62px;top:136px;width:16px;height:100px;background:#8a5a30;border:2px solid ${INK}"></div>
        <div style="left:0;top:0;width:140px;height:140px;border-radius:50%;background:#fff;border:6px solid ${INK};text-align:center;line-height:124px;font-size:${pt >= 10 ? 66 : 84}px;color:${high ? "#d48a00" : "#2a6fd0"}">${pt}<span style="position:static;font-size:26px">点</span></div></div>`,
        `left:${HX - 80}px;top:${HY - 50}px;width:140px;height:236px;z-index:12`);
      anim(p, [{ transform: "rotateY(90deg)" }, { transform: "none" }], 220);
      const e = high ? ov(h, tears) : null; if (high) hop(h, 34); else shake(h);
      await wait(350); bubble(cm, 500, 270, 1100); await wait(1200); p.remove(); if (e) e.remove();
    }
    await wait(400);
  },

  async oracle() { // 予言ハム
    const h = ham(N); let rate = 12;
    const r = add(`<div class=lab>的中率 12%</div>`, "right:16px;top:16px;font-size:28px");
    ov(h, `<path d="M360 250Q600 170 840 250L620 -190Q600 -210 580 -190Z" fill=#3a2a8a stroke=${INK} stroke-width=15 /><ellipse cx=600 cy=258 rx=300 ry=46 fill=#3a2a8a stroke=${INK} stroke-width=15 /><text x=540 y=130 font-size=120 fill=#ffe066>★</text>`);
    const ball = add(`<div></div>`, `left:${HX + 52}px;top:${HY + 112}px;width:120px;height:120px;border-radius:50%;background:radial-gradient(circle at 35% 30%,#fff,#b79bff 45%,#4a2a9a);border:4px solid ${INK};z-index:12`);
    const rows = [["見えた…次は勝ちじゃ", "負け", 0, "ふ〜ん♪"], ["見えた…次は負けじゃ", "勝ち", 0, "ふふ〜ん♪"], ["見えた…どちらかが勝つ", "勝ち", 1, "見えておった"]];
    for (const [pred, res, hit, after] of rows) {
      await wait(700); chip("試合前");
      anim(ball, [{ boxShadow: "0 0 0 #b79bff" }, { boxShadow: "0 0 46px 14px #b79bff" }, { boxShadow: "0 0 0 #b79bff" }], 1100);
      say("むむむ…", 560, 290, { size: 40, color: "#d9c8ff", ms: 900 });
      const st = setInterval(() => flash(HX + 30, HX + 150, HY + 70, HY + 190, "#d9c8ff"), 180); await wait(1100); clearInterval(st);
      bubble(pred, 470, 230, 1500); await wait(1650); chip(`試合結果: ${res}`);
      if (hit) { rate = 13; r.textContent = `的中率 ${rate}%`; say("的中!!", 460, 170, { size: 92, ms: 1200 }); rain(); hop(h, 60); await wait(1000); bubble(after, 540, 280, 1300); await wait(1500); }
      else { r.textContent = `的中率 ${--rate}%`; say("ハズレ", 460, 170, { size: 92, color: "#ff5a4a", ms: 900 }); shake(h); await wait(800);
        ball.style.zIndex = 9; await anim(ball, [{ transform: "none" }, { transform: "translate(92px,6px) scale(.7)" }], 450);
        bubble(after, 590, 300, 1000); await wait(1100); await anim(ball, [{ transform: "translate(92px,6px) scale(.7)" }, { transform: "none" }], 250); ball.style.zIndex = 12; }
    }
  },

  async roulette() { // 縛りルーレットハム
    const h = ham(N), items = ["語尾にハム", "ジャンプ禁止", "味方を褒める", "敬語のみ", "無言プレイ", "実況風"], cols = ["#d9483c", "#d98a14", "#2f86c9", "#3c9a52", "#8455c9", "#d65f97"];
    const wedges = items.map((t, i) => `<g transform="rotate(${i * 60} 200 200)"><path d="M200 200L105 35.5A190 190 0 0 1 295 35.5Z" fill=${cols[i]} stroke=#fff stroke-width=4 /><text x=200 y=26 writing-mode=vertical-rl font-size=26 font-weight=900 fill=#fff>${t}</text></g>`).join("");
    const rounds = [[0, ["右から敵が来てるハム", "ナイスハム", "もう帰りたいハム"]], [2, ["その回復、日本一です", "生まれてきてくれてありがとう", "敵も頑張ってますね"]]];
    for (const [idx, lines] of rounds) {
      await wait(800); chip("負け"); shake(h);
      const w = add(`<svg viewBox="0 0 400 400">${wedges}<circle cx=200 cy=200 r=26 fill=#fff stroke=${INK} stroke-width=6 /></svg>`, "left:170px;top:120px;width:380px;height:380px;z-index:15");
      const pin = add(`<div></div>`, "left:344px;top:98px;width:32px;height:40px;background:#e22;clip-path:polygon(0 0,100% 0,50% 100%);z-index:16");
      anim(w, [{ opacity: 0, transform: "scale(.4)" }, { opacity: 1, transform: "none" }], 220);
      say("縛りルーレット!!", 400, 60, { size: 48, ms: 1300 }); await wait(700); hop(h, 40);
      await anim(w, [{ transform: "rotate(0)" }, { transform: `rotate(${360 * 6 - idx * 60}deg)` }], 3000, { easing: "cubic-bezier(.12,.75,.2,1)" });
      say(`${items[idx]}!!`, 400, 60, { size: 62, ms: 1300, color: "#fff" }); hop(h, 30); await wait(1500);
      w.remove(); pin.remove(); chip("次の試合");
      const tag = add(`<div class=lab>縛り: ${items[idx]}</div>`, "right:16px;top:16px");
      const who = add(`<div class=lab>配信者</div>`, "left:60px;top:390px");
      for (const l of lines) { say(`「${l}」`, 370, 450, { size: 36, color: "#fff", ms: 1000 }); await wait(1150); }
      tag.remove(); who.remove();
    }
  },

  async gnaw() { // 画面かじりハム
    gameBg(); const h = ham(N), m = ov(h, openMouth), cx = 540; m.style.opacity = 0;
    // 縁は歯形のように丸くえぐれた形にする
    const poly = r => "polygon(" + Array.from({ length: 121 }, (_, i) => { const a = Math.PI * i / 120, R = r * (.88 + .14 * Math.abs(Math.sin(a * 11))); return `${cx - Math.cos(a) * R}px ${540 - Math.sin(a) * R}px`; }).join(",") + ")";
    const shelves = [370, 440, 510].map(y => `<rect x=240 y=${y + 18} width=600 height=7 fill=#4a2e18 />` + Array.from({ length: 17 }, (_, i) => `<ellipse cx=${260 + i * 34} cy=${y} rx=10 ry=16 fill=#3a3030 stroke=#eee stroke-width=2 />`).join("")).join("");
    const hole = add(`<div><div style="left:0;top:0;width:960px;height:540px;background:radial-gradient(circle at ${cx}px 540px,#5a3820,#120a05 260px);transition:clip-path .2s;clip-path:${poly(0)}"><svg viewBox="0 0 960 540" style="left:0;top:0;width:960px;height:540px">${shelves}</svg><div class=lab style="left:${cx - 50}px;top:318px">種倉庫</div></div></div>`,
      "left:0;top:0;width:960px;height:540px;z-index:5;filter:drop-shadow(0 0 1px #fff) drop-shadow(0 0 1px #fff) drop-shadow(0 -4px 5px #000a)");
    const inner = hole.firstChild; let pr = 0, ptx = 0;
    for (const [t, r] of [["5分", 70], ["20分", 130], ["1時間", 190], ["2時間", 250]]) {
      await wait(450); chip(`放置 ${t}`);
      const tx = cx + r - 30 - HX; await walk(h, ptx, tx, 420, 2); ptx = tx; m.style.opacity = 1;
      say("ガリガリ", Math.max(cx - r + 20, 130), 540 - r - 34, { size: 36, color: "#fff", ms: 800 });
      for (let k = 1; k <= 4; k++) { const R = pr + (r - pr) * k / 4; inner.style.clipPath = poly(R);
        for (let i = 0; i < 5; i++) { const a = rnd(.05, .7); crumb(cx + Math.cos(a) * R, 540 - Math.sin(a) * R); }
        await anim(h, [{ transform: `translate(${tx}px,0)` }, { transform: `translate(${tx - 8}px,0) scale(1.06,.92)` }, { transform: `translate(${tx}px,0)` }], 180, { easing: "linear" }); }
      pr = r; m.style.opacity = 0;
      if (r === 190) { const mini = add(`<img src="${N}">`, `left:${cx - 150}px;top:540px;width:90px`, inner); anim(mini, [{ transform: "none" }, { transform: "translateY(-92px)" }], 300);
        await wait(350); bubble("種、運んでおきますね", cx - 60, 390, 1100); await wait(1100); }
    }
    await wait(300); chip("配信者が気づいた"); say("!!", ptx + HX + 110, 270, { size: 76, color: "#ff5a4a", ms: 700 }); hop(h, 50); await wait(650);
    for (const d of [-13, 13]) { const tp = add(`<div></div>`, `left:${cx - 320}px;top:400px;width:640px;height:54px;rotate:${d}deg;background:linear-gradient(#d9c99a,#bfae7d);border:2px solid #8f8257;z-index:7`);
      anim(tp, [{ transform: "scale(1.5)", opacity: 0 }, { transform: "none", opacity: 1 }], 140, { easing: "ease-in" }); await wait(260); }
    say("応急処置", cx, 300, { size: 60, color: "#fff", ms: 1300 }); await wait(1400);
    chip("放置 5分"); m.style.opacity = 1; say("もぐ…", ptx + HX - 10, 330, { size: 36, color: "#fff", ms: 900 });
    for (let i = 0; i < 6; i++) crumb(cx + rnd(180, 260), rnd(380, 450));
    await wait(1200);
  },

  async empire() { // 地下帝国ハム
    gameBg(); const h = ham(N);
    await wait(800); chip("試合の合間"); say("地下帝国 進捗報告", 440, 220, { size: 54, color: "#fff", ms: 1100 }); hop(h, 50); await wait(1250);
    await anim(h, [{ transform: "none" }, { transform: "translateY(260px)" }], 260, { easing: "ease-in" });
    const w = add(`<div><div style="left:0;top:0;width:960px;height:66px;background:#9fd3ef"></div><div style="left:0;top:66px;width:960px;height:14px;background:#5da34a"></div></div>`,
      "left:0;top:0;width:960px;height:540px;background:repeating-radial-gradient(circle at 30% 40%,#6f4d30 0 9px,#65462b 9px 17px);z-index:20");
    const shaft = add(`<div></div>`, "left:466px;top:76px;width:28px;height:0;background:#2d1c10;transition:height .2s", w);
    add(`<img src="${N}">`, "left:452px;top:18px;width:56px", w);
    const lab = add(`<div class=lab>配信 第1回　人口 1匹</div>`, "right:16px;top:16px", w);
    await anim(w, [{ transform: "translateY(540px)" }, { transform: "none" }], 450);
    let pn = 0, pp = 1;
    const rooms = [[1, "寝床", "🛏️", 250, 165, 3], [12, "種倉庫", "🌻", 710, 165, 40], [48, "カラオケ", "🎤", 250, 290, 120], [96, "温泉", "♨️", 710, 290, 300], [180, "映画館", "🎬", 250, 415, 520], [250, "地下鉄", "🚇", 710, 415, 800], [365, "ハム国会", "🏛️", 480, 470, 1204]];
    for (const [n, name, em, x, y, pop] of rooms) {
      for (let i = 1; i <= 6; i++) { lab.textContent = `配信 第${Math.round(pn + (n - pn) * i / 6)}回　人口 ${Math.round(pp + (pop - pp) * i / 6).toLocaleString()}匹`; await wait(40); }
      pn = n; pp = pop; shaft.style.height = Math.max(parseFloat(shaft.style.height) || 0, Math.min(y, 430) - 76) + "px"; await wait(150);
      if (x !== 480) { const left = x < 480, tn = add(`<div></div>`, `left:${left ? x : 480}px;top:${y - 12}px;width:${Math.abs(480 - x)}px;height:24px;background:#2d1c10;transform-origin:${left ? "100%" : "0"} 50%`, w);
        await anim(tn, [{ transform: "scaleX(0)" }, { transform: "none" }], 170, { easing: "linear" }); }
      const rm = add(`<div><div style="left:18px;top:24px;font-size:46px">${em}</div><div style="left:82px;top:14px;font-size:22px;color:${INK};white-space:nowrap">${name}</div><img src="${N}" style="left:112px;top:42px;width:50px">${n === 365 ? `<img src="${N}" style="left:160px;top:42px;width:50px">` : ""}</div>`,
        `left:${x - 110}px;top:${y - 52}px;width:220px;height:104px;border-radius:50%;background:#f0d9a8;border:5px solid #2d1c10`, w);
      anim(rm, [{ transform: "scale(.2)" }, { transform: "scale(1.12)", offset: .7 }, { transform: "none" }], 240);
      if (n < 365) { say(`第${n}回 ${name} 完成!`, x, y - 70, { size: 32, color: "#fff", ms: 800 }); await wait(900); }
    }
    say("ついに国会ができた!!", 480, 300, { size: 60, ms: 1500 }); await wait(1600);
    bubble("来週は月面基地です", 480, 110, 1200); await wait(1300);
    await anim(w, [{ transform: "none" }, { transform: "translateY(540px)" }], 400, { easing: "ease-in" }); w.remove();
    anim(h, [{ transform: "translateY(260px)" }, { transform: "translateY(-30px)", offset: .8 }, { transform: "none" }], 300);
    bubble("以上、報告でした", 600, 250, 1100); await wait(1200);
  },
});

// 引退会見と対になる、勝ったときのヒーローインタビュー
Object.assign(scenes, {
  async hero() { // ヒーローインタビュー。勝つたびにお立ち台へ。連勝するほど調子に乗る
    const h = ham(N), n = add(`<div class=lab>本日のヒーロー 0回</div>`, "right:16px;top:16px");
    const confetti = k => { for (let i = 0; i < k; i++) { const e = add(`<div></div>`, `left:${rnd(0, 950)}px;top:-20px;width:${rnd(8, 14)}px;height:${rnd(5, 9)}px;background:${["#ff4d6d", "#ffd23c", "#4dabf7", "#69db7c", "#fff"][i % 5]};z-index:35`);
      anim(e, [{ transform: "none" }, { transform: `translate(${rnd(-90, 90)}px,600px) rotate(${rnd(360, 1080)}deg)` }], rnd(1400, 2300), { delay: rnd(0, 700), easing: "linear", fill: "both" }).then(() => e.remove()); } };
    const cheer = () => [["ハムー!", 110, 0], ["最高ー!", 250, 250], ["ナイス!", 60, 500]].forEach(([t, x, d]) => wait(d).then(() => {
      const e = add(`<div class=t>${t}</div>`, `left:${x}px;top:430px;font-size:30px;color:#fff;z-index:30`); anim(e, [{ transform: "none", opacity: 1 }, { transform: "translateY(-90px)", opacity: 0 }], 1200).then(() => e.remove()); }));
    const rounds = [
      ["勝利", N, "今日の決勝ウルト、どうでしたか?", "チームのおかげです"],
      ["2連勝", R1, "2試合連続のヒーローですが?", "まあ、実力ですね"],
      ["3連勝", R2, "最後に、ファンに一言!", "最高でーす!!"],
    ];
    for (let i = 0; i < rounds.length; i++) {
      const [ev, src, q, a] = rounds[i];
      await wait(1000); chip(ev); say("勝利!!", 470, 210, { size: 60, ms: 700 }); if (i) swap(h, src, true); else hop(h, 50); await wait(700);
      const set = [ // 後ろの看板 (ハムTV の柄)、お立ち台、インタビュアーのマイク
        add(`<div>${Array.from({ length: 20 }, (_, k) => `<div style="left:${14 + (k % 4) * 88}px;top:${46 + Math.floor(k / 4) * 52}px;font-size:16px;color:#1d4e9e;opacity:.5;white-space:nowrap">🐹ハムTV</div>`).join("")}
          <div style="left:0;top:0;width:100%;height:36px;background:#c62828;color:#fff;text-align:center;font-size:26px;line-height:36px">ヒーローインタビュー</div></div>`,
          `left:${HX - 120}px;top:${HY - 74}px;width:${HW + 136}px;height:${HH + 80}px;background:#f4f7fb;border:4px solid #c9a227;overflow:hidden;z-index:5`),
        add(`<div></div>`, `left:${HX - 24}px;top:518px;width:${HW + 48}px;height:22px;background:repeating-linear-gradient(90deg,#d32f2f 0 26px,#fff 26px 52px);border:3px solid ${INK};z-index:9`),
        add(`<svg viewBox="0 0 160 80" style="overflow:visible"><path d="M4 76L100 34" stroke=#222 stroke-width=12 stroke-linecap=round /><g transform="rotate(-24 82 44)"><rect x=64 y=32 width=38 height=24 rx=3 fill=#c62828 stroke=${INK} stroke-width=3 /><text x=83 y=49 text-anchor=middle font-size=10 font-weight=900 fill=#fff>ハムTV</text></g>
          <circle cx=118 cy=24 r=20 fill=#333 stroke=${INK} stroke-width=4 /><circle cx=118 cy=24 r=12 fill=none stroke=#888 stroke-width=2 stroke-dasharray="3 3" /></svg>`, `left:${HX - 36}px;top:${HY + 122}px;width:160px;height:80px;z-index:13`),
      ];
      const sash = ov(h, `<g transform="rotate(-16 620 960)"><rect x=110 y=900 width=1020 height=124 fill=#d32f2f stroke=${INK} stroke-width=10 /><text x=620 y=990 text-anchor=middle font-size=84 font-weight=900 fill=#fff>本日のヒーロー</text></g>`);
      n.textContent = `本日のヒーロー ${i + 1}回`; say("放送席、放送席!", 300, 150, { size: 42, color: "#fff", ms: 1100 });
      const fl = setInterval(flash, 150); await wait(1200);
      bubble(`アナ「${q}」`, 320, 250, 1600); await wait(1000);
      if (i < rounds.length - 1) { bubble(a, 470, 330, 1300); cheer(); await wait(1500); }
      else { say(a, 370, 210, { size: 80, ms: 1700 }); confetti(70); rain(20); cheer(); hop(h, 60); await wait(2000); }
      clearInterval(fl); chip("次の試合"); set.forEach(e => e.remove()); sash.remove(); await wait(300);
    }
    bubble("明日も ここに立ちます", 600, 250, 1300); await wait(1500);
  },
});
