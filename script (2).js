const sunIcon='<circle cx="12" cy="12" r="4"></circle><line x1="12" y1="2" x2="12" y2="4"></line><line x1="12" y1="20" x2="12" y2="22"></line><line x1="4.93" y1="4.93" x2="6.34" y2="6.34"></line><line x1="17.66" y1="17.66" x2="19.07" y2="19.07"></line><line x1="2" y1="12" x2="4" y2="12"></line><line x1="20" y1="12" x2="22" y2="12"></line><line x1="4.93" y1="19.07" x2="6.34" y2="17.66"></line><line x1="17.66" y1="6.34" x2="19.07" y2="4.93"></line>';
  const moonIcon='<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>';
  const body=document.body, icon=document.getElementById('themeIcon');
  function applyTheme(t){body.setAttribute('data-theme',t);icon.innerHTML=t==='dark'?sunIcon:moonIcon;}
  applyTheme('dark');
  document.getElementById('themeToggle').addEventListener('click',()=>{
    applyTheme(body.getAttribute('data-theme')==='dark'?'light':'dark');
  });

  document.querySelectorAll('.faq-q').forEach(btn=>{
    btn.addEventListener('click',()=>{
      const item=btn.parentElement, answer=item.querySelector('.faq-a'), isOpen=item.classList.contains('open');
      document.querySelectorAll('.faq-item.open').forEach(i=>{i.classList.remove('open');i.querySelector('.faq-a').style.maxHeight=null;});
      if(!isOpen){item.classList.add('open');answer.style.maxHeight=answer.scrollHeight+'px';}
    });
  });

  // scroll reveal
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if(!reduceMotion){
    const io=new IntersectionObserver((entries)=>{
      entries.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); } });
    },{threshold:0.12});
    document.querySelectorAll('.reveal').forEach(el=>io.observe(el));
  } else {
    document.querySelectorAll('.reveal').forEach(el=>el.classList.add('in'));
  }

  // terminal typing sequence
  const termBody=document.getElementById('termBody');
  const lines=[
    {t:'$ wisemove deploy getvia',cls:'term-prompt',pause:400},
    {t:'  → building product bundle...',cls:'term-muted',pause:500},
    {t:'  ✓ shipped — live at getvia.in',cls:'term-ok',pause:700},
    {t:'',cls:'',pause:200},
    {t:'$ wisemove deploy vashq',cls:'term-prompt',pause:400},
    {t:'  → building product bundle...',cls:'term-muted',pause:500},
    {t:'  ✓ shipped — live at home.vashq.com',cls:'term-ok',pause:700},
    {t:'',cls:'',pause:200},
    {t:'$ wisemove status',cls:'term-prompt',pause:400},
    {t:'  getvia   ● operational',cls:'term-muted',pause:150},
    {t:'  vashq    ● operational',cls:'term-muted',pause:400},
  ];

  function renderStatic(){
    termBody.innerHTML='';
    lines.forEach(l=>{
      const div=document.createElement('div');
      div.className='term-line '+l.cls;
      div.textContent=l.t||'\u00A0';
      termBody.appendChild(div);
    });
    const cur=document.createElement('div');
    cur.className='term-line term-prompt';
    cur.innerHTML='$ <span class="cursor"></span>';
    termBody.appendChild(cur);
  }

  async function typeSequence(){
    for(const l of lines){
      const div=document.createElement('div');
      div.className='term-line '+l.cls;
      termBody.appendChild(div);
      if(l.t){
        for(let i=0;i<l.t.length;i++){
          div.textContent+=l.t[i];
          await new Promise(r=>setTimeout(r,6));
        }
      } else {
        div.innerHTML='\u00A0';
      }
      await new Promise(r=>setTimeout(r,l.pause));
    }
    const cur=document.createElement('div');
    cur.className='term-line term-prompt';
    cur.innerHTML='$ <span class="cursor"></span>';
    termBody.appendChild(cur);
  }

  if(reduceMotion){ renderStatic(); } else { typeSequence(); }
