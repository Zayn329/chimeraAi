# Chimera AI Assistant - Frontend Implementation Plan (React + Next.js + Skiper UI)

## Executive Summary
This document outlines the detailed implementation plan for building a modern, Vercel/Next.js-style AI Chat and Multi-Agent Telemetry dashboard for the **Chimera AI Swarm Engine**.

The frontend will be built using **React (Next.js 14 App Router)**, **TypeScript**, **Tailwind CSS**, **Framer Motion**, and **Skiper UI / Shadcn-style Animated Components**.

---

## 1. Design Philosophy & Aesthetic Guidelines
- **Theme**: Dark mode, minimal slate/zinc palette (`#09090b` background), glassmorphism (`backdrop-blur-md`), subtle glowing accents, and crisp typography (`Geist Mono` / `Inter`).
- **Style**: Vercel/Linear AI UI aesthetic — clean borders, micro-interactions, floating model selectors, live token streaming indicators, and animated multi-agent swarm status badges.

---

## 2. Selected Skiper UI / Custom Animated Components

| Component Name | Skiper UI / FX Pattern | Purpose / Usage in Chimera Frontend |
| :--- | :--- | :--- |
| **`GlowingCard`** | Animated Gradient Border / Card | Encapsulates the main chat window, sub-agent telemetry panels, and model selection drawer with a glowing reactive gradient. |
| **`ShinyButton`** | Shimmer / Glowing Action Button | Used for "Send Prompt", "New Thread", and "Regenerate Answer" CTAs. |
| **`TypewriterStream`** | Smooth Character/Token Streamer | Renders real-time Server-Sent Event (SSE) AI response tokens smoothly without layout layout shift. |
| **`AgentBadge`** | Animated Pulsing Status Badge | Visualizes active sub-agent routing: 🎓 `TUTOR` (Cyan pulse), 🎯 `STRATEGIST` (Purple pulse), 🏛️ `BUREAUCRAT` (Amber pulse). |
| **`TelemetryAccordion`** | Collapsible Glass Container | Shows real-time backend thought streams (e.g., `⚡STATUS: Swarm actively engaging node: [tutor]...` or `Connecting to Pinecone Cloud via: [search_syllabus]`). |
| **`ModelSelectorPill`** | Floating Glass Segmented Control | Allows users to toggle active context mode or view underlying model metadata (`gemini-3.1-flash-lite`, `gemini-2.5-flash`). |
| **`SemanticCacheToast`** | Flash Glow Notification Banner | Displays an instant `⚡ [CACHE HIT]` banner when response is delivered zero-cost from `SemanticCache`. |

---

## 3. Architecture & Project Structure

```
chimera-frontend/
├── app/
│   ├── layout.tsx                      # Global Providers (Theme, QueryClient, Toast)
│   ├── page.tsx                        # Main Chimera AI Swarm Workspace
│   ├── globals.css                     # Tailwind CSS + Glowing Gradients
│   └── api/                            # Next.js API Proxy routes (if needed)
├── components/
│   ├── ui/                             # Skiper UI primitives
│   │   ├── glowing-card.tsx
│   │   ├── shiny-button.tsx
│   │   ├── type-stream.tsx
│   │   ├── agent-badge.tsx
│   │   ├── telemetry-accordion.tsx
│   │   └── model-selector-pill.tsx
│   ├── chat/
│   │   ├── chat-window.tsx             # Main chat message stream container
│   │   ├── chat-input.tsx              # Input field with course filter selector & submit button
│   │   ├── message-bubble.tsx          # Render user & AI messages with markdown/code highlighting
│   │   └── telemetry-panel.tsx         # Live node transition & tool call activity visualizer
│   ├── sidebar/
│   │   ├── conversation-history.tsx    # Thread history manager
│   │   └── system-health.tsx           # Circuit Breaker state indicator (CLOSED/OPEN)
│   └── navbar.tsx                      # Header with status badges and thread stats
├── hooks/
│   ├── use-sse-chat.ts                 # Custom hook for connecting to Chimera Gateway (/proxy/chat)
│   └── use-session.ts                  # Persistent thread_id and storage manager
├── lib/
│   ├── api.ts                          # Fetch helpers & gateway configuration
│   └── utils.ts                        # Tailwind class merge (cn helper)
├── types/
│   └── chat.ts                         # TypeScript interfaces (Message, TelemetryEvent, AgentType)
├── tailwind.config.js                  # Custom keyframe animations, glowing utilities
├── tsconfig.json
└── package.json
```

