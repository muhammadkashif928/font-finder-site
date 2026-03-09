import './style.css';
import './components/components.css';
import './pages/pages.css';
import { ARTICLES } from './data/blog-articles.js';
import * as Header from './components/Header.js';
import * as Footer from './components/Footer.js';

const app = document.getElementById('app');

// Get slug from URL: /blog/some-slug → some-slug
const slug = location.pathname.replace(/^\/blog\//, '').replace(/\/$/, '');
const article = ARTICLES[slug];

function renderNotFound() {
  return `
    <div style="text-align:center;padding:120px 20px">
      <p style="font-size:4rem">📄</p>
      <h1 style="color:var(--text);margin:16px 0 8px">Article not found</h1>
      <p style="color:var(--muted);margin-bottom:24px">We couldn't find that article.</p>
      <a href="/blog" style="color:#a5b4fc;text-decoration:none">← Back to Blog</a>
    </div>`;
}

function renderArticle(a) {
  return `
    <article class="blog-post-page">
      <div class="blog-post__hero">
        <div class="inner-hero__blob inner-hero__blob--1"></div>
        <div class="inner-hero__blob inner-hero__blob--2"></div>
        <div class="container">
          <a href="/blog" class="blog-post__back">
            <i class="fa fa-arrow-left"></i> All Articles
          </a>
          <div class="blog-post__meta">
            <span class="blog-post__cat">${a.category}</span>
            <span class="blog-post__dot">·</span>
            <span>${a.date}</span>
            <span class="blog-post__dot">·</span>
            <span><i class="fa fa-clock"></i> ${a.readTime}</span>
            <span class="blog-post__dot">·</span>
            <span>By ${a.author}</span>
          </div>
          <h1 class="blog-post__title">${a.title}</h1>
        </div>
      </div>
      <div class="container">
        <div class="blog-post__layout">
          <div class="blog-post__body">
            ${a.content}
          </div>
          <aside class="blog-post__sidebar">
            <div class="blog-post__cta-card">
              <p class="blog-post__cta-title">Identify any font instantly</p>
              <p class="blog-post__cta-sub">Upload an image and our AI will find the exact font in seconds.</p>
              <a href="/" class="hero__identify-btn" style="display:inline-flex;text-decoration:none;margin-top:8px">
                <i class="fa fa-magnifying-glass"></i> Try FontFinder Free
              </a>
            </div>
            <div class="blog-post__share">
              <p class="blog-post__share-label">Share this article</p>
              <div class="blog-post__share-btns">
                <a href="https://twitter.com/intent/tweet?text=${encodeURIComponent(a.title)}&url=${encodeURIComponent(location.href)}" target="_blank" rel="noopener" class="blog-post__share-btn">
                  <i class="fa-brands fa-x-twitter"></i>
                </a>
                <a href="https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(location.href)}" target="_blank" rel="noopener" class="blog-post__share-btn">
                  <i class="fa-brands fa-linkedin-in"></i>
                </a>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </article>`;
}

// Update meta tags
if (article) {
  document.title = `${article.title} — FontFinder Blog`;
  const desc = document.createElement('meta');
  desc.name = 'description';
  desc.content = article.content.replace(/<[^>]+>/g, '').slice(0, 160);
  document.head.appendChild(desc);
}

app.innerHTML = `
  <div id="header-mount"></div>
  <main>
    ${article ? renderArticle(article) : renderNotFound()}
  </main>
  <div id="footer-mount"></div>
`;

Header.init();
Footer.init();

// Init header/footer
document.getElementById('header-mount').innerHTML = Header.render();
document.getElementById('footer-mount').innerHTML = Footer.render();
Header.init();
Footer.init();
