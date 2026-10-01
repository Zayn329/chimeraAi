# Chimera AI Academic Assistant

## Case Study Source Document for NotebookLM PPT Creation

### Presentation constraints

- Create a presentation of 6–8 slides.
- Use a clear academic case-study style.
- Explain the problem, solution, architecture, technologies, workflows, results, limitations, and future scope.
- Keep slide text concise and use diagrams where useful.
- Do not claim that the system implements BFS, DFS, A*, regression, classification, clustering, or computer vision.
- The project currently focuses on NLP-style document question answering, semantic retrieval, multi-agent routing, and offline fallback.

---

## 1. Project title

**Chimera AI: Intelligent Academic Assistant**

Chimera is an AI-powered academic assistant that helps students and teachers work with academic documents, syllabi, PDFs, and question banks. It combines large-language-model responses, document retrieval, multi-agent routing, semantic caching, and local TF-IDF fallback retrieval.

The system is designed to remain useful even when an online AI API or vector database is unavailable.

---

## 2. Problem statement

Students often need to search through syllabi, textbooks, PDFs, previous-year questions, and notes before they can find a useful answer. This process is slow and difficult when information is distributed across many documents.

Teachers also need a structured way to share question banks and answers with students.

The project addresses these problems by providing:

- A conversational academic assistant.
- A teacher question-bank upload page.
- A student PDF upload and question-answering page.
- Semantic document retrieval.
- Specialized agents for different academic tasks.
- A local offline fallback when online services fail.
- Real-time token-by-token responses through Server-Sent Events.

---

## 3. Project objectives

The main objectives are:

1. Build an AI chatbot for academic questions.
2. Allow students to upload PDFs and ask questions about their contents.
3. Allow teachers to upload `.txt` question banks containing questions and answers.
4. Use Groq for natural-language answer generation.
5. Use embeddings and Pinecone for semantic retrieval.
6. Use TF-IDF and cosine similarity as an offline fallback.
7. Use multiple specialized agents for tutoring, exam strategy, and administrative queries.
8. Display processing status and generated responses token by token.
9. Cache repeated semantic queries to reduce unnecessary API calls.

---

## 4. Users and use cases

### Student use cases

- Upload a lecture note or textbook PDF.
- Ask questions about the uploaded document.
- Ask for explanations of academic concepts.
- Search for relevant information from the syllabus or reference material.
- Ask exam-preparation questions.
- Continue receiving useful local answers when online services fail.

### Teacher use cases

- Upload a text-based question bank.
- Include questions and teacher-provided answers.
- Make the question bank searchable through the assistant.
- Provide students with locally retrievable academic content.

### Administrative use cases

- Ask about attendance, grading, university policies, or formal procedures.
- Route these questions to a specialized administrative agent.

---

## 5. High-level system architecture

```text
Teacher / Student
        |
        v
Streamlit GUI
        |
        v
FastAPI Backend
        |
        v
LangGraph Agent Router
        |
        +------------------+------------------+
        |                  |                  |
        v                  v                  v
     Tutor            Strategist        Bureaucrat
        |                  |                  |
        +------------------+------------------+
                           |
                           v
                Groq + Retrieval Tools
                           |
              +------------+------------+
              |                         |
              v                         v
       Pinecone Search          Semantic Cache
              |
              v
     TF-IDF Offline Fallback
                           |
                           v
                  SSE Streaming Response
                           |
                           v
                    Streamlit Chat UI
```

---

## 6. Main technology stack

### User interface

- Streamlit
- Three main views: Teacher Question Bank, Student PDF, and Chat

### Backend

- Python
- FastAPI
- Uvicorn
- Pydantic

### AI and agent orchestration

- Groq through LangChain Groq
- LangChain
- LangGraph
- Specialized tutor, strategist, and bureaucrat agents

### Retrieval and document processing

- Pinecone for online vector retrieval
- LlamaIndex for document indexing and retrieval integration
- HuggingFace sentence-transformer embeddings
- PyPDF for PDF text extraction
- scikit-learn TF-IDF and cosine similarity for local retrieval

### Reliability

- Semantic cache
- Circuit-breaker behavior
- Local TF-IDF fallback
- Server-Sent Events for real-time response streaming

---

## 7. Teacher question-bank workflow

The teacher uploads a `.txt` file containing entries such as:

```text
Q: What is process scheduling?
A: Process scheduling is the method used by an operating system to select the next process for execution.

Q: What is virtual memory?
A: Virtual memory uses disk storage as an extension of RAM.
```

