import os
import uuid
from flask import Blueprint, request, jsonify
from services.transcription import transcribe_audio

transcribe_bp = Blueprint("transcribe", __name__)

UPLOAD_FOLDER = "uploads"
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

@transcribe_bp.route("/api/transcribe", methods=["POST"])
def transcribe():
    if "audio" not in request.files:
        return jsonify({"error": "No audio file provided"}), 400

    audio_file = request.files["audio"]
    if audio_file.filename == "":
        return jsonify({"error": "No selected file"}), 400

    # Save the file temporarily
    filename = f"{uuid.uuid4()}.wav"
    filepath = os.path.join(UPLOAD_FOLDER, filename)
    audio_file.save(filepath)

    try:
        # Transcribe using the existing service
        transcript = transcribe_audio(filepath)
        
        return jsonify({"text": transcript}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        # Clean up files
        if os.path.exists(filepath):
            os.remove(filepath)
        txt_path = filepath + ".txt"
        if os.path.exists(txt_path):
            os.remove(txt_path)
