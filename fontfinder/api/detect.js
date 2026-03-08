/**
 * FontFinder — Vercel Edge Function
 * ===================================
 * Thin proxy that forwards uploaded images to the Python ML service.
 * The Python server does all the heavy ML work; this just handles
 * CORS, auth token injection, and response pass-through.
 *
 * Environment variables (set in Vercel dashboard):
 *   ML_SERVICE_URL  — e.g. https://ml.yourdomain.com  or  http://1.2.3.4:8000
 *   FF_API_SECRET   — must match FF_API_SECRET in the Python service
 */

import FormData from "form-data";
import fetch from "node-fetch";

const ML_URL    = process.env.ML_SERVICE_URL || "http://localhost:8000";
const API_SECRET = process.env.FF_API_SECRET  || "change-me-in-production";

export default async function handler(req, res) {
  // ── CORS ────────────────────────────────────────────────────────────────
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, error: "Method not allowed" });
  }

  try {
    // ── Read raw body ───────────────────────────────────────────────────
    const chunks = [];
    for await (const chunk of req) chunks.push(chunk);
    const rawBody = Buffer.concat(chunks);

    // ── Detect mode: file upload (multipart) or URL (JSON) ─────────────
    const contentType = req.headers["content-type"] || "";

    let imageBuffer, filename, mimeType;

    if (contentType.includes("multipart/form-data")) {
      // ── Parse multipart with formidable ──────────────────────────────
      const { Formidable } = await import("formidable");
      const form = new Formidable({ maxFileSize: 5 * 1024 * 1024 });

      const { files } = await new Promise((resolve, reject) => {
        form.parse(req, (err, _fields, files) =>
          err ? reject(err) : resolve({ files })
        );
      });

      const file = files.image?.[0] || files.file?.[0];
      if (!file) {
        return res.status(400).json({ success: false, error: "No image file uploaded." });
      }

      const fs = await import("fs/promises");
      imageBuffer = await fs.readFile(file.filepath);
      filename    = file.originalFilename || "upload.jpg";
      mimeType    = file.mimetype || "image/jpeg";

    } else if (contentType.includes("application/json")) {
      // ── URL mode ─────────────────────────────────────────────────────
      const { url } = JSON.parse(rawBody.toString());
      if (!url || !url.match(/^https?:\/\//)) {
        return res.status(400).json({ success: false, error: "Invalid image URL." });
      }

      const imgRes = await fetch(url, { timeout: 8000 });
      if (!imgRes.ok) {
        return res.status(400).json({ success: false, error: "Could not fetch image from URL." });
      }
      imageBuffer = Buffer.from(await imgRes.arrayBuffer());
      mimeType    = imgRes.headers.get("content-type") || "image/jpeg";
      filename    = url.split("/").pop()?.split("?")[0] || "remote.jpg";

    } else {
      return res.status(415).json({ success: false, error: "Unsupported content type." });
    }

    // ── Forward to Python ML service ────────────────────────────────────
    const form = new FormData();
    form.append("file", imageBuffer, { filename, contentType: mimeType });

    const mlRes = await fetch(`${ML_URL}/identify`, {
      method: "POST",
      headers: {
        ...form.getHeaders(),
        "X-API-Key": API_SECRET,
      },
      body: form,
      timeout: 30_000,   // 30s timeout for ML inference
    });

    const data = await mlRes.json();

    if (!mlRes.ok) {
      return res.status(mlRes.status).json({
        success: false,
        error: data.detail || "ML service error",
      });
    }

    // ── Return structured response to frontend ──────────────────────────
    return res.status(200).json({
      success:        true,
      matches:        data.matches,       // array of {rank, font_name, confidence, ...}
      processing_ms:  data.processing_ms,
      skew_corrected: data.skew_corrected,
    });

  } catch (err) {
    console.error("detect.js proxy error:", err);
    return res.status(500).json({ success: false, error: "Proxy error: " + err.message });
  }
}
