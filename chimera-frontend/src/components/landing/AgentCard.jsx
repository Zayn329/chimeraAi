import React from "react";
import { Check, ArrowRight } from "lucide-react";
import { SpotlightCard } from "@/components/ui/spotlight-card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

export function AgentDialog({ agent, open, onOpenChange }) {
  if (!agent) return null;

  const Icon = agent.icon;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg border-[#E5E7EB] bg-white p-6 rounded-2xl shadow-xl">
        <DialogHeader className="flex flex-row items-center gap-3 space-y-0 pb-4 border-b border-[#E5E7EB]">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center text-white shrink-0"
            style={{ backgroundColor: agent.accent }}
          >
            <Icon className="w-5 h-5" />
          </div>
          <div>
            <DialogTitle className="text-xl font-bold text-[#1F2937]">
              {agent.title}
            </DialogTitle>
            <DialogDescription className="text-xs text-[#6B7280]">
              Specialized Domain Agent
            </DialogDescription>
          </div>
        </DialogHeader>

        <div className="space-y-5 pt-4 text-left">
          {/* Purpose */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#6B7280] mb-1.5">
              Purpose
            </h4>
            <p className="text-sm font-medium text-[#1F2937] leading-relaxed">
              {agent.purpose}
            </p>
          </div>

          {/* Knowledge Sources */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#6B7280] mb-2">
              Knowledge Sources
            </h4>
            <div className="space-y-1.5">
              {agent.sourcesList.map((source) => (
                <div
                  key={source}
                  className="flex items-center gap-2 text-sm text-[#1F2937]"
                >
                  <div
                    className="w-4 h-4 rounded-full flex items-center justify-center text-white text-[10px] shrink-0"
                    style={{ backgroundColor: agent.accent }}
                  >
                    <Check className="w-3 h-3 stroke-[3]" />
                  </div>
                  <span>{source}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Capabilities */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#6B7280] mb-2">
              Capabilities
            </h4>
            <div className="flex flex-wrap gap-2">
              {agent.capabilitiesList.map((cap) => (
                <span
                  key={cap}
                  className="text-xs px-2.5 py-1 rounded-md bg-[#F9FAFB] border border-[#E5E7EB] text-[#1F2937] font-medium"
                >
                  {cap}
                </span>
              ))}
            </div>
          </div>

          {/* Workflow */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#6B7280] mb-2">
              Workflow Sequence
            </h4>
            <div className="flex items-center justify-between p-3 rounded-xl bg-[#F9FAFB] border border-[#E5E7EB] text-xs font-medium text-[#1F2937]">
              <span>Query</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#6B7280]" />
              <span
                className="font-semibold px-2 py-0.5 rounded text-white"
                style={{ backgroundColor: agent.accent }}
              >
                Retrieval
              </span>
              <ArrowRight className="w-3.5 h-3.5 text-[#6B7280]" />
              <span>Generation</span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function AgentCard({ agent, onExplore }) {
  const Icon = agent.icon;

  return (
    <SpotlightCard
      spotlightColor={`${agent.accent}14`}
      borderColor="#E5E7EB"
      className="flex flex-col justify-between h-full group transition-all duration-200"
    >
      <div>
        {/* Header with Icon and Accent */}
        <div className="flex items-center justify-between mb-4">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center text-white shadow-2xs transition-transform group-hover:scale-105"
            style={{ backgroundColor: agent.accent }}
          >
            <Icon className="w-6 h-6" />
          </div>
          <span
            className="text-xs px-2.5 py-1 rounded-full font-semibold border"
            style={{
              borderColor: `${agent.accent}40`,
              color: agent.accent,
              backgroundColor: `${agent.accent}0D`,
            }}
          >
            Domain Specialist
          </span>
        </div>

        {/* Title */}
        <h3 className="text-xl font-bold text-[#1F2937] mb-2">
          {agent.title}
        </h3>

        {/* Purpose */}
        <p className="text-sm text-[#6B7280] leading-relaxed mb-6">
          {agent.purpose}
        </p>

        {/* Sources section */}
        <div className="mb-4">
          <span className="text-xs font-semibold text-[#6B7280] block mb-1">
            SOURCES
          </span>
          <p className="text-xs font-medium text-[#1F2937]">
            {agent.sources}
          </p>
        </div>

        {/* Capabilities section */}
        <div className="mb-6">
          <span className="text-xs font-semibold text-[#6B7280] block mb-1">
            CAPABILITIES
          </span>
          <p className="text-xs text-[#6B7280]">
            {agent.capabilities}
          </p>
        </div>
      </div>

      {/* Explore Button */}
      <button
        type="button"
        onClick={() => onExplore(agent)}
        className="w-full inline-flex items-center justify-center gap-1.5 py-2.5 rounded-lg border border-[#E5E7EB] bg-white text-[#1F2937] text-sm font-medium hover:bg-[#F9FAFB] hover:border-[#D1D5DB] transition-all cursor-pointer group-hover:border-[#4F46E5]/40"
      >
        <span>Explore Agent</span>
        <ArrowRight className="w-4 h-4 text-[#6B7280] group-hover:translate-x-0.5 transition-transform" />
      </button>
    </SpotlightCard>
  );
}
