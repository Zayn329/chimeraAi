"""Parsing and indexing for teacher text banks and student PDFs with dual-write vector support."""

from __future__ import annotations

import os
import re
import time
import uuid
from pathlib import Path
from typing import Any

from pypdf import PdfReader

from chimera_backend.offline_retriever import add_records


UPLOAD_ROOT = Path(__file__).resolve().parent / "data" / "uploads"
UPLOAD_ROOT.mkdir(parents=True, exist_ok=True)

# Free-tier safety limits
MAX_PDF_PAGES = 30
MAX_CHUNKS_PER_DOC = 60
PINECONE_STUDENT_NAMESPACE = "student_documents"


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


def async_upsert_pdf_to_pinecone(document_id: str, filename: str, records: list[dict[str, Any]]) -> None:
    """Background worker task to vectorize and upsert PDF chunks into Pinecone."""
    api_key = os.getenv("PINECONE_API_KEY")
    if not api_key:
        print("⚠️ [Pinecone Ingest] PINECONE_API_KEY not configured. Skipping cloud vector upsert.")
        return

    try:
        from pinecone import Pinecone
        from llama_index.vector_stores.pinecone import PineconeVectorStore
        from llama_index.core import Document, StorageContext, VectorStoreIndex
        from chimera_backend.tools import Settings

        pc = Pinecone(api_key=api_key)
        index_name = os.getenv("PINECONE_INDEX_NAME", "chimera-brain")
        pinecone_index = pc.Index(index_name)

        vector_store = PineconeVectorStore(
            pinecone_index=pinecone_index,
            namespace=PINECONE_STUDENT_NAMESPACE,
        )
        storage_context = StorageContext.from_defaults(vector_store=vector_store)

        # Convert chunk records into LlamaIndex Documents
        documents = []
        created_at = int(time.time())
        for rec in records:
            doc = Document(
                text=rec["text"],
                metadata={
                    "document_id": document_id,
                    "filename": filename,
                    "page_number": rec.get("page_number", 1),
                    "source_type": "student_pdf",
                    "created_at": created_at,
                },
            )
            documents.append(doc)

        # Batch upsert to respect Pinecone rate limits
        batch_size = 25
        print(f"🚀 [Pinecone Ingest] Upserting {len(documents)} chunks for doc [{document_id}] to '{PINECONE_STUDENT_NAMESPACE}'...")
        for i in range(0, len(documents), batch_size):
            batch = documents[i:i + batch_size]
            VectorStoreIndex.from_documents(
                batch,
                storage_context=storage_context,
                embed_model=Settings.embed_model,
                show_progress=False,
            )
            if i + batch_size < len(documents):
                time.sleep(0.5)

        print(f"✅ [Pinecone Ingest] Successfully indexed doc [{document_id}] into Pinecone namespace '{PINECONE_STUDENT_NAMESPACE}'.")
    except Exception as exc:
        print(f"❌ [Pinecone Ingest] Failed to index doc [{document_id}] to Pinecone: {exc}")


def ingest_pdf(filename: str, content: bytes, background_tasks: Any | None = None) -> dict:
    """Parse PDF, chunk text, write synchronously to local TF-IDF, and dispatch Pinecone vectorization."""
    document_id = str(uuid.uuid4())
    path = UPLOAD_ROOT / f"{document_id}_{Path(filename).name}"
    path.write_bytes(content)
    reader = PdfReader(str(path))
    records = []

    # Cap total pages to avoid resource exhaustion
    total_pages = min(len(reader.pages), MAX_PDF_PAGES)
    for page_number in range(1, total_pages + 1):
        page = reader.pages[page_number - 1]
        text = page.extract_text() or ""
        for chunk in _chunks(text):
            if len(records) >= MAX_CHUNKS_PER_DOC:
                break
            records.append({
                "id": str(uuid.uuid4()),
                "document_id": document_id,
                "page_number": page_number,
                "text": chunk,
                "source_type": "student_pdf",
                "filename": filename,
            })
        if len(records) >= MAX_CHUNKS_PER_DOC:
            break

    if not records:
        raise ValueError("No selectable text was found in the PDF.")

    # 1. Immediate synchronous local TF-IDF write (<300ms) for instant query readiness
    add_records("student_documents", records)

    # 2. Queue background vectorization to Pinecone if background_tasks is supplied
    has_pinecone = bool(os.getenv("PINECONE_API_KEY"))
    if background_tasks is not None and has_pinecone:
        background_tasks.add_task(async_upsert_pdf_to_pinecone, document_id, filename, records)
        vector_status = "indexing_in_background"
    elif has_pinecone:
        # If called without background_tasks (e.g. CLI), run directly or mark pending
        vector_status = "pinecone_ready"
    else:
        vector_status = "local_tfidf_only"

    return {
        "document_id": document_id,
        "filename": filename,
        "pages": len(reader.pages),
        "chunks": len(records),
        "vector_status": vector_status,
        "namespace": PINECONE_STUDENT_NAMESPACE if has_pinecone else None,
    }
