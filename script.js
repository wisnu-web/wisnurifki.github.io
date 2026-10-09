// Stars background, scroll reveal, and mobile navigation
(() => {
  const canvas = document.getElementById('stars');
  const ctx = canvas.getContext('2d');
  let stars = [];
  let width = 0, height = 0, dpr = 1;

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const count = Math.min(180, Math.floor(width * height / 6500));
    stars = Array.from({length: count}, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      r: Math.random() * 1.25 + 0.2,
      a: Math.random() * 0.65 + 0.2,
      speed: Math.random() * 0.16 + 0.025,
      phase: Math.random() * Math.PI * 2
    }));
  }

  let frame = 0;
  function draw() {
    ctx.clearRect(0, 0, width, height);
    frame += 0.012;
    for (const s of stars) {
      const alpha = s.a * (0.72 + Math.sin(frame + s.phase) * 0.28);
      ctx.beginPath();
      ctx.fillStyle = `rgba(178,207,255,${alpha})`;
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fill();
      s.y += s.speed;
      if (s.y > height) { s.y = -2; s.x = Math.random() * width; }
    }
    requestAnimationFrame(draw);
  }

  resize();
  draw();
  window.addEventListener('resize', resize);

  const menuToggle = document.getElementById('menuToggle');
  const nav = document.getElementById('nav');
  menuToggle.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    menuToggle.setAttribute('aria-expanded', String(open));
    menuToggle.textContent = open ? '×' : '☰';
  });
  nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
    nav.classList.remove('open');
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.textContent = '☰';
  }));

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

  document.getElementById('year').textContent = new Date().getFullYear();

  // If assets/wisnu.jpg exists, use it instead of the initial placeholder.
  const photo = document.getElementById('profilePhoto');
  photo.addEventListener('load', () => {
    document.getElementById('portraitPlaceholder').style.display = 'none';
  });
})();
