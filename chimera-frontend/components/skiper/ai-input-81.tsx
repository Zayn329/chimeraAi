"use client";

import React, { useState } from "react";
import { Send, Globe, Sparkles, Paperclip, ChevronDown, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface AIInputProps {
  onSubmit: (prompt: string, options: { course: string; deepSearch: boolean }) => void;
  isLoading: boolean;
}

const COURSES = [
  "All Courses",
  "Analysis of Algorithms",
  "Operating Systems",
  "Computer Networks",
];

export function AIInput81({ onSubmit, isLoading }: AIInputProps) {
  const [prompt, setPrompt] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("Operating Systems");
  const [deepSearch, setDeepSearch] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || isLoading) return;
    onSubmit(prompt, { course: selectedCourse, deepSearch });
    setPrompt("");
  };

  return (
    <div className="relative w-full max-w-4xl mx-auto">
      <form
        onSubmit={handleSubmit}
        className="glass-panel rounded-2xl p-3 shadow-2xl transition-all duration-300 focus-within:border-cyan-500/50 focus-within:ring-2 focus-within:ring-cyan-500/20"
      >
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSubmit(e);
            }
          }}
          placeholder="Ask Chimera AI anything about your course, PYQs, or university policy..."
          className="w-full bg-transparent text-sm md:text-base text-zinc-100 placeholder-zinc-500 resize-none outline-none min-h-[60px] max-h-[160px] px-2 pt-1"
          rows={2}
        />

        {/* Action Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-zinc-800/80 px-1">
          <div className="flex items-center gap-2">
            {/* Deep Search Toggle */}
            <button
              type="button"
              onClick={() => setDeepSearch(!deepSearch)}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                deepSearch
                  ? "bg-purple-500/20 text-purple-300 border border-purple-500/40"
                  : "bg-zinc-800/50 text-zinc-400 hover:text-zinc-200 border border-zinc-700/40"
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Deep Search</span>
            </button>

            {/* Course Context Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-zinc-800/50 text-cyan-300 hover:bg-zinc-800 border border-cyan-500/30 transition-all"
              >
                <Globe className="w-3.5 h-3.5" />
                <span>{selectedCourse}</span>
                <ChevronDown className="w-3.5 h-3.5 opacity-60" />
              </button>

              <AnimatePresence>
                {dropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 5 }}
                    className="absolute left-0 bottom-full mb-2 w-52 glass-panel rounded-xl py-1 shadow-xl z-50 overflow-hidden"
                  >
                    {COURSES.map((course) => (
                      <button
                        key={course}
                        type="button"
                        onClick={() => {
                          setSelectedCourse(course);
                          setDropdownOpen(false);
                        }}
                        className="w-full flex items-center justify-between px-3 py-2 text-xs text-left text-zinc-300 hover:bg-cyan-500/10 hover:text-cyan-300 transition-colors"
                      >
                        <span>{course}</span>
                        {selectedCourse === course && <Check className="w-3.5 h-3.5 text-cyan-400" />}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* File Attachment Trigger */}
            <button
              type="button"
              className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60 transition-colors"
              title="Attach document/PDF"
            >
              <Paperclip className="w-4 h-4" />
            </button>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={!prompt.trim() || isLoading}
            className={`flex items-center gap-1.5 px-4 py-1.5 rounded-xl font-medium text-xs md:text-sm transition-all duration-300 ${
              prompt.trim() && !isLoading
                ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/25 hover:opacity-90 active:scale-95"
                : "bg-zinc-800 text-zinc-500 cursor-not-allowed"
            }`}
          >
            <span>Send</span>
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>
      </form>
    </div>
  );
}
