/* ============================================================
   Footer — Internal pages only, no competitor links
   ============================================================ */

export function render() {
  const year = new Date().getFullYear();
  return `
    <footer class="footer" id="footer">
      <div class="footer__bg-text" aria-hidden="true">FONTFINDER</div>

      <div class="container">
        <div class="footer__main">

          <!-- Brand col -->
          <div class="footer__brand">
            <a href="/" class="footer__logo">
              <span class="footer__logo-mark"><i class="fa fa-font"></i></span>
              <span>Font<strong>Finder</strong></span>
            </a>
            <p class="footer__tagline">
              Identify any font from any image.<br>
              Free, instant, and privacy-first.
            </p>
            <div class="footer__social">
              <a href="#" class="footer__social-link" aria-label="Twitter / X"><i class="fa-brands fa-x-twitter"></i></a>
              <a href="#" class="footer__social-link" aria-label="Instagram"><i class="fa-brands fa-instagram"></i></a>
              <a href="#" class="footer__social-link" aria-label="Product Hunt"><i class="fa-brands fa-product-hunt"></i></a>
              <a href="#" class="footer__social-link" aria-label="GitHub"><i class="fa-brands fa-github"></i></a>
            </div>
          </div>

          <!-- Tool col -->
          <nav class="footer__col" aria-label="Tool">
            <p class="footer__col-title">Tool</p>
            <a href="/"             class="footer__col-link">Identify a Font</a>
            <a href="/browse"       class="footer__col-link">Browse Fonts</a>
            <a href="/categories"   class="footer__col-link">Font Categories</a>
            <a href="#features"     class="footer__col-link">Features</a>
            <a href="#how-it-works" class="footer__col-link">How It Works</a>
          </nav>

          <!-- Explore col -->
          <nav class="footer__col" aria-label="Explore">
            <p class="footer__col-title">Explore</p>
            <a href="/browse?cat=serif"       class="footer__col-link">Serif Fonts</a>
            <a href="/browse?cat=sans-serif"  class="footer__col-link">Sans-Serif Fonts</a>
            <a href="/browse?cat=script"      class="footer__col-link">Script &amp; Cursive</a>
            <a href="/browse?cat=display"     class="footer__col-link">Display Fonts</a>
            <a href="/browse?cat=monospace"   class="footer__col-link">Monospace Fonts</a>
          </nav>

          <!-- Company col -->
          <nav class="footer__col" aria-label="Company">
            <p class="footer__col-title">Company</p>
            <a href="/about"    class="footer__col-link">About FontFinder</a>
            <a href="/blog"     class="footer__col-link">Font Blog</a>
            <a href="/guides"   class="footer__col-link">Font Guides</a>
            <a href="/contact"  class="footer__col-link">Contact Us</a>
            <a href="/privacy"  class="footer__col-link">Privacy Policy</a>
            <a href="/terms"    class="footer__col-link">Terms of Use</a>
          </nav>

        </div>

        <div class="footer__bottom">
          <p class="footer__copy">© ${year} FontFinder. All rights reserved.</p>
          <p class="footer__powered">
            Built for designers &nbsp;·&nbsp; 100% Free &nbsp;·&nbsp; No account needed
          </p>
        </div>
      </div>
    </footer>
  `;
}

export function init() {
  document.querySelectorAll('.footer__col-link[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      const el = document.querySelector(link.getAttribute('href'));
      el?.scrollIntoView({ behavior: 'smooth' });
    });
  });
}
