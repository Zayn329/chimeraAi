# Chimera AI Academic Assistant

## Advanced Case Study Presentation Source for NotebookLM

### Source context

The reference presentation is titled **AI Mini Project: Study Assistant: AI-Powered Lecture Notes Chatbot**. It presents a retrieval-based chatbot for answering questions from lecture notes and is associated with the Department of Computer Engineering at A.I. Kalsekar Technical Campus, New Panvel.

This document extends that idea into the current Chimera project. It focuses only on:

- K-Means topic clustering.
- Regression-based student performance prediction.
- Advanced retrieval-augmented generation improvements.
- Advanced agent improvements.
- AI Lab syllabus alignment.

Do not add keyword analysis, quiz generation, voice features, computer vision, or unrelated features to the presentation.

Create a focused presentation of 7–8 slides.

---

## 1. Project overview

Chimera is an AI-powered academic assistant that answers questions from lecture notes, syllabi, reference material, teacher question banks, and student-uploaded PDFs.

The system combines:

- A Streamlit academic assistant interface.
- FastAPI backend services.
- Groq-based language-model responses.
- LangGraph multi-agent orchestration.
- Pinecone vector retrieval.
- HuggingFace sentence embeddings.
- TF-IDF offline fallback retrieval.
- Semantic caching.
- Server-Sent Events for status updates and token-by-token output.

The proposed advanced version adds analytics that help organize academic material and estimate student performance.

---

## 2. Case-study problem

Lecture notes and question banks contain many topics, but students and teachers often do not know:

- Which topics are grouped together.
- Which topics appear most frequently.
- Which areas are causing performance problems.
- How to navigate a large collection of academic documents.
- Whether retrieval returned a reliable piece of context.

The advanced Chimera design uses clustering, regression, improved RAG, and stronger agent coordination to make the assistant more useful for academic analysis.

---

## 3. Proposed advanced feature 1: K-Means topic clustering

### Purpose

Automatically group related questions, PDF chunks, or lecture-note sections into topic clusters.

### Processing flow

```text
Uploaded PDF or question bank
        |
        v
Text chunks and question records
        |
        v
Sentence embeddings or TF-IDF vectors
        |
        v
K-Means clustering
        |
        v
Topic groups and cluster labels
```

### Example output

```text
Cluster 1: Search algorithms and graph traversal
Cluster 2: Machine learning models
Cluster 3: Natural language processing
Cluster 4: Knowledge representation
```

### Use in the project

- Organize teacher question banks automatically.
- Show the main topics present in a student PDF.
- Group similar content in the retrieval index.
- Help the tutor agent select a relevant topic context.
- Reveal gaps or overrepresented areas in a question bank.

### Project placement

The clustering module would connect to `document_manager.py` after document chunking and before or alongside `offline_retriever.py` and Pinecone ingestion.

### Syllabus connection

This directly supports Artificial Intelligence Lab Experiment 8: Clustering Techniques using K-Means.

---

## 4. Proposed advanced feature 2: regression-based performance prediction

### Purpose

Estimate a student's expected academic performance from measurable study and interaction data.

### Possible input features

- Number of questions attempted.
- Retrieval questions asked by topic.
- Correct and incorrect responses in an optional assessment record.
- Average response confidence or evaluation score.
- Time spent studying or interacting with material.
- Number of revisions for a topic.

### Processing flow

```text
Student interaction records
        |
        v
Feature table
        |
        v
Linear Regression model
        |
        v
Estimated score or performance trend
```

### Example output

```text
Estimated performance: 72 percent
Strong area: NLP fundamentals
Area requiring attention: Search algorithms
```

The system should present this as an estimate based on available interaction data, not as a guaranteed result.

### Use in the project

- Provide a performance dashboard.
- Identify topics associated with lower scores.
- Compare performance trends over time.
- Help the strategist agent prioritize recommendations.

### Project placement

The regression service would sit beside the agent and retrieval layers. It would read structured interaction data without changing the document-retrieval process.

### Syllabus connection

This directly supports Artificial Intelligence Lab Experiment 6: Machine Learning – Regression.

---

## 5. Advanced RAG improvements

### Hybrid retrieval

Combine:

- Pinecone semantic vector search.
- TF-IDF lexical search.

This helps when a question contains an exact technical term that embeddings may not rank highly, or when the wording differs from the source document.

### Query rewriting

Before retrieval, the tutor agent can rewrite an unclear question into a more precise academic search query while preserving the original user intent.

Example:

```text
Student query: Explain that graph thing from unit 2
Rewritten query: Explain graph traversal algorithms from Unit 2
```

### Cross-encoder reranking

After retrieving candidate chunks, a reranker can reorder them according to their relevance to the complete question. The project already contains a sentence-transformer reranker in `tools.py`, which can be extended for document-specific retrieval.

### Parent-child retrieval

- Retrieve a small, precise child chunk for relevance.
- Return the larger parent section for sufficient context.

This reduces irrelevant context while preserving explanations and definitions around the matching passage.

### Context quality checks

Before generating an answer, the system can check:

- Whether any retrieved chunk is relevant enough.
- Whether multiple chunks agree.
- Whether page or source metadata is available.

If context quality is low, the system can say that the document does not contain enough evidence instead of guessing.

---

## 6. Advanced agent improvements

### Planner and executor separation

Add a planning stage before tool execution:

```text
User question
        |
        v
Planner creates retrieval plan
        |
        v
Executor calls the correct tools
        |
        v
Answer verifier checks the result
```

### Retrieval verifier agent

The verifier checks whether the final answer is supported by the retrieved PDF or question-bank content.

### Specialist routing with confidence

The supervisor can return:

