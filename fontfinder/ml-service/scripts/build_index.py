"""
FontFinder ML Service — Build the FAISS Font Index
====================================================
Run this ONCE to process your .ttf font library into searchable vectors.

Usage:
    python scripts/build_index.py --fonts-dir /path/to/ttf_files --output ../data

What it does:
  1. For each .ttf file, renders the phrase "The quick brown fox" at multiple
     sizes and styles using Pillow + FreeType
  2. Applies the same preprocessing pipeline the live server uses
  3. Runs the ResNet-50 embedder
  4. Stores all vectors in a FAISS index
  5. Saves font metadata (name, category, license) to JSON

Runtime: ~2–4 hours for 10,000 fonts on CPU, ~20 min with GPU
Storage: ~80MB for 10,000 fonts at 2048-dim float32
"""

import sys, os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))

import argparse
import json
import logging
import io
from pathlib import Path
from typing import List, Tuple, Optional

import numpy as np
import faiss
from PIL import Image, ImageDraw, ImageFont
import tqdm

from preprocessing import FontImagePreprocessor
from model import EmbeddingPipeline

logging.basicConfig(level=logging.INFO, format="%(levelname)s  %(message)s")
logger = logging.getLogger(__name__)

# ─── Config ──────────────────────────────────────────────────────────────────
RENDER_TEXT      = "The quick brown fox"   # sample text for rendering
RENDER_FONT_SIZE = 48                       # px — big enough for clear features
RENDER_IMG_SIZE  = (500, 120)              # (W, H)
BATCH_SIZE       = 32                      # embed N fonts at once


def render_font_image(ttf_path: Path, text: str = RENDER_TEXT) -> Optional[bytes]:
    """
    Render `text` using the given .ttf file.
    Returns raw PNG bytes, or None if the font can't be loaded.
    """
    try:
        font = ImageFont.truetype(str(ttf_path), size=RENDER_FONT_SIZE)
    except Exception as e:
        logger.debug(f"  ✗ Could not load {ttf_path.name}: {e}")
        return None

    img = Image.new("RGB", RENDER_IMG_SIZE, color=(255, 255, 255))
    draw = ImageDraw.Draw(img)

    # Centre the text
    try:
        bbox = draw.textbbox((0, 0), text, font=font)
        tw, th = bbox[2] - bbox[0], bbox[3] - bbox[1]
    except AttributeError:
        tw, th = draw.textsize(text, font=font)  # Pillow < 9

    x = max(4, (RENDER_IMG_SIZE[0] - tw) // 2)
    y = max(4, (RENDER_IMG_SIZE[1] - th) // 2)

    draw.text((x, y), text, fill=(10, 10, 10), font=font)

    buf = io.BytesIO()
    img.save(buf, format="PNG")
    return buf.getvalue()


def extract_metadata(ttf_path: Path) -> dict:
    """
    Extract font name, family, and basic categorisation from .ttf filename.
    In production, augment this with a proper font metadata CSV.
    """
    name = ttf_path.stem.replace("-", " ").replace("_", " ")

    # Very rough auto-categorisation from filename keywords
    lower = name.lower()
    if any(k in lower for k in ["script", "cursive", "handwrite", "brush"]):
        category = "script"
    elif any(k in lower for k in ["mono", "code", "console", "terminal"]):
        category = "monospace"
    elif any(k in lower for k in ["serif"]) and "sans" not in lower:
        category = "serif"
    elif any(k in lower for k in ["sans", "gothic", "grotesk", "grotesque"]):
        category = "sans-serif"
    elif any(k in lower for k in ["display", "headline", "poster", "deco"]):
        category = "display"
    else:
        category = "sans-serif"

    return {
        "name":     name,
        "family":   name.split()[0] if name else "",
        "category": category,
        "free":     True,     # assume OFL if you're using Google Fonts exports
        "license":  "OFL",
        "ttf_file": ttf_path.name,
    }


def build_index(fonts_dir: Path, output_dir: Path):
    output_dir.mkdir(parents=True, exist_ok=True)
    index_path    = output_dir / "font_index.faiss"
    metadata_path = output_dir / "font_metadata.json"

    # ── Collect all .ttf files ────────────────────────────────────────
    ttf_files: List[Path] = sorted(fonts_dir.rglob("*.ttf"))
    if not ttf_files:
        logger.error(f"No .ttf files found in {fonts_dir}")
        sys.exit(1)
    logger.info(f"Found {len(ttf_files)} .ttf files")

    # ── Init pipeline ─────────────────────────────────────────────────
    preprocessor = FontImagePreprocessor()
    embedder     = EmbeddingPipeline()

    all_embeddings: List[np.ndarray] = []
    all_metadata:   List[dict]       = []

    # ── Process in batches ────────────────────────────────────────────
    batch_imgs   = []
    batch_metas  = []
    failed       = 0

    for ttf in tqdm.tqdm(ttf_files, desc="Processing fonts"):
        # Render
        img_bytes = render_font_image(ttf)
        if img_bytes is None:
            failed += 1
            continue

        # Preprocess
        try:
            processed, _ = preprocessor.process(img_bytes)
        except Exception as e:
            logger.debug(f"  Preprocessing failed for {ttf.name}: {e}")
            failed += 1
            continue

        batch_imgs.append(processed)
        batch_metas.append(extract_metadata(ttf))

        # Embed when batch is full
        if len(batch_imgs) >= BATCH_SIZE:
            embeddings = embedder.embed_batch(batch_imgs)
            all_embeddings.append(embeddings)
            all_metadata.extend(batch_metas)
            batch_imgs  = []
            batch_metas = []

    # Final partial batch
    if batch_imgs:
        embeddings = embedder.embed_batch(batch_imgs)
        all_embeddings.append(embeddings)
        all_metadata.extend(batch_metas)

    # ── Build FAISS index ─────────────────────────────────────────────
    vectors = np.vstack(all_embeddings).astype(np.float32)  # (N, 2048)
    n, dim  = vectors.shape
    logger.info(f"Building FAISS index: {n} fonts × {dim}d vectors")

    # Normalise to unit length (required for inner-product = cosine similarity)
    faiss.normalize_L2(vectors)

    # IndexFlatIP: exact search, inner product
    # For >50K fonts consider IndexIVFFlat with nlist=int(sqrt(n))
    index = faiss.IndexFlatIP(dim)
    index.add(vectors)

    # ── Save ─────────────────────────────────────────────────────────
    faiss.write_index(index, str(index_path))
    logger.info(f"✅ FAISS index saved: {index_path}  ({index.ntotal} vectors)")

    with open(metadata_path, "w", encoding="utf-8") as f:
        json.dump(all_metadata, f, indent=2, ensure_ascii=False)
    logger.info(f"✅ Metadata saved: {metadata_path}")

    if failed:
        logger.warning(f"   {failed} fonts could not be processed (corrupt / unsupported).")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Build FontFinder FAISS index")
    parser.add_argument(
        "--fonts-dir", required=True,
        help="Directory containing .ttf font files (searched recursively)"
    )
    parser.add_argument(
        "--output", default=str(Path(__file__).parent.parent / "data"),
        help="Where to write font_index.faiss and font_metadata.json"
    )
    args = parser.parse_args()

    build_index(
        fonts_dir=Path(args.fonts_dir),
        output_dir=Path(args.output),
    )
