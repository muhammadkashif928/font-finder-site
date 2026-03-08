/* ============================================================
   Guides Page
   ============================================================ */

const GUIDES = [
  {
    slug: 'how-to-identify-a-font',
    category: 'Tutorial',
    title: 'How to Identify a Font from Any Image',
    excerpt: 'Step-by-step guide to getting accurate font matches from logos, screenshots, photos, and packaging using FontFinder.',
    readTime: '4 min read',
    icon: 'fa-magnifying-glass',
    color: '#818cf8',
    bg: 'rgba(99,102,241,0.1)',
  },
  {
    slug: 'serif-vs-sans-serif',
    category: 'Typography 101',
    title: 'Serif vs Sans-Serif: When to Use Which',
    excerpt: 'Learn the fundamental difference between serif and sans-serif fonts and the golden rules for choosing the right style for your project.',
    readTime: '6 min read',
    icon: 'fa-book-open',
    color: '#67e8f9',
    bg: 'rgba(34,211,238,0.1)',
  },
  {
    slug: 'font-pairing-guide',
    category: 'Design',
    title: 'The Complete Font Pairing Guide for Designers',
    excerpt: 'Master font pairing with proven techniques: contrast principles, superfamilies, mood matching, and 12 ready-to-use combinations.',
    readTime: '8 min read',
    icon: 'fa-layer-group',
    color: '#f9a8d4',
    bg: 'rgba(244,114,182,0.1)',
    featured: true,
  },
  {
    slug: 'best-fonts-for-logos',
    category: 'Branding',
    title: 'Best Fonts for Logo Design in 2025',
    excerpt: 'The top 20 fonts used by world-class logo designers, with examples from global brands and tips on why they work.',
    readTime: '7 min read',
    icon: 'fa-star',
    color: '#fcd34d',
    bg: 'rgba(251,191,36,0.1)',
  },
  {
    slug: 'web-fonts-performance',
    category: 'Web Design',
    title: 'Web Font Performance: Load Fonts Without Slowing Your Site',
    excerpt: 'Techniques to load web fonts fast — font-display, preconnect, subset loading, and variable fonts for minimal performance impact.',
    readTime: '5 min read',
    icon: 'fa-bolt',
    color: '#6ee7b7',
    bg: 'rgba(52,211,153,0.1)',
  },
  {
    slug: 'variable-fonts-explained',
    category: 'Advanced',
    title: 'Variable Fonts Explained: One File, Infinite Styles',
    excerpt: 'What variable fonts are, how they work, which axes you can control, and when to use them over static fonts.',
    readTime: '6 min read',
    icon: 'fa-sliders',
    color: '#c4b5fd',
    bg: 'rgba(168,85,247,0.1)',
  },
  {
    slug: 'font-licensing-guide',
    category: 'Legal',
    title: 'Font Licensing Explained: Free, OFL, Commercial & Web',
    excerpt: 'Understand the different types of font licenses — SIL OFL, freeware, desktop, web, app, and ebook — before you use any font commercially.',
    readTime: '5 min read',
    icon: 'fa-shield',
    color: '#fdba74',
    bg: 'rgba(249,115,22,0.1)',
  },
  {
    slug: 'identify-font-from-logo',
    category: 'Tutorial',
    title: 'How to Identify a Font Used in a Brand Logo',
    excerpt: 'Tips for getting accurate results from logo images: crop technique, contrast adjustment, and what to do when results differ.',
    readTime: '4 min read',
    icon: 'fa-crop',
    color: '#818cf8',
    bg: 'rgba(99,102,241,0.1)',
  },
  {
    slug: 'google-fonts-alternatives',
    category: 'Resources',
    title: 'Best Free Font Alternatives to Popular Paid Fonts',
    excerpt: 'A curated list of the best free look-alike fonts available in our database — matching the style of well-known typefaces without the price tag.',
    readTime: '6 min read',
    icon: 'fa-wand-magic-sparkles',
    color: '#6ee7b7',
    bg: 'rgba(52,211,153,0.1)',
  },
];

export function render() {
  const featured = GUIDES.find(g => g.featured);
  const rest     = GUIDES.filter(g => !g.featured);

  return `
    <section class="inner-page guides-page">

      <!-- Hero -->
      <div class="inner-hero">
        <div class="inner-hero__blob inner-hero__blob--1"></div>
        <div class="inner-hero__blob inner-hero__blob--2"></div>
        <div class="container inner-hero__inner">
          <div class="inner-hero__badge">
            <i class="fa fa-book-open"></i>
            Font Guides
          </div>
          <h1 class="inner-hero__title">Learn Typography.<br><span class="grad-text">Design Better.</span></h1>
          <p class="inner-hero__sub">
            In-depth guides on font identification, pairing, licensing, and web performance.
            Written for designers, developers, and brand builders.
          </p>
        </div>
      </div>

      <div class="container inner-content">

        <!-- Featured -->
        ${featured ? `
          <div class="guides-featured anim-up">
            <div class="guides-featured__icon" style="background:${featured.bg};color:${featured.color}">
              <i class="fa ${featured.icon}"></i>
            </div>
            <div class="guides-featured__body">
              <span class="guides-featured__cat">${featured.category}</span>
              <h2 class="guides-featured__title">${featured.title}</h2>
              <p class="guides-featured__excerpt">${featured.excerpt}</p>
              <div class="guides-featured__foot">
                <span class="guides-featured__read"><i class="fa fa-clock"></i> ${featured.readTime}</span>
                <a href="/guides/${featured.slug}" class="guides-featured__link">
                  Read Guide <i class="fa fa-arrow-right"></i>
                </a>
              </div>
            </div>
          </div>
        ` : ''}

        <!-- Grid -->
        <div class="guides-grid">
          ${rest.map((g, i) => `
            <a href="/guides/${g.slug}" class="guide-card anim-up" style="transition-delay:${(i % 3) * 0.07}s">
              <div class="guide-card__icon" style="background:${g.bg};color:${g.color}">
                <i class="fa ${g.icon}"></i>
              </div>
              <span class="guide-card__cat">${g.category}</span>
              <h3 class="guide-card__title">${g.title}</h3>
              <p class="guide-card__excerpt">${g.excerpt}</p>
              <div class="guide-card__foot">
                <span class="guide-card__read"><i class="fa fa-clock"></i> ${g.readTime}</span>
                <span class="guide-card__arrow"><i class="fa fa-arrow-right"></i></span>
              </div>
            </a>
          `).join('')}
        </div>

      </div>
    </section>
  `;
}

export function init() {
  // Animations handled by page-layout.js mountLayout()
}
