# Chimera AI - Backend Swarm Code Explanations

This document serves as the absolute technical reference for the Chimera AI multi-agent swarm architecture. Use this file as a baseline memory cache whenever changes, extensions, or debugging are required on the backend system.

---

## 1. System-Wide Architectural Blueprint

Chimera AI uses a non-monolithic, state-machine orchestration workflow designed to prevent **"Vector Bleeding"** (cross-domain hallucination) through absolute data isolation. Instead of querying a unified knowledge database, questions are dynamically routed to isolated data stores and specialized agent personas using `LangGraph` for state-conveyor handling and `LlamaIndex` + local `FAISS` vectors for data access.

### Global Multi-Agent Routing Workflow (Text Flow)
1. **User Request Received:** A student prompt is sent to the backend.
2. **Master Supervisor Analysis:** The request lands on the global supervisor node (`master_router.py`), which uses a structured output call to classify the request into one of three destinations:
   * **Tutor:** For academic concept understanding, syllabus topics, and explanations.
   * **Strategist:** For exam prep strategies, learning approaches, and analyzing past questions.
   * **Bureaucrat:** For college rules, regulations, attendance weightage, and admin policies.
3. **Execution Branch:** The supervisor routes the state to the selected sub-graph node:
   * ➡️ `tutor_graph` (Queries syllabi, reference books, and web)
   * ➡️ `strategist_graph` (Queries past year questions)
   * ➡️ `bureaucrat_graph` (Queries the college rulebook)
4. **Local Agent Processing (Loop):**
   * The active agent evaluates the state.
   * If the agent determines a tool is needed, it calls the corresponding search tool.
   * The tool fetches the context from its isolated vector store, applies semantic re-ranking, and feeds it back into the agent context.
   * The loop repeats until no further tools are needed, and the final answer is returned to the user.

---

## 2. In-Depth File Breakdowns

### 📂 File 1: [build_memory.py](file:///c:/Users/zainp/Desktop/chimeEra/build_memory.py)
* **Role:** The data ingestion pipeline responsible for building and incrementally updating FAISS vector indices from raw physical documents.
* **Core Mechanisms & Variables:**
  * **Windows Threading Fix:** Forces CPU multi-threading parameters on `torch` (`set_num_threads` / `set_num_interop_threads` mapped to core counts) to circumvent PyTorch threading bottlenecks on Windows environments.
  * **Settings.embed_model:** Instantiated globally using `sentence-transformers/all-MiniLM-L6-v2` loaded on GPU (`cuda`) if a CUDA-enabled GPU is detected, falling back to CPU.
  * **Splitters:** Instantiates separate text splitters with differing sizes:
    * `syllabus_splitter`: Small window size (`chunk_size=256`, `chunk_overlap=30`) for high-resolution item retrieval.
    * `book_splitter`: Larger window size (`chunk_size=1024`, `chunk_overlap=50`) to maintain textbook context blocks.
  * **Additive Processing Mode (`ingest_or_update_store`):**
    * Uses `SimpleDirectoryReader` with a single high-performance `PyMuPDFReader` mapping for `.pdf` files.
    * Updates loaded document nodes with metadata schemas.
    * **First Time Setup:** Builds the initial `VectorStoreIndex` from document chunks and persists it on disk.
    * **Additive Setup:** Utilizes `index.refresh_ref_docs` to compare file hashes, dynamically inserting only new or modified document nodes without reconstructing the database.
  * **Index Registry (Domains):**
    1. **Syllabi:** `./data/syllabi` ➡️ `./storage/syllabi_index` (Metadata: `department="CS"`, `doc_type="syllabus"`, `semester="3"`)
    2. **Question Banks:** `./data/qb_and_mse` ➡️ `./storage/qb_index` (Metadata: `department="CS"`, `doc_type="question_bank"`, `semester="3"`)
    3. **Reference Books:** `./data/reference_books` ➡️ `./storage/reference_books_index` (Metadata: `department="CS"`, `doc_type="reference_book"`, `semester="3"`)
    4. **Rule Books:** `./data/rule_books` ➡️ `./storage/rule_books_index` (Metadata: `department="ALL"`, `doc_type="rule_book"`, `semester="ALL"`)
    5. **Previous Year Questions:** `./data/previous_year_qps` ➡️ `./storage/previous_year_qps_index` (Metadata: `department="CS"`, `doc_type="previous_year_qp"`, `semester="3"`)

---

### 📂 File 2: [tools.py](file:///c:/Users/zainp/Desktop/chimeEra/tools.py)
* **Role:** Declarative LangChain tools executing precision context retrievals on isolated data indexes.
* **Core Mechanisms & Variables:**
  * **Global Models Booting:** Pre-loads the embedding transformer and compiles the global Cross-Encoder re-ranker model:
    * `GLOBAL_RERANKER = SentenceTransformerRerank(model="cross-encoder/ms-marco-MiniLM-L-6-v2", top_n=2)`
  * **Structured Schema Enforcement:** Uses Pydantic schemas (`SyllabusSchema` and `SearchSchema`) to enforce strictly typed parameter extraction by the LLM before search execution.
  * **Declared Tools:**
    1. `search_syllabus`: Enforces parametric SQL-style hard pre-filtering (`MetadataFilters` and `ExactMatchFilter` matching `course_name`). Retrieves top 8 chunks, then uses `GLOBAL_RERANKER` to filter down to the top 2 absolute most statistically accurate fragments based on cross-token transformer attention.
    2. `search_reference_books`: Queries textbook indices (top 8), and performs semantic re-ranking to top 2.
    3. `search_rulebook`: Bureaucrat utility that retrieves 3 raw content strings from the rulebook index.
    4. `search_pyqs`: Exam strategist utility that retrieves 3 raw content strings from past year question indices.
    5. `web_search`: Fallback utility executing web searches through `DuckDuckGoSearchRun`.

