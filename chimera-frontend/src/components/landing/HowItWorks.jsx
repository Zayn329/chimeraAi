import React from "react";
import { MessageSquare, Cpu, Database, Zap, GitCommit } from "lucide-react";
import { WorkflowStep } from "./WorkflowStep";

const STEPS = [
  {
    number: "01",
    title: "ASK",
    description: "Submit a natural-language academic question.",
    icon: MessageSquare,
  },
  {
    number: "02",
    title: "ROUTE",
    description: "The router identifies the intent and selects the appropriate agent.",
    icon: Cpu,
  },
  {
    number: "03",
    title: "RETRIEVE",
    description: "The agent searches knowledge sources relevant to the task.",
    icon: Database,
  },
  {
    number: "04",
    title: "RESPOND",
    description: "Chimera generates and streams the response.",
    icon: Zap,
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-12 md:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#4F46E5]/10 text-[#4F46E5] text-xs font-semibold uppercase tracking-wider mb-3">
          <GitCommit className="w-3.5 h-3.5" /> HOW IT WORKS
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1F2937] tracking-tight">
          From Question to Grounded Answer
        </h2>
        <p className="text-base sm:text-lg text-[#6B7280] mt-2 max-w-xl mx-auto">
          Four automated steps powering intelligent academic retrieval and response generation.
        </p>
      </div>

      {/* Desktop Horizontal Step Layout */}
      <div className="hidden md:flex justify-between items-start gap-4 max-w-5xl mx-auto bg-white p-8 rounded-2xl border border-[#E5E7EB] shadow-2xs">
        {STEPS.map((step, idx) => (
          <WorkflowStep
            key={step.number}
            step={step}
            index={idx}
            totalSteps={STEPS.length}
            isMobile={false}
          />
        ))}
      </div>

      {/* Mobile Vertical How It Works Timeline */}
      <div className="md:hidden max-w-md mx-auto">
        {STEPS.map((step, idx) => (
          <WorkflowStep
            key={step.number}
            step={step}
            index={idx}
            totalSteps={STEPS.length}
            isMobile={true}
          />
        ))}
      </div>
    </section>
  );
}
