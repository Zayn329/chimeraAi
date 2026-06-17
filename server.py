import asyncio
from fastapi import FastAPI, HTTPException
from fastapi.responses import StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
from pydantic import BaseModel

# Import our compiled LangGraph workflow asset
from orchestrator import master_swarm 
# Import the custom caching singleton
from semantic_cache import global_semantic_cache

app = FastAPI(title="Chimera Swarm API", description="Stateless Microservice with Caching & Fault Tolerance")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class SwarmRequest(BaseModel):
    prompt: str
    thread_id: str

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

# Helper: Mock stream delivery to simulate real-time rendering for cached objects
async def mock_token_streamer(text: str, chunk_delay: float = 0.01):
    """Chunks a pre-saved text string to simulate an active token delivery sequence."""
    words = text.split(" ")
    for i, word in enumerate(words):
        space = " " if i < len(words) - 1 else ""
        yield word + space
        await asyncio.sleep(chunk_delay)

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
        final_state = await master_swarm.ainvoke({"messages": [("user", request.prompt)]}, config=config)
        response_text = final_state["messages"][-1].content
        
        global_semantic_cache.update_cache(request.prompt, response_text)
        global_circuit_breaker.record_success() # Reset breaker on success
        
        return SwarmResponse(final_response=response_text, status="success")
        
    except Exception as e:
        global_circuit_breaker.record_failure()
        return SwarmResponse(final_response=f"Swarm Error: {str(e)}", status="error")

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
            msg = "⚡STATUS: API Rate Limit hit. ❌ No local cache match found. Please wait 60 seconds."
        return StreamingResponse(mock_token_streamer(msg), media_type="text/event-stream")

    # 🛑 GATE 2: Check Semantic Cache Interception for Live Streams
    cached_answer = global_semantic_cache.check_cache(request.prompt)
    if cached_answer:
        print("⚡ [CACHE HIT] Direct match found. Spawning mock streaming engine...")
        return StreamingResponse(
            mock_token_streamer(cached_answer), 
            media_type="text/event-stream"
        )
    
    # Cache Miss -> Setup Dynamic Async Event Core Generator
    async def event_generator(prompt: str):
        print("❌ [CACHE MISS] Spawning live LangGraph model streaming pipeline...")
        collected_tokens = []
        
        try:
            async for event in master_swarm.astream_events(
                {"messages": [("user", prompt)]}, 
                version="v2", 
                config=config
            ):
                # 🔌 TELEMETRY TRAP: Node Transitions
                if event["event"] == "on_node_start":
                    node_name = event["name"]
                    # Ignore internal framework nodes (__start__, etc.)
                    if not node_name.startswith("__"):
                        yield f"⚡STATUS: Swarm actively engaging node: [{node_name}]...\n"
                
                # 🔌 TELEMETRY TRAP: Tool Executions
                elif event["event"] == "on_tool_start":
                    tool_name = event["name"]
                    yield f"⚡STATUS: Connecting to Pinecone Cloud via: [{tool_name}]...\n"

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
                        yield token
            
            # Post-Execution: Commit the complete synthesized answer string to cache
            full_response = "".join(collected_tokens)
            if full_response:
                global_semantic_cache.update_cache(prompt, full_response)
                global_circuit_breaker.record_success() # Reset breaker on successful stream
                        
        except Exception as e:
            global_circuit_breaker.record_failure()
            yield f"\n⚡STATUS: Rate limit encountered. Logging fault to Circuit Breaker...\n"
            yield f"System Notice: {str(e)}"
    
    return StreamingResponse(
        event_generator(request.prompt), 
        media_type="text/event-stream"
    )

if __name__ == "__main__":
    uvicorn.run("server:app", host="0.0.0.0", port=8000, reload=True)