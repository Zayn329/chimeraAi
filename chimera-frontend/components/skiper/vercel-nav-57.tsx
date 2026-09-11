"use client";

import React from "react";
import { Brain, ShieldCheck, ShieldAlert, Sparkles, Terminal } from "lucide-react";
import { CommandSearch92 } from "./command-search-92";

interface VercelNavBarProps {
  circuitBreakerState: "CLOSED" | "OPEN";
  activeWorker: string;
  onSelectAction: (action: string) => void;
}

export function VercelNavBar57({
  circuitBreakerState,
  activeWorker,
  onSelectAction,
}: VercelNavBarProps) {
  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-zinc-800/80 px-4 py-2.5">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Brand & Logo */}
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-gradient-to-tr from-cyan-500/20 to-purple-500/20 border border-cyan-500/30">
            <Brain className="w-5 h-5 text-cyan-400" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-sm tracking-wide text-zinc-100">
                Chimera AI
              </span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
                Swarm v2.0
              </span>
            </div>
            <p className="text-[10px] text-zinc-500 hidden sm:block">
              Multi-Agent RAG Engine
            </p>
          </div>
        </div>

        {/* Command Palette Launcher */}
        <div className="hidden md:block">
          <CommandSearch92 onSelectAction={onSelectAction} />
        </div>

        {/* System Health Badges */}
        <div className="flex items-center gap-2">
          {/* Active Worker Badge */}
          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-xs font-mono">
            <Terminal className="w-3.5 h-3.5 text-purple-400" />
            <span className="text-zinc-400">Node:</span>
            <span className="text-cyan-300 font-semibold uppercase">{activeWorker || "SUPERVISOR"}</span>
          </div>

          {/* Circuit Breaker Status */}
          {circuitBreakerState === "CLOSED" ? (
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-medium">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Circuit Breaker:</span>
              <span className="font-semibold">Healthy</span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30 text-xs font-medium animate-pulse">
              <ShieldAlert className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Circuit Breaker:</span>
              <span className="font-semibold">Fallback</span>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
