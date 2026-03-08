/* ============================================================
   Browse Fonts Page
   ============================================================ */
import { CATEGORIES, FONTS, searchFonts } from '../data/fonts.js';

const PREVIEW_TEXT = 'The quick brown fox';

export function render() {
  return `
    <section class="browse-page">

      <!-- Page hero -->
      <div class="browse-hero">
        <div class="browse-hero__blob browse-hero__blob--1"></div>
        <div class="browse-hero__blob browse-hero__blob--2"></div>
        <div class="container browse-hero__inner">
          <div class="browse-hero__badge">
            <i class="fa fa-table-cells"></i>
            Font Library
          </div>
          <h1 class="browse-hero__title">Browse <span class="grad-text">Our Font Library</span></h1>
          <p class="browse-hero__sub">
            ${FONTS.length}+ curated fonts across ${CATEGORIES.length - 1} categories.
            Search, preview, and find the perfect typeface.
          </p>

          <!-- Search bar -->
          <div class="browse-search" role="search">
            <i class="fa fa-magnifying-glass browse-search__icon"></i>
            <input
              type="text"
              id="browse-search-input"
              class="browse-search__input"
              placeholder="Search fonts by name, style, or use case…"
              autocomplete="off"
              spellcheck="false"
            />
            <button class="browse-search__clear hidden" id="browse-search-clear" aria-label="Clear search">
              <i class="fa fa-xmark"></i>
            </button>
          </div>
        </div>
      </div>

      <!-- Sticky filter bar -->
      <div class="browse-filters" id="browse-filters">
        <div class="container browse-filters__inner">
          <div class="browse-filters__cats" role="tablist" aria-label="Font categories">
            ${CATEGORIES.map(c => `
              <button
                class="browse-filter-btn ${c.id === 'all' ? 'browse-filter-btn--active' : ''}"
                data-cat="${c.id}"
                role="tab"
                aria-selected="${c.id === 'all' ? 'true' : 'false'}"
              >
                <i class="fa ${c.icon}"></i>
                ${c.label}
              </button>
            `).join('')}
          </div>
          <div class="browse-filters__meta">
            <span id="browse-count" class="browse-filters__count">${FONTS.length} fonts</span>
            <div class="browse-filters__view">
              <button class="browse-view-btn browse-view-btn--active" data-view="grid" aria-label="Grid view">
                <i class="fa fa-grid-2"></i>
              </button>
              <button class="browse-view-btn" data-view="list" aria-label="List view">
                <i class="fa fa-list"></i>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Font grid -->
      <div class="container">
        <div class="browse-grid" id="browse-grid">
          ${renderCards(FONTS)}
        </div>

        <div class="browse-empty hidden" id="browse-empty">
          <i class="fa fa-magnifying-glass browse-empty__icon"></i>
          <p class="browse-empty__title">No fonts found</p>
          <p class="browse-empty__sub">Try a different search or browse all categories.</p>
          <button class="browse-empty__reset" id="browse-reset-btn">Clear search</button>
        </div>
      </div>

    </section>

    <!-- Font detail modal -->
    <div class="font-modal hidden" id="font-modal" role="dialog" aria-modal="true" aria-labelledby="modal-font-name">
      <div class="font-modal__backdrop" id="modal-backdrop"></div>
      <div class="font-modal__panel">
        <button class="font-modal__close" id="modal-close" aria-label="Close">
          <i class="fa fa-xmark"></i>
        </button>
        <div id="modal-content"></div>
      </div>
    </div>
  `;
}

function renderCards(fonts) {
  if (!fonts.length) return '';
  return fonts.map(f => `
    <div
      class="font-card anim-up"
      data-id="${f.id}"
      data-category="${f.category}"
      style="--fc: ${categoryColor(f.category)}"
      tabindex="0"
      role="button"
      aria-label="View ${f.name} font details"
    >
      <!-- Preview area -->
      <div class="font-card__preview" ${f.googleFamily ? `data-gfamily="${f.googleFamily}"` : ''}>
        <span class="font-card__preview-text" data-font-id="${f.id}">${PREVIEW_TEXT}</span>
      </div>

      <!-- Info -->
      <div class="font-card__info">
        <div class="font-card__top">
          <p class="font-card__name">${f.name}</p>
          <span class="font-card__cat-badge" style="color:${categoryColor(f.category)};background:${categoryBg(f.category)};border-color:${categoryBorder(f.category)}">
            ${f.category}
          </span>
        </div>
        <div class="font-card__meta">
          <span class="font-card__meta-item">
            <i class="fa fa-weight-hanging"></i>
            ${f.weights.length} weight${f.weights.length !== 1 ? 's' : ''}
          </span>
          ${f.variable ? `<span class="font-card__meta-item font-card__meta-item--var"><i class="fa fa-sliders"></i> Variable</span>` : ''}
          <span class="font-card__meta-item font-card__meta-item--free">
            <i class="fa fa-circle-check"></i>
            Free
          </span>
        </div>
        <div class="font-card__actions">
          <button class="font-card__btn-preview" data-id="${f.id}" aria-label="Preview ${f.name}">
            <i class="fa fa-eye"></i> Preview
          </button>
          <a
            href="/api/download?family=${encodeURIComponent(f.googleFamily || f.name)}"
            class="font-card__btn-download"
            aria-label="Download ${f.name}"
            onclick="event.stopPropagation()"
            download
          >
            <i class="fa fa-download"></i> Download
          </a>
        </div>
      </div>
    </div>
  `).join('');
}

