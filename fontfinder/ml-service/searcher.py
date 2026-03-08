"""
FontFinder ML Service — Step 3: FAISS Vector Search
=====================================================
Loads the font vector index and runs cosine KNN search.

Index type: IndexFlatIP (exact inner product = cosine sim on L2-normalised vecs)
Dim: 1280 (MobileNetV2 embedding)

Performance on Cloud Run free tier (2 vCPU, 512MB):
  - 10,000 fonts: index = ~50MB RAM, query = ~1ms
  - 50,000 fonts: index = ~250MB RAM, query = ~4ms
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
EMBEDDING_DIM = 1280   # MobileNetV2 output


@dataclass
class FontMatch:
    rank:        int
    font_name:   str
    font_family: str
    category:    str
    is_free:     bool
    license:     str
    confidence:  float   # 0.0 – 100.0
    distance:    float   # raw inner product

    def to_dict(self) -> dict:
        return asdict(self)


class FontSearcher:
    def __init__(self):
        self.index    = None
        self.metadata = []
        self._loaded  = False

    def load(self) -> bool:
        if not INDEX_PATH.exists():
            logger.warning(f"FAISS index not found at {INDEX_PATH}. Run build_index.py first.")
            return False
        if not METADATA_PATH.exists():
            logger.warning(f"Metadata not found at {METADATA_PATH}.")
            return False

        logger.info("Loading FAISS index...")
        self.index = faiss.read_index(str(INDEX_PATH))

        with open(METADATA_PATH, "r", encoding="utf-8") as f:
            self.metadata = json.load(f)

        self._loaded = True
        logger.info(f"✅ Index loaded: {self.index.ntotal} fonts, dim={self.index.d}")
        return True

    @property
    def is_ready(self) -> bool:
        return self._loaded and self.index is not None

    def search(self, query_vector: np.ndarray, top_k: int = 5) -> List[FontMatch]:
        if not self.is_ready:
            raise RuntimeError("FontSearcher not loaded.")

        q = query_vector.astype(np.float32).reshape(1, -1)
        norm = np.linalg.norm(q)
        if norm > 0:
            q /= norm

        distances, indices = self.index.search(q, top_k)
        distances = distances[0]
        indices   = indices[0]

        results = []
        for rank, (dist, idx) in enumerate(zip(distances, indices), start=1):
            if idx == -1:
                continue
            meta = self.metadata[idx]

            # Cosine sim in [-1,1] → confidence in [0,100]
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
