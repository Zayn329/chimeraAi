import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Send, Loader2, RefreshCw, Bot, User, CheckCircle2, ArrowRight } from 'lucide-react';
import AgentPlan from './AgentPlan';

const DEMO_PRESETS = {
  "Important CN topics": {
    query: "Which CN topics are most important for exams?",
    intent: "Exam Preparation",
    agent: "Strategist Agent",
    agentColor: "#10B981",
    planSteps: [
      { label: "Identify exam-preparation intent", status: "completed" },
      { label: "Retrieve Computer Networks syllabus", status: "completed" },
      { label: "Search past papers & weightage analysis", status: "completed" },
      { label: "Analyze frequency of recurring topics", status: "completed" },
      { label: "Generate structured study strategy", status: "active" }
    ],
    response: `Based on the past 5 years of exam papers and syllabus weightage, the key Computer Networks topics are:

• Routing Algorithms (Link-State & Distance-Vector) — ~25% weightage
• Congestion Control & TCP Mechanism — ~20% weightage
• IP Addressing & Subnetting — ~20% weightage
• Error Control & Framing Methods — ~15% weightage

Focus on Distance-Vector vs. Link-State routing algorithms and TCP 3-Way Handshake numericals first for high-yield preparation.`
  },
  "Explain my syllabus": {
    query: "Explain the core concepts in the DBMS syllabus",
    intent: "Concept Explanation",
    agent: "Tutor Agent",
    agentColor: "#4F46E5",
    planSteps: [
      { label: "Identify conceptual inquiry intent", status: "completed" },
      { label: "Retrieve DBMS syllabus reference material", status: "completed" },
      { label: "Query academic vector store", status: "completed" },
      { label: "Synthesize core topic breakdown", status: "completed" },
      { label: "Generate concept explanation", status: "active" }
    ],
    response: `The Database Management Systems (DBMS) syllabus is structured into 4 core modules:

• Relational Data Model & ER Diagrams — Conceptual schema modeling & ER-to-Relational mapping
• SQL & Relational Algebra — Queries, joins, subqueries, and formal query languages
• Normalization (1NF through BCNF) — Functional dependencies & reducing data redundancy
• Transaction Management & Concurrency Control — ACID properties, serializability, and 2PL protocols.`
  },
  "Attendance rules": {
    query: "What are the minimum attendance rules and condonation limits?",
    intent: "Institutional Policy",
    agent: "Policy Agent",
    agentColor: "#F59E0B",
    planSteps: [
      { label: "Identify institutional policy intent", status: "completed" },
      { label: "Access academic handbook & circulars", status: "completed" },
      { label: "Cross-reference attendance regulations", status: "completed" },
      { label: "Verify condonation eligibility criteria", status: "completed" },
      { label: "Format regulatory policy response", status: "active" }
    ],
    response: `According to the Institutional Academic Regulations (Section 4.2):

• Mandatory Minimum Attendance: 75% across all enrolled subjects to be eligible for end-semester exams.
• Medical Condonation: Attendance between 65% and 74% can be condoned on valid medical grounds with official documentation.
• Condonation Fee: Requires Dean approval and prescribed administrative processing fee.
• Below 65%: Strictly ineligible for end-semester exams; subject must be repeated in subsequent semester.`
  }
};

