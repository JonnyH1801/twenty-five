# Twenty Five

A birthday site with NFC tags. She taps a tag on her phone, a friend's video opens
with the line they said about her.

Plain HTML/CSS/JS. No build step, no framework, no dependencies. Hosted on GitHub Pages.

---

## The one file you edit

**`js/content.js`** — every word on the site lives there. Her name, the "true things",
your letter, and the list of friends. Save it, refresh the page, done.

Everything else (`index.html`, `css/style.css`, `js/app.js`) you can leave alone.

---

## Adding a friend's video

### 1. Compress the clip

```bash
./tools/add-video.sh ~/Desktop/whatever-sofia-sent.MOV sofia
```

That takes the raw phone video, squeezes it to 720p-ish H.264 (usually 8–20 MB for a
30-second clip), strips it into `media/videos/sofia.mp4`, and grabs a poster frame.

The last word (`sofia`) is the **slug**. Lowercase letters, numbers, and dashes only.
It's what goes on the NFC tag, so keep it short.

Want the poster frame from a different moment? Add the seconds:

```bash
./tools/add-video.sh ~/Desktop/mama.mov mama 4
```

Needs ffmpeg: `brew install ffmpeg`

### 2. Add them to `js/content.js`

The script prints the exact block to paste. Fill in the words:

```js
{
  slug: "sofia",
  name: "Sofía",
  role: "Best friend since forever",
  phrase: "The one line from her video that you want on the screen.",
  video: "sofia.mp4",
  poster: "sofia.jpg",
  accent: "sky",          // sky | azure | cornflower | cream
},
```

Leave `video: null` for anyone who hasn't filmed yet — their card shows up greyed out
as "coming soon" instead of breaking.

### 3. Push it

```bash
git add -A && git commit -m "add sofia" && git push
```

Live in about a minute.

---

## Writing the NFC tags

**Tags to buy:** NTAG215 stickers or cards. ~$10 for 20 on Amazon. NTAG213 also works
(the URLs are short), but 215 has more room and is more forgiving.

**App:** *NFC Tools* — free, on both iPhone and Android.

**For each tag:**

1. Open NFC Tools → **Write** → **Add a record** → **URL / URI**
2. Type the URL for that person:

   ```
   https://YOUR-USERNAME.github.io/REPO-NAME/#/from/sofia
   ```

   (the real URL is printed at the bottom of this file once Pages is live)

3. Tap **Write**, hold the tag to the back of the phone until it confirms.
4. Optional but nice: **Other → Lock tag** so it can never be overwritten by accident.

**Test it before you wrap the box.** Tap the tag with her phone model if you can —
iPhones read tags from the top edge, Androids from the middle of the back.

### If a tag doesn't open anything

- iPhone needs iOS 14+ and the screen on (locked screen is fine, powered off isn't).
- Double-check the slug in the URL matches the `slug:` in `content.js` exactly.
- An unknown slug won't error — it just drops her at the gallery.

---

## Running it locally

```bash
python3 -m http.server 4321
```

Then open http://localhost:4321

To test an NFC link without a tag: http://localhost:4321/#/from/sofia

---

## Swapping her photos

Three photos: `media/photos/her-1.jpg` (hero), `her-2.jpg` (about section),
`her-3.jpg` (letter). Portrait orientation, they get cropped to a 3:4 arch.

Replace the files, keep the names. Shrink them first so the site stays fast:

```bash
sips -Z 1600 -s format jpeg -s formatOptions 78 ~/Desktop/new.jpg --out media/photos/her-1.jpg
```

---

## Colours

Pulled from her blue swatches. Change them in one place — the `:root` block at the top
of `css/style.css`.

| | |
|---|---|
| `--navy-900` `#0B1026` | page background |
| `--navy` `#131936` | Pantone Neon Navy, from her swatch |
| `--cobalt` `#2B5FA8` | the voices section |
| `--azure` `#3D7DCA` | accents |
| `--corn` `#6B9BD1` | card variant |
| `--sky` `#A8C8E8` | "FIVE", links, signature |
| `--cream` `#F3ECE1` | text + the about section |
| `--clay` `#C9805C` | the one warm accent, used sparingly |

---

## Repo notes

- `_source/` holds the original full-size photos and the design references.
  It's gitignored — it doesn't ship, but don't delete it locally.
- `.nojekyll` stops GitHub Pages from mangling anything. Leave it.
- GitHub Pages serves the repo root on the `main` branch.

---

## Live URL

**https://jonnyh1801.github.io/twenty-five/**

So the NFC tag for someone with slug `sofia` gets written with:

```
https://jonnyh1801.github.io/twenty-five/#/from/sofia
```

48 characters — fits on any tag with room to spare.
