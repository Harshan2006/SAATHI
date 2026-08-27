import os
import uuid
from flask import Blueprint, request, jsonify
from services.input_parser import extract_input

input_parsing_bp = Blueprint("input_parsing", __name__)

UPLOAD_FOLDER = "uploads"
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

@input_parsing_bp.route("/api/parse-input", methods=["POST"])
def parse_input():
    if "file" not in request.files:
        return jsonify({"error": "No file provided"}), 400

    file = request.files["file"]
    if file.filename == "":
        return jsonify({"error": "No selected file"}), 400

    # Save the file temporarily
    ext = os.path.splitext(file.filename)[1]
    # Handle files without extensions or with generic blobs
    if not ext and "audio" in file.content_type:
        ext = ".webm"
        
    filename = f"{uuid.uuid4()}{ext}"
    filepath = os.path.join(UPLOAD_FOLDER, filename)
    file.save(filepath)

    try:
        # Extract text using the multimodal input parser
        result = extract_input(filepath)
        
        return jsonify(result), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        # Clean up the main uploaded file
        if os.path.exists(filepath):
            os.remove(filepath)
        
        # Clean up any potential whisper-generated text files
        txt_path = os.path.splitext(filepath)[0] + ".txt"
        if os.path.exists(txt_path):
            os.remove(txt_path)
