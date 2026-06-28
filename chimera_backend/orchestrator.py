from langchain_google_genai import ChatGoogleGenerativeAI
from langgraph.graph import END, START, MessagesState, StateGraph
from langgraph.prebuilt import ToolNode
from pydantic import BaseModel, Field
from typing import Literal
from langchain_core.messages import SystemMessage
from pymongo import MongoClient
import os
from langgraph.checkpoint.mongodb import MongoDBSaver
# Import your tools
from chimera_backend.tools import deep_search, search_pyqs, search_rulebook, search_syllabus, search_reference_books, web_search
mongo_client = MongoClient(os.getenv("MONGODB_URI"))
# Note: Gemini 1.5 Flash is the correct model name (3.5 doesn't exist yet!)
llm = ChatGoogleGenerativeAI(model="gemini-3.1-flash-lite", temperature=0.2)

class SwarmState(MessagesState):
    active_worker: str

# ---------------------------------------------------------
# 1. The Worker Nodes (Fixed Invocation and State Returns)
# ---------------------------------------------------------
async def tutor_worker(state: SwarmState):
    tutor_tools = [search_syllabus, search_reference_books, web_search]
    llm_tutor = llm.bind_tools(tutor_tools) # Removed await
    response = await llm_tutor.ainvoke(state["messages"]) # Actually call the LLM
    return {"messages": [response]} # Return the state update

async def bureaucrat_worker(state: SwarmState):
    bureaucrat_tools = [search_rulebook]
    llm_bureaucrat = llm.bind_tools(bureaucrat_tools)
    response = await llm_bureaucrat.ainvoke(state["messages"])
    return {"messages": [response]}

async def strategist_worker(state: SwarmState):
    strategist_tools = [search_pyqs, deep_search] 
    llm_strategist = llm.bind_tools(strategist_tools)
    response = await llm_strategist.ainvoke(state["messages"])
    return {"messages": [response]}

# ---------------------------------------------------------
# 2. The Supervisor Node
# ---------------------------------------------------------
class RouterSchema(BaseModel):
    next_worker: Literal["TUTOR", "BUREAUCRAT", "STRATEGIST"] = Field(
        description="Select the department node best equipped to handle the current query context."
    )

async def supervisor_router(state: SwarmState):
    """Analyzes historical conversational threads and routes queries instantly."""
    messages = state["messages"]
    supervisor_prompt = SystemMessage(
        content=(
            "You are the Master Intent Router for Chimera AI. Analyze the latest user prompt "
            "and conversational history to assign the request to the correct specialized department:\n"
            "- TUTOR: Explaining technical concepts, syllabus details, or engineering textbook math.\n"
            "- BUREAUCRAT: University administrative rules, KT policy, attendance margins, grading, and fee regulations.\n"
            "- STRATEGIST: Exam prep strategies, study prioritization, past paper analysis, or multi-domain lookups.\n"
            "Analyze the intent accurately and output your decision using the required schema layout.\n"
            "CRITICAL CONSTRAINT: When using database search tools, you must formulate exactly ONE optimal, comprehensive search query. Do NOT issue multiple simultaneous tool calls for the same database."
        )
    )
    
    structured_llm = llm.with_structured_output(RouterSchema)
    decision = await structured_llm.ainvoke([supervisor_prompt] + messages)    
    print(f"\n🧠 [Supervisor Node] Intent accurately routed to: {decision.next_worker}")     
    return {"active_worker": decision.next_worker}

# 3. Routing Logic
def route_to_worker(state: SwarmState) -> str:
    """Reads the active_worker slot to determine routing."""
    worker = state.get("active_worker")
    if worker == "TUTOR":
        return "tutor"
    elif worker == "BUREAUCRAT":
        return "bureaucrat"
    elif worker == "STRATEGIST":
        return "strategist"
    return "tutor" # Safe fallback

def route_after_agent(state: SwarmState):
    last_message = state["messages"][-1]
    if getattr(last_message, "tool_calls", None):
        return "tools"
    return END

def route_after_tools(state: SwarmState):
    return state.get("active_worker", "TUTOR").lower()

# 4. Graph Assembly & Compilation
workflow = StateGraph(SwarmState)

# Register Nodes
workflow.add_node("supervisor", supervisor_router)
workflow.add_node("tutor", tutor_worker)
workflow.add_node("bureaucrat", bureaucrat_worker)
workflow.add_node("strategist", strategist_worker)

# ADDED: The missing Tool Node!
all_tools = [search_syllabus, search_reference_books, web_search, search_rulebook, search_pyqs, deep_search]
workflow.add_node("tools", ToolNode(all_tools))

# Register Edges
workflow.add_edge(START, "supervisor") # Replaced set_start with modern syntax
workflow.add_conditional_edges("supervisor", route_to_worker)

workflow.add_conditional_edges("tutor", route_after_agent, {"tools": "tools", END: END})
workflow.add_conditional_edges("bureaucrat", route_after_agent, {"tools": "tools", END: END})
workflow.add_conditional_edges("strategist", route_after_agent, {"tools": "tools", END: END})

workflow.add_conditional_edges("tools", route_after_tools)

# Final Compilation
cloud_checkpointer = MongoDBSaver(mongo_client)
master_swarm = workflow.compile(checkpointer=cloud_checkpointer)