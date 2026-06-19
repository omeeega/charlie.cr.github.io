/* Système de fidélité Bella Pizza */
const Fidelite = (function () {
  const KEY = 'bellaPizzaPoints';

  function get()  { return JSON.parse(localStorage.getItem(KEY) || '{"points":0,"history":[]}'); }
  function save(d){ localStorage.setItem(KEY, JSON.stringify(d)); }

  function add(euros, label) {
    const d = get();
    const earned = Math.floor(euros / 10);
    if (earned < 1) return;
    d.points += earned;
    d.history.unshift({ date: new Date().toISOString(), label, earned, total: d.points });
    save(d);
    render();
    if (typeof toast === 'function') toast(`+${earned} point${earned > 1 ? 's' : ''} de fidélité gagnés !`, 'success');
  }

  function render() {
    const d = get();
    document.querySelectorAll('.fidelite-points').forEach(el => {
      el.textContent = d.points;
    });
  }

  function getLevel(pts) {
    if (pts >= 50) return { name:'Or', icon:'🥇', next: null };
    if (pts >= 20) return { name:'Argent', icon:'🥈', next: 50, left: 50 - pts };
    if (pts >= 5)  return { name:'Bronze', icon:'🥉', next: 20, left: 20 - pts };
    return { name:'Débutant', icon:'🍕', next: 5, left: 5 - pts };
  }

  document.addEventListener('DOMContentLoaded', render);

  return { get, add, getLevel };
})();

/* Hook auto sur les commandes confirmées */
document.addEventListener('DOMContentLoaded', () => {
  const origConfirm = window.confirmOrder;
  if (typeof origConfirm === 'function') {
    window.confirmOrder = function () {
      const total = typeof cart !== 'undefined' ? cart.total() : 0;
      origConfirm.apply(this, arguments);
      setTimeout(() => Fidelite.add(total, 'Commande'), 1600);
    };
  }
});
