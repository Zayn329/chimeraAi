import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen,
  BarChart3,
  Landmark,
  ArrowDown,
  Cpu,
  CheckCircle2,
  RefreshCw,
  Sparkles,
} from "lucide-react";

const DEMO_QUERIES = [
  {
    query: "What is the syllabus for DBMS?",
    targetAgent: "tutor",
    agentName: "Tutor Agent",
    agentColor: "#4F46E5",
    icon: BookOpen,
    sources: "Syllabus · Reference Material",
    answer:
      "Database Management Systems syllabus covers ER Modeling, Relational Algebra, SQL normalization, Transaction Processing, and Indexing strategies.",
  },
  {
    query: "Which CN topics are most important?",
    targetAgent: "strategist",
    agentName: "Strategist Agent",
    agentColor: "#10B981",
    icon: BarChart3,
    sources: "Past Papers · Syllabus · Analysis",
    answer:
      "Analysis of past 5 years shows IPv4/v6 Addressing, TCP/UDP Flow Control, Congestion Control algorithms, and Subnetting carry 45% of exam weightage.",
  },
  {
    query: "What are the attendance rules?",
    targetAgent: "policy",
    agentName: "Policy Agent",
    agentColor: "#F59E0B",
    icon: Landmark,
    sources: "Rulebooks · Circulars · Regulations",
    answer:
      "Institutional policy requires a minimum of 75% attendance per subject to be eligible for end-semester examinations, with up to 10% medical condonation.",
  },
];

