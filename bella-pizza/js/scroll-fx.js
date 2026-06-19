/* Effets de scroll avancés */
(function () {
  // Word-by-word reveal
  function initWordReveal() {
    document.querySelectorAll('.word-reveal').forEach(el => {
      const words = el.textContent.trim().split(' ');
      el.innerHTML = words.map((w, i) =>
        `<span class="word" style="transition-delay:${i * 0.06}s">${w}&nbsp;</span>`
      ).join('');
    });
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); } });
    }, { threshold: 0.3 });
    document.querySelectorAll('.word-reveal').forEach(el => obs.observe(el));
  }

  // Clip-path image reveal
  function initClipReveal() {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); } });
    }, { threshold: 0.2 });
    document.querySelectorAll('.clip-reveal').forEach(el => obs.observe(el));
  }

  // Parallaxe sur le hero (fond + éléments)
  function initParallax() {
    const heroBg = document.querySelector('.hero-bg');
    const heroContent = document.querySelector('.hero-content');
    if (!heroBg) return;
    window.addEventListener('scroll', () => {
      const scrollY = window.scrollY;
      heroBg.style.transform = `translateY(${scrollY * 0.4}px)`;
      if (heroContent) heroContent.style.transform = `translateY(${scrollY * 0.15}px)`;
    }, { passive: true });
  }

  // Parallaxe souris sur le hero
  function initMouseParallax() {
    const hero = document.querySelector('.hero');
    if (!hero) return;
    hero.addEventListener('mousemove', e => {
      const { left, top, width, height } = hero.getBoundingClientRect();
      const xPct = (e.clientX - left) / width - 0.5;
      const yPct = (e.clientY - top) / height - 0.5;
      const bg = hero.querySelector('.hero-bg');
      if (bg) bg.style.transform = `translate(${xPct * 20}px, ${yPct * 20}px) scale(1.05)`;
    });
    hero.addEventListener('mouseleave', () => {
      const bg = hero.querySelector('.hero-bg');
      if (bg) bg.style.transform = '';
    });
  }

  // Magnetic buttons
  function initMagnetic() {
    document.querySelectorAll('.magnetic').forEach(btn => {
      btn.addEventListener('mousemove', e => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        btn.style.transform = `translate(${x * 0.25}px, ${y * 0.25}px)`;
      });
      btn.addEventListener('mouseleave', () => { btn.style.transform = ''; });
    });
  }

  // Blob héro
  function initBlob() {
    const hero = document.querySelector('.hero');
    if (!hero) return;
    const blob = document.createElement('div');
    blob.className = 'hero-blob';
    blob.style.cssText = 'width:600px;height:600px;background:radial-gradient(var(--primary),var(--secondary));top:50%;left:50%;margin:-300px;';
    hero.appendChild(blob);
  }

  document.addEventListener('DOMContentLoaded', () => {
    initWordReveal();
    initClipReveal();
    initParallax();
    initMouseParallax();
    initMagnetic();
    initBlob();
  });
})();
