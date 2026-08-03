/* =========================================================
   app.js — content binding, gallery, and the NFC router.
   You should not need to edit this file. Edit content.js.
   ========================================================= */
(function () {
  "use strict";

  var C = window.CONTENT || CONTENT;
  var VIDEO_DIR = "media/videos/";
  var POSTER_DIR = "media/posters/";

  /* ---------- tiny helpers ---------- */
  function $(sel, root) { return (root || document).querySelector(sel); }
  function $$(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }
  function get(obj, path) {
    return path.split(".").reduce(function (o, k) {
      return (o === null || o === undefined) ? undefined : o[k];
    }, obj);
  }
  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text !== undefined) n.textContent = text;
    return n;
  }

  /* =========================================================
     1. Bind every [data-c] to its value in content.js
     ========================================================= */
  $$("[data-c]").forEach(function (node) {
    var v = get(C, node.getAttribute("data-c"));
    if (v !== undefined && v !== null) node.textContent = v;
  });
  document.title = C.tabTitle || document.title;

  /* =========================================================
     2. "Some true things" list
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
     3. Letter paragraphs
     ========================================================= */
  var letterEl = $("#letterBody");
  if (letterEl && C.letter && C.letter.body) {
    C.letter.body.forEach(function (p) { letterEl.appendChild(el("p", null, p)); });
  }

  /* =========================================================
     4. The voices gallery
     ========================================================= */
  var friends = (C.friends || []).slice();
  var cardsEl = $("#cards");

  function indexOfSlug(slug) {
    for (var i = 0; i < friends.length; i++) if (friends[i].slug === slug) return i;
    return -1;
  }

  if (cardsEl) {
    friends.forEach(function (f, i) {
      var li = el("li", "reveal");
      var btn = el("button", "card card--" + (f.accent || "cream"));
      btn.type = "button";
      if (!f.video) btn.className += " is-locked";

      btn.appendChild(el("p", "card__role", f.role || ""));
      btn.appendChild(el("h3", "card__name", f.name || ""));
      btn.appendChild(el("p", "card__phrase", f.phrase || ""));

      var foot = el("div", "card__foot");
      foot.appendChild(el("span", "card__play"));
      foot.appendChild(el("span", null, f.video ? "Play" : (C.voices && C.voices.lockedLabel) || "Coming soon"));
      btn.appendChild(foot);

      if (f.video) {
        btn.addEventListener("click", function () { location.hash = "#/from/" + f.slug; });
      } else {
        btn.setAttribute("aria-disabled", "true");
      }

      li.appendChild(btn);
      cardsEl.appendChild(li);
      f._i = i;
    });
  }

  /* =========================================================
     5. The player  —  this is what an NFC tap opens
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
      v.playsInline = true;      // never hijack into iOS fullscreen
      v.preload = "metadata";
      v.setAttribute("playsinline", "");
      v.setAttribute("webkit-playsinline", "");
      if (f.poster) v.poster = POSTER_DIR + f.poster;
      stage.appendChild(v);
      // autoplay muted is unreliable and rude — she taps play herself.
    } else {
      stage.appendChild(el("div", "player__missing", "This one hasn't been filmed yet."));
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

  /* ---------- the router ----------
     #/from/<slug>  ->  open that person
     anything else  ->  normal page anchors                    */
  function route() {
    var m = /^#\/from\/([^/?#]+)/.exec(location.hash);
    if (!m) { if (!player.hidden) closePlayer(true); return; }
    var i = indexOfSlug(decodeURIComponent(m[1]));
    if (i === -1) {
      // unknown tag — don't leave her staring at a blank screen
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
     6. Mobile drawer
     ========================================================= */
  var menuBtn = $(".menu-btn");
  var drawer = $("#drawer");
  function setDrawer(open) {
    drawer.hidden = !open;
    menuBtn.setAttribute("aria-expanded", String(open));
    document.body.classList.toggle("is-locked", open);
  }
  menuBtn.addEventListener("click", function () {
    setDrawer(drawer.hidden);
  });
  $$("a[data-nav]").forEach(function (a) {
    a.addEventListener("click", function () {
      if (!drawer.hidden) setDrawer(false);
      if (!player.hidden) closePlayer(true);
    });
  });

  /* =========================================================
     7. Reveal on scroll + active rail link
     ========================================================= */
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add("is-in"); io.unobserve(e.target); }
      });
    }, { rootMargin: "0px 0px -12% 0px", threshold: 0.08 });
    $$(".reveal").forEach(function (n) { io.observe(n); });

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
    $$(".reveal").forEach(function (n) { n.classList.add("is-in"); });
  }
})();
