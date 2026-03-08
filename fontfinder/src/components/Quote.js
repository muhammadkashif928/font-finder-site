/* ============================================================
   Quote — Large pull quote (Windsurf Garry Tan style)
   ============================================================ */

export function render() {
  return `
    <section class="quote-section">
      <div class="glow-blob quote__blob-1"></div>
      <div class="glow-blob quote__blob-2"></div>
      <div class="container-sm">
        <div class="quote-card anim-up">
          <div class="quote-card__mark">"</div>
          <blockquote class="quote-card__text">
            I used to spend hours reverse-engineering fonts from brand guidelines.
            Now I just drop the logo in FontFinder and have the answer in seconds.
            It changed how I work.
          </blockquote>
          <div class="quote-card__author">
            <div class="quote-card__avatar">
              <i class="fa fa-user"></i>
            </div>
            <div>
              <p class="quote-card__name">Sarah K.</p>
              <p class="quote-card__role">Senior Brand Designer, NYC</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  `;
}

export function init() {
  const el = document.querySelector('.quote-card.anim-up');
  if (!el) return;
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); } });
  }, { threshold: 0.3 });
  obs.observe(el);
}
