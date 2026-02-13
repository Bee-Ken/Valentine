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
  if (!noBtn) return;

  // Make it move relative to the visible screen
  noBtn.style.position = 'fixed';
  noBtn.style.zIndex = '9999';

  const pad = 16; // how far from edges it must stay

  function move() {
    // Use visualViewport when available (better on mobile)
    const vv = window.visualViewport;
    const vw = vv ? vv.width : window.innerWidth;
    const vh = vv ? vv.height : window.innerHeight;
    const ox = vv ? vv.offsetLeft : 0;
    const oy = vv ? vv.offsetTop : 0;

    const maxX = Math.max(pad, vw - noBtn.offsetWidth - pad);
    const maxY = Math.max(pad, vh - noBtn.offsetHeight - pad);

    const x = ox + pad + Math.random() * (maxX - pad);
    const y = oy + pad + Math.random() * (maxY - pad);

    noBtn.style.left = `${x}px`;
    noBtn.style.top = `${y}px`;
  }

  // Start somewhere visible
  noBtn.style.left = '60vw';
  noBtn.style.top = '65vh';

  noBtn.addEventListener('mouseover', move);
  noBtn.addEventListener('click', move);

  // If screen resizes (rotation, address bar changes), keep it visible
  window.addEventListener('resize', () => {
    // Clamp current position back into bounds
    const vv = window.visualViewport;
    const vw = vv ? vv.width : window.innerWidth;
    const vh = vv ? vv.height : window.innerHeight;
    const ox = vv ? vv.offsetLeft : 0;
    const oy = vv ? vv.offsetTop : 0;

    const left = parseFloat(noBtn.style.left) || ox + vw * 0.6;
    const top = parseFloat(noBtn.style.top) || oy + vh * 0.65;

    const minX = ox + pad;
    const minY = oy + pad;
    const maxX = ox + vw - noBtn.offsetWidth - pad;
    const maxY = oy + vh - noBtn.offsetHeight - pad;

    noBtn.style.left = `${Math.min(Math.max(left, minX), maxX)}px`;
    noBtn.style.top = `${Math.min(Math.max(top, minY), maxY)}px`;
  });
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
