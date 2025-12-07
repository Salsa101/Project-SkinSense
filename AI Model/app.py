from flask import Flask, request, jsonify
from AiMod.predict import run_predict
import os
from werkzeug.utils import secure_filename
import cloudinary
import cloudinary.uploader
from dotenv import load_dotenv

# Load env
load_dotenv()

cloudinary.config(
    cloud_name=os.getenv("CLOUDINARY_CLOUD_NAME"),
    api_key=os.getenv("CLOUDINARY_API_KEY"),
    api_secret=os.getenv("CLOUDINARY_API_SECRET")
)

app = Flask(__name__)
UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

@app.route("/predict", methods=["POST"])
def predict():
    if "image" not in request.files:
        return jsonify({"error": "No image uploaded"}), 400

    image_file = request.files["image"]
    filename = secure_filename(image_file.filename)
    input_path = os.path.join(UPLOAD_FOLDER, filename)
    image_file.save(input_path)

    output_path = os.path.join(UPLOAD_FOLDER, f"output_{filename}")

    try:
        num_acne, severity = run_predict(input_path, output_path)

        # Upload ke Cloudinary
        upload_res = cloudinary.uploader.upload(
            output_path,
            folder="faces",
            public_id=f"output_{os.path.splitext(filename)[0]}",
            overwrite=True
        )

        return jsonify({
            "num_acne": num_acne,
            "severity": severity,
            "output_image_url": upload_res.get("secure_url")
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        if os.path.exists(input_path):
            os.remove(input_path)
        if os.path.exists(output_path):
            os.remove(output_path)

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=int(os.environ.get("PORT", 5000)))