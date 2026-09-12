import React from "react";
import { BookMarked, FileText, Database, Globe, Layers } from "lucide-react";
import { KnowledgeCard } from "./KnowledgeCard";

const KNOWLEDGE_CARDS = [
  {
    title: "Syllabus Knowledge",
    description: "Institution-specific academic content and course structure.",
    category: "Academic Core",
    sourceType: "Official Curricula",
    icon: BookMarked,
    accentColor: "#4F46E5",
    accentBg: "#EEF2FF",
    accentBorder: "#4F46E5/30",
    gridSpan: "md:col-span-2 lg:col-span-2",
  },
  {
    title: "Past Papers",
    description: "Historical examination material for exam-oriented reasoning.",
    category: "Assessment",
    sourceType: "Exam Archives",
    icon: FileText,
    accentColor: "#10B981",
    accentBg: "#ECFDF5",
    accentBorder: "#10B981/30",
    gridSpan: "md:col-span-1 lg:col-span-1",
  },
  {
    title: "Semantic Cache",
    description: "Similar queries can reuse previous results and avoid unnecessary processing.",
    category: "Optimization",
    sourceType: "Vector Cache Engine",
    icon: Database,
    accentColor: "#F59E0B",
    accentBg: "#FFFBEB",
    accentBorder: "#F59E0B/30",
    gridSpan: "md:col-span-1 lg:col-span-1",
  },
  {
    title: "Web Search",
    description: "External fallback when required information isn't available in institutional knowledge.",
    category: "Fallback",
    sourceType: "Live Web Retrieval",
    icon: Globe,
    accentColor: "#4F46E5",
    accentBg: "#EEF2FF",
    accentBorder: "#4F46E5/30",
    gridSpan: "md:col-span-2 lg:col-span-2",
  },
];

export function KnowledgeSection() {
  return (
    <section id="knowledge" className="py-12 md:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#4F46E5]/10 text-[#4F46E5] text-xs font-semibold uppercase tracking-wider mb-3">
          <Layers className="w-3.5 h-3.5" /> KNOWLEDGE & RETRIEVAL
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1F2937] tracking-tight">
          Grounded in the Right Knowledge
        </h2>
        <p className="text-base sm:text-lg text-[#6B7280] mt-2 max-w-xl mx-auto italic">
          "Different questions require different sources."
        </p>
      </div>

      {/* 21st.dev Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {KNOWLEDGE_CARDS.map((card) => (
          <KnowledgeCard
            key={card.title}
            card={card}
            className={card.gridSpan}
          />
        ))}
      </div>
    </section>
  );
}
