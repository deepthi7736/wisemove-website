(function(){
  "use strict";

  document.documentElement.classList.remove("no-js");
  document.documentElement.classList.add("js");

  const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const finePointer = matchMedia("(hover:hover) and (pointer:fine)").matches;
  const qs=(s,r=document)=>r.querySelector(s);
  const qsa=(s,r=document)=>[...r.querySelectorAll(s)];

  function initTheme(){
    const body=document.body,toggle=qs("#themeToggle"),icon=qs("#themeIcon");
    if(!toggle||!icon)return;

    const sun='<circle cx="12" cy="12" r="4"></circle><line x1="12" y1="2" x2="12" y2="4"></line><line x1="12" y1="20" x2="12" y2="22"></line><line x1="4" y1="12" x2="2" y2="12"></line><line x1="22" y1="12" x2="20" y2="12"></line>';
    const moon='<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>';

    function apply(theme){
      body.dataset.theme=theme;
      icon.innerHTML=theme==="dark"?sun:moon;
      try{localStorage.setItem("wisemove-theme",theme)}catch(e){}
    }

    let saved="dark";
    try{saved=localStorage.getItem("wisemove-theme")||"dark"}catch(e){}
    apply(saved);

    toggle.addEventListener("click",()=>apply(body.dataset.theme==="dark"?"light":"dark"));
  }

  function initNav(){
    const header=qs("#siteHeader"),burger=qs("#navBurger"),menu=qs("#mobileMenu");
    if(header){
      const update=()=>header.classList.toggle("is-scrolled",scrollY>14);
      addEventListener("scroll",update,{passive:true}); update();
    }
    if(burger&&menu){
      const setOpen=open=>{
        menu.classList.toggle("is-open",open);
        menu.setAttribute("aria-hidden",String(!open));
        burger.setAttribute("aria-expanded",String(open));
        burger.textContent=open?"×":"☰";
        document.body.classList.toggle("menu-open",open);
      };
      burger.addEventListener("click",()=>setOpen(burger.getAttribute("aria-expanded")!=="true"));
      qsa("a",menu).forEach(a=>a.addEventListener("click",()=>setOpen(false)));
    }
  }

  function initHero(){
    const els=qsa("[data-hero-step]");
    if(reduceMotion){els.forEach(e=>e.classList.add("is-visible"));return}
    const delays={1:80,2:190,3:340,4:500,5:650,6:820};
    els.forEach(el=>setTimeout(()=>el.classList.add("is-visible"),delays[el.dataset.heroStep]||200));
  }

  function initReveals(){
    const els=qsa(".reveal-fade,.reveal-text");
    if(reduceMotion||!("IntersectionObserver"in window)){els.forEach(e=>e.classList.add("is-visible"));return}
    const io=new IntersectionObserver(entries=>entries.forEach(entry=>{
      if(entry.isIntersecting){entry.target.classList.add("is-visible");io.unobserve(entry.target)}
    }),{threshold:.12,rootMargin:"0px 0px -8% 0px"});
    els.forEach(e=>io.observe(e));
  }

  function initCounters(){
    qsa(".stat-num[data-target]").forEach(el=>{
      const target=el.dataset.target;
      if(!/^[0-9]+[+%]?$/.test(target))return;
      const io=new IntersectionObserver(entries=>entries.forEach(entry=>{
        if(!entry.isIntersecting)return;
        io.unobserve(el);
        const n=parseInt(target,10),suffix=target.replace(/[0-9]/g,""),start=performance.now(),dur=900;
        const tick=now=>{
          const p=Math.min((now-start)/dur,1),v=Math.round(n*(1-Math.pow(1-p,3)));
          el.textContent=(target.startsWith("0")?String(v).padStart(target.length,"0"):v)+suffix;
          if(p<1)requestAnimationFrame(tick);else el.textContent=target;
        };
        requestAnimationFrame(tick);
      }),{threshold:.5});
      io.observe(el);
    });
  }

  function initProcess(){
    const steps=qsa("#processList .process-step");
    if(!steps.length)return;
    if(reduceMotion){steps.forEach(s=>s.classList.add("is-active"));return}
    const io=new IntersectionObserver(entries=>{
      const visible=entries.filter(e=>e.isIntersecting).sort((a,b)=>b.intersectionRatio-a.intersectionRatio);
      if(!visible.length)return;
      steps.forEach(s=>s.classList.toggle("is-active",s===visible[0].target));
    },{threshold:[.25,.45,.65],rootMargin:"-25% 0px -35% 0px"});
    steps.forEach(s=>io.observe(s));
  }

  function initMove(){
    const journey=qs("#moveJourney"),stages=qsa(".move-stage",journey||document);
    if(!journey||!stages.length)return;
    let played=false;
    const play=()=>{
      if(played)return;played=true;
      stages.forEach((s,i)=>setTimeout(()=>{
        stages.forEach((x,j)=>{x.classList.toggle("is-active",j<=i);x.classList.toggle("is-current",j===i)});
        journey.style.setProperty("--move-progress",`${i/(stages.length-1)*100}%`);
      },reduceMotion?0:i*220));
    };
    if(reduceMotion){play();return}
    const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){play();io.unobserve(e.target)}}),{threshold:.35});
    io.observe(journey);
  }

  function initProductMedia(){
    const stacks=qsa("[data-product-media]");
    if(!stacks.length)return;
    if(reduceMotion){stacks.forEach(s=>s.classList.add("is-visible"));return}

    const io=new IntersectionObserver(es=>es.forEach(e=>{
      if(e.isIntersecting){e.target.classList.add("is-visible");io.unobserve(e.target)}
    }),{threshold:.2});
    stacks.forEach(s=>io.observe(s));

    let ticking=false;
    const update=()=>{
      const vh=innerHeight;
      stacks.forEach(stack=>{
        const r=stack.getBoundingClientRect();
        const delta=((r.top+r.height/2)-vh/2)/vh;
        const py=Math.max(-24,Math.min(24,delta*-22));
        stack.style.setProperty("--py",`${py}px`);
      });
      ticking=false;
    };
    addEventListener("scroll",()=>{if(!ticking){ticking=true;requestAnimationFrame(update)}},{passive:true});
    update();

    if(finePointer){
      stacks.forEach(stack=>{
        stack.addEventListener("pointermove",e=>{
          const r=stack.getBoundingClientRect();
          const x=(e.clientX-r.left)/r.width,y=(e.clientY-r.top)/r.height;
          stack.style.setProperty("--ry",`${(x-.5)*1.1}deg`);
          stack.style.setProperty("--rx",`${(.5-y)*1.1}deg`);
        });
        stack.addEventListener("pointerleave",()=>{
          stack.style.setProperty("--ry","0deg");
          stack.style.setProperty("--rx","0deg");
        });
      });
    }
  }

  function initFAQ(){
    qsa(".faq-item").forEach(item=>{
      const btn=qs(".faq-q",item),ans=qs(".faq-a",item);
      if(!btn||!ans)return;
      btn.addEventListener("click",()=>{
        const open=item.classList.contains("is-open");
        qsa(".faq-item.is-open").forEach(other=>{
          other.classList.remove("is-open");
          qs(".faq-a",other).style.maxHeight="0px";
          qs(".faq-q",other).setAttribute("aria-expanded","false");
        });
        if(!open){
          item.classList.add("is-open");
          btn.setAttribute("aria-expanded","true");
          ans.style.maxHeight=ans.scrollHeight+"px";
        }
      });
    });
  }

  function initForm(){
    const form=qs("#contactForm");
    if(!form)return;
    form.addEventListener("submit",e=>{
      e.preventDefault();
      if(!form.checkValidity()){form.reportValidity();return}
      const name=qs("#fname").value.trim(),email=qs("#femail").value.trim(),phone=qs("#fphone").value.trim();
      const subject=qs("#fsubject").value.trim()||"WiseMove project enquiry";
      const message=qs("#fmessage").value.trim();
      const body=`WiseMove Website Enquiry\n\nName: ${name}\nEmail: ${email}\n${phone?`Phone: ${phone}\n`:""}\nProject details:\n${message}`;
      location.href=`mailto:info@wisemoveconsultancy.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    });
  }

  function initSmoothLinks(){
    qsa('a[href^="#"]').forEach(a=>a.addEventListener("click",e=>{
      const href=a.getAttribute("href"); if(!href||href==="#")return;
      const target=qs(href); if(!target)return;
      e.preventDefault(); target.scrollIntoView({behavior:reduceMotion?"auto":"smooth"});
    }));
  }

  function init(){
    initTheme();initNav();initHero();initReveals();initCounters();initProcess();initMove();initProductMedia();initFAQ();initForm();initSmoothLinks();
  }

  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",init,{once:true});else init();
})();
