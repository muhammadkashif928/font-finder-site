"""
FontFinder ML Service — Step 3: FAISS Vector Database
======================================================
Builds and queries the font similarity index.
Uses FAISS IVF (Inverted File Index) for fast KNN search.

Index type: IndexFlatIP (Inner Product = cosine similarity on L2-normalised vectors)
This gives exact nearest-neighbour results — no approximation errors.

For 10,000 fonts: loads in ~30ms, each query takes ~1ms on CPU.
For 100,000 fonts: switch to IndexIVFFlat for 10× speedup with 99% accuracy.
"""

import faiss
import numpy as np
import json
import logging
from pathlib import Path
from dataclasses import dataclass, asdict
from typing import List, Optional

logger = logging.getLogger(__name__)

INDEX_PATH    = Path(__file__).parent / "data" / "font_index.faiss"
METADATA_PATH = Path(__file__).parent / "data" / "font_metadata.json"
EMBEDDING_DIM = 2048


@dataclass
class FontMatch:
    rank:        int       # 1 = best match
    font_name:   str
    font_family: str
    category:    str       # serif, sans-serif, display, etc.
    is_free:     bool
    license:     str       # OFL, freeware, commercial
    confidence:  float     # 0.0 – 100.0  (cosine similarity × 100)
    distance:    float     # raw FAISS distance (lower = closer)

    def to_dict(self) -> dict:
        return asdict(self)


class FontSearcher:
    """
    Load the FAISS index and metadata, then run KNN queries.
    """

    def __init__(self):
        self.index    = None
        self.metadata = []
        self._loaded  = False

    def load(self) -> bool:
        """
        Load index from disk. Call once at server startup.
        Returns True on success, False if index doesn't exist yet.
        """
        if not INDEX_PATH.exists():
            logger.warning(
                f"FAISS index not found at {INDEX_PATH}. "
                "Run `python scripts/build_index.py` first."
            )
            return False

        if not METADATA_PATH.exists():
            logger.warning(f"Font metadata not found at {METADATA_PATH}.")
            return False

        logger.info(f"Loading FAISS index from {INDEX_PATH}...")
        self.index = faiss.read_index(str(INDEX_PATH))

        with open(METADATA_PATH, "r", encoding="utf-8") as f:
            self.metadata = json.load(f)

        self._loaded = True
        logger.info(
            f"✅ Font index loaded: {self.index.ntotal} fonts, "
            f"dim={self.index.d}"
        )
        return True

    @property
    def is_ready(self) -> bool:
        return self._loaded and self.index is not None

    def search(
        self,
        query_vector: np.ndarray,
        top_k: int = 5,
    ) -> List[FontMatch]:
        """
        Find the top_k most similar fonts for a given embedding vector.

        Args:
            query_vector: np.ndarray shape (2048,) float32, L2-normalised
            top_k:        number of results to return

        Returns:
            List of FontMatch sorted by confidence (best first)
        """
        if not self.is_ready:
            raise RuntimeError("FontSearcher not loaded. Call .load() first.")

        # FAISS expects (N, D) float32
        q = query_vector.astype(np.float32).reshape(1, -1)

        # Ensure query is L2-normalised (should already be from model, but be safe)
        norm = np.linalg.norm(q)
        if norm > 0:
            q /= norm

        # KNN search
        distances, indices = self.index.search(q, top_k)

        distances = distances[0]   # shape (top_k,)
        indices   = indices[0]     # shape (top_k,)

        results = []
        for rank, (dist, idx) in enumerate(zip(distances, indices), start=1):
            if idx == -1:          # FAISS returns -1 for unfilled slots
                continue

            meta = self.metadata[idx]

            # Convert inner-product distance → confidence percentage
            # For L2-normalised vectors, inner product = cosine similarity ∈ [-1, 1]
            # Map to 0–100%:  confidence = (cosine_sim + 1) / 2 × 100
            confidence = round(float((dist + 1.0) / 2.0 * 100.0), 1)
            confidence = max(0.0, min(100.0, confidence))

            results.append(FontMatch(
                rank=rank,
                font_name=meta.get("name", "Unknown"),
                font_family=meta.get("family", ""),
                category=meta.get("category", "unknown"),
                is_free=meta.get("free", False),
                license=meta.get("license", "unknown"),
                confidence=confidence,
                distance=round(float(dist), 6),
            ))

        return results
