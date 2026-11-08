// 視聴者「ザリガニ」の絵 (ハムと同じ太い焦げ茶の線)。poc.js の後に読み込む。
// zariSvg(o) は SVG の文字列、zari(x, y, w, o) は舞台に置いた要素を返す。大きさは幅 w、高さ w*1.1。
// o: { color: 体の色, face: "smile" | "sad" | "angry" | "shock" | "evil", acc: "crown" | "tie" | "glasses" | "helmet" | "chef",
//      flip: 左右反転, extra: viewBox(0 0 120 132) の中に足す SVG, z, parent }
const zariSvg = (o = {}) => {
  const c = o.color || "#e8553b", d = o.dark || "#b83a26", L = `stroke=${INK} stroke-width=4 stroke-linejoin=round stroke-linecap=round`;
  const claw = s => `<g transform="${s < 0 ? "" : "translate(120 0) scale(-1 1)"}"><path d="M40 70Q26 64 22 50" fill=none ${L} stroke-width=9 /><path d="M40 70Q26 64 22 50" fill=none stroke=${c} stroke-width=3 stroke-linecap=round />
    <path d="M23 52C6 50 2 30 10 18C14 12 22 12 24 18L22 30L30 24C36 30 34 46 23 52Z" fill=${c} ${L} /><path d="M12 22Q14 30 20 32" fill=none stroke=${d} stroke-width=2.5 stroke-linecap=round /></g>`;
  const faces = {
    smile: `<path d="M52 84Q56 89 60 84Q64 89 68 84" fill=none ${L} stroke-width=3 />`,
    sad: `<path d="M52 89Q60 82 68 89" fill=none ${L} stroke-width=3 /><path d="M41 37l-2 6M79 37l2 6" stroke=#7cc4ff stroke-width=3 stroke-linecap=round />`,
    angry: `<path d="M53 88Q60 84 67 88" fill=none ${L} stroke-width=3 /><path d="M39 24L54 30M81 24L66 30" ${L} stroke-width=3.5 />`,
    shock: `<ellipse cx=60 cy=87 rx=5 ry=6 fill=#7a1f14 ${L} stroke-width=3 />`,
    evil: `<path d="M50 83Q60 92 70 83" fill=#7a1f14 ${L} stroke-width=3 /><path d="M40 25L54 31M80 25L66 31" ${L} stroke-width=3.5 />`,
  };
  const pupils = o.face === "shock" ? `<circle cx=47 cy=34 r=2.4 fill=${INK} /><circle cx=73 cy=34 r=2.4 fill=${INK} />` : `<circle cx=48 cy=35 r=4 fill=${INK} /><circle cx=72 cy=35 r=4 fill=${INK} /><circle cx=49.5 cy=33.5 r=1.4 fill=#fff /><circle cx=73.5 cy=33.5 r=1.4 fill=#fff />`;
  const acc = {
    crown: `<path d="M44 14L48 2L55 10L60 0L65 10L72 2L76 14Z" fill=#ffd23c ${L} stroke-width=3 />`,
    tie: `<path d="M57 92L63 92L65 96L60 116L55 96Z" fill=#2f5fb8 ${L} stroke-width=2.5 />`,
    glasses: `<circle cx=47 cy=34 r=9 fill=none ${L} stroke-width=3 /><circle cx=73 cy=34 r=9 fill=none ${L} stroke-width=3 /><path d="M56 34H64" ${L} stroke-width=3 />`,
    helmet: `<path d="M38 30Q60 4 82 30Z" fill=#7d8a6a ${L} stroke-width=3 />`,
    chef: `<path d="M44 22Q38 8 50 8Q54 0 62 4Q72 0 74 10Q84 10 76 22Z" fill=#fff ${L} stroke-width=3 />`,
  }[o.acc] || "";
  return `<svg viewBox="0 0 120 132" style="left:0;top:0;width:100%;height:100%;overflow:visible${o.flip ? ";transform:scaleX(-1)" : ""}">
    <path d="M54 44Q44 20 24 6M66 44Q76 20 96 6" fill=none stroke=${INK} stroke-width=2.6 stroke-linecap=round />
    <path d="M48 124L60 112L72 124L66 130L60 126L54 130Z" fill=${d} ${L} />
    <path d="M44 100Q60 92 76 100L72 116Q60 120 48 116Z" fill=${c} ${L} /><path d="M47 108Q60 104 73 108" fill=none stroke=${d} stroke-width=2.5 />
    ${[0, 1, 2].map(k => `<path d="M${38 - k} ${86 + k * 6}L${26 - k * 2} ${92 + k * 7}M${82 + k} ${86 + k * 6}L${94 + k * 2} ${92 + k * 7}" ${L} stroke-width=3.5 />`).join("")}
    ${claw(-1)}${claw(1)}
    <ellipse cx=60 cy=76 rx=25 ry=27 fill=${c} ${L} /><path d="M42 90Q60 98 78 90" fill=none stroke=${d} stroke-width=2.5 />
    <ellipse cx=45 cy=82 rx=5 ry=3.4 fill=#ff9aa6 opacity=.8 /><ellipse cx=75 cy=82 rx=5 ry=3.4 fill=#ff9aa6 opacity=.8 />
    <path d="M52 52L48 42M68 52L72 42" ${L} stroke-width=5 /><path d="M52 52L48 42M68 52L72 42" stroke=${c} stroke-width=1.5 />
    <circle cx=47 cy=35 r=9 fill=#fff ${L} stroke-width=3.5 /><circle cx=73 cy=35 r=9 fill=#fff ${L} stroke-width=3.5 />${pupils}
    ${faces[o.face || "smile"] || faces.smile}${acc}${o.extra || ""}</svg>`;
};
const zari = (x, y, w = 80, o = {}) => add(`<div>${zariSvg(o)}</div>`, `left:${x}px;top:${y}px;width:${w}px;height:${w * 1.1}px;z-index:${o.z ?? 15}`, o.parent || s);
