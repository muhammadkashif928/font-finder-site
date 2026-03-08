/* ============================================================
   Blog Page — 10 Articles
   ============================================================ */

const POSTS = [
  // ── FEATURED ──────────────────────────────────────────────
  {
    slug: 'trending-fonts-2025',
    category: 'Trends',
    title: 'The Most Popular Fonts of 2025',
    excerpt: 'We analysed millions of font identifications to find which fonts designers are using most — the results might surprise you.',
    date: 'March 2025',
    readTime: '5 min read',
    icon: 'fa-chart-line',
    color: '#818cf8',
    bg: 'rgba(99,102,241,0.1)',
    featured: true,
  },

  // ── TECHNICAL PIPELINE SERIES ─────────────────────────────
  {
    slug: 'how-fontfinder-preprocesses-images',
    category: 'Behind the Tech',
    title: 'How FontFinder Cleans Your Image Before the AI Sees It',
    excerpt: 'Real-world photos are messy — blurry, crooked, noisy. Before our AI identifies a single font, a 4-step OpenCV pipeline strips away everything that isn\'t pure letterform. Here\'s exactly how it works.',
    date: 'March 2025',
    readTime: '7 min read',
    icon: 'fa-wand-magic-sparkles',
    color: '#67e8f9',
    bg: 'rgba(34,211,238,0.1)',
    featured: false,
  },
  {
    slug: 'otsu-thresholding-explained',
    category: 'Behind the Tech',
    title: 'Otsu\'s Thresholding: How We Perfectly Separate Text from Any Background',
    excerpt: 'Most font recognition fails because of messy backgrounds — gradients, textures, shadows. We use Otsu\'s algorithm, a Nobel-level insight from 1979, to binarise any image into pure black-and-white with zero manual tuning.',
    date: 'Feb 2025',
    readTime: '6 min read',
    icon: 'fa-circle-half-stroke',
    color: '#c4b5fd',
    bg: 'rgba(168,85,247,0.1)',
    featured: false,
  },
  {
    slug: 'deskewing-crooked-text',
    category: 'Behind the Tech',
    title: 'Deskewing: How Our AI Mathematically Straightens Crooked Text',
    excerpt: 'A photo taken at even a 3° angle can throw off font detection entirely. We use the Hough Line Transform to detect the exact rotation angle and correct it in milliseconds — here\'s the maths behind it.',
    date: 'Feb 2025',
    readTime: '8 min read',
    icon: 'fa-rotate',
    color: '#fcd34d',
    bg: 'rgba(251,191,36,0.1)',
    featured: false,
  },
  {
    slug: 'bounding-box-cropping',
    category: 'Behind the Tech',
    title: 'Smart Cropping: How FontFinder Isolates the Right Text from Background Noise',
    excerpt: 'Logos have icons. Screenshots have UI chrome. Packaging has images. Our bounding box engine uses morphological dilation and contour detection to find and crop just the text — automatically, every time.',
    date: 'Jan 2025',
    readTime: '6 min read',
    icon: 'fa-crop',
    color: '#6ee7b7',
    bg: 'rgba(52,211,153,0.1)',
    featured: false,
  },

  // ── GENERAL FONT CONTENT ──────────────────────────────────
  {
    slug: 'what-font-is-that-logo',
    category: 'Inspiration',
    title: 'We Identified the Fonts Behind 50 Famous Logos',
    excerpt: 'From Apple to Zara — we put the world\'s most recognisable brand logos through FontFinder and reveal exactly what typefaces they use.',
    date: 'Feb 2025',
    readTime: '8 min read',
    icon: 'fa-building',
    color: '#f9a8d4',
    bg: 'rgba(244,114,182,0.1)',
    featured: false,
  },
  {
    slug: 'bricolage-grotesque-review',
    category: 'Font Review',
    title: 'Bricolage Grotesque: The Display Font Everyone\'s Using Right Now',
    excerpt: 'Why this variable grotesque became the headline font of choice for SaaS startups, agencies, and creative studios in 2025.',
    date: 'Jan 2025',
    readTime: '4 min read',
    icon: 'fa-heading',
    color: '#fdba74',
    bg: 'rgba(249,115,22,0.1)',
    featured: false,
  },
  {
    slug: 'font-trends-ai',
    category: 'Industry',
    title: 'How AI is Changing Font Identification Forever',
    excerpt: 'The technology behind modern font recognition engines — from feature extraction to neural networks — and what it means for designers.',
    date: 'Dec 2024',
    readTime: '6 min read',
    icon: 'fa-robot',
    color: '#818cf8',
    bg: 'rgba(99,102,241,0.1)',
    featured: false,
  },
  {
    slug: 'best-monospace-fonts-2025',
    category: 'Roundup',
    title: 'The 10 Best Monospace Fonts for Developers in 2025',
    excerpt: 'JetBrains Mono, Fira Code, Recursive — ranked and compared by readability, ligature support, and overall coding experience.',
    date: 'Nov 2024',
    readTime: '5 min read',
    icon: 'fa-code',
    color: '#67e8f9',
    bg: 'rgba(34,211,238,0.1)',
    featured: false,
  },
  {
    slug: 'font-pairing-saas',
    category: 'Design',
    title: 'Font Pairings Used by the Top 20 SaaS Companies',
    excerpt: 'Linear, Vercel, Notion, Figma — we analysed the typography of the world\'s most admired software products.',
    date: 'Oct 2024',
    readTime: '7 min read',
    icon: 'fa-layer-group',
    color: '#6ee7b7',
    bg: 'rgba(52,211,153,0.1)',
    featured: false,
  },
];

