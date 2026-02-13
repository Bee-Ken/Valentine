function spawnHearts() {
  const container = document.querySelector('.hearts');
  if (!container) return;

  // Make a few hearts at load
  for (let i = 0; i < 18; i++) addHeart(container);

  // Keep them coming slowly
  setInterval(() => addHeart(container), 900);
}

function addHeart(container) {
  const heart = document.createElement('div');
  heart.className = 'heart';

  const emojis = ['💙','💜','✨','💖','💫'];
  heart.textContent = emojis[Math.floor(Math.random() * emojis.length)];

  const left = Math.random() * 100; // vw
  const dur = 6 + Math.random() * 8; // seconds
  const size = 14 + Math.random() * 18;

  heart.style.left = left + 'vw';
  heart.style.animationDuration = dur + 's';
  heart.style.fontSize = size + 'px';

  container.appendChild(heart);

  // Remove after animation
  setTimeout(() => heart.remove(), (dur + 0.2) * 1000);
}

function setupNoButton() {
  const noBtn = document.getElementById('no');
  if (!noBtn) return;

  const move = () => {
    const pad = 18;
    const maxX = window.innerWidth - noBtn.offsetWidth - pad;
    const maxY = window.innerHeight - noBtn.offsetHeight - pad;

    const x = pad + Math.random() * Math.max(1, maxX - pad);
    const y = pad + Math.random() * Math.max(1, maxY - pad);

    noBtn.style.left = x + 'px';
    noBtn.style.top = y + 'px';
  };

  // Start somewhere sensible
  noBtn.style.position = 'absolute';
  noBtn.style.left = '55%';
  noBtn.style.top = '65%';

  noBtn.addEventListener('mouseover', move);
  noBtn.addEventListener('click', move);
}

document.addEventListener('DOMContentLoaded', () => {
  spawnHearts();
  setupNoButton();
});

function setupMemorySlideshow() {
  const stageImg = document.getElementById('stageImg');
  if (!stageImg) return; // only runs on memory pages

  const titleEl = document.getElementById('memoryTitle');
  const captionEl = document.getElementById('memoryCaption');
  const counterEl = document.getElementById('memoryCounter');

  const prevPhotoBtn = document.getElementById('prevPhoto');
  const nextPhotoBtn = document.getElementById('nextPhoto');

  const prevMemoryLink = document.getElementById('prevMemory');
  const nextMemoryLink = document.getElementById('nextMemory');
  const homeLink = document.getElementById('homeLink');

  // Data is embedded per-page in window.MEMORY (see memory1.html template below)
  const mem = window.MEMORY;
  if (!mem || !mem.photos || mem.photos.length === 0) return;

  let i = 0;

  function render() {
    stageImg.src = mem.photos[i].src;
    stageImg.alt = mem.photos[i].alt || mem.title || 'Memory photo';

    if (titleEl) titleEl.textContent = mem.title || 'Memory';
    if (captionEl) captionEl.textContent = mem.photos[i].caption || '';
    if (counterEl) counterEl.textContent = `Photo ${i + 1} of ${mem.photos.length}`;

    // Buttons enabled/disabled
    if (prevPhotoBtn) prevPhotoBtn.disabled = (i === 0);
    if (nextPhotoBtn) nextPhotoBtn.disabled = (i === mem.photos.length - 1);

    // On last photo, show memory navigation (you asked for this)
    const isLast = (i === mem.photos.length - 1);
    if (prevMemoryLink) prevMemoryLink.style.display = isLast ? 'inline-flex' : 'none';
    if (nextMemoryLink) nextMemoryLink.style.display = isLast ? 'inline-flex' : 'none';
    if (homeLink) homeLink.style.display = isLast ? 'inline-flex' : 'none';
  }

  function prev() { if (i > 0) { i--; render(); } }
  function next() { if (i < mem.photos.length - 1) { i++; render(); } }

  if (prevPhotoBtn) prevPhotoBtn.addEventListener('click', prev);
  if (nextPhotoBtn) nextPhotoBtn.addEventListener('click', next);

  // Keyboard navigation (nice on laptop)
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') prev();
    if (e.key === 'ArrowRight') next();
  });

  render();
});
