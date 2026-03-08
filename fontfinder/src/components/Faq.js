/* ============================================================
   FAQ — Accordion (updated design)
   ============================================================ */

const FAQS = [
  { q: 'Is FontFinder completely free?',          a: 'Yes, 100% free. No account, no subscription, no limits. Just upload and identify.' },
  { q: 'What image formats are supported?',       a: 'JPG, PNG, GIF, and WebP. Max file size is 4MB. For best results use a high-res image with clear, large text.' },
  { q: 'How accurate is the font detection?',     a: 'Extremely accurate for clean, high-contrast images. Crop tight around the text and ensure letterforms are at least 20–30px tall for best results.' },
  { q: 'Does it work on logos?',                  a: 'Yes — logos, product packaging, signage, ads, social media posts, and screenshots all work great.' },
  { q: 'Why was my font not detected?',           a: 'Very stylized, distorted, or rare fonts may not be in the database. Try cropping tighter, increasing contrast, or using a higher-resolution image.' },
  { q: 'Can I paste an image URL?',               a: 'Yes! Open the upload tool and paste any public image URL into the URL bar. Press Enter and we\'ll fetch and analyze it.' },
  { q: 'Are my images stored?',                   a: 'Never. Images are processed in memory only and discarded immediately after analysis. Your privacy is fully protected.' },
  { q: 'Can I use detected fonts commercially?',  a: 'That depends on the font\'s license. We clearly label "Free" vs "Commercial" fonts. Always verify the specific license before commercial use.' },
];

export function render() {
  const items = FAQS.map((f, i) => `
    <div class="faq-item" id="faq-item-${i}">
      <button
        class="faq-item__q"
        aria-expanded="false"
        aria-controls="faq-ans-${i}"
        id="faq-btn-${i}"
      >
        <span>${f.q}</span>
        <i class="fa fa-plus faq-item__icon" aria-hidden="true"></i>
      </button>
      <div
        class="faq-item__a"
        id="faq-ans-${i}"
        role="region"
        aria-labelledby="faq-btn-${i}"
        hidden
      >
        <p>${f.a}</p>
      </div>
    </div>
  `).join('');

  return `
    <section class="faq section" id="faq">
      <div class="container">
        <div class="faq__header">
          <p class="section-label">FAQ</p>
          <h2 class="heading-lg faq__title">
            Got questions?<br><span class="grad-text">We've got answers.</span>
          </h2>
        </div>
        <div class="faq__grid">
          <div class="faq__list">
            ${items}
          </div>
          <div class="faq__aside">
            <div class="faq__aside-card">
              <div class="faq__aside-icon"><i class="fa fa-circle-question"></i></div>
              <h3 class="faq__aside-title">Still have questions?</h3>
              <p class="faq__aside-desc">Can't find what you're looking for? Explore our guides or reach out — we're happy to help.</p>
              <div class="faq__aside-links">
                <a href="/guides" class="faq__aside-link">
                  <i class="fa fa-book-open"></i> Font Guides
                </a>
                <a href="/browse" class="faq__aside-link">
                  <i class="fa fa-table-cells"></i> Browse Fonts
                </a>
                <a href="/blog" class="faq__aside-link">
                  <i class="fa fa-rss"></i> Font Blog
                </a>
                <a href="/contact" class="faq__aside-link">
                  <i class="fa fa-envelope"></i> Contact Us
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  `;
}

export function init() {
  document.querySelectorAll('.faq-item__q').forEach(btn => {
    btn.addEventListener('click', () => {
      const expanded = btn.getAttribute('aria-expanded') === 'true';
      // Close all
      document.querySelectorAll('.faq-item__q').forEach(b => {
        b.setAttribute('aria-expanded', 'false');
        b.querySelector('.faq-item__icon').className = 'fa fa-plus faq-item__icon';
        const ans = document.getElementById(b.getAttribute('aria-controls'));
        ans?.setAttribute('hidden', '');
        b.closest('.faq-item').classList.remove('faq-item--open');
      });
      // Open this
      if (!expanded) {
        btn.setAttribute('aria-expanded', 'true');
        btn.querySelector('.faq-item__icon').className = 'fa fa-minus faq-item__icon';
        document.getElementById(btn.getAttribute('aria-controls'))?.removeAttribute('hidden');
        btn.closest('.faq-item').classList.add('faq-item--open');
      }
    });
  });
}