The workflow is:

```text
Teacher selects TXT file
        |
        v
FastAPI upload endpoint
        |
        v
Question-answer parser
        |
        v
Local record storage
        |
        v
TF-IDF index creation
        |
        v
Question bank becomes searchable
```

Relevant implementation files:

- `chimera_backend/streamlit_app.py`
- `chimera_backend/server.py`
- `chimera_backend/document_manager.py`
- `chimera_backend/offline_retriever.py`

---

## 8. Student PDF workflow

The student uploads a PDF and receives a document ID. The PDF is processed page by page.

The workflow is:

```text
Student selects PDF
        |
        v
PDF text extraction
        |
        v
Text is divided into chunks
        |
        v
Chunks receive document and page metadata
        |
        v
TF-IDF local index is updated
        |
        v
Student asks a question
        |
        v
Relevant PDF chunks are retrieved
        |
        v
Groq receives the question and document context
        |
        v
Answer is streamed to the student
```

The document ID ensures that a student question is searched against the selected PDF rather than unrelated uploaded documents.

Relevant implementation files:

- `chimera_backend/streamlit_app.py`
- `chimera_backend/server.py`
- `chimera_backend/document_manager.py`
- `chimera_backend/offline_retriever.py`

---

## 9. Multi-agent design

### Tutor agent

Handles:

- Syllabus questions
- Technical explanations
- Reference-book searches
- Academic concept clarification

### Strategist agent

Handles:

- Exam preparation
- Study prioritization
- Previous-year-question analysis
- Topic importance and study planning

### Bureaucrat agent

Handles:

- Attendance questions
- Grading and university procedures
- Administrative rules
- Formal policy queries

### Agent routing

The supervisor analyzes the user query and routes it to the most suitable agent. LangGraph manages the nodes, tools, conditional paths, and state transitions.

Relevant implementation files:

- `chimera_backend/orchestrator.py`
- `chimera_backend/master_router.py`
- `chimera_backend/graph_router.py`
- `chimera_backend/strategist_agent.py`
- `chimera_backend/bureaucrat_agent.py`

---

## 10. Retrieval and offline fallback

### Online path

```text
User question
        |
        v
Agent chooses a retrieval tool
        |
        v
Pinecone vector search
        |
        v
Retrieved context is sent to Groq
        |
        v
Natural-language answer
```

### Offline path

```text
Groq/Pinecone failure
        |
        v
Semantic cache lookup
        |
        v
TF-IDF vectorization of the question
        |
        v
Cosine-similarity comparison with local records
        |
        v
Best matching question, answer, or PDF passage
```

TF-IDF is a retrieval technique. It finds relevant local text but does not generate a new answer by itself. For teacher question banks, the system can return the matching teacher-provided answer. For PDFs, it can return the most relevant extracted passage.

Relevant implementation files:

- `chimera_backend/offline_retriever.py`
- `chimera_backend/server.py`
- `chimera_backend/semantic_cache.py`

---

## 11. Server-Sent Events and token streaming

The backend exposes:

```text
POST /api/chat/stream
```

The server sends structured SSE events such as:

```json
{"type": "status", "content": "Swarm actively engaging node: tutor"}
```

```json
{"type": "status", "content": "Connecting to Pinecone Cloud via: search_syllabus"}
```

```json
{"type": "token", "content": "Artificial"}
```

The Streamlit interface displays:

- Which agent is active.
- Which retrieval tool is running.
- The generated response as tokens arrive.
- Whether the system has switched to an offline fallback.

This improves transparency and makes the chatbot feel responsive.

Relevant implementation files:

- `chimera_backend/server.py`
- `chimera_backend/streamlit_app.py`

---

## 12. Reliability design

The response strategy is:

```text
Groq + Pinecone
        |
        | failure or rate limit
        v
Semantic cache
        |
        | cache miss
        v
Local TF-IDF retrieval
        |
        | no matching record
        v
No-context fallback message
```

The circuit breaker tracks repeated failures and activates local fallback behavior. This prevents the application from repeatedly calling an unavailable online service.

---

## 13. Case-study results

The project provides:

- Conversational academic question answering.
- Teacher question-bank ingestion.
- Student PDF question answering.
- Multi-agent routing for different academic intents.
- Semantic and vector-based document retrieval.
- Local TF-IDF retrieval during service outages.
- Semantic caching for repeated or similar questions.
- Real-time status and token streaming through SSE.

The project is especially aligned with Artificial Intelligence Lab topics involving:

