/* ============================================================
   Shared page layout — mounts header + footer on inner pages
   ============================================================ */
import { render as renderHeader, init as initHeader } from '../components/Header.js';
import { render as renderFooter, init as initFooter } from '../components/Footer.js';

export function mountLayout() {
  // Header
  const headerMount = document.getElementById('header-mount');
  if (headerMount) {
    headerMount.innerHTML = renderHeader();
    initHeader();
  }

  // Footer
  const footerMount = document.getElementById('footer-mount');
  if (footerMount) {
    footerMount.innerHTML = renderFooter();
    initFooter();
  }

  // Mark JS ready for animations
  document.body.classList.add('js-ready');

  // Stagger all anim-up elements into view after a brief paint delay.
  // Content pages show everything on load; transition-delay CSS provides the cascade.
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      document.querySelectorAll('.anim-up').forEach((el, i) => {
        if (!el.style.transitionDelay) {
          el.style.transitionDelay = `${Math.min(i * 0.04, 0.4)}s`;
        }
        el.classList.add('visible');
      });
    });
  });
}
