// 配信ハム PoC 第3弾 (突拍子もない30案)。poc.js / poc2.js の部品を使い、scenes に足す。
const layer = (css = "", html = "", parent = s) => add(`<div>${html}</div>`, `left:0;top:0;width:960px;height:540px;${css}`, parent);
const pic = (src, x, y, w, css = "", parent = s) => add(`<img src="${src}">`, `left:${x}px;top:${y}px;width:${w}px;height:${w * 1271 / 1237}px;${css}`, parent);
const pop = (e, ms = 220) => anim(e, [{ transform: "scale(.2)", opacity: 0 }, { transform: "scale(1.12)", opacity: 1, offset: .7 }, { transform: "none", opacity: 1 }], ms);
const fade = (e, ms = 260) => anim(e, [{ opacity: 1 }, { opacity: 0 }], ms).then(() => e.remove());
const label = (t, css = "") => add(`<div class=lab>${t}</div>`, css);
const note = (t, css = "") => add(`<div>${t}</div>`, `color:#222;background:#fff8e6;border:4px solid ${INK};border-radius:8px;padding:6px 14px;white-space:nowrap;z-index:22;${css}`);
const stamp = (t, x, y, size = 72) => { const e = add(`<div>${t}</div>`, `left:${x}px;top:${y}px;translate:-50% -50%;rotate:-8deg;color:#d3202a;border:6px solid #d3202a;border-radius:10px;padding:4px 18px;font-size:${size}px;white-space:nowrap;background:#fffc;z-index:32`);
  anim(e, [{ transform: "scale(3)", opacity: 0 }, { transform: "none", opacity: 1 }], 160, { easing: "ease-in" }); return e; };
const seedHtml = (w = 24) => `<svg viewBox="0 0 40 60" style="left:0;top:0;width:${w}px;height:${w * 1.5}px"><path d="M20 2C38 24 36 54 20 58C4 54 2 24 20 2Z" fill=#3a3030 stroke=#fff stroke-width=3 /><path d="M14 16L12 50M26 16L28 50" stroke=#eee stroke-width=3 /></svg>`;
const seed = (x, y, w = 24, z = 20) => add(`<div>${seedHtml(w)}</div>`, `left:${x}px;top:${y}px;width:${w}px;height:${w * 1.5}px;z-index:${z}`);
const seedRain = (n, up = false) => { for (let i = 0; i < n; i++) { const e = seed(rnd(0, 940), up ? 560 : -50);
  anim(e, [{ transform: "none" }, { transform: `translateY(${up ? -640 : 640}px) rotate(${rnd(300, 900)}deg)` }], rnd(900, 1500), { delay: rnd(0, 1000), easing: "linear", fill: "both" }).then(() => e.remove()); } };

