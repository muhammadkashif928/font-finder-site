/* ============================================================
   About Page
   ============================================================ */

export function render() {
  return `
    <section class="inner-page about-page">

      <div class="inner-hero">
        <div class="inner-hero__blob inner-hero__blob--1"></div>
        <div class="inner-hero__blob inner-hero__blob--2"></div>
        <div class="container inner-hero__inner">
          <div class="inner-hero__badge"><i class="fa fa-font"></i> About FontFinder</div>
          <h1 class="inner-hero__title">Built for designers.<br><span class="grad-text">Free, forever.</span></h1>
          <p class="inner-hero__sub">
            FontFinder is a free font identification tool that lets designers, developers,
            and brand builders identify any font from any image in seconds.
          </p>
        </div>
      </div>

      <div class="container inner-content">

        <div class="about-grid">
          <!-- Story -->
          <div class="about-card anim-up">
            <div class="about-card__icon"><i class="fa fa-lightbulb"></i></div>
            <h2 class="about-card__title">Why FontFinder?</h2>
            <p class="about-card__text">
              Every designer has been there — you see a beautiful font used in a logo,
              a poster, or a website, and spend hours trying to figure out what it is.
              FontFinder was built to solve that problem in seconds.
            </p>
            <p class="about-card__text">
              We use advanced AI-powered font recognition to compare your image against
              a database of hundreds of thousands of fonts — giving you accurate matches,
              free alternatives, and everything you need to use that font yourself.
            </p>
          </div>

          <!-- Mission -->
          <div class="about-card anim-up" style="transition-delay:0.08s">
            <div class="about-card__icon"><i class="fa fa-bullseye"></i></div>
            <h2 class="about-card__title">Our Mission</h2>
            <p class="about-card__text">
              Typography is one of the most powerful tools in design, yet font identification
              has always been a friction point. Our mission is to make font discovery
              effortless — for beginners and professionals alike.
            </p>
            <p class="about-card__text">
              FontFinder will always be free. No account required. No upload limits.
              No paywalls. Good tools should be accessible to everyone.
            </p>
          </div>
        </div>

        <!-- Stats strip -->
        <div class="about-stats anim-up">
          <div class="about-stat">
            <p class="about-stat__num">900K<span>+</span></p>
            <p class="about-stat__label">Fonts in database</p>
          </div>
          <div class="about-stat">
            <p class="about-stat__num">&lt;8<span>s</span></p>
            <p class="about-stat__label">Average detection time</p>
          </div>
          <div class="about-stat">
            <p class="about-stat__num">100<span>%</span></p>
            <p class="about-stat__label">Free, always</p>
          </div>
          <div class="about-stat">
            <p class="about-stat__num">10<span>+</span></p>
            <p class="about-stat__label">Font matches per scan</p>
          </div>
        </div>

        <!-- How it's built -->
        <div class="about-tech anim-up">
          <h2 class="about-tech__title">How FontFinder Works</h2>
          <p class="about-tech__text">
            When you upload an image, FontFinder analyses the letterforms — their shape,
            weight, stroke contrast, and proportions — then compares these characteristics
            against a vast font database to rank the closest matches.
          </p>
          <p class="about-tech__text">
            We surface up to 10 ranked results per image, each with font details,
            free look-alike alternatives from our curated library, and licensing information
            so you know exactly what you can and can't do with each font.
          </p>
        </div>

        <!-- CTA -->
        <div class="about-cta anim-up">
          <a href="/" class="about-cta__btn">
            <i class="fa fa-magnifying-glass"></i>
            Try FontFinder Free
          </a>
          <a href="/browse" class="about-cta__ghost">
            <i class="fa fa-table-cells"></i>
            Browse Font Library
          </a>
        </div>

      </div>
    </section>
  `;
}

export function init() {
  // Animations handled by page-layout.js mountLayout()
}
