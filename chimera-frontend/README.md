# 🦁 Chimera AI — Frontend Application

> **React + Vite Frontend for Chimera AI Multi-Agent Swarm with Real-Time SSE Token Streaming, 21st.dev Components, and Live Telemetry Visualizer.**

---

## 🚀 Key Features

* **Real-time SSE Chat (`/chat`)**: Token-by-token streaming response render with dynamic agent badge switching (Tutor, Policy Agent, Strategist).
* **Role Portal (`/login`)**: Role switching between Student and Faculty personas with SpotlightCard motion animations.
* **Vector DB Ingest (`/ingest`)**: Upload PDF syllabi and TXT exam question banks to Pinecone vector storage.
* **Telemetry & Data Flow Visualizer (`/telemetry`)**: Dynamic node graph displaying query lifecycle (Ingress $\rightarrow$ Router $\rightarrow$ Agent $\rightarrow$ Vector DB) with real-time SSE console event logs.

---

## 🛠️ Tech Stack

* **React 19 + Vite**
* **Tailwind CSS v4**
* **Framer Motion**
* **Lucide React Icons**
* **21st.dev Components & Utilities**

---

## 💻 Local Development

```bash
npm install
npm run dev
```

Build production bundle:
```bash
npm run build
```
