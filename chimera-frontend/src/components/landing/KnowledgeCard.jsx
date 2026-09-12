import React from "react";
import { cn } from "@/lib/utils";

export function KnowledgeCard({ card, className }) {
  const Icon = card.icon;

  return (
    <div
      className={cn(
        "bg-white rounded-2xl border border-[#E5E7EB] p-6 sm:p-7 flex flex-col justify-between shadow-2xs hover:shadow-md transition-shadow duration-200",
        className
      )}
    >
      <div>
        <div className="flex items-center justify-between mb-4">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center border shadow-2xs"
            style={{
              backgroundColor: card.accentBg || "#F9FAFB",
              borderColor: card.accentBorder || "#E5E7EB",
              color: card.accentColor || "#1F2937",
            }}
          >
            <Icon className="w-5 h-5" />
          </div>
          <span className="text-[11px] font-semibold text-[#6B7280] uppercase tracking-wider px-2.5 py-1 rounded-md bg-[#F9FAFB] border border-[#E5E7EB]">
            {card.category}
          </span>
        </div>

        <h3 className="text-xl font-bold text-[#1F2937] mb-2">
          {card.title}
        </h3>

        <p className="text-sm text-[#6B7280] leading-relaxed">
          {card.description}
        </p>
      </div>

      <div className="mt-6 pt-4 border-t border-[#E5E7EB]/60 flex items-center justify-between text-xs font-medium text-[#6B7280]">
        <span>Primary Source</span>
        <span className="font-semibold text-[#1F2937]">{card.sourceType}</span>
      </div>
    </div>
  );
}
