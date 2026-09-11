"use client";

import React from "react";
import { GraduationCap, Target, ShieldCheck, ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";

interface GradientHoverCardsProps {
  onSelectPrompt: (prompt: string, course: string) => void;
}

const CARDS = [
  {
    icon: <GraduationCap className="w-5 h-5 text-cyan-400" />,
    title: "Course Concept Tutor",
    description: "Explain Dijkstra's Algorithm step-by-step with complexity proof.",
    prompt: "Explain Dijkstra's shortest path algorithm step-by-step with time complexity.",
    course: "Analysis of Algorithms",
    borderGlow: "group-hover:border-cyan-500/50 group-hover:shadow-cyan-500/20",
  },
  {
    icon: <Target className="w-5 h-5 text-purple-400" />,
    title: "Exam Strategy & PYQs",
    description: "Analyze past paper question patterns for Operating Systems MSE.",
    prompt: "What are the most frequent 10-mark questions asked in Operating Systems past papers?",
    course: "Operating Systems",
    borderGlow: "group-hover:border-purple-500/50 group-hover:shadow-purple-500/20",
  },
  {
    icon: <ShieldCheck className="w-5 h-5 text-amber-400" />,
    title: "University KT & Attendance Rules",
    description: "What are the attendance threshold rules and KT eligibility criteria?",
    prompt: "What is the minimum attendance required to appear for end-sem exams under KT policy?",
    course: "All Courses",
    borderGlow: "group-hover:border-amber-500/50 group-hover:shadow-amber-500/20",
  },
];

export function GradientHoverCards90({ onSelectPrompt }: GradientHoverCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 w-full max-w-4xl mx-auto my-4">
      {CARDS.map((card, idx) => (
        <motion.button
          key={idx}
          whileHover={{ y: -3, scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onSelectPrompt(card.prompt, card.course)}
          className={`group relative glass-panel rounded-2xl p-4 text-left transition-all duration-300 border border-zinc-800 hover:shadow-xl ${card.borderGlow}`}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="p-2 rounded-xl bg-zinc-900 border border-zinc-800">
              {card.icon}
            </div>
            <ArrowUpRight className="w-4 h-4 text-zinc-600 group-hover:text-zinc-200 transition-colors" />
          </div>
          <h3 className="text-sm font-semibold text-zinc-100 group-hover:text-white mb-1">
            {card.title}
          </h3>
          <p className="text-xs text-zinc-400 group-hover:text-zinc-300 leading-relaxed">
            {card.description}
          </p>
        </motion.button>
      ))}
    </div>
  );
}
