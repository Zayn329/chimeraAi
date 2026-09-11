"use client";

import React, { useState, useEffect } from "react";
import { Search, Command, MessageSquare, RefreshCw, Cpu, BookOpen } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface CommandSearchProps {
  onSelectAction: (action: string) => void;
}

export function CommandSearch92({ onSelectAction }: CommandSearchProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const ACTIONS = [
    { icon: <MessageSquare className="w-4 h-4 text-cyan-400" />, label: "Start New Chat Thread", action: "new_thread" },
    { icon: <BookOpen className="w-4 h-4 text-purple-400" />, label: "Inspect Course Syllabus (OS)", action: "syllabus" },
    { icon: <Cpu className="w-4 h-4 text-emerald-400" />, label: "View System Swarm Health", action: "health" },
    { icon: <RefreshCw className="w-4 h-4 text-amber-400" />, label: "Clear Local Cache & Reset Thread", action: "reset" },
  ];

  const filtered = ACTIONS.filter((a) =>
    a.label.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-xl glass-panel text-xs text-zinc-400 hover:text-zinc-200 hover:border-zinc-700 transition-all"
      >
        <Search className="w-3.5 h-3.5" />
        <span>Search commands...</span>
        <kbd className="hidden md:inline-flex items-center gap-0.5 text-[10px] bg-zinc-800/80 text-zinc-400 px-1.5 py-0.5 rounded border border-zinc-700 font-mono">
          <Command className="w-2.5 h-2.5" /> K
        </kbd>
      </button>

      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              className="w-full max-w-lg glass-panel rounded-2xl shadow-2xl overflow-hidden border border-zinc-800"
            >
              <div className="flex items-center gap-3 px-4 py-3 border-b border-zinc-800">
                <Search className="w-4 h-4 text-cyan-400 shrink-0" />
                <input
                  type="text"
                  autoFocus
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Type a command or search prompt..."
                  className="w-full bg-transparent text-sm text-zinc-100 placeholder-zinc-500 outline-none"
                />
              </div>

              <div className="p-2 max-h-60 overflow-y-auto">
                {filtered.length === 0 ? (
                  <p className="p-4 text-xs text-center text-zinc-500">No matching commands found.</p>
                ) : (
                  filtered.map((item, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        onSelectAction(item.action);
                        setIsOpen(false);
                      }}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium text-zinc-300 hover:bg-zinc-800/80 hover:text-white transition-colors"
                    >
                      {item.icon}
                      <span>{item.label}</span>
                    </button>
                  ))
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