- Python-based AI development.
- NLP and AI application development.
- AI tools and frameworks.
- AI mini-project implementation.

It does not currently implement BFS, DFS, A*, Hill Climbing, Simulated Annealing, Linear Regression, k-NN, Decision Trees, or K-Means clustering.

---

## 14. Limitations

- Scanned PDFs without selectable text are not processed unless OCR is added.
- TF-IDF retrieves matching text but does not create deep explanations.
- Answer quality depends on the quality of uploaded documents.
- The current project needs stronger authentication for production multi-user deployment.
- Uploaded files need additional privacy and access-control policies for real institutional use.
- Retrieval accuracy should be evaluated using a labelled academic question set.

---

## 15. AI Lab syllabus mapping

This project maps to the following Artificial Intelligence Lab experiments:

| Experiment | Syllabus area | Project evidence |
|---|---|---|
| Experiment 1 | AI and Python environment | Python implementation using LangChain, LangGraph, LlamaIndex, HuggingFace, PyTorch, NumPy, and scikit-learn. |
| Experiment 9 | NLP / AI application development | Chatbot, PDF question answering, question-bank parsing, semantic retrieval, and streamed AI responses. |
| Experiment 10 | AI mini-project / AI application | Complete Chimera system combining agents, document retrieval, Groq, Pinecone, TF-IDF fallback, caching, and Streamlit. |

The project does not currently implement Experiments 2–4 or 6–8: BFS/DFS, Greedy Best-First Search, A*, Hill Climbing, Simulated Annealing, Linear Regression, k-NN, Decision Trees, or K-Means clustering.

---

## 16. Future scope

- Add OCR for scanned PDFs.
- Add authentication for teachers and students.
- Add separate user workspaces and document permissions.
- Add retrieval evaluation metrics such as precision, recall, and hit rate.
- Add subject-wise dashboards.
- Add support for images, tables, and diagrams in PDFs.
- Add voice-based questions and answers.
- Add mobile or production web deployment.
- Add a teacher dashboard for editing and managing question banks.
- Add automatic question generation from uploaded study material.

---

# Recommended 8-slide presentation outline

## Slide 1: Title

**Chimera AI: Intelligent Academic Assistant**

- AI academic support system
- Multi-agent retrieval and offline fallback
- Student and teacher document workflows

## Slide 2: Problem and motivation

- Academic information is distributed across many files.
- Students need faster document-based answers.
- Teachers need a searchable way to distribute question banks.
- Online AI services may be unavailable or rate-limited.

## Slide 3: Objectives and users

- Student PDF question answering
- Teacher question-bank upload
- Multi-agent academic assistance
- Online Groq and Pinecone retrieval
- Offline TF-IDF fallback
- Real-time SSE streaming

## Slide 4: System architecture

Use the high-level architecture diagram from Section 5.

Show the connection between Streamlit, FastAPI, LangGraph, agents, Groq, Pinecone, TF-IDF, and SSE.

## Slide 5: Core workflows

Show two workflows:

1. Teacher `.txt` question-bank upload.
2. Student PDF upload and question answering.

## Slide 6: AI techniques and technology stack

- Multi-agent routing
- Groq LLM
- Embeddings and Pinecone
- TF-IDF and cosine similarity
- PDF extraction and chunking
- Semantic caching

## Slide 7: AI Lab mapping, SSE, and fallback

- Experiment 1: Python AI environment and tools
- Experiment 9: NLP and AI application development
- Experiment 10: AI mini-project
- Agent status events
- Tool execution events
- Token-by-token output
- Groq/Pinecone to cache to TF-IDF fallback path

## Slide 8: Results, limitations, and future scope

- Current limitations
- OCR, authentication, evaluation, and multimodal future scope
- Final conclusion: Chimera combines AI agents, retrieval, and fault tolerance into a practical academic assistant.

---

## Suggested conclusion for the presentation

Chimera demonstrates how large-language-model agents, document retrieval, semantic search, and offline fallback can be integrated into a practical academic assistant. The system supports both teacher and student workflows, provides transparent real-time responses through SSE, and continues to offer useful document-based results when cloud services are unavailable.

## Suggested NotebookLM instruction

Create an 8-slide academic case-study presentation from this document. Use concise bullet points, one architecture diagram, one teacher/student workflow diagram, and one fallback-flow diagram. Keep technical details understandable for undergraduate computer-science students. Emphasize the problem, implementation, AI techniques, results, limitations, and future scope. Do not introduce features that are not described in this source document.
