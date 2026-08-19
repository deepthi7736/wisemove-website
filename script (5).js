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
  // visible via the plain (non `.js`) CSS rules.
  document.documentElement.classList.add('js');

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

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
     NAVBAR SCROLL STATE (subtle glass background on scroll)
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
     SCROLL REVEAL (reveal-line / reveal-fade / reveal-stagger)
     --------------------------------------------------------------------- */
  function initRevealAnimations(){
    const targets = document.querySelectorAll('.reveal-line, .reveal-fade, .reveal-stagger, .reveal-row');
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
     HERO ENTRANCE — short sequence (~1s), then THE WISEMOVE PRODUCT ENGINE
     signature animation: a purple indicator moves through each stage in
     turn (Discover → Strategy → Design → Build → Launch), then "Shipped"
     reveals. Plays once, then the panel is static.
     --------------------------------------------------------------------- */
  function initHeroAnimation(){
    const pill = document.querySelector('.status-pill');
    const heroLines = document.querySelectorAll('.hero .reveal-line');
    const engine = document.getElementById('engine');
    const stages = document.querySelectorAll('#engineStages .engine-stage');
    const shipped = document.getElementById('engineShipped');

    if(reduceMotion){
      if(pill) pill.classList.add('in');
      heroLines.forEach(l => l.classList.add('in'));
      if(engine) engine.classList.add('in');
      stages.forEach(s => s.classList.add('active'));
      if(shipped) shipped.classList.add('in');
      return;
    }

    setTimeout(() => pill && pill.classList.add('in'), 80);
    heroLines.forEach((line, i) => {
      setTimeout(() => line.classList.add('in'), 220 + i * 130);
    });
    setTimeout(() => { if(engine) engine.classList.add('in'); }, 520);

    // stage-by-stage activation — total run ~700ms across 5 stages
    stages.forEach((stage, i) => {
      setTimeout(() => stage.classList.add('active'), 720 + i * 140);
    });
    setTimeout(() => { if(shipped) shipped.classList.add('in'); }, 720 + stages.length * 140 + 120);
  }

  /* ---------------------------------------------------------------------
     MOVE AN IDEA — signature transition section. Plays once when it
     enters the viewport: the connecting line fills, each stop lights up
     in sequence, then Getvia/Vashq reveal as the destination.
     --------------------------------------------------------------------- */
  function initMoveIdea(){
    const track = document.getElementById('moveTrack');
    if(!track) return;
    const stops = track.querySelectorAll('.move-stop');

    function play(){
      track.classList.add('in');
      stops.forEach((stop, i) => {
        setTimeout(() => stop.classList.add('hit'), reduceMotion ? 0 : 200 + i * 220);
      });
    }

    if(reduceMotion){
      play();
      return;
    }
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if(entry.isIntersecting){
          play();
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.4 });
    io.observe(track);
  }

  /* ---------------------------------------------------------------------
     ANIMATED COUNTERS (stats section) — simple count-up, once
     --------------------------------------------------------------------- */
  function initCounters(){
    const nums = document.querySelectorAll('.stat-num[data-target]');
    if(!nums.length) return;

    function animateCount(el){
      const target = el.getAttribute('data-target');
      const numeric = parseInt(target.replace(/\D/g,''), 10);
      if(reduceMotion || isNaN(numeric)){
        el.textContent = target;
        return;
      }
      const suffix = target.replace(/^[0-9]+/, '');
      const duration = 900;
      const start = performance.now();
      function tick(now){
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const value = Math.round(numeric * eased);
        el.textContent = value + suffix;
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
     the fields pre-filled, so nothing is faked.
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
     INIT
     --------------------------------------------------------------------- */
  document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initMobileNavigation();
    initNavbarScroll();
    initRevealAnimations();
    initHeroAnimation();
    initMoveIdea();
    initCounters();
    initFAQ();
    initContactForm();
  });
})();
