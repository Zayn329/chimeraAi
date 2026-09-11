"use client";

import React, { useState } from "react";
import { ChevronDown, Database, Search, FileText, BrainCircuit } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export interface AccordionItem {
  id: string;
  title: string;
  type?: "pinecone" | "ddg" | "rulebook" | "thought";
  details: string;
}

interface BouncyAccordionProps {
  items: AccordionItem[];
}

export function BouncyAccordion103({ items }: BouncyAccordionProps) {
  const [openId, setOpenId] = useState<string | null>(items[0]?.id || null);

  if (!items || items.length === 0) return null;

  const getIcon = (type?: string) => {
    switch (type) {
      case "pinecone":
        return <Database className="w-4 h-4 text-cyan-400" />;
      case "ddg":
        return <Search className="w-4 h-4 text-purple-400" />;
      case "rulebook":
        return <FileText className="w-4 h-4 text-amber-400" />;
      default:
        return <BrainCircuit className="w-4 h-4 text-blue-400" />;
    }
  };

  return (
    <div className="w-full flex flex-col gap-2 my-2">
      {items.map((item) => {
        const isOpen = openId === item.id;
        return (
          <div key={item.id} className="glass-card rounded-xl overflow-hidden border border-zinc-800">
            <button
              onClick={() => setOpenId(isOpen ? null : item.id)}
              className="w-full flex items-center justify-between p-3 text-left text-xs font-medium text-zinc-300 hover:bg-zinc-800/40 transition-colors"
            >
              <div className="flex items-center gap-2">
                {getIcon(item.type)}
                <span>{item.title}</span>
              </div>
              <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ type: "spring", stiffness: 300 }}>
                <ChevronDown className="w-4 h-4 text-zinc-500" />
              </motion.div>
            </button>

            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ type: "spring", stiffness: 250, damping: 22 }}
                  className="overflow-hidden"
                >
                  <div className="p-3 text-xs text-zinc-400 border-t border-zinc-800/50 bg-zinc-900/60 font-mono whitespace-pre-wrap leading-relaxed">
                    {item.details}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
