/* ============================================================
   Marquee — Scrolling trust band of font providers
   ============================================================ */

const BRANDS = [
  { name: 'Serif Fonts',       icon: 'fa-i-cursor' },
  { name: 'Sans-Serif',        icon: 'fa-font' },
  { name: 'Script & Cursive',  icon: 'fa-pen-nib' },
  { name: 'Display Fonts',     icon: 'fa-heading' },
  { name: 'Monospace',         icon: 'fa-code' },
  { name: 'Handwriting',       icon: 'fa-hand-writing' },
  { name: 'Variable Fonts',    icon: 'fa-sliders' },
  { name: 'Web Fonts',         icon: 'fa-globe' },
  { name: 'Logo Fonts',        icon: 'fa-star' },
  { name: 'Decorative',        icon: 'fa-wand-magic-sparkles' },
];

export function render() {
  const items = [...BRANDS, ...BRANDS].map(b => `
    <div class="marquee__item">
      <i class="fa ${b.icon} marquee__item-icon"></i>
      <span class="marquee__item-name">${b.name}</span>
    </div>
  `).join('');

  return `
    <div class="marquee-section">
      <p class="marquee__label">Font results linked to the world's best marketplaces</p>
      <div class="marquee" aria-hidden="true">
        <div class="marquee__track">
          ${items}
        </div>
      </div>
    </div>
  `;
}

export function init() {
  // Pause on hover
  const track = document.querySelector('.marquee__track');
  if (!track) return;
  const marquee = document.querySelector('.marquee');
  marquee.addEventListener('mouseenter', () => track.style.animationPlayState = 'paused');
  marquee.addEventListener('mouseleave', () => track.style.animationPlayState = 'running');
}
