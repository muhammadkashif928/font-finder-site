/* ============================================================
   Testimonials — Twitter/social card grid
   ============================================================ */

const TESTIMONIALS = [
  {
    name: 'Alex Rivera',
    handle: '@alexrivera_design',
    avatar: 'AR',
    color: '#6366f1',
    stars: 5,
    text: 'FontFinder saved my project. Client sent a logo with no font name, I uploaded it and had the answer in 4 seconds. Absolute lifesaver.',
  },
  {
    name: 'Mia Chen',
    handle: '@miachen_ux',
    avatar: 'MC',
    color: '#a855f7',
    stars: 5,
    text: "I've tried every font identification tool out there. This is the fastest and most accurate one, and it's completely free. I'm blown away.",
  },
  {
    name: 'James Okafor',
    handle: '@jamesokafor',
    avatar: 'JO',
    color: '#22d3ee',
    stars: 5,
    text: 'As a freelance designer, I identify fonts almost daily. FontFinder is now my first stop every single time. The purchase links are a nice bonus too.',
  },
  {
    name: 'Priya Nair',
    handle: '@priyanair_brand',
    avatar: 'PN',
    color: '#34d399',
    stars: 5,
    text: 'The free alternatives section is genius. Clients always want expensive fonts, now I just use FontFinder to suggest look-alikes that match perfectly.',
  },
  {
    name: 'Tom Dahl',
    handle: '@tomdahl_creative',
    avatar: 'TD',
    color: '#f87171',
    stars: 5,
    text: 'Drag and drop from anywhere on the page is so smooth. I dropped a screenshot from my second monitor and it just worked. Impressive.',
  },
  {
    name: 'Leila Hassan',
    handle: '@leilahassan',
    avatar: 'LH',
    color: '#fbbf24',
    stars: 5,
    text: "Used FontFinder to reverse-engineer a competitor's rebrand. Identified 3 fonts from their homepage hero in under a minute. Incredibly powerful.",
  },
];

export function render() {
  const cards = TESTIMONIALS.map((t, i) => `
    <article class="testi-card anim-up" style="transition-delay:${(i % 3) * 0.1}s" aria-label="Testimonial from ${t.name}">
      <div class="testi-card__top">
        <div class="testi-card__avatar" style="--av-color:${t.color}">${t.avatar}</div>
        <div class="testi-card__meta">
          <p class="testi-card__name">${t.name}</p>
          <p class="testi-card__handle">${t.handle}</p>
        </div>
        <div class="testi-card__twitter" aria-hidden="true">
          <i class="fa-brands fa-x-twitter"></i>
        </div>
      </div>
      <div class="testi-card__stars" aria-label="${t.stars} out of 5 stars">
        ${Array(t.stars).fill('<i class="fa fa-star" aria-hidden="true"></i>').join('')}
      </div>
      <p class="testi-card__text">${t.text}</p>
    </article>
  `).join('');

  return `
    <section class="testimonials section" id="testimonials">
      <div class="container">
        <div class="testimonials__header">
          <p class="section-label">Testimonials</p>
          <h2 class="heading-lg testimonials__title">
            Trusted by the<br><span class="grad-text">design community</span>
          </h2>
        </div>
        <div class="testimonials__grid">
          ${cards}
        </div>
      </div>
    </section>
  `;
}

export function init() {
  const els = document.querySelectorAll('.testi-card.anim-up');
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); } });
  }, { threshold: 0.12 });
  els.forEach(el => obs.observe(el));
}
