// 配信ハム PoC 第4弾 (OWのプレイにちなんだ26案)。poc.js / poc2.js / poc3.js の部品を使い、scenes に足す。
// シーンごとの部品がぶつからないよう、まとまりごとに { } で囲んでいる。

// 配信ハム PoC 第4弾 d1 (OW のゲームの仕組みネタ 9案)。poc.js / poc2.js / poc3.js の部品を使い、scenes に足す。
{
  // 顔の部品 (ハム画像の座標)
  const eyeCover = `<defs><linearGradient id=d1g x2=0 y2=1><stop offset=.62 stop-color=#aaa1a0 /><stop offset=.62 stop-color=#fbf5e9 /></linearGradient></defs>` + MIDX.map(x => `<circle cx=${x} cy=488 r=93 fill=url(#d1g) />`).join("");
  const thick = `fill=none stroke=${INK} stroke-width=24 stroke-linecap=round stroke-linejoin=round`;
  const strainEyes = eyeCover + `<path d="M318 435L425 488L318 541M890 435L783 488L890 541" ${thick} />`; // > <
  const happyEyes = eyeCover + MIDX.map(x => `<path d="M${x - 72} 518Q${x} 410 ${x + 72} 518" ${thick} />`).join("");
  const spiralEyes = eyeCover + MIDX.map(x => `<path d="M${x} 488a10 10 0 1 1 20 0a20 20 0 1 1 -40 0a30 30 0 1 1 60 0a40 40 0 1 1 -80 0a50 50 0 1 1 100 0" ${line} />`).join("");
  const smugFace = MIDX.map(x => `<path d="M${x - 96} 494A96 96 0 0 1 ${x + 96} 494Z" fill=#aaa1a0 /><path d="M${x - 92} 494H${x + 92}" ${line} />`).join("") + hideMouth + `<path d="M530 655Q615 690 690 625" ${line} />`;
  const redFace = `<ellipse cx=600 cy=540 rx=480 ry=320 fill=#ff2a2a opacity=.3 />`;
  const sweat = [[150, 250, 0], [1090, 290, .4], [1010, 120, .2]].map(([x, y, d]) => `<path class=dr d="M${x} ${y}q-34 56 0 78q34-22 0-78" fill=#7cc4ff stroke=${INK} stroke-width=9 style="animation-delay:${d}s" />`).join("");
  const puffCheeks = `<circle cx=160 cy=680 r=290 fill=#fbf5e9 stroke=${INK} stroke-width=16 /><circle cx=1077 cy=680 r=290 fill=#fbf5e9 stroke=${INK} stroke-width=16 /><ellipse cx=190 cy=660 rx=110 ry=66 fill=#f7a8ae /><ellipse cx=1047 cy=660 rx=110 ry=66 fill=#f7a8ae /><path d="M60 520q40-30 90-20M1177 520q-40-30-90-20" ${line} />`;
  // 空回りする足
  const feetBlur = (h, ms = 110) => { const f = ov(h, [470, 770].map(x => `<ellipse cx=${x} cy=1215 rx=95 ry=52 fill=#fbcbc3 stroke=${INK} stroke-width=12 />`).join(""));
    [...f.children].forEach((e, i) => e.animate([{ transform: "translateX(-75px)" }, { transform: "translateX(75px)" }], { duration: ms, iterations: Infinity, direction: "alternate", delay: i * ms / 2 })); return f; };
  const blink = e => e.animate([{ opacity: 1 }, { opacity: 1, offset: .5 }, { opacity: .15, offset: .5 }, { opacity: .15 }], { duration: 360, iterations: Infinity });
  const puff = (x, y, col = "#d8d0c0cc", dx = 0, dy = -60) => { const d = add(`<div></div>`, `left:${x}px;top:${y}px;width:${rnd(18, 32)}px;height:${rnd(14, 24)}px;border-radius:50%;background:${col};z-index:12`);
    anim(d, [{ transform: "none", opacity: 1 }, { transform: `translate(${dx + rnd(-20, 20)}px,${dy + rnd(-15, 15)}px) scale(2)`, opacity: 0 }], 600).then(() => d.remove()); };

  Object.assign(scenes, {
    async payload() { // ペイロード押し
      const h = ham(N), sx = HX - 172;
      const pile = [[72, 9], [58, 8], [44, 6], [31, 4], [19, 2]].map(([y, n]) => Array.from({ length: n }, (_, i) =>
        `<g transform="translate(${100 + (i - (n - 1) / 2) * 19} ${y}) rotate(${(i * 47 + y) % 80 - 40}) scale(1.15)"><path d="M0 -12C8 -4 7 10 0 12C-7 10 -8 -4 0 -12Z" fill=#2e2626 stroke=#fff stroke-width=1.4 /><path d="M-2.5 -7L-2 8M2.5 -7L2 8" stroke=#ddd stroke-width=1.6 /></g>`).join("")).join("");
      const wheelG = cx => `<g class=wh style="transform-box:fill-box;transform-origin:center"><circle cx=${cx} cy=146 r=19 fill=#555 stroke=${INK} stroke-width=6 /><path d="M${cx} 131V161M${cx - 15} 146H${cx + 15}" stroke=#bbb stroke-width=4 /></g>`;
      const cart = add(`<svg viewBox="0 0 200 170" style="overflow:visible"><ellipse cx=100 cy=66 rx=88 ry=40 fill=#e2cc9a stroke=${INK} stroke-width=4 />${pile}<path d="M8 66H192L178 134H22Z" fill=#9b6b3e stroke=${INK} stroke-width=6 /><path d="M14 89H186M18 112H182" stroke=#6b4522 stroke-width=4 />${wheelG(52)}${wheelG(148)}</svg>`,
        `left:${sx}px;top:${534 - 162}px;width:190px;height:162px;z-index:11`);
      const spins = [...cart.querySelectorAll(".wh")].map(g => g.animate([{ transform: "rotate(0)" }, { transform: "rotate(-360deg)" }], { duration: 700, iterations: Infinity }));
      const roll = on => spins.forEach(a => on ? a.play() : a.pause()); roll(0);
      const bar = add(`<div></div>`, "left:350px;top:70px;width:320px;height:14px;background:#000a;border:2px solid #fff;border-radius:4px;z-index:15");
      const fill = add(`<div></div>`, "left:0;top:0;width:0;height:100%;background:linear-gradient(#8fe0ff,#2a9be0)", bar);
      add(`<div></div>`, "left:158px;top:-7px;width:4px;height:24px;background:#ffd23c", bar); // チェックポイント
      const icon = add(`<div>🛒</div>`, "left:-14px;top:-32px;font-size:22px", bar);
      const tag = add(`<div class=t>ペイロード</div>`, "left:-12px;top:5px;translate:-100% -50%;font-size:20px;color:#fff", bar);
      const go = async (x0, x1, p, ms) => { roll(1); fill.style.transition = icon.style.transition = `all ${ms}ms linear`; fill.style.width = p + "%"; icon.style.left = 320 * p / 100 - 14 + "px";
        anim(cart, [{ transform: `translateX(${x0}px)` }, { transform: `translateX(${x1}px)` }], ms, { easing: "linear" }); await walk(h, x0, x1, ms, Math.round(ms / 180)); roll(0); };
      await wait(600); chip("ペイロード前進中"); await go(0, -150, 30, 1500);
      chip("競合中"); tag.textContent = "競合中!"; tag.style.color = "#ff5a4a"; fill.style.filter = "grayscale(1)";
      const face = ov(h, redFace + strainEyes + sweat), feet = feetBlur(h);
      say("ふんぬ〜!!", HX - 40, 262, { size: 44, color: "#ff8a5a", ms: 1900 });
      for (let i = 0; i < 16; i++) { puff(HX - 150 + rnd(120, 220), rnd(505, 522), "#a8987ecc", rnd(60, 120), rnd(-40, -10));
        anim(h, [{ transform: `translateX(${-150 + (i % 2 ? 3 : -3)}px)` }, { transform: `translateX(${-150 + (i % 2 ? -3 : 3)}px)` }], 120, { easing: "linear" }); await wait(130); }
      face.remove(); feet.remove(); chip("ペイロード前進中"); tag.textContent = "ペイロード"; tag.style.color = "#fff"; fill.style.filter = "none";
      const g2 = go(-150, -310, 62, 1400); await wait(820); say("チェックポイント!", 510, 128, { size: 36, color: "#8fe0ff", ms: 1000 }); await g2;
      await go(-310, -470, 100, 1400);
      chip("ペイロード到着"); say("到着!!", 480, 170, { size: 64, ms: 900 }); await wait(800);
      const cx = sx - 470 + 95, big = seed(cx - 33, 380, 66, 9);
      await anim(big, [{ transform: "translateY(40px) scale(.3)" }, { transform: "translateY(-150px) rotate(15deg) scale(1.1)", offset: .7 }, { transform: "translateY(-130px) rotate(10deg)" }], 600);
      for (let i = 0; i < 5; i++) flash(cx - 90, cx + 90, 180, 300, "#ffe066");
      say("巨大な種!!", cx + 60, 190, { size: 40, color: "#fff", ms: 900 }); await wait(850);
      big.style.zIndex = 13; hop(h, 20);
      await anim(big, [{ transform: "translateY(-130px) rotate(10deg)" }, { transform: "translate(150px,-6px) rotate(80deg)" }], 380);
      const cheek = ov(h, puffCheeks + hideMouth + `<ellipse cx=600 cy=668 rx=46 ry=38 fill=#c9485b stroke=${INK} stroke-width=12 />` + strainEyes + redFace);
      say("むぎゅ〜", 360, 290, { size: 40, color: "#fff", ms: 900 });
      for (let i = 0; i < 4; i++) { await anim(h, [{ transform: "translateX(-470px)" }, { transform: "translateX(-466px) scale(1.06,.95)" }, { transform: "translateX(-470px)" }], 260, { easing: "linear" }); }
      bubble("…入らない", 360, 236, 1300); await wait(1400);
      cheek.remove(); say("ポンッ", 230, 340, { size: 40, color: "#fff", ms: 600 });
      anim(big, [{ transform: "translate(150px,-6px) rotate(80deg)" }, { transform: "translate(-60px,-260px) rotate(300deg)", offset: .4 }, { transform: "translate(-160px,240px) rotate(600deg)" }], 900, { easing: "linear" });
      await wait(500); chip("定位置に戻る"); fade(cart, 700); fade(bar, 400); await walk(h, -470, 0, 1200, 6); await wait(900);
    },

    async overtime() { // オーバータイム
      const h = ham(N); h.style.transformOrigin = "100% 100%"; await wait(700); chip("占拠中にオーバータイム");
      const pt = add(`<div></div>`, "left:200px;top:452px;width:260px;height:72px;border-radius:50%;border:5px solid #8ff0ff;background:radial-gradient(ellipse,#8ff0ffaa,#8ff0ff33 60%,#0000 72%);box-shadow:0 0 26px #8ff0ff,inset 0 0 18px #8ff0ff;z-index:4");
      pt.animate([{ opacity: .55 }, { opacity: 1 }], { duration: 450, iterations: Infinity, direction: "alternate" });
      const ot = add(`<div class=t>OVERTIME</div>`, "left:480px;top:72px;translate:-50% -50%;font-size:48px;color:#ff3b30;z-index:30"); blink(ot);
      const gb = add(`<div></div>`, "left:340px;top:98px;width:280px;height:12px;background:#000a;border:2px solid #fff;z-index:30"), gf = add(`<div></div>`, "left:0;top:0;width:100%;height:100%;background:#ff3b30;transition:width .45s", gb);
      const paw = add(`<div></div>`, "left:0;top:0;width:42px;height:30px;border-radius:50%;background:#fbcbc3;border:4px solid #331c16;z-index:11;opacity:0");
      const S = [[2.3, .78], [2.65, .62], [3.0, .5], [3.35, .42]]; let cur = [1, 1];
      const px = kx => HX + HW - HW * kx * .93 - 21;
      const stretch = async ([kx, ky], ms) => { paw.style.opacity = 1; const o = { easing: "cubic-bezier(.3,1.4,.6,1)" };
        anim(paw, [{ transform: `translate(${px(cur[0])}px,500px)` }, { transform: `translate(${px(kx)}px,500px)` }], ms, o);
        await anim(h, [{ transform: `scale(${cur[0]},${cur[1]})` }, { transform: `scale(${kx},${ky})` }], ms, o); cur = [kx, ky]; };
      await wait(500); bubble("ここから動けない…", 600, 230, 1100); await wait(1200);
      say("ぐい〜ん", 640, 300, { size: 40, color: "#fff", ms: 800 }); await stretch(S[0], 700);
      for (let i = 1; i <= 3; i++) { await wait(1000); gf.style.width = [100, 66, 36, 10][i] + "%"; await stretch(S[i], 420);
        say("まだ触ってる!!", 330, 340, { size: 34 + i * 8, color: "#fff", ms: 850 }); }
      await wait(1000); chip("勝利"); ot.remove(); gb.remove(); say("勝利!!", 480, 170, { size: 84, ms: 1200 }); await wait(500);
      paw.remove(); say("バチン!!", 760, 250, { size: 56, color: "#fff", ms: 900 });
      await anim(h, [{ transform: `scale(${cur[0]},${cur[1]})` }, { transform: "scale(.7,1.3)", offset: .3 }, { transform: "scale(1.15,.88)", offset: .55 }, { transform: "scale(.95,1.05)", offset: .78 }, { transform: "none" }], 650, { easing: "linear" });
      shake(h); ov(h, spiralEyes); h.img.style.transformOrigin = "50% 100%";
      h.img.animate([{ transform: "rotate(-4deg)" }, { transform: "rotate(4deg)" }], { duration: 450, iterations: Infinity, direction: "alternate", easing: "ease-in-out" });
      for (let i = 0; i < 3; i++) { const st = add(`<div>★</div>`, `left:${HX + HW / 2 - 13}px;top:${HY - 10}px;font-size:26px;color:#ffe066;z-index:12;text-shadow:0 0 6px #fff`);
        st.animate(Array.from({ length: 13 }, (_, k) => { const a = (k / 12 + i / 3) * 6.283; return { transform: `translate(${Math.cos(a) * 72}px,${Math.sin(a) * 18}px)` }; }), { duration: 900, iterations: Infinity }); }
      await wait(500); say("ぐるぐる…", 600, 270, { size: 36, color: "#fff", ms: 1000 }); await wait(1300);
    },

    async potg() { // POTG横取り
      const h = ham(N); await wait(800); chip("試合終了: プレイ・オブ・ザ・ゲーム");
      const dim = layer("z-index:18;background:#000b"); await anim(dim, [{ opacity: 0 }, { opacity: 1 }], 300);
      const band = add(`<div></div>`, "left:0;top:300px;width:640px;height:150px;z-index:22");
      add(`<div></div>`, "left:-40px;top:0;width:640px;height:150px;transform:skewX(-14deg);background:linear-gradient(90deg,#f39a1e,#f8c843 70%,#f8c84300)", band);
      pic(N, 34, 20, 108, "", band);
      add(`<div>PLAY OF THE GAME</div>`, "left:164px;top:18px;font-size:26px;letter-spacing:3px;color:#fff;white-space:nowrap", band);
      add(`<div class=t>ハム</div>`, "left:164px;top:50px;font-size:76px;color:#fff", band);
      await anim(band, [{ transform: "translateX(-700px)" }, { transform: "none" }], 320, { easing: "cubic-bezier(.2,1.2,.4,1)" }); await wait(1200); await fade(band, 200);
      const rp = layer("z-index:20;overflow:hidden;background:#000"), cam = layer("transform-origin:476px 300px", "", rp);
      add(`<div></div>`, "left:-30px;top:-30px;width:1020px;height:600px;background:#171d2c url(ow_bg.png) center/cover;filter:blur(4px) brightness(.6)", cam);
      add(`<div></div>`, "left:350px;top:432px;width:260px;height:40px;border-radius:50%;background:#0008", cam);
      const bh = add(`<div><img src="${N}" style="width:100%;height:100%"></div>`, "left:330px;top:150px;width:300px;height:308px;transform-origin:50% 100%", cam);
      const mo = ov(bh, openMouth); mo.style.opacity = 0;
      const sd = add(`<div>${seedHtml(30)}</div>`, "left:0;top:0;width:30px;height:45px;opacity:0", cam);
      const rec = label("● REPLAY", "right:16px;top:16px;z-index:25;color:#ff6a6a"); blink(rec);
      const who = label("POTG: ハム", "left:16px;top:62px;z-index:25");
      const take = async (ms, txt) => { const lb = label(txt, "left:480px;bottom:22px;translate:-50% 0;z-index:25;font-size:28px"); sd.style.opacity = 1;
        await anim(sd, [{ transform: "translate(457px,385px) rotate(-25deg)" }, { transform: "translate(460px,282px) rotate(0deg)" }], ms * .45, { easing: "ease-in-out" });
        mo.style.opacity = 1; await wait(ms * .15); sd.style.opacity = 0; await wait(ms * .05); mo.style.opacity = 0;
        await anim(bh, [{ transform: "none" }, { transform: "scale(1.05,.95)" }, { transform: "none" }, { transform: "scale(1.05,.95)" }, { transform: "none" }], ms * .35, { easing: "linear" }); lb.remove(); };
      const cut = async () => { const w = layer("z-index:24;background:#fff"); await anim(w, [{ opacity: 0 }, { opacity: .9 }, { opacity: 0 }], 260); w.remove(); };
      await take(2600, "スローモーション ×0.25"); await cut();
      cam.style.transform = "scale(2.3) rotate(-22deg)"; await take(1500, "別アングル"); await cut();
      cam.style.transform = "none"; rp.style.filter = "grayscale(1) contrast(1.1)";
      add(`<div></div>`, "left:0;top:0;width:960px;height:540px;background:radial-gradient(ellipse,#0000 40%,#000d 95%)", rp);
      const scr = add(`<div></div>`, "left:300px;top:0;width:2px;height:540px;background:#fff8", rp);
      scr.animate([{ transform: "translateX(0)" }, { transform: "translateX(260px)" }, { transform: "translateX(90px)" }], { duration: 400, iterations: Infinity });
      await take(1700, "回想　あの日、ハムは種を食べた"); await cut(); rp.remove(); rec.remove(); who.remove();
      h.style.zIndex = 19;
      const card = add(`<div><div style="left:0;right:0;top:12px;text-align:center;font-size:22px;color:#f8c843;letter-spacing:2px">PLAY OF THE GAME</div><div class=t style="left:0;right:0;top:40px;text-align:center;font-size:40px;color:#fff">ハム</div></div>`,
        "left:170px;top:110px;width:520px;height:290px;background:#141824f0;border:4px solid #f8c843;border-radius:16px;z-index:30");
      pop(card); await wait(400);
      for (const [i, [a, b, c]] of [["キル", "0", "#fff"], ["種", "1", "#fff"], ["かわいさ", "∞", "#ffd23c"]].entries()) {
        pop(add(`<div><div style="left:0;right:0;top:0;text-align:center;font-size:24px;color:#bbb">${a}</div><div class=t style="left:0;right:0;top:30px;text-align:center;font-size:${b === "∞" ? 88 : 72}px;color:${c}">${b}</div></div>`, `left:${20 + i * 160}px;top:120px;width:160px;height:150px`, card));
        await wait(500); }
      for (let i = 0; i < 6; i++) flash(530, 650, 230, 330, "#ffe066");
      hop(h, 30); await wait(1500); fade(card); fade(dim); await wait(300); h.style.zIndex = 10; await wait(900);
    },

    async killcam() { // キルカムに映り込む
      const h = ham(N); await wait(800); chip("デス → キルカム"); shake(h); await wait(400);
      const kc = layer("z-index:20;overflow:hidden;background:#000");
      add(`<div></div>`, "left:-150px;top:-130px;width:1260px;height:709px;background:#171d2c url(ow_bg.png) center/cover;transform:scaleX(-1)", kc); // 敵の視点 (左右反転)
      add(`<svg viewBox="0 0 140 120"><rect x=3 y=3 width=134 height=114 fill=#a8743f stroke=${INK} stroke-width=6 /><path d="M6 6L134 114M134 6L6 114" stroke=#7a4f25 stroke-width=9 /><rect x=3 y=3 width=134 height=114 fill=none stroke=${INK} stroke-width=6 /></svg>`, "left:120px;top:300px;width:140px;height:120px;z-index:3", kc);
      add(`<div></div>`, "left:640px;top:70px;width:64px;height:380px;background:linear-gradient(90deg,#5d616b,#a3a8b3 40%,#5d616b);border:4px solid #2b2d33;z-index:3", kc);
      add(`<svg viewBox="0 0 110 110"><rect x=3 y=6 width=104 height=101 rx=10 fill=#3f6fa8 stroke=${INK} stroke-width=6 /><path d="M3 40H107M3 76H107" stroke=#2a4a72 stroke-width=6 /><ellipse cx=55 cy=9 rx=51 ry=8 fill=#5a8ac4 stroke=${INK} stroke-width=4 /></svg>`, "left:340px;top:330px;width:110px;height:110px;z-index:3", kc);
      add(`<div></div>`, "left:0;top:0;width:960px;height:540px;background:radial-gradient(ellipse,#ff202000 35%,#a0000088 100%),#ff000012;z-index:6", kc); // 赤み
      add(`<div>キルカム</div>`, "left:480px;top:16px;translate:-50% 0;padding:4px 26px;background:#c01818;color:#fff;font-size:30px;letter-spacing:6px;border-radius:4px;z-index:7", kc);
      add(`<div><div style="left:24px;top:14px;font-size:20px;color:#ffb0b0">あなたを倒した敵の視点</div><div style="left:24px;top:44px;font-size:26px">敵 ？？？</div></div>`, "left:0;top:446px;width:960px;height:94px;background:linear-gradient(#0000,#000d 40%);z-index:7", kc);
      const rt = add(`<svg viewBox="-50 -50 100 100"><circle r=30 fill=none stroke=#ff3b3b stroke-width=4 /><path d="M0 -46V-18M0 18V46M-46 0H-18M18 0H46" stroke=#ff3b3b stroke-width=4 /><circle r=3 fill=#ff3b3b /></svg>`, "left:-50px;top:-50px;width:100px;height:100px;z-index:5", kc);
      let rp = [480, 280]; const aim = async (x, y, ms = 650) => { await anim(rt, [{ transform: `translate(${rp[0]}px,${rp[1]}px)` }, { transform: `translate(${(rp[0] + x) / 2 + 30}px,${(rp[1] + y) / 2 - 30}px)`, offset: .6 }, { transform: `translate(${x}px,${y}px)` }], ms, { easing: "ease-in-out" }); rp = [x, y]; };
      // 物陰からひょこっ (side: "top" は上から、"left" は柱の左から)
      const peek = async (bx, by, side, prop, ms) => { const box = add(`<div></div>`, `left:${bx}px;top:${by}px;width:110px;height:113px;overflow:hidden;z-index:2`, kc);
        const p = pic(N, side === "top" ? 0 : 110, side === "top" ? 113 : 0, 110, "", box), to = side === "top" ? "translateY(-80px)" : "translateX(-74px) rotate(-14deg)";
        await anim(p, [{ transform: "none" }, { transform: to }], 220, { easing: "cubic-bezier(.2,1.5,.4,1)" }); say("ひょこっ", bx + 55, by - 18, { size: 26, color: "#fff", ms: 600, z: 8 });
        const pr = prop(); pop(pr); await wait(ms); pr.remove(); await anim(p, [{ transform: to }, { transform: "none" }], 160); box.remove(); };
      await aim(480, 280, 300);
      await aim(190, 298); await peek(135, 187, "top", () => add(`<div>✌️</div>`, "left:250px;top:196px;font-size:46px;z-index:4", kc), 1000);
      await aim(612, 300); await peek(530, 230, "left", () => { const f = add(`<div><div style="left:0;top:0;width:6px;height:96px;background:#8a5a30;border:1px solid ${INK}"></div><div style="left:6px;top:2px;width:64px;height:42px;background:#ffd23c;border:3px solid ${INK};transform-origin:0 50%;color:${INK};font-size:20px;line-height:35px;text-align:center">ハム</div></div>`, "left:470px;top:196px;width:80px;height:100px;z-index:4", kc);
        f.lastChild.animate([{ transform: "skewY(-12deg) scaleX(.9)" }, { transform: "skewY(10deg)" }], { duration: 220, iterations: Infinity, direction: "alternate" }); return f; }, 1200);
      await aim(395, 328); await peek(340, 217, "top", () => { const u = add(`<div><div style="left:55px;top:110px;width:10px;height:64px;background:#c9a26b;border:2px solid ${INK}"></div><div style="left:0;top:0;width:120px;height:120px;border-radius:50%;background:#ff8fc0;border:5px solid #fff;box-shadow:0 0 0 3px ${INK};text-align:center;line-height:1.05;padding-top:16px"><div style="position:static;font-size:46px;color:#fff;-webkit-text-stroke:6px #c2185b;paint-order:stroke fill">健</div><div style="position:static;font-size:19px;color:#fff;-webkit-text-stroke:4px #c2185b;paint-order:stroke fill;white-space:nowrap">見てる〜?</div></div></div>`, "left:452px;top:150px;width:120px;height:180px;z-index:4;transform-origin:50% 100%", kc);
        u.animate([{ rotate: "-10deg" }, { rotate: "10deg" }], { duration: 300, iterations: Infinity, direction: "alternate", easing: "ease-in-out" }); return u; }, 1500);
      chip("リスポーン"); const fl = layer("z-index:24;background:#fff"); kc.remove(); fade(fl, 300);
      ov(h, sweat); anim(h, Array.from({ length: 11 }, (_, i) => ({ transform: i % 2 ? "scale(1.05,.94)" : "none" })), 2000, { easing: "linear" });
      say("ゼェ…ゼェ…", HX + 70, HY - 22, { size: 30, color: "#fff", ms: 1800 }); await wait(700);
      bubble("ずっとここにいましたけど", 540, 210, 1500); await wait(1800);
    },

    async medals() { // 勲章まみれ
      const h = ham(N);
      const named = [["チームプレイ", "協"], ["リーダー", "導"], ["かわいい", "愛"], ["種をくれた", "種"], ["よく寝た", "眠"]];
      const more = [["まるい", "丸"], ["毛並み", "毛"], ["頬袋", "頬"], ["静か", "静"], ["右下にいる", "右"], ["呼吸", "息"], ["ひげ", "髭"], ["存在", "存"], ["まばたき", "瞬"], ["耳", "耳"], ["あくび", "欠"], ["重さ", "重"], ["生きてる", "命"]];
      const spots = [[620, 830], [380, 880], [860, 880], [500, 1080], [740, 1080], [260, 1090], [980, 1090], [220, 640], [1020, 640], [610, 610], [380, 410], [840, 410], [610, 240], [250, 170], [990, 170], [130, 880], [1110, 880], [620, 1230]];
      const cols = [["#f6c443", "#d33"], ["#cfd6de", "#3a7bd5"], ["#d08a4a", "#2e9e5b"], ["#f6c443", "#8a4fd0"], ["#cfd6de", "#e07a1f"]];
      const medal = (i, k) => { const [x, y] = spots[i], [c, r] = cols[i % 5];
        const g = ov(h, `<g style="transform-box:fill-box;transform-origin:center"><path d="M${x - 70} ${y - 215}H${x + 70}L${x + 36} ${y - 80}H${x - 36}Z" fill=${r} stroke=${INK} stroke-width=10 /><path d="M${x} ${y - 212}V${y - 84}" stroke=#fffa stroke-width=18 /><circle cx=${x} cy=${y} r=100 fill=${c} stroke=${INK} stroke-width=12 /><circle cx=${x} cy=${y} r=74 fill=none stroke=#fffa stroke-width=8 /><text x=${x} y=${y + 36} text-anchor=middle font-size=104 font-weight=900 fill=#5a3a00>${k}</text></g>`).firstChild;
        anim(g, [{ transform: "scale(3)", opacity: 0 }, { transform: "none", opacity: 1 }], 200, { easing: "ease-in" }); };
      await wait(800);
      for (const [i, [nm, k]] of named.entries()) { chip(`推薦: ${nm}`); medal(i, k); say(`+ ${nm}`, 470, 230, { size: 40, color: "#fff", ms: 750 }); await wait(950); }
      say("どんどん来る!!", 420, 160, { size: 48, ms: 1400 });
      for (const [j, [nm, k]] of more.entries()) { chip(`推薦: ${nm}`); medal(5 + j, k); await wait(Math.max(120, 300 - j * 16)); }
      await wait(300); chip("重量オーバー"); say("ズシッ…", 560, 300, { size: 40, color: "#fff", ms: 900 });
      await anim(h, Array.from({ length: 11 }, (_, i) => ({ transform: `translate(${i % 2 ? 3 : -3}px,${i * 1.2}px) perspective(600px) rotateX(0deg) scaleY(${1 - i * .006})` })), 1100, { easing: "linear" });
      await anim(h, [{ transform: "translate(0,12px) perspective(600px) rotateX(0deg) scaleY(.94)" }, { transform: "translate(0,12px) perspective(600px) rotateX(-48deg) scaleY(.94)" }], 1500, { easing: "cubic-bezier(.55,0,.9,.6)" });
      await anim(h, [{ transform: "translate(0,12px) perspective(600px) rotateX(-48deg) scaleY(.94)" }, { transform: "translate(0,14px) scale(1.28,.42)" }], 160, { easing: "ease-in" });
      say("ドスン", 640, 430, { size: 44, color: "#fff", ms: 700 }); for (let i = 0; i < 10; i++) puff(rnd(700, 930), rnd(500, 525), "#e8e0d0cc", rnd(-60, 60), rnd(-50, -20));
      await wait(500); bubble("重い…光栄…", 690, 380, 1700); await wait(1900);
    },

    async respawn() { // リスポーン体操
      const g = gameBg(), h = ham(N); g.style.transition = "filter .3s";
      await wait(800); chip("デス → リスポーン待ち"); g.style.filter = "grayscale(1) brightness(.7)";
      const cd = add(`<div class=t>リスポーンまで 10</div>`, "left:480px;top:150px;translate:-50% -50%;font-size:52px;color:#fff;z-index:30");
      const arm = x => `<g style="transform-origin:${x}px 740px;transition:transform .3s ease-in-out"><rect x=${x - 55} y=740 width=110 height=400 rx=55 fill=#fbf5e9 stroke=${INK} stroke-width=14 /><circle cx=${x} cy=1140 r=64 fill=#fbcbc3 stroke=${INK} stroke-width=14 /></g>`;
      const arms = ov(h, arm(170) + arm(1067)), [aL, aR] = arms.children;
      const pose = (l, r, k = 1) => { aL.style.transform = `rotate(${l}deg) scaleY(${k})`; aR.style.transform = `rotate(${-r}deg) scaleY(${k})`; };
      const ex = label("♪ ハム体操 第一", "left:16px;top:62px;z-index:30;font-size:24px");
      const B = (a, b) => anim(h, [{ transform: a }, { transform: b }], 300);
      const beats = [
        ["腕を前から上へ", () => pose(-35, -35, .6)], [0, () => { pose(180, 180); B("none", "scaleY(1.08)"); }], [0, () => { pose(0, 0); B("scaleY(1.08)", "none"); }],
        [0, () => pose(-35, -35, .6)], [0, () => { pose(180, 180); B("none", "scaleY(1.08)"); }],
        ["体を横に曲げる", () => { pose(20, 205); B("scaleY(1.08)", "rotate(-14deg)"); }], [0, () => { pose(205, 20); B("rotate(-14deg)", "rotate(14deg)"); }],
        ["跳ぶ", () => { pose(100, 100); anim(h, [{ transform: "rotate(14deg)" }, { transform: "translateY(-50px)", offset: .45 }, { transform: "none" }], 450); }],
        [0, () => { pose(25, 25); hop(h, 50); }], [0, () => { pose(100, 100); hop(h, 50); }]];
      for (let n = 10; n >= 1; n--) { const [lb, fn] = beats[10 - n]; cd.textContent = `リスポーンまで ${n}`; anim(cd, [{ transform: "scale(1.2)" }, { transform: "none" }], 200);
        if (lb) ex.textContent = `♪ ハム体操 第一　${lb}`; fn(); await wait(820); }
      chip("リスポーン"); cd.remove(); g.style.filter = "none"; pose(0, 0); say("復帰!!", 480, 160, { size: 64, color: "#7dff8a", ms: 900 }); await wait(900);
      ex.textContent = "♪ ハム体操 第二"; bubble("第二もあります", 590, 230, 2200); hop(h, 20);
      for (const [l, r, k] of [[-35, -35, .6], [180, 180, 1], [90, 90, 1], [180, 180, 1]]) { pose(l, r, k); await wait(600); }
      await wait(500);
    },

    async ping() { // ピン連打
      const h = ham(N);
      const pin = (x, y, t, c, big) => { const k = big ? 1.75 : 1.25;
        pop(add(`<div><svg viewBox="-20 -20 40 40" style="left:${-15 * k}px;top:${-30 * k}px;width:${30 * k}px;height:${30 * k}px;overflow:visible"><path d="M0 -17L17 0L0 17L-17 0Z" fill=${c} stroke=#fff stroke-width=3 /><text y=6 text-anchor=middle font-size=17 font-weight=900 fill=#fff>${big ? "♥" : "!"}</text></svg><div style="left:0;top:${-60 * k}px;translate:-50% 0;font-size:${17 * k}px;padding:1px 8px;border-radius:6px;background:#000b;color:${c};border:2px solid ${c};white-space:nowrap">${t}</div></div>`,
          `left:${x}px;top:${y}px;width:0;height:0;z-index:${big ? 26 : 20}`), 200);
        const r = add(`<div></div>`, `left:${x - 36}px;top:${y - 36}px;width:72px;height:72px;border-radius:50%;border:3px solid ${c};z-index:19`);
        anim(r, [{ transform: "scale(.2)", opacity: 1 }, { transform: "scale(1.7)", opacity: 0 }], 500).then(() => r.remove());
        say(big ? "ピコン♡" : "ピコン", x + rnd(-14, 14), y - 74 * k - 12, { size: big ? 32 : 26, color: big ? "#ffd0e6" : "#fff", ms: big ? 1400 : 500, z: 27 }); };
      const C = { 敵: "#ff4b4b", ここ: "#4fd2ff", 種: "#ffd23c", 危険: "#ff9a2e", たぶん敵: "#ff7a9a", 空: "#9fe0ff", 天井: "#e0e6ee", 床: "#d9b77f", 壁: "#b0b8c4", なにか: "#c58cff" };
      await wait(800); chip("配信者がピンを刺した"); pin(450, 270, "敵", C.敵); await wait(1300);
      say("!", HX + 60, HY - 20, { size: 60, color: "#fff", ms: 500 }); hop(h, 30); await wait(500); bubble("ハムも!", 620, 240, 800); await wait(900); chip("ハムもまねした");
      const spam = [["ここ", 300, 330], ["種", 600, 420], ["危険", 180, 200], ["たぶん敵", 540, 240], ["空", 760, 130], ["天井", 340, 130], ["床", 400, 480], ["敵", 120, 380], ["ここ", 650, 300], ["種", 250, 450],
        ["壁", 60, 260], ["なにか", 460, 170], ["敵", 880, 150], ["危険", 360, 260], ["種", 520, 350], ["空", 600, 120], ["ここ", 200, 300], ["たぶん敵", 420, 400], ["天井", 120, 130], ["種", 690, 230], ["敵", 300, 200], ["ここ", 560, 470], ["危険", 480, 300], ["種", 150, 470],
        ["ここ", 90, 330], ["敵", 640, 170], ["種", 380, 340], ["危険", 250, 250], ["たぶん敵", 560, 400], ["空", 460, 125], ["敵", 520, 200], ["種", 300, 410]];
      for (const [i, [t, x, y]] of spam.entries()) { pin(x, y, t, C[t]); anim(h, [{ transform: "none" }, { transform: `translate(${i % 2 ? 4 : -4}px,-8px)` }, { transform: "none" }], 120); await wait(Math.max(60, 300 - i * 16)); }
      await wait(600); chip("仕上げ"); pin(HX + HW / 2, HY - 4, "かわいい", "#ff6fae", 1); ov(h, eyeCover + happyEyes); hop(h, 24);
      await wait(700); bubble("これでよし", 580, 330, 1500); await wait(1800);
    },

    async shield() { // 自分だけシールド
      const g = gameBg(), h = ham(N); await wait(800); chip("敵のウルトが飛んでくる");
      const red = layer("z-index:6;box-shadow:inset 0 0 140px 40px #ff1a1a"); red.animate([{ opacity: .2 }, { opacity: 1 }], { duration: 260, iterations: Infinity, direction: "alternate" });
      const warn = add(`<div class=t>⚠ 敵のウルト!</div>`, "left:440px;top:140px;translate:-50% -50%;font-size:58px;color:#ff4b3b;z-index:30"); blink(warn);
      const orb = add(`<div></div>`, "left:430px;top:230px;width:100px;height:100px;border-radius:50%;background:radial-gradient(#fff 0 18%,#ffcf4a 32%,#ff5a1a 55%,#ff3b0000 70%);z-index:7");
      anim(orb, [{ transform: "scale(.15)" }, { transform: "scale(.7)" }], 3000, { easing: "linear" });
      await wait(500); say("!?", HX + 60, HY - 24, { size: 60, color: "#ff5a4a", ms: 600 }); hop(h, 30); await wait(700);
      const armS = (d, c) => `<path d="${d}" fill=none stroke=${c} stroke-width=${c === INK ? 104 : 80} stroke-linecap=round />`;
      const L = "M190 800C10 640 20 260 480 70", R = "M1047 800C1227 640 1217 260 757 70";
      ov(h, armS(L, INK) + armS(L, "#fbf5e9") + armS(R, INK) + armS(R, "#fbf5e9") +
        `<rect x=500 y=-40 width=237 height=110 rx=12 fill=#2f8fe8 stroke=${INK} stroke-width=12 /><path d="M540 -30V60M580 -30V60M620 -30V60M660 -30V60M700 -30V60" stroke=#1d6cc0 stroke-width=10 /><ellipse cx=618 cy=-40 rx=118 ry=30 fill=#7cc4ff stroke=${INK} stroke-width=12 /><circle cx=500 cy=80 r=62 fill=#fbcbc3 stroke=${INK} stroke-width=12 /><circle cx=737 cy=80 r=62 fill=#fbcbc3 stroke=${INK} stroke-width=12 />`);
      hop(h, 16); const nt = note("ペットボトルのキャップ", "left:520px;top:258px;font-size:20px"); pop(nt); await wait(700);
      const dome = add(`<div></div>`, "left:704px;top:236px;width:256px;height:300px;border-radius:50% 50% 0 0/62% 62% 0 0;background:radial-gradient(ellipse at 50% 90%,#6fd0ff11 30%,#6fd0ff66 75%,#bfeaffaa 98%);border:4px solid #c8f0ff;border-bottom:0;box-shadow:0 0 22px #6fd0ff;z-index:12;transform-origin:50% 22%");
      await anim(dome, [{ transform: "scale(0)", opacity: 0 }, { transform: "scale(1.06)", opacity: 1, offset: .7 }, { transform: "none", opacity: 1 }], 380);
      nt.remove(); say("シールド展開!", 520, 250, { size: 44, color: "#8fe0ff", ms: 900 }); await wait(1000); warn.remove();
      await anim(orb, [{ transform: "scale(.7)" }, { transform: "scale(10)" }], 380, { easing: "ease-in" });
      const fl = layer("z-index:40;background:#fff"); orb.remove(); red.remove(); g.style.filter = "grayscale(1) brightness(.5)";
      anim(g, [-16, 14, -10, 8, -4, 0].map(x => ({ transform: `translate(${x}px,${-x / 2}px)` })), 500, { easing: "linear" });
      await anim(fl, [{ opacity: 1 }, { opacity: 1, offset: .3 }, { opacity: 0 }], 700); fl.remove();
      for (let i = 0; i < 8; i++) puff(rnd(80, 640), rnd(200, 480), "#9a9a9a99", rnd(-40, 40), -90);
      const dead = add(`<div><div class=t style="left:0;right:0;top:0;text-align:center;font-size:84px;color:#d8d8d8">デス</div><div style="left:0;right:0;top:100px;text-align:center;font-size:24px;color:#ccc">リスポーンまで 10</div></div>`, "left:180px;top:120px;width:400px;height:140px;z-index:30"); pop(dead, 260);
      await wait(700); ov(h, smugFace); for (let i = 0; i < 4; i++) flash(720, 940, 280, 480, "#cff4ff");
      await wait(300); bubble("ハムは無事です", 520, 330, 2000); await wait(2300);
    },

    async wheel() { // ウルト発電
      const g = gameBg(), h = ham(N); await wait(700); chip("ウルトがたまるまで");
      const T = Array.from({ length: 40 }, (_, i) => { const a = i / 40 * 6.283; return `<path d="M${(Math.sin(a) * 20).toFixed(1)} ${(-Math.cos(a) * 20).toFixed(1)}L${(Math.sin(a) * 27).toFixed(1)} ${(-Math.cos(a) * 27).toFixed(1)}" stroke-width=3 />`; }).join("");
      const gz = add(`<svg viewBox="-40 -40 80 80" style="overflow:visible"><circle r=34 fill=#2c2848 /><circle r=17 fill=none stroke=#ffffff40 stroke-width=1.5 /><g>${T}</g><text y=6 text-anchor=middle font-size=17 font-weight=900 font-style=italic fill=#fff>39<tspan font-size=9>%</tspan></text></svg>`, "left:441px;top:426px;width:80px;height:80px;z-index:7");
      const ticks = [...gz.querySelectorAll("g path")], num = gz.querySelector("text").firstChild;
      const setU = p => { ticks.forEach((t, i) => t.setAttribute("stroke", i < Math.round(p * .4) ? "#ffd23c" : "#8a8aa0")); num.nodeValue = p; }; setU(39);
      const rung = Array.from({ length: 28 }, (_, i) => { const a = i / 28 * 6.283; return `<path d="M${(Math.cos(a) * 112).toFixed(1)} ${(Math.sin(a) * 112).toFixed(1)}L${(Math.cos(a) * 130).toFixed(1)} ${(Math.sin(a) * 130).toFixed(1)}" />`; }).join("");
      const wl = add(`<svg viewBox="-150 -150 300 300" style="overflow:visible"><path d="M0 0L-70 142M0 0L70 142" stroke=#7d8794 stroke-width=12 stroke-linecap=round /><g style="transform-box:fill-box;transform-origin:center" stroke=#c9d1db stroke-width=5 fill=none><circle r=112 /><circle r=130 />${rung}<path d="M0 -112V112M-97 -56L97 56M-97 56L97 -56" stroke=#9aa4b0 stroke-width=6 /></g><circle r=14 fill=#7d8794 stroke=${INK} stroke-width=4 /></svg>`,
        "left:695px;top:262px;width:270px;height:270px;z-index:9");
      anim(wl, [{ opacity: 0, transform: "scale(.5)" }, { opacity: 1, transform: "none" }], 300);
      const cable = add(`<svg viewBox="0 0 960 540" style="left:0;top:0;width:960px;height:540px;overflow:visible"><path d="M768 512Q640 545 516 478" fill=none stroke=#222 stroke-width=7 /><path d="M768 512Q640 545 516 478" fill=none stroke=#ffd23c stroke-width=3 stroke-dasharray="10 12" /></svg>`, "z-index:8");
      const flow = cable.lastChild.animate([{ strokeDashoffset: 0 }, { strokeDashoffset: 44 }], { duration: 500, iterations: Infinity });
      const IN = "translate(-2px,-36px) scale(.62)";
      await anim(h, [{ transform: "none" }, { transform: "translate(-20px,-120px) scale(.8)", offset: .5 }, { transform: IN }], 500);
      const run = h.animate([{ transform: IN }, { transform: "translate(-2px,-46px) scale(.62)" }], { duration: 160, iterations: Infinity, direction: "alternate" });
      const spin = wl.querySelector("g").animate([{ transform: "rotate(0)" }, { transform: "rotate(360deg)" }], { duration: 1600, iterations: Infinity });
      const feet = feetBlur(h, 140); say("ウルト発電!", 520, 250, { size: 48, color: "#ffe066", ms: 1000 }); await wait(500);
      let face;
      for (let p = 40; p <= 100; p++) { setU(p); const r = 1 + (p - 40) / 12; spin.playbackRate = r; flow.playbackRate = r; run.playbackRate = Math.min(2.6, 1 + (p - 40) / 25);
        if (p === 62) { face = ov(h, redFace + strainEyes + sweat); say("ゼェ…ゼェ…", 600, 300, { size: 34, color: "#fff", ms: 1100 }); }
        if (p >= 60 && p % 3 === 0) { const d = add(`<div></div>`, `left:${rnd(780, 880)}px;top:${rnd(360, 400)}px;width:12px;height:16px;border-radius:50% 50% 50% 50%/30% 30% 70% 70%;background:#7cc4ff;border:2px solid ${INK};z-index:12`);
          anim(d, [{ transform: "none" }, { transform: `translate(${rnd(-90, 90)}px,${rnd(-80, -30)}px)`, offset: .5 }, { transform: `translate(${rnd(-120, 120)}px,40px)`, opacity: 0 }], 600).then(() => d.remove()); }
        if (p >= 76 && p % 2 === 0) puff(rnd(730, 910), rnd(280, 330), "#bbbbbbcc", rnd(-20, 20), -90);
        if (p === 86) say("煙出てる!!", 560, 200, { size: 40, color: "#fff", ms: 900 });
        await wait(p < 70 ? 75 : 55); }
      gz.style.filter = "drop-shadow(0 0 8px #ffd23c)"; say("ウルト準備完了!", 420, 230, { size: 60, ms: 900 }); await wait(800);
      chip("デス"); g.style.filter = "grayscale(1) brightness(.55)"; gz.style.filter = "grayscale(1)"; setU(0); flow.cancel(); say("0%", 477, 400, { size: 56, color: "#ff6a5a", ms: 1300 });
      run.cancel(); feet.remove(); face.remove();
      for (let k = 0; k < 8; k++) { spin.playbackRate *= .6; await wait(70); } spin.pause();
      h.style.transition = "filter .6s"; h.style.filter = "grayscale(1) brightness(2.3) contrast(.55)"; await wait(700);
      await anim(h, [{ transform: IN }, { transform: "translate(62px,-104px) scale(.62) rotate(-80deg)" }], 500, { easing: "ease-in" }); say("パタッ", 700, 330, { size: 30, color: "#fff", ms: 700 });
      for (let i = 0; i < 6; i++) puff(rnd(760, 900), rnd(400, 460), "#ffffffcc", rnd(-20, 20), -90);
      await wait(400); say("真っ白に燃え尽きた…", 440, 250, { size: 42, color: "#eee", ms: 1700 }); await wait(2000);
    },
  });
}

