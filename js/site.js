(() => {
  'use strict';
  const $ = (s, root=document) => root.querySelector(s);
  const $$ = (s, root=document) => [...root.querySelectorAll(s)];
  const clamp = (n,min,max) => Math.max(min, Math.min(max,n));
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = matchMedia('(pointer:fine)').matches;

  document.documentElement.classList.add('js');

  // Header and page shell
  const header = $('[data-header]');
  let lastY = scrollY;
  const headerTick = () => {
    if (!header) return;
    const y = scrollY;
    header.classList.toggle('is-scrolled', y > 28);
    header.classList.toggle('is-hidden', y > 180 && y > lastY + 8 && !document.body.classList.contains('menu-open'));
    if (y < lastY - 8 || y < 120) header.classList.remove('is-hidden');
    lastY = y;
  };
  addEventListener('scroll', headerTick, {passive:true});

  // Mobile menu
  const menu = $('[data-menu]');
  const openMenu = () => {
    menu?.classList.add('is-open');
    menu?.setAttribute('aria-hidden','false');
    document.body.classList.add('menu-open');
  };
  const closeMenu = () => {
    menu?.classList.remove('is-open');
    menu?.setAttribute('aria-hidden','true');
    document.body.classList.remove('menu-open');
  };
  $('[data-menu-open]')?.addEventListener('click', openMenu);
  $('[data-menu-close]')?.addEventListener('click', closeMenu);

  // Cursor, intentionally subtle. It becomes the exact apex mark on interactive targets.
  if (finePointer) {
    const cursor = document.createElement('div');
    cursor.className = 'apex-cursor';
    cursor.innerHTML = '<img src="assets/brand/lungta-mark.png" alt="">';
    document.body.appendChild(cursor);
    let tx=-100, ty=-100, x=-100, y=-100;
    addEventListener('pointermove', e => { tx=e.clientX; ty=e.clientY; cursor.classList.add('is-visible'); });
    const loop = () => {
      x += (tx-x)*.18; y += (ty-y)*.18;
      cursor.style.transform = `translate3d(${x}px,${y}px,0) translate(-50%,-50%)`;
      requestAnimationFrame(loop);
    };
    loop();
    const hoverTargets = 'a,button,[data-tilt],[data-move-option],.product-tile';
    document.addEventListener('pointerover', e => { if(e.target.closest(hoverTargets)) cursor.classList.add('is-hot'); });
    document.addEventListener('pointerout', e => { if(e.target.closest(hoverTargets)) cursor.classList.remove('is-hot'); });
  }

  // Reveal compositions, not every sentence.
  if (!reduced && 'IntersectionObserver' in window) {
    const io = new IntersectionObserver(entries => {
      entries.forEach(entry => { if(entry.isIntersecting){ entry.target.classList.add('is-seen'); io.unobserve(entry.target); } });
    }, {threshold:.13, rootMargin:'0px 0px -6%'});
    $$('[data-reveal]').forEach(el => io.observe(el));
  } else {
    $$('[data-reveal]').forEach(el => el.classList.add('is-seen'));
  }

  // Intro uses the exact horse and exact mark extracted from the approved identity board.
  const intro = $('[data-intro]');
  if (intro) {
    const skip = $('[data-intro-skip]');
    const finish = () => {
      intro.classList.add('is-done');
      setTimeout(() => intro.remove(), 900);
      sessionStorage.setItem('lungta-intro-seen','1');
    };
    skip?.addEventListener('click', finish);
    if (reduced || sessionStorage.getItem('lungta-intro-seen')) {
      intro.remove();
    } else {
      setTimeout(() => intro.classList.add('stage-two'), 900);
      setTimeout(() => intro.classList.add('stage-three'), 2100);
      setTimeout(finish, 3400);
    }
  }

  // Reactive wind field for hero and brand pages.
  function windField(canvas, variant='dark') {
    if (!canvas) return;
    const ctx = canvas.getContext('2d', {alpha:true});
    let W=0,H=0,dpr=1,t=0,px=.5,py=.5;
    const lines = [];
    const count = matchMedia('(max-width:700px)').matches ? 34 : 62;
    for(let i=0;i<count;i++) lines.push({
      y:Math.random(), amp:.015+Math.random()*.065, speed:.18+Math.random()*.5,
      offset:Math.random()*10, alpha:.025+Math.random()*.11, width:.5+Math.random()*1.4
    });
    function resize(){
      dpr=Math.min(devicePixelRatio||1,2); W=canvas.clientWidth; H=canvas.clientHeight;
      canvas.width=W*dpr; canvas.height=H*dpr; ctx.setTransform(dpr,0,0,dpr,0,0);
    }
    resize(); addEventListener('resize', resize);
    canvas.addEventListener('pointermove', e=>{const r=canvas.getBoundingClientRect();px=(e.clientX-r.left)/r.width;py=(e.clientY-r.top)/r.height;});
    const ink = variant==='light' ? '0,0,0' : '255,255,255';
    function draw(){
      ctx.clearRect(0,0,W,H); t += .012;
      lines.forEach((l,idx)=>{
        const base=l.y*H + (py-.5)*H*.035*Math.sin(idx*.37);
        ctx.beginPath();
        for(let x=-40;x<=W+40;x+=18){
          const u=x/W;
          const wave=Math.sin(u*7.2 + t*l.speed*5 + l.offset)*H*l.amp;
          const micro=Math.sin(u*18 - t*1.3 + idx)*H*l.amp*.18;
          const pull=(px-.5)*H*.025*Math.sin(u*Math.PI);
          const y=base+wave+micro+pull;
          if(x===-40) ctx.moveTo(x,y); else ctx.lineTo(x,y);
        }
        ctx.strokeStyle=`rgba(${ink},${l.alpha})`; ctx.lineWidth=l.width; ctx.stroke();
      });
      if(!reduced) requestAnimationFrame(draw);
    }
    draw();
  }
  $$('[data-wind-canvas]').forEach(c => windField(c, c.dataset.windCanvas || 'dark'));

  // Faux 3D fabric mesh canvas. Fully local and responsive, no CDN dependency.
  function fabricMesh(canvas){
    if(!canvas) return;
    const ctx=canvas.getContext('2d'); let W=0,H=0,dpr=1,t=0,mx=.5,my=.5;
    const cols=22, rows=18;
    function resize(){ dpr=Math.min(devicePixelRatio||1,2);W=canvas.clientWidth;H=canvas.clientHeight;canvas.width=W*dpr;canvas.height=H*dpr;ctx.setTransform(dpr,0,0,dpr,0,0); }
    resize(); addEventListener('resize',resize);
    canvas.addEventListener('pointermove',e=>{const r=canvas.getBoundingClientRect();mx=(e.clientX-r.left)/r.width;my=(e.clientY-r.top)/r.height;});
    canvas.addEventListener('pointerleave',()=>{mx=.5;my=.5});
    function point(c,r){
      const u=c/(cols-1), v=r/(rows-1);
      const perspective=.72 + v*.52;
      const cx=W*.5 + (u-.5)*W*.86*perspective;
      const cy=H*.08 + v*H*.85;
      const z=Math.sin(u*7+t*1.7)*Math.cos(v*6-t*.9)*34 + Math.sin((u+v)*10+t)*15;
      const mouse=Math.max(0,1-Math.hypot(u-mx,v-my)*2.4)*45;
      return [cx+(u-.5)*(z+mouse)*.35, cy+(z+mouse)*(1-v)*.45];
    }
    function draw(){
      ctx.clearRect(0,0,W,H);
      const grad=ctx.createLinearGradient(0,0,W,H);grad.addColorStop(0,'rgba(255,255,255,.03)');grad.addColorStop(.5,'rgba(255,255,255,.22)');grad.addColorStop(1,'rgba(255,255,255,.025)');
      ctx.strokeStyle=grad;ctx.lineWidth=1;
      for(let r=0;r<rows;r++){ctx.beginPath();for(let c=0;c<cols;c++){const [x,y]=point(c,r);c?ctx.lineTo(x,y):ctx.moveTo(x,y)}ctx.stroke();}
      ctx.strokeStyle='rgba(255,255,255,.085)';
      for(let c=0;c<cols;c++){ctx.beginPath();for(let r=0;r<rows;r++){const [x,y]=point(c,r);r?ctx.lineTo(x,y):ctx.moveTo(x,y)}ctx.stroke();}
      t+=.012;if(!reduced)requestAnimationFrame(draw);
    }
    draw();
  }
  $$('[data-fabric-canvas]').forEach(fabricMesh);

  // Image / card tilt is constrained so layouts never leave their boxes.
  if (finePointer && !reduced) {
    $$('[data-tilt]').forEach(el => {
      el.addEventListener('pointermove', e => {
        const r=el.getBoundingClientRect();
        const x=(e.clientX-r.left)/r.width-.5, y=(e.clientY-r.top)/r.height-.5;
        el.style.setProperty('--rx', `${(-y*3.2).toFixed(2)}deg`);
        el.style.setProperty('--ry', `${(x*4.2).toFixed(2)}deg`);
        el.style.setProperty('--mx', `${((x+.5)*100).toFixed(1)}%`);
        el.style.setProperty('--my', `${((y+.5)*100).toFixed(1)}%`);
      });
      el.addEventListener('pointerleave',()=>{el.style.setProperty('--rx','0deg');el.style.setProperty('--ry','0deg');});
    });
  }

  // Home day-index interaction.
  const dayImage = $('[data-day-image]');
  const dayTitle = $('[data-day-title]');
  const dayCopy = $('[data-day-copy]');
  const dayStamp = $('[data-day-stamp]');
  const dayMap = {
    '0612': {time:'06:12',title:'TRAIN.',copy:'Support when the body asks for it. Nothing extra when it does not.',img:'assets/images/jump.webp'},
    '1240': {time:'12:40',title:'MOVE.',copy:'From studio floor to the rest of the city without a costume change.',img:'assets/images/building.webp'},
    '1810': {time:'18:10',title:'SHIFT.',copy:'The same system settles into slower hours without losing its line.',img:'assets/images/stretch.webp'},
    '2148': {time:'21:48',title:'RESET.',copy:'Recovery is movement too. Soft enough to disappear when the day finally does.',img:'assets/images/yoga.webp'}
  };
  $$('[data-day-option]').forEach(btn=>btn.addEventListener('click',()=>{
    const d=dayMap[btn.dataset.dayOption]; if(!d||!dayImage)return;
    $$('[data-day-option]').forEach(b=>b.classList.toggle('is-active',b===btn));
    const wrap=dayImage.closest('.day-image-wrap'); wrap?.classList.add('is-changing');
    setTimeout(()=>{dayImage.src=d.img;dayTitle.textContent=d.title;dayCopy.textContent=d.copy;dayStamp.textContent=d.time;wrap?.classList.remove('is-changing');},220);
  }));

  // Movement index interaction, used on home and movement page.
  const moveData = {
    flow:{no:'01',title:'FLOW',copy:'Range without resistance. Quiet support through slower shapes.',image:'assets/images/yoga.webp'},
    train:{no:'02',title:'TRAIN',copy:'Hold through effort. Recover without a hard edge.',image:'assets/images/stretch.webp'},
    run:{no:'03',title:'RUN',copy:'Light layers, clean movement, nothing loose.',image:'assets/images/jump.webp'},
    reset:{no:'04',title:'RESET',copy:'A softer register for recovery and the hours between.',image:'assets/images/blur.webp'},
    everywhere:{no:'05',title:'EVERYWHERE',copy:'One set. No costume change. The full-day proposition.',image:'assets/images/building.webp'}
  };
  $$('[data-move-system]').forEach(system=>{
    const image=$('[data-move-image]',system), title=$('[data-move-title]',system), copy=$('[data-move-copy]',system), no=$('[data-move-no]',system);
    $$('[data-move-option]',system).forEach(btn=>btn.addEventListener('click',()=>{
      const m=moveData[btn.dataset.moveOption]; if(!m)return;
      $$('[data-move-option]',system).forEach(b=>b.classList.toggle('is-active',b===btn));
      system.classList.add('is-switching');
      setTimeout(()=>{if(image)image.src=m.image;if(title)title.textContent=m.title;if(copy)copy.textContent=m.copy;if(no)no.textContent=m.no;system.classList.remove('is-switching');},200);
    }));
  });

  // Material scan interaction.
  $$('[data-scan]').forEach(scan=>{
    const lens=$('[data-scan-lens]',scan);
    const move=e=>{const r=scan.getBoundingClientRect();const x=clamp(e.clientX-r.left,0,r.width),y=clamp(e.clientY-r.top,0,r.height);scan.style.setProperty('--scan-x',`${x}px`);scan.style.setProperty('--scan-y',`${y}px`);lens?.classList.add('is-on');};
    scan.addEventListener('pointermove',move);scan.addEventListener('pointerleave',()=>lens?.classList.remove('is-on'));
  });

  // Bag uses localStorage and survives pages.
  const products = window.LUNGTA_PRODUCTS || {};
  let bag=[];
  try { bag=JSON.parse(localStorage.getItem('lungta-bag')||'[]'); if(!Array.isArray(bag))bag=[]; } catch { bag=[]; }
  const bagEl=$('[data-bag]'), bagBackdrop=$('[data-bag-backdrop]'), itemsEl=$('[data-bag-items]'), totalEl=$('[data-bag-total]');
  function saveBag(){localStorage.setItem('lungta-bag',JSON.stringify(bag));renderBag();}
  function renderBag(){
    $$('[data-bag-count]').forEach(el=>el.textContent=bag.length);
    const total=bag.reduce((sum,item)=>sum+(products[item.slug]?.price||0),0);
    if(totalEl)totalEl.textContent='₹'+total.toLocaleString('en-IN');
    if(!itemsEl)return;
    if(!bag.length){itemsEl.innerHTML='<div class="bag-empty"><img src="assets/brand/lungta-mark.png" alt=""><p>Your bag is moving light.</p><a href="drop.html">ENTER DROP 01</a></div>';return;}
    itemsEl.innerHTML=bag.map((item,i)=>{const p=products[item.slug];if(!p)return'';return `<article class="bag-item"><img src="${p.image}" alt="${p.name}"><div><span>${p.index} / DROP 01</span><h3>${p.name}</h3><p>SIZE ${item.size||'S'} / ${p.priceText}</p></div><button type="button" data-bag-remove="${i}" aria-label="Remove ${p.name}">REMOVE</button></article>`}).join('');
    $$('[data-bag-remove]',itemsEl).forEach(btn=>btn.addEventListener('click',()=>{bag.splice(+btn.dataset.bagRemove,1);saveBag();}));
  }
  function openBag(){bagEl?.classList.add('is-open');bagEl?.setAttribute('aria-hidden','false');bagBackdrop?.classList.add('is-open');document.body.classList.add('bag-open');}
  function closeBag(){bagEl?.classList.remove('is-open');bagEl?.setAttribute('aria-hidden','true');bagBackdrop?.classList.remove('is-open');document.body.classList.remove('bag-open');}
  $$('[data-bag-open]').forEach(b=>b.addEventListener('click',openBag));
  $('[data-bag-close]')?.addEventListener('click',closeBag);bagBackdrop?.addEventListener('click',closeBag);
  document.addEventListener('lungta:add-to-bag',e=>{if(!e.detail?.slug)return;bag.push({slug:e.detail.slug,size:e.detail.size||'S'});saveBag();openBag();});
  renderBag();
  $('[data-checkout]')?.addEventListener('click',()=>{
    const note=$('[data-checkout-note]');
    if(note) note.textContent='PAYMENT API HOOK READY. CONNECT RAZORPAY OR STRIPE WITH LIVE CREDENTIALS.';
  });

  // Quick add defaults to S only for prototype cards.
  $$('[data-quick-add]').forEach(btn=>btn.addEventListener('click',e=>{e.preventDefault();e.stopPropagation();document.dispatchEvent(new CustomEvent('lungta:add-to-bag',{detail:{slug:btn.dataset.quickAdd,size:'S'}}));}));

  // Escape closes all overlays.
  addEventListener('keydown',e=>{if(e.key==='Escape'){closeBag();closeMenu();}});

  // Scroll progress line.
  const progress=document.createElement('div');progress.className='scroll-progress';document.body.appendChild(progress);
  const progressTick=()=>{const max=document.documentElement.scrollHeight-innerHeight;progress.style.transform=`scaleX(${max>0?scrollY/max:0})`;};
  addEventListener('scroll',progressTick,{passive:true});progressTick();
})();
