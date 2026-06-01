import os
import dotenv
from langgraph.graph import MessagesState, StateGraph, END, START
from langgraph.prebuilt import ToolNode
from langchain_google_genai import ChatGoogleGenerativeAI
from tools import search_syllabus, search_reference_books, web_search

dotenv.load_dotenv()

# State is back to just messages (no verdict needed)
class Agentstate(MessagesState):
    pass

llm = ChatGoogleGenerativeAI(model="gemini-3-flash-preview", temperature=0.2)
my_tools = [search_syllabus, search_reference_books, web_search]
llm_tools = llm.bind_tools(my_tools)

def agent_worker(state: Agentstate) -> dict:
    messages = state["messages"]
    response = llm_tools.invoke(messages)
    return {"messages": [response]}

tool_node = ToolNode(my_tools)

# Traffic Cop routes directly to END now!
def routing_function(state: Agentstate) -> str:
    last_message = state["messages"][-1]
    if getattr(last_message, "tool_calls", None):
        return "tools"
    return END 

# Build the execution workflow map
workflow = StateGraph(Agentstate)
workflow.add_node("agent", agent_worker)
workflow.add_node("tools", tool_node)

workflow.add_edge(START, "agent")
workflow.add_conditional_edges("agent", routing_function)
workflow.add_edge("tools", "agent")

tutor_graph = workflow.compile()

if __name__ == "__main__":
    prompt = "What page replacement algorithms are mentioned in the syllabus? Explain them briefly."
    print("🚀 Triggering the Fast Chimera Loop...")
    final_state = tutor_graph.invoke({"messages": [prompt]})
    print("\n🎓 FINAL AGENT RESPONSE:\n")
    print(final_state["messages"][-1].content)