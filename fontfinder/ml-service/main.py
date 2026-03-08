"""
FontFinder ML Service — FastAPI Server (Cloud Run Edition)
===========================================================
Optimised for Google Cloud Run free tier:
  - Lazy model loading (fast cold start)
  - Single worker process (Cloud Run manages concurrency)
  - /health endpoint for Cloud Run health checks
  - PORT env var support (Cloud Run sets this automatically)

Deploy:
  gcloud run deploy fontfinder-ml --source . --region us-central1 --allow-unauthenticated

Env vars (set in Cloud Run console):
  FF_API_SECRET   — shared secret with Vercel api/detect.js
  PORT            — set automatically by Cloud Run (default 8080)
"""

import time, logging, os, hmac, hashlib
from pathlib import Path
from contextlib import asynccontextmanager
from typing import Optional

import numpy as np
from fastapi import FastAPI, File, UploadFile, Header, HTTPException, Request, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, FileResponse
from pydantic import BaseModel

from preprocessing import FontImagePreprocessor
from model import EmbeddingPipeline
from searcher import FontSearcher

# ─── Logging ─────────────────────────────────────────────────────────────────
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s  %(levelname)-7s  %(message)s",
    datefmt="%H:%M:%S",
)
logger = logging.getLogger("ff-ml")

# ─── Config ───────────────────────────────────────────────────────────────────
API_SECRET     = os.getenv("FF_API_SECRET", "dev-secret-change-in-production")
MAX_BYTES      = 5 * 1024 * 1024   # 5MB
PORT           = int(os.getenv("PORT", 8080))
FONTS_DIR      = Path(os.getenv("FONTS_DIR", "/opt/google-fonts"))
_start         = time.time()