---

### 📂 File 3: [graph_router.py](file:///c:/Users/zainp/Desktop/chimeEra/graph_router.py) (The AI Tutor Swarm)
* **Role:** State-machine compiled node-graph for academic concept and syllabus questions.
* **Core Mechanisms & Variables:**
  * **AgentState:** Subclasses LangGraph's standard `MessagesState` to carry message lists.
  * **Bound LLM:** Binds `gemini-3-flash-preview` to tools `[search_syllabus, search_reference_books, web_search]`.
  * **Nodes:**
    * `agent_worker`: Invokes model on message history and returns the response state.
    * `tools`: A prebuilt `ToolNode` to execute triggered utility functions.
  * **Conditional Routing:**
    * `routing_function`: Evaluates the last message in state. If tool calls exist, branches to `"tools"`. Otherwise, routes to `END`.

---

### 📂 File 4: [strategist_agent.py](file:///c:/Users/zainp/Desktop/chimeEra/strategist_agent.py) (The Exam Strategist)
* **Role:** Academic coach focusing on tactical learning advantages and PYQ reviews.
* **Core Mechanisms & Variables:**
  * **Persona Injection:** Explicitly inserts an expert system prompt:
    * `"You are a brilliant exam strategist. Analyze past questions, highlight important topics, and give the student a tactical advantage."`
  * **Bound Tools:** Binds only `search_pyqs` (past papers tool) to isolate the agent's actions.
  * **Flow Structure:** Mimics the loop standard (`agent_worker` ➡️ `routing_function` ➡️ `tools` / `END`).

---

### 📂 File 5: [bureaucrat_agent.py](file:///c:/Users/zainp/Desktop/chimeEra/bureaucrat_agent.py) (The College Bureaucrat)
* **Role:** Strict compliance engine managing administrative rules, regulations, and course policies.
* **Core Mechanisms & Variables:**
  * **Deterministic Temperature:** Compiles `gemini-3-flash-preview` at `temperature=0.0` to force maximum rigidity and limit stylistic variations.
  * **Persona Injection:** Injects administrative system prompt:
    * `"You are a strict, emotionless college administrator. You must cite exact policy IDs from the rulebook. Never give academic advice."`
  * **Bound Tools:** Binds `search_rulebook` exclusively to prevent advice hallucination.

---

### 📂 File 6: [master_router.py](file:///c:/Users/zainp/Desktop/chimeEra/master_router.py) (The Swarm Orchestrator)
* **Role:** The high-level master supervisor graph that intercepts incoming requests and routes them to the correct specialized sub-graph.
* **Core Mechanisms & Variables:**
  * **Structured Destination Routing:**
    * `RouteDecision` Pydantic model enforces classification output strictly containing a string mapping to `"tutor"`, `"strategist"`, or `"bureaucrat"`.
  * **AgentState:** Standardizes state to contain both `messages` and a persistent routing slot (`destination: str`).
  * **Supervisor Logic (`supervisor_node`):**
    * Calls the LLM structured selector exactly once to retrieve the destination and saves it under the state's `"destination"` attribute.
  * **State Graph Compiling:**
    * Sub-graphs (`tutor_graph`, `strategist_graph`, `bureaucrat_graph`) are added directly as modular Nodes in this higher-level orchestration state machine.
    * Routes dynamically through `route_to_worker` depending on supervisor verdict, completing execution through the selected agent's end-node.

---

### 📂 File 7: [server.py](file:///c:/Users/zainp/Desktop/chimeEra/server.py)
* **Role:** The production FastAPI entrypoint bridging the Next.js frontend to the agentic swarm backend.
* **Core Mechanisms & Variables:**
  * **CORS Settings:** Binds wildcard values allowing all origins, methods, and headers to enable client development.
  * **API Contract models:**
    * `ChatRequest`: Takes `prompt` and `thread_id`.
    * `ChatResponse`: Returns `agent_used` and `final_answer`.
  * **Execution Route:** Listens to `POST /api/chat` and executes an asynchronous task executing the compiled agent graph (`tutor_graph` or `master_router.app`).

---

## 3. Dynamic Swarm Integration Status

> [!NOTE]
> **Orchestrator Integration Completed Successfully**
> The `server.py` gateway is now fully integrated with the high-level Master Router (`app` from `master_router.py`). 
> 
> * **Imported Module:** `from master_router import app as master_swarm_app`
> * **Invoked Instance:** `await master_swarm_app.ainvoke(input_state, config=config)`
> 
> **Impact:** Requests received at `POST /api/chat` are fully intercepted and routed dynamically by the supervisor model depending on semantic classification. The returned `agent_used` field is resolved dynamically at runtime using `final_state["destination"]` mapping.

---

## 4. Quick-Reference Domain Isolation Table

| Knowledge Domain / Index | Input Folder Path | Vector Store Folder Path | Responsible Agent | Bound Tools |
| :--- | :--- | :--- | :--- | :--- |
| **Syllabi** | `./data/syllabi` | `./storage/syllabi_index` | AI Tutor (`tutor_graph`) | `search_syllabus` |
| **Reference Books** | `./data/reference_books` | `./storage/reference_books_index` | AI Tutor (`tutor_graph`) | `search_reference_books`, `web_search` |
| **College Rulebook** | `./data/rule_books` | `./storage/rule_books_index` | College Bureaucrat (`bureaucrat_graph`) | `search_rulebook` |
| **Past Exam QPs & QBs** | `./data/previous_year_qps` | `./storage/previous_year_qps_index` | Exam Strategist (`strategist_graph`) | `search_pyqs` |
