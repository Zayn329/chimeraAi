import React from "react";

export function FeatureCard({ feature }) {
  const Icon = feature.icon;

  return (
    <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6 shadow-2xs hover:shadow-md transition-shadow duration-200 flex flex-col justify-between">
      <div>
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center mb-5 border shadow-2xs"
          style={{
            backgroundColor: feature.accentBg,
            borderColor: feature.accentBorder,
            color: feature.accentColor,
          }}
        >
          <Icon className="w-6 h-6" />
        </div>

        <h3 className="text-lg font-bold text-[#1F2937] mb-2">
          {feature.title}
        </h3>

        <p className="text-sm text-[#6B7280] leading-relaxed">
          {feature.description}
        </p>
      </div>

      <div className="mt-6 pt-4 border-t border-[#E5E7EB]/60 flex items-center justify-between">
        <span className="text-xs font-semibold text-[#6B7280] uppercase tracking-wider">
          Architecture Core
        </span>
        <span
          className="w-2 h-2 rounded-full"
          style={{ backgroundColor: feature.accentColor }}
        />
      </div>
    </div>
  );
}
