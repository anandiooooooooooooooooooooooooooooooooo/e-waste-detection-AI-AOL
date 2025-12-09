import cv2
from ultralytics import YOLO

def main():
    # Load YOLO model (.pt)
    model = YOLO("./models/yolo/last301125.pt")  # change to your file

    # Video source
    cap = cv2.VideoCapture(0)  # webcam (0)
    # For file: cap = cv2.VideoCapture("video.mp4")
    # For RTSP: cap = cv2.VideoCapture("rtsp://user:pass@ip/stream")

    if not cap.isOpened():
        print("Error: Cannot open video source")
        return

    while True:
        ret, frame = cap.read()
        if not ret:
            break

        # Run YOLO tracking
        results = model.track(
            frame,
            persist=True,       # keep tracking IDs across frames
            conf=0.5,           # confidence threshold
            iou=0.45,           # IOU threshold
            tracker="bytetrack.yaml"  # options: bytetrack.yaml, botsort.yaml
        )

        annotated_frame = results[0].plot()  # draw boxes, IDs, labels

        cv2.imshow("YOLO Tracking Test", annotated_frame)

        if cv2.waitKey(1) & 0xFF == 27:  # press ESC to exit
            break

    cap.release()
    cv2.destroyAllWindows()

if __name__ == "__main__":
    main()
