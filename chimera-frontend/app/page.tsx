"use client";

import React, { useState } from "react";
import { VercelNavBar57 } from "@/components/skiper/vercel-nav-57";
import { AIInput81 } from "@/components/skiper/ai-input-81";
import { AppleAIGradient86 } from "@/components/skiper/ai-gradient-86";
import { DebugPanel102 } from "@/components/skiper/debug-panel-102";
import { BouncyAccordion103 } from "@/components/skiper/bouncy-accordion-103";
import { GradientHoverCards90 } from "@/components/skiper/gradient-cards-90";
import { useSseChat } from "@/hooks/use-sse-chat";
import { Bot, User, Sparkles, Zap, Trash2, Code2 } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function Home() {
  const {
    messages,
    isLoading,
    activeWorker,
    circuitBreakerState,
    events,
    threadId,
    sendMessage,
    clearChat,
  } = useSseChat();

  const [showDebug, setShowDebug] = useState(true);

  const handleSelectAction = (action: string) => {
    if (action === "reset" || action === "new_thread") {
      clearChat();
    } else if (action === "health") {
      setShowDebug(true);
    }
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 flex flex-col font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Vercel Navigation Header */}
      <VercelNavBar57
        circuitBreakerState={circuitBreakerState}
        activeWorker={activeWorker}
        onSelectAction={handleSelectAction}
      />

      {/* Main Workspace Grid */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left/Center Chat Matrix (Columns 1-8) */}
        <div className="lg:col-span-8 flex flex-col justify-between min-h-[calc(100vh-100px)]">
          {/* Messages Stream Container */}
          <div className="flex-1 overflow-y-auto space-y-4 pb-6">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full pt-10 text-center">
                <div className="p-4 rounded-3xl bg-gradient-to-br from-cyan-500/10 via-purple-500/10 to-amber-500/10 border border-zinc-800 mb-4 shadow-2xl">
                  <Sparkles className="w-8 h-8 text-cyan-400 animate-pulse" />
                </div>
                <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-zinc-100 via-zinc-300 to-zinc-500 bg-clip-text text-transparent mb-2">
                  What do you want to master today?
                </h1>
                <p className="text-xs md:text-sm text-zinc-400 max-w-md mb-6">
                  Select a prompt suggestion or type your query below to route through the specialized Chimera Agent Swarm.
                </p>

                {/* Prompt Suggestion Cards */}
                <GradientHoverCards90
                  onSelectPrompt={(prompt, course) =>
                    sendMessage(prompt, { course, deepSearch: false })
                  }
                />
              </div>
            ) : (
              messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex gap-3 p-4 rounded-2xl transition-all ${
                    msg.role === "user"
                      ? "bg-zinc-900/60 border border-zinc-800/80 ml-auto max-w-3xl"
                      : "glass-panel border border-zinc-800/80 max-w-4xl"
                  }`}
                >
                  <div className="shrink-0 pt-0.5">
                    {msg.role === "user" ? (
                      <div className="p-2 rounded-xl bg-zinc-800 text-zinc-300">
                        <User className="w-4 h-4" />
                      </div>
                    ) : (
                      <div className="p-2 rounded-xl bg-gradient-to-tr from-cyan-500/20 to-purple-500/20 text-cyan-400 border border-cyan-500/30">
                        <Bot className="w-4 h-4" />
                      </div>
                    )}
                  </div>

                  <div className="flex-1 space-y-2 overflow-hidden">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-zinc-300">
                        {msg.role === "user" ? "You" : `Chimera Swarm [${msg.agent || "TUTOR"}]`}
                      </span>
                      {msg.isCached && (
                        <span className="flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
                          <Zap className="w-3 h-3 text-cyan-400" /> Cache Hit
                        </span>
                      )}
                    </div>

                    {/* Markdown Rendered Content */}
                    <div className="prose prose-invert prose-xs md:prose-sm max-w-none text-zinc-200 leading-relaxed">
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {msg.content || (isLoading ? "Thinking & querying Pinecone..." : "")}
                      </ReactMarkdown>
                    </div>

                    {/* Bouncy Accordion for Tool Call & RAG Thought details */}
                    {msg.accordionItems && msg.accordionItems.length > 0 && (
                      <BouncyAccordion103 items={msg.accordionItems} />
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Input Area with Apple AI Gradient Glow */}
          <div className="sticky bottom-0 pt-2 pb-4 bg-[#09090b]/80 backdrop-blur-md">
            <div className="relative">
              <AppleAIGradient86 isActive={isLoading} activeAgent={activeWorker} />
              <AIInput81 onSubmit={sendMessage} isLoading={isLoading} />
            </div>
          </div>
        </div>

        {/* Right Telemetry Inspector Sidebar (Columns 9-12) */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
              <Code2 className="w-4 h-4 text-cyan-400" /> Telemetry Inspector
            </span>
            <button
              onClick={clearChat}
              className="flex items-center gap-1 text-xs text-zinc-500 hover:text-red-400 transition-colors"
              title="Clear session messages"
            >
              <Trash2 className="w-3.5 h-3.5" /> Clear Thread
            </button>
          </div>

          {/* Telemetry Debug Panel */}
          {showDebug && (
            <DebugPanel102
              activeWorker={activeWorker}
              circuitBreakerState={circuitBreakerState}
              events={events}
            />
          )}

          {/* Swarm Sub-Agent Overview Card */}
          <div className="glass-panel rounded-2xl p-4 space-y-3">
            <h3 className="text-xs font-bold text-zinc-200 border-b border-zinc-800 pb-2">
              Multi-Agent Architecture
            </h3>
            <div className="space-y-2 text-xs">
              <div className="p-2.5 rounded-xl bg-zinc-900/60 border border-cyan-500/20 flex items-start gap-2.5">
                <span className="text-base">🎓</span>
                <div>
                  <span className="font-semibold text-cyan-300">Tutor Sub-Agent</span>
                  <p className="text-[11px] text-zinc-400">Course syllabus, reference books, and DuckDuckGo web search tools.</p>
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-zinc-900/60 border border-purple-500/20 flex items-start gap-2.5">
                <span className="text-base">🎯</span>
                <div>
                  <span className="font-semibold text-purple-300">Strategist Sub-Agent</span>
                  <p className="text-[11px] text-zinc-400">Exam preparation, past paper analysis, and study priority planning.</p>
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-zinc-900/60 border border-amber-500/20 flex items-start gap-2.5">
                <span className="text-base">🏛️</span>
                <div>
                  <span className="font-semibold text-amber-300">Bureaucrat Sub-Agent</span>
                  <p className="text-[11px] text-zinc-400">Formal college policies, KT rules, attendance margins, and fee regulations.</p>
                </div>
              </div>
            </div>
            <div className="pt-2 text-[10px] text-zinc-500 text-center font-mono">
              Thread ID: {threadId}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
