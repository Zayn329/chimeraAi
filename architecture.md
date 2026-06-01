# Chimera AI - Backend Architecture & System Context

## 1. Core Paradigm
Chimera AI is an Enterprise-Grade Multi-Agent Academic Swarm designed to eliminate cross-domain hallucination ("Vector Bleeding") through absolute data isolation. It implements a non-monolithic, state-machine orchestration workflow instead of a basic chat wrapper.

## 2. Directory & Ingestion Architecture
All data indices live within separate, isolated FAISS storage directories on disk. Data is split strictly into four disconnected knowledge domains:
- `./storage/syllabi_index` -> Academic scopes, weights, modules.
- `./storage/reference_books_index` -> Deep textbook concepts (e.g., Operating System Concepts 8th Ed).
- `./storage/rule_books_index` -> Strict administrative rules, compliance, overrides.
- `./storage/previous_year_qps_index` -> Previous Year Questions (PYQs).

## 3. Core Engine Pipeline (The Technical Backbone)
- **State Machine Engine:** Built using `LangGraph` for state-conveyor belt handling (`MessagesState`).
- **Primary LLM:** Google Gemini 3 Flash Preview (`gemini-3-flash-preview`), configured at `temperature=0.2`.
- **Database Search Engine:** `LlamaIndex` + local `FAISS` vectors.
- **Parametric Hard-Scoping:** Pydantic schema wrappers extract target parameters (`course_name`) before vector matching. The system triggers a hard SQL-style pre-filtering layer (`MetadataFilters` + `ExactMatchFilter`) preventing a query in one course from drawing contexts from another.
- **Deep-Learning Sniper Layer:** A globally instantiated Cross-Encoder model (`cross-encoder/ms-marco-MiniLM-L-6-v2`) re-ranks top-8 retrieved raw vector nodes down to the top-2 absolute most statistically accurate fragments based on transformer cross-token attention.

## 4. Production API Specification
The Next.js frontend connects to a high-performance asynchronous `FastAPI` instance listening on `http://127.0.0.1:8000`.

### Endpoint: `POST /api/chat`
- **Request Payload Structure:**
```json
{
  "prompt": "What page replacement algorithms are mentioned in the operating systems syllabus? Explain them briefly.",
  "thread_id": "chimera_session_99"
}
```

- **Response Payload Structure:**
```json
{
  "agent_used": "AI Tutor (Fast Routing) | Exam Strategist | College Bureaucrat",
  "final_answer": "Markdown string containing concepts..."
}
```