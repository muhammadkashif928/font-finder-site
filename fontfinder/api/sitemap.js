/**
 * FontFinder — Dynamic Sitemap Generator
 * Served at /sitemap.xml
 */

const DOMAIN = "https://afontfinder.com";
const TODAY  = new Date().toISOString().split("T")[0];

const STATIC_PAGES = [
  { url: "/",        priority: "1.0", changefreq: "weekly"  },
  { url: "/browse",  priority: "0.9", changefreq: "weekly"  },
  { url: "/blog",    priority: "0.9", changefreq: "weekly"  },
  { url: "/guides",  priority: "0.8", changefreq: "monthly" },
  { url: "/about",   priority: "0.6", changefreq: "monthly" },
  { url: "/contact", priority: "0.5", changefreq: "monthly" },
];

const BLOG_SLUGS = [
  "trending-fonts-2025",
  "how-fontfinder-preprocesses-images",
  "otsu-thresholding-explained",
  "deskewing-crooked-text",
  "bounding-box-cropping",
  "how-to-identify-font-from-image",
  "best-free-fonts-for-logos",
  "serif-vs-sans-serif",
  "fonts-used-in-netflix-apple-spotify",
  "variable-fonts-explained",
  "how-to-use-google-fonts",
  "font-pairing-guide-beginners",
  "typography-mistakes-designers-make",
  "identify-font-from-logo",
  "best-fonts-for-websites-2025",
  "what-font-is-that-logo",
  "bricolage-grotesque-review",
  "font-trends-ai",
  "best-monospace-fonts-2025",
  "font-pairing-saas",
];

function buildXml() {
  const staticEntries = STATIC_PAGES.map(p => `
  <url>
    <loc>${DOMAIN}${p.url}</loc>
    <lastmod>${TODAY}</lastmod>
    <changefreq>${p.changefreq}</changefreq>
    <priority>${p.priority}</priority>
  </url>`).join("");

  const blogEntries = BLOG_SLUGS.map(slug => `
  <url>
    <loc>${DOMAIN}/blog/${slug}</loc>
    <lastmod>${TODAY}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>`).join("");

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${staticEntries}
${blogEntries}
</urlset>`;
}

export default function handler(req, res) {
  res.setHeader("Content-Type", "application/xml; charset=utf-8");
  res.setHeader("Cache-Control", "public, max-age=3600");
  return res.status(200).send(buildXml());
}
