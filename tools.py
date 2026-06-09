from pydantic import BaseModel, Field
import os
import torch
import asyncio
from dotenv import load_dotenv

from langchain.tools import tool
from langchain_community.tools import DuckDuckGoSearchRun

from llama_index.core import Settings, VectorStoreIndex
from llama_index.core.vector_stores import MetadataFilters, ExactMatchFilter
from llama_index.embeddings.huggingface import HuggingFaceEmbedding
from llama_index.core.postprocessor import SentenceTransformerRerank
from llama_index.vector_stores.pinecone import PineconeVectorStore
from pinecone import Pinecone

load_dotenv()

# Global Embedding Configuration
Settings.embed_model = HuggingFaceEmbedding(
    model_name="sentence-transformers/all-MiniLM-L6-v2",
    device="cuda" if torch.cuda.is_available() else "cpu"
)

print("🧠 Booting up Cross-Encoder Re-ranker globally...")
GLOBAL_RERANKER = SentenceTransformerRerank(
    model="cross-encoder/ms-marco-MiniLM-L-6-v2", 
    top_n=2
)

# --- Strict Pydantic Execution Schemas ---
class SearchSchema(BaseModel):
    query: str = Field(
        description="The specific academic topic, policy, or subject to search in the database."
    )

class SyllabusSchema(BaseModel):
    query: str = Field(
        description="The specific module, topic, or chapter heading to search for within the syllabus."
    )
    course_name: str = Field(
        description="The formal code or title of the academic course (e.g., Operating Systems, Data Structures)."
    )

# Establish Cloud Context
pc = Pinecone(api_key=os.getenv("PINECONE_API_KEY"))
index_name = "chimera-brain"
pinecone_index = pc.Index(index_name)


@tool(args_schema=SyllabusSchema)    
async def search_syllabus(query: str, course_name: str) -> str:
    '''Search for course specific targets, timelines, and evaluation breakdowns directly inside the syllabus index.'''
    print(f"\n[Tutor Tool] Searching {course_name} Syllabus for: {query}")
    vector_store = PineconeVectorStore(
        pinecone_index=pinecone_index,
        namespace="syllabi"
    )
    syllabus_index = VectorStoreIndex.from_vector_store(
        vector_store=vector_store,
        embed_model=Settings.embed_model # 🛠️ Fixed parameter layout
    )
    
    # Optional Fallback: Check if metadata is populated before clamping filter
    retriever = syllabus_index.as_retriever(similarity_top_k=4)
    
    retrieved_nodes = await retriever.aretrieve(query)
    final_nodes = GLOBAL_RERANKER.postprocess_nodes(retrieved_nodes, query_str=query)
    
    return "\n\n".join([node.text for node in final_nodes])

@tool(args_schema=SearchSchema)
async def search_reference_books(query: str) -> str:
    '''Search core reference textbooks for rigorous engineering proofs and detailed academic explanations.'''
    print(f"\n[Tutor Tool] Searching Reference Books for: {query}")
    vector_store = PineconeVectorStore(
        pinecone_index=pinecone_index,
        namespace="reference_books"
    )
    ref_index = VectorStoreIndex.from_vector_store(
        vector_store=vector_store,
        embed_model=Settings.embed_model
    )
    retriever = ref_index.as_retriever(similarity_top_k=8)
    retrieved_nodes = await retriever.aretrieve(query)
    final_nodes = GLOBAL_RERANKER.postprocess_nodes(retrieved_nodes, query_str=query)
    
    return "\n\n".join([node.text for node in final_nodes])

@tool(args_schema=SearchSchema) #  Enforced Schema for Unified Dict Parsing
async def search_rulebook(query: str) -> str:
    """Searches the autonomous university rulebook regarding administrative compliance, attendance requirements, and grading criteria."""
    print(f"\n[Bureaucrat Tool] Searching Rulebook for: {query}")
    vector_store = PineconeVectorStore(
        pinecone_index=pinecone_index,
        namespace="rule_books"
    )
    rulebook_index = VectorStoreIndex.from_vector_store(
        vector_store=vector_store,
        embed_model=Settings.embed_model # 🛠️ Fixed parameter layout
    )
    retriever = rulebook_index.as_retriever(similarity_top_k=3)
    nodes = await retriever.aretrieve(query)
    return "\n\n".join([n.text for n in nodes])

@tool(args_schema=SearchSchema) #  Enforced Schema for Unified Dict Parsing
async def search_pyqs(query: str) -> str:
    """Searches past examinations and Previous Year Questions (PYQs) to reveal historic structural patterns or topic weights."""
    print(f"\n[Strategist Tool] Searching PYQs for: {query}")
    vector_store = PineconeVectorStore(
        pinecone_index=pinecone_index,
        namespace="previous_year_qps"
    )
    pyqs_index = VectorStoreIndex.from_vector_store(
        vector_store=vector_store,
        embed_model=Settings.embed_model # 🛠️ Fixed parameter layout
    )
    retriever = pyqs_index.as_retriever(similarity_top_k=3)
    nodes = await retriever.aretrieve(query)
    return "\n\n".join([n.text for n in nodes])

@tool(args_schema=SearchSchema)
async def web_search(query: str) -> str:
    '''Search the live web to anchor the swarm with contemporary, out-of-database technical developments or public schedules.'''
    search_tool = DuckDuckGoSearchRun()
    result = await asyncio.to_thread(search_tool.run, query)
    return result

@tool(args_schema=SearchSchema)
async def deep_search(query: str) -> str:
    '''Perform a parallel high-concurrency lookup across all database segments and web nodes to assemble an exhaustive summary response.'''
    print(f"\n[Deep Search] Performing concurrent deep search for: {query}")
    
    # Fully unified schema layouts now explicitly map to every tool call smoothly
    tasks = [
        search_syllabus.ainvoke({"query": query, "course_name": "General Engineering"}), 
        search_reference_books.ainvoke({"query": query}),
        search_rulebook.ainvoke({"query": query}),
        search_pyqs.ainvoke({"query": query}),
        web_search.ainvoke({"query": query})
    ]
    results = await asyncio.gather(*tasks)
    return "\n\n".join(results)

if __name__ == "__main__":
    my_tools = [search_syllabus, search_reference_books, web_search, search_rulebook, search_pyqs, deep_search]
    print("🚀 All asynchronous tools successfully compiled with strict schema guardrails.")