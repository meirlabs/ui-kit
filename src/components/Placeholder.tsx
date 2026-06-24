// Empty-state placeholder graphic — the "Neumorph" house style: an embossed
// wireframe motif sitting inside a soft, raised card frame. Used wherever there
// is no data yet (no clients, no documents, no results, no appointments).
//
// Each `subject` is drawn (NOT an icon) as a small scene that depicts what is
// missing. Purely decorative (aria-hidden), token-driven (so it tracks the
// surface/border palette and light/dark theme), fixed-size (no layout shift),
// and deterministic — all coords are rounded so SSR and client serialize
// identically (no hydration drift).
//
// Adapted from the source handoff for ui-kit: colors map to --ml-* tokens
// (applied via `style` so var()/color-mix resolve), and the embossed shadow is
// theme-aware (see .ml-placeholder in components.css).

import { type CSSProperties } from "react";

export type PlaceholderSubject = "clients" | "documents" | "search" | "calendar";

const r2 = (n: number) => Math.round(n * 100) / 100;

type Role = "solid" | "soft" | "detail" | "outline" | "accent";
type Shape =
  | { k: "rect"; x: number; y: number; w: number; h: number; rx: number; role: Role }
  | { k: "circle"; cx: number; cy: number; r: number; role: Role }
  | { k: "path"; d: string; role: Role }
  | { k: "line"; x1: number; y1: number; x2: number; y2: number; role: Role };

function bust(cx: number, top: number, baseY: number, halfW: number, cyHead: number, rHead: number, role: Role): Shape[] {
  return [
    { k: "path", d: `M${r2(cx - halfW)} ${r2(baseY)} Q${r2(cx - halfW)} ${r2(top)} ${r2(cx)} ${r2(top)} Q${r2(cx + halfW)} ${r2(top)} ${r2(cx + halfW)} ${r2(baseY)} Z`, role },
    { k: "circle", cx: r2(cx), cy: r2(cyHead), r: r2(rHead), role },
  ];
}

function buildMotif(subject: PlaceholderSubject, s: number): Shape[] {
  const f = (n: number) => r2(n * s);

  if (subject === "documents") {
    return [
      { k: "rect", x: f(0.4), y: f(0.16), w: f(0.3), h: f(0.44), rx: f(0.04), role: "soft" },
      { k: "rect", x: f(0.3), y: f(0.22), w: f(0.34), h: f(0.5), rx: f(0.045), role: "solid" },
      { k: "rect", x: f(0.36), y: f(0.33), w: f(0.22), h: f(0.028), rx: f(0.014), role: "detail" },
      { k: "rect", x: f(0.36), y: f(0.41), w: f(0.22), h: f(0.028), rx: f(0.014), role: "detail" },
      { k: "rect", x: f(0.36), y: f(0.49), w: f(0.15), h: f(0.028), rx: f(0.014), role: "detail" },
    ];
  }

  if (subject === "clients") {
    return [
      ...bust(f(0.32), f(0.59), f(0.78), f(0.16), f(0.43), f(0.1), "soft"),
      ...bust(f(0.68), f(0.59), f(0.78), f(0.16), f(0.43), f(0.1), "soft"),
      { k: "circle", cx: f(0.5), cy: f(0.44), r: f(0.16), role: "outline" },
      ...bust(f(0.5), f(0.61), f(0.85), f(0.22), f(0.45), f(0.13), "solid"),
    ];
  }

  if (subject === "search") {
    return [
      { k: "rect", x: f(0.4), y: f(0.14), w: f(0.3), h: f(0.42), rx: f(0.04), role: "soft" },
      { k: "rect", x: f(0.26), y: f(0.2), w: f(0.34), h: f(0.5), rx: f(0.045), role: "solid" },
      { k: "rect", x: f(0.32), y: f(0.3), w: f(0.22), h: f(0.026), rx: f(0.013), role: "detail" },
      { k: "rect", x: f(0.32), y: f(0.38), w: f(0.2), h: f(0.026), rx: f(0.013), role: "detail" },
      { k: "circle", cx: f(0.64), cy: f(0.64), r: f(0.16), role: "soft" },
      { k: "circle", cx: f(0.64), cy: f(0.64), r: f(0.16), role: "outline" },
      { k: "line", x1: f(0.755), y1: f(0.755), x2: f(0.87), y2: f(0.87), role: "accent" },
    ];
  }

  // calendar
  const body: Shape[] = [
    { k: "rect", x: f(0.22), y: f(0.26), w: f(0.56), h: f(0.46), rx: f(0.05), role: "solid" },
    { k: "rect", x: f(0.22), y: f(0.26), w: f(0.56), h: f(0.13), rx: f(0.05), role: "soft" },
    { k: "line", x1: f(0.36), y1: f(0.2), x2: f(0.36), y2: f(0.31), role: "accent" },
    { k: "line", x1: f(0.64), y1: f(0.2), x2: f(0.64), y2: f(0.31), role: "accent" },
  ];
  const dots: Shape[] = [];
  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 4; col++) {
      dots.push({ k: "rect", x: f(0.3 + col * 0.11), y: f(0.45 + row * 0.08), w: f(0.05), h: f(0.05), rx: f(0.012), role: "detail" });
    }
  }
  return [...body, ...dots];
}

