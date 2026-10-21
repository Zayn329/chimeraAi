# 1. Standardize base layer with slim python variant
FROM python:3.12-slim

# 2. Establish work directory scope
WORKDIR /app

ENV PYTHONUNBUFFERED=1 \
    PYTHONPATH=/app \
    PORT=8000

# 3. Install foundational C-compilation headers
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# 4. Copy ONLY requirements first to lock the cache layer
COPY requirements.txt .

# 5. Lightweight PyTorch CPU wheel
RUN pip install --no-cache-dir torch==2.12.0 --index-url https://download.pytorch.org/whl/cpu

# 6. Install microservice dependencies
RUN pip install --no-cache-dir -r requirements.txt

# 7. Pre-bake both embedding and cross-encoder models into Docker layer
RUN python -c "from sentence_transformers import SentenceTransformer, CrossEncoder; SentenceTransformer('sentence-transformers/all-MiniLM-L6-v2'); CrossEncoder('cross-encoder/ms-marco-MiniLM-L-6-v2')"

# 8. Copy backend code
COPY . ./chimera_backend

# 9. Expose port
EXPOSE 8000

# 10. Launch server with dynamic Railway $PORT
CMD ["sh", "-c", "uvicorn chimera_backend.server:app --host 0.0.0.0 --port ${PORT:-8000}"]
