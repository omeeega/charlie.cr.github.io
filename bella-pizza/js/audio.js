/* Web Audio API — zéro fichier audio */
const Audio = (function () {
  let ctx = null, muted = false;

  function getCtx() {
    if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)();
    if (ctx.state === 'suspended') ctx.resume();
    return ctx;
  }

  function beep(freq, dur, type = 'sine', vol = 0.15, delay = 0) {
    if (muted) return;
    try {
      const c = getCtx();
      const o = c.createOscillator();
      const g = c.createGain();
      o.connect(g); g.connect(c.destination);
      o.type = type; o.frequency.setValueAtTime(freq, c.currentTime + delay);
      g.gain.setValueAtTime(vol, c.currentTime + delay);
      g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + delay + dur);
      o.start(c.currentTime + delay);
      o.stop(c.currentTime + delay + dur);
    } catch {}
  }

  function chord(freqs, dur = 0.3) {
    freqs.forEach((f, i) => beep(f, dur, 'sine', 0.1, i * 0.05));
  }

  const sounds = {
    pop:     () => beep(800, 0.08, 'sine', 0.2),
    error:   () => beep(200, 0.3, 'sawtooth', 0.15),
    toast:   () => beep(600, 0.12, 'sine', 0.12),
    success: () => chord([523, 659, 784]),
    levelup: () => { [523,587,659,698,784].forEach((f,i) => beep(f, 0.15, 'sine', 0.15, i*0.08)); },
    swoosh:  () => { const c=getCtx(); if(muted)return; try{const b=c.createBufferSource();const buf=c.createBuffer(1,c.sampleRate*0.15,c.sampleRate);const d=buf.getChannelData(0);for(let i=0;i<d.length;i++)d[i]=(Math.random()*2-1)*(1-i/d.length);b.buffer=buf;const g=c.createGain();const bq=c.createBiquadFilter();bq.type='bandpass';bq.frequency.value=1200;bq.Q.value=0.5;b.connect(bq);bq.connect(g);g.connect(c.destination);g.gain.setValueAtTime(0.08,c.currentTime);g.gain.exponentialRampToValueAtTime(0.001,c.currentTime+0.15);b.start();b.stop(c.currentTime+0.15);}catch{}},
    ding:    () => { beep(1200, 0.05); setTimeout(() => beep(900, 0.08), 60); },
  };

  function init() {
    const saved = localStorage.getItem('bellaPizzaAudio');
    muted = saved === '0';
    // Bouton son dans nav
    const btn = document.getElementById('audio-toggle');
    if (btn) {
      btn.textContent = muted ? '🔇' : '🔊';
      btn.addEventListener('click', () => {
        muted = !muted;
        localStorage.setItem('bellaPizzaAudio', muted ? '0' : '1');
        btn.textContent = muted ? '🔇' : '🔊';
        if (!muted) sounds.pop();
      });
    }
    // Neon mode la nuit
    const h = new Date().getHours();
    if (h >= 20 || h < 6) document.body.classList.add('neon-mode');
  }

  document.addEventListener('DOMContentLoaded', init);
  return { ...sounds, muted: () => muted };
})();

window.Audio = Audio;
