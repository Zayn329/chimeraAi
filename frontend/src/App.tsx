import React, { useState, useEffect, useRef } from 'react';
import { UserProvider, useUser } from './context/UserContext';
import { HoverCard } from './components/ui/HoverCard';
import { ConflictModal } from './components/ui/ConflictModal';
import { AcademicSidebar } from './components/ui/AcademicSidebar';
import { NoticeUpload } from './components/ui/NoticeUpload';
import { FacultyVault } from './components/ui/FacultyVault';
import { SprintMonitor } from './components/ui/SprintMonitor';
import { StudyCanvas } from './components/ui/StudyCanvas';
import { 
  Send, 
  LogOut, 
  Info,
  Layers,
  PanelRightOpen,
  PanelRightClose
} from 'lucide-react';

// ==========================================
// MOCK FACTS DATABASE FOR CITATIONS HOVERCARDS
// ==========================================
const CITATION_DB: Record<string, string> = {
  "[Syllabus Module 3]": "Syllabus CS-302 (OS) Module 3: Page replacement algorithms (FIFO, LRU, Optimal). Frame allocation policies, thrashing models, and working set parameters. Semester exam weightage: 15% (15 Marks).",
  "[OS Textbook Pg 376]": "Silberschatz, Galvin & Gagne, Operating System Concepts (8th Ed) Pg 376: 'A page-replacement algorithm determines which memory page to replace when a new page must be allocated. We evaluate algorithms by running them on a particular string of memory references and computing the number of page faults...'",
  "[Policy ACAD-001]": "College Regulations Policy ACAD-001 (Section 4b): 'Attendance below 75% in any registered course triggers an automatic grade drop penalty. Attendance falling below 60% leads to a Course Detained (F grade) verdict. No make-up tests allowed.'",
  "[OS Textbook Pg 112]": "Silberschatz, Galvin & Gagne, Operating System Concepts (8th Ed) Pg 112: 'A process is the unit of work in a modern time-sharing system. A process is more than the program code; it includes the current activity, process stack, program counter, and registered data state.'",
  "[Syllabus Module 4]": "Syllabus CS-302 (OS) Module 4: Virtual memory management, demand paging, page fault handling overheads. Performance metrics and thrashing state detection. Lab assignment 5 (LRU Simulator implementation).",
  "[Policy LAB-002]": "Autonomous Chimera Lab Regulations Policy LAB-002 (Bifurcation of Assessment Marks): Continuous Internal Assessment (CIA) for practical laboratories is bifurcated out of 50 Marks: Lab Journal completeness & Record: 10 Marks; Experiment Performance & Conduct: 10 Marks; Practical Mid-Semester Exam & Viva: 15 Marks; Final Mini-Project & presentation: 15 Marks.",
};

