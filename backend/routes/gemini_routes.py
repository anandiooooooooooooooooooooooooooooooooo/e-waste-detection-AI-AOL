from flask import Blueprint, request, jsonify
from services.gemini_service import GeminiService
import os

gemini_bp = Blueprint('gemini', __name__, url_prefix='/api/gemini')

# Initialize Gemini service
try:
    gemini_service = GeminiService()
except ValueError as e:
    gemini_service = None
    print(f"Warning: Gemini service not initialized - {e}")

@gemini_bp.route('/generate', methods=['POST'])
def generate_text():
    """
    Generate text using Gemini API

    Request body:
    {
        "prompt": "Your prompt here",
        "temperature": 0.7 (optional),
        "max_tokens": 1000 (optional)
    }
    """
    if not gemini_service:
        return jsonify({
            "success": False,
            "error": "Gemini service not initialized. Please set GEMINI_API_KEY."
        }), 500

    data = request.get_json()
    if not data or 'prompt' not in data:
        return jsonify({
            "success": False,
            "error": "Missing 'prompt' in request body"
        }), 400

    prompt = data['prompt']
    kwargs = {k: v for k, v in data.items() if k != 'prompt'}

    result = gemini_service.generate_text(prompt, **kwargs)

    if result['success']:
        return jsonify(result), 200
    else:
        return jsonify(result), 500

@gemini_bp.route('/analyze-detections', methods=['POST'])
def analyze_detections():
    """
    Analyze YOLO detection results using Gemini

    Request body:
    {
        "detections": [
            {"label": "mouse", "confidence": 0.95, "box": [...]},
            {"label": "keyboard", "confidence": 0.89, "box": [...]}
        ]
    }
    """
    if not gemini_service:
        return jsonify({
            "success": False,
            "error": "Gemini service not initialized. Please set GEMINI_API_KEY."
        }), 500

    data = request.get_json()
    if not data or 'detections' not in data:
        return jsonify({
            "success": False,
            "error": "Missing 'detections' in request body"
        }), 400

    detections = data['detections']
    result = gemini_service.analyze_detection_results(detections)

    if result['success']:
        return jsonify(result), 200
    else:
        return jsonify(result), 500

@gemini_bp.route('/recycling-info/<item_type>', methods=['GET'])
def get_recycling_info(item_type):
    """
    Get recycling information for a specific e-waste item

    URL parameter:
        item_type: Type of e-waste (e.g., 'mouse', 'keyboard', 'monitor')
    """
    if not gemini_service:
        return jsonify({
            "success": False,
            "error": "Gemini service not initialized. Please set GEMINI_API_KEY."
        }), 500

    result = gemini_service.get_recycling_info(item_type)

    if result['success']:
        return jsonify(result), 200
    else:
        return jsonify(result), 500

@gemini_bp.route('/health', methods=['GET'])
def health_check():
    """Check if Gemini service is available"""
    return jsonify({
        "service": "gemini",
        "status": "available" if gemini_service else "unavailable",
        "message": "Gemini API is ready" if gemini_service else "GEMINI_API_KEY not set"
    }), 200 if gemini_service else 503
