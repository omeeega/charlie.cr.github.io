/* Moteur de recommandations basé sur l'historique */
const Recommandations = (function () {
  const ALL_PIZZAS = [
    {id:'margherita',name:'Margherita',cat:'classique',price:10.90,img:'img/pizza-margherita.jpg',tags:['classique']},
    {id:'pepperoni',name:'Pepperoni',cat:'classique',price:15.99,img:'img/pizza-pepperoni.jpg',tags:['viande']},
    {id:'4fromages',name:'4 Fromages',cat:'classique',price:12.50,img:'img/pizza-4fromages.jpg',tags:['fromage']},
    {id:'vegetarienne',name:'Végétarienne',cat:'vegetarienne',price:11.00,img:'img/pizza-vegetarienne.jpg',tags:['vegé']},
    {id:'savoyarde',name:'Savoyarde',cat:'speciale',price:14.00,img:'img/pizza-savoyarde.jpg',tags:['viande','creme']},
    {id:'chevre-miel',name:'Chèvre-Miel',cat:'speciale',price:12.00,img:'img/pizza-chevre-miel.jpg',tags:['vegé','sucre']},
    {id:'reine',name:'Reine',cat:'classique',price:9.80,img:'img/pizza-reine.jpg',tags:['viande','classique']},
    {id:'normande',name:'Normande',cat:'classique',price:12.00,img:'img/pizza-normande.jpg',tags:['viande','fromage']},
    {id:'calzone',name:'Calzone',cat:'speciale',price:14.75,img:'img/pizza-calzone.jpg',tags:['viande']},
    {id:'merguez',name:'Merguez',cat:'speciale',price:14.00,img:'img/pizza-merguez.jpg',tags:['epice','viande']},
  ];

  function analyze() {
    const orders = JSON.parse(localStorage.getItem('bellaPizzaOrders') || '[]');
    const tagCount = {};
    const idCount = {};
    orders.forEach(o => o.items?.forEach(it => {
      idCount[it.id] = (idCount[it.id] || 0) + 1;
      const pizza = ALL_PIZZAS.find(p => it.id?.startsWith(p.id));
      if (pizza) pizza.tags.forEach(t => { tagCount[t] = (tagCount[t] || 0) + 1; });
    }));
    return { tagCount, idCount };
  }

  function score(pizza, tagCount, idCount) {
    let s = 0;
    pizza.tags.forEach(t => s += (tagCount[t] || 0) * 2);
    s -= (idCount[pizza.id] || 0) * 3; // déjà commandé → moins intéressant
    return s;
  }

  function getForYou(n = 3) {
    const { tagCount, idCount } = analyze();
    return [...ALL_PIZZAS].sort((a, b) => score(b, tagCount, idCount) - score(a, tagCount, idCount)).slice(0, n);
  }

  function getNotTried(n = 2) {
    const { idCount } = analyze();
    return ALL_PIZZAS.filter(p => !idCount[p.id]).slice(0, n);
  }

  function renderSection(containerId) {
    const el = document.getElementById(containerId);
    if (!el) return;
    const orders = JSON.parse(localStorage.getItem('bellaPizzaOrders') || '[]');
    if (!orders.length) { el.style.display = 'none'; return; }

    const forYou = getForYou(3);
    el.innerHTML = `
      <div class="section-title"><h2>Recommandé pour vous</h2><div class="line"></div></div>
      <div class="pizza-grid" style="grid-template-columns:repeat(auto-fill,minmax(240px,1fr))">
        ${forYou.map(p => `
          <article class="pizza-card">
            <div class="card-img"><img src="${p.img}" alt="${p.name}" loading="lazy"></div>
            <div class="card-body">
              <h3>${p.name}</h3>
              <div class="card-footer">
                <span class="price">${p.price.toFixed(2).replace('.',',')} €</span>
                <button class="btn-add" onclick="cart.add({id:'${p.id}',name:'${p.name}',price:${p.price},img:'${p.img}'})">+ Ajouter</button>
              </div>
            </div>
          </article>
        `).join('')}
      </div>
    `;
  }

  document.addEventListener('DOMContentLoaded', () => renderSection('recommandations-section'));
  return { getForYou, getNotTried };
})();
