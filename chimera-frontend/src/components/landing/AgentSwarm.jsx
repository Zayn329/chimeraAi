import React, { useState } from "react";
import { BookOpen, BarChart3, Landmark, Users } from "lucide-react";
import { AgentCard, AgentDialog } from "./AgentCard";

const AGENTS_DATA = [
  {
    id: "tutor",
    title: "Tutor Agent",
    icon: BookOpen,
    accent: "#4F46E5",
    purpose: "Understand concepts and academic material.",
    sources: "Syllabus · Reference Material · Web Search",
    sourcesList: ["Syllabus", "Reference Material", "Web Search"],
    capabilities: "Concept explanations · Topic references · Syllabus-aware answers",
    capabilitiesList: [
      "Concept explanations",
      "Topic references",
      "Syllabus-aware answers",
    ],
  },
  {
    id: "strategist",
    title: "Strategist Agent",
    icon: BarChart3,
    accent: "#10B981",
    purpose: "Prepare for examinations using syllabus and past-paper analysis.",
    sources: "Past Papers · Syllabus · Analysis",
    sourcesList: ["Past Papers", "Syllabus", "Analysis"],
    capabilities: "Important topics · Exam patterns · Study strategies",
    capabilitiesList: [
      "Important topics",
      "Exam patterns",
      "Study strategies",
    ],
  },
  {
    id: "policy",
    title: "Policy Agent",
    icon: Landmark,
    accent: "#F59E0B",
    purpose: "Understand institutional rules, procedures, and regulations.",
    sources: "Rulebooks · Circulars · Regulations",
    sourcesList: ["Rulebooks", "Circulars", "Regulations"],
    capabilities: "Academic rules · Procedures · Administrative queries",
    capabilitiesList: [
      "Academic rules",
      "Procedures",
      "Administrative queries",
    ],
  },
];

export function AgentSwarm() {
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleExplore = (agent) => {
    setSelectedAgent(agent);
    setDialogOpen(true);
  };

  return (
    <section id="agents" className="py-12 md:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#4F46E5]/10 text-[#4F46E5] text-xs font-semibold uppercase tracking-wider mb-3">
          <Users className="w-3.5 h-3.5" /> Specialized Intelligence
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1F2937] tracking-tight">
          Meet the Agent Swarm
        </h2>
        <p className="text-base sm:text-lg text-[#6B7280] mt-2 max-w-xl mx-auto">
          Specialized agents for different academic tasks.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
        {AGENTS_DATA.map((agent) => (
          <AgentCard
            key={agent.id}
            agent={agent}
            onExplore={handleExplore}
          />
        ))}
      </div>

      <AgentDialog
        agent={selectedAgent}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      />
    </section>
  );
}