---

## 4. Key Functional Modules & Technical Implementation

### Phase 1: Gateway & SSE Integration (`use-sse-chat.ts`)
- **Gateway Endpoint**: Connects to Express Gateway at `http://localhost:3000/proxy/chat`.
- **Stream Processing**: Uses `fetchEventSource` / native `EventSource` to process streamed chunks.
- **Event Parsing**:
  - `⚡STATUS: Swarm actively engaging node: [...]` -> Captured into `activeNode` state and rendered in `TelemetryAccordion`.
  - `⚡STATUS: Connecting to Pinecone Cloud via: [...]` -> Captured into `activeTool` state.
  - Standard chat tokens -> Appended to `streamingText` state in real time.

### Phase 2: Core UI Components & Views

1. **Top Navigation (`navbar.tsx`)**:
   - Chimera Swarm logo with glowing gradient.
   - Live **Circuit Breaker Status Indicator** (`CLOSED` = 🟢 Healthy System, `OPEN` = 🟡 Fallback Offline Mode).
   - Thread ID badge with copy-to-clipboard functionality.

2. **Main Workspace Layout (`page.tsx`)**:
   - **Left Sidebar**: Saved conversations, Course Filter selector (*Analysis of Algorithms*, *Operating Systems*, *Computer Networks*).
   - **Center Panel (Chat Matrix)**:
     - Header showing active department worker (`Tutor`, `Strategist`, `Bureaucrat`).
     - Message history stream with `MessageBubble` components.
     - Live `TelemetryAccordion` showing real-time agent thought process and Pinecone vector tool queries.
     - Floating `ChatInput` area with `ShinyButton` and prompt suggestions.
   - **Right Inspector Drawer (Optional / Collapsible)**:
     - Vector RAG Context Viewer (shows raw retrieved chunks from Pinecone when tool search executes).

3. **Message Rendering & Formatting (`message-bubble.tsx`)**:
   - Supports Markdown syntax, LaTeX math rendering (via `katex`), and syntax-highlighted code blocks.
   - Special badges for source references (e.g., `📜 Syllabus Section 3.2`, `📚 Tanenbaum OS Reference Book`, `🏛️ KT Policy Rule 4.1`).

---

## 5. Development Roadmap & Milestones

1. **Milestone 1: Project Setup & Skiper UI Component Library**:
   - Initialize Next.js 14 app with TypeScript and Tailwind CSS.
   - Build Skiper UI primitive set (`GlowingCard`, `ShinyButton`, `AgentBadge`, `TelemetryAccordion`).

2. **Milestone 2: SSE Custom Hook & State Management**:
   - Create `useSseChat` hook to manage thread state, streaming token buffer, node status, and error handling.

3. **Milestone 3: Chat Interface & Telemetry Integration**:
   - Wire up `ChatWindow`, `TelemetryPanel`, and `ChatInput`.
   - Implement smooth auto-scroll and token streaming animations.

4. **Milestone 4: RAG Source Context & Circuit Breaker Visuals**:
   - Add visual indicators for `SemanticCache` hits vs live LangGraph swarm miss paths.
   - Implement course metadata filter chips in input bar.

5. **Milestone 5: Verification & End-to-End Testing**:
   - Test full pipeline with running Express Gateway (`chimera-gateway/index.js`) and FastAPI backend (`chimera_backend/server.py`).
