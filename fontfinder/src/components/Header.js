/* ============================================================
   Header Component — Announcement bar + centered logo layout
   ============================================================ */

const ANNOUNCEMENTS = [
  '✦ 900,000+ fonts in database &nbsp;·&nbsp; Identify any font in seconds',
  '✦ 100% Free &nbsp;·&nbsp; No account required &nbsp;·&nbsp; No limits',
  '✦ Works on logos, screenshots, packaging &amp; ads',
];

const NAV_LEFT = [
  { label: 'Features',     href: '#features',     badge: null },
  { label: 'How It Works', href: '#how-it-works', badge: null },
  { label: 'Browse Fonts', href: '/browse',        badge: 'New' },
  { label: 'FAQ',          href: '#faq',          badge: null },
];

const NAV_RIGHT_DESKTOP = [
  { label: 'Font Guides', href: '/guides', external: false, badge: null },
  { label: 'Blog',        href: '/blog',   external: false, badge: null },
];

const MOBILE_LINKS = [
  { label: 'Features',     href: '#features',      icon: 'fa-bolt' },
  { label: 'How It Works', href: '#how-it-works',  icon: 'fa-circle-play' },
  { label: 'Browse Fonts', href: '/browse',         icon: 'fa-table-cells' },
  { label: 'Font Guides',  href: '/guides',         icon: 'fa-book-open' },
  { label: 'Reviews',      href: '#testimonials',  icon: 'fa-star' },
  { label: 'FAQ',          href: '#faq',           icon: 'fa-circle-question' },
  { label: 'Blog',         href: '/blog',           icon: 'fa-rss' },
];

export function render() {
  const leftNav = NAV_LEFT.map(n => `
    <a href="${n.href}" class="hdr-nav__link">
      ${n.label}
      ${n.badge ? `<span class="hdr-nav__badge">${n.badge}</span>` : ''}
    </a>
  `).join('');

  const rightNav = NAV_RIGHT_DESKTOP.map(n => `
    <a href="${n.href}" class="hdr-nav__link"
      ${n.external ? 'target="_blank" rel="noopener"' : ''}>
      ${n.label}
      ${n.badge ? `<span class="hdr-nav__badge hdr-nav__badge--green">${n.badge}</span>` : ''}
      ${n.external ? '<i class="fa fa-arrow-up-right-from-square hdr-nav__ext"></i>' : ''}
    </a>
  `).join('');

  const mobileLinks = MOBILE_LINKS.map(n => `
    <a href="${n.href}" class="hdr-drawer__link"
      ${n.external ? 'target="_blank" rel="noopener"' : ''}
      onclick="${n.external ? '' : 'window.__hdrClose()'}">
      <i class="fa ${n.icon}"></i>
      <span>${n.label}</span>
      ${n.external ? '<i class="fa fa-arrow-up-right-from-square hdr-drawer__ext"></i>' : ''}
    </a>
  `).join('');

  return `
    <header class="hdr" id="site-header">

      <!-- ── Announcement bar ─────────────────────────── -->
      <div class="hdr-announce" id="hdr-announce" role="marquee" aria-live="polite">
        <div class="hdr-announce__track" id="hdr-announce-track">
          ${ANNOUNCEMENTS.map(a => `<p class="hdr-announce__item">${a}</p>`).join('')}
        </div>
      </div>

      <!-- ── Main nav row ──────────────────────────────── -->
      <div class="hdr-bar">
        <div class="hdr-bar__inner">

          <!-- Left nav (desktop) -->
          <nav class="hdr-nav hdr-nav--left" aria-label="Left navigation">
            ${leftNav}
          </nav>

          <!-- Center logo -->
          <a href="/" class="hdr-logo" aria-label="FontFinder home">
            <div class="hdr-logo__mark">
              <i class="fa fa-font"></i>
            </div>
            <span class="hdr-logo__text">Font<strong>Finder</strong></span>
          </a>

          <!-- Right: nav + CTA + burger -->
          <div class="hdr-bar__right">
            <nav class="hdr-nav hdr-nav--right" aria-label="Right navigation">
              ${rightNav}
            </nav>

            <!-- Search -->
            <div class="hdr-search" id="hdr-search" role="search">
              <button class="hdr-search__toggle" id="hdr-search-btn" aria-label="Search" aria-expanded="false">
                <i class="fa fa-magnifying-glass"></i>
              </button>
              <div class="hdr-search__box hidden" id="hdr-search-box">
                <i class="fa fa-magnifying-glass hdr-search__icon"></i>
                <input
                  type="text"
                  id="hdr-search-input"
                  class="hdr-search__input"
                  placeholder="Search a font name…"
                  autocomplete="off"
                  spellcheck="false"
                />
                <kbd class="hdr-search__esc">ESC</kbd>
              </div>
            </div>

            <label class="hdr-cta" for="file-input" id="hdr-cta" aria-label="Identify font — upload image">
              <i class="fa fa-upload hdr-cta__icon"></i>
              <span class="hdr-cta__text">Try For Free</span>
            </label>

            <button
              class="hdr-burger"
              id="hdr-burger"
              aria-label="Open navigation menu"
              aria-expanded="false"
              aria-controls="hdr-drawer"
            >
              <span class="hdr-burger__bar"></span>
              <span class="hdr-burger__bar"></span>
              <span class="hdr-burger__bar"></span>
            </button>
          </div>

        </div>
      </div>

      <!-- ── Mobile drawer ─────────────────────────────── -->
      <div class="hdr-drawer" id="hdr-drawer" aria-hidden="true" hidden>
        <div class="hdr-drawer__inner">
          <div class="hdr-drawer__links">
            ${mobileLinks}
          </div>
          <div class="hdr-drawer__divider"></div>
          <label class="hdr-drawer__cta" for="file-input" onclick="window.__hdrClose()">
            <i class="fa fa-upload"></i>
            Identify Any Font — It's Free
          </label>
          <p class="hdr-drawer__note">
            No account needed &nbsp;·&nbsp; 900K+ fonts &nbsp;·&nbsp; Instant results
          </p>
        </div>
      </div>

    </header>
  `;
}

