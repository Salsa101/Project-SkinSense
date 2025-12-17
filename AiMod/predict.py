import sys
import cv2
from ultralytics import YOLO
import os

# Argumen: userId, input_image_path, output_path
user_id = sys.argv[1]
input_image = sys.argv[2]
output_path = sys.argv[3]

# Load model
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, "content", "datacontent", "yolo_models", "best.pt")

model = YOLO(MODEL_PATH)

# Predict
results = model.predict(source=input_image, conf=0.25, imgsz=640, verbose=False)
results = list(results)

# Save output
os.makedirs(os.path.dirname(output_path), exist_ok=True)
img = results[0].plot(labels=False)
cv2.imwrite(output_path, img)
#cv2.imwrite(output_path, results[0].plot())

# Jumlah Acne
num_acne = len(results[0].boxes.data) if results[0].boxes is not None else 0

if num_acne == 0:
    severity = "No acne detected"
elif num_acne <= 5:
    severity = "Low"
elif num_acne <= 20:
    severity = "Medium"
else:
    severity = "Severe"

# Print output
print(f"{num_acne}|{severity}")