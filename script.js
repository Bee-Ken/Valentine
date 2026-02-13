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
