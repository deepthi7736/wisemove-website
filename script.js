/* ==========================================================================
   WISEMOVE — MAIN SCRIPT
   Organized into discrete init functions. Each checks for its elements
   before running, so a missing section never throws an error.
   ========================================================================== */

(function(){
  'use strict';

  // Progressive enhancement flag: only add hidden starting states in CSS
  // once we know JS actually ran. If this line never executes (script
  // blocked, errored, or failed to load), every section stays fully
  // visible via the plain (non `.js`) CSS rules — nothing is ever stuck
  // permanently hidden.
  document.documentElement.classList.add('js');

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isTouch = window.matchMedia('(pointer: coarse)').matches;

  /* ---------------------------------------------------------------------
     THEME TOGGLE
     --------------------------------------------------------------------- */
  function initTheme(){
    const body = document.body;
    const toggle = document.getElementById('themeToggle');
    const icon = document.getElementById('themeIcon');
    if(!toggle || !icon) return;

    const sunIcon = '<circle cx="12" cy="12" r="4"></circle><line x1="12" y1="2" x2="12" y2="4"></line><line x1="12" y1="20" x2="12" y2="22"></line><line x1="4.93" y1="4.93" x2="6.34" y2="6.34"></line><line x1="17.66" y1="17.66" x2="19.07" y2="19.07"></line><line x1="2" y1="12" x2="4" y2="12"></line><line x1="20" y1="12" x2="22" y2="12"></line><line x1="4.93" y1="19.07" x2="6.34" y2="17.66"></line><line x1="17.66" y1="6.34" x2="19.07" y2="4.93"></line>';
    const moonIcon = '<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>';

    function applyTheme(t){
      body.setAttribute('data-theme', t);
      icon.innerHTML = t === 'dark' ? sunIcon : moonIcon;
    }
    applyTheme('dark');
    toggle.addEventListener('click', () => {
      applyTheme(body.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');
    });
  }

  /* ---------------------------------------------------------------------
     MOBILE NAVIGATION
     --------------------------------------------------------------------- */
  function initMobileNavigation(){
    const burger = document.querySelector('.nav-burger');
    const menu = document.getElementById('mobileMenu');
    if(!burger || !menu) return;

    burger.addEventListener('click', () => {
      const open = menu.classList.toggle('open');
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
      document.body.style.overflow = open ? 'hidden' : '';
    });
    menu.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        menu.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  /* ---------------------------------------------------------------------
     NAVBAR SCROLL STATE (glass effect)
     --------------------------------------------------------------------- */
  function initNavbarScroll(){
    const header = document.querySelector('header');
    if(!header) return;
    let ticking = false;
    function update(){
      header.classList.toggle('scrolled', window.scrollY > 12);
      ticking = false;
    }
    window.addEventListener('scroll', () => {
      if(!ticking){ requestAnimationFrame(update); ticking = true; }
    }, { passive:true });
    update();
  }

  /* ---------------------------------------------------------------------
     GENERIC SCROLL REVEAL (reveal-line / reveal-fade / reveal-stagger)
     --------------------------------------------------------------------- */
  function initRevealAnimations(){
    const targets = document.querySelectorAll('.reveal-line, .reveal-fade, .reveal-stagger');
    if(!targets.length) return;

    if(reduceMotion){
      targets.forEach(el => el.classList.add('in'));
      return;
    }
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if(entry.isIntersecting){
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    targets.forEach(el => io.observe(el));
  }

  /* ---------------------------------------------------------------------
     HERO ENTRANCE ANIMATION (headline mask reveal, staged sequence)
     --------------------------------------------------------------------- */
  function initHeroAnimation(){
    const pill = document.querySelector('.status-pill');
    const heroLines = document.querySelectorAll('.hero .reveal-line');
    const eco = document.querySelector('.ecosystem');

    if(reduceMotion){
      if(pill) pill.classList.add('in');
      heroLines.forEach(l => l.classList.add('in'));
      if(eco) eco.classList.add('in');
      initEcoTerminal(true);
      return;
    }

    setTimeout(() => pill && pill.classList.add('in'), 100);
    heroLines.forEach((line, i) => {
      setTimeout(() => line.classList.add('in'), 300 + i * 160);
    });
    setTimeout(() => { if(eco) eco.classList.add('in'); }, 700);
    setTimeout(() => initEcoTerminal(false), 1100);
  }

  function initEcoTerminal(instant){
    const term = document.getElementById('ecoTerm');
    if(!term) return;
    const lines = term.querySelectorAll('.line');
    if(instant){
      lines.forEach(l => l.classList.add('in'));
      return;
    }
    lines.forEach((line, i) => {
      setTimeout(() => line.classList.add('in'), i * 380);
    });
  }

  /* ---------------------------------------------------------------------
     ANIMATED COUNTERS (stats section)
     --------------------------------------------------------------------- */
  function initCounters(){
    const nums = document.querySelectorAll('.stat-num[data-target]');
    if(!nums.length) return;

    function animateCount(el){
      const target = el.getAttribute('data-target');
      const suffix = el.getAttribute('data-suffix') || '';
      const numeric = parseInt(target.replace(/\D/g,''), 10);
      if(reduceMotion || isNaN(numeric)){
        el.textContent = target;
        return;
      }
      const duration = 1200;
      const start = performance.now();
      function tick(now){
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const value = Math.round(numeric * eased);
        el.textContent = (target.includes('0') && target.length > String(numeric).length && numeric < 10)
          ? String(value).padStart(target.replace(/\D/g,'').length, '0') + suffix
          : value + suffix;
        if(progress < 1){ requestAnimationFrame(tick); } else { el.textContent = target; }
      }
      requestAnimationFrame(tick);
    }

    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if(entry.isIntersecting){
          animateCount(entry.target);
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.6 });
    nums.forEach(el => io.observe(el));
  }

  /* ---------------------------------------------------------------------
     PROCESS TIMELINE — scroll-driven progress line + active node state
     --------------------------------------------------------------------- */
  function initProcessTimeline(){
    const wrap = document.querySelector('.process-wrap');
    const fill = document.querySelector('.process-line-fill');
    const steps = document.querySelectorAll('.process-step');
    if(!wrap || !fill || !steps.length) return;

    let ticking = false;
    function update(){
      const rect = wrap.getBoundingClientRect();
      const vh = window.innerHeight;
      const total = rect.height + vh * 0.6;
      const scrolled = Math.min(Math.max(vh * 0.85 - rect.top, 0), total);
      const progress = Math.min(scrolled / total, 1);

      const isVertical = window.innerWidth <= 900;
      if(isVertical){
        fill.style.height = (progress * 100) + '%';
        fill.style.width = '2px';
      } else {
        fill.style.width = (progress * 100) + '%';
        fill.style.height = '2px';
      }

      const activeCount = Math.round(progress * steps.length);
      steps.forEach((step, i) => {
        step.classList.toggle('active', i < activeCount);
      });
      ticking = false;
    }
    window.addEventListener('scroll', () => {
      if(!ticking){ requestAnimationFrame(update); ticking = true; }
    }, { passive:true });
    window.addEventListener('resize', update, { passive:true });
    update();
  }

  /* ---------------------------------------------------------------------
     CARD SPOTLIGHT (cursor-following radial light on bento cards)
     --------------------------------------------------------------------- */
  function initCardSpotlights(){
    if(isTouch) return;
    const cards = document.querySelectorAll('.bento-card, .why-card, .product-card, .testi-card');
    if(!cards.length) return;
    cards.forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        card.style.setProperty('--mx', (e.clientX - rect.left) + 'px');
        card.style.setProperty('--my', (e.clientY - rect.top) + 'px');
      });
    });
  }

  /* ---------------------------------------------------------------------
     MAGNETIC BUTTONS (desktop only, subtle)
     --------------------------------------------------------------------- */
  function initMagneticButtons(){
    if(isTouch || reduceMotion) return;
    const buttons = document.querySelectorAll('[data-magnetic]');
    if(!buttons.length) return;
    const MAX = 5;
    buttons.forEach(btn => {
      btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const relX = (e.clientX - rect.left - rect.width / 2) / (rect.width / 2);
        const relY = (e.clientY - rect.top - rect.height / 2) / (rect.height / 2);
        btn.style.transform = `translate(${relX * MAX}px, ${relY * MAX}px)`;
      });
      btn.addEventListener('mouseleave', () => {
        btn.style.transform = 'translate(0,0)';
      });
    });
  }

  /* ---------------------------------------------------------------------
     FINAL CTA — glow follows cursor subtly
     --------------------------------------------------------------------- */
  function initFinalCtaGlow(){
    if(isTouch || reduceMotion) return;
    const section = document.querySelector('.final-cta');
    const glow = document.querySelector('.final-cta-glow');
    if(!section || !glow) return;
    section.addEventListener('mousemove', (e) => {
      const rect = section.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      glow.style.transform = `translate(${x - rect.width/2}px, ${y - rect.height/2}px) scale(1)`;
    });
    section.addEventListener('mouseleave', () => {
      glow.style.transform = 'translate(0,0) scale(1)';
    });
  }

  /* ---------------------------------------------------------------------
     FAQ ACCORDION
     --------------------------------------------------------------------- */
  function initFAQ(){
    const items = document.querySelectorAll('.faq-item');
    if(!items.length) return;
    items.forEach(item => {
      const btn = item.querySelector('.faq-q');
      const answer = item.querySelector('.faq-a');
      if(!btn || !answer) return;
      btn.addEventListener('click', () => {
        const isOpen = item.classList.contains('open');
        document.querySelectorAll('.faq-item.open').forEach(i => {
          i.classList.remove('open');
          i.querySelector('.faq-a').style.maxHeight = null;
        });
        if(!isOpen){
          item.classList.add('open');
          answer.style.maxHeight = answer.scrollHeight + 'px';
        }
      });
    });
  }

  /* ---------------------------------------------------------------------
     CONTACT FORM — honest behavior only.
     There is no backend wired up. This does NOT claim a message was
     "sent" or "received" — it opens the visitor's own email client with
     the fields pre-filled, so nothing is faked. Swap this for a real
     fetch() call to a form endpoint (Formspree, a serverless function,
     etc.) once a backend exists, and only show a "sent" state once a
     request has actually succeeded.
     --------------------------------------------------------------------- */
  function initContactForm(){
    const form = document.getElementById('contactForm');
    if(!form) return;
    const submitBtn = form.querySelector('.form-submit');
    if(!submitBtn) return;
    const originalText = submitBtn.textContent;

    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = (form.querySelector('#fname') || {}).value || '';
      const email = (form.querySelector('#femail') || {}).value || '';
      const phone = (form.querySelector('#fphone') || {}).value || '';
      const subject = (form.querySelector('#fsubject') || {}).value || 'Project enquiry';
      const message = (form.querySelector('#fmessage') || {}).value || '';

      const bodyLines = [
        `Name: ${name}`,
        `Email: ${email}`,
        phone ? `Phone: ${phone}` : null,
        '',
        message
      ].filter(Boolean).join('\n');

      const mailto = `mailto:info@wisemoveconsultancy.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(bodyLines)}`;

      submitBtn.setAttribute('data-state', 'loading');
      submitBtn.textContent = 'Opening your email app…';

      window.location.href = mailto;

      setTimeout(() => {
        submitBtn.removeAttribute('data-state');
        submitBtn.textContent = originalText;
      }, 2500);
    });
  }

  /* ---------------------------------------------------------------------
     MARQUEE — duplicate content for seamless infinite loop
     --------------------------------------------------------------------- */
  function initMarquee(){
    const track = document.querySelector('.marquee-track');
    if(!track) return;
    track.innerHTML += track.innerHTML; // duplicate once for seamless loop
  }

  /* ---------------------------------------------------------------------
     INIT
     --------------------------------------------------------------------- */
  document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initMobileNavigation();
    initNavbarScroll();
    initMarquee();
    initRevealAnimations();
    initHeroAnimation();
    initCounters();
    initProcessTimeline();
    initCardSpotlights();
    initMagneticButtons();
    initFinalCtaGlow();
    initFAQ();
    initContactForm();
  });
})();
