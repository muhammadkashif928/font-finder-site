/* ============================================================
   CTA Banner — Bottom "Let's identify" section (Windsurf-style)
   ============================================================ */

export function render() {
  return `
    <section class="cta-banner" id="cta">
      <div class="glow-blob cta__blob-1"></div>
      <div class="glow-blob cta__blob-2"></div>
      <div class="container-sm cta-banner__inner">
        <div class="cta-banner__tag">[ Let's identify ]</div>
        <h2 class="heading-xl cta-banner__title">
          Find your font.<br>
          <span class="grad-text">Right now.</span>
        </h2>
        <p class="cta-banner__sub">
          Upload any image and get the font name, purchase links, and free
          alternatives — in under 10 seconds. No signup. No cost. Ever.
        </p>
        <div class="cta-banner__actions">
          <label class="btn btn-primary btn-lg" for="file-input">
            <i class="fa fa-upload"></i>
            Upload an Image
          </label>
          <a href="#how-it-works" class="btn btn-ghost btn-lg">
            <i class="fa fa-info-circle"></i>
            Learn More
          </a>
        </div>
        <p class="cta-banner__note">
          <i class="fa fa-check-circle"></i> Free forever &nbsp;·&nbsp;
          <i class="fa fa-check-circle"></i> No account needed &nbsp;·&nbsp;
          <i class="fa fa-check-circle"></i> 900K+ fonts
        </p>
      </div>
    </section>
  `;
}

export function init() {
  // Intersection observer for entrance animation
  const banner = document.querySelector('.cta-banner__inner');
  if (!banner) return;
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { banner.classList.add('visible'); obs.unobserve(banner); } });
  }, { threshold: 0.25 });
  obs.observe(banner);
}
