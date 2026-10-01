import React, { useState } from "react";
import { HeaderNav } from "@/components/HeaderNav";
import { SpotlightCard } from "@/components/ui/spotlight-card";
import {
  Activity,
  Play,
  Cpu,
  Bot,
  BrainCircuit,
  BookOpen,
  Shield,
  Database,
  CheckCircle2,
  Zap,
  ArrowRight,
  Sparkles,
  Terminal,
} from "lucide-react";

export function TelemetryPage() {
  const [testPrompt, setTestPrompt] = useState("Explain Page Replacement Algorithms and KT attendance policy");
  const [isSimulating, setIsSimulating] = useState(false);
  const [activeStep, setActiveStep] = useState(0); // 0: Idle, 1: Supervisor, 2: Agent Selected, 3: Tool Execution, 4: Stream Output
  const [chosenAgent, setChosenAgent] = useState("TUTOR"); // TUTOR | BUREAUCRAT | STRATEGIST
  const [eventLogs, setEventLogs] = useState([
    { time: "00:00.00", type: "system", message: "Telemetry Engine initialized. Ready to record real-time SSE telemetry." },
  ]);

  const addLog = (type, message) => {
    const time = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });
    setEventLogs((prev) => [{ time, type, message }, ...prev.slice(0, 40)]);
  };

  const handleSimulateFlow = async () => {
    if (isSimulating) return;

    setIsSimulating(true);
    setActiveStep(1);
    setEventLogs([]);

    addLog("input", `Query Ingress: "${testPrompt}"`);
    addLog("event", "on_node_start: [Supervisor Router] evaluating query intent...");

    // Determine chosen agent based on prompt keywords
    let agent = "TUTOR";
    if (testPrompt.toLowerCase().includes("rule") || testPrompt.toLowerCase().includes("kt") || testPrompt.toLowerCase().includes("attendance")) {
      agent = "BUREAUCRAT";
    } else if (testPrompt.toLowerCase().includes("prep") || testPrompt.toLowerCase().includes("pyq") || testPrompt.toLowerCase().includes("exam")) {
      agent = "STRATEGIST";
    }
    setChosenAgent(agent);

    await new Promise((r) => setTimeout(r, 1200));
    setActiveStep(2);
    addLog("routing", `Router Decision: Redirecting execution context to node [${agent}_WORKER]`);

    await new Promise((r) => setTimeout(r, 1400));
    setActiveStep(3);
    addLog("tool", `on_tool_start: Connecting to Pinecone/Rulebook vector index via search_tools()`);

    await new Promise((r) => setTimeout(r, 1500));
    setActiveStep(4);
    addLog("stream", "on_chat_model_stream: Emitting tokens over SSE response pipeline...");

    await new Promise((r) => setTimeout(r, 1800));
    addLog("complete", "Execution complete. Synthesized response delivered & cached in semantic_cache.");
    setIsSimulating(false);
  };

  const getAgentInfo = (agentKey) => {
    switch (agentKey) {
      case "BUREAUCRAT":
        return {
          title: "Policy / Bureaucrat Agent",
          desc: "University administrative rules, attendance & KT regulations",
          color: "border-amber-500 bg-amber-50/50 text-amber-900",
          icon: Shield,
        };
      case "STRATEGIST":
        return {
          title: "Exam Strategist Agent",
          desc: "Exam preparation strategies, study plans & past papers",
          color: "border-indigo-500 bg-indigo-50/50 text-indigo-900",
          icon: BrainCircuit,
        };
      default:
        return {
          title: "Syllabus Tutor Agent",
          desc: "Explains engineering course concepts & syllabus topics",
          color: "border-emerald-500 bg-emerald-50/50 text-emerald-900",
          icon: BookOpen,
        };
    }
  };

  const activeAgentInfo = getAgentInfo(chosenAgent);
  const AgentIcon = activeAgentInfo.icon;

  return (
    <div className="min-h-screen bg-[#F9FAFB] text-[#1F2937] flex flex-col font-sans">
      <HeaderNav />

      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-200 pb-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-[#4F46E5] text-xs font-semibold mb-2">
              <Activity className="w-3.5 h-3.5 animate-pulse" />
              Live SSE Telemetry Visualizer
            </div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-[#1F2937]">
              Real-Time Swarm Data Flow & Agent Router
            </h1>
            <p className="text-sm text-[#6B7280] mt-1">
              Interactive dynamic diagram showing real-time query routing, agent decision nodes, tool calls, and streaming output.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleSimulateFlow}
              disabled={isSimulating}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#4F46E5] hover:bg-[#4338CA] text-white text-xs font-semibold shadow-md shadow-indigo-500/20 transition-all disabled:opacity-50 cursor-pointer"
            >
              <Play className="w-4 h-4 fill-current" />
              {isSimulating ? "Simulating SSE Pipeline..." : "Trigger Live Swarm Trace"}
            </button>
          </div>
        </div>

        {/* Input prompt query simulator bar */}
        <div className="p-4 bg-white border border-gray-200/80 rounded-2xl shadow-xs flex items-center gap-3">
          <Terminal className="w-5 h-5 text-gray-400 shrink-0" />
          <input
            type="text"
            value={testPrompt}
            onChange={(e) => setTestPrompt(e.target.value)}
            placeholder="Type query to test routing path..."
            className="flex-1 text-sm bg-transparent border-none focus:outline-none text-gray-900"
          />
          <button
            onClick={handleSimulateFlow}
            disabled={isSimulating}
            className="px-3 py-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-xs font-semibold text-gray-700 transition-colors"
          >
            Trace Prompt
          </button>
        </div>

        {/* Dynamic Diagram Node Graph */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 relative">
          {/* Node 1: User Prompt Input */}
          <SpotlightCard
            className={`p-5 rounded-2xl border transition-all ${
              activeStep >= 1
                ? "border-[#4F46E5] bg-indigo-50/40 ring-2 ring-[#4F46E5]/20 shadow-md"
                : "border-gray-200 bg-white"
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                Step 1: Ingress
              </span>
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-500"></span>
            </div>
            <div className="flex items-center gap-2.5 mb-2">
              <div className="w-8 h-8 rounded-lg bg-indigo-100 text-[#4F46E5] flex items-center justify-center font-bold">
                Q
              </div>
              <h3 className="text-sm font-bold text-gray-900">User Query Input</h3>
            </div>
            <p className="text-xs text-gray-600 line-clamp-2 italic">
              "{testPrompt}"
            </p>
          </SpotlightCard>

          {/* Node 2: Supervisor Intent Router */}
          <SpotlightCard
            className={`p-5 rounded-2xl border transition-all ${
              activeStep >= 1
                ? activeStep === 1
                  ? "border-[#4F46E5] bg-indigo-50/80 ring-4 ring-[#4F46E5]/30 shadow-lg animate-pulse"
                  : "border-[#4F46E5] bg-indigo-50/30"
                : "border-gray-200 bg-white opacity-70"
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                Step 2: Router
              </span>
              <Bot className="w-4 h-4 text-[#4F46E5]" />
            </div>
            <div className="flex items-center gap-2.5 mb-2">
              <div className="w-8 h-8 rounded-lg bg-[#4F46E5] text-white flex items-center justify-center font-bold">
                <BrainCircuit className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-gray-900">Supervisor Router</h3>
            </div>
            <p className="text-xs text-gray-600">
              Evaluates prompt intent against structured schema to assign target node.
            </p>
          </SpotlightCard>

          {/* Node 3: Specialized Agent Node */}
          <SpotlightCard
            className={`p-5 rounded-2xl border transition-all ${
              activeStep >= 2
                ? activeStep === 2
                  ? `${activeAgentInfo.color} ring-4 ring-indigo-500/30 shadow-lg animate-pulse`
                  : `${activeAgentInfo.color}`
                : "border-gray-200 bg-white opacity-70"
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                Step 3: Chosen Agent
              </span>
              <AgentIcon className="w-4 h-4 text-indigo-600" />
            </div>
            <div className="flex items-center gap-2.5 mb-2">
              <div className="w-8 h-8 rounded-lg bg-gray-900 text-white flex items-center justify-center font-bold">
                <AgentIcon className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-gray-900">{activeAgentInfo.title}</h3>
            </div>
            <p className="text-xs text-gray-600">{activeAgentInfo.desc}</p>
          </SpotlightCard>

          {/* Node 4: Tools & Pinecone Vector DB */}
          <SpotlightCard
            className={`p-5 rounded-2xl border transition-all ${
              activeStep >= 3
                ? activeStep === 3
                  ? "border-emerald-500 bg-emerald-50/80 ring-4 ring-emerald-500/30 shadow-lg animate-pulse"
                  : "border-emerald-500 bg-emerald-50/30"
                : "border-gray-200 bg-white opacity-70"
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                Step 4: Vector Tools
              </span>
              <Database className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="flex items-center gap-2.5 mb-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold">
                <Cpu className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-gray-900">Pinecone & Local DB</h3>
            </div>
            <p className="text-xs text-gray-600">
              `search_syllabus`, `search_rulebook`, `search_pyqs` tool calls.
            </p>
          </SpotlightCard>
        </div>

        {/* Live Event Stream Terminal Console */}
        <div className="bg-gray-950 text-gray-100 rounded-2xl border border-gray-800 p-6 font-mono text-xs shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-gray-800 pb-3">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-red-500 inline-block"></span>
              <span className="w-3 h-3 rounded-full bg-yellow-500 inline-block"></span>
              <span className="w-3 h-3 rounded-full bg-green-500 inline-block"></span>
              <span className="text-gray-400 font-semibold ml-2">SSE Server Telemetry Stream</span>
            </div>
            <span className="text-[10px] text-gray-500">
              Protocol: EventStream (`data: JSON`)
            </span>
          </div>

          <div className="h-48 overflow-y-auto space-y-2 pr-2">
            {eventLogs.map((log, i) => (
              <div key={i} className="flex gap-3 leading-relaxed">
                <span className="text-gray-500 select-none">[{log.time}]</span>
                <span
                  className={
                    log.type === "input"
                      ? "text-cyan-400 font-bold"
                      : log.type === "routing"
                      ? "text-amber-400 font-bold"
                      : log.type === "tool"
                      ? "text-emerald-400 font-bold"
                      : log.type === "stream"
                      ? "text-indigo-400 font-bold"
                      : log.type === "complete"
                      ? "text-green-400 font-bold"
                      : "text-gray-400"
                  }
                >
                  {log.message}
                </span>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
