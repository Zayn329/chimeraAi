"use client";

import React from "react";
import { motion } from "framer-motion";

interface AppleAIGradientProps {
  isActive: boolean;
  activeAgent?: string;
}

export function AppleAIGradient86({ isActive, activeAgent = "TUTOR" }: AppleAIGradientProps) {
  if (!isActive) return null;

  const getGradientColor = () => {
    switch (activeAgent.toUpperCase()) {
      case "STRATEGIST":
        return "from-purple-500 via-indigo-500 to-pink-500";
      case "BUREAUCRAT":
        return "from-amber-500 via-orange-500 to-yellow-500";
      case "TUTOR":
      default:
        return "from-cyan-500 via-blue-500 to-teal-400";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      className="absolute -inset-0.5 rounded-3xl opacity-75 blur-md bg-gradient-to-r animate-pulse pointer-events-none"
    >
      <div className={`w-full h-full rounded-3xl bg-gradient-to-r ${getGradientColor()}`} />
    </motion.div>
  );
}
