/* Commande vocale via Web Speech API */
const Voice = (function () {
  if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) return { supported: false };

  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  const rec = new SR();
  rec.lang = 'fr-FR';
  rec.continuous = false;
  rec.interimResults = false;

  let active = false;

  const COMMANDS = [
    { pattern: /ajouter? (.+)/i, action: (match) => {
      const q = match[1].toLowerCase();
      const PIZZAS = ['margherita','pepperoni','4 fromages','végétarienne','savoyarde','reine','normande','calzone'];
      const found = PIZZAS.find(p => q.includes(p.split(' ')[0]));
      if (found && typeof cart !== 'undefined') {
        if (typeof toast === 'function') toast(`🎤 "${found}" ajouté au panier !`, 'success');
      } else if (typeof toast === 'function') toast(`🎤 Pizza "${q}" introuvable.`, 'error');
    }},
    { pattern: /mon panier|voir le panier/i, action: () => { location.href = 'commande.html'; }},
    { pattern: /commander/i, action: () => { location.href = 'commande.html'; }},
    { pattern: /menu|carte/i, action: () => { location.href = 'menu.html'; }},
    { pattern: /accueil/i, action: () => { location.href = 'index.html'; }},
    { pattern: /réservation|réserver/i, action: () => { location.href = 'reservation.html'; }},
    { pattern: /contact/i, action: () => { location.href = 'contact.html'; }},
  ];

  rec.onresult = e => {
    const text = e.results[0][0].transcript;
    if (typeof toast === 'function') toast(`🎤 Entendu : "${text}"`, 'info');
    for (const cmd of COMMANDS) {
      const m = text.match(cmd.pattern);
      if (m) { cmd.action(m); break; }
    }
    setActive(false);
  };

  rec.onerror = () => setActive(false);
  rec.onend   = () => setActive(false);

  function setActive(on) {
    active = on;
    document.querySelectorAll('.voice-btn').forEach(btn => {
      btn.textContent = on ? '🎤 Écoute...' : '🎤';
      btn.style.background = on ? 'rgba(255,126,95,0.3)' : '';
    });
  }

  function toggle() {
    if (active) { rec.stop(); setActive(false); }
    else { rec.start(); setActive(true); }
  }

  document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.voice-btn').forEach(btn => btn.addEventListener('click', toggle));
  });

  return { supported: true, toggle };
})();

window.Voice = Voice;