export default function AskChimera() {
  const [inputQuery, setInputQuery] = useState('');
  const [stage, setStage] = useState('idle'); // 'idle' | 'router' | 'plan' | 'response'
  const [currentPreset, setCurrentPreset] = useState(DEMO_PRESETS["Important CN topics"]);
  const [displayedResponse, setDisplayedResponse] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const handleRunDemo = (chipKey) => {
    const preset = DEMO_PRESETS[chipKey] || {
      query: inputQuery || "Which CN topics are most important?",
      intent: "Exam Preparation",
      agent: "Strategist Agent",
      agentColor: "#10B981",
      planSteps: DEMO_PRESETS["Important CN topics"].planSteps,
      response: DEMO_PRESETS["Important CN topics"].response
    };

    setCurrentPreset(preset);
    setInputQuery(preset.query);
    setDisplayedResponse('');
    setStage('router');
  };

  useEffect(() => {
    if (stage === 'router') {
      const timer = setTimeout(() => {
        setStage('plan');
      }, 1200);
      return () => clearTimeout(timer);
    } else if (stage === 'plan') {
      const timer = setTimeout(() => {
        setStage('response');
      }, 1800);
      return () => clearTimeout(timer);
    } else if (stage === 'response') {
      setIsTyping(true);
      let index = 0;
      const fullText = currentPreset.response;
      setDisplayedResponse('');

      const interval = setInterval(() => {
        if (index < fullText.length) {
          setDisplayedResponse((prev) => prev + fullText.charAt(index));
          index++;
        } else {
          setIsTyping(false);
          clearInterval(interval);
        }
      }, 12);

      return () => clearInterval(interval);
    }
  }, [stage, currentPreset]);

  const resetDemo = () => {
    setStage('idle');
    setInputQuery('');
    setDisplayedResponse('');
  };

  return (
    <section id="demo" className="py-20 bg-gray-50/50 border-t border-b border-gray-200/60">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Header */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-semibold uppercase tracking-wider mb-4">
          <Sparkles className="w-3.5 h-3.5" /> INTERACTIVE AI DEMO
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight mb-3">
          Ask Chimera
        </h2>
        <p className="text-gray-600 text-base sm:text-lg max-w-xl mx-auto mb-10">
          «See how a question moves through the system.»
        </p>

        {/* AI Prompt Box Component */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-md p-4 sm:p-6 text-left max-w-3xl mx-auto mb-8">
          <div className="relative flex items-center">
            <Sparkles className="absolute left-3.5 top-3.5 w-5 h-5 text-indigo-500" />
            <input
              type="text"
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              placeholder="Ask Chimera about your academics..."
              disabled={stage !== 'idle'}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && stage === 'idle') {
                  handleRunDemo("Important CN topics");
                }
              }}
              className="w-full pl-11 pr-28 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all disabled:opacity-80"
            />
            {stage === 'idle' ? (
              <button
                onClick={() => handleRunDemo("Important CN topics")}
                className="absolute right-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs sm:text-sm font-medium transition-colors flex items-center gap-1.5 shadow-xs"
              >
                <span>Route Query</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                onClick={resetDemo}
                className="absolute right-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>
            )}
          </div>

          {/* Query Chips */}
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <span className="text-xs text-gray-400 font-medium mr-1">Try asking:</span>
            {Object.keys(DEMO_PRESETS).map((chipKey) => (
              <button
                key={chipKey}
                onClick={() => handleRunDemo(chipKey)}
                disabled={stage !== 'idle'}
                className="text-xs bg-gray-100 hover:bg-gray-200/80 text-gray-700 px-3 py-1.5 rounded-full border border-gray-200 transition-all disabled:opacity-50"
              >
                {chipKey}
              </button>
            ))}
          </div>
        </div>

        {/* Interactive Stages Container */}
        <div className="max-w-3xl mx-auto min-h-[360px] flex flex-col justify-center items-center">
          <AnimatePresence mode="wait">
            {stage === 'idle' && (
              <motion.div
                key="idle"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="p-8 border-2 border-dashed border-gray-200 rounded-2xl w-full text-center text-gray-400 text-sm"
              >
                <Bot className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                Select a query chip or type a question above to trigger the multi-agent routing preview.
              </motion.div>
            )}

            {stage === 'router' && (
              <motion.div
                key="router"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm w-full text-left"
              >
                <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-100">
                  <div className="w-2 h-2 rounded-full bg-indigo-600 animate-ping" />
                  <span className="text-xs font-bold uppercase tracking-widest text-indigo-600">
                    STAGE 1 — ROUTER EVALUATION
                  </span>
                </div>

                <div className="space-y-4">
                  <div className="bg-gray-50 p-3.5 rounded-xl border border-gray-200/70">
                    <span className="text-xs text-gray-400 block font-mono uppercase mb-0.5">
                      CHIMERA ROUTER CLASSIFICATION
                    </span>
                    <span className="text-sm font-semibold text-gray-900">
                      "{currentPreset.query}"
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-3.5 rounded-xl border border-gray-100 bg-white shadow-xs">
                      <span className="text-xs text-gray-500 font-medium block mb-1">
                        Intent Detected:
                      </span>
                      <span className="text-sm font-bold text-gray-900 bg-gray-100 px-2.5 py-1 rounded-md inline-block">
                        {currentPreset.intent}
                      </span>
                    </div>

                    <div className="p-3.5 rounded-xl border border-gray-100 bg-white shadow-xs">
                      <span className="text-xs text-gray-500 font-medium block mb-1">
                        Selected Specialist:
                      </span>
                      <span
                        className="text-sm font-bold px-2.5 py-1 rounded-md inline-flex items-center gap-1.5"
                        style={{
                          backgroundColor: `${currentPreset.agentColor}15`,
                          color: currentPreset.agentColor
                        }}
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        {currentPreset.agent}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-center gap-2 text-xs text-indigo-600 pt-2 font-medium">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Handing context off to {currentPreset.agent}...
                  </div>
                </div>
              </motion.div>
            )}

            {stage === 'plan' && (
              <motion.div
                key="plan"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className="w-full flex flex-col items-center"
              >
                <div className="w-full text-left mb-2">
                  <span className="text-xs font-bold uppercase tracking-widest text-emerald-600">
                    STAGE 2 — AGENT EXECUTION PLAN
                  </span>
                </div>
                <AgentPlan
                  agentName={currentPreset.agent}
                  agentColor={currentPreset.agentColor}
                  steps={currentPreset.planSteps}
                />
              </motion.div>
            )}

            {stage === 'response' && (
              <motion.div
                key="response"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className="bg-white border border-gray-200 rounded-2xl p-6 shadow-md w-full text-left font-sans"
              >
                <div className="flex items-center justify-between pb-3 mb-4 border-b border-gray-100">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-7 h-7 rounded-lg text-white flex items-center justify-center text-xs font-bold shadow-xs"
                      style={{ backgroundColor: currentPreset.agentColor }}
                    >
                      C
                    </div>
                    <div>
                      <span className="text-xs font-bold text-gray-900 block leading-none">
                        CHIMERA AI
                      </span>
                      <span className="text-[10px] text-gray-400 font-medium">
                        {currentPreset.agent} Grounded Answer
                      </span>
                    </div>
                  </div>
                  {isTyping && (
                    <span className="inline-flex items-center gap-1.5 text-xs text-indigo-600 font-medium bg-indigo-50 px-2.5 py-1 rounded-full">
                      <Loader2 className="w-3 h-3 animate-spin" />
                      Streaming response...
                    </span>
                  )}
                </div>

                <div className="prose prose-sm text-gray-800 leading-relaxed font-sans whitespace-pre-wrap">
                  {displayedResponse}
                  {isTyping && <span className="inline-block w-1.5 h-4 ml-1 bg-indigo-600 animate-pulse align-middle" />}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
