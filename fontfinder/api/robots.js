/**
 * FontFinder — robots.txt
 * Served at /robots.txt
 */
export default function handler(req, res) {
  res.setHeader("Content-Type", "text/plain");
  res.setHeader("Cache-Control", "public, max-age=86400");
  res.status(200).send(`User-agent: *
Allow: /

Sitemap: https://afontfinder.com/sitemap.xml
`);
}
