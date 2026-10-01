import json
import random

import requests
import streamlit as st

API_ROOT = "http://localhost:8000"
st.set_page_config(page_title="Chimera AI Assistant", page_icon="🧠", layout="wide")
st.title("🧠 Chimera AI Assistant")
st.caption("Teacher knowledge banks, student PDF chat, agent telemetry, and offline fallback")

if "messages" not in st.session_state:
    st.session_state.messages = []
if "thread_id" not in st.session_state:
    st.session_state.thread_id = str(random.randint(100000, 999999))
if "document_id" not in st.session_state:
    st.session_state.document_id = None


def upload_file(endpoint: str, uploaded_file, data: dict | None = None):
    files = {"file": (uploaded_file.name, uploaded_file.getvalue(), uploaded_file.type)}
    return requests.post(f"{API_ROOT}{endpoint}", files=files, data=data or {}, timeout=120)


with st.sidebar:
    st.subheader("Document context")
    if st.session_state.document_id:
        st.success(f"PDF active: {st.session_state.document_id[:8]}…")
        if st.button("Clear PDF context"):
            st.session_state.document_id = None
            st.rerun()
    else:
        st.info("No student PDF selected")

teacher_tab, student_tab, chat_tab = st.tabs(["Teacher question bank", "Student PDF", "Chat"])

with teacher_tab:
    st.subheader("Upload teacher question bank")
    st.write("Use `Q:` / `A:` entries so students can retrieve teacher-provided answers offline.")
    teacher_file = st.file_uploader("Choose a .txt file", type=["txt"], key="teacher_file")
    subject = st.text_input("Subject or course", key="teacher_subject")
    if st.button("Import question bank", disabled=teacher_file is None):
        with st.spinner("Parsing and indexing question bank…"):
            response = upload_file("/api/teacher/question-bank", teacher_file, {"subject": subject})
        if response.ok:
            st.success(response.json())
        else:
            st.error(response.text)

with student_tab:
    st.subheader("Upload a PDF to question")
    student_file = st.file_uploader("Choose a PDF", type=["pdf"], key="student_file")
    if st.button("Process PDF", disabled=student_file is None):
        with st.spinner("Extracting text and building local TF-IDF index…"):
            response = upload_file("/api/student/document", student_file)
        if response.ok:
            result = response.json()
            st.session_state.document_id = result["document_id"]
            st.success(f"Processed {result['pages']} pages and {result['chunks']} searchable chunks.")
        else:
            st.error(response.text)

with chat_tab:
    for message in st.session_state.messages:
        with st.chat_message(message["role"]):
            st.markdown(message["content"])

    prompt = st.chat_input("Ask about your PDF or the academic knowledge base…")
    if prompt:
        st.session_state.messages.append({"role": "user", "content": prompt})
        with st.chat_message("user"):
            st.markdown(prompt)

        with st.chat_message("assistant"):
            status_placeholder = st.empty()
            answer_placeholder = st.empty()
            full_response = ""
            event_buffer = ""
            payload = {
                "prompt": prompt,
                "thread_id": st.session_state.thread_id,
                "document_id": st.session_state.document_id,
            }
            try:
                response = requests.post(
                    f"{API_ROOT}/api/chat/stream",
                    json=payload,
                    stream=True,
                    timeout=300,
                )
                response.raise_for_status()
                for chunk in response.iter_content(chunk_size=1, decode_unicode=True):
                    if not chunk:
                        continue
                    event_buffer += chunk
                    while "\n\n" in event_buffer:
                        raw_event, event_buffer = event_buffer.split("\n\n", 1)
                        data = "\n".join(
                            line[5:].lstrip()
                            for line in raw_event.splitlines()
                            if line.startswith("data:")
                        )
                        if not data:
                            continue
                        try:
                            event = json.loads(data)
                        except json.JSONDecodeError:
                            event = {"type": "token", "content": data}
                        event_type = event.get("type", "token")
                        content = event.get("content", "")
                        if event_type == "status":
                            status_placeholder.info(f"🤖 {content}")
                        elif event_type == "error":
                            status_placeholder.error(content)
                        elif content:
                            full_response += content
                            answer_placeholder.markdown(full_response + "▌")
                answer_placeholder.markdown(full_response)
                st.session_state.messages.append({"role": "assistant", "content": full_response})
            except requests.RequestException as exc:
                status_placeholder.error(f"Could not reach Chimera backend: {exc}")
