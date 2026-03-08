# FontFinder ML Service — Google Cloud Run Deployment
# ====================================================
# Cost: $0 (free tier: 2M requests/month forever)
# Time to deploy: ~15 minutes

## Prerequisites
- Google account (gmail)
- Google Cloud project (free to create)
- Google Cloud CLI installed on your Mac

---

## Step 1 — Install Google Cloud CLI (one time)
```bash
brew install google-cloud-sdk
gcloud init
# → Follow prompts, sign in with Google account
# → Create a new project e.g. "fontfinder-ml"
```

## Step 2 — Enable required services (one time, free)
```bash
gcloud services enable \
  cloudbuild.googleapis.com \
  run.googleapis.com \
  artifactregistry.googleapis.com
```

## Step 3 — Build the FAISS font index (one time)
```bash
# Download Google Fonts (free, 3500+ fonts, OFL licensed)
git clone https://github.com/google/fonts.git ~/google-fonts

# Install Python deps locally
cd fontfinder/ml-service
pip install -r requirements.txt

# Build the index (~30 min for 3500 fonts)
python scripts/build_index.py --fonts-dir ~/google-fonts --output ./data

# This creates:
#   data/font_index.faiss    (~17MB for 3500 fonts)
#   data/font_metadata.json  (~500KB)
```

## Step 4 — Deploy to Cloud Run
```bash
cd fontfinder/ml-service

gcloud run deploy fontfinder-ml \
  --source . \
  --region us-central1 \
  --allow-unauthenticated \
  --memory 512Mi \
  --cpu 1 \
  --set-env-vars "FF_API_SECRET=YOUR_LONG_RANDOM_SECRET_HERE"

# → Cloud Run builds the Docker image, exports ONNX, deploys
# → You get a URL like: https://fontfinder-ml-xxxx-uc.a.run.app
```

## Step 5 — Connect to your Vercel site
In Vercel dashboard → Settings → Environment Variables:
```
ML_SERVICE_URL = https://fontfinder-ml-xxxx-uc.a.run.app
FF_API_SECRET  = YOUR_LONG_RANDOM_SECRET_HERE
```
Then: Vercel → Deployments → Redeploy

---

## Step 6 — Test it
```bash
# Health check
curl https://fontfinder-ml-xxxx-uc.a.run.app/health

# Font identification test
curl -X POST https://fontfinder-ml-xxxx-uc.a.run.app/identify \
  -H "X-API-Key: YOUR_SECRET" \
  -F "file=@/path/to/test-image.jpg"
```

---

## Architecture
```
User uploads image
       │
       ▼
Vercel (api/detect.js)
  - Validates file
  - Forwards to Cloud Run
       │
       ▼
Google Cloud Run (fontfinder-ml)
  Step 1: OpenCV preprocessing
    → grayscale → Otsu binarize → deskew → crop
  Step 2: MobileNetV2 ONNX
    → 1280-dim embedding vector
  Step 3: FAISS KNN search
    → top 5 closest fonts
  Step 4: JSON response
    → font_name, confidence%, category, is_free
       │
       ▼
FontFinder website shows results
```

## Free Tier Limits (Google Cloud Run)
| Resource | Free | Your usage |
|---|---|---|
| Requests/month | 2,000,000 | ~10,000 to start |
| CPU seconds | 180,000 | ~15s per request |
| Memory GB-sec | 360,000 | ~5s per request |
| **Cost** | **$0** | **$0** |

## Performance
| Step | Time |
|---|---|
| OpenCV preprocessing | ~20ms |
| MobileNetV2 ONNX (CPU) | ~15ms |
| FAISS KNN (3500 fonts) | ~1ms |
| Total | ~36ms + network |
