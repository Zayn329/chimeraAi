"use client";

import React from "react";
import { Cpu, Terminal, Zap, ShieldAlert, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";

interface TelemetryEvent {
  node?: string;
  tool?: string;
  message?: string;
  timestamp: string;
}

interface DebugPanelProps {
  activeWorker: string;
  circuitBreakerState: "CLOSED" | "OPEN";
  events: TelemetryEvent[];
}

export function DebugPanel102({ activeWorker, circuitBreakerState, events }: DebugPanelProps) {
  return (
    <div className="glass-panel rounded-2xl p-4 w-full flex flex-col gap-3 font-mono text-xs">
      <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
        <div className="flex items-center gap-2 text-zinc-300 font-medium">
          <Terminal className="w-4 h-4 text-cyan-400" />
          <span>Swarm Telemetry Debugger</span>
        </div>

        {/* Circuit Breaker Badge */}
        <div className="flex items-center gap-1.5">
          {circuitBreakerState === "CLOSED" ? (
            <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              <CheckCircle2 className="w-3 h-3" />
              <span>Breaker: CLOSED</span>
            </span>
          ) : (
            <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30 animate-pulse">
              <ShieldAlert className="w-3 h-3" />
              <span>Breaker: OPEN (Offline Fallback)</span>
            </span>
          )}
        </div>
      </div>

      {/* Active Worker Status */}
      <div className="flex items-center gap-2 bg-zinc-900/80 p-2.5 rounded-xl border border-zinc-800">
        <Cpu className="w-4 h-4 text-purple-400" />
        <span className="text-zinc-400">Supervisor Active Worker:</span>
        <span className="font-bold text-cyan-300 uppercase">{activeWorker || "IDLE"}</span>
      </div>

      {/* Live Stream Event Log */}
      <div className="flex flex-col gap-1.5 max-h-40 overflow-y-auto pr-1">
        {events.length === 0 ? (
          <span className="text-zinc-600 italic py-2">Awaiting stream execution events...</span>
        ) : (
          events.map((evt, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -5 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-start gap-2 text-[11px] py-1 border-b border-zinc-800/40 text-zinc-300"
            >
              <Zap className="w-3 h-3 text-cyan-400 shrink-0 mt-0.5" />
              <div className="flex-1">
                {evt.node && (
                  <span className="text-cyan-300 font-semibold">[{evt.node}] </span>
                )}
                {evt.tool && (
                  <span className="text-purple-300 font-semibold">Tool: {evt.tool} </span>
                )}
                <span className="text-zinc-400">{evt.message}</span>
              </div>
              <span className="text-zinc-600 text-[10px]">{evt.timestamp}</span>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
