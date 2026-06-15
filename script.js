(function () {
  // Matrix rain — uniquement sur la page index
  const canvas = document.getElementById('matrix-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  const chars = '01アイウエオカキクケコサシスセソタチツテト';
  const size  = 14;
  let cols, drops;

  function init() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
    cols  = Math.floor(canvas.width / size);
    drops = Array.from({ length: cols }, () => Math.random() * -30);
  }

  function draw() {
    ctx.fillStyle = 'rgba(5, 5, 10, 0.06)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#00ff88';
    ctx.font = `${size}px Consolas, monospace`;

    for (let i = 0; i < drops.length; i++) {
      if (drops[i] > 0) {
        const ch = chars[Math.floor(Math.random() * chars.length)];
        ctx.fillText(ch, i * size, drops[i] * size);
      }
      if (drops[i] * size > canvas.height && Math.random() > 0.975) {
        drops[i] = 0;
      }
      drops[i]++;
    }
  }

  init();
  window.addEventListener('resize', init);
  setInterval(draw, 55);
})();