{ // 配信ハム PoC 第4弾 (d2): roles / laser / bow / lowres / delivery / spray / traitor / clutch
const d2Tf = e => { const t = getComputedStyle(e).transform; return t && t !== "none" ? new DOMMatrix(t) : new DOMMatrix(); }; // 今の transform を読む
const d2Feed = () => { let n = 0; return (t, col = "#ff4a3a") => { const e = label(t, `right:16px;top:${16 + n++ * 44}px;border-left:6px solid ${col};font-size:20px`); pop(e); return e; }; }; // 右上のキルログ
const d2Dead = () => { const v = layer("z-index:9;background:radial-gradient(ellipse at 50% 50%,#0000 30%,#a0000099 100%);backdrop-filter:grayscale(1) brightness(.75)"); anim(v, [{ opacity: 0 }, { opacity: 1 }], 250); return v; }; // デス画面 (ハムより下)
const d2Poof = () => { for (let i = 0; i < 10; i++) { const c = add(`<div></div>`, `left:${HX + rnd(-10, HW - 60)}px;top:${HY + rnd(20, HH - 90)}px;width:76px;height:76px;border-radius:50%;background:#fff;z-index:12`);
  anim(c, [{ transform: "scale(.3)", opacity: .95 }, { transform: `translate(${rnd(-50, 50)}px,${rnd(-60, 10)}px) scale(1.5)`, opacity: 0 }], 600).then(() => c.remove()); } };
const d2Flag = (h, col, txt) => add(`<div><div style="left:-4px;top:-118px;width:8px;height:124px;background:#c8a46a;border:2px solid ${INK}"></div><div style="left:-80px;top:-118px;width:78px;height:52px;background:${col};border:3px solid ${INK};color:#fff;font-size:32px;text-align:center;line-height:44px">${txt}</div><div style="left:-16px;top:-14px;width:32px;height:32px;border-radius:50%;background:#fbcbc3;border:4px solid ${INK}"></div></div>`, "left:30px;top:150px;width:0;height:0", h);
const d2Wave = e => e.animate([{ transform: "rotate(-28deg)" }, { transform: "rotate(12deg)" }], { duration: 260, iterations: Infinity, direction: "alternate", easing: "ease-in-out" });
const d2Seed = `<g transform="translate(500 640) scale(5)"><path d="M20 2C38 24 36 54 20 58C4 54 2 24 20 2Z" fill=#3a3030 stroke=#fff stroke-width=3 /><path d="M14 16L12 50M26 16L28 50" stroke=#eee stroke-width=3 /></g>`;
const d2Band = (col, txt) => `<path d="M1075 335q110-60 160-150M1075 355q150 0 200-60" fill=none stroke=${INK} stroke-width=58 stroke-linecap=round /><path d="M1075 335q110-60 160-150M1075 355q150 0 200-60" fill=none stroke=${col} stroke-width=38 stroke-linecap=round />
  <path d="M150 300Q600 200 1090 300L1085 395Q600 295 155 395Z" fill=${col} stroke=${INK} stroke-width=13 />${txt ? `<text x=620 y=352 text-anchor=middle font-size=82 font-weight=900 fill=${col === "#fff" ? "#d3202a" : "#fff"}>${txt}</text>` : `<circle cx=620 cy=322 r=40 fill=#e22 />`}`;

Object.assign(scenes, {
  async roles() { // ロール着せ替え
    const h = ham(N); let cur = null; await wait(700); chip("ロール選択画面");
    const R = [["タンク", "🛡️"], ["ダメージ", "⚔️"], ["サポート", `<span style="position:static;color:#ff4a4a">✚</span>`], ["ハム", `<img src="${N}" style="left:33px;top:4px;width:54px;height:56px">`]];
    const cards = R.map(([t, ic], i) => add(`<div><div style="left:0;right:0;top:8px;height:62px;text-align:center;font-size:46px;line-height:62px">${ic}</div><div style="left:0;right:0;bottom:12px;text-align:center;font-size:24px">${t}</div></div>`,
      `left:${95 + i * 150}px;top:110px;width:126px;height:126px;background:#18213cdd;border:4px solid #8fa3c8;border-radius:14px;z-index:15;filter:brightness(.5);transition:all .15s`));
    cards[3].style.display = "none"; for (const c of cards.slice(0, 3)) { pop(c); await wait(90); }
    const on = i => cards.forEach((c, j) => Object.assign(c.style, j === i ? { filter: "none", borderColor: "#ffd23c", transform: "scale(1.12)", boxShadow: "0 0 22px #ffd23c" } : { filter: "brightness(.5)", borderColor: "#8fa3c8", transform: "none", boxShadow: "none" }));
    const change = async svg => { d2Poof(); wait(210).then(() => { if (cur) cur.remove(); cur = svg ? ov(h, svg) : null; });
      await anim(h, [{ transform: "perspective(900px) rotateY(0)" }, { transform: "perspective(900px) rotateY(720deg)" }], 420, { easing: "linear" }); };
    const squirt = () => { const [x, y] = P(-150, 880); for (let i = 0; i < 8; i++) { const d = add(`<div></div>`, `left:${x}px;top:${y}px;width:12px;height:12px;border-radius:50%;background:#7fd3ff;border:2px solid #fff;z-index:12`);
      anim(d, [{ transform: "none", opacity: 1 }, { transform: `translate(${-rnd(120, 230)}px,${rnd(-40, 30)}px)`, opacity: 0 }], 420, { delay: i * 40, easing: "linear", fill: "both" }).then(() => d.remove()); } };
    const looks = [
      [`<rect x=250 y=-40 width=740 height=300 rx=30 fill=#9aa3ad stroke=${INK} stroke-width=15 /><rect x=150 y=40 width=120 height=54 rx=22 fill=#6b737c stroke=${INK} stroke-width=12 /><rect x=970 y=40 width=120 height=54 rx=22 fill=#6b737c stroke=${INK} stroke-width=12 /><rect x=215 y=228 width=810 height=54 rx=24 fill=#b9c2ca stroke=${INK} stroke-width=14 /><path d="M310 20H930" stroke=#d6dde3 stroke-width=20 stroke-linecap=round />
        <circle cx=330 cy=930 r=300 fill=#a7b0ba stroke=${INK} stroke-width=16 /><circle cx=330 cy=930 r=225 fill=none stroke=#8a939c stroke-width=14 /><circle cx=330 cy=930 r=62 fill=#6b737c stroke=${INK} stroke-width=12 /><path d="M180 790Q240 740 320 735" fill=none stroke=#dfe5ea stroke-width=18 stroke-linecap=round />`, "守る!"],
      [d2Band("#fff", "") + `<g transform="rotate(-8 300 900)"><rect x=180 y=700 width=230 height=140 rx=40 fill=#7fd3ff stroke=${INK} stroke-width=12 /><path d="M225 755q60 30 140 0" fill=none stroke=#fff stroke-width=14 /><rect x=430 y=920 width=110 height=210 rx=30 fill=#ff8a1f stroke=${INK} stroke-width=14 transform="rotate(14 485 1000)" />
        <rect x=60 y=820 width=520 height=130 rx=50 fill=#ff8a1f stroke=${INK} stroke-width=14 /><rect x=-130 y=855 width=210 height=56 rx=20 fill=#2fa8ff stroke=${INK} stroke-width=12 /></g><circle cx=520 cy=960 r=62 fill=#fbcbc3 stroke=${INK} stroke-width=14 />`, "撃つ!"],
      [`<path d="M380 250L420 70Q600 20 780 70L820 250Q600 200 380 250Z" fill=#fff stroke=${INK} stroke-width=14 /><path d="M575 92H625V128H660V178H625V214H575V178H540V128H575Z" fill=#e33 />
        <rect x=545 y=770 width=150 height=90 rx=26 fill=none stroke=${INK} stroke-width=20 /><rect x=380 y=830 width=480 height=300 rx=30 fill=#fff stroke=${INK} stroke-width=14 /><path d="M590 890H650V950H710V1010H650V1070H590V1010H530V950H590Z" fill=#e33 />`, "治す!"]];
    for (let i = 0; i < 3; i++) { on(i); await wait(450); await change(looks[i][0]); if (i === 1) squirt();
      bubble(looks[i][1], 640, 252, 1050); await wait(1250); }
    chip("…4つ目のロール?"); cards[3].style.display = ""; pop(cards[3]); await wait(500); on(3); await change(null); await wait(250);
    const eat = ov(h, openMouth + d2Seed + `<circle cx=480 cy=830 r=72 fill=#fbcbc3 stroke=${INK} stroke-width=14 /><circle cx=720 cy=830 r=72 fill=#fbcbc3 stroke=${INK} stroke-width=14 />`);
    for (let i = 0; i < 3; i++) { if (i !== 1) say("カリカリ", 640, 280, { size: 36, color: "#fff", ms: 500 }); await anim(h, [{ transform: "none" }, { transform: "scale(1.06,.94)" }, { transform: "none" }], 240, { easing: "linear" }); await wait(200); }
    eat.remove(); cards.forEach(c => Object.assign(c.style, { filter: "none", borderColor: "#ffd23c", boxShadow: "0 0 22px #ffd23c" }));
    say("全ロール対応", 400, 330, { size: 68, ms: 1700 }); hop(h, 30); await wait(2100);
  },

  async laser() { // 赤い点
    const h = ham(N), G = [586, 236], aim = P(600, 330); await wait(700); chip("敵のスナイパーに狙われる");
    const gl = add(`<div>✦</div>`, `left:${G[0]}px;top:${G[1]}px;translate:-50% -50%;font-size:30px;line-height:1;color:#fff;text-shadow:0 0 10px #f33,0 0 20px #f33;z-index:9`);
    gl.animate([{ transform: "scale(1.2)", opacity: 1 }, { transform: "scale(.5)", opacity: .5 }], { duration: 300, iterations: Infinity, direction: "alternate" });
    const sv = add(`<svg viewBox="0 0 960 540" style="left:0;top:0;width:960px;height:540px;overflow:visible"><line x1=${G[0]} y1=${G[1]} x2=${G[0]} y2=${G[1]} stroke=#ff3030 stroke-width=1.6 opacity=.75 /><circle r=16 fill=#ff202055 /><circle r=7 fill=#ff2a2a stroke=#fff9 stroke-width=1.5 /></svg>`, "z-index:20");
    const [ln, c1, c2] = sv.children; let x = G[0], y = G[1], tx = x, ty = y, k = .14, onHam = true, run = true;
    const tick = now => { if (!run) return; if (onHam) { tx = aim[0] + d2Tf(h).m41; ty = aim[1]; }
      x += (tx - x) * k; y += (ty - y) * k; const w = onHam ? 0 : 5, px = x + Math.sin(now / 90) * w, py = y + Math.cos(now / 130) * w;
      ln.setAttribute("x2", px); ln.setAttribute("y2", py); for (const c of [c1, c2]) { c.setAttribute("cx", px); c.setAttribute("cy", py); } requestAnimationFrame(tick); };
    requestAnimationFrame(tick);
    await wait(1000); const sw = ov(h, `<path d="M1030 280q-34 56 0 78q34-22 0-78" fill=#7cc4ff stroke=${INK} stroke-width=9 />`); say("!?", 640, 270, { size: 64, color: "#ff5a4a", ms: 600 }); await wait(700);
    for (const [a, b] of [[0, -150], [-150, -20], [-20, -250], [-250, -70], [-70, 0]]) { await anim(h, [{ transform: `translateX(${a}px)` }, { transform: `translateX(${b}px)` }], 170); await wait(280); }
    bubble("ついてくる!?", 625, 395, 1000); await wait(1100); chip("丸まって回避"); sw.remove();
    const pt = (i, r) => { const a = i / 22 * 6.2832; return `${(Math.cos(a) * r).toFixed(1)} ${(Math.sin(a) * r).toFixed(1)}`; }, fur = `M${pt(0, 90)}` + Array.from({ length: 22 }, (_, i) => `Q${pt(i + .5, 108)} ${pt(i + 1, 90)}`).join("") + "Z";
    const ball = add(`<svg viewBox="-110 -110 220 220" style="overflow:visible"><defs><linearGradient id=d2fur x2=0 y2=1><stop offset=.55 stop-color=#aaa1a0 /><stop offset=.55 stop-color=#fbf5e9 /></linearGradient></defs><path d="${fur}" fill=url(#d2fur) stroke=${INK} stroke-width=6 stroke-linejoin=round /><ellipse cx=-48 cy=-76 rx=20 ry=15 fill=#f4b3b5 stroke=${INK} stroke-width=5 /><path d="M28 22q14 10 28 0" fill=none stroke=${INK} stroke-width=5 stroke-linecap=round /><circle cx=70 cy=36 r=7 fill=#f49aa0 /></svg>`,
      `left:${HX + HW / 2 - 80}px;top:${534 - 160}px;width:160px;height:160px;z-index:11`);
    anim(h, [{ transform: "none", opacity: 1 }, { transform: "scale(.4)", opacity: 0 }], 200); pop(ball, 260); say("まるっ", 700, 340, { size: 40, color: "#fff", ms: 700 });
    onHam = false; k = .045; await wait(400);
    for (const [a, b, ms] of [[760, 330, 550], [640, 190, 650], [700, 380, 550], [540, 230, 650], [480, 291, 1000]]) { tx = a; ty = b; await wait(ms); }
    run = false; sv.remove(); gl.remove(); fade(layer("background:#fff;z-index:24"), 250);
    chip("デス"); say("ヘッドショット", 480, 180, { size: 60, color: "#ff4a3a", ms: 1100 }); const v = d2Dead(), fd = d2Feed()("敵スナイパー 🎯 健");
    await wait(500); const ds = say("デス", 480, 300, { size: 100, color: "#ff3a2a", ms: 0 }); await wait(1100);
    ball.remove(); anim(h, [{ transform: "scale(.4)", opacity: 0 }, { transform: "none", opacity: 1 }], 220); await wait(250); hop(h, 24);
    bubble("…ドンマイ", 660, 250, 1500); await wait(1600); fade(v, 300); fade(ds, 300); fade(fd, 300); await wait(500);
  },

  async bow() { // お辞儀合戦
    const pit = layer("z-index:10;height:534px;overflow:hidden"), h = ham(N); pit.append(h); h.style.transformOrigin = "20% 100%";
    await wait(700); chip("試合終了「GG」"); say("GG", 480, 160, { size: 110, color: "#fff", ms: 1000 });
    const r = add(`<div><img src="${N}" style="width:100%;height:100%"></div>`, `left:16px;top:${HY}px;width:${HW}px;height:${HH}px;transform-origin:80% 100%;filter:contrast(1.4) brightness(.7) sepia(1) saturate(8) hue-rotate(-45deg)`, pit);
    await walk(r, -260, 0, 700, 4); const tag = label("赤チーム", "left:72px;top:198px");
    bubble("GG", 128, 250, 900); await wait(350); bubble("GG", 832, 250, 900); await wait(1100); tag.remove(); chip("お辞儀合戦");
    const deg = [128, 832].map(x => add(`<div class=t>0°</div>`, `left:${x}px;top:222px;translate:-50% -50%;font-size:50px;color:#fff;z-index:30;opacity:0`));
    const S = [[0, 0], [0, 0]], tf = (i, [a, ty]) => `translateY(${ty}px) rotate(${(i ? -1 : 1) * a}deg)`;
    const bowTo = (i, a, ty = 0, ms = 320, ez = "cubic-bezier(.3,1.5,.5,1)") => { const e = i ? h : r, from = S[i]; S[i] = [a, ty]; deg[i].textContent = `${a}°`; pop(deg[i], 200);
      return anim(e, [{ transform: tf(i, from) }, { transform: tf(i, S[i]) }], ms, { easing: ez }); };
    await bowTo(1, 15); await wait(700); await bowTo(0, 45); await wait(700); await bowTo(1, 90, 0, 380); await wait(800);
    const dig = cx => { for (let j = 0; j < 10; j++) crumb(cx + rnd(-90, 90), 528); say("ズボッ", cx, 400, { size: 44, color: "#fff", ms: 700 }); };
    const hole = cx => add(`<svg viewBox="0 0 280 40" style="overflow:visible"><ellipse cx=140 cy=20 rx=128 ry=11 fill=#1a1210 /><path d="M14 20L-14 8L-30 16M266 20L292 6L306 14M60 12L48 0M220 12L236 -2" fill=none stroke=#1a1210 stroke-width=4 stroke-linecap=round /></svg>`, `left:${cx - 140}px;top:514px;width:280px;height:40px;z-index:11`);
    chip("さらに深く"); dig(262); hole(262); await bowTo(0, 180, -100, 650, "ease-in"); await wait(600);
    dig(697); hole(697); await bowTo(1, 180, -100, 650, "ease-in"); await wait(300);
    for (const e of [h, r]) { ov(e, `<ellipse cx=618 cy=1268 rx=48 ry=60 fill=#f4b3b5 stroke=${INK} stroke-width=12 />`);
      for (const c of e.children) { c.style.transformOrigin = "50% 0"; c.animate([{ transform: "rotate(-4deg)" }, { transform: "rotate(4deg)" }], { duration: 180, iterations: Infinity, direction: "alternate" }); } }
    say("ありがとうございました", 480, 300, { size: 52, color: "#fff", ms: 0 }); await wait(2300);
  },

  async lowres() { // 低画質モード
    const h = ham(N), pg = label("Ping 30ms", "right:16px;top:16px;font-size:30px;color:#7dff8a"), q = label("ハム画質 1080p", "right:16px;top:70px;font-size:20px");
    await h.img.decode().catch(() => {}); await wait(700); chip("回線が重くなる");
    const cv = add(`<canvas width=224 height=230></canvas>`, "left:0;top:0;width:100%;height:100%;visibility:hidden", h), g = cv.getContext("2d");
    const pix = n => { g.clearRect(0, 0, 224, 230); g.imageSmoothingEnabled = false;
      if (n === 1) { g.fillStyle = "#8e8a89"; g.fillRect(0, 0, 224, 230); }
      else { const t = document.createElement("canvas"); t.width = n; t.height = Math.round(n * 1271 / 1237); const tc = t.getContext("2d"); for (let j = 0; j < (n < 10 ? 4 : 2); j++) tc.drawImage(h.img, 0, 0, t.width, t.height); g.drawImage(t, 0, 0, 224, 230); }
      cv.style.visibility = "visible"; h.img.style.visibility = "hidden"; };
    for (const [ms, col, n] of [[80, "#d8ff6a", 40], [200, "#ffd23c", 16], [500, "#ff9a3c", 4], [999, "#ff4a3a", 1]]) {
      await wait(1100); pg.textContent = `Ping ${ms}ms`; pg.style.color = col; q.textContent = `ハム画質 ${n}p`; pop(pg, 200);
      await anim(h, [{ opacity: 1 }, { opacity: .15 }, { opacity: 1 }, { opacity: .3 }, { opacity: 1 }], 280, { easing: "steps(4)" }); pix(n); shake(h); }
    await wait(600); bubble("…キュ", 650, 300, 1600); await wait(1800);
    chip("回線復旧"); pg.textContent = "Ping 5ms"; pg.style.color = "#7dff8a"; q.textContent = "ハム画質 4K"; pop(pg, 200);
    fade(layer("background:#fff;z-index:24"), 350); cv.remove(); h.img.style.visibility = ""; h.img.style.filter = "contrast(1.2) saturate(1.5) drop-shadow(0 0 6px #fff) drop-shadow(0 0 14px #ffe680)";
    ov(h, `<circle cx=345 cy=448 r=30 fill=#fff /><circle cx=793 cy=448 r=30 fill=#fff /><circle cx=410 cy=528 r=14 fill=#fff /><circle cx=858 cy=528 r=14 fill=#fff />`); hop(h, 50);
    const tw = setInterval(() => flash(HX - 20, HX + HW - 20, HY - 20, HY + HH - 40, "#fff6c0"), 110);
    const badge = add(`<div>4K</div>`, `left:${HX - 76}px;top:${HY + 6}px;padding:0 12px;background:linear-gradient(#fff3b0,#e0a800);color:#5a3a00;border:3px solid #fff;border-radius:8px;font-size:34px;z-index:16`); pop(badge);
    say("4K ハム", 450, 230, { size: 76, ms: 1800 }); await wait(2000); clearInterval(tw); await wait(900);
  },

  async delivery() { // 出前
    const h = ham(N), feed = d2Feed(); await wait(700); chip("チャット「!出前」");
    const grp = add(`<div></div>`, "left:400px;top:344px;width:300px;height:190px;z-index:12");
    const box = add(`<div><div style="left:4px;top:-30px;width:70px;height:30px;border:7px solid #8a939c;border-bottom:none;border-radius:16px 16px 0 0"></div></div>`, `left:-26px;top:-4px;width:84px;height:84px;background:#555;border:4px solid ${INK};border-radius:6px;overflow:visible`, grp);
    const door = add(`<div><div style="left:30px;top:3px;writing-mode:vertical-rl;font-size:17px;line-height:1;color:#c62828">ハム軒</div></div>`, `left:-4px;top:-4px;width:84px;height:84px;background:linear-gradient(90deg,#9aa3ad,#eef2f5 45%,#aab3bc);border:4px solid ${INK};border-radius:6px`, box);
    const rider = add(`<div><img src="${N}" style="width:100%;height:100%"></div>`, "left:62px;top:-36px;width:116px;height:119px", grp);
    ov(rider, `<path d="M200 345Q200 0 618 -10Q1037 0 1037 345Z" fill=#fff stroke=${INK} stroke-width=26 /><path d="M560 0Q618 -14 676 0L668 330H568Z" fill=#e33 /><path d="M190 330H1047" stroke=${INK} stroke-width=60 stroke-linecap=round /><path d="M190 330H1047" stroke=#e33 stroke-width=34 stroke-linecap=round />`);
    const wheel = cx => `<g class=d2w style="transform-box:fill-box;transform-origin:center"><circle cx=${cx} cy=152 r=32 fill=#222 stroke=${INK} stroke-width=5 /><circle cx=${cx} cy=152 r=13 fill=#bbb /><path d="M${cx} 126V178M${cx - 26} 152H${cx + 26}" stroke=#888 stroke-width=4 /></g>`;
    add(`<svg viewBox="0 0 300 190" style="left:0;top:0;width:300px;height:190px;overflow:visible"><rect x=-30 y=78 width=100 height=8 fill=#777 stroke=${INK} stroke-width=3 />${wheel(64)}${wheel(262)}<path d="M244 60L262 150" stroke=#666 stroke-width=9 stroke-linecap=round />
      <path d="M14 120Q14 86 64 82H176Q190 84 194 100L204 130H30Q14 130 14 120Z" fill=#e8463c stroke=${INK} stroke-width=5 /><rect x=150 y=124 width=80 height=14 rx=5 fill=#555 stroke=${INK} stroke-width=4 /><path d="M204 138L236 46H254L230 142Z" fill=#e8463c stroke=${INK} stroke-width=5 />
      <rect x=70 y=70 width=104 height=18 rx=9 fill=#333 stroke=${INK} stroke-width=4 /><path d="M220 40H268" stroke=#333 stroke-width=9 stroke-linecap=round /><circle cx=262 cy=60 r=11 fill=#ffe680 stroke=${INK} stroke-width=4 /><path d="M40 108H120" stroke=#fff stroke-width=5 /></svg>`, "", grp);
    const spins = [...grp.querySelectorAll(".d2w")].map(w => w.animate([{ transform: "rotate(0)" }, { transform: "rotate(360deg)" }], { duration: 300, iterations: Infinity }));
    say("ブロロロ…", 260, 300, { size: 40, color: "#fff", ms: 900 });
    await anim(grp, [{ transform: "translateX(-760px)" }, { transform: "translateX(14px)", offset: .85 }, { transform: "none" }], 1200, { easing: "ease-out" });
    spins.forEach(a => a.cancel()); say("キキッ", 600, 360, { size: 34, color: "#fff", ms: 500 }); hop(rider, 14); bubble("まいど〜!", 520, 252, 1100); await wait(1200);
    await anim(door, [{ transform: "none" }, { transform: "translateY(-62px)" }], 220);
    const bowl = add(`<div><svg viewBox="0 0 110 80" style="left:0;top:0;width:110px;height:80px;overflow:visible"><path d="M3 22Q8 70 55 76Q102 70 107 22Z" fill=#c62828 stroke=${INK} stroke-width=4 /><path d="M18 46H92" stroke=#fff stroke-width=3 stroke-dasharray="6 5" />
      <ellipse cx=55 cy=22 rx=52 ry=13 fill=#7a4a28 stroke=${INK} stroke-width=4 /><g><ellipse cx=55 cy=22 rx=46 ry=10 fill=#f3d27a /><path d="M18 22q6-7 12 0t12 0t12 0" stroke=#d9a400 fill=none stroke-width=2.5 /><circle cx=38 cy=19 r=8 fill=#fff stroke=#e88 stroke-width=3 /><rect x=58 y=13 width=28 height=12 rx=4 fill=#a0522d stroke=${INK} stroke-width=2 /></g></svg></div>`,
      `left:${HX + HW / 2 - 55}px;top:454px;width:110px;height:80px;z-index:13`), soup = bowl.querySelector("g");
    await anim(bowl, [{ transform: "translate(-416px,-80px) scale(.6)" }, { transform: "translate(-200px,-190px) scale(.85)" }, { transform: "none" }], 650, { easing: "ease-in-out" });
    door.animate([{ transform: "translateY(-62px)" }, { transform: "none" }], { duration: 200, fill: "forwards" });
    const nd = "M575 650q-22 45 0 90t0 90t0 90M625 650q22 45 0 90t0 90t0 90";
    const eat = ov(h, openMouth + `<path d="${nd}" fill=none stroke=${INK} stroke-width=28 stroke-linecap=round /><path d="${nd}" fill=none stroke=#f6d77a stroke-width=15 stroke-linecap=round stroke-dasharray="30 12" />`);
    eat.lastChild.animate([{ strokeDashoffset: 0 }, { strokeDashoffset: 84 }], { duration: 350, iterations: Infinity });
    const steam = [800, 832, 864].map((sx, i) => { const e = add(`<svg viewBox="0 0 20 60" style="overflow:visible"><path d="M10 58q-10-10 0-20t0-20t0-18" fill=none stroke=#fff stroke-width=4 stroke-linecap=round /></svg>`, `left:${sx - 10}px;top:392px;width:20px;height:60px;z-index:14;opacity:0`);
      e.animate([{ transform: "translateY(20px)", opacity: 0 }, { transform: "none", opacity: .85, offset: .4 }, { transform: "translateY(-40px)", opacity: 0 }], { duration: 1400, delay: i * 400, iterations: Infinity }); return e; });
    let v;
    for (let i = 0; i < 4; i++) { say("ズルズル", i % 2 ? 660 : 630, i % 2 ? 300 : 272, { size: 38, color: "#fff", ms: 700 });
      anim(h, [{ transform: "none" }, { transform: "scale(1.04,.96)" }, { transform: "none" }, { transform: "scale(1.04,.96)" }, { transform: "none" }], 700, { easing: "linear" });
      if (i === 1) { chip("その頃 配信者は…"); v = d2Dead(); feed("敵 🎯 健"); say("デス", 280, 200, { size: 96, color: "#ff3a2a", ms: 1600 }); }
      await wait(900); }
    eat.remove(); steam.forEach(e => e.remove()); soup.remove(); fade(v, 400); hop(h, 20); bubble("ごちそうさま", 640, 250, 1000); await wait(1100);
    const slip = note(`伝票　ハム軒<br><span style="position:static;font-weight:normal">ラーメン　¥850</span><br><span style="position:static;color:#c11;font-size:36px">お会計: 配信者</span>`, "left:150px;top:96px;font-size:24px;line-height:1.45;rotate:-4deg;z-index:25");
    await anim(slip, [{ transform: "translate(330px,200px) scale(.2) rotate(30deg)", opacity: 0 }, { transform: "none", opacity: 1 }], 380); chip("お会計"); await wait(1400);
    bubble("まいど〜!", 520, 252, 900); await wait(300); spins.forEach(a => a.play());
    await anim(grp, [{ transform: "none" }, { transform: "translateX(-760px)" }], 800, { easing: "ease-in" }); await wait(900);
  },

  async spray() { // スプレー落書き
    const h = ham(N), cols = ["#ff5fa8", "#43c6e8", "#ffd23c", "#7be06a", "#b48bff", "#ff8a3c"], NZ = P(1065, 300); let n = 0;
    const can = ov(h, `<g transform="rotate(-14 1065 560)"><rect x=990 y=400 width=150 height=320 rx=34 fill=#e8463c stroke=${INK} stroke-width=14 /><path d="M1004 500H1126" stroke=#fff stroke-width=20 /><rect x=1022 y=340 width=86 height=66 rx=8 fill=#cfd6dd stroke=${INK} stroke-width=12 /><rect x=1045 y=300 width=40 height=44 rx=6 fill=#333 /></g><circle cx=1030 cy=700 r=64 fill=#fbcbc3 stroke=${INK} stroke-width=14 />`);
    const cnt = label("落書き 0枚", "right:16px;top:16px");
    const sticker = (x, y, d, col) => { const e = add(`<div><img src="${N}" style="left:${d * .07}px;top:${d * .13}px;width:${d * .86}px;height:${d * .884}px"><div style="left:0;top:0;width:100%;height:100%;background:repeating-linear-gradient(${rnd(0, 180)}deg,#fff0 0 5px,#fff6 5px 7px,#fff0 7px 13px),radial-gradient(circle at ${rnd(25, 75)}% ${rnd(25, 75)}%,#fff0 38%,#fff7 39% 43%,#fff0 44%)"></div></div>`,
      `left:${x - d / 2}px;top:${y - d / 2}px;width:${d}px;height:${d}px;border-radius:50%;overflow:hidden;background:${col};box-shadow:0 0 0 3px #fff,0 0 ${d * .2}px ${d * .07}px ${col};rotate:${rnd(-25, 25)}deg;z-index:6`);
      anim(e, [{ transform: "scale(1.5)", opacity: 0, filter: "blur(8px)" }, { transform: "none", opacity: .88, filter: "blur(.5px)" }], 260); cnt.textContent = `落書き ${++n}枚`; return e; };
    const mist = (x, y, col) => { for (let i = 0; i < 7; i++) { const p = add(`<div></div>`, `left:${NZ[0]}px;top:${NZ[1]}px;width:8px;height:8px;border-radius:50%;background:${col};z-index:19`);
      anim(p, [{ transform: "none", opacity: 1 }, { transform: `translate(${x - NZ[0] + rnd(-20, 20)}px,${y - NZ[1] + rnd(-20, 20)}px) scale(2.5)`, opacity: 0 }], 260, { delay: i * 20, easing: "ease-in", fill: "both" }).then(() => p.remove()); } };
    const shakeCan = () => anim(can, [0, -14, 10, -14, 10, 0].map(d => ({ transform: `translateY(${d}px)` })), 300, { easing: "linear" });
    const waves = [["キル", [[236, 190, 112]]], ["キル ×2", [[868, 112, 94]]], ["キル ×3", [[420, 165, 74], [290, 330, 86]]], ["キル ×4", [[600, 120, 72], [90, 210, 86], [530, 330, 64], [680, 250, 66]]],
      ["チームキル!!", [[160, 430, 92], [470, 80, 62], [350, 455, 76], [60, 340, 74], [640, 420, 80], [760, 175, 62], [330, 72, 62], [905, 262, 56], [560, 490, 70], [430, 390, 62], [700, 70, 60], [130, 110, 68]]]];
    for (const [t, pts] of waves) { await wait(t === "キル" ? 700 : 750); chip(t); await shakeCan(); say("シュー", 650, 290, { size: 36, color: "#fff", ms: 500 });
      for (const [x, y, d] of pts) { const col = cols[n % cols.length]; mist(x, y, col); await wait(pts.length > 4 ? 70 : 220); sticker(x, y, d, col); } hop(h, 16); }
    await wait(900); chip("仕上げ"); bubble("最後はでっかく「健 参上」っと", 560, 236, 1500); await wait(1600);
    const gr = add(`<div>ハム参上${[0.12, 0.33, 0.55, 0.8].map((p, i) => `<div style="left:${p * 100}%;top:78%;width:9px;height:0;border-radius:5px;background:#ff3f9e" data-h=${26 + i * 11 % 30}></div>`).join("")}</div>`,
      "left:96px;top:186px;font-size:118px;line-height:1.1;color:#ff3f9e;-webkit-text-stroke:5px #ff3f9e;paint-order:stroke fill;filter:drop-shadow(3px 0 #fff) drop-shadow(-3px 0 #fff) drop-shadow(0 3px #fff) drop-shadow(0 -3px #fff) drop-shadow(0 0 12px #ff3f9e);rotate:-7deg;z-index:8;white-space:nowrap;letter-spacing:4px;clip-path:inset(0 100% 0 0)");
    shakeCan(); say("シューーーッ", 650, 290, { size: 36, color: "#fff", ms: 1200 });
    const run = anim(gr, [{ clipPath: "inset(0 100% 0 0)" }, { clipPath: "inset(0 0% 0 0)" }], 1300, { easing: "linear" });
    for (let i = 0; i < 5; i++) { mist(150 + i * 110, 250 - i * 12, "#ff3f9e"); await wait(260); } await run;
    gr.style.clipPath = "none"; for (const d of gr.children) anim(d, [{ height: "0px" }, { height: d.dataset.h + "px" }], 700, { easing: "ease-in" });
    await wait(500); bubble("…いつものクセで", 690, 250, 1600); await wait(1900);
  },

  async traitor() { // 寝返り
    const h = ham(N), feed = d2Feed(); let face;
    for (const [t, f] of [["デス (1回目)", frown], ["デス (2回目)", frown + tears]]) { await wait(900); chip(t); feed("敵 🎯 健"); shake(h); if (face) face.remove(); face = ov(h, f); }
    await wait(900); chip("3連続デス"); feed("敵 🎯 健"); shake(h); await wait(700);
    face.remove(); say("こっそり…", 620, 270, { size: 36, color: "#fff", ms: 800 });
    await anim(h, [{ transform: "none" }, { transform: "perspective(900px) rotateY(90deg)" }], 200, { easing: "linear" });
    ov(h, `<path d="M150 820L20 1010L120 1080L200 960Z" fill=#d3202a stroke=${INK} stroke-width=14 /><path d="M1087 820L1217 1010L1117 1080L1037 960Z" fill=#d3202a stroke=${INK} stroke-width=14 />
      <path d="M150 800Q330 720 540 750L560 1250H120Q60 1000 150 800Z" fill=#d3202a stroke=${INK} stroke-width=14 /><path d="M1087 800Q907 720 697 750L677 1250H1117Q1177 1000 1087 800Z" fill=#d3202a stroke=${INK} stroke-width=14 />
      <path d="M518 752L538 1250M719 752L699 1250" stroke=#fff stroke-width=40 /><path d="M130 1170H540M697 1170H1110" stroke=#fff stroke-width=22 />` + d2Band("#d3202a", "必勝"));
    await anim(h, [{ transform: "perspective(900px) rotateY(-90deg)" }, { transform: "none" }], 200, { easing: "linear" });
    const red = d2Flag(h, "#d3202a", "赤"); pop(red, 200); d2Wave(red); h.classList.add("bob");
    await wait(300); bubble("赤チーム最高〜!", 600, 236, 2000); await wait(1000);
    for (let i = 0; i < 4; i++) { const e = add(`<div class=t>♪</div>`, `left:${rnd(600, 700)}px;top:${rnd(300, 360)}px;font-size:36px;color:#ff7a7a;z-index:16`); anim(e, [{ transform: "none", opacity: 1 }, { transform: "translate(-30px,-80px)", opacity: 0 }], 900, { delay: i * 220, fill: "both" }).then(() => e.remove()); }
    await wait(1300); chip("キル!!"); feed("健 🎯 敵", "#4aa8ff"); h.classList.remove("bob"); say("シュバッ", 640, 300, { size: 44, color: "#fff", ms: 600 });
    await anim(red, [{ transform: "none" }, { transform: "translate(140px,-70px) rotate(30deg)" }], 110); red.getAnimations().forEach(a => a.cancel());
    h.prepend(red); Object.assign(red.style, { left: "160px", top: "100px", transform: "rotate(8deg)" });
    const blue = d2Flag(h, "#2f7fe0", "青"); pop(blue, 160); d2Wave(blue); ov(h, `<path d="M300 290q-34 56 0 78q34-22 0-78" fill=#7cc4ff stroke=${INK} stroke-width=9 />`);
    await wait(250); bubble("ずっと信じてた", 600, 236, 1800); await wait(2100);
  },

  async clutch() { // 息止めクラッチ
    const h = ham(N), feed = d2Feed(); await wait(700); chip("1対3のクラッチ");
    const vs = add(`<div class=t>1 vs 3</div>`, "left:480px;top:80px;translate:-50% -50%;font-size:60px;color:#fff;z-index:30"); pop(vs);
    const face = cr => `<defs><linearGradient id=d2g x2=0 y2=1><stop offset=.62 stop-color=#aaa1a0 /><stop offset=.62 stop-color=#fbf5e9 /></linearGradient></defs>` + MIDX.map(x => `<circle cx=${x} cy=488 r=91 fill=url(#d2g) />`).join("") +
      [250, 987].map(x => `<ellipse cx=${x} cy=745 rx=${cr} ry=${cr * .8} fill=#f6b3b3 stroke=${INK} stroke-width=12 />`).join("") +
      `<path d="M300 430L420 488L300 546M908 430L788 488L908 546" ${line} />` + hideMouth + `<path d="M555 655H645" ${line} />`;
    h.style.transition = "scale .4s cubic-bezier(.3,1.6,.5,1), filter .5s";
    await wait(500); bubble("すぅっ…", 640, 250, 800); h.style.scale = 1.06; await wait(900);
    let fc = ov(h, face(120)); h.style.scale = 1.1; h.style.filter = "contrast(1.4) brightness(.7) sepia(1) saturate(8) hue-rotate(-45deg)"; const lb = label("息止め中", `left:${HX - 150}px;top:${HY + 80}px`);
    say("んっ!", 640, 260, { size: 40, color: "#fff", ms: 600 }); await wait(1300);
    const stage = (i, cr, sc, fl, ft) => { chip(`${i}人倒した`); feed(`健 🎯 敵${i}`, "#4aa8ff"); vs.textContent = `1 vs ${3 - i}`; pop(vs, 200); say(`残り${3 - i}`, 480, 200, { size: 70, ms: 900 });
      fc.remove(); fc = ov(h, face(cr)); h.style.scale = sc; h.style.filter = fl; };
    stage(1, 180, 1.18, "contrast(1.3) brightness(.75) sepia(1) saturate(6) hue-rotate(235deg)"); await wait(1500);
    stage(2, 240, 1.26, "contrast(1.3) brightness(.75) sepia(1) saturate(6) hue-rotate(180deg)"); h.classList.add("trem"); await wait(1600);
    chip("クラッチ成功!!"); feed("健 🎯 敵3", "#4aa8ff"); h.classList.remove("trem"); lb.remove(); vs.remove(); fc.remove();
    h.style.transition = "none"; h.style.filter = ""; h.style.scale = ""; const m = ov(h, openMouth); say("プハーッ!!", 480, 200, { size: 100, ms: 1400 });
    const puff = setInterval(() => { const M = d2Tf(h), c = add(`<div></div>`, `left:${HX + HW / 2 + M.m41 - 18}px;top:${HY + HH / 2 + M.m42 - 18}px;width:36px;height:36px;border-radius:50%;background:#fffd;z-index:9`);
      anim(c, [{ transform: "scale(.5)", opacity: .9 }, { transform: "scale(1.6)", opacity: 0 }], 500).then(() => c.remove()); }, 50);
    const path = [[0, 0, 0, 1.26], [-140, -200, -50, 1.15], [-430, -250, 20, 1.05], [-660, -110, -70, 1], [-400, -10, 60, .95], [-560, -240, 170, .9], [-220, -260, 250, .9], [-330, -60, 320, .85], [-90, -170, 380, .9], [0, 0, 360, 1]];
    await anim(h, path.map(([x, y, r, k]) => ({ transform: `translate(${x}px,${y}px) rotate(${r}deg) scale(${k})` })), 2200, { easing: "linear" });
    clearInterval(puff); m.remove(); ov(h, closedEyes);
    await anim(h, [{ transform: "none" }, { transform: "scale(1.3,.5)" }], 140); say("ぺたん", 600, 470, { size: 40, color: "#fff", ms: 1200 }); await wait(1400);
  },
});
}

