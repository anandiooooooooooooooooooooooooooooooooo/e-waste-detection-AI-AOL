import os
import uuid
import cv2
from ultralytics import YOLO

class InferenceService:
    def __init__(self, model_path, upload_folder, results_folder):
        self.model_path = model_path
        self.upload_folder = upload_folder
        self.results_folder = results_folder

        # Ensure directories exist
        os.makedirs(self.upload_folder, exist_ok=True)
        os.makedirs(self.results_folder, exist_ok=True)

        # Load Model
        if not os.path.exists(self.model_path):
            raise FileNotFoundError(f"YOLO model not found at: {self.model_path}")
        self.model = YOLO(self.model_path)

    def process_image(self, file):
        """
        Saves the file, runs inference, saves annotated image, and returns detections + paths.
        """
        # 1. Save uploaded image
        filename = f"{uuid.uuid4().hex}.jpg"
        filepath = os.path.join(self.upload_folder, filename)
        file.save(filepath)

        # 2. Run YOLO detection
        results = self.model.predict(filepath)[0]

        # 3. Save annotated image
        annotated_frame = results.plot()
        annotated_filename = f"annotated_{filename}"
        annotated_filepath = os.path.join(self.results_folder, annotated_filename)
        cv2.imwrite(annotated_filepath, annotated_frame)

        # 4. Parse detections
        detections = []
        for box, conf, cls in zip(results.boxes.xyxy, results.boxes.conf, results.boxes.cls):
            detections.append({
                "label": self.model.names[int(cls)],
                "confidence": float(conf),
                "box": [float(x) for x in box]
            })

        return {
            "image_url": f"/static/uploads/{filename}",
            "annotated_image_url": f"/static/results/{annotated_filename}",
            "detections": detections
        }
