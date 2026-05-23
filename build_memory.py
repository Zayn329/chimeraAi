import os
import torch

# --- SPEED BOOST 1: Force CPU Multi-Threading (Windows Fix) ---
cores = os.cpu_count() or 4
torch.set_num_threads(cores)
torch.set_num_interop_threads(cores)

from llama_index.core import (
    SimpleDirectoryReader,
    StorageContext,
    VectorStoreIndex,
    load_index_from_storage,
    Settings
)
from llama_index.readers.file import PyMuPDFReader
from llama_index.core.node_parser import SentenceSplitter
from llama_index.embeddings.huggingface import HuggingFaceEmbedding

# Initialize splitters
syllabus_splitter = SentenceSplitter(chunk_size=256, chunk_overlap=30)
book_splitter = SentenceSplitter(chunk_size=1024, chunk_overlap=50)

# --- SPEED BOOST 2: GPU Acceleration ---
Settings.embed_model = HuggingFaceEmbedding(
    model_name="sentence-transformers/all-MiniLM-L6-v2",
    device="cuda" if torch.cuda.is_available() else "cpu"
)

def ingest_or_update_store(store_name, input_dir, persist_dir, metadata_dict, splitter, file_extractor, workers):
    """Helper function to cleanly build or incrementally update a vector database."""
    print(f"\n{'='*40}\n🔄 Processing {store_name}...\n{'='*40}")
    
    if not os.path.exists(input_dir):
        print(f"⚠️ Directory {input_dir} not found. Skipping.")
        return

    reader = SimpleDirectoryReader(
        input_dir=input_dir,
        recursive=True,
        file_extractor=file_extractor 
    )
    
    documents = reader.load_data(num_workers=workers)

    for doc in documents:
        doc.metadata.update(metadata_dict)

    # Temporarily assign the correct splitter to the global settings so refresh_ref_docs uses it
    Settings.text_splitter = splitter

    # SCENARIO A: First time setup
    if not os.path.exists(persist_dir):
        print(f"🧱 Building {store_name} Index for the first time...")
        nodes = splitter.get_nodes_from_documents(documents)
        index = VectorStoreIndex(nodes, insert_batch_size=2048)
        index.storage_context.persist(persist_dir=persist_dir)
        print(f"✅ Initial {store_name} index saved.")
        
    # SCENARIO B: Additive Mode
    else:
        print(f"⚡ Additive Mode: Scanning {store_name} for new/modified files...")
        storage_context = StorageContext.from_defaults(persist_dir=persist_dir)
        index = load_index_from_storage(storage_context)
        
        update_results = index.refresh_ref_docs(documents)
        new_docs_count = sum(update_results)
        
        if new_docs_count > 0:
            print(f"🚀 Ingested {new_docs_count} new/updated document chunks! Saving changes...")
            index.storage_context.persist(persist_dir=persist_dir)
        else:
            print(f"✅ No new files detected. {store_name} database is up to date!")


def main():
    # Initialize the advanced PDF parser ONCE
    parser = PyMuPDFReader()
    file_extractor = {".pdf": parser}
    
    safe_workers = min(4, cores)

    # 1. Syllabi Store
    ingest_or_update_store(
        store_name="Syllabi",
        input_dir="./data/syllabi",
        persist_dir="./storage/syllabi_index",
        metadata_dict={"department": "CS", "doc_type": "syllabus", "semester": "3"},
        splitter=syllabus_splitter,
        file_extractor=file_extractor,
        workers=safe_workers
    )

    # 2. Question Banks Store
    ingest_or_update_store(
        store_name="Question Banks",
        input_dir="./data/qb_and_mse",
        persist_dir="./storage/qb_index",
        metadata_dict={"department": "CS", "doc_type": "question_bank", "semester": "3"},
        splitter=syllabus_splitter,
        file_extractor=file_extractor,
        workers=safe_workers
    )

    # 3. Reference Books Store
    ingest_or_update_store(
        store_name="Reference Books",
        input_dir="./data/reference_books",
        persist_dir="./storage/reference_books_index",
        metadata_dict={"department": "CS", "doc_type": "reference_book", "semester": "3"},
        splitter=book_splitter,
        file_extractor=file_extractor,
        workers=safe_workers
    )

    # ==========================================
    # QUERY TEST (Retrieval Only)
    # ==========================================
    if os.path.exists("./storage/syllabi_index"):
        print("\n🔍 Executing Verification Query on Syllabi...")
        index = load_index_from_storage(
            StorageContext.from_defaults(persist_dir="./storage/syllabi_index")
        )
        
        retriever = index.as_retriever(similarity_top_k=2)
        retrieved_nodes = retriever.retrieve("What subjects are listed in the syllabus?")
        
        print("\n📌 Top Retrieved Chunks:\n")
        for i, node in enumerate(retrieved_nodes):
            print(f"--- Chunk {i+1} ---")
            print(f"Metadata: {node.metadata}")
            print(f"Text: {node.text.strip()[:300]}...\n") # Truncated print for cleaner output

if __name__ == "__main__":
    main()