export function AgentRoutingPreview({ activeQuery }) {
  const [activeIdx, setActiveIdx] = useState(0);
  const [step, setStep] = useState(0); // 0: Query, 1: Router, 2: Agent Selected, 3: Answer
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Sync with external active query if passed from hero chips
  useEffect(() => {
    if (!activeQuery) return;
    const foundIdx = DEMO_QUERIES.findIndex(
      (q) => q.query.toLowerCase() === activeQuery.toLowerCase()
    );
    if (foundIdx !== -1) {
      setActiveIdx(foundIdx);
      setStep(0);
      setIsAutoPlaying(false);
    }
  }, [activeQuery]);

  // Stepped sequence animation effect
  useEffect(() => {
    let timer;
    if (step < 3) {
      timer = setTimeout(() => {
        setStep((prev) => prev + 1);
      }, 900);
    } else if (isAutoPlaying) {
      timer = setTimeout(() => {
        setActiveIdx((prev) => (prev + 1) % DEMO_QUERIES.length);
        setStep(0);
      }, 3500);
    }
    return () => clearTimeout(timer);
  }, [step, activeIdx, isAutoPlaying]);

  const current = DEMO_QUERIES[activeIdx];

  const agents = [
    {
      id: "tutor",
      name: "Tutor Agent",
      icon: BookOpen,
      color: "#4F46E5",
      bgLight: "#EEF2FF",
      borderColor: "#4F46E5",
    },
    {
      id: "strategist",
      name: "Strategist Agent",
      icon: BarChart3,
      color: "#10B981",
      bgLight: "#ECFDF5",
      borderColor: "#10B981",
    },
    {
      id: "policy",
      name: "Policy Agent",
      icon: Landmark,
      color: "#F59E0B",
      bgLight: "#FFFBEB",
      borderColor: "#F59E0B",
    },
  ];

  const handleSelectQuery = (idx) => {
    setActiveIdx(idx);
    setStep(0);
    setIsAutoPlaying(false);
  };

  return (
    <section id="routing-preview" className="py-12 md:py-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#4F46E5]/10 text-[#4F46E5] text-xs font-semibold uppercase tracking-wider mb-3">
          <Cpu className="w-3.5 h-3.5" /> Dynamic Agent Routing
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-[#1F2937]">
          Watch Intent Detection in Action
        </h2>
        <p className="text-sm sm:text-base text-[#6B7280] mt-1 max-w-xl mx-auto">
          Chimera evaluates every incoming request and dispatches it to the exact domain specialist.
        </p>
      </div>

      {/* Interactive Query Selector Pills */}
      <div className="flex flex-wrap justify-center gap-2 mb-8">
        {DEMO_QUERIES.map((q, idx) => (
          <button
            key={q.query}
            type="button"
            onClick={() => handleSelectQuery(idx)}
            className={`text-xs sm:text-sm px-3.5 py-1.5 rounded-full border transition-all cursor-pointer ${
              activeIdx === idx
                ? "bg-[#1F2937] text-white border-[#1F2937] shadow-xs"
                : "bg-white text-[#6B7280] border-[#E5E7EB] hover:border-[#9CA3AF]"
            }`}
          >
            "{q.query}"
          </button>
        ))}
        {!isAutoPlaying && (
          <button
            type="button"
            onClick={() => setIsAutoPlaying(true)}
            className="text-xs px-2.5 py-1.5 rounded-full bg-[#E5E7EB] text-[#1F2937] hover:bg-[#D1D5DB] transition-colors flex items-center gap-1"
            title="Resume Auto Play"
          >
            <RefreshCw className="w-3 h-3" /> Auto
          </button>
        )}
      </div>

      {/* Routing Flow Visualization Box */}
      <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6 sm:p-8 shadow-sm">
        {/* Step 1: User Query */}
        <div className="flex flex-col items-center">
          <div className="text-xs font-semibold text-[#6B7280] uppercase tracking-wider mb-2">
            1. User Query
          </div>
          <motion.div
            key={`query-${activeIdx}`}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="px-5 py-3 rounded-xl bg-[#F9FAFB] border border-[#E5E7EB] text-[#1F2937] font-medium text-sm sm:text-base shadow-2xs max-w-md text-center"
          >
            "{current.query}"
          </motion.div>
        </div>

        {/* Arrow Down to Router */}
        <div className="flex justify-center my-3">
          <motion.div
            animate={{ opacity: step >= 1 ? 1 : 0.4, scale: step >= 1 ? 1.1 : 1 }}
            className="text-[#4F46E5]"
          >
            <ArrowDown className="w-5 h-5" />
          </motion.div>
        </div>

        {/* Step 2: Master Router */}
        <div className="flex flex-col items-center">
          <motion.div
            animate={{
              borderColor: step >= 1 ? "#4F46E5" : "#E5E7EB",
              backgroundColor: step >= 1 ? "#EEF2FF" : "#F9FAFB",
            }}
            className="px-6 py-2.5 rounded-xl border border-[#E5E7EB] flex items-center gap-2 text-xs sm:text-sm font-semibold text-[#1F2937] shadow-2xs"
          >
            <Cpu className="w-4 h-4 text-[#4F46E5]" />
            <span>ROUTER: Intent Classification</span>
          </motion.div>
        </div>

        {/* Branching Lines / Arrows to Agents */}
        <div className="my-4 relative flex items-center justify-center">
          <div className="w-full max-w-xl grid grid-cols-3 gap-3 sm:gap-6 text-center">
            {agents.map((ag) => {
              const isSelected = step >= 2 && current.targetAgent === ag.id;
              return (
                <div key={ag.id} className="flex flex-col items-center">
                  <div
                    className={`h-6 w-0.5 transition-colors duration-300 ${
                      isSelected ? "bg-[#4F46E5]" : "bg-[#E5E7EB]"
                    }`}
                  />
                </div>
              );
            })}
          </div>
        </div>

        {/* Step 3: Agent Swarm Nodes */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 max-w-3xl mx-auto">
          {agents.map((ag) => {
            const Icon = ag.icon;
            const isSelected = step >= 2 && current.targetAgent === ag.id;

            return (
              <motion.div
                key={ag.id}
                animate={{
                  scale: isSelected ? 1.04 : 0.98,
                  opacity: step >= 2 ? (isSelected ? 1 : 0.45) : 0.7,
                }}
                transition={{ duration: 0.3 }}
                className={`p-4 rounded-xl border transition-all duration-300 flex flex-col items-center text-center ${
                  isSelected
                    ? "bg-white shadow-md border-2"
                    : "bg-[#F9FAFB] border-[#E5E7EB]"
                }`}
                style={{
                  borderColor: isSelected ? ag.color : "#E5E7EB",
                }}
              >
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center mb-2"
                  style={{
                    backgroundColor: isSelected ? ag.color : "#F3F4F6",
                    color: isSelected ? "#FFFFFF" : ag.color,
                  }}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <div className="text-xs sm:text-sm font-bold text-[#1F2937]">
                  {ag.name}
                </div>
                {isSelected && (
                  <motion.span
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="mt-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold text-white"
                    style={{ backgroundColor: ag.color }}
                  >
                    Routed & Active
                  </motion.span>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Arrow Down to Answer */}
        <div className="flex justify-center my-4">
          <motion.div
            animate={{ opacity: step >= 3 ? 1 : 0.3 }}
            className="text-[#4F46E5]"
          >
            <ArrowDown className="w-5 h-5" />
          </motion.div>
        </div>

        {/* Step 4: Grounded Answer Card */}
        <div className="max-w-2xl mx-auto">
          <AnimatePresence mode="wait">
            {step >= 3 ? (
              <motion.div
                key={current.query}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.4 }}
                className="p-5 rounded-xl border border-[#E5E7EB] bg-[#F9FAFB] relative overflow-hidden shadow-2xs"
                style={{
                  borderLeftWidth: "4px",
                  borderLeftColor: current.agentColor,
                }}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle2
                      className="w-4 h-4"
                      style={{ color: current.agentColor }}
                    />
                    <span className="text-xs font-bold text-[#1F2937] uppercase tracking-wide">
                      Grounded Answer ({current.agentName})
                    </span>
                  </div>
                  <span className="text-[11px] text-[#6B7280] bg-white px-2.5 py-0.5 rounded-md border border-[#E5E7EB]">
                    Sources: {current.sources}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-[#1F2937] leading-relaxed">
                  {current.answer}
                </p>
              </motion.div>
            ) : (
              <div className="p-5 rounded-xl border border-dashed border-[#E5E7EB] bg-[#F9FAFB] text-center text-xs text-[#6B7280]">
                Synthesizing response from retrieved domain sources...
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
