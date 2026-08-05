# DESIGN.md

## The idea

**Cianotipia.** Anna Atkins, 1843, made the first photographically illustrated
book by laying algae and ferns onto sensitised paper and leaving them in the sun.
Everything the specimen covered stayed pale. Everything else turned Prussian blue.

That is the whole system. Blue is not an accent on this site, it is the paper.
The shapes are the absence of it.

Color strategy: **drenched**. Three of the four sections are saturated blue
ground to edge. The fourth is warm paper, on purpose, because that section is a
letter.

## Color

Authored in OKLCH. Chroma stays low near both lightness extremes.

| Token | Value | Job |
|---|---|---|
| `--ink` | `oklch(0.185 0.052 249)` | deepest exposure. page ground, voices section |
| `--prussian` | `oklch(0.265 0.068 246)` | the classic cyanotype blue. about section |
| `--marine` | `oklch(0.375 0.082 243)` | the large background shapes, dark cards |
| `--wash` | `oklch(0.615 0.072 236)` | the drawings, small labels, hairlines |
| `--pale` | `oklch(0.815 0.045 232)` | light card ground, secondary type on dark |
| `--frost` | `oklch(0.930 0.022 228)` | unexposed paper. the "white" |
| `--paper` | `oklch(0.947 0.014 88)` | warm stock. the letter section only |
| `--iron` | `oklch(0.685 0.108 62)` | ferric ochre. the handwriting and one hairline. nothing else |

`--iron` is the only warm color in the blue sections and it appears exactly twice.
That is the point. Spending it anywhere else flattens it.

Every text/background pair on the page clears WCAG AA (worst measured 5.02:1).
The trap is stacked opacity: a label at `opacity:.6` inside a card at
`opacity:.8` is really at `.48`. Multiply before trusting a number.

## Type

| Role | Family | Notes |
|---|---|---|
| Display | **Bodoni Moda** | variable, `font-optical-sizing:auto`. 900 for the hero, 700 for headings, 500 italic for quotes. The 19th-century botanical-plate voice |
| Interface | **Archivo** | all body copy, small caps labels, buttons |
| Hand | **Playwrite ES** | the Spanish primary-school handwriting model. "feliz cumpleaños" and the signature. Nothing else |

Playwrite **ES** specifically, not Playwrite in general. It is the cursive
children are taught to write in Spanish-speaking schools, so the handwriting on
a Spanish-language site is the handwriting she actually learned.

Bodoni hairlines vanish at display sizes, so the hero runs at weight 900.

## Motion

- `--expo: cubic-bezier(0.16, 1, 0.30, 1)`. Everything eases out. Nothing bounces.
- **Expose.** Hero letters are individual spans that come up from blur, 52ms
  apart. Held until `document.fonts.ready` so they do not expose in a fallback
  serif and then snap width.
- **Photos stay in full colour.** An earlier build tinted them with a cyanotype
  duotone to pull them into the palette. It fought the one warm human thing on
  the page, so it is gone. The arch is a fixed frame and the photo pushes in
  inside it on hover instead, `scale: 1.06` over 1.1s, with the whole plate
  lifting 8px. Colour never changes.
- **Sway and drift.** Shapes use `rotate` keyframes for sway and JS-set
  `translate` for scroll parallax. Separate CSS properties, so they compose
  instead of overwriting each other. Durations are all coprime-ish (13/15/17/19/
  21/23s) so nothing ever syncs up.
- `prefers-reduced-motion` kills all of it.

## The shapes

Six abstract forms, drawn in code by `tools/draw-shapes.mjs`, seeded so runs are
reproducible.

| | |
|---|---|
| `arch` | nested arch outlines, the doorway motif |
| `grain` | a bundle of hairlines sweeping like wood grain |
| `pebbles` | a disc packed with stones, crazy-paving |
| `dome` | one solid half-round mass with a thin ring escaping it |
| `rings` | concentric circles, centres drifting |
| `stipple` | a dotted disc, denser at the middle |

The vocabulary comes straight off the boho reference images in
`_source/design-inspo`. An earlier build used botanical silhouettes (fern,
eucalyptus, algae) and they were replaced: the plants read as a motif of their
own rather than as ground.

They are applied as CSS `mask-image`, not `<img>`, so one file can be any color
at any size and can be animated.

Two things the generator gets right that are easy to get wrong:

- **Stones use a jittered hex grid, not a random scatter.** Random points clump,
  and clumping reads as noise instead of masonry.
- **The dome's arc apex has to land inside the viewBox.** A semicircle spanning
  280px needs 140px of headroom above its shoulder; put the shoulder too low and
  the top silently clips flat.

## The seven drawings

`js/illustrations.js`. Hand-authored inline SVG, one per idea in section 02
plus the bear on the signature: globe, heart, melt, door, sun, trail, bear.

They are injected as real inline SVG rather than `<img>` because each has
moving parts the stylesheet needs to reach.

Every one idles on its own so the page is alive at rest, and does something
larger on interaction. Phones have no hover, so `app.js` adds `.is-poked` for
1.4s on `pointerdown` and every hover rule matches that class too.

Only `transform`, `opacity` and `stroke-dashoffset` animate. Nothing touches
SVG geometry attributes, which keeps Safari happy and avoids layout. Stroked
shapes that get scaled carry `vector-effect="non-scaling-stroke"` so the line
weight holds while the shape moves.

Two that needed a second pass:

- **melt** first read as "mountains at sunrise", which is the trail drawing.
  Fixed by putting an actual smile inside the sun and making the ice angular
  and faceted rather than smooth.
- **door** was a bare arch. A knob and two plank lines are what make it read
  as a door rather than another instance of the site's arch motif.

Debugging note: transitions do not advance in a backgrounded tab, so
`getComputedStyle` will report the pre-transition value and look like a broken
rule. Check `document.hidden` before believing it.

## Layout

- Left rail nav at ≥1100px, full-screen drawer below.
- The "cosas ciertas" list reads as a specimen sheet: hairline rules, leading
  numbers, even rows indented so the left edge is not a straight line.
- Cards are `auto-fill / minmax(265px, 1fr)`, no breakpoints. auto-**fill**, because
  auto-fit collapses empty tracks and a lone card would stretch the whole row.
- Photos are arches (`border-radius: 999px 999px 8px 8px`) with a plate number
  set in italic underneath.

## Deliberately not

- No em dashes anywhere in the copy.
- No gradient text, no glassmorphism, no side-stripe borders.
- No icon library. Every drawing is hand-authored for this page.
- Not editorial-typographic (display serif + mono labels + rules). That lane is
  saturated. This is a print archive, which is a different thing.
