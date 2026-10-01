import asyncio
import json
from fastapi import FastAPI, File, HTTPException, UploadFile
from fastapi.responses import StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
from pydantic import BaseModel

# Import our compiled LangGraph workflow asset
from chimera_backend.orchestrator import master_swarm 
# Import the custom caching singleton
from chimera_backend.semantic_cache import global_semantic_cache
from chimera_backend.document_manager import ingest_pdf, ingest_question_bank
from chimera_backend.offline_retriever import search as offline_search

app = FastAPI(title="Chimera Swarm API", description="Stateless Microservice with Caching & Fault Tolerance")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

MAX_UPLOAD_BYTES = 20 * 1024 * 1024


def local_context(prompt: str, document_id: str | None = None) -> tuple[str, str]:
    """Return local retrieval context for the offline path."""
    if document_id:
        matches = offline_search("student_documents", prompt, filters={"document_id": document_id})
    else:
        matches = offline_search("teacher_question_bank", prompt)
    if not matches:
        return "No local matching context was found.", "offline search"

    lines = []
    for match in matches:
        answer = match.get("answer")
        location = f" (page {match['page_number']})" if match.get("page_number") else ""
        lines.append(f"{match['text']}{location}" + (f"\nAnswer: {answer}" if answer else ""))
    return "\n\n".join(lines), "TF-IDF retrieval"

class SwarmRequest(BaseModel):
    prompt: str
    thread_id: str
    document_id: str | None = None

class SwarmResponse(BaseModel):
    final_response: str
    status: str

# 🛡️ Phase 4: Circuit Breaker Logic
class CircuitBreaker:
    def __init__(self, threshold: int = 3):
        self.failure_threshold = threshold
        self.failure_count = 0
        self.state = "CLOSED"  # CLOSED = healthy, OPEN = API rate-limited / offline

    def record_failure(self):
        self.failure_count += 1
        if self.failure_count >= self.failure_threshold:
            self.state = "OPEN"
            print("🚨 [CIRCUIT BREAKER] Tripped to OPEN state! Engaging local fallback.")

    def record_success(self):
        self.failure_count = 0
        self.state = "CLOSED"

global_circuit_breaker = CircuitBreaker(threshold=3)


@app.post("/api/teacher/question-bank")
async def upload_question_bank(
    file: UploadFile = File(...),
    subject: str = "",
):
    if not file.filename or not file.filename.lower().endswith(".txt"):
        raise HTTPException(status_code=400, detail="Upload a .txt question-bank file.")
    content = await file.read()
    if len(content) > MAX_UPLOAD_BYTES:
        raise HTTPException(status_code=413, detail="Question bank is too large.")
    try:
        return ingest_question_bank(file.filename, content, subject)
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc


@app.post("/api/student/document")
async def upload_student_document(file: UploadFile = File(...)):
    if not file.filename or not file.filename.lower().endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Upload a PDF document.")
    content = await file.read()
    if len(content) > MAX_UPLOAD_BYTES:
        raise HTTPException(status_code=413, detail="PDF is too large.")
    try:
        return ingest_pdf(file.filename, content)
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc

# Helper: Mock stream delivery to simulate real-time rendering for cached objects
async def mock_token_streamer(text: str, chunk_delay: float = 0.01):
    """Chunks a pre-saved text string to simulate an active token delivery sequence."""
    words = text.split(" ")
    for i, word in enumerate(words):
        space = " " if i < len(words) - 1 else ""
        yield word + space
        await asyncio.sleep(chunk_delay)


def sse_event(event_type: str, content: str) -> str:
    """Encode one JSON Server-Sent Event for the Streamlit client."""
    payload = json.dumps({"type": event_type, "content": content}, ensure_ascii=False)
    return f"data: {payload}\n\n"

# --- Endpoint 1: Traditional Blocking Response Route ---
@app.post("/api/chat", response_model=SwarmResponse)
async def chat_endpoint(request: SwarmRequest):
    config = {"configurable": {"thread_id": request.thread_id}}
    
    # 🛑 GATE 1: Circuit Breaker Fallback
    if global_circuit_breaker.state == "OPEN":
        fallback = global_semantic_cache.check_cache(request.prompt)
        if fallback:
            return SwarmResponse(final_response=f"⚠️ [Offline Fallback] {fallback}", status="success")
        return SwarmResponse(final_response="System is currently rate-limited. No local cache available.", status="error")

    # 🛑 GATE 2: Check Semantic Cache Interception
    cached_answer = global_semantic_cache.check_cache(request.prompt)
    if cached_answer:
        print("⚡ [CACHE HIT] Direct match found. Short-circuiting Swarm execution!")
        return SwarmResponse(final_response=cached_answer, status="success")

