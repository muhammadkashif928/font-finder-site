/**
 * FontFinder — Font Download
 * Redirects to Google Fonts direct zip download.
 * Works for all fonts in our database (all are Google Fonts).
 *
 * GET /api/download?family=Lora
 */
export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  if (req.method !== "GET") return res.status(405).end();

  const { family } = req.query;
  if (!family) return res.status(400).json({ error: "Missing font family name." });

  // Strip weight params: "Lora:wght@400;700" → "Lora"
  const cleanFamily = family.split(":")[0].trim();

  // Google Fonts direct zip download URL
  const googleDownloadUrl = `https://fonts.google.com/download?family=${encodeURIComponent(cleanFamily)}`;

  // Redirect browser to Google Fonts download
  res.setHeader("Location", googleDownloadUrl);
  return res.status(302).end();
}
