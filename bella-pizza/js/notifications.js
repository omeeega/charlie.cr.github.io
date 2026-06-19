/* Centre de notifications + Push API */
const Notifications = (function () {
  const KEY = 'bellaPizzaNotifs';

  function get()  { return JSON.parse(localStorage.getItem(KEY) || '[]'); }
  function save(n){ localStorage.setItem(KEY, JSON.stringify(n)); }

  function add(msg, icon = '🍕') {
    const notifs = get();
    notifs.unshift({ id: Date.now(), msg, icon, date: new Date().toISOString(), read: false });
    save(notifs.slice(0, 30));
    render();
    // Toast natif si permission accordée
    if (Notification.permission === 'granted') {
      new Notification('Bella Pizza', { body: msg, icon: 'img/logo.jpg' });
    }
  }

  function markAllRead() {
    const n = get().map(x => ({ ...x, read: true }));
    save(n); render();
  }

  function unreadCount() { return get().filter(x => !x.read).length; }

  function render() {
    const badge = document.getElementById('notif-badge');
    const list = document.getElementById('notif-list');
    const count = unreadCount();
    if (badge) { badge.textContent = count; badge.style.display = count ? 'flex' : 'none'; }
    if (list) {
      const notifs = get();
      list.innerHTML = notifs.length ? notifs.slice(0, 10).map(n => `
        <div class="notif-item ${n.read ? '' : 'unread'}" data-id="${n.id}">
          <span style="font-size:1.2rem">${n.icon}</span>
          <div style="flex:1">
            <div style="font-size:0.9rem">${n.msg}</div>
            <div style="font-size:0.75rem;color:rgba(255,255,255,0.4)">${new Date(n.date).toLocaleTimeString('fr-FR',{hour:'2-digit',minute:'2-digit'})}</div>
          </div>
          <button onclick="Notifications.del(${n.id})" style="background:none;border:none;color:rgba(255,255,255,0.3);cursor:pointer;font-size:1rem">✕</button>
        </div>
      `).join('') : '<p style="text-align:center;color:rgba(255,255,255,0.4);padding:20px">Aucune notification.</p>';
    }
  }

  function del(id) {
    save(get().filter(n => n.id !== id)); render();
  }

  function requestPermission() {
    if (Notification.permission === 'default') {
      Notification.requestPermission().then(render);
    }
  }

  // Simuler des notifications post-commande
  function simulateOrderFlow() {
    add('Commande reçue ! Nous préparons votre pizza. 📋', '📋');
    setTimeout(() => add('Votre pizza est au four 🔥', '🔥'), 90000);
    setTimeout(() => add('Votre livreur est en route ! 🛵', '🛵'), 240000);
    setTimeout(() => add('Livraison dans ~5 min ✅', '✅'), 360000);
  }

  document.addEventListener('DOMContentLoaded', () => {
    render();
    // Toggle centre de notifications
    document.querySelectorAll('.notif-toggle').forEach(btn => {
      btn.addEventListener('click', () => {
        const panel = document.getElementById('notif-panel');
        if (panel) { panel.classList.toggle('open'); if (panel.classList.contains('open')) markAllRead(); }
      });
    });
  });

  return { add, del, markAllRead, render, unreadCount, requestPermission, simulateOrderFlow };
})();

window.Notifications = Notifications;
