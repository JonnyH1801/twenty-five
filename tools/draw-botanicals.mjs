/* ---------------------------------------------------------------
   draw-botanicals.mjs

   Draws the botanical silhouettes by hand, in code.

   Anna Atkins made the first photographically illustrated book in
   1843 by laying algae and ferns straight onto cyanotype paper and
   letting the sun do the rest. White specimen, Prussian blue ground.
   That is the reference for this whole site, so the plants are
   generated the way a pressed specimen actually grows: a spine, a
   taper, and just enough asymmetry that nothing looks stamped.

   Seeded, so the output is identical every run.

     node tools/draw-botanicals.mjs

   Writes media/botanical/*.svg
   --------------------------------------------------------------- */

import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const OUT = join(dirname(fileURLToPath(import.meta.url)), "..", "media", "botanical");
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

/* -- one leaf: two cubics meeting at base and tip -------------
   A blade that leaves the stem at `angle`, runs `len` long, bulges
   `wid` at its widest, and bends by `bend`. Bending both edges the
   same way is what stops it reading as a geometric lens.          */
function blade(x, y, angle, len, wid, bend = 0.25) {
  const tx = x + Math.cos(angle) * len;
  const ty = y + Math.sin(angle) * len;
  const p = angle + Math.PI / 2;
  const px = Math.cos(p);
  const py = Math.sin(p);
  const bx = Math.cos(angle + Math.PI / 2) * len * bend;
  const by = Math.sin(angle + Math.PI / 2) * len * bend;

  // Bend has to grow as u², not linearly. Linear displacement is a shear:
  // every point moves in proportion to how far along it is, which just
  // rotates the blade and leaves it dead straight. Squaring it keeps the
  // base anchored and lets the tip swing, which is how a stem actually bends.
  const B = (u) => u * u;
  const o1x = x + Math.cos(angle) * len * 0.3 + px * wid + bx * B(0.3);
  const o1y = y + Math.sin(angle) * len * 0.3 + py * wid + by * B(0.3);
  const o2x = x + Math.cos(angle) * len * 0.72 + px * wid * 0.72 + bx * B(0.72);
  const o2y = y + Math.sin(angle) * len * 0.72 + py * wid * 0.72 + by * B(0.72);

  const i2x = x + Math.cos(angle) * len * 0.72 - px * wid * 0.32 + bx * B(0.72);
  const i2y = y + Math.sin(angle) * len * 0.72 - py * wid * 0.32 + by * B(0.72);
  const i1x = x + Math.cos(angle) * len * 0.3 - px * wid * 0.42 + bx * B(0.3);
  const i1y = y + Math.sin(angle) * len * 0.3 - py * wid * 0.42 + by * B(0.3);

  return (
    `M${n(x)},${n(y)}` +
    `C${n(o1x)},${n(o1y)} ${n(o2x)},${n(o2y)} ${n(tx + bx)},${n(ty + by)}` +
    `C${n(i2x)},${n(i2y)} ${n(i1x)},${n(i1y)} ${n(x)},${n(y)}Z`
  );
}

/* -- a stem that actually curves ------------------------------- */
function stem(x0, y0, x1, y1, bow) {
  const mx = (x0 + x1) / 2;
  const my = (y0 + y1) / 2;
  const dx = x1 - x0;
  const dy = y1 - y0;
  const l = Math.hypot(dx, dy) || 1;
  return {
    d: `M${n(x0)},${n(y0)}Q${n(mx - (dy / l) * bow)},${n(my + (dx / l) * bow)} ${n(x1)},${n(y1)}`,
    at(t) {
      const cx = mx - (dy / l) * bow;
      const cy = my + (dx / l) * bow;
      const u = 1 - t;
      return {
        x: u * u * x0 + 2 * u * t * cx + t * t * x1,
        y: u * u * y0 + 2 * u * t * cy + t * t * y1,
        a: Math.atan2(
          2 * u * (cy - y0) + 2 * t * (y1 - cy),
          2 * u * (cx - x0) + 2 * t * (x1 - cx)
        ),
      };
    },
  };
}

