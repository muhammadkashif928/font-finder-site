/* ============================================================
   Features — "One image. Unlimited discoveries." grid
   ============================================================ */

const FEATURES = [
  { icon: 'fa-bolt',              bg: 'rgba(129,140,248,0.12)', border: 'rgba(129,140,248,0.25)', color: '#818cf8', title: 'Instant Detection',  desc: 'Font results in 3–8 seconds. Our engine compares letterforms against 900,000+ fonts at lightning speed.', tag: null },
  { icon: 'fa-layer-group',       bg: 'rgba(192,132,252,0.12)', border: 'rgba(192,132,252,0.25)', color: '#c084fc', title: 'Multiple Results',   desc: 'Get up to 10 ranked matches per image, ordered by confidence so you always find the right one.', tag: null },
  { icon: 'fa-wand-magic-sparkles', bg: 'rgba(52,211,153,0.12)',  border: 'rgba(52,211,153,0.25)',  color: '#34d399', title: 'Free Alternatives',  desc: 'Every result shows free look-alike fonts from our own curated library — same style, zero cost.', tag: 'Free' },
  { icon: 'fa-tags',                bg: 'rgba(251,191,36,0.12)',  border: 'rgba(251,191,36,0.25)',  color: '#fbbf24', title: 'Font Details',       desc: 'See licensing info, font weight variants, category tags, and designer info — all in one place.', tag: null },
  { icon: 'fa-link',              bg: 'rgba(34,211,238,0.12)',  border: 'rgba(34,211,238,0.25)',  color: '#22d3ee', title: 'URL Support',       desc: 'Paste any public image URL and identify the font directly from the web — no download needed.', tag: null },
  { icon: 'fa-cloud-upload-alt',  bg: 'rgba(248,113,113,0.12)', border: 'rgba(248,113,113,0.25)', color: '#f87171', title: 'Drag & Drop',       desc: 'Drop an image anywhere on the page — our global drop zone catches it instantly.', tag: null },
  { icon: 'fa-mobile-alt',        bg: 'rgba(129,140,248,0.12)', border: 'rgba(129,140,248,0.25)', color: '#818cf8', title: 'Mobile Friendly',   desc: 'Fully responsive on phones and tablets. Take a photo and identify fonts on the go.', tag: null },
  { icon: 'fa-shield-alt',        bg: 'rgba(52,211,153,0.12)',  border: 'rgba(52,211,153,0.25)',  color: '#34d399', title: 'Privacy First',     desc: 'Images processed in memory and discarded immediately. We never store your files.', tag: 'Secure' },
  { icon: 'fa-infinity',          bg: 'rgba(192,132,252,0.12)', border: 'rgba(192,132,252,0.25)', color: '#c084fc', title: '100% Free',         desc: 'No account. No subscription. No limits. FontFinder is completely free, forever.', tag: 'Free' },
];

export function render() {
  const cards = FEATURES.map((f, i) => `
    <div class="feat-card anim-up" style="transition-delay:${(i % 3) * 0.08}s">
      <div class="feat-card__icon" style="background:${f.bg};border:1px solid ${f.border};color:${f.color}">
        <i class="fa ${f.icon}"></i>
      </div>
      <div class="feat-card__body">
        <div class="feat-card__title-row">
          <h3 class="feat-card__title">${f.title}</h3>
          ${f.tag ? `<span class="badge badge-free">${f.tag}</span>` : ''}
        </div>
        <p class="feat-card__desc">${f.desc}</p>
      </div>
    </div>
  `).join('');

  return `
    <section class="features section" id="features">
      <div class="container">
        <div class="features__header">
          <p class="section-label">Features</p>
          <h2 class="heading-lg features__title">
            One image.<br><span class="grad-text">Unlimited discoveries.</span>
          </h2>
          <p class="features__sub">
            Everything you need to find, buy, or match any font — in one free tool.
          </p>
        </div>
        <div class="features__grid">
          ${cards}
        </div>
      </div>
    </section>
  `;
}

export function init() {
  const els = document.querySelectorAll('.feat-card.anim-up');
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); } });
  }, { threshold: 0.12 });
  els.forEach(el => obs.observe(el));
}
