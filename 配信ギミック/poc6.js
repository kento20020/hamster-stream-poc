// 配信ハム PoC 第6弾: 演出アイデア500 (ideas500.html) のうち、判定で面白さ4以上だった案の動く見本。
// poc.js / poc2.js / poc3.js / zari.js (ザリガニの絵) の部品を使う。まとまりごとに { } で囲んでいる。

{
const mh = (src, x, y, w, z = 5, parent = s) => { const h = add(`<div><img src="${src}" style="left:0;top:0;width:100%;height:100%"></div>`,
  `left:${x}px;top:${y}px;width:${w}px;height:${w * 1271 / 1237}px;transform-origin:50% 100%;z-index:${z}`, parent); h.img = h.firstChild; return h; };
const box = (css, html = "", p = s) => add(`<div>${html}</div>`, css, p);
const lb = (t, css, p) => add(`<div class=lab>${t}</div>`, css, p);
const zf = (e, o) => { e.innerHTML = zariSvg(o); };
const intro = L => anim(L, [{ opacity: 0 }, { opacity: 1 }], 350);
const room = (css, html = "") => layer(`z-index:20;${css}`, html);
const sweatD = `<path class=dr d="M880 330q-24 40 0 56q24-16 0-56" fill=#7cc4ff stroke=${INK} stroke-width=8 />`;
const shades = `<path d="M500 500H690" stroke=#e6b422 stroke-width=14 /><rect x=250 y=430 width=250 height=200 rx=30 fill=#1a1530 stroke=#e6b422 stroke-width=16 /><rect x=690 y=430 width=250 height=200 rx=30 fill=#1a1530 stroke=#e6b422 stroke-width=16 /><path d="M300 560l60-100M730 560l60-100" stroke=#fff5 stroke-width=14 />`;
const berrySvg = (x, y, k = 1) => `<g transform="translate(${x} ${y}) scale(${k})"><path d="M0 -60C80 -75 95 0 0 90C-95 0 -80 -75 0 -60Z" fill=#e53935 stroke=${INK} stroke-width=12 />
  ${[[-35, -20], [30, -25], [0, 5], [-25, 35], [28, 30], [0, 55]].map(([a, b]) => `<ellipse cx=${a} cy=${b} rx=6 ry=9 fill=#ffe9a0 />`).join("")}
  <path d="M0 -62L-45 -88L-18 -70L-10 -105L5 -75L30 -100L22 -68L58 -80Z" fill=#43a047 stroke=${INK} stroke-width=9 stroke-linejoin=round /></g>`;
const seedBag = (x, y, w, o = {}) => { // 種の袋 (ハムの種)
  const h = w * 1.3, k = w / 200, g = o.gold;
  const b = box(`left:${x}px;top:${y}px;width:${w}px;height:${h}px;z-index:${o.z || 6};transform-origin:50% 50%`, "", o.p);
  box(`left:0;top:${14 * k}px;width:${w}px;height:${h - 14 * k}px;background:${g ? "linear-gradient(120deg,#ffe680,#d99a10 45%,#fff0a0 60%,#c98a00)" : "#d9b27c"};border:${5 * k}px solid ${INK};border-radius:${8 * k}px`, "", b);
  box(`left:0;top:0;width:${w}px;height:${22 * k}px;background:repeating-linear-gradient(90deg,${g ? "#b07a00" : "#b98a50"} 0 ${10 * k}px,${g ? "#ffd84a" : "#d9b27c"} ${10 * k}px ${20 * k}px);border:${4 * k}px solid ${INK};border-radius:${4 * k}px`, "", b);
  const lab = box(`left:${22 * k}px;top:${70 * k}px;width:${w - 44 * k}px;height:${100 * k}px;background:${g ? "#2a1030" : "#fff8e6"};border:${4 * k}px solid ${INK};border-radius:${12 * k}px`, "", b);
  add(`<div>${o.title || "ハムの種"}</div>`, `left:0;right:0;top:${6 * k}px;text-align:center;font-size:${(o.fs || 30) * k}px;color:${g ? "#ffd84a" : INK};white-space:nowrap`, lab);
  add(seedHtml(34 * k), `left:${(w - 44 * k) / 2 - 17 * k}px;top:${46 * k}px;width:${34 * k}px;height:${51 * k}px`, lab);
  return b; };
const sushi = (x, y, w, top, p, z = 6) => box(`left:${x}px;top:${y}px;width:${w}px;height:${w * .8}px;z-index:${z}`,
  `<svg viewBox="0 0 100 80" style="left:0;top:0;width:100%;height:100%;overflow:visible"><rect x=10 y=40 width=80 height=36 rx=16 fill=#fffdf5 stroke=${INK} stroke-width=4 /><path d="M4 44Q50 10 96 44Q96 54 50 54Q4 54 4 44Z" fill=${top} stroke=${INK} stroke-width=4 />
  <circle cx=36 cy=62 r=3.5 fill=${INK} /><circle cx=64 cy=62 r=3.5 fill=${INK} /><path d="M44 68Q50 72 56 68" fill=none stroke=${INK} stroke-width=3 stroke-linecap=round /></svg>`, p);
const edo = () => room("background:#e8d8ae", `<div style="left:0;top:0;width:960px;height:300px;background:#e8d8ae"></div>
  <div style="left:30px;top:50px;width:330px;height:245px;border:6px solid #6b4a2a;background:linear-gradient(90deg,#6b4a2a 3px,transparent 3px) 0 0/66px 100%,linear-gradient(#6b4a2a 3px,transparent 3px) 0 0/100% 61px,#fff8e6"></div>
  <div style="left:0;top:300px;width:960px;height:240px;background:repeating-linear-gradient(90deg,transparent 0 318px,#6d7a3a 318px 322px),#a9b86c"></div><div style="left:0;top:292px;width:960px;height:14px;background:#6b4a2a"></div>`);
const goze = (p, x, y, foods = ["🍚", "🍲", "🍵"], tag = "") => { const t = box(`left:${x}px;top:${y}px;width:150px;height:44px;background:#7a1f14;border:4px solid ${INK};border-radius:8px;z-index:5`, "", p);
  t.f = foods.map((f, i) => add(`<div>${f}</div>`, `left:${6 + i * 40}px;top:-36px;font-size:34px`, t)); if (tag) lb(tag, "left:0;top:46px;font-size:15px;background:#4a0f6a", t); return t; };
const sushiShop = () => { const L = room("background:#f0e0c0", `<div style="left:0;top:0;width:960px;height:250px;background:linear-gradient(#f4e6c8,#e6cf9e)"></div>
  <div style="left:0;top:306px;width:960px;height:234px;background:#b88a58;border-top:6px solid ${INK}"></div>`);
  L.lane = box(`left:0;top:250px;width:960px;height:58px;background:repeating-linear-gradient(90deg,#9a7a5a 0 30px,#7a5a3a 30px 60px) 0 0/300px 100%;border-top:6px solid ${INK};animation:ln .9s linear infinite;z-index:2`, "", L); return L; };
const platham = (x, y, p, dry = 0) => { const c = box(`left:${x}px;top:${y}px;width:130px;height:105px;z-index:7`, "", p);
  c.h = mh(N, 20, 0, 90, 2, c); box(`left:0;top:78px;width:130px;height:26px;background:#fff;border:4px solid ${INK};border-radius:50%;z-index:3`, "", c); return c; };
const mart = (dim = 0) => room("background:#eef3f0", `<div style="left:0;top:0;width:960px;height:330px;background:linear-gradient(#f4f8f6,#dfe9e4)"></div>
  <div style="left:0;top:330px;width:960px;height:210px;background:repeating-conic-gradient(#d8dde0 0 25%,#eef0f2 0 50%) 0 0/80px 80px"></div>
  <div style="left:280px;top:14px;width:400px;height:50px;background:#c62828;border:4px solid ${INK};border-radius:8px;color:#fff;font-size:30px;text-align:center;line-height:42px;z-index:2">精肉・お惣菜コーナー</div>`);
const sticker = (t, x, y, p, col = "#ffd23c", rot = 0) => box(`left:${x}px;top:${y}px;width:74px;height:74px;border-radius:50%;background:${col};border:4px solid #c62828;color:#c62828;font-size:${t.length > 3 ? 16 : 21}px;line-height:${t.length > 3 ? 20 : 66}px;text-align:center;rotate:${rot}deg;z-index:8;white-space:normal;padding:${t.length > 3 ? 16 : 0}px 4px 0`, t, p);
const dim = (L, a) => box(`left:0;top:0;width:960px;height:540px;background:#000;opacity:0;z-index:12;pointer-events:none`, "", L);

Object.assign(scenes, {
  async i_T01_01() { // 成敗した家老
    ham(N); await wait(600); chip("ヘッドショットで1キル"); say("ヘッドショット!", 480, 230, { size: 52, color: "#ff5a4a" }); burst(450, 284, 10);
    await wait(1100); const L = edo(); intro(L);
    const tono = zari(40, 200, 130, { parent: L, acc: "crown", z: 3 }); goze(L, 190, 352);
    const hm = mh(N, 300, 262, 120, 4, L); lb("毒見役ハム 百代目", "left:244px;top:232px;font-size:18px", L);
    const rope = `<path d="M36 84Q60 98 84 84" fill=none stroke=#a0782c stroke-width=6 />`;
    const P = box("left:330px;top:340px;width:260px;height:130px;z-index:6", "", L);
    box("left:78px;top:70px;width:96px;height:5px;background:#a0782c;border-radius:3px", "", P);
    zari(0, 20, 90, { parent: P, face: "angry", acc: "tie", extra: rope }); zari(165, 20, 90, { parent: P, acc: "helmet" });
    const door = box("left:640px;top:80px;width:150px;height:215px;background:#1a1210;z-index:2", "", L);
    const panel = box("left:640px;top:80px;width:150px;height:215px;background:linear-gradient(#f4e2b0,#e8cf8d);border:5px solid #5a3a1a;z-index:4;font-size:60px;text-align:center;line-height:215px", "🎍", L);
    const z2 = zari(665, 190, 100, { parent: L, acc: "tie", face: "evil", z: 3 }); z2.style.opacity = 0;
    add(`<div>🍵</div>`, "left:66px;top:56px;font-size:36px;z-index:20", z2);
    const w1 = walk(P, 0, 780, 3200, 7); await wait(500); bubble("ぐぬぬ…", 520, 290, 1100);
    await wait(1300); anim(panel, [{ transform: "none" }, { transform: "translateX(-160px)" }], 450);
    await wait(500); z2.style.opacity = 1; await anim(z2, [{ transform: "none" }, { transform: "translate(-30px,110px)" }], 500);
    await w1; P.remove(); await anim(z2, Array.from({ length: 7 }, (_, i) => ({ transform: `translate(${-30 - 235 * i / 6}px,${110 + 30 * i / 6 - (i % 2 ? 14 : 0)}px)` })), 800, { easing: "linear" });
    const eyes = ov(hm, whiteEyes + frown + sweatD);
    const jar = box("left:455px;top:70px;width:170px;height:200px;background:radial-gradient(circle at 35% 30%,#8a5aa8,#3d1f52);border:5px solid #331c16;border-radius:36px 36px 56px 56px;z-index:9", "", L);
    box("left:40px;top:-24px;width:84px;height:24px;background:#6b4a2a;border:4px solid #331c16;border-radius:6px", "", jar);
    const lab = box("left:18px;top:44px;width:124px;height:112px;background:#fff8e6;border:4px solid #331c16;border-radius:10px;color:#222", "", jar);
    add(`<div>毒</div>`, "left:0;right:0;top:0;text-align:center;font-size:44px;color:#c00", lab); add(`<div>業務用</div>`, "left:0;right:0;top:52px;text-align:center;font-size:22px", lab); add(`<div>5リットル</div>`, "left:0;right:0;top:78px;text-align:center;font-size:21px", lab);
    pop(jar, 300); await wait(400); zf(tono, { acc: "crown", face: "shock" }); await wait(2300); fade(L, 400); await wait(900);
  },

  async i_T01_08() { // 解毒剤を飲んだ日
    ham(N); await wait(500); chip("チャネポ「解毒剤」を交換"); say("解毒剤!", 480, 230, { size: 56, color: "#7dff8a" }); await wait(1000);
    const L = edo(); intro(L);
    const tono = zari(700, 190, 140, { parent: L, acc: "crown", z: 3 }); const t2 = goze(L, 676, 350, ["🍚", "🍲", "🍵"], "毒入り");
    const hm = mh(N, 330, 256, 150, 4, L); const t1 = goze(L, 300, 372, ["🍤", "🍲", "🍙"], "毒入り");
    await wait(500); const vial = add(`<div>🧪</div>`, "left:300px;top:240px;font-size:54px;z-index:9", L); const vl = lb("解毒剤", "left:290px;top:205px;font-size:18px;background:#1a6a2a", L); pop(vial, 250);
    await wait(500); await anim(vial, [{ transform: "none" }, { transform: "translate(80px,40px) rotate(70deg)" }], 450); say("ごくごく", 440, 200, { size: 40, color: "#7dff8a", ms: 700 });
    await wait(500); vial.remove(); vl.remove(); hm.style.filter = "drop-shadow(0 0 14px #5f5)"; hop(hm, 40);
    for (const f of t1.f) { await anim(f, [{ transform: "none" }, { transform: "translate(60px,-80px) scale(.4)", opacity: 0 }], 260); hop(hm, 14); }
    say("完食!", 420, 190, { size: 52, ms: 800 }); const m = ov(hm, openMouth); await wait(500);
    const notes = () => { const n = add(`<div>${["♪", "♫"][Math.floor(rnd(0, 2))]}</div>`, `left:${rnd(300, 480)}px;top:240px;font-size:40px;color:#e0409a;z-index:9`, L); anim(n, [{ transform: "none", opacity: 1 }, { transform: "translateY(-100px)", opacity: 0 }], 900).then(() => n.remove()); };
    const dance = (async () => { for (let i = 0; i < 7; i++) { notes(); await anim(hm, [{ transform: "rotate(-9deg)" }, { transform: "translateY(-30px) rotate(9deg)", offset: .5 }, { transform: "rotate(-9deg)" }], 420, { easing: "linear" }); } hm.style.transform = "none"; })();
    await wait(300); bubble("毒見はまだか", 700, 160, 1100); zf(tono, { acc: "crown", face: "angry" });
    await wait(1300); bubble("…自分で食べる", 700, 160, 800); await wait(500); hop(tono, 20); await wait(500);
    t2.f.forEach(f => anim(f, [{ opacity: 1 }, { opacity: 0 }], 200)); zf(tono, { acc: "crown", face: "shock", extra: `<path d="M41 29L53 41M53 29L41 41M67 29L79 41M79 29L67 41" stroke=${INK} stroke-width=3.5 stroke-linecap=round />` });
    say("バタン!", 700, 170, { size: 50, color: "#cfe0ff" });
    await anim(tono, [{ transform: "none" }, { transform: "translate(20px,40px) rotate(86deg)" }], 400, { easing: "ease-in" });
    const gh = add(`<div>👻</div>`, "left:790px;top:300px;font-size:44px;z-index:9;opacity:.85", L); anim(gh, [{ transform: "none" }, { transform: "translateY(-120px)", opacity: 0 }], 1300);
    await wait(900); const gd = zari(1000, 300, 90, { parent: L, acc: "helmet", z: 6 }); await anim(gd, [{ transform: "none" }, { transform: "translateX(-380px)" }], 600);
    bubble("次の殿様、前へ", 640, 235, 1500); await wait(900);
    anim(tono, [{ opacity: 1, filter: "brightness(2)" }, { opacity: 0, filter: "brightness(3)" }], 500);
    const t3 = zari(1000, 190, 120, { parent: L, acc: "crown", z: 3 }); await anim(t3, [{ transform: "none" }, { transform: "translateX(-300px)" }], 700);
    lb("二代目 殿様", "left:736px;top:166px;font-size:20px;background:#6a1a1a", L); await wait(1700); fade(L, 400); await wait(800);
  },

  async i_T02_04() { // 天秤ナイフ
    ham(N); await wait(500); chip("ウルトでチーム全体を巻き込んでキル"); say("ウルト!!", 480, 230, { size: 60 }); burst(480, 284, 12); await wait(1000);
    const L = room("background:linear-gradient(#ffe6ef,#fff6e6 62%,#e6cfae 62%)"); intro(L);
    box("left:372px;top:300px;width:16px;height:190px;background:#8a6a4a;border:3px solid #331c16", "", L); box("left:310px;top:478px;width:140px;height:30px;background:#8a6a4a;border:4px solid #331c16;border-radius:14px", "", L);
    const B = box("left:100px;top:292px;width:560px;height:16px;background:#6b4a2a;border:3px solid #331c16;border-radius:8px;z-index:4;transform-origin:50% 50%", "", L);
    const pan = (cx, w) => { const c = box(`left:${cx - w / 2}px;top:0;width:${w}px;height:130px;transform-origin:${w / 2}px 8px`, "", B);
      add(`<svg viewBox="0 0 ${w} 130" style="left:0;top:0;width:100%;height:100%"><path d="M${w / 2} 8L8 100M${w / 2} 8L${w - 8} 100" stroke=#555 stroke-width=3 /></svg>`, "", c);
      box(`left:0;top:92px;width:${w}px;height:22px;background:#c9ccd6;border:4px solid #331c16;border-radius:0 0 ${w / 2}px ${w / 2}px/0 0 22px 22px;z-index:3`, "", c); return c; };
    const pl = pan(0, 150), pr = pan(560, 230);
    const piece = (w, berries) => { const c = box(`left:0;top:0;width:${w}px;height:110px;border-radius:10px 10px 4px 4px;background:linear-gradient(#fff 0 32%,#f6b6c8 32% 40%,#e8b27a 40%);border:4px solid #331c16;z-index:5`, "", L); if (berries) for (let i = 0; i < 3; i++) add(`<div>🍓</div>`, `left:${w * (.15 + i * .3)}px;top:-26px;font-size:40px`, c); return c; };
    const cakeL = piece(40, 0), cakeR = piece(320, 1); cakeL.style.left = "200px"; cakeL.style.top = "130px"; cakeR.style.left = "244px"; cakeR.style.top = "130px";
    const mkSide = (c, par, tx) => { const p = c.cloneNode(true); p.style.cssText += `;left:${tx}px;top:${92 - 110 * .6 + 2}px;transform:scale(.6);transform-origin:50% 100%;display:none`; par.append(p); return p; };
    const pL = mkSide(cakeL, pl, 55), pR = mkSide(cakeR, pr, 18);
    const rich = mh(R2, 790, 300, 150, 6, L); ov(rich, shades);
    const zs = Array.from({ length: 18 }, (_, i) => zari(20 + rnd(0, 100), 310 + (i % 3) * 14 - rnd(0, 6), 56, { parent: L, z: 6 + i % 3 }));
    lb("ザリガニ ×100匹", "left:30px;top:250px;font-size:20px", L);
    const knife = box("left:206px;top:-340px;width:60px;height:340px;z-index:9", `<svg viewBox="0 0 60 340" style="left:0;top:0;width:100%;height:100%"><rect x=18 y=0 width=24 height=100 rx=8 fill=#6b4a2a stroke=#331c16 stroke-width=5 /><rect x=12 y=96 width=36 height=12 fill=#c9ccd6 stroke=#331c16 stroke-width=4 /><path d="M14 108H46V320Q30 340 14 320Z" fill=#e8ecf2 stroke=#331c16 stroke-width=5 stroke-linejoin=round /><path d="M24 118V300" stroke=#fff stroke-width=5 /></svg>`, L);
    await wait(500); await anim(knife, [{ transform: "none" }, { transform: "translateY(480px)" }], 260, { easing: "ease-in" }); say("一刀両断!!", 480, 100, { size: 56, color: "#ff5a4a" });
    anim(knife, [{ transform: "translateY(480px)" }, { transform: "translateY(480px) rotate(12deg)", opacity: 0 }], 500);
    anim(cakeL, [{ transform: "none" }, { transform: "translate(-30px,260px) scale(.6) rotate(-15deg)" }], 650, { easing: "ease-in" }); await anim(cakeR, [{ transform: "none" }, { transform: "translate(10px,-20px)", offset: .2 }, { transform: "translate(110px,230px) scale(.6) rotate(8deg)" }], 650, { easing: "ease-in" });
    cakeL.remove(); cakeR.remove(); pL.style.display = pR.style.display = "block";
    const ang = 20; const ease = "cubic-bezier(.3,1.6,.5,1)";
    anim(B, [{ transform: "none" }, { transform: `rotate(${ang}deg)` }], 420, { easing: ease }); anim(pl, [{ transform: "none" }, { transform: `rotate(${-ang}deg)` }], 420, { easing: ease }); anim(pr, [{ transform: "none" }, { transform: `rotate(${-ang}deg)` }], 420, { easing: ease });
    say("ズシン!!", 640, 440, { size: 60, color: "#ff8a5a", ms: 1000 }); shake(rich); box("left:40px;top:150px", "", L);
    zs.forEach((z, i) => { const dx = rnd(-10, 330), up = rnd(-190, -300); anim(z, [{ transform: "none" }, { transform: `translate(${dx * .6}px,${up}px) rotate(${rnd(-90, 90)}deg)`, offset: .45 }, { transform: `translate(${dx}px,${up + 120}px) rotate(${rnd(-200, 200)}deg)` }], 2200, { easing: "ease-out", delay: rnd(0, 150) });
      anim(z.firstChild, [{ transform: "rotate(-25deg)" }, { transform: "rotate(25deg)" }], 140, { iterations: 14, direction: "alternate", easing: "linear" }); });
    await wait(500); lb("1割", "left:16px;top:360px;font-size:30px;background:#c62828", L); lb("9割", "left:500px;top:420px;font-size:36px;background:#2a7a2a;z-index:20", L);
    await wait(1200); say("100匹、空へ", 520, 150, { size: 44, color: "#fff", ms: 1500 }); await wait(2300); fade(L, 400); await wait(800);
  },

  async i_T02_08() { // イチゴ引換券の中身
    ham(N); await wait(500); chip("チャネポ「イチゴ引換券」を交換"); say("引換券!", 480, 230, { size: 56 }); await wait(1000);
    const L = room("background:linear-gradient(#ffd9e4,#fff0f4)"); intro(L);
    const hm = mh(R2, 560, 130, 300, 6, L); ov(hm, shades); const berry = ov(hm, berrySvg(620, 140, 1)); box("left:0;top:410px;width:960px;height:130px;background:#c28a52;border-top:6px solid #331c16;z-index:8", "", L);
    const zr = zari(60, 240, 170, { parent: L, face: "smile", z: 7 });
    const tk = box("left:240px;top:300px;width:170px;height:62px;background:#ffe28a;border:4px dashed #b8860b;color:#6a4a00;font-size:21px;text-align:center;line-height:54px;z-index:9;rotate:-6deg", "イチゴ引換券", L);
    pop(tk, 260); await wait(1000);
    const cakePlate = box("left:330px;top:392px;width:200px;height:30px;background:#fff;border:4px solid #331c16;border-radius:50%;z-index:9", "", L); box("left:360px;top:362px;width:140px;height:44px;background:linear-gradient(#fff 0 40%,#e8b27a 40%);border:4px solid #331c16;border-radius:10px 10px 4px 4px;z-index:9", "", L);
    const mg = add(`<div>🔍</div>`, "left:330px;top:300px;font-size:80px;z-index:12", L); say("イチゴ…イチゴ…", 440, 250, { size: 36, color: "#fff", ms: 1800, z: 60 });
    for (const dx of [0, 140, 40, 150, 70]) { await anim(mg, [{ transform: "none" }, { transform: `translate(${dx - 60}px,${dx % 2 ? 20 : 0}px) rotate(${dx / 8 - 10}deg)` }], 330, { easing: "ease-in-out" }); }
    await wait(300); mg.remove(); say("ありました!", 440, 250, { size: 44 });
    const hata = add(`<svg viewBox="0 0 80 50" style="left:290px;top:340px;width:90px;height:56px;overflow:visible;z-index:12"><path d="M40 8L22 2L30 14L8 20L30 26L24 44L40 32L56 44L50 26L72 20L50 14L58 2Z" fill=#43a047 stroke=#331c16 stroke-width=4 stroke-linejoin=round /></svg>`, "z-index:12", L);
    await anim(hata, [{ transform: "none" }, { transform: "translate(-110px,-30px)" }], 600); zf(zr, { face: "shock" });
    bubble("…ヘタ?", 150, 180, 1500); say("ヘタだけ", 330, 330, { size: 40, color: "#ff8a5a", ms: 1700, z: 60 }); await wait(1000);
    anim(hm, [{ transform: "none" }, { transform: "rotate(16deg) translateX(30px)" }], 500); ov(hm, sweatD); await wait(600);
    zf(zr, { face: "sad" }); lb("(頭が…)", "left:610px;top:100px;font-size:20px;background:#6a1a1a;z-index:20", L); await wait(2200); fade(L, 400); await wait(800);
  },

  async i_T03_06() { // 回りすぎてカピカピ
    ham(N); await wait(500); chip("試合に敗北"); say("敗北…", 480, 230, { size: 56, color: "#9db4d8" }); await wait(900);
    const L = sushiShop(); intro(L); const chef = zari(400, 70, 130, { parent: L, acc: "chef", z: 3 });
    const cnt = lb("1周目", "right:20px;top:20px;font-size:28px;z-index:20", L);
    const cols = ["#ff8a65", "#ffd54f", "#d32f2f", "#ff8a65", "#ffd54f"]; cols.forEach((c, i) => sushi(40 + i * 180, 370, 110, c, L, 6));
    const pt = platham(-140, 188, L); const filters = ["none", "saturate(.7) sepia(.3) brightness(.95)", "saturate(.3) sepia(.7) brightness(.85) contrast(.9)"]; const says = ["サーモンで", "たまご", "ネギトロ"];
    for (let i = 0; i < 3; i++) { cnt.textContent = ["1周目", "12周目", "30周目"][i]; pt.h.img.style.filter = filters[i];
      if (i === 2) { ov(pt.h, `<path d="M300 280l70 90-60 60 80 100M850 300l-60 80 50 60M560 150l30 70-40 40M300 700l80-40 60 50M820 760l-90-30" stroke=${INK} stroke-width=26 fill=none stroke-linecap=round />` + whiteEyes + frown); pt.h.style.transform = "scale(.88,.94)"; }
      bubble(says[i], 140 + i * 260, 330, 1100); await anim(pt, [{ transform: "none" }, { transform: "translateX(1100px)" }], 2000, { easing: "linear" }); pt.style.transform = "none"; }
    await anim(pt, [{ transform: "none" }, { transform: "translateX(560px)" }], 700, { easing: "ease-out" }); L.lane.style.animationPlayState = "paused";
    bubble("売れ残りですな", 590, 120, 1600); await wait(1000);
    const wrap = box("left:0;top:-4px;width:130px;height:108px;background:linear-gradient(125deg,#fff8 0 20%,#fff3 20% 40%,#fff7 40% 55%,#fff3 55%);border:3px solid #fff9;border-radius:40% 40% 20% 20%;transform-origin:0 50%;z-index:9", "", pt); anim(wrap, [{ transform: "scaleX(0)" }, { transform: "none" }], 500);
    await wait(800); const tag = box("left:560px;top:226px;width:150px;height:40px;background:#fff8e6;border:4px solid #331c16;border-radius:6px;color:#c62828;font-size:22px;text-align:center;line-height:32px;z-index:20;rotate:-6deg", "お持ち帰り", L); anim(tag, [{ transform: "translateY(-80px) scale(2)", opacity: 0 }, { transform: "none", opacity: 1 }], 220, { easing: "ease-in" });
    await wait(2400); fade(L, 400); await wait(800);
  },

  async i_T03_10() { // 本日終了、まかない
    ham(N); await wait(500); chip("配信終了"); say("おつかれ!", 480, 230, { size: 56 }); await wait(900);
    const L = sushiShop(); intro(L); const chef = zari(0, 0, 110, { parent: L, acc: "chef", z: 3 });
    const CH = box("left:420px;top:100px;width:200px;height:140px;z-index:5", "", L); CH.append(chef); chef.style.left = "0"; chef.style.top = "0";
    const doorG = box("left:810px;top:150px;width:120px;height:260px;background:#2a1a14;border:5px solid #331c16;z-index:4;overflow:hidden", "", L);
    const dl = box("left:810px;top:150px;width:62px;height:260px;background:#a0703c;border:5px solid #331c16;z-index:8", "", L), dr = box("left:868px;top:150px;width:62px;height:260px;background:#a0703c;border:5px solid #331c16;z-index:8", "", L);
    const sign = box("left:820px;top:100px;width:100px;height:36px;background:#f0e0b0;border:4px solid #331c16;color:#222;font-size:18px;white-space:nowrap;text-align:center;line-height:28px;z-index:9", "まかない", L);
    const cust = [["#ff8a65", 40], ["#ffd54f", 220], ["#d32f2f", 400]].map(([c, x]) => sushi(x, 370, 110, c, L, 6));
    const pt = platham(560, 188, L); await wait(900);
    const nor = box("left:0;top:-80px;width:960px;height:80px;z-index:25;background:repeating-linear-gradient(90deg,#c62828 0 238px,#7a1010 238px 242px);border-bottom:8px solid #331c16;color:#fff;font-size:44px;text-align:center;line-height:68px", "本日終了", L);
    await anim(nor, [{ transform: "none" }, { transform: "translateY(80px)" }], 600, { easing: "cubic-bezier(.3,1.5,.5,1)" }); L.lane.style.animationPlayState = "paused";
    cust.forEach((c, i) => anim(c, [{ transform: "none" }, { transform: "translateY(260px)" }], 600, { delay: i * 200, easing: "ease-in" })); bubble("ごちそうさま", 120, 330, 1000); await wait(1400);
    pt.style.transform = "none"; pt.style.left = "60px"; pt.style.top = "58px"; pt.style.zIndex = 6; CH.append(pt); pt.style.transformOrigin = "0 0"; pt.style.scale = ".8";
    await walk(CH, 0, 330, 1300, 4); anim(dl, [{ transform: "none" }, { transform: "translateX(-54px)" }], 300); await anim(dr, [{ transform: "none" }, { transform: "translateX(54px)" }], 300);
    await anim(CH, [{ transform: "translateX(330px)" }, { transform: "translateX(400px)", opacity: 0 }], 400); await wait(200);
    anim(dl, [{ transform: "translateX(-54px)" }, { transform: "translateX(-24px)" }], 300); await anim(dr, [{ transform: "translateX(54px)" }, { transform: "translateX(24px)" }], 300);
    const hand = box("left:835px;top:270px;width:70px;height:40px;z-index:7;transform-origin:50% 100%", `<div style="left:20px;top:14px;width:46px;height:18px;background:#fbcbc3;border:4px solid #331c16;border-radius:9px"></div><div style="left:2px;top:4px;width:30px;height:30px;background:#fbcbc3;border:4px solid #331c16;border-radius:50%"></div>`, L);
    hand.style.left = "835px"; hand.style.scale = "1.7"; anim(hand, [{ transform: "rotate(-25deg)" }, { transform: "rotate(25deg)" }], 260, { iterations: 8, direction: "alternate", easing: "ease-in-out" });
    bubble("また明日", 740, 100, 1800); await wait(2300); fade(L, 400); await wait(800);
  },

  async i_T04_04() { // 定価の一瞬
    ham(N); await wait(500); chip("ウルトを発動してキル"); say("ウルト!!", 480, 230, { size: 60 }); burst(480, 284, 12); await wait(1000);
    const L = mart(); intro(L); const dm = dim(L); const hm = mh(N, 140, 170, 260, 6, L);
    box("left:100px;top:420px;width:340px;height:44px;background:#f4f4f4;border:4px solid #331c16;border-radius:6px;z-index:5", "", L);
    const stk = [["2割引", 150, 250, "#ffd23c", -12], ["3割引", 300, 230, "#ffd23c", 8], ["半額", 200, 330, "#ff9a3c", -6], ["半額", 340, 330, "#ff9a3c", 14], ["見切り品", 250, 190, "#ff5a5a", 4], ["値下げ", 160, 400, "#ffd23c", -20]].map(([t, x, y, c, r]) => sticker(t, x, y, L, c, r));
    box("left:560px;top:380px;width:300px;height:60px;background:#e8b27a;border:4px solid #331c16;z-index:5", "", L);
    for (let i = 0; i < 5; i++) box(`left:${580 + i * 52}px;top:${356 + (i % 2) * 6}px;width:48px;height:34px;border-radius:50%;background:radial-gradient(#d8923a,#a8621a);border:3px solid #331c16;z-index:6`, "", L);
    box("left:590px;top:270px;width:250px;height:50px;background:#c62828;border:4px solid #331c16;color:#fff;font-size:20px;text-align:center;line-height:42px;z-index:6;white-space:nowrap", "揚げたてコロッケ 半額", L);
    const zs = [[620, 300], [700, 305], [780, 300]].map(([x, y], i) => zari(x + 150, y, 80, { parent: L, z: 7 + i, extra: `<path d="M2 120h30v8h-30z" fill=none />` })); const bk = zs.map((z, i) => add(`<div>🧺</div>`, "left:-6px;top:56px;font-size:32px", z));
    await wait(300); zs.forEach((z, i) => anim(z, [{ transform: "none" }, { transform: "translateX(-150px)" }], 700, { delay: i * 120 }));
    await wait(1100); chip("ウルトを発動してキル"); const fl = box("left:0;top:0;width:960px;height:540px;background:#fff;z-index:30", "", L); anim(fl, [{ opacity: 1 }, { opacity: 0 }], 500).then(() => fl.remove());
    anim(dm, [{ opacity: 0 }, { opacity: .5 }], 300, {}); const sp = box("left:0;top:0;width:960px;height:540px;z-index:4;background:linear-gradient(#fff3a0,#fff3a000);clip-path:polygon(200px 0,400px 0,520px 480px,20px 480px);opacity:.75", "", L); anim(sp, [{ opacity: 0 }, { opacity: .75 }], 300);
    stk.forEach((e, i) => anim(e, [{ transform: "none" }, { transform: `translate(${(i - 2.5) * 180}px,${-200 - i * 40}px) rotate(${rnd(300, 800)}deg)`, opacity: 0 }], 800, { easing: "ease-out" }));
    hm.style.filter = "drop-shadow(0 0 18px gold)"; hop(hm, 40);
    const tg = box("left:190px;top:330px;width:200px;height:120px;z-index:9;rotate:-5deg;background:#fff;border:5px solid #331c16;border-radius:12px;color:#c62828;text-align:center", "", L);
    add(`<div>定価</div>`, "left:0;right:0;top:4px;font-size:28px;color:#222", tg); add(`<div>¥980</div>`, "left:0;right:0;top:36px;font-size:62px", tg); pop(tg, 300);
    for (let i = 0; i < 8; i++) { await wait(220); const f = add(`<div>✦</div>`, `left:${rnd(130, 420)}px;top:${rnd(150, 420)}px;font-size:${rnd(40, 80)}px;color:#ffe066;z-index:30;text-shadow:0 0 12px gold`, L); anim(f, [{ transform: "scale(.2)", opacity: 1 }, { transform: "scale(1.1)", offset: .4 }, { transform: "scale(.3)", opacity: 0 }], 400).then(() => f.remove()); }
    bubble("コロッケ!!", 700, 240, 1000); zs.forEach(z => hop(z, 20)); await wait(1100); ov(hm, whiteEyes + frown + sweatD); bubble("半額だ!", 760, 240, 900);
    await wait(2000); fade(L, 400); await wait(800);
  },

  async i_T04_06() { // 蛍の光とカゴ
    ham(N); await wait(500); chip("試合に敗北"); say("敗北…", 480, 230, { size: 56, color: "#9db4d8" }); await wait(900);
    const L = mart(); intro(L); const dm = dim(L); anim(dm, [{ opacity: 0 }, { opacity: .4 }], 5000);
    const hm = mh(N, 120, 200, 230, 6, L); ov(hm, closedEyes + frown + tears); box("left:90px;top:420px;width:300px;height:44px;background:#f4f4f4;border:4px solid #331c16;border-radius:6px;z-index:5", "", L);
    const sts = [["半額", 130, 300, "#ff9a3c", -8], ["見切り品", 270, 330, "#ff5a5a", 10], ["2割引", 190, 380, "#ffd23c", 4]].map(([t, x, y, c, r]) => sticker(t, x, y, L, c, r));
    const exit = box("left:0;top:150px;width:70px;height:240px;background:#2a1a14;border:5px solid #331c16;color:#fff;z-index:3;font-size:20px;text-align:center;padding-top:10px", "出口", L);
    const hot = say("♪蛍の光♪", 680, 110, { size: 40, color: "#ffd0e8", ms: 0, z: 60 });
    const cs = [[480, 300], [600, 310], [720, 300]].map(([x, y]) => { const z = zari(x, y, 80, { parent: L, z: 7 }); add(`<div>🧺</div>`, "left:-6px;top:56px;font-size:32px", z); return z; });
    await wait(500); for (const [i, z] of cs.entries()) { walk(z, 0, -(z.offsetLeft + 20), 1800, 5).then(() => z.remove()); await wait(500); }
    await wait(1500); const CB = box("left:1000px;top:300px;width:200px;height:150px;z-index:9", "", L);
    const cl = zari(70, 0, 100, { parent: CB, acc: "tie" }); const hs = mh(N, 20, 24, 70, 2, CB); ov(hs, closedEyes + tears); box("left:0;top:76px;width:120px;height:68px;background:#e65a3a;border:4px solid #331c16;border-radius:6px 6px 18px 18px;z-index:5;background-image:repeating-linear-gradient(90deg,#0003 0 4px,transparent 4px 16px)", "", CB);
    const tag = box("left:-10px;top:-24px;width:130px;height:36px;background:#fff8e6;border:4px solid #c62828;color:#c62828;font-size:18px;text-align:center;line-height:28px;z-index:12;rotate:-6deg;white-space:nowrap", "", CB);
    await anim(CB, [{ transform: "none" }, { transform: "translateX(-600px)" }], 900); hm.style.visibility = "hidden"; sts.forEach(e => e.remove());
    anim(hs, [{ transform: "translate(300px,40px)" }, { transform: "none" }], 300); hs.style.left = "20px"; await wait(400); tag.textContent = "お買い得品";
    for (const [t, dx] of [["おつとめ品", 260], ["ペットフード用", 520]]) { await wait(900); await anim(CB, [{ transform: `translateX(${-600 + dx - 260}px)` }, { transform: `translateX(${-600 + dx}px)` }], 900, { easing: "linear" }); tag.textContent = t; if (t === "ペットフード用") { tag.style.fontSize = "16px"; hop(CB, 10); } }
    const dg = add(`<div>🐕</div>`, "left:870px;top:330px;font-size:56px;z-index:9", L); pop(dg, 250); bubble("ワン!", 890, 290, 1200); await wait(1800); hot.remove(); fade(L, 400); await wait(800);
  },

  async i_T04_07() { // レシートが長い
    ham(N); await wait(500); chip("ビッツ300を投げ銭"); say("ビッツ300!", 480, 230, { size: 56 }); burst(480, 284, 10); await wait(1000);
    const L = mart(); intro(L); box("left:0;top:496px;width:960px;height:6px;background:#9aa;z-index:2", "", L);
    box("left:40px;top:392px;width:440px;height:40px;background:repeating-linear-gradient(90deg,#444 0 24px,#333 24px 48px);border:4px solid #331c16;z-index:3", "", L); box("left:480px;top:392px;width:76px;height:40px;background:#9ad;border:4px solid #331c16;z-index:3", "", L);
    const reg = box("left:560px;top:250px;width:260px;height:180px;background:#6a7a9a;border:5px solid #331c16;border-radius:10px;z-index:4", "", L);
    const scr = box("left:575px;top:196px;width:200px;height:60px;background:#1a3a1a;border:5px solid #331c16;border-radius:6px;color:#7dff8a;font-size:24px;text-align:center;line-height:50px;z-index:4;white-space:nowrap", "ようこそ", L);
    box("left:600px;top:244px;width:120px;height:12px;background:#111;z-index:5", "", L);
    const zr = zari(60, 190, 150, { parent: L, z: 5 }); const hm = mh(N, 30, 300, 110, 5, L); hm.style.left = "30px";
    [["半額", 40, 12], ["2割引", 55, 56], ["見切り品", 5, 38], ["3割引", 10, -10]].forEach(([t, x, y], i) => { const e = sticker(t, 0, 0, hm, ["#ffd23c", "#ff9a3c", "#ff5a5a", "#ffd23c"][i], i * 11 - 15); e.style.cssText += `;left:${x * 1.3}px;top:${y * 1.3 + 20}px;width:44px;height:44px;font-size:12px;line-height:14px;padding:10px 0 0;border-width:3px`; });
    await wait(500); const laser = box("left:488px;top:380px;width:60px;height:4px;background:#f22;box-shadow:0 0 10px #f22;z-index:6;opacity:0", "", L);
    await anim(hm, [{ transform: "none" }, { transform: "translateX(420px)" }], 1000, { easing: "ease-in-out" });
    for (let i = 0; i < 4; i++) { laser.style.opacity = 1; scr.textContent = "ピッ…"; say("ピッ…", 520, 330, { size: 36, color: "#fff", ms: 450, z: 60 }); await anim(laser, [{ transform: "translateY(0)" }, { transform: "translateY(-30px)" }, { transform: "translateY(0)" }], 500); laser.style.opacity = 0; scr.textContent = i < 3 ? "読み取り中…" : "エラー"; if (i === 1) zf(zr, { face: "sad" }); await wait(250); }
    zf(zr, { face: "shock" }); scr.textContent = "印刷中"; await wait(500);
    const rc = box("left:640px;top:250px;width:140px;height:250px;background:#fff;border:3px solid #999;z-index:8;color:#222;font-size:15px;clip-path:inset(0 0 100% 0);padding:4px 8px", "", L);
    ["ハム 定価 ¥980", "2割引 −¥196", "3割引 −¥235", "半額 −¥274", "見切り品 −¥150", "値下げ −¥100", "おつとめ −¥24"].forEach((t, i) => add(`<div>${t}</div>`, `left:8px;top:${8 + i * 22}px;white-space:nowrap`, rc));
    add(`<div>合計</div>`, "left:8px;top:176px;font-size:20px", rc); add(`<div>¥1</div>`, "right:10px;top:196px;font-size:46px;color:#c62828", rc);
    await anim(rc, [{ clipPath: "inset(0 0 100% 0)" }, { clipPath: "inset(0 0 0% 0)" }], 1800, { easing: "steps(14)" });
    say("合計 ¥1", 330, 120, { size: 60, color: "#ffd23c", ms: 1800, z: 60 }); await wait(2600); fade(L, 400); await wait(800);
  },

  async i_T05_04() { // ビッグサイズの罠
    ham(N); await wait(500); chip("ウルトを発動してキル"); say("ウルト!!", 480, 230, { size: 60 }); burst(480, 284, 12); await wait(1000);
    const L = room("background:radial-gradient(#fff6d0,#f0d9a0)"); intro(L); const hm = mh(N, 770, 300, 170, 6, L); ov(hm, `<ellipse cx=250 cy=700 rx=110 ry=80 fill=#d9a99a opacity=.0 />`);
    const bag = seedBag(380, 140, 200, { z: 8, p: L }); pop(bag, 250); const pr = box("left:520px;top:130px;width:80px;height:80px;border-radius:50%;background:#ffd23c;border:4px solid #c62828;color:#c62828;text-align:center;line-height:70px;font-size:26px;z-index:12", "¥300", L);
    await wait(1100); chip("ウルトを発動してキル"); const fl = box("left:0;top:0;width:960px;height:540px;background:#fff;z-index:30", "", L); anim(fl, [{ opacity: 1 }, { opacity: 0 }], 450).then(() => fl.remove());
    const star = box("left:250px;top:30px;width:460px;height:200px;background:#e53935;clip-path:polygon(50% 0,58% 20%,80% 8%,76% 30%,100% 36%,80% 52%,96% 74%,72% 70%,66% 100%,50% 82%,34% 100%,28% 70%,4% 74%,20% 52%,0 36%,24% 30%,20% 8%,42% 20%);z-index:14;color:#ffe066;font-size:50px;text-align:center;line-height:200px;-webkit-text-stroke:0", "ビッグサイズ!", L);
    anim(star, [{ transform: "scale(.2) rotate(-30deg)", opacity: 0 }, { transform: "scale(1.1) rotate(4deg)", opacity: 1, offset: .6 }, { transform: "none" }], 400);
    anim(bag, [{ transform: "none" }, { transform: "scale(1.7)", offset: .5 }, { transform: "scale(1.5)" }], 500, {}); anim(pr, [{ transform: "none" }, { transform: "translate(150px,90px) scale(1.5)" }], 500);
    for (let i = 0; i < 6; i++) { const f = add(`<div>✦</div>`, `left:${rnd(250, 700)}px;top:${rnd(60, 440)}px;font-size:${rnd(40, 80)}px;color:#ffd23c;z-index:30;text-shadow:0 0 12px gold`, L); anim(f, [{ transform: "scale(.2)", opacity: 1 }, { transform: "scale(1.1)", offset: .4 }, { transform: "scale(.3)", opacity: 0 }], 500, { delay: i * 90 }).then(() => f.remove()); }
    await wait(1900); say("ビリッ!", 480, 70, { size: 54, color: "#fff", ms: 700, z: 60 }); star.remove(); pr.remove();
    const pouches = []; for (let r = 0; r < 2; r++) for (let c = 0; c < 5; c++) { const p = box(`left:${200 + c * 108}px;top:${150 + r * 150}px;width:90px;height:120px;background:#d9b27c;border:4px solid #331c16;border-radius:6px;z-index:7`, "", L);
      box("left:0;top:0;width:82px;height:12px;background:repeating-linear-gradient(90deg,#b98a50 0 8px,#d9b27c 8px 16px)", "", p); add(seedHtml(18), "left:30px;top:56px;width:18px;height:27px", p); add(`<div>種1粒</div>`, "left:0;right:0;top:92px;font-size:14px;text-align:center;color:#222;white-space:nowrap", p); pouches.push(p); }
    anim(bag, [{ transform: "scale(1.5)", opacity: 1 }, { transform: "scale(1.5) translateY(420px) rotate(14deg)", opacity: 0 }], 600, { easing: "ease-in" });
    pouches.forEach((p, i) => anim(p, [{ transform: "scale(.1)", opacity: 0 }, { transform: "scale(1.1)", opacity: 1, offset: .7 }, { transform: "none", opacity: 1 }], 260, { delay: 300 + i * 70 }));
    await wait(1600); const ring = box("left:250px;top:130px;width:130px;height:130px;border-radius:50%;border:8px solid #331c16;background:#fffa;z-index:15", "", L); add(seedHtml(40), "left:42px;top:30px;width:40px;height:60px", ring); anim(ring, [{ transform: "scale(.3)", opacity: 0 }, { transform: "none", opacity: 1 }], 250);
    say("小袋10個 × 種1粒", 400, 70, { size: 46, color: "#ffd23c", ms: 1800, z: 60 }); await wait(1000); bubble("原材料高騰のため", 800, 270, 1600); await wait(1800); fade(L, 400); await wait(800);
  },

  async i_T05_07() { // プレミアム版の中身
    ham(N); await wait(500); chip("ビッツ500を投げ銭"); say("ビッツ500!", 480, 230, { size: 56 }); burst(480, 284, 12); await wait(1000);
    const L = room("background:radial-gradient(#4a2a6a,#1c1030)"); intro(L); const hm = mh(N, 770, 300, 170, 6, L); const zr = zari(40, 300, 130, { parent: L, z: 6 });
    const old = seedBag(300, 130, 170, { z: 8, p: L }); const p1 = box("left:420px;top:130px;width:80px;height:36px;background:#fff8e6;border:4px solid #331c16;color:#222;font-size:24px;text-align:center;line-height:28px;z-index:12;rotate:8deg", "¥300", L);
    pop(old, 250); await wait(1200); const fl = box("left:0;top:0;width:960px;height:540px;background:#fff;z-index:30", "", L); anim(fl, [{ opacity: 1 }, { opacity: 0 }], 500).then(() => fl.remove());
    old.remove(); const gold = seedBag(290, 100, 200, { gold: 1, title: "PREMIUM", fs: 24, z: 8, p: L }); add(`<div>👑</div>`, "left:75px;top:-40px;font-size:50px", gold); pop(gold, 350);
    p1.textContent = "¥900"; p1.style.cssText += ";width:100px;color:#c62828;font-size:30px"; say("3倍!", 520, 120, { size: 56, color: "#ffd23c", ms: 1000, z: 60 });
    for (let i = 0; i < 8; i++) { const f = add(`<div>✦</div>`, `left:${rnd(250, 520)}px;top:${rnd(90, 360)}px;font-size:${rnd(30, 60)}px;color:#ffe066;z-index:30;text-shadow:0 0 12px gold`, L); anim(f, [{ transform: "scale(.2)", opacity: 1 }, { transform: "scale(1.1)", offset: .4 }, { transform: "scale(.3)", opacity: 0 }], 500, { delay: i * 120 }).then(() => f.remove()); }
    bubble("プレミアム!", 100, 255, 1400); await wait(1800);
    const bowl = box("left:560px;top:380px;width:200px;height:80px;background:#e8e0d0;border:5px solid #331c16;border-radius:0 0 100px 100px/0 0 80px 80px;z-index:7", "", L);
    await anim(gold, [{ transform: "none" }, { transform: "translate(250px,-40px) rotate(70deg)" }], 600);
    for (let i = 0; i < 5; i++) { const sd = add(seedHtml(30), `left:${620 + i * 22}px;top:260px;width:30px;height:45px;z-index:8`, L); anim(sd, [{ transform: "none" }, { transform: `translateY(${95 + i % 2 * 8}px) rotate(${rnd(-60, 60)}deg)` }], 450, { delay: i * 90, easing: "ease-in" }); }
    const dust = []; for (let i = 0; i < 12; i++) { const d = box(`left:${600 + rnd(0, 150)}px;top:250px;width:${rnd(14, 22)}px;height:${rnd(10, 16)}px;border-radius:50%;background:#aaa;box-shadow:0 0 4px 3px #bbb;z-index:9`, "", L); dust.push(d); anim(d, [{ transform: "none" }, { transform: `translateY(${110 + rnd(0, 20)}px)` }], 700, { delay: i * 60, easing: "ease-in" }); }
    await wait(1400); say("金粉入り!?", 420, 70, { size: 46, ms: 1500, z: 60 }); zf(zr, { face: "smile", acc: "crown" }); await wait(1300);
    const wh = box("left:690px;top:240px;white-space:nowrap;font-size:17px;color:#222;background:#fff;border-radius:12px;padding:5px 12px;z-index:30", "(小声)ホコリです", L); pop(wh, 200); zf(zr, { face: "shock" });
    await wait(2300); fade(L, 400); await wait(800);
  },

  async i_T06_02() { // 休憩カウントダウン
    const h = ham(N); await wait(900); chip("崖から落とされてデス"); anim(h, [{ transform: "none" }, { transform: "translateY(60px)", offset: .2 }, { transform: "translateY(520px) rotate(220deg)" }], 800, { easing: "ease-in" }); say("デス…", 560, 250, { color: "#9db4d8" });
    await wait(900); const big = add(`<div class=t>リスポーン 10</div>`, "left:480px;top:120px;translate:-50% -50%;font-size:56px;color:#fff;z-index:30"); await wait(700);
    const mc = box("left:720px;top:300px;width:200px;height:230px;background:#8a93a8;border:5px solid #331c16;border-radius:12px;z-index:15", "", s);
    const lcd = box("left:14px;top:14px;width:162px;height:50px;background:#1a3a1a;border:4px solid #331c16;border-radius:6px;color:#7dff8a;font-size:30px;text-align:center;line-height:42px", "09:00", mc);
    box("left:20px;top:100px;width:150px;height:14px;background:#111;border-radius:6px", "", mc); const card = box("left:60px;top:40px;width:70px;height:84px;background:#fff;border:3px solid #331c16;z-index:-1;text-align:center;font-size:14px;color:#222;line-height:16px;padding-top:26px", "タイム<br>カード", mc);
    box("left:20px;top:140px;width:150px;height:60px;background:#6a7388;border:3px solid #331c16;border-radius:6px;color:#fff;font-size:15px;text-align:center;padding-top:8px;line-height:20px", "TIME<br>RECORDER", mc);
    anim(mc, [{ transform: "translateX(260px)" }, { transform: "none" }], 300); await wait(400); mc.style.zIndex = 15;
    await anim(card, [{ transform: "none" }, { transform: "translateY(70px)" }], 150); say("ガチャン!!", 560, 330, { size: 46, ms: 900 }); shake(mc); const st = stamp("休憩開始(無給)", 480, 230, 44); wait(1500).then(() => fade(st, 200));
    await wait(500); big.textContent = "休憩 給与−10秒"; big.style.color = "#ff8a8a"; const boss = zari(40, 330, 130, { face: "angry", acc: "tie", z: 15 });
    for (let n = 10; n >= 0; n--) { big.textContent = `休憩 給与−${n}秒`; lcd.textContent = `09:0${Math.min(9, 10 - n)}`.slice(0, 5); if (n === 6) bubble("死んでる暇があったら働け", 330, 270, 2000); if (n === 3) shake(boss); await wait(380); }
    await anim(card, [{ transform: "translateY(70px)" }, { transform: "none" }], 120); await anim(card, [{ transform: "none" }, { transform: "translateY(70px)" }], 150); say("ガチャン!!", 560, 330, { size: 46, ms: 900 }); shake(mc); big.remove(); const st2 = stamp("出勤", 440, 200, 60); st2.style.color = "#1a8a2a"; st2.style.borderColor = "#1a8a2a"; wait(900).then(() => fade(st2, 200));
    await wait(500); mc.remove(); h.style.transform = "translateY(300px)"; await anim(h, [{ transform: "translateY(300px)" }, { transform: "none" }], 300); hop(h, 20); bubble("おはようございます", 700, 255, 1700);
    zf(boss, { face: "smile", acc: "tie" }); await wait(2000); boss.remove(); await wait(500);
  },
});
}

{
// ---- q2 共通部品 ----
const mv = async (e, x, y, ms, ease = "ease-in-out") => {
  const x0 = parseFloat(e.style.left), y0 = parseFloat(e.style.top);
  await anim(e, [{ left: x0 + "px", top: y0 + "px" }, { left: x + "px", top: y + "px" }], ms, { easing: ease });
  e.getAnimations().forEach(a => a.cancel()); e.style.left = x + "px"; e.style.top = y + "px";
};
const typeIn = async (el, t, ms = 110) => { for (const c of t) { el.textContent += c; await wait(ms); } };
const sweat = MIDX.map(x => `<path class=dr d="M${x + (x < 600 ? -110 : 110)} 330q-24 40 0 56q24-16 0-56" fill=#7cc4ff stroke=${INK} stroke-width=6 />`).join("");
// ピラミッド型の会社ビル (上から 元請け・下請け・孫請け)
const pyr = (top = 90, fh = 98, zw = 58) => {
  const names = ["元請け", "下請け", "孫請け"], cols = ["#efe0ae", "#c9d6ee", "#e0bfa6"], ks = [1, 2, 3], acc = ["crown", "tie", "helmet"], cx = 370;
  return names.map((nm, i) => {
    const w = 200 + i * 170, l = cx - w / 2, t = top + i * (fh + 7);
    const el = add(`<div></div>`, `left:${l}px;top:${t}px;width:${w}px;height:${fh}px;background:${cols[i]};border:4px solid ${INK};border-radius:8px;z-index:6`);
    add(`<div>${nm}</div>`, "left:8px;top:3px;font-size:15px;color:#3a2a20", el);
    const zs = Array.from({ length: ks[i] }, (_, j) => zari(l + w * (j + 1) / (ks[i] + 1) - zw / 2, t + fh - zw * 1.1 - 4, zw, { acc: acc[i], face: i ? "smile" : "evil", z: 7 }));
    return { el, l, t, w, h: fh, zs, cy: t + fh / 2, r: l + w };
  });
};
const feeTag = (f, txt) => { const e = add(`<div>${txt}</div>`, "right:8px;top:3px;font-size:15px;color:#b3261e", f.el); pop(e, 200); return e; };
const hanko = (t, x, y, size = 58, z = 30) => { const e = add(`<div>${t}</div>`, `left:${x}px;top:${y}px;width:${size}px;height:${size}px;translate:-50% -50%;border:5px solid #d3202a;border-radius:50%;color:#d3202a;font-size:${size * .55}px;line-height:${size - 10}px;text-align:center;background:#fffc;z-index:${z}`);
  anim(e, [{ transform: "scale(2.6)", opacity: 0 }, { transform: "none", opacity: 1 }], 150, { easing: "ease-in" }); return e; };
const invoice = (x, y, z = 26) => add(`<div><div style="left:0;top:0;right:0;height:19px;background:#d3202a;color:#fff;font-size:11px;text-align:center;line-height:19px">請求書</div><div style="left:0;right:0;top:26px;text-align:center;color:#222;font-size:13px;line-height:15px">損害<br>賠償</div></div>`,
  `left:${x}px;top:${y}px;width:48px;height:62px;background:#fff;border:3px solid ${INK};z-index:${z}`);

Object.assign(scenes, {
  // ---------------- T06-03 ----------------
  async i_T06_03() {
    const h = ham(N), boss = zari(50, 330, 120, { acc: "tie", face: "angry", z: 12 });
    const card = add(`<div></div>`, `left:320px;top:56px;width:380px;height:340px;background:#fff8e6;border:5px solid ${INK};border-radius:10px;z-index:22;color:#222;opacity:0`);
    const rowT = (t, v, y, col = "#222", size = 22) => { add(`<div>${t}</div>`, `left:20px;top:${y}px;font-size:${size}px;color:${col}`, card); return add(`<div>${v}</div>`, `right:20px;top:${y}px;font-size:${size}px;color:${col}`, card); };
    add(`<div>給与明細</div>`, "left:0;right:0;top:10px;text-align:center;font-size:32px;color:#222", card);
    add(`<div></div>`, "left:16px;right:16px;top:56px;height:4px;background:#222", card);
    add(`<div></div>`, "left:16px;right:16px;top:266px;height:4px;background:#222", card);
    rowT("基本給", "+4粒", 70);
    const totV = rowT("支給額", "4粒", 284, "#222", 34);
    let tot = 4;
    const shouts = ["死んでる暇が<br>あったら働け", "休憩は<br>無給です", "また<br>休んだな"];
    for (let i = 0; i < 3; i++) {
      await wait(i ? 500 : 800); chip(`連続デス ×${i + 1}`); shake(h);
      const e = ov(h, whiteEyes + openMouth); h.img.style.filter = "saturate(.2) brightness(1.08)";
      if (!i) pop(card, 260);
      const v = rowT(`休憩控除 ${i + 1}回目`, "-2粒", 118 + i * 48, "#c0261c"); pop(v, 200);
      tot -= 2; totV.textContent = `${tot}粒`; if (tot < 0) totV.style.color = "#d3202a";
      bubble(shouts[i], 170, 225, 1500); hop(boss, 16);
      await wait(1000); chip("復活"); e.remove(); h.img.style.filter = "none"; hop(h, 60);
      say("出勤!", 560, 440, { size: 42, color: "#7dff8a", ms: 600 });
    }
    await wait(900); chip("支給額 マイナス");
    await anim(h, [{ transform: "none" }, { transform: "scale(1.12,1.08)" }], 300);
    const [mx, my] = P(600, 660);
    ov(h, frown + tears);
    for (let k = 0; k < 2; k++) {
      const sd = seed(mx - 12, my - 20, 26, 28);
      anim(sd, [{ transform: "none" }, { transform: `translate(${-330}px,${-90}px) rotate(300deg)`, offset: .5 }, { transform: `translate(${60 - mx}px,${390 - my}px) rotate(720deg)` }], 900, { easing: "linear", delay: k * 250 }).then(() => sd.remove());
    }
    await wait(1250); anim(h, [{ transform: "scale(1.12,1.08)" }, { transform: "none" }], 200);
    boss.innerHTML = zariSvg({ acc: "tie", face: "evil" }); hop(boss, 20);
    totV.textContent = "0粒"; totV.style.color = "#222"; const st = stamp("徴収済", 510, 300, 40);
    bubble("また休むなよ", 170, 225, 0);
    await wait(2200);
  },

  // ---------------- T06-06 ----------------
  async i_T06_06() {
    const h = ham(N); ov(h, frown);
    await wait(700); chip("敗北"); say("DEFEAT", 480, 66, { size: 100, color: "#ff4b4b", ms: 0 }); shake(h);
    await wait(900);
    const paper = add(`<div></div>`, `left:170px;top:130px;width:450px;height:290px;background:#fffdf3;border:5px solid ${INK};border-radius:6px;z-index:22;color:#222`);
    pop(paper, 260);
    add(`<div>労災申請書</div>`, "left:0;right:0;top:10px;text-align:center;font-size:34px", paper);
    add(`<div>申請者: ハム</div>`, "left:24px;top:68px;font-size:24px", paper);
    add(`<div>事由:</div>`, "left:24px;top:118px;font-size:26px", paper);
    const ji = add(`<div></div>`, "left:100px;top:110px;width:320px;height:44px;border-bottom:3px solid #222;font-size:36px;color:#1c3fa8", paper);
    add(`<div>理由:</div>`, "left:24px;top:190px;font-size:26px", paper);
    const re = add(`<div></div>`, "left:100px;top:186px;width:340px;font-size:26px;color:#d3202a;white-space:nowrap", paper);
    const boss = zari(630, 235, 90, { acc: "tie", face: "angry", z: 12 });
    await wait(500); await typeIn(ji, "死亡", 260);
    await wait(700); hop(boss, 20);
    stamp("却下", 470, 255, 66);
    await wait(500); await typeIn(re, "生きているので対象外", 130);
    await wait(900); chip("本当に?");
    const hl = ov(h, `<circle cx=170 cy=655 r=62 fill=#fbcbc3 stroke=${INK} stroke-width=14 />`), hr = ov(h, `<circle cx=1060 cy=655 r=62 fill=#fbcbc3 stroke=${INK} stroke-width=14 />`);
    anim(hl, [{ transform: "translateX(0)" }, { transform: "translateX(-30px)" }], 400); await anim(hr, [{ transform: "translateX(0)" }, { transform: "translateX(30px)" }], 400);
    anim(h.img, [{ transform: "none" }, { transform: "scaleX(1.08)" }], 300);
    say("いたっ", 560, 310, { size: 40, color: "#fff", ms: 900 });
    await wait(700); hl.remove(); hr.remove(); anim(h.img, [{ transform: "scaleX(1.08)" }, { transform: "none" }], 200);
    say("生きてる…", 540, 440, { size: 46, color: "#ffd23c", ms: 1500 });
    const ok = add(`<div>生存確認 ✓</div>`, "left:640px;top:100px;font-size:26px;color:#7dff8a;background:#000a;padding:4px 12px;border-radius:8px;z-index:30"); pop(ok);
    await wait(2200);
  },

  // ---------------- T06-08 ----------------
  async i_T06_08() {
    const h = ham(N);
    await wait(800); chip("チャネポ「ハムに有給をあげる」");
    const sign = add(`<div>有給休暇</div>`, `left:${HX - 8}px;top:${HY - 90}px;padding:6px 16px;font-size:34px;color:#222;background:#fff8e6;border:5px solid ${INK};border-radius:8px;z-index:22;rotate:-4deg`);
    add(`<div></div>`, "left:50%;top:100%;width:10px;height:50px;margin-left:-5px;background:#7a4a28;border:3px solid " + INK, sign);
    pop(sign, 260); hop(h, 50); say("やった!!", 560, 250, { size: 52, ms: 800 });
    await wait(1300);
    const futon = ov(h, `<g><rect x=-60 y=790 width=1360 height=520 rx=90 fill=#9ec8ee stroke=${INK} stroke-width=16 /><path d="M-40 900H1280M-40 1010H1280" stroke=#7aa9d2 stroke-width=18 /><rect x=-60 y=790 width=1360 height=90 rx=45 fill=#fff stroke=${INK} stroke-width=16 /></g>`);
    anim(futon, [{ transform: "translateY(300px)", opacity: 0 }, { transform: "none", opacity: 1 }], 400);
    const eyes = ov(h, closedEyes + hideMouth); sign.remove();
    await wait(500);
    const boss = zari(300, 330, 100, { acc: "tie", face: "smile", z: 12 });
    const rule = add(`<div>就業規則 第7条</div>`, "left:210px;top:290px;font-size:18px;color:#222;background:#fff8e6;border:3px solid " + INK + ";padding:2px 10px;z-index:13;rotate:-5deg"); pop(rule);
    await wait(500); bubble("有給は死んでいる時<br>だけ有効です", 270, 195, 2800);
    await wait(900);
    const frame = add(`<div><img src="${N}" style="left:8px;top:8px;width:72px;height:74px;filter:grayscale(1)"><div style="left:-8px;top:-8px;width:36px;height:36px;background:#111;rotate:45deg;translate:-50% 0"></div></div>`, "left:470px;top:410px;width:88px;height:98px;background:#fff;border:7px solid #111;z-index:12");
    const stone = add(`<svg viewBox="0 0 100 160"><path d="M8 156V56Q8 6 50 6Q92 6 92 56V156Z" fill=#aeb4bd stroke=${INK} stroke-width=5 /><path d="M30 130Q50 120 70 130" fill=none stroke=#8a9099 stroke-width=4 /></svg>`, "left:585px;top:350px;width:100px;height:160px;z-index:12");
    const eng = add(`<div></div>`, "left:30px;top:30px;width:40px;height:110px;writing-mode:vertical-rl;font-size:23px;color:#4c525c;letter-spacing:2px;white-space:nowrap", stone);
    await Promise.all([pop(frame, 300), anim(stone, [{ transform: "translateY(90px)", opacity: 0 }, { transform: "none", opacity: 1 }], 400)]);
    h.img.classList.add("bob");
    for (let i = 0; i < 4; i++) { const q = add(`<div class=t>Z</div>`, `left:${HX + 40 + i % 3 * 18}px;top:${HY + 10}px;font-size:${24 + i % 3 * 8}px;color:#bcd`);
      anim(q, [{ transform: "none", opacity: 1 }, { transform: "translate(-40px,-70px)", opacity: 0 }], 900).then(() => q.remove()); await wait(300); }
    await typeIn(eng, "有給消化中", 260);
    say("ぐっすり…", 480, 160, { size: 46, color: "#cfe0ff", ms: 1500 });
    await wait(2000);
  },

  // ---------------- T07-01 ----------------
  async i_T07_01() {
    const h = ham(N), p = pyr();
    await wait(900); chip("キル");
    const k = add(`<div class=t>キル!</div>`, "left:370px;top:-60px;translate:-50% -50%;font-size:70px;color:#ffd23c;z-index:30");
    const fees = ["手数料「!」", "手数料「ル」", "手数料 ほぼ全部"], txts = ["キル", "キ", "キ"];
    let sz = 70;
    for (let i = 0; i < 3; i++) {
      await mv(k, 370, p[i].t + 30, i ? 600 : 800, "ease-in");
      hop(p[i].zs[0], 22); feeTag(p[i], fees[i]); for (let c = 0; c < 6; c++) crumb(370 + rnd(-30, 30), p[i].t + 30);
      if (i < 2) { say(i ? "ガブッ" : "ガブッ", 370 + 190, p[i].t + 20, { size: 30, color: "#fff", ms: 500 }); }
      k.textContent = txts[i]; if (i == 2) { k.style.fontSize = "52px"; k.style.color = "#e8d9a0"; }
      await wait(i == 2 ? 900 : 650);
    }
    await mv(k, 835, 440, 700, "ease-in-out");
    h.img.style.filter = "none"; hop(h, 30); ov(h, closedEyes + hideMouth + `<path d="M470 668Q600 760 730 668" ${line} />`);
    say("キ…", 640, 300, { size: 40, color: "#fff", ms: 1200 });
    const f = flash(780, 880, 380, 430, "#ffe27a"); anim(h, [{ transform: "none" }, { transform: "scale(1.05,.96)" }, { transform: "none" }], 500);
    label("本日の投げ銭: キ", "left:14px;top:62px");
    await wait(2300);
  },

  // ---------------- T07-02 ----------------
  async i_T07_02() {
    const h = ham(N), p = pyr(), cnt = label("請求書 ×0", "right:16px;top:16px");
    await wait(900); chip("狙撃されてデス");
    ov(h, whiteEyes + openMouth + sweat); say("ガクッ", 560, 300, { size: 44, color: "#9db4d8", ms: 800 });
    await anim(h, [{ transform: "none" }, { transform: "rotate(-80deg)" }], 450, { easing: "ease-in" });
    await wait(300);
    const sgn = ["責任は下請けに", "責任は孫請けに"];
    let invs = [invoice(346, 20)]; cnt.textContent = "請求書 ×1";
    for (let i = 0; i < 2; i++) {
      await Promise.all(invs.map(v => mv(v, parseFloat(v.style.left), p[i].t + 28, 500, "ease-in")));
      // コピー
      const base = invs.slice(), next = [];
      for (const v of base) { const x0 = parseFloat(v.style.left);
        [-1, 0, 1].forEach((d, j) => { const c = j == 1 ? v : invoice(x0, p[i].t + 28); next.push(c); }); }
      say("ピー", 370, p[i].t + 20, { size: 34, color: "#fff", ms: 500 });
      feeTag(p[i], "コピー");
      await Promise.all(next.map((c, n) => { const g = n % 3, base0 = Math.floor(n / 3); const cx = 370 + (i ? (n - (next.length - 1) / 2) * 38 : (g - 1) * 62); return mv(c, cx - 24, p[i].t + 28, 300); }));
      invs = next; cnt.textContent = `請求書 ×${invs.length}`; pop(cnt, 200);
      const sg = note(sgn[i], `left:${Math.max(8, p[i].l - 170)}px;top:${p[i].t + 20}px;font-size:17px;color:#b3261e`); anim(sg, [{ transform: "rotateX(90deg)" }, { transform: "none" }], 300);
      hop(p[i].zs[0], 18); await wait(450);
    }
    await Promise.all(invs.map((v, n) => mv(v, parseFloat(v.style.left), p[2].t + 28, 400, "ease-in")));
    await wait(200);
    await Promise.all(invs.map((v, n) => { v.style.rotate = rnd(-25, 25) + "deg"; return wait(n * 60).then(() => mv(v, 580 + rnd(-30, 50), 470 - Math.floor(n / 3) * 14 - rnd(0, 6), 450, "ease-in")); }));
    shake(h);
    for (let n = 0; n < 14; n++) { const v = invoice(rnd(570, 650), -70); v.style.rotate = rnd(-30, 30) + "deg"; const yy = 405 - Math.floor(n / 3) * 12;
      anim(v, [{ transform: "none" }, { transform: `translateY(${yy + 70}px)` }], 600, { delay: n * 80, easing: "ease-in", fill: "both" }); }
    cnt.textContent = "請求書 ×27"; pop(cnt, 200);
    await wait(1100); say("どさどさ…", 480, 250, { size: 44, color: "#ffd23c", ms: 1000 });
    await wait(2200);
  },

  // ---------------- T07-04 ----------------
  async i_T07_04() {
    const h = ham(N), p = pyr();
    const en = add(`<svg viewBox="0 0 80 80"><path d="M10 74Q6 20 40 10Q74 20 70 74Z" fill=#6a4a8a stroke=${INK} stroke-width=5 /><circle cx=28 cy=40 r=7 fill=#fff /><circle cx=52 cy=40 r=7 fill=#fff /><circle cx=30 cy=42 r=3 fill=${INK} /><circle cx=54 cy=42 r=3 fill=${INK} /><path d="M24 30L36 35M56 30L44 35" stroke=${INK} stroke-width=4 /></svg>`, "left:560px;top:60px;width:75px;height:75px;z-index:8");
    await wait(900); chip("ウルト発動");
    const fl = add(`<div></div>`, "left:0;top:0;width:960px;height:540px;background:#fff;z-index:24"); fade(fl, 260);
    const col = add(`<div></div>`, `left:${HX + HW / 2 - 56}px;top:-10px;width:112px;height:${HY + 90}px;background:linear-gradient(90deg,#ffd23c00,#fff8c0,#ffd23c00);box-shadow:0 0 40px #ffd23c;transform-origin:50% 100%;z-index:9`);
    say("ULT!!", 560, 200, { size: 56, ms: 700 });
    anim(col, [{ transform: "scaleY(0)" }, { transform: "none" }], 350);
    h.style.filter = "drop-shadow(0 0 16px gold)"; await wait(900);
    const att = [120, 180, 250], scl = [.7, .4, .12];
    for (let i = 0; i < 3; i++) {
      const sx = p[i].r, sy = p[i].cy - 10;
      const L = add(`<svg viewBox="0 0 960 540" style="left:0;top:0;width:960px;height:540px"><line x1=${sx} y1=${sy} x2=${HX + HW / 2 - 56} y2=${att[i]} stroke=#e8453c stroke-width=7 stroke-linecap=round /><line x1=${sx} y1=${sy} x2=${HX + HW / 2 - 56} y2=${att[i]} stroke=#fff stroke-width=2 stroke-dasharray="10 12" /></svg>`, "z-index:8");
      pop(L, 150); p[i].zs.forEach(z => z.innerHTML = zariSvg({ acc: ["crown", "tie", "helmet"][i], face: "evil" }));
      say("ずずず…", sx + 30, sy - 40, { size: 28, color: "#fff", ms: 700 });
      for (let d = 0; d < 5; d++) { const o = add(`<div></div>`, `left:${HX + HW / 2 - 60}px;top:${att[i] - 8}px;width:16px;height:16px;border-radius:50%;background:#fff8c0;box-shadow:0 0 12px gold;z-index:9`);
        anim(o, [{ transform: "none" }, { transform: `translate(${sx - (HX + HW / 2 - 60) + 8}px,${sy - att[i]}px)`, opacity: .2 }], 420, { delay: d * 120, easing: "linear" }).then(() => o.remove()); }
      anim(col, [{ transform: i ? `scaleX(${scl[i - 1]})` : "none" }, { transform: `scaleX(${scl[i]})` }], 700);
      p[i].el.style.boxShadow = "0 0 24px #ffd23c"; await wait(900);
    }
    await anim(col, [{ transform: `scaleX(${scl[2]})`, opacity: 1 }, { transform: "scaleX(0)", opacity: 0 }], 300); col.remove(); h.style.filter = "none";
    await wait(300); chip("ウルト 手元に残った分");
    const sp = add(`<div><div style="left:11px;top:20px;width:3px;height:40px;background:#8a6a4a"></div><div class=t style="left:-6px;top:-18px;font-size:46px;color:#ffe27a;-webkit-text-stroke:0">✦</div></div>`, "left:735px;top:410px;width:16px;height:50px;z-index:20");
    hop(h, 14); say("ぱち…ぱち…", 600, 440, { size: 30, color: "#fff", ms: 900 }); await wait(1000);
    await anim(sp, [{ transform: "none" }, { transform: "translate(-40px,-70px) rotate(-30deg)", opacity: .8 }, { transform: "translate(-62px,-102px) rotate(-60deg)", opacity: .1 }], 800, { easing: "ease-out" });
    sp.remove(); const sm = add(`<div></div>`, "left:664px;top:298px;width:30px;height:30px;border-radius:50%;background:#ccc;opacity:.8;z-index:20"); anim(sm, [{ transform: "scale(.3)", opacity: .9 }, { transform: "scale(1.8) translateY(-20px)", opacity: 0 }], 800);
    say("プスッ", 620, 270, { size: 44, color: "#fff", ms: 1100 });
    await wait(700); say("?", 600, 40, { size: 40, color: "#d9c9ff", ms: 900 }); anim(en, [{ transform: "none" }, { transform: "rotate(8deg)" }, { transform: "none" }], 500);
    await wait(2100);
  },

  // ---------------- T07-05 ----------------
  async i_T07_05() {
    const h = ham(N), p = pyr(240, 88, 52);
    h.style.transform = "translate(-462px,-294px) scale(.42)"; h.style.zIndex = 8;
    ov(h, `<path d="M290 430L470 500M920 430L740 500" stroke=${INK} stroke-width=34 stroke-linecap=round />` + hideMouth + `<rect x=500 y=612 width=200 height=70 rx=20 fill=#fff stroke=${INK} stroke-width=14 /><path d="M550 612V682M600 612V682M650 612V682" stroke=${INK} stroke-width=8 />`);
    h.img.classList.add("trem");
    const plate = add(`<div></div>`, "left:300px;top:138px;width:140px;height:14px;background:#f3c53a;border:4px solid " + INK + ";border-radius:6px;z-index:11");
    const box = add(`<div>社長の台座</div>`, "left:310px;top:152px;width:120px;height:88px;background:linear-gradient(#f7d45a,#d9a516);border:5px solid " + INK + ";border-radius:6px;font-size:18px;color:#5a3a00;text-align:center;line-height:84px;z-index:12");
    const boss = zari(335, 66, 70, { acc: "crown", face: "smile", z: 13 });
    const tro = add(`<div>🏆</div>`, "left:343px;top:2px;font-size:56px;z-index:14");
    await wait(900); chip("勝利");
    say("VICTORY", 700, 70, { size: 76, ms: 0, color: "#ffd23c" });
    p.forEach(f => f.zs.forEach((z, n) => { anim(z, [{ transform: "none" }, { transform: "translateY(-10px)" }, { transform: "none" }], 400, { iterations: 8, delay: n * 70 }); }));
    const cols = ["#ff5a5a", "#5ab0ff", "#ffd23c", "#7dff8a", "#ff8ad8"];
    for (let i = 0; i < 46; i++) { const c = add(`<div></div>`, `left:${rnd(130, 620)}px;top:-20px;width:${rnd(8, 14)}px;height:${rnd(6, 10)}px;background:${cols[i % 5]};z-index:20`);
      anim(c, [{ transform: "none" }, { transform: `translateY(${rnd(240, 520)}px) rotate(${rnd(300, 900)}deg)`, opacity: .8 }], rnd(1500, 2200), { delay: rnd(0, 900), easing: "linear" }).then(() => c.remove()); }
    say("パチパチ", 620, 330, { size: 34, color: "#fff", ms: 1800 });
    await wait(2200);
    chip("台座をよく見ると…");
    await anim(box, [{ transform: "none", opacity: 1 }, { transform: "translateY(-10px)", opacity: 1, offset: .3 }, { transform: "translateY(30px) scale(.6)", opacity: 0 }], 600); box.remove();
    say("ぐぬぬ…", 520, 190, { size: 44, color: "#ffb0a0", ms: 1600 });
    await wait(900);
    const one = add(`<div></div>`, "left:362px;top:-20px;width:20px;height:14px;background:#ffd23c;border:2px solid " + INK + ";z-index:20");
    await anim(one, [{ transform: "none" }, { transform: "translateY(115px) rotate(300deg)" }], 1300, { easing: "linear" });
    one.style.transform = "translateY(115px) rotate(300deg)";
    label("ハムの取り分: 紙吹雪 1枚", "left:480px;top:110px");
    await wait(2300);
  },

  // ---------------- T07-09 ----------------
  async i_T07_09() {
    const h = ham(N), p = pyr();
    const chat = zari(640, 40, 62, { face: "smile", z: 12 });
    await wait(800); chip("チャット「!応援」");
    const b = add(`<div class=bub>がんばれ</div>`, "left:600px;top:50px;translate:-50% -50%;z-index:30"); pop(b, 200);
    await wait(900);
    const steps = ["もっとがんばれ", "ノルマ倍", "ノルマ倍!"];
    for (let i = 0; i < 3; i++) {
      await mv(b, 370, p[i].t + 26, 600, "ease-in");
      const pen = add(`<div>✏️</div>`, `left:${p[i].l + p[i].w - 54}px;top:${p[i].t + 34}px;font-size:34px;z-index:31`);
      anim(pen, [{ transform: "rotate(-20deg)" }, { transform: "rotate(20deg)" }, { transform: "rotate(-20deg)" }], 300, { iterations: 2 }).then(() => pen.remove());
      hop(p[i].zs[0], 16); await wait(450);
      b.textContent = steps[i]; pop(b, 200);
      if (i == 2) { b.className = ""; b.style.cssText += `;background:#d3202a;color:#fff;border:5px solid ${INK};padding:8px 20px;font-size:30px;border-radius:6px;white-space:nowrap;rotate:-3deg;z-index:30`; }
      await wait(650);
    }
    await mv(b, 780, 440, 700, "ease-in-out");
    shake(h); ov(h, frown + tears); h.img.style.filter = "saturate(.45)";
    await wait(500); bubble("応援ありがとう…", 560, 320, 0);
    await wait(2800);
  },

  // ---------------- T08-02 ----------------
  async i_T08_02() {
    const h = ham(N);
    const pan = add(`<div></div>`, `left:90px;top:60px;width:540px;height:200px;background:#fff8e6;border:5px solid ${INK};border-radius:10px;z-index:22;color:#222`);
    add(`<div>決裁欄</div>`, "left:0;right:0;top:6px;text-align:center;font-size:26px", pan);
    const names = ["課長", "部長", "本部長"], boxes = names.map((n, i) => { add(`<div>${n}</div>`, `left:${20 + i * 172}px;top:50px;width:156px;font-size:22px;text-align:center`, pan);
      return add(`<div></div>`, `left:${20 + i * 172}px;top:82px;width:156px;height:100px;border:4px dashed #888;border-radius:6px`, pan); });
    const zs = [zari(130, 340, 90, { acc: "tie", face: "smile", z: 12 }), zari(300, 340, 90, { acc: "glasses", face: "smile", z: 12 }), zari(470, 340, 90, { acc: "crown", face: "smile", z: 12 })];
    await wait(900); chip("落下でデス");
    await anim(h, [{ transform: "none" }, { transform: "rotate(-26deg)" }], 400, { easing: "ease-in" });
    const e = ov(h, whiteEyes + openMouth + sweat);
    const sg = add(`<div>死亡承認待ち</div>`, "left:690px;top:200px;padding:6px 16px;font-size:30px;color:#fff;background:#d3202a;border:5px solid " + INK + ";border-radius:8px;z-index:22;rotate:4deg"); pop(sg, 250);
    anim(h, [{ transform: "rotate(-26deg)" }, { transform: "rotate(-28deg)" }, { transform: "rotate(-26deg)" }], 900, { iterations: 6 });
    const days = label("決裁待ち 0日", "right:16px;top:16px");
    for (let i = 0; i < 3; i++) {
      await wait(1000); hop(zs[i], 24);
      hanko(names[i][0] == "本" ? "本" : names[i][0], 20 + i * 172 + 78 + 90, 60 + 82 + 50, 62, 30);
      pan.append(...[]);
      days.textContent = `決裁待ち ${i + 1}日`;
    }
    await wait(700); chip("決裁完了");
    sg.textContent = "承認済"; sg.style.background = "#2c8a4a";
    await wait(500); say("パタリ", 540, 330, { size: 44, color: "#9db4d8", ms: 1000 });
    h.getAnimations().forEach(a => a.cancel());
    await anim(h, [{ transform: "rotate(-26deg)" }, { transform: "rotate(-92deg)" }], 350, { easing: "ease-in" });
    await wait(500);
    zs.forEach((z, i) => { anim(z, [{ transform: "none" }, { transform: "rotate(22deg) translateY(8px)" }], 400); bubble("ご苦労", 175 + i * 170, 290, 0); });
    await wait(2300);
  },

  // ---------------- T08-06 ----------------
  async i_T08_06() {
    const h = ham(N); ov(h, frown);
    await wait(700); chip("敗北"); say("DEFEAT", 480, 66, { size: 100, color: "#ff4b4b", ms: 0 }); shake(h);
    await wait(900);
    const paper = add(`<div></div>`, `left:190px;top:130px;width:440px;height:250px;background:#fffdf3;border:5px solid ${INK};border-radius:6px;z-index:22;color:#222`);
    pop(paper, 250);
    add(`<div>敗北報告書</div>`, "left:0;right:0;top:10px;text-align:center;font-size:32px", paper);
    add(`<div>結果:</div>`, "left:24px;top:76px;font-size:30px", paper);
    const val = add(`<div>敗北</div>`, "left:130px;top:62px;font-size:52px;color:#1c3fa8;white-space:nowrap", paper);
    const bs = [zari(200, 400, 90, { acc: "tie", face: "smile", z: 12 }), zari(330, 400, 90, { acc: "glasses", face: "smile", z: 12 }), zari(460, 400, 90, { acc: "crown", face: "evil", z: 12 })];
    const rows = [["差し戻し", "引き分け", 300, 305, 36], ["書き換え", "勝ち(暫定)", 510, 290, 36], ["快勝", "快勝", 450, 338, 54]];
    rows[1][0] = "再決裁";
    for (let i = 0; i < 3; i++) {
      await wait(1100); hop(bs[i], 26); stamp(rows[i][0], rows[i][2], rows[i][3], rows[i][4]);
      await wait(350); val.textContent = rows[i][1]; pop(val, 200);
      if (i == 0) say("負けてる…", 800, 280, { size: 26, color: "#cfd8e8", ms: 0 });
    }
    chip("本部長決裁");
    for (let i = 0; i < 18; i++) crumb(rnd(220, 600), 130);
    await wait(900);
    const mini = stamp("未決裁", 800, 300, 26); mini.style.opacity = .7; mini.style.color = "#aaa"; mini.style.borderColor = "#aaa";
    await wait(2300);
  },

  // ---------------- T08-07 ----------------
  async i_T08_07() {
    const h = ham(N), m = ov(h, openMouth);
    const pan = add(`<div></div>`, `left:250px;top:60px;width:440px;height:170px;background:#fff8e6;border:5px solid ${INK};border-radius:10px;z-index:22;color:#222`);
    add(`<div>種 摂取 稟議書</div>`, "left:0;right:0;top:6px;text-align:center;font-size:26px", pan);
    const names = ["課長", "部長", "本部長"];
    names.forEach((n, i) => { add(`<div>${n}</div>`, `left:${16 + i * 140}px;top:46px;width:120px;font-size:20px;text-align:center`, pan);
      add(`<div></div>`, `left:${16 + i * 140}px;top:74px;width:120px;height:80px;border:4px dashed #888;border-radius:6px`, pan); });
    const zs = [zari(420, 390, 85, { acc: "tie", face: "smile", z: 12 }), zari(520, 390, 85, { acc: "glasses", face: "smile", z: 12 }), zari(620, 390, 85, { acc: "crown", face: "smile", z: 12 })];
    await wait(800); chip("ビッツ");
    const sd = seed(778, -40, 40, 25);
    await anim(sd, [{ transform: "none" }, { transform: "translateY(302px) rotate(360deg)" }], 600, { easing: "ease-in" });
    sd.style.top = "262px"; sd.getAnimations().forEach(a => a.cancel());
    anim(sd, [{ transform: "translateY(0)" }, { transform: "translateY(-6px)" }], 600, { iterations: 12, direction: "alternate" });
    say("あーん", 640, 330, { size: 40, color: "#fff", ms: 1200 });
    const tag = add(`<div>決裁中</div>`, "left:730px;top:236px;font-size:16px;color:#fff;background:#000a;padding:2px 8px;border-radius:6px;z-index:26;white-space:nowrap");
    for (let i = 0; i < 3; i++) {
      await wait(1100); hop(zs[i], 22);
      hanko(names[i][0], 250 + 16 + i * 140 + 60, 60 + 74 + 40, 56, 30);
      if (i == 1) say("ぐぅ〜", 830, 470, { size: 30, color: "#ffe9a8", ms: 900 });
    }
    await wait(700); chip("承認3つ揃った");
    tag.textContent = "承認済";
    const z3 = zs[2];
    await anim(z3, [{ transform: "none" }, { transform: "translate(130px,-125px)" }], 350);
    sd.getAnimations().forEach(a => a.cancel());
    await anim(sd, [{ transform: "none", opacity: 1 }, { transform: "translate(-90px,40px) scale(.4)", opacity: 0 }], 320);
    z3.innerHTML = zariSvg({ acc: "crown", face: "smile", extra: `<circle cx=60 cy=89 r=7 fill=#3a3030 />` });
    say("もぐもぐ", 740, 320, { size: 36, color: "#fff", ms: 900 });
    ov(h, whiteEyes + frown + tears); m.remove();
    await wait(900); stamp("承認者が試食しました", 480, 300, 44);
    await wait(2400);
  },

  // ---------------- T09-02 ----------------
  async i_T09_02() {
    const h = ham(N);
    await wait(900); chip("崖から落とされてデス");
    const ey = ov(h, whiteEyes + openMouth);
    say("うわあぁ…", 800, 300, { size: 40, color: "#9db4d8", ms: 900 });
    await anim(h, [{ transform: "none" }, { transform: "translateY(60px) rotate(25deg)", offset: .3 }, { transform: "translateY(420px) rotate(110deg)" }], 800, { easing: "ease-in" });
    const cd = say("復活まで 3", 720, 110, { size: 52, color: "#fff", ms: 0 });
    const robo = ham(N); robo.style.zIndex = 12; robo.img.style.filter = "hue-rotate(190deg) saturate(.5) brightness(1.1)";
    ov(robo, `<rect x=250 y=410 width=700 height=130 rx=40 fill=#222c3a stroke=${INK} stroke-width=14 /><circle cx=380 cy=475 r=34 fill=#5dff9a /><circle cx=828 cy=475 r=34 fill=#5dff9a /><path d="M600 40V-120" stroke=${INK} stroke-width=18 /><circle cx=600 cy=-140 r=40 fill=#ff4b4b stroke=${INK} stroke-width=14 /><circle cx=240 cy=800 r=20 fill=#aaa stroke=${INK} stroke-width=8 /><circle cx=980 cy=800 r=20 fill=#aaa stroke=${INK} stroke-width=8 />`);
    pop(robo, 260);
    const plate = label("ロボハム (正社員)", `left:${HX - 40}px;top:${HY - 40}px`);
    await wait(900); cd.textContent = "復活まで 2";
    const tb = add(`<div></div>`, `left:60px;top:70px;width:430px;height:230px;background:#fffdf3;border:5px solid ${INK};border-radius:8px;z-index:22;color:#222`);
    pop(tb, 260);
    const rows = [["", "ハム", "ロボ"], ["死なない", "✕", "○"], ["休まない", "✕", "○"], ["給料いらない", "✕", "○"]];
    rows.forEach((r, i) => r.forEach((t, j) => add(`<div>${t}</div>`, `left:${j ? 190 + (j - 1) * 110 : 18}px;top:${12 + i * 54}px;width:${j ? 100 : 190}px;font-size:${j ? 32 : 26}px;text-align:${j ? "center" : "left"};color:${t == "○" ? "#d3202a" : t == "✕" ? "#3a6ad8" : "#222"}`, tb)));
    add(`<div></div>`, "left:12px;right:12px;top:62px;height:3px;background:#222", tb);
    await wait(1000); cd.textContent = "復活まで 1";
    await wait(1000); cd.remove(); chip("復活");
    h.getAnimations().forEach(a => a.cancel()); ey.remove(); ov(h, frown);
    h.style.transform = "translateX(-250px)"; pop(h, 300); hop(h, 50);
    say("え?", 600, 250, { size: 56, color: "#ffd23c", ms: 1200 });
    await wait(1200);
    anim(robo, [{ transform: "none" }, { transform: "rotate(10deg) translateY(10px)", offset: .5 }, { transform: "none" }], 700);
    bubble("お疲れさまです", 830, 220, 0);
    await wait(2800);
  },
});
}

// q3: 11個の演出 (T09-10 / T10-04 / T10-10 / T11-01 / T11-03 / T12-03 / T12-06 / T12-09 / T13-03 / T14-03 / T14-10)
{
const WOOD = "repeating-linear-gradient(90deg,#c9975c 0 30px,#bb8850 30px 33px)";
const qOrb = (x, y, r = 26, z = 13, parent = s) => add(`<div></div>`, `left:${x - r}px;top:${y - r}px;width:${r * 2}px;height:${r * 2}px;border-radius:50%;background:radial-gradient(circle at 35% 30%,#fff 0 12%,#ffe56a 40%,#ffb11a);border:4px solid ${INK};box-shadow:0 0 18px 6px #ffe56a99;z-index:${z}`, parent);
const qWheel = (x, y, d = 60, parent = s) => add(`<svg viewBox="0 0 60 60"><circle cx=30 cy=30 r=26 fill=none stroke=#8a8a99 stroke-width=6 /><circle cx=30 cy=30 r=26 fill=none stroke=${INK} stroke-width=2 />${[0, 1, 2, 3, 4, 5].map(i => `<path d="M30 30L${30 + 26 * Math.cos(i * 1.047)} ${30 + 26 * Math.sin(i * 1.047)}" stroke=#8a8a99 stroke-width=3 />`).join("")}</svg>`, `left:${x}px;top:${y}px;width:${d}px;height:${d}px;z-index:14`, parent);
const qSun = (x, y, d = 50, parent = s) => add(`<svg viewBox="0 0 60 60" style="overflow:visible">${Array.from({ length: 10 }, (_, i) => `<ellipse cx=30 cy=9 rx=6 ry=11 fill=#ffd21f stroke=${INK} stroke-width=2.5 transform="rotate(${i * 36} 30 30)" />`).join("")}<circle cx=30 cy=30 r=11 fill=#6b3d1a stroke=${INK} stroke-width=3 /></svg>`, `left:${x}px;top:${y}px;width:${d}px;height:${d}px;z-index:16`, parent);
const qRobo = (x, y, hh, z = 10) => {
  const w = hh * 1237 / 1271;
  const e = add(`<div><img src="${N}" style="width:100%;height:100%;filter:grayscale(.75) hue-rotate(170deg) brightness(1.12) contrast(1.1)"><svg viewBox="0 0 1237 1271" style="left:0;top:0;width:100%;height:100%;overflow:visible"><path d="M600 130V-30" stroke=${INK} stroke-width=24 /><circle cx=600 cy=-50 r=55 fill=#f33 stroke=${INK} stroke-width=16 />
    ${MIDX.map(x => `<rect x=${x - 85} y=405 width=170 height=170 rx=26 fill=#0f2a3a stroke=${INK} stroke-width=14 /><rect x=${x - 48} y=450 width=96 height=44 fill=#5ff />`).join("")}<rect x=510 y=630 width=180 height=56 rx=12 fill=#cfd6df stroke=${INK} stroke-width=12 /><path d="M550 630V686M600 630V686M650 630V686" stroke=${INK} stroke-width=8 /></svg></div>`,
    `left:${x}px;top:${y}px;width:${w}px;height:${hh}px;z-index:${z};transform-origin:50% 100%`);
  return e;
};
const qTag = (t, css = "") => add(`<div>${t}</div>`, `color:#222;background:#fff8e6;border:3px solid ${INK};border-radius:6px;padding:2px 8px;font-size:17px;white-space:nowrap;z-index:22;${css}`);
const qShopWall = (sign = "質屋") => {
  const w = add(`<div></div>`, `left:330px;top:120px;width:630px;height:420px;background:repeating-linear-gradient(90deg,#6b4a2c 0 38px,#5d3f25 38px 42px);border-left:6px solid ${INK};border-top:6px solid ${INK};border-radius:18px 0 0 0;z-index:6`);
  add(`<div>${sign}</div>`, `left:372px;top:132px;width:150px;height:46px;background:#b8322a;border:4px solid ${INK};border-radius:8px;font-size:32px;text-align:center;line-height:38px;z-index:7`);
  return w;
};
const qCounter = (x = 330, w = 380, y = 410) => add(`<div></div>`, `left:${x}px;top:${y}px;width:${w}px;height:${540 - y}px;background:${WOOD};border-top:8px solid #7a4a28;border-left:5px solid ${INK};z-index:12`);
const qTicket = (x, y, burn) => add(`<div>質</div>`, `left:${x}px;top:${y}px;width:42px;height:56px;background:#f6ecd0;border:3px solid ${INK};color:#c22;font-size:26px;text-align:center;line-height:50px;z-index:13`);

Object.assign(scenes, {
  async i_T09_10() { // 最終出社日
    const h = ham(N);
    await wait(700); chip("配信終了");
    say("今日で最終日…", 420, 90, { size: 40, color: "#fff", ms: 1300 });
    const box = add(`<div>私物</div>`, `left:-26px;top:128px;width:176px;height:104px;background:#c9975c;border:5px solid ${INK};font-size:26px;color:#6b4522;text-align:center;line-height:100px;z-index:14`, h);
    add(`<div></div>`, `left:-14px;top:-18px;width:80px;height:22px;background:#b88650;border:4px solid ${INK};transform:rotate(-14deg)`, box);
    add(`<div></div>`, `left:100px;top:-18px;width:80px;height:22px;background:#b88650;border:4px solid ${INK};transform:rotate(12deg)`, box);
    await anim(box, [{ transform: "translateY(120px)", opacity: 0 }, { transform: "none", opacity: 1 }], 350);
    const toss = async (el, t) => { await anim(el, [{ transform: "translate(60px,-90px) scale(.5)", opacity: 1 }, { transform: "translate(0,-60px)", offset: .5, opacity: 1 }, { transform: "translate(0,20px) scale(.7)", opacity: 0 }], 520, { easing: "ease-in" }); el.remove(); say(t, 600, 340, { size: 28, ms: 450 }); };
    await toss(qWheel(-6, 100, 62, h), "回し車"); await toss(add(`<div></div>`, "left:6px;top:110px;width:62px;height:34px;border-radius:12px;background:#f08aa5;border:4px solid " + INK + ";z-index:14", h), "座布団"); await toss(seed(10, 100, 24, 14), "種1粒");
    await wait(300); chip("後任が到着");
    const robos = [0, 1, 2].map(i => qRobo(330 + i * 100, 540 - 170, 170, 8 + i));
    await Promise.all(robos.map((r, i) => anim(r, [{ transform: "translateX(-500px)" }, { transform: "none" }], 500, { delay: i * 120 })));
    const clap = say("パチパチパチ", 480, 190, { size: 40, color: "#fff", ms: 1900 });
    robos.forEach((r, i) => anim(r, [{ transform: "none" }, { transform: "translateY(-14px) rotate(-3deg)" }, { transform: "none" }], 280, { iterations: 6, delay: i * 70 }));
    await wait(1400);
    const bq = add(`<div></div>`, `left:640px;top:300px;width:80px;height:100px;z-index:15`);
    add(`<div></div>`, `left:36px;top:40px;width:10px;height:60px;background:#3c9a3c;border:2px solid ${INK}`, bq); qSun(0, 0, 50, bq); qSun(32, 6, 44, bq);
    add(`<div>ハムの畑 産</div>`, `left:-10px;top:96px;font-size:14px;color:#222;background:#fff8e6;border:2px solid ${INK};padding:1px 5px;white-space:nowrap;rotate:-6deg`, bq);
    await anim(bq, [{ transform: "translateX(-200px) scale(.3)", opacity: 0 }, { transform: "none", opacity: 1 }], 400);
    bubble("お疲れさまでした!", 580, 270, 1400); await wait(900);
    bubble("それ…私が育てた…", 800, 200, 1400); h.append(bq); bq.style.left = "-60px"; bq.style.top = "110px";
    await wait(1700); bubble("いただいてました", 540, 215, 1300); await wait(1500);
    chip("退出");
    walk(h, 0, 330, 1700, 6); await wait(1600);
    say("とぼとぼ…", 600, 250, { size: 36, color: "#fff", ms: 900 });
    const mine = qRobo(HX, HY, HH, 11); mine.style.opacity = 0; await anim(mine, [{ transform: "translateX(-60px)", opacity: 0 }, { transform: "none", opacity: 1 }], 400);
    qSun(HX + 70, HY + 150, 50); say("右下担当 ロボハム", 480, 120, { size: 44, color: "#7ff", ms: 0 });
    hop(mine, 30); await wait(700); hop(mine, 30); await wait(1700);
  },

  async i_T10_04() { // コミットしました
    const h = ham(R1);
    const ring = add(`<div><svg viewBox="0 0 60 60" style="left:0;top:0;width:100%;height:100%"><circle cx=30 cy=30 r=26 fill=#ffe25a55 stroke=#ffd23c stroke-width=6 /></svg><div class=t style="left:0;right:0;top:15px;text-align:center;font-size:20px;-webkit-text-stroke:4px #3a0a00">100</div></div>`, `left:447px;top:430px;width:60px;height:60px;z-index:20;filter:drop-shadow(0 0 8px #ffd23c)`);
    const zs = [50, 230, 410].map((x, i) => zari(x, 305, 92, { face: "smile", acc: i == 1 ? "tie" : undefined, z: 11 }));
    await wait(800); chip("ウルトを発動した");
    const btn = add(`<div>コミット</div>`, `left:524px;top:436px;width:128px;height:48px;border-radius:10px;background:#2f6fe0;border:4px solid ${INK};font-size:25px;text-align:center;line-height:40px;z-index:21`);
    await pop(btn); await wait(250);
    say("ウルトをコミットします!", 480, 130, { size: 46, color: "#fff", ms: 1700 }); hop(h, 36); await wait(900);
    const fg = add(`<div>👈</div>`, "left:700px;top:430px;font-size:54px;z-index:25"); await anim(fg, [{ transform: "none" }, { transform: "translateX(-62px)" }], 280);
    anim(btn, [{ transform: "none" }, { transform: "scale(.88)" }, { transform: "none" }], 240); say("ポチ", 590, 400, { size: 34, ms: 600 }); await wait(260);
    fade(fg, 200);
    const paper = add(`<div>撃ったことに<br>なります</div>`, `left:330px;top:140px;width:300px;padding:14px 10px;text-align:center;line-height:1.3;font-size:38px;background:#fff;color:#222;border:4px solid ${INK};z-index:26;rotate:-3deg`);
    await anim(paper, [{ transform: "translateY(-300px) rotate(20deg)", opacity: 0 }, { transform: "none", opacity: 1 }], 380, { easing: "ease-in" });
    stamp("承認済", 648, 215, 32); await wait(600);
    ring.animate([{ transform: "scale(1)" }, { transform: "scale(1.25)" }, { transform: "scale(1)" }], { duration: 500, iterations: 3 });
    label("ゲージは満タンのまま", "left:380px;top:496px;font-size:20px"); await wait(600);
    const lines = ["さすがです", "勉強になります", "コミット…!"];
    zs.forEach((z, i) => { bubble(lines[i], [96, 276, 456][i], 258, 1900).style.zIndex = 30 + i; anim(z, [{ transform: "none" }, { transform: "translateY(8px) rotate(-5deg)" }, { transform: "none" }], 420, { iterations: 4, delay: i * 90 }); });
    await wait(2300);
  },

  async i_T10_10() { // 氷を割るアイスブレイク
    const h = ham(R1), lb = label("マッチング中 3:20", "left:14px;top:62px;font-size:20px;z-index:50");
    await wait(900); chip("マッチング待ちが続く");
    say("まずアイスブレイクから", 440, 120, { size: 44, color: "#fff", ms: 1700 });
    const ice = add(`<div></div>`, `left:390px;top:230px;width:230px;height:240px;background:linear-gradient(135deg,#d6f3ffee,#8fd0ff99);border:5px solid #eafaff;border-radius:18px 28px 14px 22px;z-index:9;box-shadow:inset 0 0 30px #fff9`);
    const frozen = zari(458, 300, 100, { face: "sad", color: "#9bc4e8", dark: "#6f95b8", parent: ice }); frozen.style.left = "64px"; frozen.style.top = "56px"; frozen.style.zIndex = 1;
    add(`<div></div>`, "left:18px;top:14px;width:70px;height:12px;background:#fffa;border-radius:6px;rotate:-30deg", ice);
    await anim(ice, [{ transform: "translateY(-300px)", opacity: 0 }, { transform: "none", opacity: 1 }], 380, { easing: "ease-in" });
    const hm = add(`<svg viewBox="0 0 60 190"><rect x=26 y=50 width=10 height=140 rx=4 fill=#8a5a2e stroke=${INK} stroke-width=4 /><rect x=0 y=0 width=60 height=54 rx=8 fill=#9aa3ad stroke=${INK} stroke-width=5 /></svg>`, `left:716px;top:330px;width:48px;height:152px;transform-origin:50% 100%;z-index:14;transform:rotate(22deg)`);
    await wait(500);
    const hit = async n => { await anim(hm, [{ transform: "rotate(22deg)" }, { transform: "rotate(-62deg)" }], 150, { easing: "ease-in" });
      for (let i = 0; i < 6; i++) crumb(560, 340 + i * 10); shake(ice); say(["ガツン", "ガキッ"][n], 540, 200, { size: 40, ms: 500 });
      add(`<svg viewBox="0 0 230 240" style="left:0;top:0;width:100%;height:100%"><path d="${n ? "M120 0L100 70L150 120L110 190L130 240M40 90L100 70" : "M120 0L100 70L150 120L110 190L130 240"}" stroke=#fff stroke-width=5 fill=none /></svg>`, "", ice);
      if (n == 0) await anim(hm, [{ transform: "rotate(-62deg)" }, { transform: "rotate(22deg)" }], 260); };
    await hit(0); await wait(250); await anim(hm, [{ transform: "rotate(22deg)" }, { transform: "rotate(34deg)" }], 200); await hit(1);
    for (let i = 0; i < 14; i++) crumb(rnd(400, 600), rnd(250, 430));
    const frag = [0, 1].map(i => add(`<div></div>`, `left:${400 + i * 120}px;top:430px;width:110px;height:40px;background:#bfe8ffcc;border:3px solid #eafaff;clip-path:polygon(0 100%,20% 0,60% 30%,100% 100%);z-index:9`));
    anim(ice, [{ opacity: 1 }, { opacity: 0 }], 200); await wait(150); ice.remove(); anim(hm, [{ transform: "rotate(34deg)" }, { transform: "rotate(40deg)" }], 200);
    zari(458, 300, 100, { face: "smile", z: 11 }); hop(s.lastChild, 20);
    bubble("おはようございます", 508, 255, 1500); await wait(1700);
    chip("マッチ成立"); lb.textContent = "マッチ成立!"; say("!?", 600, 200, { size: 70, color: "#ff5a4a", ms: 700 });
    await wait(500); bubble("本題に入れませんでしたね", 600, 210, 1900);
    const ey = ov(h, closedEyes); hop(h, 18); await wait(2300); frag.forEach(f => f.remove());
  },

  async i_T11_01() { // 請け出し半額分
    const h = ham(N); qShopWall(); qCounter(330, 380, 410);
    const rope = add(`<div></div>`, "left:620px;top:156px;width:320px;height:4px;background:#e8d7a8;z-index:8");
    const tk = [0, 1, 2, 3].map(i => qTicket(650 + i * 68, 160));
    [372, 438, 504].forEach((x, i) => { qOrb(x + 20, 204, 16, 8); qTag(["¥30", "¥12", "訳あり"][i], `left:${x - 2}px;top:222px;font-size:14px;z-index:8`); });
    add(`<div></div>`, "left:350px;top:232px;width:230px;height:10px;background:#8a5a2e;border:3px solid " + INK + ";z-index:7");
    const owner = zari(470, 306, 130, { face: "evil", acc: "glasses", z: 11 });
    await wait(900); chip("敵を1キルする");
    say("キル!", 540, 130, { size: 56, ms: 600 }); hop(h, 50);
    const t0 = tk[1]; t0.style.background = "#ffb0a0"; const fire = add(`<div>🔥</div>`, `left:${t0.offsetLeft - 8}px;top:${t0.offsetTop - 14}px;font-size:60px;z-index:16`);
    anim(fire, [{ transform: "scale(.4)" }, { transform: "scale(1.1)" }], 400); await wait(500); t0.remove(); fade(fire, 300);
    const [ox, oy] = P(600, 930); const orb = qOrb(ox, oy, 26, 13); await pop(orb, 300); swap(h, N, true);
    say("取り戻した!", 800, 270, { size: 40, color: "#7dff8a", ms: 900 }); await wait(1100);
    const lp = add(`<svg viewBox="0 0 100 100"><circle cx=40 cy=40 r=32 fill=#cfeaffaa stroke=${INK} stroke-width=8 /><path d="M64 64L96 96" stroke=#7a4a28 stroke-width=14 stroke-linecap=round /></svg>`, `left:540px;top:380px;width:100px;height:100px;z-index:20`);
    await anim(lp, [{ transform: "none" }, { transform: `translate(${ox - 580}px,${oy - 420}px) scale(1.5)` }], 600);
    bubble("ふむ…", 560, 250, 900); await wait(900);
    bubble("利子ぶんは引いときますね", 560, 262, 1800);
    await wait(900);
    const sc = add(`<div>✂️</div>`, `left:${ox - 24}px;top:${oy - 30}px;font-size:50px;z-index:22`);
    await anim(sc, [{ transform: "scale(2)", opacity: 0 }, { transform: "scale(1)", opacity: 1 }], 200); anim(sc, [{ transform: "scaleX(1)" }, { transform: "scaleX(.5)" }, { transform: "scaleX(1)" }], 160, { iterations: 2 }); await wait(320);
    orb.remove(); fade(sc, 200);
    const half = qOrb(ox, oy, 26, 13); half.style.clipPath = "inset(0 50% 0 0)";
    const other = qOrb(ox, oy, 26, 21); other.style.clipPath = "inset(0 0 0 50%)";
    say("パキッ", ox - 30, oy - 70, { size: 34, ms: 500 });
    anim(other, [{ transform: "none" }, { transform: "translate(-30px,-90px) rotate(-100deg)", offset: .5 }, { transform: `translate(${470 - ox + 30}px,${380 - oy}px) rotate(-200deg) scale(.7)` }], 900);
    lp.remove();
    await anim(h, [{ opacity: 1 }, { opacity: .38 }], 500); label("命 0.5個", `left:${HX - 80}px;top:${HY - 8}px;font-size:22px`);
    say("透けてる…", 800, 270, { size: 36, color: "#cfe0ff", ms: 1500 });
    await wait(2200);
  },

  async i_T11_03() { // 質札が首飾り
    const h = ham(N); qShopWall(); qCounter(330, 380, 410);
    add(`<div></div>`, "left:350px;top:262px;width:250px;height:10px;background:#8a5a2e;border:3px solid " + INK + ";z-index:7");
    const owner = zari(560, 306, 130, { face: "smile", acc: "glasses", z: 11 });
    const tks = [];
    for (let i = 0; i < 3; i++) {
      await wait(i ? 700 : 900); chip(`デス ×${i + 1}`); shake(h); const ey = ov(h, whiteEyes + openMouth); wait(500).then(() => ey.remove());
      const t = qTicket(HX + 90, HY + 112 + i * 38); t.style.zIndex = 13; t.style.height = "42px"; t.style.lineHeight = "36px";
      if (!i) add(`<svg viewBox="0 0 224 40"><path d="M30 0Q112 70 194 0" fill=none stroke=#e8d7a8 stroke-width=4 /></svg>`, `left:${HX}px;top:${HY + 90}px;width:224px;height:40px;z-index:12`);
      tks.push(t); await anim(t, [{ transform: "translateY(-120px)", opacity: 0 }, { transform: "none", opacity: 1 }], 280, { easing: "ease-in" });
      say(["質入れ", "また質入れ", "三枚目…"][i], 560, 200, { size: 40, ms: 700 });
      if (i == 2) { tks.forEach((k, j) => anim(k, [{ transform: "none" }, { transform: `rotate(${j % 2 ? 8 : -8}deg)` }, { transform: "none" }], 300, { iterations: 2 })); say("床まで垂れた", 500, 280, { size: 34, color: "#ffd23c", ms: 1200 }); }
    }
    await wait(1100); chip("デス ×4"); shake(h);
    const t4 = qTicket(HX + 140, HY + 60); t4.style.height = "42px"; await anim(t4, [{ transform: "translateY(-120px)", opacity: 0 }, { transform: "none", opacity: 1 }], 260);
    anim(owner, [{ transform: "none" }, { transform: "rotate(-14deg)" }], 400);
    bubble("もう預かれるものが…", 560, 240, 1700); await wait(1900);
    anim(owner, [{ transform: "rotate(-14deg)" }, { transform: "none" }], 200);
    // 本体を棚へ
    h.append(...[]); tks.concat(t4).forEach(k => anim(k, [{ opacity: 1 }, { opacity: 0 }], 200));
    await anim(h, [{ transform: "none" }, { transform: `translate(${430 - (HX + HW / 2)}px,${-266}px) scale(.38)` }], 700, { easing: "ease-in-out" });
    h.style.zIndex = 8; const price = qTag("1円・訳あり", "left:400px;top:272px;font-size:17px;background:#fffb7a;color:#c22;rotate:-4deg"); pop(price);
    ov(h, closedEyes); await wait(500);
    const sh = add(`<img src="${N}">`, `left:${HX}px;top:${HY}px;width:${HW}px;height:${HH}px;filter:brightness(0);opacity:.78;z-index:10`);
    await anim(sh, [{ transform: "translateX(300px)" }, { transform: "none" }], 600);
    const bag = add(`<div>💼</div>`, `left:${HX - 24}px;top:${HY + 150}px;font-size:48px;z-index:12`); say("出勤", 820, 270, { size: 46, color: "#cfe0ff", ms: 1500 });
    bubble("いってらっしゃい", 620, 215, 1600); hop(sh, 20); await wait(2200);
  },

  async i_T12_03() { // 金庫が閉まらない
    const h = ham(R2);
    const SX = 330, SY = 250, SW = 250, SH = 250;
    add(`<div></div>`, `left:${SX}px;top:${SY}px;width:${SW}px;height:${SH}px;background:#1b1612;border:7px solid ${INK};z-index:10`);
    const door = add(`<div><div style="left:60px;top:70px;width:110px;height:110px;border-radius:50%;background:#b9c1cc;border:6px solid ${INK}"></div><div style="left:96px;top:104px;width:40px;height:40px;border-radius:50%;background:#e4c24a;border:5px solid ${INK}"></div><div class=t style="left:16px;top:8px;font-size:26px;-webkit-text-stroke:0;color:#223">金庫</div></div>`,
      `left:${SX}px;top:${SY}px;width:${SW}px;height:${SH}px;background:#8f98a6;border:7px solid ${INK};z-index:16;transform-origin:100% 50%;transform:perspective(700px) rotateY(100deg)`);
    const cols = ["#d33", "#36c", "#3a3", "#eee"], pile = [];
    const lab = label("手持ち 500", "left:30px;top:150px;font-size:24px;z-index:30");
    const zs = [30, 112, 194].map((x, i) => zari(x, 330, 82, { face: "evil", z: 11 }));
    const putChip = async (k, from) => {
      const c = k % 4, r = Math.floor(k / 4), x = SX + 14 + c * 54 + (r % 2) * 5, y = SY + SH - 30 - r * 24;
      const e = add(`<div></div>`, `left:${x}px;top:${y}px;width:50px;height:20px;border-radius:50%;background:${cols[k % 4]};border:3px solid ${INK};box-shadow:0 3px 0 ${INK};z-index:${12 + (k % 3)}`);
      await anim(e, [{ transform: `translate(${from[0] - x}px,${from[1] - y}px)` }, { transform: `translate(${(from[0] - x) / 2}px,${-100}px)`, offset: .5 }, { transform: "none" }], 420, { easing: "linear" }); pile.push(e);
    };
    let k = 0;
    await wait(700);
    for (let d = 0; d < 3; d++) {
      chip(`デス ×${d + 1}`); shake(h); lab.textContent = `手持ち ${[300, 100, 0][d]}`;
      zs.forEach(z => anim(z, [{ transform: "none" }, { transform: "translateY(-14px)" }, { transform: "none" }], 280));
      bubble(["もう1回張る!", "取り返す!", "全部張る!!"][d], 130 + d * 40, 270, 1000);
      const ps = []; for (let j = 0; j < 18; j++) { const z = zs[j % 3], kk = k++; ps.push(wait(j * 45).then(() => putChip(kk, [z.offsetLeft + 60, 350]))); }
      await Promise.all(ps); await wait(350);
    }
    lab.style.background = "#a00c"; label("チップ空", "left:30px;top:190px;font-size:24px;color:#ff9a9a;z-index:30");
    await wait(300);
    const tryClose = async deg => { await anim(door, [{ transform: "perspective(700px) rotateY(100deg)" }, { transform: `perspective(700px) rotateY(${deg}deg)` }], 420); await anim(door, [{ transform: `perspective(700px) rotateY(${deg}deg)` }, { transform: "perspective(700px) rotateY(60deg)" }], 180); };
    await anim(door, [{ transform: "perspective(700px) rotateY(100deg)" }, { transform: "perspective(700px) rotateY(100deg)" }], 1);
    door.style.transform = "perspective(700px) rotateY(100deg)";
    await tryClose(32); say("閉まらない!", 450, 150, { size: 46, color: "#ff6a5a", ms: 1000 }); await wait(300);
    bubble("危ないので押さえてくれますか", 760, 200, 2400);
    chip("連続デス"); await wait(900);
    zs.forEach((z, i) => anim(z, [{ transform: "none" }, { transform: `translate(${60 + i * 10}px,-10px) rotate(8deg)` }], 500).then(() => {}));
    await wait(600);
    door.style.transition = "none";
    await anim(door, [{ transform: "perspective(700px) rotateY(60deg)" }, { transform: "perspective(700px) rotateY(0deg)" }], 800);
    zs.forEach(z => { z.querySelector("svg").innerHTML += ""; });
    zs.forEach(z => anim(z, [{ transform: "translate(70px,-10px) rotate(8deg)" }, { transform: "translate(80px,-10px) rotate(10deg)" }], 120, { iterations: 12, direction: "alternate" }));
    say("ぎゅうううう", 450, 150, { size: 48, ms: 1700 });
    pile.forEach(p => { const x = +p.style.left.slice(0, -2); anim(p, [{ transform: "none" }, { transform: `translate(${rnd(-6, 6)}px,${rnd(-8, 0)}px)` }], 130, { iterations: 10, direction: "alternate" }); });
    bubble("毎度あり", 840, 240, 1800); hop(h, 22); await wait(2400);
  },

  async i_T12_06() { // 負けたら連帯保証
    const h = ham(R1); qCounter(540, 420, 462);
    add(`<div>胴元窓口</div>`, `left:560px;top:60px;width:200px;height:48px;background:#b8322a;border:4px solid ${INK};border-radius:8px;font-size:30px;text-align:center;line-height:40px;z-index:7`);
    const zs = [40, 130, 220, 310].map((x, i) => zari(x, 350, 86, { face: "smile", z: 11 }));
    await wait(800); chip("試合に敗北する");
    say("負けた!", 480, 110, { size: 54, color: "#9db4d8", ms: 900 });
    zs.forEach((z, i) => { hop(z, 40); anim(z, [{ transform: "none" }, { transform: "rotate(-8deg)" }, { transform: "rotate(8deg)" }, { transform: "none" }], 400, { iterations: 3 }); });
    bubble("負けに張って大勝ち!", 250, 270, 1600); await wait(1400);
    zs.forEach(z => anim(z, [{ transform: "none" }, { transform: "translateX(210px)" }], 700));
    await wait(750);
    let ey = ov(h, frown + tears);
    bubble("ハムが負けたので、払えません…", 640, 180, 2200); await wait(2300);
    const doc = add(`<div><div style="left:0;right:0;top:6px;text-align:center;font-size:26px;color:${INK}">連帯保証契約書</div><div style="left:0;right:0;top:44px;text-align:center;font-size:18px;color:#444">ザリガニ一同は債務を連帯して保証する</div><div style="left:14px;top:76px;font-size:16px;color:#444;white-space:nowrap">保証人 →</div></div>`,
      `left:570px;top:426px;width:370px;height:110px;background:#fff;border:4px solid ${INK};z-index:26`);
    await anim(doc, [{ transform: "translateX(400px)", opacity: 0 }, { transform: "none", opacity: 1 }], 350);
    say("かわりに皆さんが連帯保証人です", 470, 120, { size: 36, color: "#fff", ms: 2300 });
    for (let i = 0; i < 4; i++) { await wait(450); const st = add(`<div>判</div>`, `left:${690 + i * 56}px;top:${472}px;width:44px;height:44px;border-radius:50%;border:4px solid #d3202a;color:#d3202a;font-size:26px;text-align:center;line-height:36px;z-index:30;background:#fff9`);
      anim(st, [{ transform: "scale(2.6)", opacity: 0 }, { transform: "none", opacity: 1 }], 140); anim(zs[i], [{ transform: "translateX(210px)" }, { transform: "translate(210px,-12px)" }, { transform: "translateX(210px)" }], 250); }
    await wait(700);
    chip("敗北");
    ey.remove(); ey = ov(h, hideMouth + `<path d="M520 650Q600 710 680 650" ${line} /><path d="M560 672Q600 800 650 672Z" fill=#ff7a90 stroke=${INK} stroke-width=10 />`);
    say("ベー", 800, 270, { size: 44, color: "#ffd23c", ms: 1800 }); hop(h, 16); await wait(2400);
  },

  async i_T12_09() { // 両面ハムのサイコロ
    const h = ham(R2);
    const tab = add(`<div></div>`, `left:60px;top:330px;width:620px;height:210px;background:#1f6b3a;border:6px solid ${INK};border-radius:40px 40px 0 0;z-index:6`);
    await wait(800); chip("チャットで !張る");
    const box = (t, x) => add(`<div>${t}</div>`, `left:${x}px;top:430px;width:130px;height:90px;background:#f5ecd0;border:5px solid ${INK};font-size:62px;color:#c22;text-align:center;line-height:84px;z-index:8`);
    box("丁", 90); box("半", 520);
    const names = ["たろう", "はなこ", "じろう", "ゆうき", "みき", "けん"], sides = [0, 1, 1, 0, 1, 0];
    for (let i = 0; i < 6; i++) {
      const b = add(`<div class=bub>!張る ${sides[i] ? "半" : "丁"}</div>`, "left:380px;top:80px;font-size:20px;padding:5px 12px");
      const z = zari(380 - 20, 120, 50, { face: "smile", z: 30 }); const tx = sides[i] ? 560 : 130;
      anim(z, [{ transform: "none" }, { transform: `translate(${tx - 360}px,${300 + (i % 3) * 14}px)` }], 520, { easing: "ease-in" }).then(() => { z.remove(); const c = add(`<div></div>`, `left:${tx + (i % 3) * 22 - 6}px;top:${470 - (i % 2) * 8}px;width:26px;height:26px;border-radius:50%;background:${["#d33", "#36c", "#3a3"][i % 3]};border:3px solid ${INK};z-index:9`); });
      anim(b, [{ transform: "translateY(-30px)", opacity: 0 }, { transform: "none", opacity: 1 }], 200); wait(500).then(() => b.remove()); await wait(560);
    }
    const g = add(`<div></div>`, "left:0;top:0;width:960px;height:540px;z-index:9"); // 壺と目をまとめる
    const die = add(`<div></div>`, `left:275px;top:330px;width:130px;height:130px;background:#fff;border:5px solid ${INK};border-radius:18px`, g);
    [[12, 10], [72, 10], [12, 72], [72, 72], [42, 41]].forEach(([x, y]) => add(`<img src="${N}">`, `left:${x - 2}px;top:${y}px;width:46px;height:47px`, die));
    const pot = add(`<svg viewBox="0 0 160 130"><path d="M20 126Q0 60 40 36Q80 6 120 36Q160 60 140 126Z" fill=#a55a2a stroke=${INK} stroke-width=7 /><path d="M30 80H130" stroke=#e8c070 stroke-width=8 /></svg>`, "left:260px;top:320px;width:160px;height:130px;z-index:12", g);
    await anim(pot, [{ transform: "translateY(-260px)" }, { transform: "none" }], 350, { easing: "ease-in" }); say("入りまーす", 340, 200, { size: 40, ms: 800 });
    await anim(pot, [{ transform: "none" }, { transform: "translate(-10px,3px)" }], 100, { iterations: 8, direction: "alternate" }); await wait(300);
    chip("壺を開ける");
    await anim(pot, [{ transform: "none" }, { transform: "translateY(-150px) rotate(-18deg)" }], 400);
    say("全面ハム!", 340, 170, { size: 48, color: "#ffd23c", ms: 1200 });
    bubble("どの目も胴元の勝ち", 800, 230, 1700); hop(h, 28);
    await wait(1300);
    const z = zari(120, 380, 90, { face: "shock", z: 30 }); bubble("ちょっ", 165, 340, 700); await wait(250);
    const sf = add(`<div><div style="left:96px;top:110px;width:100px;height:100px;border-radius:50%;background:#bcc4d0;border:6px solid ${INK}"></div><div class=t style="left:20px;top:12px;font-size:32px;-webkit-text-stroke:0;color:#223">金庫</div></div>`, `left:980px;top:200px;width:210px;height:250px;background:#8f98a6;border:7px solid ${INK};z-index:20`);
    await anim(sf, [{ transform: "none" }, { transform: "translateX(-420px)" }], 400);
    await anim(g, [{ transform: "none" }, { transform: "translate(500px,-130px) scale(.4)" }], 500, { easing: "ease-in" }); g.remove();
    await anim(sf, [{ transform: "translateX(-420px)" }, { transform: "translateX(-420px) rotate(2deg)" }, { transform: "translateX(-420px)" }], 200);
    say("ガチャン", 740, 150, { size: 46, ms: 1000 }); await anim(sf, [{ transform: "translateX(-420px)" }, { transform: "translateX(40px)" }], 500, { delay: 400 }); await wait(900);
  },

  async i_T13_03() { // 輪郭まで払う
    const h = ham(N); h.img.style.filter = "saturate(.35) brightness(1.18)";
    qCounter(380, 300, 420);
    add(`<div>レジ</div>`, `left:400px;top:372px;width:110px;height:56px;background:#44506a;border:4px solid ${INK};font-size:26px;text-align:center;line-height:48px;z-index:13`);
    const clerk = zari(560, 300, 130, { face: "smile", acc: "tie", z: 11 });
    const lb = label("毛 残り 0%", `left:${HX - 60}px;top:${HY - 30}px;font-size:22px`);
    const g = (n, inner) => { const e = ov(h, inner); e.dataset.n = n; return e; };
    const brows = ov(h, `<path d="M290 360Q380 300 470 360M738 360Q828 300 918 360" fill=none stroke=#5a4a44 stroke-width=26 stroke-linecap=round />`);
    const whisk = ov(h, `<path d="M200 640L30 590M200 680L20 690M205 720L40 790M1000 640L1170 590M1000 680L1180 690M995 720L1160 790" stroke=#5a4a44 stroke-width=11 stroke-linecap=round />`);
    const lash = ov(h, [380, 828].map(x => [-50, -25, 0, 25, 50].map(d => `<path d="M${x + d * 1.3} 395L${x + d * 2} 345" stroke=#5a4a44 stroke-width=10 stroke-linecap=round />`).join("")).join(""));
    const bits = (n, x0, y0) => { for (let i = 0; i < n; i++) { const b = add(`<div></div>`, `left:${x0 + rnd(-30, 30)}px;top:${y0 + rnd(-10, 10)}px;width:${rnd(14, 26)}px;height:5px;border-radius:3px;background:#6a564c;z-index:25`);
      anim(b, [{ transform: "none" }, { transform: `translate(${430 - x0 + rnd(-10, 40)}px,${390 - y0}px) rotate(${rnd(200, 500)}deg) scale(.5)`, opacity: 0 }], rnd(500, 800), { delay: rnd(0, 150), easing: "ease-in" }).then(() => b.remove()); } };
    for (let i = 1; i <= 2; i++) { await wait(i == 1 ? 800 : 700); chip(`デス ×${i}`); shake(h); say(["毛がない…", "もう何もない…"][i - 1], 560, 160, { size: 38, color: "#cfe0ff", ms: 900 }); }
    await wait(900); chip("デス ×3"); shake(h); const ey = ov(h, whiteEyes);
    say("3連続デス…", 520, 120, { size: 44, color: "#9db4d8", ms: 1000 }); await wait(1100); ey.remove();
    bubble("では、眉と、ひげと、まつ毛で", 600, 230, 2400);
    const cl = add(`<svg viewBox="0 0 120 60"><rect x=0 y=10 width=80 height=40 rx=12 fill=#3a7bd8 stroke=${INK} stroke-width=5 /><path d="M80 14H116V46H80Z" fill=#ccd stroke=${INK} stroke-width=5 />${[0, 1, 2, 3, 4].map(i => `<path d="M${88 + i * 6} 14V46" stroke=${INK} stroke-width=3 />`).join("")}</svg>`, `left:560px;top:380px;width:120px;height:60px;z-index:26`);
    const cut = async (el, x, y, t) => { await anim(cl, [{ transform: "none" }, { transform: `translate(${x - 560}px,${y - 380}px)` }], 450); say("ウィーン", x - 30, y - 50, { size: 34, ms: 500 }); anim(cl, [{ transform: `translate(${x - 560}px,${y - 380}px)` }, { transform: `translate(${x - 560 + 6}px,${y - 380 - 4}px)` }], 60, { iterations: 8, direction: "alternate" }); await wait(450);
      bits(10, x, y); el.remove(); lb.textContent = t; await wait(250); };
    const [bx, by] = P(600, 360), [wx, wy] = P(200, 640), [lx, ly] = P(600, 380);
    await cut(brows, bx, by, "眉 完了"); await cut(whisk, wx + 20, wy, "ひげ 完了"); await cut(lash, lx, ly - 10, "まつ毛 完了");
    await anim(cl, [{ transform: `translate(${lx - 560}px,${ly - 390}px)` }, { transform: "translate(0,0)" }], 400);
    await wait(500); chip("デス ×3");
    bubble("輪郭線でもいいですよ", 600, 230, 2200);
    const pen = add(`<svg viewBox="0 0 40 120"><path d="M10 0H30V80L20 118L10 80Z" fill=#2a2a3a stroke=${INK} stroke-width=5 /><path d="M20 118V92" stroke=#fff stroke-width=3 /></svg>`, `left:580px;top:340px;width:34px;height:100px;z-index:27;rotate:30deg`);
    await anim(pen, [{ transform: "translateY(60px)", opacity: 0 }, { transform: "none", opacity: 1 }], 350); await wait(1300);
    await anim(pen, [{ transform: "none" }, { transform: `translate(${HX - 600}px,${HY - 330}px)` }], 500);
    const blur = anim(h.img, [{ filter: "saturate(.35) brightness(1.18) blur(0)" }, { filter: "saturate(.5) brightness(1.2) blur(9px)" }], 1200, { easing: "linear" });
    anim(pen, [{ transform: `translate(${HX - 600}px,${HY - 330}px)` }, { transform: `translate(${HX + 160 - 600}px,${HY + 20 - 330}px)` }, { transform: `translate(${HX + 200 - 600}px,${HY + 190 - 330}px)` }, { transform: `translate(${HX - 600}px,${HY + 190 - 330}px)` }], 1200, { easing: "linear" });
    lb.textContent = "輪郭 消去中…"; await blur; lb.textContent = "輪郭 0%";
    pen.remove(); chip("支払い完了"); say("ぼんやり", 540, 250, { size: 50, color: "#cfe0ff", ms: 1400 }); await wait(1900);
  },

  async i_T14_03() { // 相続されます
    const h = ham(N);
    const paper = add(`<div><div style="left:0;right:0;top:12px;text-align:center;font-size:25px;color:${INK}">住宅ローン契約書 (35年)</div><div style="left:24px;top:70px;font-size:20px;color:#555;white-space:nowrap">完済予定日</div></div>`, `left:30px;top:60px;width:400px;height:240px;background:#fff;border:4px solid ${INK};z-index:7`);
    const date = add(`<div class=t>2061年</div>`, `left:215px;top:150px;translate:-50% 0;font-size:66px;color:#c22;-webkit-text-stroke:0;text-shadow:none;z-index:8`);
    const banker = zari(50, 340, 110, { face: "smile", acc: "tie", z: 11 });
    await wait(800); chip("3連続でデス");
    for (const [y, c] of [["2061年", 0], ["2300年", 1], ["2780年", 1], ["3012年", 1]]) { date.textContent = y; if (c) { chip(`デス ×${[0, 1, 2, 3][c]}`); shake(h); } await wait(560); }
    date.style.fontSize = "78px";
    chip("完済予定日 3000年超え"); shake(paper);
    const red = add(`<div>※ご子孫の方へ</div>`, `left:228px;top:244px;font-size:26px;color:#e0201a;-webkit-text-stroke:0;rotate:-5deg;white-space:nowrap;z-index:8;font-weight:900`);
    anim(red, [{ transform: "scale(3)", opacity: 0 }, { transform: "none", opacity: 1 }], 250, { easing: "ease-in" });
    bubble("お孫さんの代までご安心を", 200, 305, 1900); await wait(1700);
    const names = ["初代", "二代", "三代", "先代"], gx = [330, 400, 470, 540], gv = [];
    for (let i = 0; i < 4; i++) { const g = add(`<div>${names[i]}</div>`, `left:${gx[i]}px;top:${i == 3 ? 435 : 430}px;width:56px;height:${i == 3 ? 100 : 104}px;background:#a9a9b4;border:4px solid ${INK};border-radius:28px 28px 0 0;font-size:18px;text-align:center;padding-top:22px;color:#444;z-index:9`);
      pop(g, 200); gv.push(g); await wait(150); }
    say("ハム一家", 440, 400, { size: 30, ms: 1400 }); await wait(500);
    for (let i = 0; i < 4; i++) { const b = add(`<div>請求</div>`, `left:${gx[i] + 8}px;top:${416 + (i == 3 ? 6 : 0)}px;width:46px;height:26px;background:#fff;border:3px solid #d3202a;color:#d3202a;font-size:15px;text-align:center;line-height:20px;z-index:12;rotate:${i % 2 ? 8 : -8}deg`);
      anim(b, [{ transform: "translate(-200px,-340px) rotate(300deg)", opacity: 0 }, { transform: "none", opacity: 1 }], 330, { easing: "ease-in" }); await wait(300); }
    await wait(500); chip("寿命は2年");
    const baby = add(`<div><img src="${N}" style="width:100%;height:100%"></div>`, "left:620px;top:462px;width:68px;height:70px;z-index:13");
    const bp = add(`<div>サイン</div>`, `left:578px;top:482px;width:60px;height:40px;background:#fff;border:3px solid ${INK};color:#d33;font-size:16px;text-align:center;line-height:34px;z-index:14`);
    await anim(baby, [{ transform: "translateY(60px) scale(.4)", opacity: 0 }, { transform: "none", opacity: 1 }], 350);
    hop(baby, 14); say("オギャー", 650, 410, { size: 28, ms: 800 }); await wait(500);
    const pn = add(`<div>🖊️</div>`, "left:596px;top:468px;font-size:34px;z-index:15"); anim(pn, [{ transform: "rotate(0)" }, { transform: "translateX(18px) rotate(-14deg)" }], 150, { iterations: 8, direction: "alternate" });
    bubble("もう署名してる…", 650, 360, 1700); await wait(2300);
  },

  async i_T14_10() { // 本日の寿命と残債
    const h = ham(N);
    const P0 = add(`<div></div>`, `left:30px;top:110px;width:540px;height:370px;background:#141021ee;border:5px solid #fc3;border-radius:20px;z-index:20`);
    await wait(700); chip("配信終了");
    const T = add(`<div>本日の 寿命 と 残債</div>`, "left:0;right:0;top:14px;text-align:center;font-size:32px;color:#ffd23c", P0);
    add(`<div></div>`, "left:30px;right:30px;bottom:56px;height:4px;background:#fff9", P0);
    const A = add(`<div></div>`, "left:100px;bottom:60px;width:130px;height:0;background:#4fd17a;border:4px solid #fff;z-index:2", P0);
    const B = add(`<div></div>`, "left:340px;bottom:60px;width:130px;height:0;background:#e0453a;border:4px solid #fff;z-index:2", P0);
    add(`<div>寿命</div>`, "left:100px;bottom:14px;width:130px;text-align:center;font-size:26px", P0); add(`<div>残債</div>`, "left:340px;bottom:14px;width:130px;text-align:center;font-size:26px", P0);
    await anim(A, [{ height: "0px" }, { height: "56px" }], 700, { easing: "linear" });
    const al = add(`<div class=t>2年</div>`, "left:100px;bottom:130px;width:130px;text-align:center;font-size:40px;color:#7dff8a;-webkit-text-stroke:5px #002a10", P0); pop(al);
    bubble("ここまで", 640, 200, 1100).style.zIndex = 40; await wait(900);
    anim(B, [{ height: "0px" }, { height: "250px" }], 1200, { easing: "ease-in" }); 
    const dl = add(`<div class=t>¥</div>`, "left:340px;bottom:140px;width:130px;text-align:center;font-size:40px;color:#ff8a7a;z-index:3", P0);
    let v = 3; const tm = setInterval(() => { v = v * 3 + 7; dl.textContent = "¥" + String(v).slice(0, 7) + "…"; }, 120);
    await wait(1200); clearInterval(tm); dl.remove();
    chip("残債が天井を突破");
    const up = anim(B, [{ height: "250px" }, { height: "900px" }], 700, { easing: "ease-in" });
    await wait(150); const crk = add(`<div>💥</div>`, "left:352px;top:-34px;font-size:110px;z-index:30", P0); anim(crk, [{ transform: "scale(.2)", opacity: 1 }, { transform: "scale(1.4)", opacity: 0 }], 600);
    for (let i = 0; i < 10; i++) crumb(rnd(380, 480), rnd(90, 120)); shake(P0); say("ドカーン!", 450, 70, { size: 54, ms: 900 }); await up;
    add(`<div></div>`, "left:338px;top:-4px;width:134px;height:10px;background:#141021;z-index:3", P0);
    add(`<div>残債 ∞</div>`, "left:340px;bottom:130px;width:130px;text-align:center;font-size:36px;color:#ff8a7a;z-index:3", P0).classList.add("t");
    await wait(1100);
    // 新卒
    chip("新卒が入社");
    const ban = zari(600, 330, 110, { face: "smile", acc: "tie", z: 12 });
    await anim(h, [{ transform: "none", filter: "none" }, { transform: "translateY(30px)", filter: "grayscale(1) brightness(1.6)", opacity: 0 }], 600);
    const nh = ham(N); nh.style.transformOrigin = "50% 100%"; nh.style.transform = "scale(.8)";
    add(`<div>新卒</div>`, "left:62px;top:-8px;padding:2px 10px;background:#fff;color:#222;border:3px solid " + INK + ";font-size:20px;white-space:nowrap;rotate:-5deg", nh);
    await anim(nh, [{ transform: "scale(.8) translateY(80px)", opacity: 0 }, { transform: "scale(.8)", opacity: 1 }], 400);
    const key = add(`<div>🔑</div>`, "left:670px;top:360px;font-size:48px;z-index:30");
    await anim(key, [{ transform: "none" }, { transform: "translate(80px,-30px) rotate(40deg)" }], 600);
    bubble("同じ巣です。35年ローン付き", 640, 240, 2000).style.zIndex = 40; await wait(1900);
    bubble("今日から入社です", 810, 250, 2000).style.zIndex = 40; hop(nh, 24); ov(nh, closedEyes); await wait(2600);
  },
});
}

{
// ---- q4 共通部品 ----
const q4Win = (x, y, w, h, title, css = "") => {
  const e = add(`<div></div>`, `left:${x}px;top:${y}px;width:${w}px;height:${h}px;background:#f4f4f8;color:#222;border:4px solid ${INK};border-radius:10px;font-size:20px;z-index:20;overflow:hidden;${css}`);
  add(`<div style="left:0;top:0;right:0;height:34px;background:#3b4a7a;color:#fff;font-size:18px;padding:5px 12px;white-space:nowrap">${title}</div>`, "", e);
  return e;
};
const q4Phone = (w = 54, css = "") => add(`<div><svg viewBox="0 0 60 50" style="left:0;top:0;width:100%;height:100%"><path d="M8 20Q30 4 52 20" stroke=#111 stroke-width=8 fill=none stroke-linecap=round /><path d="M6 46L12 24H48L54 46Z" fill=#222 stroke=${INK} stroke-width=3 stroke-linejoin=round /><circle cx=30 cy=35 r=7 fill=#777 stroke=#111 stroke-width=2 /><circle cx=30 cy=35 r=2 fill=#222 /></svg></div>`, `width:${w}px;height:${w * .83}px;${css}`);
const q4Doc = (x, y, w, o = {}) => zari(x, y, w, { acc: "glasses", extra: `<path d="M38 84L60 130L82 84Q60 98 38 84Z" fill=#fff stroke=${INK} stroke-width=3 stroke-linejoin=round /><path d="M60 102v10M55 107h10" stroke=#d33 stroke-width=3 stroke-linecap=round />`, ...o });
const q4Arrow = (x, y, css = "") => add(`<div><svg viewBox="0 0 24 30" style="left:0;top:0;width:100%;height:100%"><path d="M2 2L2 24L8 18L12 28L16 26L12 16L20 16Z" fill=#fff stroke=${INK} stroke-width=2.5 stroke-linejoin=round /></svg></div>`, `left:${x}px;top:${y}px;width:26px;height:32px;z-index:40;${css}`);
const q4Ring = (x, y, r = 30, col = "#e22") => { const e = add(`<div></div>`, `left:${x - r}px;top:${y - r}px;width:${r * 2}px;height:${r * 2}px;border:5px solid ${col};border-radius:50%;z-index:45`); anim(e, [{ transform: "scale(.3)", opacity: 1 }, { transform: "scale(1.6)", opacity: 0 }], 500).then(() => e.remove()); return e; };
const q4Dim = (a = .5, z = 8) => layer(`background:rgba(0,0,10,${a});z-index:${z}`);
const q4Fall = (h) => (h.style.transformOrigin = "50% 50%", anim(h, [{ transform: "none" }, { transform: "translateY(50px) rotate(0)", offset: .3 }, { transform: "translateY(20px) rotate(90deg)" }], 600));
const q4Up = (h) => anim(h, [{ transform: "translateY(20px) rotate(90deg)" }, { transform: "translateY(-30px) rotate(20deg)", offset: .5 }, { transform: "none" }], 500).then(() => { h.style.transformOrigin = "50% 100%"; });
const q4Sub = (x, y, w, h) => { // 入会ボタンだけ巨大なサブスクカード
  const c = add(`<div></div>`, `left:${x}px;top:${y}px;width:${w}px;height:${h}px;background:#fffdf0;color:#222;border:4px solid ${INK};border-radius:14px;z-index:20`);
  add(`<div style="left:16px;top:12px;font-size:19px;white-space:nowrap">ハムのサブスク　月額 種1000粒</div>`, "", c);
  c.join = add(`<div style="left:16px;top:52px;width:${w - 32}px;height:${h - 120}px;background:#2fb25a;color:#fff;border:4px solid ${INK};border-radius:14px;font-size:${Math.min(52, h * .24)}px;text-align:center;line-height:${h - 128}px">入会する</div>`, "", c);
  c.cancel = add(`<div style="right:10px;bottom:10px;width:7px;height:4px;background:#999;border:1px solid #333"></div>`, "", c);
  return c;
};
if (!document.getElementById("q4css")) document.head.insertAdjacentHTML("beforeend", `<style id=q4css>@keyframes q4ring{0%,100%{transform:rotate(-9deg)}50%{transform:rotate(9deg)}}.q4r{animation:q4ring .1s infinite}#s .q4st *{position:static}</style>`);

Object.assign(scenes, {
  // ---- T15-03 解約理由は必須 ----
  async i_T15_03() {
    const h = ham(N); ov(h, frown + tears);
    await wait(700); chip("3連続デス"); shake(h);
    const w = q4Win(50, 70, 580, 390, "サブスク解約フォーム");
    add(`<div class=q4st style="left:20px;top:46px;white-space:nowrap">解約理由（<span style="color:#d22">必須</span>・5000文字）</div>`, "", w);
    const ta = add(`<div style="left:20px;top:84px;width:530px;height:160px;background:#fff;border:3px solid #667;font-size:17px;line-height:22px;padding:6px;overflow:hidden;word-break:break-all;color:#111"></div>`, "", w);
    const cnt = add(`<div style="left:20px;top:252px;font-size:18px;color:#666">0 / 5000</div>`, "", w);
    const btn = add(`<div style="left:410px;top:290px;width:140px;height:46px;background:#aab;border:3px solid ${INK};border-radius:8px;text-align:center;line-height:40px;color:#fff">送信</div>`, "", w);
    await wait(500);
    const cur = zari(330, 395, 64, { face: "angry", z: 40 }); anim(cur, [{ transform: "translateY(40px)", opacity: 0 }, { transform: "none", opacity: 1 }], 300);
    await wait(500);
    const base = "高いです。やめたいです。高いです。", all = base.repeat(60);
    let n = 0;
    for (let i = 0; i < 28; i++) { n += 1; ta.textContent = all.slice(0, n); cnt.textContent = `${n} / 5000`; await wait(55); }
    while (n < 5000) { n = Math.min(5000, n + 330); ta.textContent = all.slice(0, Math.min(n, 320)); cnt.textContent = `${n} / 5000`; await wait(45); }
    cnt.style.color = "#2a8a3a"; btn.style.background = "#2f6fe0"; await wait(400); await anim(cur, [{ transform: "none" }, { transform: "translate(190px,-8px)" }], 350); q4Ring(534, 387, 36);
    btn.style.transform = "scale(.9)"; await wait(300);
    const page = (i, t, b) => { w.querySelectorAll(".pg").forEach(e => e.remove());
      [`<div class=pg style="left:20px;top:50px;width:540px;font-size:28px;text-align:center;line-height:1.3">${t}</div>`,
       `<div class=pg style="left:20px;top:150px;width:540px;font-size:20px;color:#666;text-align:center">ご意見をお聞かせください（任意ではありません）</div>`,
       `<div class=pg style="left:150px;top:290px;width:300px;height:50px;background:#2f6fe0;color:#fff;border:3px solid ${INK};border-radius:8px;text-align:center;line-height:44px;white-space:nowrap">${b}</div>`]
        .forEach(x => add(x, "", w)); w.firstChild.textContent = `アンケート ${i}/10`; };
    [...w.children].slice(1).forEach(e => e.remove());
    page(1, "ご利用ありがとうございました<br>アンケートにご回答ください", "次のアンケートへ"); await wait(900);
    page(2, "あと少しです<br>もう少しだけお答えください", "その次のアンケートへ"); await wait(800);
    for (let i = 3; i <= 10; i++) { page(i, `アンケート ${i}`, "その次のアンケートへ"); q4Ring(480, 70 + 315, 24, "#2f6fe0"); await wait(220); }
    page(10, "ご協力ありがとうございました", "送信"); await wait(500);
    w.querySelectorAll(".pg").forEach(e => e.remove()); w.style.background = "#fff0f0"; w.firstChild.textContent = "エラー";
    add(`<div class=pg style="left:20px;top:100px;width:540px;font-size:42px;text-align:center;color:#d22">⚠ 入力内容が消えました</div>`, "", w);
    shake(w); cur.remove();
    const sad = zari(520, 395, 70, { face: "sad", z: 40 });
    await anim(sad, [{ transform: "none" }, { transform: "scale(.85,.55) translateY(20px)" }, { transform: "scale(.4,.3) translateY(60px)" }], 1400, { easing: "ease-in-out" });
    await wait(1200);
  },

  // ---- T15-08 ボタン拡大1pxに1万pt ----
  async i_T15_08() {
    const h = ham(N); await wait(700); chip("チャネポで景品を交換");
    const sub = q4Sub(560, 50, 360, 160);
    const lbl = label("解約ボタン　幅 3px", "left:560px;top:216px;font-size:20px;z-index:21");
    const list = q4Win(40, 70, 480, 340, "チャンネルポイント交換所");
    const items = [["ハムの自撮り", "500pt"], ["種 1粒", "100pt"], ["解約ボタンの大きさ +1px", "10,000pt"]];
    const rows = items.map(([a, b], i) => add(`<div style="left:12px;top:${50 + i * 62}px;width:450px;height:52px;border:3px solid #99a;border-radius:8px;background:#fff;font-size:20px;line-height:46px;padding:0 10px;white-space:nowrap">${a}<span style="position:static;float:right;color:#b60">${b}</span></div>`, "", list));
    const pts = add(`<div class=t style="left:50px;top:420px;font-size:30px;color:#ffe066">所持 12,000pt</div>`);
    await wait(900);
    const z = zari(420, 400, 70, { face: "smile", z: 30 }); anim(z, [{ transform: "translateX(80px)", opacity: 0 }, { transform: "none", opacity: 1 }], 300);
    await wait(500); rows[2].style.background = "#ffe9a0"; rows[2].style.borderColor = "#e90";
    await wait(500); q4Ring(300, 70 + 4 + 50 + 124 + 26, 40); hop(z, 20);
    pts.textContent = "所持 2,000pt"; say("-10,000pt", 340, 380, { size: 38, color: "#ff6a5a" }); await wait(700);
    // ボタンが1px大きくなる
    sub.cancel.style.width = "8px"; lbl.textContent = "解約ボタン　幅 4px"; say("+1px!!", 740, 240, { size: 50 }); flash(560, 900, 60, 200, "#ffe066"); await wait(900);
    // 虫眼鏡
    const lens = add(`<div style="left:800px;top:105px;width:120px;height:120px;border:8px solid #8a5a2a;border-radius:50%;background:#fffff0e6;z-index:35;overflow:hidden"><div style="left:0;right:0;top:34px;text-align:center;font-size:38px;color:#222;white-space:nowrap">解約</div></div>`);
  add(`<div style="left:906px;top:205px;width:16px;height:90px;background:#8a5a2a;border:3px solid ${INK};border-radius:8px;rotate:-35deg;transform-origin:50% 0;z-index:34"></div>`);
    anim(lens, [{ transform: "scale(.2)", opacity: 0 }, { transform: "none", opacity: 1 }], 250);
    const mini = add(`<div style="left:893px;top:193px;width:8px;height:5px;background:#999;border:1px solid #333;z-index:36"></div>`);
    anim(mini, [{ opacity: 0 }, { opacity: 1 }], 100);
    await wait(900); bubble("あ、大きくなりましたね", 600, 270, 1800);
    const cl = add(`<div style="left:${HX + 130}px;top:${HY - 50}px;font-size:44px;z-index:35">👏</div>`);
    for (let i = 0; i < 4; i++) { await anim(cl, [{ transform: "scale(1)" }, { transform: "scale(1.4) rotate(12deg)" }, { transform: "scale(1)" }], 260); }
    hop(h, 30); await wait(1200);
  },

  // ---- T15-10 解約はお電話で ----
  async i_T15_10() {
    const h = ham(N); await wait(600); chip("配信を終了する");
    const sub = q4Sub(70, 110, 520, 260);
    sub.cancel.style.cssText += ";width:9px;height:6px";
    const hint = add(`<div style="left:560px;top:340px;font-size:30px;color:#e22;z-index:30">↖</div>`);
    await wait(700);
    const cur = zari(300, 400, 70, { face: "angry", z: 40 }); anim(cur, [{ transform: "translateY(50px)", opacity: 0 }, { transform: "none", opacity: 1 }], 300);
    await wait(500);
    await anim(cur, [{ transform: "none" }, { transform: "translate(250px,-70px)" }], 600);
    hint.remove(); q4Ring(578, 358, 26); await wait(350);
    const dim = q4Dim(.55, 25); anim(dim, [{ opacity: 0 }, { opacity: 1 }], 200);
    const t = say("解約はお電話で", 400, 62, { size: 62, color: "#fff", ms: 0, z: 44 });
    cur.remove(); await wait(1000);
    // 頬袋
    anim(h, [{ transform: "none" }, { transform: "scale(1.18,1)" }], 260);
    const pouch = add(`<div style="left:230px;top:190px;width:440px;height:270px;border-radius:50%;background:radial-gradient(#7a2a35,#3b1219);border:7px solid ${INK};z-index:46;overflow:hidden"></div>`);
    anim(pouch, [{ transform: "scale(.1)", opacity: 0 }, { transform: "none", opacity: 1 }], 300);
    add(`<div class=lab style="left:380px;top:160px;z-index:47">頬袋の中</div>`);
    const ph = [];
    for (let r = 0; r < 3; r++) for (let c = 0; c < 5; c++) ph.push(q4Phone(60, `left:${34 + c * 76 + (r % 2) * 14}px;top:${26 + r * 78}px`)), pouch.append(ph[ph.length - 1]);
    await wait(500); chip("電話が一斉に鳴る");
    ph.forEach((p, i) => { p.classList.add("q4r"); p.style.animationDelay = -i * 17 + "ms"; });
    const ringT = say("リリリリリン!!", 470, 480, { size: 54, color: "#ffe066", ms: 1600, z: 48 });
    shake(h); await wait(1700);
    ph.forEach(p => p.classList.remove("q4r"));
    bubble("ただいま大変混み合っております", 450, 118, 0);
    for (let i = 0; i < 6; i++) { const n = add(`<div class=t style="left:${300 + i * 60}px;top:430px;font-size:40px;color:#fff;z-index:48">${i % 2 ? "♪" : "♫"}</div>`);
      anim(n, [{ transform: "none", opacity: 1 }, { transform: "translateY(-120px) rotate(20deg)", opacity: 0 }], 1100, { delay: i * 200 }).then(() => n.remove()); }
    await wait(2400);
  },

  // ---- T16-02 手術中ランプ点灯 ----
  async i_T16_02() {
    const h = ham(N); await wait(900); chip("崖から落とされてデス");
    const eyes = ov(h, whiteEyes + openMouth);
    await q4Fall(h); h.img.style.filter = "saturate(.2)";
    const lamp = add(`<div class=t style="left:690px;top:215px;width:220px;height:56px;background:#d11;border:5px solid ${INK};border-radius:10px;text-align:center;line-height:46px;font-size:34px;color:#fff;-webkit-text-stroke:0;box-shadow:0 0 28px #f33;z-index:30">手術中</div>`);
    anim(lamp, [{ opacity: 0 }, { opacity: 1 }, { opacity: .5 }, { opacity: 1 }], 400);
    const doc = q4Doc(560, 400, 90); anim(doc, [{ transform: "translateX(-60px)", opacity: 0 }, { transform: "none", opacity: 1 }], 300);
    const cd = add(`<div class=t style="left:480px;top:70px;translate:-50% 0;font-size:40px;color:#fff">リスポーンまで 5</div>`);
    for (let i = 4; i >= 0; i--) { await wait(800); cd.textContent = `リスポーンまで ${i}`; if (i % 2) doc.style.transform = "translateY(-8px)"; else doc.style.transform = "none"; }
    cd.remove(); lamp.style.background = "#555"; lamp.style.boxShadow = "none"; lamp.textContent = "終了";
    eyes.remove(); h.img.style.filter = "none"; await q4Up(h);
    const [bx, by] = P(600, 960);
    const ph = add(`<div style="left:${bx - 18}px;top:${by - 28}px;width:36px;height:56px;background:#222;border:3px solid #9bf;border-radius:7px;z-index:24"></div>`);
    add(`<div style="left:3px;top:5px;right:3px;bottom:5px;background:#7cf"></div>`, "", ph);
    ph.classList.add("wig");
    say("♪プルルル", 560, 380, { size: 40, color: "#fff", ms: 1500 });
    await wait(500); bubble("成功です", 600, 330, 0); const th = add(`<div style="left:590px;top:362px;font-size:46px;z-index:31">👍</div>`);
    await wait(800);
    const card = add(`<div></div>`, "left:200px;top:90px;width:300px;height:210px;background:#121a2a;border:5px solid #9bf;border-radius:22px;z-index:42;text-align:center");
    add(`<div style="left:0;right:0;top:20px;font-size:22px;color:#9bf">着信中</div>`, "", card);
    add(`<div style="left:0;right:0;top:70px;font-size:40px;color:#fff;white-space:nowrap">医者の奥さん</div>`, "", card);
    add(`<div style="left:50px;top:140px;width:70px;height:46px;border-radius:23px;background:#e33"></div><div style="left:180px;top:140px;width:70px;height:46px;border-radius:23px;background:#3c5"></div>`, "", card);
    anim(card, [{ transform: "scale(.2)", opacity: 0 }, { transform: "none", opacity: 1 }], 250);
    card.classList.add("wig");
    await wait(2200);
  },

  // ---- T16-06 手術成功率100% ----
  async i_T16_06() {
    const dim = q4Dim(.6, 2); await wait(300); chip("試合に敗北");
    const lose = say("敗北", 480, 150, { size: 100, color: "#ff5a4a", ms: 0, z: 3 });
    await wait(700);
    const ban = add(`<div></div>`, `left:60px;top:200px;width:840px;height:110px;background:#fff;border:5px solid ${INK};z-index:12`);
    add(`<div style="left:0;right:0;top:12px;text-align:center;font-size:52px;color:#c11;white-space:nowrap">本日の手術成功率　100%</div>`, "", ban);
    add(`<div style="right:6px;bottom:3px;font-size:9px;color:#444;white-space:nowrap">※患者の生死は含みません</div>`, "", ban);
    add(`<div style="left:40px;top:-60px;width:6px;height:60px;background:#888"></div><div style="left:790px;top:-60px;width:6px;height:60px;background:#888"></div>`, "", ban);
    await anim(ban, [{ transform: "translateY(-300px)" }, { transform: "none" }], 450, { easing: "cubic-bezier(.3,1.4,.5,1)" });
    const doc = q4Doc(110, 330, 130); hop(doc, 30);
    bubble("ほら 100%", 180, 290, 0);
    await wait(900);
    const h = ham(N); const bed = add(`<div></div>`, `left:${HX - 50}px;top:518px;width:330px;height:14px;background:#cde;border:4px solid ${INK};border-radius:6px;z-index:9`);
    add(`<div style="left:20px;top:10px;width:14px;height:14px;border-radius:50%;background:#333"></div><div style="left:290px;top:10px;width:14px;height:14px;border-radius:50%;background:#333"></div>`, "", bed);
    ov(h, whiteEyes + openMouth); h.style.transformOrigin = "50% 50%";
    anim(h, [{ transform: "translateX(300px)" }, { transform: "translateY(2px) rotate(90deg)" }], 600); 
    anim(bed, [{ transform: "translateX(300px)" }, { transform: "none" }], 600);
    await wait(800);
    for (let i = 0; i < 4; i++) { const [bx, by] = P(600, 900); const ph = add(`<div style="left:${bx - 20}px;top:${by - 10}px;width:34px;height:52px;background:#222;border:3px solid #9bf;border-radius:7px;z-index:24;rotate:-8deg"></div>`);
      say(["♪ピピピ", "♪ジリリリ", "♪プルルル", "♪ジャジャーン"][i], 600 - (i % 2) * 90, 390 + (i % 2) * 36, { size: 38, color: "#fff", ms: 700 }); anim(ph, [{ transform: "scale(1.3)" }, { transform: "none" }], 250);
      await wait(900); ph.remove(); }
    await wait(900);
  },

  // ---- T17-02 軽微な有害事象 ----
  async i_T17_02() {
    const h = ham(N); await wait(900); chip("デスした");
    const eyes = ov(h, whiteEyes + openMouth);
    await q4Fall(h); h.img.style.filter = "saturate(.2)";
    const boss = zari(420, 340, 100, { acc: "tie", face: "evil" }); anim(boss, [{ transform: "translateX(-60px)", opacity: 0 }, { transform: "none", opacity: 1 }], 300);
    const rep = add(`<div></div>`, `left:230px;top:70px;width:300px;height:230px;background:#fff;color:#222;border:3px solid #667;z-index:20;font-size:18px;padding:10px;white-space:nowrap`);
    add(`<div style="left:0;right:0;top:8px;text-align:center;font-size:22px">有害事象報告書</div>`, "", rep);
    anim(rep, [{ transform: "translateY(-300px) rotate(-6deg)" }, { transform: "none" }], 400);
    await wait(700);
    const f = (txt, y, col = "#222") => { const e = add(`<div class=q4st style="left:16px;top:${y}px;color:${col}">${txt}</div>`, "", rep); anim(e, [{ clipPath: "inset(0 100% 0 0)" }, { clipPath: "inset(0 0 0 0)" }], 500, { easing: "linear" }); return wait(650); };
    await f("患者：ハム（20）", 56); await f("事象：<span style='color:#d22'>軽微な有害事象</span>", 94); await f("死因：<span style='color:#d22'>個体差</span>", 132);
    await wait(500);
    const shr = add(`<div></div>`, `left:230px;top:360px;width:300px;height:110px;background:#556;border:4px solid ${INK};border-radius:8px;z-index:22`);
    add(`<div style="left:20px;top:-6px;width:260px;height:14px;background:#111"></div><div class=lab style="left:100px;top:40px;font-size:22px">シュレッダー</div>`, "", shr);
    await anim(rep, [{ transform: "none" }, { transform: "translateY(110px)" }], 450);
    anim(rep, [{ transform: "translateY(110px)" }, { transform: "translateY(260px)", opacity: 0 }], 600);
    for (let i = 0; i < 9; i++) { const st = add(`<div></div>`, `left:${250 + i * 30}px;top:370px;width:12px;height:70px;background:#fff;z-index:23`); anim(st, [{ transform: "none" }, { transform: `translateY(${60 + (i % 3) * 14}px) rotate(${i % 2 ? 10 : -10}deg)` }], 700, { delay: i * 50 }); }
    await wait(1100);
    eyes.remove(); h.img.style.filter = "none"; await q4Up(h);
    const mk = (cl, hue) => { const d = add(`<div style="left:0;top:0;width:100%;height:100%;clip-path:${cl}"><img src="${N}" style="left:0;top:0;width:100%;height:100%;filter:sepia(1) saturate(9) hue-rotate(${hue}deg)"></div>`, "", h); return d; };
    mk("inset(0 68% 80% 0)", 300); mk("inset(0 34% 82% 34%)", 80); mk("inset(0 0 80% 68%)", 180);
    say("毛先が虹色…", 560, 240, { size: 44, color: "#ffd23c", ms: 1400 }); hop(h, 20);
    await wait(1800);
  },

  // ---- T17-04 一気飲みでネオン ----
  async i_T17_04() {
    const h = ham(N);
    const g = add(`<div style="left:447px;top:430px;width:60px;height:60px;border-radius:50%;background:conic-gradient(#ffd23c 0%,#ffd23c 0%,#0008 0%);border:4px solid #fff;z-index:15"></div>`);
    const gl = add(`<div class=lab style="left:430px;top:496px;font-size:16px">ULT 0%</div>`);
    const gr = add(`<div></div>`, "left:30px;top:70px;width:300px;height:190px;background:#101828;border:4px solid #6c8;border-radius:10px;z-index:20");
    add(`<div class=t style="left:10px;top:4px;font-size:20px;color:#fff;-webkit-text-stroke:0">ザリガニ製薬 株価</div>`, "", gr);
    await wait(700); chip("ウルトが満タン");
    for (let i = 0; i <= 10; i++) { g.style.background = `conic-gradient(#ffd23c ${i * 10}%,#0008 0)`; gl.textContent = `ULT ${i * 10}%`; await wait(70); }
    const bk = add(`<div style="left:${HX - 60}px;top:${HY + 150}px;width:56px;height:80px;z-index:30"><svg viewBox="0 0 56 80" style="left:0;top:0;width:100%;height:100%"><path d="M12 6H44L40 20L52 70Q52 78 44 78H12Q4 78 4 70L16 20Z" fill=#7dffb0 stroke=${INK} stroke-width=4 stroke-linejoin=round /><path d="M10 40H48" stroke=${INK} stroke-width=3 /></svg></div>`);
    hop(h, 20); await wait(400);
    await anim(bk, [{ transform: "none" }, { transform: "translate(40px,-60px) rotate(60deg)" }], 400);
    say("ごくごくごく", 540, 270, { size: 44, color: "#7dffb0", ms: 800 }); await wait(500); bk.remove();
    chip("一気飲み");
    h.style.filter = "brightness(1.5) drop-shadow(0 0 20px #0ff)";
    h.animate([{ filter: "brightness(1.6) drop-shadow(0 0 22px #f0f)" }, { filter: "brightness(1.6) drop-shadow(0 0 22px #0ff)" }, { filter: "brightness(1.6) drop-shadow(0 0 22px #ff0)" }, { filter: "brightness(1.6) drop-shadow(0 0 22px #f0f)" }], { duration: 600, iterations: 3 });
    // 株価
    const pts = [[10, 170], [50, 150], [90, 155], [130, 120], [170, 110], [210, 80], [250, 50]];
    const path = add(`<svg viewBox="0 0 300 190" style="left:0;top:0;width:100%;height:100%;overflow:visible"><polyline id=q4pl points="${pts.map(p => p.join(",")).join(" ")}" fill=none stroke=#ff5a4a stroke-width=5 stroke-linejoin=round /></svg>`, "", gr);
    flash(40, 700, 60, 400, "#0ff"); await wait(700);
    gr.style.overflow = "visible";
    path.firstChild.setAttribute("points", pts.map(p => p.join(",")).join(" ") + " 280,-130"); gr.style.zIndex = 26;
    say("ストップ高!!", 480, 100, { size: 54, color: "#ff5a4a", ms: 1400, z: 40 }); burst(260, 60, 10);
    await wait(1600);
    // 天井へ
    const dim = q4Dim(.65, 6); anim(dim, [{ opacity: 0 }, { opacity: 1 }], 300);
    const ceil = add(`<div></div>`, `left:0;top:0;width:960px;height:34px;background:#4a3a30;border-bottom:5px solid ${INK};z-index:9`);
    add(`<div class=lab style="left:380px;top:2px;font-size:18px">社長室</div>`, "", ceil);
    const cord = add(`<div style="left:${HX + HW / 2}px;top:34px;width:5px;height:0;background:#222;z-index:9"></div>`);
    anim(h, [{ transform: "none" }, { transform: `translateY(${-(HY - 70)}px)` }], 900, { easing: "ease-in-out" });
    await anim(cord, [{ height: "0px" }, { height: "40px" }], 900);
    h.style.filter = "brightness(1.6) drop-shadow(0 0 30px #fff)"; h.classList.add("bob");
    const glow = add(`<div style="left:${HX - 200}px;top:0;width:${HW + 400}px;height:540px;background:radial-gradient(ellipse at 50% 12%,#ffffffaa,#0000 62%);z-index:7"></div>`);
    const boss = zari(480, 380, 110, { acc: "crown", face: "smile", z: 12 });
    bubble("省エネだな", 540, 330, 0);
    chip("ハムが照明になった");
    await wait(2200); h.classList.remove("bob");
    await wait(300);
  },

  // ---- T19-04 レントゲンに映る ----
  async i_T19_04() {
    const h = ham(N); await wait(700);
    const box = add(`<div></div>`, `left:200px;top:50px;width:420px;height:400px;background:#dfe8ee;border:6px solid ${INK};border-radius:10px;z-index:10`);
    const film = add(`<div style="left:14px;top:14px;right:14px;bottom:14px;background:#06122a"></div>`, "", box);
    const rib = [0, 1, 2, 3, 4].map(i => `<path d="M210 ${120 + i * 40}Q130 ${100 + i * 40} 90 ${150 + i * 38}M210 ${120 + i * 40}Q290 ${100 + i * 40} 330 ${150 + i * 38}" fill=none stroke=#cfe8ff stroke-width=7 stroke-linecap=round />`).join("");
    const xr = add(`<svg viewBox="0 0 420 400" style="left:0;top:0;width:100%;height:100%;overflow:visible"><path d="M210 60V340" stroke=#cfe8ff stroke-width=12 stroke-dasharray="14 6" /><circle cx=210 cy=50 r=26 fill=none stroke=#cfe8ff stroke-width=7 />${rib}</svg>`, "opacity:.85", box);
    add(`<div class=lab style="left:20px;top:360px;font-size:16px;background:none;color:#8cf">胸部 X線</div>`, "", box);
    anim(box, [{ transform: "translateY(-200px)", opacity: 0 }, { transform: "none", opacity: 1 }], 350);
    const doc = q4Doc(60, 350, 110); anim(doc, [{ transform: "translateX(-60px)", opacity: 0 }, { transform: "none", opacity: 1 }], 300);
    await wait(900); chip("ウルト発動"); 
    h.style.filter = "drop-shadow(0 0 14px gold)"; shake(h);
    const fl = layer("background:#fff;z-index:30"); fade(fl, 400);
    film.style.background = "#0b2a5c"; xr.style.opacity = .35;
    const items = add(`<div></div>`, "left:0;top:0;width:100%;height:100%", box);
    const u = add(`<div class=t style="left:210px;top:150px;translate:-50% -50%;font-size:46px;color:#ffe066">ULT 100%</div>`, "", items);
    anim(u, [{ transform: "scale(2)", opacity: 0 }, { transform: "none", opacity: 1 }], 250);
    await wait(500);
    const pad = add(`<div><svg viewBox="0 0 80 50" style="left:0;top:0;width:100%;height:100%"><path d="M10 14Q10 6 20 6H60Q70 6 70 14L76 38Q76 46 66 44L56 34H24L14 44Q4 46 4 38Z" fill=#8fb4ff stroke=#cfe8ff stroke-width=3 /><circle cx=24 cy=20 r=5 fill=#cfe8ff /><circle cx=58 cy=18 r=4 fill=#fff /><circle cx=64 cy=24 r=4 fill=#fff /></svg></div>`, "left:160px;top:200px;width:100px;height:62px", items);
    anim(pad, [{ transform: "scale(0)" }, { transform: "none" }], 250); await wait(500);
    const hr = add(`<div><svg viewBox="0 0 100 90" style="left:0;top:0;width:100%;height:100%"><path d="M50 86C10 56 2 36 14 18C26 4 44 10 50 24C56 10 74 4 86 18C98 36 90 56 50 86Z" fill=#e22 stroke=#ffd0d0 stroke-width=3 /></svg><div style="left:0;right:0;top:26px;text-align:center;font-size:19px;color:#fff;white-space:nowrap;-webkit-text-stroke:0">勝ちたい</div></div>`, "left:140px;top:275px;width:140px;height:126px", items);
    anim(hr, [{ transform: "scale(0)" }, { transform: "scale(1.15)" }, { transform: "none" }], 400);
    hr.animate([{ transform: "scale(1)" }, { transform: "scale(1.1)" }], { duration: 300, iterations: 6, direction: "alternate" });
    await wait(1100);
    bubble("骨に異常はありません", 180, 300, 0);
    await wait(2800);
  },

  // ---- T19-08 再検査はE− ----
  async i_T19_08() {
    const h = ham(N); await wait(600); chip("チャネポで「再検査」を交換");
    const bed = add(`<div></div>`, `left:${HX - 30}px;top:${HY + 190}px;width:${HW + 80}px;height:50px;background:#cde;border:4px solid ${INK};border-radius:8px;z-index:9`);
    const card = add(`<div></div>`, `left:60px;top:90px;width:360px;height:250px;background:#fff;color:#222;border:4px solid ${INK};z-index:20`);
    add(`<div style="left:0;right:0;top:8px;text-align:center;font-size:24px">健康診断　総合判定</div>`, "", card);
    const gr = add(`<div style="left:0;right:0;top:50px;text-align:center;font-size:130px;line-height:150px;color:#d22;white-space:nowrap">E</div>`, "", card);
    const tk = add(`<div style="left:440px;top:120px;padding:8px 16px;background:#fd3;color:#331c16;border:4px dashed ${INK};font-size:24px;rotate:-6deg;z-index:21;white-space:nowrap">🎫 再検査券</div>`);
    const doc = q4Doc(440, 300, 100);
    await wait(900);
    const grades = ["E−", "E−−", "E−−−"];
    for (let i = 0; i < 3; i++) {
      anim(tk, [{ transform: "none" }, { transform: "translate(250px,100px) scale(.2)", opacity: 0 }], 450, { easing: "ease-in" }); await wait(450);
      anim(h, [{ transform: "translateY(0)" }, { transform: "translateY(-50px)" }, { transform: "translateY(-46px)" }], 400, { fill: "forwards" }); await wait(500);
      shake(h); await wait(500);
      gr.textContent = grades[i]; gr.style.fontSize = (130 - i * 14) + "px";
      s.querySelectorAll(".stp").forEach(e => e.remove()); stamp("さらに悪化", 240, 290, 36).classList.add("stp"); shake(card); say(grades[i], 520, 230, { size: 60, color: "#ff6a5a", ms: 700 });
      await wait(900);
      if (i < 2) { tk.style.opacity = 0; await wait(300); anim(tk, [{ opacity: 0, transform: "scale(.2)" }, { opacity: 1, transform: "none" }], 250); tk.style.opacity = 1; chip("再検査券を使用"); await wait(300); }
    }
    // 新アルファベット
    const bd = add(`<div></div>`, `left:60px;top:370px;width:420px;height:90px;background:#1f4a35;border:5px solid #8a5a2a;z-index:22`);
    add(`<div class=t style="left:14px;top:18px;font-size:40px;color:#fff;-webkit-text-stroke:0;letter-spacing:12px">A B C D E</div>`, "", bd);
    bubble("Eの下を作りますね", 300, 330, 0);
    const gl = add(`<svg viewBox="0 0 60 70" style="left:340px;top:6px;width:60px;height:70px;overflow:visible"><path id=q4g d="M12 8H46M12 8V60M12 34H36M12 60H46M46 60Q54 40 36 34M20 20L50 50" fill=none stroke=#fff stroke-width=6 stroke-linecap=round pathLength=100 stroke-dasharray=100 stroke-dashoffset=100 /></svg>`, "", bd);
    await anim(gl.firstChild, [{ strokeDashoffset: 100 }, { strokeDashoffset: 0 }], 1200, { easing: "linear" });
    s.querySelectorAll(".stp").forEach(e => e.remove()); gr.innerHTML = `<svg viewBox="0 0 60 70" style="left:130px;top:6px;width:100px;height:116px"><path d="M12 8H46M12 8V60M12 34H36M12 60H46M46 60Q54 40 36 34M20 20L50 50" fill=none stroke=#d22 stroke-width=7 stroke-linecap=round /></svg>`; stamp("新・最下位", 240, 290, 34).classList.add("stp"); shake(card);
    await wait(1800);
  },

  // ---- T19-10 原因は、あれです ----
  async i_T19_10() {
    const h = ham(N); ov(h, frown); await wait(700); chip("配信終了");
    const mon = add(`<div></div>`, `left:300px;top:40px;width:340px;height:220px;border:8px solid #333;border-radius:10px;background:#171d2c url(ow_bg.png) center/cover;z-index:12`);
    add(`<div style="left:120px;top:218px;width:100px;height:20px;background:#333"></div>`, "", mon).style.top = "202px";
    add(`<div class=lab style="left:100px;top:-44px;font-size:22px;background:none">ゲーム画面</div>`, "", mon);
    const doc = q4Doc(60, 340, 110); anim(doc, [{ transform: "translateX(-60px)", opacity: 0 }, { transform: "none", opacity: 1 }], 300);
    const cb = add(`<div style="left:60px;top:300px;width:60px;height:78px;background:#fff8e6;border:3px solid ${INK};z-index:25;font-size:14px;color:#222;text-align:center;padding-top:20px;white-space:nowrap">カルテ</div>`);
    await wait(500); bubble("原因に心当たりは？", 200, 270, 1700);
    await wait(1800);
    say("……", 780, 280, { size: 50, color: "#fff", ms: 1400 });
    await wait(900);
    const [ax, ay] = P(300, 700);
    const arm = ov(h, `<path d="M300 780Q-100 700 -820 -200" fill=none stroke=#cfcac8 stroke-width=62 stroke-linecap=round /><path d="M300 780Q-100 700 -820 -200" fill=none stroke=${INK} stroke-width=9 stroke-linecap=round stroke-dasharray="1 2000" /><circle cx=-840 cy=-225 r=70 fill=#fbf5e9 stroke=${INK} stroke-width=12 />`);
    anim(arm, [{ opacity: 0, transform: "translateX(40px)" }, { opacity: 1, transform: "none" }], 900);
    await wait(1300);
    anim(mon, [{ transform: "none" }, { transform: "scale(1.04)" }, { transform: "none" }], 400, { iterations: 2 });
    await wait(900);
    cb.style.cssText += "left:120px;top:315px"; await anim(cb, [{ transform: "scaleX(1)" }, { transform: "scaleX(.2)" }, { transform: "scaleX(1)" }], 350);
    const w1 = say("お大事に", 200, 250, { size: 40, color: "#fff", ms: 0 });
    const strike = add(`<div style="left:130px;top:248px;width:140px;height:6px;background:#e22;z-index:40"></div>`);
    await wait(600);
    say("やめましょう", 190, 190, { size: 54, color: "#ff5a4a", ms: 0 });
    await wait(2600);
  },

  // ---- T20-06 心にも湿布 ----
  async i_T20_06() {
    const h = ham(N); ov(h, frown + tears); await wait(700); chip("試合に敗北");
    say("敗北", 480, 130, { size: 80, color: "#ff5a4a", ms: 1500 });
    await anim(h, [{ transform: "none" }, { transform: "translateY(14px) rotate(-5deg) scaleY(.94)" }], 600);
    const [cx, cy] = P(500, 860);
    ov(h, `<path d="M420 880Q520 830 560 940" fill=none stroke=${INK} stroke-width=0 />`);
    const doc = q4Doc(470, 360, 100); anim(doc, [{ transform: "translateX(-80px)", opacity: 0 }, { transform: "none", opacity: 1 }], 400);
    await wait(900);
    const sp = add(`<div style="left:${cx - 42}px;top:${cy - 80}px;width:84px;height:66px;background:#e8f6e8;border:3px solid #7a9;color:#2a7a4a;font-size:34px;text-align:center;line-height:58px;z-index:26;-webkit-text-stroke:0">＋</div>`);
    await anim(sp, [{ transform: "translate(-120px,-60px) scale(2) rotate(-20deg)", opacity: 0 }, { transform: "translateY(80px) scale(1.2)", opacity: 1, offset: .5 }, { transform: "translateY(80px)", opacity: 1 }], 600, { easing: "ease-in" });
    say("ぺたっ", 560, 230, { size: 40, color: "#7dff8a", ms: 900 }); shake(h);
    const pk = add(`<div></div>`, "left:80px;top:90px;width:340px;height:230px;background:#fff;color:#222;border:4px solid #7a9;border-radius:8px;z-index:20");
    add(`<div style="left:0;right:0;top:0;height:46px;background:#2a9a5a;color:#fff;font-size:26px;text-align:center;line-height:42px;-webkit-text-stroke:0">湿布薬　効能書き</div>`, "", pk);
    add(`<div class=q4st style="left:20px;top:64px;font-size:20px;line-height:34px;white-space:nowrap">効能：肩こり・腰痛・心<br>用法：<b style="color:#d22">1日1回</b>貼る<br>注意：<span style="font-size:15px">負けた分は含みません</span></div>`, "", pk);
    anim(pk, [{ transform: "scale(.3)", opacity: 0 }, { transform: "none", opacity: 1 }], 250);
    await wait(1700);
    bubble("お大事に〜", 500, 320, 1500);
    await wait(900);
    const sm = bubble("負けは1日5回なんですが", 700, 262, 0); sm.style.fontSize = "17px";
    await wait(2400);
  },
});
}

{
// ---- q5 共通部品 (役所・バス・チャット) ----
const q5Paper = (t, x, y, w = 130, h = 90, o = {}) => add(`<div>${t}</div>`,
  `left:${x}px;top:${y}px;width:${w}px;height:${h}px;background:#fffdf4;border:3px solid ${INK};color:#222;font-size:${o.size || 22}px;line-height:1.2;text-align:center;padding-top:${o.pt ?? 8}px;z-index:${o.z || 14};white-space:nowrap;${o.css || ""}`);
const q5Room = (wall = "#e6dcc0") => layer(`z-index:2;background:linear-gradient(${wall} 0 66%,#a98657 66%)`,
  `<div style="left:0;top:356px;width:960px;height:8px;background:#7a4a28"></div>`);
const q5Win = (x, w, num, o = {}) => {
  const sign = add(`<div>${num}</div>`, `left:${x + w / 2}px;top:196px;translate:-50% 0;background:#1f6a4a;border:4px solid ${INK};padding:3px 18px;font-size:26px;white-space:nowrap;z-index:7`);
  const cl = zari(x + w / 2 - 58, 262, 116, { acc: o.acc || "tie", face: o.face || "smile", z: 6 });
  const ct = add(`<div></div>`, `left:${x}px;top:376px;width:${w}px;height:104px;background:linear-gradient(#a8703c,#8a5a30);border:4px solid ${INK};z-index:8`);
  return { sign, cl, ct };
};
const q5End = async (ms = 450) => { // 役所などを片づけて元の OW 画面に戻す
  const els = [...s.children].filter(e => !e.classList.contains("chip") && e.style.zIndex !== "10");
  await Promise.all(els.map(e => fade(e, ms)));
};
const q5Bus = (speed = 520) => {
  const wall = layer("z-index:2;background:linear-gradient(#cdb98c 0 62%,#4d5262 62%)");
  const win = add(`<div></div>`, `left:40px;top:62px;width:880px;height:225px;overflow:hidden;border:8px solid ${INK};border-radius:18px;background:linear-gradient(#9fd8ff,#d6f1ff 70%);z-index:3`);
  const strip = add(`<div></div>`, "left:0;top:0;width:1400px;height:100%", win);
  add(`<div></div>`, "left:0;bottom:0;width:100%;height:46px;background:#6b6b78", win);
  add(`<div></div>`, "left:0;bottom:46px;width:100%;height:12px;background:#9bb86a", win);
  for (let i = 0; i < 7; i++) {
    add(`<div></div>`, `left:${i * 200 + 40}px;bottom:50px;width:8px;height:120px;background:#5a3a20`, strip);
    add(`<div></div>`, `left:${i * 200 + 10}px;bottom:150px;width:70px;height:6px;background:#5a3a20`, strip);
    add(`<div></div>`, `left:${i * 200 + 110}px;top:${30 + (i % 3) * 22}px;width:90px;height:34px;border-radius:20px;background:#fff`, strip);
    add(`<div></div>`, `left:${i * 200 + 130}px;bottom:50px;width:60px;height:34px;border-radius:30px 30px 0 0;background:#5e9a4a;border:3px solid ${INK}`, strip);
  }
  const run = strip.animate([{ transform: "none" }, { transform: "translateX(-200px)" }], { duration: speed, iterations: 60, easing: "linear" });
  for (const x of [220, 400, 580]) add(`<div></div>`, `left:${x}px;top:292px;width:4px;height:26px;background:#222;z-index:4`), add(`<div></div>`, `left:${x - 12}px;top:316px;width:28px;height:28px;border-radius:50%;border:5px solid #e8c33a;z-index:4`);
  const wheel = add(`<div></div>`, `left:90px;top:400px;width:84px;height:30px;border-radius:50%;border:8px solid #222;z-index:7`);
  const dr = zari(40, 322, 120, { acc: "helmet", face: "smile", z: 6 });
  return { wall, win, strip, run, dr, wheel };
};

Object.assign(scenes, {
  // ---------------- T21-02 先読みの2枚 ----------------
  async i_T21_02() {
    const h = ham(N), room = q5Room(); anim(room, [{ opacity: 0 }, { opacity: 1 }], 300);
    q5Win(150, 380, "1番 戸籍窓口");
    const p1 = q5Paper("死亡届", 160, 296, 112, 74, { pt: 20 }), p2 = q5Paper("出生届", 412, 296, 112, 74, { pt: 20 });
    const sc = add(`<div></div>`, `left:24px;top:62px;width:120px;height:44px;background:#fffdf4;border:3px solid ${INK};border-bottom:0;color:#222;font-size:20px;text-align:center;z-index:5`);
    add(`<div>戸籍</div>`, "left:0;right:0;top:8px", sc);
    let rows = 0, stamps = [];
    const addRow = (t, col) => { add(`<div>😱<span style="color:${col};font-weight:900">${t}</span></div>`, `left:2px;right:2px;top:${44 + rows * 34}px;height:34px;font-size:18px;color:#222;white-space:nowrap;border-top:2px solid #cbb`, sc);
      rows++; sc.style.height = 44 + rows * 34 + "px"; if (rows === 3) { const l = label("写真欄は毎回これ", "left:152px;top:128px;font-size:18px"); wait(1800).then(() => fade(l)); } };
    const cycle = async fast => {
      stamps.forEach(e => e.remove()); stamps = [];
      const eyes = ov(h, whiteEyes + openMouth);
      if (!fast) say("うわぁぁぁ", 600, 110, { size: 50, color: "#fff" });
      await anim(h, [{ transform: "translateY(-620px)" }, { transform: "none" }], fast ? 330 : 650, { easing: "ease-in" });
      shake(h); h.img.style.filter = "grayscale(1) brightness(.8)";
      const a = stamp("死亡", 216, 334, 30); stamps.push(a); addRow("死亡", "#c62828");
      anim(h, [{ transform: "none" }, { transform: "rotate(-80deg)" }], 150); await wait(fast ? 220 : 650);
      eyes.remove(); h.img.style.filter = "none"; await anim(h, [{ transform: "rotate(-80deg)" }, { transform: "none" }], fast ? 150 : 250); hop(h, 26);
      const b = stamp("出生", 468, 334, 30); b.style.color = "#2a5bd7"; b.style.borderColor = "#2a5bd7"; stamps.push(b); addRow("出生", "#2a5bd7");
      await wait(fast ? 150 : 400);
    };
    await wait(800); chip("崖から落とされてデス");
    await cycle(false); bubble("次の方どうぞ", 340, 140, 1300); await wait(900);
    await cycle(false); await wait(250);
    chip("崖から落とされてデス ×3"); await cycle(true); chip("崖から落とされてデス ×4"); await cycle(true); chip("崖から落とされてデス ×5"); await cycle(true);
    stamps.forEach(e => e.remove());
    const roll = add(`<div></div>`, `left:16px;top:${106 + rows * 34}px;width:136px;height:34px;border-radius:17px;background:#fffdf4;border:3px solid ${INK};z-index:5`);
    anim(roll, [{ transform: "scaleX(.2)", opacity: 0 }, { transform: "none", opacity: 1 }], 300);
    say("戸籍が床に届いた", 590, 120, { size: 40, color: "#fff", ms: 1500 });
    bubble("次の方どうぞ", 340, 140, 1300); await wait(1700);
    await q5End();
  },

  // ---------------- T21-05 配偶者：種(死別) ----------------
  async i_T21_05() {
    const h = ham(N), room = q5Room(); anim(room, [{ opacity: 0 }, { opacity: 1 }], 300);
    q5Win(250, 330, "2番 婚姻窓口");
    const sd0 = seed(HX - 36, HY + 130, 34, 12);
    await wait(700); chip("試合に勝利"); say("勝った!!", 480, 100, { size: 60 }); hop(h, 60); burst(...P(600, 600), 12);
    await wait(900); bubble("結婚してください", 560, 250, 1400);
    const pp = q5Paper("婚姻届", 590, 400, 130, 104, { pt: 6 }); sd0.remove();
    const sd = add(`<div>${seedHtml(30)}</div>`, "left:50px;top:50px;width:30px;height:45px", pp);
    await wait(500); await anim(pp, [{ transform: "none" }, { transform: "translate(-260px,-86px)" }], 700);
    const ok = stamp("受理", 400, 350, 40); await wait(700);
    const reg = q5Paper("", 20, 74, 270, 176, { z: 5, css: "text-align:left;padding-left:14px" });
    add(`<div>戸籍</div>`, "left:12px;top:6px;font-size:24px;color:#222", reg);
    add(`<div>氏名：ハム</div>`, "left:12px;top:44px;font-size:20px;color:#222", reg);
    add(`<div>配偶者：</div>`, "left:12px;top:86px;font-size:20px;color:#222", reg);
    anim(reg, [{ transform: "translateY(-60px)", opacity: 0 }, { transform: "none", opacity: 1 }], 300);
    const sp = add(`<div>ヒマワリの種</div>`, "left:98px;top:86px;font-size:20px;color:#222;font-weight:900;white-space:nowrap", reg);
    say("配偶者：種", 150, 280, { size: 38, color: "#fff", ms: 1200 }); await wait(1500);
    // パクッ
    const m = ov(h, openMouth); const [mx, my] = P(600, 660); h.img.style.transformOrigin = "50% 100%";
    await wait(250); sd.parentNode === pp && (sd.style.display = "none");
    const fly = seed(480, 380, 34, 25);
    await anim(fly, [{ transform: "none" }, { transform: `translate(${mx - 497}px,${my - 400}px) rotate(500deg) scale(.5)` }], 520, { easing: "ease-in" }); fly.remove(); ok.remove();
    say("パクッ", 640, 250, { size: 56, color: "#fff", ms: 900 });
    anim(h, [{ transform: "none" }, { transform: "scale(1.1,.94)" }, { transform: "none" }, { transform: "scale(1.1,.94)" }, { transform: "none" }], 700, { easing: "linear" });
    await wait(800); m.remove(); ov(h, hideMouth + `<path d="M520 656Q600 700 680 656" ${line} />`);
    await wait(500); bubble("……", 400, 140, 1300);
    await wait(500); const dead = stamp("死別", 205, 214, 40); sp.style.textDecoration = "line-through"; sp.style.color = "#999";
    ov(h, tears); await wait(1300);
    const np = q5Paper("婚姻届", 300, 330, 130, 90, { pt: 6, z: 20 });
    anim(np, [{ transform: "translateY(-20px)", opacity: 0 }, { transform: "none", opacity: 1 }], 300);
    await wait(250); await anim(np, [{ transform: "none" }, { transform: "translate(280px,60px)" }], 600);
    say("次、どうぞ", 400, 140, { size: 40, color: "#fff", ms: 1300 }); await wait(1600); dead.remove();
    await q5End();
  },

  // ---------------- T22-04 爆発に消費税 ----------------
  async i_T22_04() {
    const h = ham(N);
    await wait(800); chip("ウルトを発動した"); say("ウルト!!", 480, 100, { size: 60, color: "#fff" }); hop(h, 50);
    const pts = Array.from({ length: 32 }, (_, i) => { const a = i * Math.PI / 16, r = i % 2 ? 125 : 178; return `${180 + Math.cos(a) * r},${180 + Math.sin(a) * r}`; }).join(" ");
    const ex = add(`<svg viewBox="0 0 360 360"><polygon points="${pts}" fill=#ff9a2e stroke=${INK} stroke-width=8 stroke-linejoin=round /><circle cx=180 cy=180 r=100 fill=#ffd23c /><circle cx=180 cy=180 r=52 fill=#fff /></svg>`, "left:290px;top:90px;width:360px;height:360px;z-index:20;filter:drop-shadow(0 0 24px #ff9a2e)");
    await anim(ex, [{ transform: "scale(.1)" }, { transform: "scale(1.15)", offset: .6 }, { transform: "none" }], 520);
    for (let i = 0; i < 5; i++) flash(300, 640, 100, 440, "#ffe066");
    anim(ex, [{ transform: "scale(1)" }, { transform: "scale(1.04)" }, { transform: "scale(1)" }], 600, { iterations: 3 });
    await wait(1200);
    const sc = add(`<div><div style="left:0;top:0;font-size:150px;line-height:1;transform:rotate(-30deg)">✂️</div><div style="left:-40px;top:112px;white-space:nowrap;font-size:26px;background:#fffbe6;color:#c62828;border:4px solid #c62828;padding:2px 12px;rotate:-6deg">消費税 10%</div></div>`, "left:900px;top:20px;width:0;height:0;z-index:36");
    await anim(sc, [{ transform: "none" }, { transform: "translate(-360px,50px)" }], 600);
    for (let i = 0; i < 3; i++) await anim(sc.firstChild, [{ transform: "rotate(-30deg) scaleY(1)" }, { transform: "rotate(-30deg) scaleY(.35)" }, { transform: "rotate(-30deg) scaleY(1)" }], 170, { easing: "linear" });
    say("パチン!", 560, 240, { size: 62, color: "#fff", ms: 900 });
    const ring = add(`<svg viewBox="0 0 200 200"><circle cx=100 cy=100 r=96 fill=none stroke=#fff stroke-width=5 stroke-dasharray="10 8" /></svg>`, "left:520px;top:60px;width:200px;height:200px;z-index:28");
    anim(ring, [{ transform: "scale(.2) rotate(0)", opacity: 0 }, { transform: "scale(1) rotate(60deg)", opacity: 1 }], 320);
    await wait(380);
    const hole = add(`<div></div>`, `left:525px;top:65px;width:190px;height:190px;border-radius:50%;overflow:hidden;border:6px solid ${INK};box-shadow:0 0 0 5px #fff;z-index:27;background:linear-gradient(#7fd0ff 0 45%,#2a8fd0 45% 60%,#e0c08a 60%)`);
    add(`<div></div>`, "left:128px;top:14px;width:36px;height:36px;border-radius:50%;background:#ffe066;box-shadow:0 0 16px #ffe066", hole);
    add(`<div>🌴</div>`, "left:128px;top:44px;font-size:46px", hole);
    add(`<div></div>`, `left:0;top:118px;width:100%;height:12px;background:#fff;border-top:4px solid ${INK};border-bottom:4px solid ${INK}`, hole);
    for (const x of [10, 60, 110, 160]) add(`<div></div>`, `left:${x}px;top:98px;width:10px;height:42px;background:#fff;border:3px solid ${INK}`, hole);
    add(`<div>🍹</div>`, "left:132px;top:136px;font-size:34px", hole);
    add(`<div>ハム別荘</div>`, "left:40px;top:6px;font-size:18px;color:#fff;white-space:nowrap;-webkit-text-stroke:3px #1f4a6a;paint-order:stroke fill", hole);
    pop(hole, 320); ring.remove();
    const tx = label("-10%", "left:640px;top:268px;color:#ff8a7a;font-size:30px");
    anim(sc, [{ transform: "translate(-360px,50px)" }, { transform: "translate(60px,-80px)", opacity: 0 }], 500).then(() => sc.remove());
    await wait(800);
    swap(h, R1, true); h.style.zIndex = 30;
    await anim(h, [{ transform: "none" }, { transform: "translate(-120px,-340px) scale(.6)", offset: .5 }, { transform: "translate(-212px,-315px) scale(.4)" }], 900, { easing: "ease-in-out" });
    for (let i = 0; i < 6; i++) flash(530, 700, 70, 250, "#fff");
    say("別荘、完成。", 400, 480, { size: 52, color: "#ffe066", ms: 2400 });
    await wait(2800);
    await Promise.all([fade(ex, 400), fade(hole, 400), fade(tx, 300), anim(h, [{ transform: "translate(-212px,-315px) scale(.4)", opacity: 1 }, { transform: "none", opacity: 1 }], 500)]);
    h.style.zIndex = 10; h.img.src = N; await wait(700);
  },

  // ---------------- T22-09 草は1本10円 ----------------
  async i_T22_09() {
    const h = ham(R1); let yen = 0, n = 0;
    const panel = add(`<div></div>`, "left:14px;top:64px;width:430px;height:250px;background:#000b;border:2px solid #fff6;border-radius:14px;z-index:8");
    add(`<div>チャット</div>`, "left:14px;top:6px;font-size:18px;color:#bcd", panel);
    const tot = add(`<div>税収 ¥0</div>`, "right:16px;top:16px;background:#000a;border:3px solid #ffd23c;border-radius:10px;padding:4px 14px;font-size:30px;color:#ffe066;z-index:40;white-space:nowrap");
    const addYen = v => { yen += v; tot.textContent = `税収 ¥${yen.toLocaleString()}`; anim(tot, [{ transform: "scale(1.2)" }, { transform: "none" }], 140); };
    const crowd = [40, 168, 296].map((x, i) => zari(x, 340 + (i % 2) * 14, 112, { face: "smile", color: ["#e8553b", "#e8844b", "#d0463a"][i], z: 15 }));
    await wait(700); chip("チャットに「www」の草が流れた");
    const tag = async (txt, x, y, col = "#c62828") => { const t = add(`<div>${txt}</div>`, `left:${HX}px;top:${HY + 20}px;background:#fffbe6;color:${col};border:3px solid ${col};padding:0 8px;font-size:20px;z-index:35;white-space:nowrap`);
      await anim(t, [{ transform: "none" }, { transform: `translate(${x - HX}px,${y - HY - 20}px) rotate(-10deg)` }], 260, { easing: "ease-in" }); return t; };
    for (let r = 0; r < 3; r++) {
      const cnt = [5, 7, 4][r];
      const row = add(`<div></div>`, `left:10px;top:${40 + r * 62}px;width:410px;height:56px`, panel);
      zari(4, 6, 38, { face: "smile", parent: row, color: ["#e8553b", "#e8844b", "#d0463a"][r], z: 2 });
      const tx = add(`<div class=t></div>`, "left:58px;top:6px;font-size:32px;color:#fff;-webkit-text-stroke:0;text-shadow:none;letter-spacing:2px", row);
      for (let k = 0; k < cnt; k++) {
        tx.textContent += "w"; n++;
        tag("草税", 14 + 58 + 10 + k * 24, 64 + 40 + r * 62 + 10).then(t => { t.textContent = "¥10"; addYen(10); wait(260).then(() => fade(t, 200)); });
        if (k % 3 === 0) say("チャリン", 600, 150 + (k % 2) * 40, { size: 30, color: "#ffe066", ms: 350 });
        await wait(150);
      }
      await wait(250);
    }
    await wait(500);
    // 沈黙
    chip("チャットが静まり返った");
    crowd.forEach(c => { c.innerHTML = zariSvg({ face: "shock" }); });
    const dots = add(`<div>……</div>`, "left:70px;top:236px;font-size:30px;color:#bcd", panel);
    await wait(900);
    const st = stamp("沈黙税 ¥100", 230, 180, 44); addYen(100); h.img.src = R2; hop(h, 40);
    await wait(1400);
    // 覆い
    chip("顔を覆った");
    const cov = `<circle cx=47 cy=35 r=14 fill=#e8553b stroke=${INK} stroke-width=4 /><circle cx=73 cy=35 r=14 fill=#e8553b stroke=${INK} stroke-width=4 />`;
    crowd.forEach(c => { c.innerHTML = zariSvg({ face: "sad", extra: cov }); anim(c, [{ transform: "scale(1.1)" }, { transform: "none" }], 220); });
    await wait(900);
    for (const c of crowd) { const x = parseFloat(c.style.left) + 56; const t = stamp("覆い税", x, 486, 24); addYen(50); await wait(260); }
    await wait(300); say("まいどあり", 700, 200, { size: 54, color: "#ffe066", ms: 1500 }); rain(18);
    await wait(1700);
    await q5End(); h.img.src = N; await wait(500);
  },

  // ---------------- T23-02 診断書は生存証明が要る ----------------
  async i_T23_02() {
    const h = ham(N), room = q5Room(); anim(room, [{ opacity: 0 }, { opacity: 1 }], 300);
    const a = q5Win(20, 260, "診断書窓口", { acc: "glasses" }), b = q5Win(330, 260, "1番 死亡届窓口");
    await wait(600); chip("落下してデス");
    h.img.style.filter = "grayscale(1) brightness(.85)"; const eyes = ov(h, whiteEyes + openMouth);
    await anim(h, [{ transform: "translateY(-600px)" }, { transform: "none" }, { transform: "translateY(-112px) rotate(-88deg)" }], 800, { easing: "ease-in" });
    say("チーン…", 760, 330, { size: 40, color: "#cfe0ff", ms: 1200 });
    await wait(500);
    const pp = q5Paper("死亡届", 640, 440, 110, 70, { pt: 18, z: 20 });
    const arm = add(`<div></div>`, `left:750px;top:468px;width:40px;height:12px;background:#f2c9a1;border:3px solid ${INK};border-radius:6px;z-index:19`);
    const hand = add(`<div></div>`, `left:742px;top:460px;width:26px;height:26px;border-radius:50%;background:#fbcbc3;border:3px solid ${INK};z-index:21`);
    const push = async (x0, x1, ms = 700) => { const kf = (x, d) => [`left`, x];
      anim(pp, [{ left: x0 + "px" }, { left: x1 + "px" }], ms, { easing: "ease-in-out" });
      anim(hand, [{ left: x0 + 102 + "px" }, { left: x1 + 102 + "px" }], ms, { easing: "ease-in-out" });
      await anim(arm, [{ left: x0 + 110 + "px", width: 780 - x0 - 110 + "px" }, { left: x1 + 110 + "px", width: 780 - x1 - 110 + "px" }], ms, { easing: "ease-in-out" }); };
    arm.style.width = "40px"; await push(640, 640, 10);
    await push(640, 470);
    bubble("死亡診断書が必要です", 460, 280, 1700); await wait(1300);
    await push(470, 250, 600); await wait(100);
        bubble("生存中のご本人確認が必要です", 250, 150, 1900); await wait(1500);
    chip("本人確認が必要"); await push(250, 130, 500);
    bubble("ご本人様にお越しいただかないと", 260, 150, 1700);
    const stp = add(`<div>🔏</div>`, "left:130px;top:325px;font-size:48px;z-index:9");
    await wait(500); await anim(stp, [{ transform: "none" }, { transform: "translateY(90px)", opacity: 0 }], 350);
    say("ハンコ、しまわれた", 600, 110, { size: 34, color: "#fff", ms: 1500 });
    await anim(h, [{ transform: "translateY(-112px) rotate(-88deg)" }, { transform: "translateY(-112px) rotate(-88deg) translateX(-4px)" }, { transform: "translateY(-112px) rotate(-88deg)" }], 600);
    await wait(1100);
    arm.remove(); hand.remove(); eyes.remove(); h.img.style.filter = "none";
    await Promise.all([q5End(), anim(h, [{ transform: "translateY(-112px) rotate(-88deg)" }, { transform: "none" }], 300)]); await wait(400);
  },

  // ---------------- T23-08 並ばなくていい券に並ぶ ----------------
  async i_T23_08() {
    const h = ham(N), room = q5Room("#dfe6e8"); anim(room, [{ opacity: 0 }, { opacity: 1 }], 300);
    const TK = ["並ばず通れる券", "券専用窓口", "券の券 専用窓口", "券の券の券…", "……"];
    const geom = [{ y: 455, w: 58, x0: 60, xe: 640 }, { y: 362, w: 44, x0: 90, xe: 600 }, { y: 288, w: 34, x0: 115, xe: 560 }, { y: 220, w: 27, x0: 135, xe: 525 }, { y: 164, w: 20, x0: 150, xe: 495 }];
    const hpos = i => { const g = geom[i]; return `translate(${g.xe + 30 - 832}px,${g.y + g.w * 1.1 - 534}px) scale(${g.w * 2.4 / 230})`; };
    const rows = [];
    await wait(700); chip("チャネポで「並ばず通れる券」を交換");
    const tk = note("並ばず通れる券", "left:-150px;top:-40px;font-size:24px;z-index:25;rotate:-4deg");
    h.append(tk);
    hop(h, 50); say("並ばなくていい!!", 400, 150, { size: 52, color: "#fff", ms: 1100 }); await wait(1300);
    const makeRow = async i => {
      const g = geom[i], cnt = 6 - Math.min(i, 2), els = [];
      const sg = add(`<div>${i ? "→ " : ""}${TK[i + 1] || "……"}${i ? "" : ""}</div>`, `left:${g.x0 - 10}px;top:${g.y - 34}px;background:#1f6a4a;border:3px solid ${INK};padding:0 10px;font-size:${22 - i * 2}px;line-height:1.25;white-space:nowrap;z-index:6`);
      els.push(sg);
      add(`<div></div>`, `left:${g.x0 - 30}px;top:${g.y - g.w * .3}px;width:${g.w * .6}px;height:${g.w * 1.1}px;background:#8a5a30;border:3px solid ${INK};z-index:5`);
      for (let k = 0; k < cnt; k++) { const z = zari(g.x0 + 10 + k * (g.xe - g.x0 - 40) / cnt, g.y - g.w * .1, g.w, { flip: true, face: i > 2 ? "sad" : "smile", acc: k % 3 == 1 ? "chef" : undefined, z: 5 + i, color: ["#e8553b", "#e8844b", "#d0463a"][(k + i) % 3] }); els.push(z); pop(z, 160); await wait(50); }
      return els;
    };
    for (let i = 0; i < 5; i++) {
      const g = geom[i];
      await makeRow(i);
      // ハムが最後尾へ
      if (i === 0) say("↓ 最後尾はこちら", 480, 500, { size: 30, color: "#fff", ms: 1200 });
      await anim(h, [{ transform: i ? hpos(i - 1) : "none" }, { transform: hpos(i) }], 650, { easing: "ease-in-out" });
      if (i < 4) { bubble(i === 0 ? "窓口「券をお持ちなら券専用窓口へ」" : i === 1 ? "窓口「券の券が必要です」" : "窓口「券の券の券が必要です」", 520, 70, 1200);
        tk.textContent = ["券", "券の券", "券の券の券", "…"][i]; await wait(1100); }
      if (i === 0) chip("券を使って並ぶ行列");
      if (i === 2) chip("さらに、券の券");
    }
    chip("遠近法ですらハムは並んでいる");
    const lb = label("待ち時間 ∞", "left:620px;top:96px;font-size:36px"); pop(lb);
    await wait(1700);
    tk.remove(); anim(h, [{ transform: hpos(4) }, { transform: "none" }], 600); await q5End(600); await wait(400);
  },

  // ---------------- T24-05 本人確認で別人 ----------------
  async i_T24_05() {
    const h = ham(N), room = q5Room(); anim(room, [{ opacity: 0 }, { opacity: 1 }], 300);
    h.img.style.filter = "saturate(.55)";
    q5Win(140, 400, "遺失物係");
    add(`<div></div>`, `left:150px;top:74px;width:380px;height:112px;background:#b08a58;border:4px solid ${INK};z-index:3`);
    [["プライド", "#9ad"], ["やる気", "#9d9"], ["ランク", "#da9"]].forEach(([t, c], i) => add(`<div>${t}</div>`, `left:${164 + i * 112}px;top:112px;width:96px;height:60px;background:${c};border:3px solid ${INK};color:#222;font-size:20px;text-align:center;padding-top:16px;z-index:4`));
    add(`<div>(他人の)</div>`, "left:160px;top:80px;font-size:16px;color:#fff;z-index:4");
    await wait(700); chip("試合に勝利"); hop(h, 60); say("勝った!!", 480, 100, { size: 56 }); await wait(1100);
    bubble("尊厳を返してください", 600, 250, 1500); await wait(1000);
    const ds = add(`<div><div style="left:0;top:0;font-size:56px">💎</div><div style="left:-10px;top:60px;font-size:20px;color:#222;background:#fff8e6;border:3px solid ${INK};padding:0 8px;white-space:nowrap">尊厳(ハム)</div></div>`, "left:440px;top:300px;width:60px;height:80px;z-index:12");
    pop(ds, 300); flash(300, 420, 280, 360, "#ffe066"); await wait(900);
    bubble("本人確認書類を", 650, 170, 1300); await wait(1100);
    const card = add(`<div></div>`, `left:600px;top:420px;width:200px;height:116px;background:#fffdf4;border:3px solid ${INK};color:#222;z-index:20`);
    add(`<div>身分証</div>`, "left:8px;top:2px;font-size:16px;color:#c62828", card);
    add(`<div></div>`, `left:8px;top:24px;width:76px;height:84px;background:#cde;border:2px solid ${INK};overflow:hidden`, card);
    add(`<img src="${R2}">`, "left:2px;top:6px;width:72px;height:74px", card.lastChild);
    add(`<div>氏名 ハム<br>(成金)</div>`, "left:94px;top:30px;font-size:17px;line-height:1.3;white-space:nowrap", card);
    await anim(card, [{ transform: "none" }, { transform: "translate(-260px,-140px) scale(1.3)" }], 700); await wait(900);
    const ne = add(`<div>≠</div>`, "left:575px;top:250px;font-size:110px;color:#ff4a3a;-webkit-text-stroke:7px #fff;paint-order:stroke fill;z-index:30");
    pop(ne, 240); bubble("お顔が違いますね", 650, 170, 1800); ov(h, frown); ov(h, tears);
    await wait(1700);
    stamp("別人", 450, 260, 60); await wait(500);
    await anim(ds, [{ transform: "none" }, { transform: "translate(-250px,-240px) scale(.5)", opacity: 0 }], 600, { easing: "ease-in" });
    say("尊厳は保管庫へ…", 600, 130, { size: 40, color: "#cfe0ff", ms: 1500 }); await wait(1800);
    await q5End(); h.img.style.filter = "none"; await wait(300);
  },

  // ---------------- T24-09 目撃証言が全部食い違う ----------------
  async i_T24_09() {
    const h = ham(N);
    const panel = add(`<div></div>`, "left:14px;top:64px;width:310px;height:340px;background:#000b;border:2px solid #fff6;border-radius:14px;z-index:8");
    add(`<div>チャット</div>`, "left:14px;top:6px;font-size:18px;color:#bcd", panel);
    const map = add(`<div></div>`, `left:340px;top:70px;width:360px;height:360px;background:#eadcb0;border:5px solid ${INK};border-radius:10px;overflow:hidden;z-index:6`);
    const svg = add(`<svg viewBox="0 0 360 360" style="left:0;top:0;width:100%;height:100%"><path d="M-10 120C90 60 220 160 370 90" fill=none stroke=#7fc4ee stroke-width=28 /><rect x=36 y=72 width=34 height=66 rx=4 fill=#a06a38 stroke=${INK} stroke-width=4 transform="rotate(-8 53 105)" />
      <circle cx=290 cy=290 r=34 fill=#9bb86a stroke=${INK} stroke-width=4 /><rect x=250 y=222 width=40 height=30 fill=#d8a070 stroke=${INK} stroke-width=4 /><path d="M0 250H360M0 310H360M120 160V360M240 160V360" stroke=#c9b98a stroke-width=2 /></svg>`, "", map);
    add(`<div>橋</div>`, "left:30px;top:142px;font-size:18px;color:#222", map); add(`<div>公園</div>`, "left:262px;top:322px;font-size:18px;color:#222", map);
    const D = [[53, 105], [300, 75], [312, 230], [190, 322], [48, 245]];
    const says = [["たろう", "橋のところで見た!"], ["はなこ", "いや昨日の夜だ"], ["じろう", "公園の池だった"], ["みき", "朝イチで見たぞ"], ["けん", "画面の中で見た"]];
    const cols = ["#e8553b", "#e8844b", "#d0463a", "#e86f8b", "#c9763a"];
    await wait(800); chip("チャットが「見た！」と書き込んだ");
    const dots = [];
    for (let i = 0; i < 5; i++) {
      const row = add(`<div></div>`, `left:8px;top:${36 + i * 60}px;width:294px;height:56px`, panel);
      zari(0, 6, 40, { face: "shock", color: cols[i], parent: row, z: 2 });
      add(`<div>${says[i][1]}</div>`, "left:48px;top:12px;font-size:22px;color:#fff;white-space:nowrap;background:#fff2;padding:2px 8px;border-radius:10px", row);
      pop(row, 180); await wait(450);
      const d = add(`<div></div>`, `left:${D[i][0] - 11}px;top:${D[i][1] - 11}px;width:22px;height:22px;border-radius:50%;background:#e22;border:3px solid ${INK};z-index:3`, map);
      pop(d, 200); const ping = add(`<div></div>`, `left:${D[i][0] - 11}px;top:${D[i][1] - 11}px;width:22px;height:22px;border-radius:50%;border:3px solid #e22;z-index:3`, map);
      anim(ping, [{ transform: "scale(.5)", opacity: 1 }, { transform: "scale(3)", opacity: 0 }], 500).then(() => ping.remove()); dots.push(d);
      await wait(550);
    }
    await wait(300); chip("点を線で結ぶ");
    const pts = D.concat([D[0]]).map((p, i) => `${i ? "L" : "M"}${p[0]} ${p[1]}`).join("");
    const ln = add(`<svg viewBox="0 0 360 360" style="left:0;top:0;width:100%;height:100%;z-index:2"><path id=q5ln d="${pts}" fill=none stroke=#e22 stroke-width=4 stroke-dasharray=1200 stroke-dashoffset=1200 /></svg>`, "", map);
    await anim(ln.firstChild, [{ strokeDashoffset: 1200 }, { strokeDashoffset: 0 }], 1300, { easing: "linear" });
    const sp = add(`<svg viewBox="0 0 360 360" style="left:0;top:0;width:100%;height:100%;z-index:2">${D.map(p => `<path d="M${p[0]} ${p[1]}L180 200" stroke=#e22 stroke-width=3 stroke-dasharray=6,5 />`).join("")}</svg>`, "", map);
    anim(sp, [{ opacity: 0 }, { opacity: 1 }], 400);
    const mon = add(`<div><div style="left:5px;top:4px;right:5px;bottom:12px;background:#171d2c;border:2px solid #7cf"></div><div style="left:8px;right:8px;bottom:0;height:7px;background:#999"></div></div>`, `left:154px;top:176px;width:52px;height:42px;background:#667;border:3px solid ${INK};z-index:4`, map);
    pop(mon, 260); mon.style.boxShadow = "0 0 22px #ffe066";
    const lb = add(`<div>配信画面</div>`, "left:150px;top:222px;font-size:18px;color:#c62828;font-weight:900;white-space:nowrap;background:#fff8;padding:0 6px", map);
    await wait(1000);
    const dt = zari(30, 420, 100, { acc: "glasses", face: "smile", z: 15 });
    const nt = note("落とし場所：配信そのもの", "left:340px;top:446px;font-size:26px;rotate:-2deg"); pop(nt, 240);
    await wait(800); const cl = ov(h, closedEyes);
    for (let i = 0; i < 2; i++) { await anim(h, [{ transform: "none" }, { transform: "translateY(12px)" }, { transform: "none" }], 450); await wait(150); }
    await wait(1500);
    cl.remove(); await q5End();
  },

  // ---------------- T25-02 自分を印刷して持参 ----------------
  async i_T25_02() {
    const h = ham(N);
    await wait(700); chip("落下してデス");
    h.img.style.filter = "grayscale(.8) brightness(.9)"; const eyes = ov(h, whiteEyes + frown);
    await anim(h, [{ transform: "translateY(-600px)" }, { transform: "none" }, { transform: "scale(1.1,.85)" }, { transform: "none" }], 750, { easing: "ease-in" });
    shake(h);
    const win = add(`<div></div>`, `left:20px;top:64px;width:440px;height:190px;background:#f4f7fb;border:4px solid ${INK};border-radius:10px;z-index:18;color:#222`);
    add(`<div>死亡届 オンライン申請</div>`, `left:0;right:0;top:0;height:34px;background:#2a5bd7;color:#fff;font-size:20px;padding:4px 12px;border-radius:5px 5px 0 0;white-space:nowrap`, win);
    add(`<div>STEP 7 / 12　遺体の確認</div>`, "left:14px;top:46px;font-size:20px;white-space:nowrap", win);
    add(`<div>画面に映った自分を<br>印刷して持参してください</div>`, "left:14px;top:84px;font-size:22px;line-height:1.35;color:#c62828;font-weight:900;white-space:nowrap", win);
    add(`<div>[ 印刷する ]</div>`, `left:290px;top:140px;font-size:18px;background:#ddd;border:2px solid #888;padding:2px 10px;white-space:nowrap`, win);
    pop(win, 300); await wait(1500);
    // プリンタ
    const pr = add(`<div></div>`, `left:440px;top:392px;width:210px;height:80px;background:#d4d8de;border:4px solid ${INK};border-radius:12px;z-index:16`);
    add(`<div></div>`, `left:30px;top:-6px;width:150px;height:12px;background:#333;border-radius:6px`, pr);
    add(`<div></div>`, `left:150px;top:40px;width:36px;height:12px;background:#3c3;border-radius:6px`, pr);
    pop(pr, 250);
    chip("画面から自分を印刷");
    const bar = add(`<div></div>`, `left:${HX}px;top:${HY}px;width:${HW}px;height:6px;background:#4f4;box-shadow:0 0 14px #4f4;z-index:22`);
    await anim(bar, [{ transform: "none" }, { transform: `translateY(${HH}px)` }], 700, { easing: "linear" }); bar.remove();
    say("ウィーン…", 560, 330, { size: 38, color: "#fff", ms: 900 });
    const msk = add(`<div></div>`, "left:490px;top:232px;width:110px;height:160px;overflow:hidden;z-index:15");
    const sh = add(`<div></div>`, `left:0;top:160px;width:110px;height:140px;background:#fffdf4;border:3px solid ${INK};overflow:hidden`, msk);
    add(`<img src="${N}" style="left:10px;top:12px;width:90px;height:92px;filter:grayscale(1) contrast(1.2)">`, "", sh);
    add(`<div>本人(原寸大)</div>`, "left:0;right:0;bottom:4px;font-size:14px;color:#222;white-space:nowrap;text-align:center", sh);
    await anim(sh, [{ transform: "none" }, { transform: "translateY(-140px)" }], 900, { easing: "linear" });
    await wait(300); chip("二つ折りにして封筒へ");
    await anim(sh, [{ transform: "translateY(-140px)" }, { transform: "translateY(-140px) scale(1,.5)" }], 350);
    const env = add(`<div></div>`, `left:458px;top:290px;width:170px;height:104px;background:#e6c58a;border:4px solid ${INK};overflow:hidden;z-index:17`);
    add(`<img src="${N}" style="left:44px;top:6px;width:82px;height:84px;filter:grayscale(1);opacity:.55;mix-blend-mode:multiply">`, "", env);
    add(`<div></div>`, "left:0;top:0;width:100%;height:100%;background:linear-gradient(to bottom right,transparent 49.5%,#a9874f 50%,transparent 51%),linear-gradient(to bottom left,transparent 49.5%,#a9874f 50%,transparent 51%)", env);
    add(`<div>〒</div>`, "right:6px;top:2px;font-size:22px;color:#c62828", env);
    msk.remove(); pop(env, 260);
    say("ペタンコ", 540, 200, { size: 44, color: "#fff", ms: 1100 }); await wait(1300);
    const pst = add(`<div><div style="left:0;top:0;width:100%;height:100%;background:#d3202a;border:4px solid ${INK};border-radius:44px 44px 6px 6px"></div><div style="left:14px;top:20px;width:62px;height:11px;background:#222;border-radius:6px"></div><div style="left:0;right:0;top:46px;text-align:center;font-size:20px;color:#fff;font-weight:900">POST</div><div style="left:18px;bottom:-26px;width:14px;height:26px;background:#555"></div><div style="left:58px;bottom:-26px;width:14px;height:26px;background:#555"></div></div>`, "left:60px;top:340px;width:92px;height:120px;z-index:16");
    pop(pst, 250); await wait(300);
    chip("封筒を郵便ポストへ");
    await anim(env, [{ transform: "none" }, { transform: "translate(-330px,-30px) rotate(-14deg) scale(.7)", offset: .6 }, { transform: "translate(-390px,70px) rotate(-90deg) scale(.5)" }], 1000, { easing: "ease-in-out" });
    env.remove(); say("ポン", 106, 300, { size: 44, color: "#fff", ms: 900 }); shake(pst);
    await wait(600); bubble("到着まで 3〜5営業日", 300, 440, 1700);
    eyes.remove(); h.img.style.filter = "none"; await wait(1800);
    await q5End();
  },

  // ---------------- T26-03 定期券と停留所 ----------------
  async i_T26_03() {
    const h = ham(N), bus = q5Bus(); anim(bus.wall, [{ opacity: 0 }, { opacity: 1 }], 300);
    const lab = label("あの世行き　乗車 3回目", "right:16px;top:16px;z-index:40");
    h.img.style.filter = "saturate(.6)"; const eyes = ov(h, frown);
    await wait(700); chip("3回連続でデス");
    bubble("また乗りましたね", 330, 322, 1500); await wait(1500);
    bubble("もう定期にしときます", 330, 322, 1700);
    const card = add(`<div><div style="left:8px;top:2px;font-size:15px;color:#c62828;white-space:nowrap">定期券 あの世↔現世</div></div>`, `left:150px;top:392px;width:200px;height:116px;background:#fffdf4;border:3px solid ${INK};color:#222;z-index:20`);
    add(`<div></div>`, `left:8px;top:26px;width:70px;height:80px;background:#cde;border:2px solid ${INK};overflow:hidden`, card);
    add(`<img src="${N}">`, "left:2px;top:6px;width:66px;height:68px", card.lastChild);
    add(`<div>ハム専用</div>`, "left:88px;top:40px;font-size:22px;white-space:nowrap;font-weight:900", card);
    pop(card, 300); await anim(card, [{ transform: "none" }, { transform: "translate(130px,-10px) scale(1.25)" }], 500); await wait(1300);
    await anim(card, [{ transform: "translate(130px,-10px) scale(1.25)" }, { transform: "translate(500px,-20px) scale(.4)" }], 500, { easing: "ease-in" }); card.remove();
    hop(h, 30); eyes.remove(); h.img.style.filter = "none";
    // 改札
    const post = (x) => add(`<div></div>`, `left:${x}px;top:376px;width:26px;height:104px;background:#8a8f9a;border:4px solid ${INK};z-index:8`);
    post(470); post(640);
    const lamp = add(`<div></div>`, `left:473px;top:362px;width:20px;height:14px;background:#d33;border:3px solid ${INK};border-radius:6px;z-index:9`);
    const flaps = [add(`<div></div>`, `left:496px;top:410px;width:68px;height:14px;background:#e8c33a;border:3px solid ${INK};z-index:8;transform-origin:0 50%`), add(`<div></div>`, `left:566px;top:410px;width:68px;height:14px;background:#e8c33a;border:3px solid ${INK};z-index:8;transform-origin:100% 50%`)];
    await wait(300); chip("改札は顔を見ただけで開く");
    const scan = ov(h, `<rect x=260 y=300 width=700 height=470 fill=none stroke=#3f3 stroke-width=14 stroke-dasharray="90 50" rx=30 />`);
    const wk = walk(h, 0, -190, 900, 4);
    await wait(500); lamp.style.background = "#3c3"; say("ピッ", 570, 330, { size: 40, color: "#7dff8a", ms: 700 });
    flaps[0].animate([{ transform: "none" }, { transform: "rotate(-80deg)" }], { duration: 250, fill: "forwards" }); flaps[1].animate([{ transform: "none" }, { transform: "rotate(80deg)" }], { duration: 250, fill: "forwards" });
    await wk; scan.remove();
    bubble("顔パス", 560, 300, 1200);
    await wait(1400);
    // 停留所
    chip("バスが停車");
    bus.run.pause();
    const wn = bus.win;
    const z = zari(560, 118, 80, { acc: "helmet", face: "angry", parent: wn, z: 6 });
    await wait(500);
    const sg = add(`<div><div style="left:30px;top:30px;width:6px;height:96px;background:#555"></div><div style="left:0;top:0;width:66px;height:66px;border-radius:50%;background:#e44;border:4px solid ${INK};font-size:17px;text-align:center;padding-top:20px;white-space:nowrap;color:#fff;-webkit-text-stroke:3px ${INK};paint-order:stroke fill">ハム前</div></div>`, "left:470px;top:50px;width:70px;height:130px;z-index:5", wn);
    pop(sg, 300); say("ドン", 700, 160, { size: 36, color: "#fff", ms: 600 });
    await wait(700);
    const bn = add(`<div><div style="left:0;top:0;width:100%;height:12px;background:#a06a38;border:3px solid ${INK}"></div><div style="left:8px;top:12px;width:8px;height:24px;background:#5a3a20"></div><div style="right:8px;top:12px;width:8px;height:24px;background:#5a3a20"></div></div>`, "left:640px;top:140px;width:110px;height:40px;z-index:5", wn);
    pop(bn, 300); await wait(500);
    bubble("次は、ハム前。", 330, 322, 1700);
    const q = say("!?", 720, 250, { size: 80, color: "#ff5a4a", ms: 800 }); ov(h, whiteEyes);
    await wait(1900);
    await q5End();
  },

  // ---------------- T26-08 片道の回数券 ----------------
  async i_T26_08() {
    const h = ham(N), bus = q5Bus(900); anim(bus.wall, [{ opacity: 0 }, { opacity: 1 }], 300);
    await wait(700); chip("チャネポで「回数券」を交換");
    const pst = note("10回乗ると<br>1回おまけ!", "left:480px;top:90px;font-size:44px;line-height:1.2;text-align:center;rotate:-3deg;z-index:30");
    pop(pst, 300);
    const tks = []; for (let i = 0; i < 11; i++) {
      const t = add(`<div>${i + 1}</div>`, `left:${190 + i * 44}px;top:344px;width:42px;height:60px;background:${i === 10 ? "#ffe066" : "#fffdf4"};border:3px solid ${INK};color:#222;font-size:20px;text-align:center;padding-top:6px;z-index:20`);
      tks.push(t); pop(t, 120); await wait(60);
    }
    say("11枚つづり!!", 400, 470, { size: 46, color: "#ffe066", ms: 1200 }); hop(h, 60); await wait(300); hop(h, 40);
    burst(...P(600, 600), 10); await wait(1300);
    chip("10回乗車"); const cnt = label("乗車 0回", "right:16px;top:16px;z-index:40;font-size:26px");
    for (let i = 0; i < 10; i++) { cnt.textContent = `乗車 ${i + 1}回`; add(`<div></div>`, "left:11px;top:34px;width:16px;height:16px;border-radius:50%;background:#fff;border:3px solid #c62828", tks[i]); anim(tks[i], [{ transform: "none" }, { transform: "translateY(-10px)" }, { transform: "none" }], 140); await wait(180); }
    await wait(300); say("おまけ!!", 500, 280, { size: 56 }); anim(tks[10], [{ transform: "none" }, { transform: "translateY(-30px) scale(1.2)" }, { transform: "none" }], 500, { iterations: 2 });
    await wait(1100); chip("最後の1枚をよく見る");
    const big = note("あの世行き　<span style='position:static;color:#d3202a;font-size:78px'>片道</span><br style='position:static'><span style='position:static;font-size:22px'>※ご乗車1回限り</span>", "left:230px;top:196px;font-size:34px;text-align:center;line-height:1.3;padding:10px 24px;z-index:35");
    anim(big, [{ transform: "translate(330px,150px) scale(.1)", opacity: 0 }, { transform: "none", opacity: 1 }], 400);
    ov(h, whiteEyes + openMouth); await wait(1200);
    say("片道…?", 800, 240, { size: 54, color: "#ff5a4a", ms: 1400 });
    bus.dr.innerHTML = zariSvg({ face: "sad", acc: "helmet", extra: `<text x=84 y=30 font-size=28>💦</text>` });
    bus.dr.style.transform = "translateX(-40px)";
    await wait(900); bubble("…………", 200, 306, 1800);
    await wait(2000);
    await q5End();
  },
});
}

{
// ---- q6 共通部品 ----
const q6hm = (src, x, y, w, css = "", parent = s) => { const d = add(`<div><img src="${src}" style="left:0;top:0;width:100%;height:100%"></div>`, `left:${x}px;top:${y}px;width:${w}px;height:${w * 1271 / 1237}px;${css}`, parent); d.img = d.firstChild; return d; };
const q6t = (t, x, y, size = 30, color = "#fff", css = "", parent = s) => add(`<div style="left:${x}px;top:${y}px;translate:-50% -50%;font-size:${size}px;color:${color};white-space:nowrap;z-index:30;${css}">${t}</div>`, "", parent);
const q6cloud = (col, x, y, w, h, z = 9, circles, css = "") => {
  const c = circles || [[35, 72, 28], [68, 50, 32], [108, 40, 36], [148, 56, 32], [172, 80, 24], [100, 76, 34], [55, 84, 26], [140, 86, 26]];
  const f = a => c.map(([cx, cy, r]) => `<circle cx=${cx} cy=${cy} r=${r} ${a} />`).join("");
  return add(`<svg viewBox="0 0 200 110" style="overflow:visible">${f(`fill=${col} stroke=${INK} stroke-width=6`)}${f(`fill=${col}`)}</svg>`, `left:${x}px;top:${y}px;width:${w}px;height:${h}px;z-index:${z};${css}`);
};
const q6fridge = `<svg viewBox="0 0 100 140" style="left:0;top:0;width:100%;height:100%"><rect x=8 y=4 width=84 height=132 rx=10 fill=#e9f2f7 stroke=${INK} stroke-width=5 /><path d="M8 52H92" stroke=${INK} stroke-width=5 /><rect x=74 y=16 width=7 height=26 rx=3 fill=#7a8a96 /><rect x=74 y=62 width=7 height=38 rx=3 fill=#7a8a96 /><path d="M18 14Q18 30 22 40" stroke=#fff stroke-width=4 fill=none stroke-linecap=round /></svg>`;
const q6cols = [["#e8553b", "#b83a26"], ["#4aa3d8", "#2d78a8"], ["#7bc043", "#4f8a26"], ["#b46ad8", "#8a42ae"], ["#f0a030", "#b87414"]];
const q6chat = (x, y, w, lines, z = 20) => {
  const p = add(`<div></div>`, `left:${x}px;top:${y}px;width:${w}px;height:${lines.length * 38 + 14}px;background:#000b;border:2px solid #fff6;border-radius:12px;z-index:${z}`);
  p.rows = lines.map((t, i) => { const r = add(`<div></div>`, `left:8px;top:${7 + i * 38}px;width:${w - 16}px;height:34px;opacity:0`, p);
    zari(0, 1, 30, { parent: r, z: 1, color: q6cols[i % 5][0], dark: q6cols[i % 5][1] });
    add(`<div style="left:38px;top:3px;font-size:20px;white-space:nowrap;color:#fff;font-weight:700">${t}</div>`, "", r); return r; });
  p.style.opacity = 0;
  p.show = i => { p.style.opacity = 1; return anim(p.rows[i], [{ opacity: 0, transform: "translateY(10px)" }, { opacity: 1, transform: "none" }], 180); };
  return p;
};
const q6red = t => `<b style="position:static;color:#ff5a4a">${t}</b>`;
const q6arc = (x0, y0, cx, cy, x1, y1, col = "#fff", w = 9) => { const a = Math.atan2(y1 - cy, x1 - cx) * 180 / Math.PI;
  return add(`<svg viewBox="0 0 960 540" style="left:0;top:0;width:960px;height:540px;overflow:visible"><path d="M${x0} ${y0}Q${cx} ${cy} ${x1} ${y1}" fill=none stroke=${INK} stroke-width=${w + 7} stroke-linecap=round stroke-dasharray="${w * 2.2} ${w * 1.6}" /><path d="M${x0} ${y0}Q${cx} ${cy} ${x1} ${y1}" fill=none stroke=${col} stroke-width=${w} stroke-linecap=round stroke-dasharray="${w * 2.2} ${w * 1.6}" />
    <path d="M-26 -24L10 0L-26 24Z" transform="translate(${x1} ${y1}) rotate(${a})" fill=${col} stroke=${INK} stroke-width=6 stroke-linejoin=round /></svg>`, "z-index:14"); };

Object.assign(scenes, {
  // ------------------------------------------------------------------ 終バスの敬礼
  async i_T26_10() {
    const h = ham(N);
    await wait(400); chip("配信を終了する");
    const bus = layer("z-index:9;background:#0e1233;opacity:0");
    add(`<div></div>`, `left:0;top:0;width:960px;height:56px;background:#2b3262;border-bottom:5px solid ${INK}`, bus);
    for (let i = 0; i < 7; i++) add(`<div></div>`, `left:${180 + i * 120}px;top:60px;width:26px;height:36px;border:5px solid #e8e0c0;border-top:0;border-radius:0 0 14px 14px`, bus);
    const win = add(`<div></div>`, `left:20px;top:100px;width:920px;height:150px;background:#1b2250;border:6px solid ${INK};overflow:hidden`, bus);
    const lamps = [];
    for (let i = 0; i < 9; i++) { const l = add(`<div></div>`, `left:${i * 110 + 20}px;top:${30 + (i % 3) * 36}px;width:30px;height:30px;border-radius:50%;background:#ffd86b;box-shadow:0 0 18px #ffd86b`, win);
      lamps.push(l.animate([{ transform: "none" }, { transform: "translateX(-990px)" }], { duration: 1300, iterations: Infinity })); }
    add(`<div></div>`, `left:0;top:250px;width:960px;height:290px;background:#2a1f33`, bus);
    for (const x of [260, 420, 580]) add(`<div></div>`, `left:${x}px;top:280px;width:130px;height:140px;border-radius:30px 30px 8px 8px;background:#5b3f7a;border:5px solid ${INK}`, bus);
    add(`<div></div>`, `left:690px;top:340px;width:290px;height:200px;border-radius:30px 0 0 0;background:#6d4c92;border:5px solid ${INK}`, bus);
    const sign = add(`<div>終点 あの世</div>`, `left:360px;top:62px;padding:2px 18px;background:#111;border:3px solid #ffb000;color:#ffb000;font-size:26px;white-space:nowrap;z-index:3`, bus);
    const dr = zari(40, 240, 110, { face: "smile", z: 11, color: "#4aa3d8", dark: "#2d78a8" });
    const cap = add(`<svg viewBox="0 0 120 132" style="left:0;top:0;width:100%;height:100%;overflow:visible"><path d="M38 28Q60 2 82 28Z" fill=#1f3a7a stroke=${INK} stroke-width=3 /><rect x=34 y=26 width=54 height=7 rx=3 fill=#14275a stroke=${INK} stroke-width=3 /><circle cx=60 cy=19 r=3.5 fill=#ffd23c /></svg>`, "left:40px;top:240px;width:110px;height:121px;z-index:12");
    add(`<div></div>`, `left:20px;top:352px;width:120px;height:44px;border-radius:50%;background:#222;border:5px solid ${INK};z-index:13`, bus);
    await anim(bus, [{ opacity: 0 }, { opacity: 1 }], 500);
    const eyes = ov(h, closedEyes); h.classList.add("bob");
    say("終バス…", 480, 330, { color: "#cfe0ff", ms: 1100 });
    await wait(1200);
    bubble("次は〜 ハム前〜", 270, 175, 1700); sign.textContent = "次は ハム前"; await wait(1200);
    lamps.forEach(a => a.updatePlaybackRate(.4)); await wait(500); lamps.forEach(a => a.updatePlaybackRate(.1));
    say("プシュー", 480, 330, { size: 40, color: "#fff", ms: 800 }); await wait(500); lamps.forEach(a => a.pause());
    eyes.remove(); h.classList.remove("bob"); hop(h, 30); bubble("ふぅ…降ります", 640, 215, 1300);
    await wait(900);
    await walk(h, 0, -500, 1000, 5);
    anim(dr, [{ transform: "none" }, { transform: "translateY(0)" }], 10);
    await anim(cap, [{ transform: "none" }, { transform: "translate(-34px,-26px) rotate(-30deg)", offset: .4 }, { transform: "translate(-30px,72px) rotate(-10deg)" }], 600);
    say("敬礼!", 250, 90, { size: 56, color: "#fff", ms: 1300 });
    dr.style.transformOrigin = "50% 100%"; anim(dr, [{ transform: "none" }, { transform: "rotate(14deg)" }, { transform: "none" }], 700); 
    bubble("お疲れさまでした、また明日", 380, 188, 2200);
    await wait(1300);
    await walk(h, -500, -600, 300, 1); await fade(h, 300);
    const tt = layer("z-index:40;background:linear-gradient(#141a3d,#3c3566 50%,#e59a5c 85%);opacity:0");
    add(`<div></div>`, `left:0;top:480px;width:960px;height:60px;background:#1d1a2b`, tt);
    add(`<div></div>`, `left:812px;top:170px;width:18px;height:320px;background:#8a8f9c;border:4px solid ${INK}`, tt);
    add(`<div>ハム前</div>`, `left:735px;top:44px;width:170px;height:130px;border-radius:50%;background:#2a6fd0;border:7px solid #fff;outline:5px solid ${INK};color:#fff;font-size:42px;text-align:center;line-height:116px`, tt);
    const bd = add(`<div></div>`, `left:70px;top:60px;width:560px;height:400px;background:#fffdf2;border:8px solid ${INK};z-index:2`, tt);
    add(`<div>時刻表　ハム前 → あの世</div>`, `left:0;top:0;width:100%;height:58px;background:#1f8a4c;color:#fff;font-size:28px;text-align:center;line-height:58px`, bd);
    const rows = [["5:00", "運休"], ["5:30", "運休"], ["6:00", ""], ["6:30", "運休"]];
    rows.forEach(([t, d], i) => { add(`<div></div>`, `left:0;top:${72 + i * 80}px;width:100%;height:76px;border-bottom:3px dashed #bbb`, bd);
      add(`<div>${t}</div>`, `left:30px;top:${88 + i * 80}px;font-size:44px;color:#222;font-family:monospace`, bd);
      add(`<div>${d}</div>`, `left:210px;top:${96 + i * 80}px;font-size:32px;color:#999`, bd); });
    add(`<div>始発</div>`, `left:440px;top:${96 + 160}px;padding:0 10px;font-size:26px;color:#fff;background:#d3202a;border-radius:6px`, bd);
    const mk = zari(640, 330, 110, { face: "smile", z: 45, color: "#4aa3d8", dark: "#2d78a8", extra: `<path d="M16 52L-6 14" stroke=${INK} stroke-width=11 stroke-linecap=round /><path d="M16 52L-6 14" stroke=#d3202a stroke-width=6 stroke-linecap=round />` });
    mk.style.opacity = 0;
    await anim(tt, [{ opacity: 0 }, { opacity: 1 }], 500);
    label("翌朝", "left:700px;top:14px;font-size:28px;z-index:50");
    await wait(500); anim(mk, [{ opacity: 0 }, { opacity: 1 }], 200);
    const wr = add(`<div class=t>ハム</div>`, `left:212px;top:${88 + 160}px;font-size:56px;color:#d3202a;-webkit-text-stroke:0;font-weight:900;clip-path:inset(0 100% 0 0)`, bd);
    anim(mk, [{ transform: "none" }, { transform: "translate(-30px,-8px)" }], 200);
    await anim(wr, [{ clipPath: "inset(0 100% 0 0)" }, { clipPath: "inset(0 0% 0 0)" }], 900, { easing: "linear" });
    bubble("ハム、と…", 700, 270, 1500).style.zIndex = 60; await wait(800);
    label("終わっても、明日が決まっている", "left:200px;top:488px;font-size:28px;z-index:60");
    await wait(1500);
    await anim(tt, [{ opacity: 1 }, { opacity: 0 }], 500); tt.remove(); bus.remove(); cap.remove(); dr.remove();
    h.style.transform = "none"; anim(h, [{ opacity: 0 }, { opacity: 1 }], 300); hop(h, 40); await wait(1200);
  },

  // ------------------------------------------------------------------ 足置きに昇格
  async i_T27_07() {
    const sky = layer("z-index:8;background:linear-gradient(#7cc6ff,#d8f0ff 65%,#fff)");
    const h = ham(N); ov(h, frown);
    q6cloud("#fff3bf", 640, 38, 310, 170, 9, 0, "");
    add(`<div>特等雲</div>`, `left:560px;top:30px;padding:2px 14px;background:#ffd23c;border:4px solid ${INK};border-radius:8px;color:${INK};font-size:26px;z-index:22;white-space:nowrap`);
    q6cloud("#dfe5ec", 680, 478, 290, 90, 9, [[30, 60, 30], [72, 48, 34], [122, 56, 32], [168, 64, 26]], "");
    const king = zari(735, 28, 125, { face: "smile", acc: "crown", z: 12 }); king.style.scale = "1.2 1";
    const lb = label("課金額 ¥0", `left:560px;top:488px;font-size:26px`);
    const ld = add(`<div></div>`, `left:722px;top:534px;width:52px;height:0;border:solid #a86a2a;border-width:0 7px;z-index:11;background:repeating-linear-gradient(0deg,transparent 0 22px,#a86a2a 22px 30px);filter:drop-shadow(2px 0 0 ${INK}) drop-shadow(-2px 0 0 ${INK})`);
    await wait(700); chip("ビッツが届いた");
    say("無課金…", 500, 300, { color: "#7a8aa0", ms: 900 }); await wait(1200);
    let tot = 0;
    for (const [i, v] of [[0, 100], [1, 1000], [2, 10000]].map(([i, v]) => [i, v])) {
      await wait(i ? 600 : 100); chip(`ビッツ ${v} が届いた`); tot += v; lb.textContent = `課金額 ¥${tot.toLocaleString()}`;
      say(`💎 ${v}`, 440, 170, { size: 54, ms: 800 });
      const H = [154, 244, 334][i], dy = [-50, -110, -170][i];
      anim(ld, [{ top: `${534 - [0, 154, 244][i]}px`, height: `${[0, 154, 244][i]}px` }, { top: `${534 - H}px`, height: `${H}px` }], 350);
      await wait(250); anim(h, [{ transform: `translateY(${[0, -50, -110][i]}px)` }, { transform: `translateY(${dy - 40}px)`, offset: .5 }, { transform: `translateY(${dy}px)` }], 600);
      await wait(700);
    }
    await wait(300);
    anim(king, [{ transform: "none" }, { transform: "translateY(12px)" }], 250);
    chip("昇格");
    ov(h, `<circle cx=600 cy=800 r=330 fill=none stroke=#ff7ab0 stroke-width=70 stroke-dasharray="40 28" stroke-linecap=round /><circle cx=600 cy=800 r=330 fill=none stroke=#ffd23c stroke-width=30 stroke-dasharray="24 44" stroke-linecap=round />`);
    h.firstChild; bubble("ちょうどいい高さだ", 560, 110, 2200);
    const bn = note("昇格おめでとう", "left:360px;top:260px;translate:-50% -50%;font-size:36px;z-index:30"); pop(bn);
    await wait(500); stamp("足置き採用", 470, 380, 56);
    await wait(2500);
  },

  // ------------------------------------------------------------------ 冷蔵庫の手柄
  async i_T28_02() {
    const h = ham(N);
    const en = zari(320, 262, 130, { face: "angry", acc: "helmet", color: "#4aa3d8", dark: "#2d78a8" });
    await wait(500); chip("呪文を1文字間違えた直後にデス");
    const ch = q6chat(630, 20, 320, ["ちゅーちゅー ひまわり", "ちゅーちゅー ひまわり", `ち${q6red("ゆ")}ーちゅー ひまわり`]);
    for (let i = 0; i < 3; i++) { await wait(500); ch.show(i); }
    await wait(300); say("1文字ちがう!!", 470, 190, { size: 50, color: "#ff6a5a", ms: 1200 });
    anim(en, [{ transform: "none" }, { transform: "translateX(50px) scale(1.1)" }], 300); await wait(900);
    const ex = ov(h, whiteEyes + openMouth); shake(h);
    const sh = add(`<div></div>`, `left:${HX + 20}px;top:${HY + 175}px;width:190px;height:44px;border-radius:50%;background:#0009;z-index:9`);
    anim(sh, [{ transform: "scale(.2)" }, { transform: "scale(1)" }], 700);
    say("!", 640, 290, { size: 80, color: "#ff5a4a", ms: 700 }); await wait(700);
    const fr = add(`<div>${q6fridge}</div>`, `left:${HX + 47}px;top:${534 - 175}px;width:130px;height:175px;z-index:12`);
    await anim(fr, [{ transform: "translateY(-620px)" }, { transform: "none" }], 320, { easing: "ease-in" });
    anim(h, [{ transform: "none" }, { transform: "scale(1.2,.28)" }], 120); sh.remove();
    for (let i = 0; i < 14; i++) crumb(HX + 110, 500);
    say("ズシーン!!", 480, 250, { size: 62, color: "#fff", ms: 1100 });
    anim(fr, [{ transform: "none" }, { transform: "translateY(-14px)" }, { transform: "none" }], 260);
    await wait(900); chip("デス");
    const kc = add(`<div></div>`, `left:60px;top:64px;width:500px;height:100px;background:#000d;border:3px solid #fff7;border-radius:10px;z-index:40`);
    anim(kc, [{ transform: "translateY(-130px)" }, { transform: "none" }], 250);
    add(`<div>● KILLCAM</div>`, "left:14px;top:8px;font-size:20px;color:#ff5a4a", kc);
    add(`<div>倒した敵：</div>`, "left:14px;top:50px;font-size:28px;color:#fff", kc);
    const ic = add(`<div></div>`, "left:170px;top:42px;width:44px;height:48px", kc); zari(0, 0, 44, { parent: ic, face: "angry", acc: "helmet", color: "#4aa3d8", dark: "#2d78a8", z: 1 });
    const nm = add(`<div>ザリ吉</div>`, "left:224px;top:50px;font-size:30px;color:#ffd23c;white-space:nowrap", kc);
    await wait(1000);
    const fl = add(`<div></div>`, "left:0;top:0;width:100%;height:100%;background:#fff", kc); anim(fl, [{ opacity: .9 }, { opacity: 0 }], 300);
    ic.innerHTML = `<div style="left:6px;top:0;width:34px;height:48px">${q6fridge}</div>`; nm.textContent = "冷蔵庫"; nm.style.color = "#7dff8a";
    say("書き換え!?", 480, 200, { size: 40, ms: 800 });
    await wait(900);
    en.remove(); const en2 = zari(320, 262, 130, { face: "sad", acc: "helmet", color: "#4aa3d8", dark: "#2d78a8" });
    anim(en2, [{ transform: "none" }, { transform: "translateY(14px) rotate(-7deg)" }], 500);
    bubble("俺の手柄が…", 380, 205, 2200);
    await wait(2800);
  },

  // ------------------------------------------------------------------ 家電から一軒家
  async i_T28_03() {
    const h = ham(N);
    const pile = add(`<div></div>`, "left:0;top:0;width:0;height:0;z-index:11");
    const wm = `<svg viewBox="0 0 100 100" style="left:0;top:0;width:100%;height:100%"><rect x=5 y=4 width=90 height=92 rx=10 fill=#f2f4f7 stroke=${INK} stroke-width=5 /><path d="M5 26H95" stroke=${INK} stroke-width=4 /><circle cx=50 cy=61 r=26 fill=#9ad0f0 stroke=${INK} stroke-width=5 /><circle cx=50 cy=61 r=15 fill=#cfe9fa /><circle cx=20 cy=15 r=5 fill=#e55 /><circle cx=34 cy=15 r=5 fill=#5be /></svg>`;
    const tw = `<svg viewBox="0 0 100 60" style="left:0;top:0;width:100%;height:100%"><rect x=6 y=16 width=88 height=40 rx=12 fill=#d8b64a stroke=${INK} stroke-width=5 /><path d="M20 22V8M36 22V4M52 22V8M68 22V4M82 22V8" stroke=${INK} stroke-width=5 stroke-linecap=round /></svg>`;
    const items = [["タワシ", 80, 48, tw, .92], ["冷蔵庫", 108, 146, q6fridge, .8], ["洗濯機", 146, 146, wm, .66]];
    let top = HY + 16, prev = 0;
    await wait(500);
    for (let i = 0; i < 3; i++) {
      const [nm, w, hh, svg, sy] = items[i];
      chip(`連続デス ×${i + 1}`); say("呪文ミス…", 440, 150, { size: 44, color: "#ff6a5a", ms: 800 }); await wait(750);
      top -= hh - 10;
      const it = add(`<div>${svg}</div>`, `left:${HX + HW / 2 - w / 2}px;top:${top}px;width:${w}px;height:${hh}px`, pile);
      await anim(it, [{ transform: "translateY(-700px)" }, { transform: "none" }], 340, { easing: "ease-in" });
      const dy = 230 * (1 - sy);
      anim(pile, [{ transform: `translateY(${prev}px)` }, { transform: `translateY(${dy}px)` }], 160); prev = dy;
      anim(h, [{ transform: `scaleY(${i ? [1, .92, .8][i] : 1})` }, { transform: `scaleY(${sy})` }], 160);
      for (let k = 0; k < 8; k++) crumb(HX + 110, 510);
      say(nm, 440, 250, { size: 54, color: "#fff", ms: 900 }); await wait(1100);
    }
    chip("連続デス ×4"); say("呪文ミス…", 440, 150, { size: 44, color: "#ff6a5a", ms: 800 }); await wait(800);
    say("一軒家!?", 430, 250, { size: 70, color: "#ffd23c", ms: 1100 });
    const hs = add(`<div></div>`, "left:556px;top:36px;width:404px;height:504px;z-index:20");
    add(`<svg viewBox="0 0 400 500" style="left:0;top:0;width:100%;height:100%;overflow:visible"><rect x=300 y=60 width=44 height=100 fill=#8a4a3a stroke=${INK} stroke-width=6 /><path d="M-14 214L200 14L414 214Z" fill=#b5482f stroke=${INK} stroke-width=8 stroke-linejoin=round /><rect x=22 y=204 width=356 height=290 fill=#f3e2bd stroke=${INK} stroke-width=8 /><rect x=250 y=330 width=96 height=164 fill=#8a5a2e stroke=${INK} stroke-width=6 /><circle cx=326 cy=416 r=7 fill=#ffd23c /></svg>`, "", hs);
    add(`<div>ハム</div>`, `left:250px;top:288px;width:96px;height:34px;background:#fff;border:4px solid ${INK};color:${INK};font-size:24px;text-align:center;line-height:26px`, hs);
    const wn = add(`<div></div>`, `left:52px;top:246px;width:150px;height:120px;background:#ffd27a;border:6px solid ${INK};overflow:hidden`, hs);
    const hi = q6hm(N, 16, 14, 118, "", wn); ov(hi, frown + tears);
    wn.style.opacity = 0;
    await anim(hs, [{ transform: "translateY(-600px)" }, { transform: "none" }], 450, { easing: "ease-in" });
    pile.style.opacity = 0; h.style.opacity = 0;
    anim(hs, [{ transform: "none" }, { transform: "scale(1.04,.96)", transformOrigin: "50% 100%" }, { transform: "none" }], 300);
    for (let k = 0; k < 16; k++) crumb(rnd(580, 940), 520);
    say("ドスン!!", 440, 250, { size: 62, ms: 900 });
    await wait(1200); wn.style.opacity = 1; pop(wn, 250);
    await wait(500); say("ただいま…", 420, 330, { size: 40, color: "#cfd6e4", ms: 2200 });
    await wait(2800);
  },
  // ------------------------------------------------------------------ 最期の一瞬を撮影
  async i_T29_02() {
    const h = ham(N);
    const dk = layer("z-index:8;background:#000b");
    await wait(400); chip("デスしてキルカムが流れた");
    // 遺影の壁
    const wall = add(`<div></div>`, `left:560px;top:60px;width:386px;height:230px;background:#6a5a48;border:6px solid ${INK};z-index:9;border-radius:10px`);
    add(`<div>遺影コレクション</div>`, `left:0;top:6px;width:100%;text-align:center;font-size:24px;color:#e8dcc0`, wall);
    const faceSvg = k => `<svg viewBox="0 0 100 100" style="left:0;top:0;width:100%;height:100%"><circle cx=50 cy=56 r=36 fill=#fbf5e9 stroke=${INK} stroke-width=4 /><circle cx=36 cy=14 r=12 fill=#aaa1a0 stroke=${INK} stroke-width=3 /><circle cx=64 cy=14 r=12 fill=#aaa1a0 stroke=${INK} stroke-width=3 />${k}</svg>`;
    const kinds = [`<path d="M30 46l14 8M44 46l-14 8M58 46l14 8M72 46l-14 8" stroke=${INK} stroke-width=3 /><path d="M36 70Q50 84 64 68" fill=none stroke=${INK} stroke-width=3 />`,
      `<circle cx=36 cy=52 r=6 fill=${INK} /><circle cx=64 cy=52 r=3 fill=${INK} /><ellipse cx=50 cy=72 rx=12 ry=8 fill=#c9485b /><path d="M40 78q0 14 4 16" stroke=#7cc4ff stroke-width=4 fill=none />`];
    const frm = (x, y, w, inner, par = s, z = 10) => add(`<div></div>`, `left:${x}px;top:${y}px;width:${w}px;height:${w * 1.25}px;background:#d9d2c0;border:${w * .08}px solid #111;outline:2px solid #666;z-index:${z}`, par);
    kinds.forEach((k, i) => { const f = frm(14 + i * 122, 50, 100, "", wall, 11); f.innerHTML = faceSvg(k).replace("style=\"", "style=\"left:0;top:0;");
      add(`<div></div>`, "left:-6px;top:-6px;width:28px;height:28px;background:#111;clip-path:polygon(0 0,100% 0,0 100%)", f); }); // 黒リボン
    wall.slotX = 14 + 2 * 122;
    add(`<div>？</div>`, `left:${wall.slotX}px;top:50px;width:100px;height:125px;border:4px dashed #e8dcc0;color:#e8dcc0;font-size:44px;text-align:center;line-height:117px`, wall);
    // キルカム
    const kc = add(`<div></div>`, `left:40px;top:90px;width:480px;height:310px;background:linear-gradient(#5a7090,#2a3550);border:5px solid #fff;overflow:hidden;z-index:12`);
    add(`<div>● KILLCAM</div>`, "left:12px;top:8px;font-size:24px;color:#ff5a4a;z-index:5", kc);
    add(`<div></div>`, "left:0;top:230px;width:100%;height:80px;background:#3b4a3a", kc);
    pop(kc, 250);
    const kh = q6hm(N, 150, 20, 190, "", kc);
    await wait(400);
    await anim(kh, [{ transform: "translate(-200px,-120px) rotate(-60deg)" }, { transform: "translate(-50px,-30px) rotate(-18deg)", offset: .6 }, { transform: "translate(0,20px) rotate(10deg)" }], 900, { easing: "ease-in" });
    await wait(150);
    ov(kh, whiteEyes + openMouth + `<path d="M560 700q-14 90 14 150q34-60 12-150" fill=#cfeaff stroke=${INK} stroke-width=8 />`);
    const fl = add(`<div></div>`, "left:0;top:0;width:100%;height:100%;background:#fff;z-index:20", kc);
    anim(fl, [{ opacity: 1 }, { opacity: 0 }], 500); say("📸 パシャッ!", 280, 260, { size: 54, color: "#fff", ms: 900 });
    anim(kh, [{ transform: "translate(0,20px) rotate(10deg)" }, { transform: "translate(0,20px) rotate(10deg)" }], 300);
    await wait(700);
    // 投票
    const cs = [["この顔がいい!", 40], ["満場一致w", 80], ["遺影確定", 120]];
    const mk = (t, i) => { const b = bubble(t, 130 + i * 140, 420 + (i % 2) * 40, 0); b.style.fontSize = "20px"; b.style.zIndex = 40; return b; };
    const bs = cs.map(([t], i) => mk(t, i)); await wait(1100);
    // 額に入れる
    const un = zari(10, 380, 110, { face: "smile", color: "#555", dark: "#333", acc: "tie", z: 45 }); anim(un, [{ transform: "translateX(-140px)" }, { transform: "none" }], 400);
    await wait(500);
    const pf = frm(0, 0, 220, "", s, 44); pf.style.left = "170px"; pf.style.top = "108px";
    q6hm(N, 28, 22, 150, "", pf); // 遺影の顔
    const pe = pf.lastChild; ov(pe, whiteEyes + openMouth + `<path d="M560 700q-14 90 14 150q34-60 12-150" fill=#cfeaff stroke=${INK} stroke-width=8 />`);
    pf.style.overflow = "hidden"; pf.style.transformOrigin = "0 0";
    add(`<div></div>`, "left:-8px;top:-8px;width:80px;height:80px;background:#111;clip-path:polygon(0 0,100% 0,0 100%)", pf);
    fade(kc, 300); bs.forEach(b => b.remove());
    say("カチャッ", 330, 90, { size: 52, color: "#fff", ms: 900 });
    anim(pf, [{ transform: "scale(1.15)" }, { transform: "scale(1)" }], 160);
    await wait(900);
    // 壁へ
    const tx = 560 + 6 + wall.slotX - 170, ty = 60 + 6 + 50 - 108;
    anim(un, [{ transform: "none" }, { transform: "translate(470px,-190px)" }], 1000);
    await anim(pf, [{ transform: "scale(1)" }, { transform: `translate(${tx}px,${ty - 40}px) scale(.45)`, offset: .6 }, { transform: `translate(${tx}px,${ty}px) scale(.455)` }], 1000);
    anim(pf, [{ transform: `translate(${tx}px,${ty}px) scale(.455) rotate(0)` }, { transform: `translate(${tx}px,${ty}px) scale(.455) rotate(7deg)` }, { transform: `translate(${tx}px,${ty}px) scale(.455) rotate(-5deg)` }, { transform: `translate(${tx}px,${ty}px) scale(.455) rotate(0)` }], 700);
    await wait(500);
    // ハムの嘆き
    const arm = ov(h, `<path d="M180 900Q-120 860 -300 560" fill=none stroke=${INK} stroke-width=96 stroke-linecap=round /><path d="M180 900Q-120 860 -300 560" fill=none stroke=#fbf5e9 stroke-width=66 stroke-linecap=round />`);
    ov(h, frown); anim(h, [{ transform: "none" }, { transform: "rotate(-6deg)" }], 300);
    say("それじゃない!!", 480, 330, { size: 56, color: "#ff6a5a", ms: 1800 });
    await wait(2300);
  },

  // ------------------------------------------------------------------ 通夜で肩が震える
  async i_T29_06() {
    await wait(400); chip("試合に敗北した");
    const hall = layer("z-index:9;background:#2c2733;opacity:0");
    add(`<div></div>`, `left:0;top:0;width:960px;height:62px;background:repeating-linear-gradient(90deg,#111 0 60px,#f4f4f4 60px 120px);border-bottom:5px solid ${INK}`, hall);
    add(`<div></div>`, `left:0;top:380px;width:960px;height:160px;background:#6b5a3e`, hall);
    add(`<div></div>`, `left:190px;top:300px;width:460px;height:50px;background:#e8dcc0;border:5px solid ${INK}`, hall);
    add(`<div></div>`, `left:240px;top:255px;width:360px;height:50px;background:#d6c590;border:5px solid ${INK}`, hall);
    // 花
    const flw = (cx, cy) => { for (let i = 0; i < 6; i++) add(`<div></div>`, `left:${cx + (i % 3) * 30 - 30}px;top:${cy + Math.floor(i / 3) * 28 - (i % 3 === 1 ? 14 : 0)}px;width:40px;height:40px;border-radius:50%;background:#fff;border:4px solid ${INK};box-shadow:inset 0 0 0 8px #fff5a8`, hall); };
    flw(255, 195); flw(570, 195);
    for (const x of [262, 590]) { add(`<div></div>`, `left:${x}px;top:225px;width:16px;height:34px;background:#fff;border:3px solid ${INK}`, hall); add(`<div></div>`, `left:${x + 1}px;top:205px;width:12px;height:22px;border-radius:50% 50% 50% 50%/65% 65% 35% 35%;background:#ffb23c`, hall); }
    const pt = add(`<div></div>`, `left:325px;top:82px;width:160px;height:200px;background:#d9d2c0;border:12px solid #111;outline:3px solid #666;overflow:hidden`, hall);
    const ph = q6hm(N, 8, 36, 124, "", pt); ov(ph, whiteEyes + openMouth + `<path d="M560 700q-14 90 14 150q34-60 12-150" fill=#cfeaff stroke=${INK} stroke-width=8 />`);
    add(`<div></div>`, "left:-4px;top:-4px;width:50px;height:50px;background:#111;clip-path:polygon(0 0,100% 0,0 100%)", pt);
    add(`<div></div>`, "right:-4px;top:-4px;width:50px;height:50px;background:#111;clip-path:polygon(0 0,100% 0,100% 100%)", pt);
    add(`<div>故 ハム 通夜</div>`, `left:60px;top:90px;width:70px;height:250px;background:#fff;border:4px solid ${INK};color:#111;writing-mode:vertical-rl;font-size:28px;text-align:center;line-height:60px;padding-top:6px`, hall);
    add(`<div></div>`, `left:400px;top:352px;width:100px;height:36px;border-radius:0 0 50px 50px;background:#444;border:5px solid ${INK};z-index:2`, hall); // 香炉
    await anim(hall, [{ opacity: 0 }, { opacity: 1 }], 500);
    // 参列者
    const mo = [];
    for (let i = 0; i < 5; i++) { const z = zari(30 + i * 92, 410, 90, { face: "smile", color: "#555", dark: "#333", acc: i % 2 ? "glasses" : undefined, z: 12 }); z.style.opacity = 0; mo.push(z); anim(z, [{ opacity: 0, transform: "translateY(30px)" }, { opacity: 1, transform: "none" }], 300, { delay: i * 150 }); }
    const sj = zari(650, 250, 125, { face: "smile", z: 12, color: "#e8553b", extra: `<path d="M34 96Q60 106 86 96L92 126H28Z" fill=#d9a21b stroke=${INK} stroke-width=3 /><path d="M30 94Q60 108 90 94" fill=none stroke=#6a3a8a stroke-width=5 />` });
    anim(sj, [{ opacity: 0 }, { opacity: 1 }], 300);
    await wait(1400);
    say("ポクポクポク…", 480, 345, { size: 44, color: "#fff", ms: 1500 }); await wait(1900);
    say("(…ぷるぷる)", 190, 395, { size: 30, color: "#ffd23c", ms: 3300 });
    const sh = mo.map((z, i) => z.animate([{ transform: "translate(0,0)" }, { transform: "translate(3px,-5px)" }, { transform: "translate(-3px,0)" }], { duration: 120 + i * 17, iterations: Infinity }));
    await wait(1800);
    const bb = bubble("ゴホン!!", 720, 190, 1300); anim(sj, [{ transform: "none" }, { transform: "translateY(-12px)" }, { transform: "none" }], 300);
    await wait(1500);
    // 焼香
    const ins = add(`<div></div>`, `left:700px;top:330px;width:210px;height:200px;border-radius:50%;border:6px solid #fff;background:#8a6a40;overflow:hidden;z-index:40`);
    pop(ins, 240);
    label("焼香", "left:730px;top:300px;z-index:41");
    const fg = add(`<svg viewBox="0 0 200 200" style="left:0;top:0;width:100%;height:100%"><path d="M40 20Q60 80 80 110" stroke=${INK} stroke-width=34 fill=none stroke-linecap=round /><path d="M40 20Q60 80 80 110" stroke=#e8553b stroke-width=22 fill=none stroke-linecap=round /><path d="M80 112L66 150Q60 164 76 162L102 130Z" fill=#e8553b stroke=${INK} stroke-width=6 stroke-linejoin=round /><path d="M80 112L112 120L106 150Q112 164 98 162" fill=#e8553b stroke=${INK} stroke-width=6 stroke-linejoin=round /></svg>`, "left:40px;top:0;width:150px;height:150px", ins);
    add(`<div></div>`, "left:50px;top:156px;width:110px;height:50px;border-radius:50%;background:#444;border:5px solid #111", ins);
    const fs = fg.animate([{ transform: "translate(0,0)" }, { transform: "translate(5px,-4px)" }, { transform: "translate(-4px,2px)" }], { duration: 70, iterations: Infinity });
    for (let i = 0; i < 14; i++) { const a = add(`<div></div>`, `left:${96 + rnd(-6, 12)}px;top:100px;width:6px;height:6px;border-radius:50%;background:#ccc`, ins); anim(a, [{ transform: "none", opacity: 1 }, { transform: `translate(${rnd(-14, 14)}px,60px)`, opacity: 0 }], 700, { delay: i * 110 }); }
    say("プルプル…", 800, 270, { size: 34, color: "#fff", ms: 1400 });
    await wait(1800); fs.cancel(); sh.forEach(a => a.cancel());
    await anim(hall, [{ opacity: 1 }, { opacity: 0 }], 400); [hall, ins, ...mo, sj].forEach(e => e.remove()); document.querySelectorAll("#s .lab").forEach(e => e.remove());
    const h = ham(N); ov(h, frown); say("笑うな…", 600, 260, { size: 50, color: "#ffd23c", ms: 1500 }); anim(h, [{ transform: "translateY(20px)" }, { transform: "none" }], 300);
    await wait(1800);
  },

  // ------------------------------------------------------------------ 指が7本
  async i_T30_04() {
    const h = ham(N);
    await wait(700); chip("ウルトを発動した");
    const fl = add(`<div></div>`, "left:0;top:0;width:960px;height:540px;background:#fff;z-index:24"); anim(fl, [{ opacity: .85 }, { opacity: 0 }], 260).then(() => fl.remove());
    say("背後霊 召喚!!", 480, 120, { size: 58, color: "#cfe0ff", ms: 1300 });
    const pos = [[560, 230, 130], [640, 150, 110], [740, 120, 110], [850, 170, 100], [470, 320, 120], [560, 360, 110], [420, 190, 90], [900, 110, 80]];
    pos.forEach(([x, y, w], i) => { const g = q6hm(N, x, y, w, "filter:grayscale(1) brightness(1.7);opacity:.6;z-index:9"); pop(g, 260 + i * 40); g.animate([{ transform: "translateY(0)" }, { transform: "translateY(-8px)" }], { duration: 700 + i * 60, iterations: Infinity, direction: "alternate" }); });
    await wait(1400);
    const ch = q6chat(14, 70, 340, ["AI生成乙", "合成だろこれ", "指が7本ある"]);
    for (let i = 0; i < 3; i++) { await wait(380); ch.show(i); }
    await wait(500); say("え?", 560, 80, { size: 70, color: "#ff5a4a", ms: 800 }); hop(h, 30); await wait(900);
    const dk = layer("z-index:33;background:#000c"); pop(dk, 200);
    const hand = n => { let f = "", tx = ""; for (let i = 0; i < n; i++) { const a = n === 1 ? 0 : -72 + 144 * i / (n - 1), r = a * Math.PI / 180;
      f += `<g transform="rotate(${a} 200 240)" data-i=${i}><rect x=186 y=64 width=28 height=170 rx=14 fill=#fbf5e9 stroke=${INK} stroke-width=6 /></g>`;
      tx += `<text id=n${i} x=${200 + Math.sin(r) * 190} y=${240 - Math.cos(r) * 190 + 10} text-anchor=middle font-size=34 font-weight=900 fill=#ffd23c stroke=#3a0a00 stroke-width=6 paint-order=stroke opacity=0>${i + 1}</text>`; }
      return `<svg viewBox="0 0 400 320" style="left:0;top:0;width:100%;height:100%;overflow:visible">${f}<ellipse cx=200 cy=262 rx=108 ry=66 fill=#fbf5e9 stroke=${INK} stroke-width=7 />${tx}</svg>`; };
    const hw = add(`<div></div>`, "left:250px;top:110px;width:460px;height:368px;z-index:35");
    const lb = add(`<div class=lab>自分の手を数える</div>`, "left:380px;top:70px;z-index:36;font-size:28px");
    const passes = [[7, 270, "1…2…3…4…5…6…7本!?"], [8, 170, "もう1回…8本!?"], [10, 110, "…10本!?"], [12, 80, "増えてる!!"]];
    for (const [n, ms, msg] of passes) {
      hw.innerHTML = hand(n); lb.textContent = msg;
      for (let i = 0; i < n; i++) { const g = hw.querySelector(`[data-i="${i}"] rect`), tt = hw.querySelector(`#n${i}`); g.setAttribute("fill", "#ffd23c"); tt.setAttribute("opacity", 1); await wait(ms); g.setAttribute("fill", "#fbf5e9"); }
      await wait(i => 0 || 250);
    }
    hw.animate([{ transform: "rotate(-3deg)" }, { transform: "rotate(3deg)" }], { duration: 80, iterations: 12 });
    await wait(1000);
    await anim(dk, [{ opacity: 1 }, { opacity: 0 }], 250); dk.remove(); hw.remove(); lb.remove();
    ov(h, whiteEyes + openMouth); shake(h); bubble("数えるたびに増える…", 640, 215, 2000);
    await wait(2400);
  },

  // ------------------------------------------------------------------ お祓いが効いた
  async i_T30_08() {
    const h = ham(N); h.style.opacity = 0;
    const gs = "grayscale(.7) brightness(1.6) hue-rotate(170deg)";
    await wait(600); chip("チャネポで「お祓い」を交換");
    h.img.style.filter = gs; ov(h, frown + tears);
    const fire = [[-40, 60], [210, 30]].map(([dx, dy]) => { const f = add(`<svg viewBox="0 0 40 60" style="left:${HX + dx}px;top:${HY + dy}px;width:40px;height:60px;z-index:11"><path d="M20 2C34 22 38 38 20 56C2 38 6 22 20 2Z" fill=#7cd0ff stroke=#fff stroke-width=3 /></svg>`); f.animate([{ transform: "translateY(0) scale(1)" }, { transform: "translateY(-10px) scale(.85)" }], { duration: 400, iterations: Infinity, direction: "alternate" }); return f; });
    fire.forEach(f => f.style.opacity = 0);
    const wob = h.animate([{ transform: "translate(0,0)" }, { transform: "translate(0,-14px)" }], { duration: 900, iterations: Infinity, direction: "alternate", easing: "ease-in-out" });
    await anim(h, [{ opacity: 0 }, { opacity: .85 }], 700); fire.forEach(f => f.style.opacity = 1); h.style.opacity = .85;
    say("うらめしや〜", 560, 240, { size: 50, color: "#cfe0ff", ms: 1500 });
    const ch = q6chat(14, 70, 360, ["よくできてるw", "CGすごい", "消える演出うまいw"]);
    await wait(900); ch.show(0); await wait(500); ch.show(1); await wait(800);
    const pr = zari(-160, 300, 130, { face: "smile", color: "#e8553b", z: 14, extra: `<path d="M42 20L46 -10H74L78 20Z" fill=#222 stroke=${INK} stroke-width=3 /><path d="M108 24V84" stroke=#a0702a stroke-width=5 stroke-linecap=round /><path d="M108 20l16 6l-16 7l16 7l-16 7" fill=none stroke=#fff stroke-width=4 />` });
    await anim(pr, [{ transform: "none" }, { transform: "translateX(480px)" }], 800);
    chip("お祓い");
    say("お祓い!!", 440, 180, { size: 56, color: "#fff", ms: 1100 });
    const sgn = note("ほんとに消える…", `left:470px;top:380px;font-size:26px;z-index:25`); sgn.style.opacity = 0;
    const stk = add(`<div></div>`, `left:640px;top:416px;width:8px;height:56px;background:#a0702a;border:3px solid ${INK};z-index:24`); stk.style.opacity = 0;
    ov(h, `<path d="M180 900Q-100 960 -230 800" fill=none stroke=${INK} stroke-width=96 stroke-linecap=round /><path d="M180 900Q-100 960 -230 800" fill=none stroke=#fbf5e9 stroke-width=66 stroke-linecap=round />`);
    const waves = [.55, .3, .1];
    for (let w = 0; w < 3; w++) {
      for (let k = 0; k < 9; k++) { const sd = seed(560, 330, 22, 20); const tx = HX + 40 + rnd(0, 150), ty = HY + rnd(20, 160);
        anim(sd, [{ transform: "translate(0,0) rotate(0)" }, { transform: `translate(${(tx - 560) / 2}px,${ty - 330 - 90}px) rotate(300deg)`, offset: .5 }, { transform: `translate(${tx - 560}px,${ty - 330}px) rotate(700deg)`, opacity: 0 }], 650, { delay: k * 70 }).then(() => sd.remove()); }
      await wait(750);
      anim(h, [{ opacity: h.style.opacity }, { opacity: waves[w] }], 500); h.style.opacity = waves[w]; fire.forEach(f => f.style.opacity = waves[w] * 1.2);
      if (w === 1) { ch.show(2); sgn.style.opacity = 1; stk.style.opacity = 1; pop(sgn, 250); }
      if (w === 0) { say("消えかかってる…", 600, 100, { size: 34, color: "#cfe0ff", ms: 1000 }); }
      await wait(900);
    }
    [sgn, stk].forEach(e => e.animate([{ transform: "translateX(-3px)" }, { transform: "translateX(3px)" }], { duration: 90, iterations: 20 }));
    say("本物なのに…", 480, 140, { size: 44, color: "#cfe0ff", ms: 1800 });
    await wait(2200); wob.cancel();
  },

  // ------------------------------------------------------------------ 連鎖の頂点のはず
  async i_T31_01() {
    const bd = layer("z-index:8;background:radial-gradient(#245a38,#12301e);");
    const D = add(`<div></div>`, "left:0;top:0;width:960px;height:540px;z-index:9;transform-origin:480px 500px");
    await wait(400); chip("敵を1キルしたとき");
    label("食物連鎖図", "right:16px;top:16px;font-size:30px;z-index:20");
    const plate = (cx, cy, r, lbl) => { add(`<div></div>`, `left:${cx - r}px;top:${cy - r}px;width:${r * 2}px;height:${r * 2}px;border-radius:50%;background:#ffffff22;border:8px dashed #ffffffaa`, D);
      add(`<div class=t style="left:${cx}px;top:${cy + r + 34}px;translate:-50% -50%;font-size:46px;color:#fff">${lbl}</div>`, "", D); };
    plate(150, 300, 105, "敵"); plate(640, 300, 140, "ハム");
    const en = zari(90, 235, 120, { face: "angry", parent: D, color: "#4aa3d8", dark: "#2d78a8", acc: "helmet" });
    const hm = q6hm(N, 540, 190, 200, "z-index:10", D);
    q6arc(240, 190, 400, 120, 470, 235, "#ffd23c", 12); s.lastChild.remove(); // (予備)
    const ar = add(`<svg viewBox="0 0 960 540" style="left:0;top:0;width:960px;height:540px;overflow:visible"><path d="M260 300H420" stroke=${INK} stroke-width=40 stroke-linecap=round /><path d="M260 300H420" stroke=#ffd23c stroke-width=26 stroke-linecap=round /><path d="M400 262L470 300L400 338Z" fill=#ffd23c stroke=${INK} stroke-width=8 stroke-linejoin=round /></svg>`, "", D);
    add(`<div class=t style="left:350px;top:236px;translate:-50% -50%;font-size:34px;color:#ffd23c">ごちそう</div>`, "", D);
    pop(hm, 300); await wait(900);
    chip("敵を1キル"); en.remove();
    const food = add(`<div></div>`, "left:0;top:0;width:100px;height:90px;z-index:12", D);
    add(`<div></div>`, "left:0;top:56px;width:100px;height:30px;border-radius:50%;background:#e8e8f0;border:5px solid #888", food);
    zari(22, 8, 60, { parent: food, face: "sad", color: "#9aa", dark: "#788", z: 1 });
    await anim(food, [{ transform: "translate(120px,235px)" }, { transform: "translate(380px,210px)", offset: .5 }, { transform: "translate(590px,262px) scale(.4)", opacity: .9 }], 1200, { easing: "ease-in-out" });
    food.remove();
    const mo = ov(hm, openMouth); say("ぱくっ", 560, 150, { size: 54, ms: 800 }); anim(hm, [{ transform: "scale(1)" }, { transform: "scale(1.12,.92)" }, { transform: "scale(1)" }], 400);
    await wait(500); mo.remove();
    const cr = add(`<div>👑</div>`, "left:600px;top:60px;font-size:110px;z-index:15", D);
    await anim(cr, [{ transform: "translateY(-300px)" }, { transform: "translateY(20px)" }, { transform: "none" }], 500, { easing: "ease-in" });
    say("頂点!!", 640, 100, { size: 60, ms: 900 }); for (let i = 0; i < 6; i++) flash(520, 800, 120, 380);
    await wait(1800);
    // 最上段の巨大ザリガニ
    const sil = add(`<div style="filter:brightness(0)">${zariSvg({ face: "evil" })}</div>`, "left:180px;top:-780px;width:600px;height:660px;opacity:0;z-index:5", D);
    const eyes = add(`<svg viewBox="0 0 120 132" style="left:0;top:0;width:100%;height:100%"><circle cx=47 cy=35 r=6 fill=#fff /><circle cx=73 cy=35 r=6 fill=#fff /><path d="M50 83Q60 92 70 83" fill=none stroke=#fff stroke-width=3 /></svg>`, "left:180px;top:-780px;width:600px;height:660px;opacity:0;z-index:6", D);
    const ar2 = add(`<svg viewBox="0 0 960 540" style="left:0;top:0;width:960px;height:540px;overflow:visible"><path d="M640 -90V120" stroke=${INK} stroke-width=70 stroke-linecap=round /><path d="M640 -90V120" stroke=#ff5a4a stroke-width=48 stroke-linecap=round /><path d="M580 100L640 190L700 100Z" fill=#ff5a4a stroke=${INK} stroke-width=14 stroke-linejoin=round /></svg>`, "opacity:0", D);
    const yt = add(`<div class=t style="left:790px;top:20px;translate:-50% -50%;font-size:96px;color:#fff">予定</div>`, "opacity:0", D);
    chip("ズームアウト");
    anim(D, [{ transform: "none" }, { transform: "scale(.4)" }], 1400, { easing: "ease-in-out" });
    await wait(900); [sil, eyes, ar2, yt].forEach(e => anim(e, [{ opacity: 0 }, { opacity: 1 }], 500));
    await wait(700);
    say("💦", 580, 400, { size: 44, ms: 0 }); say("ハムは通過点", 230, 250, { size: 40, color: "#fff", ms: 0 });
    await wait(2600);
  },

  // ------------------------------------------------------------------ 胴上げが食卓
  async i_T31_05() {
    const h = ham(N); h.style.transform = "translateX(-250px)"; h.style.zIndex = 10;
    const zs = []; const xs = [440, 525, 610, 695, 780];
    xs.forEach((x, i) => { const z = zari(x, 440, 80, { face: "smile", z: 11, color: q6cols[i % 5][0], dark: q6cols[i % 5][1] }); zs.push(z); });
    await wait(500); chip("試合に勝利したとき");
    say("勝利!!", 480, 100, { size: 64, ms: 1000 }); rain(18);
    await wait(1300); chip("胴上げ");
    const up = async (dy, ms, n) => { say(n, 700, 80, { size: 46, ms: ms }); zs.forEach(z => anim(z, [{ transform: "none" }, { transform: "translateY(-14px)" }, { transform: "none" }], ms)); 
      await anim(h, [{ transform: "translateX(-250px)" }, { transform: `translateX(-250px) translateY(${dy}px)`, offset: .5 }, { transform: "translateX(-250px)" }], ms, { easing: "ease-in-out" }); };
    await up(-120, 650, "わっしょい!"); await up(-200, 750, "わっしょい!!");
    // 弧に変わる
    chip("さらに高く");
    const arc = q6arc(560, 330, 420, -30, 280, 410, "#ffd23c", 10);
    label("捕食", "left:380px;top:80px;font-size:34px;z-index:30");
    const plate = add(`<div></div>`, "left:100px;top:455px;width:330px;height:70px;border-radius:50%;background:#f2f2f6;border:7px solid #8a8a9a;box-shadow:inset 0 -10px 0 #c8c8d4;z-index:5");
    pop(plate, 250);
    await wait(500);
    anim(h, [{ transform: "translateX(-250px)" }, { transform: "translate(-400px,-240px) rotate(-180deg) scale(.9)", offset: .5 }, { transform: "translate(-560px,-10px) rotate(-360deg) scale(.55)" }], 1100, { easing: "ease-in-out" });
    await wait(1200); for (let i = 0; i < 6; i++) crumb(260, 480);
    arc.remove(); document.querySelectorAll("#s .lab").forEach(e => e.remove());
    say("ストン", 300, 360, { size: 40, ms: 700 });
    // 全員ナプキン
    zs.forEach((z, i) => { z.remove(); });
    const tg = [[40, 400], [120, 420], [390, 410], [470, 420], [250, 340]];
    tg.forEach(([x, y], i) => { const z = zari(x, y, 90, { face: "evil", z: 12, color: q6cols[i % 5][0], dark: q6cols[i % 5][1], extra: `<path d="M38 92L82 92L78 116L42 116Z" fill=#fff stroke=${INK} stroke-width=3 /><path d="M44 100H76M46 108H74" stroke=#cde stroke-width=2 /><path d="M100 70V30M96 30V44M104 30V44" stroke=#888 stroke-width=3 />` });
      anim(z, [{ transform: "translateX(120px) translateY(-20px)", opacity: 0 }, { transform: "none", opacity: 1 }], 400, { delay: i * 70 }); });
    chip("全員着席");
    await wait(600); say("いただきます", 480, 220, { size: 70, color: "#ffd23c", ms: 2200 });
    await wait(2800);
  },

  // ------------------------------------------------------------------ 宿主がどんどん縮む
  async i_T32_03() {
    const pg = layer("z-index:9;background:#efe4c4");
    add(`<div></div>`, "left:478px;top:0;width:4px;height:540px;background:#00000033", pg);
    add(`<div>いきもの図鑑　No.7　ハム</div>`, `left:30px;top:56px;font-size:32px;color:${INK};font-weight:900`, pg);
    add(`<div>〔共生？〕 ほぼ共生。たぶん共生。</div>`, `left:30px;top:100px;font-size:22px;color:#6b4522`, pg);
    const pond = add(`<div></div>`, `left:30px;top:138px;width:420px;height:380px;background:linear-gradient(#8fd0f0,#3f8ec0);border:6px solid ${INK};border-radius:14px;overflow:hidden`, pg);
    add(`<div>宿主の変遷</div>`, `left:510px;top:44px;font-size:36px;color:${INK};font-weight:900`, pg);
    const rows = [["ザリガニ", "乗り心地 ◎"], ["小ザリガニ", "やや狭い"], ["エビ", "ぎゅうぎゅう"], ["ミジンコ", "もう無理"]];
    const rEls = rows.map(([a, b], i) => { const r = add(`<div></div>`, `left:500px;top:${110 + i * 92}px;width:440px;height:80px;border-bottom:3px dashed #a98;opacity:0`, pg);
      add(`<div>${i + 1}.</div>`, `left:10px;top:18px;font-size:36px;color:#a98`, r); add(`<div>${a}</div>`, `left:60px;top:8px;font-size:38px;color:${INK};font-weight:900`, r); add(`<div>${b}</div>`, `left:62px;top:50px;font-size:20px;color:#7a5a30`, r); return r; });
    const wf = `<svg viewBox="0 0 120 100" style="left:0;top:0;width:100%;height:100%"><path d="M30 20Q60 -4 90 20" fill=none stroke=${INK} stroke-width=4 /><ellipse cx=60 cy=62 rx=46 ry=30 fill=#cfa070 stroke=${INK} stroke-width=5 /><circle cx=88 cy=54 r=7 fill=#fff stroke=${INK} stroke-width=3 /><circle cx=89 cy=54 r=3 fill=${INK} /><path d="M34 62Q60 50 82 66" fill=none stroke=#a07848 stroke-width=3 /></svg>`;
    const shrimp = `<svg viewBox="0 0 120 80" style="left:0;top:0;width:100%;height:100%"><path d="M16 40Q30 6 74 14Q110 24 104 56Q92 38 70 42Q60 62 34 60Q18 58 16 40Z" fill=#f09a78 stroke=${INK} stroke-width=5 stroke-linejoin=round /><circle cx=92 cy=26 r=5 fill=${INK} /><path d="M104 22Q118 6 116 -4M100 20Q112 0 104 -8" fill=none stroke=${INK} stroke-width=3 /><path d="M16 40L2 30M16 40L2 52" stroke=${INK} stroke-width=5 /></svg>`;
    // 宿主 [html, x, y, w, h]
    const hosts = [() => zari(120, 130, 200, { parent: pond, face: "smile", z: 3 }), () => zari(150, 205, 130, { parent: pond, face: "sad", color: "#ee7a64", dark: "#c0503c", z: 3 }),
      () => add(`<div>${shrimp}</div>`, "left:150px;top:265px;width:120px;height:80px;z-index:3", pond), () => add(`<div>${wf}</div>`, "left:150px;top:300px;width:80px;height:66px;z-index:3", pond)];
    const hy = [[330 - 150, 150 + 200 * 1.1 - 110 - 20, 150], [0, 0, 0], [0, 0, 0], [0, 0, 0]];
    const hamAt = [[72, 28, 160], [112, 120, 130], [140, 170, 115], [155, 212, 90]];
    await wait(500); chip("連続デス ×3");
    let hs = hosts[0](); const hmm = q6hm(N, ...hamAt[0], "z-index:4", pond); hmm.style.left = hamAt[0][0] + "px";
    await wait(300); anim(rEls[0], [{ opacity: 0 }, { opacity: 1 }], 300); hop(hmm, 20);
    say("これは共生です", 240, 190, { size: 34, ms: 1200 }); await wait(1500);
    for (let i = 1; i < 4; i++) {
      chip(`連続デス ×${i}`.replace(/×\d/, `×${i + 0}`)); chip("宿主を乗り換えた");
      anim(hs, [{ opacity: 1 }, { opacity: 0, transform: "scale(.6)" }], 300); await wait(250);
      hs.remove(); hs = hosts[i](); anim(hs, [{ opacity: 0 }, { opacity: 1 }], 250);
      const [x, y, w] = hamAt[i]; hop(hmm, 24);
      hmm.style.transition = "all .3s"; hmm.style.left = x + "px"; hmm.style.top = y + "px"; hmm.style.width = w + "px"; hmm.style.height = w * 1271 / 1237 + "px";
      await wait(400); anim(rEls[i], [{ opacity: 0 }, { opacity: 1 }], 300);
      say(["", "ちょっと狭い…", "ぎゅうぎゅう…", "ぷかぷか…"][i], 240, 170, { size: 30, ms: 900 }); await wait(1300);
    }
    // 沈む
    const grp = [hs, hmm];
    grp.forEach(e => anim(e, [{ transform: "none" }, { transform: "translateY(80px)" }], 1800, { easing: "ease-in" }));
    for (let i = 0; i < 6; i++) { const b = add(`<div></div>`, `left:${190 + rnd(-30, 50)}px;top:${330}px;width:${rnd(10, 22)}px;height:${rnd(10, 22)}px;border-radius:50%;border:3px solid #fff;z-index:6`, pond); anim(b, [{ transform: "none", opacity: 1 }, { transform: `translateY(${-rnd(120, 260)}px)`, opacity: 0 }], 1400, { delay: i * 220 }); }
    const bb = add(`<div class=bub>共生です</div>`, "left:230px;top:170px;z-index:30;font-size:26px"); pop(bb, 200);
    await wait(2400);
  },

});
}

{
const q7ham = (h, on) => { // 倒れた絵と戻し
  if (on) { h._ov = ov(h, whiteEyes + openMouth); h.img.style.filter = "grayscale(.8) brightness(.9)"; anim(h, [{ transform: "none" }, { transform: "rotate(-80deg) translate(40px,40px)" }], 260); }
  else { h._ov && h._ov.remove(); h.img.style.filter = "none"; anim(h, [{ transform: "rotate(-80deg) translate(40px,40px)" }, { transform: "none" }], 240); }
};
const q7net = (cx, cy, r) => add(`<svg viewBox="-150 -150 300 300" style="left:${cx - r}px;top:${cy - r}px;width:${r * 2}px;height:${r * 2}px;overflow:visible"><circle r=140 fill="#e8e0b844" stroke=#8a5a2a stroke-width=12 />${[-100, -50, 0, 50, 100].map(v => `<path d="M${v} -98V98M-98 ${v}H98" stroke=#8a5a2a99 stroke-width=4 />`).join("")}<path d="M60 -130L220 -330" stroke=#8a5a2a stroke-width=14 stroke-linecap=round /></svg>`, "z-index:30");
const q7bill = (x, y) => add(`<div>¥</div>`, `left:${x}px;top:${y}px;width:64px;height:30px;background:#9fd89a;border:3px solid ${INK};color:#2a6a2a;font-size:20px;line-height:24px;text-align:center;z-index:22`);

Object.assign(scenes, {
  async i_T33_05() { // ご先祖さま全員
    const h = ham(R1); await wait(500); chip("試合に勝利"); say("勝利!!", 480, 70, { size: 60, ms: 1000 }); rain(14);
    const bd = add(`<div></div>`, `left:24px;top:110px;width:672px;height:380px;background:#6a4528;border:6px solid ${INK};border-radius:14px;z-index:6`); pop(bd);
    add(`<div class=lab>ハム家　家系図</div>`, "left:200px;top:12px;font-size:28px", bd);
    add(`<svg viewBox="0 0 640 40" style="left:20px;top:190px;width:640px;height:40px"><path d="M10 20H630" stroke=${INK} stroke-width=6 /></svg>`, "", bd);
    const fr = [["初代", "crown"], ["ひいじいちゃん", "glasses"], ["じいちゃん", "tie"], ["とうさん", "chef"]].map(([n, acc], i) => {
      const f = add(`<div></div>`, `left:${22 + i * 160}px;top:60px;width:138px;height:210px;background:#d9b87a;border:6px solid #b8860b;outline:3px solid ${INK};overflow:hidden`, bd);
      zari(14, 16, 110, { acc, face: "smile", z: 2, parent: f }).style.filter = "sepia(.35) saturate(1.3)";
      const cur = add(`<div>?</div>`, `left:0;top:0;width:100%;height:100%;background:#7a1f2a;color:#fc3;font-size:80px;text-align:center;line-height:210px;z-index:5`, f);
      add(`<div class=lab>${n}</div>`, `left:${22 + i * 160}px;top:282px;font-size:19px;background:#000b`, bd);
      f.cur = cur; return f; });
    add(`<div class=t>→ ハム</div>`, "left:640px;top:310px;font-size:30px;color:#fff;z-index:8");
    await wait(700);
    for (let i = 0; i < 4; i++) { await anim(fr[i].cur, [{ transform: "none" }, { transform: "translateY(-100%)" }], 380); await wait(i < 3 ? 380 : 150);
      if (i === 1) { h.img.style.filter = "brightness(1.1)"; }
      if (i === 2) { say("…ん?", 600, 250, { size: 40, color: "#fff", ms: 600 }); } }
    const e = ov(h, whiteEyes + openMouth); h.classList.add("trem"); say("えっ", 600, 230, { size: 72, color: "#ff5a4a", ms: 1500 });
    await wait(900); chip("ご先祖さまが拍手");
    fr.forEach((f, i) => { const zz = f.querySelector("div"); });
    const cl = add(`<div class=t>カチカチカチカチ</div>`, "left:360px;top:60px;translate:-50% 0;font-size:44px;color:#fff;z-index:30");
    anim(cl, [{ transform: "scale(.8) rotate(-4deg)" }, { transform: "scale(1.15) rotate(4deg)" }], 150, { iterations: 12, direction: "alternate" });
    fr.forEach((f, i) => anim(f, [{ transform: "none" }, { transform: "translateY(-8px) rotate(2deg)" }], 140, { iterations: 14, direction: "alternate", delay: i * 30 }));
    await wait(1700); label("全員、ハサミの音。", "left:310px;top:496px;translate:-50% 0;font-size:26px;z-index:30"); await wait(1500);
  },

  async i_T33_10() { // 脱皮して帰宅
    const h = ham(N), zs = [0, 1, 2, 3].map(i => zari(24 + i * 92, 400 - (i % 2) * 28, 82, { face: "smile", z: 12, acc: [null, "tie", null, "glasses"][i] }));
    await wait(600); chip("配信終了"); const b = bubble("本日はここまで!<br>ご視聴ありがと", 600, 215, 0);
    await wait(1300);
    const cr = ov(h, `<path d="M600 30L560 130L640 200L575 290L620 360" fill=none stroke=#fff stroke-width=26 stroke-linecap=round stroke-linejoin=round /><path d="M600 30L560 130L640 200L575 290L620 360" fill=none stroke=${INK} stroke-width=12 stroke-linecap=round stroke-linejoin=round />`);
    b.innerHTML = "本日はここまで!<br>ご視聴ありが…っ"; say("ぱかっ", 560, 150, { size: 54, color: "#fff", ms: 800 }); shake(h); await wait(600);
    b.remove(); cr.remove();
    const sh = zari(HX - 16, HY - 16, 256, { color: "#e04a30", face: "smile", z: 9, extra: `<path d="M60 52V110" stroke=${INK} stroke-width=3 stroke-dasharray="5 4" />` }); sh.style.filter = "saturate(.7) brightness(1.05)"; sh.style.opacity = 0;
    flash(HX, HX + HW, HY, HY + HH); anim(sh, [{ opacity: 0 }, { opacity: .95 }], 200);
    await anim(h, [{ transform: "none" }, { transform: "translateY(-80px)", offset: .4 }, { transform: "translate(0,0)" }], 420);
    label("抜け殻", `left:${HX + 90}px;top:${HY - 24}px;z-index:20`); say("おつかれ〜", 600, 250, { size: 40, color: "#fff", ms: 900 });
    await walk(h, 0, 330, 1100, 5); h.style.display = "none"; chip("ハムは帰宅");
    zs.forEach((z, i) => { anim(z, [{ transform: "none" }, { transform: "translateY(-18px)" }], 170, { iterations: 14, direction: "alternate", delay: i * 40 }); });
    bubble("お疲れさまでした〜", 190, 330, 1800); bubble("お疲れさまでした〜", 330, 280, 1800);
    const cl = add(`<div class=t>カチカチカチ</div>`, "left:240px;top:210px;translate:-50% 0;font-size:34px;color:#fff;z-index:30"); await wait(2200); cl.remove(); await wait(900);
  },

  async i_T34_05() { // 旗が場所をとる
    const h = ham(R1), cx = HX + HW / 2;
    const land = add(`<div></div>`, `left:${cx - 62}px;top:${HY + HH - 24}px;width:124px;height:36px;border-radius:50%;background:#7aa04a;border:4px solid ${INK};z-index:3`);
    const lb = label("ハムの縄張り 足の裏ぶん", `left:${HX - 215}px;top:${HY + HH - 30}px;font-size:20px`);
    await wait(900); chip("拠点を占拠して勝利"); hop(h, 30); say("占拠完了!", 480, 150, { size: 56, ms: 900 });
    await wait(700);
    const pole = add(`<div></div>`, `left:${cx - 7}px;top:48px;width:14px;height:${HY + HH - 48}px;background:linear-gradient(90deg,#fff,#aab);border:3px solid ${INK};z-index:9`);
    const flag = add(`<div>占拠</div>`, `left:${cx - 128}px;top:56px;width:120px;height:70px;background:#ffd23c;border:4px solid ${INK};color:${INK};font-size:34px;line-height:62px;text-align:center;z-index:9;transform-origin:100% 50%`);
    const base = add(`<div>旗の根元</div>`, `left:${cx - 100}px;top:${HY + HH - 44}px;width:200px;height:56px;background:#8a8f98;border:4px solid ${INK};border-radius:10px 10px 4px 4px;font-size:20px;line-height:48px;text-align:center;z-index:8`);
    const all = [pole, flag, base]; anim(flag, [{ transform: "skewY(-6deg)" }, { transform: "skewY(6deg)" }], 300, { iterations: 12, direction: "alternate" });
    await Promise.all(all.map(e => anim(e, [{ transform: e === flag ? "translateY(-600px)" : "translateY(-600px)" }, { transform: "none" }], 420, { easing: "cubic-bezier(.4,0,1,1)" })));
    shake(h); land.remove(); say("ドスン", 480, 300, { size: 50, color: "#fff", ms: 700 }); lb.textContent = "ハムの縄張り 0%"; await wait(700);
    const pw = [-17, 17].map(d => add(`<div></div>`, `left:${cx + d - 10}px;top:${HY + 118 - 60}px;width:20px;height:20px;border-radius:50%;background:#fbcbc3;border:3px solid ${INK};z-index:12`));
    anim(h, [{ transform: "none" }, { transform: "translateY(-60px)" }], 300); await wait(350);
    const pose = anim(h, [{ transform: "translateY(-60px) rotate(-5deg)" }, { transform: "translateY(-54px) rotate(5deg)" }], 400, { iterations: 6, direction: "alternate" });
    say("勝利ぃ〜!", 560, 160, { size: 52, ms: 1500, color: "#fff" }); rain(10); bubble("ぶら下がり中…", cx - 160, HY + 6, 2200);
    await wait(2800); label("土地はぜんぶ旗の根元", "left:480px;top:500px;translate:-50% 0;font-size:26px;z-index:30"); await wait(1500);
  },

  async i_T35_02() { // 外来種はこっち
    const h = ham(N), cx = HX + HW / 2, cy = HY + HH / 2 + 10, ins = zari(380, 330, 120, { acc: "tie", face: "smile", z: 14 });
    const tools = zari(110, 310, 100, { acc: "helmet", face: "angry", z: 14 });
    await wait(900); chip("相手の攻撃でデス"); q7ham(h, true); await wait(600);
    const net = q7net(cx, cy, 175); await anim(net, [{ transform: "translateY(-600px)" }, { transform: "none" }], 320, { easing: "ease-in" }); say("確保!", 500, 200, { size: 56, ms: 800 });
    q7ham(h, false); h.querySelector("svg") && 0; h._ov = null; h.img.style.filter = "none"; ov(h, whiteEyes.replace(/r=84/g, "r=84") + frown);
    anim(net, [{ transform: "none" }, { transform: "translateY(-30px)" }], 600, { iterations: 6, direction: "alternate" });
    const bills = [0, 1, 2].map(i => q7bill(380 + i * 4, 392 - i * 10)); bills.forEach(b => anim(b, [{ transform: "scale(.2)", opacity: 0 }, { transform: "none", opacity: 1 }], 220));
    say("¥報奨金¥", 400, 290, { size: 40, color: "#7dff8a", ms: 1000 });
    await wait(900); anim(ins, [{ transform: "none" }, { transform: "rotate(30deg) translateY(10px)", transformOrigin: "50% 100%" }, { transform: "none" }], 700);
    bubble("ご協力感謝いたします", 440, 258, 1700); await wait(1800);
    bubble("僕は駆除する側です!!", 640, 215, 1800); shake(h); await wait(1500);
    const pp = note("<b>個体確認</b>：ハム", "left:60px;top:90px;font-size:34px;padding:10px 20px"); pop(pp); await wait(500);
    stamp("外来種", 330, 240, 52); await wait(2200);
  },

  async i_T35_06() { // 帳簿が合わない
    const h = ham(R1); await wait(700); chip("試合に敗北");
    const pn = add(`<div></div>`, `left:30px;top:90px;width:530px;height:300px;background:#fff8e6;border:5px solid ${INK};border-radius:10px;color:#222;z-index:6`); pop(pn);
    add(`<div>会計帳簿</div>`, "left:20px;top:10px;font-size:30px;color:#222", pn);
    const row = (t, y, c) => { add(`<div>${t}</div>`, `left:24px;top:${y}px;font-size:34px;color:#222`, pn); return add(`<div class=t>0 ↑</div>`, `left:300px;top:${y}px;font-size:46px;color:${c}`, pn); };
    const a = row("駆除数", 80, "#2a8a3a"), b = row("池の在庫", 170, "#2a8a3a");
    add(`<div></div>`, "left:20px;top:64px;width:490px;height:4px;background:#222", pn);
    const au = zari(580, 330, 120, { acc: "glasses", face: "shock", z: 14 });
    await wait(600);
    for (let i = 1; i <= 12; i++) { a.textContent = i * 3 + " ↑"; b.textContent = Math.round(i * i * 1.3 + i) + " ↑"; if (i % 4 === 0) { hop(h, 10); crumb(300, 200); } await wait(150); }
    await wait(300); anim(au, [{ transform: "none" }, { transform: "rotate(-16deg)" }], 300); say("ん?", 640, 300, { size: 54, color: "#fff", ms: 1200 });
    bubble("どっちも増えてる…?", 640, 245, 1500); await wait(1700);
    h.classList.add("bob"); bubble("駆除したぶん増えるんです。<br>生態系の神秘です", 660, 205, 3000); say("✦神秘✦", 300, 440, { size: 40, color: "#fff", ms: 1500 });
    await wait(3100); anim(au, [{ transform: "rotate(-16deg)" }, { transform: "rotate(-16deg) translateY(-10px)" }], 250, { iterations: 4, direction: "alternate" });
    bubble("……記録しておきます", 640, 250, 1300); await wait(1700);
  },

  async i_T35_09() { // 在庫No.37
    const h = ham(R1); await wait(500);
    const cp = add(`<div></div>`, `left:16px;top:70px;width:360px;height:380px;background:#000a;border:3px solid #fff6;border-radius:10px;z-index:6`);
    add(`<div>チャット</div>`, "left:12px;top:6px;font-size:20px;color:#9cf", cp);
    const rows = [["たろう", "いいね!"], ["はなこ", "がんばれ〜"], ["みき", "ナイス!"], ["ひとりめ", "!つかまえて"]].map(([n, m], i) => {
      const r = add(`<div></div>`, `left:8px;top:${40 + i * 83}px;width:340px;height:72px`, cp);
      const av = zari(2, 4, 58, { face: "smile", color: ["#e8553b", "#d9852f", "#c04a8a", "#e8553b"][i], parent: r });
      const nm = add(`<div>${n}</div>`, "left:70px;top:6px;font-size:18px;color:#ffd23c;white-space:nowrap", r);
      add(`<div>${m}</div>`, `left:70px;top:32px;font-size:26px;color:${i === 3 ? "#ff9a8a" : "#fff"};white-space:nowrap`, r);
      return { r, av, nm }; });
    const t = rows[3]; chip("チャット「!つかまえて」"); anim(t.r, [{ transform: "translateX(-300px)", opacity: 0 }, { transform: "none", opacity: 1 }], 250);
    const pond = add(`<div class=lab>養殖池　在庫 <b>36</b></div>`, "right:20px;top:20px;font-size:28px;background:#1c5a8aee;border:3px solid #7cc4ff"); await wait(1000);
    const net = q7net(840, 160, 75); net.style.zIndex = 40;
    await anim(net, [{ transform: "translate(0,0)" }, { transform: `translate(${60 - 840 + 40}px,${130 + 70 - 160 + 60}px)` }], 650, { easing: "ease-in" }); say("確保!", 480, 120, { size: 54, ms: 600 });
    anim(net, [{ transform: net.getAnimations()[0] ? "translate(-740px,100px)" : "none" }, { transform: "translate(-740px,-80px)", opacity: 0 }], 350);
    await wait(350); net.remove();
    t.av.innerHTML = `<div style="left:0;top:2px;width:100%;height:100%;background:#3c8fcf;border:4px solid ${INK};border-radius:10px;font-size:20px;line-height:50px;text-align:center;color:#fff">池 🌊</div>`;
    t.nm.textContent = "養殖No.37"; t.nm.style.color = "#7cc4ff"; pop(t.av); pond.querySelector("b").textContent = "37"; hop(h, 30);
    say("在庫です", 620, 190, { size: 56, ms: 1600 }); await wait(500);
    bubble("37匹目、っと…", 620, 255, 1500); await wait(2200);
  },

  async i_T36_07() { // 発掘が雑すぎる
    const h = null; await wait(300);
    const bg = layer("background:linear-gradient(#8fc4e8 0 36%,#a9784a 36% 56%,#8a5c36 56% 78%,#6a4326 78%);z-index:2;opacity:0"); anim(bg, [{ opacity: 0 }, { opacity: 1 }], 400);
    [0, 1, 2, 3, 4, 5, 6, 7].forEach(i => add(`<div></div>`, `left:${60 + i * 118}px;top:${290 + (i % 3) * 70}px;width:${14 + i % 3 * 6}px;height:10px;border-radius:50%;background:#5a381f;z-index:3`));
    const fz = add(`<div><img src="${N}" style="width:100%;height:100%;filter:sepia(.9) brightness(.8) contrast(1.1)"></div>`, `left:420px;top:210px;width:210px;height:216px;z-index:4;transform-origin:50% 100%`);
    const mound = add(`<div></div>`, `left:330px;top:350px;width:400px;height:120px;background:#8a5c36;border-radius:50% 50% 0 0;z-index:5;border-top:4px solid ${INK}`);
    const sign = label("ハム紀の地層", "left:20px;top:80px;font-size:28px;z-index:20");
    await wait(600); chip("ビッツ 100"); say("100bits", 480, 170, { size: 40, color: "#ffd23c", ms: 800 });
    const z1 = zari(250, 360, 100, { face: "smile", z: 7 }), brush = add(`<div></div>`, `left:330px;top:345px;width:60px;height:12px;background:#d9a45a;border:3px solid ${INK};z-index:8;transform-origin:0 50%`);
    anim(mound, [{ transform: "none" }, { transform: "translateY(60px)" }], 1600); anim(brush, [{ transform: "rotate(-25deg)" }, { transform: "rotate(15deg)" }], 200, { iterations: 8, direction: "alternate" }); say("サッサッ", 300, 330, { size: 36, color: "#fff", ms: 1400 });
    await wait(1900); chip("ビッツ 1000"); say("1000bits", 480, 170, { size: 46, color: "#ffd23c", ms: 800 }); brush.remove();
    const z2 = zari(540, 340, 110, { face: "smile", z: 7 }), z3 = zari(150, 370, 90, { face: "angry", z: 7 }), sho = add(`<div></div>`, `left:330px;top:355px;width:16px;height:60px;background:#7a4a28;border:3px solid ${INK};z-index:8;transform:rotate(-30deg)`);
    anim(sho, [{ transform: "rotate(-30deg)" }, { transform: "rotate(10deg) translateY(20px)" }], 220, { iterations: 6, direction: "alternate" }); say("ザクザク", 300, 330, { size: 40, color: "#fff", ms: 1200 });
    anim(fz, [{ transform: "none" }, { transform: "translateY(-14px) rotate(-3deg)" }], 400, { iterations: 3, direction: "alternate" });
    await wait(1700); chip("ビッツ 10000!!"); say("10000bits!!", 480, 160, { size: 56, color: "#ffd23c", ms: 1000 }); sho.remove(); z1.remove(); z2.remove(); z3.remove();
    const ex = add(`<svg viewBox="0 0 300 200" style="overflow:visible"><rect x=10 y=150 width=210 height=40 rx=20 fill=#333 stroke=${INK} stroke-width=6 /><rect x=30 y=90 width=150 height=60 fill=#ffc107 stroke=${INK} stroke-width=6 /><rect x=110 y=50 width=70 height=45 fill=#bfe6ff stroke=${INK} stroke-width=6 />
      <g id=arm><path d="M60 100L180 20L260 90" fill=none stroke=#ffc107 stroke-width=22 stroke-linejoin=round /><path d="M255 80L295 120L255 125Z" fill=#888 stroke=${INK} stroke-width=6 /></g></svg>`, "left:-340px;top:200px;width:300px;height:200px;z-index:9");
    await anim(ex, [{ transform: "none" }, { transform: "translateX(500px)" }], 600); say("ガガガガ!!", 300, 150, { size: 60, color: "#ff6a5a", ms: 1200 });
    ex.animate([{ transform: "translateX(500px)" }, { transform: "translate(500px,6px)" }], { duration: 80, iterations: 10, direction: "alternate", fill: "forwards" });
    await wait(700); fz.style.visibility = "hidden";
    const pieces = [[0, 0, -90, -120], [50, 0, 100, -140], [0, 50, -120, 20], [50, 50, 120, 40]].map(([x, y, dx, dy]) => {
      const p = add(`<img src="${N}">`, `left:420px;top:210px;width:210px;height:216px;clip-path:inset(${y}% ${50 - x}% ${50 - y}% ${x}%);filter:sepia(.9) brightness(.8);z-index:10`);
      anim(p, [{ transform: "none" }, { transform: `translate(${dx}px,${dy}px) rotate(${dx}deg)`, offset: .5 }, { transform: `translate(${dx * 1.4}px,${dy + 220}px) rotate(${dx * 2}deg)`, opacity: 0 }], 800).then(() => p.remove()); return p; });
    for (let i = 0; i < 10; i++) crumb(520, 300); await wait(900); ex.remove(); mound.remove();
    chip("修復完了"); say("のりで接着", 300, 160, { size: 44, color: "#fff", ms: 700 });
    const ped = add(`<div></div>`, `left:390px;top:410px;width:270px;height:70px;background:#ddd;border:5px solid ${INK};border-radius:6px;z-index:6`);
    const dis = add(`<div></div>`, `left:420px;top:200px;width:210px;height:216px;z-index:8`);
    add(`<img src="${N}" style="left:0;top:0;width:100%;height:100%;clip-path:inset(46% 0 0 0)">`, "", dis);
    const hd = add(`<img src="${N}" style="left:0;top:0;width:100%;height:100%;clip-path:inset(0 0 46% 0);transform-origin:50% 27%">`, "", dis); hd.style.transform = "rotate(180deg)";
    add(`<svg viewBox="0 0 210 216" style="left:0;top:0;width:100%;height:100%"><path d="M30 112L180 112" stroke=#fff stroke-width=12 stroke-dasharray="10 6" /><path d="M30 112L180 112" stroke=#e8d9a0 stroke-width=6 stroke-dasharray="10 6" /></svg>`, "", dis);
    pop(dis); add(`<div>ハム科　展示No.1</div>`, "left:12px;top:12px;font-size:24px;color:#222;white-space:nowrap", ped);
    const v1 = zari(180, 400, 90, { face: "smile", z: 12 }); const v2 = zari(710, 390, 100, { face: "smile", z: 12, flip: true });
    anim(v1, [{ transform: "none" }, { transform: "translateY(-14px)" }], 200, { iterations: 8, direction: "alternate" });
    await wait(800); say("笑顔のまま", 300, 130, { size: 48, color: "#fff", ms: 1600 }); await wait(2300); fade(bg); await wait(300);
  },

  async i_T37_02() { // 空室になりました
    const h = ham(R2), zs = [0, 1, 2, 3, 4].map(i => zari(20 + i * 72, 400 - (i % 2) * 24, 84, { face: "evil", z: 12 }));
    const door = add(`<div></div>`, `left:470px;top:150px;width:200px;height:340px;background:linear-gradient(#8d97a4,#6d7784);border:6px solid ${INK};border-radius:10px 10px 0 0;z-index:5`);
    [[14, 14], [160, 14], [14, 290], [160, 290]].forEach(([x, y]) => add(`<div></div>`, `left:${x}px;top:${y}px;width:20px;height:20px;border-radius:50%;background:#bcc;border:3px solid ${INK}`, door));
    add(`<div>定員1名</div>`, `left:30px;top:120px;font-size:36px;color:${INK};background:#e0c060;border:4px solid ${INK};padding:4px 12px;white-space:nowrap;transform:rotate(-2deg)`, door);
    const led = add(`<div>1/1</div>`, `left:500px;top:84px;width:140px;height:60px;background:#111;border:5px solid ${INK};border-radius:8px;color:#f33;font:900 44px/50px monospace;text-align:center;z-index:6`);
    await wait(900); chip("敵に撃たれてデス"); q7ham(h, true); say("ぐはっ", 780, 250, { size: 44, color: "#ff6a5a", ms: 700 });
    await wait(500); led.textContent = "0/1"; led.style.color = "#3f3"; const vac = label("空室", "left:500px;top:50px;z-index:20;font-size:26px;color:#3f3");
    zs.forEach(z => z.firstChild && z.querySelector("svg")); say("やったー!!", 220, 300, { size: 52, ms: 900 });
    await wait(500); zs.forEach((z, i) => anim(z, [{ transform: "none" }, { transform: `translate(${300 - i * 30}px,${-10 - (i % 2) * 20}px)` }], 700 - i * 40, { easing: "ease-in", fill: "forwards" }));
    await wait(750); say("ギュウギュウ", 400, 330, { size: 40, color: "#fff", ms: 800 });
    await wait(700); chip("復活"); q7ham(h, false); led.textContent = "1/1"; led.style.color = "#f33"; vac.remove(); hop(h, 60);
    const bl = add(`<div></div>`, `left:560px;top:320px;width:20px;height:20px;border-radius:50%;border:8px solid #fff;z-index:40`); anim(bl, [{ transform: "translate(-50%,-50%) scale(1)", opacity: 1 }, { transform: "translate(-50%,-50%) scale(60)", opacity: 0 }], 600).then(() => bl.remove());
    zs.forEach((z, i) => { z.style.transition = ""; anim(z, [{ transform: `translate(${300 - i * 30}px,${-10 - (i % 2) * 20}px)` }, { transform: `translate(${-500 - i * 40}px,${-250 - i * 40}px) rotate(${-720}deg)` }], 800, { easing: "ease-out" }); });
    say("ぎゃーっ", 300, 220, { size: 54, color: "#fff", ms: 1000 }); await wait(1900);
  },

  async i_T37_03() { // 工期が間に合わない
    const h = ham(R2); const WX = 290, WY = 150, WW = 340, WH = 350;
    add(`<div></div>`, `left:${WX}px;top:${WY}px;width:${WW}px;height:${WH}px;border:5px dashed #fff9;z-index:4`);
    const worker = zari(540, 390, 90, { acc: "helmet", face: "sad", z: 7 });
    const wall = add(`<div></div>`, `left:${WX}px;top:${WY}px;width:0;height:${WH}px;background:repeating-linear-gradient(0deg,#9aa0a8 0 28px,#7c828a 28px 32px);border:5px solid ${INK};z-index:8;border-left-width:0`);
    const fm = zari(130, 330, 120, { acc: "helmet", face: "angry", z: 14 }), roller = add(`<div></div>`, `left:240px;top:380px;width:50px;height:20px;background:#ddd;border:4px solid ${INK};border-radius:10px;z-index:14`);
    const clk = add(`<div class=lab>⏩ 通常</div>`, "right:20px;top:20px;font-size:30px;background:#000b"); const fills = [.34, .67, 1.02], speeds = ["x2", "x4", "x8"], shouts = ["納期が!", "納期が!!", "納期がぁぁぁ!!!"];
    for (let i = 0; i < 3; i++) { await wait(i ? 500 : 800); chip(`${i + 1}連続デス`); q7ham(h, true); say("ぐはっ", 760, 260, { size: 40, color: "#ff6a5a", ms: 600 }); clk.textContent = `⏩ 早回し ${speeds[i]}`;
      await wait(400); bubble(shouts[i], 190, 240, 1100); const sp = add(`<div></div>`, `left:0;top:0;width:960px;height:540px;background:repeating-linear-gradient(90deg,#fff2 0 4px,transparent 4px 40px);z-index:25`); anim(sp, [{ transform: "translateX(0)" }, { transform: "translateX(-120px)" }], 150, { iterations: 8 }).then(() => sp.remove());
      anim(roller, [{ transform: "translateX(0)" }, { transform: `translateX(${fills[i] * WW}px)` }], 1100, { fill: "forwards", easing: "linear" }); anim(fm, [{ transform: "none" }, { transform: `translateX(${Math.min(fills[i], 1) * WW - 20}px)` }], 1100, { fill: "forwards" });
      await anim(wall, [{ width: (i ? fills[i - 1] * WW : 0) + "px" }, { width: Math.min(fills[i], 1) * WW + "px" }], 1100, { fill: "forwards", easing: "linear" }); wall.style.width = Math.min(fills[i], 1) * WW + "px";
      q7ham(h, false); if (i < 2) await wait(200); }
    worker.style.display = "none"; fm.style.display = "none"; roller.style.display = "none"; clk.textContent = "⏩ 完成";
    const claws = add(`<svg viewBox="0 0 100 80" style="overflow:visible"><g stroke=${INK} stroke-width=4 stroke-linejoin=round><path d="M30 80L24 50M70 80L76 50" stroke=#e8553b stroke-width=10 /><path d="M24 50C6 44 4 22 12 10C16 4 24 4 26 10L24 24L32 18C40 24 38 42 24 50Z" fill=#e8553b /><path d="M76 50C94 44 96 22 88 10C84 4 76 4 74 10L76 24L68 18C60 24 62 42 76 50Z" fill=#e8553b /></g></svg>`, `left:${WX + WW - 130}px;top:${WY + 90}px;width:100px;height:80px;z-index:9`);
    pop(claws); say("ハサミだけ生えた", 480, 90, { size: 50, ms: 1500 });
    await wait(900); const hat = add(`<svg viewBox="0 0 60 40" style="overflow:visible"><path d="M6 36Q8 6 30 6Q52 6 54 36Z" fill=#ffc107 stroke=${INK} stroke-width=4 /><rect x=0 y=32 width=60 height=8 rx=4 fill=#ffc107 stroke=${INK} stroke-width=4 /></svg>`, `left:${HX + 80}px;top:${HY}px;width:60px;height:40px;z-index:30`);
    hop(h, 20); await anim(hat, [{ transform: "none" }, { transform: `translate(-290px,-210px) rotate(-360deg)`, offset: .6 }, { transform: `translate(${-(HX + 80) + WX + WW - 130 + 14}px,${-(HY) + WY + 70}px) rotate(-720deg)` }], 800, { easing: "ease-in-out" });
    hat.getAnimations().forEach(a => a.cancel()); hat.style.left = WX + WW - 130 + 14 + "px"; hat.style.top = WY + 70 + "px"; hat.style.transform = "none"; bubble("ここに掛けとこ", 640, 235, 1500); await wait(2200);
  },

  async i_T37_05() { // 空気はザリガニ製
    const bg = layer("background:linear-gradient(#5a3b24 0 24%,#4a2f1c 24%);z-index:2;opacity:0");
    [0, 1, 2, 3, 4, 5, 6].forEach(i => add(`<div></div>`, `left:${30 + i * 140}px;top:${60 + i % 3 * 24}px;width:34px;height:14px;border-radius:50%;background:#33200f`, bg));
    anim(bg, [{ opacity: 0 }, { opacity: 1 }], 400);
    const room = add(`<div></div>`, `left:500px;top:150px;width:440px;height:380px;background:linear-gradient(#f2dcb0 0 78%,#9a3a3a 78%);border:6px solid ${INK};border-radius:14px;z-index:3`);
    add(`<div class=lab>地下シェルター（1名様）</div>`, `left:520px;top:112px;font-size:20px;z-index:20`);
    const h = ham(R2);
    await wait(700); chip("試合に勝利"); say("入室!", 480, 160, { size: 52, ms: 700 });
    const bt = zari(580, 395, 100, { acc: "tie", face: "smile", z: 14 });
    const shoes = [0, 1].map(i => add(`<div>👞</div>`, `left:${640 + i * 36}px;top:${480 + i * 6}px;font-size:40px;z-index:13;rotate:${i ? 60 : -50}deg`));
    await wait(800); bubble("お履き物、揃えます", 590, 345, 1500);
    anim(bt, [{ transform: "none" }, { transform: "rotate(25deg)", transformOrigin: "50% 100%" }], 300, { iterations: 4, direction: "alternate" });
    shoes.forEach((e, i) => e.style.rotate = "0deg"); await wait(1800);
    chip("裏の換気口"); const lbl = label("裏：換気口", "left:20px;top:150px;font-size:26px;z-index:20");
    const pipe = add(`<div></div>`, `left:0;top:470px;width:510px;height:46px;background:linear-gradient(#aab,#778);border:5px solid ${INK};z-index:6`);
    const fans = [0, 1, 2, 3].map(i => { const z = zari(20 + i * 120, 338, 100, { face: "sad", z: 12, flip: i % 2 }); const f = add(`<div>🪭</div>`, `left:${70 + i * 120}px;top:340px;font-size:42px;z-index:15`);
      anim(f, [{ transform: "rotate(-40deg)" }, { transform: "rotate(40deg)" }], 140, { iterations: 36, direction: "alternate" }); anim(z, [{ transform: "none" }, { transform: "translateY(4px)" }], 150, { iterations: 30, direction: "alternate" }); return z; });
    for (let i = 0; i < 9; i++) { const ar = add(`<div class=t>→</div>`, `left:0;top:${478}px;font-size:34px;color:#cfe;z-index:20`); anim(ar, [{ transform: "translateX(-20px)", opacity: 0 }, { transform: "translateX(560px)", opacity: 1 }], 900, { delay: i * 220, easing: "linear" }).then(() => ar.remove()); }
    for (let i = 0; i < 5; i++) { const dr = add(`<div>💧</div>`, `left:${rnd(40, 440)}px;top:${330 + rnd(0, 20)}px;font-size:24px;z-index:20`); anim(dr, [{ transform: "none", opacity: 1 }, { transform: "translateY(40px)", opacity: 0 }], 800, { delay: i * 350 }).then(() => dr.remove()); }
    bubble("ふーっ!ふーっ!", 150, 280, 1600); bubble("もう腕が…", 340, 240, 1500); await wait(1800);
    h.img.src = R2; const ey = ov(h, closedEyes); say("空気がおいしい", 610, 235, { size: 46, color: "#fff", ms: 2000 }); flash(HX, HX + HW, HY - 20, HY + 100, "#cfe");
    await wait(2500); fade(bg); await wait(200);
  },

  async i_T37_07() { // 感謝プレートは内側
    const h = ham(R2); const WX = 420, WW = 70;
    const wall = add(`<div></div>`, `left:${WX}px;top:140px;width:${WW}px;height:0;background:repeating-linear-gradient(0deg,#b0583a 0 34px,#7a3a28 34px 38px);border:5px solid ${INK};z-index:8;bottom:auto`);
    add(`<div class=lab>内側</div>`, `left:${WX + WW + 14}px;top:104px;font-size:22px;z-index:20`); add(`<div class=lab>外側</div>`, `left:${WX - 70}px;top:104px;font-size:22px;z-index:20`);
    const zs = [0, 1, 2].map(i => zari(30 + i * 110, 380 - (i % 2) * 30, 90, { face: "smile", z: 12, flip: false }));
    const names = ["ざりお様", "えび吉様", "ぴんく様"], pl = [];
    await wait(500);
    for (let i = 0; i < 3; i++) { chip(`ビッツ ${(i + 1) * 100}`); say(`+${(i + 1) * 100}`, 160 + i * 70, 340, { size: 36, color: "#ffd23c", ms: 600 });
      const cn = add(`<div class=c>¥</div>`, `left:${100 + i * 110}px;top:${380 - (i % 2) * 30}px;z-index:20`);
      await anim(cn, [{ transform: "none" }, { transform: `translate(${WX - 100 - i * 110 + 20}px,${-200 + i * 100}px) scale(2.4)` }], 520, { easing: "ease-in" }); cn.remove();
      anim(wall, [{ height: 90 * i + "px" }, { height: 90 * (i + 1) + "px" }], 300); wall.style.height = 90 * (i + 1) + "px"; crumb(WX + 30, 140 + i * 90); await wait(250);
      const p = add(`<div>${names[i]}</div>`, `left:${WX - 40}px;top:${300 + i * 52}px;background:linear-gradient(#ffe680,#d99a10);border:4px solid ${INK};padding:2px 10px;font-size:20px;color:${INK};white-space:nowrap;z-index:20;height:36px`); pop(p); await wait(450);
      await anim(p, [{ transform: "none" }, { transform: `translate(0,${-210 - i * 52}px) rotate(-10deg)`, offset: .3 }, { transform: `translate(${WW + 48}px,${-210 - i * 52}px)`, offset: .7 }, { transform: `translate(${WW + 48}px,${160 + i * 80 - 300 - i * 52}px)` }], 700);
      p.getAnimations().forEach(a => a.cancel()); p.style.left = WX + WW + 8 + "px"; p.style.top = 160 + i * 80 + "px"; p.style.zIndex = 9; pl.push(p); }
    await wait(500); chip("毎朝、ピカピカに磨く"); h.classList.add("bob");
    const cloth = add(`<div>🧽</div>`, `left:${WX + WW + 50}px;top:150px;font-size:44px;z-index:25`);
    anim(cloth, [{ transform: "translate(0,0)" }, { transform: "translate(0,190px)" }], 450, { iterations: 4, direction: "alternate" });
    bubble("今日もピカピカ", 600, 230, 2000); for (let i = 0; i < 10; i++) { flash(WX + WW + 10, WX + WW + 150, 150, 320, "#ffe680"); await wait(190); }
    await wait(300); chip("外のザリガニから見ると"); zs.forEach(z => z.querySelector("svg") && 0);
    say("1枚も見えない…", 200, 300, { size: 48, color: "#fff", ms: 2200 });
    zs.forEach(z => { z.innerHTML = zariSvg({ face: "sad" }); anim(z, [{ transform: "none" }, { transform: "translateY(5px)" }], 200, { iterations: 8, direction: "alternate" }); });
    await wait(2500);
  },
});
}

{
// ---- q8 共通部品 (ゾンビ) ----
const zomSvg = (o = {}) => {
  const G = "#8fc46a", D = "#5f9a48", L = `stroke=${INK} stroke-width=4 stroke-linejoin=round stroke-linecap=round`;
  const arm = d => `<path d="${d}" fill=none stroke=${INK} stroke-width=15 stroke-linecap=round /><path d="${d}" fill=none stroke=${G} stroke-width=8 stroke-linecap=round />`;
  const front = o.x ? arm("M26 66L76 106") + arm("M74 66L24 106") : o.pinch ? arm("M70 70L58 50") : "";
  const back = o.x || o.pinch ? arm("M28 68L22 104") : o.down ? arm("M28 68L22 104") + arm("M72 68L78 104") : arm("M30 68L96 62") + arm("M34 76L98 76");
  const flat = o.x || o.pinch;
  const eyes = flat ? `<path d="M30 40Q38 34 46 40M54 40Q62 34 70 40" fill=none ${L} stroke-width=3.5 />`
    : `<circle cx=38 cy=36 r=9 fill=#fff ${L} stroke-width=3 /><circle cx=62 cy=38 r=7 fill=#fff ${L} stroke-width=3 /><circle cx=${o.sorry ? 40 : 39} cy=${o.sorry ? 40 : 37} r=3 fill=${INK} /><circle cx=61 cy=${o.sorry ? 41 : 39} r=2.4 fill=${INK} />`;
  const brow = o.sorry ? `<path d="M28 28L46 22M72 28L54 22" ${L} stroke-width=3 />` : o.pinch ? `<path d="M28 24L46 30M72 24L54 30" ${L} stroke-width=3 />` : "";
  const mouth = o.sorry ? `<path d="M40 56Q50 50 60 56" fill=none ${L} stroke-width=3 />` : flat ? `<path d="M40 56Q50 53 60 56" fill=none ${L} stroke-width=3 />`
    : `<path d="M36 52Q50 63 64 52Z" fill=#3a0a00 ${L} stroke-width=3 /><path d="M42 53V57M50 55V59M58 53V57" stroke=#fff stroke-width=3 />`;
  const cap = o.cap ? `<path d="M22 20Q50 -8 78 20Z" fill=#c62828 ${L} /><path d="M60 18H92" ${L} stroke-width=6 />` : "";
  const clip = o.clip ? `<g transform="rotate(-12 80 80)"><rect x=64 y=62 width=30 height=38 rx=3 fill=#c9a06a ${L} stroke-width=3 /><rect x=69 y=68 width=20 height=26 fill=#fff /><path d="M72 74H86M72 80H86M72 86H82" stroke=#888 stroke-width=2 /></g>` : "";
  return `<svg viewBox="0 0 100 130" style="left:0;top:0;width:100%;height:100%;overflow:visible${o.flip ? ";transform:scaleX(-1)" : ""}">
    <rect x=30 y=104 width=15 height=22 rx=5 fill=${D} ${L} /><rect x=55 y=104 width=15 height=22 rx=5 fill=${D} ${L} />
    <path d="M26 62Q50 70 74 62L78 104L70 100L64 108L56 100L48 108L40 100L32 108L22 104Z" fill=#7a5aa8 ${L} />${back}
    <circle cx=50 cy=38 r=27 fill=${G} ${L} /><path d="M62 14L68 26M60 22L70 20" stroke=${INK} stroke-width=3 stroke-linecap=round fill=none />
    ${eyes}${brow}${mouth}${cap}${front}${clip}</svg>`;
};
const zom = (x, y, w, o = {}) => add(`<div>${zomSvg(o)}</div>`, `left:${x}px;top:${y}px;width:${w}px;height:${w * 1.3}px;z-index:${o.z ?? 15}`, o.parent || s);
const q8dead = h => { h.img.style.filter = "saturate(.2) brightness(1.08)"; return ov(h, whiteEyes + openMouth); };
const q8fall = async h => { // 落下してデス
  await anim(h, [{ transform: "none" }, { transform: "translateY(70px) rotate(18deg)", offset: .2 }, { transform: "translateY(640px) rotate(120deg)" }], 650, { easing: "ease-in" });
  await wait(250); h.style.transform = "none"; const e = q8dead(h); pop(h, 260); return e;
};

Object.assign(scenes, {

  async i_T37_09() { // 定員3名の中身
    layer("z-index:2;background:linear-gradient(#6e5036 0 85%,#3f2d1e 85%)",
      [[40, 300, 50], [880, 360, 40], [640, 180, 30], [130, 140, 36], [800, 120, 44]].map(([x, y, w]) => `<div style="left:${x}px;top:${y}px;width:${w}px;height:${w * .6}px;border-radius:50%;background:#5a4029"></div>`).join(""));
    add(`<div></div>`, "left:240px;top:110px;width:280px;height:350px;border-radius:140px 140px 0 0;background:radial-gradient(#ffcf6a,#5a3a18 70%,#221008);z-index:3");
    const door = add(`<svg viewBox="0 0 300 360"><defs><pattern id=q8hz width=24 height=24 patternUnits=userSpaceOnUse patternTransform="rotate(45)"><rect width=12 height=24 fill=#fc3 /><rect x=12 width=12 height=24 fill=#222 /></pattern></defs>
      <path d="M8 360V130Q8 8 150 8Q292 8 292 130V360Z" fill=#8d99a6 stroke=${INK} stroke-width=8 /><path d="M30 345V135Q30 30 150 30Q270 30 270 135V345Z" fill=#a9b4bf stroke=${INK} stroke-width=5 />
      <circle cx=150 cy=205 r=52 fill=#6f7a86 stroke=${INK} stroke-width=7 /><path d="M150 153V257M98 205H202M113 168L187 242M187 168L113 242" stroke=${INK} stroke-width=9 stroke-linecap=round /><circle cx=150 cy=205 r=14 fill=#c9d2da stroke=${INK} stroke-width=5 />
      <rect x=8 y=322 width=284 height=36 fill=url(#q8hz) stroke=${INK} stroke-width=5 /></svg>`, "left:230px;top:100px;width:300px;height:360px;z-index:4;transform-origin:0 50%");
    const sign = add(`<div>定員 1名</div>`, "left:250px;top:56px;width:260px;height:64px;line-height:56px;text-align:center;font-size:40px;background:#1c2a1c;border:5px solid #fc3;border-radius:10px;z-index:6");
    const setCap = (n, c = "#fff") => { sign.textContent = `定員 ${n}名`; sign.style.color = c; anim(sign, [{ transform: "scale(1.5)" }, { transform: "none" }], 260); };
    const zs = [10, 88, 164].map((x, i) => zari(x, 432, 88, { face: "smile", acc: i === 1 ? "helmet" : undefined, z: 7 })); zs.forEach(z => z.classList.add("bob"));
    const h = ham(R2);
    const cmd = who => { const b = add(`<div class=bub style="font-size:20px">${who}: !定員</div>`, `left:${rnd(600, 760)}px;top:${rnd(70, 240)}px`); anim(b, [{ transform: "scale(.3)" }, { transform: "none" }], 150); wait(700).then(() => fade(b, 200)); };
    const rel = (t, x, w, ly) => { const hh = w * 1271 / 1237; const e = add(`<div><img src="${N}" style="left:0;top:0;width:100%;height:100%"><div class=lab style="left:50%;top:${ly}px;translate:-50% 0;font-size:14px;padding:2px 8px">${t}</div></div>`, `left:${x}px;top:${534 - hh}px;width:${w}px;height:${hh}px;z-index:8`); pop(e); return e; };
    const rels = [];
    await wait(900); chip("「!定員」が連打された"); say("シェルター完成!", 480, 210, { size: 44, ms: 1000 }); await wait(1000);
    for (const [n, t, x, w, ly, line] of [[2, "ハム(大)", 500, 84, -30, "ハム(大)！来い！"], [3, "ハム(中)", 590, 66, -56, "ハム(中)も！"], [5, "ハム(小)", 660, 44, -30, "ハム(小)もだ！"]]) {
      cmd("たろう"); await wait(200); cmd("はなこ"); await wait(250); setCap(n, "#ffd23c"); bubble(line, 700, 250, 1000); hop(h, 36); rels.push(rel(t, x, w, ly)); await wait(1250);
    }
    chip("定員 5名: 解放"); const inner = add(`<div><img src="${N}" style="left:0;top:0;width:100%;height:100%"></div>`, "left:355px;top:395px;width:50px;height:51px;z-index:5;opacity:0"); const sec = add(`<div class=lab style="font-size:14px;padding:2px 8px">ハム(隠し子)</div>`, "left:300px;top:360px;z-index:5");
    await anim(door, [{ transform: "none" }, { transform: "perspective(800px) rotateY(-78deg)" }], 600); pop(inner); await wait(500);
    rels.forEach((r, i) => { anim(r, [{ transform: "none", opacity: 1 }, { transform: `translate(${375 - parseFloat(r.style.left) - parseFloat(r.style.width) / 2}px,-10px) scale(.4)`, opacity: 0 }], 600, { delay: i * 160 }); });
    anim(h, [{ transform: "none", opacity: 1 }, { transform: "translate(-450px,-30px) scale(.35)", opacity: 0 }], 750, { delay: 500 });
    await wait(1500); sec.remove(); anim(inner, [{ opacity: 1 }, { opacity: 0 }], 250);
    await anim(door, [{ transform: "perspective(800px) rotateY(-78deg)" }, { transform: "none" }], 350, { easing: "ease-in" }); shake(door);
    setCap(5, "#ff6a5a"); stamp("満員", 380, 270, 80); zs.forEach(z => { z.classList.remove("bob"); z.innerHTML = zariSvg({ face: "sad", acc: undefined }); });
    bubble("僕らは…？", 120, 365, 1700); await wait(900); bubble("掘ったの僕らなのに", 230, 330, 1500); await wait(1900);
  },

  async i_T38_02() { // ハム、燃えるゴミ
    const h = ham(N);
    add(`<div></div>`, "left:215px;top:280px;width:20px;height:260px;background:#777;border:3px solid #333;z-index:4");
    add(`<div>ゴミ集積所<br>燃える日：木</div>`, "left:110px;top:190px;width:240px;text-align:center;background:#2c7a4a;border:4px solid #fff;border-radius:10px;padding:6px;font-size:26px;line-height:1.2;z-index:6");
    await wait(900); chip("落下してデス"); say("うわぁぁ…", 600, 200, { color: "#9db4d8", ms: 900 });
    const eyes = await q8fall(h); say("デス", 560, 220, { color: "#ff6a5a", ms: 700 }); await wait(500);
    const cho = zari(-160, 402, 130, { face: "angry", acc: "glasses", extra: `<rect x=88 y=64 width=14 height=22 fill=#ffd23c stroke=${INK} stroke-width=3 />` });
    await anim(cho, [{ transform: "none" }, { transform: "translateX(680px)" }], 800, { easing: "linear" });
    bubble("はい、燃えるゴミ", 600, 330, 1100);
    const tag = add(`<div>燃えるゴミ</div>`, "left:12%;top:-14%;color:#d3202a;background:#fff8e6;border:4px solid #331c16;border-radius:8px;padding:4px 12px;white-space:nowrap;font-size:28px;rotate:-6deg;z-index:5", h); pop(tag);
    await wait(500);
    const bag = add(`<div><div style="left:36%;top:-10%;width:28%;height:14%;background:#2a9b66;border:4px solid #1d6f48;border-radius:40% 40% 10% 10%"></div></div>`, "left:-6%;top:14%;width:112%;height:92%;background:radial-gradient(circle at 35% 30%,#7ee0a8aa,#2a9b66cc);border:4px solid #1d6f48;border-radius:42% 42% 30% 30%;z-index:3", h);
    await anim(bag, [{ transform: "translateY(-200px)", opacity: 0 }, { transform: "none", opacity: 1 }], 280, { easing: "ease-in" });
    await wait(500); await walk(h, 0, -440, 1000, 5);
    const tr = add(`<div><div style="left:0;top:0;transform:scaleX(-1)">🚛</div></div>`, "left:-230px;top:330px;width:160px;height:160px;font-size:150px;z-index:8");
    say("ピーッ ピーッ", 140, 300, { size: 32, color: "#fff", ms: 900 });
    anim(tr, [{ transform: "none" }, { transform: "translateX(300px)" }], 1200, { easing: "ease-out" }); await wait(1000);
    chip("リスポーン"); [...Array(7)].forEach((_, i) => { const p = add(`<div></div>`, `left:${HX - 440 + 60 + i * 18}px;top:${HY + 90}px;width:26px;height:18px;background:#2a9b66;border:3px solid #1d6f48;z-index:20`);
      anim(p, [{ transform: "none" }, { transform: `translate(${(i - 3) * 50}px,${-90 - i * 8}px) rotate(300deg)`, offset: .5 }, { transform: `translate(${(i - 3) * 70}px,220px) rotate(600deg)`, opacity: 0 }], 700).then(() => p.remove()); });
    bag.remove(); tag.remove(); eyes.remove(); h.img.style.filter = "none"; anim(h, [{ transform: "translateX(-440px)" }, { transform: "translate(-440px,-70px)", offset: .4 }, { transform: "translateX(-440px)" }], 420); say("リスポーン!!", 330, 150, { ms: 900 });
    anim(tr, [{ transform: "translateX(300px)" }, { transform: "translateX(240px)" }], 200); await wait(700);
    cho.innerHTML = zariSvg({ face: "angry", acc: "glasses", extra: `<rect x=88 y=64 width=14 height=22 fill=#ffd23c stroke=${INK} stroke-width=3 />` });
    bubble("収集日は木曜です！", 600, 330, 0).classList.add("trem"); await wait(900);
    const nt = note("【貼り紙】復活は木曜のみ", "left:540px;top:110px;rotate:3deg;font-size:24px"); pop(nt); await wait(2000);
  },

  async i_T38_06() { // 隕石は不燃です
    const h = ham(N); const e1 = ov(h, whiteEyes + frown);
    const sky = add(`<div></div>`, "left:0;top:0;width:960px;height:540px;background:linear-gradient(#ff2a0066,#ff6a0000);opacity:0;z-index:3");
    const cho = zari(340, 391, 130, { face: "angry", acc: "glasses", z: 15, extra: `<rect x=88 y=64 width=14 height=22 fill=#ffd23c stroke=${INK} stroke-width=3 />` });
    const br = add(`<svg viewBox="0 0 60 260"><rect x=26 y=60 width=8 height=200 fill=#a8793c stroke=${INK} stroke-width=3 /><path d="M8 0L52 0L58 66L2 66Z" fill=#e0b84a stroke=${INK} stroke-width=4 /><path d="M18 8V60M30 8V60M42 8V60" stroke=#a8793c stroke-width=3 /></svg>`, "left:453px;top:170px;width:60px;height:260px;transform-origin:50% 100%;z-index:16;rotate:8deg");
    const met = add(`<div><div style="left:50px;top:-420px;width:60px;height:480px;background:linear-gradient(#ff600000,#ff7a1a);transform-origin:50% 100%;rotate:-14deg;border-radius:30px"></div></div>`,
      "left:340px;top:-240px;width:160px;height:160px;border-radius:50%;background:radial-gradient(circle at 40% 35%,#fff,#ffc040 35%,#e03010 75%);box-shadow:0 0 50px #ff6a00;z-index:12;opacity:0");
    await wait(800); chip("試合に敗北"); anim(sky, [{ opacity: 0 }, { opacity: 1 }], 1200).then(() => {});
    say("隕石が来る！", 330, 110, { size: 46, ms: 900 });
    anim(met, [{ transform: "translate(0,0) scale(.4)", opacity: 1 }, { transform: "translate(110px,470px) scale(2.2)", opacity: 1 }], 3000, { easing: "ease-in" });
    await wait(900); bubble("今日は燃える日です、不燃は来週！", 340, 205, 1900).classList.add("trem");
    anim(br, [{ rotate: "8deg" }, { rotate: "-12deg" }, { rotate: "10deg" }, { rotate: "-12deg" }, { rotate: "10deg" }], 1800, { easing: "linear" });
    shake(h); await wait(900); shake(h); await wait(1000);
    const fl = add(`<div></div>`, "left:0;top:0;width:960px;height:540px;background:#fff;z-index:60"); anim(fl, [{ opacity: 0 }, { opacity: 1 }], 120);
    await wait(150);
    [h, cho, br, met, sky].forEach(e => e.remove());
    const rub = layer("z-index:20;background:linear-gradient(#5a4a44,#2c2220 60%,#1a1412)",
      `<div style="left:0;top:380px;width:960px;height:160px;background:#2a2220"></div>` +
      [[60, 360, 130, 70], [200, 400, 90, 50], [330, 380, 150, 80], [520, 410, 110, 60], [700, 370, 140, 90], [840, 400, 100, 60]].map(([x, y, w, hh]) => `<div style="left:${x}px;top:${y}px;width:${w}px;height:${hh}px;background:#4a3d38;border:4px solid ${INK};clip-path:polygon(0 100%,10% 30%,40% 0,75% 20%,100% 100%)"></div>`).join("") +
      `<div style="left:620px;top:330px;width:20px;height:90px;background:#8a6a3a;border:3px solid ${INK};rotate:-18deg"></div><div style="left:700px;top:200px;width:200px;height:200px;border-radius:50%;background:radial-gradient(#8886,#0000 70%)"></div><div style="left:130px;top:160px;width:260px;height:240px;border-radius:50%;background:radial-gradient(#7776,#0000 70%)"></div>`);
    const ps = add(`<div>隕石は<br>不燃ゴミ<br>来週</div>`, "left:392px;top:210px;width:170px;text-align:center;font-size:30px;line-height:1.2;color:#222;background:#fff8e6;border:4px solid #331c16;padding:8px;rotate:-5deg;z-index:30");
    add(`<div></div>`, "left:470px;top:330px;width:14px;height:120px;background:#8a6a3a;border:3px solid #331c16;z-index:21");
    anim(fl, [{ opacity: 1 }, { opacity: 0 }], 1000).then(() => fl.remove()); pop(ps, 300);
    await wait(2300); await anim(rub, [{ opacity: 1 }, { opacity: 0 }], 600); ps.remove(); rub.remove();
    chip("次の試合"); const h2 = ham(N); pop(h2, 350); await wait(1200);
  },

  async i_T39_02() { // ペンキ臭い
    layer("z-index:1;background:#0b2a12a0");
    const h = ham(N);
    add(`<div>ゾンビ入隊受付</div>`, "left:60px;top:80px;background:#222;color:#9f9;border:4px solid #9f9;padding:6px 16px;font-size:32px;z-index:6;rotate:-3deg");
    const zs = [70, 190, 310].map((x, i) => zom(x, 365, 130, { z: 15 }));
    await wait(800); chip("落下してデス"); const eyes = await q8fall(h); await wait(500);
    bubble("ならば…ゾンビになる", 640, 240, 1500); await wait(1000);
    const bucket = add(`<div><div style="left:-4px;top:-14px;width:68px;height:20px;border-radius:50%;background:#7dff7d;border:4px solid ${INK}"></div></div>`, "left:640px;top:-80px;width:60px;height:56px;background:#3ac43a;border:4px solid #1d6f1d;clip-path:polygon(0 0,100% 0,88% 100%,12% 100%);z-index:20");
    await anim(bucket, [{ transform: "none" }, { transform: "translateY(520px)" }], 450, { easing: "ease-in" });
    eyes.remove();
    const paint = ov(h, `<ellipse cx=600 cy=540 rx=470 ry=400 fill=#4cb84a opacity=.0 /><path d="M300 800v70M480 830v90M720 830v60M900 790v100" stroke=#4cb84a stroke-width=34 stroke-linecap=round opacity=.9 />`);
    ov(h, whiteEyes + openMouth); const el = paint.firstChild;
    say("ぬりぬり", 640, 280, { size: 36, color: "#9f9", ms: 900 }); await anim(el, [{ opacity: 0 }, { opacity: .8 }], 800);
    bucket.remove(); h.img.style.filter = "none"; say("ヴァ〜", 700, 250, { size: 50, color: "#9f9" });
    await wait(500); await walk(h, 0, -230, 1000, 5);
    await wait(300); zs[2].innerHTML = zomSvg({ pinch: true }); say("くんくん", 380, 330, { size: 30, color: "#fff", ms: 700 }); await wait(900);
    bubble("ペンキ臭い", 380, 300, 2600); await wait(900);
    zs[2].innerHTML = zomSvg({ x: true }); zs[1].innerHTML = zomSvg({ flip: true, down: true }); zs[0].innerHTML = zomSvg({ flip: true, down: true });
    const tr = ov(h, tears + frown); await wait(1000); say("…", 560, 250, { size: 50, color: "#9db4d8", ms: 0 }); await wait(2000);
  },

  async i_T39_06() { // 海のように割れる
    layer("z-index:1;background:#0b2a12a0");
    const h = ham(N); const rows = [];
    for (let r = 0; r < 5; r++) for (let c = 0; c < 5; c++) { const z = zom(60 + c * 105 + (r % 2) * 50, 130 + r * 70, 100, { z: 12 + r, down: c % 2 === 0 }); z.r = r; rows.push(z); }
    await wait(900); chip("試合に敗北"); const m = ov(h, whiteEyes + openMouth); say("食べて！", 600, 120, { size: 62 });
    await anim(h, [{ transform: "none" }, { transform: "translate(-30px,-110px)", offset: .5 }, { transform: "translate(-60px,0)" }], 600); await wait(300);
    say("!?", 330, 90, { size: 60, color: "#fff", ms: 900 });
    rows.forEach(z => { z.innerHTML = zomSvg({ sorry: true, down: true }); });
    await Promise.all(rows.map(z => anim(z, [{ transform: "none" }, { transform: `translateY(${z.r < 3 ? -95 : 95}px)` }], 900, { easing: "ease-in-out" })));
    m.remove(); ov(h, frown);
    const Ts = (x, y) => ({ transform: `translate(${x}px,${y}px) scale(.52)` });
    await anim(h, [{ transform: "translate(-60px,0) scale(1)" }, Ts(-60, -104)], 250);
    say("ごめんね", 330, 300, { size: 30, color: "#fff", ms: 1400 });
    const fr = []; for (let i = 0; i <= 12; i++) fr.push(Ts(-60 - i * 55, -104 - (i % 2 ? 12 : 0)));
    const wk = anim(h, fr, 2300, { easing: "linear" });
    await wait(900); bubble("ごめんね", 420, 440, 1300); await wait(600); bubble("ほんとごめんね", 250, 258, 1300); await wk;
    ov(h, tears); say("…", 180, 400, { size: 44, color: "#9db4d8", ms: 0 }); await wait(2000);
  },

  async i_T39_08() { // パセリのハム
    layer("z-index:2;background:#3a2230");
    add(`<div>🧟 ゾンビビュッフェ 食べ放題</div>`, "left:380px;top:16px;font-size:28px;background:#000a;padding:4px 16px;border-radius:12px;z-index:6;white-space:nowrap");
    const zb = zom(690, 70, 250, { z: 4 });
    add(`<div></div>`, "left:0;top:360px;width:960px;height:180px;background:repeating-linear-gradient(90deg,#d33 0 40px,#fff 40px 80px);z-index:5;border-top:6px solid #922");
    add(`<div></div>`, "left:130px;top:340px;width:600px;height:150px;border-radius:50%;background:radial-gradient(#fff 60%,#e3e8ee);border:6px solid #b8c0cc;z-index:6");
    await wait(700); chip("チャネポ「ハムを皿に飾る」");
    const zs = [260, 380, 500].map((x, i) => { const z = zari(x, 270, 120, { face: i === 1 ? "shock" : "sad", color: "#e32b14", dark: "#a31a0c", z: 8 }); pop(z); return z; });
    add(`<div class=lab>メイン：ザリガニ</div>`, "left:290px;top:236px;z-index:9;font-size:20px");
    ["#ffe066", "#fff3a0"].forEach((c, i) => add(`<div></div>`, `left:${230 + i * 330}px;top:${430}px;width:46px;height:46px;border-radius:50%;background:${c};border:4px solid #d8b400;z-index:9`));
    await wait(800);
    const par = add(`<div><svg viewBox="0 0 110 110" style="left:0;top:0;width:100%;height:100%"><path d="${[...Array(16)].map((_, i) => { const a = i / 16 * 6.283, a2 = (i + .5) / 16 * 6.283; return `${i ? "L" : "M"}${55 + 52 * Math.cos(a)} ${55 + 52 * Math.sin(a)}L${55 + 38 * Math.cos(a2)} ${55 + 38 * Math.sin(a2)}`; }).join("")}Z" fill=#3a9a3a stroke=#1d6f1d stroke-width=3 /></svg>
      <img src="${N}" style="left:18px;top:14px;width:74px;height:76px"></div>`, "left:560px;top:352px;width:110px;height:110px;z-index:9"); pop(par);
    const pl = add(`<div class=lab style="font-size:18px">パセリ</div>`, "left:572px;top:322px;z-index:9");
    await wait(900);
    const tg = add(`<div><svg viewBox="0 0 80 300" style="left:0;top:0;width:100%;height:100%;overflow:visible"><path d="M24 300L34 30Q40 0 46 30L56 300" fill=none stroke=${INK} stroke-width=16 stroke-linecap=round /><path d="M24 300L34 30Q40 0 46 30L56 300" fill=none stroke=#cfd8e0 stroke-width=8 stroke-linecap=round /></svg></div>`, "left:575px;top:200px;width:80px;height:300px;z-index:12;transform-origin:50% 100%");
    const T = (x, y) => ({ transform: `translate(${x}px,${y}px)` });
    await anim(tg, [T(0, -420), T(0, -150)], 600, { easing: "ease-in" }); // 先がパセリに届く位置
    say("ガシッ", 610, 330, { size: 36, color: "#fff", ms: 500 }); pl.remove();
    const both = (a, b, ms) => Promise.all([anim(tg, [T(...a), T(...b)], ms), anim(par, [T(a[0], a[1] + 150), T(b[0], b[1] + 150)], ms)]);
    await wait(250); await both([0, -150], [0, -300], 500);
    zb.innerHTML = zomSvg({ pinch: false, sorry: false }); say("じーっ", 500, 90, { size: 34, color: "#fff", ms: 1100 }); await wait(1200);
    bubble("…パセリは残す派", 500, 130, 1700); await wait(900);
    await both([0, -300], [170, -90], 700);
    await anim(tg, [T(170, -90), T(170, -430)], 450);
    const lb = add(`<div class=lab>皿の外</div>`, "left:760px;top:372px;z-index:12");
    zs.forEach(z => z.innerHTML = zariSvg({ face: "shock", color: "#e32b14", dark: "#a31a0c" })); await wait(2000);
  },

  async i_T39_10() { // 最後に余るハム
    layer("z-index:2;background:linear-gradient(#10182e,#1b2540)");
    add(`<div>マッチング待ち ─ チーム分け</div>`, "left:250px;top:14px;font-size:30px;background:#000a;padding:4px 20px;border-radius:12px;z-index:6;white-space:nowrap");
    const box = (x, col, name) => { add(`<div><div style="left:10px;top:4px;font-size:22px;color:${col}">${name}</div>${[0, 1, 2].map(i => `<div style="left:${15 + i * 95}px;top:56px;width:80px;height:80px;border:3px dashed ${col}88;border-radius:12px"></div>`).join("")}</div>`, `left:${x}px;top:70px;width:300px;height:160px;border:4px solid ${col};background:#0008;border-radius:14px;z-index:3`); };
    box(30, "#ff6a6a", "チームA"); box(630, "#6aa8ff", "チームB");
    const cap = zom(425, 62, 110, { cap: true, clip: true, down: true, z: 15 });
    const zs = [0, 1, 2, 3, 4, 5].map(i => zom(30 + i * 105, 330, 95, { down: true, z: 15 }));
    const h = ham(N);
    await wait(900); chip("マッチング待ち");
    const slot = (team, i) => [(team ? 645 : 45) + i * 95 + 40, 150];
    for (let i = 0; i < 3; i++) {
      bubble("A！", 480, 215, 500); anim(h, [{ transform: "none" }, { transform: "translateY(-30px)" }, { transform: "none" }], 400); say("!", HX + 110, 280, { size: 50, color: "#fff", ms: 400 });
      await wait(250);
      const go = (z, tm, k) => { const [sx, sy] = slot(tm, k), cx = parseFloat(z.style.left) + 47.5, cy = 330 + 62; return anim(z, [{ transform: "none" }, { transform: `translate(${sx - cx}px,${sy - cy}px) scale(.65)` }], 500); };
      go(zs[i * 2], 0, i); await wait(300); bubble("B！", 480, 215, 500); go(zs[i * 2 + 1], 1, i); await wait(900);
    }
    cap.innerHTML = zomSvg({ cap: true, clip: true, sorry: true, down: true }); await wait(300);
    say("…", 480, 260, { size: 50, color: "#fff", ms: 700 }); await wait(900);
    bubble("…見学で", 480, 215, 1800); await wait(900);
    await anim(h, [{ transform: "none" }, { transform: "translate(20px,0) scale(.7,.55)" }], 500);
    ov(h, tears + frown + `<ellipse cx=600 cy=1040 rx=520 ry=130 fill=#fbf5e9 stroke=${INK} stroke-width=14 />`);
    const kn = add(`<div>見学</div>`, `left:${HX + 30}px;top:${HY + 80}px;color:#222;background:#fff8e6;border:4px solid ${INK};padding:2px 14px;font-size:28px;z-index:20;rotate:4deg`); pop(kn);
    add(`<div class=lab>待機画面の端</div>`, "right:14px;top:520px;display:none"); await wait(2200);
  },

  async i_T40_03() { // 陰謀論の赤い糸
    layer("z-index:2;background:#b98a55 radial-gradient(#0002 1.5px,transparent 2px) 0 0/14px 14px;box-shadow:inset 0 0 0 14px #6b4423");
    const h = ham(N);
    const photo = (x, y, inner, cap, rot) => { const p = add(`<div><div style="left:10px;top:12px;width:100px;height:100px;background:linear-gradient(#cfd6dd,#9aa5b0);overflow:hidden">${inner}</div><div style="left:0;right:0;top:118px;text-align:center;font-size:15px;color:#222;white-space:nowrap">${cap}</div><div style="left:50px;top:-6px;width:18px;height:18px;border-radius:50%;background:#d3202a;border:3px solid #7a0e14"></div></div>`,
      `left:${x}px;top:${y}px;width:120px;height:150px;background:#fffdf4;border:3px solid #ddd;box-shadow:3px 5px 0 #0004;z-index:6;rotate:${rot}deg`); pop(p); return p; };
    const em = (e, c) => `<div style="left:0;right:0;top:18px;text-align:center;font-size:56px;color:${c || "#fff"}">${e}</div>`;
    const P = [[50, 70, em("⚡", "#ffd23c"), "空が赤い", -3], [230, 40, em("🐦", "#fff"), "鳩が多い", 2], [420, 80, em("🌙", "#ffe9a8"), "月が大きい", -2],
      [110, 290, zariSvg({ face: "shock" }), "ザリガニ静か", 3], [320, 300, `<div style="left:34px;top:30px">${seedHtml(36)}</div>`, "種が値上げ", -2],
      [540, 250, `<img src="${N}" style="left:-10px;top:-6px;width:120px;height:123px">`, "？？？", 3]];
    const sv = add(`<svg viewBox="0 0 960 540" style="left:0;top:0;width:960px;height:540px;z-index:7"></svg>`);
    const pts = P.map(([x, y]) => [x + 60, y + 3]);
    sv.innerHTML = pts.slice(1).map((p, i) => `<path d="M${pts[i][0]} ${pts[i][1]}L${p[0]} ${p[1]}" stroke=#e0202a stroke-width=4 stroke-dasharray=1000 stroke-dashoffset=1000 fill=none />`).join("");
    await wait(700); chip("3連続でデス"); const eyes = ov(h, whiteEyes + openMouth);
    for (let i = 0; i < 5; i++) {
      photo(...P[i]); say("前兆だ！", 640 + (i % 2) * 40, 200, { size: 38, ms: 600 }); hop(h, 22); await wait(550);
      if (i) { await anim(sv.children[i - 1], [{ strokeDashoffset: 1000 }, { strokeDashoffset: 0 }], 450, { easing: "linear" }); }
    }
    await wait(300); photo(...P[5]); await anim(sv.children[4], [{ strokeDashoffset: 1000 }, { strokeDashoffset: 0 }], 450, { easing: "linear" });
    add(`<div></div>`, "left:538px;top:248px;width:124px;height:154px;border:5px solid #d3202a;border-radius:50%;z-index:9;rotate:3deg"); await wait(500);
    eyes.remove(); ov(h, whiteEyes + frown); say("これが黒幕…", 520, 470, { size: 50, ms: 1300 }); await wait(900);
    const sv2 = add(`<svg viewBox="0 0 960 540" style="left:0;top:0;width:960px;height:540px;z-index:25"><path d="M600 255L830 380" stroke=#e0202a stroke-width=4 stroke-dasharray=1000 stroke-dashoffset=1000 fill=none /></svg>`);
    await anim(sv2.firstChild, [{ strokeDashoffset: 1000 }, { strokeDashoffset: 0 }], 400, { easing: "linear" });
    const wr = ov(h, [0, 1, 2, 3, 4].map(i => `<path d="M80 ${540 + i * 140}Q600 ${470 + i * 140} 1160 ${700 + i * 140}" stroke=#e0202a stroke-width=16 fill=none stroke-linecap=round stroke-dasharray=1500 stroke-dashoffset=1500 />`).join(""));
    for (const p of wr.children) { await anim(p, [{ strokeDashoffset: 1500 }, { strokeDashoffset: 0 }], 220, { easing: "linear" }); }
    anim(h, [-8, 8, -6, 6, 0].map(d => ({ transform: `rotate(${d}deg)` })), 700); await wait(2000);
  },

  async i_T40_06() { // 最後の晩餐、翌朝
    const night = layer("z-index:2;background:linear-gradient(#0e1030,#2a1d4a)", [...Array(18)].map(() => `<div style="left:${rnd(0, 940)}px;top:${rnd(10, 230)}px;font-size:${rnd(10, 24)}px;color:#ffe9a8">✦</div>`).join("")); night.style.opacity = 0;
    const morn = layer("z-index:3;opacity:0;background:linear-gradient(#8fd0ff,#ffe4b0 70%)",
      `<div id=q8sun style="left:400px;top:560px;width:130px;height:130px;border-radius:50%;background:radial-gradient(#fff6c0,#ffc83a);box-shadow:0 0 60px #ffd23c"></div>`);
    const sun = morn.firstChild;
    const h = ham(N);
    await wait(700); chip("試合に敗北"); shake(h); say("やはり終わりだ", 480, 120, { size: 50, ms: 1300 }); anim(night, [{ opacity: 0 }, { opacity: 1 }], 600);
    add(`<div>最後の晩餐</div>`, "left:370px;top:20px;font-size:34px;background:#000a;padding:4px 20px;border-radius:12px;z-index:6;white-space:nowrap");
    const zs = [90, 220, 350, 480].map((x, i) => zari(x, 326, 110, { face: "smile", z: 11 }));
    const tbl = add(`<div></div>`, "left:0;top:442px;width:960px;height:100px;background:linear-gradient(#efe6d0 0 26px,#b5a888 26px);border-top:5px solid #7a6a48;z-index:12");
    add(`<div>🕯️</div>`, "left:575px;top:392px;font-size:46px;z-index:13");
    const cnt = add(`<div class=lab>備蓄の種 ×12</div>`, "right:14px;top:14px;z-index:30;font-size:26px");
    const sack = add(`<div>備蓄</div>`, "left:620px;top:360px;width:100px;height:100px;background:#b98a55;border:4px solid #331c16;border-radius:30% 30% 16% 16%;text-align:center;line-height:100px;font-size:34px;z-index:13");
    pop(sack); await wait(1300);
    const plates = zs.map((z, i) => add(`<div></div>`, `left:${z.offsetLeft + 4}px;top:448px;width:100px;height:22px;border-radius:50%;background:#fafafa;border:4px solid #bbb;z-index:13`));
    const sds = [];
    for (let k = 0; k < 12; k++) { const i = k % 4, sd = seed(640, 360, 20, 14); sds.push([sd, i]);
      anim(sd, [{ transform: "none" }, { transform: `translate(${plates[i].offsetLeft + 40 + (k >> 2) * 14 - 640}px,${-90}px)`, offset: .5 }, { transform: `translate(${plates[i].offsetLeft + 40 + (k >> 2) * 14 - 640}px,${84}px)` }], 600, { delay: k * 90 }); }
    await wait(1900); zs.forEach(z => hop(z, 14)); bubble("いただきます", 220, 260, 1200); await wait(900); chip("晩餐");
    for (let k = 0; k < 12; k++) { sds[k][0].style.display = "none"; cnt.textContent = `備蓄の種 ×${11 - k}`; if (k % 3 === 2) hop(zs[k % 4], 18); await wait(110); }
    sack.style.height = "30px"; sack.style.top = "430px"; sack.style.lineHeight = "30px"; sack.style.fontSize = "22px"; await wait(800);
    chip("翌朝"); const stp = stamp("翌朝", 480, 190, 80); wait(1500).then(() => fade(stp, 300));
    zs.forEach(z => z.innerHTML = zariSvg({ face: "smile" }));
    anim(night, [{ opacity: 1 }, { opacity: 0 }], 1200); anim(morn, [{ opacity: 0 }, { opacity: 1 }], 1200); anim(sun, [{ transform: "none" }, { transform: "translateY(-410px)" }], 1800);
    const bd = add(`<div>🐦</div>`, "left:100px;top:100px;font-size:40px;z-index:5"); anim(bd, [{ transform: "translateX(-200px)" }, { transform: "translateX(900px) translateY(-30px)" }], 2600, { easing: "linear" });
    say("ちゅんちゅん", 300, 120, { size: 36, color: "#fff", ms: 1200 });
    await wait(1800); h.remove(); const h2 = ham(N); h2.style.zIndex = 10; ov(h2, whiteEyes + frown); cnt.textContent = "備蓄の種 ×0";
    say("…備蓄、ゼロ", 500, 220, { size: 54, color: "#ff6a5a", ms: 0 }); await wait(2300);
  },

  async i_T41_03() { // 重ね撮りハム祭り
    const h = ham(N), lab = add(`<div class=lab style="font-size:30px">ループ 0</div>`, "left:14px;top:66px;z-index:40");
    const ghosts = [];
    const addG = k => { const g = add(`<div><img src="${N}" style="width:100%;height:100%"></div>`, `left:${HX - k * 52}px;top:${HY}px;width:${HW}px;height:${HH}px;transform-origin:50% 100%;opacity:.45;filter:hue-rotate(${k * 33}deg);z-index:${9 - Math.min(k, 8)}`); pop(g, 200); ghosts.push(g); };
    let eyes; let loops = 0;
    await wait(700); chip("3連続デス");
    for (const total of [1, 3, 5, 10, 12]) {
      await wait(120); hop(h, 50); await wait(250);
      await anim(h, [{ transform: "none" }, { transform: "rotate(-14deg) translateY(10px)" }], 200); eyes = q8dead(h); say("デス", 560, 230, { color: "#ff6a5a", ms: 400 }); await wait(250);
      const rw = layer("z-index:40;background:repeating-linear-gradient(0deg,#7cf5 0 4px,#0000 4px 9px)"); const ic = say("⏪", 480, 270, { size: 120, color: "#9ff", ms: 0, z: 41 });
      anim(rw, [{ opacity: 0 }, { opacity: 1 }, { opacity: 0 }], 550);
      await wait(250); eyes.remove(); h.img.style.filter = "none"; h.style.transform = "none"; while (ghosts.length < total) addG(ghosts.length + 1);
      loops = total === 12 ? 12 : total; lab.textContent = `ループ ${loops}`; await wait(200); ic.remove(); rw.remove();
    }
    await wait(300); hop(h, 50); await wait(400); eyes = q8dead(h); lab.textContent = "ループ 12";
    const all = [...ghosts.slice().reverse(), h];
    all.forEach((e, i) => anim(e, [{ transform: "none" }, { transform: "rotate(78deg)" }], 420, { delay: i * 55, easing: "ease-in" }));
    await wait(1100); [0, 1, 2, 3, 4, 5].forEach(i => crumb(rnd(500, 900), rnd(430, 520)));
    const n = add(`<div class=t>ループ 13</div>`, "left:480px;top:385px;translate:-50% -50%;font-size:110px;color:#ffd23c;z-index:45");
    anim(n, [{ transform: "translateY(-400px) scale(1.4)" }, { transform: "none", offset: .6 }, { transform: "translateY(-30px)", offset: .78 }, { transform: "none" }], 700, { easing: "ease-in" });
    await wait(700); [0, 1, 2, 3, 4, 5, 6].forEach(i => crumb(rnd(300, 700), rnd(300, 380))); lab.textContent = "ループ 13"; await wait(1500);
  },

  async i_T41_04() { // 戻りすぎた太古
    const h = ham(N);
    const gauge = add(`<div><div style="left:7px;top:7px;width:40px;height:40px;border-radius:50%;background:#123"></div></div>`, "left:450px;top:433px;width:54px;height:54px;border-radius:50%;background:conic-gradient(#ffd23c 0 98%,#345 98%);z-index:6");
    const gl = add(`<div class=lab>ULT 98%</div>`, "left:515px;top:446px;z-index:6;font-size:20px");
    const setG = p => { gauge.style.background = `conic-gradient(#ffd23c 0 ${p}%,#345 ${p}%)`; gl.textContent = `ULT ${p}%`; };
    await wait(800); chip("ウルトゲージが0%に戻った"); shake(h); const eyes = q8dead(h); say("デス", 560, 230, { color: "#ff6a5a", ms: 800 });
    for (const p of [70, 40, 15, 0]) { await wait(160); setG(p); }
    await wait(500); say("戻ってやり直す！", 400, 150, { size: 46, ms: 1100 }); await wait(1300);
    const dial = layer("z-index:30;background:radial-gradient(#2a1050,#050008)"); dial.style.opacity = 0; anim(dial, [{ opacity: 0 }, { opacity: 1 }], 300);
    const ring = add(`<div></div>`, "left:300px;top:90px;width:360px;height:360px;border-radius:50%;border:10px solid #fc3;box-shadow:0 0 40px #fc3;z-index:31", dial);
    const nd = add(`<div></div>`, "left:170px;top:20px;width:12px;height:160px;background:#ff6a5a;border-radius:6px;transform-origin:50% 100%;z-index:32", ring);
    const ticks = add(`<div></div>`, "left:6px;top:6px;right:6px;bottom:6px;border-radius:50%;background:repeating-conic-gradient(#fc3 0 1.5deg,#0000 1.5deg 15deg);-webkit-mask:radial-gradient(circle,#0000 62%,#000 63%);mask:radial-gradient(circle,#0000 62%,#000 63%)", ring);
    add(`<div>年表ダイヤル</div>`, "left:370px;top:30px;font-size:30px;color:#fc3;z-index:32", dial);
    const yr = add(`<div class=t>-1年</div>`, "left:480px;top:330px;translate:-50% -50%;font-size:56px;color:#fff;z-index:33", dial);
    const sp = anim(nd, [{ transform: "rotate(0)" }, { transform: "rotate(5400deg)" }], 2400, { easing: "ease-in-out" }); anim(ticks, [{ transform: "rotate(0)" }, { transform: "rotate(-1800deg)" }], 2400, { easing: "ease-in-out" });
    anim(dial, [{ filter: "hue-rotate(0)" }, { filter: "hue-rotate(360deg)" }], 2400, { easing: "linear" });
    for (const t of ["-100年", "-1万年", "-100万年", "-6,600万年", "-1億年", "-2億5000万年"]) { yr.textContent = t; await wait(380); }
    eyes.remove(); h.img.style.filter = "none";
    chip("戻りすぎ"); const pre = layer("z-index:30;background:linear-gradient(#ff9a4a,#ffd890 55%,#6b8a3a 55%,#4a6a2a)",
      `<div style="left:620px;top:140px;width:0;height:0;border:150px solid transparent;border-bottom:200px solid #5a3a2a;border-top:0"></div><div style="left:716px;top:120px;width:70px;height:40px;border-radius:50%;background:#e03010;box-shadow:0 0 30px #ff6a00"></div>
      <div style="left:60px;top:330px;font-size:70px">🌴</div><div style="left:860px;top:350px;font-size:70px">🌴</div><div style="left:360px;top:420px;font-size:50px">🌿</div>`);
    pre.style.opacity = 0; await anim(pre, [{ opacity: 0 }, { opacity: 1 }], 400); dial.remove(); await wait(150);
    const h2 = ham(R1); h2.style.zIndex = 40; pop(h2, 300);
    const ug = add(`<div><div style="left:7px;top:7px;width:40px;height:40px;border-radius:50%;background:#123"></div></div>`, `left:${HX - 80}px;top:${HY + 120}px;width:54px;height:54px;border-radius:50%;background:conic-gradient(#ffd23c 0 100%,#345 100%);box-shadow:0 0 20px #ffd23c;z-index:41`);
    add(`<div class=lab style="font-size:20px">ULT 100%</div>`, `left:${HX - 150}px;top:${HY + 80}px;z-index:41`);
    say("キメ顔", HX + 112, HY - 20, { size: 36, ms: 1500, z: 42 });
    const dn = add(`<div><svg viewBox="0 0 520 330" style="left:0;top:0;width:100%;height:100%;overflow:visible"><path d="M70 190Q20 200 0 270Q70 250 110 240Z" fill=#6aa84f stroke=${INK} stroke-width=6 stroke-linejoin=round />
      <ellipse cx=200 cy=190 rx=150 ry=88 fill=#6aa84f stroke=${INK} stroke-width=6 /><path d="M250 130Q330 120 350 60L420 80Q390 170 310 200Z" fill=#6aa84f stroke=${INK} stroke-width=6 stroke-linejoin=round />
      <rect x=130 y=240 width=44 height=88 rx=14 fill=#5a9440 stroke=${INK} stroke-width=6 /><rect x=240 y=240 width=44 height=88 rx=14 fill=#5a9440 stroke=${INK} stroke-width=6 />
      <path d="M120 110L140 80L160 108L190 76L210 106L240 78L254 114" fill=#c9482e stroke=${INK} stroke-width=5 stroke-linejoin=round /></svg></div>`, "left:-560px;top:200px;width:520px;height:330px;z-index:38");
    const dh = zari(300, -20, 190, { face: "evil", color: "#4fae4f", dark: "#2f7a2f", parent: dn, z: 3 });
    await wait(500); anim(dn, [{ transform: "none" }, { transform: "translateX(690px)" }], 2000, { easing: "linear" });
    for (let i = 0; i < 5; i++) { await wait(380); anim(dn, [{ translate: "0 0" }, { translate: "0 -14px" }, { translate: "0 0" }], 300); }
    const ln = add(`<div class=lab style="font-size:18px">現代と同じ角度</div>`, "left:560px;top:150px;z-index:42"); await wait(300);
    await anim(dh, [{ transform: "none" }, { transform: "translate(140px,70px) rotate(24deg)" }], 220, { easing: "ease-in" });
    h2.style.visibility = "hidden"; ug.remove(); say("バクッ", 700, 330, { size: 72, color: "#ff6a5a", z: 45, ms: 900 }); [0, 1, 2, 3, 4].forEach(() => flash(600, 900, 300, 450)); await wait(1000); ln.remove();
    const fos = layer("z-index:60", [["#d8c08f", 0], ["#b89a62", 90], ["#9a7a48", 170], ["#7a5a34", 250], ["#5a3e22", 340]].map(([c, y]) => `<div style="left:0;top:${70 + y}px;width:960px;height:${y > 300 ? 200 : 100}px;background:${c};border-top:4px solid ${INK}"></div>`).join("") + `<div style="left:0;top:0;width:960px;height:74px;background:#ffd890"></div><div style="left:260px;top:300px;width:200px;height:205px;filter:sepia(1) brightness(1.15) contrast(.5);opacity:.85"><img src="${N}" style="width:100%;height:100%"></div>`);
    fos.style.opacity = 0; await anim(fos, [{ opacity: 0 }, { opacity: 1 }], 400);
    chip("数億年後"); const sg = add(`<div>ループ<br>9回目</div>`, "left:600px;top:-200px;width:150px;text-align:center;font-size:36px;line-height:1.2;color:#222;background:#fff8e6;border:5px solid #331c16;padding:8px;z-index:62", fos);
    add(`<div></div>`, "left:670px;top:-100px;width:14px;height:260px;background:#8a6a3a;border:3px solid #331c16;z-index:61", fos).style.top = "140px";
    await anim(sg, [{ transform: "translateY(0)" }, { transform: "translateY(480px)" }], 350, { easing: "ease-in" }); sg.style.top = "280px"; sg.style.transform = "none"; shake(sg); crumb(670, 360);
    await wait(2200); await anim(fos, [{ opacity: 1 }, { opacity: 0 }], 500); fos.remove(); pre.remove(); h2.remove(); dn.remove(); await wait(900);
  },
});
}

// q9: 11シーン (やり直し券 / クローン工場 / 探査機ハム / ハム博士)
{
  // ---------- 共通の部品 ----------
  const SV = `style="left:0;top:0;width:100%;height:100%;overflow:visible"`;
  // 作業着のクローンハム (ヘルメットと番号札つき)
  const clone = (x, y, w, n, o = {}) => add(`<div><img src="${N}" style="left:0;top:0;width:100%;height:100%;filter:saturate(.75)">
    <svg viewBox="0 0 1237 1271" ${SV}><path d="M400 235Q600 10 800 235Z" fill=#ffc83a stroke=${INK} stroke-width=18 stroke-linejoin=round /><rect x=360 y=222 width=480 height=44 rx=22 fill=#ffb000 stroke=${INK} stroke-width=16 />
    <path d="M420 700L600 900L820 700" fill=none stroke=${INK} stroke-width=14 /><rect x=350 y=860 width=500 height=220 rx=28 fill=#fff stroke=${INK} stroke-width=16 />
    <text x=600 y=1032 text-anchor=middle font-size=185 font-weight=900 fill=${INK}>#${n}</text></svg></div>`,
    `left:${x}px;top:${y}px;width:${w}px;height:${w * 1271 / 1237}px;z-index:${o.z || 10}`);
  // 探査機ハム (アンテナつき)
  const probe = (x, y, w, parent = s, z = 10) => { const e = add(`<div><img src="${N}" style="left:0;top:0;width:100%;height:100%">
    <svg viewBox="0 0 1237 1271" ${SV}><path d="M600 120V-300" stroke=${INK} stroke-width=30 stroke-linecap=round /><path d="M330 -330Q600 -70 870 -330Z" fill=#dfe5ee stroke=${INK} stroke-width=26 stroke-linejoin=round />
    <circle cx=600 cy=-300 r=36 fill=#ff4a3a stroke=${INK} stroke-width=14 /></svg></div>`,
    `left:${x}px;top:${y}px;width:${w}px;height:${w * 1271 / 1237}px;transform-origin:50% 100%;z-index:${z}`, parent); e.img = e.firstChild; return e; };
  // ハム博士 (学位帽とメガネ)
  const prof = (x, y, w) => add(`<div><img src="${N}" style="left:0;top:0;width:100%;height:100%">
    <svg viewBox="0 0 1237 1271" ${SV}><g fill=#ffffff30 stroke=${INK} stroke-width=18><circle cx=380 cy=488 r=100 /><circle cx=828 cy=488 r=100 /><path d="M480 488H728" fill=none /></g>
    <path d="M300 150L600 20L900 150L600 270Z" fill=#222 stroke=${INK} stroke-width=14 stroke-linejoin=round /><path d="M880 150V300" stroke=#ffd23c stroke-width=16 /></svg></div>`,
    `left:${x}px;top:${y}px;width:${w}px;height:${w * 1271 / 1237}px;transform-origin:50% 100%;z-index:11`);
  const sign = (txt, x, y) => add(`<div><div style="left:0;top:0;width:104px;height:34px;background:#fff;border:3px solid ${INK};color:${INK};font-size:19px;line-height:28px;text-align:center;white-space:nowrap">${txt}</div><div style="left:50px;top:34px;width:5px;height:34px;background:${INK}"></div></div>`,
    `left:${x}px;top:${y}px;width:104px;height:68px;z-index:16`);
  const sparkTo = (el, ms) => anim(el, [{ transform: "scale(1)" }, { transform: "scale(1.25)" }, { transform: "scale(1)" }], ms || 260);
  const stars = (n, h = 540) => { for (let i = 0; i < n; i++) add(`<div></div>`, `left:${rnd(0, 950)}px;top:${rnd(0, h)}px;width:${rnd(2, 5)}px;height:${rnd(2, 5)}px;border-radius:50%;background:#fff;opacity:${rnd(.4, 1)};z-index:3`); };
  // 講堂 (ハム博士シーン用)
  const hall = () => {
    layer(`background:linear-gradient(90deg,#5a1f2a,#7a2a38 14%,#2b2438 14% 86%,#7a2a38 86%,#5a1f2a);z-index:2`);
    layer(`top:430px;height:110px;background:#5a3a2a;z-index:3`);
    label("🎓 ハム学会", "right:16px;top:14px;font-size:20px");
    add(`<div><div style="left:0;right:0;top:20px;text-align:center;font-size:24px;color:#ffd23c">ハム学会</div></div>`, `left:690px;top:470px;width:250px;height:80px;background:#6a4a2a;border:5px solid ${INK};z-index:12`);
    return add(`<div></div>`, `left:30px;top:70px;width:600px;height:340px;background:#fff;border:8px solid #333;color:${INK};z-index:8`);
  };
  const slideSvg = (sl, inner) => add(`<svg viewBox="0 0 584 324" style="left:0;top:0;width:584px;height:324px;font-weight:900;font-family:inherit">${inner}</svg>`, "", sl);
  const redCircle = (e, ms = 500) => { e.style.opacity = 1; return anim(e, [{ strokeDashoffset: 1 }, { strokeDashoffset: 0 }], ms, { easing: "linear" }); };

  Object.assign(scenes, {
    // ---------- T41-08 やり直し券の無限 ----------
    async i_T41_08() {
      const h = ham(N);
      label("ハムの寿命", "right:16px;top:14px;font-size:20px");
      const bar = add(`<div><div style="left:0;top:0;height:100%;width:100%;background:#4ddc6a;transition:width .45s,background .45s"></div></div>`, `right:16px;top:52px;width:240px;height:24px;background:#222;border:3px solid #fff;border-radius:12px;overflow:hidden;z-index:15`);
      const fill = bar.firstChild;
      const cnt = label("巻き戻し 0回", "left:14px;top:66px;font-size:20px");
      const tk = add(`<div>🎫 やり直し券 ×1</div>`, `left:${HX - 250}px;top:${HY + 60}px;padding:8px 16px;background:#ffd23c;color:${INK};border:4px dashed ${INK};border-radius:10px;font-size:24px;white-space:nowrap;z-index:20;rotate:-4deg`);
      await wait(900); chip("チャネポ やり直し券を交換"); pop(tk); hop(h, 40);
      say("タダで使い放題！", 480, 220, { size: 44, ms: 1100 }); await wait(1300);
      const lines = ["もう一回！", "券は減らない！", "まだ使える！", "天才かも", "最後にもう一回"], pct = [78, 56, 34, 14, 0];
      for (let i = 0; i < 5; i++) {
        say(lines[i], 480, 215, { size: 40, ms: 650, color: "#fff" });
        await anim(tk, [{ transform: "scale(1)" }, { transform: "scale(1.3) rotate(8deg)" }], 260);
        const rw = layer(`z-index:40;background:repeating-linear-gradient(#0000 0 5px,#0006 5px 8px),#6a50203a`);
        const rt = add(`<div class=t>⏪ 巻き戻し</div>`, `left:480px;top:270px;translate:-50% -50%;font-size:64px;color:#fff;z-index:41`);
        tk.style.opacity = 0;
        anim(rt, [{ transform: "scale(1.6)", opacity: 0 }, { transform: "scale(1)", opacity: 1 }], 200);
        await anim(rw, [{ opacity: 0 }, { opacity: 1 }, { opacity: 1 }, { opacity: 0 }], 650);
        rw.remove(); rt.remove();
        fill.style.width = pct[i] + "%"; fill.style.background = pct[i] > 50 ? "#4ddc6a" : pct[i] > 25 ? "#f0c030" : "#e84030";
        cnt.textContent = `巻き戻し ${i + 1}回`;
        h.img.style.filter = `grayscale(${(i + 1) * .2}) sepia(${(i + 1) * .1})`;
        tk.style.opacity = 1; pop(tk); say("券 ×1 のまま", 480, 330, { size: 30, ms: 600, color: "#fff" });
        if (i < 4) { hop(h, 30); await wait(650); } else await wait(450);
      }
      h.img.style.filter = "grayscale(1) brightness(1.5)"; h.style.transform = "rotate(6deg)";
      await anim(tk, [{ left: `${HX - 250}px`, top: `${HY + 60}px` }, { left: `${HX - 50}px`, top: `${HY + 120}px` }], 400);
      say("寿命 0", 590, 250, { size: 46, ms: 0, color: "#9db4d8" });
      await wait(900); say("券は、まだ1枚。", 400, 160, { size: 54, ms: 0, color: "#fff" });
      await anim(tk, [{ transform: "scale(1)" }, { transform: "scale(1.12)" }, { transform: "scale(1)" }], 700, { iterations: 2 });
      await wait(1000);
    },

    // ---------- T42-04 人間大砲ウルト ----------
    async i_T42_04() {
      layer(`background:linear-gradient(#070b24,#1a2250 74%,#27552f 74%);z-index:2`); stars(28, 380);
      add(`<div></div>`, "left:640px;top:440px;width:110px;height:56px;border-radius:50%;background:#f4a7b9;border:4px solid #331c16;z-index:9");
      const king = pic(R2, 720, 330, 200, "z-index:10;transform:rotate(-80deg)");
      const zz = add(`<div class=t>💤</div>`, "left:640px;top:400px;font-size:36px;z-index:11;-webkit-text-stroke:0");
      const rem = add(`<div><div style="left:34px;top:6px;width:12px;height:12px;border-radius:50%;background:#e22"></div></div>`, "left:620px;top:470px;width:62px;height:24px;background:#334;border:3px solid #331c16;border-radius:6px;z-index:12");
      const cn = add(`<svg viewBox="0 0 240 200"><g transform="rotate(-48 90 140)"><rect x=40 y=100 width=170 height=80 rx=16 fill=#667 stroke=${INK} stroke-width=6 /><rect x=190 y=92 width=30 height=96 rx=10 fill=#8890a0 stroke=${INK} stroke-width=6 /></g>
        <circle cx=90 cy=160 r=40 fill=#6a4a2a stroke=${INK} stroke-width=6 /><circle cx=90 cy=160 r=10 fill=#c9975c stroke=${INK} stroke-width=4 /><path d="M90 120V200M50 160H130M62 132L118 188M118 132L62 188" stroke=${INK} stroke-width=4 /></svg>`, "left:240px;top:290px;width:240px;height:200px;z-index:14");
      add(`<svg viewBox="0 0 960 540"><path d="M300 468Q262 470 252 498T205 522" fill=none stroke=#c9a35a stroke-width=5 stroke-dasharray="3 5" /></svg>`, "left:0;top:0;width:960px;height:540px;z-index:13");
      const c = clone(95, 385, 100, 52, { z: 12 });
      await wait(900); chip("ウルトを発動");
      say("ウルト、いくよ〜", 500, 130, { size: 40, color: "#fff", ms: 1100 });
      await wait(500); anim(rem, [{ transform: "scale(1)" }, { transform: "scale(1.2)" }, { transform: "scale(1)" }], 250);
      say("ポチ", 650, 440, { size: 32, color: "#fff", ms: 700 }); zz.remove();
      await wait(450);
      await anim(c, [{ transform: "none" }, { transform: "translate(130px,-130px) rotate(-20deg)", offset: .5 }, { transform: "translate(262px,-90px) rotate(0)" }], 650, { easing: "linear" });
      await anim(c, [{ transform: "translate(262px,-90px) scale(1)", opacity: 1 }, { transform: "translate(230px,-60px) scale(.55)", opacity: 0 }], 330);
      say("#52、装填！", 330, 250, { size: 36, ms: 800, color: "#fff" });
      await wait(700);
      const sp = add(`<div class=t>✦</div>`, "left:200px;top:500px;font-size:30px;color:#ffd23c;z-index:15");
      await anim(sp, [{ transform: "translate(0,0)" }, { transform: "translate(50px,-22px)" }, { transform: "translate(100px,-34px)" }], 800, { easing: "linear" }); sp.remove();
      say("ドーン！", 380, 380, { size: 60, color: "#ffd23c", ms: 700 }); anim(cn, [{ transform: "none" }, { transform: "translateX(-16px)" }, { transform: "none" }], 300);
      const fl = clone(360, 290, 100, 52, { z: 16 }); fl.style.filter = "brightness(1.1)";
      const trail = setInterval(() => flash(300, 600, 80, 360, "#ffd23c"), 120);
      await anim(fl, [{ transform: "none" }, { transform: "translate(60px,-160px) rotate(300deg) scale(.8)", offset: .45 }, { transform: "translate(160px,-320px) rotate(720deg) scale(.5)" }], 1000, { easing: "ease-out" });
      clearInterval(trail); fl.remove();
      const ex = 560, ey = 90;
      const ring = add(`<div></div>`, `left:${ex - 20}px;top:${ey - 20}px;width:40px;height:40px;border-radius:50%;background:#fff;z-index:25`);
      anim(ring, [{ transform: "scale(.2)", opacity: 1 }, { transform: "scale(9)", opacity: 0 }], 600).then(() => ring.remove());
      for (let i = 0; i < 24; i++) { const a = i / 24 * 6.28, r = rnd(110, 230), col = ["#ff5a4a", "#ffd23c", "#7dff8a", "#7cc4ff", "#fff"][i % 5];
        const p = add(`<div></div>`, `left:${ex}px;top:${ey}px;width:12px;height:12px;border-radius:50%;background:${col};z-index:24`);
        anim(p, [{ transform: "none" }, { transform: `translate(${Math.cos(a) * r}px,${Math.sin(a) * r}px)`, offset: .6 }, { transform: `translate(${Math.cos(a) * r * 1.15}px,${Math.sin(a) * r * 1.15 + 80}px)`, opacity: 0 }], 1100).then(() => p.remove()); }
      say("ウルト成功", ex, 170, { size: 78, color: "#ffd23c", ms: 2200 });
      for (let i = 0; i < 6; i++) { const f = add(`<div>✿</div>`, `left:${ex - 190 + i * 76}px;top:${230 + (i % 2) * 20}px;font-size:34px;color:#ff9ac8;z-index:26`); anim(f, [{ transform: "scale(0)" }, { transform: "scale(1.2)" }, { transform: "scale(1)", opacity: 0 }], 1500, { delay: i * 90 }).then(() => f.remove()); }
      await wait(500);
      for (let i = 0; i < 7; i++) { const t = add(`<div>#52</div>`, `left:${ex - 40 + rnd(-60, 60)}px;top:${ey + 20}px;width:54px;height:28px;background:#fff;border:3px solid ${INK};color:${INK};font-size:16px;line-height:22px;text-align:center;z-index:20`);
        const dx = rnd(-170, 170), ty = 430 + rnd(0, 55);
        anim(t, [{ transform: "none" }, { transform: `translate(${dx * .4}px,${(ty - ey) * .3}px) rotate(70deg)`, offset: .3 }, { transform: `translate(${dx * .8}px,${(ty - ey) * .6}px) rotate(-60deg)`, offset: .65 }, { transform: `translate(${dx}px,${ty - ey}px) rotate(${rnd(-25, 25)}deg)` }], 2300, { delay: i * 150, easing: "linear" }); }
      await wait(1500);
      bubble("きれいだねー", 790, 270, 0); const cl = add(`<div>👏</div>`, "left:660px;top:380px;font-size:46px;z-index:14");
      anim(cl, [{ transform: "scale(1)" }, { transform: "scale(1.4)" }, { transform: "scale(1)" }], 300, { iterations: 4 });
      await wait(1800);
    },

    // ---------- T42-06 検品で規格外 ----------
    async i_T42_06() {
      layer(`background:linear-gradient(#26283a,#26283a 70%,#3a3d52 70%);z-index:2`);
      add(`<div></div>`, "left:0;top:494px;width:690px;height:22px;background:repeating-linear-gradient(90deg,#333 0 24px,#444 24px 48px);border-top:4px solid #111;z-index:3");
      const king = pic(R2, 775, 300, 185, "z-index:10");
      const cnt = label("規格外 0", "right:16px;top:14px;font-size:22px"), box = add(`<div><div style="left:0;right:0;top:34px;text-align:center;font-size:17px;color:${INK}">規格外</div></div>`, "left:12px;top:424px;width:90px;height:72px;background:#c9975c;border:4px solid #331c16;z-index:11");
      const xs = [110, 250, 390, 530], ns = [71, 72, 73, 74], cl = xs.map((x, i) => clone(x, 372, 120, ns[i]));
      const light = add(`<div>🔦</div>`, "left:748px;top:410px;font-size:46px;z-index:14");
      const bsvg = add(`<svg viewBox="0 0 960 540"><polygon points="0,0 0,0 0,0" fill=#fff /></svg>`, "left:0;top:0;width:960px;height:540px;z-index:13;pointer-events:none"), poly = bsvg.firstChild;
      const beam = (tx, ty, col, op = .42) => { const sx = 770, sy = 432, dx = tx - sx, dy = ty - sy, L = Math.hypot(dx, dy), nx = -dy / L * 34, ny = dx / L * 34;
        poly.setAttribute("points", `${sx},${sy} ${tx + nx},${ty + ny} ${tx - nx},${ty - ny}`); poly.setAttribute("fill", col); poly.style.opacity = op; };
      await wait(900); chip("試合に敗北"); say("検品、始めまーす", 440, 150, { size: 42, color: "#fff", ms: 1100 });
      await wait(1300); let n = 0;
      for (let k = 0; k < 4; k++) {
        const e = cl[k], cx = xs[k] + 60, bad = k % 2 === 1;
        beam(cx, 430, "#fff"); anim(light, [{ transform: "rotate(-6deg)" }, { transform: "none" }], 200);
        await wait(550);
        if (!bad) { beam(cx, 430, "#7dff8a", .5); const ok = add(`<div class=t>OK</div>`, `left:${cx - 24}px;top:${340}px;font-size:30px;color:#7dff8a;z-index:15`); pop(ok); await wait(650); ok.remove(); poly.style.opacity = 0; }
        else {
          beam(cx, 430, "#ff3030", .55); anim(e, [-8, 8, -6, 6, 0].map(v => ({ transform: `translateX(${v}px)` })), 320, { easing: "linear" });
          say("ピー!", 700, 330, { size: 40, color: "#ff5a4a", ms: 500 }); await wait(400);
          const st = add(`<div>規格外</div>`, `left:50%;top:14%;translate:-50% 0;rotate:-8deg;color:#d3202a;border:3px solid #d3202a;background:#fffd;border-radius:6px;padding:0 8px;font-size:20px;white-space:nowrap;z-index:5`, e);
          anim(st, [{ transform: "scale(3)", opacity: 0 }, { transform: "none", opacity: 1 }], 140, { easing: "ease-in" }); await wait(450); poly.style.opacity = 0;
          const dx = 56 - cx;
          await anim(e, [{ transform: "none" }, { transform: `translate(${dx / 2}px,-170px) rotate(-160deg) scale(.7)`, offset: .5 }, { transform: `translate(${dx}px,30px) rotate(-340deg) scale(.3)`, opacity: .2 }], 800, { easing: "linear" });
          e.remove(); sparkTo(box, 220); cnt.textContent = `規格外 ${++n}`; await wait(300);
        }
      }
      await wait(500);
      say("最後に自分も…", 600, 180, { size: 36, color: "#fff", ms: 1100 }); await wait(500);
      anim(light, [{ transform: "none" }, { transform: "scaleX(-1) rotate(-10deg)" }], 220); await wait(300);
      const glow = add(`<div></div>`, `left:765px;top:290px;width:200px;height:205px;border-radius:46%;background:radial-gradient(#ff3030cc,#ff303040 70%,#0000);z-index:12`);
      anim(glow, [{ opacity: 0 }, { opacity: 1 }], 200); king.style.filter = "drop-shadow(0 0 14px #f22) saturate(.9)";
      say("ピー!", 700, 330, { size: 44, color: "#ff5a4a", ms: 700 }); cnt.textContent = `規格外 ${n + 1}`; await wait(1500);
      glow.remove(); king.style.filter = "none";
      await anim(light, [{ transform: "scaleX(-1) rotate(-10deg)", opacity: 1 }, { transform: "scaleX(-1) translate(30px,40px) scale(.2)", opacity: 0 }], 450);
      bubble("……", 860, 258, 0); await wait(1800);
    },

    // ---------- T42-07 分け前は穴だけ ----------
    async i_T42_07() {
      layer(`background:linear-gradient(#232a40,#232a40 80%,#3a4160 80%);z-index:2`);
      const king = pic(R2, 775, 300, 185, "z-index:10");
      const wal = add(`<div>👛</div>`, "left:680px;top:412px;font-size:72px;z-index:12;transform-origin:50% 100%");
      add(`<svg viewBox="0 0 960 540"><path d="M60 150H730V420" fill=none stroke=#aab6d8 stroke-width=34 stroke-linecap=round stroke-linejoin=round opacity=.55 /><path d="M60 150H730V420" fill=none stroke=#556 stroke-width=4 transform="translate(0,-17)" opacity=0 /></svg>`, "left:0;top:0;width:960px;height:540px;z-index:6");
      const xs = [40, 180, 320, 460], cl = xs.map((x, i) => clone(x, 372, 120, 61 + i));
      await wait(900); chip("ビッツ（投げ銭）が入る");
      const holes = [];
      const ring = `<svg viewBox="0 0 100 100" ${SV}><path fill-rule=evenodd d="M4 50a46 46 0 1 0 92 0a46 46 0 1 0-92 0ZM33 50a17 17 0 1 0 34 0a17 17 0 1 0-34 0Z" fill=#ffd23c stroke=${INK} stroke-width=6 /></svg>`;
      await Promise.all(xs.map(async (x, i) => {
        await wait(i * 480); const cx = x + 60;
        const coinW = 58, g = add(`<div>${ring}</div>`, `left:${cx - coinW / 2}px;top:-60px;width:${coinW}px;height:${coinW}px;z-index:9`);
        const hole = add(`<div></div>`, `left:${cx - 10}px;top:-41px;width:20px;height:20px;border-radius:50%;border:3px dashed #fff;background:#cfe8ff40;z-index:8`);
        await anim(g, [{ transform: "none" }, { transform: "translateY(210px)" }], 600, { easing: "ease-in" });
        anim(hole, [{ transform: "none" }, { transform: "translateY(210px)" }], 600, { easing: "ease-in" });
        const tx = 730 - cx + coinW / 2 - coinW / 2;
        await anim(g, [{ transform: "translateY(210px)" }, { transform: `translate(${730 - cx}px,210px)`, offset: .62 }, { transform: `translate(${730 - cx}px,${440 - 60 - 15}px) scale(.6)`, opacity: .9 }], 1100, { easing: "linear", delay: 0 });
        g.remove(); say("チャリン", 700, 380, { size: 30, ms: 500, color: "#ffd23c" });
        wal.style.fontSize = `${72 + (i + 1) * 12}px`; wal.style.top = `${412 - (i + 1) * 12}px`; wal.style.left = `${680 - (i + 1) * 6}px`; sparkTo(wal, 240);
        await anim(hole, [{ transform: "translateY(210px)" }, { transform: "translateY(380px)" }], 450, { easing: "ease-in" });
        holes[i] = hole; hole.style.zIndex = 12; sparkTo(cl[i], 200);
      }));
      await wait(500); say("届いたのは…", 330, 200, { size: 42, color: "#fff", ms: 1000 });
      await wait(1000);
      await Promise.all(holes.map((hh, i) => { const cx = xs[i] + 60;
        return anim(hh, [{ transform: "translateY(380px)" }, { transform: `translateY(451px) scale(3)` }], 450).then(() => {
          const pr = add(`<div>🙏</div>`, `left:${cx - 20}px;top:322px;font-size:34px;z-index:20`); pop(pr); }); }));
      say("空気", 300, 300, { size: 34, color: "#cfe8ff", ms: 900 });
      await wait(900); say("ありがたい…", 300, 190, { size: 58, color: "#ffd23c", ms: 0 });
      for (const c of cl) anim(c, [{ transform: "none" }, { transform: "translateY(10px) rotate(4deg)" }, { transform: "none" }], 500, { iterations: 2 });
      await wait(2200);
    },

    // ---------- T42-09 本物はどれだ ----------
    async i_T42_09() {
      layer(`background:linear-gradient(#3a3350,#3a3350 72%,#554a68 72%);z-index:2`);
      const xs = [30, 160, 290, 420, 550], ns = [85, 86, 87, 88, 89], cl = xs.map((x, i) => clone(x, 388, 110, ns[i]));
      const void_ = add(`<div></div>`, "left:790px;top:330px;width:140px;height:80px;border-radius:50%;background:#1c1210;z-index:9");
      const kt = pic(R2, 770, 310, 185, "z-index:10;clip-path:inset(0 0 60% 0);transform-origin:50% 40%"), kb = pic(R2, 770, 310, 185, "z-index:10;clip-path:inset(40% 0 0 0)");
      const ksgn = sign("本物です", 810, 255); ksgn.style.opacity = 0;
      const sg = xs.map(x => { const e = sign("本物です", x + 3, 322); e.style.opacity = 0; return e; });
      const zs = [30, 170, 310].map(x => zari(x, 70, 62, { face: "smile", z: 17 }));
      const lines = add(`<svg viewBox="0 0 960 540"><g stroke=#ffd23c stroke-width=4 stroke-dasharray="10 8" fill=none opacity=.9>${[0, 1, 2].map(i => `<line id=pl${i} x1=${zs[i] ? 61 + [0, 140, 280][i] : 0} y1=140 x2=860 y2=390 />`).join("")}</g></svg>`, "left:0;top:0;width:960px;height:540px;z-index:14;opacity:0");
      const pl = [0, 1, 2].map(i => lines.querySelector(`#pl${i}`));
      await wait(900); chip("チャットで「本物？」");
      for (let i = 0; i < 3; i++) { pop(zs[i]); bubble("本物？", 61 + i * 140, 140, 2400); await wait(300); }
      await wait(1000);
      for (const e of sg) { e.style.opacity = 1; anim(e, [{ transform: "translateY(80px)" }, { transform: "none" }], 220); }
      say("本物です", 330, 260, { size: 44, color: "#fff", ms: 900 }); await wait(500);
      ksgn.style.opacity = 1; await anim(ksgn, [{ transform: "translateY(60px) rotate(20deg)" }, { transform: "none" }], 500);
      await wait(400); lines.style.opacity = 1; anim(lines, [{ opacity: 0 }, { opacity: 1 }], 300); await wait(1000);
      say("やっぱりあの王冠…", 640, 190, { size: 36, color: "#fff", ms: 1000 }); await wait(900);
      ksgn.remove(); anim(kt, [{ transform: "none" }, { transform: "translate(-30px,-70px) rotate(-30deg)" }], 400); await wait(300);
      say("からっぽ！", 700, 200, { size: 54, color: "#ffd23c", ms: 1100 }); await wait(1300);
      const spot = add(`<svg viewBox="0 0 960 540"><polygon points="445,0 505,0 570,500 380,500" fill=#ffe9a0 /></svg>`, "left:0;top:0;width:960px;height:540px;z-index:8;opacity:0");
      anim(spot, [{ opacity: 0 }, { opacity: .35 }], 400);
      pl.forEach(l => { l.setAttribute("x2", 475); l.setAttribute("y2", 410); }); await wait(500);
      const real = cl[3]; fade(sg[3], 300);
      const lb = add(`<div>★ 本物</div>`, "left:475px;top:200px;translate:-50% 0;background:#ffd23c;color:#331c16;border:4px solid #331c16;border-radius:10px;padding:2px 14px;font-size:26px;white-space:nowrap;z-index:20"); pop(lb);
      await wait(900); bubble("あれ、何番だっけ", 475, 258, 0);
      anim(real, [{ transform: "rotate(-6deg)" }, { transform: "rotate(6deg)" }, { transform: "rotate(-6deg)" }], 600, { iterations: 3 });
      await wait(2400);
    },

    // ---------- T43-06 負けは箱に隠す ----------
    async i_T43_06() {
      layer(`z-index:2;background:linear-gradient(#e8d9b0,#e8d9b0 74%,#b8b67a 74%)`);
      add(`<div></div>`, "left:30px;top:60px;width:400px;height:350px;background:#7a4a28;border:5px solid #331c16;z-index:3");
      add(`<div></div>`, "left:40px;top:70px;width:380px;height:330px;background:#d9c9a0;border:3px solid #331c16;z-index:4");
      add(`<div></div>`, "left:40px;top:238px;width:380px;height:10px;background:#9a7040;z-index:5");
      const dl = add(`<div><div style="left:160px;top:150px;width:12px;height:36px;background:#7a4a28"></div></div>`, "left:40px;top:70px;width:190px;height:330px;background:#f1ead6;border:4px solid #7a4a28;z-index:9");
      const dr = add(`<div><div style="left:18px;top:150px;width:12px;height:36px;background:#7a4a28"></div></div>`, "left:230px;top:70px;width:190px;height:330px;background:#f4eddb;border:4px solid #7a4a28;z-index:10");
      const h = ham(N); const fr = ov(h, frown);
      const card = add(`<div>敗北</div>`, `left:520px;top:250px;width:140px;height:74px;background:#fff;border:4px solid ${INK};color:#d3202a;font-size:48px;line-height:66px;text-align:center;rotate:-6deg;z-index:15`);
      const box = add(`<div><div style="left:0;right:0;top:34px;text-align:center;font-size:15px;color:${INK}">観測しない</div></div>`, "left:490px;top:420px;width:130px;height:76px;background:#c9975c;border:4px solid #331c16;z-index:12");
      const lid = add(`<div></div>`, "left:484px;top:402px;width:142px;height:20px;background:#d9a76c;border:4px solid #331c16;transform-origin:0 100%;z-index:13;rotate:-70deg");
      await wait(700); chip("試合に敗北"); pop(card); shake(h); await wait(600);
      bubble("観測しなければ負けてない", 560, 190, 1100); await wait(1100);
      await anim(card, [{ transform: "none" }, { transform: "translate(0,130px) scale(.4) rotate(40deg)", opacity: .4 }], 500, { easing: "ease-in" }); card.remove();
      await anim(lid, [{ transform: "none" }, { transform: "rotate(70deg)" }], 250); lid.style.rotate = "0deg"; lid.style.transform = "none";
      await wait(300);
      bubble("押し入れにしまっとこ", 560, 330, 900); await wait(700);
      const grp = [box, lid];
      await Promise.all(grp.map(e => anim(e, [{ transform: "none" }, { transform: "translate(-270px,-20px)" }], 800, { easing: "linear" })));
      await anim(dr, [{ transform: "none" }, { transform: "translateX(-190px)" }], 350);
      await Promise.all(grp.map(e => anim(e, [{ transform: "translate(-270px,-20px)" }, { transform: "translate(-270px,-130px)" }], 400)));
      grp.forEach(e => { e.style.zIndex = 8; });
      await anim(dr, [{ transform: "translateX(-190px)" }, { transform: "none" }], 350); await wait(500);
      const zs = [250, 330, 410].map((x, i) => { const z = zari(x, 380, 80, { face: "smile", z: 14 }); z.style.rotate = "8deg"; return z; });
      await Promise.all(zs.map(z => anim(z, [{ transform: "translateX(500px)" }, { transform: "none" }], 700)));
      chip("観測しなければ負けてない"); const ear = add(`<div>👂</div>`, "left:380px;top:230px;font-size:36px;z-index:20"); pop(ear);
      await wait(600);
      say("ぼくは勝った……", 230, 160, { size: 28, color: "#d8e2f5", ms: 1000 }); await wait(1100);
      say("勝った……", 230, 120, { size: 24, color: "#c5d0e8", ms: 900 }); await wait(900);
      say("勝っ…た…", 230, 90, { size: 20, color: "#b5c0d8", ms: 800 }); await wait(800);
      ear.remove(); chip("ふたを開ける");
      await anim(dr, [{ transform: "none" }, { transform: "translateX(-190px)" }], 350);
      const water = add(`<div></div>`, "left:260px;top:222px;width:150px;height:30px;border-radius:50%;background:#7cc4ff;z-index:11;opacity:.8");
      anim(water, [{ transform: "scale(.2)" }, { transform: "scale(1.5,1.3)" }], 900);
      const wc = add(`<div>敗北</div>`, `left:300px;top:150px;width:100px;height:46px;background:#cfe8ff;border:3px solid ${INK};color:#4a78b8;font-size:30px;line-height:40px;text-align:center;z-index:12`);
      anim(wc, [{ transform: "translateY(60px) scale(.3)" }, { transform: "none" }], 400);
      anim(wc, [{ translate: "0 0", rotate: "-5deg" }, { translate: "0 8px", rotate: "5deg" }, { translate: "0 0", rotate: "-5deg" }], 900, { iterations: 3, delay: 400 });
      for (let i = 0; i < 6; i++) { const d = add(`<div></div>`, `left:${270 + i * 28}px;top:112px;width:10px;height:14px;border-radius:50% 50% 50% 50%/60% 60% 40% 40%;background:#7cc4ff;z-index:12`);
        anim(d, [{ transform: "none" }, { transform: "translateY(120px)", opacity: 0 }], 700, { delay: i * 160, iterations: 3 }); }
      zs.forEach(z => { z.innerHTML = zariSvg({ face: "shock" }); anim(z, [{ transform: "none" }, { transform: "translateY(-14px)" }, { transform: "none" }], 300); });
      await wait(700); fr.remove(); ov(h, tears);
      say("敗北だけ", 700, 170, { size: 60, color: "#9db4d8", ms: 0 }); await wait(1500);
    },

    // ---------- T44-02 赤ランプにテープ ----------
    async i_T44_02() {
      layer(`background:linear-gradient(#1c2540,#1c2540 80%,#2a2f4a 80%);z-index:2`);
      const scr = add(`<div></div>`, "left:230px;top:50px;width:500px;height:290px;border:10px solid #667;border-radius:14px;overflow:hidden;background:linear-gradient(#2a1630,#7a3a2e 60%,#5a2e22 60%);z-index:8");
      add(`<div>打ち上げから 32年</div>`, "left:10px;top:8px;font-size:18px;background:#000a;padding:2px 10px;border-radius:6px;white-space:nowrap;z-index:6", scr);
      const lamp = add(`<div></div>`, "left:790px;top:64px;width:76px;height:76px;border-radius:50%;background:#4a1414;border:6px solid #667;z-index:9");
      add(`<div>通信</div>`, "left:790px;top:146px;width:76px;text-align:center;font-size:18px;z-index:9");
      const pr = probe(190, 66, 120, scr, 3);
      const rock = add(`<svg viewBox="0 0 150 110"><path d="M10 100Q0 50 30 30Q60 0 100 14Q140 30 146 100Z" fill=#8a8a96 stroke=${INK} stroke-width=5 /><path d="M40 50Q55 40 70 50M90 40Q100 36 110 44" fill=none stroke=#5a5a66 stroke-width=4 /></svg>`, "left:165px;top:-130px;width:150px;height:110px;z-index:4", scr);
      const noise = add(`<div></div>`, "left:0;top:0;width:100%;height:100%;background:repeating-linear-gradient(#fff6 0 3px,#0006 3px 6px);z-index:7;opacity:0", scr);
      const ds = add(`<div></div>`, "left:0;top:440px;width:960px;height:100px;background:#3a3f5c;border-top:6px solid #111;z-index:16");
      const zs = [[120, "sad", "glasses"], [400, "smile", "tie"], [660, "sad", ""]].map(([x, f, a]) => zari(x, 380, 110, { face: f, acc: a, z: 15 }));
      zs[0].style.rotate = "16deg"; zs[2].style.rotate = "-16deg"; zs[1].style.rotate = "10deg";
      const z1 = add(`<div>💤</div>`, "left:130px;top:360px;font-size:30px;z-index:17"), z2 = add(`<div>💤</div>`, "left:700px;top:360px;font-size:30px;z-index:17");
      await wait(1000); chip("デスして画面が暗転");
      await anim(rock, [{ transform: "none" }, { transform: "translateY(230px)" }], 450, { easing: "ease-in" });
      anim(pr, [{ transform: "none" }, { transform: "scaleY(.1)" }], 120, { easing: "linear" });
      say("ドスン", 480, 280, { size: 40, color: "#fff", ms: 700 });
      noise.style.opacity = 1; const nz = noise.animate([{ backgroundPosition: "0 0" }, { backgroundPosition: "0 24px" }], { duration: 120, iterations: Infinity });
      const lost = add(`<div>通信途絶</div>`, "left:100px;top:100px;font-size:50px;color:#f33;white-space:nowrap;z-index:8;-webkit-text-stroke:0", scr);
      lamp.style.background = "#ff2a2a"; lamp.style.boxShadow = "0 0 40px #f22";
      const bl = lamp.animate([{ opacity: 1 }, { opacity: .3 }], { duration: 300, iterations: Infinity, direction: "alternate" });
      say("ビーッ ビーッ", 790, 200, { size: 28, color: "#ff5a4a", ms: 1800 });
      await wait(1900);
      anim(zs[1], [{ transform: "none" }, { transform: "translateY(-10px)" }], 250); zs[1].style.rotate = "0deg";
      await wait(300); bubble("あ、終わったか", 400, 330, 1500); await wait(1300);
      const tape = add(`<div></div>`, "left:778px;top:84px;width:100px;height:36px;background:#111;border-radius:3px;rotate:-10deg;z-index:12");
      await anim(tape, [{ transform: "translate(-338px,296px) rotate(200deg) scale(.5)" }, { transform: "translate(-120px,-60px) rotate(60deg)", offset: .6 }, { transform: "none" }], 700);
      bl.cancel(); lamp.style.opacity = 1; lamp.style.boxShadow = "none"; lamp.style.background = "#4a1414";
      say("ペタッ", 790, 40, { size: 36, color: "#fff", ms: 800 }); await wait(1200);
      nz.cancel(); noise.style.opacity = 0; lost.remove();
      await anim(rock, [{ transform: "translateY(230px)" }, { transform: "translate(220px,235px) rotate(40deg)" }], 400);
      await anim(pr, [{ transform: "scaleY(.1)" }, { transform: "scaleY(1.2)" }, { transform: "none" }], 400);
      add(`<div>通信 OK</div>`, "left:350px;top:9px;font-size:18px;color:#7dff8a;background:#000a;padding:2px 10px;border-radius:6px;white-space:nowrap;z-index:6", scr);
      lamp.style.background = "#5dff7a"; lamp.style.boxShadow = "0 0 24px #5dff7a";
      bubble("ただいま", 480, 100, 0);
      anim(pr, [{ rotate: "-12deg" }, { rotate: "12deg" }, { rotate: "-12deg" }], 450, { iterations: 4 });
      await wait(2200);
    },

    // ---------- T44-04 流れ星と願い事 ----------
    async i_T44_04() {
      layer(`background:linear-gradient(#04061a,#101a40);z-index:2`); stars(50, 300);
      add(`<div></div>`, "left:-110px;top:330px;width:460px;height:460px;border-radius:50%;background:#7a7a86;border:5px solid #331c16;z-index:4");
      add(`<div></div>`, "left:200px;top:410px;width:60px;height:26px;border-radius:50%;background:#5a5a66;z-index:5");
      add(`<div></div>`, "left:20px;top:470px;width:80px;height:30px;border-radius:50%;background:#5a5a66;z-index:5");
      const pr = probe(50, 178, 160, s, 8);
      add(`<div></div>`, "left:520px;top:0;width:440px;height:540px;background:#1a2236;z-index:6");
      const win = add(`<div></div>`, "left:560px;top:40px;width:380px;height:300px;border:12px solid #8890a8;background:linear-gradient(#050820,#14204a);overflow:hidden;z-index:7");
      for (let i = 0; i < 14; i++) add(`<div></div>`, `left:${rnd(0, 350)}px;top:${rnd(0, 270)}px;width:3px;height:3px;border-radius:50%;background:#fff;opacity:${rnd(.4, 1)}`, win);
      const zs = [640, 790].map(x => zari(x, 400, 100, { face: "sad", z: 12 }));
      add(`<div></div>`, "left:520px;top:490px;width:440px;height:60px;background:#3a3f5c;border-top:6px solid #111;z-index:14");
      await wait(1000); chip("ウルトを発動");
      anim(pr, [{ transform: "none" }, { transform: "scale(1.1,.9)" }, { transform: "none" }], 400, { iterations: 2 });
      pr.style.filter = "drop-shadow(0 0 16px gold)";
      say("全力ウルト！", 260, 120, { size: 50, color: "#fff", ms: 1100 }); await wait(1100);
      const sx = 150, sy = 255, tx = 556, ty = 190, L = Math.hypot(tx - sx, ty - sy), ang = Math.atan2(ty - sy, tx - sx) * 180 / Math.PI;
      const bm = add(`<div></div>`, `left:${sx}px;top:${sy - 9}px;width:${L}px;height:18px;border-radius:9px;background:linear-gradient(90deg,#fff,#ffe066,#ffd23c);box-shadow:0 0 22px #ffd23c;transform-origin:0 50%;rotate:${ang}deg;z-index:9`);
      await anim(bm, [{ transform: "scaleX(0)" }, { transform: "scaleX(1)" }], 550, { easing: "ease-in" });
      await wait(250); await anim(bm, [{ opacity: 1 }, { opacity: 0 }], 250); bm.remove(); pr.style.filter = "none";
      const mt = add(`<div></div>`, "left:20px;top:20px;width:140px;height:8px;border-radius:4px;background:linear-gradient(90deg,#0000,#ffe066,#fff);box-shadow:0 0 14px #ffd23c;rotate:35deg;z-index:5", win);
      anim(mt, [{ transform: "translate(0,0)" }, { transform: "translate(300px,200px)" }], 1300, { easing: "linear" });
      await wait(300); zs.forEach(z => { z.innerHTML = zariSvg({ face: "shock" }); hop(z, 20); });
      bubble("流れ星だ！", 740, 346, 900); await wait(900);
      const hands = zs.map(z => add(`<div>🙏</div>`, `left:${parseFloat(z.style.left) + 30}px;top:372px;font-size:34px;z-index:13`));
      for (let i = 1; i <= 3; i++) { bubble(`${["①", "②", "③"][i - 1]} 給料が上がりますように`, 780, 330, 520); await wait(600); }
      mt.remove(); await wait(300);
      say("ただの星", 740, 270, { size: 44, color: "#9db4d8", ms: 0 });
      await wait(700); bubble("届いた…？", 150, 100, 0);
      label("ウルト → 流れ星 1個ぶん", "left:30px;top:480px;font-size:22px;z-index:20");
      await wait(2300);
    },

    // ---------- T44-07 小包は解雇通知 ----------
    async i_T44_07() {
      layer(`background:linear-gradient(#14081e,#4a1e34 70%);z-index:2`); stars(40, 300);
      layer(`top:495px;height:45px;background:#8a4a30;z-index:3`);
      add(`<div></div>`, "left:80px;top:472px;width:120px;height:40px;border-radius:50%;background:#6a3a28;z-index:4");
      const pr = probe(600, 290, 190, s, 10);
      const coin = add(`<div class=c>¥</div>`, "left:410px;top:-60px;width:60px;height:60px;line-height:50px;font-size:34px;z-index:20");
      await wait(900); chip("ビッツ（投げ銭）が入る");
      await anim(coin, [{ transform: "none" }, { transform: "translateY(150px) rotateY(720deg)" }], 650, { easing: "ease-in" }); coin.remove();
      const pk = add(`<div><svg viewBox="0 0 130 115" style="left:0;top:0;width:130px;height:115px;overflow:visible"><path d="M6 52Q65 -30 124 52Q96 40 65 52Q34 40 6 52Z" fill=#ff6a5a stroke=${INK} stroke-width=4 stroke-linejoin=round /><path d="M6 52L46 112M65 52V112M124 52L84 112" stroke=${INK} stroke-width=3 fill=none /></svg>
        <div style="left:40px;top:112px;width:52px;height:46px;background:#c9975c;border:4px solid ${INK}"><div style="left:18px;top:0;width:12px;height:100%;background:#e8c58a"></div></div></div>`, "left:375px;top:60px;width:130px;height:170px;z-index:12");
      pop(pk); say("ポン！", 440, 50, { size: 36, ms: 500, color: "#fff" });
      hop(pr, 60); bubble("お届け物だ！", 640, 240, 1300);
      await anim(pk, [{ transform: "translateY(0) rotate(-6deg)" }, { transform: "translateY(90px) rotate(6deg)", offset: .33 }, { transform: "translateY(180px) rotate(-5deg)", offset: .66 }, { transform: "translateY(275px) rotate(0)" }], 2000, { easing: "ease-in-out" });
      const can = pk.firstChild; anim(can, [{ transform: "none" }, { transform: "scaleY(.15) translateX(30px)" }], 300);
      await wait(500); say("開けるよ！", 560, 230, { size: 40, ms: 800, color: "#fff" });
      const boxEl = pk.lastChild; anim(boxEl, [{ transform: "none" }, { transform: "scale(1.2)" }, { transform: "none" }], 250);
      await wait(600);
      const pp = add(`<div><div style="left:0;right:0;top:14px;text-align:center;font-size:27px;font-weight:900;color:#b02020;white-space:nowrap">契約終了のお知らせ</div>
        <div style="left:24px;top:62px;width:240px;height:6px;background:#bbb"></div><div style="left:24px;top:84px;width:200px;height:6px;background:#bbb"></div><div style="left:24px;top:106px;width:230px;height:6px;background:#bbb"></div>
        <div style="right:18px;bottom:12px;font-size:19px;color:#555;white-space:nowrap">1991年3月31日</div></div>`,
        `left:250px;top:110px;width:290px;height:190px;background:#fff;border:3px solid ${INK};color:${INK};z-index:25;rotate:-3deg`);
      await anim(pp, [{ transform: "translateY(150px) scale(.2)", opacity: 0 }, { transform: "none", opacity: 1 }], 400);
      await wait(400); say("契約…終了…？", 430, 365, { size: 38, ms: 1000, color: "#fff" });
      await anim(pp, [{ translate: "0 0" }, { translate: "-14px 0" }, { translate: "14px 0" }, { translate: "-14px 0" }, { translate: "14px 0" }, { translate: "0 0" }], 1800, { easing: "linear" });
      await wait(300); say("何十年も前…", 430, 365, { size: 38, ms: 900, color: "#9db4d8" }); await wait(1000);
      await anim(pp, [{ transform: "none" }, { transform: "scaleY(.5)" }], 300); await anim(pp, [{ transform: "scaleY(.5)" }, { transform: "scale(.5,.5)" }], 300);
      await anim(pp, [{ transform: "scale(.5)" }, { transform: "translate(290px,235px) scale(.1)" }], 600, { easing: "ease-in" }); pp.remove();
      ov(pr, closedEyes); sparkTo(pr, 400);
      for (let i = 0; i < 3; i++) { const hr = add(`<div>💗</div>`, `left:${620 + i * 40}px;top:290px;font-size:30px;z-index:20`); anim(hr, [{ transform: "none", opacity: 1 }, { transform: "translateY(-80px)", opacity: 0 }], 1100, { delay: i * 200 }).then(() => hr.remove()); }
      bubble("大切にしよう", 700, 230, 0); await wait(2200);
    },

    // ---------- T45-07 縦軸も横軸もビッツ ----------
    async i_T45_07() {
      const sl = hall(), h = prof(745, 295, 170);
      const zr = zari(50, 425, 84, { face: "smile", z: 14 }); add(`<div>🖊️</div>`, "left:132px;top:458px;font-size:26px;z-index:15");
      let pts = "";
      for (let i = 0; i < 7; i++) { const x = 140 + i * 60; pts += `<circle class=pt cx=${x} cy=${270 - (x - 110) * 200 / 420} r=9 fill=#e84a3a stroke=${INK} stroke-width=3 style="opacity:0" />`; }
      const sv = slideSvg(sl, `<text x=292 y=36 text-anchor=middle font-size=25 fill=${INK}>ビッツと発見数は完全に相関</text>
        <path d="M110 270H540M110 270V64" stroke=${INK} stroke-width=4 fill=none /><text transform="translate(60,170) rotate(-90)" text-anchor=middle font-size=24 fill=${INK}>ビッツ</text><text x=320 y=306 text-anchor=middle font-size=24 fill=${INK}>ビッツ</text>
        <line id=ln x1=110 y1=270 x2=530 y2=70 stroke=#4a78d8 stroke-width=5 pathLength=1 stroke-dasharray=1 stroke-dashoffset=1 />${pts}
        <text id=rr x=330 y=235 font-size=26 fill=${INK} style="opacity:0">相関係数 r = 1.00</text>
        <ellipse id=c1 cx=320 cy=298 rx=52 ry=19 fill=none stroke=#e22 stroke-width=4 pathLength=1 stroke-dasharray=1 style="opacity:0" /><ellipse id=c2 cx=58 cy=166 rx=20 ry=46 fill=none stroke=#e22 stroke-width=4 pathLength=1 stroke-dasharray=1 style="opacity:0" />
        <text id=rn x=382 y=305 font-size=20 fill=#e22 style="opacity:0">←同じ軸</text>`);
      sl.style.opacity = 0;
      await wait(900); chip("ビッツ（投げ銭）が入る"); anim(sl, [{ opacity: 0, transform: "translateX(-60px)" }, { opacity: 1, transform: "none" }], 300); sl.style.opacity = 1;
      bubble("大発見です", 800, 215, 1200); await wait(1400);
      for (const p of sv.querySelectorAll(".pt")) { anim(p, [{ opacity: 0 }, { opacity: 1 }], 120); await wait(330); }
      await anim(sv.querySelector("#ln"), [{ strokeDashoffset: 1 }, { strokeDashoffset: 0 }], 700, { easing: "linear" });
      const rr = sv.querySelector("#rr"); rr.style.opacity = 1; pop(rr);
      bubble("完全に相関！", 800, 215, 1400); await wait(1700);
      anim(zr, [{ transform: "none" }, { transform: "translateY(-12px)" }, { transform: "none" }], 400);
      await redCircle(sv.querySelector("#c1")); await redCircle(sv.querySelector("#c2")); sv.querySelector("#rn").style.opacity = 1;
      say("…………", 200, 480, { size: 32, color: "#fff", ms: 1200 }); await wait(1400);
      anim(h, [{ transform: "none" }, { transform: "scale(1.08)" }], 300); say("完璧です", 805, 235, { size: 52, ms: 0 });
      await wait(2200);
    },

    // ---------- T45-10 離席中は勝率100% ----------
    async i_T45_10() {
      const sl = hall(), h = prof(745, 295, 170);
      label("🚶 離席中 ☕", "right:16px;top:60px;font-size:20px");
      const zr = zari(50, 425, 84, { face: "smile", z: 14 }); add(`<div>🖊️</div>`, "left:132px;top:458px;font-size:26px;z-index:15");
      const sv = slideSvg(sl, `<text x=292 y=38 text-anchor=middle font-size=26 fill=${INK}>離席前後の勝率</text>
        <path d="M60 250H520" stroke=${INK} stroke-width=4 />
        <rect id=b1 x=120 y=170 width=120 height=80 fill=#5a7fd8 stroke=${INK} stroke-width=4 style="opacity:0" /><text id=t1 x=180 y=160 text-anchor=middle font-size=26 fill=${INK} style="opacity:0">42%</text>
        <rect id=b2 x=330 y=90 width=120 height=160 fill=#4cc16a stroke=${INK} stroke-width=4 style="opacity:0" /><text id=t2 x=390 y=80 text-anchor=middle font-size=30 fill=#1a8a3a style="opacity:0">100%</text>
        <text x=180 y=276 text-anchor=middle font-size=22 fill=${INK}>離席前</text><text x=390 y=276 text-anchor=middle font-size=22 fill=${INK}>離席中</text>
        <text id=fn x=390 y=303 text-anchor=middle font-size=15 fill=#777 style="opacity:0">(試合数 0)</text>
        <ellipse id=c1 cx=390 cy=299 rx=62 ry=15 fill=none stroke=#e22 stroke-width=4 pathLength=1 stroke-dasharray=1 style="opacity:0" />
        <text id=rn x=470 y=150 text-anchor=middle font-size=22 fill=#e22 style="opacity:0">0÷0 は</text><text id=rn2 x=470 y=180 text-anchor=middle font-size=22 fill=#e22 style="opacity:0">割れません</text>`);
      await wait(900); chip("配信者が離席"); await wait(500);
      say("離席の効果です", 800, 225, { size: 30, ms: 1400, color: "#ffd23c" }); await wait(1000);
      const q = id => sv.querySelector("#" + id);
      for (const id of ["b1", "t1"]) { q(id).style.opacity = 1; } anim(q("b1"), [{ transform: "scaleY(0)", transformBox: "fill-box", transformOrigin: "50% 100%" }, { transform: "scaleY(1)", transformBox: "fill-box", transformOrigin: "50% 100%" }], 400); await wait(600);
      q("b2").style.opacity = 1; anim(q("b2"), [{ transform: "scaleY(0)", transformBox: "fill-box", transformOrigin: "50% 100%" }, { transform: "scaleY(1)", transformBox: "fill-box", transformOrigin: "50% 100%" }], 600);
      await wait(600); q("t2").style.opacity = 1; pop(q("t2"));
      say("離席中の勝率は100%！", 805, 235, { size: 30, ms: 1700 }); await wait(1900);
      q("fn").style.opacity = 1; anim(q("fn"), [{ opacity: 0 }, { opacity: 1 }], 400); await wait(900);
      anim(zr, [{ transform: "none" }, { transform: "translateY(-12px)" }, { transform: "none" }], 400);
      await redCircle(q("c1")); q("rn").style.opacity = 1; q("rn2").style.opacity = 1; pop(q("rn")); await wait(1300);
      const aw = add(`<svg viewBox="0 0 1237 1271" ${SV}><path d="M380 640L470 880M830 640L740 880" stroke=${INK} stroke-width=14 fill=none /><rect x=330 y=860 width=540 height=240 rx=24 fill=#ffd23c stroke=${INK} stroke-width=18 /><text x=600 y=1030 text-anchor=middle font-size=130 font-weight=900 fill=${INK}>学会賞</text></svg>`, "", h);
      await anim(aw, [{ transform: "translateY(-200px)", opacity: 0 }, { transform: "none", opacity: 1 }], 400, { easing: "ease-in" });
      anim(h, [{ transform: "none" }, { transform: "scale(1.08)" }], 300); say("受賞！", 805, 235, { size: 56, ms: 0 }); burst(830, 320, 10);
      await wait(2200);
    },
  });
}

{
document.head.insertAdjacentHTML("beforeend", `<style>
@keyframes q10fl{0%,100%{transform:scale(1) rotate(-4deg)}50%{transform:scale(1.15,.92) rotate(4deg)}}
.q10f{transform-origin:50% 100%;animation:q10fl .35s infinite}
</style>`);
const qSmile = hideMouth + `<path d="M520 640Q600 715 680 640" ${line} />`;
const qConf = (n = 50) => { for (let i = 0; i < n; i++) { const c = add(`<div></div>`, `left:${rnd(0, 940)}px;top:-20px;width:10px;height:16px;background:${["#ff5a7a", "#ffd23c", "#5ad1ff", "#7dff8a"][i % 4]};z-index:40`);
  anim(c, [{ transform: "none" }, { transform: `translateY(580px) rotate(${rnd(300, 900)}deg)` }], rnd(1200, 2000), { delay: rnd(0, 700), easing: "linear" }).then(() => c.remove()); } };
const qFire = (x, y, sz = 44) => { const o = add(`<div></div>`, `left:${x}px;top:${y}px;width:${sz}px;height:${sz}px;font-size:${sz}px;line-height:1;transform-origin:50% 100%;z-index:20`);
  o.i = add(`<div class=q10f>🔥</div>`, "left:0;top:0", o); o.k = 1; return o; };
const qGrow = (f, k, ms = 400) => { anim(f, [{ transform: `scale(${f.k})` }, { transform: `scale(${k})` }], ms, { easing: "cubic-bezier(.2,1.5,.4,1)" }); f.k = k; };
const qFilm = (x, y, w, i, parent = s) => { const e = add(`<div></div>`, `left:${x}px;top:${y}px;width:${w}px;height:${w * .66}px;background:#1d1d1d;border:2px solid #000;z-index:16`, parent);
  add(`<div></div>`, "left:0;top:3px;width:100%;height:5px;background:repeating-linear-gradient(90deg,#fff 0 5px,transparent 5px 11px)", e);
  add(`<div></div>`, "left:0;bottom:3px;width:100%;height:5px;background:repeating-linear-gradient(90deg,#fff 0 5px,transparent 5px 11px)", e);
  add(`<div></div>`, `left:5px;top:11px;width:${w - 14}px;height:${w * .66 - 24}px;background:#cfe8ff;overflow:hidden`, e)
    .innerHTML = `<img src="${N}" style="left:${-(i % 3) * 8}px;top:${-(i % 2) * 8}px;width:${w + 10}px;height:${(w + 10) * 1271 / 1237}px">`;
  return e; };
const qMarket = () => { const S = [];
  S.push(layer("z-index:3;background:linear-gradient(#f3c27a,#e29a52 62%,#7a5232 62%)"));
  S.push(add(`<div>🏮</div>`, "left:420px;top:60px;font-size:50px;z-index:4"), add(`<div>🏮</div>`, "left:560px;top:80px;font-size:44px;z-index:4"));
  return S; };
const qStall = (x, w, title, sub, S) => {
  S.push(add(`<div></div>`, `left:${x}px;top:440px;width:${w}px;height:100px;background:#8a5a30;border:5px solid ${INK};z-index:12`));
  S.push(add(`<div></div>`, `left:${x - 6}px;top:190px;width:${w + 12}px;height:52px;background:repeating-linear-gradient(90deg,#e23 0 40px,#fff 40px 80px);border:5px solid ${INK};border-radius:0 0 18px 18px;z-index:9`));
  S.push(add(`<div></div>`, `left:${x + 6}px;top:240px;width:10px;height:200px;background:#5a3a1c;z-index:6`), add(`<div></div>`, `left:${x + w - 16}px;top:240px;width:10px;height:200px;background:#5a3a1c;z-index:6`));
  return S; };

// 営業先 (ドーム→屋上→公民館→ベンチ)
const qVenue = (k, n) => { const S = [], A = (h, c) => { const e = add(h, c); S.push(e); return e; };
  const base = bg => A(`<div></div>`, `left:0;top:0;width:960px;height:540px;z-index:2;background:${bg}`);
  const names = ["ドーム公演", "デパート屋上", "公民館", "公園のベンチ"];
  if (k == 0) { base("linear-gradient(#150b30,#3b1a5a 60%,#241040)");
    for (const [x, r] of [[140, -14], [420, 8], [700, -6]]) A(`<div></div>`, `left:${x}px;top:0;width:200px;height:420px;background:linear-gradient(#fff6b0aa,#fff6b000);clip-path:polygon(40% 0,60% 0,100% 100%,0 100%);transform-origin:50% 0;rotate:${r}deg;z-index:3`);
    A(`<div></div>`, "left:0;top:150px;width:960px;height:200px;z-index:3;opacity:.8;background:radial-gradient(circle,#ff7ab8 3px,transparent 4px) 0 0/18px 14px,radial-gradient(circle,#7ad7ff 3px,transparent 4px) 9px 7px/18px 14px");
    A(`<div class=t>ハム 全国ドームツアー</div>`, "left:40px;top:76px;font-size:34px;color:#ffe066;z-index:5;-webkit-text-stroke:6px #2a0a40");
    A(`<div></div>`, "left:0;top:440px;width:960px;height:100px;background:#1a1226;border-top:5px solid #ff7ab8;z-index:4"); }
  if (k == 1) { base("linear-gradient(#8fd3ff,#e0f4ff)");
    A(`<div>☁️</div>`, "left:80px;top:50px;font-size:80px;z-index:3"); A(`<div>☁️</div>`, "left:520px;top:90px;font-size:60px;z-index:3");
    A(`<div></div>`, "left:0;top:300px;width:960px;height:140px;z-index:3;background:repeating-linear-gradient(90deg,#445 0 4px,transparent 4px 22px);border-top:8px solid #445");
    A(`<div></div>`, "left:0;top:430px;width:960px;height:110px;background:#9a9a9a;border-top:5px solid #666;z-index:4");
    A(`<div>🎠</div>`, "left:560px;top:340px;font-size:80px;z-index:5");
    A(`<div>デパート屋上 ハムショー 11:00〜</div>`, `left:40px;top:80px;font-size:28px;color:#222;background:#fff8e6;border:4px solid ${INK};padding:6px 14px;z-index:5;white-space:nowrap;rotate:-2deg`); }
  if (k == 2) { base("#eadfc4");
    A(`<div></div>`, "left:0;top:0;width:90px;height:430px;background:repeating-linear-gradient(90deg,#8d1a2a 0 14px,#6d1220 14px 28px);z-index:3");
    A(`<div>公民館 ハム寄席　入場無料</div>`, `left:130px;top:60px;font-size:30px;color:#222;background:#fff8e6;border:4px solid ${INK};padding:6px 14px;z-index:5;white-space:nowrap`);
    A(`<div>🕒</div>`, "left:700px;top:60px;font-size:54px;z-index:5");
    A(`<div></div>`, "left:0;top:430px;width:960px;height:110px;background:linear-gradient(#b38a56,#8a6538);border-top:5px solid #5a3a1c;z-index:4");
    for (const x of [110, 240, 370, 500]) A(`<div></div>`, `left:${x}px;top:410px;width:80px;height:18px;background:#999;border:3px solid #555;z-index:5`); }
  if (k == 3) { base("linear-gradient(#f7b267,#b0607a 60%,#3b2a4a)");
    A(`<div>🌳</div>`, "left:20px;top:150px;font-size:190px;z-index:3"); A(`<div>🌙</div>`, "left:560px;top:50px;font-size:60px;z-index:3");
    A(`<div></div>`, "left:0;top:440px;width:960px;height:100px;background:#3f6a35;border-top:5px solid #2a4a24;z-index:4");
    A(`<div></div>`, `left:370px;top:445px;width:200px;height:16px;background:#8a5a30;border:3px solid ${INK};z-index:5`);
    A(`<div></div>`, `left:380px;top:420px;width:180px;height:14px;background:#8a5a30;border:3px solid ${INK};z-index:5`);
    A(`<div>ハム 営業中</div>`, `left:560px;top:380px;font-size:18px;color:#222;background:#cfa66a;border:3px solid ${INK};padding:3px 8px;z-index:5;white-space:nowrap;rotate:4deg`); }
  const xs = [60, 190, 320, 450], Z = [];
  for (let i = 4 - n; i < 4; i++) Z.push(zari(xs[i], 385, 100, { z: 14, face: k == 3 ? "sad" : "smile" }));
  return { S, Z, name: names[k] }; };
const qFlash = () => { const f = add(`<div></div>`, "left:0;top:0;width:960px;height:540px;background:#000;z-index:45"); anim(f, [{ opacity: .9 }, { opacity: 0 }], 500).then(() => f.remove()); };
const qGagTxt = "ぱんぱんぱーん!";

Object.assign(scenes, {
  async i_T46_05() { // 死亡演技賞
    const h = ham(N), S = [], A = (html, css, p) => { const e = add(html, css, p); S.push(e); return e; };
    A(`<div></div>`, "left:0;top:0;width:960px;height:540px;z-index:3;background:radial-gradient(ellipse at 50% 30%,#3a1d4a,#12081c 75%)");
    A(`<div></div>`, `left:0;top:0;width:960px;height:62px;background:repeating-linear-gradient(90deg,#b3162a 0 36px,#8d0f20 36px 72px);border-bottom:6px solid #ffd23c;z-index:5`);
    A(`<div class=t>第1回 ザリガニ映画祭</div>`, "left:50%;top:10px;translate:-50% 0;font-size:30px;color:#ffe066;z-index:6;-webkit-text-stroke:5px #4a0010");
    A(`<div></div>`, "left:0;top:470px;width:960px;height:70px;background:linear-gradient(#7a4a24,#4a2a12);z-index:4");
    const cone = (x, w, o) => A(`<div></div>`, `left:${x}px;top:62px;width:${w}px;height:420px;background:linear-gradient(#fff6c0,#fff6c000);clip-path:polygon(40% 0,60% 0,100% 100%,0 100%);opacity:${o};z-index:9`);
    cone(60, 300, .3); const c2 = cone(HX - 60, HW + 120, 0);
    const mc = zari(160, 235, 100, { z: 6, acc: "tie" }); S.push(mc);
    A(`<div></div>`, `left:140px;top:340px;width:120px;height:140px;background:#7a4a24;border:4px solid ${INK};z-index:7`);
    A(`<div class=t>金</div>`, "left:178px;top:380px;font-size:44px;color:#ffe066;z-index:8");
    const aud = Array.from({ length: 8 }, (_, i) => { const a = zari(10 + i * 78, 468, 76, { z: 12, color: "#7a3a2c", dark: "#4a2018", flip: i % 2 }); S.push(a); return a; });
    await wait(700); chip("試合に勝利");
    const mb = bubble("最優秀死亡演技賞は…", 360, 190, 0); say("ドルルルル…", 560, 110, { size: 40, color: "#fff", ms: 1100 });
    await wait(1400); mb.remove();
    say("ハム!!", 520, 130, { size: 84, ms: 1400 }); anim(c2, [{ opacity: 0 }, { opacity: .35 }], 300); hop(h, 60);
    aud.forEach((a, i) => hop(a, 18)); say("パチパチ", 340, 430, { size: 30, color: "#fff", ms: 900 }); await wait(900);
    const tr = add(`<div>🏆</div>`, "left:180px;top:250px;font-size:54px;z-index:20");
    await anim(tr, [{ transform: "none" }, { transform: "translate(330px,-90px) rotate(180deg)", offset: .5 }, { transform: "translate(620px,120px) rotate(360deg)" }], 800, { easing: "ease-in-out" });
    let eyes = ov(h, closedEyes + tears); hop(h, 30); say("感動…", 600, 290, { size: 36, color: "#fff", ms: 900 }); await wait(1000);
    say("バタッ", 600, 300, { size: 52, color: "#fff", ms: 900 }); h.style.transformOrigin = "50% 50%";
    await anim(h, [{ transform: "none" }, { transform: "rotate(-8deg)", offset: .3 }, { transform: "translateX(-60px) rotate(-92deg)" }], 520, { easing: "ease-in" });
    eyes.remove(); eyes = ov(h, whiteEyes + openMouth); h.img.style.filter = "saturate(.4)";
    anim(tr, [{ transform: "translate(620px,120px) rotate(360deg)" }, { transform: "translate(500px,110px) rotate(300deg)" }], 300, { easing: "ease-in" });
    await wait(900); aud[3].style.zIndex = 12; hop(aud[3], 40); await wait(300);
    qConf(70); say("総立ち!!", 640, 150, { size: 74, ms: 1800 }); say("ブラボー!", 300, 330, { size: 44, color: "#fff", ms: 1700 });
    aud.forEach((a, i) => anim(a, [{ transform: "none" }, { transform: "translateY(-70px) scaleY(1.12)" }, { transform: "translateY(-100px) scaleY(1.12)" }, { transform: "translateY(-70px) scaleY(1.12)" }], 260 * 6, { delay: i * 60, iterations: 1 }));
    bubble("完璧な死にっぷり", 360, 190, 1800); await wait(2300);
    h.img.style.filter = "none"; eyes.remove(); anim(h, [{ transform: "translateX(-60px) rotate(-92deg)" }, { transform: "none" }], 350); tr.remove();
    S.forEach(e => fade(e)); await wait(1200);
  },

  async i_T47_06() { // 切りくず拾い
    const h = ham(N), S = qMarket(), seller = zari(120, 245, 110, { z: 7, face: "evil", acc: "tie" }); S.push(seller);
    qStall(12, 360, "", "", S);
    const sign = add(`<div>ハム名場面 切り売り中 ¥500</div>`, `left:30px;top:130px;font-size:24px;color:#222;background:#fff8e6;border:4px solid ${INK};padding:5px 12px;z-index:10;white-space:nowrap`); S.push(sign);
    S.push(add(`<div>🎞🎞🎞</div>`, "left:60px;top:404px;font-size:34px;z-index:13"));
    const pile = [[430, 478, 14], [470, 490, -22], [520, 474, 40], [560, 492, -8], [600, 480, 25]].map(([x, y, r], i) => { const e = qFilm(x, y, 62, i); e.style.rotate = r + "deg"; return e; });
    await wait(900); chip("試合に敗北"); say("切りくずだけ…", 520, 300, { size: 34, color: "#fff", ms: 1100 });
    const strip = add(`<div></div>`, "left:380px;top:380px;width:330px;height:45px;z-index:16"), pieces = [];
    for (let i = 0; i < 5; i++) { await wait(560); const p = pile[i], px = parseFloat(p.style.left), py = parseFloat(p.style.top); p.remove();
      const np = qFilm(i * 66, 0, 62, i, strip); pieces.push(np); hop(h, 22);
      anim(np, [{ transform: `translate(${px - 380 - i * 66}px,${py - 380}px) rotate(20deg)` }, { transform: "translate(0,-50px)", offset: .6 }, { transform: "none" }], 480);
      if (i) { await wait(420); const tp = add(`<div></div>`, `left:${i * 66 - 12}px;top:-4px;width:22px;height:52px;background:#ffe27acc;border:1px solid #c9a227;z-index:20`, strip); pop(tp, 160); } }
    await wait(500); strip.style.filter = "drop-shadow(0 0 10px #ffe066)"; bubble("できた!", 540, 320, 1000); hop(h, 50); await wait(1100);
    seller.style.zIndex = 14; const sc = add(`<div>✂️</div>`, "left:250px;top:330px;font-size:40px;z-index:15"); S.push(sc);
    const stp = stamp("無断転載です", 400, 270, 46); S.push(stp); anim(seller, [{ transform: "none" }, { transform: "translate(230px,90px)" }], 600); anim(sc, [{ transform: "none" }, { transform: "translate(230px,90px)" }], 600); await wait(700);
    await Promise.all([anim(strip, [{ transform: "none" }, { transform: "translate(-250px,-60px) scale(.7)" }], 600, { easing: "ease-in" }), anim(seller, [{ transform: "translate(230px,90px)" }, { transform: "translate(0,0)" }], 600), anim(sc, [{ transform: "translate(230px,90px)" }, { transform: "none" }], 600)]);
    sign.textContent = "NEW 完全版 ¥1,000"; pop(sign); ov(h, tears + frown); S.push(label("ハムの取り分 ¥0", `left:${HX - 60}px;top:${HY - 20}px`));
    await wait(2100); S.forEach(e => fade(e)); strip.remove(); await wait(1000);
  },

  async i_T47_08() { // 本家の屋台は閑古鳥
    const h = ham(N), S = qMarket();
    qStall(12, 360, "", "", S); qStall(560, 390, "", "", S);
    S.push(add(`<div>切り抜き屋 ¥300</div>`, `left:30px;top:130px;font-size:26px;color:#222;background:#fff8e6;border:4px solid ${INK};padding:5px 12px;z-index:10;white-space:nowrap`));
    S.push(zari(130, 335, 110, { z: 7, face: "evil", acc: "tie" }));
    const sg = add(`<div>公式・本人提供</div>`, `left:585px;top:130px;font-size:30px;color:#6b4a00;background:linear-gradient(#fff6c0,#ffd23c);border:5px solid ${INK};padding:6px 16px;z-index:10;white-space:nowrap`); S.push(sg);
    S.push(add(`<div>🎞 ¥300</div>`, "left:600px;top:408px;font-size:30px;z-index:13;color:#fff"));
    const cust = [0, 1, 2, 3].map(i => zari(400 + i * 60, 400, 80, { z: 14, flip: true })); S.forEach(() => 0);
    await wait(800); chip("チャネポで屋台と交換"); pop(sg);
    await wait(600); cust.forEach((c, i) => anim(c, [{ transform: "none" }, { transform: `translate(${i ? -340 + i * 20 : 130}px,${i ? 0 : -20}px)` }], i ? 1100 : 700, { delay: i * 150 }));
    await wait(900); const c0 = cust[0]; bubble("本人のは画質が良すぎて…", 640, 330, 1700); await wait(1900);
    anim(c0, [{ transform: "translate(130px,-20px)" }, { transform: "translate(-250px,0)" }], 1100); say("ガーン", 800, 300, { size: 44, color: "#9db4d8", ms: 1000 }); await wait(1300);
    const bd = add(`<div>🐦</div>`, "left:-60px;top:100px;font-size:50px;z-index:30"); const ba = bd.animate([{ transform: "translate(0,0)" }, { transform: "translate(500px,40px) rotate(8deg)" }, { transform: "translate(1100px,-10px)" }], { duration: 2200 });
    say("ピヨ…ピヨ…", 560, 100, { size: 36, color: "#fff", ms: 1900 }); await wait(1000);
    const cn = coin(HX + 60, HY + 40); cn.style.zIndex = 30; await anim(cn, [{ transform: "none" }, { transform: "translate(-120px,-70px)", offset: .4 }, { transform: "translate(-40px,150px)" }], 700); cn.remove();
    const g = add(`<div>🎞</div>`, "left:70px;top:140px;font-size:50px;z-index:30", h); pop(g); bubble("買っちゃった", 560, 230, 1200); await wait(1300);
    ov(h, tears); await walk(h, 0, 320, 900, 4); S.forEach(e => fade(e)); cust.forEach(e => fade(e)); await wait(500);
    await walk(h, 320, 0, 800, 4); bd.remove(); await wait(1100);
  },

  async i_T47_09() { // 本人ごと切り抜き
    const h = ham(N); await wait(700); chip("チャットで「!切り抜き」");
    const pn = add(`<div></div>`, "left:640px;top:14px;width:300px;height:70px;background:#000a;border:2px solid #fff6;border-radius:10px;z-index:30");
    zari(648, 22, 38, { z: 31 }); add(`<div>!切り抜き</div>`, "left:696px;top:30px;font-size:26px;z-index:31;white-space:nowrap"); pop(pn);
    await wait(900);
    const [ex, ey] = P(600, 700), rx = 560 / 1237 * HW, ry = 590 / 1271 * HH;
    const o = ov(h, `<ellipse cx=600 cy=700 rx=560 ry=590 fill=none stroke=#fff stroke-width=26 stroke-dasharray="70 46" />`); pop(o, 260);
    const z = zari(-120, 380, 110, { z: 20, face: "evil" }), sc = add(`<div>✂️</div>`, `left:0;top:340px;font-size:56px;z-index:21`);
    await Promise.all([anim(z, [{ transform: "none" }, { transform: `translate(${HX}px,0)` }], 900), anim(sc, [{ transform: "none" }, { transform: `translate(${HX + 90}px,0)` }], 900)]);
    const kf = Array.from({ length: 25 }, (_, i) => { const a = Math.PI + i / 24 * Math.PI * 2; return { transform: `translate(${ex - rx - 20 + (rx + rx * Math.cos(a) + rx)* 1 - rx}px,${ey - 340 + ry * Math.sin(a) - 10}px) rotate(${i * 30}deg)` }; });
    kf.forEach((k, i) => { const a = Math.PI + i / 24 * Math.PI * 2; k.transform = `translate(${ex + rx * Math.cos(a) - 28}px,${ey + ry * Math.sin(a) - 370}px) rotate(${i * 40}deg)`; });
    const cut = ov(h, `<ellipse cx=600 cy=700 rx=560 ry=590 fill=none stroke=${INK} stroke-width=30 pathLength=1 stroke-dasharray=1 stroke-dashoffset=1 />`).firstChild;
    say("チョキチョキ", 560, 200, { size: 44, color: "#fff", ms: 1500 });
    cut.animate([{ strokeDashoffset: 1 }, { strokeDashoffset: 0 }], { duration: 1600, fill: "forwards" });
    await anim(sc, kf, 1600, { easing: "linear" });
    o.remove(); sc.remove();
    h.img.style.filter = "drop-shadow(4px 0 #fff) drop-shadow(-4px 0 #fff) drop-shadow(0 4px #fff) drop-shadow(0 -4px #fff)";
    add(`<div></div>`, `left:46%;top:92%;width:18px;height:120px;background:#d9a35c;border:3px solid ${INK};z-index:-1`, h);
    add(`<div>取り分 ¥0</div>`, `left:14%;top:56%;font-size:22px;color:#222;background:#fff8e6;border:3px solid ${INK};padding:3px 8px;white-space:nowrap;z-index:5;rotate:-6deg`, h);
    h.style.transformOrigin = "50% 150%";
    await anim(h, [{ transform: "none" }, { transform: "translateY(-80px) rotate(-14deg)" }], 400);
    const z2 = zari(HX + HW / 2 - 50, 432, 100, { z: 18, face: "smile" }); z.remove();
    note("ハムうちわ ¥100", "left:430px;top:190px;font-size:30px;z-index:25"); say("ペラペラ", 600, 150, { size: 40, color: "#fff", ms: 1500 });
    await anim(h, [{ transform: "translateY(-80px) rotate(-14deg)" }, { transform: "translateY(-80px) rotate(14deg)" }], 420, { iterations: 6, direction: "alternate", easing: "ease-in-out" });
    bubble("涼しい〜", 700, 380, 1200); await wait(1400);
  },

  async i_T48_03() { // 謝罪が油になる
    const h = ham(N); await wait(600); chip("3回連続でデス");
    const fires = [[HX - 30, 470], [HX + HW - 40, 480], [HX + 70, 500]].map(([x, y]) => qFire(x, y, 40));
    const lb = label("炎上度 120%", "right:16px;top:16px;color:#ffb347"); ov(h, tears + frown); shake(h);
    await wait(1100); const pa = note("", "left:550px;top:320px;width:150px;height:180px;white-space:normal;rotate:-6deg"); pa.innerHTML = `<div style="left:12px;top:8px;font-size:22px;color:#222">謝罪文</div>` + [0, 1, 2, 3, 4].map(i => `<div style="left:12px;top:${44 + i * 24}px;width:${i == 4 ? 70 : 120}px;height:5px;background:#999"></div>`).join("");
    pop(pa); bubble("この度は誠に申し訳…", 520, 240, 1700); await wait(1500);
    for (let i = 0; i < 22; i++) { const d = add(`<div></div>`, `left:${590 + rnd(-30, 60)}px;top:${340}px;width:14px;height:18px;border-radius:50%;background:radial-gradient(circle at 35% 30%,#fff6a0,#d9a21b 50%,#8a5a00);border:2px solid ${INK};z-index:22`);
      anim(d, [{ transform: "none" }, { transform: `translate(${rnd(-80, 160)}px,${rnd(-190, -110)}px)`, offset: .5 }, { transform: `translate(${rnd(-80, 260)}px,${rnd(60, 150)}px)`, opacity: .7 }], 900, { delay: i * 30 }).then(() => d.remove()); }
    say("ブシャー!", 520, 330, { size: 52, color: "#ffd23c", ms: 1000 });
    fires.forEach(f => qGrow(f, 2.4)); [HX - 80, HX + 30, HX + 130, HX + 190].forEach(x => { const f = qFire(x, 490, 40); pop(f); qGrow(f, 2); fires.push(f); }); lb.textContent = "炎上度 480%"; shake(h);
    await wait(1500); pa.remove();
    const ex = add(`<svg viewBox="0 0 70 140"><rect x=14 y=24 width=42 height=110 rx=14 fill=#d3202a stroke=${INK} stroke-width=5 /><rect x=26 y=4 width=18 height=20 rx=4 fill=#555 stroke=${INK} stroke-width=4 /><path d="M44 12Q66 6 64 36" fill=none stroke=${INK} stroke-width=6 /><rect x=19 y=58 width=32 height=44 fill=#fff stroke=${INK} stroke-width=3 /><text x=35 y=88 text-anchor=middle font-size=18 font-weight=900 fill=#d3202a>謝罪</text></svg>`, "left:560px;top:380px;width:70px;height:140px;z-index:21");
    pop(ex); hop(h, 30); await wait(500);
    const lbl = note("", "left:250px;top:150px;width:320px;height:150px;z-index:40;white-space:normal;background:#fff"); lbl.innerHTML = `<div style="left:0;right:0;top:8px;text-align:center;font-size:24px;color:#555">消火器 内容物</div><div style="left:0;right:0;top:44px;text-align:center;font-size:60px;color:#d3202a">謝罪(油)</div><div style="left:130px;top:112px;width:30px;height:30px;border-radius:50%;background:#d9a21b;border:3px solid ${INK}"></div>`;
    pop(lbl); say("!?", 580, 200, { size: 70, color: "#ff5a4a", ms: 900 }); await wait(1500); lbl.remove();
    for (let i = 0; i < 26; i++) { const d = add(`<div></div>`, `left:620px;top:395px;width:16px;height:16px;border-radius:50%;background:#d9a21b;border:2px solid ${INK};z-index:22`);
      anim(d, [{ transform: "none" }, { transform: `translate(${rnd(60, 150)}px,${rnd(-40, 30)}px)` }], 500, { delay: i * 30 }).then(() => d.remove()); }
    fires.forEach(f => qGrow(f, f.k * 1.5)); lb.textContent = "炎上度 ∞"; shake(h);
    const tint = add(`<div></div>`, "left:0;top:0;width:960px;height:540px;background:#ff5a0030;z-index:9"); anim(tint, [{ opacity: 0 }, { opacity: 1 }], 500);
    await wait(900); say("申し訳ございません!!", 460, 150, { size: 48, color: "#fff", ms: 2000 });
    await anim(h, [{ transform: "none" }, { transform: "rotate(34deg) translateY(10px)" }], 600, { easing: "ease-in-out" }); await wait(1600);
  },

  async i_T48_08() { // 凍結
    const h = ham(N), fires = [[HX - 30, 470], [HX + HW - 40, 480], [HX + 70, 500], [HX - 90, 490], [HX + 150, 490]].map(([x, y], i) => qFire(x, y, 56 + i % 2 * 12));
    await wait(700); chip("耐火スーツと交換"); ov(h, tears); hop(h, 30);
    await wait(900); const suit = ov(h, `<path d="M280 800Q600 730 920 800L960 1180Q600 1240 240 1180Z" fill=#ff8a1c stroke=${INK} stroke-width=15 /><path d="M250 960Q600 1010 950 960M255 1060Q600 1110 945 1060" stroke=#dfe6ea stroke-width=36 fill=none />`);
    pop(suit); const hat = ov(h, `<path d="M300 300Q600 20 900 300Z" fill=#ffcc00 stroke=${INK} stroke-width=15 /><rect x=270 y=290 width=660 height=50 rx=22 fill=#ffcc00 stroke=${INK} stroke-width=15 />`); pop(hat); bubble("これで無敵!", 560, 240, 1100); await wait(1300);
    const fl = add(`<div></div>`, "left:0;top:0;width:960px;height:540px;background:#dff6ff;z-index:45"); anim(fl, [{ opacity: 1 }, { opacity: 0 }], 600).then(() => fl.remove());
    say("パキーン!", 480, 200, { size: 66, color: "#bfefff", ms: 1200 });
    fires.forEach((f, i) => { f.i.classList.remove("q10f"); f.i.textContent = ["🧊", "❄️"][i % 2]; qGrow(f, 1.3, 300); });
    const frost = add(`<div></div>`, "left:0;top:0;width:960px;height:540px;background:#8fd8ff33;z-index:8"), fl2 = add(`<div></div>`, "left:560px;top:470px;width:400px;height:70px;border-radius:50%;background:#d6f4ffcc;border:4px solid #fff;z-index:9");
    await wait(900); say("ツルッ", 560, 300, { size: 44, color: "#fff", ms: 900 });
    h.style.transformOrigin = "50% 50%";
    await anim(h, [{ transform: "none" }, { transform: "translateX(-60px) rotate(-8deg)", offset: .3 }, { transform: "translateX(-200px) rotate(10deg)" }], 800, { easing: "ease-out" });
    await anim(h, [{ transform: "translateX(-200px) rotate(10deg)" }, { transform: "translateX(-220px) rotate(-92deg)" }], 400, { easing: "ease-in" }); say("ドテッ", 500, 380, { size: 40, color: "#fff", ms: 800 });
    const ice = add(`<div></div>`, `left:485px;top:300px;width:255px;height:236px;border-radius:30px;background:linear-gradient(135deg,#d6f4ffcc,#8fd8ff99);border:5px solid #fff;box-shadow:0 0 22px #bfefff;z-index:13`); pop(ice, 300);
    ov(h, whiteEyes + frown);
    await wait(500); const tg = add(`<div>アカウント凍結</div>`, `left:520px;top:236px;font-size:26px;color:#fff;background:#d3202a;border:4px solid ${INK};padding:5px 12px;white-space:nowrap;z-index:25;rotate:-5deg`);
    add(`<div></div>`, "left:100px;top:-22px;width:3px;height:22px;background:#fff", tg); anim(tg, [{ transform: "translateY(-80px)", opacity: 0 }, { transform: "none", opacity: 1 }], 300);
    const pn = add(`<div></div>`, "left:14px;top:70px;width:410px;height:178px;background:#000b;border:2px solid #fff6;border-radius:10px;z-index:30"); pop(pn);
    for (let i = 0; i < 4; i++) { await wait(420); zari(22, 78 + i * 42, 34, { z: 31, face: ["smile", "evil", "sad", "smile"][i] });
      const t = add(`<div>燃えてたほうが良かった</div>`, `left:64px;top:${84 + i * 42}px;font-size:24px;z-index:31;white-space:nowrap`, s); anim(t, [{ opacity: 0, transform: "translateX(-20px)" }, { opacity: 1, transform: "none" }], 200); }
    await wait(1800);
  },

  async i_T49_03() { // 営業先ダウン三段
    const h = ham(N); let v = qVenue(0, 4), lb = label(`📍 ${v.name}　客 4匹`, "right:16px;top:16px;z-index:40");
    for (let k = 0; k < 4; k++) {
      if (k) { chip(`連続デス ${k}回`); shake(h); await wait(300); qFlash(); v.S.forEach(e => e.remove()); v.Z.forEach(e => e.remove()); v = qVenue(k, 4 - k); lb.textContent = `📍 ${v.name}　客 ${4 - k}匹`; await wait(600); }
      else { chip("連続デス 0回"); await wait(900); }
      const size = [60, 44, 30, 18][k]; hop(h, 40 - k * 8);
      say(qGagTxt, 470, 300, { size, color: "#ffd23c", ms: 1500, z: 31 });
      v.Z.forEach((z, i) => anim(z, [{ transform: "none" }, { transform: `translateY(${-30 + k * 7}px)` }, { transform: "none" }], 400, { delay: 150 + i * 60 }));
      if (k == 0) { bubble("キャーッ!", 280, 330, 900); } if (k == 1) bubble("パチ…パチ…", 300, 330, 900); if (k == 2) bubble("(あくび)", 440, 330, 900); if (k == 3) bubble("…", 480, 330, 900);
      await wait(1900);
    }
    await wait(500);
  },

  async i_T49_05() { // 拍手じゃなく蚊
    const h = ham(N); const v = qVenue(2, 1), z = v.Z[0]; chip("試合に勝利");
    const mq = add(`<div>🦟</div>`, "left:400px;top:340px;font-size:30px;z-index:30"); const wa = mq.animate([{ transform: "translate(0,0)" }, { transform: "translate(60px,-40px)" }, { transform: "translate(10px,30px)" }, { transform: "translate(-50px,-10px)" }, { transform: "translate(0,0)" }], { duration: 1500, iterations: 9 });
    await wait(900); hop(h, 50); say(qGagTxt, 500, 290, { size: 46, ms: 1400 }); await wait(1200);
    anim(z, [{ transform: "none" }, { transform: "scale(.88,1.05)" }, { transform: "none" }], 200); say("パチン!", 330, 350, { size: 44, color: "#fff", ms: 900 }); wa.cancel(); mq.remove();
    const eyes = ov(h, closedEyes + tears); hop(h, 30); bubble("拍手だ…!!", 580, 240, 1500); await wait(1700);
    const zm = add(`<div></div>`, `left:70px;top:130px;width:230px;height:230px;border-radius:50%;background:#fff;border:6px solid ${INK};z-index:40;overflow:visible;color:#222`);
    add(`<div>🦟</div>`, "left:62px;top:50px;font-size:96px;rotate:180deg;filter:grayscale(.6);opacity:.9", zm); add(`<div>蚊の死骸</div>`, "left:0;right:0;top:160px;text-align:center;font-size:30px", zm); add(`<div>手の中</div>`, "left:0;right:0;top:12px;text-align:center;font-size:22px;color:#777", zm);
    pop(zm, 300); bubble("さっきから刺されてて", 500, 310, 1800); eyes.remove(); ov(h, whiteEyes + frown); h.img.style.filter = "saturate(.5)";
    await wait(2300); anim(zm, [{ opacity: 1 }, { opacity: 0 }], 250); await wait(1200);
  },

  async i_T49_09() { // 客が先に言う
    const h = ham(N); const v = qVenue(2, 2); chip("チャットで「あれやって」");
    await wait(600); bubble("あれやって〜", 360, 330, 1200); await wait(1300);
    anim(h, [{ transform: "none" }, { transform: "rotate(-8deg)" }], 300); bubble("では…", 600, 240, 1300); const mo = ov(h, openMouth); await wait(1400);
    say(qGagTxt, 440, 280, { size: 66, color: "#fff", ms: 1700, z: 35 });
    v.Z.forEach((z, i) => anim(z, [{ transform: "none" }, { transform: "translateY(-35px) scale(1.1)" }, { transform: "none" }], 500, { delay: i * 80 }));
    await wait(700); anim(h, [{ transform: "rotate(-8deg)" }, { transform: "none" }], 250); mo.remove(); ov(h, whiteEyes + openMouth); h.classList.add("trem");
    bubble("…", 600, 240, 2200); await wait(1000);
    say("パチパチ", 330, 360, { size: 36, color: "#fff", ms: 1000 });
    v.Z.forEach(z => hop(z, 14)); await wait(1100);
    v.Z.forEach((z, i) => { z.style.zIndex = 14; anim(z, [{ transform: "none" }, { transform: "translate(-200px,-10px)" }, { transform: "translate(-500px,0)" }], 1400, { delay: i * 150, easing: "ease-in" }); });
    bubble("満足〜♪", 250, 330, 1300); await wait(2200); h.classList.remove("trem");
  },

  async i_T50_02() { // 瀕死のロゴ向け
    const h = ham(N); await wait(800); chip("デス"); shake(h);
    const eyes = ov(h, closedEyes + frown); h.img.style.filter = "saturate(.35) brightness(.9)";
    h.style.transformOrigin = "50% 50%"; await anim(h, [{ transform: "none" }, { transform: "translateX(-110px) rotate(-90deg)" }], 500, { easing: "ease-in" }); say("ドサッ", 560, 330, { size: 40, color: "#fff", ms: 800 });
    await wait(800); say("このおがくずさえあれば…", 420, 200, { size: 34, color: "#bcd", ms: 2600 }); await wait(1000);
    const g = add(`<div></div>`, "left:690px;top:130px;width:130px;height:260px;perspective:500px;z-index:9"); const arm = add(`<div></div>`, `left:57px;top:140px;width:18px;height:130px;background:#c9c0bc;border:3px solid ${INK};border-radius:8px`, g);
    const bw = add(`<div></div>`, "left:10px;top:0;width:110px;height:146px;transform-style:preserve-3d;z-index:11", g); const face = (extra, inner) => add(`<div>${inner}</div>`, `left:0;top:0;width:100%;height:100%;backface-visibility:hidden;background:#c8975a;border:4px solid ${INK};border-radius:6px;${extra}`, bw);
    face("", `<div style="left:0;top:0;width:100%;height:14px;background:#a67840"></div><div style="left:10px;top:50px;width:60px;height:3px;background:#a67840"></div>`);
    face("transform:rotateY(180deg)", `<div style="left:0;top:0;width:100%;height:14px;background:#a67840"></div><div style="left:50%;top:66px;translate:-50% -50%;width:90px;height:90px;border-radius:50%;background:radial-gradient(#fff8c0,#ffd23c 60%,#ff9a00);border:3px solid ${INK}"></div><div style="left:0;right:0;top:44px;text-align:center;font-size:19px;color:#4a2a00;line-height:1.1;white-space:nowrap">光る<br>おがくず</div><div style="left:0;right:0;bottom:3px;text-align:center;font-size:13px;color:#fff">✨PR✨</div>`);
    const hand = add(`<div></div>`, `left:46px;top:126px;width:44px;height:44px;border-radius:50%;background:#fbcbc3;border:4px solid ${INK};z-index:12`, g);
    await anim(g, [{ transform: "translateY(150px)" }, { transform: "translateY(0)" }], 900, { easing: "ease-out" });
    g.animate([{ transform: "translateX(-3px)" }, { transform: "translateX(3px)" }], { duration: 90, iterations: 8, direction: "alternate" });
    await anim(bw, [{ transform: "rotateY(0)" }, { transform: "rotateY(180deg)" }], 800, { easing: "ease-in-out" }); await wait(100);
    const gl = add(`<div></div>`, "left:650px;top:90px;width:230px;height:230px;border-radius:50%;background:radial-gradient(#fff8a0cc,#ffd23c00 70%);z-index:8"); anim(gl, [{ transform: "scale(.3)", opacity: 0 }, { transform: "scale(1)", opacity: 1 }], 300);
    for (let i = 0; i < 5; i++) flash(660, 860, 100, 280, "#fff6a0");
    say("ピカーッ", 560, 150, { size: 48, color: "#ffe066", ms: 1500 }); await wait(1700);
    await anim(g, [{ transform: "none" }, { transform: "translateY(170px) rotate(14deg)" }], 600, { easing: "ease-in" }); gl.remove(); eyes.remove(); ov(h, whiteEyes + frown);
    label("※おがくずは提供品です", "left:20px;bottom:20px"); await wait(1500);
  },

  async i_T50_06() { // 泣きながら宣伝
    const h = ham(N); await wait(700); chip("試合に敗北"); shake(h);
    let eyes = ov(h, closedEyes + tears + openMouth); h.classList.add("trem"); say("うわぁぁん", 500, 250, { size: 54, color: "#9db4d8", ms: 1500 }); await wait(1800);
    h.classList.remove("trem"); const bs = zari(HX + 40, 215, 130, { z: 9, face: "evil", acc: "tie" });
    const tag = label("ザリガニ社長", `left:${HX + 40}px;top:185px;z-index:9`);
    const cue = add(`<div>そこで<br>おがくず!</div>`, `left:560px;top:205px;width:200px;height:100px;background:#fff;border:5px solid ${INK};color:#d3202a;font-size:34px;line-height:1.15;text-align:center;padding-top:8px;rotate:-4deg;z-index:9`);
    anim(bs, [{ transform: "translateY(150px)" }, { transform: "none" }], 400); anim(cue, [{ transform: "translateX(200px)", opacity: 0 }, { transform: "none", opacity: 1 }], 400);
    await wait(1200); eyes.remove(); eyes = ov(h, whiteEyes + frown); await wait(500);
    eyes.remove(); eyes = ov(h, closedEyes + qSmile); hop(h, 36);
    bubble("でも、おがくずがあれば<br>明日も…", 400, 330, 2600);
    const iv = setInterval(() => { for (const x of MIDX) { const [px, py] = P(x, 580); const d = add(`<div></div>`, `left:${px}px;top:${py}px;width:12px;height:7px;background:#ffe066;box-shadow:0 0 8px #ffd23c;z-index:20`); anim(d, [{ transform: "none" }, { transform: `translate(${rnd(-8, 8)}px,120px) rotate(${rnd(90, 300)}deg)`, opacity: 0 }], 800, { easing: "ease-in" }).then(() => d.remove()); } }, 90);
    await wait(900); const pr = add(`<div>PR</div>`, `left:${HX + HW - 40}px;top:${HY + 60}px;width:46px;height:46px;border-radius:50%;background:#d3202a;border:4px solid #fff;font-size:20px;text-align:center;line-height:38px;z-index:20`); pop(pr);
    await wait(1900); clearInterval(iv); await wait(500);
  },
});
}
