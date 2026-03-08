# FontFinder ML Service — Dockerfile
# Build: docker build -t fontfinder-ml .
# Run:   docker run -p 8000:8000 -v $(pwd)/data:/app/data -v $(pwd)/models:/app/models \
#               -e FF_API_SECRET=your-secret fontfinder-ml

FROM python:3.11-slim

# System deps for OpenCV
RUN apt-get update && apt-get install -y --no-install-recommends \
    libglib2.0-0 \
    libsm6 \
    libxext6 \
    libxrender-dev \
    libgomp1 \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Install Python deps first (cached layer)
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy source
COPY . .

# Create data/models dirs
RUN mkdir -p data models

# Expose port
EXPOSE 8000

# Start with 2 workers (increase for multi-core VPS)
CMD ["gunicorn", "main:app", \
     "-w", "2", \
     "-k", "uvicorn.workers.UvicornWorker", \
     "--bind", "0.0.0.0:8000", \
     "--timeout", "60", \
     "--access-logfile", "-"]