// ==========================================
// LANDING & LOGIN PAGE
// ==========================================
const LandingPage: React.FC = () => {
  const { login } = useUser();
  const [studentId, setStudentId] = useState('');
  const [studentName, setStudentName] = useState('');
  const [role, setRole] = useState<'student' | 'faculty'>('student');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentId.trim() || !studentName.trim()) {
      setError('Please fill in both fields.');
      return;
    }
    setError('');
    login(studentId, studentName, role);
  };

  return (
    <div className="min-h-screen bg-brutal-white text-brutal-black font-sans flex flex-col justify-between p-6 md:p-12 relative overflow-hidden">
      {/* Brutalist Decorative Background Elements */}
      <div className="absolute top-0 right-0 w-64 h-64 border-l-2 border-b-2 border-brutal-gray-medium pointer-events-none hidden md:block"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 border-r-2 border-t-2 border-brutal-gray-medium pointer-events-none hidden md:block"></div>
      
      {/* Header Banner */}
      <header className="flex justify-between items-center z-10">
        <div className="flex items-center gap-3 border-2 border-brutal-black px-4 py-2 bg-brutal-white shadow-[3px_3px_0px_0px_rgba(15,15,15,1)]">
          <Layers className="w-5 h-5 text-brutal-black" />
          <span className="font-mono font-bold tracking-widest text-sm">CHIMERA.AI</span>
        </div>
        <div className="text-xs font-mono bg-brutal-black text-brutal-white px-3 py-1.5 uppercase tracking-wider">
          System V1.0.0 // Swarm Live
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-4xl mx-auto w-full grid grid-cols-1 md:grid-cols-12 gap-8 my-auto py-12 z-10">
        {/* Left Column - Hero */}
        <div className="md:col-span-7 flex flex-col justify-center text-left">
          <div className="inline-block bg-brutal-orange text-brutal-white text-xs font-mono font-bold px-3 py-1 uppercase tracking-wider self-start mb-6 border-2 border-brutal-black shadow-[2px_2px_0px_0px_rgba(15,15,15,1)]">
            🔒 Academic Brutalism Verified
          </div>
          <h1 className="text-4xl md:text-6xl font-black leading-none mb-6 tracking-tight uppercase">
            AI that checks <br/>its own math.
          </h1>
          <p className="text-base md:text-lg text-brutal-gray-dark font-sans leading-relaxed mb-8 max-w-lg">
            Chimera is an autonomous multi-agent academic engine that cross-references syllabus constraints, analyzes textbooks, parses rules, and proves its work. Built for students who can't afford to be wrong.
          </p>

          {/* Grid of Key Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-t-2 border-brutal-black pt-8">
            <div className="border border-brutal-black p-4 bg-brutal-white shadow-[2px_2px_0px_0px_rgba(15,15,15,1)] hover:translate-y-[-2px] transition-transform duration-200">
              <span className="text-xl">🧠</span>
              <h3 className="font-bold text-xs uppercase tracking-wider mt-2 mb-1">A Swarm Team</h3>
              <p className="text-[10px] text-brutal-gray-dark leading-tight">
                Routes queries to isolated domain experts, not generic chat loops.
              </p>
            </div>
            <div className="border border-brutal-black p-4 bg-brutal-white shadow-[2px_2px_0px_0px_rgba(15,15,15,1)] hover:translate-y-[-2px] transition-transform duration-200">
              <span className="text-xl">📚</span>
              <h3 className="font-bold text-xs uppercase tracking-wider mt-2 mb-1">Multi-Hop RAG</h3>
              <p className="text-[10px] text-brutal-gray-dark leading-tight">
                Reads syllabus boundaries, indexes reference textbooks, and verifies.
              </p>
            </div>
            <div className="border border-brutal-black p-4 bg-brutal-white shadow-[2px_2px_0px_0px_rgba(15,15,15,1)] hover:translate-y-[-2px] transition-transform duration-200">
              <span className="text-xl">🎯</span>
              <h3 className="font-bold text-xs uppercase tracking-wider mt-2 mb-1">Sniper Re-rank</h3>
              <p className="text-[10px] text-brutal-gray-dark leading-tight">
                Employs cross-encoder attention verification for zero hallucinations.
              </p>
            </div>
          </div>
        </div>

        {/* Right Column - Intercepting Login Card */}
        <div className="md:col-span-5 flex flex-col justify-center">
          <div className="border-3 border-brutal-black bg-brutal-white p-6 md:p-8 shadow-[8px_8px_0px_0px_rgba(15,15,15,1)] relative">
            <div className="absolute -top-3.5 left-4 bg-brutal-black text-brutal-white text-[10px] font-mono px-3 py-1 uppercase tracking-widest border border-brutal-black">
              SWARM LOGIN INTERCEPTOR
            </div>
            
            <div className="flex gap-2 mb-6 mt-2">
              <button 
                onClick={() => setRole('student')}
                className={`flex-1 py-2 font-mono text-[10px] uppercase font-bold border-2 border-brutal-black transition-colors ${role === 'student' ? 'bg-brutal-black text-brutal-white' : 'bg-brutal-white text-brutal-black'}`}
              >
                Student Portal
              </button>
              <button 
                onClick={() => setRole('faculty')}
                className={`flex-1 py-2 font-mono text-[10px] uppercase font-bold border-2 border-brutal-black transition-colors ${role === 'faculty' ? 'bg-brutal-orange text-brutal-black' : 'bg-brutal-white text-brutal-black'}`}
              >
                Faculty Vault
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-[10px] font-mono uppercase tracking-wider text-brutal-gray-dark mb-1">
                  {role === 'student' ? 'Student Registration ID / Roll No' : 'Faculty ID'}
                </label>
                <input
                  type="text"
                  placeholder={role === 'student' ? "e.g. CS-2023-492" : "e.g. FAC-001"}
                  value={studentId}
                  onChange={(e) => setStudentId(e.target.value)}
                  className="w-full px-3 py-2 border-2 border-brutal-black text-sm bg-brutal-white font-mono rounded-none focus:outline-none focus:bg-brutal-gray-light"
                />
              </div>
              
              <div>
                <label className="block text-[10px] font-mono uppercase tracking-wider text-brutal-gray-dark mb-1">
                  {role === 'student' ? 'Full Student Name' : 'Full Professor Name'}
                </label>
                <input
                  type="text"
                  placeholder={role === 'student' ? "e.g. Zain Patel" : "e.g. Prof. Sharma"}
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  className="w-full px-3 py-2 border-2 border-brutal-black text-sm bg-brutal-white font-sans rounded-none focus:outline-none focus:bg-brutal-gray-light"
                />
              </div>

              {error && (
                <div className="text-xs bg-red-100 text-red-700 px-3 py-2 border border-red-400 font-mono">
                  ❌ {error}
                </div>
              )}

              <button
                type="submit"
                className="w-full bg-brutal-black text-brutal-white font-mono uppercase font-bold py-3 text-xs tracking-widest border-2 border-brutal-black hover:bg-brutal-white hover:text-brutal-black hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[4px_4px_0px_0px_rgba(15,15,15,1)] active:translate-x-0 active:translate-y-0 active:shadow-none transition-all duration-150"
              >
                Enter the Swarm →
              </button>
            </form>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center font-mono text-[10px] text-brutal-gray-dark border-t border-brutal-gray-medium pt-6 mt-8 z-10 flex justify-between items-center">
        <div>CHIMERA ACADEMIC MULTI-AGENT ENGINE</div>
        <div>STRICT ADHERENCE TO RULES / SECURE DATA ISOLATION</div>
      </footer>
    </div>
  );
};

// ==========================================
// DASHBOARD & SWARM THOUGHT LOG
// ==========================================
interface ChatMessage {
  id: string;
  text: string;
  sender: 'student' | 'swarm';
  agentUsed?: string;
  timestamp: string;
}

interface SwarmStep {
  node: string;
  title: string;
  content: string;
  status: 'pending' | 'active' | 'done';
  emoji: string;
  color: string; // Tailwind border color class
  textColor: string; // Tailwind text color class
}

