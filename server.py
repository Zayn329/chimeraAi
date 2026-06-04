from fastapi import FastAPI, HTTPException
import uvicorn
from pydantic import BaseModel
from master_router import app as master_swarm # Assuming 'app' is your compiled graph

# Phase A: The Server Scaffold
app = FastAPI(title="Chimera Swarm API", description="Multi-Agent Academic Router")

# Phase B: Request & Response Guardrails
class SwarmRequest(BaseModel):
    prompt: str
    thread_id: str

class SwarmResponse(BaseModel):
    final_response: str
    status: str

# Phase C: The Graph Endpoint & Checkpointer
@app.post("/api/chat", response_model=SwarmResponse)
async def chat(request: SwarmRequest):
    try:
        # 1. Build the isolation config
        config = {"configurable": {"thread_id": request.thread_id}}
        
        # 2. Invoke the graph asynchronously. We tag the string as a "user" message.
        final_state = await master_swarm.ainvoke(
            {"messages": [("user", request.prompt)]}, 
            config=config
        )
        
        # 3. Extract the final AI message from the state array
        final_message = final_state["messages"][-1].content 
        
        # 4. Return safely via Pydantic
        return SwarmResponse(final_response=final_message, status="success")

    except Exception as e:
        # If the LLM times out or the graph crashes, gracefully report the error
        print(f"Swarm Execution Error: {e}")
        raise HTTPException(status_code=500, detail="Chimera Swarm encountered a critical failure.")

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)