import streamlit as st
import requests
import random


# Initialize message history if it doesn't exist
if "messages" not in st.session_state:
    st.session_state.messages = []

# Generate a unique thread_id for this user (persists across reruns)
if "thread_id" not in st.session_state:
    st.session_state.thread_id = str(random.randint(100000, 999999))


st.title("🧠 Chimera AI Assistant")

# Display all previous messages from session state
for msg in st.session_state.messages:
    with st.chat_message(msg["role"]):
        st.write(msg["content"])



# Capture user input
user_input = st.chat_input("Ask Chimera something...")

if user_input:
    # Append user message to history
    st.session_state.messages.append({"role": "user", "content": user_input})
    
    # Display user message immediately
    with st.chat_message("user"):
        st.write(user_input)
    
    # Create placeholder for assistant response
    with st.chat_message("assistant"):
        message_placeholder = st.empty()
        full_response = ""
        
        try:
            # Make streaming HTTP request to the backend
            response = requests.post(
                "http://localhost:8000/api/chat/stream",
                json={
                    "prompt": user_input,
                    "thread_id": st.session_state.thread_id
                },
                stream=True,
                timeout=60
            )
            
            if response.status_code == 200:
                # Stream tokens as they arrive
                for token in response.iter_content(decode_unicode=True):
                    if token:  # Skip empty tokens
                        full_response += token
                        message_placeholder.write(full_response)
                
                # After streaming finishes, append complete response to history
                st.session_state.messages.append({
                    "role": "assistant",
                    "content": full_response
                })
                
            else:
                error_msg = f"Error: {response.status_code} - {response.text}"
                message_placeholder.error(error_msg)
                st.stop()
                
        except requests.exceptions.ConnectionError:
            error_msg = "❌ Cannot connect to backend server at http://localhost:8000"
            message_placeholder.error(error_msg)
            st.stop()
            
        except requests.exceptions.Timeout:
            error_msg = "⏱️ Request timed out. The backend server took too long to respond."
            message_placeholder.error(error_msg)
            st.stop()
            
        except Exception as e:
            error_msg = f"⚠️ Unexpected error: {str(e)}"
            message_placeholder.error(error_msg)
            st.stop()
