/* ============================================================
   CONTENT.JS  —  El único archivo que tienes que editar.
   Todo lo que dice el sitio vive aquí.
   Guardas, corres ./tools/bump.sh, y ya.
   ============================================================ */

const CONTENT = {

  /* ---- LO BÁSICO --------------------------------------- */
  name: "Amor",
  birthdayLabel: "26 de agosto",
  tabTitle: "Felices 25, Amor",

  /* ---- 1. PORTADA -------------------------------------- */
  hero: {
    eyebrow: "01 · Veinticinco vueltas al sol",
    script: "feliz cumpleaños",     // escrito a mano, va arriba del número
    big: "25",
    subtitle:
      "Este es un pequeño regalo para ti y para celebrar tu vida. Aquí vas a " +
      "encontrar videos de personas que te aman mucho y que quieren que lo " +
      "recuerdes siempre.",
    scrollCue: "sigue",
  },

  /* ---- 2. SOBRE TI ------------------------------------- */
  /* art: "globe" | "heart" | "melt" | "door" | "sun" | "trail" | "tap" | "bear"
     Cada una es un dibujito que se mueve solo y reacciona al tocarlo. */
  about: {
    eyebrow: "02 · Sobre ti",
    title: "Veinticinco años desde que llegaste a esta tierra",
    art: "globe",
    intro:
      "Cuando Dios te pensó estoy seguro de que puso niveles de su bondad y " +
      "ternura en ti más allá de lo usual. Puso su Gloria en ti, y estas cosas " +
      "son algunas pocas en las que logro verla cada día a través de ti.",
    things: [
      {
        title: "Tu forma de amar es única",
        art: "heart",
        body:
          "Siempre me sorprendes con la forma en la que amas y sirves a otros. " +
          "Puedes ver a los que nadie más ve y la necesidad de otros, y " +
          "llenarlos de identidad recordando su cumpleaños o sus cosas " +
          "favoritas. Tu simple presencia hace de este mundo un lugar mejor.",
      },
      {
        title: "Tu sonrisa me derrite",
        art: "melt",
        body:
          "No es solo lo hermosa y perfecta que es tu sonrisa, es el gozo que " +
          "veo a través de ella y esa pureza más valiosa que todo el oro en " +
          "este mundo.",
      },
      {
        title: "Tu valentía abre puertas a una hermosura inefable",
        art: "door",
        body:
          "Verte crecer y ser valiente en momentos y cosas que la mayoría de " +
          "las personas no se atrevería es hermoso, y veo que cada vez que " +
          "eres valiente es como si se abriera una puerta a un mundo hermoso " +
          "de conexión contigo que me hace enamorarme más. Gracias por no " +
          "rendirte en la vida aun cuando es difícil.",
      },
      {
        title: "La vida contigo es mucho más divertida",
        art: "sun",
        body:
          "Estoy seguro que cualquiera estaría de acuerdo con esta frase. El " +
          "simple hecho de que estés en mi vida hace todo más divertido. La " +
          "forma en la que saboreas y disfrutas cada momento es hermosa y me " +
          "enseña tanto. Quiero ser testigo de cómo disfrutas cada día el " +
          "resto de mi vida.",
      },
    ],
    quote: "Amarte ha sido la mayor aventura de mi vida después de Jesús.",
    quoteArt: "trail",
  },

  /* ---- 3. LAS VOCES ------------------------------------ */
  voices: {
    eyebrow: "03 · Las voces",
    title: "Gente que quería decirte algo",
    intro:
      "Cada plaquita de tu caja abre una de estas. Toca una tarjeta aquí, o " +
      "acércale la plaquita al teléfono, y esa persona aparece a decírtelo en " +
      "voz alta.",
    lockedLabel: "Video en camino",
    playLabel: "Reproducir",
  },

  /* ---- 4. LA GENTE + SUS VIDEOS ------------------------ */
  /*
     CÓMO AGREGAR A ALGUIEN
     ----------------------
     1. Corre:  ./tools/add-video.sh ~/Desktop/loquesea.mov maria
        (comprime el clip a media/videos/maria.mp4 y saca el poster solo)
     2. Agrega una entrada abajo.
     3. Corre:  ./tools/bump.sh  y haz push.
     4. Graba la NFC con:
           https://jonnyh1801.github.io/twenty-five/#/from/maria

     CAMPOS
       slug   — minúsculas, sin espacios. Esto es lo que va en la NFC.
       name   — como ella les dice
       role   — "Mejor amiga desde 2014", "Su mamá", "Su roomie", ...
       phrase — LA frase de su video. Corta y que pegue.
       written — opcional. Algo que esa persona escribió aparte del video.
                 Sale abajo del video, marcado como escrito, no dicho.
       video  — nombre del archivo en media/videos/ , o null si no está grabado
       accent — "sky" | "azure" | "cornflower" | "cream"  (color de la tarjeta)
       shape  — "arch" | "grain" | "pebbles" | "dome" | "rings" | "stipple"
                (el dibujo de la tarjeta; si lo dejas vacío se asigna solo)
  */
  friends: [
    {
      slug: "yec-joel",
      name: "Yec y Joel",
      // Sus palabras: "gracias por ser mi hermana, mi mejor amiga".
      role: "Su hermana y mejor amiga",
      phrase: "Gracias por siempre recordarme quién soy y ser mi persona favorita en el mundo.",
      video: "yec-joel.mp4",
      poster: "yec-joel.jpg",
      accent: "cream",
      shape: "pebbles",
    },
    {
      slug: "kayli",
      name: "Kayli",
      role: "Amiga, a miles de kilómetros",
      // Sus palabras exactas, en inglés, porque así lo dijo ella.
      phrase: "When I first met you I thought: I want what she has.",
      video: "kayli.mp4",
      poster: "kayli.jpg",
      accent: "sky",
      shape: "arch",
    },
    {
      slug: "bethy",
      name: "Bethy",
      role: "Amiga, desde España",
      phrase: "Habiéndonos visto solo una vez, sentía que te conocía de toda la vida.",
      video: "bethy.mp4",
      poster: "bethy.jpg",
      accent: "cream",
      shape: "grain",
    },
    {
      slug: "deb-daniel",
      name: "Deb y Daniel",
      role: "Amigos, desde Seattle",
      // La frase es de Deb, la segunda que habla en el video.
      phrase: "Una amiga con la que pude hacer familia.",
      video: "deb-daniel.mp4",
      poster: "deb-daniel.jpg",
      accent: "cornflower",
      shape: "pebbles",
    },
    {
      slug: "harry",
      name: "Harry",
      role: "Amigo fiel",
      phrase: "Que sigas cambiando al mundo con tu alegría.",
      video: "harry.mp4",
      poster: "harry.jpg",
      accent: "azure",
      shape: "dome",
    },
    {
      slug: "keren",
      name: "Keren",
      role: "Amiga, casi hermana",
      phrase: "Todo lo que tú eres tiene como este perfume de ternura.",
      video: "keren.mp4",
      poster: "keren.jpg",
      accent: "sky",
      shape: "rings",
    },
    {
      slug: "pri",
      name: "Pri",
      // De su video: vivieron juntas, y "yo en tu historia, tú en mi
      // historia, en nuestra historia".
      role: "Su compañera de historia",
      phrase: "25 años que esta tierra ha sido bendecida porque tú la has caminado.",
      // Esto lo escribió ella aparte, no lo dice en el video.
      written:
        "Cada momento contigo ha sido una flor añadida al jardín de las " +
        "memorias, cuya fragancia hace reverdecer hasta los lugares más secos.",
      video: "pri.mp4",
      poster: "pri.jpg",
      accent: "azure",
      shape: "arch",
    },
    {
      slug: "val",
      name: "Val",
      role: "Amiga, de cafés y pláticas",
      phrase: "Construir confianza en una amistad es lo más valioso. Y creo que lo he conseguido contigo.",
      video: "val.mp4",
      poster: "val.jpg",
      accent: "cream",
      shape: "stipple",
    },
    {
      slug: "laurel",
      name: "Laurel",
      role: "Amiga, desde las montañas",
      phrase: "You've woven yourself into my heart and into my life.",
      video: "laurel.mp4",
      poster: "laurel.jpg",
      accent: "cornflower",
      shape: "dome",
    },
  ],

  /* ---- 5. TU CARTA ------------------------------------- */
  letter: {
    eyebrow: "04 · De mí",
    title: "Mereces ser celebrada hoy y todos los días",
    body: [
      "Estos videos van a estar aquí siempre. Son para que recuerdes lo " +
        "increíble que eres y cómo tu vida ha impactado a otros de formas tan " +
        "grandes y significativas.",
      "No estás sola: tienes toda una nube de testigos echándote porras, " +
        "listos para celebrar tu vida tan bien vivida cada día.",
    ],
    note: "Puedes ver todos estos videos cuando quieras haciendo tap en las placas.",
    noteArt: "tap",
    signoff: "Te amo con todo mi corazón",
    fromPrefix: "Tu oso herm, prometido y novio,",
    fromArt: "bear",
    from: "Jonathan",
  },

  /* ---- 6. TEXTITOS DE LA INTERFAZ ---------------------- */
  ui: {
    navHome: "Inicio",
    navAbout: "Sobre ti",
    navVoices: "Las voces",
    navLetter: "De mí",
    menu: "Menú",
    close: "Cerrar",
    back: "Todas las voces",
    prev: "Anterior",
    next: "Siguiente",
    notFilmed: "Este todavía no se ha grabado.",
    writtenLabel: "Y además te escribió esto",
    photoAlt: "Foto suya",
  },

  footer: "hecho a mano · 2026",
};
