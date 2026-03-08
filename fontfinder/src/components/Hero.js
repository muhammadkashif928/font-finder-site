/* ============================================================
   Hero Component — 2-column layout with result card mockup
   ============================================================ */

export function render() {
  return `
    <section class="hero" id="hero">

      <!-- Ambient glows -->
      <div class="hero__blob hero__blob--1"></div>
      <div class="hero__blob hero__blob--2"></div>
      <div class="hero__blob hero__blob--3"></div>

      <!-- Grid pattern overlay -->
      <div class="hero__grid" aria-hidden="true"></div>

      <div class="hero__wrap container">

        <!-- ── LEFT: Text + Tool ────────────────────────── -->
        <div class="hero__left">

          <!-- Eyebrow -->
          <div class="hero__eyebrow">
            <span class="hero__eyebrow-dot"></span>
            Font detection powered by 900K+ database
          </div>

          <!-- Headline -->
          <h1 class="hero__title">
            Identify<br>
            Any Font.<br>
            <span class="hero__title-accent">Instantly.</span>
          </h1>

          <!-- Sub -->
          <p class="hero__sub">
            Drop any image — logo, screenshot, packaging, or ad — and get
            the exact font name, free alternatives, and purchase links in seconds.
          </p>

          <!-- CTA row -->
          <div class="hero__ctas" id="hero-ctas">
            <label class="hero__btn-primary" for="file-input">
              <i class="fa fa-arrow-up-from-bracket"></i>
              Upload an Image
            </label>
            <input
              type="file"
              id="file-input"
              accept="image/jpeg,image/png,image/gif,image/webp"
              class="visually-hidden"
            />
            <a href="#how-it-works" class="hero__btn-ghost">
              See How It Works
              <i class="fa fa-arrow-right hero__btn-arrow"></i>
            </a>
          </div>

          <!-- Upload tool (shown after file pick) -->
          <div class="hero__tool hidden" id="hero-tool">

            <!-- URL bar -->
            <div class="hero__urlbar" id="hero-urlbar">
              <i class="fa fa-image hero__urlbar-icon"></i>
              <input
                type="text"
                id="url-input"
                class="hero__urlbar-input"
                placeholder="…or paste an image URL and press Enter"
                autocomplete="off"
                spellcheck="false"
              />
              <button class="hero__urlbar-clear hidden" id="url-clear" aria-label="Clear">
                <i class="fa fa-xmark"></i>
              </button>
            </div>

            <!-- Preview strip -->
            <div class="hero__preview" id="hero-preview">
              <img id="preview-img" src="" alt="Your image preview" />
              <div class="hero__preview-info">
                <p class="hero__preview-name" id="preview-name"></p>
                <p class="hero__preview-meta" id="preview-size"></p>
              </div>
              <button class="hero__preview-rm" id="remove-preview" aria-label="Remove">
                <i class="fa fa-xmark"></i>
              </button>
            </div>

            <!-- Identify button -->
            <button class="hero__identify-btn" id="submit-btn">
              <i class="fa fa-magnifying-glass"></i>
              Identify Font Now
            </button>

            <p class="hero__tool-note">
              <i class="fa fa-lock"></i>
              Images are never stored — processed &amp; discarded instantly
            </p>

          </div>

          <!-- Tips -->
          <div class="hero__tips" id="hero-tips">
            <span class="hero__tip"><i class="fa fa-check"></i> Crop close to the text</span>
            <span class="hero__tip"><i class="fa fa-check"></i> High contrast works best</span>
            <span class="hero__tip"><i class="fa fa-check"></i> Logos, signs, screenshots</span>
          </div>

          <!-- Drag hint -->
          <p class="hero__drag-hint" id="hero-drag-hint">
            <i class="fa fa-hand-pointer"></i>
            or drag &amp; drop anywhere on the page
          </p>

        </div>
        <!-- end left -->

        <!-- ── RIGHT: Floating result card mockup ──────── -->
        <div class="hero__right" aria-hidden="true">
          <div class="hero__mockup">

            <!-- Upload preview -->
            <div class="hero__mockup-upload">
              <div class="hero__mockup-upload-img">
                <span style="font-family:'Georgia',serif;font-size:22px;font-weight:700;color:#fff;letter-spacing:0.02em">Helvetica</span>
              </div>
              <div class="hero__mockup-upload-info">
                <p class="hero__mockup-filename">logo-design.png</p>
                <p class="hero__mockup-filesize">48 KB · analyzing…</p>
              </div>
              <div class="hero__mockup-scan">
                <div class="hero__mockup-scan-bar"></div>
              </div>
            </div>

            <!-- Arrow -->
            <div class="hero__mockup-arrow">
              <i class="fa fa-arrow-down"></i>
            </div>

            <!-- Result card -->
            <div class="hero__mockup-result">
              <div class="hero__mockup-result-head">
                <div>
                  <p class="hero__mockup-font-name">Helvetica Neue</p>
                  <p class="hero__mockup-font-family">Sans-Serif · Extended family · 9 weights</p>
                </div>
                <div class="hero__mockup-badges">
                  <span class="hero__mockup-badge hero__mockup-badge--best">★ Best Match</span>
                  <span class="hero__mockup-badge hero__mockup-badge--paid">Commercial</span>
                </div>
              </div>

              <!-- Font preview -->
              <div class="hero__mockup-preview">
                <span style="font-family:'Arial',sans-serif;font-size:28px;font-weight:400;color:rgba(255,255,255,0.9);letter-spacing:-0.01em">The quick brown fox</span>
              </div>

              <!-- Links -->
              <div class="hero__mockup-links">
                <span class="hero__mockup-link hero__mockup-link--paid">
                  <i class="fa fa-circle-info"></i> View Details
                </span>
                <span class="hero__mockup-link hero__mockup-link--sub">
                  <i class="fa fa-layer-group"></i> All Weights
                </span>
                <span class="hero__mockup-link hero__mockup-link--free">
                  <i class="fa fa-wand-magic-sparkles"></i> Free Look-alikes
                </span>
              </div>
            </div>

            <!-- Floating tag -->
            <div class="hero__mockup-tag">
              <i class="fa fa-bolt"></i>
              Detected in 4.2s
            </div>

            <!-- More results indicator -->
            <p class="hero__mockup-more">+ 9 more matches ranked below</p>

          </div>
        </div>
        <!-- end right -->

      </div>

      <!-- Bottom bar -->
      <div class="hero__bottom">
        <div class="container">
          <div class="hero__bottom-inner">
            <span class="hero__bottom-item">
              <i class="fa fa-circle-check"></i> 100% Free
            </span>
            <span class="hero__bottom-sep">·</span>
            <span class="hero__bottom-item">
              <i class="fa fa-circle-check"></i> No signup
            </span>
            <span class="hero__bottom-sep">·</span>
            <span class="hero__bottom-item">
              <i class="fa fa-circle-check"></i> Works on mobile
            </span>
            <span class="hero__bottom-sep">·</span>
            <span class="hero__bottom-item">
              <i class="fa fa-circle-check"></i> 900K+ fonts
            </span>
            <span class="hero__bottom-sep">·</span>
            <span class="hero__bottom-item">
              <i class="fa fa-circle-check"></i> Instant results
            </span>
          </div>
        </div>
      </div>

    </section>
  `;
}

