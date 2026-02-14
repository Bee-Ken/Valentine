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

  // YES growth + pulse settings
  let yesScale = 1;
  const maxScale = 3.0;
  const step = 0.20;

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

      // Set CSS variable for pulse to use
      yesBtn.style.setProperty('--yes-scale', yesScale.toString());

      if (!yesBtn.classList.contains('pulse')) {
        yesBtn.style.transform = `scale(${yesScale})`;
      }

      if (yesScale >= maxScale) {
        yesBtn.classList.add('pulse');
        yesBtn.style.setProperty('--yes-scale', maxScale.toString());
      }
    }
  }

  // Movement bounds
  const zoneScale = 1.5; // <- your rule
  const edgePad = 10;

  // Phase switch: starts normal, becomes "runner" only after interaction
  let activeRunner = false;

  function activateRunnerAtCurrentSpot() {
    if (activeRunner) return;

    // Capture current on-screen position BEFORE taking it out of layout
    const r = noBtn.getBoundingClientRect();

    activeRunner = true;
    noBtn.style.position = 'fixed';
    noBtn.style.zIndex = '9999';
    noBtn.style.left = `${r.left}px`;
    noBtn.style.top = `${r.top}px`;
  }

  function moveNo() {
    // Ensure it starts as a normal button, then becomes runner on first attempt
    activateRunnerAtCurrentSpot();

    const rect = card.getBoundingClientRect(); // viewport coords
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const zoneW = rect.width * zoneScale;
    const zoneH = rect.height * zoneScale;

    let minX = centerX - zoneW / 2;
    let maxX = centerX + zoneW / 2 - noBtn.offsetWidth;
    let minY = centerY - zoneH / 2;
    let maxY = centerY + zoneH / 2 - noBtn.offsetHeight;

    // Clamp the entire allowed zone to the visible viewport
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    minX = Math.max(minX, edgePad);
    minY = Math.max(minY, edgePad);
    maxX = Math.min(maxX, vw - noBtn.offsetWidth - edgePad);
    maxY = Math.min(maxY, vh - noBtn.offsetHeight - edgePad);

    if (maxX <= minX) maxX = minX + 1;
    if (maxY <= minY) maxY = minY + 1;

    const x = minX + Math.random() * (maxX - minX);
    const y = minY + Math.random() * (maxY - minY);

    noBtn.style.left = `${x}px`;
    noBtn.style.top = `${y}px`;

    updateNoText();
    growYes();
  }

  // Triggers (this keeps it normal until she tries it)
  noBtn.addEventListener('mouseover', moveNo);
  noBtn.addEventListener('click', moveNo);

  // If the viewport changes after it's active, keep it visible (not required, but safe)
  window.addEventListener('resize', () => {
    if (!activeRunner) return;

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
    if (captionEl) captionEl.innerHTML = mem.photos[i].caption || '';
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
