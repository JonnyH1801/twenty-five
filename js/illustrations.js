/* ============================================================
   ILLUSTRATIONS.JS

   Seven little drawings, hand-authored as SVG.

   Rules they all follow:
     · line art, currentColor, no fills except where a shape needs mass
     · each one moves on its own, slowly, so the page is alive at rest
     · each one has a bigger reaction on hover, and on tap for phones
       (app.js adds .is-poked for a moment on pointerdown)
     · everything animates transform or opacity, never geometry, so
       Safari behaves and nothing triggers layout
     · stroked shapes that get scaled use vector-effect="non-scaling-stroke"
       so the line weight stays put while the shape moves

   Referenced from content.js by key: art: "heart", quoteArt: "trail", etc.
   ============================================================ */

window.ILLUSTRATIONS = {

  /* ---- la tierra: gira despacio, gira más rápido si la tocas ---- */
  globe: `
<svg viewBox="0 0 100 100" class="ill ill--globe" aria-hidden="true">
  <g class="ill-globe">
    <circle cx="50" cy="50" r="33"/>
    <path d="M17 50h66"/>
    <path d="M23 33h54M23 67h54"/>
    <g class="mer m1"><ellipse cx="50" cy="50" rx="33" ry="33" vector-effect="non-scaling-stroke"/></g>
    <g class="mer m2"><ellipse cx="50" cy="50" rx="33" ry="33" vector-effect="non-scaling-stroke"/></g>
    <g class="mer m3"><ellipse cx="50" cy="50" rx="33" ry="33" vector-effect="non-scaling-stroke"/></g>
  </g>
</svg>`,

  /* ---- el corazón: late ---- */
  heart: `
<svg viewBox="0 0 100 100" class="ill ill--heart" aria-hidden="true">
  <circle class="h-ring" cx="50" cy="54" r="30" vector-effect="non-scaling-stroke"/>
  <path class="h-beat" d="M50 80C24 63 14 47 22 35c7-10 21-8 28 3 7-11 21-13 28-3 8 12-2 28-28 45Z"/>
</svg>`,

  /* ---- su sonrisa derritiendo el glaciar ----
     The sun carries an actual smile, and the ice is faceted and
     angular. Without both of those it just reads as mountains at
     sunrise, which is the other drawing on this page. ---- */
  melt: `
<svg viewBox="0 0 100 100" class="ill ill--melt" aria-hidden="true">
  <g class="m-sun">
    <circle cx="74" cy="24" r="13"/>
    <path class="m-smile" d="M67 25c1.5 5.5 12.5 5.5 14 0"/>
    <g class="m-rays">
      <path d="M74 5V0M91 24h6M86.2 12.2l3.8-3.8M86.2 35.8l3.8 3.8M61.8 12.2 58 8.4"/>
    </g>
  </g>
  <path class="m-ice" d="M4 74 20 30 33 50 46 24 62 74Z"/>
  <path class="m-facet" d="M20 30 26 74M46 24 41 74"/>
  <path d="M2 74h96"/>
  <ellipse class="m-pool" cx="33" cy="78.5" rx="25" ry="3.6"/>
  <g class="m-drips">
    <ellipse class="drip d1" cx="21" cy="68" rx="2.6" ry="3.4"/>
    <ellipse class="drip d2" cx="34" cy="68" rx="2.2" ry="3"/>
    <ellipse class="drip d3" cx="47" cy="68" rx="2.5" ry="3.3"/>
  </g>
</svg>`,

  /* ---- la puerta: se abre a un paisaje ---- */
  door: `
<svg viewBox="0 0 100 100" class="ill ill--door" aria-hidden="true">
  <defs>
    <clipPath id="artDoorClip">
      <path d="M24 88V44a26 26 0 0 1 52 0v44Z"/>
    </clipPath>
  </defs>
  <g clip-path="url(#artDoorClip)">
    <circle class="d-sun" cx="60" cy="40" r="7"/>
    <path class="d-land" d="M18 88 36 60 48 74 62 52 82 88Z"/>
    <path class="d-land2" d="M18 88 30 72 42 88Z"/>
  </g>
  <path class="d-frame" d="M20 90V44a30 30 0 0 1 60 0v46"/>
  <g class="d-panel">
    <path d="M25 88V45a25 25 0 0 1 50 0v43Z" vector-effect="non-scaling-stroke"/>
    <path class="d-plank" d="M33 58h34M33 71h34" vector-effect="non-scaling-stroke"/>
    <circle class="d-knob" cx="67" cy="65" r="2.6" fill="currentColor" stroke="none"/>
  </g>
  <path d="M12 90h76"/>
</svg>`,

  /* ---- el sol: los rayos giran y se estiran ---- */
  sun: `
<svg viewBox="0 0 100 100" class="ill ill--sun" aria-hidden="true">
  <circle class="s-core" cx="50" cy="50" r="15"/>
  <g class="s-rays">
    <path d="M71 50h9M64.9 64.9l6.3 6.3M50 71v9M35.1 64.9l-6.3 6.3M29 50h-9M35.1 35.1l-6.3-6.3M50 29v-9M64.9 35.1l6.3-6.3"/>
  </g>
</svg>`,

  /* ---- el sendero: el camino se dibuja solo hacia la montaña ---- */
  trail: `
<svg viewBox="0 0 160 100" class="ill ill--trail" aria-hidden="true">
  <path class="t-mtn" d="M6 86 44 30 68 60 96 18 132 68 154 86"/>
  <path class="t-mtn2" d="M44 30 55 44 33 44Z"/>
  <path class="t-path" d="M78 98c-8-14 16-18 8-32s10-20 6-32"/>
  <path d="M2 86h156"/>
</svg>`,

  /* ---- el osito: parpadea, y mueve las orejas si lo tocas ---- */
  bear: `
<svg viewBox="0 0 100 100" class="ill ill--bear" aria-hidden="true">
  <g class="b-head">
    <circle class="b-ear b-ear--l" cx="27" cy="30" r="11"/>
    <circle class="b-ear b-ear--r" cx="73" cy="30" r="11"/>
    <circle cx="50" cy="55" r="27"/>
    <g class="b-eyes">
      <path d="M39 50v.6M61 50v.6" stroke-width="5" stroke-linecap="round"/>
    </g>
    <ellipse cx="50" cy="66" rx="13" ry="9"/>
    <path d="M50 61.5v4" />
    <ellipse class="b-nose" cx="50" cy="60" rx="4" ry="2.8" fill="currentColor" stroke="none"/>
    <path d="M50 65.5c0 3-3.5 3.5-5 2M50 65.5c0 3 3.5 3.5 5 2"/>
  </g>
</svg>`,
};
