# DESIGN.md

## The idea

**Cianotipia.** Anna Atkins, 1843, made the first photographically illustrated
book by laying algae and ferns onto sensitised paper and leaving them in the sun.
Everything the specimen covered stayed pale. Everything else turned Prussian blue.

That is the whole system. Blue is not an accent on this site, it is the paper.
The plants are the absence of it.

Color strategy: **drenched**. Three of the four sections are saturated blue
ground to edge. The fourth is warm paper, on purpose, because that section is a
letter.

## Color

Authored in OKLCH. Chroma stays low near both lightness extremes.

| Token | Value | Job |
|---|---|---|
| `--ink` | `oklch(0.185 0.052 249)` | deepest exposure. page ground, voices section |
| `--prussian` | `oklch(0.265 0.068 246)` | the classic cyanotype blue. about section |
| `--marine` | `oklch(0.375 0.082 243)` | large specimens, dark cards |
| `--wash` | `oklch(0.615 0.072 236)` | "CINCO", small labels, hairlines |
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
- **Sway and drift.** Specimens use `rotate` keyframes for sway and JS-set
  `translate` for scroll parallax. Separate CSS properties, so they compose
  instead of overwriting each other. Durations are all coprime-ish (13/15/17/19/
  21/23s) so nothing ever syncs up.
- `prefers-reduced-motion` kills all of it.

## The specimens

Six botanical silhouettes, drawn in code by `tools/draw-botanicals.mjs`, seeded
so runs are reproducible. Fern, eucalyptus, seedhead, grass, algae, frond.

They are applied as CSS `mask-image`, not `<img>`, so one file can be any color
at any size and can be animated.

The one non-obvious bit of the generator: leaf bend has to grow as `u²` along
the blade. Linear displacement is a shear, which just rotates the leaf and
leaves it dead straight.

## Layout

- Left rail nav at ≥1100px, full-screen drawer below.
- The "cosas ciertas" list is a herbarium sheet: hairline rules, leading
  specimen numbers, even rows indented so the left edge is not a straight line.
- Cards are `auto-fit / minmax(265px, 1fr)`, no breakpoints.
- Photos are arches (`border-radius: 999px 999px 8px 8px`) with a plate number
  set in italic underneath.

## Deliberately not

- No em dashes anywhere in the copy.
- No gradient text, no glassmorphism, no side-stripe borders.
- No icon library. No emoji.
- Not editorial-typographic (display serif + mono labels + rules). That lane is
  saturated. This is a herbarium sheet, which is a different thing.
