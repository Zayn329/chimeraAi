import React from "react";
import { Network, Bot, Zap, Radio, Sparkles } from "lucide-react";
import { FeatureCard } from "./FeatureCard";

const FEATURES = [
  {
    title: "Intent-Based Routing",
    description: "Queries are classified before reaching a specialized agent.",
    icon: Network,
    accentColor: "#4F46E5",
    accentBg: "#EEF2FF",
    accentBorder: "#4F46E5/30",
  },
  {
    title: "Multi-Agent Architecture",
    description: "Specialized workflows handle different academic tasks.",
    icon: Bot,
    accentColor: "#10B981",
    accentBg: "#ECFDF5",
    accentBorder: "#10B981/30",
  },
  {
    title: "Semantic Caching",
    description: "Similar queries can reuse prior results.",
    icon: Zap,
    accentColor: "#F59E0B",
    accentBg: "#FFFBEB",
    accentBorder: "#F59E0B/30",
  },
  {
    title: "Real-Time Streaming",
    description: "Responses can stream to the client as they are generated.",
    icon: Radio,
    accentColor: "#4F46E5",
    accentBg: "#EEF2FF",
    accentBorder: "#4F46E5/30",
  },
];

export function TechnicalFeatures() {
  return (
    <section id="architecture" className="py-12 md:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#4F46E5]/10 text-[#4F46E5] text-xs font-semibold uppercase tracking-wider mb-3">
          <Sparkles className="w-3.5 h-3.5" /> SYSTEM ARCHITECTURE
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1F2937] tracking-tight">
          Built for a Smarter Academic Workflow
        </h2>
        <p className="text-base sm:text-lg text-[#6B7280] mt-2 max-w-xl mx-auto">
          High-performance distributed multi-agent system designed for precision academic intelligence.
        </p>
      </div>

      {/* 21st.dev Features Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
        {FEATURES.map((feature) => (
          <FeatureCard key={feature.title} feature={feature} />
        ))}
      </div>
    </section>
  );
}
