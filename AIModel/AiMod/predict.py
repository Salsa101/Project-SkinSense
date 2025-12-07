import cv2
from ultralytics import YOLO
import os

MODEL_PATH = os.path.join(os.path.dirname(__file__), "content/datacontent/yolo_models/best.pt")
model = YOLO(MODEL_PATH)

def run_predict(input_path, output_path):
    results = list(model.predict(source=input_path, conf=0.25, imgsz=640, verbose=False))
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    cv2.imwrite(output_path, results[0].plot())
    
    num_acne = len(results[0].boxes.data) if results[0].boxes is not None else 0

    if num_acne == 0:
        severity = "No acne detected"
    elif num_acne <= 5:
        severity = "Low"
    elif num_acne <= 20:
        severity = "Medium"
    else:
        severity = "Severe"

    return num_acne, severity