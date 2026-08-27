import subprocess


def transcribe_audio(audio_path):

    result = subprocess.run(
        [
            "whisper-cli",
            "-m",
            "models/ggml-base.en.bin",
            "-f",
            audio_path,
            "-otxt"
        ],
        capture_output=True,
        text=True
    )

    if result.returncode != 0:
        raise RuntimeError(result.stderr)

    # Read generated .txt output
    txt_path = audio_path + ".txt"

    with open(txt_path, "r", encoding="utf-8") as f:
        return f.read().strip()