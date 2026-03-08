/* ============================================================
   FontFinder — Main App Entry
   ============================================================ */

// Global styles
import './style.css';
import './components/header.css';
import './components/components.css';

import * as Header       from './components/Header.js';
import * as Hero         from './components/Hero.js';
import * as Marquee      from './components/Marquee.js';
import * as Features     from './components/Features.js';
import * as Stats        from './components/Stats.js';
import * as Quote        from './components/Quote.js';
import * as Testimonials from './components/Testimonials.js';
import * as HowItWorks   from './components/HowItWorks.js';
import * as Faq          from './components/Faq.js';
import * as CtaBanner    from './components/CtaBanner.js';
import * as Results      from './components/Results.js';
import * as Footer       from './components/Footer.js';

// ── Mount ─────────────────────────────────────────────────────
document.getElementById('header-mount').innerHTML      = Header.render();
document.getElementById('hero-mount').innerHTML        = Hero.render();
document.getElementById('marquee-mount').innerHTML     = Marquee.render();
document.getElementById('features-mount').innerHTML    = Features.render();
document.getElementById('stats-mount').innerHTML       = Stats.render();
document.getElementById('quote-mount').innerHTML       = Quote.render();
document.getElementById('testimonials-mount').innerHTML= Testimonials.render();
document.getElementById('how-mount').innerHTML         = HowItWorks.render();
document.getElementById('faq-mount').innerHTML         = Faq.render();
document.getElementById('cta-mount').innerHTML         = CtaBanner.render();
document.getElementById('results-mount').innerHTML     = Results.render();
document.getElementById('footer-mount').innerHTML      = Footer.render();

// ── Init ──────────────────────────────────────────────────────
Header.init();
Hero.init();
Marquee.init();
Features.init();
Stats.init();
Quote.init();
Testimonials.init();
HowItWorks.init();
Faq.init();
CtaBanner.init();
Results.init();
Footer.init();

// ── Global Drag & Drop ────────────────────────────────────────
const overlay = document.getElementById('drag-overlay');
let dragCount = 0;

document.addEventListener('dragenter', e => {
  e.preventDefault();
  if (++dragCount === 1) overlay.classList.remove('hidden');
});
document.addEventListener('dragleave', () => {
  if (--dragCount <= 0) { dragCount = 0; overlay.classList.add('hidden'); }
});
document.addEventListener('dragover', e => e.preventDefault());
document.addEventListener('drop', e => {
  e.preventDefault();
  dragCount = 0;
  overlay.classList.add('hidden');

  const file = e.dataTransfer.files[0];
  if (!file) return;

  const valid = ['image/jpeg','image/png','image/gif','image/webp'];
  if (!valid.includes(file.type)) {
    alert('Please drop a JPG, PNG, GIF, or WebP image.');
    return;
  }

  const dt = new DataTransfer();
  dt.items.add(file);
  const fi = document.getElementById('file-input');
  fi.files = dt.files;
  fi.dispatchEvent(new Event('change'));
  document.getElementById('hero')?.scrollIntoView({ behavior: 'smooth' });
});

// ── Font Identification Flow ──────────────────────────────────
document.addEventListener('ff:submit', async () => {
  const state = window._ff;
  if (!state) return;

  Results.showLoading();

  try {
    let res, data;

    if (state.urlMode && state.url) {
      res  = await fetch('/api/detect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: state.url }),
      });
    } else if (state.file) {
      const fd = new FormData();
      fd.append('image', state.file);
      res = await fetch('/api/detect', { method: 'POST', body: fd });
    } else {
      throw new Error('No image selected. Please upload a file or paste an image URL.');
    }

    data = await res.json();
    if (!res.ok || data.error) throw new Error(data.error || `Server error (${res.status})`);
    // Pass detected text + cropped thumbnail from crop editor
    if (state.detectedText) data.detected_text  = state.detectedText;
    if (state.croppedThumb) data.cropped_thumb   = state.croppedThumb;
    Results.showResults(data);

  } catch (err) {
    Results.showError(err.message || 'Something went wrong. Please try again.');
  }
});

// ── Reset ─────────────────────────────────────────────────────
document.addEventListener('ff:reset', () => Results.hide());

// ── Scroll animation init ─────────────────────────────────────
const animEls = document.querySelectorAll('.anim-up');

// Trigger visible elements immediately (e.g. hero), rest on scroll
const scrollObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      scrollObs.unobserve(e.target);
    }
  });
}, { threshold: 0, rootMargin: '0px 0px 100px 0px' });

animEls.forEach(el => scrollObs.observe(el));

// Safety: show all after 1.5s in case IntersectionObserver doesn't fire (e.g. bots/crawlers)
setTimeout(() => {
  document.querySelectorAll('.anim-up:not(.visible)').forEach(el => {
    el.classList.add('visible');
  });
}, 1500);
