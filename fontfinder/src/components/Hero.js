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

            <!-- Crop + Identify buttons -->
            <div class="hero__action-row">
              <button class="hero__crop-btn" id="crop-btn">
                <i class="fa fa-crop-simple"></i>
                Crop Selection
              </button>
              <button class="hero__identify-btn" id="submit-btn">
                <i class="fa fa-magnifying-glass"></i>
                Identify Font Now
              </button>
            </div>

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

      <!-- ── Inline Crop Section ─────────────────────────── -->
      <div class="crop-section hidden" id="crop-section">

        <!-- Top bar -->
        <div class="crop-section__topbar">
          <div class="crop-section__file-info">
            <i class="fa fa-image"></i>
            <span id="crop-filename">image.jpg</span>
          </div>
          <div class="crop-section__instructions">
            <i class="fa fa-hand-pointer"></i>
            Draw a box around the text you want to identify
          </div>
          <button class="crop-section__back" id="crop-back-btn">
            <i class="fa fa-xmark"></i> Change Image
          </button>
        </div>

        <!-- Canvas area -->
        <div class="crop-section__canvas-area" id="crop-canvas-wrap">
          <canvas id="crop-canvas"></canvas>

          <!-- Floating tooltip on selection -->
          <div class="crop-tooltip hidden" id="crop-tooltip">
            <button class="crop-tooltip__btn crop-tooltip__btn--primary" id="crop-confirm">
              <i class="fa fa-magnifying-glass"></i> Identify font
            </button>
            <div class="crop-tooltip__sep"></div>
            <button class="crop-tooltip__btn" id="crop-remove-sel">
              <i class="fa fa-trash"></i> Remove
            </button>
          </div>

          <!-- Drag hint -->
          <div class="crop-section__hint" id="crop-hint">
            <i class="fa fa-hand-pointer"></i> Click and drag to select the text you want to identify
          </div>
        </div>

        <!-- Text detection bar (shown after selection) -->
        <div class="crop-text-bar hidden" id="crop-text-bar">
          <canvas id="crop-thumb-canvas" class="crop-text-bar__thumb"></canvas>
          <div class="crop-text-bar__right">
            <div class="crop-text-bar__ocr-row">
              <i class="fa fa-font crop-text-bar__icon"></i>
              <span class="crop-text-bar__label" id="crop-ocr-status">Detecting text…</span>
            </div>
            <input
              type="text"
              id="crop-text-input"
              class="crop-text-bar__input"
              placeholder="Type the text you see in the selection…"
            >
          </div>
          <button class="hero__identify-btn crop-text-bar__btn" id="crop-identify-btn">
            <i class="fa fa-magnifying-glass"></i> Identify Font
          </button>
        </div>

        <!-- Bottom toolbar -->
        <div class="crop-toolbar">
          <label class="crop-toolbar__btn" for="crop-new-input">
            <i class="fa fa-arrow-up-from-bracket"></i> Upload new
          </label>
          <input type="file" id="crop-new-input" accept="image/*" class="visually-hidden">
          <div class="crop-toolbar__sep"></div>
          <div class="crop-toolbar__rotate">
            <i class="fa fa-rotate"></i>
            <span class="crop-toolbar__rotate-label">Rotate</span>
            <span class="crop-rotate-val">-180°</span>
            <input type="range" id="crop-rotate" min="-180" max="180" value="0" class="crop-rotate-slider">
            <span class="crop-rotate-val">+180°</span>
          </div>
          <div class="crop-toolbar__sep"></div>
          <button class="crop-toolbar__btn" id="crop-reset-btn">
            <i class="fa fa-undo"></i> Reset
          </button>
        </div>

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
    if (file.size > 5 * 1024 * 1024) return alert('File too large — max 5MB.');
    window._ff = { file, urlMode: false };
    const reader = new FileReader();
    reader.onload = ev => {
      previewImg.src = ev.target.result;
      previewName.textContent = file.name;
      previewSize.textContent = fmtBytes(file.size) + ' · ready to identify';
      showTool();
      // Auto-open crop editor immediately
      openEditorFromSrc(ev.target.result);
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

  // ── Crop Section ─────────────────────────────────────────
  const cropBtn      = document.getElementById('crop-btn');
  const cropSection  = document.getElementById('crop-section');
  const cropCanvas   = document.getElementById('crop-canvas');
  const cropHint     = document.getElementById('crop-hint');
  const cropTooltip  = document.getElementById('crop-tooltip');
  const cropConfirm  = document.getElementById('crop-confirm');
  const cropRemoveSel= document.getElementById('crop-remove-sel');
  const cropResetBtn = document.getElementById('crop-reset-btn');
  const cropNewInput = document.getElementById('crop-new-input');
  const cropRotate   = document.getElementById('crop-rotate');

  let cs = { dragging:false, startX:0, startY:0, rect:null, img:null, scale:1, rotation:0 };
  let _croppedDataURL = '';

  cropBtn?.addEventListener('click', openCropSection);
  document.getElementById('crop-back-btn')?.addEventListener('click', closeCropSection);

  cropNewInput?.addEventListener('change', e => {
    const f = e.target.files[0];
    if (f) handleFile(f);
  });

  function openEditorFromSrc(src, filename) {
    const img = new Image();
    img.onload = () => {
      cs = { dragging:false, startX:0, startY:0, rect:null, img, scale:1, rotation:0 };
      if (cropRotate) cropRotate.value = 0;
      cropTooltip?.classList.add('hidden');
      cropHint?.classList.remove('hidden');
      document.getElementById('crop-text-bar')?.classList.add('hidden');
      const fnEl = document.getElementById('crop-filename');
      if (fnEl && filename) fnEl.textContent = filename;
      // Hide hero content, show inline crop section
      document.getElementById('hero-ctas')?.classList.add('hidden');
      document.getElementById('hero-tool')?.classList.add('hidden');
      document.getElementById('hero-tips')?.classList.add('hidden');
      document.getElementById('hero-drag-hint')?.classList.add('hidden');
      document.querySelector('.hero__right')?.classList.add('hidden');
      cropSection?.classList.remove('hidden');
      cropSection?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      // Wait for layout before sizing canvas
      requestAnimationFrame(() => requestAnimationFrame(() => setupCropCanvas(img)));
    };
    img.src = src;
  }

  function openCropSection() {
    const src = previewImg.src;
    if (!src || src === window.location.href) return;
    openEditorFromSrc(src, previewName?.textContent || '');
  }

  function closeCropSection() {
    cropSection?.classList.add('hidden');
    document.getElementById('hero-ctas')?.classList.remove('hidden');
    document.getElementById('hero-tips')?.classList.remove('hidden');
    document.getElementById('hero-drag-hint')?.classList.remove('hidden');
    document.querySelector('.hero__right')?.classList.remove('hidden');
    reset();
  }

  cropRotate?.addEventListener('input', () => {
    cs.rotation = parseInt(cropRotate.value);
    cs.rect = null;
    cropTooltip?.classList.add('hidden');
    document.getElementById('crop-text-bar')?.classList.add('hidden');
    redrawCrop();
  });

  cropResetBtn?.addEventListener('click', () => {
    cs.rect = null; cs.rotation = 0;
    if (cropRotate) cropRotate.value = 0;
    cropTooltip?.classList.add('hidden');
    cropHint?.classList.remove('hidden');
    document.getElementById('crop-text-bar')?.classList.add('hidden');
    redrawCrop();
  });

  cropRemoveSel?.addEventListener('click', () => {
    cs.rect = null;
    cropTooltip?.classList.add('hidden');
    cropHint?.classList.remove('hidden');
    document.getElementById('crop-text-bar')?.classList.add('hidden');
    redrawCrop();
  });

  function setupCropCanvas(img) {
    const wrap  = document.getElementById('crop-canvas-wrap');
    const maxW  = (wrap?.clientWidth  || window.innerWidth)  - 0;
    const maxH  = (wrap?.clientHeight || Math.round(window.innerHeight * 0.62)) - 0;
    const scale = Math.min(maxW / img.naturalWidth, maxH / img.naturalHeight, 1);
    cropCanvas.width  = Math.round(img.naturalWidth  * scale);
    cropCanvas.height = Math.round(img.naturalHeight * scale);
    cs.scale = scale;
    redrawCrop();
  }

  function redrawCrop() {
    const { img, rect, scale, rotation } = cs;
    if (!img) return;
    const ctx = cropCanvas.getContext('2d');
    const cw  = cropCanvas.width, ch = cropCanvas.height;
    ctx.clearRect(0, 0, cw, ch);

    // Draw image
    ctx.save();
    ctx.translate(cw/2, ch/2);
    ctx.rotate((rotation * Math.PI) / 180);
    ctx.drawImage(img, -cw/2, -ch/2, cw, ch);
    ctx.restore();

    if (!rect || Math.abs(rect.w) < 4 || Math.abs(rect.h) < 4) return;

    const rx = Math.min(rect.x, rect.x + rect.w);
    const ry = Math.min(rect.y, rect.y + rect.h);
    const rw = Math.abs(rect.w);
    const rh = Math.abs(rect.h);

    // Soft 30% dim outside selection
    ctx.fillStyle = 'rgba(0,0,0,0.32)';
    ctx.fillRect(0, 0, cw, ch);

    // Restore crisp image inside selection
    ctx.save();
    ctx.beginPath();
    ctx.rect(rx, ry, rw, rh);
    ctx.clip();
    ctx.translate(cw/2, ch/2);
    ctx.rotate((rotation * Math.PI) / 180);
    ctx.drawImage(img, -cw/2, -ch/2, cw, ch);
    ctx.restore();

    // Dashed white border
    ctx.strokeStyle = 'rgba(255,255,255,0.95)';
    ctx.lineWidth   = 1.5;
    ctx.setLineDash([6, 4]);
    ctx.strokeRect(rx, ry, rw, rh);
    ctx.setLineDash([]);

    // Corner handles
    ctx.fillStyle = '#fff';
    [[rx,ry],[rx+rw,ry],[rx,ry+rh],[rx+rw,ry+rh]].forEach(([hx,hy]) => {
      ctx.fillRect(hx-4, hy-4, 8, 8);
    });

    positionCropTooltip(rx, ry, rw, rh);
  }

  function positionCropTooltip(rx, ry, rw, rh) {
    if (!cropTooltip || !cropCanvas || !cropSection) return;
    const cr = cropCanvas.getBoundingClientRect();
    const sr = cropSection.getBoundingClientRect();
    const sx = cr.width  / cropCanvas.width;
    const sy = cr.height / cropCanvas.height;
    let left = cr.left - sr.left + (rx + rw/2) * sx;
    let top  = cr.top  - sr.top  + (ry + rh)   * sy + 12;
    const tw = 220;
    left = Math.max(8, Math.min(left - tw/2, sr.width - tw - 8));
    top  = Math.min(top, sr.height - 100);
    cropTooltip.style.left = left + 'px';
    cropTooltip.style.top  = top  + 'px';
    cropTooltip.classList.remove('hidden');
  }

  // Mouse events
  cropCanvas?.addEventListener('mousedown', e => {
    const p = cpPos(e);
    cs.dragging=true; cs.startX=p.x; cs.startY=p.y;
    cs.rect={x:p.x, y:p.y, w:0, h:0};
    cropHint?.classList.add('hidden');
    cropTooltip?.classList.add('hidden');
    document.getElementById('crop-text-bar')?.classList.add('hidden');
    e.preventDefault();
  });
  cropCanvas?.addEventListener('mousemove', e => {
    if (!cs.dragging) return;
    const p = cpPos(e);
    cs.rect={x:cs.startX, y:cs.startY, w:p.x-cs.startX, h:p.y-cs.startY};
    redrawCrop();
  });
  cropCanvas?.addEventListener('mouseup',    () => finishCropDrag());
  cropCanvas?.addEventListener('mouseleave', () => { if (cs.dragging) finishCropDrag(); });

  // Touch events
  cropCanvas?.addEventListener('touchstart', e => {
    const p = cpPos(e.touches[0]);
    cs.dragging=true; cs.startX=p.x; cs.startY=p.y;
    cs.rect={x:p.x, y:p.y, w:0, h:0};
    cropHint?.classList.add('hidden');
    cropTooltip?.classList.add('hidden');
    e.preventDefault();
  }, {passive:false});
  cropCanvas?.addEventListener('touchmove', e => {
    if (!cs.dragging) return;
    const p = cpPos(e.touches[0]);
    cs.rect={x:cs.startX, y:cs.startY, w:p.x-cs.startX, h:p.y-cs.startY};
    redrawCrop();
    e.preventDefault();
  }, {passive:false});
  cropCanvas?.addEventListener('touchend', () => finishCropDrag());

  function finishCropDrag() {
    cs.dragging = false;
    const {rect} = cs;
    if (!rect || Math.abs(rect.w) < 10 || Math.abs(rect.h) < 10) return;
    showTextBar();
  }

  async function showTextBar() {
    const {img, rect, scale, rotation} = cs;
    if (!rect || !img) return;

    const rx = Math.round(Math.min(rect.x, rect.x+rect.w) / scale);
    const ry = Math.round(Math.min(rect.y, rect.y+rect.h) / scale);
    const rw = Math.round(Math.abs(rect.w) / scale);
    const rh = Math.round(Math.abs(rect.h) / scale);

    // Crop to offscreen canvas
    const off = document.createElement('canvas');
    off.width=rw; off.height=rh;
    const oc = off.getContext('2d');
    oc.save();
    oc.translate(rw/2 - rx, rh/2 - ry);
    oc.rotate((rotation * Math.PI) / 180);
    oc.drawImage(img, -img.naturalWidth/2, -img.naturalHeight/2);
    oc.restore();
    _croppedDataURL = off.toDataURL('image/png');

    // Draw thumbnail
    const thumbCanvas = document.getElementById('crop-thumb-canvas');
    if (thumbCanvas) {
      const maxT = 80;
      const ts = Math.min(maxT/rw, maxT/rh, 1);
      thumbCanvas.width  = Math.max(1, Math.round(rw * ts));
      thumbCanvas.height = Math.max(1, Math.round(rh * ts));
      thumbCanvas.getContext('2d').drawImage(off, 0, 0, thumbCanvas.width, thumbCanvas.height);
    }

    const textBar   = document.getElementById('crop-text-bar');
    const statusEl  = document.getElementById('crop-ocr-status');
    const textInput = document.getElementById('crop-text-input');
    textBar?.classList.remove('hidden');
    if (statusEl)  statusEl.textContent = 'Detecting text…';
    if (textInput) textInput.value = '';

    // Lazy-load Tesseract.js for OCR
    try {
      const { createWorker } = await import('tesseract.js');
      const worker = await createWorker('eng', 1, { logger: () => {} });
      const { data } = await worker.recognize(off);
      await worker.terminate();
      const detected = data.text.trim().replace(/\s+/g, ' ').slice(0, 80);
      if (statusEl)  statusEl.textContent = detected ? 'Detected — edit if needed:' : 'No text detected — type manually:';
      if (textInput && detected) textInput.value = detected;
    } catch {
      if (statusEl) statusEl.textContent = 'Type the text you see:';
    }
  }

  document.getElementById('crop-identify-btn')?.addEventListener('click', () => {
    const textInput = document.getElementById('crop-text-input');
    submitCrop(textInput?.value?.trim() || '');
  });

  // "Identify font" in tooltip → show text bar first
  cropConfirm?.addEventListener('click', () => showTextBar());

  function submitCrop(detectedText) {
    const {img, rect, scale, rotation} = cs;
    if (!img) return;

    const rx = rect ? Math.round(Math.min(rect.x, rect.x+rect.w) / scale) : 0;
    const ry = rect ? Math.round(Math.min(rect.y, rect.y+rect.h) / scale) : 0;
    const rw = rect ? Math.round(Math.abs(rect.w) / scale) : img.naturalWidth;
    const rh = rect ? Math.round(Math.abs(rect.h) / scale) : img.naturalHeight;

    const off = document.createElement('canvas');
    off.width=rw; off.height=rh;
    const oc = off.getContext('2d');
    oc.save();
    oc.translate(rw/2-rx, rh/2-ry);
    oc.rotate((rotation * Math.PI) / 180);
    oc.drawImage(img, -img.naturalWidth/2, -img.naturalHeight/2);
    oc.restore();

    off.toBlob(blob => {
      if (!blob) return;
      window._ff.file         = new File([blob], 'cropped.png', {type:'image/png'});
      window._ff.urlMode      = false;
      window._ff.detectedText = detectedText;
      window._ff.croppedThumb = _croppedDataURL;
      previewImg.src          = _croppedDataURL || URL.createObjectURL(blob);
      previewName.textContent = 'Cropped selection';
      previewSize.textContent = fmtBytes(blob.size) + ' · ready';
      closeCropSection();
      document.dispatchEvent(new CustomEvent('ff:submit'));
    }, 'image/png');
  }

  function cpPos(e) {
    const r = cropCanvas.getBoundingClientRect();
    return {
      x: Math.max(0, Math.min(cropCanvas.width,  (e.clientX - r.left) * (cropCanvas.width  / r.width))),
      y: Math.max(0, Math.min(cropCanvas.height, (e.clientY - r.top)  * (cropCanvas.height / r.height))),
    };
  }
}