const svg = (w, h, body) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" fill="none" aria-hidden="true">\n${body}\n</svg>\n`;

/* ============================================================
   FERN  — pinnate frond, the classic cyanotype specimen
   ============================================================ */
function fern(seed = 7) {
  const r = rng(seed);
  const W = 460;
  const H = 620;
  const s = stem(W * 0.5, H - 8, W * 0.4, 30, 54);
  const paths = [`<path d="${s.d}" stroke="currentColor" stroke-width="3" stroke-linecap="round"/>`];

  const COUNT = 22;
  for (let i = 0; i < COUNT; i++) {
    const t = 0.05 + (i / COUNT) * 0.93;
    const { x, y, a } = s.at(t);
    // widest a third of the way up, tapering to a point at the tip
    const taper = Math.sin(Math.PI * Math.pow(t, 0.55)) * (1 - t * 0.28);
    const len = (168 + r() * 22) * taper;
    if (len < 12) continue;
    const sweep = 0.86 - t * 0.3; // leaflets angle further forward near the tip
    const wob = (r() - 0.5) * 0.09;
    // each pinna is itself lobed, so it reads as a fern and not a grass seed
    for (const side of [-1, 1]) {
      const ang = a + side * (sweep + wob);
      const L = len * (side < 0 ? 1 : 0.94 + r() * 0.1);
      paths.push(`<path d="${blade(x, y, ang, L, L * 0.17, side * -0.26)}" fill="currentColor"/>`);
      // three small lobes riding the outer edge of each pinna
      for (let k = 1; k <= 3; k++) {
        const u = k / 4;
        const lx = x + Math.cos(ang) * L * u;
        const ly = y + Math.sin(ang) * L * u;
        paths.push(
          `<path d="${blade(lx, ly, ang + side * 0.55, L * 0.2 * (1 - u * 0.5), L * 0.05, 0)}" fill="currentColor"/>`
        );
      }
    }
  }
  return svg(W, H, paths.join("\n"));
}

/* ============================================================
   EUCALYPTUS — round alternating leaves on a wandering stem
   ============================================================ */
function eucalyptus(seed = 21) {
  const r = rng(seed);
  const W = 260;
  const H = 460;
  const s = stem(W * 0.2, H - 6, W * 0.74, 20, -54);
  const paths = [`<path d="${s.d}" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>`];

  const COUNT = 13;
  for (let i = 0; i < COUNT; i++) {
    const t = 0.05 + (i / COUNT) * 0.95;
    const { x, y, a } = s.at(t);
    const side = i % 2 ? 1 : -1;
    const scale = 1 - t * 0.55;
    const len = (74 + r() * 14) * scale;
    const ang = a + side * (1.16 + (r() - 0.5) * 0.18);
    paths.push(`<path d="${blade(x, y, ang, len, len * 0.42, side * 0.16)}" fill="currentColor"/>`);
  }
  return svg(W, H, paths.join("\n"));
}

/* ============================================================
   SEEDHEAD — dandelion clock, all hairline
   ============================================================ */
function seedhead(seed = 41) {
  const r = rng(seed);
  const W = 260;
  const H = 300;
  const cx = W / 2;
  const cy = 118;
  const paths = [
    `<path d="M${cx},${cy + 8}C${cx + 6},${cy + 90} ${cx - 10},${cy + 130} ${cx - 4},${H - 6}" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>`,
  ];

  const COUNT = 46;
  for (let i = 0; i < COUNT; i++) {
    const a = (i / COUNT) * Math.PI * 2 + r() * 0.08;
    const len = 78 + r() * 26;
    const ex = cx + Math.cos(a) * len;
    const ey = cy + Math.sin(a) * len * 0.92;
    paths.push(
      `<path d="M${n(cx)},${n(cy)}L${n(ex)},${n(ey)}" stroke="currentColor" stroke-width="0.9" opacity="0.85"/>`
    );
    // the little parachute of filaments at the end of each seed
    for (let k = -1; k <= 1; k++) {
      const fa = a + k * 0.2;
      paths.push(
        `<path d="M${n(ex)},${n(ey)}L${n(ex + Math.cos(fa) * 9)},${n(ey + Math.sin(fa) * 9)}" stroke="currentColor" stroke-width="0.7" opacity="0.6"/>`
      );
    }
  }
  paths.push(`<circle cx="${cx}" cy="${cy}" r="4" fill="currentColor"/>`);
  return svg(W, H, paths.join("\n"));
}

