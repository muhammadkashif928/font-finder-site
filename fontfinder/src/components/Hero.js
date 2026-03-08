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

      <!-- ── Crop Modal ──────────────────────────────────── -->
      <div class="crop-modal hidden" id="crop-modal" role="dialog" aria-modal="true" aria-label="Crop image">
        <div class="crop-modal__backdrop" id="crop-backdrop"></div>
        <div class="crop-modal__box">
          <div class="crop-modal__head">
            <div>
              <h3 class="crop-modal__title"><i class="fa fa-crop-simple"></i> Select Text Area</h3>
              <p class="crop-modal__sub">Draw a box around the text or word you want to identify</p>
            </div>
            <button class="crop-modal__close" id="crop-close" aria-label="Close">
              <i class="fa fa-xmark"></i>
            </button>
          </div>
          <div class="crop-modal__canvas-wrap" id="crop-canvas-wrap">
            <canvas id="crop-canvas"></canvas>
            <div class="crop-modal__hint" id="crop-hint">
              <i class="fa fa-hand-pointer"></i> Click and drag to select the text area
            </div>
          </div>
          <div class="crop-modal__footer">
            <div class="crop-modal__selection-info" id="crop-info"></div>
            <div class="crop-modal__actions">
              <button class="btn btn-ghost" id="crop-cancel">Use Full Image</button>
              <button class="hero__identify-btn crop-modal__confirm hidden" id="crop-confirm">
                <i class="fa fa-crop-simple"></i> Crop &amp; Identify
              </button>
            </div>
          </div>
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

  // ── Crop feature ─────────────────────────────────────────
  const cropBtn     = document.getElementById('crop-btn');
  const cropModal   = document.getElementById('crop-modal');
  const cropClose   = document.getElementById('crop-close');
  const cropCancel  = document.getElementById('crop-cancel');
  const cropConfirm = document.getElementById('crop-confirm');
  const cropBackdrop= document.getElementById('crop-backdrop');
  const cropCanvas  = document.getElementById('crop-canvas');
  const cropHint    = document.getElementById('crop-hint');
  const cropInfo    = document.getElementById('crop-info');

  let cropState = { dragging: false, startX: 0, startY: 0, rect: null, img: null, scale: 1 };

  cropBtn?.addEventListener('click', openCropper);
  cropClose?.addEventListener('click', closeCropper);
  cropBackdrop?.addEventListener('click', closeCropper);
  cropCancel?.addEventListener('click', () => {
    closeCropper();
    document.dispatchEvent(new CustomEvent('ff:submit'));
  });

  function openCropper() {
    const src = previewImg.src;
    if (!src) return;
    const img = new Image();
    img.onload = () => {
      cropState.img  = img;
      cropState.rect = null;
      cropConfirm?.classList.add('hidden');
      cropInfo.textContent = '';
      cropHint?.classList.remove('hidden');
      setupCanvas(img);
      cropModal?.classList.remove('hidden');
      document.body.style.overflow = 'hidden';
    };
    img.src = src;
  }

  function closeCropper() {
    cropModal?.classList.add('hidden');
    document.body.style.overflow = '';
  }

  function setupCanvas(img) {
    const wrap  = document.getElementById('crop-canvas-wrap');
    const maxW  = Math.min(wrap.clientWidth - 32, 860);
    const maxH  = Math.min(window.innerHeight * 0.55, 520);
    const scale = Math.min(maxW / img.naturalWidth, maxH / img.naturalHeight, 1);
    const cw    = Math.round(img.naturalWidth  * scale);
    const ch    = Math.round(img.naturalHeight * scale);

    cropCanvas.width  = cw;
    cropCanvas.height = ch;
    cropState.scale   = scale;

    drawCanvas();
  }

  function drawCanvas() {
    const { img, rect, scale } = cropState;
    if (!img) return;
    const ctx = cropCanvas.getContext('2d');
    const cw  = cropCanvas.width;
    const ch  = cropCanvas.height;

    ctx.clearRect(0, 0, cw, ch);
    ctx.drawImage(img, 0, 0, cw, ch);

    if (rect && rect.w !== 0 && rect.h !== 0) {
      const x = Math.min(rect.x, rect.x + rect.w);
      const y = Math.min(rect.y, rect.y + rect.h);
      const w = Math.abs(rect.w);
      const h = Math.abs(rect.h);

      // Dim outside selection
      ctx.fillStyle = 'rgba(0,0,0,0.5)';
      ctx.fillRect(0, 0, cw, ch);
      ctx.clearRect(x, y, w, h);
      ctx.drawImage(img, x / scale, y / scale, w / scale, h / scale, x, y, w, h);

      // Border
      ctx.strokeStyle = '#6366f1';
      ctx.lineWidth   = 2;
      ctx.setLineDash([6, 3]);
      ctx.strokeRect(x, y, w, h);

      // Corner handles
      ctx.setLineDash([]);
      ctx.fillStyle = '#6366f1';
      [[x,y],[x+w,y],[x,y+h],[x+w,y+h]].forEach(([hx,hy]) => {
        ctx.fillRect(hx - 5, hy - 5, 10, 10);
      });

      // Show dimensions
      const natW = Math.round(w / scale);
      const natH = Math.round(h / scale);
      cropInfo.textContent = `Selection: ${natW} × ${natH}px`;
    }
  }

  // Mouse events on canvas
  cropCanvas?.addEventListener('mousedown', e => {
    const pos = getCanvasPos(e);
    cropState.dragging = true;
    cropState.startX   = pos.x;
    cropState.startY   = pos.y;
    cropState.rect     = { x: pos.x, y: pos.y, w: 0, h: 0 };
    cropHint?.classList.add('hidden');
    cropConfirm?.classList.add('hidden');
    e.preventDefault();
  });

  cropCanvas?.addEventListener('mousemove', e => {
    if (!cropState.dragging) return;
    const pos = getCanvasPos(e);
    cropState.rect = {
      x: cropState.startX, y: cropState.startY,
      w: pos.x - cropState.startX, h: pos.y - cropState.startY,
    };
    drawCanvas();
  });

  cropCanvas?.addEventListener('mouseup', () => finishDrag());
  cropCanvas?.addEventListener('mouseleave', () => { if (cropState.dragging) finishDrag(); });

  // Touch support
  cropCanvas?.addEventListener('touchstart', e => {
    const pos = getCanvasPos(e.touches[0]);
    cropState.dragging = true;
    cropState.startX   = pos.x;
    cropState.startY   = pos.y;
    cropState.rect     = { x: pos.x, y: pos.y, w: 0, h: 0 };
    cropHint?.classList.add('hidden');
    e.preventDefault();
  }, { passive: false });

  cropCanvas?.addEventListener('touchmove', e => {
    if (!cropState.dragging) return;
    const pos = getCanvasPos(e.touches[0]);
    cropState.rect = {
      x: cropState.startX, y: cropState.startY,
      w: pos.x - cropState.startX, h: pos.y - cropState.startY,
    };
    drawCanvas();
    e.preventDefault();
  }, { passive: false });

  cropCanvas?.addEventListener('touchend', () => finishDrag());

  function finishDrag() {
    cropState.dragging = false;
    const { rect } = cropState;
    if (!rect) return;
    const w = Math.abs(rect.w);
    const h = Math.abs(rect.h);
    if (w > 10 && h > 10) {
      cropConfirm?.classList.remove('hidden');
    }
  }

  cropConfirm?.addEventListener('click', () => {
    const { img, rect, scale } = cropState;
    if (!rect || !img) return;

    const x = Math.round(Math.min(rect.x, rect.x + rect.w) / scale);
    const y = Math.round(Math.min(rect.y, rect.y + rect.h) / scale);
    const w = Math.round(Math.abs(rect.w) / scale);
    const h = Math.round(Math.abs(rect.h) / scale);

    // Crop using offscreen canvas
    const offscreen = document.createElement('canvas');
    offscreen.width  = w;
    offscreen.height = h;
    const ctx = offscreen.getContext('2d');
    ctx.drawImage(img, x, y, w, h, 0, 0, w, h);

    offscreen.toBlob(blob => {
      if (!blob) return;
      const croppedFile = new File([blob], 'cropped.png', { type: 'image/png' });
      window._ff.file    = croppedFile;
      window._ff.urlMode = false;

      // Update preview
      const reader = new FileReader();
      reader.onload = e => {
        previewImg.src = e.target.result;
        previewName.textContent = 'Cropped selection';
        previewSize.textContent = fmtBytes(blob.size) + ' · ready to identify';
      };
      reader.readAsDataURL(croppedFile);

      closeCropper();
      document.dispatchEvent(new CustomEvent('ff:submit'));
    }, 'image/png');
  });

  function getCanvasPos(e) {
    const rect = cropCanvas.getBoundingClientRect();
    const scaleX = cropCanvas.width  / rect.width;
    const scaleY = cropCanvas.height / rect.height;
    return {
      x: Math.max(0, Math.min(cropCanvas.width,  (e.clientX - rect.left) * scaleX)),
      y: Math.max(0, Math.min(cropCanvas.height, (e.clientY - rect.top)  * scaleY)),
    };
  }
}
