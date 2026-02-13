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

function showToast(message, ms = 900) {
  const toast = document.getElementById('toast');
  if (!toast) return;

  toast.textContent = message;
  toast.classList.add('show');

  setTimeout(() => {
    toast.classList.remove('show');
  }, ms);
}

function setupYesClick() {
  const yesBtn = document.getElementById('yes');
  const overlay = document.getElementById('celebrate');
  if (!yesBtn || !overlay) return;

  yesBtn.addEventListener('click', (e) => {
    e.preventDefault();

    // Grow Yes slightly for dramatic effect
    yesBtn.style.transform = 'scale(3.2)';

    overlay.classList.add('show');

    setTimeout(() => {
      const href = yesBtn.getAttribute('href') || 'memories.html';
      window.location.href = href;
    }, 1300);
  });
}

function setupNoButton() {
  const noBtn = document.getElementById('no');
  const yesBtn = document.getElementById('yes');
  const card = document.querySelector('.card');

  if (!noBtn || !yesBtn || !card) return;

  // Ensure the No button can move anywhere in viewport coordinates
  noBtn.style.position = 'fixed';
  noBtn.style.zIndex = '9999';

  // YES growth + pulse settings
  let yesScale = 1;
  const maxScale = 3.0;
  const step = 0.20; // how fast it grows per "No" attempt

  // No text progression
  const noTexts = [
    'No 😅',
    'Really?',
    'Aki Baabe',
    'Woiye please?',
    'With a cherry on top?',
    'Pleeeeeease?'
  ];
  let noIndex = 0;

  function updateNoText() {
    if (noIndex < noTexts.length - 1) noIndex++;
    noBtn.textContent = noTexts[noIndex];
  }

  function growYes() {
    if (yesScale < maxScale) {
      yesScale = Math.min(maxScale, yesScale + step);

      // Use CSS var so pulse animation respects the final size
      yesBtn.style.setProperty('--yes-scale', yesScale.toString());

      // If we haven't started pulsing yet, still apply scale directly
      // (otherwise pulse animation will handle it)
      if (!yesBtn.classList.contains('pulse')) {
        yesBtn.style.transform = `scale(${yesScale})`;
      }

      if (yesScale >= maxScale) {
        // Lock at max and pulse around it
        yesBtn.classList.add('pulse');
        // Set base scale for animation
        yesBtn.style.setProperty('--yes-scale', maxScale.toString());
      }
    }
  }

  // Move zone: 1.5× card area, but ALSO clamped to visible viewport
  const zoneScale = 1.5;
  const edgePad = 10; // keep fully visible

  function moveNo() {
    const rect = card.getBoundingClientRect(); // viewport coords

    // Build the 1.5x zone around the card's center (viewport coords)
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const zoneW = rect.width * zoneScale;
    const zoneH = rect.height * zoneScale;

    let minX = centerX - zoneW / 2;
    let maxX = centerX + zoneW / 2 - noBtn.offsetWidth;
    let minY = centerY - zoneH / 2;
    let maxY = centerY + zoneH / 2 - noBtn.offsetHeight;

    // Clamp that zone to the visible viewport so it can’t disappear
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    minX = Math.max(minX, edgePad);
    minY = Math.max(minY, edgePad);
    maxX = Math.min(maxX, vw - noBtn.offsetWidth - edgePad);
    maxY = Math.min(maxY, vh - noBtn.offsetHeight - edgePad);

    // If something is tiny or weird, prevent NaN
    if (maxX <= minX) maxX = minX + 1;
    if (maxY <= minY) maxY = minY + 1;

    const x = minX + Math.random() * (maxX - minX);
    const y = minY + Math.random() * (maxY - minY);

    noBtn.style.left = `${x}px`;
    noBtn.style.top = `${y}px`;

    // UX effects on every dodge
    updateNoText();
    growYes();
  }

  // Start No near the Yes button so it’s visible
  const yesRect = yesBtn.getBoundingClientRect();
  noBtn.style.left = `${Math.min(window.innerWidth - noBtn.offsetWidth - edgePad, yesRect.left + 140)}px`;
  noBtn.style.top = `${Math.min(window.innerHeight - noBtn.offsetHeight - edgePad, yesRect.top + 10)}px`;

  // Dodge triggers
  noBtn.addEventListener('mouseover', moveNo);
  noBtn.addEventListener('click', moveNo);

  // Keep No visible on resize (rotation / address bar / etc.)
  window.addEventListener('resize', () => {
    const left = parseFloat(noBtn.style.left) || edgePad;
    const top = parseFloat(noBtn.style.top) || edgePad;

    const maxLeft = window.innerWidth - noBtn.offsetWidth - edgePad;
    const maxTop = window.innerHeight - noBtn.offsetHeight - edgePad;

    noBtn.style.left = `${Math.min(Math.max(left, edgePad), maxLeft)}px`;
    noBtn.style.top = `${Math.min(Math.max(top, edgePad), maxTop)}px`;
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
  setupYesClick();
  setupNoButton();
  setupMemorySlideshow();
});
