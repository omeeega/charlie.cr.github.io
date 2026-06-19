/* Canvas particles sur le hero */
(function () {
  const hero = document.querySelector('.hero');
  if (!hero) return;

  const canvas = document.createElement('canvas');
  canvas.style.cssText = 'position:absolute;inset:0;pointer-events:none;z-index:1;';
  hero.appendChild(canvas);

  const ctx = canvas.getContext('2d');
  let W, H, particles = [], mouse = { x: -999, y: -999 };
  const N = 45;

  function resize() {
    W = canvas.width = hero.offsetWidth;
    H = canvas.height = hero.offsetHeight;
  }

  function rand(a, b) { return Math.random() * (b - a) + a; }

  function Particle() {
    this.reset = function () {
      this.x = rand(0, W);
      this.y = rand(0, H);
      this.r = rand(1.5, 4);
      this.vx = rand(-0.4, 0.4);
      this.vy = rand(-0.6, -0.1);
      this.alpha = rand(0.15, 0.55);
      this.color = Math.random() > 0.5 ? '#ff7e5f' : '#feb47b';
    };
    this.reset();
    this.y = rand(0, H); // position initiale aléatoire
  }

  function init() {
    particles = Array.from({ length: N }, () => new Particle());
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);

    // Connexions entre points proches
    for (let i = 0; i < N; i++) {
      for (let j = i + 1; j < N; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          ctx.beginPath();
          ctx.strokeStyle = `rgba(255,126,95,${0.08 * (1 - dist / 120)})`;
          ctx.lineWidth = 0.8;
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }

    particles.forEach(p => {
      // Légère répulsion de la souris
      const dx = p.x - mouse.x;
      const dy = p.y - mouse.y;
      const d = Math.sqrt(dx * dx + dy * dy);
      if (d < 100) {
        p.x += dx / d * 0.5;
        p.y += dy / d * 0.5;
      }

      p.x += p.vx;
      p.y += p.vy;

      if (p.y < -10 || p.x < -10 || p.x > W + 10) p.reset();

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.color + Math.floor(p.alpha * 255).toString(16).padStart(2, '0');
      ctx.fill();
    });

    requestAnimationFrame(draw);
  }

  hero.addEventListener('mousemove', e => {
    const rect = hero.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
  });
  hero.addEventListener('mouseleave', () => { mouse.x = -999; mouse.y = -999; });

  window.addEventListener('resize', () => { resize(); });

  resize();
  init();
  draw();
})();
