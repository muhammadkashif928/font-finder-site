/* ============================================================
   How It Works — 3-step section (updated styling)
   ============================================================ */

const STEPS = [
  {
    icon: 'fa-cloud-upload-alt',
    step: '01',
    title: 'Upload or Drop',
    desc: 'Drop any image anywhere on the page, click to upload, or paste a public image URL. Works with JPG, PNG, GIF, and WebP.',
    detail: 'Screenshots · Logos · Photos · Product packaging · Ads',
  },
  {
    icon: 'fa-microchip',
    step: '02',
    title: 'AI Scans Letterforms',
    desc: 'Our engine extracts glyphs from the image and compares them against a database of 900,000+ fonts using advanced image recognition.',
    detail: 'Typically completes in 3–8 seconds',
  },
  {
    icon: 'fa-list-check',
    step: '03',
    title: 'Get Ranked Results',
    desc: 'See the top ranked font matches with live previews, confidence scores, licensing info, and free look-alike alternatives — all inside FontFinder.',
    detail: 'Up to 10 matches · Free alternatives · Buy links',
  },
];

export function render() {
  const steps = STEPS.map((s, i) => `
    <div class="how-step anim-up" style="transition-delay:${i * 0.15}s">
      <div class="how-step__connector" aria-hidden="true">
        <div class="how-step__num">${s.step}</div>
        ${i < STEPS.length - 1 ? '<div class="how-step__line"></div>' : ''}
      </div>
      <div class="how-step__card">
        <div class="how-step__icon">
          <i class="fa ${s.icon}"></i>
        </div>
        <h3 class="how-step__title">${s.title}</h3>
        <p class="how-step__desc">${s.desc}</p>
        <p class="how-step__detail">${s.detail}</p>
      </div>
    </div>
  `).join('');

  return `
    <section class="how section" id="how-it-works">
      <div class="container">
        <div class="how__header">
          <p class="section-label">How It Works</p>
          <h2 class="heading-lg how__title">
            Three steps.<br><span class="grad-text">Zero effort.</span>
          </h2>
          <p class="how__sub">
            No learning curve. No configuration. Just upload and go.
          </p>
        </div>
        <div class="how__steps">
          ${steps}
        </div>
        <div class="how__cta-row">
          <label class="btn btn-primary btn-lg" for="file-input">
            <i class="fa fa-upload"></i>
            Try It Now — It's Free
          </label>
        </div>
      </div>
    </section>
  `;
}

export function init() {
  const els = document.querySelectorAll('.how-step.anim-up');
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); } });
  }, { threshold: 0.15 });
  els.forEach(el => obs.observe(el));
}
