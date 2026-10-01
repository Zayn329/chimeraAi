"""Parsing and indexing for teacher text banks and student PDFs."""

from __future__ import annotations

import re
import uuid
from pathlib import Path

from pypdf import PdfReader

from chimera_backend.offline_retriever import add_records


UPLOAD_ROOT = Path(__file__).resolve().parent / "data" / "uploads"
UPLOAD_ROOT.mkdir(parents=True, exist_ok=True)


def _chunks(text: str, size: int = 900, overlap: int = 120) -> list[str]:
    words = text.split()
    chunks = []
    step = max(1, size - overlap)
    for start in range(0, len(words), step):
        chunk = " ".join(words[start:start + size]).strip()
        if chunk:
            chunks.append(chunk)
    return chunks


def parse_question_bank(text: str) -> list[dict]:
    blocks = re.split(r"(?=^\s*(?:Q|Question)\s*[:\-])", text, flags=re.I | re.M)
    records = []
    for block in blocks:
        match = re.search(
            r"(?:Q|Question)\s*[:\-]\s*(.+?)(?:\n\s*(?:A|Answer)\s*[:\-]\s*(.*))?$",
            block.strip(),
            flags=re.I | re.S,
        )
        if not match:
            continue
        question = " ".join(match.group(1).split())
        answer = " ".join((match.group(2) or "").split())
        records.append({
            "id": str(uuid.uuid4()),
            "text": question,
            "question": question,
            "answer": answer,
            "source_type": "teacher_question_bank",
        })
    return records


def ingest_question_bank(filename: str, content: bytes, subject: str = "") -> dict:
    text = content.decode("utf-8", errors="replace")
    records = parse_question_bank(text)
    if not records:
        raise ValueError("No Q/A entries were found. Use Q: and A: lines in the text file.")
    bank_id = str(uuid.uuid4())
    path = UPLOAD_ROOT / f"{bank_id}_{Path(filename).name}"
    path.write_text(text, encoding="utf-8")
    for record in records:
        record.update({"bank_id": bank_id, "subject": subject})
    if records:
        add_records("teacher_question_bank", records)
    return {"bank_id": bank_id, "questions": len(records)}


def ingest_pdf(filename: str, content: bytes) -> dict:
    document_id = str(uuid.uuid4())
    path = UPLOAD_ROOT / f"{document_id}_{Path(filename).name}"
    path.write_bytes(content)
    reader = PdfReader(str(path))
    records = []
    for page_number, page in enumerate(reader.pages, start=1):
        text = page.extract_text() or ""
        for chunk in _chunks(text):
            records.append({
                "id": str(uuid.uuid4()),
                "document_id": document_id,
                "page_number": page_number,
                "text": chunk,
                "source_type": "student_pdf",
                "filename": filename,
            })
    if not records:
        raise ValueError("No selectable text was found in the PDF.")
    add_records("student_documents", records)
    return {"document_id": document_id, "filename": filename, "pages": len(reader.pages), "chunks": len(records)}
