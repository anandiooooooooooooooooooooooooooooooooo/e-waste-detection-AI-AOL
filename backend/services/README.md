# Backend Services

This directory contains the core business logic and external service integrations.

## Files

- **`inference_service.py`**:
  - Manages YOLO object detection.
  - Handles image processing (uploading, annotating, saving).

- **`gemini_service.py`**:
  - Manages interaction with Google's Gemini API.
  - Generates prompts for material analysis, pricing, and recycling info.

- **`mock_service.py`**:
  - Provides realistic fallback data when the Gemini API is unavailable.
  - Contains database of common e-waste items and their estimated values.
