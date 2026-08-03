/* ---------------------------------------------------------------
   draw-shapes.mjs

   The six abstract forms, drawn by hand in code.

   Vocabulary lifted straight off the boho reference images in
   _source/design-inspo: nested arch outlines, bundled hairlines like
   wood grain, a disc packed with stones, solid half-domes, offset
   rings, and stippled dots. Same forms, redrawn in the cyanotype
   palette so they read as white on Prussian blue.

   Seeded, so the output is identical every run.

     node tools/draw-shapes.mjs

   Writes media/shapes/*.svg
   --------------------------------------------------------------- */

import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const OUT = join(dirname(fileURLToPath(import.meta.url)), "..", "media", "shapes");
mkdirSync(OUT, { recursive: true });

/* -- seeded noise so runs are reproducible -------------------- */
function rng(seed) {
  let a = seed >>> 0;
  return () => {
    a += 0x6d2b79f5;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const n = (x) => Math.round(x * 100) / 100;

/* -- a closed organic outline ---------------------------------
   Quadratics through the midpoints of a jittered polygon. The
   midpoint trick is what keeps the curve smooth at every joint
   without having to solve for tangents.                         */
function blob(cx, cy, r, sides, jitter, rand) {
  const p = [];
  for (let i = 0; i < sides; i++) {
    const a = (i / sides) * Math.PI * 2;
    const rr = r * (1 - jitter / 2 + rand() * jitter);
    p.push([cx + Math.cos(a) * rr, cy + Math.sin(a) * rr]);
  }
  const mid = (i) => [
    (p[i][0] + p[(i + 1) % sides][0]) / 2,
    (p[i][1] + p[(i + 1) % sides][1]) / 2,
  ];
  let d = `M${n(mid(sides - 1)[0])},${n(mid(sides - 1)[1])}`;
  for (let i = 0; i < sides; i++) {
    const m = mid(i);
    d += `Q${n(p[i][0])},${n(p[i][1])} ${n(m[0])},${n(m[1])}`;
  }
  return d + "Z";
}

const svg = (w, h, body) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" fill="none" aria-hidden="true">\n${body}\n</svg>\n`;

/* ============================================================
   ARCH — nested arch outlines. The doorway motif.
   ============================================================ */
function arch(seed = 11) {
  const r = rng(seed);
  const W = 400, H = 520;
  const paths = [];
  const COUNT = 8;
  for (let i = 0; i < COUNT; i++) {
    const inset = i * 23 + r() * 3;
    const w = W - 40 - inset * 2;
    if (w < 40) break;
    const x0 = 20 + inset, x1 = x0 + w, rad = w / 2;
    const top = 30 + inset * 0.7;
    const shoulder = top + rad;
    // straight sides, half-round cap
    paths.push(
      `<path d="M${n(x0)},${H - 10}V${n(shoulder)}A${n(rad)},${n(rad)} 0 0 1 ${n(x1)},${n(shoulder)}V${H - 10}"` +
        ` stroke="currentColor" stroke-width="${i === COUNT - 1 ? 3.2 : 1.9}" fill="none"/>`
    );
  }
  return svg(W, H, paths.join("\n"));
}

/* ============================================================
   GRAIN — a bundle of hairlines, the wood-grain sweep from the
   bottom-left of the boho reference.
   ============================================================ */
function grain(seed = 29) {
  const W = 460, H = 300;
  const r = rng(seed);
  const paths = [];
  const COUNT = 22;
  for (let i = 0; i < COUNT; i++) {
    const t = i / (COUNT - 1);
    const y = 40 + t * 210;
    // every line shares one sweep, drifting apart toward the right
    const amp = 46 - t * 16;
    const lift = 30 + t * 18;
    const d =
      `M-10,${n(y + lift * 0.4)}` +
      `C${n(W * 0.22)},${n(y - amp)} ${n(W * 0.46)},${n(y + amp * 0.55)} ${n(W * 0.66)},${n(y - amp * 0.15)}` +
      `S${n(W * 0.9)},${n(y - amp * 0.9)} ${W + 10},${n(y - lift)}`;
    paths.push(
      `<path d="${d}" stroke="currentColor" stroke-width="${n(1.1 + r() * 0.8)}" fill="none" opacity="${n(0.5 + r() * 0.5)}"/>`
    );
  }
  return svg(W, H, paths.join("\n"));
}

/* ============================================================
   PEBBLES — a disc packed with stones. The crazy-paving circle.
   Jittered hex grid so the gaps stay even; a plain random scatter
   clumps and reads as noise instead of masonry.
   ============================================================ */
function pebbles(seed = 47) {
  const r = rng(seed);
  const W = 340, H = 340;
  const cx = W / 2, cy = H / 2, R = 155;
  const cell = 34;
  const paths = [];
  const rowH = cell * 0.87;
  for (let row = -6; row <= 6; row++) {
    const y = cy + row * rowH;
    const offset = (row % 2 ? cell / 2 : 0);
    for (let col = -6; col <= 6; col++) {
      const x = cx + col * cell + offset;
      const jx = x + (r() - 0.5) * 7;
      const jy = y + (r() - 0.5) * 7;
      const dist = Math.hypot(jx - cx, jy - cy);
      if (dist > R - 8) continue;
      // stones shrink slightly toward the rim so the edge reads round
      const edge = Math.min(1, (R - dist) / 34);
      const size = cell * 0.46 * (0.72 + edge * 0.28);
      paths.push(`<path d="${blob(jx, jy, size, 7, 0.5, r)}" fill="currentColor"/>`);
    }
  }
  return svg(W, H, paths.join("\n"));
}

/* ============================================================
   DOME — one solid half-round mass, with a thin ring escaping it.
   The only shape in the set with real weight.
   ============================================================ */
function dome(seed = 61) {
  const W = 380, H = 260;
  const base = H - 12;
  const rad = 120;           // half the span between the two sides
  const x0 = 50, x1 = x0 + rad * 2;
  const shoulder = 26 + rad; // apex lands at y=26, inside the box
  const paths = [
    `<path d="M${x0},${base}V${shoulder}A${rad},${rad} 0 0 1 ${x1},${shoulder}V${base}Z" fill="currentColor"/>`,
    `<circle cx="322" cy="92" r="46" stroke="currentColor" stroke-width="2" fill="none" opacity="0.8"/>`,
  ];
  return svg(W, H, paths.join("\n"));
}

/* ============================================================
   RINGS — concentric circles, centres drifting, so it reads as
   drawn by a hand rather than struck by a compass.
   ============================================================ */
function rings(seed = 83) {
  const r = rng(seed);
  const W = 320, H = 320;
  const paths = [];
  let dx = 0, dy = 0;
  for (let i = 0; i < 9; i++) {
    const rad = 148 - i * 16;
    if (rad < 8) break;
    dx += (r() - 0.5) * 5;
    dy += (r() - 0.5) * 5;
    paths.push(
      `<circle cx="${n(W / 2 + dx)}" cy="${n(H / 2 + dy)}" r="${n(rad)}" stroke="currentColor" stroke-width="${n(1.3 + r() * 1.1)}" fill="none"/>`
    );
  }
  return svg(W, H, paths.join("\n"));
}

/* ============================================================
   STIPPLE — a dotted disc, denser at the centre.
   ============================================================ */
function stipple(seed = 97) {
  const r = rng(seed);
  const W = 300, H = 300;
  const cx = W / 2, cy = H / 2, R = 140;
  const dots = [];
  for (let i = 0; i < 460; i++) {
    // sqrt keeps the scatter even per unit area; the extra power
    // biases it back toward the middle so the rim fades out
    const a = r() * Math.PI * 2;
    const rad = Math.pow(r(), 0.62) * R;
    const x = cx + Math.cos(a) * rad;
    const y = cy + Math.sin(a) * rad;
    const size = 1.1 + (1 - rad / R) * 2.2 + r() * 0.7;
    dots.push(`<circle cx="${n(x)}" cy="${n(y)}" r="${n(size)}" fill="currentColor"/>`);
  }
  return svg(W, H, dots.join("\n"));
}

/* -- write everything ----------------------------------------- */
const set = { arch: arch(), grain: grain(), pebbles: pebbles(), dome: dome(), rings: rings(), stipple: stipple() };
for (const [name, markup] of Object.entries(set)) {
  writeFileSync(join(OUT, `${name}.svg`), markup);
  console.log(`  ${name}.svg  ${markup.length} bytes`);
}
console.log(`\ndrew ${Object.keys(set).length} shapes into media/shapes/`);
