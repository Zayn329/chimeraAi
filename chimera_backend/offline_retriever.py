"""Local TF-IDF retrieval used when Pinecone or Groq is unavailable."""

from __future__ import annotations

import json
import pickle
from pathlib import Path
from typing import Any

from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity


DATA_ROOT = Path(__file__).resolve().parent / "data"
INDEX_ROOT = DATA_ROOT / "indexes"
RECORD_ROOT = DATA_ROOT / "records"
INDEX_ROOT.mkdir(parents=True, exist_ok=True)
RECORD_ROOT.mkdir(parents=True, exist_ok=True)


def _paths(kind: str) -> tuple[Path, Path]:
    return INDEX_ROOT / f"{kind}.pkl", RECORD_ROOT / f"{kind}.json"


def load_records(kind: str) -> list[dict[str, Any]]:
    _, records_path = _paths(kind)
    if not records_path.exists():
        return []
    return json.loads(records_path.read_text(encoding="utf-8"))


def save_records(kind: str, records: list[dict[str, Any]]) -> None:
    _, records_path = _paths(kind)
    records_path.write_text(json.dumps(records, ensure_ascii=False, indent=2), encoding="utf-8")


def rebuild_index(kind: str, records: list[dict[str, Any]]) -> None:
    index_path, _ = _paths(kind)
    texts = [record.get("text", "") for record in records]
    if not texts:
        if index_path.exists():
            index_path.unlink()
        return
    vectorizer = TfidfVectorizer(stop_words="english", ngram_range=(1, 2))
    matrix = vectorizer.fit_transform(texts)
    with index_path.open("wb") as stream:
        pickle.dump({"vectorizer": vectorizer, "matrix": matrix}, stream)


def add_records(kind: str, records: list[dict[str, Any]]) -> None:
    current = load_records(kind)
    current.extend(records)
    save_records(kind, current)
    rebuild_index(kind, current)


def search(kind: str, query: str, top_k: int = 5, filters: dict[str, Any] | None = None) -> list[dict[str, Any]]:
    index_path, _ = _paths(kind)
    records = load_records(kind)
    if not records or not index_path.exists():
        return []
    with index_path.open("rb") as stream:
        index = pickle.load(stream)
    query_vector = index["vectorizer"].transform([query])
    scores = cosine_similarity(query_vector, index["matrix"])[0]
    allowed = [
        int(i) for i in scores.argsort()[::-1]
        if not filters or all(records[int(i)].get(key) == value for key, value in filters.items())
    ][:top_k]
    return [
        {**records[int(i)], "score": float(scores[int(i)])}
        for i in allowed
        if scores[int(i)] > 0
    ]