export function render() {
  const featured = POSTS.find(p => p.featured);
  const rest     = POSTS.filter(p => !p.featured);

  return `
    <section class="inner-page blog-page">

      <!-- Hero -->
      <div class="inner-hero">
        <div class="inner-hero__blob inner-hero__blob--1"></div>
        <div class="inner-hero__blob inner-hero__blob--2"></div>
        <div class="container inner-hero__inner">
          <div class="inner-hero__badge">
            <i class="fa fa-rss"></i>
            Font Blog
          </div>
          <h1 class="inner-hero__title">Type. Design. <span class="grad-text">Inspiration.</span></h1>
          <p class="inner-hero__sub">
            Font trends, designer breakdowns, behind-the-tech deep-dives,
            and practical typography tips — all in one place.
          </p>
          <div class="blog-hero-stats">
            <span class="blog-hero-stat"><i class="fa fa-file-lines"></i> ${POSTS.length} articles</span>
            <span class="blog-hero-stat-sep">·</span>
            <span class="blog-hero-stat"><i class="fa fa-tags"></i> Trends · Tech · Design · Roundups</span>
          </div>
        </div>
      </div>

      <div class="container inner-content">

        <!-- Featured post -->
        ${featured ? `
          <div class="blog-featured anim-up">
            <div class="blog-featured__icon" style="background:${featured.bg};color:${featured.color}">
              <i class="fa ${featured.icon}"></i>
            </div>
            <div class="blog-featured__body">
              <div class="blog-featured__meta">
                <span class="blog-featured__cat">${featured.category}</span>
                <span class="blog-featured__dot">·</span>
                <span class="blog-featured__date">${featured.date}</span>
                <span class="blog-featured__dot">·</span>
                <span class="blog-featured__read"><i class="fa fa-clock"></i> ${featured.readTime}</span>
              </div>
              <h2 class="blog-featured__title">${featured.title}</h2>
              <p class="blog-featured__excerpt">${featured.excerpt}</p>
              <a href="/blog/${featured.slug}" class="blog-featured__link">
                Read Article <i class="fa fa-arrow-right"></i>
              </a>
            </div>
          </div>
        ` : ''}

        <!-- Tech series callout -->
        <div class="blog-series-banner anim-up">
          <div class="blog-series-banner__icon">
            <i class="fa fa-microchip"></i>
          </div>
          <div class="blog-series-banner__body">
            <p class="blog-series-banner__label">NEW SERIES</p>
            <p class="blog-series-banner__title">Behind the Tech — How FontFinder Works</p>
            <p class="blog-series-banner__sub">4-part deep-dive into the OpenCV + AI pipeline that cleans and identifies fonts from any image</p>
          </div>
          <div class="blog-series-banner__steps">
            <span class="blog-series-step blog-series-step--done">
              <i class="fa fa-check"></i> Preprocessing
            </span>
            <span class="blog-series-step blog-series-step--done">
              <i class="fa fa-check"></i> Otsu Binarization
            </span>
            <span class="blog-series-step blog-series-step--done">
              <i class="fa fa-check"></i> Deskewing
            </span>
            <span class="blog-series-step blog-series-step--done">
              <i class="fa fa-check"></i> Smart Cropping
            </span>
          </div>
        </div>

        <!-- Post grid -->
        <div class="blog-grid">
          ${rest.map((p, i) => `
            <a href="/blog/${p.slug}"
               class="blog-card anim-up ${p.category === 'Behind the Tech' ? 'blog-card--tech' : ''}"
               style="transition-delay:${(i % 3) * 0.06}s">

              ${p.category === 'Behind the Tech' ? `<div class="blog-card__series-badge"><i class="fa fa-microchip"></i> Behind the Tech</div>` : ''}

              <div class="blog-card__icon" style="background:${p.bg};color:${p.color}">
                <i class="fa ${p.icon}"></i>
              </div>
              <div class="blog-card__meta">
                <span class="blog-card__cat">${p.category}</span>
                <span class="blog-card__dot">·</span>
                <span class="blog-card__date">${p.date}</span>
              </div>
              <h3 class="blog-card__title">${p.title}</h3>
              <p class="blog-card__excerpt">${p.excerpt}</p>
              <div class="blog-card__foot">
                <span class="blog-card__read"><i class="fa fa-clock"></i> ${p.readTime}</span>
                <span class="blog-card__arrow"><i class="fa fa-arrow-right"></i></span>
              </div>
            </a>
          `).join('')}
        </div>

        <!-- Newsletter CTA -->
        <div class="blog-newsletter anim-up">
          <i class="fa fa-envelope blog-newsletter__icon"></i>
          <div class="blog-newsletter__body">
            <p class="blog-newsletter__title">Font tips in your inbox</p>
            <p class="blog-newsletter__sub">No spam. Useful typography content, once or twice a month.</p>
          </div>
          <div class="blog-newsletter__form">
            <input
              type="email"
              class="blog-newsletter__input"
              id="newsletter-email"
              placeholder="you@example.com"
              aria-label="Your email address"
            />
            <button class="blog-newsletter__btn" id="newsletter-btn">Subscribe</button>
          </div>
        </div>

      </div>
    </section>
  `;
}

export function init() {
  document.getElementById('newsletter-btn')?.addEventListener('click', function () {
    const input = document.getElementById('newsletter-email');
    if (!input?.value.includes('@')) {
      alert('Please enter a valid email address.');
      return;
    }
    this.textContent  = '✓ Subscribed!';
    this.style.background = 'rgba(52,211,153,0.2)';
    this.style.color  = '#34d399';
    this.style.border = '1px solid rgba(52,211,153,0.3)';
    input.value       = '';
    input.disabled    = true;
    this.disabled     = true;
  });
}
