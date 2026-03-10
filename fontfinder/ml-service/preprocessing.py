"""
FontFinder ML Service — Step 1: Advanced Image Preprocessing
=============================================================
Uses OpenCV to clean, deskew, denoise, and crop font images
before they reach the neural network. Bad input = bad results.
This step is the most important for accuracy.

Pipeline:
  raw bytes → grayscale → denoise → Otsu binarize
            → deskew → crop tightest text region
            → normalize → 105×105 float tensor
"""

import cv2
import numpy as np
import io
import logging
from typing import Tuple, Optional

logger = logging.getLogger(__name__)


# ─── Constants ──────────────────────────────────────────────────────────────
TARGET_SIZE      = (105, 105)   # DeepFont paper spec
MAX_INPUT_DIM    = 2048         # Resize giant images before processing
MIN_INPUT_DIM    = 64           # Reject images too small to analyse
SKEW_THRESHOLD   = 0.5          # Degrees — ignore sub-half-degree skew
TEXT_PAD         = 12           # Pixels of padding around cropped region


# ─── Main Preprocessor Class ────────────────────────────────────────────────
class FontImagePreprocessor:
    """
    Full image cleaning pipeline for font identification.
    Input:  raw image bytes (JPEG / PNG / WebP / GIF)
    Output: normalised 105×105 float32 numpy array + diagnostics dict
    """

    def process(
        self, image_bytes: bytes
    ) -> Tuple[np.ndarray, dict]:
        """
        Run the full pipeline.

        Returns:
            processed: np.ndarray shape (105, 105) float32, values 0.0–1.0
            meta:      dict with diagnostic info (angle, crop coords, etc.)
        """
        meta = {}

        # ── Load ─────────────────────────────────────────────────────────
        img = self._load(image_bytes)
        meta["original_shape"] = img.shape[:2]

        # ── Cap enormous images to avoid OOM ─────────────────────────────
        img = self._cap_size(img)

        # ── Grayscale ────────────────────────────────────────────────────
        gray = self._to_gray(img)

        # ── Denoise (preserves text edges) ───────────────────────────────
        denoised = self._denoise(gray)

        # ── Binarise with Otsu's thresholding ────────────────────────────
        binary, method = self._binarize(denoised)
        meta["binarize_method"] = method

        # ── Deskew ───────────────────────────────────────────────────────
        deskewed, angle = self._deskew(binary)
        meta["skew_angle_deg"] = round(angle, 2)

        # ── Crop tightest text region ─────────────────────────────────────
        cropped, crop_bbox = self._crop_text(deskewed)
        meta["crop_bbox"] = crop_bbox

        # ── Normalise + resize to 105×105 ────────────────────────────────
        final = self._normalize(cropped)
        meta["final_shape"] = final.shape

        return final, meta


    # ════════════════════════════════════════════════════════════════════════
    # PRIVATE METHODS
    # ════════════════════════════════════════════════════════════════════════

    def _load(self, data: bytes) -> np.ndarray:
        """Load image from raw bytes into BGR numpy array."""
        arr = np.frombuffer(data, np.uint8)
        img = cv2.imdecode(arr, cv2.IMREAD_COLOR)
        if img is None:
            raise ValueError("Could not decode image. Ensure it is a valid JPEG/PNG/WebP.")
        h, w = img.shape[:2]
        if min(h, w) < MIN_INPUT_DIM:
            raise ValueError(
                f"Image too small ({w}×{h}px). Minimum {MIN_INPUT_DIM}px on shortest side."
            )
        return img

    def _cap_size(self, img: np.ndarray) -> np.ndarray:
        """Shrink giant images so processing is fast."""
        h, w = img.shape[:2]
        if max(h, w) > MAX_INPUT_DIM:
            scale = MAX_INPUT_DIM / max(h, w)
            img = cv2.resize(img, (int(w * scale), int(h * scale)), interpolation=cv2.INTER_AREA)
        return img

    def _to_gray(self, img: np.ndarray) -> np.ndarray:
        """BGR → grayscale. Handle already-gray inputs gracefully."""
        if len(img.shape) == 2:
            return img
        if img.shape[2] == 4:                         # RGBA → gray
            img = cv2.cvtColor(img, cv2.COLOR_BGRA2GRAY)
        else:                                          # BGR → gray
            img = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        return img

    def _denoise(self, gray: np.ndarray) -> np.ndarray:
        """
        Two-pass denoising:
          1. Gentle Gaussian blur to kill salt-and-pepper noise
          2. Non-local means for structured noise (JPEG artifacts, scan lines)
        """
        # Pass 1: structural noise
        blurred = cv2.GaussianBlur(gray, (3, 3), 0)

        # Pass 2: remaining artifacts — h=10 keeps edges sharp
        denoised = cv2.fastNlMeansDenoising(
            blurred, h=10, templateWindowSize=7, searchWindowSize=21
        )
        return denoised

    def _binarize(self, gray: np.ndarray) -> Tuple[np.ndarray, str]:
        """
        Convert to pure black/white.

        Strategy:
          - Try Otsu global threshold first (fast, great for clean images)
          - Try adaptive Gaussian threshold (handles uneven lighting)
          - Pick the one with crisper letter edges (measured by edge density)
          - Auto-invert so text is always DARK on WHITE background
        """
        # ── Otsu global threshold ─────────────────────────────────────
        _, otsu = cv2.threshold(gray, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)

        # ── Adaptive Gaussian threshold ───────────────────────────────
        # blockSize must be odd; 11 works well for most font sizes
        adaptive = cv2.adaptiveThreshold(
            gray, 255,
            cv2.ADAPTIVE_THRESH_GAUSSIAN_C,
            cv2.THRESH_BINARY,
            blockSize=11,
            C=8,
        )

        # ── Pick the result with more defined edges ───────────────────
        def edge_score(binary: np.ndarray) -> float:
            edges = cv2.Canny(binary, 50, 150)
            return float(edges.sum())

        if edge_score(otsu) >= edge_score(adaptive):
            binary, method = otsu, "otsu"
        else:
            binary, method = adaptive, "adaptive_gaussian"

        # ── Auto-invert: ensure text = dark (0), background = white (255) ──
        # If more pixels are dark than light, the image is inverted
        if np.mean(binary) < 127:
            binary = cv2.bitwise_not(binary)

        return binary, method

    def _deskew(self, binary: np.ndarray) -> Tuple[np.ndarray, float]:
        """
        Detect and correct text rotation using Hough Line Transform.

        Works by:
          1. Finding all edges in the binary image
          2. Running probabilistic Hough to detect line segments
          3. Filtering to near-horizontal lines (text baselines)
          4. Taking the median angle (robust to outliers)
          5. Rotating the full image to compensate
        """
        angle = self._detect_skew_angle(binary)

        if abs(angle) < SKEW_THRESHOLD:
            return binary, 0.0

        h, w = binary.shape[:2]
        centre = (w / 2.0, h / 2.0)

        # Build rotation matrix — scale=1.0 keeps the same scale
        M = cv2.getRotationMatrix2D(centre, angle, 1.0)

        # Expand canvas to fit the rotated image without clipping corners
        cos_a = abs(M[0, 0])
        sin_a = abs(M[0, 1])
        new_w = int(h * sin_a + w * cos_a)
        new_h = int(h * cos_a + w * sin_a)
        M[0, 2] += (new_w / 2.0) - centre[0]
        M[1, 2] += (new_h / 2.0) - centre[1]

        rotated = cv2.warpAffine(
            binary, M, (new_w, new_h),
            flags=cv2.INTER_CUBIC,
            borderMode=cv2.BORDER_CONSTANT,
            borderValue=255,               # fill with white
        )
        return rotated, angle

    def _detect_skew_angle(self, binary: np.ndarray) -> float:
        """
        Compute skew angle from a binarised image.

        Primary method:  Hough Line Transform on edge image
        Fallback method: Image moment PCA (for very simple images)
        """
        # ── Hough method ─────────────────────────────────────────────
        edges = cv2.Canny(binary, 50, 150, apertureSize=3)
        lines = cv2.HoughLinesP(
            edges, rho=1, theta=np.pi / 180,
            threshold=40,
            minLineLength=max(30, binary.shape[1] // 10),
            maxLineGap=10,
        )

        if lines is not None:
            angles = []
            for line in lines:
                x1, y1, x2, y2 = line[0]
                dx = x2 - x1
                if dx == 0:
                    continue
                angle = np.degrees(np.arctan2(y2 - y1, dx))
                if -45 < angle < 45:          # horizontal-ish only
                    angles.append(angle)

            if len(angles) >= 3:
                return float(np.median(angles))

        # ── Moment PCA fallback ───────────────────────────────────────
        text_pixels = np.column_stack(np.where(binary < 128))
        if len(text_pixels) < 50:
            return 0.0

        # PCA: first principal component direction = text direction
        mean, eigvec, _ = cv2.PCACompute2(
            text_pixels.astype(np.float32), mean=np.array([])
        )
        angle_rad = np.arctan2(eigvec[0, 1], eigvec[0, 0])
        angle_deg = np.degrees(angle_rad)

        # Normalise to (-45°, 45°)
        if angle_deg > 45:
            angle_deg -= 90
        elif angle_deg < -45:
            angle_deg += 90

        return float(angle_deg)

    def _crop_text(
        self, binary: np.ndarray
    ) -> Tuple[np.ndarray, Optional[Tuple[int, int, int, int]]]:
        """
        Find the densest cluster of text pixels (most prominent word)
        and return a tight crop around it.

        Algorithm:
          1. Invert binary (contour detection wants white objects)
          2. Morphologically dilate to merge nearby glyphs into word blobs
          3. Find external contours (word regions)
          4. Filter by aspect ratio and area to remove noise
          5. Pick the largest valid region
          6. Add a small padding border
        """
        h, w = binary.shape[:2]
        img_area = h * w

        # Invert so text glyphs are white on black
        inv = cv2.bitwise_not(binary)

        # Dilate horizontally to merge letters into word-level blobs
        # Kernel width scales with image width so it works at any resolution
        kw = max(15, w // 30)
        kh = max(3,  h // 40)
        kernel = cv2.getStructuringElement(cv2.MORPH_RECT, (kw, kh))
        dilated = cv2.dilate(inv, kernel, iterations=2)

        contours, _ = cv2.findContours(
            dilated, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE
        )

        if not contours:
            return binary, None

        valid = []
        for cnt in contours:
            x, y, cw, ch = cv2.boundingRect(cnt)
            area = cw * ch
            aspect = cw / max(ch, 1)

            # A word: wider than tall, meaningful area, not the whole image
            if (
                0.5 <= aspect <= 25          # word proportions
                and area >= img_area * 0.002  # at least 0.2% of image
                and area <= img_area * 0.95   # not nearly the whole image
            ):
                valid.append(cnt)

        if not valid:
            # Nothing valid found — return the full image
            return binary, None

        # Take the largest valid contour
        best = max(valid, key=cv2.contourArea)
        x, y, cw, ch = cv2.boundingRect(best)

        # Apply padding, clamped to image bounds
        x1 = max(0, x - TEXT_PAD)
        y1 = max(0, y - TEXT_PAD)
        x2 = min(w, x + cw + TEXT_PAD)
        y2 = min(h, y + ch + TEXT_PAD)

        return binary[y1:y2, x1:x2], (x1, y1, x2, y2)

    def _normalize(self, img: np.ndarray) -> np.ndarray:
        """
        Resize to TARGET_SIZE (105×105) with letterboxing (white padding).
        Returns float32 array with values in [0, 1].
        """
        th, tw = TARGET_SIZE
        h, w   = img.shape[:2]

        if h == 0 or w == 0:
            # Fallback: blank white canvas
            return np.ones(TARGET_SIZE, dtype=np.float32)

        # Scale to fit inside target while preserving aspect ratio
        scale  = min(tw / w, th / h)
        new_w  = max(1, int(w * scale))
        new_h  = max(1, int(h * scale))

        resized = cv2.resize(img, (new_w, new_h), interpolation=cv2.INTER_LANCZOS4)

        # White canvas
        canvas = np.full(TARGET_SIZE, 255, dtype=np.uint8)

        # Centre-paste
        y_off = (th - new_h) // 2
        x_off = (tw - new_w) // 2
        canvas[y_off : y_off + new_h, x_off : x_off + new_w] = resized

        # Normalise [0, 1] and invert so text = 1.0, background = 0.0
        # (Matches how DeepFont trains: bright = ink)
        normalised = (255 - canvas.astype(np.float32)) / 255.0
        return normalised


# ─── Standalone test ─────────────────────────────────────────────────────────
if __name__ == "__main__":
    import sys, os

    if len(sys.argv) < 2:
        print("Usage: python preprocessing.py <image_path> [output_path]")
        sys.exit(1)

    path = sys.argv[1]
    out  = sys.argv[2] if len(sys.argv) > 2 else "preprocessed_output.png"

    with open(path, "rb") as f:
        raw = f.read()

    preprocessor = FontImagePreprocessor()
    result, meta = preprocessor.process(raw)

    # Save result (scale back to 0–255 for viewing)
    save_img = (result * 255).astype(np.uint8)
    cv2.imwrite(out, save_img)

    print(f"✅ Preprocessing complete")
    print(f"   Binarise method : {meta['binarize_method']}")
    print(f"   Skew corrected  : {meta['skew_angle_deg']}°")
    print(f"   Crop bbox       : {meta['crop_bbox']}")
    print(f"   Final shape     : {meta['final_shape']}")
    print(f"   Saved to        : {out}")
