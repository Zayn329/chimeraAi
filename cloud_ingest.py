from pinecone import Pinecone,PineconeVectorStore
import os
from llama_index import HuggingFaceEmbedding
from llama_index import StorageContext,SimpleDirectoryReader,VectorStoreIndex
from dotenv import load_dotenv
import torch
load_dotenv()
api_key = os.getenv("PINECONE_API_KEY")
pc=Pinecone(api_key=api_key)
index_name = "chimera-brain"
index = pc.Index(index_name)
embeddings = HuggingFaceEmbedding(model_name="sentence-transformers/all-MiniLM-L6-v2", device="cuda" if torch.cuda.is_available() else "cpu")
print(index.describe_index_stats())
#loading  data from local to pinecone
def ingest_to_cloud(storage_dir:str,namespace:str):
    '''Loads data from local storage to pinecone cloud'''
    print(f"📤 Ingesting data from {storage_dir} to Pinecone namespace '{namespace}'...")
    reader=SimpleDirectoryReader(input_dir=storage_dir,recursive=True)
    documents=reader.load_data()
    print(f"Initializing Cloud Bridge for Namespace: '{namespace}'...")
    vector_store=PineconeVectorStore(
        pinecone_index=index,
        namespace=namespace
    )
    print(f"🚀 Uploading {len(documents)} documents to Pinecone...")
    storage_context=StorageContext.from_defaults(vector_store=vector_store)
    vector_store_index=VectorStoreIndex.from_documents(
        documents,
        storage_context=storage_context
        ,embed_model=embeddings,
        show_progress=True)
    print(f"✅ Successfully ingested {len(documents)} documents to Pinecone namespace '{namespace}'.")  

if __name__=="__main__":
    ingest_to_cloud(storage_dir="./data/syllabi",namespace="syllabi")
    ingest_to_cloud(storage_dir="./data/reference_books",namespace="reference_books")
    ingest_to_cloud(storage_dir="./data/qb_and_mse",namespace="qb_and_mse") 
    ingest_to_cloud(storage_dir="./data/rule_books",namespace="rule_books")
    ingest_to_cloud(storage_dir="./data/previous_year_qps",namespace="previous_year_qps")
    print(index.describe_index_stats())