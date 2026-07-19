// Shared across all pages — scatters a sparse, delicate star field.
(function () {
  const layer = document.querySelector('.stars');
  if (!layer) return;
  const n = layer.dataset.density ? Number(layer.dataset.density) : 22;
  const keepClear = layer.hasAttribute('data-clear-center');

  for (let i = 0; i < n; i++) {
    const s = document.createElement('span');
    let x = Math.random() * 100, y = Math.random() * 100;
    if (keepClear && x > 32 && x < 68 && y > 28 && y < 75) {
      x = x < 50 ? x - 28 : x + 28;
    }
    const size = Math.random() * 1.6 + 1;
    s.style.left = x + '%';
    s.style.top = y + '%';
    s.style.width = size + 'px';
    s.style.height = size + 'px';
    s.style.animationDelay = (Math.random() * 5) + 's';
    s.style.opacity = (Math.random() * 0.5 + 0.2).toFixed(2);
    layer.appendChild(s);
  }
})();