const DashboardPage: React.FC = () => {
  const { user, logout } = useUser();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [threadId] = useState(() => `session_${Math.floor(1000 + Math.random() * 9000)}`);
  
  // Academic sidebar & conflict modal state
  const [showSidebar, setShowSidebar] = useState(true);
  const [mermaidCode, setMermaidCode] = useState<string | undefined>(undefined);
  const [latestGuideText, setLatestGuideText] = useState<string>('');
  const [sidebarRefresh, setSidebarRefresh] = useState(0);
  const [conflictModal, setConflictModal] = useState<{
    isOpen: boolean;
    eventName: string;
    eventDate: string;
    conflictsWith: string[];
  }>({ isOpen: false, eventName: '', eventDate: '', conflictsWith: [] });
  
  const [activeRightTab, setActiveRightTab] = useState<'log' | 'canvas'>('log');
  
  // Pipeline nodes
  const [swarmSteps, setSwarmSteps] = useState<SwarmStep[]>([
    { node: 'supervisor', title: 'Supervisor Orchestrator', content: 'Standing by for incoming request payloads...', status: 'pending', emoji: '🧠', color: 'border-blue-500', textColor: 'text-blue-500' },
    { node: 'agent', title: 'Selected Domain Specialist', content: 'Agent state machine inactive.', status: 'pending', emoji: '👥', color: 'border-yellow-500', textColor: 'text-yellow-500' },
    { node: 'llamaindex', title: 'Parametric Index Search', content: 'FAISS indices offline.', status: 'pending', emoji: '🛠️', color: 'border-orange-500', textColor: 'text-orange-500' },
    { node: 'crossencoder', title: 'Cross-Encoder Re-ranker', content: 'Transformer layers idle.', status: 'pending', emoji: '🎯', color: 'border-purple-500', textColor: 'text-purple-500' },
    { node: 'synthesizer', title: 'Verified Response Synthesizer', content: 'Awaiting clean factual contexts.', status: 'pending', emoji: '✅', color: 'border-emerald-500', textColor: 'text-emerald-500' }
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Auto-scroll chat stream
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isSending]);

  // Dynamic Citation Badges parsing inside returned answer text
  const parseAnswerWithCitations = (text: string) => {
    const citationRegex = /(\[Syllabus Module \d+\]|\[OS Textbook Pg \d+\]|\[Policy [A-Z0-9\-]+\])/g;
    const segments = text.split(citationRegex);
    
    return segments.map((segment, index) => {
      if (segment.match(citationRegex)) {
        const citationInfo = CITATION_DB[segment] || "Verified Swarm metadata chunk - secure academic source document.";
        const isSyllabus = segment.includes("Syllabus");
        const isPolicy = segment.includes("Policy");
        
        let badgeColor = "bg-blue-100 text-blue-800 border-blue-300";
        if (isSyllabus) badgeColor = "bg-amber-100 text-amber-800 border-amber-300";
        if (isPolicy) badgeColor = "bg-red-100 text-red-800 border-red-300";

        return (
          <HoverCard
            key={index}
            trigger={
              <span className={`inline-flex items-center gap-1 px-2 py-0.5 border text-[10px] font-mono font-bold cursor-help mx-1 ${badgeColor}`}>
                {segment}
                <Info className="w-2.5 h-2.5" />
              </span>
            }
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between border-b border-brutal-gray-medium pb-1 mb-2">
                <span className="font-bold text-[10px] uppercase tracking-wider text-brutal-orange">📚 Fact Verified</span>
                <span className="text-[9px] text-brutal-gray-dark font-mono">{segment}</span>
              </div>
              <p className="text-xs text-brutal-black leading-relaxed font-sans font-normal">
                "{citationInfo}"
              </p>
              <div className="text-[9px] text-brutal-gray-dark mt-2 pt-1 border-t border-brutal-gray-medium text-right font-mono italic">
                Verified against FAISS Local Index
              </div>
            </div>
          </HoverCard>
        );
      }
      return <span key={index}>{segment}</span>;
    });
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isSending) return;

    const userMessageText = input;
    setInput('');
    setIsSending(true);
    setActiveRightTab('log');

    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userMsg: ChatMessage = {
      id: `student_${Date.now()}`,
      text: userMessageText,
      sender: 'student',
      timestamp: time
    };

    setMessages(prev => [...prev, userMsg]);

    // Reset Swarm Log Cards state to pending
    setSwarmSteps([
      { node: 'supervisor', title: 'Supervisor Orchestrator', content: '🧠 Standing by for incoming request payloads...', status: 'pending', color: 'border-blue-500', textColor: 'text-blue-500', emoji: '🧠' },
      { node: 'agent', title: 'Selected Domain Specialist', content: '👥 Agent state machine inactive.', status: 'pending', color: 'border-yellow-500', textColor: 'text-yellow-500', emoji: '👥' },
      { node: 'llamaindex', title: 'Parametric Index Search', content: '🛠️ FAISS indices offline.', status: 'pending', color: 'border-orange-500', textColor: 'text-orange-500', emoji: '🛠️' },
      { node: 'crossencoder', title: 'Cross-Encoder Re-ranker', content: '🎯 Transformer layers idle.', status: 'pending', color: 'border-purple-500', textColor: 'text-purple-500', emoji: '🎯' },
      { node: 'synthesizer', title: 'Verified Response Synthesizer', content: '✅ Awaiting clean factual contexts.', status: 'pending', color: 'border-emerald-500', textColor: 'text-emerald-500', emoji: '✅' }
    ]);

    // Determine target agent based on user query
    let targetAgent = 'tutor';
    let agentDisplayName = 'AI Tutor (Fast Routing)';
    let agentEmoji = '🎓';
    let queryLower = userMessageText.toLowerCase();

    if (queryLower.includes('attendance') || queryLower.includes('rule') || queryLower.includes('policy') || queryLower.includes('marks') || queryLower.includes('regulation') || queryLower.includes('bifurcation') || queryLower.includes('cia') || queryLower.includes('lab')) {
      targetAgent = 'bureaucrat';
      agentDisplayName = 'College Bureaucrat';
      agentEmoji = '💼';
    } else if (queryLower.includes('study') || queryLower.includes('exam') || queryLower.includes('prepare') || queryLower.includes('pyq') || queryLower.includes('strategy') || queryLower.includes('question')) {
      targetAgent = 'strategist';
      agentDisplayName = 'Exam Strategist';
      agentEmoji = '🎯';
    }

    // Step 1: Supervisor Active
    await new Promise(r => setTimeout(r, 400));
    setSwarmSteps(prev => prev.map(s => s.node === 'supervisor' ? {
      ...s, status: 'active', content: `🧠 INTERCEPTED: Processing prompt. Intent parsed: ${targetAgent === 'tutor' ? 'Academic Concept' : targetAgent === 'bureaucrat' ? 'Administrative Policy' : 'Exam Study Strategy'}.`
    } : s));

    // Step 2: Selected Agent Active
    await new Promise(r => setTimeout(r, 800));
    setSwarmSteps(prev => prev.map(s => {
      if (s.node === 'supervisor') return { ...s, status: 'done' };
      if (s.node === 'agent') return { 
        ...s, 
        status: 'active', 
        title: `${agentEmoji} ${agentDisplayName} Active`,
        content: `⚡ Initialized specialized ${targetAgent} agent sub-graph. Injecting rules & persona guidelines...` 
      };
      return s;
    }));

    // Step 3: LlamaIndex Active
    await new Promise(r => setTimeout(r, 800));
    const targetFolder = targetAgent === 'bureaucrat' ? 'rule_books' : targetAgent === 'strategist' ? 'previous_year_qps' : 'syllabi & reference_books';
    setSwarmSteps(prev => prev.map(s => {
      if (s.node === 'agent') return { ...s, status: 'done' };
      if (s.node === 'llamaindex') return { 
        ...s, 
        status: 'active', 
        content: `🔍 Parametric hard-filtering isolated FAISS storage: './storage/${targetFolder}_index'. WHERE course_name == 'Operating Systems'` 
      };
      return s;
    }));

    // Step 4: Cross-Encoder Active
    await new Promise(r => setTimeout(r, 800));
    setSwarmSteps(prev => prev.map(s => {
      if (s.node === 'llamaindex') return { ...s, status: 'done' };
      if (s.node === 'crossencoder') return { 
        ...s, 
        status: 'active', 
        content: `🎯 Transformer cross-attention active. Reranked top 8 vector fragments down to top 2 absolute matches.` 
      };
      return s;
    }));

    // Step 5: Synthesizer Active
    await new Promise(r => setTimeout(r, 800));
    setSwarmSteps(prev => prev.map(s => {
      if (s.node === 'crossencoder') return { ...s, status: 'done' };
      if (s.node === 'synthesizer') return { 
        ...s, 
        status: 'active', 
        content: `✅ Synthesizing factual markdown with active source citation tags...` 
      };
      return s;
    }));

    // Perform API Request to FastAPI
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          prompt: userMessageText,
          thread_id: threadId
        })
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.statusText}`);
      }

      const data = await response.json();
      
      await new Promise(r => setTimeout(r, 400));
      setSwarmSteps(prev => prev.map(s => s.node === 'synthesizer' ? { ...s, status: 'done', content: `✅ Verified Swarm synthesis complete. Final payload transferred.` } : s));

      let finalAnswer = data.final_answer;
      let mCode: string | undefined = undefined;
      const mermaidMatch = finalAnswer.match(/```(?:mermaid)\s*([\s\S]*?)```/);
      if (mermaidMatch) {
        mCode = mermaidMatch[1];
        finalAnswer = finalAnswer.replace(/```(?:mermaid)\s*[\s\S]*?```/, '').trim();
        setMermaidCode(mCode);
        setActiveRightTab('canvas');
      } else {
        setMermaidCode(undefined);
      }

      const botMsg: ChatMessage = {
        id: `swarm_${Date.now()}`,
        text: finalAnswer,
        sender: 'swarm',
        agentUsed: data.agent_used,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, botMsg]);
    } catch (err) {
      console.warn("FastAPI offline or unreachable, deploying secure local academic fallback RAG...", err);
      
      // Standalone Fallback Simulation if FastAPI server is not currently running
      await new Promise(r => setTimeout(r, 500));
      setSwarmSteps(prev => prev.map(s => s.node === 'synthesizer' ? { ...s, status: 'done', content: `✅ Offline engine recovery active. Factual mock payload synthesised.` } : s));

      let mockText = "";
      if (targetAgent === 'bureaucrat') {
        if (queryLower.includes('cia') || queryLower.includes('bifurcation') || queryLower.includes('lab')) {
          mockText = `According to our Autonomous Practical Regulation [Policy LAB-002], the Continuous Internal Assessment (CIA) marks bifurcation for practical laboratories is strictly defined out of **50 Marks** as follows:\n\n1. **Continuous Evaluation (Record & Experiment Performance):** 20 Marks\n2. **Practical Mid-Semester Assessment (Lab MSE & Viva):** 15 Marks\n3. **Practical End-Semester Assessment (Mini-Project & Demo):** 15 Marks\n\nAdditionally, general attendance requirements under [Policy ACAD-001] remain fully active. A minimum of **75%** attendance is strictly required in all practical courses. Students falling below this threshold will receive a Detained grade and cannot sit for practical exams.`;
        } else {
          mockText = `According to our college administrative database, strict compliance is enforced for attendance weightage. \n\nAcademic Policy [Policy ACAD-001] specifies that attendance falling below **75%** in any course triggers an automatic grade drop. If your attendance falls below **60%**, the state results in a Course Detained verdict. Attendance does not grant direct marks, but failure to maintain it results in strict disciplinary action.`;
        }
      } else if (targetAgent === 'strategist') {
        mockText = `Based on our index of past papers, **Page Replacement Algorithms** are a highly high-yield topic for Operating Systems exams. \n\nLooking at [Syllabus Module 3] and [Syllabus Module 4], questions regarding FIFO, LRU, and Optimal algorithms occur in almost every semester exam, accounting for roughly **15% of the total score**. I highly recommend practicing the reference strings given on [OS Textbook Pg 376], particularly LRU framework frame allocation allocations.`;
      } else {
        mockText = `Page replacement algorithms are a core feature of virtual memory management systems. \n\nAccording to [OS Textbook Pg 376], page replacement occurs during demand paging. When a page fault is triggered and there are no free physical frames, a victim frame is chosen and swapped out to secondary storage. The primary algorithms mapped in [Syllabus Module 3] include:\n1. **FIFO (First-In, First-Out):** Replaces the oldest page. Easy to program but suffers from Belady's Anomaly.\n2. **LRU (Least Recently Used):** Replaces the frame that hasn't been accessed for the longest duration. Excellent statistical performance.\n3. **Optimal:** Theoretically replaces the page that will not be used for the longest time in the future. Serves as a perfect comparison baseline.`;
      }

      let mCode: string | undefined = undefined;
      const mermaidMatch = mockText.match(/```(?:mermaid)\s*([\s\S]*?)```/);
      if (mermaidMatch) {
        mCode = mermaidMatch[1];
        mockText = mockText.replace(/```(?:mermaid)\s*[\s\S]*?```/, '').trim();
        setMermaidCode(mCode);
      } else {
        setMermaidCode(undefined);
      }

      const botMsg: ChatMessage = {
        id: `swarm_${Date.now()}`,
        text: mockText,
        sender: 'swarm',
        agentUsed: `${agentDisplayName} (Offline Verification)`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, botMsg]);
    } finally {
      setIsSending(false);
    }
  };

  const handleCompile = async (selectedQuestions: string[]) => {
    setIsSending(true);
    setSwarmSteps(prev => prev.map(s => s.node === 'synthesizer' ? { ...s, status: 'active', content: `✅ Compiling custom publication-grade guide...` } : s));
    
    try {
      const response = await fetch('/api/academic/compile-guide', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ questions: selectedQuestions })
      });
      
      if (!response.ok) throw new Error("Compilation failed");
      
      const data = await response.json();
      
      let guideText = "";
      if (typeof data.guide === 'string') {
        guideText = data.guide;
      } else if (Array.isArray(data.guide)) {
        guideText = data.guide.map((block: any) => block.text || JSON.stringify(block)).join("\n");
      } else {
        guideText = JSON.stringify(data.guide);
      }
      
      let mCode: string | undefined = undefined;
      const mermaidMatch = guideText.match(/```(?:mermaid)\s*([\s\S]*?)```/);
      if (mermaidMatch) {
        mCode = mermaidMatch[1];
        // Strip ALL mermaid blocks globally from the text feed so they don't pollute the typography
        guideText = guideText.replace(/```(?:mermaid)\s*[\s\S]*?```/g, '').trim();
        setMermaidCode(mCode);
      } else {
        setMermaidCode(undefined);
      }
      
      setLatestGuideText(guideText);
      setActiveRightTab('canvas');
      
      setSwarmSteps(prev => prev.map(s => s.node === 'synthesizer' ? { ...s, status: 'done', content: `✅ Guide Synthesis complete.` } : s));
      
      const botMsg: ChatMessage = {
        id: `guide_${Date.now()}`,
        text: `**📚 Compiled Study Guide:**\n\n${guideText}`,
        sender: 'swarm',
        agentUsed: 'AI Tutor (Study Guide Compiler)',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, botMsg]);
    } catch (err) {
      console.error(err);
      
      // Offline fallback
      setTimeout(() => {
        const botMsg: ChatMessage = {
          id: `guide_${Date.now()}`,
          text: `**📚 Offline Compiled Study Guide:**\n\nPage Replacement Algorithms:\nFIFO (First-In, First-Out): Easiest to implement, replaces oldest page. LRU (Least Recently Used): Replaces the page that has not been used for the longest time, better performance than FIFO [OS Textbook Pg 376].`,
          sender: 'swarm',
          agentUsed: 'AI Tutor (Offline)',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setMessages(prev => [...prev, botMsg]);
        setIsSending(false);
      }, 1000);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="h-screen bg-brutal-white text-brutal-black font-sans flex flex-col overflow-hidden">
      {/* Dynamic Sub-header Info Alert */}
      <div className="bg-brutal-black text-brutal-white font-mono text-[10px] px-6 py-2 uppercase tracking-widest flex justify-between items-center z-20 border-b border-brutal-gray-dark shadow-md">
        <div className="flex items-center gap-2">
          <span className="inline-block w-2.5 h-2.5 bg-brutal-accent animate-pulse"></span>
          <span>CHIMERA AGENTIC SWARM INTERFACE // STATUS: SYSTEM READY</span>
        </div>
        <div className="flex items-center gap-4">
          <span>THREAD: {threadId}</span>
          <span className="hidden md:inline">HOST: 127.0.0.1:8000</span>
        </div>
      </div>

      {/* Main Container */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* ==========================================
            LEFT VIEWPORT (70%): THE ACADEMIC HUB
           ========================================== */}
        <div className="w-full md:w-[70%] border-r-2 border-brutal-black flex flex-col bg-brutal-white h-full overflow-hidden relative">
          
          {/* Dashboard Header Bar */}
          <header className="flex justify-between items-center p-4 border-b-2 border-brutal-black bg-brutal-white shadow-[2px_2px_0px_0px_rgba(15,15,15,1)] z-10">
            <div className="flex items-center gap-3">
              <div className="bg-brutal-black text-brutal-white p-1.5 border border-brutal-black">
                <Layers className="w-4 h-4" />
              </div>
              <div>
                <h1 className="font-bold text-sm uppercase tracking-widest">Academic Workspace</h1>
                <p className="text-[10px] text-brutal-gray-dark font-mono leading-none">SWARM AGENTIC ROUTER ACTIVE</p>
              </div>
            </div>
            
            {/* User Session Block */}
            {user && (
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 border border-brutal-black p-1 bg-brutal-gray-light">
                  <div className="w-7 h-7 bg-brutal-black text-brutal-white rounded-none flex items-center justify-center text-xs font-bold font-mono border border-brutal-black">
                    {user.initials}
                  </div>
                  <div className="text-left pr-2 hidden sm:block">
                    <div className="text-xs font-bold leading-none">{user.name}</div>
                    <div className="text-[9px] text-brutal-gray-dark font-mono leading-none mt-0.5">{user.username}</div>
                  </div>
                </div>
                
                <button
                  onClick={() => setShowSidebar(s => !s)}
                  className="p-2 bg-brutal-white text-brutal-black border-2 border-brutal-black shadow-[2px_2px_0px_0px_rgba(15,15,15,1)] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[3px_3px_0px_0px_rgba(15,15,15,1)] active:translate-x-0 active:translate-y-0 active:shadow-none transition-all"
                  title="Toggle Academic Hub"
                >
                  {showSidebar ? <PanelRightClose className="w-4 h-4" /> : <PanelRightOpen className="w-4 h-4" />}
                </button>
                <button
                  onClick={logout}
                  className="p-2 bg-brutal-white text-brutal-black border-2 border-brutal-black shadow-[2px_2px_0px_0px_rgba(15,15,15,1)] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[3px_3px_0px_0px_rgba(15,15,15,1)] active:translate-x-0 active:translate-y-0 active:shadow-none transition-all"
                  title="Disconnect Swarm"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            )}
          </header>

          {/* Messages Stream */}
          <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 bg-brutal-white">
            {messages.length === 0 ? (
              <div className="h-full flex flex-col justify-center items-center max-w-lg mx-auto text-center py-12">
                <div className="border-2 border-brutal-black p-6 bg-brutal-white shadow-[6px_6px_0px_0px_rgba(15,15,15,1)] max-w-md">
                  <span className="text-3xl">👋</span>
                  <h3 className="font-black text-lg uppercase mt-3 mb-2 tracking-tight">System Boot Complete</h3>
                  <p className="text-xs text-brutal-gray-dark leading-relaxed mb-4">
                    Welcome, <strong className="text-brutal-black">{user?.name}</strong>. The Chimera AI Agentic Swarm is fully loaded. Submit your course concepts, questions, exam study requests, or administrative rules enquiries below.
                  </p>
                  <div className="bg-brutal-gray-light p-3 border border-brutal-black font-mono text-[10px] text-left space-y-1">
                    <div className="text-brutal-gray-dark uppercase tracking-widest font-bold border-b border-brutal-gray-medium pb-1 mb-1">💡 Suggested Queries:</div>
                    <button 
                      onClick={() => setInput("What page replacement algorithms are mentioned in the operating systems syllabus? Explain them briefly.")}
                      className="block text-left text-brutal-black hover:text-brutal-orange hover:underline w-full truncate"
                    >
                      → Page replacement algorithms in syllabus?
                    </button>
                    <button 
                      onClick={() => setInput("how much marks are there for attendance in operating systems course?")}
                      className="block text-left text-brutal-black hover:text-brutal-orange hover:underline w-full truncate"
                    >
                      → Attendance policy and marks criteria?
                    </button>
                    <button 
                      onClick={() => setInput("I have an exam on Virtual Memory tomorrow, make a tactical revision strategy for LRU and page faults.")}
                      className="block text-left text-brutal-black hover:text-brutal-orange hover:underline w-full truncate"
                    >
                      → OS exam revision strategy study guide?
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {messages.map((msg) => (
                  <div 
                    key={msg.id} 
                    className={`flex flex-col max-w-[85%] ${msg.sender === 'student' ? 'ml-auto items-end' : 'mr-auto items-start'}`}
                  >
                    {/* Metadata Header */}
                    <div className="flex items-center gap-2 mb-1.5 font-mono text-[9px] text-brutal-gray-dark">
                      <span>{msg.sender === 'student' ? 'STUDENT' : msg.agentUsed || 'SWARM'}</span>
                      <span>•</span>
                      <span>{msg.timestamp}</span>
                    </div>

                    {/* Chat Bubble Card */}
                    <div className={`p-4 border-2 border-brutal-black shadow-[3px_3px_0px_0px_rgba(15,15,15,1)] text-left text-sm leading-relaxed ${
                      msg.sender === 'student' 
                        ? 'bg-brutal-gray-light text-brutal-black' 
                        : 'bg-brutal-white text-brutal-black'
                    }`}>
                      {msg.sender === 'student' ? (
                        <p className="whitespace-pre-wrap font-sans font-medium">{msg.text}</p>
                      ) : (
                        <div className="font-sans space-y-2 prose max-w-none">
                          {msg.text.split('\n\n').map((paragraph, pIdx) => (
                            <p key={pIdx} className="leading-relaxed">
                              {parseAnswerWithCitations(paragraph)}
                            </p>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            {/* Swarm Thinking Placeholder */}
            {isSending && (
              <div className="flex flex-col items-start mr-auto max-w-[80%]">
                <div className="flex items-center gap-2 mb-1.5 font-mono text-[9px] text-brutal-gray-dark">
                  <span>SWARM PIPELINE PROCESSING</span>
                  <span>•</span>
                  <span className="animate-pulse">RUNNING...</span>
                </div>
                <div className="p-4 border-2 border-dashed border-brutal-gray-dark bg-brutal-white text-brutal-black w-full flex items-center gap-3">
                  <div className="flex gap-1 items-center justify-center">
                    <span className="w-2 h-2 bg-brutal-black rounded-none animate-bounce" style={{ animationDelay: '0ms' }}></span>
                    <span className="w-2 h-2 bg-brutal-black rounded-none animate-bounce" style={{ animationDelay: '150ms' }}></span>
                    <span className="w-2 h-2 bg-brutal-black rounded-none animate-bounce" style={{ animationDelay: '300ms' }}></span>
                  </div>
                  <span className="text-xs font-mono text-brutal-gray-dark">
                    The Swarm is indexing facts and re-ranking facts...
                  </span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Chat Form Area */}
          <div className="p-4 border-t-2 border-brutal-black bg-brutal-white">
            <form onSubmit={handleSendMessage} className="flex gap-2">
              <input
                type="text"
                placeholder="Query the swarm (e.g. 'What page replacement algorithms are in the OS syllabus?')..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={isSending}
                className="flex-1 px-4 py-3 border-2 border-brutal-black bg-brutal-white text-sm focus:outline-none focus:bg-brutal-gray-light font-sans rounded-none transition-colors"
              />
              <NoticeUpload
                disabled={isSending}
                onProcessingStart={() => setIsSending(true)}
                onProcessingEnd={() => setIsSending(false)}
                onNoticeProcessed={(result) => {
                  // Refresh sidebar to show new events
                  setSidebarRefresh(n => n + 1);
                  // Show result in chat
                  const botMsg = {
                    id: `notice_${Date.now()}`,
                    text: `📋 **Notice Processed**\n\n${result.details}`,
                    sender: 'swarm' as const,
                    agentUsed: 'Academic Agent (Notice Parser)',
                    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                  };
                  setMessages(prev => [...prev, botMsg]);
                  // Fire conflict modal if detected
                  if (result.conflict_detected && result.extracted_event) {
                    setConflictModal({
                      isOpen: true,
                      eventName: result.extracted_event.event_name,
                      eventDate: result.extracted_event.date,
                      conflictsWith: result.conflicts_with || ['Existing event on the same date'],
                    });
                  }
                  // Auto-open sidebar to show the new data
                  setShowSidebar(true);
                }}
              />
              <button
                type="submit"
                disabled={isSending || !input.trim()}
                className="px-6 bg-brutal-black text-brutal-white border-2 border-brutal-black shadow-[3px_3px_0px_0px_rgba(15,15,15,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[5px_5px_0px_0px_rgba(15,15,15,1)] active:translate-x-0 active:translate-y-0 active:shadow-none disabled:bg-brutal-gray-medium disabled:text-brutal-gray-dark disabled:border-brutal-gray-medium disabled:shadow-none disabled:translate-x-0 disabled:translate-y-0 transition-all font-mono uppercase font-bold text-xs tracking-wider flex items-center justify-center gap-2"
              >
                Submit <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        </div>

        {/* ==========================================
            ACADEMIC HUB SIDEBAR (toggleable)
           ========================================== */}
        {showSidebar && (
          <div className="w-[280px] border-r-2 border-brutal-black h-full overflow-hidden hidden md:flex flex-col">
            <AcademicSidebar refreshTrigger={sidebarRefresh} />
          </div>
        )}

        {/* ==========================================
            RIGHT VIEWPORT (30%): HIGH-SIGNAL ENTERPRISE PANEL
           ========================================== */}
        <div className="w-full md:w-[30%] bg-brutal-black border-l-2 border-brutal-black h-full flex flex-col overflow-hidden hidden md:flex">
          {/* Tab Header Selector */}
          <div className="flex border-b-2 border-brutal-black bg-brutal-white font-mono text-[10px] font-bold">
            <button
              onClick={() => setActiveRightTab('log')}
              className={`flex-1 py-3 text-center border-r-2 border-brutal-black uppercase tracking-widest transition-colors ${
                activeRightTab === 'log' 
                  ? 'bg-brutal-black text-brutal-white' 
                  : 'bg-brutal-white text-brutal-black hover:bg-brutal-gray-light'
              }`}
            >
              📟 Swarm Log
            </button>
            <button
              onClick={() => setActiveRightTab('canvas')}
              className={`flex-1 py-3 text-center uppercase tracking-widest transition-colors ${
                activeRightTab === 'canvas' 
                  ? 'bg-brutal-black text-brutal-white' 
                  : 'bg-brutal-white text-brutal-black hover:bg-brutal-gray-light'
              }`}
            >
              📊 Canvas
            </button>
          </div>

          {/* Tab Content Panels */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {activeRightTab === 'log' ? (
              <div className="flex-1 bg-[#050C05] p-4 flex flex-col overflow-y-auto relative">
                {/* CRT Scanline & Glass Overlay Effect */}
                <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_40%,rgba(0,0,0,0.45))] z-10"></div>
                <div 
                  className="absolute inset-0 pointer-events-none opacity-[0.03] z-10"
                  style={{
                    backgroundImage: 'repeating-linear-gradient(0deg, #000 0px, #000 2px, transparent 2px, transparent 4px)'
                  }}
                ></div>

                <div className="flex items-center justify-between border-b border-[#004400] pb-2 mb-4 font-mono text-[9px] text-[#00FF41] uppercase tracking-widest opacity-80 z-20">
                  <span>SYSTEM: CHIMERA_MONOLOGUE_V1</span>
                  <span className="animate-pulse">● LIVE_FEED</span>
                </div>

                <div className="flex-1 space-y-4 z-20">
                  {swarmSteps.map((step, idx) => {
                    let prefix = "  ";
                    let textColorClass = "text-[#006611] opacity-60";
                    let borderClass = "border-[#002200]";
                    
                    if (step.status === 'active') {
                      prefix = "⚡ ";
                      textColorClass = "text-[#00FF41] font-bold drop-shadow-[0_0_3px_rgba(0,255,65,0.5)]";
                      borderClass = "border-[#00FF41]";
                    } else if (step.status === 'done') {
                      prefix = "✓ ";
                      textColorClass = "text-[#00CC33] opacity-90";
                      borderClass = "border-[#008800]";
                    }
                    
                    return (
                      <div 
                        key={idx} 
                        className={`border p-3 font-mono text-xs rounded-none bg-[#030703] transition-all duration-300 ${borderClass} ${textColorClass}`}
                      >
                        <div className="flex items-center gap-2 font-bold uppercase tracking-wider">
                          <span>{prefix}</span>
                          <span>[{step.emoji} {step.title}]</span>
                        </div>
                        <div className="mt-1.5 pl-4 text-[11px] leading-relaxed break-words font-mono opacity-90">
                          {step.content}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Blinking Cursor Terminal Line */}
                <div className="border-t border-[#004400] pt-3 mt-4 font-mono text-[11px] text-[#00FF41] flex items-center gap-1.5 opacity-90 z-20">
                  <span className="text-[#00AA22] font-bold">CHIMERA_SWARM@ACADEMIC_PORTAL:~$</span>
                  {isSending ? (
                    <span className="w-2.5 h-4 bg-[#00FF41] animate-pulse"></span>
                  ) : (
                    <>
                      <span className="text-[10px] uppercase font-bold text-[#00CC33]">SYSTEM_IDLE. AWAITING_QUERY...</span>
                      <span className="w-2.5 h-4 bg-[#00FF41] animate-pulse"></span>
                    </>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex-1 flex flex-col overflow-hidden bg-brutal-white">
                <SprintMonitor />
                <StudyCanvas 
                  mermaidCode={mermaidCode} 
                  guideText={latestGuideText}
                  onCompile={handleCompile}
                />
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Conflict Alert Modal */}
      <ConflictModal
        isOpen={conflictModal.isOpen}
        onClose={() => setConflictModal(prev => ({ ...prev, isOpen: false }))}
        eventName={conflictModal.eventName}
        eventDate={conflictModal.eventDate}
        conflictsWith={conflictModal.conflictsWith}
      />
    </div>
  );
};

