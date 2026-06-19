(function () {

  /* =====================================================
     1. LOADING SCREEN
     ===================================================== */
  const loader = document.createElement('div');
  loader.id = 'loader';
  loader.innerHTML =
    '<div class="loader-line"><span class="t-prompt">~$</span> <span class="loader-cmd"></span><span class="t-cursor"></span></div>' +
    '<div class="loader-bar"><div class="loader-fill"></div></div>';
  document.body.prepend(loader);

  const cmds = ['boot portfolio.sh', 'loading assets...', 'ready.'];
  let ci = 0;
  const cmdEl = loader.querySelector('.loader-cmd');

  function typeCmd(str, cb) {
    cmdEl.textContent = '';
    let i = 0;
    const iv = setInterval(() => {
      cmdEl.textContent += str[i++];
      if (i >= str.length) { clearInterval(iv); setTimeout(cb, 180); }
    }, 38);
  }

  function nextCmd() {
    if (ci < cmds.length) { typeCmd(cmds[ci++], nextCmd); }
    else {
      setTimeout(() => {
        loader.classList.add('hidden');
        setTimeout(() => loader.remove(), 500);
      }, 200);
    }
  }

  nextCmd();

  /* =====================================================
     2. MATRIX RAIN (accueil uniquement)
     ===================================================== */
  const canvas = document.getElementById('matrix-canvas');
  if (canvas) {
    const ctx  = canvas.getContext('2d');
    const chars = '01アイウエオカキクケコサシスセソタチツテト';
    const size  = 14;
    let cols, drops;

    function init() {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
      cols  = Math.floor(canvas.width / size);
      drops = Array.from({ length: cols }, () => Math.random() * -30);
    }
    function draw() {
      ctx.fillStyle = 'rgba(5,5,10,0.06)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#00ff88';
      ctx.font = `${size}px Consolas, monospace`;
      for (let i = 0; i < drops.length; i++) {
        if (drops[i] > 0) ctx.fillText(chars[Math.floor(Math.random() * chars.length)], i * size, drops[i] * size);
        if (drops[i] * size > canvas.height && Math.random() > 0.975) drops[i] = 0;
        drops[i]++;
      }
    }
    init();
    window.addEventListener('resize', init);
    setInterval(draw, 55);
  }

  /* =====================================================
     3. TYPING ANIMATION
     ===================================================== */
  const typingEl = document.querySelector('[data-type]');
  if (typingEl) {
    const full = typingEl.dataset.type;
    typingEl.innerHTML = '';
    const cur = document.createElement('span');
    cur.className = 't-cursor';
    typingEl.appendChild(cur);
    let i = 0;
    function typeNext() {
      if (i < full.length) {
        cur.insertAdjacentText('beforebegin', full[i++]);
        setTimeout(typeNext, 24 + Math.random() * 28);
      } else {
        setTimeout(() => cur.style.display = 'none', 2500);
      }
    }
    setTimeout(typeNext, 1000);
  }

  /* =====================================================
     4. SCROLL REVEAL
     ===================================================== */
  const revealEls = document.querySelectorAll('.reveal');
  if (revealEls.length) {
    const ro = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          ro.unobserve(e.target);
        }
      });
    }, { threshold: 0.12 });
    revealEls.forEach(el => ro.observe(el));
  }

  /* =====================================================
     5. CUSTOM CURSOR
     ===================================================== */
  if (window.matchMedia('(pointer: fine)').matches) {
    const dot  = document.createElement('div');
    dot.className = 'cursor-dot';
    const ring = document.createElement('div');
    ring.className = 'cursor-ring';
    document.body.append(dot, ring);

    let mx = 0, my = 0, rx = 0, ry = 0;

    document.addEventListener('mousemove', e => {
      mx = e.clientX; my = e.clientY;
      dot.style.left = mx + 'px';
      dot.style.top  = my + 'px';
    });

    function tickRing() {
      rx += (mx - rx) * 0.14;
      ry += (my - ry) * 0.14;
      ring.style.left = rx + 'px';
      ring.style.top  = ry + 'px';
      requestAnimationFrame(tickRing);
    }
    tickRing();

    document.querySelectorAll('a, button, [role="button"]').forEach(el => {
      el.addEventListener('mouseenter', () => {
        dot.classList.add('hover');
        ring.classList.add('hover');
      });
      el.addEventListener('mouseleave', () => {
        dot.classList.remove('hover');
        ring.classList.remove('hover');
      });
    });
  }

  /* =====================================================
     6. BARRE DE PROGRESSION
     ===================================================== */
  const bar = document.createElement('div');
  bar.id = 'progress-bar';
  document.body.prepend(bar);

  window.addEventListener('scroll', () => {
    const total = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.width = (total > 0 ? (window.scrollY / total) * 100 : 0) + '%';
  }, { passive: true });

  /* =====================================================
     7. BACK TO TOP
     ===================================================== */
  const btt = document.createElement('button');
  btt.id = 'back-to-top';
  btt.title = 'Retour en haut';
  btt.innerHTML = '↑';
  document.body.appendChild(btt);

  window.addEventListener('scroll', () => {
    btt.classList.toggle('visible', window.scrollY > 250);
  }, { passive: true });

  btt.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* =====================================================
     8. TRANSITIONS DE PAGES
     ===================================================== */
  document.querySelectorAll('a[href]').forEach(link => {
    const href = link.getAttribute('href');
    if (
      href &&
      !href.startsWith('http') &&
      !href.startsWith('#') &&
      !href.startsWith('mailto') &&
      !href.includes('?') &&
      !link.target
    ) {
      link.addEventListener('click', e => {
        e.preventDefault();
        document.body.classList.add('page-exit');
        setTimeout(() => { window.location.href = href; }, 280);
      });
    }
  });

  /* =====================================================
     9. COPIER L'EMAIL + TOAST
     ===================================================== */
  const copyBtn = document.getElementById('copy-email');
  if (copyBtn) {
    copyBtn.addEventListener('click', () => {
      navigator.clipboard.writeText('charlie.roycosta@gmail.com')
        .then(() => showToast('✓ Email copié !'))
        .catch(() => showToast('Copiez : charlie.roycosta@gmail.com'));
    });
  }

  function showToast(msg) {
    const t = document.createElement('div');
    t.className = 'toast';
    t.textContent = msg;
    document.body.appendChild(t);
    requestAnimationFrame(() => requestAnimationFrame(() => t.classList.add('show')));
    setTimeout(() => {
      t.classList.remove('show');
      setTimeout(() => t.remove(), 350);
    }, 2500);
  }

  /* =====================================================
     10. MENU HAMBURGER MOBILE
     ===================================================== */
  const nav = document.querySelector('nav');
  if (nav) {
    const toggle = document.createElement('button');
    toggle.className = 'nav-toggle';
    toggle.setAttribute('aria-label', 'Ouvrir le menu');
    toggle.innerHTML = '<span></span><span></span><span></span>';
    nav.appendChild(toggle);
    const navLinks = document.querySelector('.nav-links');

    toggle.addEventListener('click', () => {
      const open = toggle.classList.toggle('open');
      navLinks.classList.toggle('open', open);
      toggle.setAttribute('aria-label', open ? 'Fermer le menu' : 'Ouvrir le menu');
    });

    navLinks.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        toggle.classList.remove('open');
        navLinks.classList.remove('open');
      });
    });
  }

  /* =====================================================
     11. COMPTEUR DE STATS ANIMÉ
     ===================================================== */
  const counters = document.querySelectorAll('[data-count]');
  if (counters.length) {
    const co = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        const el = e.target;
        const target = +el.dataset.count;
        const suffix = el.dataset.suffix || '';
        let cur = 0;
        const step = Math.max(1, Math.ceil(target / 45));
        const iv = setInterval(() => {
          cur = Math.min(cur + step, target);
          el.textContent = cur + suffix;
          if (cur >= target) clearInterval(iv);
        }, 35);
        co.unobserve(el);
      });
    }, { threshold: 0.5 });
    counters.forEach(el => co.observe(el));
  }

})();
