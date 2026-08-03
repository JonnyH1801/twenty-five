/* ============================================================
   CONTENT.JS  —  This is the ONLY file you need to edit.
   Everything the website says lives here.
   Save the file, refresh the page, and it updates.
   ============================================================ */

const CONTENT = {

  /* ---- THE BASICS -------------------------------------- */
  // TODO Jonathan: replace with her real name / nickname.
  name: "Mon",
  age: 25,
  birthdayLabel: "August 8th",        // shown small in the hero
  tabTitle: "Happy 25th, Mon",        // browser tab text

  /* ---- 1. HERO ----------------------------------------- */
  hero: {
    eyebrow: "01 — Twenty five trips around the sun",
    script: "happy birthday",          // handwritten line over the big type
    big1: "TWENTY",
    big2: "FIVE",
    subtitle:
      "A little corner of the internet built only for you — " +
      "with the voices of the people who love you living inside it.",
    scrollCue: "keep going",
  },

  /* ---- 2. ABOUT HER ------------------------------------ */
  // TODO Jonathan: rewrite all of these in your own words.
  // Add or remove entries freely — the layout adapts.
  about: {
    eyebrow: "02 — Some true things",
    title: "Twenty-five years of you",
    intro:
      "I could have written one long letter. Instead I wrote down the things " +
      "I never want you to forget about yourself.",
    things: [
      {
        title: "You laugh with your whole face",
        body:
          "Not politely. Not quietly. Your whole face joins in, and it makes " +
          "everyone in the room decide the day is going to be good.",
      },
      {
        title: "You make people feel chosen",
        body:
          "You remember the small thing someone mentioned once, months ago, and " +
          "you bring it back up like it mattered. Because to you, it did.",
      },
      {
        title: "You are braver than you give yourself credit for",
        body:
          "You keep doing the hard thing quietly, without needing anyone to " +
          "clap for it. I clap for it. Constantly.",
      },
      {
        title: "Blue looks like you",
        body:
          "Every shade of it. Sky, cornflower, cobalt, midnight. This whole " +
          "site is made of your favourite colour on purpose.",
      },
    ],
    quote: "Being loved by you is the easiest thing I have ever done.",
  },

  /* ---- 3. THE VOICES SECTION --------------------------- */
  voices: {
    eyebrow: "03 — The voices",
    title: "People who wanted to tell you something",
    intro:
      "Each little tag in your box opens one of these. Tap a card here, or tap " +
      "a tag on your phone, and that person shows up to say it out loud.",
    lockedLabel: "Video coming soon",
  },

  /* ---- 4. FRIENDS + THEIR VIDEOS ----------------------- */
  /*
     HOW TO ADD SOMEONE
     ------------------
     1. Run:  ./tools/add-video.sh ~/Desktop/whatever.mov maria
        (that compresses the clip into media/videos/maria.mp4
         and grabs a poster frame automatically)
     2. Add an entry below.
     3. Write the NFC tag with the url shown in the README:
           https://<your-site>/#/from/maria

     FIELDS
       slug   — lowercase, no spaces. This is what goes on the NFC tag.
       name   — how she knows them
       role   — "Best friend since 2014", "Her mom", "Roommate", ...
       phrase — THE line from their video. Keep it short and punchy.
       video  — filename inside media/videos/ , or null if not filmed yet
       accent — "sky" | "azure" | "cornflower" | "cream"  (card colour)
  */
  // TODO Jonathan: these three are EXAMPLES. Delete them and add the real people.
  friends: [
    {
      slug: "example-one",
      name: "Sofía",
      role: "Best friend since forever",
      phrase: "You are the only person who has never once made me feel like too much.",
      video: null,
      accent: "sky",
    },
    {
      slug: "example-two",
      name: "Mamá",
      role: "Her mom",
      phrase: "I watched you become exactly the woman I hoped you'd be.",
      video: null,
      accent: "cornflower",
    },
    {
      slug: "example-three",
      name: "Andrés",
      role: "Roommate, 2019–2022",
      phrase: "Nobody throws a Tuesday like you throw a Tuesday.",
      video: null,
      accent: "cream",
    },
  ],

  /* ---- 5. YOUR LETTER ---------------------------------- */
  // TODO Jonathan: this one is yours. Write it properly.
  letter: {
    eyebrow: "04 — From me",
    title: "One more thing",
    body: [
      "I wanted to give you something you couldn't lose in a drawer.",
      "So I asked the people who love you to say the thing out loud — the thing " +
        "they'd say if they weren't worried about being too sentimental. Then I " +
        "put all of it somewhere you can reach any night you need it.",
      "Tap a tag. Any tag. Whenever you want. They'll still be here at thirty, " +
        "and at fifty, and whenever you forget how much room you take up in " +
        "people's lives.",
      "Happy twenty-fifth, my love.",
    ],
    signoff: "always,",
    from: "Jonathan",
  },

  footer: "made by hand · 2026",
};
