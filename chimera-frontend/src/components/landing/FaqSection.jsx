import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

const faqs = [
  {
    question: "What is Chimera AI?",
    answer: "Chimera AI is a multi-agent academic assistant designed to answer course, exam, and administrative queries. It uses an intent-based router to dispatch questions to domain-specialized agents (Tutor, Strategist, and Policy)."
  },
  {
    question: "How does Chimera select an agent?",
    answer: "When a user submits a query, the intent router evaluates natural language context, keywords, and academic intent to route the query directly to either the Tutor Agent (concepts), Strategist Agent (exams), or Policy Agent (regulations)."
  },
  {
    question: "What knowledge sources can Chimera use?",
    answer: "Chimera grounds answers in official syllabus documents, reference materials, historical past papers, and institutional rulebooks. It also incorporates semantic caching for instant lookups and web search as a fallback."
  },
  {
    question: "Can Chimera answer institute-specific questions?",
    answer: "Yes. Chimera's Policy and Tutor agents are explicitly designed to ingest and index institution-specific circulars, grading criteria, attendance rules, and course syllabi for precise grounded retrieval."
  },
  {
    question: "What happens if the required information isn't available?",
    answer: "If local vector indexes do not yield sufficient confidence, Chimera gracefully routes the query to its external web search fallback or flags that institutional confirmation is required, preventing AI hallucination."
  },
  {
    question: "Is Chimera a single AI model?",
    answer: "No. Chimera is a modular multi-agent orchestration architecture built with FastAPI and LangGraph in the backend, orchestrating specialized sub-graphs and tools for deterministic execution."
  }
];

export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState(0);

  const toggleAccordion = (index) => {
    setOpenIndex(openIndex === index ? -1 : index);
  };

  return (
    <section className="py-20 px-4 max-w-4xl mx-auto bg-[#F9FAFB]" id="faq">
      <div className="text-center max-w-2xl mx-auto mb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-indigo-50 text-[#4F46E5] border border-indigo-100 mb-4">
          FREQUENTLY ASKED QUESTIONS
        </div>
        <h2 className="text-3xl sm:text-4xl font-bold text-[#1F2937] tracking-tight">
          Everything You Need to Know
        </h2>
        <p className="mt-4 text-base text-[#6B7280]">
          Clear answers about Chimera AI's architecture, agent routing, and academic capabilities.
        </p>
      </div>

      <div className="space-y-4">
        {faqs.map((faq, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div
              key={faq.question}
              className="bg-white rounded-xl border border-[#E5E7EB] shadow-sm overflow-hidden transition-all"
            >
              <button
                type="button"
                onClick={() => toggleAccordion(idx)}
                aria-expanded={isOpen}
                className="w-full px-6 py-5 flex items-center justify-between text-left focus:outline-none focus:ring-2 focus:ring-[#4F46E5] focus:ring-offset-2 rounded-xl"
              >
                <span className="text-base font-semibold text-[#1F2937]">
                  {faq.question}
                </span>
                <ChevronDown
                  className={`w-5 h-5 text-[#6B7280] transition-transform duration-200 ${
                    isOpen ? 'rotate-180 text-[#4F46E5]' : ''
                  }`}
                />
              </button>

              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    key="content"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25, ease: 'easeInOut' }}
                  >
                    <div className="px-6 pb-5 pt-1 text-sm text-[#6B7280] leading-relaxed border-t border-[#E5E7EB]/50">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </section>
  );
}