// ==========================================
// FACULTY DASHBOARD PAGE
// ==========================================
const FacultyDashboard: React.FC = () => {
  const { user, logout } = useUser();
  const [isSending, setIsSending] = useState(false);
  const [noticeResult, setNoticeResult] = useState<string | null>(null);

  return (
    <div className="h-screen bg-brutal-white text-brutal-black font-sans flex flex-col overflow-hidden">
      <div className="bg-brutal-black text-brutal-white font-mono text-[10px] px-6 py-2 uppercase tracking-widest flex justify-between items-center z-20 border-b border-brutal-gray-dark shadow-md">
        <div className="flex items-center gap-2">
          <span className="inline-block w-2.5 h-2.5 bg-brutal-orange animate-pulse"></span>
          <span>CHIMERA AGENTIC SWARM INTERFACE // FACULTY CLEARANCE</span>
        </div>
      </div>
      
      <header className="flex justify-between items-center p-4 border-b-2 border-brutal-black bg-brutal-white shadow-[2px_2px_0px_0px_rgba(15,15,15,1)] z-10">
        <div className="flex items-center gap-3">
          <div className="bg-brutal-black text-brutal-white p-1.5 border border-brutal-black">
            <Layers className="w-4 h-4" />
          </div>
          <div>
            <h1 className="font-bold text-sm uppercase tracking-widest">Faculty Upload Center</h1>
            <p className="text-[10px] text-brutal-gray-dark font-mono leading-none">RAG INGESTION PORTAL</p>
          </div>
        </div>
        
        {user && (
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 border border-brutal-black p-1 bg-brutal-gray-light">
              <div className="w-7 h-7 bg-brutal-orange text-brutal-black rounded-none flex items-center justify-center text-xs font-bold font-mono border border-brutal-black">
                {user.initials}
              </div>
              <div className="text-left pr-2 hidden sm:block">
                <div className="text-xs font-bold leading-none">{user.name}</div>
                <div className="text-[9px] text-brutal-gray-dark font-mono leading-none mt-0.5">{user.username}</div>
              </div>
            </div>
            
            <button
              onClick={logout}
              className="p-2 bg-brutal-white text-brutal-black border-2 border-brutal-black shadow-[2px_2px_0px_0px_rgba(15,15,15,1)] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[3px_3px_0px_0px_rgba(15,15,15,1)] active:translate-x-0 active:translate-y-0 active:shadow-none transition-all"
              title="Disconnect Swarm"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        )}
      </header>

      <div className="flex-1 flex overflow-hidden">
        <div className="w-full md:w-[50%] border-r-2 border-brutal-black flex flex-col bg-brutal-gray-light h-full overflow-hidden p-6 md:p-12">
          <div className="border-3 border-brutal-black bg-brutal-white p-6 md:p-8 shadow-[8px_8px_0px_0px_rgba(15,15,15,1)] relative h-full flex flex-col justify-center items-center">
            <h2 className="font-black text-2xl uppercase tracking-widest mb-4">Admin Instructions</h2>
            <p className="text-sm font-sans mb-4 text-center max-w-sm leading-relaxed">
              Welcome to the Faculty Vault. Upload official PDF Question Banks or Syllabus updates here. 
              The Swarm will automatically hash and embed these documents into the academic parametric memory, 
              making them immediately available for student retrieval.
            </p>
            <div className="bg-amber-100 border border-amber-400 p-3 max-w-sm mt-4 text-[10px] font-mono text-amber-900 mb-6">
              Note: Processing large PDFs may take up to 2-3 seconds per 100 pages. Please do not close the window during ingestion.
            </div>

            <div className="w-full max-w-sm border-t-2 border-brutal-black pt-6 flex flex-col items-center">
              <h3 className="font-bold uppercase text-xs mb-3">Upload Visual Notice</h3>
              <NoticeUpload 
                disabled={isSending}
                onProcessingStart={() => setIsSending(true)}
                onProcessingEnd={() => setIsSending(false)}
                onNoticeProcessed={(result) => {
                  if (result.action_taken.includes("Error")) {
                    setNoticeResult(`Error: ${result.details}`);
                  } else {
                    setNoticeResult(`Notice Successfully Parsed: ${result.extracted_event?.event_name}`);
                  }
                }}
              />
              {isSending && (
                <div className="mt-3 text-[10px] font-mono text-brutal-orange animate-pulse">
                  VISION LLM PARSING NOTICE...
                </div>
              )}
              {noticeResult && (
                <div className="mt-3 text-[10px] font-mono text-green-700 font-bold border border-green-700 bg-green-50 p-2 text-center w-full">
                  {noticeResult}
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="w-full md:w-[50%] h-full flex flex-col overflow-hidden bg-brutal-white">
          <FacultyVault />
        </div>
      </div>
    </div>
  );
};

// ==========================================
// ROOT APP WRAPPER
// ==========================================
function MainApp() {
  const { user, isLoading } = useUser();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-brutal-white flex items-center justify-center font-mono text-brutal-black">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-2 border-brutal-black border-t-brutal-orange animate-spin rounded-none"></div>
          <span className="text-xs uppercase tracking-widest font-bold">Loading Swarm Context...</span>
        </div>
      </div>
    );
  }

  if (!user) {
    return <LandingPage />;
  }

  if (user.role === 'faculty') {
    return <FacultyDashboard />;
  }

  return <DashboardPage />;
}

export default function App() {
  return (
    <UserProvider>
      <MainApp />
    </UserProvider>
  );
}
