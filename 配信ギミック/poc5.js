// 配信ハム PoC 第5弾 (別のAI「Fable」が考えた25案)。poc.js / poc2.js / poc3.js の部品を使い、scenes に足す。
// シーンごとの部品がぶつからないよう、まとまりごとに { } で囲んでいる。

{ // 配信ハム PoC 第5弾 (e1)。poc.js / poc2.js / poc3.js の部品を使い、scenes に足す。
const e1Paw = (x, y, r = 16, z = 14) => add(`<div></div>`, `left:${x - r}px;top:${y - r}px;width:${r * 2}px;height:${r * 2}px;border-radius:50%;background:#fbcbc3;border:4px solid ${INK};z-index:${z}`);
const e1Fur = id => `<defs><linearGradient id=${id} x2=0 y2=1><stop offset=.62 stop-color=#aaa1a0 /><stop offset=.62 stop-color=#fbf5e9 /></linearGradient></defs>` + MIDX.map(x => `<circle cx=${x} cy=488 r=91 fill=url(#${id}) />`).join("");
const e1Happy = e1Fur("e1h") + MIDX.map(x => `<path d="M${x - 64} 520Q${x} 420 ${x + 64} 520" ${line} />`).join(""); // ニッコリ目
const e1Sweat = `<path d="M1010 290q-44 74 0 102q44-28 0-102" fill=#7cc4ff stroke=${INK} stroke-width=9 /><path d="M196 330q-36 60 0 84q36-24 0-84" fill=#7cc4ff stroke=${INK} stroke-width=9 />`;
const e1Gloom = `<path d="M420 140V330M520 120V320M620 110V316M720 120V320M820 140V330" stroke=#5f86ff stroke-width=18 stroke-linecap=round opacity=.85 />`;
const e1Steam = (x, y, z = 13) => { const e = add(`<svg viewBox="0 0 40 50" style="overflow:visible"><path d="M12 48c-8-10 8-16 0-26s8-16 0-22M28 48c-8-10 8-16 0-26s8-16 0-22" fill=none stroke=#fff stroke-width=4 stroke-linecap=round /></svg>`, `left:${x - 20}px;top:${y - 50}px;width:40px;height:50px;z-index:${z};filter:drop-shadow(0 0 2px #0009)`);
  e.animate([{ transform: "translateY(10px)", opacity: 0 }, { transform: "none", opacity: 1, offset: .4 }, { transform: "translateY(-12px)", opacity: 0 }], { duration: 1300, iterations: Infinity }); return e; };
const e1Wind = (n = 14) => { for (let i = 0; i < n; i++) { const w = add(`<div></div>`, `left:0;top:${rnd(150, 530)}px;width:${rnd(90, 220)}px;height:5px;border-radius:3px;background:#fffc;z-index:21`);
  anim(w, [{ transform: "translateX(1000px)" }, { transform: "translateX(-260px)" }], rnd(380, 600), { delay: i * 80, easing: "linear", fill: "both" }).then(() => w.remove()); } };

Object.assign(scenes, {
  async tent() { // 占拠テント
    const h = ham(N), TX = 450, TY = 322, DX = 600 - (HX + HW / 2), TK = 300 / 260;
    const bar = add(`<div><div style="left:0;top:0;width:0;height:100%;background:linear-gradient(#8fe8ff,#1fa0e0);transition:width .45s"></div><div style="left:0;right:0;top:4px;text-align:center;font-size:25px;color:#fff;text-shadow:0 2px 0 #000,0 0 4px #000">占拠率 0%</div></div>`,
      "left:330px;top:62px;width:300px;height:44px;background:#000b;border:3px solid #fff;border-radius:10px;overflow:hidden;z-index:20");
    const [fill, txt] = bar.children, setBar = p => { fill.style.width = p + "%"; txt.textContent = `占拠率 ${p}%`; anim(bar, [{ transform: "scale(1.12)" }, { transform: "none" }], 220); };
    const tsvg = z => add(`<svg viewBox="0 0 260 184" style="overflow:visible"></svg>`, `left:${TX}px;top:${TY}px;width:300px;height:212px;z-index:${z}`);
    const back = tsvg(9), front = tsvg(11); // 中の暗がり / 布 (ハムはこの間に入る)
    const put = (svg, inner, from) => { svg.insertAdjacentHTML("beforeend", `<g>${inner}</g>`); const g = svg.lastChild; g.style.transformBox = "fill-box"; g.style.transformOrigin = "50% 100%";
      anim(g, [{ transform: from, opacity: 0 }, { transform: "none", opacity: 1 }], 280); return g; };
    await wait(700); chip("占拠ポイントに乗った"); setBar(0); await wait(300);
    for (const x of [-10, 20, 240, 258]) { put(front, `<path d="M${x - 6} 158h12v14l-6 10l-6-10Z" fill=#b07a44 stroke=${INK} stroke-width=3 />`, "translateY(-26px)"); hop(h, 14); say("トン", Math.min(TX + x * TK, 690), 470, { size: 28, color: "#fff", ms: 300 }); await wait(280); }
    await wait(400); chip("占拠率 上昇"); setBar(33); hop(h, 24);
    const frame = put(front, `<path d="M14 178L130 6L246 178M130 6V178" fill=none stroke=${INK} stroke-width=11 stroke-linecap=round stroke-linejoin=round /><path d="M14 178L130 6L246 178M130 6V178" fill=none stroke=#a3acb8 stroke-width=5 stroke-linecap=round stroke-linejoin=round />`, "scaleY(0)");
    say("骨組み よいしょ", 600, 262, { size: 32, color: "#fff", ms: 900 }); await wait(1300);
    chip("占拠率 上昇"); setBar(66); hop(h, 24); frame.remove();
    put(back, `<path d="M130 40L54 180H206Z" fill=#2e1c10 /><ellipse cx=130 cy=170 rx=58 ry=14 fill=#ffb04a44 />`, "none");
    put(front, `<path d="M40 110L-12 172M220 110L272 172" stroke=#eee stroke-width=2 /><path d="M130 2L4 180H54L130 40Z" fill=#f39a2b stroke=${INK} stroke-width=5 stroke-linejoin=round /><path d="M130 2L256 180H206L130 40Z" fill=#d9761a stroke=${INK} stroke-width=5 stroke-linejoin=round />
      <path d="M130 40L54 180H78Z" fill=#ffc46a stroke=${INK} stroke-width=3 stroke-linejoin=round /><path d="M130 40L206 180H182Z" fill=#efa043 stroke=${INK} stroke-width=3 stroke-linejoin=round /><path d="M130 2V-28" stroke=${INK} stroke-width=4 /><path d="M130 -28L160 -19L130 -10Z" fill=#3cc8ff stroke=${INK} stroke-width=3 stroke-linejoin=round />`, "translateY(-70px)");
    say("バサッ", 600, 262, { size: 40, color: "#fff", ms: 700 }); await wait(1300);
    chip("占拠率 100%"); setBar(100); bar.style.boxShadow = "0 0 18px #7fe3ff"; await wait(250);
    await anim(h, Array.from({ length: 9 }, (_, i) => ({ transform: `translate(${DX * i / 8}px,${i % 2 ? -16 : 0}px) scale(${1 - .4 * i / 8})` })), 900, { easing: "linear" });
    ov(h, `<path d="M150 800Q600 690 1090 800L1150 1190Q600 1320 90 1190Z" fill=#3f74c9 stroke=${INK} stroke-width=16 /><path d="M175 832Q600 742 1065 832" fill=none stroke=#9cc0ff stroke-width=28 /><path d="M860 870V1210" stroke=#d8e2f0 stroke-width=10 stroke-dasharray="22 14" />`);
    const glow = add(`<div></div>`, "left:690px;top:380px;width:240px;height:200px;border-radius:50%;background:radial-gradient(#ffb04a99,#ffb04a00 68%);z-index:8");
    const fire = add(`<svg viewBox="0 0 80 90" style="overflow:visible"><path d="M8 84L72 70M8 70L72 84" stroke=${INK} stroke-width=15 stroke-linecap=round /><path d="M8 84L72 70M8 70L72 84" stroke=#8a5a30 stroke-width=9 stroke-linecap=round />
      <g><path d="M40 4C60 30 72 46 63 62C56 75 24 75 17 62C9 46 25 32 40 4Z" fill=#ff7a1a stroke=${INK} stroke-width=4 /><path d="M40 30C51 44 55 53 50 63C46 69 34 69 30 63C25 53 31 44 40 30Z" fill=#ffd23c /></g></svg>`, "left:772px;top:446px;width:80px;height:90px;z-index:12");
    const fl = fire.querySelector("g"); fl.style.transformBox = "fill-box"; fl.style.transformOrigin = "50% 100%";
    fl.animate([{ transform: "scale(1,1)" }, { transform: "scale(1.12,.86) skewX(-4deg)" }], { duration: 170, iterations: Infinity, direction: "alternate" }); pop(fire);
    const mug = add(`<svg viewBox="0 0 40 36" style="overflow:visible"><path d="M30 10q12 0 12 9t-12 9" fill=none stroke=${INK} stroke-width=5 /><rect x=2 y=4 width=30 height=30 rx=5 fill=#e04848 stroke=${INK} stroke-width=4 /><rect x=6 y=12 width=22 height=6 fill=#fff8 /></svg>`, "left:694px;top:490px;width:50px;height:45px;z-index:12");
    const stm = e1Steam(716, 488); pop(mug);
    say("ぬくぬく", 800, 300, { size: 40, color: "#ffe9a8", ms: 1500 }); await wait(1900);
    chip("敵に奪い返された"); fill.style.background = "linear-gradient(#ff9a8a,#d3202a)"; bar.style.borderColor = "#ff6a5a"; bar.style.boxShadow = "0 0 18px #ff3a2a"; txt.style.color = "#ffb0a0"; setBar(0);
    e1Wind(18); say("ビュオォォ", 300, 260, { size: 56, color: "#fff", ms: 1100 }); await wait(500);
    for (const e of [back, front, fire, glow, mug, stm]) anim(e, [{ transform: "none" }, { transform: `translate(${-rnd(420, 520)}px,${-rnd(60, 120)}px) rotate(${-rnd(30, 60)}deg)`, offset: .45 }, { transform: `translate(${-rnd(900, 1100)}px,${-rnd(260, 420)}px) rotate(${-rnd(160, 320)}deg)` }], 1100, { easing: "ease-in" });
    await wait(1100); ov(h, frown + e1Gloom);
    h.animate([{ transform: `translate(${DX - 3}px,0) scale(.6)` }, { transform: `translate(${DX + 3}px,0) scale(.6)` }], { duration: 90, iterations: Infinity, direction: "alternate" });
    say("ぽつん…", 330, 330, { size: 44, color: "#cfe0ff", ms: 1800 }); await wait(500); bubble("……さむい", 600, 334, 1500); await wait(1600);
  },

  async ecg() { // 心電図ハム
    const h = ham(N), MX = 436, MY = 132, B = 92, SP = [0, -5, -2, 6, -64, 22, -4];
    const mon = add(`<div><div style="left:10px;top:10px;width:250px;height:140px;border-radius:6px;overflow:hidden;background:#03140b;background-image:linear-gradient(#1f5a3366 1px,#0000 1px),linear-gradient(90deg,#1f5a3366 1px,#0000 1px);background-size:25px 25px">
      <svg viewBox="0 0 250 140" style="left:0;top:0;width:250px;height:140px;overflow:visible"><path class=tr fill=none stroke=#4dff7a stroke-width=3 stroke-linejoin=round style="filter:drop-shadow(0 0 3px #4dff7a)" />
      <path class=hz fill=none stroke=#ff6b9a stroke-width=5 stroke-linejoin=round stroke-linecap=round style="filter:drop-shadow(0 0 5px #ff6b9a)" /><path class=pn fill=none stroke=#ffe14d stroke-width=6 stroke-linejoin=round stroke-linecap=round /></svg>
      <div style="left:8px;top:4px;font-size:15px;color:#ffb03a">OVERTIME</div><div class=bpm style="right:8px;top:4px;font-size:15px;color:#4dff7a">♥ 72</div></div></div>`,
      `left:${MX}px;top:${MY}px;width:280px;height:170px;background:#d9dde3;border:5px solid ${INK};border-radius:14px;z-index:12;opacity:0`);
    const q = c => mon.querySelector(c), tr = q(".tr"), hz = q(".hz"), pn = q(".pn"), bpm = q(".bpm"), OX = MX + 15, OY = MY + 15; // 画面の原点
    const cable = add(`<svg viewBox="0 0 960 540" style="left:0;top:0;width:960px;height:540px;overflow:visible"><path d="M${MX + 250} ${MY + 168}C${MX + 262} 420 760 476 796 462" fill=none stroke=#555 stroke-width=5 /><circle cx=796 cy=462 r=10 fill=#fff stroke=${INK} stroke-width=4 /></svg>`, "z-index:11;opacity:0");
    const NS = 126, buf = Array(NS).fill(B); let ci = 0, cnt = 0, P = 60, A = 1, mode = 0, k = 2; // mode 1:鼓動 2:平ら 0:止める
    const beep = () => { const b = add(`<div class=t>ピッ</div>`, `left:${MX + 214}px;top:${MY - 38}px;font-size:24px;color:#4dff7a;-webkit-text-stroke:5px #032;z-index:13`);
      anim(b, [{ transform: "scale(1.4)", opacity: 1 }, { transform: "translateY(-10px)", opacity: 0 }], 380).then(() => b.remove()); };
    const seg = (a, b) => b - a > 1 ? "M" + buf.slice(a, b).map((y, i) => `${(a + i) * 2} ${y.toFixed(1)}`).join("L") : "";
    const iv = setInterval(() => { if (!mode) return;
      for (let j = 0; j < k; j++) { let y = B; if (mode === 1) { const o = cnt % P; y = B + (SP[o] || 0) * A + rnd(-1, 1) * (1.3 - A) * 4; if (o === 4) beep(); } buf[ci] = y; ci = (ci + 1) % NS; cnt++; }
      tr.setAttribute("d", seg(0, ci) + seg(Math.min(ci + 4, NS), NS)); }, 30);
    const speed = (p, a, b) => { P = p; A = a; bpm.textContent = `♥ ${b}`; };
    let eyes;
    for (const win of [1, 0]) {
      await wait(win ? 700 : 500); chip("オーバータイム突入"); if (win) { pop(mon); anim(cable, [{ opacity: 0 }, { opacity: 1 }], 300); } buf.fill(B); hz.setAttribute("d", ""); tr.style.opacity = 1; speed(60, 1, 72); mode = 1; k = 2;
      await wait(win ? 1200 : 700); speed(34, 1, 130); if (win) say("ピッ…ピッ…", 300, 200, { size: 40, color: "#4dff7a", ms: 900 });
      await wait(win ? 1000 : 700); speed(20, .85, 170); eyes = ov(h, whiteEyes + e1Sweat);
      await wait(win ? 900 : 700); speed(12, .7, 220); const tm = h.animate([{ transform: "translateX(-3px)" }, { transform: "translateX(3px)" }], { duration: 65, iterations: Infinity, direction: "alternate" });
      await wait(900); tm.cancel();
      if (win) { chip("勝利"); mode = 0; tr.style.opacity = .15; bpm.textContent = "♥ ♥ ♥";
        hz.setAttribute("d", `M0 ${B}H125L88 54C70 36 82 14 104 16C116 17 123 26 125 34C127 26 134 17 146 16C168 14 180 36 162 54L125 ${B}H250`);
        const L = hz.getTotalLength(); hz.style.strokeDasharray = L; anim(hz, [{ strokeDashoffset: L }, { strokeDashoffset: 0 }], 900, { easing: "ease-in-out" });
        eyes.remove(); eyes = ov(h, e1Happy); hop(h, 50); say("勝利!!", 240, 220, { size: 64, ms: 1400 }); await wait(1700); eyes.remove();
      } else { chip("敗北"); mode = 2; k = 4; bpm.textContent = "♥ ---"; say("ピーーーー", 250, 220, { size: 50, color: "#4dff7a", ms: 1500 });
        eyes.remove(); eyes = ov(h, whiteEyes + openMouth + e1Sweat + e1Gloom); shake(h); await wait(1000); mode = 0;
        pn.setAttribute("d", "M4 92L34 91L44 46L55 126L66 86L96 94L107 30L118 132L130 88L160 93L171 50L181 122L192 89L246 92"); const L = pn.getTotalLength();
        pn.style.strokeDasharray = L; pn.style.strokeDashoffset = L;
        const pen = add(`<svg viewBox="0 0 100 100" style="overflow:visible"><path d="M0 0L16 6L84 74L74 84L6 16Z" fill=#ffd23c stroke=${INK} stroke-width=4 stroke-linejoin=round /><path d="M0 0L16 6L6 16Z" fill=${INK} /><circle cx=86 cy=86 r=17 fill=#fbcbc3 stroke=${INK} stroke-width=4 /></svg>`, "left:0;top:0;width:90px;height:90px;z-index:14");
        const pts = Array.from({ length: 30 }, (_, i) => pn.getPointAtLength(L * i / 29)).map(p => ({ transform: `translate(${OX + p.x}px,${OY + p.y}px)` }));
        await anim(pen, [{ transform: "translate(760px,420px)" }, pts[0]], 260);
        anim(pn, [{ strokeDashoffset: L }, { strokeDashoffset: 0 }], 1300, { easing: "linear" }); say("カキカキ", 300, 260, { size: 40, color: "#fff", ms: 1200 });
        await anim(pen, pts, 1300, { easing: "linear" }); await anim(pen, [pts[29], { transform: "translate(770px,430px)", opacity: 0 }], 300);
        bubble("まだ生きてる!", 820, 248, 1500); await wait(1500); }
    }
    clearInterval(iv); await wait(300);
  },

  async popcorn() { // ポップコーン席
    const h = ham(N), BX = HX + HW / 2;
    const kernel = (x, y, z = 21, k = 1) => add(`<div></div>`, `left:${x}px;top:${y}px;width:${rnd(13, 19) * k}px;height:${rnd(12, 17) * k}px;border-radius:45% 55% 50% 40%;background:radial-gradient(circle at 40% 40%,#fffdf0,#ffe39a);border:2px solid #b08a3a;z-index:${z}`);
    const m = x => 45 + (x - 45) * .77;
    const mkBucket = () => add(`<svg viewBox="0 0 90 100" style="overflow:visible">${[[12, 18], [28, 12], [46, 8], [64, 13], [80, 19], [36, 22], [56, 22]].map(([x, y]) => `<circle cx=${x} cy=${y} r=12 fill=#fff6d8 stroke=#b08a3a stroke-width=2.5 />`).join("")}
      <path d="M2 26H88L78 98H12Z" fill=#fff />${[[2, 16], [30, 44], [58, 72]].map(([a, b]) => `<path d="M${a} 26H${b}L${m(b)} 98H${m(a)}Z" fill=#e53935 />`).join("")}<path d="M2 26H88L78 98H12Z" fill=none stroke=${INK} stroke-width=4 stroke-linejoin=round /></svg>`,
      `left:${BX - 45}px;top:432px;width:90px;height:100px;z-index:12;transform-origin:50% 100%`);
    const banner = (name, col) => { const b = add(`<div><div style="left:0;right:0;top:8px;text-align:center;font-size:20px;color:#ffd23c;letter-spacing:6px">PLAY OF THE GAME</div><div class=t style="left:0;right:0;top:36px;text-align:center;font-size:52px;color:${col}">${name}</div></div>`,
      "left:100px;top:150px;width:500px;height:110px;background:linear-gradient(90deg,#0000,#000d 18%,#000d 82%,#0000);z-index:20"); anim(b, [{ transform: "scaleY(0)" }, { transform: "none" }], 220); return b; };
    await wait(700); chip("POTG 開始: 健");
    const dim = layer("z-index:5;background:radial-gradient(ellipse at 35% 45%,#0000 20%,#000c 85%)"); anim(dim, [{ opacity: 0 }, { opacity: 1 }], 400);
    const seat = add(`<svg viewBox="0 0 272 300" style="overflow:visible"><rect x=6 y=4 width=260 height=320 rx=50 fill=#a31515 stroke=${INK} stroke-width=6 /><path d="M72 76V300M136 72V300M200 76V300" stroke=#7a0e0e stroke-width=6 stroke-linecap=round /><rect x=6 y=4 width=260 height=64 rx=32 fill=#d32f2f stroke=${INK} stroke-width=6 /></svg>`, `left:${HX - 24}px;top:${HY - 56}px;width:272px;height:300px;z-index:9`);
    const arms = [HX - 32, HX + HW - 12].map(x => add(`<div></div>`, `left:${x}px;top:452px;width:48px;height:96px;background:linear-gradient(#7a1414,#3a0808);border:5px solid ${INK};border-radius:16px 16px 0 0;z-index:11`));
    const cola = add(`<svg viewBox="0 0 40 70" style="overflow:visible"><path d="M24 14L30 -10" stroke=#fff stroke-width=5 /><path d="M4 14H36L32 66H8Z" fill=#fff stroke=${INK} stroke-width=4 stroke-linejoin=round /><path d="M6 30H34L33 44H7Z" fill=#e53935 /></svg>`, `left:${HX - 28}px;top:392px;width:40px;height:66px;z-index:12`);
    [seat, ...arms, cola].forEach(e => pop(e));
    ov(h, `<path d="M262 460L130 380M946 460L1080 380" stroke=${INK} stroke-width=40 stroke-linecap=round /><path d="M262 460L130 380M946 460L1080 380" stroke=#fff stroke-width=22 stroke-linecap=round /><path d="M498 470H710" stroke=${INK} stroke-width=40 /><path d="M498 470H710" stroke=#fff stroke-width=22 />` +
      [[262, "#e53935"], [710, "#22c3dd"]].map(([x, c]) => `<rect x=${x} y=396 width=236 height=176 rx=26 fill=${c} fill-opacity=.85 stroke=${INK} stroke-width=40 /><rect x=${x} y=396 width=236 height=176 rx=26 fill=none stroke=#fff stroke-width=22 />`).join(""));
    let bucket = mkBucket(); pop(bucket); let pL = e1Paw(BX - 46, 478), pR = e1Paw(BX + 46, 478);
    let ban = banner("健", "#ffd23c"); await wait(700);
    for (let i = 0; i < 3; i++) { const t = kernel(BX - 6, 432, 13); anim(pR, [{ transform: "none" }, { transform: "translate(-30px,-70px)" }, { transform: "none" }], 420); await anim(t, [{ transform: "none" }, { transform: "translate(-10px,-50px)", opacity: 1 }, { transform: "translate(-10px,-40px)", opacity: 0 }], 420); t.remove(); }
    say("もぐもぐ", 560, 330, { size: 30, color: "#fff", ms: 600 }); await wait(500);
    say("ブラボー!!", 330, 340, { size: 62, ms: 1800 }); say("スタンディングオベーション", 340, 410, { size: 30, color: "#fff", ms: 1800 });
    anim(h, [{ transform: "none" }, { transform: "translateY(-48px) scaleY(1.08)" }], 260);
    anim(bucket, [{ transform: "none" }, { transform: "translate(-80px,20px) rotate(-120deg)", opacity: 0 }], 500, { easing: "ease-in" });
    for (let i = 0; i < 34; i++) { const t = kernel(rnd(BX - 40, BX + 30), rnd(420, 450)); anim(t, [{ transform: "none" }, { transform: `translate(${rnd(-260, 120)}px,${-rnd(120, 300)}px) rotate(${rnd(-200, 200)}deg)`, offset: .45 }, { transform: `translate(${rnd(-380, 140)}px,${rnd(160, 260)}px) rotate(${rnd(-400, 400)}deg)` }], rnd(900, 1300), { delay: rnd(0, 500), easing: "linear", fill: "both" }).then(() => t.remove()); }
    const U = "translate(0,-58px) scale(1.15)", L1 = "translate(34px,-64px) scale(1.15)", R1 = "translate(-34px,-64px) scale(1.15)";
    for (let i = 0; i < 6; i++) { await Promise.all([anim(pL, [{ transform: U }, { transform: L1 }], 110), anim(pR, [{ transform: U }, { transform: R1 }], 110)]);
      if (i % 2 === 0) say("パチ", 680 + rnd(-10, 10), 300 + i * 12, { size: 30, color: "#fff", ms: 300 });
      await Promise.all([anim(pL, [{ transform: L1 }, { transform: U }], 110), anim(pR, [{ transform: R1 }, { transform: U }], 110)]); }
    await wait(900); ban.remove(); bucket.remove();
    anim(h, [{ transform: "translateY(-48px) scaleY(1.08)" }, { transform: "none" }], 260); anim(pL, [{ transform: U }, { transform: "none" }], 260); await anim(pR, [{ transform: U }, { transform: "none" }], 260);
    await wait(500); chip("POTG 開始: 敵"); ban = banner("敵", "#ff5a4a"); bucket = mkBucket(); pop(bucket); ov(h, frown);
    await wait(700); bubble("……", BX, 256, 900); await wait(900);
    for (let i = 0; i < 5; i++) { const t = kernel(BX + 30, 420, 21, 1.4), tx = 470 + rnd(-40, 40), ty = 300 + rnd(-30, 30);
      anim(pR, [{ transform: "none" }, { transform: "translate(-10px,-80px)" }, { transform: "none" }], 300);
      await anim(t, [{ transform: "none" }, { transform: `translate(${(tx - BX - 30) / 2}px,${-170 + rnd(-20, 20)}px) rotate(200deg)` }, { transform: `translate(${tx - BX - 30}px,${ty - 420}px) rotate(400deg)` }], 420, { easing: "linear" });
      anim(t, [{ transform: `translate(${tx - BX - 30}px,${ty - 420}px) rotate(400deg)` }, { transform: `translate(${tx - BX - 30 + rnd(-10, 10)}px,${ty - 420 + 26}px) rotate(440deg)` }], 260); await wait(260); }
    await wait(300);
    const sign = add(`<div><div style="left:-6px;top:-130px;width:12px;height:130px;background:#8a5a30;border:2px solid ${INK}"></div><div style="left:-84px;top:-232px;width:168px;height:104px;background:#fff8e6;border:5px solid ${INK};border-radius:10px;color:#d3202a;font-size:62px;line-height:92px;text-align:center">返金</div><div style="left:-18px;top:-18px;width:36px;height:36px;border-radius:50%;background:#fbcbc3;border:4px solid ${INK}"></div></div>`,
      `left:${HX - 44}px;top:${HY + 196}px;width:0;height:0;z-index:15`);
    anim(sign, [{ transform: "translateY(150px) rotate(-8deg)" }, { transform: "translateY(-12px) rotate(3deg)", offset: .7 }, { transform: "none" }], 300); await wait(1900);
  },

  async peek() { // 見てられない
    const h = ham(N);
    const killcam = () => { const e = layer("z-index:6;backdrop-filter:grayscale(.85) brightness(.8);box-shadow:inset 0 0 140px 24px #b00000aa");
      add(`<div>▶ キルカム</div>`, "left:16px;top:66px;padding:4px 14px;background:#c0101de6;border-radius:6px;font-size:22px", e); anim(e, [{ opacity: 0 }, { opacity: 1 }], 250); return e; };
    const cap = x => `<rect x=${x} y=372 width=58 height=240 rx=29 fill=#fbcbc3 stroke=${INK} stroke-width=13 />`;
    const mkHands = () => { const o = ov(h, `<g>${MIDX.map(x => `<ellipse cx=${x} cy=640 rx=128 ry=70 fill=#fbcbc3 stroke=${INK} stroke-width=13 /><g class=e1fl>${cap(x - 118)}${cap(x - 60)}</g><g class=e1fr>${cap(x + 2)}${cap(x + 60)}</g>`).join("")}</g>`);
      anim(o, [{ transform: "translateY(90px)", opacity: 0 }, { transform: "none", opacity: 1 }], 220); return o; };
    const peekOnce = (hands, ms = 520) => Promise.all([...hands.querySelectorAll(".e1fl,.e1fr")].map(g => { const d = g.classList.contains("e1fl") ? -48 : 48;
      return anim(g, [{ transform: "none" }, { transform: `translateX(${d}px)`, offset: .25 }, { transform: `translateX(${d}px)`, offset: .7 }, { transform: "none" }], ms); }));
    const shiver = (hands, n = 14) => { hands.firstChild.animate([{ transform: "translate(-26px,0)" }, { transform: "translate(26px,8px)" }], { duration: 55, iterations: n, direction: "alternate" }); shake(h); };
    await wait(700); chip("デス → キルカム"); let kc = killcam(); await wait(300); let hands = mkHands(); await wait(500);
    await peekOnce(hands); await wait(200); await peekOnce(hands, 380);
    for (const t of ["背後から", "3発で", "ヘッドショット"]) { say(t, 360, 240, { size: 58, color: "#fff", ms: 900 }); shiver(hands); await wait(650); await peekOnce(hands, 380); await wait(150); }
    const box = add(`<svg viewBox="0 0 110 80" style="overflow:visible"><rect x=4 y=28 width=102 height=48 rx=6 fill=#8cc4f0 stroke=${INK} stroke-width=5 /><rect x=30 y=26 width=50 height=10 rx=5 fill=#3a5a7a /><path d="M42 31C34 12 50 2 57 13C64 1 82 8 70 31Z" fill=#fff stroke=#999 stroke-width=3 /><text x=55 y=64 text-anchor=middle font-size=16 font-weight=900 fill=#1d3a5a>ティッシュ</text></svg>`,
      `left:${HX - 120}px;top:424px;width:154px;height:112px;z-index:12`);
    const pw = e1Paw(HX + 52, 494, 20);
    anim(box, [{ transform: "translateX(60px)", opacity: 0 }, { transform: "none", opacity: 1 }], 300); await wait(300);
    say("スッ…", 560, 380, { size: 34, color: "#fff", ms: 1200 });
    anim(box, [{ transform: "none" }, { transform: "translateX(-210px)" }], 1700, { easing: "ease-in-out" }); await anim(pw, [{ transform: "none" }, { transform: "translateX(-210px)" }], 1700, { easing: "ease-in-out" });
    await anim(pw, [{ transform: "translateX(-210px)" }, { transform: "none", opacity: 0 }], 400); await wait(900);
    chip("復活"); fade(kc); fade(hands); fade(box); await wait(700);
    chip("デス → キルカム"); kc = killcam(); hands = mkHands(); say("0.2秒で即死", 360, 240, { size: 58, color: "#fff", ms: 1300 }); await wait(400); shiver(hands, 8); await wait(900);
    await anim(h, [{ transform: "none" }, { transform: "scaleX(0)" }], 170, { easing: "ease-in" });
    h.img.style.visibility = "hidden"; hands.style.display = "none";
    const bk = ov(h, `<circle cx=262 cy=250 r=120 fill=#aaa1a0 stroke=${INK} stroke-width=16 /><circle cx=974 cy=250 r=120 fill=#aaa1a0 stroke=${INK} stroke-width=16 />
      <path d="M150 760C120 380 360 150 618 150C876 150 1116 380 1086 760C1070 1080 900 1236 618 1236C336 1236 166 1080 150 760Z" fill=#aaa1a0 stroke=${INK} stroke-width=16 />
      <path d="M176 930C320 1120 916 1120 1060 930C1030 1120 870 1222 618 1222C366 1222 206 1120 176 930Z" fill=#efe6d8 /><path d="M618 180C596 420 596 700 618 980" fill=none stroke=#8a8281 stroke-width=70 stroke-linecap=round opacity=.55 />
      <circle cx=618 cy=1130 r=36 fill=#f4c7c7 stroke=${INK} stroke-width=10 /><ellipse cx=430 cy=1234 rx=74 ry=34 fill=#f4b3b3 stroke=${INK} stroke-width=12 /><ellipse cx=806 cy=1234 rx=74 ry=34 fill=#f4b3b3 stroke=${INK} stroke-width=12 />
      <ellipse cx=150 cy=540 rx=66 ry=76 fill=#fbcbc3 stroke=${INK} stroke-width=13 /><ellipse cx=1086 cy=540 rx=66 ry=76 fill=#fbcbc3 stroke=${INK} stroke-width=13 />`);
    await anim(h, [{ transform: "scaleX(0)" }, { transform: "none" }], 170, { easing: "ease-out" });
    bk.animate([{ transform: "translateX(-3px)" }, { transform: "translateX(3px)" }], { duration: 60, iterations: Infinity, direction: "alternate" });
    await wait(300); bubble("見てられない…", 820, 252, 1800); await wait(2000);
  },

  async noodle() { // 放置カップ麺
    const h = ham(N), CX = 628, cups = [];
    const cupHtml = `<svg viewBox="0 0 64 60" style="overflow:visible"><path d="M5 10H59L53 58H11Z" fill=#fffaf0 stroke=${INK} stroke-width=3.5 stroke-linejoin=round /><path d="M7 24H57L55.6 37H8.4Z" fill=#d3202a /><text x=32 y=35 text-anchor=middle font-size=11 font-weight=900 fill=#fff>ハム麺</text>
      <g class=e1lid><rect x=1 y=3 width=62 height=10 rx=4 fill=#e8e2d2 stroke=${INK} stroke-width=3.5 /><path d="M58 6L70 -2L73 4L62 11" fill=#e8e2d2 stroke=${INK} stroke-width=3 stroke-linejoin=round /></g></svg>`;
    const kettle = `<svg viewBox="0 0 80 70" style="overflow:visible"><path d="M24 40L2 54" stroke=${INK} stroke-width=12 stroke-linecap=round /><path d="M24 40L2 54" stroke=#cfd6de stroke-width=6 stroke-linecap=round /><ellipse cx=46 cy=38 rx=28 ry=24 fill=#cfd6de stroke=${INK} stroke-width=4 /><path d="M28 20Q46 -6 64 20" fill=none stroke=${INK} stroke-width=6 /><circle cx=46 cy=14 r=5 fill=#555 /><circle cx=68 cy=14 r=13 fill=#fbcbc3 stroke=${INK} stroke-width=4 /></svg>`;
    let stm;
    for (let i = 0; i < 5; i++) { const first = !i, y = 474 - 52 * i;
      await wait(first ? 700 : 300); chip(`デス ${i + 1}回目`); if (stm) stm.remove();
      const c = add(`<div>${cupHtml}</div>`, `left:${CX}px;top:${y}px;width:64px;height:60px;z-index:${8 + i}`), lid = c.querySelector(".e1lid"); lid.style.opacity = 0; c.lid = lid; cups.push(c); pop(c, 180);
      const kt = add(kettle, `left:${CX + 34}px;top:${y - 66}px;width:80px;height:70px;z-index:14`);
      await anim(kt, [{ transform: "translate(40px,-30px)", opacity: 0 }, { transform: "none", opacity: 1 }], first ? 260 : 140);
      const wt = add(`<div></div>`, `left:${CX + 32}px;top:${y - 14}px;width:6px;height:28px;border-radius:3px;background:#bfe6ff;border:1px solid #6aa8d8;z-index:13`);
      if (first) say("ジョボボ", 520, y - 40, { size: 32, color: "#fff", ms: 700 });
      await wait(first ? 550 : 240); wt.remove(); fade(kt, 150);
      lid.style.opacity = 1; await anim(lid, [{ transform: "translateY(-14px)" }, { transform: "none" }], 140); stm = e1Steam(CX + 32, y + 2, 7 + i);
      const tm = label("⏲ 3:00", `left:${CX - 112}px;top:${y + 12}px;font-size:22px`); pop(tm, 180); await wait(first ? 450 : 160);
      const rs = label("リスポーン 0:10", "left:480px;top:176px;translate:-50% 0;font-size:36px;background:#000c;border:2px solid #fff8"); pop(rs, 180); await wait(first ? 600 : 200);
      for (let t = 10; t >= 0; t -= first ? 1 : 2) { rs.textContent = `リスポーン 0:${String(t).padStart(2, "0")}`; await wait(first ? 70 : 35); }
      if (first) { say("戻らなきゃ!", 560, 270, { size: 44, color: "#fff", ms: 800 }); await wait(500); }
      rs.remove(); tm.remove(); hop(h, 34); }
    await wait(900); chip("試合終了"); if (stm) stm.remove(); say("パカッ", 520, 230, { size: 56, color: "#fff", ms: 800 }); hop(h, 30);
    cups.forEach(c => anim(c.lid, [{ transform: "none" }, { transform: `translate(${rnd(-80, 80)}px,-140px) rotate(${rnd(-400, 400)}deg)`, opacity: 0 }], 600, { easing: "ease-out" }));
    await wait(250);
    const nd = `fill=#f3cf6e stroke=#b98a2a stroke-width=3`, strand = d => `<path d="${d}" fill=none stroke=#b98a2a stroke-width=8 stroke-linecap=round /><path d="${d}" fill=none stroke=#f3cf6e stroke-width=4 stroke-linecap=round />`;
    const drape = `<svg viewBox="0 0 40 70" style="overflow:visible">${strand("M10 22c-5 9 5 13 0 22s5 13 0 20M22 26c5 9-5 13 0 22M31 20c-5 9 5 13 0 18")}<path d="M4 18C-4 4 14-4 20 8C26-4 44 4 36 18C40 30 24 34 20 26C16 34 0 30 4 18Z" ${nd} /><path d="M10 14c4-5 8 3 12-2s8 3 12-2" fill=none stroke=#cf9c36 stroke-width=2.5 /></svg>`;
    const crown = `<svg viewBox="0 0 110 70" style="overflow:visible"><path d="M8 66C-6 40 14 24 26 34C20 8 50 2 56 24C62 2 96 6 88 32C104 26 116 48 100 66Z" ${nd} /><path d="M18 56c8-10 14 6 22-4s14 6 22-4s14 6 22-4M24 40c8-10 14 6 22-4s14 6 22-4M38 22c6-8 12 4 18-4" fill=none stroke=#cf9c36 stroke-width=3 stroke-linecap=round /></svg>`;
    cups.forEach((c, i) => { const y = 474 - 52 * i, grow = (e, d) => anim(e, [{ transform: `${d} scale(.1)` }, { transform: `${d} scale(1.15)`, offset: .6 }, { transform: `${d}` }], 480, { delay: i * 70, fill: "both" });
      grow(add(drape, `left:${CX - 26}px;top:${y - 8}px;width:40px;height:70px;z-index:14;transform-origin:100% 20%`), "scaleX(1)");
      grow(add(drape, `left:${CX + 50}px;top:${y - 8}px;width:40px;height:70px;z-index:14;transform-origin:0 20%`), "scaleX(-1)");
      if (i === cups.length - 1) { const t = add(crown, `left:${CX - 23}px;top:${y - 56}px;width:110px;height:70px;z-index:14;transform-origin:50% 100%`); grow(t, "translate(0,0)"); } });
    say("もこもこ…", 400, 300, { size: 44, color: "#ffe9a8", ms: 1500 }); await wait(500);
    const floor = add(`<svg viewBox="0 0 960 110" style="overflow:visible"><path d="M0 30${Array.from({ length: 32 }, (_, i) => `Q${i * 30 + 15} ${rnd(-16, 4).toFixed(0)} ${i * 30 + 30} ${rnd(20, 32).toFixed(0)}`).join("")}V130H0Z" ${nd} stroke-width=4 />
      ${Array.from({ length: 46 }, () => `<path d="M${rnd(-20, 940).toFixed(0)} ${rnd(36, 104).toFixed(0)}c6-10 14 10 20 0s14 10 20 0s14 10 20 0" fill=none stroke=#cf9c36 stroke-width=3.5 stroke-linecap=round />`).join("")}</svg>`, "left:0;top:440px;width:960px;height:110px;z-index:16");
    await anim(floor, [{ transform: "translateY(130px)" }, { transform: "none" }], 900, { easing: "cubic-bezier(.3,1.3,.5,1)" });
    ov(h, e1Sweat); bubble("いただきます…?", 820, 250, 1700); await wait(1700);
  },

  async rankstone() { // 階級の重石
    const h = ham(N), cx = HX + HW / 2, SH = 42, stones = [];
    const R = [["ブロンズ", "#b8733a", "#eaa96c"], ["シルバー", "#a3adb8", "#eef2f6"], ["ゴールド", "#d9a514", "#ffe27a"], ["プラチナ", "#4fb8b0", "#c0f4ee"], ["ダイヤ", "#3f86e8", "#bcdcff"], ["マスター", "#8e4fd8", "#e0c6ff"]];
    const K = [1, .84, .68, .53, .39, .25, .03], top0 = k => 534 - 219 * k, sc = k => `scale(${1 + (1 - k) * .42},${k})`;
    const mk = ([nm, c1, c2], i) => add(`<div>${nm}</div>`, `left:${cx - 104 + i * 4}px;top:-60px;width:${208 - i * 8}px;height:${SH}px;background:linear-gradient(${c2},${c1});border:4px solid ${INK};border-radius:${i % 2 ? "12px 18px 10px 16px" : "18px 10px 16px 12px"};color:#0008;font-size:25px;line-height:${SH - 8}px;text-align:center;letter-spacing:3px;text-shadow:0 1px 0 #fff9;z-index:${12 + i}`);
    let k = 1, face;
    const setFace = svg => { if (face) face.remove(); face = svg ? ov(h, svg) : null; };
    for (let i = 0; i < 6; i++) {
      await wait(i ? 650 : 800); chip("ランク昇格"); say(`${R[i][0]} 昇格!`, 360, 190, { size: 52, color: R[i][2], ms: 950 });
      const st = mk(R[i], i); stones.push(st);
      await anim(st, [{ top: "-60px" }, { top: `${top0(k) - (i + 1) * SH}px` }], 300, { easing: "ease-in" });
      const nk = K[i + 1]; say(i < 5 ? "ズシッ" : "ズシーン!!", cx - 200, Math.max(top0(nk) - (i + 1) * SH, 250), { size: 30 + i * 4, color: "#fff", ms: 500 });
      anim(h, [{ transform: sc(k) }, { transform: sc(nk) }], 260, { easing: "cubic-bezier(.3,1.5,.5,1)" });
      stones.forEach((s, j) => anim(s, [{ top: `${top0(k) - (j + 1) * SH}px` }, { top: `${top0(nk) - (j + 1) * SH}px` }], 260, { easing: "cubic-bezier(.3,1.5,.5,1)" }));
      k = nk; setFace([e1Sweat, e1Sweat, frown + e1Sweat, closedEyes + e1Sweat, closedEyes + tears + e1Sweat, ""][i]);
    }
    const arm = add(`<svg viewBox="0 0 140 60" style="overflow:visible"><path d="M140 34H44" stroke=${INK} stroke-width=38 stroke-linecap=round /><path d="M140 34H44" stroke=#aaa1a0 stroke-width=26 stroke-linecap=round /><path d="M140 42H48" stroke=#fbf5e9 stroke-width=10 stroke-linecap=round />
      <ellipse cx=30 cy=32 rx=22 ry=20 fill=#fbcbc3 stroke=${INK} stroke-width=4 /><path d="M14 22l-8-6M12 32H2M14 42l-8 6" stroke=${INK} stroke-width=4 stroke-linecap=round /></svg>`,
      `left:${cx - 104 - 100}px;top:${top0(k) - 50}px;width:140px;height:60px;z-index:11;transform-origin:100% 57%`);
    anim(arm, [{ transform: "translateX(60px)" }, { transform: "none" }], 400);
    await wait(400); arm.animate([{ transform: "rotate(-4deg)" }, { transform: "rotate(10deg)" }], { duration: 160, iterations: 8, direction: "alternate" });
    say("ぷるぷる…", cx - 190, top0(k) - 80, { size: 30, color: "#fff", ms: 1300 }); await wait(1500);
    chip("ランク降格"); say("ダイヤに降格", 360, 190, { size: 50, color: "#9db4d8", ms: 1100 });
    const tp = stones.pop(); tp.style.transformOrigin = "0 100%";
    await anim(tp, [{ transform: "none" }, { transform: "rotate(-7deg)" }, { transform: "rotate(4deg)" }, { transform: "rotate(-10deg)" }], 500);
    anim(tp, [{ transform: "rotate(-10deg)" }, { transform: "translate(-90px,-10px) rotate(-60deg)", offset: .3 }, { transform: "translate(-560px,460px) rotate(-280deg)" }], 1100, { easing: "ease-in" });
    say("ゴロン", cx - 220, top0(k) - 5 * SH - 30, { size: 34, color: "#fff", ms: 700 }); await wait(350);
    const nk = .42; arm.remove();
    anim(h, [{ transform: sc(k) }, { transform: sc(nk) }], 300, { easing: "cubic-bezier(.3,1.6,.5,1)" });
    stones.forEach((s, j) => anim(s, [{ top: `${top0(k) - (j + 1) * SH}px` }, { top: `${top0(nk) - (j + 1) * SH}px` }], 300, { easing: "cubic-bezier(.3,1.6,.5,1)" }));
    setFace(e1Happy + openMouth);
    for (let i = 0; i < 4; i++) { const n = add(`<div class=t>♪</div>`, `left:${cx - 140 + i * 30}px;top:${top0(nk) - 30}px;font-size:34px;color:#ffe066;z-index:20`);
      anim(n, [{ transform: "none", opacity: 1 }, { transform: `translate(${rnd(-40, 20)}px,-90px)`, opacity: 0 }], 1200, { delay: i * 200, fill: "both" }).then(() => n.remove()); }
    await wait(300); bubble("やったー!!", 590, 400, 1700); await wait(1900);
  },

  async table5() { // 5人分の食卓
    const h = ham(N);
    const grp = label("グループ 1/5", "left:16px;top:66px;font-size:30px"), wt = label("待ち時間 0:00", "left:16px;top:116px;font-size:22px");
    await wait(600); chip("グループ待ち");
    const tb = add(`<svg viewBox="0 0 360 150" style="overflow:visible"><rect x=164 y=60 width=32 height=86 fill=#6b4226 stroke=${INK} stroke-width=4 /><ellipse cx=180 cy=146 rx=64 ry=9 fill=#5a3720 stroke=${INK} stroke-width=4 /><ellipse cx=180 cy=62 rx=176 ry=48 fill=#8a5a30 stroke=${INK} stroke-width=5 /><ellipse cx=180 cy=52 rx=176 ry=46 fill=#d39a5e stroke=${INK} stroke-width=5 /></svg>`, "left:340px;top:390px;width:360px;height:150px;z-index:8");
    pop(tb); hop(h, 30); await wait(400);
    const PL = [[430, 428], [520, 420], [610, 428], [466, 462], [578, 462]];
    PL.forEach(([x, y], i) => pop(add(`<div></div>`, `left:${x - 34}px;top:${y - 12}px;width:68px;height:24px;border-radius:50%;background:radial-gradient(ellipse,#fff 0 55%,#e6e1d6 57%);border:3px solid ${INK};z-index:${i < 3 ? 9 : 11}`)));
    await wait(300); const [hx, hy] = PL[4], mine = [[-20, -28], [-6, -34], [8, -27], [-12, -20], [2, -21]].map(([dx, dy]) => seed(hx + dx, hy + dy, 16, 12));
    const dishes = [], steams = [];
    const serve = (i, em) => { const [x, y] = PL[i], d = add(`<div>${em}</div>`, `left:${x - 28}px;top:${y - 50}px;font-size:48px;line-height:56px;z-index:${i < 3 ? 10 : 12}`); pop(d); dishes.push(d); steams.push(e1Steam(x, y - 44, 13)); };
    let sec = 0; const tick = async (to, ms) => { const n = 6; for (let j = 1; j <= n; j++) { const v = Math.round(sec + (to - sec) * j / n); wt.textContent = `待ち時間 ${Math.floor(v / 60)}:${String(v % 60).padStart(2, "0")}`; await wait(ms / n); } sec = to; };
    await tick(20, 500);
    for (const [i, nm, em] of [[0, "たろう", "🍛"], [1, "はなこ", "🍝"], [2, "じろう", "🍗"]]) {
      chip(`${nm} が参加`); grp.textContent = `グループ ${i + 2}/5`; pop(grp, 200); serve(i, em); hop(h, 26); await tick(sec + 40, 900); }
    chip("グループ待ち 長引く"); const sad = ov(h, frown);
    await tick(600, 600); steams.forEach(e => fade(e, 500)); await tick(1500, 600);
    dishes.forEach(d => { d.style.filter = "grayscale(.85) brightness(.75)"; add(`<svg viewBox="0 0 40 30"><path d="M8 0V22M20 0V28M32 0V20" stroke=#5f86ff stroke-width=4 stroke-linecap=round /></svg>`, "left:4px;top:-8px;width:50px;height:36px", d); });
    mine.forEach(e => e.style.filter = "grayscale(1) brightness(.7)"); sad.remove(); ov(h, frown + e1Gloom);
    say("冷めた…", 300, 300, { size: 44, color: "#9db4d8", ms: 1300 }); await tick(2520, 1300);
    chip("みき が参加 → 5/5"); grp.textContent = "グループ 5/5"; pop(grp, 200); serve(3, "🍲"); await wait(220);
    fade(layer("background:#fff;z-index:24"), 450); dishes.forEach(d => d.remove()); mine.forEach(e => e.remove()); steams.forEach(e => e.remove()); h.innerHTML = ""; h.append(h.img); wt.remove();
    PL.forEach(([x, y]) => add(`<div></div>`, `left:${x - 10}px;top:${y - 4}px;width:8px;height:5px;border-radius:50%;background:#b07a44;box-shadow:12px 2px 0 #b07a44,4px -3px 0 #c9a06a;z-index:12`));
    h.style.transformOrigin = "50% 60%"; anim(h, [{ transform: "none" }, { transform: "translate(6px,26px) rotate(-76deg) scale(1.14,1.06)" }], 120);
    ov(h, `<ellipse cx=640 cy=880 rx=430 ry=330 fill=#fbf5e9 stroke=${INK} stroke-width=16 /><path d="M480 760Q560 700 660 720" fill=none stroke=#fff stroke-width=26 stroke-linecap=round /><circle cx=650 cy=930 r=16 fill=#d9c9b0 />` + closedEyes + `<ellipse cx=300 cy=620 rx=60 ry=34 fill=#f7a7a7 opacity=.8 /><ellipse cx=900 cy=620 rx=60 ry=34 fill=#f7a7a7 opacity=.8 />`);
    say("ゲフッ", 680, 300, { size: 36, color: "#fff", ms: 1200 }); await wait(500);
    say("試合開始!", 330, 220, { size: 66, ms: 1800 }); await wait(1900);
  },

  async domino() { // ウルトドミノ
    const h = ham(N);
    const dom = (x, base, big, dir) => { const w = big ? 16 : 13, hh = big ? 46 : 38; return add(`<div></div>`, `left:${x}px;top:${base - hh}px;width:${w}px;height:${hh}px;border-radius:3px;border:3px solid ${INK};z-index:${big ? 14 : 12};transform-origin:${dir < 0 ? "0%" : "100%"} 100%;
      background:radial-gradient(circle at 50% 24%,#222 0 2.5px,#0000 3px),radial-gradient(circle at 50% 76%,#222 0 2.5px,#0000 3px),linear-gradient(#0000 46%,#555 46% 54%,#0000 54%),#f6f1e6`); };
    const xs1 = Array.from({ length: 22 }, (_, i) => 680 - i * 31), xs2 = Array.from({ length: 19 }, (_, i) => 34 + i * 32);
    const plate = add(`<div></div>`, "left:636px;top:482px;width:86px;height:26px;border-radius:50%;background:radial-gradient(ellipse,#fff 0 55%,#e6e1d6 57%);border:3px solid #333;z-index:12");
    const seeds = [[648, 462], [664, 456], [680, 462], [696, 458], [672, 468], [656, 470]].map(([x, y]) => seed(x, y, 17, 13));
    const combo = label("ウルトコンボ ×0", "right:16px;top:16px;font-size:26px");
    const order = [...xs1.map(x => [x, 534, 1, -1]), [4, 518, 1, -1], ...xs2.map(x => [x, 498, 0, 1])], all = [];
    await wait(700); chip("ウルトコンボ");
    let n = 0;
    for (const [i, [t, c, cnt]] of [["ウルト!", "#ffd23c", 7], ["味方もウルト!", "#7fe3ff", 9], ["ウルト!", "#ffd23c", 12], ["味方もウルト!", "#7fe3ff", 14]].entries()) {
      say(t, 330, 200, { size: 58, color: c, ms: 800 }); combo.textContent = `ウルトコンボ ×${i + 1}`; pop(combo, 200); hop(h, 22);
      for (let j = 0; j < cnt; j++, n++) { const [x, b, big, dir] = order[n], d = dom(x, b, big, dir); d.fd = dir; all.push(d); anim(d, [{ transform: "scaleY(0)" }, { transform: "none" }], 140); await wait(28); }
      await wait(i < 3 ? 700 - cnt * 28 : 300); }
    await wait(600); const pw = e1Paw(740, 502, 15, 15);
    await anim(pw, [{ transform: "none" }, { transform: "translateX(-38px)" }], 260); say("ツン", 690, 440, { size: 30, color: "#fff", ms: 500 });
    anim(pw, [{ transform: "translateX(-38px)" }, { transform: "none" }], 300).then(() => pw.remove());
    say("パタパタパタ…", 330, 380, { size: 40, color: "#fff", ms: 2300 });
    all.forEach((d, i) => { const last = i === 21 || i === all.length - 1; anim(d, [{ transform: "none" }, { transform: `rotate(${d.fd * (i === 22 ? 88 : last ? 80 : 58)}deg)` }], 150, { delay: i * 55, easing: "ease-in" }); });
    await wait(all.length * 55 + 120);
    say("カツン", 610, 420, { size: 34, color: "#fff", ms: 500 });
    anim(plate, [{ transform: "none" }, { transform: "translate(12px,-6px) rotate(18deg)" }, { transform: "rotate(-4deg)" }], 300);
    seeds.forEach(e => anim(e, [{ transform: "none" }, { transform: `translate(${rnd(-220, 60)}px,${-rnd(180, 300)}px) rotate(${rnd(200, 500)}deg)`, offset: .45 }, { transform: `translate(${rnd(-380, -40)}px,${rnd(120, 200)}px) rotate(${rnd(600, 900)}deg)`, opacity: .3 }], 1300, { easing: "linear" }));
    await wait(200); ov(h, whiteEyes + openMouth); hop(h, 26); bubble("あっ", HX + HW / 2, 252, 1500); await wait(1600);
  },

  async pan() { // フライパン盾
    const h = ham(N), PX = 650, PY = 418;
    const jit = Array.from({ length: 28 }, (_, i) => Math.sin(i * 2.7) * .6 + Math.sin(i * 5.3 + 1) * .4);
    const outline = (r, amp) => "M" + jit.map((j, i) => { const a = i / 28 * 6.283, rr = r + amp * j; return `${(Math.cos(a) * rr).toFixed(1)} ${(Math.sin(a) * rr).toFixed(1)}`; }).join("L") + "Z";
    const pan = add(`<svg viewBox="-110 -110 260 220" style="overflow:visible"><path d="M58 30L128 66" stroke=${INK} stroke-width=24 stroke-linecap=round /><path d="M58 30L128 66" stroke=#6b4226 stroke-width=14 stroke-linecap=round />
      <path class=rim fill=#727884 stroke=${INK} stroke-width=6 stroke-linejoin=round /><path class=face fill=#2c2f36 /><path class=hl d="M-36 -46Q-56 -28 -54 -4" fill=none stroke=#ffffff55 stroke-width=8 stroke-linecap=round /><g class=dents></g></svg>`,
      `left:${PX - 110}px;top:${PY - 110}px;width:260px;height:220px;z-index:12`);
    const rim = pan.querySelector(".rim"), face = pan.querySelector(".face"), dents = pan.querySelector(".dents");
    const shape = amp => { rim.setAttribute("d", outline(72, amp)); face.setAttribute("d", outline(60, amp * 1.3)); }; shape(0);
    const fx = add(`<svg viewBox="0 0 960 540" style="left:0;top:0;width:960px;height:540px;overflow:visible"></svg>`, "z-index:13");
    const cnt = add(`<div class=t>ブロック 0</div>`, "left:770px;top:52px;translate:-50% -50%;font-size:42px;color:#7fe3ff;z-index:20"); let cur = 0;
    const countTo = async to => { for (let j = 1; j <= 8; j++) { cnt.textContent = `ブロック ${Math.round(cur + (to - cur) * j / 8).toLocaleString()}`; await wait(35); } cur = to; anim(cnt, [{ transform: "scale(1.3)" }, { transform: "none" }], 200); };
    const hit = () => { const a = rnd(0, 6.28), r = rnd(0, 44), x = Math.cos(a) * r, y = Math.sin(a) * r;
      fx.insertAdjacentHTML("beforeend", `<line x1=450 y1=284 x2=${PX + x} y2=${PY + y} stroke=#fff3a0 stroke-width=4 stroke-linecap=round />`); const ln = fx.lastChild; anim(ln, [{ opacity: 1 }, { opacity: 0 }], 160).then(() => ln.remove());
      dents.insertAdjacentHTML("beforeend", `<g transform="translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${rnd(0, 180).toFixed(0)})"><ellipse rx=13 ry=9 fill=#17191d /><path d="M-11 5Q0 13 11 5" fill=none stroke=#a3a9b4 stroke-width=3 stroke-linecap=round /></g>`);
      flash(PX + x - 40, PX + x, PY + y - 40, PY + y, "#fff6b0"); say("カンッ", PX + x - 60 + rnd(-30, 10), PY + y - 60 + rnd(-20, 10), { size: 28, color: "#fff", ms: 300 });
      anim(pan, [{ transform: "translate(9px,3px)" }, { transform: "none" }], 120); };
    await wait(700); chip("タンクでダメージをブロック");
    anim(pan, [{ transform: "translate(70px,90px) rotate(40deg)", opacity: 0 }, { transform: "none", opacity: 1 }], 300); const pw = e1Paw(PX + 128, PY + 66, 17, 13); pop(pw);
    const brow = ov(h, `<path d="M300 350L470 400M905 350L735 400" stroke=${INK} stroke-width=30 stroke-linecap=round />`); say("来い!", 560, 270, { size: 40, color: "#fff", ms: 700 }); await wait(900);
    for (const [n, amp, to, gap, extra] of [[2, 3, 1000, 300, ""], [4, 8, 5000, 230, e1Sweat], [10, 16, 12000, 110, ""]]) {
      for (let i = 0; i < n; i++) { hit(); await wait(gap); }
      shape(amp); countTo(to); if (extra) ov(h, extra); await wait(n === 10 ? 300 : 800); }
    say("ベコベコ…", 420, 200, { size: 48, color: "#fff", ms: 1000 }); await wait(900);
    hit(); hit(); say("ドゴォ!!", 520, 300, { size: 56, color: "#ff8a5a", ms: 700 }); await wait(250);
    dents.innerHTML = ""; pan.querySelector(".hl").remove(); rim.setAttribute("d", outline(84, 0)); rim.setAttribute("fill", "#b6bcc6"); face.setAttribute("d", outline(70, 0)); face.setAttribute("fill", "#c9ced6");
    say("ペッタンコ", 420, 200, { size: 48, color: "#fff", ms: 1000 }); await wait(900); brow.remove(); fade(pw, 200);
    await anim(pan, [{ transform: "none" }, { transform: "translate(-30px,92px) scale(1.05,.3)" }], 450, { easing: "ease-in-out" });
    const sd = [[576, 482], [598, 476], [620, 484], [642, 477], [662, 483]].map(([x, y], i) => { const e = seed(x, y, 18, 14); anim(e, [{ transform: "translateY(-120px)", opacity: 0 }, { transform: "none", opacity: 1 }], 260, { delay: i * 90, fill: "both" }); return e; });
    await wait(700); const mo = ov(h, openMouth);
    anim(h, [{ transform: "none" }, { transform: "translate(-18px,8px) rotate(-7deg)" }], 300);
    for (const e of sd.reverse()) { await wait(220); e.remove(); for (let i = 0; i < 3; i++) crumb(rnd(620, 680), rnd(470, 490)); }
    say("もぐもぐ", 600, 290, { size: 34, color: "#fff", ms: 900 }); await wait(300);
    const sign = add(`<div><div style="left:58px;top:40px;width:6px;height:44px;background:#8a5a30;border:1px solid ${INK}"></div><div style="left:0;top:0;background:#fff8e6;border:4px solid ${INK};border-radius:8px;padding:2px 14px;color:#d3202a;font-size:30px;white-space:nowrap">調理不可</div></div>`, "left:470px;top:410px;z-index:22;rotate:-6deg");
    pop(sign); await wait(1500); mo.remove();
  },
});
}

{ // 配信ハム PoC 第5弾 (e2): 献血カード / クラッカー / 伝書鳩 / くす玉 / 賞味期限 / 射的屋 / 手配書 / 枯れ草
const at = (x, y, more = "") => ({ transform: `translate(${x}px,${y}px) ${more}` });
const pawC = (x, y, r = 62) => `<circle cx=${x} cy=${y} r=${r} fill=#fbcbc3 stroke=${INK} stroke-width=14 />`;
const armP = (d, w = 90) => `<path d="${d}" fill=none stroke=${INK} stroke-width=${w + 28} stroke-linecap=round /><path d="${d}" fill=none stroke=#fbf5e9 stroke-width=${w} stroke-linecap=round />`;
const look = (h, dx, dy) => ov(h, MIDX.map(x => `<circle cx=${x} cy=488 r=84 fill=#fff stroke=${INK} stroke-width=14 /><circle class=e2pp cx=${x + dx} cy=${488 + dy} r=38 fill=${INK} />`).join(""));
const confetti = (x, y, n = 16, dir = -90, spread = 40, pow = 1) => { const cols = ["#ff5a6a", "#ffd23c", "#4fc3ff", "#7dff8a", "#c58cff", "#fff"];
  for (let i = 0; i < n; i++) { const a = (dir + rnd(-spread, spread)) * Math.PI / 180, r = rnd(70, 190) * pow, long = i % 4 === 0;
    const c = add(`<div></div>`, `left:${x}px;top:${y}px;width:${long ? 6 : rnd(10, 15)}px;height:${long ? 36 : rnd(12, 18)}px;background:${cols[i % 6]};z-index:29`);
    anim(c, [{ transform: "none" }, { transform: `translate(${Math.cos(a) * r}px,${Math.sin(a) * r}px) rotate(${rnd(180, 540)}deg)`, offset: .35 },
      { transform: `translate(${Math.cos(a) * r * 1.3}px,${Math.sin(a) * r + rnd(160, 300)}px) rotate(${rnd(700, 1100)}deg)`, opacity: 0 }], rnd(1000, 1500), { easing: "cubic-bezier(.2,.7,.4,1)" }).then(() => c.remove()); } };
// ハンコ (柄+赤い印面)。mv で移動、press で押しつける
const hanko = (x, y) => { const e = add(`<div><div style="left:10px;top:0;width:24px;height:44px;border-radius:12px 12px 4px 4px;background:#c08a52;border:3px solid ${INK}"></div><div style="left:0;top:42px;width:44px;height:18px;border-radius:5px;background:#d3202a;border:3px solid ${INK}"></div></div>`, `left:0;top:0;width:44px;height:60px;z-index:26;transform:translate(${x}px,${y}px)`);
  e.mv = (nx, ny, ms, ease = "ease-in-out") => { const a = anim(e, [at(x, y), at(nx, ny)], ms, { easing: ease }); x = nx; y = ny; return a; };
  e.press = async (mx, my, ms) => { await e.mv(mx - 22, my - 100, ms); await e.mv(mx - 22, my - 60, 70, "ease-in"); };
  e.lift = (mx, my, ms = 90) => e.mv(mx - 22, my - 100, ms);
  return e; };
const wind = (n, y0 = 120, y1 = 530, col = "#fff9") => { for (let i = 0; i < n; i++) { const w = add(`<div></div>`, `left:0;top:${rnd(y0, y1)}px;width:${rnd(80, 220)}px;height:3px;border-radius:2px;background:${col};z-index:27`);
  anim(w, [{ transform: "translateX(-240px)" }, { transform: "translateX(1000px)" }], rnd(450, 750), { delay: i * 70, easing: "linear", fill: "both" }).then(() => w.remove()); } };

Object.assign(scenes, {
  async donor() { // 献血カード
    const h = ham(N), cx = i => 245 + i % 5 * 88, cy = i => 217 + Math.floor(i / 5) * 88;
    const card = add(`<div></div>`, `left:170px;top:64px;width:500px;height:340px;background:#fffdf8;border:5px solid ${INK};border-radius:16px;color:#222;z-index:12;overflow:hidden`);
    add(`<div>献血カード<span style="position:static;font-size:17px;letter-spacing:0;margin-left:18px">ハム献血ルーム</span></div>`, "left:0;top:0;width:100%;height:56px;background:#d3202a;color:#fff;font-size:30px;line-height:54px;padding-left:22px;letter-spacing:4px", card);
    add(`<div>ご協力ありがとうございます</div>`, "left:0;width:100%;top:66px;text-align:center;font-size:24px;color:#d3202a", card);
    for (let i = 0; i < 10; i++) add(`<div>${i + 1}</div>`, `left:${34 + i % 5 * 88}px;top:${112 + Math.floor(i / 5) * 88}px;width:72px;height:72px;border-radius:50%;border:3px dashed #e8a9a9;color:#efc4c4;font-size:24px;line-height:66px;text-align:center`, card);
    const cnt = add(`<div>累計 0回</div>`, "left:26px;top:290px;font-size:22px", card);
    const to = add(`<div>寄付先: 敵チーム</div>`, "right:14px;bottom:8px;font-size:14px;color:#999;transform-origin:100% 100%", card);
    const mark = i => { const m = add(`<div>デス</div>`, `left:${38 + i % 5 * 88}px;top:${116 + Math.floor(i / 5) * 88}px;width:64px;height:64px;border-radius:50%;background:#d3202a;color:#fff;font-size:21px;line-height:64px;text-align:center;rotate:${rnd(-20, 20)}deg;opacity:.92`, card);
      anim(m, [{ transform: "scale(1.5)", opacity: 0 }, { transform: "none", opacity: 1 }], 90); };
    await wait(600); chip("デス（キル 0）"); shake(h); pop(card, 260); await wait(500);
    const [hx, hy] = P(330, 820), hk = hanko(hx, hy);
    for (let i = 0; i < 10; i++) { const slow = i < 3;
      if (i) { chip(`デス ×${i + 1}（キル 0）`); if (slow) shake(h); }
      await hk.press(cx(i), cy(i), slow ? 380 : 130); mark(i); cnt.textContent = `累計 ${i + 1}回`;
      if (slow) say("ポン", cx(i) + 44, cy(i) + 46, { size: 30, color: "#fff", ms: 350 });
      await hk.lift(cx(i), cy(i), slow ? 140 : 70); await wait(slow ? 460 : 50); }
    hk.mv(hx, hy, 300); await wait(250); stamp("満了", 420, 262, 100); hop(h, 50); await wait(1000); chip("景品をもらった");
    const j = add(`<div>🧃</div>`, "left:0;top:0;font-size:50px;z-index:27"), sd = seed(0, 0, 24, 27);
    anim(j, [at(420, 300), at(620, 220), at(768, 436)], 600); await anim(sd, [at(470, 320), at(680, 240), at(852, 470)], 650); hop(h, 30); hk.remove();
    await wait(300); bubble("健さん、お疲れさまでした", 556, 424, 1700); await wait(1800);
    to.style.color = "#d3202a"; anim(to, [{ transform: "none" }, { transform: "scale(1.6)" }, { transform: "scale(1.3)" }], 500); await wait(1500);
  },

  async cracker() { // クラッカー
    const h = ham(N), C = [[400, 1020, -40], [820, 1020, 28], [600, 150, 0], [240, 190, -50], [1000, 190, 22]], K = 1.5, have = [];
    const crk = ([x, y, d]) => ov(h, `<g transform="translate(${x} ${y}) rotate(${d}) scale(${K})"><path d="M0 0L-95 -300H95Z" fill=#ffd23c stroke=${INK} stroke-width=12 stroke-linejoin=round />
      <path d="M-30 -95H30L44 -140H-44Z" fill=#e5484d /><path d="M-60 -190H60L74 -235H-74Z" fill=#4f8fe0 /><ellipse cx=0 cy=-300 rx=95 ry=24 fill=#7a2a1a stroke=${INK} stroke-width=12 /></g>`);
    const mouth = ([x, y, d]) => { const r = d * Math.PI / 180, L = 300 * K; return [P(x + Math.sin(r) * L, y - Math.cos(r) * L), d - 90]; };
    const sets = [[0], [1], [2], [3, 4]], pops = ["パン!", "パパン!", "パパパン!", "パパパパパン!!"];
    await wait(800);
    for (let k = 0; k < 4; k++) { chip(`${k + 1}連続キル`);
      sets[k].forEach(i => { have.push(C[i]); anim(crk(C[i]), [{ opacity: 0, transform: "translateY(-40px)" }, { opacity: 1, transform: "none" }], 200); });
      if (k === 3) say("耳にも!?", 400, 260, { size: 34, color: "#fff", ms: 500 }); hop(h, 26); await wait(420);
      have.forEach(c => { const [[x, y], dir] = mouth(c); confetti(x, y, 26, dir, 30, 1.4); flash(x - 30, x + 30, y - 30, y + 30); });
      say(pops[k], 380, 170, { size: 44 + k * 8, ms: 800 }); await wait(900); }
    chip("5連続キル"); hop(h, 20); await wait(420);
    have.forEach(c => { const [[x, y], dir] = mouth(c), a = dir * Math.PI / 180; const p = add(`<div></div>`, `left:${x - 12}px;top:${y - 12}px;width:24px;height:24px;border-radius:50%;background:#bbb;z-index:28`);
      anim(p, [{ transform: "scale(.4)", opacity: .9 }, { transform: `translate(${Math.cos(a) * 30}px,${Math.sin(a) * 30}px) scale(1.6)`, opacity: 0 }], 700).then(() => p.remove()); });
    say("スカッ", 380, 170, { size: 44, color: "#ccc", ms: 900 }); await wait(1000);
    label("火薬切れ", "left:310px;top:150px;font-size:26px;color:#ccc"); await wait(700);
    ov(h, openMouth); bubble("パン", 668, 372, 1600); await wait(1900);
  },

  async pigeon() { // 伝書鳩
    const h = ham(N);
    const bird = () => { const e = add(`<div><svg viewBox="0 0 120 90" style="left:0;top:0;width:100%;height:100%;overflow:visible"><path d="M30 50L4 36L8 66Z" fill=#fff stroke=${INK} stroke-width=4 stroke-linejoin=round />
        <path d="M46 76V88M62 76V88" stroke=#ff7a9a stroke-width=5 stroke-linecap=round /><ellipse cx=56 cy=54 rx=34 ry=23 fill=#fff stroke=${INK} stroke-width=4 /><circle cx=90 cy=32 r=17 fill=#fff stroke=${INK} stroke-width=4 />
        <path d="M104 26L119 33L104 40Z" fill=#ffa63a stroke=${INK} stroke-width=3 stroke-linejoin=round /><circle cx=94 cy=29 r=3.2 fill=${INK} />
        <path class=e2wg d="M46 52H80L24 14Z" fill=#e9eef5 stroke=${INK} stroke-width=4 stroke-linejoin=round /></svg></div>`, "left:0;top:0;width:130px;height:97px;z-index:24");
      const wg = e.querySelector(".e2wg"); wg.style.cssText = "transform-box:fill-box;transform-origin:50% 100%";
      e.flap = on => { wg.getAnimations().forEach(a => a.cancel()); wg.style.transform = on ? "" : "scaleY(.3)"; if (on) wg.animate([{ transform: "none" }, { transform: "scaleY(-.7)" }], { duration: 130, iterations: Infinity, direction: "alternate" }); };
      e.go = (pts, ms, f = 1, ease = "ease-in-out") => anim(e, pts.map(([x, y]) => at(x, y, `scaleX(${f})`)), ms, { easing: ease });
      return e; };
    const env = `<svg viewBox="0 0 60 40" style="left:0;top:0;width:100%;height:100%"><rect x=2 y=2 width=56 height=36 rx=3 fill=#fffef6 stroke=${INK} stroke-width=3 /><path d="M3 4L30 24L57 4" fill=none stroke=${INK} stroke-width=3 /><circle cx=30 cy=24 r=6 fill=#d3202a /></svg>`;
    const opened = `<svg viewBox="0 0 60 40" style="left:0;top:0;width:100%;height:100%;overflow:visible"><rect x=8 y=-22 width=44 height=44 fill=#fff stroke=${INK} stroke-width=3 /><path d="M14 -12H46M14 -4H46M14 4H38" stroke=#999 stroke-width=3 /><path d="M2 12L30 30L58 12V38H2Z" fill=#fffef6 stroke=${INK} stroke-width=3 stroke-linejoin=round /></svg>`;
    const deliver = async (who, msg, k, read) => { chip(`!伝言 ${who}`); const b = bird(); b.flap(1);
      await b.go([[-150, 100], [140, 190], [330, 240], [470, 270]], 1000 * k);
      const L = add(`<div>${env}</div>`, "left:0;top:0;width:60px;height:40px;z-index:23");
      await anim(L, [at(528, 362), at(590, 430, "rotate(-14deg)"), at(640, 492, "rotate(6deg)")], 380 * k, { easing: "ease-in" });
      await b.go([[470, 270], [500, 398]], 300 * k); b.flap(0); hop(h, 24); await wait(200 * k);
      L.innerHTML = opened; await wait(150); bubble(`${who}: ${msg}`, 536, 250, read); await wait(read + 100);
      await b.go([[500, 398], [520, 386], [530, 398]], 200 * k);
      await anim(L, [at(640, 492, "rotate(6deg)"), at(656, 444, "scale(.15)")], 200 * k); L.remove(); say("パクッ", 640, 370, { size: 32, color: "#fff", ms: 450 }); await wait(350 * k);
      b.flap(1); const lk = look(h, -36, -26); anim(h, [{ transform: "none" }, { transform: "rotate(-5deg)" }], 300);
      await b.go([[530, 398], [380, 250], [120, 90], [-170, -60]], 850 * k, -1, "ease-in"); b.remove(); lk.remove(); anim(h, [{ transform: "rotate(-5deg)" }, { transform: "none" }], 200); };
    await wait(400); await deliver("たろう", "今日の寝ぐせいいね", .8, 1300); await deliver("はなこ", "右下せまくない?", .6, 1000);
    chip("!伝言 じろう"); const b = bird(); b.flap(1); const L = add(`<div>${env}</div>`, "left:110px;top:28px;width:42px;height:28px", b);
    await b.go([[-150, 100], [140, 190], [330, 240], [440, 262]], 700); await wait(100);
    await anim(L, [{ transform: "none" }, { transform: "translate(-8px,2px) scale(.1)" }], 200); L.remove(); say("パクッ", 520, 230, { size: 36, color: "#fff", ms: 350 }); await wait(500);
    say("ゴクン", 520, 230, { size: 36, color: "#fff", ms: 350 }); await wait(450);
    say("!?", 700, 290, { size: 70, color: "#ff5a4a", ms: 500 }); hop(h, 30);
    await b.go([[440, 262], [480, 320], [520, 396]], 400); b.flap(0); await wait(150);
    ov(h, closedEyes); await anim(h, [{ transform: "none" }, { transform: "translateX(-16px) rotate(-38deg)" }], 450);
    say("……", 760, 300, { size: 40, color: "#fff", ms: 650 }); await wait(700);
    bubble("クルッポー", 590, 350, 1000); await wait(1100); bubble("……なるほど", 800, 300, 1200); await wait(1300);
  },

  async kusudama() { // くす玉
    const h = ham(N), KX = 580;
    const kd = add(`<div></div>`, `left:${KX - 95}px;top:0;width:190px;height:250px;z-index:14;transform:translateY(-300px)`);
    add(`<div></div>`, "left:93px;top:-500px;width:4px;height:554px;background:#eee;border:1px solid #888", kd);
    const half = r => add(`<svg viewBox="0 0 95 190" style="overflow:visible"><path d="${r ? "M0 0A95 95 0 0 1 0 190Z" : "M95 0A95 95 0 0 0 95 190Z"}" fill=#ffcf3a stroke=${INK} stroke-width=5 />
      <path d="${r ? "M0 40Q60 46 86 64M0 150Q60 144 86 126" : "M95 40Q35 46 9 64M95 150Q35 144 9 126"}" fill=none stroke=#e5484d stroke-width=10 /><path d="${r ? "M0 95H95" : "M0 95H95"}" stroke=#fff stroke-width=10 />
      <path d="${r ? "M0 0A95 95 0 0 1 0 190Z" : "M95 0A95 95 0 0 0 95 190Z"}" fill=none stroke=${INK} stroke-width=5 /></svg>`, `left:${r ? 95 : 0}px;top:56px;width:95px;height:190px;transform-origin:${r ? "0 0" : "100% 0"}`, kd);
    const L = half(0), R = half(1); add(`<div>🎀</div>`, "left:74px;top:22px;font-size:40px", kd);
    await wait(500); chip("勝利"); await anim(kd, [{ transform: "translateY(-300px)" }, { transform: "translateY(12px)", offset: .8 }, { transform: "none" }], 800, { easing: "ease-out" });
    const cord = add(`<svg viewBox="0 0 960 540" style="left:0;top:0;width:960px;height:540px;overflow:visible"><path d="M${KX} 244L712 430" stroke=#e5484d stroke-width=5 /><path d="M704 430h16l6 34h-28z" fill=#e5484d stroke=${INK} stroke-width=3 /></svg>`, "z-index:9");
    const arm = ov(h, armP("M170 830L-30 704") + pawC(-40, 700)); await wait(500);
    say("せーの", 500, 330, { size: 36, color: "#fff", ms: 600 }); await wait(500);
    anim(kd, [{ transform: "none" }, { transform: "translateY(14px)" }, { transform: "none" }], 300); anim(cord, [{ transform: "none" }, { transform: "translateY(14px)" }, { transform: "none" }], 300);
    await anim(h, [{ transform: "none" }, { transform: "translateY(14px) scale(1.03,.93)" }, { transform: "none" }], 300); cord.remove(); arm.remove();
    anim(L, [{ transform: "none" }, { transform: "rotate(46deg)", offset: .7 }, { transform: "rotate(38deg)" }], 320); anim(R, [{ transform: "none" }, { transform: "rotate(-46deg)", offset: .7 }, { transform: "rotate(-38deg)" }], 320);
    say("パカッ", 400, 110, { size: 44, color: "#fff", ms: 700 }); confetti(KX, 160, 30, 90, 70, 1.2); confetti(KX, 160, 20, -90, 60, .8);
    const ban = add(`<div><div class=e2bt style="left:0;top:22px;width:100%;text-align:center;font-size:50px;line-height:64px;color:#d3202a">祝<br><br>勝<br>利</div></div>`,
      `left:${KX - 37}px;top:118px;width:74px;height:320px;background:#fff;border:5px solid #d3202a;box-shadow:inset 0 0 0 4px #fff,inset 0 0 0 7px #d3202a;z-index:13;transform-origin:50% 0`);
    await anim(ban, [{ transform: "scaleY(0)" }, { transform: "none" }], 450, { easing: "cubic-bezier(.3,1.4,.6,1)" }); hop(h, 30); await wait(700);
    const sd = seed(KX - 12, 150, 26, 15); await anim(sd, [at(0, 0), at(0, 345, "rotate(300deg)")], 600, { easing: "ease-in" });
    await anim(sd, [at(0, 345, "rotate(300deg)"), at(30, 300, "rotate(380deg)"), at(60, 345, "rotate(440deg)")], 300); say("ポトッ", 570, 474, { size: 30, color: "#fff", ms: 600 }); await wait(700);
    await anim(h, [{ transform: "none" }, { transform: "translateX(-40px) rotate(-14deg)" }], 300); sd.remove();
    add(`<div>${seedHtml(26)}</div>`, "left:66px;top:132px;width:26px;height:39px;rotate:-20deg;z-index:2", h);
    await anim(h, [{ transform: "translateX(-40px) rotate(-14deg)" }, { transform: "none" }], 260); await wait(300);
    await anim(h, [{ transform: "none" }, { transform: "rotate(-10deg)" }], 300); const q = say("?", 700, 300, { size: 80, color: "#fff", ms: 0 }); await wait(900);
    chip("風が吹いた"); wind(14, 100, 470); await wait(300);
    await anim(ban, [{ transform: "none" }, { transform: "skewY(-8deg) scaleX(0)" }], 200, { easing: "ease-in" });
    ban.style.cssText += ";background:#e6e0cf;border-color:#888;box-shadow:none"; const bt = ban.querySelector(".e2bt"); bt.innerHTML = "予<br>算<br>の<br>都<br>合"; bt.style.cssText += ";color:#333;font-size:44px;line-height:54px;top:14px";
    await anim(ban, [{ transform: "skewY(8deg) scaleX(0)" }, { transform: "skewY(4deg)", offset: .6 }, { transform: "none" }], 400); q.remove();
    anim(h, [{ transform: "rotate(-10deg)" }, { transform: "none" }], 250); look(h, -40, -10); await wait(400); bubble("……", 760, 290, 1200); await wait(1500);
  },

  async expired() { // 賞味期限
    const h = ham(N); let n = 0;
    const g = add(`<div>100%</div>`, "left:445px;top:428px;width:64px;height:64px;border-radius:50%;background:#1a2030;border:5px solid #ffd23c;box-shadow:0 0 16px #ffd23c;color:#fff;font-size:17px;line-height:54px;text-align:center;z-index:8");
    const full = () => { g.textContent = "100%"; g.style.borderColor = "#ffd23c"; g.style.boxShadow = "0 0 16px #ffd23c"; }, empty = () => { g.textContent = "0%"; g.style.borderColor = "#555"; g.style.boxShadow = "none"; };
    add(`<div></div>`, "left:592px;top:410px;width:96px;height:22px;border-radius:50%;background:#252a33;z-index:14");
    const bin = add(`<div><svg viewBox="0 0 110 114" style="left:0;top:0;width:110px;height:114px;overflow:visible"><path d="M6 12H104L95 112H15Z" fill=#7f8ea0 stroke=${INK} stroke-width=4 stroke-linejoin=round /><path d="M28 24L32 104M55 24V104M82 24L78 104" stroke=#6a788a stroke-width=4 /><rect x=0 y=6 width=110 height=14 rx=6 fill=#95a3b4 stroke=${INK} stroke-width=4 /></svg>
      <div style="left:12px;top:32px;width:86px;height:64px;background:#fff;border:3px solid ${INK};border-radius:6px;color:#222;text-align:center"><div style="position:static;font-size:13px;margin-top:4px">もったいない</div><div class=e2n style="position:static;font-size:32px;line-height:36px;color:#d3202a">0</div></div></div>`, "left:585px;top:416px;width:110px;height:114px;z-index:16");
    const cnt = bin.querySelector(".e2n");
    const can = () => add(`<div><div style="left:0;top:8px;width:72px;height:76px;border:3px solid ${INK};border-radius:8px/12px;background:linear-gradient(90deg,#8d97a3,#eef2f5 40%,#8d97a3)"></div>
      <div style="left:3px;top:30px;width:66px;height:32px;background:#3b54d6;color:#fff;font-size:24px;line-height:32px;text-align:center">ULT</div><div style="left:0;top:0;width:72px;height:18px;border:3px solid ${INK};border-radius:50%;background:#d9dfe5"></div></div>`, "left:0;top:0;width:72px;height:84px;z-index:15");
    const sticker = c => { const e = add(`<div><div style="position:static;font-size:13px">賞味期限</div><div style="position:static;font-size:26px;line-height:28px">今</div></div>`, "left:46px;top:-30px;width:68px;padding:4px 0 2px;background:#e3262f;color:#fff;border:3px solid #fff;outline:2px solid #e3262f;border-radius:8px;text-align:center;rotate:14deg", c);
      anim(e, [{ transform: "scale(2.6)", opacity: 0 }, { transform: "none", opacity: 1 }], 130, { easing: "ease-in" }); };
    const stink = (x, y, k = 3) => { for (let i = 0; i < k; i++) { const w = add(`<svg viewBox="0 0 20 60" style="overflow:visible"><path d="M10 58q-9-10 0-19q9-10 0-19q-9-10 0-19" fill=none stroke=#2c4a12 stroke-width=9 stroke-linecap=round /><path d="M10 58q-9-10 0-19q9-10 0-19q-9-10 0-19" fill=none stroke=#a6e86a stroke-width=4.5 stroke-linecap=round /></svg>`, `left:${x + i * 22}px;top:${y}px;width:20px;height:60px;z-index:20`);
      anim(w, [{ transform: "none", opacity: 0 }, { transform: "translateY(-20px)", opacity: 1, offset: .3 }, { transform: "translateY(-60px)", opacity: 0 }], 1100, { delay: i * 150, fill: "both" }).then(() => w.remove()); } };
    const pinch = closedEyes + armP("M300 1060Q420 820 560 640", 80) + pawC(604, 594, 60) + `<path d="M590 560v34M622 560v34" stroke=${INK} stroke-width=10 stroke-linecap=round />`;
    const refill = async () => { for (let p = 20; p <= 100; p += 20) { g.textContent = p + "%"; await wait(50); } full(); };
    const toBin = (c, x0, y0, ms) => anim(c, [at(x0, y0, "scale(1.35)"), at(560, 250, "rotate(200deg) scale(1.1)"), at(604, 372, "rotate(360deg)"), at(604, 440, "rotate(360deg)")], ms, { easing: "ease-in" });
    for (const [k, t] of [[1, "ULT 100%のままデス"], [.75, "またULT 100%のままデス"], [.55, "またまたULT 100%のままデス"]]) {
      await wait(600 * k); chip(t); shake(h); empty();
      const c = can(); await anim(c, [at(441, 418, "scale(.2)"), at(440, 312, "scale(1.5)"), at(440, 324, "scale(1.35)")], 360 * k);
      await wait(200 * k); sticker(c); say("パン", 590, 290, { size: 34, color: "#fff", ms: 400 }); await wait(300 * k);
      stink(438, 236); const ps = ov(h, pinch); await wait(600 * k);
      await toBin(c, 440, 324, 520 * k); c.remove(); cnt.textContent = ++n; pop(cnt, 180); say("ポイ", 660, 384, { size: 30, color: "#fff", ms: 400 });
      await wait(300 * k); ps.remove(); await refill(); }
    await wait(300); chip("ULT 100%のままデス ×9"); const ps = ov(h, pinch + tears); empty();
    const slots = [[576, 356, 0], [632, 354, 10], [604, 302, -6], [486, 466, 95], [704, 470, -80], [566, 250, 8], [644, 248, -10], [430, 465, 85], [606, 198, 0]];
    for (const [i, [x, y, r]] of slots.entries()) { const c = can(); c.style.zIndex = 17; sticker(c);
      anim(c, [at(441, 418, "scale(.2)"), at((441 + x) / 2, Math.min(y, 300) - 90, `rotate(${r * 2 + 180}deg) scale(.8)`), at(x, y, `rotate(${r}deg) scale(.8)`)], 300, { easing: "ease-in" })
        .then(() => { cnt.textContent = ++n; pop(cnt, 120); }); await wait(170); }
    await wait(400); stink(560, 140, 4); bubble("お早めにお使いください", 560, 120, 1800); await wait(2100);
  },

  async shooting() { // 射的屋
    const h = ham(N);
    const stall = layer("z-index:5", `<div style="left:508px;top:108px;width:438px;height:432px;background:repeating-linear-gradient(90deg,#6b4428 0 44px,#5e3b22 44px 88px)"></div>
      ${[262, 340, 420].map(y => `<div style="left:508px;top:${y}px;width:438px;height:10px;background:#3d2414"></div>`).join("")}
      <div style="left:492px;top:100px;width:16px;height:440px;background:#8a5a30;border:3px solid ${INK}"></div><div style="left:944px;top:100px;width:16px;height:440px;background:#8a5a30;border:3px solid ${INK}"></div>
      <div style="left:486px;top:40px;width:474px;height:66px;background:repeating-linear-gradient(90deg,#d3202a 0 34px,#fff 34px 68px);border:4px solid ${INK}"></div>
      <div style="left:490px;top:104px;width:470px;height:18px;background:radial-gradient(circle at 17px 0,#d3202a 15px,#0000 16px) 0 0/34px 18px repeat-x"></div>
      <div class=t style="left:723px;top:73px;translate:-50% -50%;font-size:42px;color:#ffd23c">射的</div>`);
    const counter = add(`<div><div style="left:0;top:0;width:100%;height:12px;background:#b07a45;border-bottom:3px solid ${INK}"></div><div style="left:30px;top:22px;font-size:24px;color:#fff3d0">1回 種3粒</div></div>`, `left:486px;top:470px;width:474px;height:70px;background:#8a5a30;border:3px solid ${INK};z-index:12`);
    ov(h, `<path d="M180 330Q600 230 1060 330" fill=none stroke=${INK} stroke-width=78 stroke-linecap=round /><path d="M180 330Q600 230 1060 330" fill=none stroke=#fff stroke-width=56 stroke-linecap=round />
      <path d="M180 330Q600 230 1060 330" fill=none stroke=#d3202a stroke-width=40 stroke-dasharray="26 46" /><path d="M1050 320l90-50l10 60zM1050 330l80 60l-60 20z" fill=#fff stroke=${INK} stroke-width=10 stroke-linejoin=round />`);
    const bell = add(`<svg viewBox="0 0 40 50" style="overflow:visible"><path d="M20 0V8" stroke=#555 stroke-width=3 /><path d="M6 38Q6 10 20 8Q34 10 34 38L38 42H2Z" fill=#ffcf3a stroke=${INK} stroke-width=3 stroke-linejoin=round /><circle cx=20 cy=45 r=4 fill=#d99a10 stroke=${INK} stroke-width=2 /></svg>`, "left:513px;top:124px;width:34px;height:44px;z-index:6;transform-origin:50% 0");
    const cups = [528, 566, 604, 642, 680].map(x => add(`<svg viewBox="0 0 30 38"><path d="M2 2H28L24 36H6Z" fill=#fff stroke=${INK} stroke-width=3 stroke-linejoin=round /><path d="M3.5 13H26.5L25.6 21H4.4Z" fill=#e5484d /></svg>`, `left:${x}px;top:382px;width:30px;height:38px;z-index:6`));
    const pin = `<svg viewBox="0 0 40 50" style="left:0;top:0;width:40px;height:50px"><path d="M20 22V50" stroke=#8a5a30 stroke-width=4 /><path d="M20 20L20 2L34 8Z" fill=#e5484d stroke=${INK} stroke-width=2 /><path d="M20 20L38 20L32 34Z" fill=#ffd23c stroke=${INK} stroke-width=2 /><path d="M20 20L20 38L6 32Z" fill=#4f8fe0 stroke=${INK} stroke-width=2 /><path d="M20 20L2 20L8 6Z" fill=#7dd06a stroke=${INK} stroke-width=2 /><circle cx=20 cy=20 r=3 fill=${INK} /></svg>`;
    const whistle = `<svg viewBox="0 0 44 30" style="left:0;top:14px;width:40px;height:28px"><rect x=2 y=6 width=24 height=10 rx=2 fill=#ffd23c stroke=${INK} stroke-width=3 /><circle cx=30 cy=17 r=11 fill=#ffd23c stroke=${INK} stroke-width=3 /><rect x=20 y=2 width=7 height=6 fill=${INK} /></svg>`;
    const items = [["飴", `<div style="left:0;top:0;font-size:34px">🍬</div>`], ["笛", whistle], ["風車", pin], ["風船", `<div style="left:0;top:-4px;font-size:34px">🎈</div>`]]
      .map(([nm, html], i) => ({ nm, e: add(`<div>${html}</div>`, `left:${530 + i * 46}px;top:290px;width:40px;height:50px;z-index:6`) }));
    const big = add(`<div><img src="${N}" style="left:0;top:0;width:100%;height:100%;filter:saturate(.8) brightness(1.05)"><svg viewBox="0 0 1237 1271" style="left:0;top:0;width:100%;height:100%;overflow:visible"><path d="M618 720V1190" stroke=#b9a99a stroke-width=9 stroke-dasharray="22 16" />
      <path d="M230 210L150 330" stroke=#333 stroke-width=8 /><rect x=0 y=320 width=300 height=150 rx=14 fill=#fff stroke=#333 stroke-width=9 /><text x=150 y=430 text-anchor=middle font-size=100 font-weight=900 fill=#d3202a>特賞</text></svg>
      <div class=e2cv style="left:-4%;top:-3%;width:108%;height:106%;background:#c62828;border:6px solid ${INK};border-radius:46% 46% 12px 12px;color:#fff;text-align:center;font-size:64px;padding-top:70px">特賞<br>?</div></div>`,
      `left:0;top:0;width:${HW}px;height:${HH}px;transform-origin:0 0;z-index:11;transform:translate(549px,134px) scale(.55)`);
    pop(stall, 300); await wait(700);
    const ring = (n = 1) => anim(bell, [{ transform: "rotate(0)" }, { transform: "rotate(28deg)" }, { transform: "rotate(-24deg)" }, { transform: "rotate(0)" }], 360, { iterations: n });
    const hit = c => { const x = parseFloat(c.style.left) + 15, y = 401; c.remove();
      const m = add(`<div>✕</div>`, `left:${x}px;top:${y}px;translate:-50% -50%;font-size:40px;color:#fff;text-shadow:0 0 6px #f00;z-index:28`); fade(m, 400);
      for (let i = 0; i < 6; i++) { const p = add(`<div></div>`, `left:${x}px;top:${y}px;width:${rnd(8, 14)}px;height:${rnd(8, 14)}px;background:${i % 3 ? "#fff" : "#e5484d"};border:2px solid ${INK};z-index:27`);
        anim(p, [{ transform: "none" }, { transform: `translate(${rnd(-70, 70)}px,${rnd(-90, -30)}px) rotate(${rnd(200, 600)}deg)`, offset: .4 }, { transform: `translate(${rnd(-110, 110)}px,${rnd(60, 140)}px) rotate(900deg)`, opacity: 0 }], 700).then(() => p.remove()); } };
    for (let i = 0; i < 4; i++) { chip(`ヘッドショット ×${i + 1}`); hit(cups[i]); ring(); say("カーン!", 420, 150, { size: 42, color: "#fff", ms: 600 }); await wait(450);
      const it = items[i], x0 = 530 + i * 46; hop(h, 30);
      await anim(it.e, [at(0, 0), at((60 + i * 70) - x0, -150, "scale(1.8)"), at((60 + i * 70) - x0, 120, "scale(1.4)")], 600, { easing: "ease-in-out" });
      say(`${it.nm} ゲット`, 200, 330, { size: 34, color: "#fff", ms: 500 }); await wait(400); }
    chip("ヘッドショット ×5"); hit(cups[4]); ring(4); say("カランカラン!!", 400, 150, { size: 42, color: "#fff", ms: 1000 }); await wait(500);
    say("大当たり!!", 260, 240, { size: 76, ms: 1100 }); hop(h, 50); await wait(1000);
    await anim(big, [at(549, 134, "scale(.55)"), at(520, 150, "scale(.7)"), at(486, 304, "scale(1)")], 900, { easing: "ease-in-out" });
    const cv = big.querySelector(".e2cv"); await anim(cv, [{ transform: "none" }, { transform: "translateY(300px) rotate(14deg)", opacity: 0 }], 500, { easing: "ease-in" }); cv.remove();
    say("特賞<br>等身大ハムぬいぐるみ", 250, 230, { size: 40, color: "#fff", ms: 2200 }); await wait(900); hop(h, 26); bubble("そっくりでしょ", 832, 262, 1500); await wait(1900);
  },

  async wanted() { // 手配書
    const h = ham(N);
    const pst = add(`<div><div style="left:0;right:0;top:6px;text-align:center;font:900 36px Georgia,'Times New Roman',serif;color:#4a2a14;letter-spacing:2px">WANTED</div>
      <div style="left:26px;top:54px;width:122px;height:100px;background:#d9c08b;border:3px solid #5a3a20;overflow:hidden"><svg viewBox="0 0 122 100" style="left:0;top:0;width:100%;height:100%"><path d="M16 100Q20 66 61 64Q102 66 106 100Z" fill=#1a120c /><circle cx=61 cy=40 r=22 fill=#1a120c /><path d="M84 74L122 52" stroke=#1a120c stroke-width=7 /><text x=61 y=50 text-anchor=middle font-size=28 font-weight=900 fill=#d9c08b>?</text></svg></div>
      <div style="left:0;right:0;top:162px;text-align:center;font-size:19px;color:#2a1a0a">ナゾノスナイパー</div><div style="left:0;right:0;top:192px;text-align:center;font-size:15px;color:#5a3a20">懸賞金</div>
      <div class=e2bt style="left:0;right:0;top:210px;text-align:center;font-size:32px;color:#a01c1c">種 5粒</div>
      <div style="left:6px;top:4px;width:14px;height:14px;border-radius:50%;background:#d3202a;border:2px solid ${INK}"></div><div style="right:6px;top:4px;width:14px;height:14px;border-radius:50%;background:#d3202a;border:2px solid ${INK}"></div></div>`,
      "left:520px;top:108px;width:180px;height:262px;background:#ecd9a8;border:4px solid #5a3a20;color:#222;z-index:12;rotate:-2deg;box-shadow:4px 6px 0 #0005;transform-origin:100% 0");
    const bt = pst.querySelector(".e2bt"); pst.style.visibility = "hidden";
    await wait(700); chip("同じ敵に2連続で倒された"); shake(h); await wait(500); hop(h, 26); pst.style.visibility = "";
    await anim(pst, [{ transform: "translate(200px,250px) scale(.2) rotate(30deg)" }, { transform: "scale(1.06)", offset: .8 }, { transform: "none" }], 420); say("ペタッ", 460, 130, { size: 34, color: "#fff", ms: 600 }); await wait(900);
    const [hx, hy] = P(330, 820);
    for (const [v, x, y, r] of [[10, 96, 100, -14], [20, 8, 58, 10]]) { chip("また同じ敵に倒された"); shake(h); await wait(350); const hk = hanko(hx, hy);
      bt.textContent = `種 ${v}粒`; anim(bt, [{ transform: "scale(1.8)", color: "#ff2020" }, { transform: "none" }], 300); say("×2", 470, 330, { size: 40, ms: 600 }); await wait(400);
      const mx = 520 + x + 40, my = 108 + y + 22; await hk.press(mx, my, 300);
      const m = add(`<div>増額</div>`, `left:${x}px;top:${y}px;color:#d3202a;border:4px solid #d3202a;border-radius:6px;padding:0 8px;font-size:26px;rotate:${r}deg;background:#fff8;z-index:3`, pst);
      anim(m, [{ transform: "scale(1.6)", opacity: 0 }, { transform: "none", opacity: 1 }], 100); say("ドン", mx + 60, my - 30, { size: 30, color: "#fff", ms: 400 });
      await hk.lift(mx, my, 120); await hk.mv(hx, hy, 250); hk.remove(); await wait(450); }
    chip("健がナゾノスナイパーを倒した"); say("撃破!!", 330, 180, { size: 70, ms: 1000 }); await wait(900);
    await walk(h, 0, -40, 300, 2);
    await anim(pst, [{ transform: "none" }, { transform: "rotate(-28deg)", offset: .35 }, { transform: "translate(-60px,460px) rotate(-70deg)", opacity: 0 }], 750, { easing: "ease-in" }); pst.remove(); say("ビリッ", 560, 200, { size: 36, color: "#fff", ms: 600 });
    await walk(h, -40, 0, 300, 2);
    const fr = ov(h, frown); h.classList.add("trem"); const lab = label("0粒", "left:560px;top:352px;font-size:26px"); const ss = [];
    for (let i = 0; i < 20; i++) { const e = seed(532 + i % 5 * 34 + rnd(-4, 4), 398 + Math.floor(i / 5) * 32 + rnd(-3, 3), 24, 15); e.style.rotate = rnd(-35, 35) + "deg"; ss.push(e); lab.textContent = `${i + 1}粒`; await wait(i < 14 ? 70 : 120 + (i - 14) * 85); }
    await wait(400); h.classList.remove("trem"); lab.remove(); ov(h, tears);
    anim(h, [{ transform: "none" }, { transform: "translateX(-30px)" }, { transform: "none" }], 600); ss.forEach(e => anim(e, [{ transform: "none" }, { transform: "translateX(-150px)" }], 500, { easing: "ease-out" }));
    await wait(300); bubble("……どうぞ", 660, 300, 1500); await wait(1700);
  },

  async tumbleweed() { // 枯れ草
    const g = gameBg(), h = ham(N);
    const weed = d => add(`<div><svg viewBox="0 0 100 100" style="left:0;top:0;width:100%;height:100%;overflow:visible"><circle cx=50 cy=50 r=45 fill=#c8945a44 />
      ${[0, 30, 60, 90, 120, 150].map((a, i) => `<ellipse cx=50 cy=50 rx=46 ry=${16 + i % 3 * 8} fill=none stroke=${i % 2 ? "#8a5a2b" : "#6e4520"} stroke-width=3.5 transform="rotate(${a} 50 50)" />`).join("")}
      <path d="M50 4l-5-12M92 38l12-5M14 80l-11 7M80 88l7 10M8 30l-10-5M60 96l3 11" stroke=#6e4520 stroke-width=3.5 stroke-linecap=round /></svg></div>`, `left:0;top:0;width:${d}px;height:${d}px;z-index:12`);
    const roll = (e, d, x0, x1, ms, b = 3, amp = 36) => { const y = 534 - d, n = 30;
      return anim(e, Array.from({ length: n + 1 }, (_, i) => { const t = i / n; return at(x0 + (x1 - x0) * t, y - Math.abs(Math.sin(t * Math.PI * b)) * amp, `rotate(${(x1 - x0) * t / (d / 2) * 57.3}deg)`); }), ms, { easing: "linear" }); };
    await wait(800); chip("味方 全滅");
    const band = add(`<div>味方 全滅</div>`, "left:0;top:110px;width:960px;height:80px;background:linear-gradient(90deg,#0000,#000c 25%,#000c 75%,#0000);color:#ff4a3a;font-size:54px;line-height:80px;text-align:center;letter-spacing:14px;z-index:30");
    anim(band, [{ transform: "scaleY(0)" }, { transform: "none" }], 200);
    const sep = "sepia(1) saturate(1.5) brightness(1.02) contrast(.95)"; anim(g, [{ filter: "none" }, { filter: sep }], 1000); anim(h.img, [{ filter: "none" }, { filter: "sepia(.55)" }], 1000);
    const dust = layer("z-index:2;background:linear-gradient(#e8c89000 35%,#d9a85a77)"); anim(dust, [{ opacity: 0 }, { opacity: 1 }], 1000);
    const wi = setInterval(() => wind(1, 140, 530, "#fff3d6aa"), 110); await wait(900);
    const hat = ov(h, `<path d="M360 300Q330 -10 460 -50Q600 40 740 -50Q870 -10 840 300Z" fill=#a06b35 stroke=${INK} stroke-width=14 stroke-linejoin=round /><path d="M366 236Q600 196 834 236L840 300Q600 258 360 300Z" fill=#4a2a14 />
      <path d="M100 290Q130 340 260 330Q600 280 980 330Q1110 340 1140 290Q1160 360 1000 380Q600 330 240 380Q80 360 100 290Z" fill=#8a5a2b stroke=${INK} stroke-width=14 stroke-linejoin=round />`);
    await anim(hat, [{ transform: "translateY(-300px)" }, { transform: "none" }], 300, { easing: "ease-in" }); band.remove();
    const hold = ov(h, armP("M190 800Q90 560 170 380", 80) + pawC(170, 350, 64)); await wait(300);
    chip("荒野に風が吹く"); const lk = look(h, -40, 30), pp = [...lk.querySelectorAll(".e2pp")];
    const w1 = weed(110); roll(w1, 110, -150, 1100, 2600);
    pp.forEach(p => p.animate([{ transform: "none" }, { transform: "translate(20px,10px)", offset: .6 }, { transform: "translate(40px,10px)", offset: .75 }, { transform: "translate(80px,-10px)" }], { duration: 2600, fill: "forwards" }));
    await wait(2600); w1.remove(); lk.remove(); await wait(300);
    const lk2 = look(h, -40, 30); const w2 = weed(200); roll(w2, 200, -230, 1150, 2800, 0); await wait(1300); say("!?", 640, 290, { size: 64, color: "#fff", ms: 500 }); await wait(640);
    lk2.remove(); h.style.transformOrigin = "50% 50%"; await anim(h, [{ transform: "none" }, { transform: "translate(420px,25px) rotate(260deg) scale(.72)" }], 860, { easing: "linear" });
    await wait(500); w2.remove(); hat.remove(); hold.remove(); clearInterval(wi);
    chip("風がやんだ"); anim(g, [{ filter: sep }, { filter: "none" }], 700); fade(dust, 700); h.img.getAnimations().forEach(a => a.cancel()); await wait(700);
    h.style.transformOrigin = "50% 100%"; const tw = ov(h, `<path d="M420 140l60 70M480 120l-30 90M820 160l-50 60M760 120l30 90" stroke=#8a5a2b stroke-width=14 stroke-linecap=round />`);
    await walk(h, 300, 0, 900, 5); bubble("……ただいま", 660, 290, 1300); await wait(1500);
  },
});
}

// 配信ハム PoC 第5弾 (e3): お守り棚・化粧ハム・ウルト風船・綱引き・乱戦サウナ・偽バトルパス・偽実績・今日の日記
{
const e3svg = (vb, inner) => `<svg viewBox="${vb}" style="left:0;top:0;width:100%;height:100%;overflow:visible">${inner}</svg>`;
const e3box = (html, x, y, w, hh, z = 14) => add(`<div>${html}</div>`, `left:${x}px;top:${y}px;width:${w}px;height:${hh}px;z-index:${z}`);
const e3tick = async (f, a, b, ms, n = 8) => { for (let i = 1; i <= n; i++) { f(Math.round(a + (b - a) * i / n)); await wait(ms / n); } };
const e3puff = (x, y, col = "#fff", r = 26, z = 16) => { const p = add(`<div></div>`, `left:${x - r}px;top:${y - r}px;width:${r * 2}px;height:${r * 2}px;border-radius:50%;background:${col};filter:blur(5px);z-index:${z}`);
  anim(p, [{ transform: "scale(.4)", opacity: .9 }, { transform: `translate(${rnd(-30, 30)}px,${rnd(-120, -60)}px) scale(1.7)`, opacity: 0 }], 1100).then(() => p.remove()); };
const e3arm = (d, w = 100) => `<path d="${d}" fill=none stroke=${INK} stroke-width=${w + 28} stroke-linecap=round /><path d="${d}" fill=none stroke=#fbf5e9 stroke-width=${w} stroke-linecap=round />`;
const e3paw = (x, y, r = 58) => `<circle cx=${x} cy=${y} r=${r} fill=#fbcbc3 stroke=${INK} stroke-width=12 />`;
const e3star = (x, y, r, c = "#fff") => `<path class=puff d="M${x} ${y - r}Q${x} ${y} ${x + r} ${y}Q${x} ${y} ${x} ${y + r}Q${x} ${y} ${x - r} ${y}Q${x} ${y} ${x} ${y - r}Z" fill=${c} stroke=#fff8 stroke-width=4 />`;
const e3confetti = (n = 40) => { for (let i = 0; i < n; i++) { const c = add(`<div></div>`, `left:${rnd(0, 950)}px;top:-20px;width:${rnd(8, 14)}px;height:${rnd(12, 20)}px;background:${["#ffd23c", "#ff5c8a", "#5ad1ff", "#7dff8a", "#fff"][i % 5]};z-index:29`);
  anim(c, [{ transform: "none" }, { transform: `translate(${rnd(-80, 80)}px,580px) rotate(${rnd(400, 1200)}deg)` }], rnd(1300, 2000), { delay: rnd(0, 600), easing: "linear", fill: "both" }).then(() => c.remove()); } };

// お守り棚の縁起物
const e3leaf = a => `<path d="M0 0C-22-10-24-36 0-27C24-36 22-10 0 0Z" transform="translate(40 42) rotate(${a})" fill=#43a047 stroke=${INK} stroke-width=4 />`;
const e3tine = (i, r) => { const a = (-50 + i * 12.5) * Math.PI / 180; return `M75 150L${(75 + Math.sin(a) * r).toFixed(1)} ${(150 - Math.cos(a) * r).toFixed(1)}`; };
const e3charm = {
  daruma: e3svg("0 0 100 106", `<ellipse cx=50 cy=60 rx=46 ry=44 fill=#d92b2b stroke=${INK} stroke-width=6 /><ellipse cx=50 cy=50 rx=27 ry=23 fill=#fbe7d0 stroke=${INK} stroke-width=5 /><circle cx=40 cy=50 r=7 fill=#fff stroke=${INK} stroke-width=3 /><circle cx=60 cy=50 r=7 fill=${INK} />
    <path d="M28 38Q38 30 46 37M54 37Q62 30 72 38" fill=none stroke=${INK} stroke-width=4 /><path d="M36 64Q50 74 64 64" fill=none stroke=${INK} stroke-width=4 /><path d="M18 84Q50 102 82 84" fill=none stroke=#f5c542 stroke-width=7 />`),
  neko: e3svg("0 0 100 126", `<path d="M84 66Q98 46 92 28" fill=none stroke=${INK} stroke-width=17 stroke-linecap=round /><path d="M84 66Q98 46 92 28" fill=none stroke=#fff stroke-width=8 stroke-linecap=round />
    <path d="M16 122Q8 76 28 62H72Q92 76 84 122Z" fill=#fff stroke=${INK} stroke-width=5 /><path d="M18 34L20 6L42 20ZM82 34L80 6L58 20Z" fill=#fff stroke=${INK} stroke-width=5 stroke-linejoin=round />
    <ellipse cx=50 cy=42 rx=36 ry=28 fill=#fff stroke=${INK} stroke-width=5 /><path d="M30 22Q40 14 50 18Q44 28 28 30Z" fill=#f0a040 /><path d="M33 42q6-7 12 0M55 42q6-7 12 0" fill=none stroke=${INK} stroke-width=4 />
    <path d="M28 68Q50 78 72 68" fill=none stroke=#d92b2b stroke-width=8 /><circle cx=50 cy=77 r=7 fill=#f5c542 stroke=${INK} stroke-width=3 /><ellipse cx=34 cy=100 rx=13 ry=17 fill=#f5c542 stroke=${INK} stroke-width=4 /><circle cx=92 cy=26 r=11 fill=#fff stroke=${INK} stroke-width=5 />`),
  clover: e3svg("0 0 80 112", `<path d="M40 44Q46 70 40 88" fill=none stroke=#2e7d32 stroke-width=6 />${[45, 135, 225, 315].map(e3leaf).join("")}<path d="M16 86H64L57 110H23Z" fill=#c0703a stroke=${INK} stroke-width=4 />`),
  salt: e3svg("0 0 100 120", `<path d="M14 96L50 4L86 96Z" fill=#fff stroke=${INK} stroke-width=5 stroke-linejoin=round /><path d="M42 34L34 70M60 40L66 74" stroke=#ddd stroke-width=3 /><path d="M4 94H96L88 114H12Z" fill=#f2efe6 stroke=${INK} stroke-width=5 />`),
  ofuda: `<div style="left:0;top:0;width:100%;height:100%;background:#fffbe8;border:4px solid ${INK};border-radius:3px"></div><div style="left:6px;top:6px;width:36px;height:102px;border:2px solid #d3202a"></div><div style="left:0;top:14px;width:48px;writing-mode:vertical-rl;font-size:21px;line-height:48px;color:#d3202a">必勝祈願</div>`,
  kumade: e3svg("0 0 150 160", `<path d="${Array.from({ length: 9 }, (_, i) => e3tine(i, 140)).join("")}" stroke=${INK} stroke-width=11 stroke-linecap=round /><path d="${Array.from({ length: 9 }, (_, i) => e3tine(i, 140)).join("")}" stroke=#d8a860 stroke-width=6 stroke-linecap=round />
    <path d="M-17 73A120 120 0 0 1 167 73" fill=none stroke=${INK} stroke-width=11 /><path d="M-17 73A120 120 0 0 1 167 73" fill=none stroke=#d8a860 stroke-width=6 />
    <rect x=36 y=46 width=78 height=48 rx=6 fill=#d3202a stroke=#ffd23c stroke-width=5 /><text x=75 y=81 text-anchor=middle font-size=30 font-weight=900 fill=#ffd23c>大入</text>
    <ellipse cx=31 cy=114 rx=16 ry=21 fill=#ffd23c stroke=${INK} stroke-width=4 /><ellipse cx=119 cy=114 rx=16 ry=21 fill=#ffd23c stroke=${INK} stroke-width=4 />
    <circle cx=75 cy=121 r=23 fill=#fff5ea stroke=${INK} stroke-width=4 /><path d="M57 106q18-16 36 0" fill=none stroke=#222 stroke-width=7 /><path d="M65 118q4-4 8 0M77 118q4-4 8 0" fill=none stroke=${INK} stroke-width=3 /><circle cx=63 cy=128 r=5 fill=#ff9aa8 /><circle cx=87 cy=128 r=5 fill=#ff9aa8 /><path d="M72 133q3 3 6 0" fill=none stroke=#d3202a stroke-width=3 />
    <path d="M75 150q-32-16-38 0q6 16 38 0q32-16 38 0q-6 16-38 0" fill=#fff stroke=#d3202a stroke-width=5 />`),
};

// ハムパスの報酬アイコン
const e3icon = {
  pick: e3svg("0 0 100 100", `<path d="M14 86L86 14" stroke=${INK} stroke-width=12 stroke-linecap=round /><path d="M14 86L86 14" stroke=#ecd09a stroke-width=6 stroke-linecap=round />`),
  band: e3svg("0 0 100 100", `<ellipse cx=50 cy=52 rx=38 ry=24 fill=none stroke=${INK} stroke-width=12 transform="rotate(-14 50 52)" /><ellipse cx=50 cy=52 rx=38 ry=24 fill=none stroke=#f0a040 stroke-width=6 transform="rotate(-14 50 52)" />`),
  sock: e3svg("0 0 100 100", `<path d="M34 6H64V56Q64 66 74 70Q94 76 90 88Q86 98 66 94L36 86Q22 82 28 64Z" fill=#fff stroke=${INK} stroke-width=6 stroke-linejoin=round /><path d="M34 16H64M34 28H64" stroke=#e8262c stroke-width=7 />`),
  empty: e3svg("0 0 100 100", `<rect x=14 y=14 width=72 height=72 rx=8 fill=none stroke=#bbb stroke-width=6 stroke-dasharray="12 9" />`),
};

Object.assign(scenes, {
  async charms() { // お守り棚
    const h = ham(N), cnt = label("0連敗", "right:16px;top:16px;font-size:28px");
    const post = x => `<div style="left:${x}px;top:0;width:14px;height:152px;background:#8a5a30;border:3px solid ${INK}"></div>`, board = y => `<div style="left:-10px;top:${y}px;width:${HW + 28}px;height:16px;background:#b07a44;border:3px solid ${INK};border-radius:3px"></div>`;
    const shelf = add(`<div>${post(0)}${post(HW - 6)}${board(50)}${board(132)}</div>`, `left:${HX - 4}px;top:390px;width:${HW + 8}px;height:152px;z-index:12`);
    const items = [["だるま", e3charm.daruma, 724, 450, 70, 74], ["招き猫", e3charm.neko, 802, 438, 68, 86], ["四つ葉", e3charm.clover, 878, 440, 60, 84],
      ["盛り塩", e3charm.salt, 749, 346, 80, 96], ["お札", e3charm.ofuda, 848, 328, 48, 114], ["熊手", e3charm.kumade, 754, 282, 150, 160, 13]];
    const got = []; await wait(700);
    for (let i = 0; i < items.length; i++) { const [nm, html, x, y, w, hh, z] = items[i];
      chip(`負け (${i + 1}連敗)`); cnt.textContent = `${i + 1}連敗`; shake(h); await wait(280);
      const e = e3box(html, x, y, w, hh, z || 13 + i); got.push(e); hop(h, 14);
      anim(e, [{ transform: "translateY(-80px)", opacity: 0 }, { transform: "translateY(5px)", opacity: 1, offset: .7 }, { transform: "none", opacity: 1 }], 260, { easing: "ease-in" });
      say(nm, 620, 330, { size: 38, color: "#fff", ms: 600 }); await wait(760); }
    await wait(300); bubble("……前が見えない", 600, 236, 1200); await wait(1500);
    chip("勝ち!!"); cnt.textContent = "連敗ストップ";
    const arm = add(`<div><div style="left:0;top:0;width:100%;height:100%;background:#fbf5e9;border:6px solid ${INK};border-radius:24px"></div><div style="left:-16px;top:-6px;width:56px;height:56px;border-radius:50%;background:#fbcbc3;border:5px solid ${INK}"></div></div>`,
      "left:685px;top:373px;width:250px;height:44px;transform-origin:100% 50%;z-index:22");
    anim(arm, [{ transform: "rotate(95deg)" }, { transform: "rotate(-32deg)" }], 300, { easing: "ease-in" }); await wait(130);
    got.forEach((e, i) => anim(e, [{ transform: "none" }, { transform: `translate(${-rnd(160, 300)}px,${-rnd(50, 150)}px) rotate(${-rnd(120, 240)}deg)`, offset: .4 },
      { transform: `translate(${-rnd(320, 520)}px,${rnd(320, 420)}px) rotate(${-rnd(400, 700)}deg)` }], 1000, { delay: i >= 3 ? 0 : 100 }).then(() => e.remove()));
    say("ガシャーン!!", 480, 200, { size: 64, color: "#fff", ms: 900 }); anim(shelf, [-8, 7, -5, 3, 0].map(x => ({ transform: `translateX(${x}px)` })), 320);
    await wait(500); anim(arm, [{ transform: "rotate(-32deg)", opacity: 1 }, { transform: "rotate(10deg)", opacity: 0 }], 300); await wait(700);
    bubble("どれが効いたか分からないので<br>全部捨てる", 520, 220, 2400); await wait(2600);
  },

  async makeup() { // 化粧ハム
    const h = ham(N), v = label("", "right:16px;top:16px;font-size:28px"), setV = n => { v.innerHTML = `<span style="position:static;color:#ff4a4a">●</span> 視聴者 ${n.toLocaleString()}人`; };
    const lay = [], put = (svg, nm) => { const o = ov(h, svg); lay.push(o); anim(o, [{ opacity: 0 }, { opacity: 1 }], 300); hop(h, 22); say(`+${nm}`, 600, 330, { size: 34, color: "#ff9ad5", ms: 750 }); };
    const cheek = `<ellipse cx=278 cy=626 rx=98 ry=60 fill=#ff3d7f opacity=.6 /><ellipse cx=918 cy=630 rx=98 ry=60 fill=#ff3d7f opacity=.6 />`;
    const shadow = MIDX.map(x => `<path d="M${x - 114} 490A114 128 0 0 1 ${x + 114} 490L${x + 86} 490A86 92 0 0 0 ${x - 86} 490Z" fill=#9b5cff opacity=.85 />`).join("");
    const lash = (x, d) => [-84, -62, -40, -18, 4].map(a => { const r = a * d * Math.PI / 180, q = (a * d - 14 * d) * Math.PI / 180, p = (k, t) => [x + Math.sin(t) * k, 488 - Math.cos(t) * k * 1.05].map(n => n.toFixed(0)).join(" ");
      return `<path d="M${p(90, r)}Q${p(140, q)} ${p(186, r - .1 * d)}" fill=none stroke=${INK} stroke-width=16 stroke-linecap=round />`; }).join("");
    const lips = `<path d="M486 652Q544 604 600 636Q656 604 714 652Q660 716 600 708Q540 716 486 652Z" fill=#e3123a stroke=${INK} stroke-width=10 /><path d="M496 654Q600 676 704 654" fill=none stroke=#8a0a20 stroke-width=8 /><ellipse cx=560 cy=684 rx=24 ry=8 fill=#fff9 />`;
    const kira = e3star(410, 450, 58) + e3star(858, 450, 58) + e3star(90, 300, 110, "#ffe066") + e3star(1150, 380, 95, "#ffe066") + e3star(1060, 860, 80, "#ffe066") + e3star(130, 900, 70) + e3star(620, 200, 60);
    const plume = (a, c) => `<g transform="rotate(${a} 600 170)"><path d="M600 170C460 30 480-280 600-430C720-280 740 30 600 170Z" fill=${c} stroke=${INK} stroke-width=12 /><path d="M600 160Q588-40 600-400" fill=none stroke=#fff9 stroke-width=10 /></g>`;
    const dress = `<path d="M150 790Q600 700 1090 790L1236 1271H0Z" fill=#d81b60 stroke=${INK} stroke-width=14 /><path d="M40 1160Q100 1110 160 1160T280 1160T400 1160T520 1160T640 1160T760 1160T880 1160T1000 1160T1120 1160T1220 1160" fill=none stroke=#ffd23c stroke-width=18 />
      <path d="M190 806Q600 900 1050 806" fill=none stroke=#fff stroke-width=30 stroke-dasharray="1 44" stroke-linecap=round /><circle cx=600 cy=880 r=42 fill=#4fd1ff stroke=#ffd23c stroke-width=12 />` +
      plume(-30, "#ff8fcf") + plume(30, "#b388ff") + plume(0, "#fff") + `<circle cx=600 cy=176 r=50 fill=#ffd23c stroke=${INK} stroke-width=10 /><circle cx=600 cy=176 r=24 fill=#4fd1ff />`;
    const steps = [[380, "チーク", cheek], [800, "アイシャドウ", shadow], [1300, "つけまつげ", lash(380, 1) + lash(828, -1)], [1900, "口紅", lips], [2600, "キラキラ", kira], [3400, "ドレス&羽根飾り", dress]];
    let cur = 120; setV(cur); await wait(900);
    for (const [n, nm, svg] of steps) { chip(n > 3000 ? "視聴者 3,000人突破!!" : "視聴者 増加中"); await e3tick(setV, cur, n, 280); cur = n; put(svg, nm); if (n > 3000) for (let i = 0; i < 6; i++) flash(); await wait(750); }
    bubble("ごきげんよう", 590, 236, 1200); const fl = setInterval(() => flash(HX - 20, HX + HW, HY - 40, HY + HH, "#ffe9f6"), 160); await wait(1400); clearInterval(fl);
    chip("視聴者 減少"); await e3tick(setV, cur, 90, 700, 10); await wait(300);
    const towel = add(`<div><div style="left:0;top:10px;width:100%;height:8px;background:#7fc8ff"></div></div>`, `left:${HX + 40}px;top:${HY + 56}px;width:110px;height:70px;background:#fff;border:4px solid ${INK};border-radius:14px;z-index:16`);
    say("ゴシゴシ", 620, 300, { size: 40, color: "#fff", ms: 1000 });
    anim(towel, [0, 1, 2, 3, 4, 5, 6, 7, 8].map(i => ({ transform: `translate(${i % 2 ? 50 : -30}px,${(i % 3) * 14}px) rotate(${i % 2 ? 8 : -8}deg)` })), 1100, { easing: "linear" });
    lay.forEach(o => anim(o, [{ opacity: 1 }, { opacity: 0 }], 1000)); await wait(1150); lay.forEach(o => o.remove()); towel.remove();
    const mir = add(`<div><div style="left:38px;top:96px;width:20px;height:82px;background:#e985b5;border:4px solid ${INK};border-radius:8px"></div><div style="left:0;top:0;width:96px;height:106px;border-radius:50%;background:#e985b5;border:5px solid ${INK}"></div>
      <div style="left:9px;top:9px;width:68px;height:78px;border-radius:50%;overflow:hidden;background:linear-gradient(135deg,#e8f7ff,#9fd3ef)"><img src="${N}" style="left:-28px;top:-20px;width:128px;height:131px"></div><div style="left:28px;top:150px;width:40px;height:40px;border-radius:50%;background:#fbcbc3;border:4px solid ${INK}"></div></div>`,
      `left:${HX - 52}px;top:${HY + 26}px;width:96px;height:190px;z-index:12`);
    pop(mir); await wait(700); const calm = ov(h, closedEyes); anim(h, [{ transform: "none" }, { transform: "scale(1.04,.96)" }, { transform: "none" }], 700);
    bubble("……ほっ", 560, 250, 1400); await wait(1500); calm.remove(); await wait(600);
  },

  async balloon() { // ウルト風船
    const h = ham(N);
    const gauge = add(`<div><div style="left:7px;top:7px;width:54px;height:54px;border-radius:50%;background:#1b2233"></div><div class=t style="left:0;width:68px;top:20px;text-align:center;font-size:19px;color:#fff;-webkit-text-stroke:4px #000">39%</div></div>`, "left:443px;top:426px;width:68px;height:68px;border-radius:50%;border:2px solid #0008;z-index:6");
    const gt = gauge.lastChild, setU = p => { gauge.style.background = `conic-gradient(#ffd23c ${p}%,#4a5266 0)`; gt.textContent = p + "%"; }; setU(39);
    const [mx, my] = P(600, 650), bal = (k, r = -48, dx = 0, dy = 0) => `translate(${dx}px,${dy}px) rotate(${r}deg) scale(${k})`;
    const bk = add(`<div><div style="left:-100px;top:-238px;width:200px;height:232px;border-radius:50% 50% 48% 48%/56% 56% 44% 44%;background:radial-gradient(circle at 34% 26%,#ffe0e0 0 7%,#ff6070 20%,#d31a35 62%,#8f0d22);border:5px solid ${INK}"></div>
      <div style="left:-9px;top:-12px;width:18px;height:14px;background:#c4142b;border:3px solid ${INK};clip-path:polygon(50% 0,100% 100%,0 100%)"></div></div>`, `left:${mx - HX}px;top:${my - HY}px;width:0;height:0;transform:${bal(.15)};z-index:3`, h);
    await wait(700); chip("ウルト チャージ中");
    const blow = ov(h, hideMouth + `<ellipse cx=600 cy=652 rx=34 ry=30 fill=#c9485b stroke=${INK} stroke-width=12 /><circle cx=290 cy=640 r=105 fill=#ff9aaf opacity=.55 /><circle cx=910 cy=640 r=105 fill=#ff9aaf opacity=.55 />`);
    let pk = .15, pp = 39;
    for (const p of [52, 64, 76, 88, 100]) { const k = .15 + (p - 39) / 61 * .95;
      anim(h, [{ transform: "none" }, { transform: "scale(1.08,.95)" }, { transform: "none" }], 360);
      anim(bk, [{ transform: bal(pk) }, { transform: bal(k) }], 320, { easing: "cubic-bezier(.3,1.5,.5,1)" }); pk = k;
      say("ぷぅ", 900, 292, { size: 30, color: "#fff", ms: 300 }); await e3tick(setU, pp, p, 300, 4); pp = p; await wait(90); }
    gauge.style.boxShadow = "0 0 22px 8px #ffd23c"; say("100%!!", 477, 395, { size: 40, ms: 800 }); blow.remove(); await wait(350);
    anim(bk, [{ transform: bal(pk) }, { transform: bal(pk, -14, -128, -130) }], 450, { easing: "ease-in-out" });
    const grip = ov(h, `<path d="M-110 -60Q30 150 200 280" fill=none stroke=#eee stroke-width=8 />` + e3arm("M320 760Q120 560 200 300") + e3paw(200, 285)); await wait(700);
    chip("ウルト発動!!"); fade(layer("background:#fff;z-index:24"), 260); setU(0); gauge.style.boxShadow = "none";
    const face = ov(h, whiteEyes + openMouth); h.style.transformOrigin = `${200 / 1237 * HW}px ${285 / 1271 * HH}px`;
    say("うわぁぁぁ", 600, 230, { size: 46, color: "#fff", ms: 1300 });
    await anim(h, [{ transform: "none" }, { transform: "translateY(-40px) rotate(10deg)", offset: .25 }, { transform: "translateY(-260px) rotate(-8deg)", offset: .6 }, { transform: "translateY(-760px) rotate(6deg)" }], 1700, { easing: "ease-in" });
    await wait(250); say("パァン!", 640, 40, { size: 50, color: "#fff", ms: 700 });
    bk.remove(); grip.remove(); face.remove(); await wait(1100); chip("数秒後");
    const chute = ov(h, `<defs><linearGradient id=e3chute x2=1><stop offset=.2 stop-color=#ff5a4a /><stop offset=.2 stop-color=#fff /><stop offset=.4 stop-color=#fff /><stop offset=.4 stop-color=#ff5a4a /><stop offset=.6 stop-color=#ff5a4a /><stop offset=.6 stop-color=#fff /><stop offset=.8 stop-color=#fff /><stop offset=.8 stop-color=#ff5a4a /></linearGradient></defs>
      <path d="M-160-290L110 760M200-305L130 740M1040-305L1110 740M1400-290L1130 760" stroke=#eee stroke-width=9 />
      <path d="M-160-290Q-130-800 620-820Q1370-800 1400-290Q1210-350 1020-305Q820-360 620-310Q420-360 220-305Q30-350-160-290Z" fill=url(#e3chute) stroke=${INK} stroke-width=14 />`);
    const calm = ov(h, closedEyes); h.style.transformOrigin = "50% 0";
    const xs = [-300, -230, -120, -190, -70, -110, 0], ys = [-700, -210, -160, -115, -75, -35, 0], rs = [9, 9, -8, 7, -6, 4, 0], os = [0, .18, .34, .5, .66, .82, 1];
    wait(900).then(() => say("ふわ〜", 380, 200, { size: 38, color: "#fff", ms: 1300 }));
    await anim(h, xs.map((x, i) => ({ transform: `translate(${x}px,${ys[i]}px) rotate(${rs[i]}deg)`, offset: os[i] })), 3400, { easing: "linear" });
    calm.remove(); hop(h, 10); await anim(chute, [{ transform: "none", opacity: 1 }, { transform: "translate(60px,90px) scaleY(.4)", opacity: 0 }], 500); chute.remove();
    bubble("ただいま", 620, 250, 1200); await wait(1500);
  },

  async tug() { // 綱引き
    const h = ham(N);
    const bar = add(`<div><div style="left:0;top:0;width:50%;height:100%;background:linear-gradient(#6ab4ff,#2a6fd0);transition:width .25s"></div><div style="right:0;top:0;width:50%;height:100%;background:linear-gradient(#ff8a7a,#d3202a);transition:width .25s"></div></div>`,
      "left:250px;top:58px;width:460px;height:40px;border:4px solid #fff;border-radius:20px;overflow:hidden;z-index:15");
    const lt = add(`<div class=t>!左 0</div>`, "left:266px;top:63px;font-size:24px;color:#fff;-webkit-text-stroke:5px #0a2a60;z-index:16"), rt = add(`<div class=t>!右 0</div>`, "right:266px;top:63px;font-size:24px;color:#fff;-webkit-text-stroke:5px #600a0a;z-index:16");
    const box = add(`<div></div>`, "left:20px;top:120px;width:250px;height:300px;background:#000a;border-radius:10px;overflow:hidden;z-index:6"); let rows = [];
    const post = (who, txt, col) => { rows.forEach(r => { r.y -= 36; r.e.style.top = r.y + "px"; });
      const e = add(`<div><span style="position:static;color:#bbb">${who}:</span> <span style="position:static;color:${col}">${txt}</span></div>`, "left:14px;top:260px;font-size:22px;white-space:nowrap;transition:top .15s", box); rows.push({ e, y: 260 }); };
    let L = 0, R = 0, pa = 0, scared;
    const vote = (who, sd) => { sd === "右" ? R++ : L++; post(who, "!" + sd, sd === "右" ? "#ff8a7a" : "#7fc0ff");
      bar.firstChild.style.width = L / (L + R) * 100 + "%"; bar.lastChild.style.width = R / (L + R) * 100 + "%"; lt.textContent = `!左 ${L}`; rt.textContent = `!右 ${R}`;
      const a = (R - L) * 8; anim(h, [{ transform: `rotate(${pa}deg)` }, { transform: `rotate(${a}deg)` }], 320, { easing: "cubic-bezier(.3,1.6,.5,1)" }); pa = a;
      if (!scared && Math.abs(R - L) >= 2) scared = ov(h, whiteEyes + frown); };
    await wait(600); chip("チャット投票 !左 / !右");
    for (const [w, sd] of [["たろう", "右"], ["はなこ", "左"], ["みき", "左"], ["さき", "左"], ["じろう", "右"], ["ゆうき", "右"], ["けん", "右"], ["りょう", "右"], ["あや", "左"]]) { await wait(470); vote(w, sd); }
    await wait(450); chip("!右 が殺到"); bubble("ちょっ…", 560, 236, 900);
    for (const w of ["しん", "まい", "そら", "ひろ", "なな"]) { await wait(190); vote(w, "右"); }
    await wait(250); say("あっ", 760, 230, { size: 50, color: "#fff", ms: 600 });
    await anim(h, [{ transform: `rotate(${pa}deg)` }, { transform: "translate(40px,0) rotate(100deg)", offset: .45 }, { transform: "translate(330px,140px) rotate(200deg)" }], 850, { easing: "ease-in" });
    say("ゴロゴロ…ドスン", 760, 420, { size: 38, color: "#fff", ms: 900 }); await wait(500); post("たろう", "落ちたw", "#fff"); await wait(500); post("はなこ", "草", "#fff"); await wait(700);
    chip("ハム 復帰"); scared.remove(); const face = ov(h, frown + `<text x=930 y=270 font-size=240>💢</text>`);
    await anim(h, [{ transform: "translate(160px,250px) rotate(-30deg)" }, { transform: "translate(70px,70px) rotate(-12deg)", offset: .55 }, { transform: "none" }], 800);
    say("パンパン", 640, 330, { size: 42, color: "#fff", ms: 1100 }); for (let i = 0; i < 10; i++) e3puff(i % 2 ? HX + rnd(-20, 30) : HX + HW - rnd(-20, 30), HY + rnd(100, 220), "#d8d0c4", 26, 12);
    await anim(h, [0, 1, 2, 3, 4].map(i => ({ transform: `rotate(${i % 2 ? 4 : -4}deg)` })), 500, { easing: "linear" });
    const sign = add(`<div><div style="left:-6px;top:-150px;width:12px;height:150px;background:#8a5a30;border:2px solid ${INK}"></div>
      <div style="right:-56px;bottom:140px;background:#fff8e6;color:#d3202a;border:5px solid ${INK};border-radius:10px;padding:4px 20px 8px;white-space:nowrap;font-size:60px;line-height:1.1;text-align:center">許さん<div style="position:static;font-size:20px;color:#222">!右の人たち</div></div>
      <div style="left:-17px;top:-16px;width:34px;height:34px;border-radius:50%;background:#fbcbc3;border:4px solid ${INK}"></div></div>`, `left:${HX + 14}px;top:${HY + 160}px;width:0;height:0;z-index:12`);
    await anim(sign, [{ transform: "translateY(110px) rotate(-8deg)" }, { transform: "translateY(-14px) rotate(3deg)", offset: .7 }, { transform: "none" }], 260);
    rows.forEach(r => { if (r.e.textContent.includes("!右")) r.e.style.textDecoration = "line-through #ff4a4a 3px"; });
    await wait(2100); face.remove();
  },

  async sauna() { // 乱戦サウナ
    const h = ham(N); let rows = [];
    const feed = add(`<div></div>`, "left:560px;top:12px;width:388px;height:186px;overflow:hidden;z-index:15");
    const kill = (a, b) => { rows.forEach(r => { r.y += 32; r.e.style.top = r.y + "px"; if (r.y > 160) r.e.style.opacity = 0; });
      const e = add(`<div><span style="position:static;color:#7fc8ff">${a}</span> <span style="position:static;color:#fff">⚔</span> <span style="position:static;color:#ff7a6a">${b}</span></div>`,
        "right:0;top:0;height:28px;padding:0 10px;background:#000b;border-right:4px solid #ff5a4a;font-size:19px;line-height:28px;white-space:nowrap;transition:top .12s,opacity .2s", feed);
      anim(e, [{ transform: "translateX(60px)", opacity: 0 }, { transform: "none", opacity: 1 }], 120); rows.push({ e, y: 0 }); rows = rows.filter(r => r.y <= 200 || (r.e.remove(), false)); };
    const th = add(`<div><div style="left:14px;top:0;width:24px;height:180px;background:#fff;border:4px solid ${INK};border-radius:12px"></div><div style="left:20px;bottom:40px;width:12px;height:27px;background:#e8262c;border-radius:6px;transition:height .15s"></div>
      <div style="left:2px;top:166px;width:48px;height:48px;border-radius:50%;background:#e8262c;border:4px solid ${INK}"></div></div>`, "left:652px;top:318px;width:52px;height:214px;z-index:12");
    const col = th.children[1], tl = add(`<div class=t>40℃</div>`, "left:678px;top:292px;translate:-50% -50%;font-size:30px;color:#fff;z-index:13");
    const setT = t => { col.style.height = Math.round((t - 20) / 100 * 140) + "px"; tl.textContent = `${t}℃`; tl.style.color = t >= 100 ? "#ff5a4a" : t >= 75 ? "#ffb04a" : "#fff"; };
    const names = "たろう,はなこ,じろう,ゆうき,みき,けん,さき,りょう,あや,しん,まい,そら".split(",");
    const sweat = [[170, 380, 0], [1060, 420, .4], [980, 300, .2], [250, 280, .6]].map(([x, y, d]) => `<path class=dr style="animation-delay:${d}s" d="M${x} ${y}q-24 40 0 56q24-16 0-56" fill=#9fd8ff stroke=${INK} stroke-width=6 />`).join("");
    const towel = `<path d="M150 380Q130 90 600 70Q1070 90 1090 380Q900 300 600 300Q300 300 150 380Z" fill=#fff stroke=${INK} stroke-width=14 /><path d="M180 334Q600 250 1060 334" fill=none stroke=#7fc8ff stroke-width=18 />
      <path d="M1000 170q100-60 160 14q-56 70-160 34ZM1000 170q40-120 136-96q20 86-86 126Z" fill=#fff stroke=${INK} stroke-width=12 />`;
    let steam, sw, tw, tp = 40;
    await wait(500); chip("乱戦 発生!!");
    for (let i = 0; i < 24; i++) { kill(names[i % 12], names[(i * 5 + 3) % 12]); tp = Math.min(110, 40 + Math.round(i * 3.05)); setT(tp);
      if (i === 5) sw = ov(h, sweat);
      if (i === 11) { tw = ov(h, towel); hop(h, 16); say("サウナ状態", 540, 236, { size: 40, color: "#ffb04a", ms: 1000 }); }
      if (i === 17) { h.img.style.filter = "sepia(.45) saturate(2.6) hue-rotate(-28deg)"; steam = setInterval(() => e3puff(HX + rnd(30, 200), HY + rnd(10, 70), "#fffd", rnd(18, 30)), 110); h.classList.add("trem"); }
      await wait(Math.max(110, 330 - i * 12)); }
    chip("限界!!"); anim(tl, [{ transform: "scale(1)" }, { transform: "scale(1.7)" }, { transform: "scale(1)" }, { transform: "scale(1.5)" }, { transform: "scale(1)" }], 600);
    const spr = add(`<div><div style="left:14px;top:0;width:16px;height:200px;background:#aab;border:3px solid #556"></div><div style="left:0;top:196px;width:44px;height:22px;background:#c0c6d0;border:3px solid #556;border-radius:4px 4px 22px 22px"></div></div>`, "left:808px;top:-218px;width:44px;height:218px;z-index:14");
    await anim(spr, [{ transform: "none" }, { transform: "translateY(240px)" }], 300); say("ジリリリ!!", 600, 160, { size: 44, color: "#fff", ms: 900 });
    const drops = setInterval(() => { for (let k = 0; k < 4; k++) { const d = add(`<div></div>`, `left:${830 + rnd(-12, 12)}px;top:246px;width:4px;height:20px;background:#9fd8ff;border-radius:2px;z-index:17`);
      anim(d, [{ transform: "none", opacity: 1 }, { transform: `translate(${rnd(-150, 140)}px,${rnd(250, 300)}px)`, opacity: .7 }], rnd(380, 520), { easing: "ease-in" }).then(() => d.remove()); } }, 35);
    await wait(500); clearInterval(steam); h.classList.remove("trem"); h.img.style.filter = "saturate(.75) brightness(.95)"; sw.remove(); tw.remove();
    const wet = ov(h, frown + `<path d="M150 380Q130 140 600 120Q1070 140 1090 380Q900 330 600 330Q300 330 150 380Z" fill=#dce6ee stroke=${INK} stroke-width=14 />` +
      [[260, 700], [420, 860], [800, 820], [980, 660], [600, 980], [180, 960], [1040, 940]].map(([x, y]) => `<path d="M${x} ${y}q-20 36 0 50q20-14 0-50" fill=#9fd8ff stroke=${INK} stroke-width=6 />`).join(""));
    say("ずぶ濡れ…", 520, 300, { size: 44, color: "#9fd8ff", ms: 1200 }); await e3tick(setT, 110, 40, 800); await wait(500);
    chip("乱戦 終了"); clearInterval(drops); fade(feed, 400); await anim(spr, [{ transform: "translateY(240px)" }, { transform: "none" }], 300); spr.remove(); await wait(400);
    const tub = add(`<div><div style="left:0;top:0;width:100%;height:100%;background:linear-gradient(90deg,#1e63c6,#4aa3ff 40%,#2a78d8);border:6px solid ${INK};border-radius:6px 6px 40px 40px"></div><div style="left:6px;top:24px;width:calc(100% - 12px);height:9px;background:#123f86"></div><div style="left:6px;top:52px;width:calc(100% - 12px);height:9px;background:#123f86"></div>
      <div style="left:10px;top:-16px;width:calc(100% - 20px);height:30px;border-radius:50%;background:#bfe8ff;border:4px solid ${INK}"></div></div>`, `left:${HX - 12}px;top:468px;width:${HW + 24}px;height:76px;z-index:12`);
    pop(tub); h.img.style.filter = "none"; wet.remove(); const bliss = ov(h, closedEyes);
    await anim(h, [{ transform: "none" }, { transform: "translateY(-30px)", offset: .4 }, { transform: "translateY(22px)" }], 500);
    say("ザブーン", 600, 400, { size: 40, color: "#bfe8ff", ms: 700 }); for (let i = 0; i < 6; i++) e3puff(HX + rnd(10, 210), 462, "#bfe8ff", 18, 13); await wait(700);
    const sign = add(`<div><div style="left:30px;top:-200px;width:4px;height:204px;background:#f2e2bc"></div><div style="right:30px;top:-200px;width:4px;height:204px;background:#f2e2bc"></div>
      <div style="left:0;top:0;width:100%;height:100%;background:repeating-linear-gradient(90deg,#e8c48a 0 22px,#ddb576 22px 26px);border:5px solid ${INK};border-radius:8px;color:#5a3412;font-size:48px;text-align:center;line-height:64px">整った</div></div>`,
      `left:${HX + 22}px;top:196px;width:180px;height:76px;transform-origin:50% -200px;z-index:14`);
    await anim(sign, [{ transform: "translateY(-300px)" }, { transform: "rotate(6deg)", offset: .6 }, { transform: "rotate(-3deg)", offset: .8 }, { transform: "none" }], 700);
    for (let i = 0; i < 5; i++) flash(HX, HX + HW, 180, 300, "#ffe9a8"); await wait(1700); bliss.remove();
  },

  async hampass() { // 偽バトルパス
    const h = ham(N);
    const pass = add(`<div><div style="left:18px;top:12px;font-size:30px;color:#ffd23c">ハムパス</div><div style="left:156px;top:22px;font-size:16px;color:#bbb">シーズン1</div>
      <div class=t style="right:18px;top:8px;font-size:36px;color:#fff;-webkit-text-stroke:5px #2a1f5a">Tier 1</div>
      <div style="left:18px;top:60px;width:516px;height:24px;background:#0009;border:3px solid #fff6;border-radius:12px;overflow:hidden"><div style="left:0;top:0;width:0;height:100%;background:linear-gradient(#9dffa8,#2fbf4a)"></div></div></div>`,
      "left:40px;top:64px;width:560px;height:100px;background:linear-gradient(#3a2a7a,#1c1446);border:4px solid #ffd23c;border-radius:14px;z-index:15");
    const tierT = pass.children[2], fill = pass.children[3].firstChild;
    const plan = [["つまようじ", "pick"], ["輪ゴム", "band"], ["靴下 (片方)", "sock"], ["「空」", "empty"], ["輪ゴム", "band"], ["「空」", "empty"], ["つまようじ", "pick"], ["「空」", "empty"]];
    const boxes = plan.map(([, k], i) => add(`<div><div style="left:4px;top:1px;font-size:12px;color:#ccc">${i + 2}</div><div style="left:11px;top:11px;width:30px;height:30px">${e3icon[k]}</div></div>`,
      `left:${44 + i * 62}px;top:176px;width:56px;height:56px;background:#1c1446dd;border:3px solid #6a5aa8;border-radius:8px;z-index:15`));
    add(`<div><div style="left:4px;top:1px;font-size:12px;color:#5a3a00">10</div><div style="left:0;width:50px;top:10px;text-align:center;font-size:28px;color:#fff">?</div></div>`,
      `left:${44 + 8 * 62}px;top:176px;width:56px;height:56px;background:linear-gradient(#ffe680,#d99a10);border:3px solid #fff;border-radius:8px;box-shadow:0 0 14px #ffd23c;z-index:15`);
    add(`<div class=t>豪華報酬</div>`, `left:${44 + 8 * 62 + 28}px;top:248px;translate:-50% 0;font-size:16px;color:#ffd23c;-webkit-text-stroke:4px #3a0a00;z-index:15`);
    let pile = 0;
    const tierUp = async (t, ms) => { await anim(fill, [{ width: "0%" }, { width: "100%" }], ms, { easing: "ease-in" }); fill.getAnimations().forEach(a => a.cancel());
      tierT.textContent = `Tier ${t}`; anim(tierT, [{ transform: "scale(1.6)", color: "#ffd23c" }, { transform: "none" }], 300); const b = boxes[t - 2];
      if (b) { b.style.borderColor = "#7dff8a"; b.style.background = "#2fbf4a66"; } };
    const stash = k => { const e = add(`<div>${e3icon[k]}</div>`, `left:${HX - 70 + (pile % 3) * 24}px;top:${492 - Math.floor(pile / 3) * 22}px;width:34px;height:34px;z-index:11`); pile++; pop(e, 160); };
    await wait(600);
    for (const [i, react] of ["わーい!", "やったー!", "片方!!", "空だ!!"].entries()) { const [nm, k] = plan[i];
      chip("試合終了"); await tierUp(i + 2, 450);
      const card = add(`<div><div style="left:0;width:192px;top:10px;text-align:center;font-size:18px;color:#ffd23c">Tier ${i + 2} 報酬</div><div style="left:56px;top:40px;width:80px;height:80px">${e3icon[k]}</div><div style="left:0;width:192px;top:126px;text-align:center;font-size:26px;color:#fff">${nm}</div></div>`,
        "left:250px;top:270px;width:200px;height:172px;background:linear-gradient(#3a2a7a,#1c1446);border:4px solid #ffd23c;border-radius:14px;z-index:18");
      pop(card); hop(h, 34); bubble(react, 690, 254, 750); await wait(720);
      await anim(card, [{ transform: "none", opacity: 1 }, { transform: `translate(${HX - 70 - 250}px,${470 - 270}px) scale(.2)`, opacity: .2 }], 260, { easing: "ease-in" }); card.remove(); stash(k); await wait(150); }
    chip("試合終了 ×4");
    for (let i = 4; i < 8; i++) { await tierUp(i + 2, 170); say(`+${plan[i][0]}`, 350, 330, { size: 34, color: "#fff", ms: 260 }); stash(plan[i][1]); hop(h, 14); await wait(120); }
    await wait(200); chip("試合終了"); await tierUp(10, 500);
    const dark = layer("background:#000c;z-index:20"); anim(dark, [{ opacity: 0 }, { opacity: 1 }], 300); h.style.zIndex = 25;
    const rays = add(`<div></div>`, "left:-120px;top:-170px;width:900px;height:900px;border-radius:50%;background:repeating-conic-gradient(#ffd23c44 0 10deg,#0000 0 20deg);z-index:21");
    rays.animate([{ transform: "rotate(0)" }, { transform: "rotate(360deg)" }], { duration: 7000, iterations: Infinity });
    say("豪華報酬!!", 360, 72, { size: 62, ms: 0, z: 31 }); say("♪ パンパカパーン ♪", 340, 140, { size: 38, color: "#fff", ms: 1500, z: 31 });
    const chest = add(`<div><div style="left:0;top:40px;width:180px;height:90px;background:linear-gradient(#a0622c,#6e3e16);border:5px solid ${INK};border-radius:6px"></div><div style="left:76px;top:36px;width:28px;height:44px;background:#ffd23c;border:4px solid ${INK};border-radius:4px"></div>
      <div style="left:-4px;top:0;width:188px;height:48px;background:linear-gradient(#b8742e,#7a4818);border:5px solid ${INK};border-radius:40px 40px 4px 4px;transform-origin:0 100%"></div></div>`, "left:240px;top:330px;width:180px;height:130px;z-index:22");
    pop(chest); await wait(700); const lid = chest.lastChild;
    anim(lid, [{ transform: "none" }, { transform: "translate(-30px,-40px) rotate(-40deg)", opacity: 0 }], 350); fade(layer("background:#fff;z-index:24"), 300); for (let i = 0; i < 8; i++) flash(200, 460, 220, 360, "#ffe680");
    const tk = add(`<div><div style="left:8px;top:8px;width:284px;height:104px;border:3px dashed #b8860b;border-radius:8px"></div><div style="left:0;width:300px;top:18px;text-align:center;font-size:22px;color:#5a3a00">次シーズンの</div><div style="left:0;width:300px;top:50px;text-align:center;font-size:36px;color:#5a3a00">ハムパス購入権</div></div>`,
      "left:180px;top:190px;width:300px;height:120px;background:linear-gradient(#fff6c0,#ffd23c);border:4px solid #8a5a00;border-radius:10px;box-shadow:0 0 30px #ffd23c;z-index:23");
    await anim(tk, [{ transform: "translateY(150px) scale(.2)", opacity: 0 }, { transform: "translateY(-10px) scale(1.05)", opacity: 1, offset: .75 }, { transform: "none", opacity: 1 }], 500); await wait(600);
    const joy = ov(h, closedEyes + openMouth + tears); e3confetti(46);
    for (let i = 0; i < 3; i++) { await hop(h, 60); } bubble("来シーズンも買います!!", 660, 250, 1700); await wait(1900); joy.remove();
  },

  async achieve() { // 偽実績
    const h = ham(N), list = [];
    const cup = e3svg("0 0 64 64", `<path d="M18 10H46Q46 34 32 38Q18 34 18 10Z" fill=#fff4c0 stroke=#7a4a00 stroke-width=3 /><path d="M18 14Q8 14 10 22Q12 28 20 28M46 14Q56 14 54 22Q52 28 44 28" fill=none stroke=#7a4a00 stroke-width=3 /><rect x=28 y=38 width=8 height=8 fill=#fff4c0 stroke=#7a4a00 stroke-width=3 /><rect x=20 y=46 width=24 height=8 rx=2 fill=#fff4c0 stroke=#7a4a00 stroke-width=3 />`);
    const toast = async (head, title, desc, prog) => { const H = prog ? 108 : 84;
      list.forEach(t => { t.y -= H + 12; anim(t.e, [{ top: t.e.style.top }, { top: t.y + "px" }], 220).then(() => { t.e.style.top = t.y + "px"; }); if (prog) t.e.style.opacity = .55; });
      const y = prog ? 404 : 420, wrap = add(`<div></div>`, `left:330px;top:${y}px;width:384px;height:${H}px;overflow:hidden;z-index:9`);
      const e = add(`<div><div style="left:10px;top:10px;width:64px;height:64px;border-radius:50%;background:radial-gradient(#ffe58a,#d99a10);border:3px solid #fff9"><div style="left:6px;top:6px;width:46px;height:46px">${cup}</div></div>
        <div style="left:88px;top:8px;font-size:15px;color:#ffd23c">${head}</div><div style="left:88px;top:27px;font-size:25px;color:#fff">${title}</div><div style="left:88px;top:58px;font-size:16px;color:#cfd8e8">${desc}</div>
        ${prog ? `<div style="left:88px;top:84px;width:236px;height:14px;background:#0008;border:2px solid #fff6;border-radius:7px;overflow:hidden"><div style="left:0;top:0;width:0;height:100%;background:linear-gradient(#ffd27a,#ff8a1a)"></div></div>` : ""}</div>`,
        `left:40px;top:0;width:344px;height:${H}px;background:linear-gradient(90deg,#1d2336f4,#2c3552f4);border:2px solid #ffd23c99;border-radius:12px`, wrap);
      await anim(e, [{ transform: "translateX(100%)" }, { transform: "translateX(-10px)", offset: .8 }, { transform: "none" }], 230);
      say("カチッ", 690, y - 8, { size: 26, color: "#fff", ms: 500 }); list.push({ e: wrap, y }); return e; };
    const trophy = ov(h, e3arm("M220 760Q40 480 430-70") + e3arm("M1020 760Q1200 480 790-70") + `<path d="M430-420H770Q770-180 600-140Q430-180 430-420Z" fill=#ffd23c stroke=${INK} stroke-width=14 />
      <path d="M440-380Q330-380 350-300Q370-240 460-230M760-380Q870-380 850-300Q830-240 740-230" fill=none stroke=${INK} stroke-width=16 /><rect x=565 y=-144 width=70 height=50 fill=#ffd23c stroke=${INK} stroke-width=12 /><rect x=480 y=-100 width=240 height=50 rx=10 fill=#d99a10 stroke=${INK} stroke-width=12 />` + e3paw(440, -70, 56) + e3paw(780, -70, 56));
    trophy.style.opacity = 0;
    await wait(700);
    for (const [cond, title, desc] of [["10分間 キルなし", "安全第一", "10分間ノーキル"], ["同じ角で3回目のデス", "常連", "同じ角で3回死亡"], ["ウルト100%のままデス", "もったいない", "ウルト抱え落ち"]]) {
      chip(cond); await toast("実績解除", title, desc); trophy.style.opacity = 1; hop(h, 44);
      for (let i = 0; i < 4; i++) flash(HX + 40, HX + 190, HY - 100, HY - 20, "#ffe680"); await wait(1650); }
    chip("4連敗"); trophy.remove();
    const pe = await toast("実績の進捗", "皆勤賞", "連敗 4/5　あと少し!", 1); pe.style.borderColor = "#ff8a1a"; pe.style.boxShadow = "0 0 16px #ff8a1a";
    anim(pe.lastElementChild.firstChild, [{ width: "0%" }, { width: "80%" }], 700); await wait(800);
    const cheer = ov(h, e3arm("M250 760Q110 470 300 160") + e3paw(300, 150) + openMouth);
    const flag = add(`<div><div style="left:-3px;top:-120px;width:7px;height:126px;background:#8a5a30;border:1px solid ${INK}"></div><div style="left:-92px;top:-120px;width:88px;height:50px;background:#fff;border:3px solid ${INK};color:#d3202a;font-size:19px;line-height:44px;text-align:center">あと1敗</div></div>`,
      `left:${300 / 1237 * HW}px;top:${150 / 1271 * HH}px;width:0;height:0;z-index:4`, h);
    flag.animate([{ transform: "rotate(-14deg)" }, { transform: "rotate(14deg)" }], { duration: 260, iterations: Infinity, direction: "alternate", easing: "ease-in-out" });
    hop(h, 30); await wait(250); bubble("がんばれー!", 858, 160, 1800); await wait(2000); cheer.remove(); flag.remove();
  },

  async diary() { // 今日の日記
    const h = ham(N); await wait(700); chip("配信終了");
    const BX = 34, BY = 66, CW = 28, GX = BX + 22, GY = BY + 76, RG = 42;
    const cells = Array.from({ length: 6 }, (_, r) => Array.from({ length: 16 }, (_, c) => `<div style="left:${22 + c * CW}px;top:${76 + r * RG}px;width:${CW + 1}px;height:${CW + 1}px;border:1px solid #9cc7b4"></div>`).join("")).join("");
    const book = add(`<div><div style="left:10px;top:10px;width:670px;height:352px;background:#fffdf2;border-radius:4px">
      <div style="left:18px;top:16px;padding:2px 14px;border:3px solid #6aa88c;border-radius:8px;font-size:24px;color:#3d7a5e">にっき</div><div style="right:22px;top:24px;font-size:20px;color:#555">11がつ 7にち　はれ ☀</div>
      ${cells}<div style="left:488px;top:76px;width:162px;height:239px;border:3px solid #9cc7b4;border-radius:6px"></div></div></div>`,
      "left:24px;top:56px;width:690px;height:372px;background:#2f6fb6;border:4px solid #1d4a80;border-radius:14px;z-index:12;transform-origin:0 50%");
    await anim(book, [{ transform: "scaleX(0)" }, { transform: "none" }], 380);
    const pen = add(`<div><svg viewBox="0 0 40 170" style="left:-20px;top:-170px;width:40px;height:170px;overflow:visible"><rect x=8 y=10 width=24 height=112 fill=#ffcc33 stroke=${INK} stroke-width=4 /><path d="M20 22V120" stroke=#e0a800 stroke-width=4 />
      <rect x=8 y=0 width=24 height=18 rx=4 fill=#ff9aa8 stroke=${INK} stroke-width=4 /><rect x=8 y=16 width=24 height=8 fill=#bbb stroke=${INK} stroke-width=3 /><path d="M8 122L20 166L32 122Z" fill=#f2d2a0 stroke=${INK} stroke-width=4 stroke-linejoin=round /><path d="M15 148L20 166L25 148Z" fill=#444 /></svg>
      <div style="left:4px;top:-74px;width:40px;height:40px;border-radius:50%;background:#fbcbc3;border:4px solid ${INK}"></div></div>`, `left:0;top:0;width:0;height:0;rotate:28deg;z-index:20;transition:translate .08s`);
    const at = (x, y) => { pen.style.translate = `${x}px ${y}px`; };
    at(GX + 20, GY + 24); anim(pen, [{ opacity: 0 }, { opacity: 1 }], 200); const marks = []; const tongue = ov(h, `<path d="M638 664q26 50 58 4" fill=#ff8fa8 stroke=${INK} stroke-width=10 />`); await wait(400);
    for (const [r, txt] of ["きょうは 3しょう 5はい", "けんが がけから 3かい おちた", "たねは おいしかった"].entries()) {
      for (let c = 0; c < txt.length; c++) { const x = GX + c * CW, y = GY + r * RG; at(x + 22, y + 24);
        if (txt[c] !== " ") { const ch = add(`<div>${txt[c]}</div>`, `left:${x}px;top:${y}px;width:${CW}px;height:${CW}px;text-align:center;line-height:${CW}px;font-size:22px;font-weight:normal;color:#3a3a3a;rotate:${rnd(-6, 6)}deg;z-index:13`);
          anim(ch, [{ opacity: 0, transform: "scale(.6)" }, { opacity: 1, transform: "none" }], 90); marks.push(ch); }
        await wait(txt[c] === " " ? 50 : 92); }
      await wait(300); }
    const PX = BX + 488, PY = BY + 76;
    pen.querySelector("svg").innerHTML = `<rect x=6 y=40 width=28 height=86 rx=4 fill=#e8262c stroke=${INK} stroke-width=4 /><rect x=6 y=60 width=28 height=46 fill=#fff6 /><path d="M6 126Q20 112 34 126L28 150H12Z" fill=#e8262c stroke=${INK} stroke-width=4 stroke-linejoin=round />`;
    const strokes = [["M30 30m-15 0a15 15 0 1 0 30 0a15 15 0 1 0-30 0M30 6V0M30 54V60M6 30H0M54 30H60M13 13L9 9M47 47L51 51M47 13L51 9M13 47L9 51", "#ff9800", 5],
      ["M32 150C22 92 52 62 82 64C112 62 142 92 132 150C130 192 34 192 32 150Z", "#777", 6], ["M46 80C36 56 58 50 64 68M100 68C106 50 128 56 118 80", "#777", 6],
      ["M44 98L54 74L64 96L76 68L88 96L100 70L112 96L120 82", "#999", 5], ["M64 110l1 0M100 110l1 0", "#222", 10], ["M46 128q9-9 18 0q-9 9-18 0M100 128q9-9 18 0q-9 9-18 0", "#ff7f9f", 6],
      ["M76 126q6 7 12 0", "#222", 4], ["M132 174C150 192 148 220 132 226C116 220 114 192 132 174Z", "#333", 6], ["M126 186L125 216M138 186L139 216", "#999", 4], ["M124 196L140 192M122 208L142 204", "#333", 4]];
    const art = add(`<svg viewBox="0 0 160 236" style="overflow:visible"><defs><filter id=e3cray><feTurbulence type=fractalNoise baseFrequency=.8 numOctaves=2 /><feDisplacementMap in=SourceGraphic scale=3 /></filter></defs><g filter=url(#e3cray)>${strokes.map(([d, c, w]) => `<path d="${d}" pathLength=1 stroke-dasharray=1 stroke-dashoffset=1 fill=none stroke=${c} stroke-width=${w} stroke-linecap=round stroke-linejoin=round />`).join("")}</g></svg>`,
      `left:${PX + 1}px;top:${PY + 1}px;width:160px;height:236px;z-index:13`);
    say("おえかき", 600, 470, { size: 34, color: "#fff", ms: 900 });
    for (const [i, p] of [...art.querySelectorAll("path")].entries()) { const b = p.getBBox(); at(PX + b.x + b.width * .7, PY + b.y + b.height * .6);
      anim(p, [{ strokeDashoffset: 1 }, { strokeDashoffset: 0 }], 200, { easing: "linear" }); anim(pen, [{ rotate: "28deg" }, { rotate: "40deg" }, { rotate: "28deg" }], 200); await wait(i < 3 ? 260 : 190); }
    await wait(300);
    const spiral = Array.from({ length: 64 }, (_, i) => { const a = i / 63 * Math.PI * 5.2, r = 4 + i * .72; return `${i ? "L" : "M"}${(80 + Math.cos(a) * r).toFixed(1)} ${(70 + Math.sin(a) * r * .82).toFixed(1)}`; }).join("");
    const petals = Array.from({ length: 10 }, (_, k) => { const q = j => [80 + Math.cos(j / 10 * 6.283 + .3) * 58, 70 + Math.sin(j / 10 * 6.283 + .3) * 58 * .82].map(n => n.toFixed(1)).join(" "); return `${k ? "" : "M" + q(0)}A17 17 0 0 1 ${q(k + 1)}`; }).join("");
    const maru = add(`<svg viewBox="0 0 160 140" style="overflow:visible"><path d="${spiral}" pathLength=1 stroke-dasharray=1 stroke-dashoffset=1 fill=none stroke=#e8262c stroke-width=6 stroke-linecap=round /><path d="${petals}" pathLength=1 stroke-dasharray=1 stroke-dashoffset=1 fill=none stroke=#e8262c stroke-width=6 stroke-linecap=round /></svg>`, "left:356px;top:226px;width:176px;height:154px;z-index:14");
    at(440, 300); say("はなまる", 600, 470, { size: 34, color: "#fff", ms: 900 });
    for (const p of maru.querySelectorAll("path")) { anim(pen, [0, 1, 2, 3, 4].map(i => ({ translate: `${440 + Math.cos(i * 1.6) * 50}px ${300 + Math.sin(i * 1.6) * 40}px` })), 520, { easing: "linear" });
      await anim(p, [{ strokeDashoffset: 1 }, { strokeDashoffset: 0 }], 520, { easing: "linear" }); }
    tongue.remove(); fade(pen, 200); hop(h, 40); bubble("よくできました", 830, 258, 1500); await wait(1700);
    await anim(book, [{ transform: "none" }, { transform: "scaleX(0)" }], 300); [...marks, art, maru].forEach(e => e.remove());
    say("パタン", 360, 260, { size: 44, color: "#fff", ms: 600 }); await wait(1000);
  },
});
}
