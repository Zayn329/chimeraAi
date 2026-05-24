import os
import dotenv
from langgraph.graph import MessagesState, StateGraph, END, START
from langgraph.prebuilt import ToolNode
from langchain_google_genai import ChatGoogleGenerativeAI
from tools import search_syllabus, search_reference_books, web_search


# Load local environment variables (.env file)
dotenv.load_dotenv()

class Agentstate(MessagesState):
    pass

# Initialize model and bind tools
llm = ChatGoogleGenerativeAI(model="gemini-2.5-flash", temperature=0.2)
my_tools = [search_syllabus, search_reference_books, web_search]
llm_tools = llm.bind_tools(my_tools)

def agent_worker(state: Agentstate) -> dict:
    """Passes the chat history list to the LLM and appends its response."""
    messages = state["messages"]  # Corrected key access
    response = llm_tools.invoke(messages)
    return {"messages": [response]}

# Factory instance to auto-unpack and run the requested Python tools
tool_node = ToolNode(my_tools)

def routing_function(state: Agentstate) -> str:
    """Traffic Cop: Checks if the LLM chose a tool or wants to finish."""
    last_message = state["messages"][-1]
    
    if last_message.tool_calls:
        return "tools"  # Sends data to the tools node
    return END          # Corrected to use the imported constant for stopping

# Build the execution workflow map
workflow = StateGraph(Agentstate)

# Register workflow stations
workflow.add_node("agent", agent_worker)
workflow.add_node("tools", tool_node)

# Connect the nodes with roads
workflow.add_edge(START, "agent")
workflow.add_conditional_edges("agent", routing_function)
workflow.add_edge("tools", "agent")

# Compile the design configuration into a runnable application
app = workflow.compile()

if __name__ == "__main__":
    prompt = "What page replacement algorithms are mentioned in the  syllabus? Explain them briefly."
    
    print("🚀 Triggering the Chimera Agentic Loop...")
    final_state = app.invoke({"messages": [prompt]})
    
    print("\n🎓 FINAL AGENT RESPONSE:\n")
    
    # Extract the final node output message object
    final_message = final_state["messages"][-1]
    
    # If the content field contains structured blocks or lists, extract just the text strings
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