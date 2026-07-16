/* ==========================================================================
   LifeOS - Site behaviour
   Vanilla JS, no dependencies. Handles:
     - Config injection (download links, version, github, contact, year)
     - Theme toggle (light / dark / system) with no-flash persistence
     - Sticky-nav shadow on scroll
     - Mobile navigation menu
     - Scroll-reveal animations (IntersectionObserver)
   ========================================================================== */
(function () {
  "use strict";

  var cfg = window.LIFEOS_CONFIG || {};

  /* ---- 1. Inject configuration into the DOM ---------------------------- */
  function applyConfig() {
    // Text nodes: <span data-cfg="VERSION"></span>
    document.querySelectorAll("[data-cfg]").forEach(function (el) {
      var key = el.getAttribute("data-cfg");
      if (cfg[key] != null) el.textContent = cfg[key];
    });
    // Download links + filename download attribute
    document.querySelectorAll("[data-download]").forEach(function (el) {
      el.setAttribute("href", cfg.DOWNLOAD_URL || "#");
      if (cfg.DOWNLOAD_FILENAME) el.setAttribute("download", cfg.DOWNLOAD_FILENAME);
    });
    // GitHub links
    document.querySelectorAll("[data-github]").forEach(function (el) {
      el.setAttribute("href", cfg.GITHUB_URL || "#");
    });
    document.querySelectorAll("[data-releases]").forEach(function (el) {
      el.setAttribute("href", cfg.RELEASES_URL || cfg.GITHUB_URL || "#");
    });
    // Contact mailto
    document.querySelectorAll("[data-email]").forEach(function (el) {
      el.setAttribute("href", "mailto:" + (cfg.CONTACT_EMAIL || ""));
      if (!el.textContent.trim()) el.textContent = cfg.CONTACT_EMAIL || "";
    });
    // Current year
    document.querySelectorAll("[data-year]").forEach(function (el) {
      el.textContent = new Date().getFullYear();
    });
  }

  /* ---- 2. Theme -------------------------------------------------------- */
  var STORAGE_KEY = "lifeos-theme";
  function setTheme(mode) {
    var root = document.documentElement;
    if (mode === "system") {
      root.removeAttribute("data-theme");
      localStorage.removeItem(STORAGE_KEY);
    } else {
      root.setAttribute("data-theme", mode);
      localStorage.setItem(STORAGE_KEY, mode);
    }
  }
  function currentTheme() {
    var stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return stored;
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }
  function wireThemeToggle() {
    var btn = document.querySelector(".theme-toggle");
    if (!btn) return;
    btn.addEventListener("click", function () {
      setTheme(currentTheme() === "dark" ? "light" : "dark");
    });
  }

  /* ---- 3. Sticky nav shadow ------------------------------------------- */
  function wireNav() {
    var nav = document.querySelector(".nav");
    if (!nav) return;
    var onScroll = function () {
      nav.classList.toggle("is-scrolled", window.scrollY > 8);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  /* ---- 4. Mobile menu -------------------------------------------------- */
  function wireMobileMenu() {
    var toggle = document.querySelector(".nav-toggle");
    var menu = document.querySelector(".mobile-menu");
    if (!toggle || !menu) return;
    toggle.addEventListener("click", function () {
      var open = menu.classList.toggle("open");
      toggle.setAttribute("aria-expanded", String(open));
    });
    menu.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () {
        menu.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* ---- 5. Scroll reveal ------------------------------------------------ */
  function wireReveal() {
    var items = document.querySelectorAll("[data-reveal]");
    if (!items.length) return;
    var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce || !("IntersectionObserver" in window)) {
      items.forEach(function (el) { el.classList.add("is-visible"); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
    items.forEach(function (el) { io.observe(el); });
  }

  /* ---- 6. Lightbox (screenshot viewer) -------------------------------- */
  function wireLightbox() {
    var box = document.getElementById("lightbox");
    if (!box) return;
    var triggers = Array.prototype.slice.call(document.querySelectorAll(".lightbox-trigger"));
    if (!triggers.length) return;

    var imgEl = document.getElementById("lightbox-img");
    var capEl = document.getElementById("lightbox-cap");
    var countEl = document.getElementById("lightbox-count");
    var zoomBtn = box.querySelector("[data-lb-zoom]");
    var zoomLabel = box.querySelector(".lightbox__zoomlabel");

    // Build a de-duplicated, ordered gallery from the trigger set.
    var items = [];
    var indexBySrc = {};
    triggers.forEach(function (t) {
      var src = t.getAttribute("data-full");
      if (!src) return;
      if (!(src in indexBySrc)) {
        indexBySrc[src] = items.length;
        items.push({ src: src, caption: t.getAttribute("data-caption") || "" });
      }
      t.addEventListener("click", function () { open(indexBySrc[src], t); });
    });

    var current = 0;
    var lastFocus = null;
    var zoomed = false;

    function render() {
      var it = items[current];
      imgEl.src = it.src;
      imgEl.alt = it.caption;
      capEl.textContent = it.caption;
      countEl.textContent = current + 1 + " / " + items.length;
      setZoom(false);
      // Re-trigger the entrance animation.
      imgEl.classList.remove("is-entering");
      void imgEl.offsetWidth;
      imgEl.classList.add("is-entering");
    }
    function setZoom(on) {
      zoomed = on;
      box.classList.toggle("is-zoomed", on);
      if (zoomBtn) zoomBtn.setAttribute("aria-pressed", String(on));
      if (zoomLabel) zoomLabel.textContent = on ? "Reset" : "Zoom";
    }
    function open(i, trigger) {
      current = i;
      lastFocus = trigger || document.activeElement;
      render();
      box.hidden = false;
      document.body.style.overflow = "hidden";
      document.addEventListener("keydown", onKey);
      var closeBtn = box.querySelector("[data-lb-close]");
      if (closeBtn) closeBtn.focus();
    }
    function close() {
      box.hidden = true;
      setZoom(false);
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKey);
      imgEl.src = "";
      if (lastFocus && typeof lastFocus.focus === "function") lastFocus.focus();
    }
    function step(dir) {
      current = (current + dir + items.length) % items.length;
      render();
    }
    function onKey(e) {
      if (e.key === "Escape") { close(); }
      else if (e.key === "ArrowLeft") { step(-1); }
      else if (e.key === "ArrowRight") { step(1); }
      else if ((e.key === "Enter" || e.key === " ") && document.activeElement === imgEl) { e.preventDefault(); setZoom(!zoomed); }
      else if (e.key === "Tab") {
        // Keep focus inside the dialog.
        var f = Array.prototype.slice.call(box.querySelectorAll("button, [tabindex]"));
        if (!f.length) return;
        var first = f[0], last = f[f.length - 1];
        if (!box.contains(document.activeElement)) { e.preventDefault(); first.focus(); }
        else if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    }

    box.querySelectorAll("[data-lb-close]").forEach(function (el) {
      el.addEventListener("click", close);
    });
    var prev = box.querySelector("[data-lb-prev]");
    var next = box.querySelector("[data-lb-next]");
    if (prev) prev.addEventListener("click", function () { step(-1); });
    if (next) next.addEventListener("click", function () { step(1); });
    if (zoomBtn) zoomBtn.addEventListener("click", function () { setZoom(!zoomed); });
    imgEl.setAttribute("tabindex", "0");
    imgEl.addEventListener("click", function () { setZoom(!zoomed); });
  }

  /* ---- Init ------------------------------------------------------------ */
  function init() {
    applyConfig();
    wireThemeToggle();
    wireNav();
    wireMobileMenu();
    wireReveal();
    wireLightbox();
  }
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
