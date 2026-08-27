from pathlib import Path
from pypdf import PdfReader
from docx import Document


def extract_text(file_path):

    extension = Path(file_path).suffix.lower()

    if extension == ".pdf":
        return extract_pdf(file_path)

    if extension == ".docx":
        return extract_docx(file_path)

    if extension == ".txt":
        return extract_txt(file_path)

    raise ValueError(
        f"Unsupported document type: {extension}"
    )


def extract_pdf(file_path):

    text = []

    with open(file_path, "rb") as f:
        reader = PdfReader(f)
        for page in reader.pages:
            page_text = page.extract_text()
            if page_text:
                text.append(page_text)

    return "\n".join(text).strip()


def extract_docx(file_path):

    document = Document(file_path)

    text = []

    for paragraph in document.paragraphs:
        if paragraph.text.strip():
            text.append(paragraph.text)

    return "\n".join(text).strip()


def extract_txt(file_path):

    with open(file_path, "r", encoding="utf-8") as f:
        return f.read().strip()