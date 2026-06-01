"""
Chimera AI — Academic Agent REST Bridge
========================================
A lightweight FastAPI wrapper that exposes the MCP tools as standard
REST endpoints for the Vite frontend.

Run:  python academic_rest_bridge.py
      → Serves on http://127.0.0.1:8001
"""

import uvicorn
from fastapi import FastAPI, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import os
import shutil

# Import tool functions directly from the MCP server module
from academic_agent_mcp import (
    process_notice,
    manage_calendar,
    update_study_priority,
    rebalance_sprint_targets
)

app = FastAPI(title="Chimera Academic Agent REST Bridge", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ── Request Models ───────────────────────────

class NoticeRequest(BaseModel):
    image_url: str

class CalendarAddRequest(BaseModel):
    event_name: str
    date: str
    category: str
    subject: str

class PriorityRequest(BaseModel):
    subject: str
    priority: str

class CompileGuideRequest(BaseModel):
    questions: list[str]


# ── Endpoints ────────────────────────────────

@app.post("/api/academic/process-notice")
async def api_process_notice(req: NoticeRequest):
    """Forward notice processing to the MCP tool."""
    try:
        result = process_notice(image_url=req.image_url)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/academic/calendar")
async def api_list_calendar():
    """List all calendar events and subject priorities."""
    try:
        result = manage_calendar(action="list")
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/academic/calendar")
async def api_add_calendar(req: CalendarAddRequest):
    """Add a new calendar event."""
    try:
        result = manage_calendar(
            action="add",
            event_data=req.model_dump(),
        )
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/academic/priority")
async def api_update_priority(req: PriorityRequest):
    """Update a subject's study priority."""
    try:
        result = update_study_priority(
            subject=req.subject,
            priority=req.priority,
        )
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/academic/upload-qb")
async def api_upload_qb(file: UploadFile = File(...)):
    """Uploads a PDF question bank and dynamically adds it to the LlamaIndex storage."""
    try:
        # Save file to data/qb_and_mse/
        os.makedirs("./data/qb_and_mse", exist_ok=True)
        file_path = f"./data/qb_and_mse/{file.filename}"
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
            
        # Run LlamaIndex additive ingestion
        from build_memory import ingest_or_update_store, syllabus_splitter, cores
        from llama_index.readers.file import PyMuPDFReader
        
        parser = PyMuPDFReader()
        file_extractor = {".pdf": parser}
        
        ingest_or_update_store(
            store_name="Question Banks",
            input_dir="./data/qb_and_mse",
            persist_dir="./storage/qb_index",
            metadata_dict={"department": "CS", "doc_type": "question_bank", "semester": "3"},
            splitter=syllabus_splitter,
            file_extractor=file_extractor,
            workers=min(4, cores)
        )
        
        return {"status": "success", "message": f"Successfully ingested {file.filename}"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/academic/compile-guide")
async def api_compile_guide(req: CompileGuideRequest):
    """Compiles a study guide using exactly 1 LLM call based on the QBs and reference books."""
    try:
        from llama_index.core import StorageContext, load_index_from_storage
        from tools import GLOBAL_RERANKER
        from langchain_google_genai import ChatGoogleGenerativeAI
        from langchain_core.messages import SystemMessage, HumanMessage
        
        # Load indices
        qb_index = load_index_from_storage(StorageContext.from_defaults(persist_dir="./storage/qb_index"))
        ref_index = load_index_from_storage(StorageContext.from_defaults(persist_dir="./storage/reference_books_index"))
        
        # Retrieve contexts
        combined_context = []
        for q in req.questions:
            qb_nodes = qb_index.as_retriever(similarity_top_k=3).retrieve(q)
            ref_nodes = ref_index.as_retriever(similarity_top_k=3).retrieve(q)
            
            qb_final = GLOBAL_RERANKER.postprocess_nodes(qb_nodes, query_str=q)
            ref_final = GLOBAL_RERANKER.postprocess_nodes(ref_nodes, query_str=q)
            
            combined_context.extend([n.text for n in qb_final])
            combined_context.extend([n.text for n in ref_final])
            
        # Deduplicate and combine context
        context_str = "\n\n".join(list(set(combined_context)))
        
        # 1 LLM Call
        llm = ChatGoogleGenerativeAI(model="gemini-3-flash-preview", temperature=0.1)
        
        system_msg = SystemMessage(content="You are an expert academic professor. Create a publication-grade revision guide answering the student's selected questions. Use the provided context. If the concept involves graphs, workflows, or architectures (like Resource Allocation Graphs), you MUST generate a valid `mermaid` code block representing it.")
        
        prompt = f"Selected Questions:\n{chr(10).join(req.questions)}\n\nContext to use:\n{context_str}\n\nPlease generate the detailed study guide with inline citations. Make sure to include a mermaid diagram if applicable."
        
        response = llm.invoke([system_msg, HumanMessage(content=prompt)])
        
        content = response.content
        if isinstance(content, list):
            content = " ".join([c.get("text", "") if isinstance(c, dict) else str(c) for c in content])
            
        return {"guide": str(content)}
    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/academic/rebalance")
async def api_rebalance():
    """Trigger zero-LLM deterministic sprint target recalculation."""
    try:
        result = rebalance_sprint_targets()
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/academic/health")
async def health():
    return {"status": "healthy", "service": "academic-agent"}


if __name__ == "__main__":
    uvicorn.run(
        "academic_rest_bridge:app",
        host="127.0.0.1",
        port=8001,
        reload=True,
    )
