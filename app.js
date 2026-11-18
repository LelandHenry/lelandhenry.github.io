(() => {
  const card = document.querySelector('.atrium-card');
  const stage = document.querySelector('#atrium-stage');
  const svg = document.querySelector('#atrium-svg');
  const particleLayer = document.querySelector('#particle-layer');
  const modeButtons = [...document.querySelectorAll('.mode-button')];
  const pauseButton = document.querySelector('.pause-button');
  const navToggle = document.querySelector('.nav-toggle');
  const header = document.querySelector('.site-header');

  // Deterministic pseudo-random generator keeps the particle field stable.
  let seed = 1867;
  const random = () => {
    seed = (seed * 16807) % 2147483647;
    return (seed - 1) / 2147483646;
  };

  const sources = [
    { x: 330, y: 309, spreadX: 230, spreadY: 150 },
    { x: 637, y: 252, spreadX: 210, spreadY: 155 }
  ];

  for (let i = 0; i < 92; i += 1) {
    const source = sources[i % sources.length];
    const angle = random() * Math.PI * 2;
    const radius = Math.pow(random(), .63);
    const x = source.x + Math.cos(angle) * source.spreadX * radius;
    const y = source.y + Math.sin(angle) * source.spreadY * radius * .55 + radius * 62;
    const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    circle.setAttribute('cx', x.toFixed(1));
    circle.setAttribute('cy', y.toFixed(1));
    circle.setAttribute('r', (1.15 + random() * 2.3).toFixed(1));
    circle.classList.add('acoustic-particle');
    if (i % 11 === 0) circle.classList.add('is-accent');
    circle.style.setProperty('--duration', `${2.4 + random() * 3.9}s`);
    circle.style.setProperty('--delay', `${-random() * 5}s`);
    circle.style.setProperty('--dx', `${(random() - .5) * 44}px`);
    circle.style.setProperty('--dy', `${(random() - .58) * 31}px`);
    particleLayer.appendChild(circle);
  }

  modeButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const mode = button.dataset.mode;
      card.dataset.mode = mode;
      modeButtons.forEach((item) => {
        const active = item === button;
        item.classList.toggle('is-active', active);
        item.setAttribute('aria-pressed', String(active));
      });
    });
  });

  pauseButton?.addEventListener('click', () => {
    const paused = card.classList.toggle('is-paused');
    pauseButton.setAttribute('aria-pressed', String(paused));
    pauseButton.setAttribute('aria-label', paused ? 'Resume animation' : 'Pause animation');
    pauseButton.querySelector('span').textContent = paused ? '▶' : 'Ⅱ';
  });

  if (window.matchMedia('(pointer:fine)').matches) {
    stage?.addEventListener('pointermove', (event) => {
      const rect = stage.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - .5;
      const y = (event.clientY - rect.top) / rect.height - .5;
      svg.style.transform = `perspective(1100px) rotateX(${(-y * 2.4).toFixed(2)}deg) rotateY(${(x * 3.2).toFixed(2)}deg) translateZ(0)`;
    });
    stage?.addEventListener('pointerleave', () => { svg.style.transform = ''; });
  }

  navToggle?.addEventListener('click', () => {
    const open = header.classList.toggle('nav-open');
    navToggle.setAttribute('aria-expanded', String(open));
    navToggle.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
  });

  document.querySelectorAll('.site-nav a').forEach((link) => {
    link.addEventListener('click', () => {
      header.classList.remove('nav-open');
      navToggle?.setAttribute('aria-expanded', 'false');
    });
  });

  document.querySelectorAll('[data-delay]').forEach((element) => {
    element.style.setProperty('--delay', `${element.dataset.delay}ms`);
  });

  const reveals = [...document.querySelectorAll('.reveal')];
  if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: .12, rootMargin: '0px 0px -6% 0px' });
    reveals.forEach((element) => observer.observe(element));
  } else {
    reveals.forEach((element) => element.classList.add('is-visible'));
  }
})();
