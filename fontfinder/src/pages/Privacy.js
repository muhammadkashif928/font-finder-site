/* ============================================================
   Privacy Policy Page
   ============================================================ */

export function render() {
  const sections = [
    { title: 'What We Collect', content: 'FontFinder does not require an account. When you use the font identification tool, your uploaded image is processed in memory to detect fonts and is <strong>never stored on our servers</strong>. If you use the URL mode, we process the image from the provided URL without storing the file. We may collect anonymous usage analytics (page views, tool interactions) to improve the service.' },
    { title: 'How We Use Your Data', content: 'Image data is used solely to perform font identification and is discarded immediately after processing. Anonymous analytics data is used to understand usage patterns and improve FontFinder. We do not sell, share, or trade any user data with third parties.' },
    { title: 'Cookies', content: 'We use essential cookies to operate the site (e.g. session state). We may use analytics cookies (e.g. from a privacy-respecting analytics provider) to understand how the site is used. You can disable cookies in your browser settings; this will not affect font identification functionality.' },
    { title: 'Third-Party Services', content: 'FontFinder uses a third-party font recognition API to identify fonts from images. Images are transmitted to this API for processing and are not retained by that service beyond the request. We use CDN services to deliver fonts for preview purposes.' },
    { title: 'Data Retention', content: 'We do not retain uploaded images or URLs. Anonymous analytics data may be retained for up to 12 months. If you contact us via our contact form, your message is retained only for the purpose of responding to your enquiry.' },
    { title: 'Your Rights', content: 'Since we do not collect personally identifiable information in normal use, there is no personal data to access, correct, or delete. If you submitted a contact form, you may request deletion of that data by emailing hello@fontfinder.app.' },
    { title: 'Children\'s Privacy', content: 'FontFinder is not directed at children under the age of 13. We do not knowingly collect personal information from children.' },
    { title: 'Changes to This Policy', content: 'We may update this Privacy Policy from time to time. Changes will be posted on this page with an updated effective date. Continued use of FontFinder constitutes acceptance of the updated policy.' },
    { title: 'Contact', content: 'If you have any questions about this Privacy Policy, please contact us at <a href="/contact">hello@fontfinder.app</a>.' },
  ];

  return `
    <section class="inner-page legal-page">
      <div class="container inner-content legal-content">
        <div class="legal-header anim-up">
          <div class="inner-hero__badge"><i class="fa fa-shield"></i> Privacy Policy</div>
          <h1 class="legal-header__title">Privacy Policy</h1>
          <p class="legal-header__date">Effective: January 1, 2025</p>
          <p class="legal-header__intro">
            FontFinder is built with privacy in mind. We collect the minimum data
            necessary to operate the service and never sell your information.
          </p>
        </div>

        <div class="legal-sections">
          ${sections.map((s, i) => `
            <div class="legal-section anim-up" style="transition-delay:${i * 0.04}s">
              <h2 class="legal-section__title">${i + 1}. ${s.title}</h2>
              <p class="legal-section__text">${s.content}</p>
            </div>
          `).join('')}
        </div>
      </div>
    </section>
  `;
}

export function init() {
  // Animations handled by page-layout.js mountLayout()
}
