/* Transitions de page + barre de progression */
(function () {
  // Injecter le DOM
  const overlay = document.createElement('div');
  overlay.id = 'page-transition';
  document.body.appendChild(overlay);

  const bar = document.createElement('div');
  bar.id = 'page-progress';
  document.body.appendChild(bar);

  let navigating = false;

  function animateBar(to, dur) {
    bar.style.transition = `width ${dur}ms ease`;
    bar.style.width = to + '%';
  }

  function navigate(url) {
    if (navigating) return;
    navigating = true;
    animateBar(70, 300);
    overlay.className = 'entering';

    setTimeout(() => {
      animateBar(100, 100);
      setTimeout(() => {
        window.location.href = url;
      }, 150);
    }, 400);
  }

  // Intercepter les liens internes
  document.addEventListener('click', e => {
    const a = e.target.closest('a');
    if (!a) return;
    const href = a.getAttribute('href');
    if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:') || href.startsWith('http') || a.target === '_blank') return;
    e.preventDefault();
    navigate(href);
  }, true);

  // Animation d'entrée au chargement
  window.addEventListener('load', () => {
    animateBar(100, 300);
    overlay.className = 'exiting';
    setTimeout(() => {
      overlay.className = '';
      bar.style.opacity = '0';
      setTimeout(() => { bar.style.width = '0'; bar.style.opacity = '1'; }, 300);
    }, 500);
  });
})();
