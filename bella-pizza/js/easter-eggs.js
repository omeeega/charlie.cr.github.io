/* Easter eggs */
(function () {
  // Code Konami
  const KONAMI = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];
  let kIdx = 0;
  document.addEventListener('keydown', e => {
    if (e.key === KONAMI[kIdx]) { kIdx++; if (kIdx === KONAMI.length) { rainPizzas(); kIdx = 0; } }
    else kIdx = 0;
  });

  function rainPizzas() {
    for (let i = 0; i < 30; i++) {
      setTimeout(() => {
        const p = document.createElement('div');
        p.textContent = '🍕';
        p.style.cssText = `position:fixed;top:-60px;left:${Math.random()*100}vw;font-size:${24+Math.random()*24}px;z-index:99998;pointer-events:none;animation:confetti-fall ${2+Math.random()*2}s linear forwards;`;
        document.body.appendChild(p);
        setTimeout(() => p.remove(), 4000);
      }, i * 80);
    }
    if (typeof toast === 'function') toast('🎮 Code Konami activé ! 🍕🍕🍕', 'success');
  }

  // 5 clics sur le logo
  let logoClicks = 0, logoTimer;
  document.addEventListener('click', e => {
    if (!e.target.closest('.nav-logo')) return;
    logoClicks++;
    clearTimeout(logoTimer);
    logoTimer = setTimeout(() => logoClicks = 0, 2000);
    if (logoClicks >= 5) {
      logoClicks = 0;
      const logo = document.querySelector('.nav-logo img');
      if (logo) {
        logo.style.animation = 'spin 0.5s ease';
        setTimeout(() => logo.style.animation = '', 500);
      }
      if (typeof toast === 'function') toast('🍕 Bella Pizza depuis 1986 !', 'info');
    }
  });

  // Inactivité 30s sur menu
  if (location.pathname.endsWith('menu.html')) {
    let idle;
    function resetIdle() { clearTimeout(idle); idle = setTimeout(() => { if (typeof toast === 'function') toast('🤔 Vous semblez indécis… On recommande la Margherita !', 'info'); }, 30000); }
    ['mousemove','keydown','scroll','click'].forEach(ev => document.addEventListener(ev, resetIdle, { passive: true }));
    resetIdle();
  }

  // Triple-clic sur le total
  document.addEventListener('click', e => {
    const total = e.target.closest('#grand-total');
    if (!total) return;
    total._clicks = (total._clicks || 0) + 1;
    if (total._clicks >= 3) {
      total._clicks = 0;
      const orig = total.textContent;
      total.textContent = '0,00 €';
      setTimeout(() => {
        total.textContent = orig;
        if (typeof toast === 'function') toast('😅 Ah non, c\'était trop beau !', 'info');
      }, 1200);
    }
  });
})();