export function init() {
  /* ── Announcement rotator ──────────────────────────────── */
  let annIdx = 0;
  const items = Array.from(document.querySelectorAll('.hdr-announce__item'));

  // Make sure ONLY the first item is visible on load — no CSS fallback
  items.forEach((item, i) => {
    item.classList.remove('hdr-announce__item--active', 'hdr-announce__item--exit');
    if (i === 0) item.classList.add('hdr-announce__item--active');
  });

  if (items.length > 1) {
    setInterval(() => {
      const current = items[annIdx];
      annIdx = (annIdx + 1) % items.length;
      const next = items[annIdx];

      // Slide current out
      current.classList.remove('hdr-announce__item--active');
      current.classList.add('hdr-announce__item--exit');

      // Slide next in
      next.classList.add('hdr-announce__item--active');

      // Clean up exit class after transition
      setTimeout(() => current.classList.remove('hdr-announce__item--exit'), 500);
    }, 4000);
  }

  /* ── Scroll → solidify header ──────────────────────────── */
  const header = document.getElementById('site-header');
  const onScroll = () => header.classList.toggle('hdr--scrolled', window.scrollY > 12);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ── Mobile burger ─────────────────────────────────────── */
  const burger = document.getElementById('hdr-burger');
  const drawer = document.getElementById('hdr-drawer');
  let open = false;

  function setOpen(val) {
    open = val;
    burger.setAttribute('aria-expanded', String(val));
    burger.classList.toggle('hdr-burger--open', val);
    drawer.hidden  = !val;
    drawer.setAttribute('aria-hidden', String(!val));
    document.body.style.overflow = val ? 'hidden' : '';
  }

  burger.addEventListener('click', () => setOpen(!open));

  // Close on backdrop tap
  drawer.addEventListener('click', e => {
    if (e.target === drawer) setOpen(false);
  });

  // Close on Escape
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && open) setOpen(false);
  });

  // Expose globally for onclick links
  window.__hdrClose = () => setOpen(false);

  /* ── Search toggle ─────────────────────────────────────── */
  const searchBtn = document.getElementById('hdr-search-btn');
  const searchBox = document.getElementById('hdr-search-box');
  const searchInput = document.getElementById('hdr-search-input');

  searchBtn?.addEventListener('click', () => {
    const isOpen = !searchBox.classList.contains('hidden');
    if (isOpen) {
      searchBox.classList.add('hidden');
      searchBtn.setAttribute('aria-expanded', 'false');
    } else {
      searchBox.classList.remove('hidden');
      searchBtn.setAttribute('aria-expanded', 'true');
      setTimeout(() => searchInput?.focus(), 50);
    }
  });

  searchInput?.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      searchBox.classList.add('hidden');
      searchBtn.setAttribute('aria-expanded', 'false');
    }
    if (e.key === 'Enter') {
      const q = searchInput.value.trim();
      if (q) window.location.href = `/browse?q=${encodeURIComponent(q)}`;
    }
  });

  /* ── Smooth scroll for all anchor links ────────────────── */
  document.addEventListener('click', e => {
    const a = e.target.closest('a[href^="#"]');
    if (!a) return;
    const target = document.getElementById(a.getAttribute('href').slice(1));
    if (!target) return;
    e.preventDefault();
    const yOffset = -(header.offsetHeight + 12);
    const y = target.getBoundingClientRect().top + window.scrollY + yOffset;
    window.scrollTo({ top: y, behavior: 'smooth' });
  });
}
