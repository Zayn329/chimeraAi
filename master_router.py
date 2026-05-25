import os
import dotenv
from pydantic import BaseModel, Field
from typing import Literal
from graph_router import tutor_graph

# Fixed the import paths for LangChain and LangGraph
from langchain_google_genai import ChatGoogleGenerativeAI
from langgraph.graph import MessagesState, StateGraph, START, END

dotenv.load_dotenv()

class RouteDecision(BaseModel):
    '''The RouteDecision model defines the structure of the decision made by the MasterRouter agent.'''
    # Standardized spelling to "bureaucrat"
    destination: Literal["tutor", "strategist", "bureaucrat"] = Field(
        description=
        "Tutor: If the student's query is related to understanding course content, concepts, or seeking explanations.\n"
        "Strategist: If the student's query is about study strategies, time management, or how to approach learning the material.\n"
        "Bureaucrat: If the student's query is related to administrative procedures, policies, or formal processes.\n"
    )

# Added the destination variable to the clipboard blueprint
class AgentState(MessagesState):
    destination: str

 

def strategist_node(state: AgentState) -> dict:
    return {"messages": ["Strategist agent is activated"]}

def bureaucrat_node(state: AgentState) -> dict:
    return {"messages": ["Bureaucrat agent is activated"]}     

llm = ChatGoogleGenerativeAI(model="gemini-3.5-flash", temperature=0.2)
structured_llm = llm.with_structured_output(RouteDecision)

def supervisor_node(state: AgentState) -> dict:
    messages = state["messages"]
    # Call the LLM exactly once and save the decision object
    decision = structured_llm.invoke(messages)
    
    # Save the decision to the 'destination' slot on the clipboard
    return {"destination": decision.destination}

def route_to_worker(state: AgentState) -> str:
    """Reads the destination chosen by the Supervisor."""
    return state["destination"]

workflow = StateGraph(AgentState)

workflow.add_node("supervisor", supervisor_node)
workflow.add_node("tutor", tutor_graph) # Reusing the tutor graph as a node in this higher-level router
workflow.add_node("strategist", strategist_node)
workflow.add_node("bureaucrat", bureaucrat_node)

workflow.add_edge(START, "supervisor")

# The Conditional Edge
workflow.add_conditional_edges("supervisor", route_to_worker)

# The Static Edges
workflow.add_edge("tutor", END)
workflow.add_edge("strategist", END)
workflow.add_edge("bureaucrat", END)

app = workflow.compile()

if __name__ == "__main__":
    prompt = "Who had built js and why? I want to understand the history and motivation behind JavaScript."
    print("🚀 Triggering the Master Router Agentic Loop...")
    
    final_state = app.invoke({"messages": [prompt]})
    
    print("\n🎓 FINAL ROUTING DECISION & RESPONSE:\n")
    
    final_message = final_state["messages"][-1]
    
    if isinstance(final_message.content, list):
        for block in final_message.content:
            if isinstance(block, dict) and 'text' in block:
                print(block['text'])
            elif hasattr(block, 'text'):
                print(block.text)
            else:
                print(block)
    else:
        print(final_message.content)