/* ============================================================
   CONTENT.JS  —  El único archivo que tienes que editar.
   Todo lo que dice el sitio vive aquí.
   Guardas, refrescas la página, y ya.
   ============================================================ */

const CONTENT = {

  /* ---- LO BÁSICO --------------------------------------- */
  // TODO Jonathan: pon su nombre real / como le dices.
  name: "Mon",
  birthdayLabel: "26 de agosto",
  tabTitle: "Feliz 25, Mon",

  /* ---- 1. PORTADA -------------------------------------- */
  hero: {
    eyebrow: "01 · Veinticinco vueltas al sol",
    script: "feliz cumpleaños",     // la línea escrita a mano
    big1: "VEINTI",
    big2: "CINCO",
    subtitle:
      "Un rincón del internet hecho nada más para ti, con las voces de la " +
      "gente que te quiere viviendo adentro.",
    scrollCue: "sigue",
  },

  /* ---- 2. SOBRE ELLA ----------------------------------- */
  // TODO Jonathan: reescribe esto con tus palabras.
  // Puedes agregar o quitar cosas, el diseño se acomoda solo.
  about: {
    eyebrow: "02 · Cosas ciertas",
    title: "Veinticinco años de ti",
    intro:
      "Pude haber escrito una sola carta larga. En vez de eso anoté las cosas " +
      "que no quiero que se te olviden de ti misma.",
    things: [
      {
        title: "Te ríes con toda la cara",
        body:
          "No de forma educada, ni bajito. Se te ríe la cara entera, y todos " +
          "en el cuarto deciden que el día va a estar bueno.",
      },
      {
        title: "Haces que la gente se sienta elegida",
        body:
          "Te acuerdas del detalle que alguien mencionó una vez, hace meses, y " +
          "lo traes de vuelta como si importara. Porque para ti sí importaba.",
      },
      {
        title: "Eres más valiente de lo que te reconoces",
        body:
          "Sigues haciendo lo difícil en silencio, sin necesitar que nadie te " +
          "aplauda. Yo te aplaudo. Todo el tiempo.",
      },
      {
        title: "El azul se te parece",
        body:
          "En todos sus tonos: cielo, aciano, cobalto, medianoche. Todo este " +
          "sitio está hecho de tu color favorito a propósito.",
      },
    ],
    quote: "Quererte ha sido la cosa más fácil que he hecho en la vida.",
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
    specimenLabel: "espécimen",
  },

  /* ---- 4. LA GENTE + SUS VIDEOS ------------------------ */
  /*
     CÓMO AGREGAR A ALGUIEN
     ----------------------
     1. Corre:  ./tools/add-video.sh ~/Desktop/loquesea.mov maria
        (comprime el clip a media/videos/maria.mp4 y saca el poster solo)
     2. Agrega una entrada abajo.
     3. Graba la NFC con la url que sale en el README:
           https://jonnyh1801.github.io/twenty-five/#/from/maria

     CAMPOS
       slug   — minúsculas, sin espacios. Esto es lo que va en la NFC.
       name   — como ella les dice
       role   — "Mejor amiga desde 2014", "Su mamá", "Su roomie", ...
       phrase — LA frase de su video. Corta y que pegue.
       video  — nombre del archivo en media/videos/ , o null si no está grabado
       accent — "sky" | "azure" | "cornflower" | "cream"  (color de la tarjeta)
       shape  — "arch" | "grain" | "pebbles" | "dome" | "rings" | "stipple"
                (el dibujo de la tarjeta; si lo dejas vacío se asigna solo)
  */
  friends: [
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
  ],

  /* ---- 5. TU CARTA ------------------------------------- */
  // TODO Jonathan: esta es tuya. Escríbela bien.
  letter: {
    eyebrow: "04 · De mí",
    title: "Una cosa más",
    body: [
      "Quería darte algo que no se te pudiera perder en un cajón.",
      "Así que le pedí a la gente que te quiere que lo dijera en voz alta, eso " +
        "que dirían si no les diera pena ponerse sentimentales. Y luego lo " +
        "guardé todo en un lugar al que puedas llegar cualquier noche que lo " +
        "necesites.",
      "Acerca una plaquita. La que sea. Cuando quieras. Van a seguir aquí a los " +
        "treinta, y a los cincuenta, y cada vez que se te olvide cuánto espacio " +
        "ocupas en la vida de la gente.",
      "Feliz veinticinco, mi amor.",
    ],
    signoff: "siempre,",
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
    photoAlt: "Foto suya",
  },

  footer: "hecho a mano · 2026",
};
