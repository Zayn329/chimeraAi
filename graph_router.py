import os
import dotenv
from langgraph.graph import MessagesState, StateGraph, END, START
from langgraph.prebuilt import ToolNode
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.messages import HumanMessage
from tools import search_syllabus, search_reference_books, web_search

# Load local environment variables (.env file)
dotenv.load_dotenv()

# --- UPGRADE 1: The State Clipboard ---
# Added 'verdict' to store the Critic's YES/NO decision
class Agentstate(MessagesState):
    verdict: str

# Initialize model and bind tools (Model name untouched per your request)
llm = ChatGoogleGenerativeAI(model="gemini-3.5-flash", temperature=0.2)
my_tools = [search_syllabus, search_reference_books, web_search]
llm_tools = llm.bind_tools(my_tools)

def agent_worker(state: Agentstate) -> dict:
    """Passes the chat history list to the LLM and appends its response."""
    messages = state["messages"]
    response = llm_tools.invoke(messages)
    return {"messages": [response]}

# Factory instance to auto-unpack and run the requested Python tools
tool_node = ToolNode(my_tools)

# --- UPGRADE 2: The Critic Node ---
def critic_node(state: Agentstate) -> dict:
    """The Critic Agent: Evaluates the draft for hallucinations."""
    print("\n🧐 CRITIC: Evaluating the drafted response...")
    
    # Grab the draft that the Tutor just wrote
    drafted_answer = state["messages"][-1].content

    # The Prompt for the Critic
    critic_prompt = f"""You are a strict fact-checking critic.
    Review the following drafted answer. Does it strictly align with the retrieved facts and avoid making up outside information?
    
    Drafted Answer: {drafted_answer}

    Reply strictly with the word 'YES' or 'NO'."""

    # Ask the LLM to judge the draft
    response = llm.invoke([HumanMessage(content=critic_prompt)])
    raw_verdict = response.content.strip().upper()
    
    if "YES" in raw_verdict:
        print("⚖️ VERDICT: YES (Approved for release)")
        return {"verdict": "YES"}
    else:
        print("⚖️ VERDICT: NO (Hallucination detected! Forcing rewrite...)")
        # Inject a strict warning back into the chat history so the Tutor knows WHY it failed
        rejection_msg = HumanMessage(content="CRITIC REJECTION: Your previous answer contained hallucinations or unverified claims. Rewrite it strictly using ONLY the retrieved context.")
        return {"verdict": "NO", "messages": [rejection_msg]}

# --- UPGRADE 3: The New Traffic Cops ---
def routing_function(state: Agentstate) -> str:
    """Traffic Cop 1: Checks if the LLM chose a tool or wants to be evaluated."""
    last_message = state["messages"][-1]
    
    if getattr(last_message, "tool_calls", None):
        return "tools"
    
    # CHANGED: Instead of going to END, all drafts MUST go to the Critic!
    return "critic" 

def critic_routing_function(state: Agentstate) -> str:
    """Traffic Cop 2: Routes based on the Critic's verdict."""
    if state.get("verdict") == "YES":
        return END      # Answer is safe. Send to user.
    else:
        return "agent"  # Answer is hallucinated. Loop backward to rewrite!

# Build the execution workflow map
workflow = StateGraph(Agentstate)

# Register workflow stations
workflow.add_node("agent", agent_worker)
workflow.add_node("tools", tool_node)
workflow.add_node("critic", critic_node) # Registered the new Critic station

# Connect the nodes with roads
workflow.add_edge(START, "agent")
workflow.add_conditional_edges("agent", routing_function)
workflow.add_edge("tools", "agent")

# Connect the Critic's routing logic
workflow.add_conditional_edges("critic", critic_routing_function)

# Compile the design configuration into a runnable application
tutor_graph = workflow.compile()

if __name__ == "__main__":
    prompt = "What page replacement algorithms are mentioned in the syllabus? Explain them briefly."
    
    print("🚀 Triggering the Chimera Agentic Loop...")
    final_state = tutor_graph.invoke({"messages": [prompt]})
    
    print("\n🎓 FINAL AGENT RESPONSE:\n")
    
    # Extract the final node output message object
    final_message = final_state["messages"][-1]
    
    # Clean output extraction
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