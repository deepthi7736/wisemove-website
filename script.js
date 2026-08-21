


/* ==========================================================================
   WISEMOVE — MAIN SCRIPT
   Full replacement for script.js
   Built for the current WiseMove reference-style HTML + CSS
   ========================================================================== */

(function () {
  'use strict';

  document.documentElement.classList.remove('no-js');
  document.documentElement.classList.add('js');

  const reduceMotion =
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const finePointer =
    window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  const qs = (selector, root = document) => root.querySelector(selector);
  const qsa = (selector, root = document) =>
    Array.from(root.querySelectorAll(selector));

  /* ==========================================================================
     THEME
     ========================================================================== */

  function initTheme() {
    const body = document.body;
    const toggle = qs('#themeToggle');
    const icon = qs('#themeIcon');

    if (!body || !toggle || !icon) return;

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
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
    `;

    function applyTheme(theme) {
      body.dataset.theme = theme;
      icon.innerHTML = theme === 'dark' ? sunIcon : moonIcon;

      toggle.setAttribute(
        'aria-label',
        theme === 'dark'
          ? 'Switch to light theme'
          : 'Switch to dark theme'
      );

      try {
        localStorage.setItem('wisemove-theme', theme);
      } catch (_) {}
    }

    let savedTheme = 'dark';

    try {
      const stored = localStorage.getItem('wisemove-theme');
      if (stored === 'light' || stored === 'dark') {
        savedTheme = stored;
      }
    } catch (_) {}

    applyTheme(savedTheme);

    toggle.addEventListener('click', () => {
      applyTheme(body.dataset.theme === 'dark' ? 'light' : 'dark');
    });
  }

  /* ==========================================================================
     NAVIGATION
     ========================================================================== */

  function initNavigation() {
    const header = qs('#siteHeader') || qs('.site-header') || qs('header');
    const burger = qs('#navBurger') || qs('.nav-burger');
    const menu = qs('#mobileMenu');

    function updateHeader() {
      if (!header) return;
      header.classList.toggle('scrolled', window.scrollY > 14);
    }

    updateHeader();

    window.addEventListener('scroll', updateHeader, {
      passive: true
    });

    if (!burger || !menu) return;

    function setMenu(open) {
      menu.classList.toggle('open', open);
      menu.setAttribute('aria-hidden', String(!open));

      burger.classList.toggle('open', open);
      burger.setAttribute('aria-expanded', String(open));
      burger.textContent = open ? '×' : '☰';

      document.body.classList.toggle('menu-open', open);
    }

    burger.addEventListener('click', () => {
      setMenu(!menu.classList.contains('open'));
    });

    qsa('a', menu).forEach(link => {
      link.addEventListener('click', () => setMenu(false));
    });

    window.addEventListener('resize', () => {
      if (window.innerWidth > 900) {
        setMenu(false);
      }
    });

    document.addEventListener('keydown', event => {
      if (event.key === 'Escape') {
        setMenu(false);
      }
    });
  }

  /* ==========================================================================
     SMOOTH INTERNAL LINKS
     ========================================================================== */

  function initSmoothLinks() {
    qsa('a[href^="#"]').forEach(link => {
      link.addEventListener('click', event => {
        const href = link.getAttribute('href');

        if (!href || href === '#') return;

        const target = qs(href);

        if (!target) return;

        event.preventDefault();

        target.scrollIntoView({
          behavior: reduceMotion ? 'auto' : 'smooth',
          block: 'start'
        });
      });
    });
  }

  /* ==========================================================================
     REVEAL ANIMATIONS
     ========================================================================== */

  function initRevealAnimations() {
    const targets = qsa('.reveal-fade, .reveal-stagger');

    if (!targets.length) return;

    if (
      reduceMotion ||
      !('IntersectionObserver' in window)
    ) {
      targets.forEach(target => target.classList.add('in'));
      return;
    }

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return;

          entry.target.classList.add('in');
          observer.unobserve(entry.target);
        });
      },
      {
        threshold: 0.12,
        rootMargin: '0px 0px -7% 0px'
      }
    );

    targets.forEach(target => observer.observe(target));
  }

  /* ==========================================================================
     HERO ENTRANCE
     ========================================================================== */

  function initHeroEntrance() {
    const hero = qs('.hero-premium') || qs('.hero');

    if (!hero) return;

    const heroItems = qsa(
      '.hero-kicker, .status-pill, .hero-description, .btn-row, .hero-proof-row, .hero-visual .reveal-fade',
      hero
    );

    if (reduceMotion) {
      heroItems.forEach(item => item.classList.add('in'));
      return;
    }

    heroItems.forEach((item, index) => {
      window.setTimeout(() => {
        item.classList.add('in');
      }, 90 + index * 95);
    });
  }

  /* ==========================================================================
     CURSOR GLOW
     ========================================================================== */

  function initCursorGlow() {
    const glow = qs('#cursorGlow');

    if (!glow || reduceMotion || !finePointer) return;

    let targetX = -300;
    let targetY = -300;
    let currentX = targetX;
    let currentY = targetY;
    let active = false;

    document.addEventListener(
      'pointermove',
      event => {
        targetX = event.clientX;
        targetY = event.clientY;

        if (!active) {
          active = true;
          glow.classList.add('visible');
        }
      },
      { passive: true }
    );

    document.addEventListener('pointerleave', () => {
      glow.classList.remove('visible');
      active = false;
    });

    function tick() {
      currentX += (targetX - currentX) * 0.12;
      currentY += (targetY - currentY) * 0.12;

      glow.style.transform =
        `translate3d(${currentX}px, ${currentY}px, 0) translate(-50%, -50%)`;

      requestAnimationFrame(tick);
    }

    requestAnimationFrame(tick);
  }

  /* ==========================================================================
     HERO PARALLAX
     ========================================================================== */

  function initHeroParallax() {
    if (reduceMotion || !finePointer) return;

    const roots = qsa('[data-parallax-root]');

    roots.forEach(root => {
      const layers = qsa('[data-parallax-layer]', root);

      if (!layers.length) return;

      let frame = null;

      function resetLayers() {
        layers.forEach(layer => {
          layer.style.transform = '';
        });
      }

      root.addEventListener('pointermove', event => {
        if (frame) cancelAnimationFrame(frame);

        frame = requestAnimationFrame(() => {
          const rect = root.getBoundingClientRect();

          const nx =
            (event.clientX - rect.left) / rect.width - 0.5;

          const ny =
            (event.clientY - rect.top) / rect.height - 0.5;

          layers.forEach(layer => {
            const strength =
              Number(layer.dataset.parallaxLayer) || 1;

            const x = nx * 13 * strength;
            const y = ny * 13 * strength;

            layer.style.transform =
              `translate3d(${x}px, ${y}px, 0)`;
          });
        });
      });

      root.addEventListener('pointerleave', resetLayers);
    });
  }

  /* ==========================================================================
     HERO SUBTLE FLOATING MOTION
     ========================================================================== */

  function initHeroFloating() {
    if (reduceMotion) return;

    const cards = qsa(
      '.hero-visual .float-card, .hero-core'
    );

    if (!cards.length) return;

    cards.forEach((card, index) => {
      card.animate(
        [
          { translate: '0 0' },
          {
            translate:
              `${index % 2 === 0 ? 0 : 3}px ${index % 2 === 0 ? -5 : 5}px`
          },
          { translate: '0 0' }
        ],
        {
          duration: 5200 + index * 700,
          iterations: Infinity,
          easing: 'ease-in-out',
          delay: index * -600
        }
      );
    });
  }

  /* ==========================================================================
     PROCESS / HOW WE MOVE
     ========================================================================== */

  function initProcessVisual() {
    const steps = qsa('.hwm-step');

    if (!steps.length) return;

    const visual = qs('#processVisual');
    const numberEl = qs('#processVisualNumber');
    const labelEl = qs('#processVisualLabel');
    const titleEl = qs('#processVisualTitle');
    const textEl = qs('#processVisualText');
    const progressEl = qs('#processProgressFill');

    const stageContent = {
      discovery: {
        label: 'DISCOVERY',
        title: 'Find the real problem.',
        text:
          'Research, business context, users and workflows come before interface decisions or code.'
      },
      strategy: {
        label: 'STRATEGY',
        title: 'Define the smartest path.',
        text:
          'Scope, priorities, architecture and product direction are aligned before execution begins.'
      },
      design: {
        label: 'DESIGN',
        title: 'Turn complexity into clarity.',
        text:
          'Flows, interfaces and interactions are shaped around how people will actually use the product.'
      },
      build: {
        label: 'BUILD',
        title: 'Engineer for real use.',
        text:
          'Development, integrations, quality and performance move together instead of becoming separate problems.'
      },
      launch: {
        label: 'LAUNCH',
        title: 'Ship with confidence.',
        text:
          'The product moves into production with a controlled rollout, validation and monitoring.'
      },
      scale: {
        label: 'SCALE',
        title: 'Keep improving what works.',
        text:
          'Support, maintenance, performance and product evolution continue after the first release.'
      }
    };

    function getStepData(step, index) {
      const processKey = step.dataset.process || '';

      const fallbackTitle =
        qs('h3, h4', step)?.textContent.trim() || '';

      const fallbackText =
        qs('p', step)?.textContent.trim() || '';

      const fallbackLabel =
        qs('small', step)?.textContent.trim() ||
        processKey.toUpperCase() ||
        'PROCESS';

      return {
        number:
          qs('.hwm-num', step)?.textContent.trim() ||
          String(index + 1).padStart(2, '0'),

        ...(stageContent[processKey] || {
          label: fallbackLabel,
          title: fallbackTitle,
          text: fallbackText
        })
      };
    }

    function activateStep(index) {
      const step = steps[index];

      if (!step) return;

      steps.forEach((item, i) => {
        item.classList.toggle('active', i === index);
      });

      const data = getStepData(step, index);

      if (numberEl) numberEl.textContent = data.number;
      if (labelEl) labelEl.textContent = data.label;
      if (titleEl) titleEl.textContent = data.title;
      if (textEl) textEl.textContent = data.text;

      if (progressEl) {
        progressEl.style.width =
          `${((index + 1) / steps.length) * 100}%`;
      }

      if (visual) {
        visual.dataset.activeStep = String(index + 1);
      }
    }

    activateStep(0);

    steps.forEach((step, index) => {
      step.addEventListener('click', () => {
        activateStep(index);
      });
    });

    if (
      reduceMotion ||
      !('IntersectionObserver' in window)
    ) {
      return;
    }

    const observer = new IntersectionObserver(
      entries => {
        const visible = entries
          .filter(entry => entry.isIntersecting)
          .sort(
            (a, b) =>
              b.intersectionRatio - a.intersectionRatio
          );

        if (!visible.length) return;

        const index = steps.indexOf(visible[0].target);

        if (index >= 0) {
          activateStep(index);
        }
      },
      {
        threshold: [0.2, 0.4, 0.6, 0.8],
        rootMargin: '-30% 0px -34% 0px'
      }
    );

    steps.forEach(step => observer.observe(step));
  }

  /* ==========================================================================
     PRODUCT TILT
     ========================================================================== */

  function initProductTilt() {
    if (reduceMotion || !finePointer) return;

    const cards = qsa('[data-tilt-card]');

    cards.forEach(card => {
      let frame = null;

      card.addEventListener('pointermove', event => {
        if (frame) cancelAnimationFrame(frame);

        frame = requestAnimationFrame(() => {
          const rect = card.getBoundingClientRect();

          const x =
            (event.clientX - rect.left) / rect.width - 0.5;

          const y =
            (event.clientY - rect.top) / rect.height - 0.5;

          const rotateY = x * 2.6;
          const rotateX = y * -2.2;

          card.style.transform =
            `perspective(1400px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        });
      });

      card.addEventListener('pointerleave', () => {
        card.style.transform = '';
      });
    });
  }

  /* ==========================================================================
     PRODUCT SCREENSHOT DEPTH
     ========================================================================== */

  function initProductDepth() {
    if (reduceMotion || !finePointer) return;

    const visuals = qsa('.product-case-visual');

    visuals.forEach(visual => {
      const primary = qs('.browser-primary', visual);
      const secondary = qs('.floating-shot', visual);
      const chips = qsa('.ui-chip', visual);

      visual.addEventListener('pointermove', event => {
        const rect = visual.getBoundingClientRect();

        const x =
          (event.clientX - rect.left) / rect.width - 0.5;

        const y =
          (event.clientY - rect.top) / rect.height - 0.5;

        if (primary) {
          primary.style.transform =
            `translate3d(${x * 5}px, ${y * 5}px, 0)`;
        }

        if (secondary) {
          secondary.style.transform =
            `translate3d(${x * -9}px, ${y * -8}px, 0)`;
        }

        chips.forEach((chip, index) => {
          const multiplier = index === 0 ? 12 : -10;

          chip.style.transform =
            `translate3d(${x * multiplier}px, ${y * multiplier}px, 0)`;
        });
      });

      visual.addEventListener('pointerleave', () => {
        if (primary) primary.style.transform = '';
        if (secondary) secondary.style.transform = '';

        chips.forEach(chip => {
          chip.style.transform = '';
        });
      });
    });
  }

  /* ==========================================================================
     COUNTERS
     ========================================================================== */

  function initCounters() {
    const counters = qsa('.stat-num[data-target]');

    if (!counters.length) return;

    function runCounter(element) {
      const target = element.dataset.target || '';
      const match = target.match(/^(\d+)(.*)$/);

      if (!match) {
        element.textContent = target;
        return;
      }

      const value = Number(match[1]);
      const suffix = match[2] || '';

      if (
        reduceMotion ||
        !Number.isFinite(value)
      ) {
        element.textContent = target;
        return;
      }

      const startedAt = performance.now();
      const duration = 950;

      function tick(now) {
        const progress =
          Math.min((now - startedAt) / duration, 1);

        const eased =
          1 - Math.pow(1 - progress, 3);

        const current =
          Math.round(value * eased);

        const preserveLeadingZero =
          match[1].length > 1 &&
          match[1].startsWith('0');

        element.textContent =
          `${preserveLeadingZero
            ? String(current).padStart(match[1].length, '0')
            : current}${suffix}`;

        if (progress < 1) {
          requestAnimationFrame(tick);
        } else {
          element.textContent = target;
        }
      }

      requestAnimationFrame(tick);
    }

    if (!('IntersectionObserver' in window)) {
      counters.forEach(runCounter);
      return;
    }

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return;

          runCounter(entry.target);
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.45 }
    );

    counters.forEach(counter => observer.observe(counter));
  }

  /* ==========================================================================
     FAQ
     ========================================================================== */

  function initFAQ() {
    const items = qsa('.faq-item');

    if (!items.length) return;

    function closeItem(item) {
      const button = qs('.faq-q', item);
      const answer = qs('.faq-a', item);

      item.classList.remove('open');

      if (button) {
        button.setAttribute('aria-expanded', 'false');
      }

      if (answer) {
        answer.style.maxHeight = '0px';
      }
    }

    items.forEach(item => {
      const button = qs('.faq-q', item);
      const answer = qs('.faq-a', item);

      if (!button || !answer) return;

      button.setAttribute('aria-expanded', 'false');
      answer.style.maxHeight = '0px';

      button.addEventListener('click', () => {
        const shouldOpen =
          !item.classList.contains('open');

        items.forEach(closeItem);

        if (shouldOpen) {
          item.classList.add('open');
          button.setAttribute('aria-expanded', 'true');
          answer.style.maxHeight =
            `${answer.scrollHeight}px`;
        }
      });
    });

    window.addEventListener('resize', () => {
      qsa('.faq-item.open').forEach(item => {
        const answer = qs('.faq-a', item);

        if (answer) {
          answer.style.maxHeight =
            `${answer.scrollHeight}px`;
        }
      });
    });
  }

  /* ==========================================================================
     ACTIVE NAVIGATION
     ========================================================================== */

  function initActiveNavigation() {
    const links = qsa('.nav-links a[href^="#"]');

    if (
      !links.length ||
      !('IntersectionObserver' in window)
    ) {
      return;
    }

    const sectionMap = links
      .map(link => {
        const href = link.getAttribute('href');

        if (!href || href === '#') return null;

        const section = qs(href);

        if (!section) return null;

        return { link, section };
      })
      .filter(Boolean);

    if (!sectionMap.length) return;

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return;

          sectionMap.forEach(item => {
            item.link.classList.toggle(
              'active',
              item.section === entry.target
            );
          });
        });
      },
      {
        rootMargin: '-34% 0px -56% 0px',
        threshold: 0
      }
    );

    sectionMap.forEach(item =>
      observer.observe(item.section)
    );
  }

  /* ==========================================================================
     MAGNETIC PRIMARY BUTTONS
     ========================================================================== */

  function initMagneticButtons() {
    if (reduceMotion || !finePointer) return;

    const buttons = qsa(
      '.btn-primary, .nav-cta, [data-magnetic]'
    );

    buttons.forEach(button => {
      button.addEventListener('pointermove', event => {
        const rect = button.getBoundingClientRect();

        const x =
          event.clientX - rect.left - rect.width / 2;

        const y =
          event.clientY - rect.top - rect.height / 2;

        button.style.transform =
          `translate3d(${x * 0.055}px, ${y * 0.08}px, 0)`;
      });

      button.addEventListener('pointerleave', () => {
        button.style.transform = '';
      });
    });
  }

  /* ==========================================================================
     CONTACT FORM
     ========================================================================== */

  function initContactForm() {
    const form = qs('#contactForm');

    if (!form) return;

    const submitButton =
      qs('.form-submit', form);

    const submitLabel =
      submitButton
        ? qs('.submit-label', submitButton)
        : null;

    const status = qs('#formStatus');

    const originalHTML =
      submitButton
        ? submitButton.innerHTML
        : '';

    form.addEventListener('submit', event => {
      event.preventDefault();

      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }

      const value = selector =>
        qs(selector, form)?.value.trim() || '';

      const name = value('#fname');
      const email = value('#femail');
      const phone = value('#fphone');
      const subject =
        value('#fsubject') ||
        'WiseMove project enquiry';

      const message = value('#fmessage');

      const body = [
        'WiseMove Website Enquiry',
        '',
        `Name: ${name}`,
        `Email: ${email}`,
        phone ? `Phone: ${phone}` : null,
        '',
        'Project details:',
        message
      ]
        .filter(line => line !== null)
        .join('\n');

      const mailto =
        `mailto:info@wisemoveconsultancy.com` +
        `?subject=${encodeURIComponent(subject)}` +
        `&body=${encodeURIComponent(body)}`;

      if (submitButton) {
        submitButton.disabled = true;
        submitButton.dataset.state = 'loading';

        if (submitLabel) {
          submitLabel.textContent =
            'Opening email app…';
        } else {
          submitButton.textContent =
            'Opening email app…';
        }
      }

      if (status) {
        status.textContent =
          'Opening your email application…';
      }

      window.location.href = mailto;

      window.setTimeout(() => {
        if (submitButton) {
          submitButton.disabled = false;
          submitButton.removeAttribute('data-state');
          submitButton.innerHTML = originalHTML;
        }

        if (status) {
          status.textContent = '';
        }
      }, 2200);
    });
  }

  /* ==========================================================================
     INITIALIZE
     ========================================================================== */

  function init() {
    initTheme();
    initNavigation();
    initSmoothLinks();
    initRevealAnimations();
    initHeroEntrance();
    initCursorGlow();
    initHeroParallax();
    initHeroFloating();
    initProcessVisual();
    initProductTilt();
    initProductDepth();
    initCounters();
    initFAQ();
    initActiveNavigation();
    initMagneticButtons();
    initContactForm();
  }

  if (document.readyState === 'loading') {
    document.addEventListener(
      'DOMContentLoaded',
      init,
      { once: true }
    );
  } else {
    init();
  }
})();
