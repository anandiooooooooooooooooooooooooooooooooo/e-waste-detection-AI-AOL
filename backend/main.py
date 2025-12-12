from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
import os
import uuid
import json
from ultralytics import YOLO
from routes.gemini_routes import gemini_bp

# Load environment variables
load_dotenv()

app = Flask(__name__, static_folder="static")
CORS(app)

# Register Gemini blueprint
app.register_blueprint(gemini_bp)

# Folders for uploads and results
UPLOAD_FOLDER = os.path.join(app.static_folder, "uploads")
RESULTS_FOLDER = os.path.join(app.static_folder, "results")
RESULT_FILE = os.path.join(RESULTS_FOLDER, "latest_result.json")

os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(RESULTS_FOLDER, exist_ok=True)

# Load YOLO model
model_path = os.path.abspath("./models/yolo/best_40ep_60map.pt")
if not os.path.exists(model_path):
    raise FileNotFoundError(f"YOLO model not found at: {model_path}")

model = YOLO(model_path)


@app.route("/detect", methods=["POST"])
def detect():
    file = request.files.get("file")
    if not file:
        return jsonify({"success": False, "error": "No file uploaded"}), 400

    # Save uploaded image
    filename = f"{uuid.uuid4().hex}.jpg"
    filepath = os.path.join(UPLOAD_FOLDER, filename)
    file.save(filepath)

    # Run YOLO detection
    results = model.predict(filepath)[0]  # YOLO returns a list; take the first item

    # Save annotated image
    annotated_frame = results.plot()
    annotated_filename = f"annotated_{filename}"
    annotated_filepath = os.path.join(RESULTS_FOLDER, annotated_filename)
    import cv2
    cv2.imwrite(annotated_filepath, annotated_frame)

    detections = []
    for box, conf, cls in zip(results.boxes.xyxy, results.boxes.conf, results.boxes.cls):
        detections.append({
            "label": model.names[int(cls)],
            "confidence": float(conf),
            "box": [float(x) for x in box]  # [x1, y1, x2, y2]
        })

    # Build result payload
    result_data = {
        "image_url": f"/static/uploads/{filename}",
        "annotated_image_url": f"/static/results/{annotated_filename}",
        "detections": detections
    }

    # Mock Analysis to save tokens
    from services.mock_service import MockService

    # Analyze using MockService
    gemini_result = MockService.analyze_detection_results(detections)

    if gemini_result.get("success"):
        analysis = gemini_result["analysis"]
        result_data["materials"] = analysis.get("materials", {})
        result_data["pricing"] = analysis.get("pricing", {})
        result_data["primary_component"] = analysis.get("primary_component", "Unknown")
    else:
         result_data["materials"] = {"Unknown": 100}
         result_data["pricing"] = {"estimated_value_min": 0, "estimated_value_max": 0, "currency": "IDR"}

    # Save JSON result file
    with open(RESULT_FILE, "w") as f:
        json.dump(result_data, f)

    return jsonify({"success": True, "resultData": result_data})


@app.route("/api/result", methods=["GET"])
def get_result():
    if not os.path.exists(RESULT_FILE):
        return jsonify({"error": "No results yet"}), 404

    with open(RESULT_FILE, "r") as f:
        data = json.load(f)

    return jsonify(data)


if __name__ == "__main__":
    app.run(debug=True)
