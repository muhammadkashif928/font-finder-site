# FontFinder ML Service — Deployment Guide

## Server Requirements
| | Minimum | Recommended |
|---|---|---|
| RAM | 4 GB | 8 GB |
| CPU | 2 cores | 4 cores |
| Disk | 10 GB | 20 GB |
| OS | Ubuntu 22.04 | Ubuntu 22.04 |
| Cost | ~$24/mo (Hetzner CX32) | ~$48/mo |

---

## Step-by-Step Setup on a VPS

### 1. Install dependencies
```bash
sudo apt update && sudo apt install -y python3.11 python3.11-venv python3-pip nginx
```

### 2. Clone and set up
```bash
cd /opt
git clone <your-repo> fontfinder
cd fontfinder/ml-service
python3.11 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

### 3. Build the FAISS font index
```bash
# Put your .ttf files in /opt/fonts/
python scripts/build_index.py --fonts-dir /opt/fonts --output ./data
# → writes data/font_index.faiss and data/font_metadata.json
# Takes ~2–4 hrs for 10,000 fonts on CPU
```

### 4. Create systemd service
```ini
# /etc/systemd/system/fontfinder-ml.service
[Unit]
Description=FontFinder ML Service
After=network.target

[Service]
User=www-data
WorkingDirectory=/opt/fontfinder/ml-service
Environment="FF_API_SECRET=your-very-long-random-secret-here"
ExecStart=/opt/fontfinder/ml-service/venv/bin/gunicorn main:app \
    -w 2 -k uvicorn.workers.UvicornWorker \
    --bind 127.0.0.1:8000 --timeout 60
Restart=always

[Install]
WantedBy=multi-user.target
```
```bash
sudo systemctl enable fontfinder-ml
sudo systemctl start fontfinder-ml
```

### 5. Nginx reverse proxy with HTTPS
```nginx
# /etc/nginx/sites-available/fontfinder-ml
server {
    listen 443 ssl;
    server_name ml.yourdomain.com;

    ssl_certificate     /etc/letsencrypt/live/ml.yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/ml.yourdomain.com/privkey.pem;

    client_max_body_size 6M;

    location / {
        proxy_pass         http://127.0.0.1:8000;
        proxy_set_header   Host $host;
        proxy_set_header   X-Real-IP $remote_addr;
        proxy_read_timeout 30s;
    }
}
```
```bash
sudo certbot --nginx -d ml.yourdomain.com
sudo nginx -t && sudo systemctl reload nginx
```

### 6. Set Vercel environment variables
In Vercel dashboard → Settings → Environment Variables:
```
ML_SERVICE_URL = https://ml.yourdomain.com
FF_API_SECRET  = your-very-long-random-secret-here
```

---

## How It All Connects

```
Browser
  │  POST /api/detect  (image file)
  ▼
Vercel Edge Function (api/detect.js)
  │  POST https://ml.yourdomain.com/identify
  │  Header: X-API-Key: <FF_API_SECRET>
  ▼
Python FastAPI (your VPS)
  │  preprocessing.py → model.py → searcher.py
  ▼
JSON response: { matches: [{font_name, confidence, ...}×5] }
  │
  ▼
Vercel → Browser (Results.js renders the matches)
```

---

## Expected Performance

| Stage | Time |
|---|---|
| OpenCV preprocessing | ~20ms |
| ResNet-50 embed (CPU) | ~80ms |
| FAISS KNN (10K fonts) | ~2ms |
| Network roundtrip | ~30ms |
| **Total** | **~130ms** |

GPU (e.g. RTX 3060): embed drops to ~8ms → **total ~60ms**

---

## Cost Comparison

| Approach | 100K req/mo | 1M req/mo |
|---|---|---|
| WhatFontIs API | $0 (free limit hit at 3K) → **pay per req** | $$$ |
| OpenAI Vision | ~$150 | ~$1,500 |
| **This pipeline (VPS)** | **$24/mo flat** | **$24/mo flat** |
