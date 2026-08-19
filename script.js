/* ==========================================================================
   WISEMOVE — MAIN SCRIPT
   Production-safe vanilla JavaScript
   Motion principle: MOVE → TRANSFORM → ARRIVE
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

  const hasFinePointer = window.matchMedia(
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
        const saved = localStorage.getItem(STORAGE_KEY);

        if (saved === "dark" || saved === "light") {
          return saved;
        }
      } catch (error) {
        // localStorage may be unavailable.
      }

      return "dark";
    }

    function applyTheme(theme) {
      body.setAttribute("data-theme", theme);

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
            ? "#0c0b11"
            : "#f7f6f2"
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

    applyTheme(getInitialTheme());

    toggle.addEventListener("click", () => {
      const current =
        body.getAttribute("data-theme");

      applyTheme(
        current === "dark"
          ? "light"
          : "dark"
      );
    });
  }


  /* ==========================================================================
     NAVBAR SCROLL STATE
     ========================================================================== */

  function initNavbar() {
    const header =
      document.getElementById("siteHeader");

    if (!header) return;

    let ticking = false;

    function updateHeader() {
      header.classList.toggle(
        "is-scrolled",
        window.scrollY > 16
      );

      ticking = false;
    }

    function requestUpdate() {
      if (ticking) return;

      ticking = true;

      requestAnimationFrame(
        updateHeader
      );
    }

    window.addEventListener(
      "scroll",
      requestUpdate,
      { passive: true }
    );

    updateHeader();
  }


  /* ==========================================================================
     MOBILE NAVIGATION
     ========================================================================== */

  function initMobileNavigation() {
    const burger =
      document.getElementById("navBurger");

    const menu =
      document.getElementById("mobileMenu");

    if (!burger || !menu) return;

    function setMenuState(open) {
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

      document.body.style.overflow =
        open ? "hidden" : "";

      const icon = qs(
        "span",
        burger
      );

      if (icon) {
        icon.textContent =
          open ? "×" : "☰";
      }
    }

    burger.addEventListener(
      "click",
      () => {
        const open =
          burger.getAttribute(
            "aria-expanded"
          ) !== "true";

        setMenuState(open);
      }
    );

    qsa("a", menu).forEach((link) => {
      link.addEventListener(
        "click",
        () => {
          setMenuState(false);
        }
      );
    });

    document.addEventListener(
      "keydown",
      (event) => {
        if (
          event.key === "Escape" &&
          burger.getAttribute(
            "aria-expanded"
          ) === "true"
        ) {
          setMenuState(false);
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
          setMenuState(false);
        }
      }
    );
  }


  /* ==========================================================================
     HERO ENTRANCE
     Short cinematic sequence.
     Plays once and then remains static.
     ========================================================================== */

  function initHeroAnimation() {
    const hero =
      qs(".hero");

    if (!hero) return;

    const elements =
      qsa("[data-hero-step]", hero);

    if (!elements.length) return;

    if (reduceMotion) {
      elements.forEach((element) => {
        element.classList.add(
          "is-visible"
        );
      });

      hero.classList.add(
        "hero-complete"
      );

      return;
    }

    const groupedSteps = {};

    elements.forEach((element) => {
      const step =
        Number(
          element.dataset.heroStep
        ) || 1;

      if (!groupedSteps[step]) {
        groupedSteps[step] = [];
      }

      groupedSteps[step].push(
        element
      );
    });

    const delays = {
      1: 80,
      2: 180,
      3: 310,
      4: 470,
      5: 620,
      6: 760
    };

    Object.keys(groupedSteps).forEach(
      (stepKey) => {
        const step =
          Number(stepKey);

        const delay =
          delays[step] ??
          120 * step;

        window.setTimeout(() => {
          groupedSteps[step].forEach(
            (element) => {
              element.classList.add(
                "is-visible"
              );
            }
          );
        }, delay);
      }
    );

    window.setTimeout(() => {
      hero.classList.add(
        "hero-complete"
      );
    }, 1150);
  }


  /* ==========================================================================
     STANDARD SCROLL REVEALS
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
      targets.forEach((element) => {
        element.classList.add(
          "is-visible"
        );
      });

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
            "0px 0px -7% 0px"
        }
      );

    targets.forEach((element) => {
      observer.observe(element);
    });
  }


  /* ==========================================================================
     STATS COUNTERS
     Runs once when the stat becomes visible.
     ========================================================================== */

  function initCounters() {
    const counters = qsa(
      ".stat-num[data-target]"
    );

    if (!counters.length) return;

    function getCounterData(target) {
      if (/^\d+\+$/.test(target)) {
        return {
          value: parseInt(
            target,
            10
          ),
          suffix: "+",
          leadingZero: false
        };
      }

      if (/^\d+%$/.test(target)) {
        return {
          value: parseInt(
            target,
            10
          ),
          suffix: "%",
          leadingZero: false
        };
      }

      if (/^\d+$/.test(target)) {
        return {
          value: parseInt(
            target,
            10
          ),
          suffix: "",
          leadingZero:
            target.length > 1 &&
            target.startsWith("0")
        };
      }

      return null;
    }

    function animateCounter(element) {
      const target =
        element.dataset.target;

      const data =
        getCounterData(target);

      if (
        reduceMotion ||
        !data
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
            data.value * eased
          );

        let display =
          String(current);

        if (
          data.leadingZero &&
          display.length <
            target.length
        ) {
          display =
            display.padStart(
              target.length,
              "0"
            );
        }

        element.textContent =
          display + data.suffix;

        if (progress < 1) {
          requestAnimationFrame(
            update
          );
        } else {
          element.textContent =
            target;
        }
      }

      requestAnimationFrame(update);
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

    counters.forEach((counter) => {
      observer.observe(counter);
    });
  }


  /* ==========================================================================
     HOW WE MOVE
     Activates one process step at a time as it reaches the reading zone.
     No connecting lines. No scroll-jacking.
     ========================================================================== */

  function initProcessSteps() {
    const list =
      document.getElementById(
        "processList"
      );

    if (!list) return;

    const steps = qsa(
      ".process-step",
      list
    );

    if (!steps.length) return;

    function activateStep(
      activeStep
    ) {
      steps.forEach((step) => {
        step.classList.toggle(
          "is-active",
          step === activeStep
        );
      });
    }

    if (
      reduceMotion ||
      !("IntersectionObserver" in window)
    ) {
      steps.forEach((step) => {
        step.classList.add(
          "is-visible"
        );
      });

      if (steps[0]) {
        activateStep(steps[0]);
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

          activateStep(
            visible[0].target
          );
        },
        {
          threshold: [
            0.3,
            0.45,
            0.6,
            0.75
          ],
          rootMargin:
            "-25% 0px -35% 0px"
        }
      );

    steps.forEach((step) => {
      revealObserver.observe(step);
      activeObserver.observe(step);
    });
  }


  /* ==========================================================================
     SIGNATURE "MOVE" JOURNEY
     IDEA → STRATEGY → DESIGN → BUILD → PRODUCT
     Runs once.
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

    const stages = qsa(
      ".move-stage",
      journey
    );

    const arrival =
      document.getElementById(
        "moveArrival"
      );

    if (!stages.length) return;

    let played = false;

    function setStage(index) {
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

      if (indicator) {
        const denominator =
          Math.max(
            stages.length - 1,
            1
          );

        const percentage =
          (index / denominator) *
          100;

        indicator.style.setProperty(
          "--move-position",
          `${percentage}%`
        );

        journey.style.setProperty(
          "--move-progress",
          `${percentage}%`
        );
      }
    }

    function finishJourney() {
      stages.forEach((stage) => {
        stage.classList.remove(
          "is-current"
        );

        stage.classList.add(
          "is-active"
        );
      });

      journey.classList.add(
        "is-complete"
      );

      if (arrival) {
        arrival.classList.add(
          "is-visible"
        );
      }
    }

    function playJourney() {
      if (played) return;

      played = true;

      journey.classList.add(
        "is-running"
      );

      if (reduceMotion) {
        setStage(
          stages.length - 1
        );

        finishJourney();

        return;
      }

      const interval = 210;

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
        finishJourney,
        stages.length *
          interval +
          180
      );
    }

    if (
      reduceMotion ||
      !("IntersectionObserver" in window)
    ) {
      playJourney();
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

              playJourney();

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

    observer.observe(journey);
  }


  /* ==========================================================================
     PRODUCT CASE STUDIES
     Adds a small reveal/settle state.
     No continuous parallax.
     ========================================================================== */

  function initCaseStudies() {
    const visuals = qsa(
      "[data-case-visual]"
    );

    if (!visuals.length) return;

    if (
      reduceMotion ||
      !("IntersectionObserver" in window)
    ) {
      visuals.forEach((visual) => {
        visual.classList.add(
          "is-settled"
        );
      });

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
          threshold: 0.25
        }
      );

    visuals.forEach((visual) => {
      observer.observe(visual);
    });
  }


  /* ==========================================================================
     SUBTLE DESKTOP PRODUCT RESPONSE
     Very small pointer movement on the hero composition only.
     ========================================================================== */

  function initHeroPointerDepth() {
    if (
      reduceMotion ||
      !hasFinePointer
    ) {
      return;
    }

    const composition =
      qs(".hero-composition");

    const canvas =
      qs(
        ".studio-canvas",
        composition || document
      );

    if (
      !composition ||
      !canvas
    ) {
      return;
    }

    let frame = null;

    function reset() {
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

              const x =
                (event.clientX -
                  rect.left) /
                rect.width;

              const y =
                (event.clientY -
                  rect.top) /
                rect.height;

              const rotateY =
                (x - 0.5) * 1.4;

              const rotateX =
                (0.5 - y) * 1.4;

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
      reset
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
      qsa(".faq-item", list);

    if (!items.length) return;

    function closeItem(item) {
      const button =
        qs(".faq-q", item);

      const answer =
        qs(".faq-a", item);

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
        qs(".faq-q", item);

      const answer =
        qs(".faq-a", item);

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

    items.forEach((item) => {
      const button =
        qs(".faq-q", item);

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
    });

    window.addEventListener(
      "resize",
      () => {
        items.forEach((item) => {
          if (
            !item.classList.contains(
              "is-open"
            )
          ) {
            return;
          }

          const answer =
            qs(".faq-a", item);

          if (answer) {
            answer.style.maxHeight =
              `${answer.scrollHeight}px`;
          }
        });
      }
    );
  }


  /* ==========================================================================
     CONTACT FORM
     Honest mailto behavior.
     Does NOT claim that the message was sent.
     ========================================================================== */

  function initContactForm() {
    const form =
      document.getElementById(
        "contactForm"
      );

    if (!form) return;

    const submitButton =
      qs(".form-submit", form);

    const submitLabel =
      qs(".submit-label", form);

    const status =
      document.getElementById(
        "formStatus"
      );

    if (!submitButton) return;

    const originalLabel =
      submitLabel
        ? submitLabel.textContent
        : "Send Message";

    function setStatus(message) {
      if (!status) return;

      status.textContent = message;
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
          qs("#fname", form)?.value.trim() ||
          "";

        const email =
          qs("#femail", form)?.value.trim() ||
          "";

        const phone =
          qs("#fphone", form)?.value.trim() ||
          "";

        const subject =
          qs("#fsubject", form)?.value.trim() ||
          "WiseMove project enquiry";

        const message =
          qs("#fmessage", form)?.value.trim() ||
          "";

        const emailBody = [
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
            emailBody
          )}`;

        submitButton.disabled = true;

        submitButton.setAttribute(
          "data-state",
          "opening-email"
        );

        if (submitLabel) {
          submitLabel.textContent =
            "Opening Email App";
        }

        setStatus(
          "Opening your email application with the enquiry pre-filled."
        );

        window.location.href =
          mailto;

        window.setTimeout(() => {
          submitButton.disabled =
            false;

          submitButton.removeAttribute(
            "data-state"
          );

          if (submitLabel) {
            submitLabel.textContent =
              originalLabel;
          }

          setStatus(
            "Your enquiry has not been submitted through the website. Send it from your email application to complete the enquiry."
          );
        }, 2200);
      }
    );
  }


  /* ==========================================================================
     SMOOTH INTERNAL NAVIGATION
     ========================================================================== */

  function initAnchorNavigation() {
    const links = qsa(
      'a[href^="#"]'
    );

    if (!links.length) return;

    links.forEach((link) => {
      link.addEventListener(
        "click",
        (event) => {
          const href =
            link.getAttribute("href");

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

          const target =
            qs(href);

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
    });
  }


  /* ==========================================================================
     EXTERNAL LINK SAFETY
     ========================================================================== */

  function initExternalLinkSafety() {
    const externalLinks = qsa(
      'a[target="_blank"]'
    );

    externalLinks.forEach((link) => {
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

      currentRel.add("noopener");
      currentRel.add("noreferrer");

      link.setAttribute(
        "rel",
        Array.from(
          currentRel
        ).join(" ")
      );
    });
  }


  /* ==========================================================================
     INITIALIZE
     ========================================================================== */

  function init() {
    initTheme();
    initNavbar();
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

    initAnchorNavigation();
    initExternalLinkSafety();

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
      { once: true }
    );
  } else {
    init();
  }

})();