- Selected agent.
- Confidence score.
- Reason for routing.

Low-confidence routing can trigger a clarification question or a broader retrieval search.

### Agent memory by subject

Maintain separate conversational memory for each subject or uploaded document. This prevents content from one course or PDF from mixing with another.

### Tool-use guardrails

The system can restrict each agent to appropriate tools:

- Tutor: syllabus, reference-book, and document search.
- Strategist: question-bank and performance analytics.
- Bureaucrat: rulebook and administrative documents.

These improvements fit the current LangGraph architecture and do not require a different user interface.

---

## 7. Integrated advanced architecture

```text
Student / Teacher
        |
        v
Streamlit interface
        |
        v
FastAPI services
        |
        v
Document ingestion and metadata
        |
        +----------------------+----------------------+
        |                      |                      |
        v                      v                      v
  Embeddings              TF-IDF index          Analytics data
        |                      |                      |
        v                      v                      v
  Pinecone              Offline fallback       Regression model
        |                      |                      |
        +----------------------+----------------------+
                               v
                     Hybrid RAG retrieval
                               |
                               v
                    LangGraph agent planner
                               |
                +--------------+--------------+
                |                             |
                v                             v
        Specialist agents               Answer verifier
                |                             |
                +--------------+--------------+
                               v
                         Groq response
                               |
                               v
                    SSE status and token stream
```

K-Means clustering operates during document analysis and topic organization. Regression operates on structured student interaction data. RAG and agent improvements operate during question answering.

---

## 8. AI Lab syllabus mapping

| AI Lab experiment | Advanced project feature |
|---|---|
| Experiment 1: AI and Python environment | Python implementation using LangChain, LangGraph, LlamaIndex, HuggingFace, PyTorch, NumPy, and scikit-learn. |
| Experiment 6: Regression | Linear Regression estimates performance from structured student interaction features. |
| Experiment 8: Clustering | K-Means groups PDF sections or question-bank entries by topic. |
| Experiment 9: NLP / AI application development | PDF question answering, teacher question-bank search, hybrid retrieval, and chatbot interaction. |
| Experiment 10: AI mini-project | Complete Chimera system combining agents, RAG, analytics, caching, offline fallback, and Streamlit. |

The advanced features do not claim implementation of BFS, DFS, A*, Greedy Best-First Search, Hill Climbing, Simulated Annealing, k-NN, Decision Trees, or computer vision.

---

## 9. Expected benefits

- Topic clustering makes large academic collections easier to understand.
- Regression adds measurable student-performance analysis.
- Hybrid RAG improves retrieval for both semantic and exact-term questions.
- Reranking and context checks improve answer relevance.
- Planning and verification make agent behavior more controlled.
- Subject-specific memory reduces cross-document confusion.
- The existing TF-IDF fallback preserves local functionality during API failures.

---

## Recommended 8-slide presentation outline

### Slide 1: Project title

**Chimera AI: Advanced Academic Assistant**

Subtitle: RAG, multi-agent reasoning, topic clustering, and performance analytics

Use the original project identity from the reference deck if required:

**Study Assistant: AI-Powered Lecture Notes Chatbot**

### Slide 2: Existing system and motivation

- Academic document question answering.
- Teacher question-bank and student PDF workflows.
- Groq, Pinecone, semantic cache, TF-IDF fallback, and SSE.
- Need for better topic organization and student analytics.

### Slide 3: K-Means topic clustering

- Explain the input, vectorization, K-Means process, and output clusters.
- Show an example of search, machine learning, NLP, and knowledge-representation clusters.
- Connect to AI Lab Experiment 8.

### Slide 4: Regression-based performance prediction

- Show student interaction features.
- Show Linear Regression output as an estimated score or trend.
- Explain that the result is an estimate.
- Connect to AI Lab Experiment 6.

### Slide 5: Advanced RAG pipeline

- Hybrid Pinecone and TF-IDF retrieval.
- Query rewriting.
- Cross-encoder reranking.
- Parent-child chunking.
- Context quality checking.

### Slide 6: Advanced agent architecture

- Planner and executor separation.
- Specialist agent routing.
- Subject-specific memory.
- Retrieval verifier.
- Tool-use guardrails.

### Slide 7: Integrated architecture and syllabus mapping

- Use the integrated architecture diagram.
- Include a compact mapping table for Experiments 1, 6, 8, 9, and 10.

### Slide 8: Benefits, limitations, and future direction

Benefits:

- Better organization of academic material.
- Measurable performance analysis.
- More reliable document-grounded answers.
- Controlled and explainable agent workflow.

Limitations:

- Regression requires enough labelled interaction data.
- K-Means quality depends on the chosen number of clusters.
- RAG quality depends on document extraction and chunking.
- Predictions should not be treated as guaranteed academic results.

Conclusion:

Chimera can evolve from a lecture-note chatbot into an academic intelligence platform by combining document-grounded generation with clustering, performance analytics, and controlled multi-agent retrieval.

---

## NotebookLM generation prompt

Create an 8-slide academic case-study presentation from this source document and the uploaded reference presentation. Preserve the original academic project context and use the title “Chimera AI: Advanced Academic Assistant.” Focus only on K-Means topic clustering, regression-based performance prediction, advanced RAG improvements, and advanced agent architecture. Do not add keyword analysis, quiz generation, voice features, computer vision, or other unrelated features.

Use a clean technical style suitable for a Computer Engineering mini-project presentation. Include one K-Means workflow diagram, one regression workflow diagram, one integrated architecture diagram, and one compact AI Lab syllabus-mapping table. Keep each slide concise with no more than five or six main points. Explain which features are currently implemented and which are proposed extensions. Do not present proposed features as completed implementations.
