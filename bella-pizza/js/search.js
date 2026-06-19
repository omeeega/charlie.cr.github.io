/* Recherche globale plein écran */
const SEARCH_DATA = [
  {name:'Margherita',   img:'img/pizza-margherita.jpg',  link:'menu.html',  tags:'tomate mozzarella basilic'},
  {name:'Pepperoni',    img:'img/pizza-pepperoni.jpg',   link:'menu.html',  tags:'tomate pepperoni charcuterie'},
  {name:'4 Fromages',  img:'img/pizza-4fromages.jpg',   link:'menu.html',  tags:'mozzarella gorgonzola emmental chevre fromage'},
  {name:'Reine',        img:'img/pizza-reine.jpg',       link:'menu.html',  tags:'jambon champignons mozzarella'},
  {name:'Savoyarde',    img:'img/pizza-savoyarde.jpg',   link:'menu.html',  tags:'reblochon lardons pommes de terre creme'},
  {name:'Végétarienne', img:'img/pizza-vegetarienne.jpg',link:'menu.html',  tags:'legumes courgette poivron vegétarien'},
  {name:'Chèvre-Miel',  img:'img/pizza-chevre-miel.jpg', link:'menu.html',  tags:'chevre miel noix creme'},
  {name:'Merguez',      img:'img/pizza-merguez.jpg',     link:'menu.html',  tags:'merguez poivrons tomate épicé'},
  {name:'Niçoise',      img:'img/pizza-nicoise.jpg',     link:'menu.html',  tags:'thon anchois olives oeuf'},
  {name:'Champignons',  img:'img/pizza-champignons.jpg', link:'menu.html',  tags:'champignons creme mozzarella vegétarien'},
  {name:'Californienne',img:'img/pizza-californienne.jpg',link:'menu.html', tags:'poulet avocat tomates cerises'},
  {name:'Calzone',      img:'img/pizza-calzone.jpg',     link:'menu.html',  tags:'pate pliee jambon mozzarella'},
  {name:'Grecque',      img:'img/pizza-grecque.jpg',     link:'menu.html',  tags:'feta olives poivrons oignons'},
  {name:'Detroit',      img:'img/pizza-detroit.jpg',     link:'menu.html',  tags:'pepperoni pate épaisse'},
  {name:'Normande',     img:'img/pizza-normande.jpg',    link:'menu.html',  tags:'camembert lardons pommes creme'},
  {name:'Réservation',  img:'img/pizzeria1.jpg',         link:'reservation.html', tags:'table reserver place'},
  {name:'Contact',      img:'img/pizzeria2.jpg',         link:'contact.html',     tags:'telephone adresse email'},
  {name:'Commander',    img:'img/pizzeria3.jpg',         link:'commande.html',    tags:'commande livraison panier'},
];

(function () {
  // Injection HTML de l'overlay
  const overlay = document.createElement('div');
  overlay.className = 'search-overlay';
  overlay.id = 'search-overlay';
  overlay.setAttribute('role', 'dialog');
  overlay.setAttribute('aria-label', 'Recherche');
  overlay.innerHTML = `
    <button class="search-close" id="search-close" aria-label="Fermer la recherche">✕</button>
    <input type="search" id="search-input" placeholder="Chercher une pizza, un ingrédient…" autocomplete="off" spellcheck="false">
    <div class="search-results" id="search-results" role="listbox"></div>
  `;
  document.body.appendChild(overlay);

  const input = overlay.querySelector('#search-input');
  const results = overlay.querySelector('#search-results');

  function open() {
    overlay.classList.add('open');
    setTimeout(() => input.focus(), 50);
  }
  function close() {
    overlay.classList.remove('open');
    input.value = '';
    results.innerHTML = '';
  }

  // Bouton loupe dans la navbar
  document.querySelectorAll('.search-trigger').forEach(btn => btn.addEventListener('click', open));
  document.getElementById('search-close')?.addEventListener('click', close);
  document.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });

  input.addEventListener('input', () => {
    const q = input.value.trim().toLowerCase();
    if (!q) { results.innerHTML = ''; return; }
    const hits = SEARCH_DATA.filter(d =>
      d.name.toLowerCase().includes(q) || d.tags.includes(q)
    ).slice(0, 8);

    if (!hits.length) {
      results.innerHTML = '<p style="color:rgba(255,255,255,0.4);text-align:center;padding:20px;">Aucun résultat trouvé.</p>';
      return;
    }
    results.innerHTML = hits.map(h => `
      <a href="${h.link}" class="search-result-item" role="option">
        <img src="${h.img}" alt="${h.name}" loading="lazy">
        <div>
          <div style="font-weight:600">${h.name}</div>
          <div style="font-size:0.8rem;color:rgba(255,255,255,0.5)">${h.tags.split(' ').slice(0,4).join(', ')}</div>
        </div>
      </a>
    `).join('');
  });

  window.openSearch = open;
})();
