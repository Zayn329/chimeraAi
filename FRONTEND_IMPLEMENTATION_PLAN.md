# Chimera AI Assistant - Frontend Implementation Plan (React + Next.js + Skiper UI)

## Executive Summary
This document outlines the verified implementation plan for building a modern, Vercel/Next.js-style AI Chat and Multi-Agent Telemetry dashboard for the **Chimera AI Swarm Engine**.

The frontend will be built using **React (Next.js 14 App Router)**, **TypeScript**, **Tailwind CSS**, **Framer Motion**, and official **Skiper UI Components** (`https://skiper-ui.com`).

---

## 1. Design Philosophy & Aesthetic Guidelines
- **Theme**: Dark mode, minimal slate/zinc palette (`#09090b` background), glassmorphism (`backdrop-blur-md`), subtle glowing accents, and crisp typography (`Geist Mono` / `Inter`).
- **Style**: Vercel/Linear AI UI aesthetic — clean borders, micro-interactions, floating model selectors, live token streaming indicators, and animated multi-agent swarm status badges.

---

## 2. Verified Skiper UI Components & Evidence Table

The following table maps Chimera AI frontend requirements directly to verified components on [Skiper UI](https://skiper-ui.com):

| Skiper UI Component ID | Official Name / Feature | Verification Evidence URL | Shadcn Add CLI Command | Usage in Chimera AI Assistant Frontend |
| :--- | :--- | :--- | :--- | :--- |
| **`skiper81`** (or `skiper82`-`85`) | **AI Input 001 - 005** | [https://skiper-ui.com/v1/skiper81](https://skiper-ui.com/v1/skiper81) | `npx shadcn add @skiper-ui/skiper81` | Main AI prompt input bar with search toggle, deep mind mode, file attachments, and model selection drawer. |
| **`skiper86`** | **Apple AI Gradient** | [https://skiper-ui.com/v1/skiper86](https://skiper-ui.com/v1/skiper86) | `npx shadcn add @skiper-ui/skiper86` | Reactive glowing gradient halo used during active AI token streaming and LLM processing states. |
| **`skiper102`** | **Debug Panel** | [https://skiper-ui.com/v1/skiper102](https://skiper-ui.com/v1/skiper102) | `npx shadcn add @skiper-ui/skiper102` | Multi-agent live telemetry inspector displaying active node transitions (`TUTOR`, `STRATEGIST`, `BUREAUCRAT`) and tool execution logs. |
| **`skiper103`** | **Bouncy Accordion** | [https://skiper-ui.com/v1/skiper103](https://skiper-ui.com/v1/skiper103) | `npx shadcn add @skiper-ui/skiper103` | Collapsible thought process container showing backend agent decisions and RAG tool queries (`search_syllabus`, `search_pyqs`). |
| **`skiper90`** | **Gradient Hover Cards** | [https://skiper-ui.com/v1/skiper90](https://skiper-ui.com/v1/skiper90) | `npx shadcn add @skiper-ui/skiper90` | Feature highlight cards on the welcome screen (e.g., Course Syllabus Querying, Exam Strategy, KT Rulebook Check). |
| **`skiper92`** | **Vercel Command Search** | [https://skiper-ui.com/v1/skiper92](https://skiper-ui.com/v1/skiper92) | `npx shadcn add @skiper-ui/skiper92` | Quick-action `Cmd+K` palette to quickly search past threads, toggle courses, or inspect system health. |
| **`skiper57`** | **Vercel Navigation Bar** | [https://skiper-ui.com/v1/skiper57](https://skiper-ui.com/v1/skiper57) | `npx shadcn add @skiper-ui/skiper57` | Top glassmorphism navigation header housing Circuit Breaker health badge (`CLOSED`/`OPEN`) and active thread stats. |

---

## 3. Architecture & Project Structure

```
chimera-frontend/
├── app/
│   ├── layout.tsx                      # Global Providers (Theme, QueryClient, Toast)
│   ├── page.tsx                        # Main Chimera AI Swarm Workspace
│   ├── globals.css                     # Tailwind CSS + Glowing Gradients
│   └── api/                            # Next.js API Proxy routes
├── components/
│   ├── skiper/                         # Verified Skiper UI Installed Components
│   │   ├── ai-input-81.tsx             # skiper81: AI Input 001
│   │   ├── ai-gradient-86.tsx          # skiper86: Apple AI Gradient halo
│   │   ├── debug-panel-102.tsx         # skiper102: Swarm Telemetry Debug Panel
│   │   ├── bouncy-accordion-103.tsx    # skiper103: Agent thought process accordion
│   │   ├── gradient-cards-90.tsx       # skiper90: Welcome prompt suggestion cards
│   │   ├── command-search-92.tsx       # skiper92: Vercel Cmd+K search palette
│   │   └── vercel-nav-57.tsx           # skiper57: Vercel style Navigation Header
│   ├── chat/
│   │   ├── chat-window.tsx             # Main chat message stream container
│   │   └── message-bubble.tsx          # Render user & AI messages with markdown/code syntax highlighting
│   └── sidebar/
│       ├── conversation-history.tsx    # Thread history manager
│       └── system-health.tsx           # Circuit Breaker state indicator
├── hooks/
│   ├── use-sse-chat.ts                 # Custom hook for connecting to Express Gateway (/proxy/chat)
│   └── use-session.ts                  # Persistent thread_id and storage manager
├── lib/
│   ├── api.ts                          # Fetch helpers & gateway configuration
│   └── utils.ts                        # Tailwind class merge (cn helper)
├── types/
│   └── chat.ts                         # TypeScript interfaces (Message, TelemetryEvent, AgentType)
├── tailwind.config.js                  # Custom keyframe animations
├── tsconfig.json
└── package.json
```

---

## 4. Key Functional Modules & Integration Workflow

### Phase 1: Gateway & SSE Integration (`use-sse-chat.ts`)
- **Gateway Endpoint**: Connects to Express Gateway at `http://localhost:3000/proxy/chat`.
- **Stream Processing**: Uses `EventSource` / ReadableStream to process streamed chunks.
- **Event Parsing**:
  - `⚡STATUS: Swarm actively engaging node: [...]` -> Captured into `activeNode` state and rendered in `skiper102` (Debug Panel).
  - `⚡STATUS: Connecting to Pinecone Cloud via: [...]` -> Captured into `activeTool` state and rendered in `skiper103` (Bouncy Accordion).
  - Standard chat tokens -> Appended to streaming message state in real time with `skiper86` Apple AI Gradient FX active.

### Phase 2: Core UI Views

1. **Top Header (`skiper57` Vercel Nav Bar)**:
   - Chimera Swarm logo.
   - Live **Circuit Breaker Status Indicator** (`CLOSED` = 🟢 Healthy System, `OPEN` = 🟡 Fallback Offline Mode).
   - `skiper92` Command Search launcher (`Cmd+K`).

2. **Main AI Input Matrix (`skiper81` AI Input)**:
   - Floating input container with attachment support, search mode toggles, and model dropdown (`gemini-3.1-flash-lite`, `gemini-2.5-flash`).
   - Integrated course selector pills (*Analysis of Algorithms*, *Operating Systems*, *Computer Networks*).

3. **Telemetry & Thought Stream Inspector (`skiper102` Debug Panel + `skiper103` Accordion)**:
   - Displays real-time supervisor decisions (`TUTOR`, `STRATEGIST`, `BUREAUCRAT`).
   - Expands to reveal Pinecone query parameters and retrieved RAG context snippets.

---

## 5. Development Roadmap & Milestones

1. **Milestone 1: Project Setup & Skiper UI Installation**:
   - Initialize Next.js 14 App Router project.
   - Install Skiper UI components via Shadcn CLI (`npx shadcn add @skiper-ui/skiper81`, `@skiper-ui/skiper86`, `@skiper-ui/skiper102`, `@skiper-ui/skiper103`, `@skiper-ui/skiper90`, `@skiper-ui/skiper92`, `@skiper-ui/skiper57`).

2. **Milestone 2: SSE Custom Hook & State Management**:
   - Implement `useSseChat` to handle connection, streaming buffers, and telemetry traps.

3. **Milestone 3: UI Integration & Verification**:
   - Connect frontend to running Express Gateway (`chimera-gateway/index.js`) and FastAPI backend (`chimera_backend/server.py`).
   - Verify real-time streaming, telemetry logging, and offline circuit breaker fallback states.
