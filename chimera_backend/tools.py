from pydantic import BaseModel, Field
import os
import torch
import asyncio
from typing import Literal
from dotenv import load_dotenv

# Valid Courses List
VALID_COURSES = ["Analysis of Algorithms", "Operating Systems", "Computer Networks"]
course_list_str = ", ".join(VALID_COURSES)

from langchain.tools import tool
from langchain_community.tools import DuckDuckGoSearchRun

from llama_index.core import Settings, VectorStoreIndex
from llama_index.core.vector_stores import MetadataFilters, ExactMatchFilter
from llama_index.embeddings.huggingface import HuggingFaceEmbedding
from llama_index.core.postprocessor import SentenceTransformerRerank
from llama_index.vector_stores.pinecone import PineconeVectorStore
from pinecone import Pinecone

import sys
from pathlib import Path
if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding="utf-8")
        sys.stderr.reconfigure(encoding="utf-8")
    except Exception:
        pass
load_dotenv(Path(__file__).resolve().parent / ".env")
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
        description=f"You MUST provide an exact course name. Available courses are: [{course_list_str}]. If the user asks for a course not in this list, output 'NOT_FOUND'."
    )

class UploadedDocSchema(BaseModel):
    query: str = Field(
        description="The specific question, topic, or term to look up inside the student's uploaded PDF notes."
    )
    document_id: str = Field(
        description="The unique document identifier corresponding to the uploaded PDF."
    )

# Establish Cloud Context
api_key = os.getenv("PINECONE_API_KEY")
pc = Pinecone(api_key=api_key) if api_key else None
index_name = os.getenv("PINECONE_INDEX_NAME", "chimera-brain")
pinecone_index = pc.Index(index_name) if pc else None


@tool(args_schema=SyllabusSchema)    
async def search_syllabus(query: str, course_name: str) -> str:
    '''Search for course specific targets, timelines, and evaluation breakdowns directly inside the syllabus index.'''
    print(f"\n[Tutor Tool] Searching {course_name} Syllabus for: {query}")
    if not pinecone_index:
        return "SYSTEM ALERT: Pinecone is not connected. Use web_search tool instead."
    vector_store = PineconeVectorStore(
        pinecone_index=pinecone_index,
        namespace="syllabi"
    )
    syllabus_index = VectorStoreIndex.from_vector_store(
        vector_store=vector_store,
        embed_model=Settings.embed_model
    )
    
    retriever = syllabus_index.as_retriever(similarity_top_k=4)
    retrieved_nodes = await retriever.aretrieve(query)
    
    if not retrieved_nodes:
        return "SYSTEM ALERT: No reference books found for this exact course in the database. You MUST use the web_search tool instead."
    
    final_nodes = GLOBAL_RERANKER.postprocess_nodes(retrieved_nodes, query_str=query)
    return "\n\n".join([node.text for node in final_nodes])

@tool(args_schema=SearchSchema)
async def search_reference_books(query: str) -> str:
    '''Search core reference textbooks for rigorous engineering proofs and detailed academic explanations.'''
    print(f"\n[Tutor Tool] Searching Reference Books for: {query}")
    if not pinecone_index:
        return "SYSTEM ALERT: Pinecone is not connected. Use web_search tool instead."
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
    
    if not retrieved_nodes:
        return "SYSTEM ALERT: No reference books found for this exact course in the database. You MUST use the web_search tool instead."
    
    final_nodes = GLOBAL_RERANKER.postprocess_nodes(retrieved_nodes, query_str=query)
    return "\n\n".join([node.text for node in final_nodes])

@tool(args_schema=SearchSchema)
async def search_rulebook(query: str) -> str:
    """Searches the autonomous university rulebook regarding administrative compliance, attendance requirements, and grading criteria."""
    print(f"\n[Bureaucrat Tool] Searching Rulebook for: {query}")
    if not pinecone_index:
        return "SYSTEM ALERT: Pinecone is not connected."
    vector_store = PineconeVectorStore(
        pinecone_index=pinecone_index,
        namespace="rule_books"
    )
    rulebook_index = VectorStoreIndex.from_vector_store(
        vector_store=vector_store,
        embed_model=Settings.embed_model
    )
    retriever = rulebook_index.as_retriever(similarity_top_k=3)
    nodes = await retriever.aretrieve(query)
    return "\n\n".join([n.text for n in nodes])

@tool(args_schema=SearchSchema)
async def search_pyqs(query: str) -> str:
    """Searches past examinations and Previous Year Questions (PYQs) to reveal historic structural patterns or topic weights."""
    print(f"\n[Strategist Tool] Searching PYQs for: {query}")
    if not pinecone_index:
        return "SYSTEM ALERT: Pinecone is not connected. Use web_search tool instead."
    vector_store = PineconeVectorStore(
        pinecone_index=pinecone_index,
        namespace="previous_year_qps"
    )
    pyqs_index = VectorStoreIndex.from_vector_store(
        vector_store=vector_store,
        embed_model=Settings.embed_model
    )
    retriever = pyqs_index.as_retriever(similarity_top_k=3)
    nodes = await retriever.aretrieve(query)
    
    if not nodes:
        return "SYSTEM ALERT: No reference books found for this exact course in the database. You MUST use the web_search tool instead."
    
    return "\n\n".join([n.text for n in nodes])

@tool(args_schema=UploadedDocSchema)
async def search_uploaded_document(query: str, document_id: str) -> str:
    """Searches the uploaded student PDF notes in Pinecone namespace 'student_documents' filtered by document_id."""
    print(f"\n[Document Tool] Searching student document [{document_id}] for: {query}")
    if not pinecone_index:
        return "SYSTEM ALERT: Pinecone cloud is unavailable for student document search."
    try:
        vector_store = PineconeVectorStore(
            pinecone_index=pinecone_index,
            namespace="student_documents"
        )
        doc_index = VectorStoreIndex.from_vector_store(
            vector_store=vector_store,
            embed_model=Settings.embed_model
        )
        filters = MetadataFilters(filters=[ExactMatchFilter(key="document_id", value=document_id)])
        retriever = doc_index.as_retriever(similarity_top_k=4, filters=filters)
        nodes = await retriever.aretrieve(query)
        if not nodes:
            return "No matching passages found in the uploaded document."
        final_nodes = GLOBAL_RERANKER.postprocess_nodes(nodes, query_str=query)
        return "\n\n".join([n.text for n in final_nodes])
    except Exception as exc:
        return f"Error retrieving uploaded document from vector DB: {exc}"

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
    my_tools = [search_syllabus, search_reference_books, web_search, search_rulebook, search_pyqs, search_uploaded_document, deep_search]
    print("🚀 All asynchronous tools successfully compiled with strict schema guardrails.")
