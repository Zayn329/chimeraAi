import React from 'react';
import { motion } from 'framer-motion';
import { User, Cpu, BookOpen, BarChart3, Landmark, Database, Search, Zap, CheckCircle, ArrowDown } from 'lucide-react';

export default function ArchitecturePreview({ onNavigateToDocs }) {
  const scrollToTopOrDocs = (e) => {
    e.preventDefault();
    if (onNavigateToDocs) {
      onNavigateToDocs();
    } else {
      const docsEl = document.getElementById('docs') || document.getElementById('architecture');
      if (docsEl) {
        docsEl.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <section id="architecture" className="py-20 bg-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-semibold uppercase tracking-wider mb-4">
          <Cpu className="w-3.5 h-3.5" /> SYSTEM ARCHITECTURE
        </div>

        {/* Heading */}
        <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight mb-4">
          A Modular AI Architecture
        </h2>
        <p className="text-gray-600 text-base sm:text-lg max-w-2xl mx-auto mb-14">
          A multi-agent system designed for deterministic query classification, grounded knowledge retrieval, and fault-tolerant execution.
        </p>

        {/* Visual Workflow Diagram */}
        <div className="bg-gray-50/70 border border-gray-200 rounded-2xl p-6 sm:p-10 shadow-xs max-w-4xl mx-auto">
          {/* Node 1: User */}
          <div className="flex flex-col items-center">
            <div className="bg-white border border-gray-200 px-5 py-3 rounded-xl shadow-xs flex items-center gap-2.5">
              <User className="w-4 h-4 text-gray-600" />
              <span className="text-sm font-bold text-gray-900">USER</span>
            </div>
            <ArrowDown className="w-4 h-4 text-gray-400 my-3" />
          </div>

          {/* Node 2: Router */}
          <div className="flex flex-col items-center">
            <div className="bg-white border border-indigo-200 px-6 py-3.5 rounded-xl shadow-xs flex items-center gap-2.5 ring-2 ring-indigo-500/10">
              <Cpu className="w-4 h-4 text-indigo-600" />
              <span className="text-sm font-bold text-indigo-900">ROUTER</span>
            </div>
            <ArrowDown className="w-4 h-4 text-indigo-300 my-3" />
          </div>

          {/* Node 3: Agent Swarm Branch */}
          <div className="my-2">
            <div className="text-xs font-mono uppercase text-gray-400 tracking-wider mb-3">
              SPECIALIZED AGENT SWARM
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 max-w-3xl mx-auto">
              {/* Tutor Agent */}
              <div className="bg-white border border-gray-200 p-4 rounded-xl shadow-xs flex flex-col items-center text-center">
                <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center mb-2">
                  <BookOpen className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold text-gray-900 mb-0.5">Tutor Agent</span>
                <span className="text-[11px] text-gray-500 font-mono">Concept & Syllabus</span>
              </div>

              {/* Strategist Agent */}
              <div className="bg-white border border-gray-200 p-4 rounded-xl shadow-xs flex flex-col items-center text-center">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center mb-2">
                  <BarChart3 className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold text-gray-900 mb-0.5">Strategist Agent</span>
                <span className="text-[11px] text-gray-500 font-mono">Exams & Papers</span>
              </div>

              {/* Policy Agent */}
              <div className="bg-white border border-gray-200 p-4 rounded-xl shadow-xs flex flex-col items-center text-center">
                <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center mb-2">
                  <Landmark className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold text-gray-900 mb-0.5">Policy Agent</span>
                <span className="text-[11px] text-gray-500 font-mono">Rules & Regulations</span>
              </div>
            </div>
            <ArrowDown className="w-4 h-4 text-gray-400 my-4 mx-auto" />
          </div>

          {/* Node 4: Knowledge Layer */}
          <div className="my-2 bg-white border border-gray-200 p-5 rounded-2xl shadow-xs max-w-3xl mx-auto">
            <div className="text-xs font-mono uppercase text-gray-400 tracking-wider mb-3 text-center">
              KNOWLEDGE LAYER
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-left">
              <div className="p-3 bg-gray-50 rounded-xl border border-gray-100 flex items-center gap-2.5">
                <Database className="w-4 h-4 text-indigo-600 shrink-0" />
                <div>
                  <span className="text-xs font-bold text-gray-800 block">Vector Search</span>
                  <span className="text-[10px] text-gray-500">Syllabus & Course material</span>
                </div>
              </div>

              <div className="p-3 bg-gray-50 rounded-xl border border-gray-100 flex items-center gap-2.5">
                <Zap className="w-4 h-4 text-amber-500 shrink-0" />
                <div>
                  <span className="text-xs font-bold text-gray-800 block">Semantic Cache</span>
                  <span className="text-[10px] text-gray-500">Fast repeated query match</span>
                </div>
              </div>

              <div className="p-3 bg-gray-50 rounded-xl border border-gray-100 flex items-center gap-2.5">
                <Search className="w-4 h-4 text-emerald-600 shrink-0" />
                <div>
                  <span className="text-xs font-bold text-gray-800 block">Web Search</span>
                  <span className="text-[10px] text-gray-500">External fallback knowledge</span>
                </div>
              </div>
            </div>
          </div>

          <ArrowDown className="w-4 h-4 text-gray-400 my-4 mx-auto" />

          {/* Node 5: Response */}
          <div className="flex flex-col items-center">
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-900 px-6 py-3 rounded-xl shadow-xs flex items-center gap-2.5 font-bold text-sm">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              <span>GROUNDED RESPONSE</span>
            </div>
          </div>
        </div>

        {/* CTA Link */}
        <div className="mt-8">
          <a
            href="#docs"
            onClick={scrollToTopOrDocs}
            className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-700 font-semibold text-sm hover:underline transition-all"
          >
            <span>View Full Architecture</span>
            <span className="text-lg">→</span>
          </a>
        </div>
      </div>
    </section>
  );
}
