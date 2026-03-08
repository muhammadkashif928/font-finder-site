/* ============================================================
   Results Component — Professional font results with live preview
   ============================================================ */

const DEFAULT_PREVIEW = 'The quick brown fox';
let _previewText  = DEFAULT_PREVIEW;
let _previewSize  = 48;
let _viewMode     = 'list';      // 'list' | 'grid'
let _currentFonts = [];
let _loadedFonts  = new Set();
let _detectedWord = '';

export function render() {
  return `
    <div id="results-root" style="display:none">
      <div class="results-wrap" id="results-wrap">

        <!-- Loading -->
        <div class="results-state results-state--loading hidden" id="r-loading">
          <div class="spinner"></div>
          <p class="results-state__title">Scanning font database…</p>
          <p class="results-state__sub">Comparing letterforms across 3,800+ fonts</p>
        </div>

        <!-- Error -->
        <div class="results-state results-state--error hidden" id="r-error">
          <div class="results-state__icon"><i class="fa fa-triangle-exclamation"></i></div>
          <p class="results-state__title">Detection Failed</p>
          <p class="results-state__msg" id="r-error-msg"></p>
          <button class="btn btn-ghost" id="r-retry">
            <i class="fa fa-redo"></i> Try Another Image
          </button>
        </div>

        <!-- Results layout -->
        <div id="r-content" class="r-layout hidden">

          <!-- Sidebar -->
          <aside class="r-sidebar">
            <div class="r-sidebar__head">Filters</div>

            <!-- Category filter -->
            <div class="r-filter">
              <div class="r-filter__title" data-filter="category">
                Category <i class="fa fa-chevron-up r-filter__arrow"></i>
              </div>
              <div class="r-filter__body" id="filter-category">
                ${['All','Serif','Sans-Serif','Script','Display','Monospace'].map(c => `
                  <label class="r-filter__option">
                    <input type="checkbox" class="r-filter__check" data-cat="${c}" ${c==='All'?'checked':''}>
                    <span>${c}</span>
                  </label>`).join('')}
              </div>
            </div>

            <!-- License filter -->
            <div class="r-filter">
              <div class="r-filter__title" data-filter="license">
                License <i class="fa fa-chevron-up r-filter__arrow"></i>
              </div>
              <div class="r-filter__body" id="filter-license">
                ${['All','Free','OFL','Apache'].map(l => `
                  <label class="r-filter__option">
                    <input type="checkbox" class="r-filter__check" data-lic="${l}" ${l==='All'?'checked':''}>
                    <span>${l}</span>
                  </label>`).join('')}
              </div>
            </div>

            <button class="r-sidebar__back" id="r-new">
              <i class="fa fa-arrow-left"></i> Back to Image
            </button>
          </aside>

          <!-- Main results -->
          <main class="r-main">

            <!-- Results header bar -->
            <div class="r-header">
              <div class="r-header__left">
                <div id="r-thumb-wrap" class="hidden"></div>
                <span class="r-header__label">Results for</span>
                <span class="r-header__word" id="r-detected-word"></span>
                <span class="r-header__count" id="r-count"></span>
              </div>
              <div class="r-header__controls">
                <!-- Preview text input -->
                <div class="r-preview-input-wrap">
                  <input
                    type="text"
                    id="r-preview-text"
                    class="r-preview-input"
                    placeholder="Type to preview…"
                    maxlength="60"
                  >
                </div>

                <!-- Font size -->
                <div class="r-size-control">
                  <select id="r-size-select" class="r-size-select">
                    <option value="24">24px</option>
                    <option value="32">32px</option>
                    <option value="48" selected>48px</option>
                    <option value="64">64px</option>
                    <option value="96">96px</option>
                  </select>
                </div>

                <!-- Reset preview -->
                <button class="r-icon-btn" id="r-reset-preview" title="Reset preview text">
                  <i class="fa fa-rotate-left"></i>
                </button>

                <!-- View toggle -->
                <div class="r-view-toggle">
                  <button class="r-view-btn" id="r-view-grid" title="Grid view">
                    <i class="fa fa-grid-2"></i>
                  </button>
                  <button class="r-view-btn r-view-btn--active" id="r-view-list" title="List view">
                    <i class="fa fa-list"></i>
                  </button>
                </div>
              </div>
            </div>

            <!-- Font results list -->
            <div id="r-cards" class="r-cards r-cards--list"></div>

          </main>
        </div>

      </div>
    </div>
  `;
}

