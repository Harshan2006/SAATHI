import os
import uuid
from flask import Blueprint, request, jsonify
from services.document_parser import extract_text

documents_bp = Blueprint("documents", __name__)

UPLOAD_FOLDER = "uploads"
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

@documents_bp.route("/api/parse-document", methods=["POST"])
def parse_document():
    if "file" not in request.files:
        return jsonify({"error": "No file provided"}), 400

    file = request.files["file"]
    if file.filename == "":
        return jsonify({"error": "No selected file"}), 400

    # Save the file temporarily
    ext = os.path.splitext(file.filename)[1]
    filename = f"{uuid.uuid4()}{ext}"
    filepath = os.path.join(UPLOAD_FOLDER, filename)
    file.save(filepath)

    try:
        # Extract text using the existing service
        text = extract_text(filepath)
        
        return jsonify({"text": text}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        # Clean up
        if os.path.exists(filepath):
            os.remove(filepath)
