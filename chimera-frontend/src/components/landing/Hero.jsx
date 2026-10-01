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
      className="relative min-h-[90vh] bg-[#f8fafc] text-[#1f2937] overflow-hidden flex flex-col items-center pt-10 pb-16 px-4 sm:px-6 lg:px-8"
    >
      {/* Background Soft Glow & SVGs inspired by HeroFinancial */}
      <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(79,70,229,0.12),rgba(255,255,255,0))] pointer-events-none" />

      <svg
        width="358"
        height="483"
        viewBox="0 0 358 483"
        className="absolute top-0 z-0 left-0 opacity-40 pointer-events-none"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g filter="url(#filter0_f_hero)">
          <rect
            x="-86.9961"
            y="-33.114"
            width="72"
            height="541"
            rx="36"
            transform="rotate(-30.8182 -86.9961 -33.114)"
            fill="url(#paint0_linear_hero)"
          />
        </g>
        <defs>
          <filter id="filter0_f_hero" x="-137.641" y="-120.646" width="440.285" height="602.787" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
            <feFlood floodOpacity="0" result="BackgroundImageFix" />
            <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
            <feGaussianBlur stdDeviation="32" result="effect1_foregroundBlur_hero" />
          </filter>
          <linearGradient id="paint0_linear_hero" x1="-50.9961" y1="-33.114" x2="-50.9961" y2="507.886" gradientUnits="userSpaceOnUse">
            <stop stopColor="#818cf8" />
            <stop offset="1" stopColor="#e0e7ff" />
          </linearGradient>
        </defs>
      </svg>

      {/* Hero Header Pill Badge */}
      <div className="relative z-10 text-center max-w-4xl mx-auto flex flex-col items-center gap-6">
        <TimelineAnimation
          animationNum={1}
          timelineRef={timelineRef}
          className="bg-white/90 backdrop-blur-md px-3.5 py-1.5 rounded-full inline-flex items-center gap-2 shadow-lg shadow-indigo-500/10 border border-indigo-100"
        >
          <span className="bg-gradient-to-r from-indigo-600 to-indigo-400 text-white px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider">
            Multi-Agent AI Swarm
          </span>
          <span className="text-xs font-semibold text-slate-700">
            Powered by LangGraph Router & Pinecone Vector DB
          </span>
        </TimelineAnimation>

        {/* Headline */}
        <TimelineAnimation
          as="h1"
          animationNum={2}
          timelineRef={timelineRef}
          className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-slate-900 leading-[1.12]"
        >
          One Academic Platform. <br />
          <span className="bg-gradient-to-r from-indigo-600 via-indigo-500 to-indigo-400 bg-clip-text text-transparent">
            Specialized Agents
          </span> for Every Query.
        </TimelineAnimation>

        {/* Subtitle */}
        <TimelineAnimation
          as="p"
          animationNum={3}
          timelineRef={timelineRef}
          className="text-lg sm:text-xl text-slate-600 font-normal max-w-2xl mx-auto leading-relaxed"
        >
          Chimera evaluates intent in real-time, routing your queries to Syllabus Tutors, Policy Rules, or Exam Solvers with transparent dynamic data flow.
        </TimelineAnimation>

        {/* CTA Buttons Inspired by HeroFinancial Layout */}
        <TimelineAnimation
          animationNum={4}
          timelineRef={timelineRef}
          className="flex flex-col sm:flex-row gap-3.5 justify-center w-full sm:w-auto"
        >
          <a
            href="/chat"
            className="px-6 py-3 bg-gradient-to-r from-indigo-600 via-indigo-500 to-indigo-400 text-white font-semibold rounded-xl shadow-md shadow-indigo-500/20 hover:opacity-95 transition flex items-center justify-center gap-2 text-base"
          >
            Launch Interactive Chat <ChevronRight size={18} />
          </a>
          <a
            href="/telemetry"
            className="px-6 py-3 bg-white text-slate-800 font-semibold rounded-xl shadow-xs border border-slate-200 hover:bg-slate-50 transition flex items-center justify-center gap-2 text-base"
          >
            <Layers className="w-4 h-4 text-indigo-600" /> View Live Telemetry
          </a>
        </TimelineAnimation>
      </div>

      {/* 21st.dev Style AI Interactive Prompt Console */}
      <div className="relative z-10 w-full max-w-3xl mx-auto mt-10">
        <TimelineAnimation
          animationNum={5}
          timelineRef={timelineRef}
          className="bg-white/80 backdrop-blur-xl p-3 sm:p-5 rounded-2xl border border-white/80 shadow-xl shadow-indigo-500/5"
        >
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2 items-stretch sm:items-center">
            <div className="flex-1 flex items-center gap-3 px-3 py-2 bg-slate-50/80 rounded-xl border border-slate-200/60 focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500 transition-all">
              <Sparkles className="w-5 h-5 text-indigo-600 shrink-0" />
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Ask Chimera anything about your course syllabus, attendance policy, or question bank..."
                className="w-full bg-transparent text-slate-800 placeholder-slate-400 text-sm sm:text-base focus:outline-none"
              />
            </div>
            <button
              type="submit"
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-slate-900 text-white font-semibold text-sm hover:bg-black transition shadow-xs shrink-0"
            >
              <span>Route Query</span>
              <Send className="w-4 h-4" />
            </button>
          </form>

          {/* Sample Chips */}
          <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center gap-2 px-1">
            <span className="text-xs font-semibold text-slate-500 flex items-center gap-1">
              <Bot className="w-3.5 h-3.5 text-indigo-500" /> Try prompts:
            </span>
            {queryChips.map((chip) => (
              <button
                key={chip}
                type="button"
                onClick={() => handleChipClick(chip)}
                className="text-xs px-3 py-1.5 rounded-lg bg-slate-100/80 border border-slate-200 text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200 transition-all cursor-pointer text-left"
              >
                {chip}
              </button>
            ))}
          </div>
        </TimelineAnimation>
      </div>

      {/* Dashboard Preview / Agent Node Frame Inspired by HeroFinancial */}
      <div className="relative z-10 w-full max-w-5xl mx-auto mt-12">
        <TimelineAnimation
          animationNum={6}
          timelineRef={timelineRef}
          className="rounded-3xl bg-white/70 backdrop-blur-xl p-4 border border-white/80 shadow-2xl shadow-indigo-900/10"
        >
          <div className="bg-slate-900 rounded-2xl p-6 text-white text-left relative overflow-hidden">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-rose-500" />
                <div className="w-3 h-3 rounded-full bg-amber-500" />
                <div className="w-3 h-3 rounded-full bg-emerald-500" />
                <span className="ml-2 text-xs font-mono text-slate-400">Chimera Swarm Dynamic Agent Telemetry</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-medium text-indigo-400 bg-indigo-500/10 px-2.5 py-1 rounded-md border border-indigo-500/20">
                <Database className="w-3.5 h-3.5" /> Vector Retrival Active
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs font-mono">
              <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700/60">
                <span className="text-slate-400 block mb-1">01. INGRESS</span>
                <span className="text-emerald-400 font-semibold">User Query Input</span>
                <p className="text-slate-400 mt-2 text-[11px] truncate">"Explain Page Replacement Algorithms"</p>
              </div>
              <div className="p-3 rounded-xl bg-indigo-950/80 border border-indigo-700/50">
                <span className="text-indigo-300 block mb-1">02. ROUTER</span>
                <span className="text-indigo-400 font-semibold">Supervisor Router</span>
                <p className="text-slate-400 mt-2 text-[11px]">Intent: Syllabus Tutor</p>
              </div>
              <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700/60">
                <span className="text-slate-400 block mb-1">03. AGENT</span>
                <span className="text-amber-400 font-semibold">Syllabus Tutor</span>
                <p className="text-slate-400 mt-2 text-[11px]">Executing retrieval</p>
              </div>
              <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700/60">
                <span className="text-slate-400 block mb-1">04. VECTOR DB</span>
                <span className="text-cyan-400 font-semibold">Pinecone Index</span>
                <p className="text-slate-400 mt-2 text-[11px]">3 chunks fetched (0.92 sim)</p>
              </div>
            </div>
          </div>
        </TimelineAnimation>
      </div>
    </section>
  );
}
