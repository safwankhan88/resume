document.addEventListener('DOMContentLoaded', () => {

  // ── LOADER ──
  window.addEventListener('load', () => {
    setTimeout(() => {
      const loader = document.getElementById('loader');
      if (loader) loader.classList.add('hide');
    }, 2200);
  });

  // ── CUSTOM CURSOR ──
  const dot  = document.getElementById('cursor-dot');
  const ring = document.getElementById('cursor-ring');

  if (dot && ring) {
    let mx = 0, my = 0, rx = 0, ry = 0;

    document.addEventListener('mousemove', e => {
      mx = e.clientX;
      my = e.clientY;
      dot.style.left = mx + 'px';
      dot.style.top  = my + 'px';
    });

    function animRing() {
      rx += (mx - rx) * 0.12;
      ry += (my - ry) * 0.12;
      ring.style.left = rx + 'px';
      ring.style.top  = ry + 'px';
      requestAnimationFrame(animRing);
    }
    animRing();

    document.querySelectorAll('a, button, .proj-card, .contact-card, .edu-card, .chip').forEach(el => {
      el.addEventListener('mouseenter', () => {
        ring.style.width       = '55px';
        ring.style.height      = '55px';
        ring.style.borderColor = 'rgba(236,72,153,.7)';
        dot.style.background   = '#ec4899';
      });
      el.addEventListener('mouseleave', () => {
        ring.style.width       = '36px';
        ring.style.height      = '36px';
        ring.style.borderColor = 'rgba(99,102,241,.6)';
        dot.style.background   = 'var(--cyan)';
      });
    });
  }

  // ── PARTICLE CANVAS ──
  const canvas = document.getElementById('canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let W, H;
    const particles = [];
    const COLORS = ['#6366f1', '#ec4899', '#06b6d4', '#f59e0b'];

    function resize() {
      W = canvas.width  = window.innerWidth;
      H = canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    class Particle {
      constructor() { this.reset(); }
      reset() {
        this.x     = Math.random() * W;
        this.y     = Math.random() * H;
        this.vx    = (Math.random() - 0.5) * 0.5;
        this.vy    = (Math.random() - 0.5) * 0.5;
        this.r     = Math.random() * 2 + 1;
        this.color = COLORS[Math.floor(Math.random() * COLORS.length)];
        this.alpha = Math.random() * 0.6 + 0.2;
      }
      update() {
        this.x += this.vx;
        this.y += this.vy;
        if (this.x < 0 || this.x > W || this.y < 0 || this.y > H) this.reset();
      }
      draw() {
        ctx.save();
        ctx.globalAlpha = this.alpha;
        ctx.fillStyle   = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    }

    for (let i = 0; i < 90; i++) particles.push(new Particle());

    function drawLines() {
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx   = particles[i].x - particles[j].x;
          const dy   = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx.save();
            ctx.globalAlpha  = (1 - dist / 120) * 0.15;
            ctx.strokeStyle  = particles[i].color;
            ctx.lineWidth    = 0.5;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
            ctx.restore();
          }
        }
      }
    }

    function animCanvas() {
      ctx.clearRect(0, 0, W, H);
      particles.forEach(p => { p.update(); p.draw(); });
      drawLines();
      requestAnimationFrame(animCanvas);
    }
    animCanvas();
  }

  // ── SCROLL REVEAL ──
  const revealEls = document.querySelectorAll('.reveal');
  if (revealEls.length) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) e.target.classList.add('visible');
      });
    }, { threshold: 0.12 });

    revealEls.forEach((el, i) => {
      el.style.transitionDelay = (i % 4) * 0.08 + 's';
      observer.observe(el);
    });
  }

  // ── SKILL BARS ──
  const skillBars = document.querySelectorAll('.skill-bar');
  if (skillBars.length) {
    const barObserver = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          const bar = e.target;
          const pct = bar.dataset.pct;
          if (pct) bar.style.width = pct + '%';
          setTimeout(() => bar.classList.add('filled'), 1200);
          barObserver.unobserve(bar);
        }
      });
    }, { threshold: 0.3 });

    skillBars.forEach(bar => barObserver.observe(bar));
  }

}); // end DOMContentLoaded 