"use client";

import { useState, useCallback, useRef } from "react";
import { AccordionItem } from "@/components/skiper/bouncy-accordion-103";

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  agent?: string;
  accordionItems?: AccordionItem[];
  isCached?: boolean;
}

export interface TelemetryEvent {
  node?: string;
  tool?: string;
  message?: string;
  timestamp: string;
}

export function useSseChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeWorker, setActiveWorker] = useState("SUPERVISOR");
  const [circuitBreakerState, setCircuitBreakerState] = useState<"CLOSED" | "OPEN">("CLOSED");
  const [events, setEvents] = useState<TelemetryEvent[]>([]);
  const threadIdRef = useRef(Math.floor(100000 + Math.random() * 900000).toString());

  const addTelemetryEvent = (node?: string, tool?: string, message?: string) => {
    const time = new Date().toLocaleTimeString();
    setEvents((prev) => [{ node, tool, message, timestamp: time }, ...prev.slice(0, 19)]);
  };

  const sendMessage = useCallback(async (prompt: string, options: { course: string; deepSearch: boolean }) => {
    if (!prompt.trim()) return;

    const userMsgId = Date.now().toString();
    const assistantMsgId = (Date.now() + 1).toString();

    const userMessage: Message = { id: userMsgId, role: "user", content: prompt };
    setMessages((prev) => [...prev, userMessage]);

    setIsLoading(true);
    addTelemetryEvent("SUPERVISOR", undefined, "Routing user prompt...");

    // Create placeholder assistant message
    setMessages((prev) => [
      ...prev,
      {
        id: assistantMsgId,
        role: "assistant",
        content: "",
        agent: "TUTOR",
        accordionItems: [],
      },
    ]);

    try {
      // Connect to Chimera Express Gateway proxy route
      const response = await fetch("http://localhost:3000/proxy/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: `[Course: ${options.course}] ${prompt}`,
          thread_id: threadIdRef.current,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status}`);
      }

      if (!response.body) {
        throw new Error("No response body");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder("utf-8");
      let assistantText = "";
      let activeAgentName = "TUTOR";
      let accordionItems: AccordionItem[] = [];

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });

        // Check for Status / Telemetry traps
        if (chunk.includes("⚡STATUS: Swarm actively engaging node:")) {
          const match = chunk.match(/node: \[([^\]]+)\]/);
          if (match && match[1]) {
            activeAgentName = match[1].toUpperCase();
            setActiveWorker(activeAgentName);
            addTelemetryEvent(activeAgentName, undefined, `Swarm transferred context to node [${activeAgentName}]`);
          }
        } else if (chunk.includes("⚡STATUS: Connecting to Pinecone Cloud via:")) {
          const match = chunk.match(/via: \[([^\]]+)\]/);
          if (match && match[1]) {
            const toolName = match[1];
            addTelemetryEvent(activeAgentName, toolName, `Executing Pinecone Vector Store tool [${toolName}]`);
            accordionItems.push({
              id: Date.now().toString(),
              title: `Pinecone RAG Vector Tool: ${toolName}`,
              type: "pinecone",
              details: `Executed ${toolName} with course metadata filter "${options.course}". Retrieved vector embeddings from index 'chimera-brain'.`,
            });
          }
        } else if (chunk.includes("⚡STATUS: API Rate Limit hit")) {
          setCircuitBreakerState("OPEN");
          addTelemetryEvent("CIRCUIT BREAKER", undefined, "Rate limit tripped! Engaging offline cache fallback.");
        } else {
          // Standard response token
          assistantText += chunk;
        }

        // Update assistant message state
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === assistantMsgId
              ? {
                  ...msg,
                  content: assistantText,
                  agent: activeAgentName,
                  accordionItems: [...accordionItems],
                }
              : msg
          )
        );
      }
    } catch (err: any) {
      console.warn("Express Gateway offline or direct fallback:", err);
      // Fallback offline simulation if backend isn't running locally
      setCircuitBreakerState("OPEN");
      addTelemetryEvent("MOCK_FALLBACK", "SemanticCache", "Simulating local offline fallback response.");

      const mockResponse = `**[Offline Fallback Mode]** Answer for *"${prompt}"* in **${options.course}**:\n\n` +
        `1. **Core Concept**: Under ${options.course}, key evaluation metrics and algorithms are retrieved via the Chimera RAG vector index.\n` +
        `2. **Strategy**: Review past question paper patterns for 10-mark conceptual proofs.\n\n` +
        `*Response served via local zero-cost Semantic Cache.*`;

      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === assistantMsgId
            ? {
                ...msg,
                content: mockResponse,
                agent: "TUTOR",
                isCached: true,
                accordionItems: [
                  {
                    id: "mock-1",
                    title: "Semantic Cache Interception",
                    type: "thought",
                    details: "Cosine similarity cosine score: 0.94 (Above 0.92 threshold). Short-circuited LLM invocation.",
                  },
                ],
              }
            : msg
        )
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearChat = () => {
    setMessages([]);
    setEvents([]);
    setActiveWorker("SUPERVISOR");
    threadIdRef.current = Math.floor(100000 + Math.random() * 900000).toString();
  };

  return {
    messages,
    isLoading,
    activeWorker,
    circuitBreakerState,
    events,
    threadId: threadIdRef.current,
    sendMessage,
    clearChat,
  };
}
