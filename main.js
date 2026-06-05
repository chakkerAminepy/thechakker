/* =========================================================
   AMINE CHAKKER — PORTFOLIO v4
   Loading · Transitions · Cursor · Parallax · Reveals · Three.js
   ========================================================= */

(() => {
  const reduced  = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isTouch  = matchMedia('(max-width: 820px)').matches || ('ontouchstart' in window);
  const EASE_STR = 'cubic-bezier(0.16, 1, 0.3, 1)';

  /* ─── Scroll Progress ───────────────────────────────── */
  const bar = document.getElementById('scroll-progress');
  if (bar) {
    const updateBar = () => {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      bar.style.transform = `scaleX(${h > 0 ? window.scrollY / h : 0})`;
    };
    window.addEventListener('scroll', updateBar, { passive: true });
    updateBar();
  }

  /* ─── Page Transitions ──────────────────────────────── */
  const pt = document.getElementById('pt');
  if (pt) {
    // Page enter: curtain starts at translateY(0), then slides UP
    pt.style.transform = 'translateY(0)';
    pt.style.transition = 'none';
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        pt.style.transition = 'transform 0.9s cubic-bezier(0.77, 0, 0.175, 1)';
        pt.style.transform  = 'translateY(-100%)';
      });
    });

    // Page exit: new curtain slides UP from below
    document.addEventListener('click', (e) => {
      const link = e.target.closest('a[href]');
      if (!link) return;
      const href = link.getAttribute('href');
      if (!href) return;
      if (link.target === '_blank') return;
      if (href.startsWith('#') || href.startsWith('mailto') || href.startsWith('tel') || href.startsWith('http')) return;
      e.preventDefault();
      pt.style.transition = 'none';
      pt.style.transform   = 'translateY(100%)';
      pt.classList.add('is-in');
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          pt.style.transition = 'transform 0.75s cubic-bezier(0.77, 0, 0.175, 1)';
          pt.style.transform  = 'translateY(0)';
        });
      });
      setTimeout(() => { window.location.href = href; }, 760);
    });
  }

  /* ─── Loader (homepage only) ────────────────────────── */
  const loader = document.getElementById('loader');
  if (loader) {
    const numEl  = document.getElementById('loader-num');
    const fill   = document.getElementById('loader-fill');

    const done = () => {
      loader.classList.add('is-done');
      setTimeout(() => { loader.style.display = 'none'; }, 900);
    };

    if (reduced) { done(); return; }

    let count  = 0;
    const target = 100;
    const dur    = 1800;
    const start  = performance.now();

    fill.style.width = '0%';
    // trigger CSS transition
    requestAnimationFrame(() => {
      requestAnimationFrame(() => { fill.style.width = '100%'; });
    });

    const tick = (now) => {
      const t    = Math.min(1, (now - start) / dur);
      const ease = 1 - Math.pow(1 - t, 3);
      count      = Math.round(target * ease);
      if (numEl) numEl.textContent = count.toString().padStart(3, '0');
      if (t < 1) requestAnimationFrame(tick);
      else done();
    };
    requestAnimationFrame(tick);
  }

  /* ─── Custom Cursor ─────────────────────────────────── */
  if (!isTouch) {
    const dot  = document.querySelector('.cursor');
    const ring = document.querySelector('.cursor-ring');
    let mx = innerWidth/2, my = innerHeight/2;
    let dx = mx, dy = my, rx = mx, ry = my;

    window.addEventListener('pointermove', e => { mx = e.clientX; my = e.clientY; });

    const tickCursor = () => {
      dx += (mx - dx) * 0.55;
      dy += (my - dy) * 0.55;
      rx += (mx - rx) * 0.14;
      ry += (my - ry) * 0.14;
      dot.style.transform  = `translate(${dx}px,${dy}px) translate(-50%,-50%)`;
      ring.style.transform = `translate(${rx}px,${ry}px) translate(-50%,-50%)`;
      requestAnimationFrame(tickCursor);
    };
    tickCursor();

    const addHover = (sel, cls = 'is-hover') => {
      document.querySelectorAll(sel).forEach(el => {
        el.addEventListener('mouseenter', () => { dot.classList.add(cls); ring.classList.add(cls); });
        el.addEventListener('mouseleave', () => { dot.classList.remove(cls); ring.classList.remove(cls); });
      });
    };
    addHover('a, button, [data-cursor="hover"], .skill, .feat-work__item, .service-card, .proj');

    // detect dark backgrounds
    const darkEls = document.querySelectorAll('.studio-dark, .page-hero, .process');
    darkEls.forEach(el => {
      el.addEventListener('mouseenter', () => { dot.classList.add('is-dark'); ring.classList.add('is-dark'); });
      el.addEventListener('mouseleave', () => { dot.classList.remove('is-dark'); ring.classList.remove('is-dark'); });
    });
  }

  /* ─── Magnetic Buttons ──────────────────────────────── */
  if (!isTouch && !reduced) {
    document.querySelectorAll('[data-magnetic]').forEach(el => {
      const s = parseFloat(el.dataset.magnetic) || 0.35;
      el.addEventListener('pointermove', e => {
        const r = el.getBoundingClientRect();
        el.style.transform = `translate(${(e.clientX - r.left - r.width/2)*s}px,${(e.clientY - r.top - r.height/2)*s}px)`;
      });
      el.addEventListener('pointerleave', () => { el.style.transform = ''; });
    });
  }

  /* ─── Live Time ─────────────────────────────────────── */
  const timeEl = document.querySelector('[data-time]');
  if (timeEl) {
    const t = () => {
      const opts = { timeZone:'Africa/Casablanca', hour:'2-digit', minute:'2-digit', hour12:false };
      timeEl.textContent = new Intl.DateTimeFormat('en-GB', opts).format(new Date()) + ' GMT+1';
    };
    t(); setInterval(t, 30000);
  }

  /* ─── Text Split ────────────────────────────────────── */
  document.querySelectorAll('[data-split]').forEach(el => {
    const words = el.textContent.split(' ');
    el.innerHTML = '';
    words.forEach((w, i) => {
      const wrap = Object.assign(document.createElement('span'), { className: 'split-word' });
      const inn  = Object.assign(document.createElement('span'), { className: 'split-inner', textContent: w });
      wrap.appendChild(inn);
      el.appendChild(wrap);
      if (i < words.length - 1) el.appendChild(document.createTextNode(' '));
    });
  });

  /* ─── Counter Animate ───────────────────────────────── */
  const animCount = (el) => {
    const target = parseFloat(el.dataset.count);
    const dur    = 1600;
    const s      = performance.now();
    const run    = (now) => {
      const t = Math.min(1, (now - s) / dur);
      const e = 1 - Math.pow(1 - t, 4);
      el.textContent = Math.round(target * e).toString().padStart(target >= 100 ? 3 : 2, '0');
      if (t < 1) requestAnimationFrame(run);
    };
    requestAnimationFrame(run);
  };

  /* ─── WAAPI Animate Helper ──────────────────────────── */
  const anim = (el, kf, opts = {}) => {
    try { el.animate(kf, { duration: 1000, easing: EASE_STR, fill: 'none', ...opts }); }
    catch(e) {}
  };

  /* ─── Hero Entrance ─────────────────────────────────── */
  /* Homepage hero: driven by CSS keyframes in index.html <style> (fill:both, bulletproof).
     WAAPI fill:'none' was reverting opacity to the CSS-declared 0 after animation ended. */

  /* Sub-page (.page-hero) entrance — fill:'forwards' keeps final state */
  document.querySelectorAll('.page-hero__title .row > span').forEach((el,i) =>
    anim(el, [{ transform:'translateY(110%)' }, { transform:'translateY(0)' }],
      { duration:1100, delay: 200+i*80, fill:'forwards' }));
  document.querySelectorAll('.page-hero__label,.page-hero__sub').forEach((el,i) =>
    anim(el, [{ opacity:0, transform:'translateY(16px)' }, { opacity:1, transform:'translateY(0)' }],
      { duration:900, delay: 400+i*150, fill:'forwards' }));

  /* ─── Scroll-Triggered Reveals ──────────────────────── */
  const watchSel = '[data-split], .reveal-line, .reveal-fade, .section-label, [data-count], .proj__img, .about-page__portrait, .about-teaser__img';
  const watched  = Array.from(document.querySelectorAll(watchSel));
  const fired    = new WeakSet();

  const fire = (el) => {
    if (fired.has(el)) return;
    fired.add(el);

    if (el.matches('[data-split]')) {
      el.querySelectorAll('.split-inner').forEach((inn,i) =>
        anim(inn, [{ transform:'translateY(110%)' }, { transform:'translateY(0)' }],
          { duration:1000, delay:i*38 }));

    } else if (el.matches('.reveal-line')) {
      const s = el.querySelector('span');
      if (s) anim(s, [{ transform:'translateY(110%)' }, { transform:'translateY(0)' }], { duration:1100 });

    } else if (el.matches('.reveal-fade')) {
      anim(el, [{ opacity:0, transform:'translateY(22px)' }, { opacity:1, transform:'translateY(0)' }], { duration:1000 });

    } else if (el.matches('.section-label')) {
      anim(el, [{ opacity:0, transform:'translateX(-18px)' }, { opacity:1, transform:'translateX(0)' }], { duration:800 });

    } else if (el.matches('[data-count]')) {
      animCount(el);

    } else if (el.matches('.proj__img, .about-page__portrait, .about-teaser__img')) {
      el.classList.add('img-reveal');
      // two-phase clip reveal
      const overlay = document.createElement('span');
      overlay.style.cssText = `
        position:absolute;inset:0;background:var(--accent);z-index:2;
        transform:scaleX(0);transform-origin:left center;
        transition:transform .7s cubic-bezier(0.77,0,.175,1);
      `;
      el.style.position = 'relative';
      el.appendChild(overlay);
      const img = el.querySelector('img');
      if (img) img.style.opacity = '0';
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          overlay.style.transform = 'scaleX(1)';
          setTimeout(() => {
            overlay.style.transformOrigin = 'right center';
            overlay.style.transform = 'scaleX(0)';
            if (img) {
              img.style.transition = 'opacity 0s';
              img.style.opacity    = '1';
            }
          }, 700);
        });
      });
    }
  };

  const check = () => {
    const trigger = innerHeight * 0.91;
    for (const el of watched) {
      if (fired.has(el)) continue;
      const r = el.getBoundingClientRect();
      if (r.top < trigger && r.bottom > 0) fire(el);
    }
  };

  window.addEventListener('scroll', check, { passive: true });
  window.addEventListener('resize', check);
  requestAnimationFrame(() => requestAnimationFrame(check));
  setTimeout(check, 100);
  setTimeout(check, 500);

  /* ─── Stagger Work / Service Cards ─────────────────── */
  const staggerGroups = [
    { sel: '.proj',          delay: 80 },
    { sel: '.service-card',  delay: 90 },
    { sel: '.process-step',  delay: 70 },
    { sel: '.timeline-item', delay: 60 },
  ];
  staggerGroups.forEach(({ sel, delay }) => {
    const parent = document.querySelector(sel)?.parentElement;
    if (!parent) return;
    const items = Array.from(parent.querySelectorAll(sel));
    if (!items.length) return;
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        items.forEach((item, i) => {
          anim(item, [{ opacity:0, transform:'translateY(28px)' }, { opacity:1, transform:'translateY(0)' }],
            { duration:900, delay: i*delay });
        });
        io.disconnect();
      });
    }, { threshold: 0.1 });
    io.observe(parent);
  });

  /* ─── Work Preview Follower ─────────────────────────── */
  const preview = document.querySelector('.work-preview');
  if (preview) {
    document.querySelectorAll('[data-preview-img]').forEach(item => {
      const img = preview.querySelector('img') || document.createElement('img');
      preview.appendChild(img);
      item.addEventListener('mouseenter', () => {
        img.src = item.dataset.previewImg;
        preview.classList.add('is-visible');
      });
      item.addEventListener('mousemove', e => {
        preview.style.left = e.clientX + 'px';
        preview.style.top  = e.clientY + 'px';
      });
      item.addEventListener('mouseleave', () => preview.classList.remove('is-visible'));
    });
  }

  /* ─── Parallax Images ───────────────────────────────── */
  if (!reduced) {
    const parallaxEls = document.querySelectorAll('[data-parallax]');
    const parallaxFn = () => {
      parallaxEls.forEach(el => {
        const r = el.getBoundingClientRect();
        const ratio = (window.innerHeight / 2 - r.top - r.height / 2) / window.innerHeight;
        const speed = parseFloat(el.dataset.parallax) || 0.15;
        el.style.transform = `translateY(${ratio * speed * 100}px) scale(1.08)`;
      });
    };
    window.addEventListener('scroll', parallaxFn, { passive: true });
    parallaxFn();
  }

  /* ─── Smooth Anchor Scroll ──────────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const id = a.getAttribute('href');
      if (id.length < 2) return;
      const t = document.querySelector(id);
      if (!t) return;
      e.preventDefault();
      window.scrollTo({ top: t.getBoundingClientRect().top + scrollY - 20, behavior: 'smooth' });
    });
  });

  /* ─── Nav Active State ──────────────────────────────── */
  const page = document.body.dataset.page;
  if (page) {
    document.querySelectorAll(`.nav__center a[data-page="${page}"], .mobile-menu__links a[data-page="${page}"]`)
      .forEach(a => a.classList.add('is-active'));
  }

  /* ─── Burger / Mobile Menu ──────────────────────────── */
  const burger = document.querySelector('.nav__burger');
  const mobileMenu = document.querySelector('.mobile-menu');
  if (burger && mobileMenu) {
    const open  = () => {
      burger.classList.add('is-open');
      burger.setAttribute('aria-expanded', 'true');
      mobileMenu.classList.add('is-open');
      mobileMenu.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    };
    const close = () => {
      burger.classList.remove('is-open');
      burger.setAttribute('aria-expanded', 'false');
      mobileMenu.classList.remove('is-open');
      mobileMenu.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    };
    burger.addEventListener('click', () =>
      burger.classList.contains('is-open') ? close() : open()
    );
    mobileMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', close));
    document.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
  }

  /* ─── Nav Scroll Background ────────────────────────── */
  const nav = document.querySelector('.nav');
  if (nav) {
    const hero = document.querySelector('.hero, .page-hero, .contact-hero');
    const updateNavBg = () => {
      const threshold = hero ? hero.getBoundingClientRect().bottom + window.scrollY - 20 : 120;
      nav.classList.toggle('is-scrolled', window.scrollY > threshold);
    };
    window.addEventListener('scroll', updateNavBg, { passive: true });
    updateNavBg();

    /* Dark-section toggle (sub-pages) */
    const darkSections = document.querySelectorAll('.page-hero, .studio-dark, .process');
    if (darkSections.length) {
      const navIO = new IntersectionObserver(entries => {
        const anyDark = Array.from(darkSections).some(sec => {
          const r = sec.getBoundingClientRect();
          return r.top <= 80 && r.bottom >= 0;
        });
        nav.classList.toggle('is-dark', anyDark);
      }, { threshold: [0, 0.1] });
      darkSections.forEach(sec => navIO.observe(sec));
    }
  }

  /* ─── Three.js Hero Canvas ──────────────────────────── */
  const canvas = document.querySelector('.hero__canvas');
  if (canvas && window.THREE && !reduced) {
    const THREE = window.THREE;
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: false });
    renderer.setPixelRatio(Math.min(devicePixelRatio, 1.6));

    const scene  = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
    camera.position.z = 2.4;

    const uniforms = {
      uTime:   { value: 0 },
      uMouse:  { value: new THREE.Vector2(0.5, 0.5) },
      uRes:    { value: new THREE.Vector2(1, 1) },
      uAccent: { value: new THREE.Color('#c47236') },
    };

    const mat = new THREE.ShaderMaterial({
      uniforms,
      transparent: true,
      vertexShader: `
        varying vec2 vUv;
        void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}
      `,
      fragmentShader: `
        precision highp float;
        varying vec2 vUv;
        uniform float uTime;
        uniform vec2 uMouse,uRes;
        uniform vec3 uAccent;
        float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
        float noise(vec2 p){
          vec2 i=floor(p),f=fract(p);
          float a=hash(i),b=hash(i+vec2(1,0)),c=hash(i+vec2(0,1)),d=hash(i+vec2(1,1));
          vec2 u=f*f*(3.-2.*f);
          return mix(a,b,u.x)+(c-a)*u.y*(1.-u.x)+(d-b)*u.x*u.y;
        }
        float grid(vec2 uv,float s){
          vec2 g=abs(fract(uv*s-.5)-.5)/fwidth(uv*s);
          return 1.-min(min(g.x,g.y),1.);
        }
        void main(){
          vec2 uv=vUv;
          vec2 p=(uv-.5);p.x*=uRes.x/uRes.y;
          float t=uTime*.055;
          vec2 q=p;
          q+=.16*vec2(noise(p*1.3+vec2(t,0.)),noise(p*1.3+vec2(0.,t*1.2)));
          q+=(uMouse-.5)*.07;
          float g=max(grid(q,6.),grid(q,18.)*.5);
          float r=length(p);
          float fade=smoothstep(1.1,.1,r);
          vec3 base=vec3(.965,.955,.935);
          vec3 col=mix(base,mix(vec3(.18,.16,.2),uAccent,smoothstep(.2,.8,r)),g*.17*fade);
          col=mix(col,mix(col,uAccent,.09),1.-fade);
          gl_FragColor=vec4(col,1.);
        }
      `,
    });

    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(4,4), mat);
    scene.add(mesh);

    const resize = () => {
      const r = canvas.parentElement.getBoundingClientRect();
      const w = r.width || innerWidth, h = r.height || innerHeight;
      if (w < 10 || h < 10) return;
      renderer.setSize(w, h, false);
      camera.aspect = w/h; camera.updateProjectionMatrix();
      uniforms.uRes.value.set(w, h);
    };
    resize();
    window.addEventListener('resize', resize);
    window.addEventListener('load', resize);
    ['100','500'].forEach(t => setTimeout(resize, +t));

    window.addEventListener('pointermove', e => {
      uniforms.uMouse.value.set(e.clientX/innerWidth, 1-e.clientY/innerHeight);
    });

    let raf;
    const render = (now) => {
      uniforms.uTime.value = now * 0.001;
      renderer.render(scene, camera);
      raf = requestAnimationFrame(render);
    };
    render(0);

    new IntersectionObserver(entries => {
      entries.forEach(e => e.isIntersecting ? (raf = requestAnimationFrame(render)) : cancelAnimationFrame(raf));
    }).observe(canvas);
  }

})();
