/* ============================================================
   Stats — Big numbers section (Windsurf-style)
   ============================================================ */

const STATS = [
  { value: '900K+', label: 'Fonts in database', desc: 'The largest font detection library available, covering commercial, free, and rare typefaces.' },
  { value: '< 8s',  label: 'Average detection', desc: 'Lightning-fast results from upload to identified font, even on slower connections.' },
  { value: '100%',  label: 'Free forever',       desc: 'No trials, no paywalls, no limits. Font identification is and always will be free.' },
  { value: '50+',   label: 'Font categories',    desc: 'From serif to handwriting, display to monospace — every style is covered.' },
];

export function render() {
  const items = STATS.map((s, i) => `
    <div class="stat-card anim-up" style="transition-delay:${i * 0.1}s">
      <div class="stat-card__value grad-text">${s.value}</div>
      <div class="stat-card__label">${s.label}</div>
      <div class="stat-card__sep"></div>
      <p class="stat-card__desc">${s.desc}</p>
    </div>
  `).join('');

  return `
    <section class="stats section" id="stats">
      <div class="container">
        <div class="stats__header">
          <p class="section-label">By the Numbers</p>
          <h2 class="heading-lg stats__title">
            Trusted by Designers.<br><span class="grad-text">Proven by Results.</span>
          </h2>
        </div>
        <div class="stats__grid">
          ${items}
        </div>
      </div>
    </section>
  `;
}

export function init() {
  const els = document.querySelectorAll('.stat-card.anim-up');
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); } });
  }, { threshold: 0.2 });
  els.forEach(el => obs.observe(el));
}
