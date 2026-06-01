import dotenv
from langgraph.graph import MessagesState, StateGraph, END, START
from langgraph.prebuilt import ToolNode
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.messages import SystemMessage
from tools import search_pyqs

dotenv.load_dotenv()

class Agentstate(MessagesState):
    pass

llm = ChatGoogleGenerativeAI(model="gemini-3-flash-preview", temperature=0.2)
my_tools = [search_pyqs]
llm_tools = llm.bind_tools(my_tools)

def agent_worker(state: Agentstate) -> dict:
    # The Persona Injection!
    sys_msg = SystemMessage(content="You are a brilliant exam strategist. Analyze past questions, highlight important topics, and give the student a tactical advantage.")
    
    messages = state["messages"]
    response = llm_tools.invoke([sys_msg] + messages)
    return {"messages": [response]}

tool_node = ToolNode(my_tools)

def routing_function(state: Agentstate) -> str:
    last_message = state["messages"][-1]
    if last_message.tool_calls:
        return "tools"
    return END

workflow = StateGraph(Agentstate)
workflow.add_node("agent", agent_worker)
workflow.add_node("tools", tool_node)
workflow.add_edge(START, "agent")
workflow.add_conditional_edges("agent", routing_function)
workflow.add_edge("tools", "agent")

strategist_graph = workflow.compile()