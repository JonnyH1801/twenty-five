# PRODUCT.md

## What this is

A single-page birthday gift. One person will ever use it.

Her boyfriend collected short video messages from the people who love her. Each
video lives at its own URL. Physical NFC tags in a keepsake box carry those URLs.
She taps a tag against her phone and that person appears, says their thing, and
the line they said sits on screen underneath in large type.

The site is the container for that ritual. It has to survive being opened at 2am
in five years and still feel like a gift, not a webpage.

**Register:** brand. The design IS the product. There is no task to complete, no
conversion to optimize. The only metric is whether she feels something.

## Users

One user: the girlfriend, turning 25. Spanish speaker — the entire interface is
in Spanish, no language toggle, no English fallback.

Secondary: her boyfriend Jonathan, who edits `js/content.js` to add people as
videos come in. He is technical enough to run a shell script and edit a JS object.

## Context of use

Almost always a phone, held in one hand, because that is the only device that
reads NFC. Often at night, often alone, often re-opening a video she has already
seen. Occasionally shown to someone else across a table.

Desktop matters only because he will use it while building the thing.

## Tone

Warm. Unembarrassed. Specific.

The failure mode is greeting-card language: generic superlatives, exclamation
marks, "you're amazing!!". The copy should sound like one person who knows her
well, writing at close range.

Spanish should read as natural first-language Spanish, not translated English.
`tú`, never `usted`. Full punctuation including `¿` and `¡`.

## Anti-references

- Greeting-card / party-invite aesthetics. Balloons, confetti, streamers, cake
  icons, "Happy Birthday!" in a script font on a pastel gradient.
- Wedding-website templates. Rose gold, thin all-caps sans, centered everything.
- The editorial-typographic lane (display serif italic + small mono labels +
  ruled separators). The current build is exactly this and it needs to leave.
- Generic SaaS landing page structure. Hero, three feature cards, testimonial
  grid, footer.
- Anything that reads as a template she has seen before.

## Strategic principles

1. **Blue is the brief.** She loves blue. The reference material Jonathan supplied
   is a Pantone Neon Navy chip and a stack of blue fabric named Sky through
   Midnight. Blue is not an accent here, it is the medium.
2. **Hand-made over rendered.** Illustrations should look drawn by a person.
   Custom SVG, visible hand, no icon libraries, no stock vectors, no emoji.
3. **The videos are the point.** Every design decision defers to the moment a tag
   opens someone's face on screen. Nothing may delay or decorate that.
4. **It must not break.** No build step, no framework, no dependencies that can
   rot. It has to still work in ten years on a phone that does not exist yet.
5. **Photos of her are real photos.** Not decorative shapes. She is in this.

## Constraints

- Static files on GitHub Pages. No server, no build.
- Deep-link routing must stay hash-based (`#/from/<slug>`) so NFC tags keep working.
- Videos are self-hosted MP4 in-repo, compressed to roughly 10-20 MB each.
- Must degrade gracefully: a friend with no video yet still gets a card.
- `prefers-reduced-motion` respected.