function svgEl(
  sh: Shape,
  attrs: { style: CSSProperties; strokeWidth?: number; strokeLinecap?: "round"; filter?: string },
  key: number,
) {
  if (sh.k === "rect") return <rect key={key} x={sh.x} y={sh.y} width={sh.w} height={sh.h} rx={sh.rx} {...attrs} />;
  if (sh.k === "circle") return <circle key={key} cx={sh.cx} cy={sh.cy} r={sh.r} {...attrs} />;
  if (sh.k === "line") return <line key={key} x1={sh.x1} y1={sh.y1} x2={sh.x2} y2={sh.y2} strokeLinecap="round" {...attrs} />;
  return <path key={key} d={sh.d} {...attrs} />;
}

export function Placeholder({ subject, size = 88 }: { subject: PlaceholderSubject; size?: number }) {
  const s = size;
  const shapes = buildMotif(subject, s);
  const uid = `ph-${subject}`;
  return (
    <div
      className="ml-placeholder"
      style={{ width: s, height: s, borderRadius: r2(s * 0.3) }}
      aria-hidden="true"
    >
      <svg
        width={s}
        height={s}
        viewBox={`0 0 ${s} ${s}`}
        fill="none"
        style={{ position: "absolute", inset: 0 }}
      >
        <defs>
          <filter id={`ne-${uid}`} x="-30%" y="-30%" width="160%" height="160%">
            <feDropShadow dx="1.5" dy="2" stdDeviation="1.6" floodColor="#000000" floodOpacity="0.18" />
          </filter>
        </defs>
        {shapes.map((sh, i) => {
          // colors go through `style` (CSS) so var()/color-mix resolve reliably
          if (sh.role === "solid")
            return svgEl(sh, { style: { fill: "var(--ml-ph-paper)", stroke: "var(--ml-ph-line)" }, strokeWidth: 1, filter: `url(#ne-${uid})` }, i);
          if (sh.role === "soft") return svgEl(sh, { style: { fill: "var(--ml-ph-soft)" } }, i);
          if (sh.role === "detail") return svgEl(sh, { style: { fill: "var(--ml-ph-mark)" } }, i);
          if (sh.role === "outline")
            return svgEl(sh, { style: { fill: "var(--ml-ph-paper)", stroke: "var(--ml-ph-mark)" }, strokeWidth: 1.6 }, i);
          return svgEl(sh, { style: { fill: "none", stroke: "var(--ml-ph-mark)" }, strokeWidth: 2.4, strokeLinecap: "round" }, i);
        })}
      </svg>
    </div>
  );
}
