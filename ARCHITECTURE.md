# System Architecture Specification

## Architectural Overview
Chimera is a fault-tolerant, low-latency, agentic microservice architecture designed for multi-domain educational query resolution.

```
                  +--------------------------+
                  | Streamlit Frontend (UI)  |
                  +------------+-------------+
                               | (HTTP / SSE)
                               v
                  +--------------------------+
                  | Express Gateway (Port 3000)|
                  |   (CORS & Route Proxy)   |
                  +------------+-------------+
                               |
                               v
                  +--------------------------+
                  | FastAPI Server (Port 8000)|
                  |  - Circuit Breaker       |
                  |  - Semantic Vector Cache |
                  +------------+-------------+
                               | (Cache Miss / Healthy)
                               v
                  +--------------------------+
                  | LangGraph Master Swarm   |
                  |   (orchestrator.py)      |
                  +------------+-------------+
                               |
       +-----------------------+-----------------------+
       |                       |                       |
       v                       v                       v
+--------------+       +----------------+      +----------------+
| Tutor Worker |       | Strategist     |      | Bureaucrat     |
| (Syllabus,   |       | (PYQs, Deep    |      | (Rulebook      |
| Books, Web)  |       | Search)        |      | Search)        |
+-------+------+       +-------+--------+      +-------+--------+
        |                      |                       |
        +----------------------+-----------------------+
                               |
                               v
                       +---------------+
                       | Shared Tools  |
                       | Node (Tools)  |
                       +-------+-------+
                               |
                               v
                       +---------------+
                       | Pinecone DB & |
                       | Gemini Models |
                       +---------------+
```

---

## Component Details

### 1. Gateway Layer (`chimera-gateway/index.js`)
- **Technology**: Node.js, Express, `http-proxy-middleware`.
- **Purpose**: Microservice API Gateway providing CORS termination and path manipulation.
- **Routing**: Intercepts `/proxy/chat` and rewrites target path directly to Python backend `/api/chat/stream`. Sets `Cache-Control: no-cache` and `Connection: keep-alive` for real-time SSE delivery.

### 2. FastAPI Backend Server (`chimera_backend/server.py`)
- **Technology**: Python 3.12, FastAPI, Uvicorn, Pydantic, Server-Sent Events (SSE).
- **Circuit Breaker**:
  - Implements a state-machine (`CLOSED` vs `OPEN`) with a 3-strike failure threshold.
  - When API errors/rate-limits trip the breaker to `OPEN`, requests are automatically rerouted to zero-cost offline `SemanticCache` fallback.
- **Streaming Pipeline (`/api/chat/stream`)**:
  - Utilizes `master_swarm.astream_events` (LangGraph v2 SSE events).
  - Emits telemetry events:
    - Node transition traps: `⚡STATUS: Swarm actively engaging node: [node_name]...`
    - Tool invocation traps: `⚡STATUS: Connecting to Pinecone Cloud via: [tool_name]...`
  - Real-time token delivery via `mock_token_streamer` on cache hits.

### 3. Orchestrator & Multi-Agent Swarm (`chimera_backend/orchestrator.py`)
- **Framework**: LangGraph `StateGraph` with MongoDB Checkpointer (`MongoDBSaver`).
- **Supervisor Node (`supervisor_router`)**:
  - Analyzes message context and classifies request into dynamic worker nodes using Gemini LLM structured outputs (`RouterSchema`).
- **Worker Nodes**:
  - `tutor_worker`: Academic query resolution (Syllabus, Reference Books, DuckDuckGo Web Search).
  - `strategist_worker`: Exam strategy & past paper analysis (`search_pyqs`, `deep_search`).
  - `bureaucrat_worker`: University policy and rulebook enforcement (`search_rulebook`).
- **Shared Tool Node**: Re-routes execution back through centralized `ToolNode` if LLM generates tool calls, returning context to active worker.

### 4. Semantic Cache Layer (`chimera_backend/semantic_cache.py`)
- **Embeddings**: `sentence-transformers/all-MiniLM-L6-v2` (via HuggingFace Embedding).
- **Execution**: Computes Cosine Similarity between prompt vector and stored vault embeddings.
- **Threshold**: `0.92` similarity threshold. On cache hit, short-circuits expensive LLM execution.

### 5. Vector Store & Retrieval Tools (`chimera_backend/tools.py` & `cloud_ingest.py`)
- **Vector Database**: Pinecone Index (`chimera-brain`).
- **Filtering**: `MetadataFilters` with exact match for course titles.
- **Re-Ranking**: Post-processor using `SentenceTransformerRerank` cross-encoder for high precision context ranking.
