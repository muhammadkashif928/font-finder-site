/**
 * FontFinder — Vercel Serverless Function
 * =========================================
 * Accepts image upload or URL → calls WhatFontIs API → returns top matches.
 * Set WHATFONTIS_API_KEY in Vercel dashboard to activate.
 */

export const config = { api: { bodyParser: false } };

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ success: false, error: "Method not allowed" });

  const API_KEY = process.env.WHATFONTIS_API_KEY;
  if (!API_KEY) {
    return res.status(503).json({
      success: false,
      error: "API key not configured. Please set WHATFONTIS_API_KEY in Vercel environment variables."
    });
  }

  try {
    // Read raw body
    const chunks = [];
    for await (const chunk of req) chunks.push(chunk);
    const rawBody = Buffer.concat(chunks);
    const contentType = req.headers["content-type"] || "";

    let imageBase64;

    if (contentType.includes("multipart/form-data")) {
      // Parse multipart file upload
      const { Formidable } = await import("formidable");
      const form = new Formidable({ maxFileSize: 4 * 1024 * 1024 });

      const { files } = await new Promise((resolve, reject) => {
        form.parse(req, (err, _fields, files) =>
          err ? reject(err) : resolve({ files })
        );
      });

      const file = files.image?.[0] || files.file?.[0];
      if (!file) return res.status(400).json({ success: false, error: "No image file uploaded." });

      const fs = await import("fs/promises");
      const buffer = await fs.readFile(file.filepath);
      const mime = file.mimetype || "image/jpeg";
      imageBase64 = `data:${mime};base64,${buffer.toString("base64")}`;

    } else if (contentType.includes("application/json")) {
      // URL mode
      const { url } = JSON.parse(rawBody.toString());
      if (!url?.match(/^https?:\/\//)) {
        return res.status(400).json({ success: false, error: "Invalid image URL." });
      }
      const imgRes = await fetch(url, { signal: AbortSignal.timeout(8000) });
      if (!imgRes.ok) return res.status(400).json({ success: false, error: "Could not fetch image from URL." });
      const buffer = Buffer.from(await imgRes.arrayBuffer());
      const mime = imgRes.headers.get("content-type") || "image/jpeg";
      imageBase64 = `data:${mime};base64,${buffer.toString("base64")}`;

    } else {
      return res.status(415).json({ success: false, error: "Unsupported content type." });
    }

    // Call WhatFontIs API
    const params = new URLSearchParams({
      API_KEY,
      IMAGE: imageBase64,
      LIMIT: "5",
      json: "1",
    });

    const apiRes = await fetch("https://www.whatfontis.com/api2.php", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: params.toString(),
      signal: AbortSignal.timeout(15000),
    });

    const text = await apiRes.text();

    let data;
    try {
      data = JSON.parse(text);
    } catch {
      console.error("WhatFontIs non-JSON response:", text.slice(0, 200));
      return res.status(502).json({ success: false, error: "Font API returned an unexpected response. Please try again." });
    }

    if (!Array.isArray(data) || data.length === 0) {
      return res.status(200).json({ success: false, error: "No fonts found. Try a clearer image with visible text." });
    }

    // Normalise response
    const matches = data.slice(0, 5).map((f, i) => ({
      rank:        i + 1,
      font_name:   f.FONT_NAME  || f.font_name  || "Unknown",
      font_family: f.FONT_NAME  || f.font_name  || "",
      category:    f.FONT_STYLE || f.category   || "Unknown",
      is_free:     !!f.FREE,
      license:     f.FREE ? "Free" : "Commercial",
      confidence:  f.FONT_PERCENTAGE ? parseFloat(f.FONT_PERCENTAGE) : (95 - i * 8),
      buy_url:     f.FONT_URL  || null,
    }));

    return res.status(200).json({ success: true, matches });

  } catch (err) {
    console.error("detect.js error:", err);
    return res.status(500).json({ success: false, error: "Server error. Please try again." });
  }
}
