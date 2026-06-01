from pydantic import BaseModel, Field
import os
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain.tools import tool
from langchain_community.tools import DuckDuckGoSearchRun
from llama_index.core import (
    Settings,
    StorageContext,
    load_index_from_storage
)
from llama_index.core.vector_stores import MetadataFilters, ExactMatchFilter
from llama_index.embeddings.huggingface import HuggingFaceEmbedding
from llama_index.core.postprocessor import SentenceTransformerRerank

import torch
from dotenv import load_dotenv

load_dotenv()

# Boot up the heavy ML models ONCE globally
Settings.embed_model = HuggingFaceEmbedding(
    model_name="sentence-transformers/all-MiniLM-L6-v2",
    device="cuda" if torch.cuda.is_available() else "cpu"
)

print("🧠 Booting up Cross-Encoder Re-ranker globally...")
GLOBAL_RERANKER = SentenceTransformerRerank(
    model="cross-encoder/ms-marco-MiniLM-L-6-v2", 
    top_n=2
)

class SearchSchema(BaseModel):
    query: str = Field(description="The specific academic topic or subject to look up in the database.")

class SyllabusSchema(BaseModel):
    query: str = Field(description="The specific academic topic or subject to look up in the database.")
    course_name: str = Field(description="The name of the course for which the syllabus information is being searched.")
    
@tool(args_schema=SyllabusSchema)    
def search_syllabus(query: str, course_name: str) -> str:
    '''Search for information in the syllabus...'''
    print(f"\n[Tutor Tool] Searching {course_name} Syllabus for: {query}")
    if os.path.exists("./storage/syllabi_index"):
        index = load_index_from_storage(StorageContext.from_defaults(persist_dir="./storage/syllabi_index"))
        
    retriever = index.as_retriever(
        similarity_top_k=8,
        filters=MetadataFilters(filters=[ExactMatchFilter(key="course_name", value=course_name)])
    )
    
    retrieved_nodes = retriever.retrieve(query)
    final_nodes = GLOBAL_RERANKER.postprocess_nodes(retrieved_nodes, query_str=query)
    
    for i, node in enumerate(final_nodes):
        print(f"--- Chunk {i+1} (Score: {node.score:.2f}) ---")
        print(f"Text: {node.text.strip()[:200]}...\n")
        
    return "\n\n".join([node.text for node in final_nodes])

@tool(args_schema=SearchSchema)
def search_reference_books(query: str) -> str:
    '''search for information in the reference books...'''
    print(f"\n[Tutor Tool] Searching Reference Books for: {query}")
    if os.path.exists("./storage/reference_books_index"):
        index = load_index_from_storage(StorageContext.from_defaults(persist_dir="./storage/reference_books_index"))
        
    retriever = index.as_retriever(similarity_top_k=8)
    retrieved_nodes = retriever.retrieve(query)    
    final_nodes = GLOBAL_RERANKER.postprocess_nodes(retrieved_nodes, query_str=query)
    
    for i, node in enumerate(final_nodes):
        print(f"--- Chunk {i+1} (Score: {node.score:.2f}) ---")
        print(f"Text: {node.text.strip()[:200]}...\n")
        
    return "\n\n".join([node.text for node in final_nodes])

@tool
def search_rulebook(query: str) -> str:
    """Searches the autonomous college rulebook..."""
    print(f"\n[Bureaucrat Tool] Searching Rulebook for: {query}")
    index = load_index_from_storage(StorageContext.from_defaults(persist_dir="./storage/rule_books_index"))
    retriever = index.as_retriever(similarity_top_k=3)
    return "\n\n".join([n.get_content() for n in retriever.retrieve(query)])

@tool
def search_pyqs(query: str) -> str:
    """Searches Previous Year Questions (PYQs)..."""
    print(f"\n[Strategist Tool] Searching PYQs for: {query}")
    index = load_index_from_storage(StorageContext.from_defaults(persist_dir="./storage/previous_year_qps_index"))
    retriever = index.as_retriever(similarity_top_k=3)
    return "\n\n".join([n.get_content() for n in retriever.retrieve(query)])

@tool(args_schema=SearchSchema)
def web_search(query: str) -> str:
    ''' search for information on the web...'''
    return DuckDuckGoSearchRun().run(query)

if __name__ == "__main__":
    my_tools = [search_syllabus, search_reference_books, web_search, search_rulebook, search_pyqs]
    llm = ChatGoogleGenerativeAI(model="gemini-1.5-flash", temperature=0.2)
    llm_tools = llm.bind_tools(my_tools)
    print("🧠 Gemini is thinking...")
    response = llm_tools.invoke("what page replacement algorithms are there in Operating Systems syllabus?")
    print("\n🤖 GEMINI'S DECISION:", response.tool_calls)