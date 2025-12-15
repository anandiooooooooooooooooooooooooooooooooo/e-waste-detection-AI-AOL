from flask import Blueprint, request, jsonify, current_app
import os
import json
from services.inference_service import InferenceService
from services.mock_service import MockService

detection_bp = Blueprint('detection_bp', __name__)

# Global instances (initialized in main.py or via factory pattern, but simple global for now linked to app context is easier)
# Actually, better to init service here if it doesn't need app context, OR init in main and pass it.
# Flask way often: store in current_app.config or use a global singleton if stateless.
# Let's use a global variable initialized lazily or setup a function.
# For simplicity in this refactor, we can instantiate it here if we have config, but paths are in main.
# Better approach: Initialize service in main.py and attach to app, or use dependency injection.
# simplest for this scale: attach to app.extensions

@detection_bp.route("/detect", methods=["POST"])
def detect():
    file = request.files.get("file")
    if not file:
        return jsonify({"success": False, "error": "No file uploaded"}), 400

    # Service should be available on app
    inference_service: InferenceService = current_app.inference_service

    try:
        # 1. Process Image & Detect
        result_data = inference_service.process_image(file)

        # 2. Analyze (Gemini with Mock Fallback)
        detections = result_data["detections"]

        # Try real Gemini API first
        gemini_service = getattr(current_app, 'gemini_service', None)
        analysis_result = None

        if gemini_service:
            try:
                print("Attempting Gemini analysis...")
                gemini_response = gemini_service.analyze_detection_results(detections)
                if gemini_response.get("success"):
                     print("Gemini analysis successful.")
                     analysis_result = gemini_response["analysis"]
                else:
                     print(f"Gemini analysis failed: {gemini_response.get('error')}")
            except Exception as e:
                print(f"Gemini service error: {e}")

        # Fallback to Mock if Gemini failed or not available
        if not analysis_result:
            print("Falling back to Mock Service.")
            mock_response = MockService.analyze_detection_results(detections)
            analysis_result = mock_response["analysis"]

        # Populate result data
        if analysis_result:
            result_data["materials"] = analysis_result.get("materials", {})
            result_data["pricing"] = analysis_result.get("pricing", {})
            result_data["primary_component"] = analysis_result.get("primary_component", "Unknown")
            result_data["recyclability_score"] = analysis_result.get("recyclability_score", 0)
        else:
             # This should barely happen due to mock fallback
             result_data["materials"] = {"Unknown": 100}
             result_data["pricing"] = {"estimated_value_min": 0, "estimated_value_max": 0, "currency": "IDR"}

        # 3. Save Result to JSON (for persistence/demo)
        result_file_path = os.path.join(inference_service.results_folder, "latest_result.json")
        with open(result_file_path, "w") as f:
            json.dump(result_data, f)

        return jsonify({"success": True, "resultData": result_data})

    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@detection_bp.route("/api/result", methods=["GET"])
def get_result():
    inference_service: InferenceService = current_app.inference_service
    result_file_path = os.path.join(inference_service.results_folder, "latest_result.json")

    if not os.path.exists(result_file_path):
        return jsonify({"error": "No results yet"}), 404

    with open(result_file_path, "r") as f:
        data = json.load(f)

    return jsonify(data)
