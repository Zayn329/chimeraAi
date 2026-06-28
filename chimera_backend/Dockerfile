# 1. Standardize base layer with slim python variant
FROM python:3.12-slim

# 2. Establish work directory scope
WORKDIR /app

# 3. Install foundational C-compilation headers (Required for heavy vector/math libs like faiss)
RUN apt-get update && apt-get install -y \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# 4. Copy ONLY the pruned requirements first to lock the cache layer
COPY requirements.txt .

# 🔌 THE PYTORCH HACK: Force download of the lightweight CPU wheel (~150MB vs 2.5GB CUDA)
RUN pip install --no-cache-dir torch==2.12.0 --index-url https://download.pytorch.org/whl/cpu

# 5. Compile remaining standard microservice dependencies 
RUN pip install --no-cache-dir -r requirements.txt

# 6. Pre-bake your MiniLM local embeddings into the Docker layer so it never redownloads at boot
RUN python -c "from sentence_transformers import SentenceTransformer; SentenceTransformer('sentence-transformers/all-MiniLM-L6-v2')"

# 7. Final Code Copy (Typos modified in source will execute instantly via cache skip)
COPY . ./chimera_backend

# 8. Set PYTHONPATH so that the chimera_backend folder is recognized as a package
ENV PYTHONPATH=/app

# 9. Expose FastAPI interface gateway port
EXPOSE 8000

# 10. Launch async execution server
CMD ["uvicorn", "chimera_backend.server:app", "--host", "0.0.0.0", "--port", "8000"]