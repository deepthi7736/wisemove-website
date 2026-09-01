/* ==========================================================================
   WISEMOVE CONSULTANCY — script.js
   Shared behaviour for every page. Every selector is guarded; no page
   should ever produce a console error because an element is absent.
   ========================================================================== */

(function () {
  "use strict";

  var CONTACT_EMAIL = "info@wisemoveconsultancy.com";
  var STORAGE_KEY = "wisemove-theme";

  function $(sel, root) { return (root || document).querySelector(sel); }
  function $$(sel, root) {
    return Array.prototype.slice.call((root || document).querySelectorAll(sel));
  }
  function on(el, evt, fn, opts) { if (el) el.addEventListener(evt, fn, opts); }

  var prefersReduced =
    window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ------------------------------------------------------------------
     THEME
     ------------------------------------------------------------------ */

  function initTheme() {
    var root = document.documentElement;
    var stored = null;

    try { stored = localStorage.getItem(STORAGE_KEY); } catch (e) { stored = null; }

    if (stored === "light" || stored === "dark") {
      root.setAttribute("data-theme", stored);
    } else if (!root.getAttribute("data-theme")) {
      root.setAttribute("data-theme", "dark");
    }

    $$("[data-theme-toggle]").forEach(function (btn) {
      on(btn, "click", function () {
        var next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
        root.setAttribute("data-theme", next);
        btn.setAttribute("aria-label", next === "dark" ? "Switch to light theme" : "Switch to dark theme");
        try { localStorage.setItem(STORAGE_KEY, next); } catch (e) { /* storage blocked */ }
      });
    });
  }

  /* ------------------------------------------------------------------
     STICKY HEADER
     ------------------------------------------------------------------ */

  function initHeader() {
    var header = $(".site-header");
    if (!header) return;

    var ticking = false;
    function update() {
      header.classList.toggle("scrolled", window.scrollY > 12);
      ticking = false;
    }
    on(window, "scroll", function () {
      if (!ticking) { window.requestAnimationFrame(update); ticking = true; }
    }, { passive: true });
    update();
  }

  /* ------------------------------------------------------------------
     MOBILE MENU
     Hidden by default at every breakpoint. Opens only via the hamburger.
     ------------------------------------------------------------------ */

  function initMobileMenu() {
    var toggle = $("[data-menu-toggle]");
    var menu = $("#mobileMenu");
    if (!toggle || !menu) return;

    function open() {
      menu.hidden = false;
      /* next frame so the display change lands before the opacity transition */
      window.requestAnimationFrame(function () { menu.classList.add("is-open"); });
      toggle.setAttribute("aria-expanded", "true");
      document.body.classList.add("no-scroll");
    }

    function close() {
      menu.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
      document.body.classList.remove("no-scroll");
      window.setTimeout(function () {
        if (!menu.classList.contains("is-open")) menu.hidden = true;
      }, prefersReduced ? 0 : 340);
    }

    function isOpen() { return toggle.getAttribute("aria-expanded") === "true"; }

    on(toggle, "click", function () { isOpen() ? close() : open(); });

    $$("a, button", menu).forEach(function (el) {
      on(el, "click", function () { close(); });
    });

    on(document, "keydown", function (e) {
      if (e.key === "Escape" && isOpen()) { close(); toggle.focus(); }
    });

    /* Never leave the drawer open when we cross into desktop layout */
    var mq = window.matchMedia("(min-width: 981px)");
    var onChange = function (e) { if (e.matches && isOpen()) close(); };
    if (mq.addEventListener) mq.addEventListener("change", onChange);
    else if (mq.addListener) mq.addListener(onChange);

    /* Guaranteed closed state on load */
    menu.hidden = true;
    menu.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
  }

  /* ------------------------------------------------------------------
     CONTACT MODAL
     ------------------------------------------------------------------ */

  function initModal() {
    var modal = $("#contactModal");
    if (!modal) return;

    var panel = $(".modal-panel", modal);
    var backdrop = $(".modal-backdrop", modal);
    var lastFocus = null;

    var FOCUSABLE =
      'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

    function open() {
      lastFocus = document.activeElement;
      modal.hidden = false;
      window.requestAnimationFrame(function () { modal.classList.add("is-open"); });
      modal.setAttribute("aria-hidden", "false");
      document.body.classList.add("no-scroll");
      var first = $(FOCUSABLE, panel);
      if (first) window.setTimeout(function () { first.focus(); }, 60);
    }

    function close() {
      modal.classList.remove("is-open");
      modal.setAttribute("aria-hidden", "true");
      document.body.classList.remove("no-scroll");
      window.setTimeout(function () {
        if (!modal.classList.contains("is-open")) modal.hidden = true;
      }, prefersReduced ? 0 : 380);
      if (lastFocus && typeof lastFocus.focus === "function") lastFocus.focus();
    }

    function isOpen() { return modal.classList.contains("is-open"); }

    $$("[data-modal-open]").forEach(function (btn) {
      on(btn, "click", function (e) { e.preventDefault(); open(); });
    });

    $$("[data-modal-close]", modal).forEach(function (btn) {
      on(btn, "click", function (e) { e.preventDefault(); close(); });
    });

    on(backdrop, "click", close);

    on(document, "keydown", function (e) {
      if (!isOpen()) return;
      if (e.key === "Escape") { close(); return; }
      if (e.key !== "Tab") return;

      var items = $$(FOCUSABLE, panel).filter(function (el) {
        return el.offsetParent !== null;
      });
      if (!items.length) return;

      var first = items[0];
      var last = items[items.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault(); last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault(); first.focus();
      }
    });

    modal.hidden = true;
    modal.classList.remove("is-open");
  }

  /* ------------------------------------------------------------------
     ENQUIRY FORMS — no backend exists, so compose a mail draft safely
     ------------------------------------------------------------------ */

  function initForms() {
    $$("[data-enquiry-form]").forEach(function (form) {
      on(form, "submit", function (e) {
        e.preventDefault();

        function val(name) {
          var f = form.elements[name];
          return f && f.value ? String(f.value).trim() : "";
        }

        var name = val("name");
        var email = val("email");
        var company = val("company");
        var phone = val("phone");
        var subject = val("subject");
        var message = val("message");

        var lines = [
          "Name: " + (name || "—"),
          "Email: " + (email || "—"),
          "Company: " + (company || "—"),
          "Phone: " + (phone || "—"),
          "",
          "Message:",
          message || "—",
          "",
          "— Sent from wisemoveconsultancy.com"
        ];

        var subj = subject || "New enquiry from " + (name || "the WiseMove website");

        var href =
          "mailto:" + CONTACT_EMAIL +
          "?subject=" + encodeURIComponent(subj) +
          "&body=" + encodeURIComponent(lines.join("\n"));

        var status = $("[data-form-status]", form);
        if (status) {
          status.textContent =
            "Opening your email app with this enquiry addressed to " + CONTACT_EMAIL + ".";
        }

        window.location.href = href;
      });
    });
  }

  /* ------------------------------------------------------------------
     FAQ ACCORDION
     ------------------------------------------------------------------ */

  function initFaq() {
    $$(".faq-item").forEach(function (item) {
      var btn = $(".faq-q", item);
      var panel = $(".faq-a", item);
      if (!btn || !panel) return;

      on(btn, "click", function () {
        var willOpen = !item.classList.contains("open");

        var group = item.closest(".faq");
        if (group) {
          $$(".faq-item.open", group).forEach(function (other) {
            if (other === item) return;
            other.classList.remove("open");
            var ob = $(".faq-q", other);
            if (ob) ob.setAttribute("aria-expanded", "false");
          });
        }

        item.classList.toggle("open", willOpen);
        btn.setAttribute("aria-expanded", willOpen ? "true" : "false");
      });
    });
  }

  /* ------------------------------------------------------------------
     SCROLL REVEAL
     ------------------------------------------------------------------ */

  function initReveal() {
    var targets = $$(".reveal, .stagger");
    if (!targets.length) return;

    if (prefersReduced || !("IntersectionObserver" in window)) {
      targets.forEach(function (el) { el.classList.add("in"); });
      return;
    }

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("in");
        io.unobserve(entry.target);
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });

    targets.forEach(function (el) { io.observe(el); });
  }

  /* ------------------------------------------------------------------
     HERO PARALLAX (pointer-driven, desktop only, motion-safe)
     ------------------------------------------------------------------ */

  function initParallax() {
    var stage = $("[data-parallax]");
    if (!stage || prefersReduced) return;
    if (!window.matchMedia("(hover: hover) and (min-width: 981px)").matches) return;

    var layers = $$("[data-depth]", stage);
    if (!layers.length) return;

    var tx = 0, ty = 0, cx = 0, cy = 0, raf = null;

    function loop() {
      cx += (tx - cx) * 0.07;
      cy += (ty - cy) * 0.07;
      layers.forEach(function (el) {
        var d = parseFloat(el.getAttribute("data-depth")) || 0;
        el.style.transform = "translate3d(" + (cx * d).toFixed(2) + "px," + (cy * d).toFixed(2) + "px,0)";
      });
      raf = Math.abs(tx - cx) > 0.1 || Math.abs(ty - cy) > 0.1 ? window.requestAnimationFrame(loop) : null;
    }

    on(stage, "mousemove", function (e) {
      var r = stage.getBoundingClientRect();
      tx = ((e.clientX - r.left) / r.width - 0.5) * 32;
      ty = ((e.clientY - r.top) / r.height - 0.5) * 32;
      if (!raf) raf = window.requestAnimationFrame(loop);
    });

    on(stage, "mouseleave", function () {
      tx = 0; ty = 0;
      if (!raf) raf = window.requestAnimationFrame(loop);
    });
  }

  /* ------------------------------------------------------------------
     COUNT-UP STATS
     ------------------------------------------------------------------ */

  function initCounters() {
    var els = $$("[data-count]");
    if (!els.length) return;

    if (prefersReduced || !("IntersectionObserver" in window)) {
      els.forEach(function (el) {
        el.textContent = (el.getAttribute("data-prefix") || "") +
          el.getAttribute("data-count") + (el.getAttribute("data-suffix") || "");
      });
      return;
    }

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        io.unobserve(el);

        var target = parseFloat(el.getAttribute("data-count")) || 0;
        var pad = (el.getAttribute("data-pad") || "") === "true";
        var pre = el.getAttribute("data-prefix") || "";
        var suf = el.getAttribute("data-suffix") || "";
        var start = null;

        function frame(ts) {
          if (start === null) start = ts;
          var p = Math.min((ts - start) / 1200, 1);
          var eased = 1 - Math.pow(1 - p, 3);
          var v = Math.round(target * eased);
          el.textContent = pre + (pad && v < 10 ? "0" + v : String(v)) + suf;
          if (p < 1) window.requestAnimationFrame(frame);
        }
        window.requestAnimationFrame(frame);
      });
    }, { threshold: 0.4 });

    els.forEach(function (el) { io.observe(el); });
  }

  /* ------------------------------------------------------------------
     FOOTER YEAR
     ------------------------------------------------------------------ */

  function initYear() {
    $$("[data-year]").forEach(function (el) {
      el.textContent = String(new Date().getFullYear());
    });
  }

  /* ------------------------------------------------------------------
     BOOT
     ------------------------------------------------------------------ */

  function boot() {
    initTheme();
    initHeader();
    initMobileMenu();
    initModal();
    initForms();
    initFaq();
    initReveal();
    initParallax();
    initCounters();
    initYear();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
