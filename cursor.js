(() => {
  // Read the accent color from the design tokens already loaded in the page.
  const COLOR = getComputedStyle(document.documentElement)
    .getPropertyValue('--accent-primary').trim() || '#3C873A';

  const TRAIL   = 10;   // number of trail nodes
  const LERP    = 0.32; // how eagerly each node chases the one before it
  const DOT_R   = 3.5;  // half-size of the main dot (px)

  // Suppress the native cursor everywhere in the page.
  const noNative = document.createElement('style');
  noNative.textContent = '*, *::before, *::after { cursor: none !important; }';
  document.head.appendChild(noNative);

  // ── Main dot ──────────────────────────────────────────────────────────────
  const dot = document.createElement('div');
  dot.style.cssText = [
    'position:fixed', 'top:0', 'left:0',
    `width:${DOT_R * 2}px`, `height:${DOT_R * 2}px`,
    'border-radius:50%',
    `background:${COLOR}`,
    `box-shadow:0 0 0 2px rgba(60,135,58,0.18),0 1px 5px rgba(60,135,58,0.20)`,
    'pointer-events:none',
    `z-index:2147483647`,
    'will-change:transform',
    'opacity:0',
    'transition:opacity 180ms ease',
  ].join(';');

  // ── Trail dots (0 = nearest cursor, TRAIL-1 = farthest) ──────────────────
  const trail = Array.from({ length: TRAIL }, (_, i) => {
    const t    = (i + 1) / TRAIL;                      // 0 → 1
    const size = Math.max(1, Math.round(5 - t * 4));   // 5px → 1px
    const op   = (1 - t) * 0.30 + 0.03;               // 0.33 → 0.03
    const el   = document.createElement('div');
    el.style.cssText = [
      'position:fixed', 'top:0', 'left:0',
      `width:${size}px`, `height:${size}px`,
      'border-radius:50%',
      `background:${COLOR}`,
      `opacity:${op.toFixed(3)}`,
      'pointer-events:none',
      `z-index:${2147483646 - i}`,
      'will-change:transform',
    ].join(';');
    return { el, half: size / 2 };
  });

  document.body.append(dot, ...trail.map(t => t.el));

  // ── State ─────────────────────────────────────────────────────────────────
  // pos[0] = mouse position; pos[1..TRAIL] = interpolated trail nodes
  const pos = Array.from({ length: TRAIL + 1 }, () => ({ x: -500, y: -500 }));
  let mx = -500, my = -500;

  document.addEventListener('mousemove', e => {
    mx = e.clientX;
    my = e.clientY;
    dot.style.opacity = '0.6';
  });
  document.addEventListener('mouseleave', () => { dot.style.opacity = '0'; });
  document.addEventListener('mouseenter', () => { dot.style.opacity = '0.6'; });

  // ── Animation loop ────────────────────────────────────────────────────────
  function frame() {
    pos[0].x = mx;
    pos[0].y = my;

    for (let i = 1; i <= TRAIL; i++) {
      pos[i].x += (pos[i - 1].x - pos[i].x) * LERP;
      pos[i].y += (pos[i - 1].y - pos[i].y) * LERP;
    }

    dot.style.transform =
      `translate(${pos[0].x - DOT_R}px,${pos[0].y - DOT_R}px)`;

    for (let i = 0; i < TRAIL; i++) {
      const { el, half } = trail[i];
      el.style.transform =
        `translate(${pos[i + 1].x - half}px,${pos[i + 1].y - half}px)`;
    }

    requestAnimationFrame(frame);
  }

  requestAnimationFrame(frame);
})();
