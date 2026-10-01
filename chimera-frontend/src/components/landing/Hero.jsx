import React, { useState, useRef } from "react";
import { ArrowRight, ArrowDown, Send, Sparkles, ChevronRight, Layers, Bot, Database } from "lucide-react";
import { TimelineAnimation } from "@/components/ui/hero-financial-utils/timeline-animation";

export function Hero({ onQuerySubmit, activeQuery = "" }) {
  const [inputValue, setInputValue] = useState(activeQuery);
  const timelineRef = useRef(null);

  const queryChips = [
    "What is the syllabus for Operating Systems?",
    "Which CN topics are most important?",
    "What are the official attendance rules?",
  ];

  const handleChipClick = (chip) => {
    setInputValue(chip);
    if (onQuerySubmit) {
      onQuerySubmit(chip);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputValue.trim() && onQuerySubmit) {
      onQuerySubmit(inputValue);
    }
  };

  return (
    <section
      ref={timelineRef}
      id="home"
      className="relative min-h-[90vh] bg-[#DCE8F6] text-[#333D4E] overflow-hidden flex flex-col items-center pt-10 pb-16 px-4 sm:px-6 lg:px-8"
    >
      {/* Background Soft Glow & SVGs inspired by HeroFinancial */}
      <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(91,158,225,0.25),rgba(220,232,246,0))] pointer-events-none" />

      {/* Hero Header Pill Badge */}
      <div className="relative z-10 text-center max-w-4xl mx-auto flex flex-col items-center gap-6">
        <TimelineAnimation
          animationNum={1}
          timelineRef={timelineRef}
          className="bg-white px-3.5 py-1.5 rounded-full inline-flex items-center gap-2 shadow-md shadow-blue-500/10 border border-[#B9D5F7]"
        >
          <span className="bg-[#333D4E] text-white px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider">
            MULTI-AGENT AI SWARM
          </span>
          <span className="text-xs font-semibold text-[#333D4E]">
            Powered by LangGraph Router & Pinecone Vector DB
          </span>
        </TimelineAnimation>

        {/* Headline */}
        <TimelineAnimation
          as="h1"
          animationNum={2}
          timelineRef={timelineRef}
          className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-[#333D4E] leading-[1.12]"
        >
          One Academic Platform. <br />
          <span className="bg-gradient-to-r from-[#5B9EE1] to-[#333D4E] bg-clip-text text-transparent">
            Specialized Agents
          </span> for Every Query.
        </TimelineAnimation>

        {/* Subtitle */}
        <TimelineAnimation
          as="p"
          animationNum={3}
          timelineRef={timelineRef}
          className="text-lg sm:text-xl text-[#5A6A80] font-normal max-w-2xl mx-auto leading-relaxed"
        >
          Chimera evaluates intent in real-time, routing your queries to Syllabus Tutors, Policy Rules, or Exam Solvers with transparent dynamic data flow.
        </TimelineAnimation>

        {/* CTA Buttons Inspired by Palette */}
        <TimelineAnimation
          animationNum={4}
          timelineRef={timelineRef}
          className="flex flex-col sm:flex-row gap-3.5 justify-center w-full sm:w-auto"
        >
          <a
            href="/chat"
            className="px-6 py-3 bg-[#333D4E] text-white font-semibold rounded-xl shadow-md hover:bg-[#252D3A] transition flex items-center justify-center gap-2 text-base"
          >
            Launch Interactive Chat <ChevronRight size={18} />
          </a>
          <a
            href="/telemetry"
            className="px-6 py-3 bg-[#B9D5F7] text-[#333D4E] font-semibold rounded-xl shadow-xs border border-[#5B9EE1]/30 hover:bg-[#A8CAFA] transition flex items-center justify-center gap-2 text-base"
          >
            <Layers className="w-4 h-4 text-[#333D4E]" /> View Live Telemetry
          </a>
        </TimelineAnimation>
      </div>

      {/* AI Interactive Prompt Console */}
      <div className="relative z-10 w-full max-w-3xl mx-auto mt-10">
        <TimelineAnimation
          animationNum={5}
          timelineRef={timelineRef}
          className="bg-white p-3 sm:p-5 rounded-2xl border border-[#B9D5F7] shadow-xl shadow-blue-500/5"
        >
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2 items-stretch sm:items-center">
            <div className="flex-1 flex items-center gap-3 px-3 py-2 bg-[#DCE8F6]/40 rounded-xl border border-[#B9D5F7] focus-within:border-[#5B9EE1] transition-all">
              <Sparkles className="w-5 h-5 text-[#5B9EE1] shrink-0" />
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Ask Chimera anything about your course syllabus, attendance policy, or question bank..."
                className="w-full bg-transparent text-[#333D4E] placeholder-[#5A6A80] text-sm sm:text-base focus:outline-none"
              />
            </div>
            <button
              type="submit"
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#333D4E] text-white font-semibold text-sm hover:bg-[#252D3A] transition shadow-xs shrink-0"
            >
              <span>Route Query</span>
              <Send className="w-4 h-4" />
            </button>
          </form>

          {/* Sample Chips */}
          <div className="mt-4 pt-3 border-t border-[#E2E8F0] flex flex-wrap items-center gap-2 px-1">
            <span className="text-xs font-semibold text-[#5A6A80] flex items-center gap-1">
              <Bot className="w-3.5 h-3.5 text-[#5B9EE1]" /> Try prompts:
            </span>
            {queryChips.map((chip) => (
              <button
                key={chip}
                type="button"
                onClick={() => handleChipClick(chip)}
                className="text-xs px-3 py-1.5 rounded-lg bg-[#B9D5F7]/40 border border-[#B9D5F7] text-[#333D4E] hover:bg-[#5B9EE1]/20 transition-all cursor-pointer text-left"
              >
                {chip}
              </button>
            ))}
          </div>
        </TimelineAnimation>
      </div>

      {/* Dynamic Swarm Telemetry Preview Frame */}
      <div className="relative z-10 w-full max-w-5xl mx-auto mt-12">
        <TimelineAnimation
          animationNum={6}
          timelineRef={timelineRef}
          className="rounded-3xl bg-white p-4 border border-[#B9D5F7] shadow-2xl"
        >
          <div className="bg-[#333D4E] rounded-2xl p-6 text-white text-left relative overflow-hidden">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#424F65]">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#E54D4D]" />
                <div className="w-3 h-3 rounded-full bg-[#5B9EE1]" />
                <div className="w-3 h-3 rounded-full bg-[#B9D5F7]" />
                <span className="ml-2 text-xs font-mono text-[#B9D5F7]">Chimera Swarm Dynamic Agent Telemetry</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-medium text-[#B9D5F7] bg-[#5B9EE1]/20 px-2.5 py-1 rounded-md border border-[#5B9EE1]/40">
                <Database className="w-3.5 h-3.5 text-[#5B9EE1]" /> Vector Retrieval Active
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs font-mono">
              <div className="p-3 rounded-xl bg-[#424F65] border border-slate-600">
                <span className="text-[#B9D5F7] block mb-1">01. INGRESS</span>
                <span className="text-white font-semibold">User Query Input</span>
                <p className="text-slate-300 mt-2 text-[11px] truncate">"Explain Page Replacement Algorithms"</p>
              </div>
              <div className="p-3 rounded-xl bg-[#5B9EE1]/30 border border-[#5B9EE1]/50">
                <span className="text-[#B9D5F7] block mb-1">02. ROUTER</span>
                <span className="text-white font-semibold">Supervisor Router</span>
                <p className="text-slate-300 mt-2 text-[11px]">Intent: Syllabus Tutor</p>
              </div>
              <div className="p-3 rounded-xl bg-[#424F65] border border-slate-600">
                <span className="text-[#B9D5F7] block mb-1">03. AGENT</span>
                <span className="text-amber-300 font-semibold">Syllabus Tutor</span>
                <p className="text-slate-300 mt-2 text-[11px]">Executing retrieval</p>
              </div>
              <div className="p-3 rounded-xl bg-[#424F65] border border-slate-600">
                <span className="text-[#B9D5F7] block mb-1">04. VECTOR DB</span>
                <span className="text-[#5B9EE1] font-semibold">Pinecone Index</span>
                <p className="text-slate-300 mt-2 text-[11px]">3 chunks fetched (0.92 sim)</p>
              </div>
            </div>
          </div>
        </TimelineAnimation>
      </div>
    </section>
  );
}