/* ============================================================
   GRASS — a fan of blades from one base
   ============================================================ */
function grass(seed = 63) {
  const r = rng(seed);
  const W = 380;
  const H = 260;
  const paths = [];
  const COUNT = 9;
  for (let i = 0; i < COUNT; i++) {
    const spread = (i / (COUNT - 1) - 0.5) * 2;
    const bx = W / 2 + spread * 44;
    const len = 176 + r() * 68;
    // every blade leans the same way and arcs the same way, so it reads as
    // grass under wind rather than a firework
    const ang = -Math.PI / 2 + 0.26 + spread * 0.12 + (r() - 0.5) * 0.08;
    const bend = 0.5 + r() * 0.28;
    paths.push(
      `<path d="${blade(bx, H, ang, len, 3.4 + r() * 1.8, bend)}" fill="currentColor" opacity="${n(0.72 + r() * 0.28)}"/>`
    );
  }
  return svg(W, H, paths.join("\n"));
}

/* ============================================================
   ALGAE — dichotomous branching, straight out of Atkins
   ============================================================ */
function algae(seed = 88) {
  const r = rng(seed);
  const W = 300;
  const H = 420;
  const paths = [];

  (function branch(x, y, a, len, w, depth) {
    if (depth === 0 || len < 7) return;
    const ex = x + Math.cos(a) * len;
    const ey = y + Math.sin(a) * len;
    const bow = (r() - 0.5) * len * 0.5;
    const s = stem(x, y, ex, ey, bow);
    paths.push(
      `<path d="${s.d}" stroke="currentColor" stroke-width="${n(w)}" stroke-linecap="round"/>`
    );
    const spread = 0.34 + r() * 0.24;
    branch(ex, ey, a - spread, len * (0.7 + r() * 0.12), w * 0.72, depth - 1);
    branch(ex, ey, a + spread, len * (0.7 + r() * 0.12), w * 0.72, depth - 1);
  })(W / 2, H - 6, -Math.PI / 2, 108, 5.5, 6);

  return svg(W, H, paths.join("\n"));
}

/* ============================================================
   FROND — split palm leaf, the one solid mass in the set
   ============================================================ */
function frond(seed = 104) {
  const r = rng(seed);
  const W = 340;
  const H = 380;
  const cx = W * 0.5;
  const cy = H - 10;
  const paths = [];
  const COUNT = 15;
  for (let i = 0; i < COUNT; i++) {
    const t = i / (COUNT - 1);
    const a = -Math.PI * 0.94 + t * Math.PI * 0.88;
    const len = (188 + r() * 26) * (0.62 + Math.sin(Math.PI * t) * 0.38);
    paths.push(
      `<path d="${blade(cx, cy, a, len, 17 + r() * 6, (t - 0.5) * 0.34)}" fill="currentColor"/>`
    );
  }
  paths.push(
    `<path d="M${cx},${cy}L${cx},${cy - 26}" stroke="currentColor" stroke-width="6" stroke-linecap="round"/>`
  );
  return svg(W, H, paths.join("\n"));
}

/* -- write everything ----------------------------------------- */
const set = {
  fern: fern(),
  eucalyptus: eucalyptus(),
  seedhead: seedhead(),
  grass: grass(),
  algae: algae(),
  frond: frond(),
};

for (const [name, markup] of Object.entries(set)) {
  writeFileSync(join(OUT, `${name}.svg`), markup);
  console.log(`  ${name}.svg  ${markup.length} bytes`);
}
console.log(`\ndrew ${Object.keys(set).length} specimens into media/botanical/`);