export function init() {
  const fileInput    = document.getElementById('file-input');
  const urlInput     = document.getElementById('url-input');
  const urlClear     = document.getElementById('url-clear');
  const heroTool     = document.getElementById('hero-tool');
  const heroCtas     = document.getElementById('hero-ctas');
  const heroTips     = document.getElementById('hero-tips');
  const heroDragHint = document.getElementById('hero-drag-hint');
  const previewImg   = document.getElementById('preview-img');
  const previewName  = document.getElementById('preview-name');
  const previewSize  = document.getElementById('preview-size');
  const removeBtn    = document.getElementById('remove-preview');
  const submitBtn    = document.getElementById('submit-btn');

  window._ff = {};

  // ── File upload ──────────────────────────────────────────
  fileInput?.addEventListener('change', e => {
    const file = e.target.files[0];
    if (file) handleFile(file);
  });

  // ── URL input ────────────────────────────────────────────
  urlInput?.addEventListener('input', () => {
    urlClear.classList.toggle('hidden', !urlInput.value);
  });
  urlInput?.addEventListener('keydown', e => {
    if (e.key === 'Enter') {
      const val = urlInput.value.trim();
      if (val) handleUrl(val);
    }
  });
  urlClear?.addEventListener('click', () => {
    urlInput.value = '';
    urlClear.classList.add('hidden');
    urlInput.focus();
  });

  // ── Remove preview ───────────────────────────────────────
  removeBtn?.addEventListener('click', reset);

  // ── Submit ───────────────────────────────────────────────
  submitBtn?.addEventListener('click', () => {
    document.dispatchEvent(new CustomEvent('ff:submit'));
  });

  function handleFile(file) {
    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!validTypes.includes(file.type)) return alert('Please use JPG, PNG, GIF, or WebP.');
    if (file.size > 4 * 1024 * 1024) return alert('File too large — max 4MB.');
    window._ff = { file, urlMode: false };
    const reader = new FileReader();
    reader.onload = e => {
      previewImg.src = e.target.result;
      previewName.textContent = file.name;
      previewSize.textContent = fmtBytes(file.size) + ' · ready to identify';
      showTool();
    };
    reader.readAsDataURL(file);
  }

  function handleUrl(url) {
    if (!url.match(/^https?:\/\//i)) return alert('Please enter a valid image URL.');
    window._ff = { url, urlMode: true };
    previewImg.src = url;
    previewImg.onerror = () => alert('Could not load that image URL. Check the link and try again.');
    previewName.textContent = 'Image from URL';
    previewSize.textContent = url.length > 48 ? url.slice(0, 48) + '…' : url;
    showTool();
  }

  function showTool() {
    heroCtas?.classList.add('hidden');
    heroTips?.classList.add('hidden');
    heroDragHint?.classList.add('hidden');
    heroTool?.classList.remove('hidden');
    heroTool?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  function reset() {
    heroCtas?.classList.remove('hidden');
    heroTips?.classList.remove('hidden');
    heroDragHint?.classList.remove('hidden');
    heroTool?.classList.add('hidden');
    if (fileInput) fileInput.value = '';
    if (urlInput)  urlInput.value  = '';
    previewImg.src = '';
    window._ff = {};
    document.dispatchEvent(new CustomEvent('ff:reset'));
  }

  function fmtBytes(b) {
    if (b < 1024) return b + ' B';
    if (b < 1048576) return (b / 1024).toFixed(0) + ' KB';
    return (b / 1048576).toFixed(1) + ' MB';
  }

  window._ff.reset = reset;
}
