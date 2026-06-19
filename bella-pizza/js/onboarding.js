/* Tour guidé interactif */
const Onboarding = (function () {
  const STEPS = [
    { sel: '.nav-logo', title: 'Bienvenue !', text: 'Cliquez sur le logo pour revenir à l\'accueil depuis n\'importe quelle page.' },
    { sel: '.btn-nav', title: 'Commander', text: 'Votre panier est ici. Il se met à jour en temps réel sur toutes les pages.' },
    { sel: '.fidelite-badge', title: 'Fidélité', text: 'Gagnez des points à chaque commande. 10€ = 1 point. Débloquez des réductions !' },
    { sel: '.search-trigger', title: 'Recherche', text: 'Trouvez une pizza ou une page en un clin d\'œil avec la recherche globale.' },
    { sel: '#dark-toggle', title: 'Mode sombre', text: 'Basculez entre le mode clair et sombre selon vos préférences.' },
  ];

  let step = 0, overlay, spotlight, bubble;

  function build() {
    overlay = document.createElement('div');
    overlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.75);z-index:8000;pointer-events:none;';
    document.body.appendChild(overlay);

    spotlight = document.createElement('div');
    spotlight.style.cssText = 'position:fixed;border-radius:12px;box-shadow:0 0 0 9999px rgba(0,0,0,0.75);z-index:8001;transition:all 0.4s ease;pointer-events:none;';
    document.body.appendChild(spotlight);

    bubble = document.createElement('div');
    bubble.style.cssText = 'position:fixed;background:#1e1e1e;border:1px solid rgba(255,126,95,0.4);border-radius:16px;padding:20px 24px;max-width:280px;z-index:8002;box-shadow:0 8px 30px rgba(0,0,0,0.5);';
    document.body.appendChild(bubble);
  }

  function show(i) {
    const s = STEPS[i];
    const el = document.querySelector(s.sel);
    if (!el) { next(); return; }

    const rect = el.getBoundingClientRect();
    const pad = 8;
    spotlight.style.cssText += `top:${rect.top - pad}px;left:${rect.left - pad}px;width:${rect.width + pad*2}px;height:${rect.height + pad*2}px;`;

    const progress = `<div style="display:flex;gap:6px;margin-bottom:12px;">${STEPS.map((_,j)=>`<div style="flex:1;height:3px;border-radius:2px;background:${j<=i?'var(--primary)':'rgba(255,255,255,0.15)'}"></div>`).join('')}</div>`;
    bubble.innerHTML = `
      ${progress}
      <h3 style="font-size:1rem;margin-bottom:6px;color:var(--secondary)">${s.title}</h3>
      <p style="font-size:0.875rem;color:rgba(255,255,255,0.75);line-height:1.5;margin-bottom:16px">${s.text}</p>
      <div style="display:flex;justify-content:space-between;align-items:center;">
        <button onclick="Onboarding.skip()" style="background:none;border:none;color:rgba(255,255,255,0.4);cursor:pointer;font-size:0.8rem">Passer</button>
        <button onclick="Onboarding.next()" style="background:var(--primary);border:none;border-radius:20px;color:#fff;padding:8px 20px;cursor:pointer;font-size:0.9rem">${i === STEPS.length-1 ? 'Terminer ✓' : 'Suivant →'}</button>
      </div>
    `;

    // Position de la bulle
    const bH = 160, bW = 280;
    let top = rect.bottom + 16;
    let left = rect.left;
    if (top + bH > window.innerHeight) top = rect.top - bH - 16;
    if (left + bW > window.innerWidth - 16) left = window.innerWidth - bW - 16;
    bubble.style.top = Math.max(8, top) + 'px';
    bubble.style.left = Math.max(8, left) + 'px';
  }

  function start() {
    step = 0;
    build();
    show(0);
  }

  function next() {
    step++;
    if (step >= STEPS.length) { skip(); return; }
    show(step);
  }

  function skip() {
    overlay?.remove(); spotlight?.remove(); bubble?.remove();
    localStorage.setItem('bellaPizzaOnboarded', '1');
  }

  document.addEventListener('DOMContentLoaded', () => {
    if (!localStorage.getItem('bellaPizzaOnboarded') && !localStorage.getItem('bellaPizzaWelcome')) {
      setTimeout(start, 4000);
    }
    // Bouton "Revoir le guide" dans le footer
    document.querySelectorAll('.onboarding-restart').forEach(btn => btn.addEventListener('click', start));
  });

  return { start, next, skip };
})();

window.Onboarding = Onboarding;
