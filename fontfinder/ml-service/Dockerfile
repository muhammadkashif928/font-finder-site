# FontFinder ML Service — Cloud Run Dockerfile
# =============================================
# Multi-stage build: export ONNX model in stage 1, run lean server in stage 2.
# Final image: ~400MB (vs ~900MB with full PyTorch)
#
# Build & push to Google Artifact Registry:
#   gcloud builds submit --tag gcr.io/YOUR_PROJECT/fontfinder-ml
#
# Or let Cloud Run build automatically:
#   gcloud run deploy fontfinder-ml --source . --region us-central1

# ── Stage 1: Export MobileNetV2 to ONNX ──────────────────────────────────────
FROM python:3.11-slim AS exporter

RUN pip install --no-cache-dir torch==2.3.0 torchvision==0.18.0 onnx==1.16.0 --index-url https://download.pytorch.org/whl/cpu

WORKDIR /export
COPY model.py .

# Export the ONNX model (downloads ImageNet weights, exports to /export/models/)
RUN python -c "
import sys; sys.path.insert(0, '.')
from model import _export_onnx, MODEL_DIR
MODEL_DIR.mkdir(parents=True, exist_ok=True)
_export_onnx()
print('ONNX export complete')
"


# ── Stage 2: Lean inference image ────────────────────────────────────────────
FROM python:3.11-slim AS runner

# System deps for OpenCV (headless — no display needed)
RUN apt-get update && apt-get install -y --no-install-recommends \
    libglib2.0-0 libgomp1 \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy inference requirements only (no PyTorch)
COPY requirements-inference.txt .
RUN pip install --no-cache-dir -r requirements-inference.txt

# Copy source code
COPY preprocessing.py model.py searcher.py main.py ./

# Copy exported ONNX model from stage 1
COPY --from=exporter /export/models/ ./models/

# Create data dir (FAISS index mounted here via Cloud Storage FUSE or copied in)
RUN mkdir -p data

# Cloud Run sets PORT automatically
ENV PORT=8080
EXPOSE 8080

# Single worker — Cloud Run handles concurrency via request queuing
CMD ["python", "-m", "uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8080", "--workers", "1"]
