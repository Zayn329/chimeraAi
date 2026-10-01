import React, { useState, useRef, useEffect } from "react";
import { HeaderNav } from "@/components/HeaderNav";
import {
  Send,
  Bot,
  User,
  Plus,
  Trash2,
  Sparkles,
  FileText,
  Clock,
  Check,
  Copy,
  ChevronRight,
  Shield,
  BookOpen,
  BrainCircuit,
  Activity,
  Zap,
} from "lucide-react";

export function ChatPage() {
  const [messages, setMessages] = useState([
    {
      id: "msg_welcome",
      role: "assistant",
      content:
        "Hello! I am **Chimera Swarm**, your multi-agent university intelligence system. Ask me anything regarding syllabus technical concepts, university rules/KT policy, or exam preparation strategy!",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      node: "supervisor",
    },
  ]);
  const [inputPrompt, setInputPrompt] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [currentStatus, setCurrentStatus] = useState("");
  const [activeNode, setActiveNode] = useState("supervisor");
  const [threadId, setThreadId] = useState(() => `thread_${Math.floor(Math.random() * 10000)}`);
  const [documentId, setDocumentId] = useState("");
  const [threads, setThreads] = useState([
    { id: threadId, title: "New Conversation", date: "Just now" },
  ]);
  const [copiedId, setCopiedId] = useState(null);

  const chatEndRef = useRef(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, currentStatus]);

  const samplePrompts = [
    "Explain Page Replacement Algorithms from OS Syllabus",
    "What is the KT attendance rule and grace marks policy?",
    "Give me an exam prep strategy and PYQs for Operating Systems",
  ];

  const handleNewThread = () => {
    const newId = `thread_${Math.floor(Math.random() * 10000)}`;
    setThreadId(newId);
    setThreads((prev) => [{ id: newId, title: "New Conversation", date: "Just now" }, ...prev]);
    setMessages([
      {
        id: `msg_welcome_${newId}`,
        role: "assistant",
        content:
          "New thread initialized. How can the Chimera Agent Swarm assist your academic query today?",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        node: "supervisor",
      },
    ]);
  };

  const handleSendMessage = async (customPrompt) => {
    const promptToSend = customPrompt || inputPrompt;
    if (!promptToSend.trim() || isStreaming) return;

    const userMessage = {
      id: `usr_${Date.now()}`,
      role: "user",
      content: promptToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputPrompt("");
    setIsStreaming(true);
    setCurrentStatus("Initializing LangGraph Swarm Intent Router...");
    setActiveNode("supervisor");

    // Update thread title if first prompt
    setThreads((prev) =>
      prev.map((t) =>
        t.id === threadId && t.title === "New Conversation"
          ? { ...t, title: promptToSend.slice(0, 26) + "..." }
          : t
      )
    );

    const assistantMessageId = `ast_${Date.now()}`;
    const initialAssistantMsg = {
      id: assistantMessageId,
      role: "assistant",
      content: "",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      node: "supervisor",
    };

    setMessages((prev) => [...prev, initialAssistantMsg]);

    try {
      // Determine gateway URL or fallback to FastAPI server
      const backendUrl = "http://localhost:8000/api/chat/stream";

      const response = await fetch(backendUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: promptToSend,
          thread_id: threadId,
          document_id: documentId || null,
        }),
      });

      if (!response.ok) {
        throw new Error(`Server returned HTTP ${response.status}`);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            try {
              const jsonStr = line.replace(/^data:\s*/, "");
              const event = JSON.parse(jsonStr);

              if (event.type === "status") {
                setCurrentStatus(event.content);
                if (event.content.includes("tutor")) setActiveNode("tutor");
                else if (event.content.includes("bureaucrat") || event.content.includes("policy")) setActiveNode("bureaucrat");
                else if (event.content.includes("strategist")) setActiveNode("strategist");
              } else if (event.type === "token") {
                setMessages((prev) =>
                  prev.map((msg) =>
                    msg.id === assistantMessageId
                      ? { ...msg, content: msg.content + event.content, node: activeNode }
                      : msg
                  )
                );
              }
            } catch (err) {
              console.error("SSE parse error", err);
            }
          }
        }
      }
    } catch (error) {
      console.warn("Backend stream fallback simulation engaged:", error);
      // Friendly fallback mode if local backend server is offline during dev mode
      const mockResponse = `[Swarm Response via Local Engine]\n\nBased on the query "${promptToSend}":\n• The **Syllabus / Rulebook** specifies required coursework criteria.\n• Ensure you review the official university guidelines or uploaded document context.`;

      let currentLen = 0;
      const interval = setInterval(() => {
        currentLen += 4;
        const chunk = mockResponse.slice(0, currentLen);
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === assistantMessageId
              ? { ...msg, content: chunk, node: "tutor" }
              : msg
          )
        );
        if (currentLen >= mockResponse.length) {
          clearInterval(interval);
        }
      }, 30);
    } finally {
      setIsStreaming(false);
      setCurrentStatus("");
    }
  };

  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const getAgentBadge = (node) => {
    switch (node) {
      case "tutor":
        return {
          name: "Tutor Agent",
          color: "bg-emerald-100 text-emerald-800 border-emerald-200",
          icon: BookOpen,
        };
      case "bureaucrat":
        return {
          name: "Policy Agent",
          color: "bg-amber-100 text-amber-800 border-amber-200",
          icon: Shield,
        };
      case "strategist":
        return {
          name: "Strategist Agent",
          color: "bg-indigo-100 text-indigo-800 border-indigo-200",
          icon: BrainCircuit,
        };
      default:
        return {
          name: "Supervisor Router",
          color: "bg-gray-100 text-gray-800 border-gray-200",
          icon: Bot,
        };
    }
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB] text-[#1F2937] flex flex-col font-sans">
      <HeaderNav />

      <div className="flex-1 flex overflow-hidden max-w-7xl w-full mx-auto p-4 gap-4">
        {/* Sidebar: Threads & Context */}
        <aside className="hidden md:flex flex-col w-64 bg-white rounded-2xl border border-gray-200/80 p-4 shadow-xs">
          <button
            onClick={handleNewThread}
            className="flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl bg-[#4F46E5] hover:bg-[#4338CA] text-white text-xs font-semibold shadow-sm transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            New Chat Thread
          </button>

          {/* Active Threads List */}
          <div className="mt-6 flex-1 overflow-y-auto space-y-1">
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider px-2">
              Recent Conversations
            </span>
            {threads.map((t) => (
              <button
                key={t.id}
                onClick={() => setThreadId(t.id)}
                className={`w-full text-left px-3 py-2 rounded-lg text-xs flex items-center justify-between transition-colors ${
                  t.id === threadId
                    ? "bg-indigo-50 text-[#4F46E5] font-semibold border border-indigo-100"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <div className="truncate pr-2">
                  <p className="truncate">{t.title}</p>
                  <span className="text-[10px] text-gray-400 font-normal">{t.date}</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 shrink-0 opacity-50" />
              </button>
            ))}
          </div>

          {/* Document Context Attach Selector */}
          <div className="pt-4 border-t border-gray-200">
            <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">
              Attached Vector Document ID
            </label>
            <div className="relative">
              <FileText className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
              <input
                type="text"
                value={documentId}
                onChange={(e) => setDocumentId(e.target.value)}
                placeholder="Paste Document ID (optional)"
                className="w-full pl-8 pr-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#4F46E5]"
              />
            </div>
            <p className="text-[10px] text-gray-400 mt-1">
              Connect ingested PDF from the Document Ingest tab.
            </p>
          </div>
        </aside>

        {/* Main Chat Interface */}
        <main className="flex-1 flex flex-col bg-white rounded-2xl border border-gray-200/80 shadow-xs overflow-hidden">
          {/* Chat Window Header */}
          <div className="px-6 py-3.5 border-b border-gray-200 flex items-center justify-between bg-gray-50/50">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-indigo-100 text-[#4F46E5] flex items-center justify-center">
                <Zap className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-sm font-semibold text-gray-900">
                  Swarm Interactive Workspace
                </h2>
                <span className="text-[10px] text-gray-500">
                  Thread ID: <code className="font-mono text-gray-700">{threadId}</code>
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {documentId && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-medium">
                  <FileText className="w-3 h-3" />
                  Doc Filter Active
                </span>
              )}
              <button
                onClick={handleNewThread}
                className="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
                title="Clear Chat"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Messages Stream Area */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {messages.map((msg) => {
              const isUser = msg.role === "user";
              const badge = getAgentBadge(msg.node);
              const BadgeIcon = badge.icon;

              return (
                <div
                  key={msg.id}
                  className={`flex gap-3 max-w-3xl ${
                    isUser ? "ml-auto flex-row-reverse" : "mr-auto"
                  }`}
                >
                  {/* Avatar */}
                  <div
                    className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-white font-bold text-xs shadow-xs ${
                      isUser ? "bg-gray-800" : "bg-[#4F46E5]"
                    }`}
                  >
                    {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                  </div>

                  {/* Message Content Bubble */}
                  <div className="space-y-1.5 max-w-xl">
                    {!isUser && (
                      <div className="flex items-center gap-2">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold border ${badge.color}`}
                        >
                          <BadgeIcon className="w-3 h-3" />
                          {badge.name}
                        </span>
                        <span className="text-[10px] text-gray-400">{msg.timestamp}</span>
                      </div>
                    )}

                    <div
                      className={`p-4 rounded-2xl text-sm leading-relaxed ${
                        isUser
                          ? "bg-[#4F46E5] text-white rounded-tr-none shadow-sm"
                          : "bg-gray-50 border border-gray-200/80 text-gray-800 rounded-tl-none whitespace-pre-wrap"
                      }`}
                    >
                      {msg.content || (
                        <span className="inline-flex items-center gap-2 text-gray-400 italic">
                          <span className="w-2 h-2 rounded-full bg-indigo-500 animate-ping"></span>
                          Swarm synthesizing response...
                        </span>
                      )}
                    </div>

                    {!isUser && msg.content && (
                      <div className="flex items-center gap-2 text-[10px] text-gray-400 pl-1">
                        <button
                          onClick={() => copyToClipboard(msg.content, msg.id)}
                          className="hover:text-gray-600 flex items-center gap-1 transition-colors"
                        >
                          {copiedId === msg.id ? (
                            <>
                              <Check className="w-3 h-3 text-emerald-500" />
                              Copied!
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3" />
                              Copy Answer
                            </>
                          )}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

            {/* Live SSE Streaming Status Banner */}
            {isStreaming && (
              <div className="p-3 bg-indigo-50/80 border border-indigo-100 rounded-xl flex items-center gap-3 text-xs text-indigo-700 animate-pulse">
                <Activity className="w-4 h-4 text-[#4F46E5] animate-spin" />
                <span className="font-medium">
                  {currentStatus || "Swarm executing routing graph..."}
                </span>
              </div>
            )}

            <div ref={chatEndRef} />
          </div>

          {/* Quick Sample Prompts */}
          {messages.length <= 2 && (
            <div className="px-6 py-2 bg-gray-50/50 border-t border-gray-100 flex flex-wrap gap-2">
              <span className="text-[11px] font-medium text-gray-400 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-500" />
                Suggested:
              </span>
              {samplePrompts.map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(p)}
                  className="text-xs bg-white border border-gray-200 hover:border-indigo-300 hover:text-[#4F46E5] text-gray-600 px-3 py-1 rounded-full transition-colors cursor-pointer"
                >
                  {p}
                </button>
              ))}
            </div>
          )}

          {/* Input Prompt Box */}
          <div className="p-4 border-t border-gray-200 bg-white">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                value={inputPrompt}
                onChange={(e) => setInputPrompt(e.target.value)}
                placeholder="Ask Chimera Swarm (Syllabus, Rules, Exam Strategy...)"
                disabled={isStreaming}
                className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/30 focus:border-[#4F46E5] transition-all disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={!inputPrompt.trim() || isStreaming}
                className="p-3 rounded-xl bg-[#4F46E5] hover:bg-[#4338CA] text-white shadow-md shadow-indigo-500/20 transition-all disabled:opacity-40 cursor-pointer"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
}
