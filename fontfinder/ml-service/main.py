"""
FontFinder ML Service — FastAPI Server
=======================================
Secure POST endpoint that accepts an image file and returns
the top 5 closest font matches with confidence percentages.

Endpoints:
  POST /identify      — main font identification endpoint
  GET  /health        — liveness check
  GET  /status        — index size, model info, uptime

Run locally:
  uvicorn main:app --host 0.0.0.0 --port 8000 --workers 2

Production (with Gunicorn):
  gunicorn main:app -w 2 -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:8000
"""

import time
import logging
import os
import hmac
import hashlib
from pathlib import Path
from typing import Optional

import numpy as np
from fastapi import FastAPI, File, UploadFile, Header, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel

from preprocessing import FontImagePreprocessor
from model import EmbeddingPipeline
from searcher import FontSearcher

# ─── Logging ─────────────────────────────────────────────────────────────────
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s  %(levelname)-8s  %(name)s  %(message)s",
    datefmt="%Y-%m-%d %H:%M:%S",
)
logger = logging.getLogger("fontfinder-ml")

# ─── Config from environment ──────────────────────────────────────────────────
API_SECRET      = os.getenv("FF_API_SECRET", "change-me-in-production")
MAX_FILE_BYTES  = 5 * 1024 * 1024   # 5 MB
ALLOWED_ORIGINS = os.getenv("FF_CORS_ORIGINS", "*").split(",")
TOP_K_DEFAULT   = 5

_start_time = time.time()


# ─── App ─────────────────────────────────────────────────────────────────────
app = FastAPI(
    title="FontFinder ML Service",
    description="Open-source font identification via ResNet-50 + FAISS",
    version="1.0.0",
    docs_url="/docs",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)


# ─── Models loaded once at startup ───────────────────────────────────────────
preprocessor: Optional[FontImagePreprocessor] = None
embedder:      Optional[EmbeddingPipeline]    = None
searcher:      Optional[FontSearcher]         = None


@app.on_event("startup")
async def startup():
    global preprocessor, embedder, searcher

    logger.info("═══ FontFinder ML Service starting up ═══")

    preprocessor = FontImagePreprocessor()
    logger.info("✅ Preprocessor ready")

    embedder = EmbeddingPipeline()
    logger.info("✅ ResNet-50 embedder ready")

    searcher = FontSearcher()
    ok = searcher.load()
    if ok:
        logger.info(f"✅ FAISS index loaded ({searcher.index.ntotal} fonts)")
    else:
        logger.warning("⚠️  FAISS index not found — /identify will return error until index is built")

    logger.info("═══ Startup complete ═══")


# ─── Response schema ─────────────────────────────────────────────────────────
class FontResult(BaseModel):
    rank:        int
    font_name:   str
    font_family: str
    category:    str
    is_free:     bool
    license:     str
    confidence:  float    # 0.0 – 100.0

class IdentifyResponse(BaseModel):
    success:       bool
    matches:       list[FontResult]
    processing_ms: int
    skew_corrected: float
    binarize_method: str


# ─── Auth helper ─────────────────────────────────────────────────────────────
def verify_secret(x_api_key: str) -> bool:
    """
    Constant-time HMAC comparison to prevent timing attacks.
    The Vercel api/detect.js passes FF_API_SECRET in the X-API-Key header.
    """
    expected = API_SECRET.encode()
    provided = (x_api_key or "").encode()
    return hmac.compare_digest(
        hashlib.sha256(expected).digest(),
        hashlib.sha256(provided).digest(),
    )


# ─── Endpoints ────────────────────────────────────────────────────────────────

@app.get("/health")
async def health():
    return {"status": "ok", "uptime_s": round(time.time() - _start_time)}


@app.get("/status")
async def status():
    return {
        "status":        "ok",
        "index_ready":   searcher.is_ready if searcher else False,
        "font_count":    searcher.index.ntotal if (searcher and searcher.is_ready) else 0,
        "embedding_dim": 2048,
        "model":         "ResNet-50 + FAISS IndexFlatIP",
        "uptime_s":      round(time.time() - _start_time),
    }


@app.post("/identify", response_model=IdentifyResponse)
async def identify_font(
    file: UploadFile = File(..., description="Image file containing text (JPEG/PNG/WebP)"),
    x_api_key: str   = Header(default=None, alias="X-API-Key"),
    top_k: int       = TOP_K_DEFAULT,
):
    t_start = time.time()

    # ── Auth check ────────────────────────────────────────────────────
    if not verify_secret(x_api_key):
        raise HTTPException(status_code=401, detail="Invalid or missing X-API-Key")

    # ── Index check ───────────────────────────────────────────────────
    if not searcher or not searcher.is_ready:
        raise HTTPException(
            status_code=503,
            detail="Font index not loaded. Run scripts/build_index.py first.",
        )

    # ── Validate file type ────────────────────────────────────────────
    if file.content_type not in ("image/jpeg", "image/png", "image/webp", "image/gif"):
        raise HTTPException(
            status_code=415,
            detail=f"Unsupported image type: {file.content_type}. Use JPEG, PNG, or WebP.",
        )

    # ── Read file (size limit) ────────────────────────────────────────
    raw_bytes = await file.read(MAX_FILE_BYTES + 1)
    if len(raw_bytes) > MAX_FILE_BYTES:
        raise HTTPException(
            status_code=413,
            detail=f"File too large. Maximum {MAX_FILE_BYTES // (1024*1024)}MB.",
        )

    # ── Step 1: Preprocess ────────────────────────────────────────────
    try:
        processed_img, meta = preprocessor.process(raw_bytes)
    except ValueError as e:
        raise HTTPException(status_code=422, detail=str(e))
    except Exception as e:
        logger.exception("Preprocessing error")
        raise HTTPException(status_code=500, detail="Image preprocessing failed.")

    # ── Step 2: Embed ─────────────────────────────────────────────────
    try:
        vector = embedder.embed(processed_img)          # (2048,) float32
    except Exception as e:
        logger.exception("Embedding error")
        raise HTTPException(status_code=500, detail="Feature extraction failed.")

    # ── Step 3: FAISS KNN search ──────────────────────────────────────
    try:
        matches = searcher.search(vector, top_k=min(top_k, 10))
    except Exception as e:
        logger.exception("FAISS search error")
        raise HTTPException(status_code=500, detail="Vector search failed.")

    t_ms = int((time.time() - t_start) * 1000)
    logger.info(
        f"Identified in {t_ms}ms  |  top match: {matches[0].font_name if matches else 'none'} "
        f"({matches[0].confidence:.1f}%)  |  skew: {meta.get('skew_angle_deg', 0):.1f}°"
    )

    return IdentifyResponse(
        success=True,
        matches=[FontResult(**m.to_dict()) for m in matches],
        processing_ms=t_ms,
        skew_corrected=meta.get("skew_angle_deg", 0.0),
        binarize_method=meta.get("binarize_method", "unknown"),
    )


# ─── Global error handler ────────────────────────────────────────────────────
@app.exception_handler(Exception)
async def global_error_handler(request: Request, exc: Exception):
    logger.exception(f"Unhandled error on {request.url}")
    return JSONResponse(
        status_code=500,
        content={"success": False, "error": "Internal server error"},
    )
