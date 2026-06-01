import os
import uvicorn
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from langchain_core.messages import HumanMessage

from master_router import app as master_swarm_app

app = FastAPI(title="Chimera AI Multi-Agent Gateway", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ChatRequest(BaseModel):
    prompt: str = Field(...)
    thread_id: str = Field(...)

class ChatResponse(BaseModel):
    agent_used: str = Field(...)
    final_answer: str = Field(...)

@app.post("/api/chat", response_model=ChatResponse)
async def chat_endpoint(request: ChatRequest):
    try:
        print(f"\n📥 Incoming request for Thread [{request.thread_id}]")
        
        input_state = {"messages": [HumanMessage(content=request.prompt)]}
        config = {"configurable": {"thread_id": request.thread_id}}
        
        print("🚀 Swarm activated... running master orchestrator reasoning loop...")
        final_state = await master_swarm_app.ainvoke(input_state, config=config)
        
        if not final_state or "messages" not in final_state:
            raise HTTPException(status_code=500, detail="Machine failed to return messages.")
            
        final_message = final_state["messages"][-1]
        
        # Clean text extraction
        extracted_answer = ""
        if isinstance(final_message.content, list):
            for block in final_message.content:
                if isinstance(block, dict) and 'text' in block:
                    extracted_answer += block['text']
                elif hasattr(block, 'text'):
                    extracted_answer += block.text
                else:
                    extracted_answer += str(block)
        else:
            extracted_answer = str(final_message.content)
            
        print(f"✅ State Machine completed execution.")
        
        # Map dynamic routing destination to the correct agent_used string representation
        destination = final_state.get("destination", "tutor")
        agent_mapping = {
            "tutor": "AI Tutor (Fast Routing)",
            "strategist": "Exam Strategist",
            "bureaucrat": "College Bureaucrat"
        }
        agent_used = agent_mapping.get(destination, f"AI Agent ({destination.capitalize()})")
        
        return ChatResponse(
            agent_used=agent_used,
            final_answer=extracted_answer
        )
        
    except Exception as e:
        print(f"❌ Server Error encountered: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

if __name__ == "__main__":
    uvicorn.run("server:app", host="127.0.0.1", port=8000, reload=True)