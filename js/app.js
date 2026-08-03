/* =========================================================
   app.js — binding, the NFC router, and the motion.
   You should not need to touch this. Edit js/content.js.
   ========================================================= */
(function () {
  "use strict";

  var C = window.CONTENT || CONTENT;
  var VIDEO_DIR = "media/videos/";
  var POSTER_DIR = "media/posters/";
  var PLANTS = ["fern", "eucalyptus", "seedhead", "grass", "algae", "frond"];
  var CALM = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function $(s, r) { return (r || document).querySelector(s); }
  function $$(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); }
  function get(o, path) {
    return path.split(".").reduce(function (a, k) {
      return a === null || a === undefined ? undefined : a[k];
    }, o);
  }
  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text !== undefined) n.textContent = text;
    return n;
  }

  /* =========================================================
     1. Bind [data-c] to content.js
     ========================================================= */
  $$("[data-c]").forEach(function (node) {
    var v = get(C, node.getAttribute("data-c"));
    if (v !== undefined && v !== null) node.textContent = v;
  });
  document.title = C.tabTitle || document.title;

  var UI = C.ui || {};
  $("#playerBack").textContent = UI.back || "";
  $("#prevBtn").textContent = UI.prev || "";
  $("#nextBtn").textContent = UI.next || "";
  $$(".plate__img").forEach(function (i) { i.alt = UI.photoAlt || ""; });

  /* =========================================================
     2. Split the big words into letters so the line can
        expose across instead of all at once.
     ========================================================= */
  $$("[data-split]").forEach(function (node) {
    var text = node.textContent;
    node.textContent = "";
    node.setAttribute("aria-label", text);
    Array.prototype.forEach.call(text, function (ch) {
      var s = el("span", "ltr", ch === " " ? " " : ch);
      s.setAttribute("aria-hidden", "true");
      node.appendChild(s);
    });
  });

  function expose() {
    document.body.classList.remove("is-loading");
    if (CALM) return;
    $$(".giant .ltr").forEach(function (s, i) {
      s.style.animationDelay = 90 + i * 52 + "ms";
      s.classList.add("is-lit");
    });
  }
  // Wait for the display face. Otherwise the letters expose in a
  // fallback serif and snap width when Bodoni finally lands.
  if (document.fonts && document.fonts.ready) {
    var fired = false;
    var go = function () { if (!fired) { fired = true; expose(); } };
    document.fonts.ready.then(go);
    setTimeout(go, 1800);
  } else {
    expose();
  }

  /* =========================================================
     3. Cosas ciertas
     ========================================================= */
  var thingsEl = $("#things");
  if (thingsEl && C.about && C.about.things) {
    C.about.things.forEach(function (t) {
      var li = el("li", "reveal");
      li.appendChild(el("h3", null, t.title));
      li.appendChild(el("p", null, t.body));
      thingsEl.appendChild(li);
    });
  }

  /* =========================================================
     4. La carta
     ========================================================= */
  var letterEl = $("#letterBody");
  if (letterEl && C.letter && C.letter.body) {
    C.letter.body.forEach(function (p) { letterEl.appendChild(el("p", null, p)); });
  }

  /* =========================================================
     5. Las voces
     ========================================================= */
  var friends = (C.friends || []).slice();
  var cardsEl = $("#cards");
  var V = C.voices || {};

  function indexOfSlug(slug) {
    for (var i = 0; i < friends.length; i++) if (friends[i].slug === slug) return i;
    return -1;
  }
  function roman(num) {
    var map = [[10, "x"], [9, "ix"], [5, "v"], [4, "iv"], [1, "i"]];
    var out = "";
    map.forEach(function (p) { while (num >= p[0]) { out += p[1]; num -= p[0]; } });
    return out;
  }

  if (cardsEl) {
    friends.forEach(function (f, i) {
      var li = el("li", "reveal");
      var btn = el("button", "card card--" + (f.accent || "sky"));
      btn.type = "button";
      if (!f.video) btn.className += " is-locked";

      var plant = f.plant && PLANTS.indexOf(f.plant) > -1 ? f.plant : PLANTS[i % PLANTS.length];
      var mark = el("span", "bot bot--" + plant + " card__bot");
      mark.setAttribute("aria-hidden", "true");
      btn.appendChild(mark);

      btn.appendChild(el("p", "card__num", ((V.specimenLabel || "") + " " + roman(i + 1)).trim()));
      btn.appendChild(el("p", "card__role", f.role || ""));
      btn.appendChild(el("h3", "card__name", f.name || ""));
      btn.appendChild(el("p", "card__phrase", f.phrase || ""));

      var foot = el("div", "card__foot");
      foot.appendChild(el("span", "card__play"));
      foot.appendChild(el("span", null, f.video ? (V.playLabel || "") : (V.lockedLabel || "")));
      btn.appendChild(foot);

      if (f.video) {
        btn.addEventListener("click", function () { location.hash = "#/from/" + f.slug; });
      } else {
        btn.setAttribute("aria-disabled", "true");
      }

      li.appendChild(btn);
      cardsEl.appendChild(li);
    });
  }

  /* =========================================================
     6. El reproductor  —  where an NFC tap lands
     ========================================================= */
  var player = $("#player");
  var stage = $("#playerStage");
  var nameEl = $("#playerName");
  var roleEl = $("#playerRole");
  var phraseEl = $("#playerPhrase");
  var prevBtn = $("#prevBtn");
  var nextBtn = $("#nextBtn");
  var current = -1;

  function clearStage() {
    var v = $("video", stage);
    if (v) { v.pause(); v.removeAttribute("src"); v.load(); }
    stage.innerHTML = "";
  }

  function openFriend(i) {
    var f = friends[i];
    if (!f) return closePlayer(true);
    current = i;

    nameEl.textContent = f.name || "";
    roleEl.textContent = f.role || "";
    phraseEl.textContent = f.phrase || "";

    clearStage();
    if (f.video) {
      var v = document.createElement("video");
      v.src = VIDEO_DIR + f.video;
      v.controls = true;
      v.preload = "metadata";
      v.playsInline = true;
      v.setAttribute("playsinline", "");
      v.setAttribute("webkit-playsinline", "");
      if (f.poster) v.poster = POSTER_DIR + f.poster;
      stage.appendChild(v);
      // She presses play herself. Autoplaying sound on someone's
      // phone at 2am is a hostile act.
    } else {
      stage.appendChild(el("div", "player__missing", UI.notFilmed || ""));
    }

    prevBtn.disabled = i <= 0;
    nextBtn.disabled = i >= friends.length - 1;

    player.hidden = false;
    document.body.classList.add("is-locked");
    player.scrollTop = 0;
    $("#playerClose").focus({ preventScroll: true });
  }

  function closePlayer(silent) {
    clearStage();
    player.hidden = true;
    document.body.classList.remove("is-locked");
    current = -1;
    if (!silent) {
      history.replaceState(null, "", location.pathname + location.search + "#voices");
      var t = $("#voices");
      if (t) t.scrollIntoView({ behavior: "auto", block: "start" });
    }
  }

  prevBtn.addEventListener("click", function () {
    if (current > 0) location.hash = "#/from/" + friends[current - 1].slug;
  });
  nextBtn.addEventListener("click", function () {
    if (current < friends.length - 1) location.hash = "#/from/" + friends[current + 1].slug;
  });
  $("#playerClose").addEventListener("click", function () { closePlayer(); });
  document.addEventListener("keydown", function (e) {
    if (player.hidden) return;
    if (e.key === "Escape") closePlayer();
    if (e.key === "ArrowRight" && !nextBtn.disabled) nextBtn.click();
    if (e.key === "ArrowLeft" && !prevBtn.disabled) prevBtn.click();
  });

  /* ---- the router: #/from/<slug> ---- */
  function route() {
    var m = /^#\/from\/([^/?#]+)/.exec(location.hash);
    if (!m) { if (!player.hidden) closePlayer(true); return; }
    var i = indexOfSlug(decodeURIComponent(m[1]));
    if (i === -1) {
      // Unknown tag. Never leave her looking at a blank screen.
      closePlayer(true);
      var v = $("#voices");
      if (v) v.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }
    openFriend(i);
  }
  window.addEventListener("hashchange", route);
  route();

  /* =========================================================
     7. Mobile drawer
     ========================================================= */
  var menuBtn = $(".menu-btn");
  var drawer = $("#drawer");
  function setDrawer(open) {
    drawer.hidden = !open;
    menuBtn.setAttribute("aria-expanded", String(open));
    document.body.classList.toggle("is-locked", open);
  }
  menuBtn.addEventListener("click", function () { setDrawer(drawer.hidden); });
  $$("a[data-nav]").forEach(function (a) {
    a.addEventListener("click", function () {
      if (!drawer.hidden) setDrawer(false);
      if (!player.hidden) closePlayer(true);
    });
  });

  /* =========================================================
     8. Reveal, develop, and the active rail link
     ========================================================= */
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        e.target.classList.add("is-in");
        io.unobserve(e.target);
      });
    }, { rootMargin: "0px 0px -10% 0px", threshold: 0.06 });
    $$(".reveal").forEach(function (node) { io.observe(node); });

    // the print develops as it scrolls into view
    var dev = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        var p = e.target;
        setTimeout(function () { p.classList.add("is-developed"); }, CALM ? 0 : 260);
        dev.unobserve(p);
      });
    }, { threshold: 0.2 });
    $$(".plate").forEach(function (p) { dev.observe(p); });

    var railLinks = $$(".rail a");
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        railLinks.forEach(function (a) {
          a.classList.toggle("is-active", a.getAttribute("href") === "#" + e.target.id);
        });
      });
    }, { rootMargin: "-45% 0px -45% 0px" });
    ["hero", "about", "voices", "letter"].forEach(function (id) {
      var s = document.getElementById(id);
      if (s) spy.observe(s);
    });
  } else {
    $$(".reveal").forEach(function (node) { node.classList.add("is-in"); });
    $$(".plate").forEach(function (p) { p.classList.add("is-developed"); });
  }

  /* =========================================================
     9. Scroll drift
        The specimens move slower than the page. `translate` is
        its own property now, so this never fights the `rotate`
        keyframes doing the sway.
     ========================================================= */
  if (!CALM) {
    var drifters = $$("[data-drift]").map(function (node) {
      return { node: node, k: parseFloat(node.getAttribute("data-drift")) || 0 };
    });
    var ticking = false;

    function place() {
      var h = window.innerHeight;
      drifters.forEach(function (d) {
        var r = d.node.getBoundingClientRect();
        if (r.bottom < -240 || r.top > h + 240) return;
        // 0 when the element is centred, ±0.5 at the edges of travel
        var p = (r.top + r.height / 2 - h / 2) / h;
        d.node.style.translate = "0 " + (p * d.k * -180).toFixed(1) + "px";
      });
      ticking = false;
    }
    function onScroll() {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(place);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    place();
  }
})();