Object.assign(scenes, {
  async zip() { // 中の人
    const h = ham(N); await wait(1000); chip("配信30分経過");
    const z = ov(h, `<path d="M618 110V1180" stroke=#777 stroke-width=16 stroke-dasharray="16 12" /><rect x=592 y=90 width=52 height=80 rx=10 fill=#e0bd55 stroke=${INK} stroke-width=9 />`), sl = z.lastChild;
    say("ジジジ…", 560, 300, { size: 44, color: "#fff", ms: 800 });
    await anim(sl, [{ transform: "none" }, { transform: "translateY(1000px)" }], 800, { easing: "linear" });
    anim(h, [{ transform: "none" }, { transform: "translateX(-70px)" }], 300);
    add(`<div></div>`, "left:14%;top:8%;width:72%;height:90%;border-radius:48%;background:#1c1210", h);
    const man = add(`<svg viewBox="0 0 100 150" style="overflow:visible"><path d="M22 80Q50 66 78 80L84 150H16Z" fill=#fff stroke=${INK} stroke-width=4 /><path d="M22 84L6 118M78 84L94 118" stroke=#f2c9a1 stroke-width=12 stroke-linecap=round />
      <circle cx=50 cy=42 r=30 fill=#f2c9a1 stroke=${INK} stroke-width=4 /><path d="M24 30Q50 8 76 30Q60 20 50 22Q40 20 24 30Z" fill=#333 /><circle cx=39 cy=42 r=3.5 fill=${INK} /><circle cx=61 cy=42 r=3.5 fill=${INK} />
      <path d="M36 56Q50 50 64 56" fill=none stroke=${INK} stroke-width=5 /><path d="M26 72Q50 84 74 72L70 84Q50 94 30 84Z" fill=#7cc4ff stroke=${INK} stroke-width=3 /><path d="M76 30q8 10 0 16q-8-6 0-16" fill=#7cc4ff /></svg>`, "left:26%;top:12%;width:48%;height:84%");
    h.append(man);
    const half = d => add(`<img src="${N}">`, `left:0;top:0;width:100%;height:100%;clip-path:inset(0 ${d < 0 ? 50 : 0}% 0 ${d < 0 ? 0 : 50}%);transform-origin:${d < 0 ? "0%" : "100%"} 100%`, h);
    const L = half(-1), R = half(1); h.img.style.visibility = "hidden"; z.remove();
    anim(L, [{ transform: "none" }, { transform: "rotate(-22deg)" }], 350); await anim(R, [{ transform: "none" }, { transform: "rotate(22deg)" }], 350);
    await anim(man, [{ transform: "translateY(50%)" }, { transform: "translateY(-14%) scale(1.15)" }], 300);
    bubble("暑いっすね", 560, 250, 1300); await wait(1400); bubble("このシフト何時までですか?", 480, 250, 1500); await wait(1700);
    await anim(man, [{ transform: "translateY(-14%) scale(1.15)" }, { transform: "translateY(50%)" }], 220);
    anim(L, [{ transform: "rotate(-22deg)" }, { transform: "none" }], 250); await anim(R, [{ transform: "rotate(22deg)" }, { transform: "none" }], 250);
    chip("何事もなかった"); anim(h, [{ transform: "translateX(-70px)" }, { transform: "none" }], 300); await wait(1200);
  },

  async doll() { // マトリョーシカ
    const S = [230, 175, 130, 95, 65], slot = [620, 440, 305, 205, 135], cx = 832;
    const mk = (hh, z) => add(`<div><img src="${N}" style="left:0;top:0;width:100%;height:100%;clip-path:inset(0 0 46% 0)"><img src="${N}" style="left:0;top:0;width:100%;height:100%;clip-path:inset(54% 0 0 0)"></div>`, `left:${cx - hh * .487}px;top:${534 - hh}px;width:${hh * .973}px;height:${hh}px;z-index:${z};transform-origin:50% 100%`);
    let cur = mk(S[0], 10); await wait(1000);
    for (let i = 0; i < 5; i++) { chip(i ? `パカッ ${i + 1}回目` : "触ってみた"); const up = cur.firstChild, hh = S[i];
      say("パカッ", 700, 200, { size: 44, color: "#fff", ms: 500 });
      await anim(up, [{ transform: "none" }, { transform: `translateY(${-hh * .5}px) rotate(-12deg)` }], 200);
      const inner = i < 4 ? mk(S[i + 1], 11 + i) : seed(cx - 18, 480, 36);
      hop(inner, 40); await wait(320);
      await anim(up, [{ transform: `translateY(${-hh * .5}px) rotate(-12deg)` }, { transform: "none" }], 140);
      await anim(cur, [{ transform: "none" }, { transform: `translateX(${slot[i] - cx}px)` }], 260);
      cur = inner; await wait(180); }
    chip("中身が判明"); say("本体は種でした", 400, 170, { size: 66, ms: 1800 }); await wait(2000);
  },

  async paper() { // ペラペラ
    const h = ham(N), spin = (a, b, ms = 320) => anim(h, [{ transform: `perspective(1200px) rotateY(${a}deg)` }, { transform: `perspective(1200px) rotateY(${b}deg)` }], ms, { easing: "linear" });
    await wait(1000); chip("横を向いた"); await spin(0, 89, 450);
    const lb = label("厚さ 0mm", `left:${HX - 40}px;top:${HY + 90}px;font-size:32px`);
    say("!?", 640, 250, { size: 80, color: "#ff5a4a", ms: 800 }); await wait(1300); lb.remove(); chip("風が吹いた");
    for (let i = 0; i < 12; i++) { const w = add(`<div></div>`, `left:0;top:${rnd(200, 520)}px;width:${rnd(80, 200)}px;height:4px;background:#fff9;z-index:20`);
      anim(w, [{ transform: "translateX(-220px)" }, { transform: "translateX(1000px)" }], rnd(500, 800), { delay: i * 130, easing: "linear", fill: "both" }).then(() => w.remove()); }
    h.img.style.filter = "brightness(0) invert(1) drop-shadow(0 0 2px #333)";
    const txt = add(`<div>ご自由に<br>お取りください</div>`, "left:0;right:0;top:44%;text-align:center;font-size:27px;color:#222;line-height:1.3", h);
    await spin(89, 0, 260);
    await anim(h, [0, 16, -10, 12, -6, 0].map(d => ({ transform: `skewX(${d}deg)` })), 1500, { easing: "ease-in-out" });
    bubble("たろう「1枚もらった」", 520, 270, 1200); await wait(1300);
    await spin(0, 89, 260); h.img.style.filter = "none"; txt.remove(); await spin(89, 0, 260);
    chip("何事もなかった"); await wait(1100);
  },

  async owner() { // 飼い主の手
    const h = ham(N); await wait(900); chip("ケージ掃除の時間");
    const hand = add(`<div><svg viewBox="0 0 300 420" style="left:0;top:0;width:100%;height:100%;overflow:visible"><rect x=90 y=-900 width=130 height=1040 fill=#5a7fb0 stroke=${INK} stroke-width=8 />` +
      [58, 104, 150, 196].map(x => `<rect x=${x} y=230 width=44 height=170 rx=20 fill=#f2c9a1 stroke=${INK} stroke-width=7 />`).join("") +
      `<rect x=56 y=110 width=190 height=170 rx=46 fill=#f2c9a1 stroke=${INK} stroke-width=7 /><rect x=236 y=170 width=42 height=120 rx=20 fill=#f2c9a1 stroke=${INK} stroke-width=7 transform="rotate(-20 257 230)" /></svg></div>`, `left:${HX - 40}px;top:0;width:300px;height:420px;z-index:20`);
    const T = y => ({ transform: `translateY(${y}px)` });
    await anim(hand, [T(-500), T(110)], 500, { easing: "ease-in" }); say("ガシッ", 600, 300, { color: "#fff", ms: 600 }); await wait(500);
    anim(hand, [T(110), T(-560)], 480, { easing: "ease-in" }); await anim(h, [T(0), T(-700)], 480, { easing: "ease-in" });
    const dirt = layer("z-index:5", [[740, 500], [800, 515], [860, 495], [900, 520], [780, 480], [840, 525]].map(([x, y]) => `<div style="left:${x}px;top:${y}px;width:${rnd(30, 60)}px;height:${rnd(12, 22)}px;border-radius:50%;background:#a57c4f"></div>`).join(""));
    const lb = label("右下の床", `left:${HX + 40}px;top:430px;font-size:26px`); await wait(700);
    const rag = add(`<div></div>`, "left:40px;top:330px;width:230px;height:90px;background:#9db4c8;border:4px solid #333;border-radius:12px", hand);
    await anim(hand, [T(-560), T(120)], 380, { easing: "ease-in" });
    fade(dirt, 900); await anim(hand, [-60, 50, -50, 40, -30, 0].map(x => ({ transform: `translate(${x}px,120px)` })), 1100, { easing: "linear" });
    for (let i = 0; i < 4; i++) flash(740, 900, 430, 500);
    await anim(hand, [T(120), T(-560)], 320, { easing: "ease-in" }); rag.remove(); lb.remove(); await wait(350);
    const UP = y => ({ transform: `translateY(${y}px) rotate(180deg)` });
    anim(hand, [T(-560), T(70)], 500); await anim(h, [UP(-860), UP(-230)], 500);
    await wait(250); await anim(hand, [T(70), T(-560)], 380, { easing: "ease-in" }); hand.remove();
    bubble("……逆です", 620, 300, 1300); await wait(1400);
    await anim(h, [UP(-230), { transform: "translateY(-150px) rotate(90deg)" }, { transform: "none" }], 320); chip("自力で復帰"); await wait(1000);
  },

  async muscle() { // ムキムキ
    const h = ham(N); await wait(1000); chip("ナイスキル"); fade(layer("background:#fff;z-index:24"), 300);
    h.img.style.clipPath = "inset(0 0 40% 0)"; h.style.transform = "translate(-40px,-96px)";
    const armL = "M98 50L30 62L38 -12", armR = "M242 50L310 62L302 -12", st = `fill=none stroke-linecap=round stroke-linejoin=round`;
    const body = add(`<svg viewBox="0 0 340 210" style="overflow:visible"><rect x=135 y=-14 width=70 height=60 fill=#fbf5e9 stroke=${INK} stroke-width=6 /><path d="${armL}" ${st} stroke=${INK} stroke-width=54 /><path d="${armR}" ${st} stroke=${INK} stroke-width=54 /><path d="${armL}" ${st} stroke=#fbf5e9 stroke-width=42 /><path d="${armR}" ${st} stroke=#fbf5e9 stroke-width=42 />
      <ellipse cx=64 cy=36 rx=30 ry=24 fill=#fbf5e9 stroke=${INK} stroke-width=5 /><ellipse cx=276 cy=36 rx=30 ry=24 fill=#fbf5e9 stroke=${INK} stroke-width=5 />
      <path d="M120 130L105 210H165L170 150L175 210H235L220 130Z" fill=#d9534f stroke=${INK} stroke-width=6 /><path d="M92 30Q170 8 248 30L226 136Q170 154 114 136Z" fill=#fbf5e9 stroke=${INK} stroke-width=6 />
      <path d="M170 40V136M120 74Q146 92 170 74Q194 92 220 74M142 104H198M146 122H194" fill=none stroke=${INK} stroke-width=5 /></svg>`, "left:622px;top:340px;width:340px;height:210px;z-index:9;transform-origin:50% 100%");
    for (const [t, c] of [["キレてる!!", "#ffd23c"], ["肩にメロン!!", "#ffd23c"], ["種で鍛えました", "#fff"]]) { say(t, 300, 200, { size: 66, color: c, ms: 950 });
      await anim(body, [{ transform: "none" }, { transform: "scale(1.08)" }, { transform: "none" }], 420); await wait(800); }
    chip("通常に戻る"); fade(layer("background:#fff;z-index:24"), 300); body.remove(); h.img.style.clipPath = "none"; h.style.transform = ""; await wait(1100);
  },

  async gravity() { // 重力反転
    gameBg(); const h = ham(N), UP = "translateY(-528px) rotate(180deg)";
    await wait(1000); chip("重力 反転"); say("え?", 640, 260, { color: "#fff", ms: 500 }); await wait(350);
    await anim(h, [{ transform: "none" }, { transform: "translateY(-60px) rotate(60deg)", offset: .35 }, { transform: UP }], 560, { easing: "ease-in" });
    const lb = label("重力 ↑", `left:${HX - 60}px;top:260px;font-size:30px`); await wait(400);
    bubble("……何か?", 600, 110, 1300); await wait(1400); chip("種も上に落ちる"); seedRain(14, true);
    await anim(h, [{ transform: UP }, { transform: UP + " scale(1.06,.94)" }, { transform: UP }, { transform: UP + " scale(1.06,.94)" }, { transform: UP }], 700, { easing: "linear" });
    bubble("いつも通りです", 600, 110, 1200); await wait(1500);
    chip("重力 復旧"); lb.remove(); await anim(h, [{ transform: UP }, { transform: "none" }], 420, { easing: "ease-in" }); shake(h); say("ドスン", 640, 300, { color: "#fff" }); await wait(1100);
  },

  async tilt() { // 傾く世界
    const g = gameBg(), h = ham(N), wgt = label("体重 30g", `left:${HX - 150}px;top:${HY + 20}px;font-size:26px`); h.style.zIndex = 12;
    const items = [["キル: たろう → あなた", 620, 60], ["キル: はなこ → あなた", 620, 100], ["弾 30/120", 420, 490], ["00:42", 450, 60], ["目標 B", 60, 120], ["勝率 3%", 180, 300]].map(([t, x, y]) => ({ e: label(t, `left:${x}px;top:${y}px`), x, y }));
    let moved = 0, pk = 1, pd = 0;
    for (const [w, deg, k, txt, n] of [["3kg", 3, 1.12, "ズシン", 2], ["300kg", 7, 1.26, "ズシン!", 4], ["3t", 12, 1.42, "ズドォン!!", 6]]) {
      await wait(1100); chip("種を食べすぎた"); wgt.textContent = `体重 ${w}`; say(txt, 430, 240, { size: 50 + deg * 3, color: "#fff", ms: 700 });
      anim(h, [{ transform: `scale(${pk})` }, { transform: `scale(${k})` }], 200); pk = k;
      anim(g, [{ transform: `rotate(${pd}deg) scale(1.3)` }, { transform: `rotate(${deg}deg) scale(1.3)` }], 450, { easing: "cubic-bezier(.3,1.6,.5,1)" }); pd = deg;
      for (; moved < n; moved++) { const it = items[moved]; anim(it.e, [{ transform: "none" }, { transform: `translate(${rnd(440, 640) - it.x}px,${rnd(440, 510) - it.y}px) rotate(${rnd(-25, 25)}deg)` }], 800, { easing: "ease-in", delay: rnd(0, 180), fill: "both" }); } }
    await wait(1100); bubble("重くてすみません", 620, 180, 1300); await wait(1500);
    chip("ダイエット成功"); wgt.textContent = "体重 30g"; anim(h, [{ transform: `scale(${pk})` }, { transform: "none" }], 300);
    anim(g, [{ transform: `rotate(${pd}deg) scale(1.3)` }, { transform: "none" }], 450); items.forEach(i => fade(i.e)); await wait(1100);
  },

  async time() { // 時間1万倍
    gameBg();
    const box = add(`<div></div>`, `left:${HX - 130}px;top:${HY - 66}px;width:${HW + 146}px;height:${HH + 72}px;border:4px solid #fff;z-index:5`);
    box.animate([{ background: "#ffc6d9" }, { background: "#9fe08a" }, { background: "#f2a65a" }, { background: "#dfefff" }, { background: "#ffc6d9" }], { duration: 1200, iterations: Infinity });
    const yr = label("西暦 2026", `left:${HX - 120}px;top:${HY - 58}px;font-size:26px`); let y = 2026;
    label("×10000倍", `right:24px;top:${HY - 58}px`); label("配信者の時間 0:14", "left:60px;top:80px;font-size:26px");
    const tick = setInterval(() => { y += 37; yr.textContent = `西暦 ${y}`; }, 100);
    const names = ["ハム", "孫ハム", "ひ孫ハム"], lines = ["若い頃はのう…", "じいさんの墓、増えとる", "右下も変わったのう"]; await wait(700);
    for (let i = 0; i < 3; i++) { chip(`${names[i]} 誕生`);
      const a = pic(N, HX + 62, 534 - 154, 150, "z-index:8;transform-origin:50% 100%");
      await anim(a, [{ transform: "scale(.3)", filter: "none" }, { transform: "scale(1)", filter: "none", offset: .35 }, { transform: "scale(.92) rotate(-6deg)", filter: "grayscale(1) brightness(1.3)" }], 1600, { easing: "linear" });
      bubble(lines[i], 520, 300, 800); await wait(850); chip(`${names[i]} 永眠`); a.remove();
      pop(add(`<div>${names[i]}<br>之墓</div>`, `left:${HX - 120 + i * 84}px;top:420px;width:80px;height:114px;background:#9aa0a8;border:4px solid ${INK};border-radius:30px 30px 4px 4px;color:#222;font-size:16px;text-align:center;padding-top:26px;z-index:7`)); await wait(350); }
    clearInterval(tick); chip("配信者の様子"); say("配信者は、まだ1試合目", 300, 240, { size: 44, ms: 1800 }); await wait(2000);
  },

  async tpose() { // Tポーズ
    gameBg(); const h = ham(N); await wait(1000); chip("バグ発生");
    const arms = ov(h, `<rect x=-430 y=660 width=560 height=96 rx=30 fill=#fbf5e9 stroke=${INK} stroke-width=14 /><rect x=1110 y=660 width=560 height=96 rx=30 fill=#fbf5e9 stroke=${INK} stroke-width=14 />${hideMouth}<path d="M530 650H670" ${line} />`);
    const bug = add(`<div></div>`, "left:22%;top:8%;width:56%;height:32%;background:repeating-conic-gradient(#f0f 0 25%,#000 0 50%) 0 0/26px 26px", h);
    bug.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 300, iterations: Infinity, easing: "steps(2)" });
    const err = label("ham.exe は応答していません", "left:300px;top:90px;font-size:26px;background:#a00"); await wait(800);
    await anim(h, [{ transform: "none" }, { transform: "translateX(-1150px)" }], 2300, { easing: "steps(34)" });
    await anim(h, [{ transform: "translateX(300px)" }, { transform: "none" }], 800, { easing: "steps(12)" });
    await wait(500); chip("再起動"); arms.remove(); bug.remove(); err.remove(); hop(h, 40); bubble("……今の見た?", 620, 280, 1300); await wait(1500);
  },

  async daruma() { // だるまさんがころんだ
    gameBg(); const h = ham(N), eye = label("👀 配信者: 見てる", "right:16px;top:56px;font-size:24px"); h.style.zIndex = 12;
    const chat = ["ん?ハム動いた?", "近づいてない?", "後ろ後ろ!", "もう真ん中だぞ"];
    const T = i => { const t = i / 5; return `translate(${-352 * t}px,${6 * t}px) scale(${1 + 1.3 * t})`; };
    await wait(800); chip("配信中");
    for (let i = 1; i <= 5; i++) { await wait(800); eye.textContent = "🙈 配信者: よそ見中";
      await anim(h, [{ transform: T(i - 1) }, { transform: T(i) }], 320, { easing: "linear" });
      eye.textContent = "👀 配信者: 見てる"; if (i >= 2) { const b = bubble(chat[i - 2], 170, 110 + (i - 2) * 56, 1800); b.style.zIndex = 40; } }
    await wait(800); say("ジーッ", 480, 40, { color: "#fff", ms: 1000, z: 40 }); await wait(1200);
    chip("配信者が振り向いた"); await anim(h, [{ transform: T(5) }, { transform: "none" }], 110, { easing: "ease-in" });
    say("!?", 480, 240, { size: 90, color: "#ff5a4a", ms: 700 }); bubble("何か?", 640, 280, 1300); await wait(1500);
  },

  async cosmic() { // 壮大なズームアウト
    const stars = "radial-gradient(1px 1px at 20% 30%,#fff,#0000),radial-gradient(1px 1px at 70% 20%,#fff,#0000),radial-gradient(2px 2px at 40% 70%,#fff,#0000),radial-gradient(1px 1px at 85% 60%,#fff,#0000),radial-gradient(2px 2px at 10% 80%,#fff,#0000),#05060f";
    const zoom = async (cur, next, ox, oy, k, t) => { next.style.zIndex = 1; cur.style.zIndex = 2; next.style.transformOrigin = `${ox}px ${oy}px`; cur.style.transformOrigin = "0 0";
      anim(next, [{ transform: `scale(${k})` }, { transform: "none" }], 1300, { easing: "ease-in-out" });
      await anim(cur, [{ transform: "none", opacity: 1 }, { transform: `translate(${ox - 480 / k}px,${oy - 270 / k}px) scale(${1 / k})`, opacity: 0, offset: .95 }, { opacity: 0 }], 1300, { easing: "ease-in-out" });
      cur.remove(); chip(t); await wait(650); };
    const g = gameBg(); pic(N, HX, HY, HW, "", g); await wait(1100); chip("カメラを引く");
    const room = layer("background:linear-gradient(#c9b79c 0 70%,#7d6a55 70%)", `<div style="left:380px;top:190px;width:200px;height:112px;background:linear-gradient(#7fb4d8 0 62%,#5e6e52 62%);border:6px solid #222"></div><div style="left:450px;top:302px;width:60px;height:40px;background:#333"></div><div style="left:300px;top:340px;width:360px;height:20px;background:#6a4a30"></div><div style="left:110px;top:60px;width:170px;height:130px;background:#0b1530;border:8px solid #fff"></div>`);
    await zoom(g, room, 480, 246, 4.8, "部屋");
    const city = layer("background:linear-gradient(#0b1530,#27325c)", [[60, 260, 140], [220, 180, 170], [410, 220, 150], [580, 140, 160], [760, 240, 180]].map(([x, t, w]) => `<div style="left:${x}px;top:${t}px;width:${w}px;height:${540 - t}px;background:#10162e;border:2px solid #333b63"></div>`).join("") + `<div style="left:472px;top:290px;width:18px;height:18px;background:#ffe9a8;box-shadow:0 0 12px #ffe9a8"></div>`);
    await zoom(room, city, 481, 299, 4, "街");
    const earth = layer(`background:${stars}`, `<div style="left:310px;top:100px;width:340px;height:340px;border-radius:50%;background:radial-gradient(circle at 35% 30%,#7fc8ff,#1c5ea8 60%,#0a2a55)"></div><div style="left:370px;top:170px;width:120px;height:90px;border-radius:50%;background:#4f9d5a"></div><div style="left:500px;top:280px;width:90px;height:110px;border-radius:50%;background:#4f9d5a"></div><div style="left:500px;top:190px;width:14px;height:14px;border-radius:50%;background:#f33;box-shadow:0 0 10px #f33"></div>`);
    await zoom(city, earth, 507, 197, 4, "地球");
    const glx = `background:radial-gradient(ellipse,#fff 0,#b79bff 18%,#4a2a9a88 55%,#0000 72%)`;
    const galaxy = layer(`background:${stars}`, `<div style="left:180px;top:150px;width:600px;height:240px;border-radius:50%;rotate:-18deg;${glx}"></div><div style="left:616px;top:236px;width:8px;height:8px;border-radius:50%;background:#7fc8ff"></div>`);
    await zoom(earth, galaxy, 620, 240, 6, "銀河");
    const face = layer("background:#20243a"); pic(N, 40, -40, 880, "", face); add(`<div><div style="left:6%;top:30%;width:88%;height:40%;border-radius:50%;rotate:-18deg;${glx}"></div></div>`, "left:663px;top:320px;width:120px;height:120px;border-radius:50%;background:#05060f;border:6px solid #d88;overflow:hidden", face);
    await zoom(galaxy, face, 723, 380, 8, "?");
    say("全部、頬袋の中でした", 500, 60, { size: 56, ms: 0 }); await wait(1800); chip("モグモグ");
    await anim(face, [{ transform: "none" }, { transform: "scale(1.04,.96)" }, { transform: "none" }, { transform: "scale(1.04,.96)" }, { transform: "none" }], 900, { easing: "linear" }); await wait(600);
  },

  async weather() { // 天気予報
    layer("z-index:0;background:linear-gradient(#2f6fb6,#173f73)"); const h = ham(N); chip("急に天気予報");
    say("明日の天気", 380, 56, { size: 50, color: "#fff", ms: 0 });
    const rows = [["北海道", "種"], ["東京", "くもり時々ひまわり"], ["大阪", "種のち種"], ["沖縄", "大粒の種"]];
    for (let i = 0; i < 4; i++) { await wait(420); pop(add(`<div>${rows[i][0]}　${rows[i][1]}</div>`, `left:50px;top:${100 + i * 78}px;width:520px;height:66px;background:#fff;color:#234;font-size:30px;line-height:58px;padding-left:20px;border-radius:10px;z-index:5`)); hop(h, 18); }
    await wait(500); bubble("全国的に種でしょう", 700, 240, 1400); await wait(1500); chip("本当に降ってきた"); seedRain(45); const m = ov(h, openMouth);
    say("傘をお忘れなく", 360, 470, { size: 46, color: "#fff", ms: 1800 }); await wait(2300); m.remove();
  },

  async shop() { // 通販番組
    layer("z-index:0;background:repeating-conic-gradient(from 0deg at 72% 62%,#ffd23c 0 12deg,#ffae00 0 24deg)"); const h = ham(N); chip("急に通販番組");
    anim(h, [{ transform: "none" }, { transform: "translate(-30px,-10px) scale(1.2)" }], 300); await wait(500);
    say("置くだけで!", 340, 110, { size: 64, color: "#fff", ms: 1000 }); await wait(1150); say("何もしません!!", 340, 110, { size: 72, color: "#fff", ms: 1000 }); await wait(1150);
    say("通常価格 ¥198,000", 340, 90, { size: 40, color: "#fff", ms: 0 }); await wait(500); add(`<div></div>`, "left:150px;top:88px;width:380px;height:6px;background:#e3001b;z-index:31");
    await wait(300); say("今だけ ¥19,800!!", 340, 180, { size: 66, color: "#ffe600", ms: 0 }); await wait(1100);
    for (let i = 0; i < 2; i++) { say("さらに!! もう1匹!!", 340, 270, { size: 50, color: "#fff", ms: 800 }); pop(pic(N, 420 - i * 170, 370, 155, "z-index:10")); await wait(1000); }
    say("全部同じです", 340, 270, { size: 50, color: "#fff", ms: 1400 }); note("お電話は 0120-ハムハムハム", "left:300px;top:10px;font-size:26px"); label("※効果には個体差があります", "left:20px;bottom:10px;font-size:18px"); await wait(1800);
  },

  async enka() { // 演歌
    layer("z-index:0;background:radial-gradient(ellipse 340px 460px at 50% 100%,#fff6,#0000 70%),#12060f"); const h = ham(N); chip("急に演歌");
    for (let i = 0; i < 9; i++) { const c = add(`<div></div>`, `left:${i * 110 - 40}px;top:${rnd(450, 500)}px;width:220px;height:90px;border-radius:50%;background:#ccc8;filter:blur(14px);z-index:12`);
      anim(c, [{ transform: "none" }, { transform: `translateX(${rnd(-60, 60)}px)` }], 2500, { iterations: Infinity, direction: "alternate", easing: "ease-in-out" }); }
    const snow = setInterval(() => { const p = add(`<div></div>`, `left:${rnd(150, 810)}px;top:-16px;width:12px;height:12px;background:${["#ffd23c", "#ff7fa0", "#fff"][Math.floor(rnd(0, 3))]};z-index:14`);
      anim(p, [{ transform: "none" }, { transform: `translate(${rnd(-50, 50)}px,570px) rotate(720deg)` }], 2000, { easing: "linear" }).then(() => p.remove()); }, 110);
    await anim(h, [{ transform: "none" }, { transform: "translate(-352px,-30px) scale(1.5)" }], 500);
    anim(h, [{ transform: "translate(-352px,-30px) scale(1.5) rotate(-4deg)" }, { transform: "translate(-352px,-30px) scale(1.5) rotate(4deg)" }], 1400, { iterations: Infinity, direction: "alternate", easing: "ease-in-out" });
    ov(h, closedEyes + openMouth + tears + `<path d="M820 980L640 730" stroke=#333 stroke-width=30 stroke-linecap=round /><circle cx=630 cy=715 r=50 fill=#555 stroke=#222 stroke-width=10 />`);
    add(`<div>作詞 ハム<br>作曲 ハム<br>涙　 ハム</div>`, "left:40px;top:70px;writing-mode:vertical-rl;font-size:30px;line-height:1.5;color:#fff;z-index:20");
    add(`<div>右下慕情</div>`, "right:50px;top:50px;writing-mode:vertical-rl;font-size:56px;color:#ffd23c;z-index:20");
    for (const t of ["ああ 種よ…", "頬袋に 染みる夜", "右下で 待つハム"]) { say(t, 480, 492, { size: 42, color: "#fff", ms: 1200, z: 31 }); await wait(1450); }
    clearInterval(snow); await wait(800);
  },

  async csi() { // デス現場検証
    gameBg(); const h = ham(N); await wait(900); chip("デス"); shake(h); await wait(500); chip("現場検証");
    add(`<svg viewBox="0 0 200 110" style="overflow:visible"><path d="M100 20a14 14 0 1 1-.1 0ZM100 48L60 28L24 40M100 48L150 22L184 32M100 48L96 82M96 82L52 104M96 82L146 104" fill=none stroke=#fff stroke-width=6 stroke-linecap=round /></svg>`, "left:150px;top:370px;width:340px;height:150px;z-index:3");
    for (const r of [-4, 3]) { const t = add(`<div>立入禁止　KEEP OUT　立入禁止　KEEP OUT　立入禁止　KEEP OUT　立入禁止　KEEP OUT</div>`, `left:-20px;top:${r < 0 ? 340 : 505}px;width:760px;height:30px;overflow:hidden;background:#ffd400;color:#111;font-size:20px;line-height:24px;white-space:nowrap;rotate:${r}deg;z-index:4`); anim(t, [{ transform: "translateX(-760px)" }, { transform: "none" }], 260); }
    [[210, 345], [390, 400], [460, 470]].forEach(([x, y], i) => pop(add(`<div>${i + 1}</div>`, `left:${x}px;top:${y}px;width:34px;height:34px;background:#ffd400;color:#111;border:3px solid #111;text-align:center;font-size:22px;line-height:26px;z-index:5`)));
    ov(h, `<path d="M340 240Q600 40 860 240L960 300H240Z" fill=#6b4a2f stroke=${INK} stroke-width=14 /><path d="M160 760Q600 650 1080 760L1130 1260H110Z" fill=#c9a877 stroke=${INK} stroke-width=14 /><path d="M520 720L600 950L680 720" fill=#fff stroke=${INK} stroke-width=10 />`);
    await walk(h, 0, -190, 700, 4);
    for (const [t, ms] of [["被害者は…また棒立ちか", 1300], ["凶器はヘッドショット", 1300], ["犯人はこの中にいる!", 1200]]) { bubble(t, 470, 240, ms); await wait(ms + 120); }
    chip("解決"); stamp("犯人: 配信者のエイム", 420, 150, 54); await wait(1800);
  },

  async credits() { // 突然のエンドロール
    layer("z-index:0;background:#000"); const g = gameBg(), h = ham(N); g.style.transformOrigin = "0 50%"; await wait(1000); chip("負け確定"); await wait(500);
    fade(h, 500); anim(g, [{ transform: "none", filter: "none" }, { transform: "translateX(26px) scale(.5)", filter: "grayscale(1) brightness(.75)" }], 900);
    const rows = [["監督", "ハム"], ["脚本", "ハム"], ["主演", "ハム"], ["助演", "ハムの頬袋"], ["特別出演", "ひまわりの種"], ["通行人B", "配信者"], ["音響", "チャット欄のざわめき"], ["制作", "株式会社ハム"]];
    const roll = add(`<div>${rows.map(([a, b], i) => `<div style="left:0;top:${i * 76}px;width:360px;text-align:center;font-weight:normal"><div style="position:static;font-size:18px;color:#bbb">${a}</div><div style="position:static;font-size:28px">${b}</div></div>`).join("")}</div>`, "left:550px;top:0;width:360px;height:600px;z-index:5");
    await wait(500); await anim(roll, [{ transform: "translateY(560px)" }, { transform: "translateY(-640px)" }], 6200, { easing: "linear" });
    say("FIN", 730, 270, { size: 90, color: "#fff", ms: 1200 }); await wait(1400); chip("次の試合");
  },

  async axed() { // 打ち切り
    gameBg(); pic(N, HX, HY, HW, "z-index:2"); await wait(900); chip("3連敗"); await wait(500);
    const page = layer("z-index:15;background:radial-gradient(circle at 66% 62%,#fff 0 210px,#fff0 300px),repeating-conic-gradient(from 0deg at 66% 62%,#111 0 1.4deg,#fff 0 7deg)");
    anim(page, [{ transform: "scale(1.6)", opacity: 0 }, { transform: "none", opacity: 1 }], 180);
    pic(N, 470, 190, 300, "filter:grayscale(1) contrast(1.5)", page);
    add(`<div>俺たちの戦いは<br>これからだ!!</div>`, "left:40px;top:64px;writing-mode:vertical-rl;font-size:56px;line-height:1.25;color:#111;-webkit-text-stroke:2px #111;z-index:3", page); await wait(1900);
    const strip = add(`<div>ご愛読ありがとうございました! ハム先生の次回作にご期待ください!!</div>`, "left:0;bottom:0;width:960px;height:64px;background:#111;color:#fff;font-size:29px;line-height:56px;text-align:center;white-space:nowrap;z-index:16");
    anim(strip, [{ transform: "translateY(70px)" }, { transform: "none" }], 240); await wait(2300);
    chip("次の試合"); page.remove(); strip.remove(); bubble("普通に続きます", 620, 270, 1300); await wait(1500);
  },

  async memory() { // 走馬灯
    gameBg(); const h = ham(N); await wait(900); chip("デス"); shake(h); await wait(500);
    const bg = layer("background:#2a1c10;z-index:20"); await anim(bg, [{ opacity: 0 }, { opacity: 1 }], 400);
    const ttl = say("走馬灯", 480, 44, { size: 40, color: "#e8d4a8", ms: 0, z: 31 });
    const rows = [["0歳", "生まれる", [[N, 165, 110, 60]], "🥚"], ["3日目", "初めての種", [[N, 135, 40, 130]], "🌻"], ["1週間", "初恋", [[N, 60, 40, 130], [N, 210, 40, 130]], "❤️"], ["2週間", "ランクマ初勝利", [[R1, 135, 30, 140]], "🏆"], ["今", "棒立ちでデス", [[N, 135, 40, 130]], "🪦"]];
    for (const [age, txt, imgs, em] of rows) {
      const c = add(`<div></div>`, "left:260px;top:88px;width:400px;height:330px;background:#d9c49a;border:solid #111;border-width:24px 8px;filter:sepia(.75);z-index:22");
      imgs.forEach(([src, x, y, w]) => pic(src, x, y, w, "", c)); add(`<div>${em}</div>`, "right:16px;top:10px;font-size:44px", c);
      add(`<div>${age}　${txt}</div>`, "left:0;right:0;bottom:12px;text-align:center;color:#2a1c10;font-size:30px", c);
      await anim(c, [{ transform: "translateX(900px)" }, { transform: "none" }], 300); await wait(620); await anim(c, [{ transform: "none" }, { transform: "translateX(-900px)" }], 240); c.remove(); }
    bg.remove(); ttl.remove(); chip("復活"); say("ハッ!!", 480, 240, { size: 80, color: "#fff" }); hop(h, 50); await wait(500); bubble("まだ2週間しか生きてない", 560, 270, 1400); await wait(1600);
  },

  async isekai() { // 異世界転生
    gameBg(); const h = ham(N); await wait(900); chip("デス"); shake(h); await wait(400); const f1 = layer("background:#fff;z-index:24");
    const w = layer("z-index:5;background:linear-gradient(#ffb7d5,#8fd3ff 60%,#9fe08a 60%)", `<svg viewBox="0 0 300 200" style="left:330px;top:60px;width:300px;height:200px"><path d="M40 200V90L60 60L80 90V120H120V70L150 20L180 70V120H220V90L240 60L260 90V200Z" fill=#7b7fa8 stroke=${INK} stroke-width=4 /></svg>`);
    await wait(150); fade(f1, 400); chip("異世界に転生"); say("異世界に転生した!", 540, 50, { size: 50, color: "#fff", ms: 1200 });
    const gear = ov(h, `<path d="M200 700L40 1240H1190L1030 700Z" fill=#c62828 stroke=${INK} stroke-width=14 /><path d="M1050 860L1180 200" stroke=#dfe7ef stroke-width=44 /><path d="M980 800L1130 840" stroke=#d99a10 stroke-width=34 />`); h.prepend(gear);
    const lv = label("Lv.1", `left:${HX - 20}px;top:${HY - 34}px;font-size:26px`); for (let i = 1; i <= 9; i++) { lv.textContent = `Lv.${i * 11}`; await wait(55); }
    const demon = add(`<svg viewBox="0 0 200 260" style="overflow:visible"><path d="M40 60L20 0L70 34Q100 20 130 34L180 0L160 60Q190 120 170 260H30Q10 120 40 60Z" fill=#2a1838 stroke=#000 stroke-width=5 /><circle cx=74 cy=90 r=12 fill=#f33 /><circle cx=126 cy=90 r=12 fill=#f33 /></svg>`, "left:110px;top:230px;width:220px;height:286px;z-index:8;transform-origin:50% 100%");
    pop(demon, 200); const hp = label("魔王 HP 999,999", "left:120px;top:190px;font-size:24px"); await wait(650);
    await anim(h, [{ transform: "none" }, { transform: "translateX(-330px)" }], 180, { easing: "ease-in" }); for (let i = 0; i < 6; i++) flash(150, 360, 240, 480);
    say("999,999 ダメージ!!", 430, 150, { size: 54, ms: 900 }); hp.textContent = "魔王 HP 0"; await anim(demon, [{ transform: "none" }, { transform: "rotate(-80deg)", opacity: .1 }], 500); demon.remove(); hp.remove();
    await anim(h, [{ transform: "translateX(-330px)" }, { transform: "none" }], 240); say("世界を救った!!", 400, 190, { size: 58, ms: 1100 }); label("経過 3秒", "left:30px;top:80px;font-size:26px"); await wait(1200);
    bubble("じゃ、帰ります", 620, 270, 900); await wait(1000); const f2 = layer("background:#fff;z-index:24"); await wait(150); w.remove(); gear.remove(); lv.remove(); fade(f2, 400); chip("リスポーン"); bubble("ただいま", 620, 270, 1200); await wait(1400);
  },

  async court() { // 配信者を起訴
    layer("z-index:0;background:repeating-linear-gradient(90deg,#6b4226 0 60px,#5d3820 60px 120px)"); const h = ham(N); h.style.transform = "translate(-352px,-204px)";
    ov(h, `<path d="M120 800Q600 640 1120 800L1200 1271H40Z" fill=#1b1b22 stroke=${INK} stroke-width=14 /><path d="M520 720L600 860L680 720" fill=#fff />`);
    add(`<div>裁判長</div>`, `left:250px;top:296px;width:460px;height:70px;background:#3d2414;border:5px solid ${INK};text-align:center;font-size:30px;line-height:56px;z-index:12`);
    const gv = add(`<svg viewBox="0 0 120 120" style="overflow:visible"><path d="M20 30L95 105" stroke=#8a5a30 stroke-width=14 /><rect x=-4 y=8 width=56 height=34 rx=6 fill=#5a3a20 stroke=${INK} stroke-width=5 transform="rotate(45 24 25)" /></svg>`, "left:610px;top:210px;width:120px;height:120px;z-index:13;transform-origin:80% 90%");
    const bang = async () => { await anim(gv, [{ transform: "rotate(30deg)" }, { transform: "rotate(-14deg)" }, { transform: "none" }], 240); say("カンッ", 760, 240, { size: 40, color: "#fff", ms: 400 }); };
    await wait(700); chip("連敗で起訴"); await bang(); say("開廷!", 480, 60, { size: 56, color: "#fff", ms: 800 }); await wait(800);
    pop(note("被告人: 配信者", "left:660px;top:420px;font-size:30px")); await wait(300);
    for (const [i, t] of ["棒立ち 12件", "味方見殺し 3件", "「今の勝てた」発言 28件"].entries()) { pop(note(t, `left:40px;top:${384 + i * 50}px;font-size:24px`)); await wait(420); }
    await wait(400); bubble("被告人、エイムを見せなさい", 480, 30, 1400); await wait(1500); await bang(); await bang();
    stamp("判決 懲役1試合", 480, 210, 74); await wait(600); label("執行猶予なし", "left:400px;top:262px;z-index:33;font-size:26px"); await wait(1600);
  },

  async wipe() { // ワイプ逆転
    layer("z-index:0;background:linear-gradient(#ffe9c9,#f7c59f)"); const g = gameBg(), h = ham(N); g.style.transformOrigin = "100% 100%"; await wait(1000); chip("雑談タイム");
    anim(g, [{ transform: "none" }, { transform: "translate(-12px,-12px) scale(.27)" }], 500); g.style.zIndex = 12; g.style.outline = "14px solid #fff";
    await anim(h, [{ transform: "none" }, { transform: "translate(-352px,-6px) scale(2.1)" }], 500);
    const ttl = say("ハムのトークルーム", 200, 86, { size: 36, ms: 0 }); const gst = label("ゲスト: 配信者", "right:16px;top:356px;z-index:16");
    for (const [t, y] of [["えー、今日はですね", 140], ["最近、種が高くて", 200], ["右下の人、静かにしててください", 260]]) { bubble(t, 190, y, 1300); await wait(1400); }
    chip("元に戻す"); ttl.remove(); gst.remove(); g.style.outline = "none";
    anim(h, [{ transform: "translate(-352px,-6px) scale(2.1)" }, { transform: "none" }], 400); await anim(g, [{ transform: "translate(-12px,-12px) scale(.27)" }, { transform: "none" }], 400); g.style.zIndex = 1; await wait(1000);
  },

  async droste() { // 入れ子配信
    const K = 3.2, X = 400, Y = 330, W = 960 / K, H = 540 / K;
    const frame = d => `<div style="left:0;top:0;width:960px;height:540px;overflow:hidden;background:linear-gradient(#7fb4d8 0 62%,#5e6e52 62%)"><img src="${N}" style="left:${HX}px;top:${HY}px;width:${HW}px;height:${HH}px"><div style="left:20px;top:64px;padding:2px 12px;background:#e22;color:#fff;font-size:22px">LIVE</div><div style="left:${X - 14}px;top:${Y - 14}px;width:${W + 28}px;height:${H + 28}px;background:#222;border-radius:14px"></div>` +
      (d ? `<div style="left:${X}px;top:${Y}px;width:${W}px;height:${H}px;overflow:hidden"><div style="left:0;top:0;transform:scale(${1 / K});transform-origin:0 0;width:960px;height:540px">${frame(d - 1)}</div></div>` : "") + `<div style="left:${X + W - 8}px;top:${Y + H / 2}px;width:40px;height:40px;border-radius:50%;background:#fbcbc3;border:4px solid ${INK}"></div></div>`;
    const w = layer("z-index:1", frame(5)); w.style.transformOrigin = `${X * K / (K - 1)}px ${Y * K / (K - 1)}px`;
    await wait(700); chip("ハムも配信開始"); bubble("見てるー?", 620, 240, 1100); await wait(1200); chip("画面の中へ");
    await anim(w, [{ transform: "none" }, { transform: `scale(${K})` }], 1500, { iterations: 3, easing: "cubic-bezier(.5,0,.8,.6)" });
    w.getAnimations().forEach(a => a.cancel()); chip("視聴者: 1(自分)"); say("どこまで行っても配信", 400, 170, { size: 56, ms: 1700 }); await wait(1900);
  },

  async nation() { // 右下独立宣言
    gameBg(); const h = ham(N); await wait(900); chip("独立宣言"); bubble("本日より独立します", 640, 250, 1200); await wait(1300);
    const area = add(`<div></div>`, "left:540px;top:214px;width:440px;height:340px;background:#ffd23c2e;border:6px dashed #e22;z-index:6"); await anim(area, [{ opacity: 0 }, { opacity: 1 }], 300);
    say("ハム共和国 建国!!", 400, 110, { size: 60, ms: 1300 });
    const fl = add(`<div><div style="left:0;top:0;width:8px;height:220px;background:#ddd;border:1px solid #333"></div><div class=flag style="left:8px;top:0;width:96px;height:62px;background:#2e7d4f;border:3px solid ${INK}">${seedHtml(26).replace("left:0;top:0", "left:33px;top:10px")}</div></div>`, "left:580px;top:262px;width:110px;height:220px;z-index:7");
    await anim(fl.lastChild, [{ transform: "translateY(150px)" }, { transform: "none" }], 900, { easing: "linear" });
    say("♪ 国歌斉唱 ♪", 400, 190, { size: 40, color: "#fff", ms: 1100 }); await wait(1100);
    for (const [i, t] of ["通貨: 種", "人口: 1", "GDP: 種3粒"].entries()) { pop(label(t, `left:${704 + i * 0}px;top:${224 + i * 30}px;z-index:15;font-size:20px`)); await wait(240); }
    chip("配信者のカーソルが接近");
    const cur = add(`<svg viewBox="0 0 40 60" style="overflow:visible"><path d="M4 4V50L16 38L26 58L34 54L24 34H40Z" fill=#fff stroke=#000 stroke-width=3 /></svg>`, "left:0;top:0;width:44px;height:66px;z-index:26");
    await anim(cur, [{ transform: "translate(160px,160px)" }, { transform: "translate(492px,330px)" }], 900, { easing: "ease-in-out" });
    bubble("パスポートを拝見", 620, 200, 1300); await wait(1300); stamp("入国拒否", 330, 340, 56); shake(h);
    await anim(cur, [{ transform: "translate(492px,330px)" }, { transform: "translate(120px,100px)" }], 400, { easing: "ease-in" }); chip("国際社会: 未承認"); await wait(1300);
  },

  async selfpost() { // 自演ハム
    gameBg(); const h = ham(N); const box = add(`<div></div>`, "left:20px;top:64px;width:520px;height:450px;background:#000b;border-radius:10px;overflow:hidden;z-index:6"); let rows = [];
    const post = (who, t, fake) => { rows.forEach(r => { r.y -= 62; r.e.style.top = r.y + "px"; });
      const e = add(`<div>${fake ? `<img src="${N}" style="left:0;top:0;width:44px;height:45px;background:#fff3;border-radius:50%">` : `<div style="left:0;top:0;width:44px;height:44px;border-radius:50%;background:#789"></div>`}<div style="left:54px;top:0;font-size:16px;color:${fake ? "#ffd23c" : "#9fd3ef"};white-space:nowrap">${who}</div><div style="left:54px;top:21px;font-size:22px;font-weight:normal;color:#fff;white-space:nowrap">${t}</div></div>`, "left:12px;top:390px;width:490px;height:50px;transition:top .15s", box);
      rows.push({ e, y: 390 }); };
    await wait(800); chip("デス"); shake(h); post("たろう", "下手すぎて草"); await wait(900);
    const dress = async (svg, who, t) => { const o = ov(h, svg); hop(h, 26); await wait(350); post(who, t, 1); await wait(1050); return o; };
    chip("変装して書き込む");
    await dress(`<circle cx=380 cy=488 r=104 fill=none stroke=#111 stroke-width=24 /><circle cx=828 cy=488 r=104 fill=none stroke=#111 stroke-width=24 /><path d="M484 480H724" stroke=#111 stroke-width=24 />`, "通りすがりの名人", "今のはわざとです");
    const mu = await dress(`<path d="M420 650Q500 590 600 630Q700 590 780 650Q700 690 600 660Q500 690 420 650Z" fill=#222 />`, "プロゲーマー", "参考になります");
    await dress(`<rect x=380 y=-30 width=440 height=240 fill=#222 /><rect x=280 y=190 width=640 height=44 rx=20 fill=#222 />`, "石油王", "全財産投げます");
    post("はなこ", "全員アイコンがハムなんだけど"); await wait(1000); post("たろう", "ヒゲずれてるぞ"); await wait(800);
    chip("バレた"); await anim(mu, [{ transform: "none" }, { transform: "translateY(700px) rotate(20deg)", opacity: 0 }], 500, { easing: "ease-in" }); shake(h); bubble("……", 660, 250, 1200); await wait(1500);
  },

  async heist() { // HUD泥棒
    gameBg(); const h = ham(N);
    const list = [["弾 30/120", 400, 490, "弾数"], ["ミニマップ", 30, 80, "ミニマップ"], ["キル: たろう → あなた", 300, 60, "キルログ"]].map(([t, x, y, nm]) => ({ e: label(t, `left:${x}px;top:${y}px;z-index:18`), x, y, nm }));
    await wait(900); chip("泥棒が来た");
    ov(h, `<path fill-rule=evenodd d="M210 396H1000V584H210ZM380 396a92 92 0 1 0 .1 0ZM828 396a92 92 0 1 0 .1 0Z" fill=#111 />`); hop(h, 26); await wait(500);
    add(`<div>コレクション</div>`, `left:560px;top:230px;width:150px;height:170px;background:#7a4a28;border:4px solid ${INK};font-size:17px;text-align:center;padding-top:4px;z-index:7`);
    for (const [i, it] of list.entries()) { const tx = it.x - HX + 30; await walk(h, 0, tx, 480, 3);
      const sx = 572, sy = 266 + i * 42; anim(it.e, [{ transform: "none" }, { transform: `translate(${sx - it.x}px,${sy - it.y}px) scale(.62)` }], 480, { easing: "linear" }); it.e.style.transformOrigin = "0 0";
      add(`<div>?</div>`, `left:${it.x + 20}px;top:${it.y}px;font-size:26px;color:#fff;z-index:3`); await walk(h, tx, 0, 480, 3); chip(`${it.nm} が消えた`); await wait(250); }
    bubble("いい眺めでしょ", 640, 200, 1400); await wait(800); label("チャット: HUD返して", "left:40px;top:240px;font-size:26px"); await wait(1500);
  },

  async invoice() { // 請求書
    gameBg(); const h = ham(N); await wait(800); chip("配信終了"); const p = add(`<div></div>`, `left:90px;top:44px;width:570px;height:462px;background:#fffef6;border:3px solid #444;color:#222;z-index:12`); await anim(p, [{ transform: "translateY(-560px) rotate(-6deg)" }, { transform: "none" }], 300);
    add(`<div>請求書</div>`, "left:0;right:0;top:12px;text-align:center;font-size:42px;letter-spacing:12px", p); add(`<div>配信者 様</div>`, "left:30px;top:74px;font-size:24px;border-bottom:2px solid #222;padding:0 30px 2px 0", p);
    let sum = 0; const total = add(`<div>合計 ¥0</div>`, "left:30px;right:30px;top:352px;text-align:right;font-size:44px;color:#c11;border-top:3px double #222;padding-top:6px;white-space:nowrap", p);
    for (const [i, [a, v]] of [["出演料", 300000], ["深夜手当", 80000], ["精神的苦痛", 500000], ["種代", 120]].entries()) { await wait(520);
      pop(add(`<div>${a}<div style="right:0;top:0">¥${v.toLocaleString()}</div></div>`, `left:30px;top:${126 + i * 54}px;width:510px;height:44px;font-size:30px;font-weight:normal`, p)); sum += v; total.textContent = `合計 ¥${sum.toLocaleString()}`; hop(h, 16); }
    await wait(600); add(`<div>お支払い期限: 今</div>`, "left:30px;top:420px;font-size:22px", p); await wait(500); stamp("至急", 560, 120, 60); await wait(1900);
  },

  async strike() { // ストライキ
    gameBg(); const h = ham(N); await wait(800); chip("ストライキ発生");
    ov(h, `<path d="M300 300Q600 230 900 300L910 370Q600 300 290 370Z" fill=#d3202a stroke=${INK} stroke-width=8 /><text x=600 y=345 text-anchor=middle font-size=70 font-weight=900 fill=#fff>闘争</text>`);
    const signs = ["種を増やせ", "週休7日", "右下を広く", "頬袋は聖域", "賃上げ", "種を増やせ", "夜は寝かせろ", "ストライキ"];
    signs.forEach((t, i) => { const m = add(`<div><div style="left:50px;top:-24px;width:8px;height:60px;background:#8a5a30"></div><div style="left:-2px;top:-66px;background:#fff8e6;color:#222;border:3px solid ${INK};padding:2px 8px;font-size:19px;white-space:nowrap">${t}</div><img class=bob src="${N}" style="left:0;top:0;width:110px;height:113px"></div>`, `left:1000px;top:420px;width:110px;height:113px;z-index:13`);
      anim(m, [{ transform: "none" }, { transform: "translateX(-2300px)" }], 15000, { easing: "linear", delay: i * 520, fill: "both" }); });
    await wait(1800); bubble("種を増やせー!", 640, 250, 1200); await wait(1500); chip("配信者: 種1粒でどう?"); await wait(1100); const nope = stamp("交渉決裂", 430, 200, 66); await wait(1400); say("週休7日!!", 430, 90, { color: "#fff", ms: 900 }); await wait(1200);
    nope.remove(); chip("配信者: 種2粒に増額"); await wait(900); say("妥結!!", 430, 200, { size: 92, ms: 1300 }); seedRain(14); await wait(1800);
  },

  async divorce() { // 離婚届
    const h = ham(N); await wait(800); chip("配信8時間目"); await wait(300);
    const wife = add(`<div><img src="${N}" style="left:0;top:0;width:100%;height:100%"><svg viewBox="0 0 1237 1271" style="left:0;top:0;width:100%;height:100%;overflow:visible"><path d="M560 170L420 90V250ZM640 170L780 90V250Z" fill=#ff5c8a stroke=${INK} stroke-width=12 /><circle cx=600 cy=170 r=40 fill=#ff5c8a stroke=${INK} stroke-width=12 /><path d="M240 820Q600 700 1000 820L1040 1240H200Z" fill=#fff stroke=${INK} stroke-width=12 /></svg></div>`, `left:0;top:${HY}px;width:${HW}px;height:${HH}px;z-index:9`);
    await walk(wife, -240, 400, 800, 5); bubble("あなた、いつまでゲームしてるの", 400, 240, 1500); await wait(1500);
    chip("子ども40匹も来た"); const kids = []; for (let i = 0; i < 40; i++) { const k = pic(N, 16 + (i % 10) * 39, 300 + Math.floor(i / 10) * 56, 46, "z-index:8"); pop(k, 120); kids.push(k); if (i % 4 === 0) await wait(30); }
    bubble("パパだれ?", 200, 240, 1100); ov(h, tears); shake(h); await wait(1200);
    const f = add(`<div><div style="left:0;right:0;top:10px;text-align:center;font-size:40px;letter-spacing:8px;color:#1a7a3a">離婚届</div><div style="left:24px;top:74px;font-size:22px;font-weight:normal">妻　ハム子</div><div style="left:24px;top:110px;font-size:22px;font-weight:normal">夫　</div><div style="left:70px;top:134px;width:190px;height:2px;background:#333"></div></div>`, "left:310px;top:60px;width:340px;height:170px;background:#fffef6;border:5px solid #1a7a3a;color:#222;z-index:25");
    pop(f); await wait(1500); chip("妻子、実家へ"); bubble("種、置いていくね", 400, 240, 1000); await wait(1100);
    f.remove(); kids.forEach(k => anim(k, [{ transform: "none" }, { transform: "translateX(-500px)" }], 500, { easing: "ease-in" })); await walk(wife, 400, -240, 600, 4); seed(690, 490, 22, 12); chip("配信は続く"); bubble("……配信、続けます", 620, 270, 1400); await wait(1600);
  },

  async robot() { // 合体ロボ
    layer("z-index:0;background:repeating-conic-gradient(from 0deg at 50% 50%,#1c2a58 0 10deg,#14204a 0 20deg)");
    const hues = [0, 210, 110, 50, 310], parts = hues.map((d, i) => pic(N, 40 + i * 180, 400, 130, `z-index:10;filter:sepia(1) saturate(3) hue-rotate(${d}deg)`));
    await wait(900); chip("緊急出動"); say("5匹そろった!", 480, 180, { size: 56, color: "#fff", ms: 800 }); await wait(900); chip("合体!!");
    const frame = add(`<div></div>`, "left:280px;top:190px;width:400px;height:30px;background:#aab;border:4px solid #334;z-index:5"), f2 = add(`<div></div>`, "left:464px;top:90px;width:32px;height:360px;background:#aab;border:4px solid #334;z-index:5");
    const TG = [[415, 30, 1], [375, 150, 1.5], [195, 130, 1.2], [605, 130, 1.2], [395, 360, 1.3]];
    await Promise.all(parts.map((p, i) => { const sx = 40 + i * 180; return anim(p, [{ transform: "none" }, { transform: `translate(${TG[i][0] - sx}px,${TG[i][1] - 400}px) scale(${TG[i][2]}) rotate(720deg)` }], 700, { delay: i * 100, fill: "both", easing: "ease-in-out" }); }));
    parts.forEach(p => p.style.transformOrigin = "50% 50%"); fade(layer("background:#fff;z-index:24"), 300); say("超合体!! ハムロボ!!", 480, 500, { size: 62, ms: 1500, z: 31 });
    await wait(1700); chip("敵: いません"); say("……", 480, 270, { size: 80, color: "#fff", ms: 1000 }); await wait(1200); bubble("解散で", 700, 60, 900); await wait(900); chip("解散"); frame.remove(); f2.remove();
    await Promise.all(parts.map((p, i) => anim(p, [{ transform: `translate(${TG[i][0] - 40 - i * 180}px,${TG[i][1] - 400}px) scale(${TG[i][2]})` }, { transform: `translate(${TG[i][0] - 40 - i * 180}px,${700 - TG[i][1]}px)` }], 620, { easing: "ease-in", delay: i * 40, fill: "both" })));
    const h = ham(N); hop(h, 50); await wait(1000);
  },

  async find() { // ハムを探せ
    gameBg(); const h = ham(N); await wait(700); chip("!探せ"); h.remove();
    const all = [], cols = 16, rows = 9, tc = 11, tr = 3;
    for (let r = 0; r < rows; r++) { for (let c = 0; c < cols; c++) { const odd = r === tr && c === tc, e = pic(odd ? R1 : N, c * 60, r * 60, 60, `z-index:${odd ? 12 : 10}`); pop(e, 140); all.push({ e, odd }); } if (r % 2) await wait(30); }
    const q = say("1匹だけ違うハムを探せ!", 480, 40, { size: 46, ms: 0, z: 40 }); await wait(800);
    for (const [n, t, y] of [[3, "左上じゃね?", 200], [2, "全部同じだろ", 300], [1, "サングラスいる!", 400]]) { const k = say(String(n), 480, 270, { size: 120, color: "#fff", ms: 700, z: 40 }); const b = bubble(t, 190, y, 900); b.style.zIndex = 40; await wait(900); }
    q.remove(); chip("正解発表"); all.forEach(a => { if (!a.odd) anim(a.e, [{ opacity: 1 }, { opacity: .18 }], 260); });
    const o = all.find(a => a.odd).e; await anim(o, [{ transform: "none" }, { transform: "scale(3.2)" }], 320); say("たろうさん 正解!!", 480, 80, { size: 60, ms: 1400, z: 40 }); await wait(1800);
  },
});
