/* Système de notation et avis */
const Reviews = (function () {
  const KEY = 'bellaPizzaReviews';

  function get()  { return JSON.parse(localStorage.getItem(KEY) || '[]'); }
  function save(r){ localStorage.setItem(KEY, JSON.stringify(r)); }

  function add(data) {
    const reviews = get();
    reviews.unshift({ ...data, id: Date.now(), date: new Date().toISOString(), approved: true });
    save(reviews);
  }

  function stats() {
    const r = get().filter(x => x.approved);
    if (!r.length) return { avg: 0, total: 0, dist: [0,0,0,0,0] };
    const avg = r.reduce((s,x) => s + x.rating, 0) / r.length;
    const dist = [0,0,0,0,0];
    r.forEach(x => dist[x.rating - 1]++);
    return { avg: Math.round(avg * 10) / 10, total: r.length, dist };
  }

  // Popup post-commande
  function showRatingPopup() {
    if (localStorage.getItem('bellaPizzaRated_' + new Date().toDateString())) return;
    setTimeout(() => {
      const popup = document.createElement('div');
      popup.className = 'modal-overlay open';
      popup.innerHTML = `
        <div class="modal" style="max-width:420px;">
          <div class="modal-header">
            <h3>Notez votre expérience</h3>
            <button class="modal-close" onclick="this.closest('.modal-overlay').remove()">✕</button>
          </div>
          <div id="star-input" style="font-size:2.5rem;text-align:center;cursor:pointer;margin:16px 0;letter-spacing:6px;">
            ☆☆☆☆☆
          </div>
          <div class="form-group">
            <label>Votre commentaire</label>
            <textarea id="review-comment" rows="3" placeholder="Partagez votre avis..."></textarea>
          </div>
          <div class="form-group">
            <label>Votre prénom</label>
            <input type="text" id="review-name" placeholder="Sophie">
          </div>
          <button class="btn btn-primary" style="width:100%" id="review-submit">Envoyer mon avis</button>
        </div>
      `;
      document.body.appendChild(popup);

      let rating = 0;
      const stars = popup.querySelector('#star-input');
      stars.addEventListener('mousemove', e => {
        const idx = [...stars.querySelectorAll('*')].indexOf(e.target);
        if (idx >= 0) updateStars(idx + 1, false);
      });
      stars.addEventListener('mouseleave', () => updateStars(rating, true));
      stars.addEventListener('click', e => {
        const chars = stars.textContent;
        const x = e.clientX - stars.getBoundingClientRect().left;
        const cw = stars.offsetWidth / 5;
        rating = Math.max(1, Math.ceil(x / cw));
        updateStars(rating, true);
      });

      function updateStars(n, set) {
        stars.textContent = '★'.repeat(n) + '☆'.repeat(5 - n);
        stars.style.color = '#f8b400';
        if (set) rating = n;
      }

      popup.querySelector('#review-submit').addEventListener('click', () => {
        if (!rating) { if (typeof toast === 'function') toast('Choisissez une note !', 'error'); return; }
        const comment = popup.querySelector('#review-comment').value.trim();
        const name = popup.querySelector('#review-name').value.trim() || 'Client anonyme';
        add({ rating, comment, name });
        localStorage.setItem('bellaPizzaRated_' + new Date().toDateString(), '1');
        popup.remove();
        if (typeof toast === 'function') toast('Merci pour votre avis ! ⭐', 'success');
      });
    }, 30000);
  }

  return { get, add, stats, showRatingPopup };
})();

window.Reviews = Reviews;
// Déclencher après confirmation de commande
document.addEventListener('DOMContentLoaded', () => {
  if (location.pathname.includes('commande')) {
    const orig = window.confirmOrder;
    if (typeof orig === 'function') window.confirmOrder = function() { orig.apply(this, arguments); setTimeout(Reviews.showRatingPopup, 35000); };
  }
});
