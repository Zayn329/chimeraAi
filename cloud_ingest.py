from pinecone import Pinecone
from llama_index.vector_stores.pinecone import PineconeVectorStore
import os
from llama_index.embeddings.huggingface import HuggingFaceEmbedding 
from llama_index.core import StorageContext, SimpleDirectoryReader, VectorStoreIndex 
from dotenv import load_dotenv
import torch
import time
from typing import List
# from llama_index.readers import Document

load_dotenv()
api_key = os.getenv("PINECONE_API_KEY")
pc=Pinecone(api_key=api_key)
index_name = "chimera-brain"
index = pc.Index(index_name)
embeddings = HuggingFaceEmbedding(model_name="sentence-transformers/all-MiniLM-L6-v2", device="cuda" if torch.cuda.is_available() else "cpu")
print(index.describe_index_stats())

# Rate limiting settings for free tier
# Reference books has ~1k pages, others have single docs
RATE_LIMIT_CONFIG = {
    "reference_books": {"batch_size": 5, "delay": 2.0},  # Aggressive throttling
    "qb_and_mse": {"batch_size": 50, "delay": 0.5},      # Faster
    "syllabi": {"batch_size": 50, "delay": 0.5},         # Faster
    "rule_books": {"batch_size": 50, "delay": 0.5},      # Faster
    "previous_year_qps": {"batch_size": 50, "delay": 0.5}  # Faster
}
DELAY_BETWEEN_NAMESPACES = 1.0  # 1 second between namespace uploads

def ingest_to_cloud(storage_dir:str, namespace:str):
    '''Loads data from local storage to pinecone cloud with rate limiting'''
    print(f"📤 Ingesting data from {storage_dir} to Pinecone namespace '{namespace}'...")
    reader=SimpleDirectoryReader(input_dir=storage_dir,recursive=True)
    documents=reader.load_data()
    
    # Get rate limit config for this namespace
    config = RATE_LIMIT_CONFIG.get(namespace, {"batch_size": 10, "delay": 1.0})
    batch_size = config["batch_size"]
    delay = config["delay"]
    
    print(f"Initializing Cloud Bridge for Namespace: '{namespace}'...")
    vector_store=PineconeVectorStore(
        pinecone_index=index,
        namespace=namespace
    )
    
    print(f"🚀 Uploading {len(documents)} documents to Pinecone (batch size: {batch_size})...")
    storage_context=StorageContext.from_defaults(vector_store=vector_store)
    
    # Process documents in batches to avoid rate limits
    for i in range(0, len(documents), batch_size):
        batch = documents[i:i+batch_size]
        batch_num = i // batch_size + 1
        total_batches = (len(documents) + batch_size - 1) // batch_size
        
        print(f"  Processing batch {batch_num}/{total_batches} ({len(batch)} docs)...")
        
        try:
            vector_store_index = VectorStoreIndex.from_documents(
                batch,
                storage_context=storage_context,
                embed_model=embeddings,
                show_progress=False
            )
        except Exception as e:
            print(f"  ⚠️  Error on batch {batch_num}: {e}")
            print(f"  Retrying after 5 seconds...")
            time.sleep(5)
            try:
                vector_store_index = VectorStoreIndex.from_documents(
                    batch,
                    storage_context=storage_context,
                    embed_model=embeddings,
                    show_progress=False
                )
                print(f"  ✅ Batch {batch_num} uploaded successfully on retry")
            except Exception as retry_error:
                print(f"  ❌ Failed to upload batch {batch_num} after retry: {retry_error}")
                continue
        
        # Delay between batches to respect rate limits
        if i + batch_size < len(documents):
            time.sleep(delay)
    
    print(f"✅ Successfully ingested {len(documents)} documents to Pinecone namespace '{namespace}'.")  

if __name__=="__main__":
    namespaces = [
        ("./data/syllabi", "syllabi"),
        ("./data/reference_books", "reference_books"),
        ("./data/qb_and_mse", "qb_and_mse"),
        ("./data/rule_books", "rule_books"),
        ("./data/previous_year_qps", "previous_year_qps")
    ]
    
    for i, (storage_dir, namespace) in enumerate(namespaces):
        ingest_to_cloud(storage_dir=storage_dir, namespace=namespace)
        
        # Add delay between namespace uploads
        if i < len(namespaces) - 1:
            print(f"\n⏳ Waiting {DELAY_BETWEEN_NAMESPACES}s before next namespace...\n")
            time.sleep(DELAY_BETWEEN_NAMESPACES)
    
    print(index.describe_index_stats())