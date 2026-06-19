// ============================================================
//  db.js — Couche base de données (Supabase REST API)
//  Utilise les identifiants définis dans config.js
// ============================================================
(function () {
  const { url, key } = window.DB_CONFIG || {};
  const configured = url && !url.includes('VOTRE');

  const headers = {
    'apikey': key || '',
    'Authorization': 'Bearer ' + (key || ''),
    'Content-Type': 'application/json'
  };

  // ── Envoi d'un message de contact ─────────────────────────
  async function sendMessage(name, email, message) {
    if (!configured) throw new Error('DB non configurée — remplissez config.js');
    const res = await fetch(url + '/rest/v1/contact_messages', {
      method: 'POST',
      headers: { ...headers, 'Prefer': 'return=minimal' },
      body: JSON.stringify({ name, email, message })
    });
    if (!res.ok) throw new Error('Erreur ' + res.status + ' : ' + await res.text());
    return true;
  }

  // ── Lecture des stats CTF ─────────────────────────────────
  async function getCTFStats() {
    if (!configured) return null;
    const res = await fetch(url + '/rest/v1/ctf_stats?select=*', { headers });
    if (!res.ok) return null;
    return res.json();
  }

  // ── Lecture des articles de blog publiés ──────────────────
  async function getBlogPosts() {
    if (!configured) return [];
    const res = await fetch(
      url + '/rest/v1/blog_posts?publie=eq.true&order=cree_le.desc&select=*',
      { headers }
    );
    if (!res.ok) return [];
    return res.json();
  }

  // ── Exposition globale ─────────────────────────────────────
  window.DB = { sendMessage, getCTFStats, getBlogPosts, configured };
})();
