# API Routes

This directory contains the Flask Blueprints that define the API endpoints.

## Files

- **`detection_routes.py`**:
  - `POST /detect`: Handles image uploads, runs object detection, and triggers analysis.
  - `GET /api/result`: Retrieves the latest detection result.

- **`gemini_routes.py`**:
  - `POST /api/gemini/generate`: Direct text generation using Gemini.
  - `POST /api/gemini/analyze-detections`: Analyze specific detection items.
  - `GET /api/gemini/recycling-info/<item>`: Get recycling details for an item.
