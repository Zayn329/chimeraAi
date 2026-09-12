import React, { useState } from "react";
import { Navbar } from "@/components/landing/Navbar";
import { Hero } from "@/components/landing/Hero";
import { AgentRoutingPreview } from "@/components/landing/AgentRoutingPreview";
import { AgentSwarm } from "@/components/landing/AgentSwarm";

export function LandingPage() {
  const [submittedQuery, setSubmittedQuery] = useState("");

  const handleQuerySubmit = (query) => {
    setSubmittedQuery(query);
    const routingSection = document.getElementById("routing-preview");
    if (routingSection) {
      routingSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB] text-[#1F2937] font-sans selection:bg-[#4F46E5]/20 selection:text-[#4F46E5]">
      {/* Section 1: Navbar */}
      <Navbar />

      <main className="space-y-4">
        {/* Section 2: Hero */}
        <Hero onQuerySubmit={handleQuerySubmit} activeQuery={submittedQuery} />

        {/* Section 3: Hero Routing Preview */}
        <AgentRoutingPreview activeQuery={submittedQuery} />

        {/* Section 4: Agent Swarm */}
        <AgentSwarm />
      </main>
    </div>
  );
}