// 配信ハム PoC 第4弾 (d3)。poc.js / poc2.js / poc3.js の部品を使い、scenes に足す。
{
// 肉球 (前足)。paw3 はその場に置く用、cursor3 は transform で動かすカーソル用
const paw3 = (x, y, z = 26) => add(`<div>${[[-15, -27], [0, -32], [15, -27]].map(([a, b]) => `<div style="left:${a - 8}px;top:${b - 8}px;width:16px;height:16px;border-radius:50%;background:#fbcbc3;border:3px solid ${INK}"></div>`).join("")}<div style="left:-22px;top:-22px;width:44px;height:44px;border-radius:50%;background:#fbcbc3;border:4px solid ${INK}"></div></div>`, `left:${x}px;top:${y}px;width:0;height:0;z-index:${z}`);
const cursor3 = (x, y, z = 30) => { const e = paw3(0, 0, z); let px = x, py = y; const T = (a, b, k = 1) => ({ transform: `translate(${a}px,${b}px) scale(${k})` });
  e.style.transform = T(x, y).transform;
  e.go = async (nx, ny, ms = 380) => { await anim(e, [T(px, py), T(nx, ny)], ms, { easing: "ease-in-out" }); px = nx; py = ny; };
  e.tap = () => anim(e, [T(px, py), T(px, py, .75), T(px, py)], 220, { easing: "linear" });
  return e; };
const zz3 = (x, y, size = 30) => { const q = add(`<div class=t>Z</div>`, `left:${x}px;top:${y}px;font-size:${size}px;color:#cde;z-index:30`);
  anim(q, [{ transform: "none", opacity: 1 }, { transform: "translate(-40px,-80px)", opacity: 0 }], 1200).then(() => q.remove()); };
const ring3 = (x, y, col = "#fff") => { for (let i = 0; i < 3; i++) { const r = add(`<div></div>`, `left:${x - 160}px;top:${y - 160}px;width:320px;height:320px;border-radius:50%;border:6px solid ${col};z-index:14`);
  anim(r, [{ transform: "scale(.1)", opacity: 1 }, { transform: "scale(1.3)", opacity: 0 }], 900, { delay: i * 220, fill: "both" }).then(() => r.remove()); } };
const arrow3 = (deg, x, y) => add(`<svg viewBox="0 0 120 80" style="overflow:visible"><path d="M8 26H68V6L114 40L68 74V54H8Z" fill=#ffd23c stroke=${INK} stroke-width=7 stroke-linejoin=round /></svg>`, `left:${x - 60}px;top:${y - 40}px;width:120px;height:80px;rotate:${deg}deg;z-index:28`);

Object.assign(scenes, {
  async subtitle() { // 翻訳字幕
    const h = ham(N), m = ov(h, openMouth); m.style.opacity = 0;
    await wait(700); chip("チャット「!ハム語」");
    pop(label("ハム語 → 日本語　自動翻訳 ON", "left:24px;top:356px;font-size:18px;z-index:21"));
    const box = add(`<div></div>`, "left:20px;top:392px;width:680px;height:132px;background:#000c;border:2px solid #fff6;border-radius:10px;overflow:hidden;z-index:20");
    const kyu = async t => { m.style.opacity = 1; hop(h, 26); const b = bubble(t, 832, 248, 1000); b.style.fontSize = "30px"; await wait(550); m.style.opacity = 0; };
    const roll = (rows, ms) => { box.innerHTML = ""; const t = add(`<div>${rows.map(r => `<div style="position:static;height:38px">${r}</div>`).join("")}</div>`, "left:0;right:0;top:0;text-align:center;font-size:25px;line-height:38px", box);
      return anim(t, [{ transform: "translateY(130px)" }, { transform: `translateY(${124 - rows.length * 38}px)` }], ms, { easing: "linear" }); };
    await wait(400); await kyu("キュ");
    await roll(["えー、まず配信者さんのエイムについて。", "さっきの3発、全部 壁に当たってました。", "壁は敵ではありません。", "話は変わりますが、昨日の種は48粒でした。", "うち3粒は頬袋に保存中です。", "将来の夢は、回し車で月まで行くことです。", "以上です。"], 4000);
    await wait(500); await kyu("キュッ");
    await roll(["補足します。", "さっきの「48粒」は49粒の誤りでした。", "お詫びして訂正いたします。", "それと配信者さん、立ち位置ですが", "さっきからずっと敵の正面です。", "あと回し車が鳴るので油をさしてください。", "なお、今の「キュッ」は敬語です。"], 4000);
    await wait(500); await kyu("キュ"); box.innerHTML = "";
    pop(add(`<div>はい</div>`, "left:0;right:0;top:0;height:100%;text-align:center;font-size:34px;line-height:126px", box)); await wait(1900);
  },

  async goodnight() { // 寝かしつけ
    const h = ham(N); await wait(800); chip("配信終了");
    bubble("配信者「おつかれ〜」", 300, 190, 1300); await wait(1400);
    hop(h, 30); bubble("ねんねの時間です", 700, 236, 1000); await wait(1000);
    const bl = add(`<div><div style="left:0;top:0;width:100%;height:26px;background:#fff;border-bottom:4px dashed #f08aa0"></div></div>`, `left:-20px;top:180px;width:1000px;height:400px;background:repeating-conic-gradient(#f7a8b8 0 25%,#ffe0e6 0 50%) 0 0/70px 70px;border:5px solid ${INK};border-radius:30px 30px 0 0;overflow:hidden;z-index:5`);
    say("ファサッ", 400, 120, { size: 44, color: "#fff", ms: 700 });
    await anim(bl, [{ transform: "translateY(380px)" }, { transform: "none" }], 800, { easing: "cubic-bezier(.2,1.3,.4,1)" });
    const lamp = add(`<div><div style="left:-70px;top:-12px;width:140px;height:60px;border-radius:0 0 70px 70px;background:#f2e2b8;border:4px solid ${INK}"></div><div style="left:-14px;top:40px;width:28px;height:28px;border-radius:50%;background:#bbb;border:3px solid ${INK}"></div><div style="left:54px;top:44px;width:4px;height:220px;background:#ddd"></div><div style="left:45px;top:260px;width:22px;height:30px;border-radius:11px;background:#ffd23c;border:3px solid ${INK}"></div></div>`, "left:640px;top:0;width:0;height:0;z-index:9");
    const cord = [lamp.children[2], lamp.children[3]], bulb = lamp.children[1];
    await anim(lamp, [{ transform: "translateY(-300px)" }, { transform: "none" }], 300);
    const pw = paw3(696, 292, 9); await anim(pw, [{ opacity: 0, transform: "translateY(30px)" }, { opacity: 1, transform: "none" }], 200);
    const pull = async () => { const k = [{ transform: "none" }, { transform: "translateY(34px)", offset: .5 }, { transform: "none" }]; cord.forEach(c => anim(c, k, 360)); await anim(pw, k, 360); say("カチッ", 610, 330, { size: 34, color: "#fff", ms: 500 }); };
    await pull();
    const dark = layer("background:#060b22;z-index:8"); anim(dark, [{ opacity: 0 }, { opacity: .9 }], 250); h.img.style.filter = "brightness(.55) saturate(.7)";
    const sky = [add(`<div></div>`, "left:130px;top:40px;width:86px;height:86px;border-radius:50%;box-shadow:-24px 12px 0 0 #ffe9a8;z-index:9")];
    for (const [x, y, z] of [[280, 60, 26], [380, 150, 18], [470, 50, 22], [520, 200, 16], [60, 180, 20], [250, 240, 16], [400, 300, 22], [130, 330, 16], [820, 60, 24], [880, 170, 16], [560, 120, 14]]) {
      const st = add(`<div>✦</div>`, `left:${x}px;top:${y}px;font-size:${z}px;color:#fff6c8;text-shadow:0 0 8px #fff6c8;z-index:9`); pop(st); sky.push(st); await wait(50); }
    await wait(500); await pull();
    bulb.style.cssText += ";background:#ffb34a;box-shadow:0 0 18px 6px #ffb34a";
    const glow = layer("z-index:9;background:radial-gradient(circle at 640px 40px,#ffb34a55,#ffb34a22 320px,#0000 560px)"); anim(glow, [{ opacity: 0 }, { opacity: 1 }], 400);
    h.img.style.filter = "brightness(.85) sepia(.35)"; await wait(500); pw.remove();
    const book = ov(h, `<path d="M600 800L290 740V1010L600 1070Z" fill=#fff8e6 stroke=${INK} stroke-width=14 /><path d="M600 800L910 740V1010L600 1070Z" fill=#fff8e6 stroke=${INK} stroke-width=14 /><path d="M360 815L540 850M360 870L540 905M360 925L540 960M660 850L840 815M660 905L840 870M660 960L840 925" stroke=#c8bba8 stroke-width=12 /><circle cx=300 cy=900 r=62 fill=#fbcbc3 stroke=${INK} stroke-width=12 /><circle cx=900 cy=900 r=62 fill=#fbcbc3 stroke=${INK} stroke-width=12 />`);
    anim(book, [{ transform: "translateY(300px)", opacity: 0 }, { transform: "none", opacity: 1 }], 250);
    bubble("むかしむかし、ペイロードが…", 420, 236, 1700); await wait(1800);
    const eyes = ov(h, closedEyes); h.classList.add("bob");
    bubble("ゆっくり…ゆっくり…すすみ……", 420, 236, 1400); await wait(900);
    chip("ハムが先に寝た"); for (let i = 0; i < 4; i++) { zz3(HX + 40 + (i % 3) * 24, HY + 6, 30 + (i % 3) * 12); await wait(420); }
    await wait(300); chip("次の配信");
    [dark, glow, lamp, ...sky].forEach(e => fade(e, 400));
    anim(bl, [{ transform: "none" }, { transform: "translateY(400px)" }], 500, { easing: "ease-in" });
    await wait(450); eyes.remove(); book.remove(); h.classList.remove("bob"); h.img.style.filter = ""; hop(h, 50);
    bubble("……寝てないです", 640, 250, 1200); await wait(1300);
  },

  async settings() { // 設定いじり
    const h = ham(N); await wait(700); chip("配信者がメニューを開いた");
    const p = add(`<div></div>`, "left:50px;top:46px;width:640px;height:456px;background:#0c1424f2;border:3px solid #6fa8d8;border-radius:6px;z-index:20");
    add(`<div>設定</div>`, "left:24px;top:10px;font-size:32px", p);
    ["ビデオ", "サウンド", "ハム"].forEach((t, i) => add(`<div>${t}</div>`, `left:${330 + i * 100}px;top:20px;font-size:20px;color:${i === 2 ? "#ff9c2a;border-bottom:3px solid #ff9c2a" : "#8aa"}`, p));
    add(`<div></div>`, "left:16px;right:16px;top:62px;height:2px;background:#6fa8d855", p);
    const row = (i, name) => add(`<div><div style="left:24px;top:0;font-size:24px;line-height:44px">${name}</div></div>`, `left:0;top:${84 + i * 66}px;width:640px;height:44px;background:${i % 2 ? "#ffffff08" : "#ffffff14"}`, p);
    const val = (r, v) => add(`<div>${v}</div>`, "left:432px;top:0;font-size:24px;line-height:44px;color:#ffd23c;white-space:nowrap", r);
    const slider = (r, f, v) => { add(`<div></div>`, "left:230px;top:19px;width:180px;height:6px;background:#3a4a66", r);
      const fill = add(`<div></div>`, `left:230px;top:19px;width:${f * 180}px;height:6px;background:#ff9c2a;transition:width .5s ease-in-out`, r);
      const knob = add(`<div></div>`, `left:${218 + f * 180}px;top:10px;width:24px;height:24px;border-radius:50%;background:#fff;border:3px solid #ff9c2a;transition:left .5s ease-in-out`, r);
      return { knob, v: val(r, v), set: f => { fill.style.width = f * 180 + "px"; knob.style.left = 218 + f * 180 + "px"; } }; };
    const s0 = slider(row(0, "かわいさ"), .5, "50"), s1 = slider(row(1, "マウス感度"), .4, "4.0"), s2 = slider(row(2, "敵の数"), .5, "5");
    const r3 = row(3, "頬袋モード"), tg = add(`<div><div style="left:3px;top:2px;width:22px;height:22px;border-radius:50%;background:#fff;transition:left .25s"></div></div>`, "left:230px;top:8px;width:64px;height:30px;border-radius:15px;background:#555;border:2px solid #889;transition:background .25s", r3), tv = val(r3, "OFF");
    const r4 = row(4, "難易度"); add(`<div>‹　　　　　　›</div>`, "left:230px;top:0;font-size:26px;line-height:44px;color:#8aa", r4);
    const dv = add(`<div>ノーマル</div>`, "left:250px;top:0;width:140px;text-align:center;font-size:23px;line-height:44px", r4);
    const ap = add(`<div>適用</div>`, "left:470px;top:400px;width:140px;height:40px;background:#ff9c2a;color:#111;border-radius:4px;text-align:center;font-size:24px;line-height:40px", p);
    await anim(p, [{ transform: "scale(.9)", opacity: 0 }, { transform: "none", opacity: 1 }], 220);
    const c = cursor3(860, 420); await c.go(370, 152, 500); await c.tap();
    s0.set(1); c.go(460, 152, 500); for (let v = 50; v <= 100; v += 5) { s0.v.textContent = v; await wait(46); } await wait(250);
    await c.go(352, 218, 350); await c.tap(); s1.set(.75); await c.go(415, 218, 500);
    s1.knob.style.cssText += `;background:#3a3030;border:3px solid #fff;border-radius:50% 50% 50% 50%/65% 65% 35% 35%;width:26px;height:36px;top:4px`; s1.v.textContent = "種"; pop(s1.v); await wait(350);
    await c.go(370, 284, 350); await c.tap(); s2.set(0); await c.go(280, 284, 500); s2.v.textContent = "0"; await wait(250);
    s2.v.innerHTML = `0<span style="position:static;font-size:17px;color:#ff6a5a">（変更できません）</span>`; s2.knob.textContent = "🔒"; s2.knob.style.cssText += ";font-size:12px;line-height:18px;text-align:center"; pop(s2.v); await wait(500);
    await c.go(312, 350, 350); await c.tap(); tg.style.background = "#3c9a52"; tg.firstChild.style.left = "37px"; tv.textContent = "ON"; await wait(300);
    await c.go(456, 416, 350); for (const t of ["ハード", "ハム"]) { await c.tap(); dv.textContent = t; pop(dv, 160); await wait(250); } dv.style.color = "#ff9c2a"; await wait(200);
    await c.go(570, 468, 400); await c.tap(); ap.style.background = "#fff";
    pop(add(`<div>✔ 適用しました</div>`, "left:170px;top:190px;width:300px;height:64px;background:#2e7d4f;border:3px solid #9fe08a;border-radius:8px;text-align:center;font-size:28px;line-height:58px;z-index:5", p)); await wait(1000);
    c.go(860, 420, 400); await anim(p, [{ transform: "none", opacity: 1 }, { transform: "scale(.9)", opacity: 0 }], 220); p.remove(); c.remove();
    chip("ゲーム: 何も変わっていない"); await wait(700); swap(h, R2, 1); for (let i = 0; i < 5; i++) flash(HX, HX + HW, HY, HY + 120, "#ffe14a");
    await wait(500); pop(label("かわいさ: 100", `left:${HX - 160}px;top:${HY + 40}px;font-size:24px`)); await wait(1500);
  },

  async shock() { // 電気ショック
    const g = gameBg(), h = ham(N); g.style.transition = "filter .3s";
    await wait(900); chip("デス"); shake(h); g.style.filter = "grayscale(1) brightness(.55)";
    const rl = label("リスポーンまで 5", "left:480px;top:440px;translate:-50% 0;font-size:26px"), cd = n => rl.textContent = `リスポーンまで ${n}`; await wait(900);
    const dev = ov(h, `<path d="M330 930q-80 120 0 170t-20 160M880 930q80 120 0 170t20 160" fill=none stroke=#333 stroke-width=14 />
      <rect x=150 y=640 width=360 height=210 rx=40 fill=#ffd23c stroke=${INK} stroke-width=14 /><rect x=120 y=840 width=420 height=74 rx=18 fill=#dfe7ef stroke=${INK} stroke-width=12 />
      <rect x=727 y=640 width=360 height=210 rx=40 fill=#ffd23c stroke=${INK} stroke-width=14 /><rect x=697 y=840 width=420 height=74 rx=18 fill=#dfe7ef stroke=${INK} stroke-width=12 />
      <text x=330 y=780 text-anchor=middle font-size=110 font-weight=900 fill=#e33>TOY</text><text x=907 y=780 text-anchor=middle font-size=110 font-weight=900 fill=#e33>TOY</text>
      <circle cx=330 cy=900 r=66 fill=#fbcbc3 stroke=${INK} stroke-width=12 /><circle cx=907 cy=900 r=66 fill=#fbcbc3 stroke=${INK} stroke-width=12 />`);
    hop(h, 34); bubble("まかせて", 640, 250, 900); cd(4); await wait(1000);
    h.classList.add("trem"); say("チャージ…", 430, 250, { size: 50, color: "#ffe14a", ms: 1100 }); cd(3);
    for (let i = 0; i < 10; i++) { flash(HX + 20, HX + HW - 20, HY + 100, HY + 200, "#ffe14a"); await wait(120); }
    h.classList.remove("trem"); say("クリア!", 430, 250, { size: 70, color: "#fff", ms: 700 }); await wait(650);
    const Z = "translate(-330px,-110px) scale(1.4)"; await anim(h, [{ transform: "none" }, { transform: Z }], 220, { easing: "ease-in" });
    fade(layer("background:#fff;z-index:24"), 200); say("バチッ!!", 180, 190, { size: 64, color: "#ffe14a", ms: 900 }); cd(2);
    const skel = ov(h, `<g fill=none stroke=#fff stroke-width=24 stroke-linecap=round>
      <path d="M600 150C850 150 990 300 990 470C990 600 910 680 830 700V770H370V700C290 680 210 600 210 470C210 300 350 150 600 150Z" fill=#ffffff2a />
      <path d="M440 705V770M520 705V770M600 705V770M680 705V770M760 705V770" stroke-width=12 /><path d="M600 560L560 630H640Z" fill=#0008 stroke-width=12 />
      <path d="M600 800V1160" stroke-dasharray="44 20" stroke-linecap=butt stroke-width=34 />
      <path d="M600 850Q430 830 370 930M600 850Q770 830 830 930M600 930Q450 915 410 1000M600 930Q750 915 790 1000M600 1010Q480 1000 450 1060M600 1010Q720 1000 750 1060" />
      <path d="M330 830L250 1000M870 830L950 1000M440 1110L410 1220M760 1110L790 1220M470 1110Q600 1180 730 1110" /><circle cx=220 cy=190 r=95 /><circle cx=965 cy=190 r=95 /></g>
      <ellipse cx=400 cy=480 rx=100 ry=110 fill=#000a /><ellipse cx=800 cy=480 rx=100 ry=110 fill=#000a />`);
    const XR = "brightness(.2) sepia(1) hue-rotate(170deg) saturate(3)";
    for (let i = 0; i < 9; i++) { const on = i % 2 === 0; h.img.style.filter = on ? XR : "none"; skel.style.opacity = on ? 1 : 0; dev.style.opacity = on ? .25 : 1;
      if (on) for (let k = 0; k < 3; k++) flash(330, 680, 100, 420, "#ffe14a"); await wait(i === 8 ? 500 : 90); }
    skel.remove(); dev.remove(); h.img.style.filter = "brightness(.8) sepia(.4)";
    const cx = [150, 174, 198, 222, 246, 270, 294, 318, 342, 366, 390].map(d => d * Math.PI / 180), C = "#b3a9a6";
    const afro = ov(h, cx.map(a => `<circle cx=${600 + 500 * Math.cos(a)} cy=${130 + 250 * Math.sin(a)} r=150 fill=${C} stroke=${INK} stroke-width=16 />`).join("") + `<ellipse cx=600 cy=140 rx=500 ry=250 fill=${C} />
      <path d="M380 60q40-60 80 0M560 0q40-60 80 0M740 60q40-60 80 0M470 180q40-60 80 0M650 180q40-60 80 0" fill=none stroke=#8a807e stroke-width=12 stroke-linecap=round />` + whiteEyes + frown);
    say("ボフッ", 220, 300, { size: 52, color: "#ddd", ms: 800 });
    for (let i = 0; i < 6; i++) { const sm = add(`<div></div>`, `left:${rnd(380, 600)}px;top:${rnd(80, 160)}px;width:${rnd(40, 70)}px;height:${rnd(40, 70)}px;border-radius:50%;background:#8889;z-index:22`);
      anim(sm, [{ transform: "scale(.4)", opacity: 1 }, { transform: `translate(${rnd(-40, 40)}px,-90px) scale(1.4)`, opacity: 0 }], 1200, { delay: i * 120, fill: "both" }).then(() => sm.remove()); }
    await wait(1100); await anim(h, [{ transform: Z }, { transform: "none" }], 320); cd(1); await wait(500);
    chip("リスポーン"); g.style.filter = "none"; rl.textContent = "リスポーン"; await wait(700); rl.remove();
    bubble("…復活、おめでとう", 560, 236, 1700); await wait(1800); afro.remove();
  },

  async killfeed() { // キルログ乗っ取り
    const h = ham(N), rows = []; await wait(800); chip("試合中・平和な時間");
    const row = (a, ic, b, ca = "#5fc8ff", cb = "#ff6a6a") => { const e = add(`<div><span style="position:static;color:${ca}">${a}</span><span style="position:static;margin:0 10px">${ic}→</span><span style="position:static;color:${cb}">${b}</span></div>`,
      `right:16px;top:${14 + rows.length * 42}px;height:37px;padding:0 14px;background:#000b;border-radius:4px;font-size:23px;line-height:37px;white-space:nowrap;z-index:15`);
      anim(e, [{ transform: "translateX(60px)", opacity: 0 }, { transform: "none", opacity: 1 }], 200); rows.push(e); return e; };
    for (const [ic, b] of [["🌻", "種"], ["💤", "昼寝"], ["🥜", "もう1粒"], ["🎡", "回し車"], ["🛁", "砂浴び"], ["🧹", "頬袋の整理"]]) { row("ハム", ic, b); hop(h, 18); await wait(800); }
    await wait(300); chip("本物のキルログ"); const e = row("敵", "💀", "健", "#ff6a6a", "#5fc8ff"); await wait(900);
    const eyes = ov(h, whiteEyes); shake(h); say("!", HX + 40, HY - 10, { size: 60, color: "#ff5a4a", ms: 600 }); await wait(700); eyes.remove();
    const x0 = e.offsetLeft, y0 = e.offsetTop + 18, pw = paw3(x0 - 20, y0, 16); hop(h, 40);
    await anim(pw, [{ transform: "translateY(120px)", opacity: 0 }, { transform: "none", opacity: 1 }], 250); await wait(200);
    say("グイッ", x0 - 100, y0, { size: 34, color: "#fff", ms: 600 });
    anim(pw, [{ transform: "none" }, { transform: "translateX(440px)" }], 500, { easing: "ease-in" }); await anim(e, [{ transform: "none" }, { transform: "translateX(440px)" }], 500, { easing: "ease-in" });
    e.remove(); pw.remove(); await wait(200); bubble("なかったことに", 580, 300, 1800); await wait(2000);
  },

  async ears() { // 地獄耳
    const h = ham(N); await wait(800); chip("敵の足音");
    bubble("足音…?", 640, 248, 1000); await wait(1100);
    const ear = x => add(`<div><div style="left:0;top:0;width:100%;height:100%;border-radius:50%;background:#aaa1a0;border:4px solid ${INK}"></div><div style="left:16%;top:16%;width:68%;height:68%;border-radius:50%;background:#f6b7c1;border:2px solid #d98a98"></div>
      <div style="left:46%;top:48%;width:8%;height:44%;background:#888;border:1px solid ${INK}"></div><div style="left:36%;top:36%;width:28%;height:20%;border-radius:40%;background:#ddd;border:2px solid ${INK}"></div></div>`,
      `left:${x - 28}px;top:${33 - 28}px;width:56px;height:56px;transform-origin:50% 90%`, h);
    const E = [ear(37), ear(177)], B = "perspective(300px) scale(2.2)";
    say("ギュイーン", 560, 200, { size: 40, color: "#fff", ms: 700 });
    await Promise.all(E.map(e => anim(e, [{ transform: "perspective(300px) scale(1)" }, { transform: B }], 400, { easing: "cubic-bezier(.2,1.6,.4,1)" })));
    const turn = (to, ms = 380) => Promise.all(E.map(e => anim(e, [{ transform: e.cur || B }, { transform: to }], ms, { easing: "ease-in-out" }).then(() => e.cur = to)));
    const scan = async () => { for (const d of [70, -70, 0]) await turn(`${B} rotateY(${d}deg)`, 200); };
    for (const [t, deg, ax, ay, tx, ty, rx, ry, to] of [["右!", 0, 600, 250, 450, 250, 960, 150, `${B} rotate(20deg) rotateY(-45deg)`], ["いや左!", 180, 330, 250, 520, 250, 0, 200, `${B} rotate(-20deg) rotateY(45deg)`], ["下!?", 90, 480, 300, 480, 190, 480, 540, `${B} rotateX(55deg)`]]) {
      await scan(); ring3(rx, ry); await turn(to, 250);
      const a = arrow3(deg, ax, ay); pop(a); say(t, tx, ty, { size: 60, ms: 900 }); await wait(1000); a.remove(); }
    chip("音の正体"); ring3(480, 540, "#ffb34a"); await wait(300);
    const gu = say("グゥ〜", 440, 450, { size: 96, color: "#ffb34a", ms: 0 }); gu.classList.add("wig");
    pop(label("配信者のお腹の音", "left:440px;top:345px;translate:-50% 0;font-size:28px")); await wait(1300);
    await turn("perspective(300px) scale(1)", 300); E.forEach(e => e.remove());
    bubble("…種、食べる?", 620, 248, 1500); await wait(1600);
  },

  async fishing() { // 奈落の釣り
    const g = gameBg(), h = ham(N); g.style.transition = "filter .3s";
    await wait(900); chip("崖から落とされてデス"); shake(h); g.style.filter = "grayscale(1) brightness(.6)";
    say("環境キル", 480, 150, { size: 60, color: "#ff5a4a", ms: 1000 }); await wait(1000);
    const pit = layer("z-index:3;background:linear-gradient(#0000 30%,#0a0614d0 66%,#000 92%)"), lab = label("↓ 奈落", "left:40px;top:470px;font-size:22px;z-index:4");
    const ledge = add(`<svg viewBox="0 0 320 70" preserveAspectRatio=none><path d="M0 70L10 40L32 20L72 10L122 16L172 6L232 14L292 8L320 12V70Z" fill=#5a4632 stroke=${INK} stroke-width=5 /></svg>`, "left:600px;top:478px;width:370px;height:70px;z-index:4");
    anim(pit, [{ opacity: 0 }, { opacity: 1 }], 400);
    const rod = add(`<svg viewBox="0 0 960 540" style="overflow:visible"><path d="M812 478L430 172" stroke=${INK} stroke-width=13 stroke-linecap=round /><path d="M812 478L430 172" stroke=#c98a4a stroke-width=7 stroke-linecap=round /><circle cx=768 cy=443 r=16 fill=#ccc stroke=${INK} stroke-width=5 /></svg>`, "left:0;top:0;width:960px;height:540px;z-index:11");
    const pw = paw3(800, 470, 12); await anim(rod, [{ opacity: 0, transform: "translate(200px,100px)" }, { opacity: 1, transform: "none" }], 350);
    bubble("釣るか", 650, 232, 700); await wait(550);
    const line = add(`<div><svg viewBox="0 0 20 30" style="left:-9px;top:100%;width:20px;height:30px;overflow:visible"><path d="M10 0V18Q10 27 3 24" fill=none stroke=#ddd stroke-width=3 /></svg></div>`, "left:429px;top:172px;width:3px;height:0;background:#eee;z-index:11");
    const pile = [[612, 438], [652, 446]], setH = v => { line.getAnimations().forEach(a => a.cancel()); line.style.height = v; };
    const fish = async (html, name, w) => {
      await anim(line, [{ height: "0px" }, { height: "420px" }], 450, { easing: "ease-in" }); await wait(420);
      say("ピクッ", 490, 340, { size: 34, color: "#fff", ms: 500 }); await anim(line, [0, 6, -6, 4, 0].map(x => ({ height: "420px", transform: `translateX(${x}px)` })), 300, { easing: "linear" });
      const it = add(`<div>${html}</div>`, `left:${-w / 2 + 1}px;top:calc(100% + 22px);width:${w}px;transform-origin:50% 0`, line);
      await anim(line, [{ height: "420px" }, { height: "120px" }], 600, { easing: "ease-out" }); setH("120px");
      anim(it, [{ transform: "rotate(-10deg)" }, { transform: "rotate(10deg)" }], 400, { iterations: Infinity, direction: "alternate", easing: "ease-in-out" });
      if (name) { say(name, 320, 330, { size: 44, ms: 700 }); await wait(750); }
      return it; };
    for (const [i, [html, name]] of [[`<div style="position:static;font-size:56px;line-height:1">👢</div>`, "長靴"], [`<div style="position:static;font-size:56px;line-height:1">🐟</div>`, "サバ"]].entries()) {
      const it = await fish(html, name, 64); it.remove();
      const p = add(`<div>${html}</div>`, `left:398px;top:314px;width:64px;z-index:12`); hop(h, 20);
      await anim(p, [{ transform: "none" }, { transform: `translate(${(pile[i][0] - 398) / 2}px,-90px) scale(.8)` }, { transform: `translate(${pile[i][0] - 398}px,${pile[i][1] - 314}px) scale(.7)` }], 420, { easing: "linear" }); setH("0px"); }
    const foe = await fish(`<svg viewBox="0 0 50 80" style="left:0;top:0;width:50px;height:80px;overflow:visible;filter:drop-shadow(0 0 6px #f22)"><circle cx=25 cy=14 r=12 fill=#e22 /><path d="M10 30H40L46 56H36L34 80H16L14 56H4Z" fill=#e22 /><path d="M8 34L-6 18M42 34L56 18" stroke=#e22 stroke-width=8 stroke-linecap=round /><path d="M18 12L23 15M32 12L27 15" stroke=#fff stroke-width=3 /></svg>`, "", 50);
    chip("…敵がかかった"); const eyes = ov(h, whiteEyes + `<path d="M1010 300q-34 56 0 78q34-22 0-78" fill=#7cc4ff stroke=${INK} stroke-width=8 />`); shake(h); say("!?", 650, 250, { size: 70, color: "#ff5a4a", ms: 700 }); await wait(800);
    const sc = add(`<div>✂️</div>`, "left:404px;top:206px;font-size:44px;z-index:13"); pop(sc); await wait(300);
    say("チョキン", 320, 230, { size: 40, color: "#fff", ms: 700 }); setH("40px"); sc.remove();
    const fall = add(`<div>${foe.innerHTML}</div>`, "left:405px;top:316px;width:50px;height:80px;z-index:11"); foe.remove();
    await anim(fall, [{ transform: "none" }, { transform: "translateY(320px) rotate(160deg)" }], 600, { easing: "ease-in" }); fall.remove(); await wait(300);
    chip("リスポーン"); eyes.remove(); g.style.filter = "none"; [pit, lab, rod, line, pw].forEach(e => fade(e, 400));
    pop(note("本日の釣果: 長靴、サバ", "left:480px;top:170px;translate:-50% 0;font-size:34px")); await wait(1800);
  },

  async melt() { // ありがとうで溶ける
    const h = ham(N); await wait(800);
    const voice = (t, x, y, size) => { const b = bubble(`味方「${t}」`, x, y, 1400); b.style.fontSize = size + "px"; b.style.border = "4px solid #5fc8ff"; return b; };
    chip("味方「ありがとう!」"); voice("ありがとう!", 330, 170, 26); await wait(700);
    const blush = ov(h, closedEyes + `<ellipse cx=288 cy=640 rx=105 ry=62 fill=#ff5c84 opacity=.8 /><ellipse cx=900 cy=640 rx=105 ry=62 fill=#ff5c84 opacity=.8 /><path d="M215 610l36 40M270 600l36 40M840 600l36 40M895 610l36 40" stroke=#c22 stroke-width=10 stroke-linecap=round />`);
    anim(blush, [{ opacity: 0 }, { opacity: 1 }], 300); say("てれ…", 640, 270, { size: 36, color: "#ffb0c4", ms: 800 }); await wait(500);
    const dp = "M70 760C40 880 20 980 60 1040Q100 1070 150 1065V1150Q150 1180 172 1180Q194 1180 194 1150V1070Q260 1090 320 1075V1230Q320 1262 346 1262Q372 1262 372 1230V1080Q450 1100 530 1082V1140Q530 1164 552 1164Q574 1164 574 1140V1084Q660 1100 740 1080V1250Q740 1284 768 1284Q796 1284 796 1250V1080Q880 1098 950 1076V1180Q950 1208 972 1208Q994 1208 994 1180V1072Q1100 1070 1170 1040C1215 980 1200 880 1167 760";
    const drips = ov(h, `<defs><linearGradient id=melt3g><stop offset=0 stop-color=#aaa1a0 /><stop offset=.2 stop-color=#fbf5e9 /><stop offset=.8 stop-color=#fbf5e9 /><stop offset=1 stop-color=#aaa1a0 /></linearGradient></defs><path d="${dp}Z" fill=url(#melt3g) /><path d="${dp}" fill=none stroke=${INK} stroke-width=14 stroke-linejoin=round />`); h.img.style.clipPath = "inset(0 0 17% 0)"; anim(drips, [{ opacity: 0 }, { opacity: 1 }], 500);
    const pud = add(`<div></div>`, `left:${HX - 10}px;top:${HY + HH - 26}px;width:${HW + 20}px;height:44px;border-radius:50%;background:radial-gradient(ellipse at 50% 40%,#fbf5e9 0 40%,#ddd6d2 70%,#aaa1a0);border:4px solid ${INK};z-index:9;transition:all .8s ease-in-out`); add(`<div></div>`, "left:14%;top:16%;width:18%;height:16%;border-radius:50%;background:#fffc", pud);
    pop(pud); say("とろ〜", 600, 340, { size: 36, color: "#fff", ms: 800 });
    await anim(h, [{ transform: "none" }, { transform: "scale(1.12,.7)" }], 900, { easing: "ease-in" }); await wait(500);
    chip("味方「ナイス!」"); voice("ナイス!", 300, 220, 34); await wait(600);
    Object.assign(pud.style, { left: "702px", top: "484px", width: "260px", height: "60px" });
    const eyes = add(`<div>${[0, 64].map(x => `<div style="left:${x}px;top:0;width:22px;height:26px;border-radius:50%;background:${INK}"><div style="left:5px;top:4px;width:8px;height:8px;border-radius:50%;background:#fff"></div></div>`).join("")}<div style="left:-30px;top:24px;width:26px;height:12px;border-radius:50%;background:#ff5c84cc"></div><div style="left:90px;top:24px;width:26px;height:12px;border-radius:50%;background:#ff5c84cc"></div></div>`,
      "left:789px;top:494px;width:86px;height:30px;z-index:11;opacity:0;transition:all .8s ease-in-out");
    await anim(h, [{ transform: "scale(1.12,.7)" }, { transform: "scale(1.3,.28)", opacity: .7, offset: .55 }, { transform: "scale(1.4,.08)", opacity: 0 }], 800, { easing: "ease-in" }); eyes.style.opacity = 1; await wait(800);
    chip("味方「最高!」"); voice("最高!", 360, 120, 48); await wait(600);
    Object.assign(pud.style, { left: "-80px", top: "424px", width: "1120px", height: "220px" }); eyes.style.top = "468px";
    say("じゅわ〜", 400, 380, { size: 48, color: "#fff", ms: 900 }); await wait(1300);
    const sd = seed(820, -50, 28, 30); await anim(sd, [{ transform: "none" }, { transform: "translateY(520px) rotate(540deg)" }], 800, { easing: "ease-in" }); sd.remove();
    say("パクッ", 830, 420, { size: 36, color: "#fff", ms: 500 }); await wait(450);
    fade(layer("background:#fff;z-index:24"), 250); pud.remove(); eyes.remove(); blush.remove(); h.getAnimations().forEach(a => a.cancel());
    drips.remove(); h.img.style.clipPath = ""; pop(h, 260); for (let i = 0; i < 5; i++) flash(); say("ポン!", 620, 280, { size: 64, ms: 900 }); await wait(1300);
  },
});
}

