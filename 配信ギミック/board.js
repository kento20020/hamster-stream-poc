// 配信ハム PoC: 胸の前のボードで演出を紹介する見本のうち、ハムの絵柄に合わせた5パターン (M12〜M16)。
// menu.js が出している window.MK (演出の一覧、chestBoard など) を使う。まとまりごとに { } で囲んでいる。

// スケッチブック: 胸の前でリングとじのスケッチブックを持ち、ページを上にめくって演出を1つずつ紹介する
// クリーム色の画用紙に太いマーカーで手書き。今のページはリングを軸に上へめくれて裏へ回り、下から次のページが出る
{
const { MENU, cname, cue, chestBoard } = MK;
// 通貨ごとの色 (ink: 値段の文字と札の線、soft: 札の塗り、line: 下線)
const skCol = it => it.cur === "b" ? { ink: "#7a3ed6", soft: "#ece0ff", line: "#b98fff" } : { ink: "#e8700c", soft: "#ffe5c4", line: "#ffb05a" };
const skPrice = it => it.cur === "b" ? `◆${it.cost.toLocaleString()}` : `${it.cost.toLocaleString()}pt`; // ◆50 / 100pt
const skRng = seed => () => (seed = seed * 16807 % 2147483647) / 2147483647; // ページごとに同じゆらぎにする
// 手描きっぽく少しゆがんだ角丸の四角
const skBox = (x, y, w, h, r, R) => {
  const j = a => ((R() - .5) * 2 * a).toFixed(1), x2 = x + w, y2 = y + h, y0 = j(.6);
  return `M${x + r} ${y + +y0}Q${x + w / 2} ${y + +j(1.2)} ${x2 - r} ${y + +j(.6)}Q${x2} ${y} ${x2 + +j(.5)} ${y + r}Q${x2 + +j(1.2)} ${y + h / 2} ${x2 + +j(.5)} ${y2 - r}`
    + `Q${x2} ${y2} ${x2 - r} ${y2 + +j(.5)}Q${x + w / 2} ${y2 + +j(1.2)} ${x + r} ${y2 + +j(.5)}Q${x} ${y2} ${x + +j(.5)} ${y2 - r}Q${x + +j(1.2)} ${y + h / 2} ${x + +j(.5)} ${y + r}Q${x} ${y} ${x + r} ${y + +y0}Z`;
};
// 落書き (24×24 の中に描く)
const skStarD = Array.from({ length: 10 }, (_, k) => { const a = -Math.PI / 2 + k * Math.PI / 5, r = k % 2 ? 4.8 : 11; return `${k ? "L" : "M"}${(12 + r * Math.cos(a)).toFixed(1)} ${(12.6 + r * Math.sin(a)).toFixed(1)}`; }).join("") + "Z";
const SKD = {
  star: `<path d="${skStarD}" fill=#ffd84d stroke=${INK} stroke-width=2.4 stroke-linejoin=round />`,
  heart: `<path d="M12 21C4 15 1.2 10 4 6.5C6.6 3.4 10.4 4.4 12 8C13.6 4.4 17.4 3.4 20 6.5C22.8 10 20 15 12 21Z" fill=#ff97ad stroke=${INK} stroke-width=2.4 stroke-linejoin=round />`,
  seed: `<path d="M12 1.5C21 11 20 22 12 23.5C4 22 3 11 12 1.5Z" fill=#4a3c38 stroke=${INK} stroke-width=2.2 /><path d="M9 9.5L8.4 20M15 9.5L15.6 20" stroke=#f4ecd8 stroke-width=1.8 stroke-linecap=round />`,
  spark: `<path d="M12 1.5Q13.2 10.8 22.5 12Q13.2 13.2 12 22.5Q10.8 13.2 1.5 12Q10.8 10.8 12 1.5Z" fill=#ffe680 stroke=${INK} stroke-width=2 stroke-linejoin=round />`,
  flower: [0, 1, 2, 3, 4, 5].map(k => `<circle cx=${(12 + 6.6 * Math.cos(k * 1.047)).toFixed(1)} cy=${(12 + 6.6 * Math.sin(k * 1.047)).toFixed(1)} r=4.4 fill=#ffd84d stroke=${INK} stroke-width=2 />`).join("") + `<circle cx=12 cy=12 r=4.6 fill=#8a5a36 stroke=${INK} stroke-width=2 />`,
};
const skDood = (k, x, y, sz, rot) => `<svg viewBox="0 0 24 24" style="left:${x}px;top:${y}px;width:${sz}px;height:${sz}px;overflow:visible;transform:rotate(${rot}deg)">${SKD[k]}</svg>`;
// 名前の下の線 (ページごとに形を変える)
const skLine = (kind, w) => {
  if (kind === "wave") { const n = Math.max(4, Math.round(w / 16)), st = (w - 4) / n; let d = "M2 5"; for (let k = 0; k < n; k++) d += `Q${(2 + st * (k + .5)).toFixed(1)} ${k % 2 ? 9 : 1} ${(2 + st * (k + 1)).toFixed(1)} 5`; return d; }
  if (kind === "zig") { const n = Math.max(6, Math.round(w / 9)), st = (w - 4) / n; let d = "M2 3"; for (let k = 1; k <= n; k++) d += `L${(2 + st * k).toFixed(1)} ${k % 2 ? 8 : 3}`; return d; }
  if (kind === "double") return `M2 3.5L${w - 2} 2.5M${(w * .1).toFixed(1)} 8.5L${(w * .9).toFixed(1)} 7.5`;
  return `M2 8Q${w / 2} 0 ${w - 2} 4.5`; // swoosh
};
// ページごとの落書き [下線, [[種類, x, y, 大きさ, 回転], …], 値段の横の強調線]
const SK_V = [
  ["wave", [["star", 20, 93, 17, -12], ["spark", 152, 96, 12, 0]], 1],
  ["swoosh", [["seed", 22, 93, 15, 25], ["heart", 44, 98, 13, -8]], 0],
  ["zig", [["heart", 20, 94, 16, -10], ["spark", 43, 92, 11, 15]], 1],
  ["double", [["spark", 22, 94, 14, 0], ["seed", 150, 95, 14, -30]], 0],
  ["wave", [["flower", 20, 93, 17, 0], ["star", 152, 96, 12, 14]], 1],
  ["swoosh", [["star", 20, 93, 16, 8], ["heart", 152, 97, 12, 10]], 0],
  ["zig", [["seed", 23, 93, 15, -20], ["star", 43, 97, 12, 0], ["heart", 152, 96, 12, -6]], 1],
];
const SKF = `"Yusei Magic","Zen Maru Gothic",sans-serif`;

Object.assign(scenes, {
  async m_sketch() { // 胸の前のスケッチブックを上にめくって1つずつ紹介する
    const { bd, BW, BH, raise, lower, bob } = chestBoard();
    cue("見本: 2秒ごとにスケッチブックを上にめくる（本番は9秒ごと）");
    // マーカー風の字 (Yusei Magic) を、使う字だけまとめて読み込む。最初のページをめくる前に待つ (スタイルシートがまだなら空が返るので、2.5秒までくり返す)
    const allTxt = "えんしゅつ いちらん おしまい" + MENU.map(it => it.name + cname(it) + skPrice(it)).join("");
    const fontP = (async () => { const t0 = performance.now(); while (performance.now() - t0 < 2500) { document.fonts.load(`600 12px "Klee One"`, "0123456789/").catch(() => {});
      const f = await Promise.race([document.fonts.load(`38px "Yusei Magic"`, allTxt).catch(() => []), wait(600)]); if (f && f.length) return; await wait(100); } })();
    const PX = 3, PY = 5, PW = BW - 6, PH = 117, HOLE = 8; // 画用紙の位置と大きさ (bd の中の座標)、リングの穴の高さ
    const ringX = Array.from({ length: 11 }, (_, k) => 18 + k * (BW - 36) / 10);
    const holes = ringX.map(x => `<ellipse cx=${(x - PX).toFixed(1)} cy=${HOLE} rx=2.6 ry=3.1 fill=${INK} />`).join("");
    // 下に見える厚紙の表紙と、重なったページの厚み
    const R0 = skRng(7);
    add(`<svg viewBox="0 0 ${BW} ${BH}" style="left:0;top:0;width:100%;height:100%;overflow:visible;filter:drop-shadow(0 4px 5px #0006)">
      <path d="${skBox(1.5, PY - 2, BW - 3, BH - PY - 1, 11, R0)}" fill=#c08f58 stroke=${INK} stroke-width=4.5 stroke-linejoin=round />
      <path d="${skBox(PX + 1.5, PY + 2, PW - 3, PH + 4.5, 10, R0)}" fill=#f6e8c8 stroke=${INK} stroke-width=2.4 />
      <path d="${skBox(PX + 2, PY + 2, PW - 4, PH + 1, 10, R0)}" fill=#fbf0d6 stroke=${INK} stroke-width=2.4 /></svg>`, "", bd);
    // リング (穴から出て、紙の上の辺を越えて裏へ回る小さな輪)
    const rings = add(`<svg viewBox="0 0 ${BW} ${BH}" style="left:0;top:0;width:100%;height:100%;overflow:visible">${ringX.map(x => {
      const d = `M${x.toFixed(1)} ${PY + HOLE}C${(x - 3.5).toFixed(1)} ${PY}, ${(x - 2).toFixed(1)} -6, ${(x + 2.5).toFixed(1)} -6C${(x + 6.5).toFixed(1)} -6, ${(x + 7).toFixed(1)} 0, ${(x + 5.5).toFixed(1)} ${PY + 1}`;
      return `<path d="${d}" fill=none stroke=${INK} stroke-width=5.5 stroke-linecap=round /><path d="${d}" fill=none stroke=#dcd6cc stroke-width=2.2 stroke-linecap=round />`; }).join("")}</svg>`, "", bd);
    // 1枚のページ。fill: 表の色、back: めくれて見える裏の色と濃さ
    const page = (fill, back, backOp, seed) => {
      const d = skBox(2, 2, PW - 4, PH - 4, 10, skRng(seed));
      const e = add(`<div><svg viewBox="0 0 ${PW} ${PH}" style="left:0;top:0;width:100%;height:100%;overflow:visible"><path d="${d}" fill=${fill} stroke=${INK} stroke-width=4.5 stroke-linejoin=round />${holes}</svg></div>`,
        `left:${PX}px;top:${PY}px;width:${PW}px;height:${PH}px`, bd);
      bd.insertBefore(e, rings);
      e.back = `<svg viewBox="0 0 ${PW} ${PH}" style="left:0;top:0;width:100%;height:100%;overflow:visible"><path d="${d}" fill=${back} fill-opacity=${backOp} stroke=${INK} stroke-width=4.5 stroke-linejoin=round />${holes}</svg>`;
      return e;
    };
    // 横書きの文字を置き、幅をはかれるように span を返す
    const txt = (e, t, css) => add(`<div class=st><span>${t}</span></div>`, "white-space:nowrap;" + css, e).firstChild;
    const shrink = (sp, max) => { const w = sp.offsetWidth; if (w > max) sp.parentNode.style.fontSize = parseFloat(getComputedStyle(sp.parentNode).fontSize) * max / w + "px"; };

    const cover = () => { // 表紙: 厚紙にクリーム色の紙を貼り、マーカーで「えんしゅつ いちらん」
      const e = page("#d6a86e", "#c99a60", 1, 3);
      add(`<svg viewBox="0 0 ${PW} ${PH}" style="left:0;top:0;width:100%;height:100%;overflow:visible">
        <g transform="rotate(-2 ${PW / 2} 58)"><path d="${skBox(30, 18, PW - 60, 80, 8, skRng(11))}" fill=#fff6df stroke=${INK} stroke-width=3.5 />
        <rect x=${PW / 2 - 18} y=12 width=36 height=12 fill=#f2d98f fill-opacity=.9 stroke=${INK} stroke-width=1.6 transform="rotate(4 ${PW / 2} 18)" /></g></svg>`, "", e);
      txt(e, "えんしゅつ", `left:0;top:30px;width:${PW}px;text-align:center;font:28px/32px ${SKF};color:#3e2317;transform:rotate(-2deg)`);
      txt(e, "いちらん", `left:0;top:62px;width:${PW}px;text-align:center;font:28px/32px ${SKF};color:#3e2317;transform:rotate(-2deg)`);
      add(skDood("star", PW - 46, 9, 17, 12), "", e); add(skDood("seed", 40, 70, 14, -25), "", e); add(skDood("heart", PW - 50, 74, 13, 8), "", e);
      return e;
    };
    const item = (it, i) => { // 演出1つぶん: 通貨の札、値段、演出名、落書き、ページ番号
      const c = skCol(it), [ul, doods, emph] = SK_V[i % SK_V.length], e = page("#fff5dc", "#f2e5c7", .93, 20 + i);
      const tag = txt(e, cname(it), `left:18px;top:13px;padding:0 7px;font:15px/19px ${SKF};color:${c.ink};background:${c.soft};border:2.5px solid ${c.ink};border-radius:9px 7px 10px 8px;transform:rotate(-5deg)`);
      const tagR = 18 + tag.parentNode.offsetWidth;
      const pr = txt(e, skPrice(it), `right:16px;top:5px;font:38px/44px ${SKF};color:${c.ink};transform:rotate(-2deg)`);
      shrink(pr, PW - 16 - tagR - 8);
      const name = txt(e, it.name, `left:0;top:45px;width:${PW}px;text-align:center;font:${Math.min(36, Math.floor(184 / [...it.name].length))}px/38px ${SKF};color:#3e2317;transform:rotate(${i % 2 ? 1.5 : -1.5}deg)`);
      shrink(name, 186);
      const nw = Math.min(PW - 20, name.offsetWidth + 12), fs = parseFloat(getComputedStyle(name.parentNode).fontSize);
      add(`<svg viewBox="0 0 ${nw} 10" style="left:${(PW - nw) / 2}px;top:${Math.round(64 + fs / 2 + 1)}px;width:${nw}px;height:10px;overflow:visible"><path d="${skLine(ul, nw)}" fill=none stroke=${c.line} stroke-width=4 stroke-linecap=round stroke-linejoin=round /></svg>`, "", e);
      const ex = PW - 16 - pr.parentNode.offsetWidth - 4; // 値段の左に、マーカーの強調線 (札とのすき間があるときだけ)
      if (emph && ex - 16 > tagR + 4) {
        add(`<svg viewBox="0 0 16 22" style="left:${ex - 14}px;top:10px;width:16px;height:22px;overflow:visible"><path d="M13 2L15 9M5 5L11 12M1 14L10 16" stroke=${INK} stroke-width=2.4 stroke-linecap=round /></svg>`, "", e); }
      for (const [k, x, y, sz, rot] of doods) add(skDood(k, x, y, sz, rot), "", e);
      txt(e, `${i + 1}/${MENU.length}`, `right:13px;bottom:7px;font:600 12px/14px "Klee One",${SKF};color:#7a5846`);
      return e;
    };
    const end = () => { // 最後のページ
      const e = page("#fff5dc", "#f2e5c7", .93, 40);
      txt(e, "おしまい", `left:0;top:38px;width:${PW}px;text-align:center;font:30px/36px ${SKF};color:#3e2317;transform:rotate(-2deg)`);
      add(skDood("heart", PW / 2 + 64, 44, 16, 12), "", e); add(skDood("spark", PW / 2 - 82, 36, 12, 0), "", e);
      return e;
    };

    // めくる: 今のページ (old) が穴の高さを軸に上へめくれて裏へ回り、下から次のページ (nx) が出る
    let cur = cover();
    const T = 720, PE = 620, o = { easing: "cubic-bezier(.32,.12,.42,1)" }, A = a => `perspective(${PE}px) rotateX(${a}deg)`;
    // めくれる紙の影: 持ち上がった紙の下の辺 (画面での高さ) のすぐ下まで、次のページを暗くする
    const shadeK = Array.from({ length: 11 }, (_, k) => { const r = k * 9 * Math.PI / 180, L = PH - HOLE, y = HOLE + L * Math.cos(r) * PE / (PE - L * Math.sin(r));
      return { height: `${Math.round(y + 24)}px`, opacity: 1, offset: .38 * k / 10 }; }).concat([{ height: "12px", opacity: 0, offset: .62 }, { height: "12px", opacity: 0 }]);
    const flip = async nx => {
      const old = cur; bd.insertBefore(nx, old);
      const clip = add(`<div></div>`, `left:2px;top:2px;width:${PW - 4}px;height:${PH - 4}px;border-radius:10px;overflow:hidden`, nx); // 影は次のページの中だけに落とす
      const shade = add(`<div></div>`, `left:0;top:0;width:100%;background:linear-gradient(#331c1630,#331c1660 calc(100% - 24px),#331c1600)`, clip);
      const dim = add(`<div></div>`, `left:2px;top:2px;width:${PW - 4}px;height:${PH - 4}px;border-radius:10px;background:linear-gradient(#331c1600 15%,#331c1650);opacity:0`, old);
      const bk = add(old.back, "opacity:0", old); // 90度を越えたら裏 (うっすら裏写り)
      old.style.transformOrigin = `50% ${HOLE}px`; bob(5, 460);
      anim(shade, shadeK, T, o);
      anim(dim, [{ opacity: 0 }, { opacity: 1, offset: .38 }, { opacity: 1 }], T, o);
      anim(bk, [{ opacity: 0 }, { opacity: 0, offset: .379 }, { opacity: 1, offset: .38 }, { opacity: 1 }], T, o);
      await anim(old, [{ transform: A(0) }, { transform: A(90), offset: .38 }, { transform: A(180), offset: .72 }, { transform: A(270) }], T, o);
      old.remove(); clip.remove(); cur = nx;
    };

    await raise(); await wait(650); await fontP;
    for (let i = 0; i < MENU.length; i++) { await flip(item(MENU[i], i)); await wait(2000); }
    await flip(end()); await wait(600);
    await lower(); await wait(300);
  },
});
}

// ⑬ 木の札と焼印: お店の看板のような木の札を胸の前で持ち、焼きごてで演出名を焼き付け (ジュッ)、赤いハンコで値段を押す (ポン)。
// 次の演出へ行くときは札をくるっと横に回し、何も書いていない裏の木にまた焼き付ける。
{
const { MENU, cname, cue, chestBoard } = MK;
const BURN = "#3a1808", HOT = "#ff7a1e", SHU = "#d63c2a"; // 焼き色、焼きたての光る色、朱肉の赤
const ZEN = `font-family="Zen Maru Gothic" font-weight="900"`;
const esc = t => String(t).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const svgIn = (inner, css, parent, attrs = "") => add(`<svg ${attrs} style="overflow:visible">${inner}</svg>`, css, parent);
const ruler = document.createElement("canvas").getContext("2d");
const textW = (t, px) => { ruler.font = `900 ${px}px "Zen Maru Gothic"`; return ruler.measureText(t).width; };
// 手描きっぽく少しゆらいだ角丸の四角
const wobRect = (x, y, w, h, r, j = 1.6) => { const q = () => rnd(-j, j).toFixed(1) * 1;
  return `M${x + r} ${y}Q${x + w / 2} ${y + q()} ${x + w - r} ${y}Q${x + w} ${y} ${x + w} ${y + r}Q${x + w + q()} ${y + h / 2} ${x + w} ${y + h - r}` +
    `Q${x + w} ${y + h} ${x + w - r} ${y + h}Q${x + w / 2} ${y + h + q()} ${x + r} ${y + h}Q${x} ${y + h} ${x} ${y + h - r}Q${x + q()} ${y + h / 2} ${x} ${y + r}Q${x} ${y} ${x + r} ${y}Z`; };
// 木目: ゆるく波打つ横線 (ところどころ途切れる) と、小さな節
const grainSvg = (W, H) => { let g = "";
  for (let y = rnd(6, 10); y < H - 3; y += rnd(10, 15)) { const a = rnd(1, 3.2), f = rnd(26, 44), ph = rnd(0, 6.3); let d = "";
    for (let x = -6; x <= W + 6; x += 6) d += `${x < 0 ? "M" : "L"}${x} ${(y + Math.sin(x / f + ph) * a).toFixed(1)}`;
    g += `<path d="${d}" fill="none" stroke="#b07438" stroke-width="${rnd(1.4, 2.2).toFixed(1)}" stroke-linecap="round" opacity="${rnd(.3, .5).toFixed(2)}" stroke-dasharray="${rnd(50, 150).toFixed(0)} ${rnd(8, 26).toFixed(0)}" stroke-dashoffset="${rnd(0, 120).toFixed(0)}" />`; }
  for (const [x, y] of [[rnd(100, 130), H - rnd(14, 20)], [rnd(26, 50), rnd(26, 40)]])
    g += `<ellipse cx="${x}" cy="${y}" rx="9" ry="4.5" fill="#cf9455" stroke="#a96c34" stroke-width="1.6" opacity=".7" /><ellipse cx="${x}" cy="${y}" rx="3.5" ry="1.6" fill="#a96c34" opacity=".6" />`;
  return g; };
// 焼きごて (持ち手つきの金属の板)。板が札の中身にちょうどかぶる位置に置く
const IRON = `<rect x="160" y="6" width="214" height="118" rx="14" fill="none" stroke="#ffa24a" stroke-width="12" opacity=".5" />
  <rect x="165" y="12" width="214" height="118" rx="14" fill="#f07a32" stroke="${INK}" stroke-width="4" />
  <rect x="160" y="6" width="214" height="118" rx="14" fill="#aca6ad" stroke="${INK}" stroke-width="4" />
  <path d="M90 65H262" stroke="${INK}" stroke-width="13" stroke-linecap="round" /><path d="M90 65H262" stroke="#8e8890" stroke-width="5.5" stroke-linecap="round" />
  <rect x="238" y="44" width="60" height="42" rx="11" fill="#8e8890" stroke="${INK}" stroke-width="4" />
  <rect x="4" y="52" width="82" height="26" rx="13" fill="#b8763f" stroke="${INK}" stroke-width="4" />
  <path d="M28 59v12M46 59v12M64 59v12" stroke="#8a5226" stroke-width="3" stroke-linecap="round" />
  <rect x="80" y="54" width="14" height="22" rx="4" fill="#8e8890" stroke="${INK}" stroke-width="4" />`;
// ハンコ (木の持ち手、底が朱色)。底の中心が (30, 88)
const HANKO = `<circle cx="30" cy="15" r="12" fill="#c98a4e" stroke="${INK}" stroke-width="3.5" />
  <rect x="23" y="25" width="14" height="14" fill="#b77a40" stroke="${INK}" stroke-width="3.5" />
  <rect x="8" y="37" width="44" height="40" rx="9" fill="#d99a5c" stroke="${INK}" stroke-width="3.5" />
  <path d="M16 50Q30 46 44 51M18 63Q30 60 42 64" fill="none" stroke="#b77a40" stroke-width="2.5" stroke-linecap="round" />
  <rect x="5" y="76" width="50" height="12" rx="4" fill="${SHU}" stroke="${INK}" stroke-width="3.5" />`;

Object.assign(scenes, {
  async m_wood() { // ⑬ 木の札に焼印とハンコ
    const { wrap, bd, BW, BH, bx, by, raise, lower, bob } = chestBoard();
    cue("見本: 2秒ごとに木の札へ焼印とハンコ（本番は9秒ごと）");
    const fonts = Promise.race([Promise.all(['900 40px "Zen Maru Gothic"', '400 30px "Yusei Magic"'].map(f => document.fonts.load(f))), wait(1500)]).catch(() => {});
    // 札: あたたかい明るい茶色、やわらかい木目、太い焦げ茶の縁、角は丸く。上の左右に釘
    const edge = wobRect(2, 2, BW - 4, BH - 4, 16);
    const wood = svgIn(`<defs>
        <linearGradient id="k3wood" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f1c588" /><stop offset="1" stop-color="#dea362" /></linearGradient>
        <clipPath id="k3clip"><path d="${edge}" /></clipPath>
        <filter id="k3burn" x="-10%" y="-40%" width="120%" height="180%" color-interpolation-filters="sRGB">
          <feTurbulence type="fractalNoise" baseFrequency=".85" numOctaves="2" seed="7" result="n" />
          <feMorphology in="SourceAlpha" operator="dilate" radius="1" result="d" />
          <feGaussianBlur in="d" stdDeviation="2.3" result="b" />
          <feDisplacementMap in="b" in2="n" scale="5" xChannelSelector="R" yChannelSelector="G" result="bb" />
          <feFlood flood-color="#5c2a0c" flood-opacity=".55" /><feComposite in2="bb" operator="in" result="halo" />
          <feDisplacementMap in="SourceGraphic" in2="n" scale="1.8" xChannelSelector="R" yChannelSelector="G" result="t" />
          <feMerge><feMergeNode in="halo" /><feMergeNode in="t" /></feMerge>
        </filter>
        <filter id="k3hot" x="-15%" y="-50%" width="130%" height="200%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="g" /><feMerge><feMergeNode in="g" /><feMergeNode in="g" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter></defs>
      <path d="${edge}" fill="url(#k3wood)" />
      <g clip-path="url(#k3clip)"><g class="k3grain">${grainSvg(BW, BH)}</g></g>
      <path d="M18 8.5Q${BW / 2} 7 ${BW - 18} 8.5" fill="none" stroke="#fbe2b8" stroke-width="3" stroke-linecap="round" />
      <path d="M18 ${BH - 8.5}Q${BW / 2} ${BH - 7} ${BW - 18} ${BH - 8.5}" fill="none" stroke="#c4864a" stroke-width="3" stroke-linecap="round" opacity=".6" />
      <path d="${edge}" fill="none" stroke="${INK}" stroke-width="5" stroke-linejoin="round" />
      ${[15, BW - 15].map(x => `<circle cx="${x}" cy="14" r="5.5" fill="#bdb3aa" stroke="${INK}" stroke-width="2.6" /><circle cx="${x - 1.6}" cy="12.4" r="1.6" fill="#fff" opacity=".85" />`).join("")}`,
      `left:0;top:0;width:${BW}px;height:${BH}px;filter:drop-shadow(0 5px 4px #0006)`, bd);
    const grainG = wood.querySelector(".k3grain");
    const face = add(`<div></div>`, "left:0;top:0;width:100%;height:100%", bd); // 焼印とハンコの跡。札を回すと消える (裏は何も書いていない木)

    const NY = 50, SX = 181, SY = 104; // 演出名の中心の高さ、ハンコの中心
    // 焼印の中身: 演出名 (大きく) と、左下の小さな「ビッツ / チャネポ」の焼印 (枠つき)
    const brandSvg = (it, col) => { const fs = Math.min(38, 38 * 196 / textW(it.name, 38)), cn = cname(it), cw = textW(cn, 15) + 18;
      return `<text x="${BW / 2}" y="${NY}" text-anchor="middle" dominant-baseline="central" ${ZEN} font-size="${fs.toFixed(1)}" fill="${col}">${esc(it.name)}</text>
        <rect x="18" y="93" width="${cw.toFixed(1)}" height="26" rx="8" fill="none" stroke="${col}" stroke-width="2.6" />
        <text x="${(18 + cw / 2).toFixed(1)}" y="106.5" text-anchor="middle" dominant-baseline="central" ${ZEN} font-size="15" fill="${col}">${esc(cn)}</text>`; };
    // 赤い丸いハンコの跡 (少し斜め、かすれ)
    let sn = 0;
    const sealMark = it => { const id = `k3s${++sn}`, t = it.cur === "b" ? `◆${it.cost.toLocaleString()}` : `${it.cost.toLocaleString()}pt`;
      let fs = 19, tl = ""; const nat = textW(t, fs), room = 45;
      if (nat > room) { if (nat * .8 > room) fs = fs * room / .8 / nat; tl = `textLength="${room}" lengthAdjust="spacingAndGlyphs"`; }
      let holes = "";
      for (let i = 0; i < 40; i++) { const a = rnd(0, 6.3), r = i < 30 ? rnd(20, 33) : rnd(0, 20); holes += `<circle cx="${(Math.cos(a) * r).toFixed(1)}" cy="${(Math.sin(a) * r).toFixed(1)}" r="${(i < 30 ? rnd(.5, 1.5) : rnd(.3, .7)).toFixed(2)}" fill="#000" />`; }
      for (let i = 0; i < 4; i++) { const a = rnd(0, 6.3), r = rnd(22, 31), b = a + rnd(.25, .5); holes += `<path d="M${(Math.cos(a) * r).toFixed(1)} ${(Math.sin(a) * r).toFixed(1)}A${r.toFixed(1)} ${r.toFixed(1)} 0 0 1 ${(Math.cos(b) * r).toFixed(1)} ${(Math.sin(b) * r).toFixed(1)}" fill="none" stroke="#000" stroke-width="${rnd(.8, 1.6).toFixed(1)}" opacity=".8" />`; }
      return svgIn(`<defs><radialGradient id="${id}g" cx=".3" cy=".25" r=".95"><stop offset=".55" stop-color="#fff" /><stop offset="1" stop-color="#8a8a8a" /></radialGradient>
          <mask id="${id}" maskUnits="userSpaceOnUse" x="-40" y="-40" width="80" height="80"><rect x="-40" y="-40" width="80" height="80" fill="url(#${id}g)" />${holes}</mask></defs>
        <g mask="url(#${id})"><circle r="30" fill="none" stroke="${SHU}" stroke-width="4.4" /><circle r="25.2" fill="none" stroke="${SHU}" stroke-width="1.5" />
          <text y="1" text-anchor="middle" dominant-baseline="central" ${ZEN} font-size="${fs.toFixed(1)}" fill="${SHU}" ${tl}>${esc(t)}</text></g>`,
        `left:${SX - 33}px;top:${SY - 33}px;width:66px;height:66px;rotate:-12deg;mix-blend-mode:multiply;opacity:0`, face, `viewBox="-33 -33 66 66"`); };
    // 白い湯気: 丸がふわっと上がって消える
    const puffs = (pts, k = 1) => pts.forEach(([x, y]) => { const r = rnd(7, 12) * k;
      const e = add(`<div></div>`, `left:${x - r}px;top:${y - r}px;width:${2 * r}px;height:${2 * r}px;border-radius:50%;background:#fff;border:2.5px solid #b3a59a;z-index:8`, wrap);
      anim(e, [{ transform: "scale(.4)", opacity: 0 }, { opacity: .95, offset: .2 }, { transform: `translate(${rnd(-12, 12)}px,${-rnd(34, 62)}px) scale(1.35)`, opacity: 0 }], rnd(650, 900), { delay: rnd(0, 160), fill: "both" }).then(() => e.remove()); });
    // 「ジュッ」「ポン」
    const sfx = (t, x, y, col, px, rot, ms) => { const e = add(`<div>${t}</div>`, `left:${x}px;top:${y}px;translate:-50% -50%;rotate:${rot}deg;font:400 ${px}px "Yusei Magic",sans-serif;color:${col};-webkit-text-stroke:6px ${INK};paint-order:stroke fill;white-space:nowrap;z-index:22`);
      anim(e, [{ transform: "scale(.3)", opacity: 0 }, { transform: "scale(1.15)", opacity: 1, offset: .5 }, { transform: "none", opacity: 1 }], 170);
      wait(ms).then(() => anim(e, [{ opacity: 1 }, { opacity: 0, transform: "translateY(-10px)" }], 200)).then(() => e.remove()); };
    const nudge = px => anim(wrap, [{ transform: "none" }, { transform: `translateY(${px}px)` }, { transform: "none" }], 160);

    // 焼きごてでジュッ → 演出名が浮き出る → ハンコでポン
    const brand = async it => {
      const burnt = svgIn(`<g filter="url(#k3burn)">${brandSvg(it, BURN)}</g>`, `left:0;top:0;width:${BW}px;height:${BH}px;mix-blend-mode:multiply;opacity:0`, face);
      const hot = svgIn(`<g filter="url(#k3hot)">${brandSvg(it, HOT)}</g>`, `left:0;top:0;width:${BW}px;height:${BH}px;opacity:0`, face);
      const ir = svgIn(IRON, `left:-152px;top:12px;width:384px;height:130px;z-index:6;transform-origin:70% 50%`, wrap);
      const up = "translate(0px,-6px) scale(1.03)", sh1 = "drop-shadow(6px 10px 0 #0003)", sh0 = "drop-shadow(1px 2px 0 #0002)", away = "translate(-280px,-24px) rotate(-7deg)";
      await anim(ir, [{ transform: "translate(-250px,-26px) rotate(-8deg)", filter: sh1, opacity: 0 }, { opacity: 1, offset: .3 }, { transform: up, filter: sh1, opacity: 1 }], 200);
      await anim(ir, [{ transform: up, filter: sh1 }, { transform: "none", filter: sh0 }], 70, { easing: "ease-in" });
      nudge(3); burnt.style.opacity = 1; sfx("ジュッ", bx + 2, by - 18, "#fff", 34, -12, 620);
      puffs([...[22, 46, 70, 94, 118, 142, 166, 190, 212].map(x => [x + rnd(-6, 6), rnd(14, 20)]), [4, rnd(40, 70)], [BW - 2, rnd(30, 60)]]);
      await anim(ir, [0, 1.3, -1.1, 1, -.6, 0].map(x => ({ transform: `translateX(${x}px)`, filter: sh0 })), 150, { easing: "linear" }); // ジュウジュウ
      anim(ir, [{ transform: "none", filter: sh0, opacity: 1 }, { transform: up, filter: sh1, opacity: 1, offset: .25 }, { opacity: 1, offset: .65 }, { transform: away, filter: sh1, opacity: 0 }], 320, { easing: "ease-in" }).then(() => ir.remove());
      anim(hot, [{ opacity: 1 }, { opacity: 1, offset: .3 }, { opacity: 0 }], 800, { easing: "ease-in" }); // 焼きたては赤く光り、冷めて焦げ茶になる
      const tw = Math.min(196, textW(it.name, 38));
      puffs([...[0, 1, 2, 3, 4, 5].map(i => [BW / 2 - tw / 2 + tw * (i + .5) / 6 + rnd(-6, 6), NY - rnd(10, 18)]), [40, 92]], .8);
      await wait(120);
      const tool = svgIn(HANKO, `left:${SX - 30}px;top:${SY - 86}px;width:60px;height:96px;z-index:7;transform-origin:50% 92%`, wrap, `viewBox="0 0 60 96"`);
      await anim(tool, [{ transform: "translateY(-150px) rotate(-10deg)", opacity: 0 }, { opacity: 1, offset: .35 }, { transform: "none", opacity: 1 }], 170, { easing: "ease-in" });
      const sl = sealMark(it); anim(sl, [{ transform: "scale(1.25)", opacity: 0 }, { transform: "none", opacity: .93 }], 110);
      nudge(4); sfx("ポン", bx + BW - 44, by - 14, "#ffe1d6", 28, 10, 420);
      anim(tool, [{ transform: "none" }, { transform: "scale(1.1,.84)" }, { transform: "none" }], 130)
        .then(() => anim(tool, [{ transform: "none", opacity: 1 }, { transform: "translateY(-130px) rotate(8deg)", opacity: 0 }], 230, { easing: "ease-in" })).then(() => tool.remove());
    };
    // 札をくるっと横に回す。裏は何も書いていない木 (木目は左右反転)
    let back = false; const PY = a => `perspective(650px) rotateY(${a}deg)`;
    const turn = async () => { bob(5, 380);
      await anim(bd, [{ transform: PY(0), filter: "brightness(1)" }, { transform: PY(-90), filter: "brightness(.8)" }], 170, { easing: "ease-in" });
      face.innerHTML = ""; back = !back; grainG.setAttribute("transform", back ? `translate(${BW} 0) scale(-1 1)` : "");
      await anim(bd, [{ transform: PY(90), filter: "brightness(.8)" }, { transform: PY(-9), filter: "brightness(1)", offset: .75 }, { transform: PY(0), filter: "brightness(1)" }], 210); };

    await raise(); await fonts; await wait(100);
    for (let i = 0; i < MENU.length; i++) { if (i) await turn(); await brand(MENU[i]); await wait(2000); }
    await turn(); await wait(200);
    await lower(); await wait(200);
  },
});
}

// ぷっくりシール: 水玉のパステルボードに、演出名を1文字ずつシールでポンと貼り、最後に値段の丸いバッジをペタッと貼る。
// 次の演出へ行く前に、シールは端からはがれて、くるっと回りながら飛んでいく。
{
const { MENU, cname, cue, chestBoard } = MK;
Object.assign(scenes, {
  async m_sticker() { // 胸の前のシールボード。1文字ずつシールを貼って紹介する
    const { bd, BW, BH, raise, lower, bob } = chestBoard();
    cue("見本: シールを1文字ずつ貼る（本番は9秒ごと）");
    const FONT = `'M PLUS Rounded 1c','Zen Maru Gothic',sans-serif`; // HTML の style="…" の中でも使うので一重引用符
    // フォントの読み込みを待つ (読めなくても止まらないように、長くても1.5秒で先へ進む)
    const fontReady = (async () => {
      const lk = document.getElementById("mfont");
      if (lk && !lk.sheet) await Promise.race([new Promise(r => { lk.addEventListener("load", r, { once: true }); lk.addEventListener("error", r, { once: true }); }), wait(1500)]);
      const txt = MENU.map(it => it.name + cname(it)).join("") + "◆0123456789pt,ポンペタッ";
      await Promise.race([document.fonts.load(`800 40px "M PLUS Rounded 1c"`, txt).catch(() => {}), wait(1500)]);
    })();

    // ボード: ミントのパステル、うすい水玉、白いステッチ、太い焦げ茶の縁 (少しだけ手描きのゆらぎ)
    const wob = (x0, y0, x1, y1, r, j) => `M${x0 + r} ${y0}Q${(x0 + x1) / 2} ${y0 - j} ${x1 - r} ${y0}Q${x1} ${y0} ${x1} ${y0 + r}Q${x1 + j * .8} ${(y0 + y1) / 2} ${x1} ${y1 - r}`
      + `Q${x1} ${y1} ${x1 - r} ${y1}Q${(x0 + x1) / 2} ${y1 + j * .6} ${x0 + r} ${y1}Q${x0} ${y1} ${x0} ${y1 - r}Q${x0 - j} ${(y0 + y1) / 2} ${x0} ${y0 + r}Q${x0} ${y0} ${x0 + r} ${y0}Z`;
    const edge = wob(2.5, 2.5, BW - 2.5, BH - 2.5, 22, 1.4);
    add(`<svg viewBox="0 0 ${BW} ${BH}" style="left:0;top:0;width:100%;height:100%;overflow:visible">
      <defs><linearGradient id=k4bg x2=0 y2=1><stop offset=0 stop-color=#c8f0dc /><stop offset=1 stop-color=#a8e0c6 /></linearGradient>
        <pattern id=k4dot width=18 height=18 patternUnits=userSpaceOnUse><circle cx=4.5 cy=4.5 r=2.6 fill=#fff fill-opacity=.6 /><circle cx=13.5 cy=13.5 r=2.6 fill=#fff fill-opacity=.6 /></pattern></defs>
      <path d="${edge}" fill=url(#k4bg) />
      <path d="${edge}" fill=url(#k4dot) />
      <path d="${wob(9, 9, BW - 9, BH - 9, 16, .8)}" fill=none stroke=#fff stroke-opacity=.75 stroke-width=1.6 stroke-dasharray="4 4" stroke-linecap=round />
      <path d="${edge}" fill=none stroke=${INK} stroke-width=5 stroke-linejoin=round /></svg>`, "", bd);
    // 前から貼ってある小さな飾りシール (ハートと星)
    const deco = (d, x, y, w, col, r) => add(`<svg viewBox="0 0 24 24" style="overflow:visible"><path d="${d}" fill=none stroke=${INK} stroke-width=6.5 stroke-linejoin=round />
      <path d="${d}" fill=none stroke=#fff stroke-width=3.6 stroke-linejoin=round /><path d="${d}" fill=${col} /></svg>`, `left:${x}px;top:${y}px;width:${w}px;height:${w}px;rotate:${r}deg`, bd);
    const star = Array.from({ length: 10 }, (_, i) => { const a = -Math.PI / 2 + i * Math.PI / 5, q = i % 2 ? 4.6 : 10.5; return `${i ? "L" : "M"}${(12 + q * Math.cos(a)).toFixed(1)} ${(12.5 + q * Math.sin(a)).toFixed(1)}`; }).join("") + "Z";
    deco("M12 20.5C5.5 16 2 12 2 8A4.8 4.8 0 0 1 12 6A4.8 4.8 0 0 1 22 8C22 12 18.5 16 12 20.5Z", 26, 104, 19, "#ffb8c8", -12);
    deco(star, BW - 46, 106, 20, "#ffe27a", 10);

    // 文字のシールの大きさは文字数で決める (6文字でも収まるよう、足りなければ少し重ねて貼る)
    const ROWY = 34, BXC = BW / 2, BYC = 99, D = 74;
    const COLS = [["#ffd0dc", "#ffb3c7"], ["#fff0ad", "#ffe07c"], ["#cbe8ff", "#a9d5fb"], ["#e3d5ff", "#cdb8fb"], ["#ffdcbf", "#ffc597"]];
    const fitRow = n => { const W = BW - 22, s = Math.min(46, Math.floor((W + 6 * (n - 1)) / n)), gap = n > 1 ? Math.min(5, (W - n * s) / (n - 1)) : 0;
      return { s, gap, x0: (BW - (n * s + (n - 1) * gap)) / 2 }; };
    const onoma = (txt, x, y, size) => { // 「ポン」「ペタッ」の小さな文字
      const e = add(`<div>${txt}</div>`, `left:${x}px;top:${y}px;translate:-50% -100%;rotate:${rnd(-14, 14)}deg;font:800 ${size}px/1 ${FONT};color:${INK};white-space:nowrap;-webkit-text-stroke:3px #fff;paint-order:stroke fill;z-index:4`, bd);
      anim(e, [{ transform: "scale(.4)", opacity: 0 }, { transform: "translateY(-5px) scale(1.15)", opacity: 1, offset: .3 }, { transform: "translateY(-12px)", opacity: 0 }], 520).then(() => e.remove()); };

    const stick = async (it, k) => { // 演出名を1文字ずつ貼る
      const chars = [...it.name], { s, gap, x0 } = fitRow(chars.length), rim = s > 40 ? 3 : 2.5, tiles = [];
      for (const [i, ch] of chars.entries()) {
        const [c1, c2] = COLS[(i + k * 2) % COLS.length], x = x0 + i * (s + gap), y = ROWY - s / 2 + rnd(-2, 2);
        const t = add(`<div>${ch}</div>`, `left:${x}px;top:${y}px;width:${s}px;height:${s}px;rotate:${rnd(-6, 6).toFixed(1)}deg;border-radius:${Math.round(s * .3)}px;
          display:flex;align-items:center;justify-content:center;border:${rim}px solid #fff;background:radial-gradient(circle at 30% 24%,#fffc 0,#fff0 42%),linear-gradient(${c1},${c2});
          box-shadow:0 0 0 2px ${INK},0 3px 0 2px #331c1650,inset 0 -3px 0 #331c1614;font:800 ${Math.round(s * .62)}px/1 ${FONT};color:${INK};text-shadow:0 1.5px 0 #fffa`, bd);
        tiles.push(t);
        anim(t, [{ transform: "translateY(-16px) scale(1.55)", opacity: 0 }, { transform: "translateY(0) scale(.84)", opacity: 1, offset: .45 }, { transform: "translateY(0) scale(1.07)", offset: .72 }, { transform: "translateY(0) scale(1)" }], 260);
        onoma("ポン", x + s * .78, y + 2, 11);
        await wait(70);
      }
      return tiles; };

    let gid = 0;
    const badge = it => { // 値段の丸いバッジ (ビッツは紫、チャネポはオレンジ)
      const b = it.cur === "b", [c0, c1, c2, ct] = b ? ["#d6c2ff", "#a982f5", "#8a5fe3", "#6a3cc8"] : ["#ffd99a", "#ffac45", "#f28e1e", "#b0600a"], g = "k4g" + gid++;
      const bumps = `<circle cx=50 cy=50 r=38 />` + Array.from({ length: 16 }, (_, i) => `<circle cx=${(50 + 38 * Math.cos(i * Math.PI / 8)).toFixed(2)} cy=${(50 + 38 * Math.sin(i * Math.PI / 8)).toFixed(2)} r=8 />`).join("");
      const cost = it.cost.toLocaleString(), price = b ? `<small>◆</small>${cost}` : `${cost}<small>pt</small>`;
      const e = add(`<div><svg viewBox="0 0 100 100" style="left:0;top:0;width:100%;height:100%;overflow:visible">
          <defs><radialGradient id=${g} cx=.36 cy=.3 r=.75><stop offset=0 stop-color=${c0} /><stop offset=.5 stop-color=${c1} /><stop offset=1 stop-color=${c2} /></radialGradient></defs>
          <g fill=${INK} stroke=${INK} stroke-width=7>${bumps}</g><g fill=#fff>${bumps}</g>
          <circle cx=50 cy=50 r=33 fill=url(#${g}) /><circle cx=50 cy=50 r=28.5 fill=none stroke=#fff stroke-opacity=.55 stroke-width=1.6 stroke-dasharray="3 3.2" />
          <ellipse cx=36 cy=29 rx=10 ry=5 fill=#fff fill-opacity=.6 transform="rotate(-32 36 29)" /></svg>
        <div class=st style="left:50%;top:${Math.round(D * .29)}px;translate:-50% 0;white-space:nowrap;font:800 22px/1 ${FONT};color:#fff;-webkit-text-stroke:4px ${INK};paint-order:stroke fill">${price}</div>
        <div style="left:50%;top:${Math.round(D * .61)}px;translate:-50% 0;padding:0 5px;border-radius:7px;background:#fff;border:1.5px solid ${INK};font:800 10px/12px ${FONT};color:${ct};white-space:nowrap">${cname(it)}</div></div>`,
        `left:${BXC - D / 2}px;top:${BYC - D / 2}px;width:${D}px;height:${D}px;rotate:${rnd(-10, 4).toFixed(1)}deg;filter:drop-shadow(0 2.5px 0 #331c1658)`, bd);
      const pe = e.children[1], sm = pe.querySelector("small"); let fs = 23; // バッジの中に収まるまで文字を小さくする
      const size = () => { pe.style.fontSize = fs + "px"; sm.style.fontSize = Math.round(fs * .62) + "px"; };
      size(); while (pe.offsetWidth > D * .73 && fs > 12) { fs--; size(); }
      return e; };

    const peel = (tiles, bg) => { // 端から順にはがれて、くるっと回って飛んでいく。バッジは最後にはがれて落ちる
      const T = (x, y, r, a, k) => `translate(${x}px,${y}px) rotate(${r}deg) perspective(150px) rotateY(${a}deg) scale(${k})`;
      tiles.forEach((t, i) => { t.style.transformOrigin = "100% 50%"; t.style.zIndex = 3;
        anim(t, [{ transform: T(0, 0, 0, 0, 1), opacity: 1 }, { transform: T(0, -3, -4, 55, 1.05), opacity: 1, offset: .25 },
          { transform: T(-30, -22, -190, 20, .95), opacity: 1, offset: .55 }, { transform: T(-64 - rnd(0, 36), 130, -400, 0, .78), opacity: 0 }], 520, { delay: i * 45, easing: "linear" }).then(() => t.remove()); });
      anim(bg, [{ transform: "translate(0,0) rotate(0deg) scale(1)" }, { transform: "translate(4px,-8px) rotate(14deg) scale(1.08)", offset: .25 }, { transform: "translate(16px,160px) rotate(220deg) scale(.85)", opacity: 0 }],
        520, { delay: tiles.length * 45 + 30, easing: "ease-in" }).then(() => bg.remove()); };

    await raise(); await fontReady; await wait(150);
    for (const [k, it] of MENU.entries()) {
      const tiles = await stick(it, k); await wait(40);
      const bg = badge(it); bob(4, 260); onoma("ペタッ", BXC + D / 2 + 6, BYC - 14, 13);
      anim(bg, [{ transform: "translateY(-34px) scale(1.7,1.7)", opacity: 0 }, { transform: "translateY(0) scale(1.15,.84)", opacity: 1, offset: .28 }, { transform: "translateY(0) scale(.9,1.1)", offset: .45 },
        { transform: "translateY(0) scale(1.06,.95)", offset: .62 }, { transform: "translateY(0) scale(.97,1.03)", offset: .8 }, { transform: "translateY(0) scale(1,1)" }], 760);
      await wait(220); await wait(2000); // 出そろってから2秒見せる
      peel(tiles, bg); await wait(k < MENU.length - 1 ? 560 : 650); // 前のシールが飛んでいってから次を貼る
    }
    await lower(); await wait(300);
  },
});
}

// 紙芝居: 木の小さな紙芝居の枠をハムが胸の前で持ち、絵札を1枚ずつ横 (左) へ引き抜いて演出を紹介する
// 最初に枠の扉が開いて「はじまり はじまり〜」の表紙、最後は「おしまい」の札のあと扉が閉じる
{
const { MENU, cname, cue, chestBoard } = MK;
const KAMI_KF = "'Kiwi Maru','Zen Maru Gothic',sans-serif", KAMI_ZF = "'Zen Maru Gothic','Kiwi Maru',sans-serif"; // style="…" の中に入れるので一重引用符
const KAMI_PAPER = ["#fdecc8", "#fde0d0", "#fbe2ea", "#e2f0d4", "#dcecf5", "#ebe1f6", "#fbf1bd"]; // 札ごとに地の色を少しずつ変える
const kamiPrice = it => it.cur === "b" ? `◆${it.cost.toLocaleString()}` : `${it.cost.toLocaleString()}pt`; // ◆50 / 100pt
const kamiCol = it => it.cur === "b" ? ["#8457d6", "#5f34b0"] : ["#f08a1c", "#bf5c00"]; // [札の色, 値段の文字色]

Object.assign(scenes, {
  async m_kami() { // 紙芝居の枠から絵札を横へ引き抜いて1つずつ紹介
    const { wrap, bd, bx, by, raise, lower, bob } = chestBoard();
    wrap.style.transform = "translateY(170px)"; // 文字の準備ができるまでボードは画面の下に隠しておく
    cue("見本: 2秒ごとに紙芝居の札を引き抜く（本番は9秒ごと）");

    // 木の枠 (太い焦げ茶の線、角は丸く、少しゆがませて手描きっぽく)
    bd.style.cssText += `;background:#dca368;border:4.5px solid ${INK};border-radius:17px 14px 16px 13px/14px 17px 13px 16px;box-shadow:0 5px 0 #0006`;
    const g = "#b8783e";
    add(`<svg viewBox="0 0 219 133" style="left:0;top:0;width:100%;height:100%;overflow:visible" fill=none stroke-linecap=round>
      <path d="M22 4.5q18 -1.6 36 0t34 0M128 4.2q16 1.4 30 0t26 .3M30 128.6q22 1.5 42 0t30 0M140 128.8q14 -1.2 28 0t22 0" stroke=${g} stroke-width=1.6 />
      <path d="M4.5 22q-1.4 14 0 26M214.5 86q1.4 14 0 26" stroke=${g} stroke-width=1.6 />
      ${[[4.5, 4.5], [214.5, 4.5], [4.5, 128.5], [214.5, 128.5]].map(([x, y]) => `<circle cx=${x} cy=${y} r=1.9 fill=${INK} />`).join("")}</svg>`, "", bd);
    const win = add(`<div></div>`, `left:9px;top:9px;width:201px;height:115px;border:3px solid ${INK};border-radius:8px;overflow:hidden;background:#5b3a22`, bd);

    // 絵札 (クリーム色の厚紙)。上の札ほど手前
    const card = (bg, inner) => add(`<div>${inner}</div>`,
      `left:0;top:0;width:100%;height:100%;background:${bg};border:2.5px solid ${INK};border-radius:6px;overflow:hidden;box-shadow:inset 0 0 0 2.5px #fff8,inset 0 -5px 0 #331c1612`, win);
    const cover = card("#fff4dc", `<div style="left:12px;top:15px;font:500 27px/1 ${KAMI_KF};color:${INK};white-space:nowrap">はじまり</div>
      <div style="right:10px;top:58px;font:500 27px/1 ${KAMI_KF};color:${INK};white-space:nowrap">はじまり〜</div>
      <div style="right:14px;top:12px;font-size:17px;color:#e98aa0">✿</div><div style="left:14px;top:66px;font-size:15px;color:#9fc77e">✿</div>`);
    const items = MENU.map((it, i) => { const [col, dark] = kamiCol(it);
      const c = card(KAMI_PAPER[i % KAMI_PAPER.length], `
        <div class=st style="left:5px;top:5px;height:27px;display:flex;border:2.5px solid ${INK};border-radius:13px 7px 7px 13px;background:#fffaf0;overflow:hidden;white-space:nowrap">
          <span style="display:flex;align-items:center;gap:4px;padding:0 6px 0 6px;background:${col};color:#fff;font:900 13px/1 ${KAMI_ZF};border-right:2px solid ${INK}"><i style="display:block;width:7px;height:7px;border-radius:50%;background:#fffaf0;border:1.5px solid ${INK}"></i>${cname(it)}</span>
          <span style="display:flex;align-items:center;padding:0 7px 0 6px;color:${dark};font:900 18px/1 ${KAMI_ZF}">${kamiPrice(it)}</span></div>
        <div class=kico style="right:6px;top:4px;width:41px;height:41px;border-radius:50%;background:#fffaf0;border:2.5px solid ${INK};font-size:21px;line-height:36px;text-align:center;rotate:-6deg">${it.icon}</div>
        <div class=knm style="left:50%;top:54px;translate:-50% 0;white-space:nowrap;font:500 30px/1 ${KAMI_KF};color:${INK};-webkit-text-stroke:.7px ${INK}">${it.name}</div>
        <svg viewBox="0 0 120 8" preserveAspectRatio=none style="left:50%;top:91px;width:120px;height:7px;translate:-50% 0;overflow:visible"><path d="M2 4q7.5 -4 15 0t15 0t15 0t15 0t15 0t15 0t15 0t13 0" fill=none stroke=${col} stroke-width=2.4 stroke-linecap=round opacity=.55 /></svg>`);
      c.ico = c.querySelector(".kico"); c.nm = c.querySelector(".knm"); c.ul = c.querySelector("svg"); return c; });
    const end = card("#fff4dc", `<div style="left:50%;top:26px;translate:-50% 0;font:500 36px/1 ${KAMI_KF};color:${INK};white-space:nowrap;-webkit-text-stroke:.7px ${INK}">おしまい</div>
      <div style="left:50%;top:72px;translate:-50% 0;font:500 15px/1 ${KAMI_KF};color:#8a6248;white-space:nowrap">また みてね ✿</div>`);
    const stack = [cover, ...items, end]; stack.forEach((c, i) => c.style.zIndex = stack.length - i);

    // 左右の小さな扉。枠の内側で開き、開ききる前に消えるので外にはみ出さない
    const doors = [0, 1].map(i => add(`<div><div style="left:6px;top:7px;right:6px;bottom:7px;border:2px solid #b77a42;border-radius:5px"></div>
      <div style="${i ? "left" : "right"}:7px;top:50%;width:11px;height:11px;margin-top:-5.5px;border-radius:50%;background:#8a5530;border:2.5px solid ${INK}"></div>
      <div style="left:50%;top:50%;translate:-50% -50%;font-size:20px;color:#c9874b">✿</div></div>`,
      `${i ? "right" : "left"}:0;top:0;width:50%;height:100%;background:#e9b67c;border:2.5px solid ${INK};border-radius:4px;z-index:50;transform-origin:${i ? "100%" : "0"} 50%`, win));
    const doorKf = i => [{ transform: "perspective(380px) rotateY(0)", opacity: 1 }, { transform: `perspective(380px) rotateY(${i ? 72 : -72}deg)`, opacity: 1, offset: .7 }, { transform: `perspective(380px) rotateY(${i ? 90 : -90}deg)`, opacity: 0 }];
    const doorsOpen = () => Promise.all(doors.map((d, i) => anim(d, doorKf(i), 620, { easing: "ease-in" })));
    const doorsClose = () => Promise.all(doors.map((d, i) => anim(d, doorKf(i).reverse(), 520, { easing: "ease-out" })));

    // 丸い文字の読み込みを待ってから、演出名を札の幅に収まる大きさにする (一番長い名前でも読める大きさ)
    const lk = document.getElementById("mfont"), txt = MENU.map(it => it.name + cname(it) + kamiPrice(it)).join("") + "はじまり〜おしまいまたみてね";
    await Promise.race([wait(2500), (async () => {
      if (lk && !lk.sheet) await new Promise(r => { lk.addEventListener("load", r, { once: true }); lk.addEventListener("error", r, { once: true }); });
      await Promise.all(['500 30px "Kiwi Maru"', '900 18px "Zen Maru Gothic"'].map(f => document.fonts.load(f, txt).catch(() => {})));
    })()]);
    for (const c of items) { let fs = 31; c.nm.style.fontSize = fs + "px"; while (c.nm.offsetWidth > 180 && fs > 14) c.nm.style.fontSize = --fs + "px";
      c.ul.style.width = Math.min(150, c.nm.offsetWidth * .8) + "px"; }

    // 札を引き抜く: 少しつまんでから、シュッと左へ。枠の窓で切り抜かれて消える
    const whoosh = () => { const e = add(`<svg viewBox="0 0 60 40" style="overflow:visible" fill=none stroke-linecap=round>
        <path d="M58 8H22M50 20H6M58 32H26" stroke=#fffaf0 stroke-width=7.5 /><path d="M58 8H22M50 20H6M58 32H26" stroke=${INK} stroke-width=3.5 /></svg>`,
        `left:${bx - 66}px;top:${by + 2}px;width:60px;height:40px;z-index:13`);
      anim(e, [{ transform: "translateX(26px)", opacity: 0 }, { transform: "none", opacity: 1, offset: .35 }, { transform: "translateX(-22px)", opacity: 0 }], 380).then(() => e.remove()); };
    const pull = async c => { c.style.boxShadow += ",6px 0 0 #331c1640";
      await anim(c, [{ transform: "none" }, { transform: "translateX(-12px)" }], 150); await wait(60);
      bob(4, 360); whoosh();
      await anim(c, [{ transform: "translateX(-12px)" }, { transform: "translateX(-215px)" }], 230, { easing: "cubic-bezier(.5,0,.9,.6)" }); c.remove(); };
    const popIcon = c => c.ico && anim(c.ico, [{ transform: "scale(.6)" }, { transform: "scale(1.18)", offset: .6 }, { transform: "none" }], 300);

    await raise(); await wait(250);
    await doorsOpen(); await wait(750); // 表紙「はじまり はじまり〜」
    for (let i = 0; i < items.length; i++) { await pull(stack[i]); popIcon(items[i]); await wait(2000); }
    await pull(stack[items.length]); await wait(650); // 「おしまい」の札
    await doorsClose(); await wait(250);
    await lower(); await wait(500);
  },
});
}
