# Dependency Map

## 1. External Third-Party Dependencies

### Backend Dependencies (`chimera_backend/requirements.txt`)
- **Web Framework & Server**:
  - `fastapi` (`0.136.3`): REST API framework for python endpoints.
  - `uvicorn` (`0.48.0`): ASGI web server implementation.
  - `pydantic` (`2.13.4`): Data validation and settings management.
  - `sse-starlette` (`3.4.4`): Server-Sent Events support for FastAPI.
  - `requests` (`2.33.1`): HTTP requests library.

- **LangChain & LangGraph Ecosystem**:
  - `langchain` (`1.3.1`), `langchain-core` (`1.4.0`), `langchain-community` (`0.4.2`): LLM chaining, tool abstractions, DuckDuckGo search integration.
  - `langchain-google-genai` (`4.2.3`): Google Gemini LLM wrapper (`gemini-3.1-flash-lite`, `gemini-2.5-flash`).
  - `langgraph` (`1.2.1`), `langgraph-prebuilt` (`1.1.0`), `langgraph-checkpoint` (`4.1.1`): Multi-agent graph orchestrator framework.
  - `langgraph-checkpoint-mongodb` (`0.4.0`): MongoDB checkpointer for thread memory persistence.
  - `motor` (`3.7.1`): Asynchronous MongoDB driver for Python.

- **LlamaIndex & Vector DB Ecosystem**:
  - `llama-index-core` (`0.14.21`): Indexing, retrieval, and post-processor abstractions.
  - `llama-index-embeddings-huggingface` (`0.7.0`): HuggingFace local embedding integration (`sentence-transformers/all-MiniLM-L6-v2`).
  - `llama-index-vector-stores-pinecone` (`0.8.0`): Vector database adapter for Pinecone.
  - `sentence-transformers` (`5.5.1`): Local embedding generation & cross-encoder re-ranking (`SentenceTransformerRerank`).
  - `pinecone` (`7.3.0`): Pinecone vector database SDK.

- **Utilities**:
  - `python-dotenv` (`1.2.2`): Environment variable loader.

### Gateway Dependencies (`chimera-gateway/`)
- `express`: Web framework for Node.js gateway.
- `cors`: Cross-Origin Resource Sharing middleware.
- `http-proxy-middleware`: Proxying HTTP requests to backend.

---

## 2. External Services & Cloud APIs
- **Google Gemini API**: Generative AI inference engine for intent routing (`gemini-3.1-flash-lite`) and agent generation (`gemini-2.5-flash`).
- **Pinecone Vector Cloud**: Vector database host storing index `chimera-brain` with namespaces (`syllabi`, `reference_books`, `previous_year_qps`, `rule_books`).
- **MongoDB Cloud**: External MongoDB instance storing LangGraph thread checkpoints via `MONGODB_URI`.
- **DuckDuckGo Search API**: External search engine for real-time web querying fallback (`DuckDuckGoSearchRun`).

---

## 3. Internal Module Import Dependency Graph

```
chimera-gateway/index.js
  └── Proxies HTTP requests to chimera_backend/server.py

chimera_backend/server.py
  ├── imports chimera_backend.orchestrator (master_swarm)
  └── imports chimera_backend.semantic_cache (global_semantic_cache)

chimera_backend/orchestrator.py
  ├── imports chimera_backend.tools (search_syllabus, search_reference_books, web_search, search_rulebook, search_pyqs, deep_search)
  ├── uses ChatGoogleGenerativeAI (Gemini LLM)
  └── uses MongoDBSaver (MongoDB Checkpointer)

chimera_backend/master_router.py
  ├── imports chimera_backend.graph_router (tutor_graph)
  ├── imports chimera_backend.strategist_agent (strategist_graph)
  └── imports chimera_backend.bureaucrat_agent (bureaucrat_graph)

chimera_backend/graph_router.py
  └── imports chimera_backend.tools (search_syllabus, search_reference_books, web_search)

chimera_backend/strategist_agent.py
  └── imports chimera_backend.tools (search_pyqs)

chimera_backend/bureaucrat_agent.py
  └── imports chimera_backend.tools (search_rulebook)

chimera_backend/tools.py
  ├── interacts with Pinecone Vector Store ("chimera-brain")
  ├── uses HuggingFaceEmbedding ("sentence-transformers/all-MiniLM-L6-v2")
  ├── uses SentenceTransformerRerank
  └── uses DuckDuckGoSearchRun

chimera_backend/cloud_ingest.py & build_memory.py
  ├── reads local documents
  └── builds / updates Pinecone Index and local LlamaIndex vector store
```
