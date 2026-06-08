from pydantic import BaseModel, Field
import os
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain.tools import tool
from langchain_community.tools import DuckDuckGoSearchRun
from llama_index.core import Settings
from llama_index.core.vector_stores import MetadataFilters, ExactMatchFilter
from llama_index.embeddings.huggingface import HuggingFaceEmbedding

# FIXED IMPORT: Correct spelling and path
from llama_index.core.postprocessor import SentenceTransformerRerank
from pinecone import Pinecone
from llama_index.vector_stores.pinecone import PineconeVectorStore
from llama_index.core import VectorStoreIndex
import torch
from dotenv import load_dotenv

load_dotenv()

Settings.embed_model = HuggingFaceEmbedding(
    model_name="sentence-transformers/all-MiniLM-L6-v2",
    device="cuda" if torch.cuda.is_available() else "cpu"
)

print("🧠 Booting up Cross-Encoder Re-ranker globally...")
GLOBAL_RERANKER = SentenceTransformerRerank(
    model="cross-encoder/ms-marco-MiniLM-L-6-v2", 
    top_n=2
)

# Schema 1: For normal tools
class SearchSchema(BaseModel):
    query: str = Field(
        description="The specific academic topic or subject to look up in the database."
    )

# Schema 2: For the Syllabus (FIXED: No dangling comma!)
class SyllabusSchema(BaseModel):
    query: str = Field(
        description="The specific academic topic or subject to look up in the database."
    )
    course_name: str = Field(
        description="The name of the course for which the syllabus information is being searched."
    )
pc = Pinecone(api_key=os.getenv("PINECONE_API_KEY"))
index_name = "chimera-brain"
index = pc.Index(index_name)

@tool(args_schema=SyllabusSchema)    
def search_syllabus(query: str, course_name: str) -> str:
    '''Search for information in the syllabus...'''
    print(f"\n[Tutor Tool] Searching {course_name} Syllabus for: {query}")
    vector_store = PineconeVectorStore(
        pinecone_index=index,
        namespace="syllabi"
    )
    index=VectorStoreIndex.from_vector_store(
        vector_store=vector_store,
        embeddings=Settings.embed_model
        )
        
    # FIXED: Wrapped the ExactMatchFilter inside MetadataFilters
    retriever = index.as_retriever(
        similarity_top_k=8,
        filters=MetadataFilters(filters=[ExactMatchFilter(key="course_name", value=course_name)])
    )
    
    retrieved_nodes = retriever.retrieve(query)
    final_nodes = GLOBAL_RERANKER.postprocess_nodes(retrieved_nodes, query_str=query)
    
    for i, node in enumerate(final_nodes):
        print(f"--- Chunk {i+1} (Score: {node.score:.2f}) ---")
        print(f"Metadata: {node.metadata}")
        print(f"Text: {node.text.strip()[:300]}...\n")
        
    text_results = [node.text for node in final_nodes]
    return "\n\n".join(text_results)

@tool(args_schema=SearchSchema)
def search_reference_books(query: str) -> str:
    '''search for information in the reference books...'''
    print(f"\n[Tutor Tool] Searching Reference Books for: {query}")
    vector_store = PineconeVectorStore(
        pinecone_index=index,
        namespace="reference_books"
    )
    ref_index = VectorStoreIndex.from_vector_store(
        vector_store=vector_store,
        embeddings=Settings.embed_model
    )
    retriever = ref_index.as_retriever(similarity_top_k=8)
    retrieved_nodes = retriever.retrieve(query)    
    final_nodes = GLOBAL_RERANKER.postprocess_nodes(retrieved_nodes, query_str=query)
    
    for i, node in enumerate(final_nodes):
        print(f"--- Chunk {i+1} (Score: {node.score:.2f}) ---")
        print(f"Metadata: {node.metadata}")
        print(f"Text: {node.text.strip()[:300]}...\n")
        
    text_results = [node.text for node in final_nodes]
    return "\n\n".join(text_results)

@tool
def search_rulebook(query: str) -> str:
    """Searches the autonomous college rulebook..."""
    print(f"\n[Bureaucrat Tool] Searching Rulebook for: {query}")
    vector_store = PineconeVectorStore(
        pinecone_index=index,
        namespace="rule_books"
    )
    rulebook_index = VectorStoreIndex.from_vector_store(
        vector_store=vector_store,
        embeddings=Settings.embed_model
    )
    retriever = rulebook_index.as_retriever(similarity_top_k=3)
    
    nodes = retriever.retrieve(query)
    return "\n\n".join([n.text for n in nodes])

@tool
def search_pyqs(query: str) -> str:
    """Searches Previous Year Questions (PYQs)..."""
    print(f"\n[Strategist Tool] Searching PYQs for: {query}")
    vector_store = PineconeVectorStore(
        pinecone_index=index,
        namespace="previous_year_qps"
    )
    pyqs_index = VectorStoreIndex.from_vector_store(
        vector_store=vector_store,
        embeddings=Settings.embed_model
    )
    retriever = pyqs_index.as_retriever(similarity_top_k=3)
    nodes = retriever.retrieve(query)
    return "\n\n".join([n.text for n in nodes])

@tool(args_schema=SearchSchema)
def web_search(query: str) -> str:
    ''' search for information on the web...'''
    search_tool = DuckDuckGoSearchRun()
    result = search_tool.run(query)
    return result

if __name__ == "__main__":
    my_tools = [search_syllabus, search_reference_books, web_search, search_rulebook, search_pyqs]
        