{
// テレポーター事故: 味方のテレポーターに乗ったら、毎回おかしな場所に出る。最後は種と混ざって戻ってくる
const tpPad = (x, y, w = 184) => { const e = add(`<div></div>`, `left:${x - w / 2}px;top:${y - w * .09}px;width:${w}px;height:${w * .18}px;border-radius:50%;background:radial-gradient(#e8ffff,#3fd8ff 45%,#0a6ea8 75%);border:3px solid #0b3c5c;box-shadow:0 0 18px #5ef,0 0 40px #39f;z-index:9`); pop(e); return e; };
const tpBeam = (x, y, w, h) => { const b = add(`<div></div>`, `left:${x - w / 2}px;top:${y - h}px;width:${w}px;height:${h}px;background:linear-gradient(#7ff0,#9ffb 55%,#fff);border-radius:${w / 2}px ${w / 2}px 0 0;z-index:26`);
  anim(b, [{ opacity: 0, transform: "scaleX(.2)" }, { opacity: 1, transform: "none", offset: .3 }, { opacity: 0, transform: "scaleX(.1)" }], 650).then(() => b.remove()); };
const tpAt = (x, y, k) => `translate(${x - (HX + HW / 2)}px,${y - (HY + HH)}px) scale(${k})`; // ハムの足もとを (x, y) に置き、k 倍にする
const tpOut = (h, pos) => anim(h, [{ transform: pos, opacity: 1, filter: "none" }, { transform: pos + " scale(.08,1.5)", opacity: 0, filter: "brightness(3)" }], 260, { easing: "ease-in" });
const tpIn = (h, pos) => anim(h, [{ transform: pos + " scale(.08,1.5)", opacity: 0, filter: "brightness(3)" }, { transform: pos, opacity: 1, filter: "none" }], 300);

Object.assign(scenes, {
  async teleport() { // テレポーター事故
    const h = ham(N), x0 = HX + HW / 2, y0 = HY + HH; let cur = tpAt(x0, y0, 1), cx = x0, cy = y0, ck = 1;
    const jump = async (x, y, k, padW) => { tpBeam(cx, cy, HW * ck, HH * ck * 1.5); say("シュン", cx, cy - HH * ck - 16, { size: 34, color: "#bff", ms: 500 });
      await tpOut(h, cur); await wait(260); cur = tpAt(x, y, k); cx = x; cy = y; ck = k;
      const pad = padW ? tpPad(x, y - 3, padW) : null; tpBeam(x, y, HW * k, HH * k * 1.5); await tpIn(h, cur); return pad; };
    await wait(900); chip("味方のテレポーター");
    const home = tpPad(x0, 528); bubble("乗ってみる", 640, 250, 900); await wait(1000); hop(h, 26); await wait(450);
    for (const [x, y, k, msg, bx, by, c] of [[470, 78, .32, "ここどこ!?", 470, 104, "テレポート先: HUDの上"], [470, 336, .46, "あ、どうも", 470, 170, "テレポート先: 敵の目の前"], [168, 476, .32, "体力バー、座り心地いい", 300, 360, "テレポート先: 体力バー"]]) {
      const pad = await jump(x, y, k, HW * k * .9); chip(c); bubble(msg, bx, by, 1150);
      if (y === 336) { anim(h, [-12, 10, -8, 6, 0].map(d => ({ transform: `${cur} translateX(${d}px)` })), 320, { easing: "linear" }); say("!?", 560, 250, { size: 60, color: "#ff5a4a", ms: 700 }); }
      await wait(1300); if (pad) pad.remove(); }
    await jump(x0, y0, 1, 0); await wait(150); chip("帰還…?");
    // ハムの顔が種に、種にハムの耳が付いて戻ってくる
    const T = `transform="translate(98 70) scale(26 18.6)"`, eye = x => `<circle cx=${x} cy=520 r=58 fill=#fff stroke=${INK} stroke-width=12 /><circle cx=${x} cy=530 r=20 fill=${INK} />`;
    const face = ov(h, `<path d="M20 2C38 24 36 54 20 58C4 54 2 24 20 2Z" ${T} fill=#3a3030 stroke=#fff stroke-width=.9 /><path d="M14 16L12 50M26 16L28 50" ${T} stroke=#eee stroke-width=.8 />${eye(528)}${eye(708)}<path d="M560 700Q618 750 676 700" fill=none stroke=#fff stroke-width=16 stroke-linecap=round />`);
    const sm = add(`<div><svg viewBox="0 0 60 80" style="left:0;top:0;width:100%;height:100%;overflow:visible"><circle cx=16 cy=20 r=10 fill=#f6b8b8 stroke=${INK} stroke-width=3 /><circle cx=44 cy=20 r=10 fill=#f6b8b8 stroke=${INK} stroke-width=3 />
      <path d="M30 12C50 34 48 72 30 76C12 72 10 34 30 12Z" fill=#fbf5e9 stroke=${INK} stroke-width=3 /><circle cx=24 cy=42 r=3 fill=${INK} /><circle cx=36 cy=42 r=3 fill=${INK} /><path d="M10 48H-10M10 54L-8 60M50 48H70M50 54L68 60" stroke=${INK} stroke-width=2 /></svg></div>`, `left:${HX - 78}px;top:418px;width:84px;height:112px;z-index:12`);
    pop(sm); await wait(500); const st = stamp("転送事故", 400, 190, 66); await wait(700);
    const lb = label("ハム と 種 が まざりました", "left:250px;top:268px;font-size:26px;z-index:33"); await wait(1100);
    bubble("……戻して", 650, 250, 1100); await wait(400); bubble("キュ", HX - 36, 360, 900); await wait(1200);
    fade(st); fade(lb); tpBeam(x0, y0, HW, HH * 1.5); await tpOut(h, cur); face.remove(); await fade(sm, 120); await wait(200); await tpIn(h, cur);
    hop(h, 30); say("ヨシ", 640, 270, { size: 44, color: "#fff", ms: 800 }); await wait(1000); fade(home, 300); await wait(600);
  },
});
}
