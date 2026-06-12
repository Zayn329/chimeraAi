import os
import torch
import numpy as np
from typing import List, Dict, Optional
from llama_index.core import Settings
from llama_index.embeddings.huggingface import HuggingFaceEmbedding
from dotenv import load_dotenv

load_dotenv()

# Global Framework Embedding Configuration
if Settings.embed_model is None:
    Settings.embed_model = HuggingFaceEmbedding(
        model_name="sentence-transformers/all-MiniLM-L6-v2",
        device="cuda" if torch.cuda.is_available() else "cpu"
    )

class SemanticCache:
    def __init__(self, threshold: float = 0.92):
        """
        Initializes an in-memory vector vault to shield free-tier RPM ceilings.
        """
        self.threshold = threshold
        self.vault: List[Dict] = []  # 🛠️ Fixed Type Annotation Syntax

    def _calculate_similarity(self, vec_a: np.ndarray, vec_b: np.ndarray) -> float:
        """Computes true cosine similarity without risking divide-by-zero crashes."""
        norm_a = np.linalg.norm(vec_a)
        norm_b = np.linalg.norm(vec_b)
        
        if norm_a == 0 or norm_b == 0:
            return 0.0
            
        # 🛠️ Fixed structural positioning to prevent unreachable dead-code execution
        return float(np.dot(vec_a, vec_b) / (norm_a * norm_b))

    def check_cache(self, query: str) -> Optional[str]:
        """
        Encodes query text via local MiniLM and maps proximity scores across memory arrays.
        """
        if not self.vault:
            return None

        # 🛠️ Changed to correct LlamaIndex vector retrieval method
        query_vec = np.array(Settings.embed_model.get_text_embedding(query), dtype=np.float32)
        
        best_score = -1.0
        matched_response = None

        for entry in self.vault:
            similarity = self._calculate_similarity(query_vec, entry['embedding'])
            if similarity > best_score:
                best_score = similarity
                matched_response = entry['response']

        print(f"🔍 [Cache Audit] Nearest node proximity: {best_score:.4f} (Required Threshold: {self.threshold})")
        
        if best_score >= self.threshold:
            print(f"⚡ [CACHE HIT] High-confidence proximity match found for query: '{query}'")
            return matched_response
            
        print(f"❌ [CACHE MISS] Query falls outside safe caching margins.")
        return None

    def add_to_cache(self, query: str, response: str):
        """Commits fresh vector sequences and paired string targets to the memory stack."""
        if not response or response.startswith("Swarm Error:"):
            print(f"⚠️ [Cache Blocked] Refusing to commit system failure outputs to vault.")
            return

        # 🛠️ Changed to correct LlamaIndex vector retrieval method
        query_vec = np.array(Settings.embed_model.get_text_embedding(query), dtype=np.float32)
        
        self.vault.append({
            'query': query,
            'response': response,
            'embedding': query_vec
        })
        print(f"💾 [Cache Registry] New footprint committed. Total Vault Size: {len(self.vault)} instances.")

# 🛠️ Unindented out of Class scope to serve as a functional global singleton import asset
global_semantic_cache = SemanticCache(threshold=0.92)