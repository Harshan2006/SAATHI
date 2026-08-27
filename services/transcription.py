import subprocess
import tempfile
from pathlib import Path
import re


WHISPER_CLI = Path(
    r"E:\Projects\valo\whisper-cublas-12.4.0-bin-x64\Release\whisper-cli.exe"
)

MODEL_PATH = Path(
    r"E:\Projects\valo\models\ggml-small.en.bin"
)

FFMPEG = "ffmpeg"


SUPPORTED_AUDIO = {
    ".wav",
    ".mp3",
    ".ogg",
    ".m4a",
    ".flac",
    ".aac",
    ".webm",
}


def transcribe_image(image_path):
    """Extract English handwriting/print from an image with OCR preprocessing."""
    try:
        import pytesseract
        from PIL import Image, ImageOps
    except ImportError as exc:
        raise RuntimeError("Image OCR needs Pillow and pytesseract. Install the project requirements first.") from exc

    path = Path(image_path)
    if not path.exists():
        raise FileNotFoundError(f"Image file not found: {path}")

    try:
        with Image.open(path) as source:
            # Upscaling, contrast normalisation, and removal of faint ruled lines
            # materially improve pen-written text on photographed forms/notebooks.
            image = ImageOps.exif_transpose(source).convert("L")
            image = ImageOps.autocontrast(image)
            image = image.resize((image.width * 2, image.height * 2), Image.Resampling.LANCZOS)
            image = image.point(lambda value: 255 if value > 160 else 0)
    except OSError as exc:
        raise ValueError("The uploaded file is not a readable image.") from exc

    try:
        text = pytesseract.image_to_string(image, lang="eng", config="--oem 1 --psm 3")
    except pytesseract.TesseractNotFoundError as exc:
        raise RuntimeError("Tesseract OCR is not installed or is not available on PATH.") from exc

    cleaned_lines = []
    for line in text.splitlines():
        line = line.replace("\ufffd", "").replace("_", " ")
        line = re.sub(r"^[|\[\]~`]+\s*", "", line)
        line = re.sub(r"\s+", " ", line).strip()
        if line:
            cleaned_lines.append(line)
    return "\n".join(cleaned_lines)


def transcribe_audio(audio_path):

    audio_path = Path(audio_path)

    if not audio_path.exists():
        raise FileNotFoundError(
            f"Audio file not found: {audio_path}"
        )

    if not WHISPER_CLI.exists():
        raise FileNotFoundError(
            f"whisper-cli not found: {WHISPER_CLI}"
        )

    if not MODEL_PATH.exists():
        raise FileNotFoundError(
            f"Whisper model not found: {MODEL_PATH}"
        )

    if audio_path.suffix.lower() not in SUPPORTED_AUDIO:
        raise ValueError(
            f"Unsupported audio format: {audio_path.suffix}"
        )

    # Whisper works reliably with 16 kHz mono WAV.
    temp_wav = None

    try:

        # WAV can be sent directly to Whisper.
        if audio_path.suffix.lower() == ".wav":
            wav_path = audio_path

        else:
            # Create temporary WAV file.
            temp_file = tempfile.NamedTemporaryFile(
                suffix=".wav",
                delete=False
            )

            temp_wav = Path(temp_file.name)
            temp_file.close()

            ffmpeg_result = subprocess.run(
                [
                    FFMPEG,
                    "-y",
                    "-i",
                    str(audio_path),
                    "-ar",
                    "16000",
                    "-ac",
                    "1",
                    "-c:a",
                    "pcm_s16le",
                    str(temp_wav)
                ],
                capture_output=True,
                text=True
            )

            if ffmpeg_result.returncode != 0:
                raise RuntimeError(
                    "FFmpeg audio conversion failed:\n"
                    + ffmpeg_result.stderr
                )

            wav_path = temp_wav

        # Whisper output should use a temporary basename.
        output_base = wav_path.with_suffix("")

        result = subprocess.run(
            [
                str(WHISPER_CLI),
                "-m",
                str(MODEL_PATH),
                "-f",
                str(wav_path),
                "-otxt",
                "-of",
                str(output_base)
            ],
            capture_output=True,
            text=True
        )

        if result.returncode != 0:
            raise RuntimeError(
                result.stderr or result.stdout
            )

        txt_path = Path(
            str(output_base) + ".txt"
        )

        if not txt_path.exists():
            raise RuntimeError(
                "Whisper completed but no transcription file was generated.\n"
                f"Expected: {txt_path}\n"
                f"Whisper output:\n{result.stdout}"
            )

        with open(
            txt_path,
            "r",
            encoding="utf-8"
        ) as f:
            text = f.read().strip()

        if not text:
            raise RuntimeError(
                "Whisper generated an empty transcription."
            )

        return text

    finally:

        # Remove temporary WAV.
        if temp_wav and temp_wav.exists():
            temp_wav.unlink()

        # Remove temporary Whisper output.
        if temp_wav:
            temp_txt = Path(
                str(temp_wav.with_suffix("")) + ".txt"
            )

            if temp_txt.exists():
                temp_txt.unlink()
