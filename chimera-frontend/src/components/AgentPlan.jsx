import React from 'react';
import { motion } from 'framer-motion';
import { Check, Loader2, Circle } from 'lucide-react';

export default function AgentPlan({ agentName, agentColor, steps = [] }) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-xs max-w-lg w-full text-left font-sans">
      <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-4">
        <div className="flex items-center gap-2">
          <span
            className="w-2.5 h-2.5 rounded-full inline-block"
            style={{ backgroundColor: agentColor }}
          />
          <span className="text-xs font-semibold tracking-wider uppercase text-gray-500">
            AGENT EXECUTION PLAN
          </span>
        </div>
        <span
          className="text-xs font-semibold px-2.5 py-0.5 rounded-full"
          style={{ backgroundColor: `${agentColor}15`, color: agentColor }}
        >
          {agentName}
        </span>
      </div>

      <div className="space-y-3">
        {steps.map((step, idx) => {
          const isDone = step.status === 'completed';
          const isCurrent = step.status === 'active';

          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.15 }}
              className="flex items-center justify-between text-sm py-1.5 px-2 rounded-lg transition-colors"
            >
              <div className="flex items-center gap-3">
                {isDone && (
                  <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                    <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                  </div>
                )}
                {isCurrent && (
                  <div
                    className="w-5 h-5 rounded-full flex items-center justify-center shrink-0"
                    style={{ backgroundColor: `${agentColor}20`, color: agentColor }}
                  >
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  </div>
                )}
                {!isDone && !isCurrent && (
                  <div className="w-5 h-5 rounded-full bg-gray-100 text-gray-400 flex items-center justify-center shrink-0">
                    <Circle className="w-3 h-3" />
                  </div>
                )}
                <span className={`text-xs sm:text-sm font-medium ${isDone ? 'text-gray-800' : isCurrent ? 'text-gray-900 font-semibold' : 'text-gray-400'}`}>
                  {step.label}
                </span>
              </div>
              {isCurrent && (
                <span className="text-[11px] font-mono text-indigo-600 animate-pulse bg-indigo-50 px-2 py-0.5 rounded">
                  Processing...
                </span>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
