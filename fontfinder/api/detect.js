/**
 * FontFinder — Vercel Serverless Proxy
 * ======================================
 * Uses native Node.js 18 fetch + FormData — no extra npm packages needed.
 * Forwards image uploads to the FontFinder ML service on Hetzner.
 *
 * Env vars (set in Vercel dashboard):
 *   ML_SERVICE_URL  — e.g. http://65.109.163.100:8000
 *   FF_API_SECRET   — must match FF_API_SECRET on the ML server
 */

export const config = { api: { bodyParser: false } };

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ success: false, error: "Method not allowed" });

  const ML_URL = process.env.ML_SERVICE_URL;
  const SECRET = process.env.FF_API_SECRET || "dev-secret-change-in-production";

  if (!ML_URL) {
    return res.status(503).json({
      success: false,
      error: "ML service not configured. Set ML_SERVICE_URL in Vercel environment variables."
    });
  }

  try {
    // Read raw body
    const chunks = [];
    for await (const chunk of req) chunks.push(chunk);
    const rawBody     = Buffer.concat(chunks);
    const contentType = req.headers["content-type"] || "";

    let imageBuffer, filename, mimeType;

    if (contentType.includes("multipart/form-data")) {
      const { Formidable } = await import("formidable");
      const form = new Formidable({ maxFileSize: 5 * 1024 * 1024 });

      const { files } = await new Promise((resolve, reject) =>
        form.parse(req, (err, _f, files) => err ? reject(err) : resolve({ files }))
      );

      const file = files.image?.[0] || files.file?.[0];
      if (!file) return res.status(400).json({ success: false, error: "No image file uploaded." });

      const fs   = await import("fs/promises");
      imageBuffer = await fs.readFile(file.filepath);
      filename    = file.originalFilename || "upload.jpg";
      mimeType    = file.mimetype || "image/jpeg";

    } else if (contentType.includes("application/json")) {
      const { url } = JSON.parse(rawBody.toString());
      if (!url?.match(/^https?:\/\//)) {
        return res.status(400).json({ success: false, error: "Invalid image URL." });
      }
      const imgRes = await fetch(url, { signal: AbortSignal.timeout(8000) });
      if (!imgRes.ok) return res.status(400).json({ success: false, error: "Could not fetch image from URL." });
      imageBuffer = Buffer.from(await imgRes.arrayBuffer());
      mimeType    = imgRes.headers.get("content-type") || "image/jpeg";
      filename    = url.split("/").pop()?.split("?")[0] || "remote.jpg";

    } else {
      return res.status(415).json({ success: false, error: "Unsupported content type." });
    }

    // Build FormData using native FormData (Node 18+)
    const formData = new FormData();
    const blob     = new Blob([imageBuffer], { type: mimeType });
    formData.append("file", blob, filename);

    // Forward to ML server
    const mlRes = await fetch(`${ML_URL}/identify`, {
      method:  "POST",
      headers: { "X-API-Key": SECRET },
      body:    formData,
      signal:  AbortSignal.timeout(30_000),
    });

    const text = await mlRes.text();

    let data;
    try {
      data = JSON.parse(text);
    } catch {
      console.error("ML server non-JSON response:", text.slice(0, 300));
      return res.status(502).json({
        success: false,
        error: "ML server returned unexpected response. Please try again."
      });
    }

    if (!mlRes.ok) {
      return res.status(mlRes.status).json({
        success: false,
        error: data.detail || "ML service error"
      });
    }

    return res.status(200).json({
      success:        true,
      matches:        data.matches,
      processing_ms:  data.processing_ms,
      skew_corrected: data.skew_corrected,
    });

  } catch (err) {
    console.error("detect.js error:", err);
    return res.status(500).json({ success: false, error: "Proxy error: " + err.message });
  }
}
