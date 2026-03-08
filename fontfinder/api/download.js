/**
 * FontFinder — Font Download Proxy
 * ==================================
 * Proxies font file downloads from Hetzner ML server to the browser.
 * Users download directly from fontfinder site — no external redirects.
 *
 * Usage: GET /api/download?family=Lora
 */

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  if (req.method !== "GET") return res.status(405).end();

  const ML_URL = process.env.ML_SERVICE_URL;
  const SECRET = process.env.FF_API_SECRET || "dev-secret-change-in-production";

  const { family } = req.query;
  if (!family) return res.status(400).json({ error: "Missing font family name." });

  // If ML server not configured yet, fall back gracefully
  if (!ML_URL) {
    return res.status(503).json({
      error: "Font download server not configured yet. Coming soon!",
    });
  }

  try {
    const url = `${ML_URL}/fonts/download?family=${encodeURIComponent(family)}`;
    const mlRes = await fetch(url, {
      headers: { "X-API-Key": SECRET },
      signal: AbortSignal.timeout(15000),
    });

    if (!mlRes.ok) {
      const err = await mlRes.json().catch(() => ({ detail: "Font not found" }));
      return res.status(mlRes.status).json({ error: err.detail || "Font not found" });
    }

    // Stream the font file back to the browser as a download
    const buffer    = Buffer.from(await mlRes.arrayBuffer());
    const filename  = `${family.replace(/\s+/g, "_")}.ttf`;

    res.setHeader("Content-Type", "font/ttf");
    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
    res.setHeader("Content-Length", buffer.length);
    res.setHeader("Cache-Control", "public, max-age=86400");
    return res.status(200).send(buffer);

  } catch (err) {
    console.error("download.js error:", err);
    return res.status(500).json({ error: "Download failed. Please try again." });
  }
}
