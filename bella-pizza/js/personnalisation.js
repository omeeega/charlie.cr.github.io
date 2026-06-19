/* Personnalisation de l'interface */
const Personnalisation = (function () {
  const THEMES = {
    original: { primary: '#ff7e5f', secondary: '#feb47b', accent: '#ff5722', gold: '#f8b400' },
    sombre:   { primary: '#b0bec5', secondary: '#90a4ae', accent: '#78909c', gold: '#b0bec5' },
    bordeaux: { primary: '#c62828', secondary: '#e57373', accent: '#b71c1c', gold: '#ff8a65' },
    olive:    { primary: '#558b2f', secondary: '#aed581', accent: '#33691e', gold: '#cddc39' },
  };

  function applyTheme(name) {
    const t = THEMES[name];
    if (!t) return;
    const root = document.documentElement;
    Object.entries(t).forEach(([k, v]) => root.style.setProperty(`--${k}`, v));
    localStorage.setItem('bellaPizzaTheme', name);
  }

  function applyFontSize(size) {
    const sizes = { small: '14px', medium: '16px', large: '19px' };
    document.documentElement.style.fontSize = sizes[size] || '16px';
    localStorage.setItem('bellaPizzaFontSize', size);
  }

  function applyAnimations(level) {
    document.documentElement.style.setProperty('--transition', level === 'none' ? '0s' : level === 'reduced' ? '0.1s' : '0.3s');
    localStorage.setItem('bellaPizzaAnimations', level);
  }

  function loadSaved() {
    const theme = localStorage.getItem('bellaPizzaTheme') || 'original';
    const fs    = localStorage.getItem('bellaPizzaFontSize') || 'medium';
    const anim  = localStorage.getItem('bellaPizzaAnimations') || 'full';
    applyTheme(theme);
    applyFontSize(fs);
    applyAnimations(anim);
    return { theme, fs, anim };
  }

  document.addEventListener('DOMContentLoaded', () => {
    loadSaved();

    document.querySelectorAll('[data-theme]').forEach(btn => {
      btn.addEventListener('click', () => { applyTheme(btn.dataset.theme); document.querySelectorAll('[data-theme]').forEach(b => b.classList.remove('selected')); btn.classList.add('selected'); });
    });
    document.querySelectorAll('[data-fontsize]').forEach(btn => {
      btn.addEventListener('click', () => { applyFontSize(btn.dataset.fontsize); document.querySelectorAll('[data-fontsize]').forEach(b => b.classList.remove('selected')); btn.classList.add('selected'); });
    });
    document.querySelectorAll('[data-anim]').forEach(btn => {
      btn.addEventListener('click', () => { applyAnimations(btn.dataset.anim); document.querySelectorAll('[data-anim]').forEach(b => b.classList.remove('selected')); btn.classList.add('selected'); });
    });
  });

  return { applyTheme, applyFontSize, loadSaved };
})();

window.Personnalisation = Personnalisation;
