import React, { useState } from "react";
import { ArrowRight, ArrowDown, Send, Sparkles } from "lucide-react";

export function Hero({ onQuerySubmit, activeQuery = "" }) {
  const [inputValue, setInputValue] = useState(activeQuery);

  const queryChips = [
    "What is the syllabus for DBMS?",
    "Which CN topics are most important?",
    "What are the attendance rules?",
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
    <section id="home" className="pt-12 pb-16 md:pt-20 md:pb-24 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto text-center">
      {/* Badge */}
      <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[#E5E7EB] text-xs font-semibold text-[#1F2937] shadow-2xs mb-8">
        <span className="inline-block w-2 h-2 rounded-full bg-[#4F46E5] animate-pulse"></span>
        <span>MULTI-AGENT ACADEMIC AI</span>
      </div>

      {/* Headline */}
      <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#1F2937] tracking-tight leading-[1.15] mb-6">
        One Academic Assistant. <br />
        <span className="text-[#4F46E5]">Specialized Agents</span> for Every Question.
      </h1>

      {/* Description */}
      <p className="max-w-2xl mx-auto text-base sm:text-lg text-[#6B7280] leading-relaxed mb-8">
        Chimera understands your question, routes it to the right specialist, and retrieves information from the sources that matter.
      </p>

      {/* Hero Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 mb-12">
        <a
          href="#hero-prompt"
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#4F46E5] text-white font-medium hover:bg-[#4338CA] transition-colors shadow-sm"
        >
          Start Chatting
          <ArrowRight className="w-4 h-4" />
        </a>
        <a
          href="#routing-preview"
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white border border-[#E5E7EB] text-[#1F2937] font-medium hover:bg-[#F9FAFB] hover:border-[#D1D5DB] transition-colors shadow-2xs"
        >
          Explore Architecture
          <ArrowDown className="w-4 h-4 text-[#6B7280]" />
        </a>
      </div>

      {/* 21st.dev AI Prompt Box */}
      <div id="hero-prompt" className="max-w-3xl mx-auto text-left">
        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-3 sm:p-4 shadow-sm hover:shadow-md transition-shadow">
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2 items-stretch sm:items-center">
            <div className="flex-1 flex items-center gap-3 px-3 py-2">
              <Sparkles className="w-5 h-5 text-[#4F46E5] shrink-0" />
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Ask Chimera anything about your academics..."
                className="w-full bg-transparent text-[#1F2937] placeholder-[#6B7280] text-sm sm:text-base focus:outline-none"
              />
            </div>
            <button
              type="submit"
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#4F46E5] text-white font-medium text-sm hover:bg-[#4338CA] transition-colors shadow-2xs shrink-0"
            >
              <span>Route Query</span>
              <Send className="w-4 h-4" />
            </button>
          </form>

          {/* Example Query Chips */}
          <div className="mt-3 pt-3 border-t border-[#E5E7EB] flex flex-wrap items-center gap-2 px-1">
            <span className="text-xs font-medium text-[#6B7280]">Try asking:</span>
            {queryChips.map((chip) => (
              <button
                key={chip}
                type="button"
                onClick={() => handleChipClick(chip)}
                className="text-xs px-2.5 py-1 rounded-lg bg-[#F9FAFB] border border-[#E5E7EB] text-[#1F2937] hover:bg-[#4F46E5]/10 hover:text-[#4F46E5] hover:border-[#4F46E5]/30 transition-all cursor-pointer text-left"
              >
                {chip}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
