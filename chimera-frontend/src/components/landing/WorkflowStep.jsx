import React from "react";
import { motion } from "framer-motion";
import { MessageSquare, Cpu, Database, Zap } from "lucide-react";

export function WorkflowStep({ step, index, totalSteps, isMobile }) {
  const Icon = step.icon;

  if (isMobile) {
    return (
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4, delay: index * 0.1 }}
        className="flex gap-4 relative pb-8 last:pb-0"
      >
        {/* Timeline Vertical Line */}
        {index < totalSteps - 1 && (
          <div className="absolute left-[19px] top-10 bottom-0 w-0.5 bg-[#E5E7EB]" />
        )}

        {/* Step Icon Node */}
        <div className="relative z-10 w-10 h-10 rounded-xl bg-[#EEF2FF] border border-[#4F46E5]/30 flex items-center justify-center text-[#4F46E5] font-bold shrink-0 shadow-2xs">
          <Icon className="w-5 h-5" />
        </div>

        {/* Step Content Card */}
        <div className="flex-1 bg-white p-4 rounded-xl border border-[#E5E7EB] shadow-2xs">
          <div className="text-xs font-bold text-[#4F46E5] uppercase tracking-wider mb-1">
            {step.number} — {step.title}
          </div>
          <p className="text-sm text-[#6B7280] leading-relaxed">
            {step.description}
          </p>
        </div>
      </motion.div>
    );
  }

  // Desktop Horizontal Layout Step
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className="flex-1 relative flex flex-col items-center text-center group"
    >
      {/* Connector Line between Desktop steps */}
      {index < totalSteps - 1 && (
        <div className="hidden lg:block absolute top-6 left-[calc(50%+28px)] right-[calc(-50%+28px)] h-0.5 bg-[#E5E7EB] z-0" />
      )}

      {/* Step Node */}
      <div className="relative z-10 w-12 h-12 rounded-2xl bg-white border-2 border-[#E5E7EB] group-hover:border-[#4F46E5] group-hover:bg-[#EEF2FF] flex items-center justify-center text-[#1F2937] group-hover:text-[#4F46E5] transition-all duration-300 shadow-2xs mb-4">
        <Icon className="w-6 h-6" />
      </div>

      {/* Step Number Badge */}
      <span className="text-xs font-bold text-[#4F46E5] uppercase tracking-widest mb-1.5">
        {step.number} — {step.title}
      </span>

      {/* Description */}
      <p className="text-xs sm:text-sm text-[#6B7280] max-w-xs leading-relaxed px-2">
        {step.description}
      </p>
    </motion.div>
  );
}
