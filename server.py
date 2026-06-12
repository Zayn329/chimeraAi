import asyncio
from fastapi import FastAPI, HTTPException
from fastapi.responses import StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
from pydantic import BaseModel

# Import our compiled LangGraph workflow asset
from master_router import app as master_swarm 
# Import the custom caching singleton we built in Part 1
from semantic_cache import global_semantic_cache

app = FastAPI(title="Chimera Swarm API", description="Stateless Microservice with Semantic Caching")

# Configure CORS to allow our future decoupled Streamlit or React Clients to talk to us safely
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

# Helper: Mock stream delivery to simulate real-time rendering for cached objects
async def mock_token_streamer(text: str, chunk_delay: float = 0.01):
    """Chunks a pre-saved text string to simulate an active token delivery sequence."""
    # Break text up by words to stream realistic increments smoothly
    words = text.split(" ")
    for i, word in enumerate(words):
        space = " " if i < len(words) - 1 else ""
        yield word + space
        await asyncio.sleep(chunk_delay)

# --- Endpoint 1: Traditional Blocking Response Route ---
@app.post("/api/chat", response_model=SwarmResponse)
async def chat_endpoint(request: SwarmRequest):
    config = {"configurable": {"thread_id": request.thread_id}}
    
    # 🛑 GATE 1: Check Semantic Cache Interception
    cached_answer = global_semantic_cache.check_cache(request.prompt)
    if cached_answer:
        print("⚡ [CACHE HIT] Direct match found. Short-circuiting Swarm execution!")
        return SwarmResponse(final_response=cached_answer, status="success")
    
    # Cache Miss -> Execute Live Swarm Core
    try:
        print("❌ [CACHE MISS] Routing execution context down to LangGraph Swarm...")
        final_state = await master_swarm.ainvoke({"messages": [("user", request.prompt)]}, config=config)
        
        response_text = final_state["messages"][-1].content
        
        # Save newly discovered tracks to our memory vault
        global_semantic_cache.update_cache(request.prompt, response_text)
        
        return SwarmResponse(final_response=response_text, status="success")
        
    except Exception as e:
        return SwarmResponse(final_response=f"Swarm Error: {str(e)}", status="error")

@app.post("/api/chat/stream")
async def stream_chat_endpoint(request: SwarmRequest):
    config = {"configurable": {"thread_id": request.thread_id}}
    
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
                if event["event"] == "on_chat_model_stream":
                    token = event["data"]["chunk"].content
                    if token:
                        collected_tokens.append(token)
                        yield token
            
            # Post-Execution: Commit the complete synthesized answer string to cache
            full_response = "".join(collected_tokens)
            if full_response:
                global_semantic_cache.update_cache(prompt, full_response)
                        
        except Exception as e:
            yield f"\nStreaming Interruption: {str(e)}"
    
    return StreamingResponse(
        event_generator(request.prompt), 
        media_type="text/event-stream"
    )

if __name__ == "__main__":
    uvicorn.run("server:app", host="0.0.0.0", port=8000, reload=True)