export function init() {
  document.getElementById('r-retry')?.addEventListener('click', _reset);
  document.getElementById('r-new')?.addEventListener('click',   _reset);

  function _reset() {
    hide();
    window._ff?.reset?.();
    document.getElementById('hero')?.scrollIntoView({ behavior: 'smooth' });
  }
}

// ── Public API ────────────────────────────────────────────────
export function showLoading() {
  const root = document.getElementById('results-root');
  root.style.display = 'block';
  setState('loading');
  requestAnimationFrame(() =>
    root.scrollIntoView({ behavior: 'smooth', block: 'start' })
  );
}

export function showError(msg) {
  document.getElementById('r-error-msg').textContent = msg;
  setState('error');
  document.getElementById('results-root').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

export function showResults(data) {
  _currentFonts = data.fonts || [];
  _detectedWord = data.detected_text || '';
  _previewText  = _detectedWord || DEFAULT_PREVIEW;

  setState('content');
  setupControls();
  renderAllCards();

  // Update header word chip
  const wordEl  = document.getElementById('r-detected-word');
  const countEl = document.getElementById('r-count');
  if (wordEl)  wordEl.textContent  = _detectedWord || 'your image';
  if (countEl) countEl.textContent = `${_currentFonts.length} fonts`;

  // Show cropped thumbnail in header if available
  const thumbWrap = document.getElementById('r-thumb-wrap');
  if (thumbWrap && data.cropped_thumb) {
    thumbWrap.innerHTML = `<img src="${data.cropped_thumb}" class="r-header__thumb" alt="Selected text">`;
    thumbWrap.classList.remove('hidden');
  } else if (thumbWrap) {
    thumbWrap.classList.add('hidden');
  }

  // Set preview input value
  const inp = document.getElementById('r-preview-text');
  if (inp) inp.value = _previewText;

  document.getElementById('results-root').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

export function hide() {
  document.getElementById('results-root').style.display = 'none';
}

// ── Controls setup ────────────────────────────────────────────
function setupControls() {
  // Preview text
  const inp = document.getElementById('r-preview-text');
  inp?.addEventListener('input', () => {
    _previewText = inp.value || DEFAULT_PREVIEW;
    updateAllPreviews();
  });

  // Reset preview
  document.getElementById('r-reset-preview')?.addEventListener('click', () => {
    _previewText = _detectedWord || DEFAULT_PREVIEW;
    if (inp) inp.value = _previewText;
    updateAllPreviews();
  });

  // Font size
  const sizeSelect = document.getElementById('r-size-select');
  sizeSelect?.addEventListener('change', () => {
    _previewSize = parseInt(sizeSelect.value);
    updateAllPreviews();
  });

  // View toggle
  document.getElementById('r-view-grid')?.addEventListener('click', () => setView('grid'));
  document.getElementById('r-view-list')?.addEventListener('click', () => setView('list'));

  // Filter chevrons
  document.querySelectorAll('.r-filter__title').forEach(title => {
    title.addEventListener('click', () => {
      const filterId = 'filter-' + title.dataset.filter;
      const body     = document.getElementById(filterId);
      const arrow    = title.querySelector('.r-filter__arrow');
      if (!body) return;
      const open = !body.classList.contains('hidden');
      body.classList.toggle('hidden', open);
      arrow?.classList.toggle('fa-chevron-up',   !open);
      arrow?.classList.toggle('fa-chevron-down',  open);
    });
  });
}

function setView(mode) {
  _viewMode = mode;
  const grid = document.getElementById('r-cards');
  if (!grid) return;
  grid.className = `r-cards r-cards--${mode}`;
  document.getElementById('r-view-grid')?.classList.toggle('r-view-btn--active', mode === 'grid');
  document.getElementById('r-view-list')?.classList.toggle('r-view-btn--active', mode === 'list');
}

function updateAllPreviews() {
  document.querySelectorAll('.r-card__preview-text').forEach(el => {
    el.textContent   = _previewText;
    el.style.fontSize = _previewSize + 'px';
  });
}

// ── Card rendering ────────────────────────────────────────────
function renderAllCards() {
  const grid = document.getElementById('r-cards');
  if (!grid) return;
  grid.innerHTML = '';

  const fontFamiliesToLoad = [];

  _currentFonts.forEach((font, i) => {
    const card = buildCard(font, i);
    grid.appendChild(card);

    if (font.googleFamily && !_loadedFonts.has(font.googleFamily)) {
      fontFamiliesToLoad.push(font.googleFamily);
      _loadedFonts.add(font.googleFamily);
    }

    // Trigger entrance animation
    requestAnimationFrame(() => setTimeout(() => card.classList.add('visible'), i * 60));
  });

  // Load all fonts in one batch API call
  if (fontFamiliesToLoad.length) {
    const families = fontFamiliesToLoad
      .map(f => `family=${encodeURIComponent(f)}:wght@400;700`)
      .join('&');
    const link = document.createElement('link');
    link.rel  = 'stylesheet';
    link.href = `https://fonts.googleapis.com/css2?${families}&display=swap`;
    document.head.appendChild(link);
  }
}

function buildCard(font, i) {
  const isTop      = i === 0;
  const confidence = font.confidence ? Math.round(font.confidence) : null;
  const family     = font.googleFamily || font.name;
  const fontStyle  = family ? `font-family:'${family}',serif;` : '';
  const downloadUrl= `/api/download?family=${encodeURIComponent((family || font.name).split(':')[0].split('[')[0].trim())}`;

  const confidenceBadge = confidence ? `
    <span class="r-card__conf ${isTop ? 'r-card__conf--top' : ''}">
      ${isTop ? '<i class="fa fa-star"></i> ' : ''}${confidence}% match
    </span>` : '';

  const card = document.createElement('div');
  card.className = 'r-card anim-up';
  card.dataset.fontId = font.name;

  card.innerHTML = `
    <div class="r-card__inner ${isTop ? 'r-card--top' : ''}">

      <!-- Card header -->
      <div class="r-card__head">
        <div class="r-card__meta">
          <div class="r-card__name-row">
            <h3 class="r-card__name">${e(font.name)}</h3>
            ${confidenceBadge}
          </div>
          <p class="r-card__detail">
            ${font.category ? `<span class="r-card__cat">${e(capitalize(font.category))}</span>` : ''}
            ${font.license  ? `<span class="r-card__license">${e(font.license)}</span>` : ''}
          </p>
        </div>
        <div class="r-card__actions">
          <span class="r-card__price">Free</span>
          <a href="${downloadUrl}" class="r-card__get-btn" download>
            <i class="fa fa-download"></i> Download Font
          </a>
        </div>
      </div>

      <!-- Live font preview — big and beautiful -->
      <div class="r-card__preview" style="${fontStyle}">
        <span class="r-card__preview-text"
          style="${fontStyle} font-size:${_previewSize}px"
        >${e(_previewText)}</span>
      </div>

      <!-- Confidence bar -->
      ${confidence ? `
        <div class="r-card__conf-bar-wrap">
          <div class="r-card__conf-bar" style="width:${confidence}%"></div>
        </div>` : ''}

      <!-- Find links -->
      <div class="r-card__links">
        ${font.purchase_links?.map(l => `
          <a href="${e(l.url)}" target="_blank" rel="noopener" class="r-card__link r-card__link--${l.type || 'free'}">
            <i class="fa ${l.icon || 'fa-external-link-alt'}"></i>
            ${e(l.label)}
          </a>`).join('') || ''}
      </div>

    </div>`;

  return card;
}

// ── Helpers ───────────────────────────────────────────────────
function setState(which) {
  ['r-loading','r-error','r-content'].forEach(id =>
    document.getElementById(id)?.classList.add('hidden')
  );
  const map = { loading:'r-loading', error:'r-error', content:'r-content' };
  document.getElementById(map[which])?.classList.remove('hidden');
}

function capitalize(s) {
  return s ? s.charAt(0).toUpperCase() + s.slice(1) : s;
}

function e(s) {
  if (!s) return '';
  return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}