function renderModal(font) {
  const sampleSizes = [14, 18, 24, 36, 48, 72];
  return `
    <div class="modal-font">
      <div class="modal-font__head">
        <div>
          <p class="modal-font__name" id="modal-font-name">${font.name}</p>
          <p class="modal-font__designer">by ${font.designer}</p>
        </div>
        <div class="modal-font__badges">
          <span class="browse-badge browse-badge--${font.free ? 'free' : 'paid'}">${font.free ? 'Free' : 'Premium'}</span>
          ${font.variable ? `<span class="browse-badge browse-badge--var">Variable</span>` : ''}
        </div>
      </div>

      <p class="modal-font__desc">${font.desc}</p>

      <div class="modal-font__tags">
        ${font.tags.map(t => `<span class="modal-font__tag">${t}</span>`).join('')}
      </div>

      <!-- Size previews -->
      <div class="modal-font__preview-section">
        <p class="modal-font__section-title">Preview</p>
        <div class="modal-font__size-preview" ${font.googleFamily ? `data-gfamily="${font.googleFamily}"` : ''}>
          ${sampleSizes.map(size => `
            <div class="modal-font__size-row">
              <span class="modal-font__size-label">${size}px</span>
              <span class="modal-font__size-text" style="font-size:${size}px" data-font-id="${font.id}">${PREVIEW_TEXT}</span>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- Weights -->
      <div class="modal-font__weights-section">
        <p class="modal-font__section-title">Available Weights</p>
        <div class="modal-font__weights">
          ${font.weights.map(w => `
            <div class="modal-font__weight-item">
              <span class="modal-font__weight-num">${w}</span>
              <span class="modal-font__weight-text" style="font-weight:${w}" data-font-id="${font.id}">${font.name}</span>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- Popular with -->
      <div class="modal-font__popular">
        <p class="modal-font__section-title">Popular With</p>
        <div class="modal-font__popular-tags">
          ${font.popularWith.map(p => `<span class="modal-font__popular-tag"><i class="fa fa-check"></i> ${p}</span>`).join('')}
        </div>
      </div>

      <!-- Live preview input -->
      <div class="modal-font__live-preview">
        <p class="modal-font__section-title">Live Preview</p>
        <input
          type="text"
          class="modal-font__live-input"
          id="modal-live-input"
          placeholder="Type anything to preview..."
          value="${PREVIEW_TEXT}"
          autocomplete="off"
        />
        <div class="modal-font__live-display" id="modal-live-display" data-font-id="${font.id}" ${font.googleFamily ? `data-gfamily="${font.googleFamily}"` : ''}>
          ${PREVIEW_TEXT}
        </div>
        <div class="modal-font__live-sizes">
          <button class="modal-size-btn modal-size-btn--active" data-size="32">32px</button>
          <button class="modal-size-btn" data-size="48">48px</button>
          <button class="modal-size-btn" data-size="64">64px</button>
          <button class="modal-size-btn" data-size="96">96px</button>
        </div>
      </div>

      <!-- CTA -->
      <div class="modal-font__cta">
        <a
          href="/api/download?family=${encodeURIComponent(font.googleFamily || font.name)}"
          class="modal-font__btn-download"
          id="modal-download-btn"
          download="${(font.googleFamily || font.name).replace(/\s+/g,'_')}.ttf"
        >
          <i class="fa fa-download"></i>
          Download Free Font
        </a>
        <a href="/?font=${encodeURIComponent(font.name)}" class="modal-font__btn-primary">
          <i class="fa fa-magnifying-glass"></i>
          Identify in my image
        </a>
        <a href="/browse?cat=${font.category}" class="modal-font__btn-ghost">
          <i class="fa fa-layer-group"></i>
          More ${font.category} fonts
        </a>
      </div>
    </div>
  `;
}

function categoryColor(cat) {
  const map = {
    'serif': '#a5b4fc',
    'sans-serif': '#67e8f9',
    'display': '#f9a8d4',
    'script': '#fcd34d',
    'monospace': '#6ee7b7',
    'handwriting': '#fdba74',
    'variable': '#c4b5fd',
  };
  return map[cat] || '#a5b4fc';
}
function categoryBg(cat) {
  const map = {
    'serif': 'rgba(99,102,241,0.1)',
    'sans-serif': 'rgba(34,211,238,0.1)',
    'display': 'rgba(244,114,182,0.1)',
    'script': 'rgba(251,191,36,0.1)',
    'monospace': 'rgba(52,211,153,0.1)',
    'handwriting': 'rgba(249,115,22,0.1)',
    'variable': 'rgba(168,85,247,0.1)',
  };
  return map[cat] || 'rgba(99,102,241,0.1)';
}
function categoryBorder(cat) {
  const map = {
    'serif': 'rgba(99,102,241,0.25)',
    'sans-serif': 'rgba(34,211,238,0.25)',
    'display': 'rgba(244,114,182,0.25)',
    'script': 'rgba(251,191,36,0.25)',
    'monospace': 'rgba(52,211,153,0.25)',
    'handwriting': 'rgba(249,115,22,0.25)',
    'variable': 'rgba(168,85,247,0.25)',
  };
  return map[cat] || 'rgba(99,102,241,0.25)';
}

export function init() {
  let activeCat = 'all';
  let searchQuery = '';
  let viewMode = 'grid';
  const loadedFonts = new Set();

  const grid       = document.getElementById('browse-grid');
  const empty      = document.getElementById('browse-empty');
  const countEl    = document.getElementById('browse-count');
  const searchInput = document.getElementById('browse-search-input');
  const searchClear = document.getElementById('browse-search-clear');
  const modal      = document.getElementById('font-modal');
  const modalContent = document.getElementById('modal-content');
  const modalClose = document.getElementById('modal-close');
  const modalBg    = document.getElementById('modal-backdrop');
  const resetBtn   = document.getElementById('browse-reset-btn');

  // ── Category filters ───────────────────────────────────────
  document.querySelectorAll('.browse-filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.browse-filter-btn').forEach(b => {
        b.classList.remove('browse-filter-btn--active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('browse-filter-btn--active');
      btn.setAttribute('aria-selected', 'true');
      activeCat = btn.dataset.cat;
      updateGrid();
    });
  });

  // ── Search ─────────────────────────────────────────────────
  searchInput?.addEventListener('input', () => {
    searchQuery = searchInput.value;
    searchClear?.classList.toggle('hidden', !searchQuery);
    updateGrid();
  });
  searchClear?.addEventListener('click', () => {
    searchInput.value = '';
    searchQuery = '';
    searchClear.classList.add('hidden');
    searchInput.focus();
    updateGrid();
  });
  resetBtn?.addEventListener('click', () => {
    searchInput.value = '';
    searchQuery = '';
    searchClear?.classList.add('hidden');
    activeCat = 'all';
    document.querySelectorAll('.browse-filter-btn').forEach(b => {
      b.classList.toggle('browse-filter-btn--active', b.dataset.cat === 'all');
    });
    updateGrid();
  });

  // ── View toggle ────────────────────────────────────────────
  document.querySelectorAll('.browse-view-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.browse-view-btn').forEach(b => b.classList.remove('browse-view-btn--active'));
      btn.classList.add('browse-view-btn--active');
      viewMode = btn.dataset.view;
      grid?.classList.toggle('browse-grid--list', viewMode === 'list');
    });
  });

  // ── Update grid ────────────────────────────────────────────
  function updateGrid() {
    const results = searchFonts(searchQuery, activeCat);
    if (!grid) return;
    grid.innerHTML = renderCards(results);
    // Immediately show cards for filter/search results — no deferred animation
    grid.querySelectorAll('.anim-up').forEach(el => el.classList.add('visible'));
    countEl && (countEl.textContent = `${results.length} font${results.length !== 1 ? 's' : ''}`);
    empty?.classList.toggle('hidden', results.length > 0);
    grid?.classList.toggle('hidden', results.length === 0);
    if (viewMode === 'list') grid?.classList.add('browse-grid--list');
    loadFontPreviews();
    attachCardListeners();
  }

  // ── Load Google Fonts dynamically ─────────────────────────
  function loadFontPreviews() {
    const cards = document.querySelectorAll('[data-gfamily]');
    const toLoad = [];
    cards.forEach(el => {
      const gfam = el.dataset.gfamily;
      if (gfam && !loadedFonts.has(gfam)) {
        toLoad.push(gfam);
        loadedFonts.add(gfam);
      }
    });
    if (!toLoad.length) {
      applyFontFamilies();
      return;
    }
    const url = `https://fonts.googleapis.com/css2?${toLoad.map(f => `family=${f}`).join('&')}&display=swap`;
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = url;
    link.onload = () => applyFontFamilies();
    document.head.appendChild(link);
    applyFontFamilies();
  }

  function applyFontFamilies() {
    const fontMap = {};
    FONTS.forEach(f => { if (f.googleFamily) fontMap[f.id] = f.name; });
    document.querySelectorAll('[data-font-id]').forEach(el => {
      const id = el.dataset.fontId;
      if (fontMap[id]) el.style.fontFamily = `'${fontMap[id]}', serif`;
    });
  }

  // ── Card click → modal ─────────────────────────────────────
  function attachCardListeners() {
    document.querySelectorAll('.font-card').forEach(card => {
      const open = () => openModal(card.dataset.id);
      card.addEventListener('click', open);
      card.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') open(); });
    });
  }

  function openModal(fontId) {
    const font = FONTS.find(f => f.id === fontId);
    if (!font || !modal || !modalContent) return;
    modalContent.innerHTML = renderModal(font);
    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';

    // Load font in modal
    if (font.googleFamily && !loadedFonts.has(font.googleFamily)) {
      const url = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(font.googleFamily)}:wght@100;300;400;500;700;900&display=swap`;
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = url;
      link.onload = () => applyFontFamilies();
      document.head.appendChild(link);
      loadedFonts.add(font.googleFamily);
    } else {
      applyFontFamilies();
    }

    // Live preview input
    const liveInput   = document.getElementById('modal-live-input');
    const liveDisplay = document.getElementById('modal-live-display');
    liveInput?.addEventListener('input', () => {
      if (liveDisplay) liveDisplay.textContent = liveInput.value || PREVIEW_TEXT;
    });

    // Size switcher
    let currentSize = 32;
    document.querySelectorAll('.modal-size-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.modal-size-btn').forEach(b => b.classList.remove('modal-size-btn--active'));
        btn.classList.add('modal-size-btn--active');
        currentSize = parseInt(btn.dataset.size);
        if (liveDisplay) liveDisplay.style.fontSize = currentSize + 'px';
      });
    });

    // Apply font to live display
    if (font.googleFamily && liveDisplay) {
      liveDisplay.style.fontFamily = `'${font.googleFamily}', serif`;
      liveDisplay.style.fontSize   = currentSize + 'px';
    }
  }

  function closeModal() {
    modal?.classList.add('hidden');
    document.body.style.overflow = '';
  }

  modalClose?.addEventListener('click', closeModal);
  modalBg?.addEventListener('click', closeModal);
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

  // ── Parse URL params ───────────────────────────────────────
  const params = new URLSearchParams(window.location.search);
  const catParam = params.get('cat');
  const qParam   = params.get('q');
  if (catParam) {
    activeCat = catParam;
    document.querySelectorAll('.browse-filter-btn').forEach(b => {
      const active = b.dataset.cat === catParam;
      b.classList.toggle('browse-filter-btn--active', active);
      b.setAttribute('aria-selected', active ? 'true' : 'false');
    });
    updateGrid();
  }
  if (qParam && searchInput) {
    searchInput.value = qParam;
    searchQuery = qParam;
    searchClear?.classList.remove('hidden');
    updateGrid();
  }

  // ── Scroll-based sticky filters ────────────────────────────
  const filters = document.getElementById('browse-filters');
  const heroEl  = document.querySelector('.browse-hero');
  if (filters && heroEl) {
    const obs = new IntersectionObserver(
      ([entry]) => filters.classList.toggle('browse-filters--sticky', !entry.isIntersecting),
      { threshold: 0 }
    );
    obs.observe(heroEl);
  }

  // ── IntersectionObserver for initial card animations ───────
  const animObs = new IntersectionObserver(
    entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); }),
    { threshold: 0.02, rootMargin: '0px' }
  );
  document.querySelectorAll('.font-card.anim-up').forEach(el => animObs.observe(el));

  // ── Init ───────────────────────────────────────────────────
  attachCardListeners();
  loadFontPreviews();
}
