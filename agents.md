# Chimera AI - Frontend Implementation Workflow Guide

## Context Reference
- Consult `architecture.md` to ensure contract synchronization with the local FastAPI endpoint.
- Consult `design.md` to strictly enforce the "Academic Brutalism" visual system and landing page copy.

## Execution Rules
- **SCOPE LIMIT:** Work exclusively inside the Next.js frontend project directory. Do NOT modify or touch any existing Python backend files.
- **TECH STACK:** Next.js 14 (App Router), Tailwind CSS, Lucide React, and `shadcn/ui` components (built on Radix Primitives).

## Phase 1: Authentication Simulation & Boot Interface
- **Task:** Create an atomic login interceptor.
- **Behavior:** Bypasses complex token infrastructures. Feature a clean, high-contrast inputs field ("Student Credentials"). Clicking "Login" or "Enter the Swarm" must programmatically inject a mock user session into a React Context and immediately route the user to `/dashboard`.

## Phase 2: The Brutalist Split-Screen Grid
- **Task:** Create the primary multi-panel application dashboard at `/dashboard/page.tsx`.
- **Layout Blueprint:** Must be an unyielding, full-viewport split view:
  - **Left Viewport (70% Screen Width):** The Academic Hub. Clean white canvas, high-contrast typographic stream, structured message layouts, and inline data containers.
  - **Right Viewport (30% Screen Width):** The "X-Ray Thought Log". A deep black console container using a monospace font (`JetBrains Mono`) with a bright CRT Green layout. It acts as an exposed window into the Swarm's brain.

## Phase 3: Killer Feature Mechanics

### Feature 1: The X-Ray Thought Log (Swarm Monologue)
- **Mechanic:** When a user clicks "Submit" inside the chat window, the right panel comes to life, simulating a streaming terminal log sequence mapping to the internal LangGraph state transitions:
  - `> [SUPERVISOR] Processing incoming payload sequence...`
  - `> [SUPERVISOR] Intent classified: Academic Theory. Scoping course boundary.`
  - `> [TUTOR] Spawning automated multi-hop textbook lookup...`
  - `> [LLAMAINDEX] Hard Pre-Filter Active: WHERE course_name == 'Operating Systems'`
  - `> [CROSS-ENCODER] Re-ranking 8 vector fragments down to top 2...`
  - `> [TUTOR] Ingesting validated chunks. Synthesizing structural response...`
- **Behavior:** The log must appear text-by-text to keep the presentation highly engaging while the main chat shows a clean loading placeholder state.

### Feature 2: Hover-to-Verify Citations Library
- **Mechanic:** Parse the final string output arriving from the API. Any substring matching academic references (e.g., `[Syllabus Module 3]`, `[OS Textbook Pg 376]`, or `[Policy ACAD-001]`) must be dynamically rendered as a flat UI badge.
- **Interactive State:** Wrap the badge in a `shadcn` `HoverCard` primitive. On hover, expose a highly dense card layout showing an unedited, raw chunk snippet of text to prove the AI isn't hallucinating its facts.

## Iteration Guardrails
1. Initialize structure and generate the monochromatic theme layout first.
2. Build mock state trees to perfectly test component reactivity and card spacing before hook-up.
3. Wire the production Fetch client to communicate with `POST http://127.0.0.1:8000/api/chat`.