#cache miss -> invoke the master swarm    
    try:
        print("❌ [CACHE MISS] Routing execution context down to LangGraph Swarm...")
        prompt = request.prompt
        if request.document_id:
            context, _ = local_context(request.prompt, request.document_id)
            prompt = f"Answer using this uploaded PDF context:\n{context}\n\nQuestion: {request.prompt}"
        final_state = await master_swarm.ainvoke({"messages": [("user", prompt)]}, config=config)
        response_text = final_state["messages"][-1].content
        
        global_semantic_cache.update_cache(request.prompt, response_text)
        global_circuit_breaker.record_success() # Reset breaker on success
        
        return SwarmResponse(final_response=response_text, status="success")
        
    except Exception as e:
        global_circuit_breaker.record_failure()
        context, mode = local_context(request.prompt, request.document_id)
        return SwarmResponse(
            final_response=f"[{mode} fallback]\n\n{context}",
            status="offline_fallback",
        )

# --- Endpoint 2: Real-time Async Server-Sent Events Route ---

@app.post("/api/chat/stream")
async def stream_chat_endpoint(request: SwarmRequest):
    config = {"configurable": {"thread_id": request.thread_id}}
    
    # 🛑 GATE 1: Circuit Breaker Fallback
    if global_circuit_breaker.state == "OPEN":
        fallback = global_semantic_cache.check_cache(request.prompt)
        if fallback:
            msg = f"⚡STATUS: API Rate Limit hit. Engaging local zero-cost backup brain...\n{fallback}"
        else:
            context, mode = local_context(request.prompt, request.document_id)
            msg = f"⚡STATUS: API unavailable. Using {mode}.\n{context}"
        async def fallback_events():
            yield sse_event("status", msg)

        return StreamingResponse(
            fallback_events(),
            media_type="text/event-stream",
            headers={"Cache-Control": "no-cache", "Connection": "keep-alive", "X-Accel-Buffering": "no"},
        )

    # 🛑 GATE 2: Check Semantic Cache Interception for Live Streams
    cached_answer = global_semantic_cache.check_cache(request.prompt)
    if cached_answer:
        print("⚡ [CACHE HIT] Direct match found. Spawning mock streaming engine...")
        async def cached_events():
            for word in cached_answer.split(" "):
                yield sse_event("token", word + " ")
                await asyncio.sleep(0.01)

        return StreamingResponse(
            cached_events(),
            media_type="text/event-stream",
            headers={"Cache-Control": "no-cache", "Connection": "keep-alive", "X-Accel-Buffering": "no"},
        )
    
    # Cache Miss -> Setup Dynamic Async Event Core Generator
    async def event_generator(prompt: str):
        print("❌ [CACHE MISS] Spawning live LangGraph model streaming pipeline...")
        collected_tokens = []
        
        try:
            effective_prompt = prompt
            if request.document_id:
                context, _ = local_context(prompt, request.document_id)
                effective_prompt = f"Answer using this uploaded PDF context:\n{context}\n\nQuestion: {prompt}"
            async for event in master_swarm.astream_events(
                {"messages": [("user", effective_prompt)]}, 
                version="v2", 
                config=config
            ):
                # 🔌 TELEMETRY TRAP: Node Transitions
                if event["event"] == "on_node_start":
                    node_name = event["name"]
                    # Ignore internal framework nodes (__start__, etc.)
                    if not node_name.startswith("__"):
                        yield sse_event("status", f"Swarm actively engaging node: [{node_name}]...")
                
                # 🔌 TELEMETRY TRAP: Tool Executions
                elif event["event"] == "on_tool_start":
                    tool_name = event["name"]
                    yield sse_event("status", f"Connecting to Pinecone Cloud via: [{tool_name}]...")

                # 💬 CHAT TOKENS: Standard real-time streaming
                elif event["event"] == "on_chat_model_stream":
                    content = event["data"]["chunk"].content
                    
                    if isinstance(content, list):
                        token = ""
                        for block in content:
                            if isinstance(block, dict) and "text" in block:
                                token += block["text"]
                            elif isinstance(block, str):
                                token += block
                    else:
                        token = str(content)
                    
                    # Yield valid tokens (removed .strip() so spaces aren't swallowed)
                    if token:
                        collected_tokens.append(token)
                        yield sse_event("token", token)
            
            # Post-Execution: Commit the complete synthesized answer string to cache
            full_response = "".join(collected_tokens)
            if full_response:
                global_semantic_cache.update_cache(prompt, full_response)
                global_circuit_breaker.record_success() # Reset breaker on successful stream
                        
        except Exception as e:
            global_circuit_breaker.record_failure()
            yield sse_event("status", "Rate limit encountered. Logging fault to Circuit Breaker...")
            context, mode = local_context(prompt, request.document_id)
            yield sse_event("status", f"Switching to {mode}.")
            yield sse_event("token", f"[{mode} fallback]\n\n{context}")
    
    return StreamingResponse(
        event_generator(request.prompt), 
        media_type="text/event-stream",
        headers={"Cache-Control": "no-cache", "Connection": "keep-alive", "X-Accel-Buffering": "no"},
    )

if __name__ == "__main__":
    uvicorn.run("server:app", host="0.0.0.0", port=8000, reload=True)
