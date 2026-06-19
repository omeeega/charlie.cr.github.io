/* Dashboard admin */
const Admin = (function () {
  const PIZZAS_KEY = 'bellaPizzaMenuOverride';

  function getOrders() { return JSON.parse(localStorage.getItem('bellaPizzaOrders') || '[]'); }
  function getResas()  { return JSON.parse(localStorage.getItem('bellaPizzaResas')  || '[]'); }
  function getReviews(){ return JSON.parse(localStorage.getItem('bellaPizzaReviews')|| '[]'); }

  function stats() {
    const orders = getOrders();
    const ca = orders.reduce((s,o) => s + o.items.reduce((ss,i) => ss + i.price*i.qty, 0), 0);
    const avg = orders.length ? ca / orders.length : 0;
    const pizzaCounts = {};
    orders.forEach(o => o.items?.forEach(it => { pizzaCounts[it.name] = (pizzaCounts[it.name]||0) + it.qty; }));
    const topPizza = Object.entries(pizzaCounts).sort((a,b)=>b[1]-a[1])[0];
    return { orders: orders.length, ca, avg, topPizza: topPizza ? topPizza[0] : '—' };
  }

  function drawBarChart(canvas, data, labels) {
    const ctx = canvas.getContext('2d');
    const W = canvas.width, H = canvas.height;
    const max = Math.max(...data, 1);
    const bw = (W - 60) / data.length;
    ctx.clearRect(0,0,W,H);
    ctx.fillStyle = 'rgba(255,255,255,0.05)';
    ctx.fillRect(0,0,W,H);
    data.forEach((v, i) => {
      const bh = (v / max) * (H - 50);
      const x = 30 + i * bw + bw * 0.1;
      const grad = ctx.createLinearGradient(0, H-bh-20, 0, H-20);
      grad.addColorStop(0, '#ff7e5f'); grad.addColorStop(1, '#feb47b');
      ctx.fillStyle = grad;
      ctx.beginPath(); ctx.roundRect(x, H-bh-20, bw*0.8, bh, 4); ctx.fill();
      ctx.fillStyle = 'rgba(255,255,255,0.5)';
      ctx.font = '10px Roboto';
      ctx.textAlign = 'center';
      ctx.fillText(labels[i]||'', x + bw*0.4, H-5);
      if (v) ctx.fillText(v.toFixed(0), x + bw*0.4, H-bh-25);
    });
  }

  function drawPie(canvas, data, labels, colors) {
    const ctx = canvas.getContext('2d');
    const W = canvas.width, H = canvas.height;
    const cx = W/2, cy = H/2, r = Math.min(cx,cy) - 20;
    const total = data.reduce((s,v)=>s+v,0) || 1;
    ctx.clearRect(0,0,W,H);
    let start = -Math.PI/2;
    data.forEach((v,i) => {
      const angle = (v/total)*Math.PI*2;
      ctx.beginPath(); ctx.moveTo(cx,cy);
      ctx.arc(cx,cy,r,start,start+angle);
      ctx.fillStyle = colors[i]; ctx.fill();
      start += angle;
    });
    ctx.beginPath(); ctx.arc(cx,cy,r*0.5,0,Math.PI*2); ctx.fillStyle='#1e1e1e'; ctx.fill();
    ctx.fillStyle='#fff'; ctx.font='bold 14px Roboto'; ctx.textAlign='center'; ctx.textBaseline='middle';
    ctx.fillText(total, cx, cy);
  }

  function exportCSV() {
    const orders = getOrders();
    const rows = [['Numéro','Date','Mode','Total','Articles']];
    orders.forEach(o => {
      const total = o.items.reduce((s,i)=>s+i.price*i.qty,0).toFixed(2);
      const articles = o.items.map(i=>`${i.name}×${i.qty}`).join('; ');
      rows.push([o.num, o.date, o.mode, total, articles]);
    });
    const csv = rows.map(r => r.map(c => `"${c}"`).join(',')).join('\n');
    const a = document.createElement('a');
    a.href = 'data:text/csv;charset=utf-8,﻿' + encodeURIComponent(csv);
    a.download = 'commandes_bella_pizza.csv';
    a.click();
  }

  function updateOrderStatus(idx, status) {
    const orders = getOrders();
    if (orders[idx]) { orders[idx].status = status; localStorage.setItem('bellaPizzaOrders', JSON.stringify(orders)); }
  }

  return { stats, drawBarChart, drawPie, exportCSV, getOrders, getResas, getReviews, updateOrderStatus };
})();

window.Admin = Admin;
