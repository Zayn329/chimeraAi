import React, { useState } from "react";
import { Navbar } from "@/components/landing/Navbar";
import { Hero } from "@/components/landing/Hero";
import { AgentRoutingPreview } from "@/components/landing/AgentRoutingPreview";
import { AgentSwarm } from "@/components/landing/AgentSwarm";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { KnowledgeSection } from "@/components/landing/KnowledgeSection";
import { TechnicalFeatures } from "@/components/landing/TechnicalFeatures";
import AskChimera from "@/components/AskChimera";
import ArchitecturePreview from "@/components/ArchitecturePreview";

export function LandingPage() {
  const [submittedQuery, setSubmittedQuery] = useState("");

  const handleQuerySubmit = (query) => {
    setSubmittedQuery(query);
    const routingSection = document.getElementById("routing-preview");
    if (routingSection) {
      routingSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleNavigateToDocs = () => {
    const section = document.getElementById("architecture");
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB] text-[#1F2937] font-sans selection:bg-[#4F46E5]/20 selection:text-[#4F46E5]">
      {/* Section 1: Navbar */}
      <Navbar />

      <main className="space-y-6 pb-20">
        {/* Section 2: Hero */}
        <Hero onQuerySubmit={handleQuerySubmit} activeQuery={submittedQuery} />

        {/* Section 3: Hero Routing Preview */}
        <AgentRoutingPreview activeQuery={submittedQuery} />

        {/* Section 4: Agent Swarm */}
        <AgentSwarm />

        {/* Section 5: How Chimera Works */}
        <HowItWorks />

        {/* Section 6: Knowledge & Retrieval */}
        <KnowledgeSection />

        {/* Section 7: Technical Differentiators */}
        <TechnicalFeatures />

        {/* Section 8: Ask Chimera Interactive Demo */}
        <AskChimera />

        {/* Section 9: Architecture Preview */}
        <ArchitecturePreview onNavigateToDocs={handleNavigateToDocs} />
      </main>
    </div>
  );
}
