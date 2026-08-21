/* ==========================================================================
   WISEMOVE — MAIN SCRIPT
   Interactive website behavior for the redesigned WiseMove product studio.
   ========================================================================== */

(function () {
  'use strict';

  document.documentElement.classList.add('js');

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = window.matchMedia('(pointer: fine)').matches;

  /* --------------------------------------------------------------------------
     THEME
     -------------------------------------------------------------------------- */
  function initTheme() {
    const body = document.body;
    const toggle = document.getElementById('themeToggle');
    const icon = document.getElementById('themeIcon');

    if (!toggle || !icon) return;

    const sunIcon = `
      <circle cx="12" cy="12" r="4"></circle>
      <line x1="12" y1="2" x2="12" y2="4"></line>
      <line x1="12" y1="20" x2="12" y2="22"></line>
      <line x1="4.93" y1="4.93" x2="6.34" y2="6.34"></line>
      <line x1="17.66" y1="17.66" x2="19.07" y2="19.07"></line>
      <line x1="2" y1="12" x2="4" y2="12"></line>
      <line x1="20" y1="12" x2="22" y2="12"></line>
      <line x1="4.93" y1="19.07" x2="6.34" y2="17.66"></line>
      <line x1="17.66" y1="6.34" x2="19.07" y2="4.93"></line>`;

    const moonIcon = `
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>`;

    function applyTheme(theme) {
      body.setAttribute('data-theme', theme);
      icon.innerHTML = theme === 'dark' ? sunIcon : moonIcon;
      toggle.setAttribute(
        'aria-label',
        theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'
      );

      try {
        localStorage.setItem('wisemove-theme', theme);
      } catch (_) {}
    }

    let savedTheme = null;
    try {
      savedTheme = localStorage.getItem('wisemove-theme');
    } catch (_) {}

    applyTheme(savedTheme === 'light' ? 'light' : 'dark');

    toggle.addEventListener('click', () => {
      applyTheme(body.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');
    });
  }

  /* --------------------------------------------------------------------------
     MOBILE NAVIGATION
     -------------------------------------------------------------------------- */
  function initMobileNavigation() {
    const burger = document.querySelector('.nav-burger');
    const menu = document.getElementById('mobileMenu');

    if (!burger || !menu) return;

    function closeMenu() {
      menu.classList.remove('open');
      burger.classList.remove('open');
      burger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }

    burger.addEventListener('click', () => {
      const open = !menu.classList.contains('open');

      menu.classList.toggle('open', open);
      burger.classList.toggle('open', open);
      burger.setAttribute('aria-expanded', String(open));
      document.body.style.overflow = open ? 'hidden' : '';
    });

    menu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', closeMenu);
    });

    window.addEventListener('resize', () => {
      if (window.innerWidth > 900) closeMenu();
    });
  }

  /* --------------------------------------------------------------------------
     NAVBAR SCROLL STATE
     -------------------------------------------------------------------------- */
  function initNavbarScroll() {
    const header = document.querySelector('header');
    if (!header) return;

    let ticking = false;

    function update() {
      header.classList.toggle('scrolled', window.scrollY > 16);
      ticking = false;
    }

    window.addEventListener(
      'scroll',
      () => {
        if (!ticking) {
          requestAnimationFrame(update);
          ticking = true;
        }
      },
      { passive: true }
    );

    update();
  }

  /* --------------------------------------------------------------------------
     SMOOTH INTERNAL LINKS
     -------------------------------------------------------------------------- */
  function initSmoothAnchors() {
    document.querySelectorAll('a[href^="#"]').forEach(link => {
      link.addEventListener('click', event => {
        const href = link.getAttribute('href');

        if (!href || href === '#') return;

        const target = document.querySelector(href);
        if (!target) return;

        event.preventDefault();

        target.scrollIntoView({
          behavior: reduceMotion ? 'auto' : 'smooth',
          block: 'start'
        });
      });
    });
  }

  /* --------------------------------------------------------------------------
     SCROLL REVEALS
     -------------------------------------------------------------------------- */
  function initRevealAnimations() {
    const targets = document.querySelectorAll(
      '.reveal-line, .reveal-fade, .reveal-stagger'
    );

    if (!targets.length) return;

    if (reduceMotion || !('IntersectionObserver' in window)) {
      targets.forEach(el => el.classList.add('in'));
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
        rootMargin: '0px 0px -6% 0px'
      }
    );

    targets.forEach(el => observer.observe(el));
  }

  /* --------------------------------------------------------------------------
     HERO ENTRANCE
     -------------------------------------------------------------------------- */
  function initHeroEntrance() {
    const hero = document.querySelector('.hero');
    if (!hero) return;

    const pill = hero.querySelector('.status-pill');
    const lines = hero.querySelectorAll('.reveal-line');
    const visual = document.getElementById('heroVisual');

    if (reduceMotion) {
      if (pill) pill.classList.add('in');
      lines.forEach(line => line.classList.add('in'));
      if (visual) visual.classList.add('in');
      return;
    }

    if (pill) {
      setTimeout(() => pill.classList.add('in'), 80);
    }

    lines.forEach((line, index) => {
      setTimeout(() => line.classList.add('in'), 180 + index * 120);
    });

    if (visual) {
      setTimeout(() => visual.classList.add('in'), 420);
    }
  }

  /* --------------------------------------------------------------------------
     HERO PARALLAX
     Elements may use:
       data-parallax-root
       data-parallax-layer="0.5"
     -------------------------------------------------------------------------- */
  function initParallax() {
    if (reduceMotion || !finePointer) return;

    const roots = document.querySelectorAll('[data-parallax-root]');
    if (!roots.length) return;

    roots.forEach(root => {
      const layers = root.querySelectorAll('[data-parallax-layer]');
      if (!layers.length) return;

      let frame = null;

      function reset() {
        layers.forEach(layer => {
          layer.style.transform = '';
        });
      }

      root.addEventListener('mousemove', event => {
        if (frame) cancelAnimationFrame(frame);

        frame = requestAnimationFrame(() => {
          const rect = root.getBoundingClientRect();
          const x = (event.clientX - rect.left) / rect.width - 0.5;
          const y = (event.clientY - rect.top) / rect.height - 0.5;

          layers.forEach(layer => {
            const strength =
              parseFloat(layer.getAttribute('data-parallax-layer')) || 1;

            const moveX = x * 18 * strength;
            const moveY = y * 18 * strength;

            layer.style.transform =
              `translate3d(${moveX}px, ${moveY}px, 0)`;
          });
        });
      });

      root.addEventListener('mouseleave', reset);
    });
  }

  /* --------------------------------------------------------------------------
     CURSOR GLOW
     -------------------------------------------------------------------------- */
  function initCursorGlow() {
    const glow = document.getElementById('cursorGlow');

    if (!glow || reduceMotion || !finePointer) return;

    let mouseX = -200;
    let mouseY = -200;
    let currentX = mouseX;
    let currentY = mouseY;

    document.addEventListener(
      'mousemove',
      event => {
        mouseX = event.clientX;
        mouseY = event.clientY;
        glow.classList.add('visible');
      },
      { passive: true }
    );

    document.addEventListener('mouseleave', () => {
      glow.classList.remove('visible');
    });

    function animate() {
      currentX += (mouseX - currentX) * 0.14;
      currentY += (mouseY - currentY) * 0.14;

      glow.style.transform =
        `translate3d(${currentX}px, ${currentY}px, 0) translate(-50%, -50%)`;

      requestAnimationFrame(animate);
    }

    requestAnimationFrame(animate);
  }

  /* --------------------------------------------------------------------------
     TILT CARDS
     Add data-tilt-card to any card that should react to pointer movement.
     -------------------------------------------------------------------------- */
  function initTiltCards() {
    if (reduceMotion || !finePointer) return;

    const cards = document.querySelectorAll('[data-tilt-card]');
    if (!cards.length) return;

    cards.forEach(card => {
      let frame = null;

      card.addEventListener('mousemove', event => {
        if (frame) cancelAnimationFrame(frame);

        frame = requestAnimationFrame(() => {
          const rect = card.getBoundingClientRect();

          const px = (event.clientX - rect.left) / rect.width;
          const py = (event.clientY - rect.top) / rect.height;

          const rotateY = (px - 0.5) * 7;
          const rotateX = (0.5 - py) * 7;

          card.style.transform =
            `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-3px)`;
        });
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
      });
    });
  }

  /* --------------------------------------------------------------------------
     HOW WE MOVE / PROCESS VISUAL
     Expected optional IDs:
       processVisual
       processVisualNumber
       processVisualLabel
       processVisualTitle
       processVisualText
       processProgressFill

     Process step content is read from data attributes when available.
     -------------------------------------------------------------------------- */
  function initProcessVisual() {
    const steps = Array.from(
      document.querySelectorAll(
        '.hwm-step, .process-step, [data-process-step]'
      )
    );

    if (!steps.length) return;

    const visual = document.getElementById('processVisual');
    const numberEl = document.getElementById('processVisualNumber');
    const labelEl = document.getElementById('processVisualLabel');
    const titleEl = document.getElementById('processVisualTitle');
    const textEl = document.getElementById('processVisualText');
    const progress = document.getElementById('processProgressFill');

    function stepData(step, index) {
      const numberNode = step.querySelector(
        '.hwm-num, .process-num, [data-step-number]'
      );
      const titleNode = step.querySelector(
        'h3, h4, .process-title, [data-step-title]'
      );
      const textNode = step.querySelector(
        'p:not(.eyebrow), .process-text, [data-step-text]'
      );

      return {
        number:
          step.dataset.number ||
          (numberNode ? numberNode.textContent.trim() : String(index + 1).padStart(2, '0')),
        label:
          step.dataset.label ||
          step.dataset.processLabel ||
          'WISEMOVE PROCESS',
        title:
          step.dataset.title ||
          (titleNode ? titleNode.textContent.trim() : ''),
        text:
          step.dataset.text ||
          (textNode ? textNode.textContent.trim() : '')
      };
    }

    function activate(index) {
      const step = steps[index];
      if (!step) return;

      steps.forEach((item, i) => {
        item.classList.toggle('active', i === index);
      });

      const data = stepData(step, index);

      if (numberEl) numberEl.textContent = data.number;
      if (labelEl) labelEl.textContent = data.label;
      if (titleEl) titleEl.textContent = data.title;
      if (textEl) textEl.textContent = data.text;

      if (progress) {
        const percentage =
          steps.length <= 1 ? 100 : ((index + 1) / steps.length) * 100;
        progress.style.width = `${percentage}%`;
      }

      if (visual) {
        visual.setAttribute('data-active-step', String(index + 1));
      }
    }

    activate(0);

    if (reduceMotion || !('IntersectionObserver' in window)) return;

    const observer = new IntersectionObserver(
      entries => {
        const visible = entries
          .filter(entry => entry.isIntersecting)
          .sort(
            (a, b) =>
              Math.abs(a.boundingClientRect.top - window.innerHeight * 0.5) -
              Math.abs(b.boundingClientRect.top - window.innerHeight * 0.5)
          );

        if (!visible.length) return;

        const index = steps.indexOf(visible[0].target);
        if (index >= 0) activate(index);
      },
      {
        rootMargin: '-34% 0px -34% 0px',
        threshold: [0, 0.2, 0.5, 1]
      }
    );

    steps.forEach(step => observer.observe(step));

    // Also allow click/tap selection.
    steps.forEach((step, index) => {
      step.addEventListener('click', () => activate(index));
    });
  }

  /* --------------------------------------------------------------------------
     PRODUCT / IMAGE CARD POINTER DEPTH
     -------------------------------------------------------------------------- */
  function initProductVisuals() {
    if (reduceMotion || !finePointer) return;

    const visuals = document.querySelectorAll(
      '.ps-visual-stack, .product-visual, [data-product-visual]'
    );

    visuals.forEach(visual => {
      const primary = visual.querySelector(
        '.ps-shot-primary, [data-product-primary]'
      );
      const secondary = visual.querySelector(
        '.ps-shot-secondary, [data-product-secondary]'
      );

      visual.addEventListener('mousemove', event => {
        const rect = visual.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width - 0.5;
        const y = (event.clientY - rect.top) / rect.height - 0.5;

        if (primary) {
          primary.style.transform =
            `translate3d(${x * 8}px, ${y * 8}px, 0)`;
        }

        if (secondary) {
          secondary.style.transform =
            `translate3d(${x * -14}px, ${y * -14}px, 0)`;
        }
      });

      visual.addEventListener('mouseleave', () => {
        if (primary) primary.style.transform = '';
        if (secondary) secondary.style.transform = '';
      });
    });
  }

  /* --------------------------------------------------------------------------
     COUNTERS
     -------------------------------------------------------------------------- */
  function initCounters() {
    const numbers = document.querySelectorAll('.stat-num[data-target]');
    if (!numbers.length) return;

    function animateCount(element) {
      const target = element.getAttribute('data-target') || '';
      const match = target.match(/^(\d+)(.*)$/);

      if (!match) {
        element.textContent = target;
        return;
      }

      const numeric = Number(match[1]);
      const suffix = match[2];

      if (reduceMotion || !Number.isFinite(numeric)) {
        element.textContent = target;
        return;
      }

      const duration = 950;
      const started = performance.now();

      function tick(now) {
        const progress = Math.min((now - started) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const value = Math.round(numeric * eased);

        element.textContent = `${value}${suffix}`;

        if (progress < 1) {
          requestAnimationFrame(tick);
        } else {
          element.textContent = target;
        }
      }

      requestAnimationFrame(tick);
    }

    if (!('IntersectionObserver' in window)) {
      numbers.forEach(animateCount);
      return;
    }

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return;

          animateCount(entry.target);
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.55 }
    );

    numbers.forEach(number => observer.observe(number));
  }

  /* --------------------------------------------------------------------------
     FAQ
     -------------------------------------------------------------------------- */
  function initFAQ() {
    const items = document.querySelectorAll('.faq-item');
    if (!items.length) return;

    items.forEach(item => {
      const button = item.querySelector('.faq-q');
      const answer = item.querySelector('.faq-a');

      if (!button || !answer) return;

      button.setAttribute('aria-expanded', 'false');

      button.addEventListener('click', () => {
        const opening = !item.classList.contains('open');

        items.forEach(other => {
          const otherButton = other.querySelector('.faq-q');
          const otherAnswer = other.querySelector('.faq-a');

          other.classList.remove('open');

          if (otherButton) {
            otherButton.setAttribute('aria-expanded', 'false');
          }

          if (otherAnswer) {
            otherAnswer.style.maxHeight = null;
          }
        });

        if (opening) {
          item.classList.add('open');
          button.setAttribute('aria-expanded', 'true');
          answer.style.maxHeight = `${answer.scrollHeight}px`;
        }
      });
    });

    window.addEventListener('resize', () => {
      document.querySelectorAll('.faq-item.open').forEach(item => {
        const answer = item.querySelector('.faq-a');
        if (answer) answer.style.maxHeight = `${answer.scrollHeight}px`;
      });
    });
  }

  /* --------------------------------------------------------------------------
     CONTACT FORM
     No fake submission: opens visitor's email client.
     -------------------------------------------------------------------------- */
  function initContactForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;

    const submitButton = form.querySelector('.form-submit');
    const originalText = submitButton ? submitButton.textContent : '';

    form.addEventListener('submit', event => {
      event.preventDefault();

      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }

      const getValue = selector => {
        const field = form.querySelector(selector);
        return field ? field.value.trim() : '';
      };

      const name = getValue('#fname');
      const email = getValue('#femail');
      const phone = getValue('#fphone');
      const subject = getValue('#fsubject') || 'Project enquiry';
      const message = getValue('#fmessage');

      const lines = [
        `Name: ${name}`,
        `Email: ${email}`,
        phone ? `Phone: ${phone}` : '',
        '',
        message
      ].filter((line, index) => line !== '' || index === 3);

      const mailto =
        `mailto:info@wisemoveconsultancy.com` +
        `?subject=${encodeURIComponent(subject)}` +
        `&body=${encodeURIComponent(lines.join('\n'))}`;

      if (submitButton) {
        submitButton.setAttribute('data-state', 'loading');
        submitButton.textContent = 'Opening email app…';
        submitButton.disabled = true;
      }

      window.location.href = mailto;

      window.setTimeout(() => {
        if (!submitButton) return;

        submitButton.removeAttribute('data-state');
        submitButton.textContent = originalText;
        submitButton.disabled = false;
      }, 2200);
    });
  }

  /* --------------------------------------------------------------------------
     ACTIVE NAV SECTION
     -------------------------------------------------------------------------- */
  function initActiveNavigation() {
    const navLinks = Array.from(
      document.querySelectorAll('.nav-links a[href^="#"]')
    );

    if (!navLinks.length || !('IntersectionObserver' in window)) return;

    const sections = navLinks
      .map(link => {
        const href = link.getAttribute('href');
        return href && href !== '#' ? document.querySelector(href) : null;
      })
      .filter(Boolean);

    if (!sections.length) return;

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return;

          const id = `#${entry.target.id}`;

          navLinks.forEach(link => {
            link.classList.toggle(
              'active',
              link.getAttribute('href') === id
            );
          });
        });
      },
      {
        rootMargin: '-35% 0px -55% 0px',
        threshold: 0
      }
    );

    sections.forEach(section => observer.observe(section));
  }

  /* --------------------------------------------------------------------------
     MAGNETIC CTA — very subtle
     -------------------------------------------------------------------------- */
  function initMagneticButtons() {
    if (reduceMotion || !finePointer) return;

    const buttons = document.querySelectorAll(
      '.btn-primary, .nav-cta, [data-magnetic]'
    );

    buttons.forEach(button => {
      button.addEventListener('mousemove', event => {
        const rect = button.getBoundingClientRect();

        const x = event.clientX - rect.left - rect.width / 2;
        const y = event.clientY - rect.top - rect.height / 2;

        button.style.transform =
          `translate3d(${x * 0.08}px, ${y * 0.12}px, 0)`;
      });

      button.addEventListener('mouseleave', () => {
        button.style.transform = '';
      });
    });
  }

  /* --------------------------------------------------------------------------
     INITIALIZE
     -------------------------------------------------------------------------- */
  function init() {
    initTheme();
    initMobileNavigation();
    initNavbarScroll();
    initSmoothAnchors();
    initRevealAnimations();
    initHeroEntrance();
    initParallax();
    initCursorGlow();
    initTiltCards();
    initProcessVisual();
    initProductVisuals();
    initCounters();
    initFAQ();
    initContactForm();
    initActiveNavigation();
    initMagneticButtons();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
