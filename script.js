/* ==========================================================================
   WISEMOVE — MAIN SCRIPT
   Matches the latest index.html + style.css
   Motion language: MOVE → TRANSFORM → ARRIVE
   ========================================================================== */

(function () {
  "use strict";

  /* ==========================================================================
     PROGRESSIVE ENHANCEMENT
     ========================================================================== */

  document.documentElement.classList.remove("no-js");
  document.documentElement.classList.add("js");

  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  const finePointer = window.matchMedia(
    "(hover: hover) and (pointer: fine)"
  ).matches;

  const qs = (selector, scope = document) =>
    scope.querySelector(selector);

  const qsa = (selector, scope = document) =>
    Array.from(scope.querySelectorAll(selector));


  /* ==========================================================================
     THEME
     ========================================================================== */

  function initTheme() {
    const body = document.body;
    const toggle = document.getElementById("themeToggle");
    const icon = document.getElementById("themeIcon");

    if (!body || !toggle || !icon) return;

    const STORAGE_KEY = "wisemove-theme";

    const sunIcon = `
      <circle cx="12" cy="12" r="4"></circle>

      <line x1="12" y1="2" x2="12" y2="4"></line>
      <line x1="12" y1="20" x2="12" y2="22"></line>

      <line x1="4.93" y1="4.93" x2="6.34" y2="6.34"></line>
      <line x1="17.66" y1="17.66" x2="19.07" y2="19.07"></line>

      <line x1="2" y1="12" x2="4" y2="12"></line>
      <line x1="20" y1="12" x2="22" y2="12"></line>

      <line x1="4.93" y1="19.07" x2="6.34" y2="17.66"></line>
      <line x1="17.66" y1="6.34" x2="19.07" y2="4.93"></line>
    `;

    const moonIcon = `
      <path
        d="M21 12.79A9 9 0 1 1 11.21 3
        7 7 0 0 0 21 12.79z"
      ></path>
    `;

    function getInitialTheme() {
      try {
        const savedTheme =
          localStorage.getItem(STORAGE_KEY);

        if (
          savedTheme === "dark" ||
          savedTheme === "light"
        ) {
          return savedTheme;
        }
      } catch (error) {
        // Ignore storage errors.
      }

      return "dark";
    }

    function applyTheme(theme) {
      body.setAttribute(
        "data-theme",
        theme
      );

      icon.innerHTML =
        theme === "dark"
          ? sunIcon
          : moonIcon;

      toggle.setAttribute(
        "aria-label",
        theme === "dark"
          ? "Switch to light theme"
          : "Switch to dark theme"
      );

      const themeColor = qs(
        'meta[name="theme-color"]'
      );

      if (themeColor) {
        themeColor.setAttribute(
          "content",
          theme === "dark"
            ? "#0b0a10"
            : "#f6f4f0"
        );
      }

      try {
        localStorage.setItem(
          STORAGE_KEY,
          theme
        );
      } catch (error) {
        // Theme still works without persistence.
      }
    }

    applyTheme(
      getInitialTheme()
    );

    toggle.addEventListener(
      "click",
      () => {
        const currentTheme =
          body.getAttribute(
            "data-theme"
          );

        applyTheme(
          currentTheme === "dark"
            ? "light"
            : "dark"
        );
      }
    );
  }


  /* ==========================================================================
     NAVBAR SCROLL EFFECT
     ========================================================================== */

  function initNavbarScroll() {
    const header =
      document.getElementById(
        "siteHeader"
      );

    if (!header) return;

    let ticking = false;

    function update() {
      header.classList.toggle(
        "is-scrolled",
        window.scrollY > 14
      );

      ticking = false;
    }

    function onScroll() {
      if (ticking) return;

      ticking = true;

      requestAnimationFrame(
        update
      );
    }

    window.addEventListener(
      "scroll",
      onScroll,
      {
        passive: true
      }
    );

    update();
  }


  /* ==========================================================================
     MOBILE NAVIGATION
     ========================================================================== */

  function initMobileNavigation() {
    const burger =
      document.getElementById(
        "navBurger"
      );

    const menu =
      document.getElementById(
        "mobileMenu"
      );

    if (!burger || !menu) return;

    function setMenu(open) {
      menu.classList.toggle(
        "is-open",
        open
      );

      burger.classList.toggle(
        "is-open",
        open
      );

      burger.setAttribute(
        "aria-expanded",
        String(open)
      );

      menu.setAttribute(
        "aria-hidden",
        String(!open)
      );

      document.body.classList.toggle(
        "menu-open",
        open
      );

      const icon =
        qs("span", burger);

      if (icon) {
        icon.textContent =
          open ? "×" : "☰";
      }
    }

    burger.addEventListener(
      "click",
      () => {
        const isOpen =
          burger.getAttribute(
            "aria-expanded"
          ) === "true";

        setMenu(!isOpen);
      }
    );

    qsa("a", menu).forEach(
      (link) => {
        link.addEventListener(
          "click",
          () => {
            setMenu(false);
          }
        );
      }
    );

    document.addEventListener(
      "keydown",
      (event) => {
        if (
          event.key === "Escape" &&
          burger.getAttribute(
            "aria-expanded"
          ) === "true"
        ) {
          setMenu(false);
          burger.focus();
        }
      }
    );

    window.addEventListener(
      "resize",
      () => {
        if (
          window.innerWidth > 900 &&
          burger.getAttribute(
            "aria-expanded"
          ) === "true"
        ) {
          setMenu(false);
        }
      }
    );
  }


  /* ==========================================================================
     HERO ENTRANCE
     ========================================================================== */

  function initHeroAnimation() {
    const hero =
      qs(".hero");

    if (!hero) return;

    const heroElements =
      qsa("[data-hero-step]", hero);

    if (!heroElements.length) return;

    if (reduceMotion) {
      heroElements.forEach(
        (element) => {
          element.classList.add(
            "is-visible"
          );
        }
      );

      hero.classList.add(
        "hero-complete"
      );

      return;
    }

    const stepDelays = {
      1: 80,
      2: 190,
      3: 340,
      4: 500,
      5: 660,
      6: 820
    };

    heroElements.forEach(
      (element) => {
        const step =
          Number(
            element.dataset.heroStep
          ) || 1;

        const delay =
          stepDelays[step] ||
          step * 120;

        window.setTimeout(
          () => {
            element.classList.add(
              "is-visible"
            );
          },
          delay
        );
      }
    );

    window.setTimeout(
      () => {
        hero.classList.add(
          "hero-complete"
        );
      },
      1250
    );
  }


  /* ==========================================================================
     GENERAL SCROLL REVEALS
     ========================================================================== */

  function initRevealAnimations() {
    const targets = qsa(
      ".reveal-fade, .reveal-text"
    );

    if (!targets.length) return;

    if (
      reduceMotion ||
      !("IntersectionObserver" in window)
    ) {
      targets.forEach(
        (target) => {
          target.classList.add(
            "is-visible"
          );
        }
      );

      return;
    }

    const observer =
      new IntersectionObserver(
        (entries) => {
          entries.forEach(
            (entry) => {
              if (
                !entry.isIntersecting
              ) {
                return;
              }

              entry.target.classList.add(
                "is-visible"
              );

              observer.unobserve(
                entry.target
              );
            }
          );
        },
        {
          threshold: 0.12,

          rootMargin:
            "0px 0px -8% 0px"
        }
      );

    targets.forEach(
      (target) => {
        observer.observe(target);
      }
    );
  }


  /* ==========================================================================
     STATS COUNTERS
     ========================================================================== */

  function initCounters() {
    const counters =
      qsa(
        ".stat-num[data-target]"
      );

    if (!counters.length) return;

    function parseTarget(target) {
      if (/^\d+\+$/.test(target)) {
        return {
          value:
            parseInt(target, 10),

          suffix: "+",

          leadingZero: false
        };
      }

      if (/^\d+%$/.test(target)) {
        return {
          value:
            parseInt(target, 10),

          suffix: "%",

          leadingZero: false
        };
      }

      if (/^\d+$/.test(target)) {
        return {
          value:
            parseInt(target, 10),

          suffix: "",

          leadingZero:
            target.length > 1 &&
            target.startsWith("0")
        };
      }

      return null;
    }

    function animateCounter(
      element
    ) {
      const target =
        element.dataset.target;

      const parsed =
        parseTarget(target);

      if (
        reduceMotion ||
        !parsed
      ) {
        element.textContent =
          target;

        return;
      }

      const duration = 950;
      const startTime =
        performance.now();

      function update(now) {
        const elapsed =
          now - startTime;

        const progress =
          Math.min(
            elapsed / duration,
            1
          );

        const eased =
          1 -
          Math.pow(
            1 - progress,
            3
          );

        const current =
          Math.round(
            parsed.value *
            eased
          );

        let output =
          String(current);

        if (
          parsed.leadingZero &&
          output.length <
            target.length
        ) {
          output =
            output.padStart(
              target.length,
              "0"
            );
        }

        element.textContent =
          output +
          parsed.suffix;

        if (progress < 1) {
          requestAnimationFrame(
            update
          );
        } else {
          element.textContent =
            target;
        }
      }

      requestAnimationFrame(
        update
      );
    }

    if (
      !("IntersectionObserver" in window)
    ) {
      counters.forEach(
        animateCounter
      );

      return;
    }

    const observer =
      new IntersectionObserver(
        (entries) => {
          entries.forEach(
            (entry) => {
              if (
                !entry.isIntersecting
              ) {
                return;
              }

              animateCounter(
                entry.target
              );

              observer.unobserve(
                entry.target
              );
            }
          );
        },
        {
          threshold: 0.55
        }
      );

    counters.forEach(
      (counter) => {
        observer.observe(
          counter
        );
      }
    );
  }


  /* ==========================================================================
     HOW WE MOVE PROCESS
     ========================================================================== */

  function initProcessSteps() {
    const list =
      document.getElementById(
        "processList"
      );

    if (!list) return;

    const steps =
      qsa(
        ".process-step",
        list
      );

    if (!steps.length) return;

    function activateStep(
      selectedStep
    ) {
      steps.forEach(
        (step) => {
          step.classList.toggle(
            "is-active",
            step === selectedStep
          );
        }
      );
    }

    if (
      reduceMotion ||
      !("IntersectionObserver" in window)
    ) {
      steps.forEach(
        (step) => {
          step.classList.add(
            "is-visible"
          );
        }
      );

      if (steps[0]) {
        activateStep(
          steps[0]
        );
      }

      return;
    }

    const revealObserver =
      new IntersectionObserver(
        (entries) => {
          entries.forEach(
            (entry) => {
              if (
                entry.isIntersecting
              ) {
                entry.target.classList.add(
                  "is-visible"
                );
              }
            }
          );
        },
        {
          threshold: 0.15
        }
      );

    const activeObserver =
      new IntersectionObserver(
        (entries) => {
          const visibleEntries =
            entries
              .filter(
                (entry) =>
                  entry.isIntersecting
              )
              .sort(
                (a, b) =>
                  b.intersectionRatio -
                  a.intersectionRatio
              );

          if (
            !visibleEntries.length
          ) {
            return;
          }

          activateStep(
            visibleEntries[0].target
          );
        },
        {
          threshold: [
            0.25,
            0.4,
            0.55,
            0.7
          ],

          rootMargin:
            "-25% 0px -35% 0px"
        }
      );

    steps.forEach(
      (step) => {
        revealObserver.observe(
          step
        );

        activeObserver.observe(
          step
        );
      }
    );
  }


  /* ==========================================================================
     SIGNATURE MOVE ANIMATION
     IDEA → STRATEGY → DESIGN → BUILD → PRODUCT
     ========================================================================== */

  function initMoveJourney() {
    const journey =
      document.getElementById(
        "moveJourney"
      );

    if (!journey) return;

    const indicator =
      document.getElementById(
        "moveIndicator"
      );

    const arrival =
      document.getElementById(
        "moveArrival"
      );

    const stages =
      qsa(
        ".move-stage",
        journey
      );

    if (!stages.length) return;

    let played = false;

    function setStage(index) {
      const denominator =
        Math.max(
          stages.length - 1,
          1
        );

      const percentage =
        (index / denominator) *
        100;

      stages.forEach(
        (stage, stageIndex) => {
          stage.classList.toggle(
            "is-active",
            stageIndex <= index
          );

          stage.classList.toggle(
            "is-current",
            stageIndex === index
          );
        }
      );

      journey.style.setProperty(
        "--move-progress",
        `${percentage}%`
      );

      journey.style.setProperty(
        "--move-position",
        `${percentage}%`
      );

      if (indicator) {
        indicator.style.setProperty(
          "--move-position",
          `${percentage}%`
        );
      }
    }

    function finish() {
      stages.forEach(
        (stage) => {
          stage.classList.add(
            "is-active"
          );

          stage.classList.remove(
            "is-current"
          );
        }
      );

      journey.classList.add(
        "is-complete"
      );

      if (arrival) {
        arrival.classList.add(
          "is-visible"
        );
      }
    }

    function play() {
      if (played) return;

      played = true;

      journey.classList.add(
        "is-running"
      );

      if (reduceMotion) {
        setStage(
          stages.length - 1
        );

        finish();

        return;
      }

      const interval = 230;

      stages.forEach(
        (stage, index) => {
          window.setTimeout(
            () => {
              setStage(index);
            },
            index * interval
          );
        }
      );

      window.setTimeout(
        finish,
        stages.length *
          interval +
          200
      );
    }

    if (
      reduceMotion ||
      !("IntersectionObserver" in window)
    ) {
      play();

      return;
    }

    const observer =
      new IntersectionObserver(
        (entries) => {
          entries.forEach(
            (entry) => {
              if (
                !entry.isIntersecting
              ) {
                return;
              }

              play();

              observer.unobserve(
                entry.target
              );
            }
          );
        },
        {
          threshold: 0.35
        }
      );

    observer.observe(
      journey
    );
  }


  /* ==========================================================================
     PRODUCT CASE STUDY VISUALS
     ========================================================================== */

  function initCaseStudies() {
    const visuals =
      qsa(
        "[data-case-visual]"
      );

    if (!visuals.length) return;

    if (
      reduceMotion ||
      !("IntersectionObserver" in window)
    ) {
      visuals.forEach(
        (visual) => {
          visual.classList.add(
            "is-settled"
          );
        }
      );

      return;
    }

    const observer =
      new IntersectionObserver(
        (entries) => {
          entries.forEach(
            (entry) => {
              if (
                !entry.isIntersecting
              ) {
                return;
              }

              entry.target.classList.add(
                "is-settled"
              );

              observer.unobserve(
                entry.target
              );
            }
          );
        },
        {
          threshold: 0.24
        }
      );

    visuals.forEach(
      (visual) => {
        observer.observe(
          visual
        );
      }
    );
  }


  /* ==========================================================================
     HERO POINTER DEPTH
     Extremely subtle desktop-only movement.
     ========================================================================== */

  function initHeroPointerDepth() {
    if (
      reduceMotion ||
      !finePointer
    ) {
      return;
    }

    const composition =
      qs(
        ".hero-composition"
      );

    if (!composition) return;

    const canvas =
      qs(
        ".studio-canvas",
        composition
      );

    if (!canvas) return;

    let frame = null;

    function resetCanvas() {
      canvas.style.setProperty(
        "--depth-x",
        "0deg"
      );

      canvas.style.setProperty(
        "--depth-y",
        "0deg"
      );
    }

    composition.addEventListener(
      "pointermove",
      (event) => {
        if (frame) {
          cancelAnimationFrame(
            frame
          );
        }

        frame =
          requestAnimationFrame(
            () => {
              const rect =
                composition.getBoundingClientRect();

              if (
                rect.width === 0 ||
                rect.height === 0
              ) {
                return;
              }

              const x =
                (
                  event.clientX -
                  rect.left
                ) /
                rect.width;

              const y =
                (
                  event.clientY -
                  rect.top
                ) /
                rect.height;

              const rotateY =
                (x - 0.5) *
                1.4;

              const rotateX =
                (0.5 - y) *
                1.4;

              canvas.style.setProperty(
                "--depth-x",
                `${rotateX}deg`
              );

              canvas.style.setProperty(
                "--depth-y",
                `${rotateY}deg`
              );
            }
          );
      }
    );

    composition.addEventListener(
      "pointerleave",
      resetCanvas
    );
  }


  /* ==========================================================================
     FAQ
     ========================================================================== */

  function initFAQ() {
    const list =
      document.getElementById(
        "faqList"
      );

    if (!list) return;

    const items =
      qsa(
        ".faq-item",
        list
      );

    if (!items.length) return;

    function closeItem(item) {
      const button =
        qs(
          ".faq-q",
          item
        );

      const answer =
        qs(
          ".faq-a",
          item
        );

      item.classList.remove(
        "is-open"
      );

      if (button) {
        button.setAttribute(
          "aria-expanded",
          "false"
        );
      }

      if (answer) {
        answer.style.maxHeight =
          "0px";
      }
    }

    function openItem(item) {
      const button =
        qs(
          ".faq-q",
          item
        );

      const answer =
        qs(
          ".faq-a",
          item
        );

      item.classList.add(
        "is-open"
      );

      if (button) {
        button.setAttribute(
          "aria-expanded",
          "true"
        );
      }

      if (answer) {
        answer.style.maxHeight =
          `${answer.scrollHeight}px`;
      }
    }

    items.forEach(
      (item) => {
        const button =
          qs(
            ".faq-q",
            item
          );

        if (!button) return;

        button.addEventListener(
          "click",
          () => {
            const alreadyOpen =
              item.classList.contains(
                "is-open"
              );

            items.forEach(
              closeItem
            );

            if (!alreadyOpen) {
              openItem(item);
            }
          }
        );
      }
    );

    window.addEventListener(
      "resize",
      () => {
        items.forEach(
          (item) => {
            if (
              !item.classList.contains(
                "is-open"
              )
            ) {
              return;
            }

            const answer =
              qs(
                ".faq-a",
                item
              );

            if (answer) {
              answer.style.maxHeight =
                `${answer.scrollHeight}px`;
            }
          }
        );
      }
    );
  }


  /* ==========================================================================
     CONTACT FORM
     Honest mailto behavior.
     ========================================================================== */

  function initContactForm() {
    const form =
      document.getElementById(
        "contactForm"
      );

    if (!form) return;

    const submitButton =
      qs(
        ".form-submit",
        form
      );

    const submitLabel =
      qs(
        ".submit-label",
        form
      );

    const status =
      document.getElementById(
        "formStatus"
      );

    if (!submitButton) return;

    const originalText =
      submitLabel
        ? submitLabel.textContent.trim()
        : "Send Message";

    function setStatus(message) {
      if (!status) return;

      status.textContent =
        message;
    }

    form.addEventListener(
      "submit",
      (event) => {
        event.preventDefault();

        if (!form.checkValidity()) {
          form.reportValidity();

          return;
        }

        const name =
          qs(
            "#fname",
            form
          )?.value.trim() || "";

        const email =
          qs(
            "#femail",
            form
          )?.value.trim() || "";

        const phone =
          qs(
            "#fphone",
            form
          )?.value.trim() || "";

        const subject =
          qs(
            "#fsubject",
            form
          )?.value.trim() ||
          "WiseMove project enquiry";

        const message =
          qs(
            "#fmessage",
            form
          )?.value.trim() || "";

        const body = [
          "WiseMove Website Enquiry",
          "",
          `Name: ${name}`,
          `Email: ${email}`,
          phone
            ? `Phone: ${phone}`
            : null,
          "",
          "Project details:",
          message
        ]
          .filter(
            (line) =>
              line !== null
          )
          .join("\n");

        const mailto =
          `mailto:info@wisemoveconsultancy.com` +
          `?subject=${encodeURIComponent(
            subject
          )}` +
          `&body=${encodeURIComponent(
            body
          )}`;

        submitButton.disabled =
          true;

        submitButton.setAttribute(
          "data-state",
          "opening-email"
        );

        if (submitLabel) {
          submitLabel.textContent =
            "Opening Email App";
        }

        setStatus(
          "Opening your email application with your enquiry pre-filled."
        );

        window.location.href =
          mailto;

        window.setTimeout(
          () => {
            submitButton.disabled =
              false;

            submitButton.removeAttribute(
              "data-state"
            );

            if (submitLabel) {
              submitLabel.textContent =
                originalText;
            }

            setStatus(
              "Complete the enquiry by sending it from your email application."
            );
          },
          2200
        );
      }
    );
  }


  /* ==========================================================================
     SMOOTH INTERNAL LINKS
     ========================================================================== */

  function initInternalLinks() {
    const links =
      qsa(
        'a[href^="#"]'
      );

    if (!links.length) return;

    links.forEach(
      (link) => {
        link.addEventListener(
          "click",
          (event) => {
            const href =
              link.getAttribute(
                "href"
              );

            if (
              !href ||
              href === "#"
            ) {
              event.preventDefault();

              window.scrollTo({
                top: 0,

                behavior:
                  reduceMotion
                    ? "auto"
                    : "smooth"
              });

              return;
            }

            let target;

            try {
              target =
                document.querySelector(
                  href
                );
            } catch (error) {
              return;
            }

            if (!target) return;

            event.preventDefault();

            target.scrollIntoView({
              behavior:
                reduceMotion
                  ? "auto"
                  : "smooth",

              block: "start"
            });
          }
        );
      }
    );
  }


  /* ==========================================================================
     EXTERNAL LINK SAFETY
     ========================================================================== */

  function initExternalLinkSafety() {
    const externalLinks =
      qsa(
        'a[target="_blank"]'
      );

    externalLinks.forEach(
      (link) => {
        const currentRel =
          new Set(
            (
              link.getAttribute(
                "rel"
              ) || ""
            )
              .split(/\s+/)
              .filter(Boolean)
          );

        currentRel.add(
          "noopener"
        );

        currentRel.add(
          "noreferrer"
        );

        link.setAttribute(
          "rel",
          Array.from(
            currentRel
          ).join(" ")
        );
      }
    );
  }


  /* ==========================================================================
     ACTIVE NAV LINK
     Highlights section currently being viewed.
     ========================================================================== */

  function initActiveNavigation() {
    const navLinks =
      qsa(
        '.nav-links a[href^="#"]'
      );

    if (
      !navLinks.length ||
      !("IntersectionObserver" in window)
    ) {
      return;
    }

    const sectionMap =
      new Map();

    navLinks.forEach(
      (link) => {
        const href =
          link.getAttribute(
            "href"
          );

        if (
          !href ||
          href === "#"
        ) {
          return;
        }

        const section =
          qs(href);

        if (!section) return;

        sectionMap.set(
          section,
          link
        );
      }
    );

    if (!sectionMap.size) return;

    const observer =
      new IntersectionObserver(
        (entries) => {
          const visible =
            entries
              .filter(
                (entry) =>
                  entry.isIntersecting
              )
              .sort(
                (a, b) =>
                  b.intersectionRatio -
                  a.intersectionRatio
              );

          if (!visible.length) {
            return;
          }

          navLinks.forEach(
            (link) => {
              link.classList.remove(
                "is-active"
              );

              link.removeAttribute(
                "aria-current"
              );
            }
          );

          const activeLink =
            sectionMap.get(
              visible[0].target
            );

          if (activeLink) {
            activeLink.classList.add(
              "is-active"
            );

            activeLink.setAttribute(
              "aria-current",
              "page"
            );
          }
        },
        {
          threshold: [
            0.15,
            0.3,
            0.5
          ],

          rootMargin:
            "-20% 0px -55% 0px"
        }
      );

    sectionMap.forEach(
      (link, section) => {
        observer.observe(
          section
        );
      }
    );
  }


  /* ==========================================================================
     INITIALIZE
     ========================================================================== */

  function init() {
    initTheme();

    initNavbarScroll();

    initMobileNavigation();

    initHeroAnimation();

    initRevealAnimations();

    initCounters();

    initProcessSteps();

    initMoveJourney();

    initCaseStudies();

    initHeroPointerDepth();

    initFAQ();

    initContactForm();

    initInternalLinks();

    initExternalLinkSafety();

    initActiveNavigation();

    document.body.classList.add(
      "site-ready"
    );
  }


  if (
    document.readyState ===
    "loading"
  ) {
    document.addEventListener(
      "DOMContentLoaded",
      init,
      {
        once: true
      }
    );
  } else {
    init();
  }

})();
