(function () {

  /* ═══════════════════════════════════════════════════════════
     1. LOADING SCREEN (première visite uniquement)
  ═══════════════════════════════════════════════════════════ */
  if (!localStorage.getItem('visited')) {
    localStorage.setItem('visited', '1');
    const loader = document.createElement('div');
    loader.id = 'loader';
    loader.innerHTML =
      '<div class="loader-line"><span class="t-prompt">~$</span> <span class="loader-cmd"></span><span class="t-cursor"></span></div>' +
      '<div class="loader-bar"><div class="loader-fill"></div></div>';
    document.body.prepend(loader);
    const cmdEl = loader.querySelector('.loader-cmd');
    const seq = ['boot portfolio.sh', 'chargement assets...', 'prêt.'];
    let si = 0;
    function typeSeq(s, cb) {
      cmdEl.textContent = '';
      let i = 0;
      const iv = setInterval(() => { cmdEl.textContent += s[i++]; if (i >= s.length) { clearInterval(iv); setTimeout(cb, 160); } }, 36);
    }
    function nextSeq() {
      if (si < seq.length) typeSeq(seq[si++], nextSeq);
      else setTimeout(() => { loader.classList.add('hidden'); setTimeout(() => loader.remove(), 480); }, 180);
    }
    nextSeq();
  }

  /* ═══════════════════════════════════════════════════════════
     2. MATRIX / CONSTELLATION (fond animé)
  ═══════════════════════════════════════════════════════════ */
  const canvas = document.getElementById('matrix-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let pts = [];

    function initConst() {
      canvas.width = window.innerWidth; canvas.height = window.innerHeight;
      pts = Array.from({ length: 65 }, () => ({
        x: Math.random() * canvas.width, y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.45, vy: (Math.random() - 0.5) * 0.45
      }));
    }
    function drawConst() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const ac = getAccentColor();
      pts.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
        ctx.beginPath(); ctx.arc(p.x, p.y, 1.5, 0, Math.PI * 2);
        ctx.fillStyle = ac; ctx.fill();
      });
      for (let i = 0; i < pts.length; i++) for (let j = i + 1; j < pts.length; j++) {
        const d = Math.hypot(pts[i].x - pts[j].x, pts[i].y - pts[j].y);
        if (d < 130) {
          ctx.beginPath(); ctx.moveTo(pts[i].x, pts[i].y); ctx.lineTo(pts[j].x, pts[j].y);
          ctx.strokeStyle = ac.replace(')', ',' + (1 - d / 130) * 0.35 + ')').replace('rgb', 'rgba');
          ctx.lineWidth = 0.6; ctx.stroke();
        }
      }
    }

    window.addEventListener('resize', initConst);
    initConst();
    setInterval(drawConst, 28);
  }

  /* ═══════════════════════════════════════════════════════════
     3. TYPING ANIMATION (multilingue)
  ═══════════════════════════════════════════════════════════ */
  function startTyping() {
    const el = document.querySelector('[data-type-fr]');
    if (!el) return;
    const lang = document.documentElement.lang || 'fr';
    const text = el.getAttribute('data-type-' + lang) || el.getAttribute('data-type-fr') || '';
    el.innerHTML = '';
    const cur = document.createElement('span'); cur.className = 't-cursor'; el.appendChild(cur);
    let i = 0;
    function next() {
      if (i < text.length) { cur.insertAdjacentText('beforebegin', text[i++]); setTimeout(next, 22 + Math.random() * 26); }
      else setTimeout(() => cur.style.display = 'none', 2400);
    }
    setTimeout(next, 1000);
  }
  startTyping();

  /* ═══════════════════════════════════════════════════════════
     4. SCROLL REVEAL
  ═══════════════════════════════════════════════════════════ */
  const ro = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); ro.unobserve(e.target); } });
  }, { threshold: 0.1 });
  document.querySelectorAll('.reveal').forEach(el => ro.observe(el));

  /* ═══════════════════════════════════════════════════════════
     5. CURSEUR PERSONNALISÉ
  ═══════════════════════════════════════════════════════════ */
  if (window.matchMedia('(pointer:fine)').matches) {
    const dot = document.createElement('div'); dot.className = 'cursor-dot';
    const ring = document.createElement('div'); ring.className = 'cursor-ring';
    document.body.append(dot, ring);
    let mx = 0, my = 0, rx = 0, ry = 0;
    document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; dot.style.cssText = 'left:' + mx + 'px;top:' + my + 'px'; });
    (function tickRing() { rx += (mx - rx) * 0.14; ry += (my - ry) * 0.14; ring.style.cssText = 'left:' + rx + 'px;top:' + ry + 'px'; requestAnimationFrame(tickRing); })();
    document.querySelectorAll('a,button,[role="button"]').forEach(el => {
      el.addEventListener('mouseenter', () => { dot.classList.add('hover'); ring.classList.add('hover'); });
      el.addEventListener('mouseleave', () => { dot.classList.remove('hover'); ring.classList.remove('hover'); });
    });
  }

  /* ═══════════════════════════════════════════════════════════
     6. BARRE DE PROGRESSION
  ═══════════════════════════════════════════════════════════ */
  const bar = document.createElement('div'); bar.id = 'progress-bar'; document.body.prepend(bar);
  window.addEventListener('scroll', () => {
    const t = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.width = (t > 0 ? (window.scrollY / t) * 100 : 0) + '%';
  }, { passive: true });

  /* ═══════════════════════════════════════════════════════════
     7. BACK TO TOP
  ═══════════════════════════════════════════════════════════ */
  const btt = document.createElement('button'); btt.id = 'back-to-top'; btt.innerHTML = '↑'; btt.title = 'Retour en haut';
  document.body.appendChild(btt);
  window.addEventListener('scroll', () => btt.classList.toggle('visible', window.scrollY > 250), { passive: true });
  btt.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  /* ═══════════════════════════════════════════════════════════
     8. TRANSITIONS DE PAGES
  ═══════════════════════════════════════════════════════════ */
  document.querySelectorAll('a[href]').forEach(link => {
    const h = link.getAttribute('href');
    if (h && !h.startsWith('http') && !h.startsWith('#') && !h.startsWith('mailto') && !link.target) {
      link.addEventListener('click', e => {
        e.preventDefault(); document.body.classList.add('page-exit');
        setTimeout(() => window.location.href = h, 270);
      });
    }
  });

  /* ═══════════════════════════════════════════════════════════
     9. COPIER L'EMAIL + TOAST
  ═══════════════════════════════════════════════════════════ */
  document.getElementById('copy-email')?.addEventListener('click', () => {
    navigator.clipboard.writeText('charlie.roycosta@gmail.com')
      .then(() => showToast('✓ Email copié !'))
      .catch(() => showToast('charlie.roycosta@gmail.com'));
  });

  window.showToast = function (msg) {
    const t = document.createElement('div'); t.className = 'toast'; t.textContent = msg;
    document.body.appendChild(t);
    requestAnimationFrame(() => requestAnimationFrame(() => t.classList.add('show')));
    setTimeout(() => { t.classList.remove('show'); setTimeout(() => t.remove(), 350); }, 2500);
  };

  /* ═══════════════════════════════════════════════════════════
     10. MENU HAMBURGER MOBILE
  ═══════════════════════════════════════════════════════════ */
  const nav = document.querySelector('nav');
  if (nav) {
    const toggle = document.createElement('button'); toggle.className = 'nav-toggle'; toggle.setAttribute('aria-label', 'Menu');
    toggle.innerHTML = '<span></span><span></span><span></span>';
    nav.appendChild(toggle);
    const navLinks = nav.querySelector('.nav-links');
    toggle.addEventListener('click', () => {
      const o = toggle.classList.toggle('open'); navLinks.classList.toggle('open', o);
    });
    navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
      toggle.classList.remove('open'); navLinks.classList.remove('open');
    }));
  }

  /* ═══════════════════════════════════════════════════════════
     11. COMPTEUR DE STATS ANIMÉ
  ═══════════════════════════════════════════════════════════ */
  const co = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el = e.target, target = +el.dataset.count, suffix = el.dataset.suffix || '';
      let cur = 0; const step = Math.max(1, Math.ceil(target / 45));
      const iv = setInterval(() => { cur = Math.min(cur + step, target); el.textContent = cur + suffix; if (cur >= target) clearInterval(iv); }, 34);
      co.unobserve(el);
    });
  }, { threshold: 0.5 });
  document.querySelectorAll('[data-count]').forEach(el => co.observe(el));

  /* ═══════════════════════════════════════════════════════════
     12. THÈME CLAIR / SOMBRE
  ═══════════════════════════════════════════════════════════ */
  const savedTheme = localStorage.getItem('theme') || 'dark';
  document.documentElement.setAttribute('data-theme', savedTheme);

  window.toggleTheme = function () {
    const next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
    const btn = document.getElementById('theme-toggle');
    if (btn) btn.textContent = next === 'dark' ? '☀️' : '🌙';
  };
  const thBtn = document.getElementById('theme-toggle');
  if (thBtn) thBtn.textContent = savedTheme === 'dark' ? '☀️' : '🌙';

  /* ═══════════════════════════════════════════════════════════
     13. PALETTE DE COULEURS (4 accents)
  ═══════════════════════════════════════════════════════════ */
  const savedAccent = localStorage.getItem('accent') || 'green';
  document.documentElement.setAttribute('data-accent', savedAccent);

  window.setAccent = function (name) {
    document.documentElement.setAttribute('data-accent', name);
    localStorage.setItem('accent', name);
    document.getElementById('palette-panel')?.classList.remove('open');
  };
  document.getElementById('palette-btn')?.addEventListener('click', () => {
    document.getElementById('palette-panel')?.classList.toggle('open');
  });

  function getAccentColor() {
    return getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#00ff88';
  }


  /* ═══════════════════════════════════════════════════════════
     15. RECHERCHE PROJETS
  ═══════════════════════════════════════════════════════════ */
  const searchInput = document.getElementById('project-search');
  if (searchInput) {
    searchInput.addEventListener('input', filterProjects);
  }

  /* ═══════════════════════════════════════════════════════════
     16. FILTRES PROJETS
  ═══════════════════════════════════════════════════════════ */
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      filterProjects();
    });
  });

  function filterProjects() {
    const query = (document.getElementById('project-search')?.value || '').toLowerCase();
    const category = document.querySelector('.filter-btn.active')?.dataset.filter || 'all';
    document.querySelectorAll('.project-card:not(.placeholder)').forEach(card => {
      const text = card.textContent.toLowerCase();
      const cat = card.dataset.category || '';
      const matchQ = !query || text.includes(query);
      const matchC = category === 'all' || cat === category;
      card.style.display = matchQ && matchC ? '' : 'none';
    });
  }

  /* ═══════════════════════════════════════════════════════════
     17. MODE KIOSQUE (plein écran sur les pages jeux)
  ═══════════════════════════════════════════════════════════ */
  window.toggleKiosque = function (iframeId) {
    const el = document.getElementById(iframeId) || document.querySelector('iframe');
    if (!el) return;
    if (!document.fullscreenElement) el.requestFullscreen?.().catch(() => {});
    else document.exitFullscreen?.();
  };

  /* ═══════════════════════════════════════════════════════════
     18. EASTER EGG — Code Konami
  ═══════════════════════════════════════════════════════════ */
  const KONAMI = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];
  let ki = 0;
  document.addEventListener('keydown', e => {
    if (e.key === KONAMI[ki]) {
      ki++;
      if (ki === KONAMI.length) {
        ki = 0;
        triggerEasterEgg();
      }
    } else ki = 0;
  });

  function triggerEasterEgg() {
    const overlay = document.createElement('div');
    overlay.id = 'easter-egg';
    overlay.innerHTML = `
      <div class="ee-box">
        <p class="ee-code">🔓 ACCESS GRANTED</p>
        <p class="ee-msg">Bravo, tu as trouvé le code secret.<br>CTF mindset activé. 🚩</p>
        <button onclick="this.closest('#easter-egg').remove()">Fermer</button>
      </div>`;
    document.body.appendChild(overlay);
    requestAnimationFrame(() => overlay.classList.add('show'));
  }


  /* ═══════════════════════════════════════════════════════════
     20. FORMULAIRE DE CONTACT (Supabase)
  ═══════════════════════════════════════════════════════════ */
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', async e => {
      e.preventDefault();
      const name = contactForm.querySelector('[name="name"]').value.trim();
      const email = contactForm.querySelector('[name="email"]').value.trim();
      const message = contactForm.querySelector('[name="message"]').value.trim();
      const btn = contactForm.querySelector('button[type="submit"]');
      const status = document.getElementById('form-status');

      btn.disabled = true; btn.textContent = 'Envoi...';
      status.textContent = ''; status.className = 'form-status';

      try {
        if (window.DB?.configured) {
          await window.DB.sendMessage(name, email, message);
          status.textContent = '✓ Message envoyé ! Je vous réponds bientôt.';
          status.className = 'form-status success';
          contactForm.reset();
        } else {
          // Fallback : ouvrir le client email
          window.location.href = 'mailto:charlie.roycosta@gmail.com?subject=Contact depuis le portfolio&body=' + encodeURIComponent('Nom: ' + name + '\n\n' + message);
          status.textContent = '→ Redirection vers votre client email...';
          status.className = 'form-status info';
        }
      } catch (err) {
        status.textContent = '✗ Erreur : ' + err.message;
        status.className = 'form-status error';
      } finally {
        btn.disabled = false; btn.textContent = 'Envoyer';
      }
    });
  }

  /* ═══════════════════════════════════════════════════════════
     BLOG — Chargement des articles depuis Supabase
  ═══════════════════════════════════════════════════════════ */
  const blogDbGrid = document.getElementById('blog-db-grid');
  const blogDbSection = document.getElementById('blog-db-section');
  if (blogDbGrid) {
    (async () => {
      const posts = await window.DB?.getBlogPosts() || [];
      if (posts.length === 0) return;
      blogDbSection && (blogDbSection.style.display = '');
      blogDbGrid.innerHTML = posts.map(p => `
        <article class="blog-card reveal">
          <div class="blog-card-top">
            <span class="blog-tag">${(p.tags && p.tags[0]) || 'Article'}</span>
            <span class="blog-date">${new Date(p.cree_le).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
          </div>
          <h3>${p.titre}</h3>
          <p>${p.extrait || ''}</p>
          <div class="card-tags">${(p.tags || []).map(t => `<span class="tag">${t}</span>`).join('')}</div>
          <span class="blog-read-more">Lire la suite →</span>
        </article>
      `).join('');
      document.querySelectorAll('.reveal').forEach(el => ro.observe(el));
    })();
  }

  /* ═══════════════════════════════════════════════════════════
     CTF STATS — Chargement depuis Supabase
  ═══════════════════════════════════════════════════════════ */
  const ctfContainer = document.getElementById('ctf-stats');
  if (ctfContainer) {
    (async () => {
      const stats = await window.DB?.getCTFStats();
      if (!stats || stats.length === 0) return;
      ctfContainer.innerHTML = stats.map(s => `
        <div class="ctf-item reveal">
          <span class="stat-number">${s.solved}</span>
          <span class="stat-label">${s.platform}</span>
          ${s.rank ? '<span class="ctf-rank">' + s.rank + '</span>' : ''}
        </div>
      `).join('');
      document.querySelectorAll('.reveal').forEach(el => ro.observe(el));
    })();
  }

  /* ═══════════════════════════════════════════════════════════
     SERVICE WORKER — Enregistrement PWA
  ═══════════════════════════════════════════════════════════ */
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('./sw.js').catch(() => {});
    });
  }

})();
