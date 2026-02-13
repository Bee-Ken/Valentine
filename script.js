function spawnHearts() {
  const container = document.querySelector('.hearts');
  if (!container) return;

  for (let i = 0; i < 18; i++) addHeart(container);
  setInterval(() => addHeart(container), 900);
}

function addHeart(container) {
  const heart = document.createElement('div');
  heart.className = 'heart';

  const emojis = ['💙', '💜', '✨', '💖', '💫'];
  heart.textContent = emojis[Math.floor(Math.random() * emojis.length)];

  const left = Math.random() * 100; // vw
  const dur = 6 + Math.random() * 8; // seconds
  const size = 14 + Math.random() * 18;

  heart.style.left = left + 'vw';
  heart.style.animationDuration = dur + 's';
  heart.style.fontSize = size + 'px';

  container.appendChild(heart);
  setTimeout(() => heart.remove(), (dur + 0.2) * 1000);
}

function setupNoButton() {
  const noBtn = document.getElementById('no');
  const card = document.querySelector('.card');
  if (!noBtn || !card) return;

  noBtn.style.position = 'absolute';
  noBtn.style.zIndex = '9999';

  const scale = 1.5; // 👈 this controls how far it can escape
  const pad = 10;

  function move() {
    const rect = card.getBoundingClientRect();

    // Center of card
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    // Expanded movement zone
    const zoneWidth = rect.width * scale;
    const zoneHeight = rect.height * scale;

    const minX = centerX - zoneWidth / 2;
    const maxX = centerX + zoneWidth / 2 - noBtn.offsetWidth;
    const minY = centerY - zoneHeight / 2;
    const maxY = centerY + zoneHeight / 2 - noBtn.offsetHeight;

    const x = minX + Math.random() * (maxX - minX);
    const y = minY + Math.random() * (maxY - minY);

    noBtn.style.left = x + 'px';
    noBtn.style.top = y + 'px';
  }

  // Starting position (relative to viewport)
  const rect = card.getBoundingClientRect();
  noBtn.style.left = rect.left + rect.width * 0.6 + 'px';
  noBtn.style.top = rect.top + rect.height * 0.7 + 'px';

  noBtn.addEventListener('mouseover', move);
  noBtn.addEventListener('click', move);
}

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

  const mem = window.MEMORY;
  if (!mem || !mem.photos || mem.photos.length === 0) return;

  let i = 0;

  function render() {
    stageImg.src = mem.photos[i].src;
    stageImg.alt = mem.photos[i].alt || mem.title || 'Memory photo';

    if (titleEl) titleEl.textContent = mem.title || 'Memory';
    if (captionEl) captionEl.textContent = mem.photos[i].caption || '';
    if (counterEl) counterEl.textContent = `Photo ${i + 1} of ${mem.photos.length}`;

    if (prevPhotoBtn) prevPhotoBtn.disabled = (i === 0);
    if (nextPhotoBtn) nextPhotoBtn.disabled = (i === mem.photos.length - 1);

    const isLast = (i === mem.photos.length - 1);
    if (prevMemoryLink) prevMemoryLink.style.display = isLast ? 'inline-flex' : 'none';
    if (nextMemoryLink) nextMemoryLink.style.display = isLast ? 'inline-flex' : 'none';
    if (homeLink) homeLink.style.display = isLast ? 'inline-flex' : 'none';
  }

  function prev() {
    if (i > 0) {
      i--;
      render();
    }
  }

  function next() {
    if (i < mem.photos.length - 1) {
      i++;
      render();
    }
  }

  if (prevPhotoBtn) prevPhotoBtn.addEventListener('click', prev);
  if (nextPhotoBtn) nextPhotoBtn.addEventListener('click', next);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') prev();
    if (e.key === 'ArrowRight') next();
  });

  render();
}

document.addEventListener('DOMContentLoaded', () => {
  spawnHearts();
  setupNoButton();
  setupMemorySlideshow();
});
