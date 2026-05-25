
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
from llama_index.embeddings.huggingface import HuggingFaceEmbedding
import torch
from dotenv import load_dotenv
load_dotenv()
Settings.embed_model = HuggingFaceEmbedding(
    model_name="sentence-transformers/all-MiniLM-L6-v2",
    device="cuda" if torch.cuda.is_available() else "cpu"
)
class SearchSchema(BaseModel):
    query: str = Field(
        description="The specific academic topic or subject to look up in the database."
    )
@tool(args_schema=SearchSchema)    
def search_syllabus(query:str)->str:
    '''Search for information in the syllabus wheter it is the subjects, teaching time ,modules in the subjects,course objectives,marks breakdown,lab syllabus,list of refrence books,
    suggested reading materials,cia relevant information,course credits  etc.
    you dont need to search for the concept in the syllabus because the syllabus is only searched when student wanna what topics are covered in the course or other course related information'''
    if os.path.exists("./storage/syllabi_index"):
        index = load_index_from_storage(
            StorageContext.from_defaults(persist_dir="./storage/syllabi_index")
        )
    retriever = index.as_retriever(similarity_top_k=2)
    retrieved_nodes = retriever.retrieve(query)    
    for i, node in enumerate(retrieved_nodes):
            print(f"--- Chunk {i+1} ---")
            print(f"Metadata: {node.metadata}")
            print(f"Text: {node.text.strip()[:300]}...\n")
    text_results = [node.text for node in retrieved_nodes]
    return "\n\n".join(text_results)
@tool(args_schema=SearchSchema)
def search_reference_books(query:str)->str:
    '''search for information in the refrence books when the students asks about the concept in syllabus and the students want to know more about the concept 
    then the agent can search for the concept in the reference books and provide the relevant information to the students
    you dont need to search for the concept in the syllabus because the syllabus is already searched and the relevant information is provided to the students but you can search for the concept in the reference books and provide the relevant information to the students'''
    if os.path.exists("./storage/reference_books_index"):
        index = load_index_from_storage(
            StorageContext.from_defaults(persist_dir="./storage/reference_books_index")
        )
    retriever = index.as_retriever(similarity_top_k=2)
    retrieved_nodes = retriever.retrieve(query)    
    for i, node in enumerate(retrieved_nodes):
            print(f"--- Chunk {i+1} ---")
            print(f"Metadata: {node.metadata}")
            print(f"Text: {node.text.strip()[:300]}...\n")
    text_results = [node.text for node in retrieved_nodes]
    return "\n\n".join(text_results)
@tool(args_schema=SearchSchema)
def web_search(query:str)->str:
    ''' search for information on the web when the students asks about the concept in syllabus and the students want to know more about the concept'''
    search_tool = DuckDuckGoSearchRun()
    result = search_tool.run(query)
    return result

my_tools=[search_syllabus,search_reference_books,web_search]
llm=ChatGoogleGenerativeAI(model="gemini-3.5-flash", temperature=0.2)
llm_tools=llm.bind_tools(my_tools)
llm_tools.invoke("what page replacement algorithms are there in syllabus? after that search for the concept in the reference books and provide the relevant information to the students and if you dont find any relevant information in the reference books then search for the concept on the web and provide the relevant information to the students")
print("🧠 Gemini is thinking...")
response = llm_tools.invoke("what page replacement algorithms are there in syllabus? after that search for the concept in the reference books...")

print("\n🤖 GEMINI'S DECISION:")
print(response.tool_calls)
