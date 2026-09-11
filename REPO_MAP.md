# Repository Map

## Overview
This repository contains the **Chimera AI Assistant** codebase, an agentic multi-agent swarm architecture designed to assist students with course content, exam strategy, and administrative policy queries.

---

## Directory Structure

```
.
├── .gitignore                          # Git ignore rules
├── architechural explanations/         # Design diagrams & Excalidraw blueprints
│   └── day1.excalidraw                 # Excalidraw architecture diagram
├── chimera-gateway/                    # API Gateway service (Node.js/Express)
│   └── index.js                        # Node.js proxy server with route rewriting & CORS
└── chimera_backend/                    # Python Backend & Multi-Agent Engine
    ├── .dockerignore                   # Docker build ignore rules
    ├── Dockerfile                      # Containerization configuration for FastAPI backend
    ├── requirements.txt                # Python package dependencies
    ├── server.py                       # FastAPI application (endpoints, SSE, circuit breaker)
    ├── orchestrator.py                 # LangGraph Master Swarm orchestration graph
    ├── master_router.py                # Intent classification & routing logic (Tutor/Strategist/Bureaucrat)
    ├── graph_router.py                 # Academic Tutor agent graph (syllabus, books, web search)
    ├── strategist_agent.py             # Exam Strategist agent graph (PYQs search)
    ├── bureaucrat_agent.py             # College Bureaucrat agent graph (Rulebook search)
    ├── semantic_cache.py               # In-memory vector cache using HuggingFace embeddings & cosine similarity
    ├── tools.py                        # LangChain tools for Pinecone vector search & DuckDuckGo search
    ├── cloud_ingest.py                 # Batch ingestion script to upload documents to Pinecone
    ├── build_memory.py                 # Local vector store ingestion helper script
    └── streamlit_app.py                # Streamlit UI frontend for testing / interaction
```

---

## Component Summaries

### 1. `chimera-gateway/`
- **`index.js`**: Express-based reverse proxy running on port 3000. It intercept requests to `/proxy/chat` and re-routes them to the FastAPI backend (`/api/chat/stream` on port 8000), managing CORS and SSE streaming headers.

### 2. `chimera_backend/`
- **`server.py`**: Entry point for the FastAPI backend. Hosts `/api/chat` (blocking) and `/api/chat/stream` (SSE). Implements a 3-strike `CircuitBreaker` and integrates `SemanticCache`.
- **`orchestrator.py`**: Defines the top-level LangGraph workflow (`master_swarm`). Connects the `master_router` decision node to the sub-agent graphs (`tutor`, `strategist`, `bureaucrat`). Uses `MemorySaver` for thread state persistence.
- **`master_router.py`**: Uses structured outputs (`RouteDecision` via Gemini LLM) to analyze user prompts and select the destination agent.
- **`graph_router.py`**: Academic Tutor sub-graph. Handles course concepts using `search_syllabus`, `search_reference_books`, and `web_search`.
- **`strategist_agent.py`**: Exam Strategist sub-graph. Formulates study plans and analyzes past papers using `search_pyqs`.
- **`bureaucrat_agent.py`**: Administrative Bureaucrat sub-graph. Cites formal college rules using `search_rulebook`.
- **`semantic_cache.py`**: Implements `SemanticCache` using `sentence-transformers/all-MiniLM-L6-v2` embeddings and cosine similarity matching (default threshold 0.92) to bypass LLM calls on recurring prompts.
- **`tools.py`**: Defines pinecone vector store queries with metadata filtering (e.g., filtering by course name) and cross-encoder re-ranking (`SentenceTransformerRerank`).
- **`cloud_ingest.py`**: Script to process local document folders and ingest vector embeddings into Pinecone index `chimera-brain` with rate-limiting throttling.
- **`build_memory.py`**: Helper script for local document processing and chunking using PyMuPDF and LlamaIndex `SentenceSplitter`.
- **`streamlit_app.py`**: Streamlit chat interface demonstrating multi-agent status telemetry and streaming responses.
