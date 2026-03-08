/**
 * FontFinder — Vercel Serverless Proxy
 * ======================================
 * Routes image uploads to the FontFinder ML service on Google Cloud Run.
 * Zero third-party font API dependencies — 100% our own pipeline.
 *
 * Env vars (set in Vercel dashboard):
 *   ML_SERVICE_URL  — Cloud Run URL e.g. https://fontfinder-ml-xxxx-uc.a.run.app
 *   FF_API_SECRET   — must match FF_API_SECRET in Cloud Run service
 */

export const config = { api: { bodyParser: false } };

const ML_URL    = process.env.ML_SERVICE_URL;
const SECRET    = process.env.FF_API_SECRET || "dev-secret-change-in-production";

export default async function handler(req, res) {
  // ── CORS ──────────────────────────────────────────────────────────────────
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST")   return res.status(405).json({ success: false, error: "Method not allowed" });

  // ── ML service configured? ─────────────────────────────────────────────────
  if (!ML_URL) {
    return res.status(503).json({
      success: false,
      error: "ML service not configured yet. Set ML_SERVICE_URL in Vercel environment variables."
    });
  }

  try {
    const chunks = [];
    for await (const chunk of req) chunks.push(chunk);
    const rawBody    = Buffer.concat(chunks);
    const contentType = req.headers["content-type"] || "";

    let imageBuffer, filename, mimeType;

    // ── File upload (multipart) ──────────────────────────────────────────────
    if (contentType.includes("multipart/form-data")) {
      const { Formidable } = await import("formidable");
      const form = new Formidable({ maxFileSize: 5 * 1024 * 1024 });

      const { files } = await new Promise((resolve, reject) =>
        form.parse(req, (err, _f, files) => err ? reject(err) : resolve({ files }))
      );

      const file = files.image?.[0] || files.file?.[0];
      if (!file) return res.status(400).json({ success: false, error: "No image file uploaded." });

      const fs = await import("fs/promises");
      imageBuffer = await fs.readFile(file.filepath);
      filename    = file.originalFilename || "upload.jpg";
      mimeType    = file.mimetype || "image/jpeg";

    // ── URL mode (JSON body) ─────────────────────────────────────────────────
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

    // ── Forward to Cloud Run ML service ─────────────────────────────────────
    const { default: FormData } = await import("form-data");
    const { default: fetch2 }   = await import("node-fetch");

    const form = new FormData();
    form.append("file", imageBuffer, { filename, contentType: mimeType });

    const mlRes = await fetch2(`${ML_URL}/identify`, {
      method:  "POST",
      headers: { ...form.getHeaders(), "X-API-Key": SECRET },
      body:    form,
      timeout: 30_000,
    });

    const data = await mlRes.json();

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
