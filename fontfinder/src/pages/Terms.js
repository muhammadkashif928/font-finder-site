/* ============================================================
   Terms of Use Page
   ============================================================ */

export function render() {
  const sections = [
    { title: 'Acceptance of Terms', content: 'By accessing or using FontFinder ("the Service"), you agree to be bound by these Terms of Use. If you do not agree, please do not use the Service.' },
    { title: 'Use of the Service', content: 'FontFinder provides a free font identification tool. You may use the Service for personal or commercial projects. You agree not to use the Service to process images that contain illegal content, violate third-party intellectual property rights, or for any unlawful purpose.' },
    { title: 'Font Licensing', content: 'FontFinder identifies fonts but does not license them. When you use a font identified through FontFinder, you are responsible for obtaining the appropriate license from the font\'s rights holder. FontFinder provides licensing information as a guide only — always verify the specific license before commercial use.' },
    { title: 'Intellectual Property', content: 'The FontFinder name, logo, website design, and original content are owned by FontFinder and protected by copyright law. You may not reproduce, distribute, or create derivative works without explicit written permission.' },
    { title: 'Disclaimer of Warranties', content: 'The Service is provided "as is" without warranty of any kind. We do not guarantee that font identification results will be accurate, complete, or error-free. Font recognition is a probabilistic process and results should be verified.' },
    { title: 'Limitation of Liability', content: 'FontFinder shall not be liable for any indirect, incidental, or consequential damages arising from your use of the Service, including any incorrect font identification results or reliance on information provided.' },
    { title: 'Third-Party Content', content: 'Font previews and identification data may be sourced from third-party databases. We are not responsible for the accuracy of third-party data and make no warranty regarding the completeness of font information.' },
    { title: 'Changes to Terms', content: 'We reserve the right to modify these Terms at any time. Changes will be effective upon posting to this page. Continued use of the Service constitutes acceptance of the revised Terms.' },
    { title: 'Governing Law', content: 'These Terms shall be governed by and construed in accordance with applicable law. Any disputes shall be resolved through good-faith negotiation or, if necessary, binding arbitration.' },
    { title: 'Contact', content: 'Questions about these Terms? Contact us at <a href="/contact">hello@fontfinder.app</a>.' },
  ];

  return `
    <section class="inner-page legal-page">
      <div class="container inner-content legal-content">
        <div class="legal-header anim-up">
          <div class="inner-hero__badge"><i class="fa fa-file-contract"></i> Terms of Use</div>
          <h1 class="legal-header__title">Terms of Use</h1>
          <p class="legal-header__date">Effective: January 1, 2025</p>
          <p class="legal-header__intro">
            Please read these Terms of Use carefully before using FontFinder.
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
