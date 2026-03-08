/* ============================================================
   Contact Page
   ============================================================ */

export function render() {
  return `
    <section class="inner-page contact-page">

      <div class="inner-hero">
        <div class="inner-hero__blob inner-hero__blob--1"></div>
        <div class="container inner-hero__inner">
          <div class="inner-hero__badge"><i class="fa fa-envelope"></i> Contact</div>
          <h1 class="inner-hero__title">Get in <span class="grad-text">Touch</span></h1>
          <p class="inner-hero__sub">
            Have a question, feedback, or a business enquiry? We'd love to hear from you.
          </p>
        </div>
      </div>

      <div class="container inner-content">

        <div class="contact-grid">

          <!-- Form -->
          <div class="contact-form-wrap anim-up">
            <h2 class="contact-form-wrap__title">Send us a message</h2>
            <form class="contact-form" id="contact-form" novalidate>

              <div class="contact-form__row">
                <div class="contact-form__field">
                  <label class="contact-form__label" for="c-name">Your Name</label>
                  <input type="text" id="c-name" name="name" class="contact-form__input" placeholder="Jane Smith" required />
                </div>
                <div class="contact-form__field">
                  <label class="contact-form__label" for="c-email">Email Address</label>
                  <input type="email" id="c-email" name="email" class="contact-form__input" placeholder="jane@example.com" required />
                </div>
              </div>

              <div class="contact-form__field">
                <label class="contact-form__label" for="c-subject">Subject</label>
                <select class="contact-form__input contact-form__select" id="c-subject" name="subject">
                  <option value="">Select a topic…</option>
                  <option value="question">General question</option>
                  <option value="feedback">Product feedback</option>
                  <option value="bug">Report a bug</option>
                  <option value="business">Business / Partnership</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div class="contact-form__field">
                <label class="contact-form__label" for="c-message">Message</label>
                <textarea id="c-message" name="message" class="contact-form__input contact-form__textarea"
                  placeholder="Tell us what's on your mind…" rows="5" required></textarea>
              </div>

              <button type="submit" class="contact-form__submit">
                <i class="fa fa-paper-plane"></i>
                Send Message
              </button>

              <div class="contact-form__success hidden" id="contact-success">
                <i class="fa fa-circle-check"></i>
                Message sent! We'll get back to you within 24 hours.
              </div>

            </form>
          </div>

          <!-- Info -->
          <div class="contact-info anim-up" style="transition-delay:0.1s">
            <div class="contact-info__card">
              <i class="fa fa-envelope contact-info__icon"></i>
              <p class="contact-info__label">Email</p>
              <p class="contact-info__val">hello@fontfinder.app</p>
            </div>
            <div class="contact-info__card">
              <i class="fa fa-clock contact-info__icon"></i>
              <p class="contact-info__label">Response Time</p>
              <p class="contact-info__val">Within 24 hours</p>
            </div>
            <div class="contact-info__card">
              <i class="fa fa-shield contact-info__icon"></i>
              <p class="contact-info__label">Privacy</p>
              <p class="contact-info__val">Your data is never sold or shared</p>
            </div>
          </div>

        </div>
      </div>
    </section>
  `;
}

export function init() {
  // Animations handled by page-layout.js mountLayout()

  document.getElementById('contact-form')?.addEventListener('submit', e => {
    e.preventDefault();
    const btn = e.target.querySelector('.contact-form__submit');
    btn.textContent = 'Sending…';
    btn.disabled = true;
    setTimeout(() => {
      document.getElementById('contact-success')?.classList.remove('hidden');
      btn.style.display = 'none';
    }, 1200);
  });
}
