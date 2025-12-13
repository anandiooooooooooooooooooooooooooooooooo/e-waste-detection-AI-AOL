from flask import Flask
from flask_cors import CORS
from dotenv import load_dotenv
import os

# Routes
from routes.gemini_routes import gemini_bp
from routes.detection_routes import detection_bp

# Services
from services.inference_service import InferenceService

# Load environment variables
load_dotenv()

app = Flask(__name__, static_folder="static")
CORS(app)

# Configuration
UPLOAD_FOLDER = os.path.join(app.static_folder, "uploads")
RESULTS_FOLDER = os.path.join(app.static_folder, "results")
MODEL_PATH = os.path.abspath("./models/yolo/best_40ep_60map.pt")

# Initialize Services and attach to app
# This allows routes to access them via current_app.inference_service
try:
    app.inference_service = InferenceService(
        model_path=MODEL_PATH,
        upload_folder=UPLOAD_FOLDER,
        results_folder=RESULTS_FOLDER
    )
    print("Inference Service Initialized.")
except Exception as e:
    print(f"Error initializing Inference Service: {e}")
    # We don't exit, but /detect might fail.

# Register Blueprints
app.register_blueprint(gemini_bp)
app.register_blueprint(detection_bp)

if __name__ == "__main__":
    app.run(debug=True)
