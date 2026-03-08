/* ============================================================
   Results Component — Loading · Error · Font Cards · Alternatives
   ============================================================ */

export function render() {
  return `
    <div id="results-root" style="display:none">
      <section class="results container" id="results-section">

        <!-- Loading -->
        <div class="results-state results-state--loading hidden" id="r-loading">
          <div class="spinner"></div>
          <p class="results-state__title">Scanning font database…</p>
          <p class="results-state__sub">Comparing letterforms across 900,000+ fonts</p>
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

        <!-- Results -->
        <div id="r-content" class="hidden">
          <div class="results__header">
            <div>
              <h2 class="results__title">Detected Fonts</h2>
              <p class="results__sub">Ranked by confidence — best match first</p>
            </div>
            <button class="btn btn-ghost" id="r-new">
              <i class="fa fa-redo"></i> New Search
            </button>
          </div>

          <div class="results__cards" id="r-cards"></div>

          <!-- Free Alternatives -->
          <div id="r-alts" class="hidden">
            <div class="divider">Free Alternatives on Google Fonts</div>
            <div class="alts__grid" id="r-alts-grid"></div>
          </div>
        </div>

      </section>
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

  // Scroll after next paint
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
  setState('content');
  renderCards(data.fonts);
  if (data.google_alternatives?.length) renderAlts(data.google_alternatives);
  document.getElementById('r-content').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

export function hide() {
  document.getElementById('results-root').style.display = 'none';
}

// ── Helpers ───────────────────────────────────────────────────
function setState(which) {
  ['r-loading','r-error','r-content'].forEach(id =>
    document.getElementById(id)?.classList.add('hidden')
  );
  const map = { loading:'r-loading', error:'r-error', content:'r-content' };
  document.getElementById(map[which])?.classList.remove('hidden');
}

function renderCards(fonts) {
  const grid = document.getElementById('r-cards');
  grid.innerHTML = '';
  fonts.forEach((font, i) => {
    const card = document.createElement('div');
    card.className = 'r-card anim-up';
    card.style.transitionDelay = `${i * 0.08}s`;

    const isTop  = i === 0;
    const isFree = font.is_free;

    const badges = `
      ${isTop  ? '<span class="badge badge-best"><i class="fa fa-star" aria-hidden="true"></i> Best Match</span>' : ''}
      ${isFree ? '<span class="badge badge-free">Free</span>' : '<span class="badge badge-paid">Commercial</span>'}
    `;

    const preview = font.preview_image
      ? `<img src="${e(font.preview_image)}" alt="${e(font.name)} preview" class="r-card__preview" onerror="this.remove()">`
      : '';

    const typeColors = { paid:'link-paid', subscription:'link-sub', free:'link-free' };
    const typeIcons  = { tag:'fa-tag', adobe:'fa-brands fa-adobe', store:'fa-store', leaf:'fa-leaf', google:'fa-brands fa-google' };

    const links = font.purchase_links.map(l => `
      <a href="${e(l.url)}" target="_blank" rel="noopener sponsored"
         class="r-card__link ${typeColors[l.type]||'link-paid'}">
        <i class="fa ${typeIcons[l.icon]||'fa-external-link-alt'}"></i>
        ${e(l.label)}
      </a>`).join('');

    card.innerHTML = `
      <div class="r-card__inner ${isTop ? 'r-card--top' : ''}">
        <div class="r-card__head">
          <div>
            <h3 class="r-card__name">${e(font.name)}</h3>
            ${font.family ? `<p class="r-card__family">${e(font.family)}</p>` : ''}
            ${font.category ? `<p class="r-card__cat"><i class="fa fa-tag" aria-hidden="true"></i> ${e(font.category)}</p>` : ''}
          </div>
          <div class="r-card__badges">${badges}</div>
        </div>
        ${preview}
        <div class="r-card__links">
          <p class="r-card__links-label">Find this font</p>
          <div class="r-card__links-row">${links}</div>
        </div>
      </div>`;

    grid.appendChild(card);

    // Trigger animation
    requestAnimationFrame(() => setTimeout(() => card.classList.add('visible'), 50));
  });
}

function renderAlts(alts) {
  const grid = document.getElementById('r-alts-grid');
  grid.innerHTML = '';
  alts.forEach(f => {
    grid.innerHTML += `
      <a href="${e(f.url)}" target="_blank" rel="noopener"
         class="alt-card">
        <div class="alt-card__icon"><i class="fa-brands fa-google"></i></div>
        <span class="alt-card__name">${e(f.name)}</span>
        <i class="fa fa-arrow-right alt-card__arrow"></i>
      </a>`;
  });
  document.getElementById('r-alts').classList.remove('hidden');
}

function e(s) {
  if (!s) return '';
  return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}