# ─── Global singletons (loaded once per container instance) ───────────────────
_preprocessor: Optional[FontImagePreprocessor] = None
_embedder:     Optional[EmbeddingPipeline]     = None
_searcher:     Optional[FontSearcher]          = None


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Load models at startup — Cloud Run keeps the container warm between requests."""
    global _preprocessor, _embedder, _searcher
    logger.info("═══ FontFinder ML starting up ═══")

    _preprocessor = FontImagePreprocessor()
    logger.info("✅ Preprocessor ready")

    _embedder = EmbeddingPipeline()
    logger.info("✅ MobileNetV2 ONNX embedder ready")

    _searcher = FontSearcher()
    ok = _searcher.load()
    if ok:
        logger.info(f"✅ FAISS index: {_searcher.index.ntotal} fonts")
    else:
        logger.warning("⚠️  No FAISS index — run build_index.py and upload data/ to Cloud Storage")

    logger.info(f"═══ Ready in {int((time.time()-_start)*1000)}ms ═══")
    yield
    logger.info("Shutting down")


# ─── App ──────────────────────────────────────────────────────────────────────
app = FastAPI(
    title="FontFinder ML",
    version="2.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)


# ─── Auth ─────────────────────────────────────────────────────────────────────
def _auth_ok(key: str) -> bool:
    return hmac.compare_digest(
        hashlib.sha256(API_SECRET.encode()).digest(),
        hashlib.sha256((key or "").encode()).digest(),
    )


# ─── Schemas ──────────────────────────────────────────────────────────────────
class FontResult(BaseModel):
    rank:        int
    font_name:   str
    font_family: str
    category:    str
    is_free:     bool
    license:     str
    confidence:  float

class IdentifyResponse(BaseModel):
    success:         bool
    matches:         list[FontResult]
    processing_ms:   int
    skew_corrected:  float
    binarize_method: str


# ─── Routes ───────────────────────────────────────────────────────────────────
@app.get("/health")
async def health():
    """Cloud Run uses this for liveness checks."""
    return {
        "status":      "ok",
        "index_ready": _searcher.is_ready if _searcher else False,
        "fonts":       _searcher.index.ntotal if (_searcher and _searcher.is_ready) else 0,
        "uptime_s":    round(time.time() - _start),
    }


@app.get("/fonts/search")
async def fonts_search(q: str = Query("", min_length=0)):
    """Search available fonts by name — returns list of {name, file, path}."""
    if not FONTS_DIR.exists():
        raise HTTPException(503, "Font library not available on this server.")

    q_lower = q.lower().strip()
    results = []
    for ttf in sorted(FONTS_DIR.rglob("*.ttf")):
        name = ttf.stem.replace("-", " ").replace("_", " ")
        if not q_lower or q_lower in name.lower():
            results.append({
                "name":   name,
                "file":   ttf.name,
                "family": ttf.parent.name,
            })
        if len(results) >= 50:
            break
    return {"results": results, "total": len(results)}


@app.get("/fonts/download")
async def font_download(
    family: str = Query(..., description="Font family name e.g. 'Lora' or 'Roboto'"),
    x_api_key: str = Header(default=None, alias="X-API-Key"),
):
    """
    Serve a .ttf font file as a direct download.
    Finds the best match in the font library by family name.
    """
    if not _auth_ok(x_api_key):
        raise HTTPException(401, "Invalid X-API-Key")

    if not FONTS_DIR.exists():
        raise HTTPException(503, "Font library not available on this server.")

    # Search for the font file
    family_lower = family.lower().replace(" ", "").replace("-", "")

    best_match = None
    for ttf in FONTS_DIR.rglob("*.ttf"):
        stem = ttf.stem.lower().replace("-", "").replace("_", "").replace("[wght]", "")
        parent = ttf.parent.name.lower().replace("-", "").replace("_", "")

        # Prefer Regular weight files
        if family_lower in (stem, parent):
            if "regular" in ttf.stem.lower() or "wght" in ttf.stem.lower():
                best_match = ttf
                break
            elif best_match is None:
                best_match = ttf

    if not best_match:
        # Fuzzy fallback — partial match
        for ttf in FONTS_DIR.rglob("*.ttf"):
            parent = ttf.parent.name.lower().replace("-", "").replace("_", "")
            if family_lower in parent or parent in family_lower:
                best_match = ttf
                break

    if not best_match:
        raise HTTPException(404, f"Font '{family}' not found in library.")

    # Serve as download
    safe_name = family.replace(" ", "_") + ".ttf"
    return FileResponse(
        path=str(best_match),
        media_type="font/ttf",
        filename=safe_name,
        headers={"Content-Disposition": f'attachment; filename="{safe_name}"'},
    )


@app.post("/identify", response_model=IdentifyResponse)
async def identify(
    file:      UploadFile = File(...),
    x_api_key: str        = Header(default=None, alias="X-API-Key"),
    top_k:     int        = 5,
):
    t0 = time.time()

    # Auth
    if not _auth_ok(x_api_key):
        raise HTTPException(401, "Invalid X-API-Key")

    # Index ready?
    if not (_searcher and _searcher.is_ready):
        raise HTTPException(503, "Font index not loaded yet. Please try again shortly.")

    # File type check
    allowed = ("image/jpeg", "image/png", "image/webp", "image/gif")
    if file.content_type not in allowed:
        raise HTTPException(415, f"Unsupported type: {file.content_type}")

    # Read (enforcing size limit)
    raw = await file.read(MAX_BYTES + 1)
    if len(raw) > MAX_BYTES:
        raise HTTPException(413, "File too large. Max 5MB.")

    # ── Step 1: Preprocess ────────────────────────────────────────────
    try:
        img, meta = _preprocessor.process(raw)
    except ValueError as e:
        raise HTTPException(422, str(e))
    except Exception:
        logger.exception("Preprocessing failed")
        raise HTTPException(500, "Image preprocessing failed.")

    # ── Step 2: Embed ─────────────────────────────────────────────────
    try:
        vec = _embedder.embed(img)
    except Exception:
        logger.exception("Embedding failed")
        raise HTTPException(500, "Feature extraction failed.")

    # ── Step 3: FAISS search ──────────────────────────────────────────
    try:
        matches = _searcher.search(vec, top_k=min(top_k, 10))
    except Exception:
        logger.exception("FAISS search failed")
        raise HTTPException(500, "Vector search failed.")

    ms = int((time.time() - t0) * 1000)
    logger.info(f"✅ {ms}ms | {matches[0].font_name} {matches[0].confidence:.0f}% | skew={meta.get('skew_angle_deg',0):.1f}°")

    return IdentifyResponse(
        success=True,
        matches=[FontResult(**m.to_dict()) for m in matches],
        processing_ms=ms,
        skew_corrected=meta.get("skew_angle_deg", 0.0),
        binarize_method=meta.get("binarize_method", "unknown"),
    )


@app.exception_handler(Exception)
async def global_error(request: Request, exc: Exception):
    logger.exception(f"Unhandled error: {request.url}")
    return JSONResponse(500, {"success": False, "error": "Internal server error"})


# ─── Entrypoint (for local dev) ───────────────────────────────────────────────
if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=PORT, reload=False)
