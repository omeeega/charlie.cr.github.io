/* ── PANIER ─────────────────────────────────────────────── */
class Cart {
  constructor() {
    this.items = JSON.parse(localStorage.getItem('bellaPizzaCart') || '[]');
    this._render();
  }
  _save() { localStorage.setItem('bellaPizzaCart', JSON.stringify(this.items)); }
  _render() {
    const count = this.items.reduce((s,i) => s + i.qty, 0);
    document.querySelectorAll('#cart-count').forEach(el => {
      el.textContent = count;
      el.classList.add('bump');
      setTimeout(() => el.classList.remove('bump'), 300);
    });
  }
  add(pizza) {
    const ex = this.items.find(i => i.id === pizza.id);
    if (ex) ex.qty++;
    else this.items.push({ ...pizza, qty: 1 });
    this._save(); this._render();
    toast(`${pizza.name} ajouté au panier !`, 'success');
  }
  remove(id) {
    this.items = this.items.filter(i => i.id !== id);
    this._save(); this._render();
  }
  update(id, qty) {
    if (qty < 1) return this.remove(id);
    const item = this.items.find(i => i.id === id);
    if (item) { item.qty = qty; this._save(); this._render(); }
  }
  clear() { this.items = []; this._save(); this._render(); }
  total() { return this.items.reduce((s,i) => s + i.price * i.qty, 0); }
  count() { return this.items.reduce((s,i) => s + i.qty, 0); }
}

/* ── TOASTS ─────────────────────────────────────────────── */
function toast(msg, type = 'info') {
  const c = document.getElementById('toast-container') || (() => {
    const el = document.createElement('div');
    el.id = 'toast-container'; el.className = 'toast-container';
    document.body.appendChild(el); return el;
  })();
  const icons = { success: '✅', error: '❌', info: 'ℹ️' };
  const t = document.createElement('div');
  t.className = `toast ${type}`;
  t.innerHTML = `<span>${icons[type]}</span><span>${msg}</span>`;
  c.appendChild(t);
  setTimeout(() => { t.classList.add('out'); setTimeout(() => t.remove(), 300); }, 3000);
}

/* ── NAV HAMBURGER ──────────────────────────────────────── */
function initNav() {
  const btn = document.getElementById('hamburger');
  const links = document.getElementById('nav-links');
  if (!btn || !links) return;
  btn.addEventListener('click', () => {
    btn.classList.toggle('open');
    links.classList.toggle('open');
  });
  links.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    btn.classList.remove('open'); links.classList.remove('open');
  }));
  document.addEventListener('click', e => {
    if (!btn.contains(e.target) && !links.contains(e.target)) {
      btn.classList.remove('open'); links.classList.remove('open');
    }
  });
  // Sticky scroll
  window.addEventListener('scroll', () => {
    document.getElementById('navbar')?.classList.toggle('scrolled', window.scrollY > 50);
  });
  // Active link
  const path = location.pathname.split('/').pop() || 'index.html';
  links.querySelectorAll('a').forEach(a => {
    if (a.getAttribute('href') === path) a.classList.add('active');
  });
}

/* ── ANIMATIONS SCROLL ──────────────────────────────────── */
function initReveal() {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); } });
  }, { threshold: 0.15 });
  document.querySelectorAll('.reveal').forEach(el => obs.observe(el));
}

/* ── COMPTEURS ANIMÉS ───────────────────────────────────── */
function animateCounter(el) {
  const target = parseInt(el.dataset.target);
  const dur = 1500, step = 16;
  const inc = target / (dur / step);
  let cur = 0;
  const t = setInterval(() => {
    cur = Math.min(cur + inc, target);
    el.textContent = Math.floor(cur).toLocaleString('fr-FR') + (el.dataset.suffix || '');
    if (cur >= target) clearInterval(t);
  }, step);
}
function initCounters() {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting && !e.target.dataset.done) { e.target.dataset.done = 1; animateCounter(e.target); obs.unobserve(e.target); } });
  }, { threshold: 0.5 });
  document.querySelectorAll('[data-target]').forEach(el => obs.observe(el));
}

/* ── VALIDATION FORMULAIRE ──────────────────────────────── */
function validateField(input) {
  const group = input.closest('.form-group');
  const errEl = group?.querySelector('.field-error');
  const rules = { email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, tel: /^[\d\s\+\-\(\)]{8,}$/ };
  let err = '';
  if (input.required && !input.value.trim()) err = 'Ce champ est requis.';
  else if (input.type === 'email' && !rules.email.test(input.value)) err = 'Email invalide.';
  else if (input.dataset.type === 'tel' && input.value && !rules.tel.test(input.value)) err = 'Téléphone invalide.';
  input.classList.toggle('error', !!err);
  if (errEl) { errEl.textContent = err; errEl.classList.toggle('show', !!err); }
  return !err;
}

function initFormValidation(formId) {
  const form = document.getElementById(formId);
  if (!form) return;
  form.querySelectorAll('input, textarea').forEach(inp => {
    inp.addEventListener('blur', () => validateField(inp));
    inp.addEventListener('input', () => { if (inp.classList.contains('error')) validateField(inp); });
  });
}

/* ── FAQ ACCORDÉON ──────────────────────────────────────── */
function initFaq() {
  document.querySelectorAll('.faq-item').forEach(item => {
    item.querySelector('.faq-q')?.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
      if (!isOpen) item.classList.add('open');
    });
  });
}

/* ── INIT GLOBAL ────────────────────────────────────────── */
window.cart = new Cart();
document.addEventListener('DOMContentLoaded', () => {
  initNav();
  initReveal();
  initCounters();
  initFaq();
});
