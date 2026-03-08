/**
 * FontFinder — Vercel Serverless Proxy
 * Uses native Node.js 18 fetch. formidable for multipart parsing.
 */

export const config = { api: { bodyParser: false } };

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST")
    return res.status(405).json({ success: false, error: "Method not allowed" });

  const ML_URL = process.env.ML_SERVICE_URL;
  const SECRET = process.env.FF_API_SECRET || "dev-secret-change-in-production";

  if (!ML_URL) {
    return res.status(503).json({
      success: false,
      error: "ML service not configured. Set ML_SERVICE_URL in Vercel environment variables.",
    });
  }

  const contentType = req.headers["content-type"] || "";

  try {
    let imageBuffer, filename, mimeType;

    // ── multipart/form-data ─────────────────────────────────
    if (contentType.includes("multipart/form-data")) {
      const { Formidable } = await import("formidable");
      const form = new Formidable({ maxFileSize: 5 * 1024 * 1024, keepExtensions: true });

      const { files } = await new Promise((resolve, reject) =>
        form.parse(req, (err, _fields, files) =>
          err ? reject(err) : resolve({ files })
        )
      );

      const file = files.image?.[0] || files.file?.[0] || Object.values(files)[0]?.[0];
      if (!file) return res.status(400).json({ success: false, error: "No image file found in upload." });

      const { readFile } = await import("fs/promises");
      imageBuffer = await readFile(file.filepath);
      filename    = file.originalFilename || "upload.jpg";
      mimeType    = file.mimetype || "image/jpeg";

    // ── application/json  { url: "https://..." } ───────────
    } else if (contentType.includes("application/json")) {
      const chunks = [];
      for await (const chunk of req) chunks.push(chunk);
      const { url } = JSON.parse(Buffer.concat(chunks).toString());

      if (!url?.match(/^https?:\/\//))
        return res.status(400).json({ success: false, error: "Invalid image URL." });

      const imgRes = await fetch(url, { signal: AbortSignal.timeout(8000) });
      if (!imgRes.ok) return res.status(400).json({ success: false, error: "Could not fetch image from URL." });

      imageBuffer = Buffer.from(await imgRes.arrayBuffer());
      mimeType    = imgRes.headers.get("content-type") || "image/jpeg";
      filename    = url.split("/").pop()?.split("?")[0] || "remote.jpg";

    } else {
      return res.status(415).json({ success: false, error: "Unsupported content type. Use multipart/form-data." });
    }

    // ── Forward to ML server ────────────────────────────────
    const formData = new FormData();
    formData.append("file", new Blob([imageBuffer], { type: mimeType }), filename);

    const mlRes = await fetch(`${ML_URL}/identify`, {
      method:  "POST",
      headers: { "X-API-Key": SECRET },
      body:    formData,
      signal:  AbortSignal.timeout(25_000),
    });

    const text = await mlRes.text();
    let data;
    try { data = JSON.parse(text); }
    catch {
      console.error("ML non-JSON:", text.slice(0, 300));
      return res.status(502).json({ success: false, error: "ML server returned unexpected response." });
    }

    if (!mlRes.ok)
      return res.status(mlRes.status).json({ success: false, error: data.detail || "ML service error" });

    // Transform ML server response → frontend-friendly format
    const fonts = (data.matches || []).map((m, i) => {
      const family      = m.font_name || m.name || "Unknown";
      const familySlug  = family.toLowerCase().replace(/\s+/g, "+");
      const gfontsUrl   = `https://fonts.google.com/specimen/${encodeURIComponent(family)}`;

      return {
        name:           family,
        family:         m.font_family || m.family || "",
        category:       m.category    || "sans-serif",
        is_free:        m.is_free     ?? true,
        license:        m.license     || "OFL",
        confidence:     m.confidence  || 0,
        rank:           i + 1,
        purchase_links: [
          {
            url:   gfontsUrl,
            label: "View on Google Fonts",
            type:  "free",
            icon:  "fa-brands fa-google",
          },
          {
            url:   `https://www.myfonts.com/search?query=${encodeURIComponent(family)}`,
            label: "Find on MyFonts",
            type:  "paid",
            icon:  "fa-tag",
          },
        ],
      };
    });

    return res.status(200).json({
      success:       true,
      fonts,
      processing_ms: data.processing_ms,
    });

  } catch (err) {
    console.error("detect.js error:", err.message);
    if (err.name === "TimeoutError")
      return res.status(504).json({ success: false, error: "ML server timed out. Please try again." });
    return res.status(500).json({ success: false, error: "Server error: " + err.message });
  }
}
