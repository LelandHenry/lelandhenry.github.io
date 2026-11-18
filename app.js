(() => {
  const card = document.querySelector('.atrium, .atrium-card');
  const stage = document.querySelector('.stage, #atrium-stage');
  const svg = document.querySelector('#model, #atrium-svg');
  const particleLayer = document.querySelector('#particles, #particle-layer');
  const modeButtons = [...document.querySelectorAll('[data-mode]')];
  const pauseButton = document.querySelector('.pause, .pause-button');

  if (!card || !particleLayer) return;

  let seed = 41;
  const random = () => {
    seed = (seed * 16807) % 2147483647;
    return (seed - 1) / 2147483646;
  };

  const sources = [
    { x: 470, y: 340 },
    { x: 530, y: 350 },
    { x: 500, y: 300 }
  ];

  if (!particleLayer.children.length) {
    for (let i = 0; i < 108; i += 1) {
      const source = sources[i % sources.length];
      const angle = random() * Math.PI * 2;
      const radius = Math.pow(random(), .65);
      const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      circle.setAttribute('cx', source.x + Math.cos(angle) * 245 * radius);
      circle.setAttribute('cy', source.y + Math.sin(angle) * 92 * radius + radius * 55);
      circle.setAttribute('r', 1.2 + random() * 2.3);
      circle.classList.add(particleLayer.id === 'particles' ? 'dot' : 'acoustic-particle');
      if (i % 10 === 0) circle.classList.add(particleLayer.id === 'particles' ? 'accent' : 'is-accent');
      circle.style.setProperty('--t', `${2.4 + random() * 3.5}s`);
      circle.style.setProperty('--duration', `${2.4 + random() * 3.5}s`);
      circle.style.setProperty('--d', `${-random() * 4}s`);
      circle.style.setProperty('--delay', `${-random() * 4}s`);
      circle.style.setProperty('--x', `${(random() - .5) * 36}px`);
      circle.style.setProperty('--y', `${(random() - .6) * 26}px`);
      circle.style.setProperty('--dx', `${(random() - .5) * 36}px`);
      circle.style.setProperty('--dy', `${(random() - .6) * 26}px`);
      particleLayer.appendChild(circle);
    }
  }

  modeButtons.forEach((button) => {
    button.addEventListener('click', () => {
      card.dataset.mode = button.dataset.mode;
      modeButtons.forEach((item) => {
        const active = item === button;
        item.classList.toggle('active', active);
        item.classList.toggle('is-active', active);
        item.setAttribute('aria-pressed', String(active));
      });
    });
  });

  pauseButton?.addEventListener('click', () => {
    const paused = card.classList.toggle('paused') || card.classList.toggle('is-paused');
    pauseButton.setAttribute('aria-pressed', String(paused));
    pauseButton.setAttribute('aria-label', paused ? 'Resume animation' : 'Pause animation');
    pauseButton.textContent = paused ? '▶' : 'Ⅱ';
  });

  if (stage && svg && window.matchMedia('(pointer:fine)').matches) {
    stage.addEventListener('pointermove', (event) => {
      const rect = stage.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - .5;
      const y = (event.clientY - rect.top) / rect.height - .5;
      svg.style.transform = `perspective(1000px) rotateX(${-y * 2.4}deg) rotateY(${x * 3.2}deg)`;
    });
    stage.addEventListener('pointerleave', () => { svg.style.transform = ''; });
  }
})();
