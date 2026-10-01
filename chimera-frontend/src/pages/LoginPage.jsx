import React, { useState, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { HeaderNav } from "@/components/HeaderNav";
import { SpotlightCard } from "@/components/ui/spotlight-card";
import { TimelineAnimation } from "@/components/ui/hero-financial-utils/timeline-animation";
import { Lock, Mail, ArrowRight, ShieldCheck, UserCheck, Sparkles, CheckCircle2 } from "lucide-react";

export function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student");
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const timelineRef = useRef(null);

  const handleLogin = (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }

    setIsLoading(true);
    setError("");

    setTimeout(() => {
      const user = {
        email,
        role,
        token: `token_${Date.now()}`,
        loginTime: new Date().toISOString(),
      };
      localStorage.setItem("chimera_user", JSON.stringify(user));
      setIsLoading(false);
      navigate("/chat");
    }, 600);
  };

  const handleQuickDemo = (demoRole) => {
    const demoUser = {
      email: demoRole === "student" ? "student@university.edu" : "faculty@university.edu",
      role: demoRole,
      token: `demo_${Date.now()}`,
      loginTime: new Date().toISOString(),
    };
    localStorage.setItem("chimera_user", JSON.stringify(demoUser));
    navigate("/chat");
  };

  return (
    <div ref={timelineRef} className="min-h-screen bg-[#f7f9fc] text-[#1f293b] flex flex-col font-sans relative overflow-hidden">
      {/* Background Soft Glow & SVGs inspired by HeroFinancial */}
      <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(79,70,229,0.12),rgba(255,255,255,0))] pointer-events-none" />

      <HeaderNav />

      <main className="flex-1 flex items-center justify-center px-4 py-12 relative z-10">
        <div className="w-full max-w-md">
          {/* Top Logo / Title Banner */}
          <TimelineAnimation animationNum={1} timelineRef={timelineRef} className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-400 text-white font-bold text-2xl shadow-lg shadow-indigo-500/30 mb-3">
              C
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1f293b] tracking-tight">
              Welcome to Chimera Swarm
            </h1>
            <p className="text-sm text-slate-500 mt-1 font-medium">
              Multi-Agent Intelligence Network for University Systems
            </p>
          </TimelineAnimation>

          {/* Spotlight Card with Timeline Motion */}
          <TimelineAnimation animationNum={2} timelineRef={timelineRef}>
            <SpotlightCard className="p-8 bg-white/90 backdrop-blur-xl border border-white/80 rounded-2xl shadow-xl shadow-indigo-500/5">
              {/* Role Switcher Tabs */}
              <div className="flex bg-slate-100/80 p-1 rounded-xl mb-6 border border-slate-200/60">
                <button
                  type="button"
                  onClick={() => setRole("student")}
                  className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-semibold transition-all ${
                    role === "student"
                      ? "bg-white text-indigo-600 shadow-xs"
                      : "text-slate-500 hover:text-slate-900"
                  }`}
                >
                  <UserCheck className="w-3.5 h-3.5" />
                  Student Portal
                </button>
                <button
                  type="button"
                  onClick={() => setRole("faculty")}
                  className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-semibold transition-all ${
                    role === "faculty"
                      ? "bg-white text-indigo-600 shadow-xs"
                      : "text-slate-500 hover:text-slate-900"
                  }`}
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Faculty / Admin
                </button>
              </div>

              {error && (
                <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-xs font-medium">
                  {error}
                </div>
              )}

              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    University Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder={role === "student" ? "student@university.edu" : "faculty@university.edu"}
                      className="w-full pl-9 pr-4 py-2.5 bg-slate-50/50 border border-slate-200 rounded-lg text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all"
                      required
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-medium text-slate-700">
                      Password
                    </label>
                    <a href="#" onClick={(e) => e.preventDefault()} className="text-xs text-indigo-600 hover:underline font-medium">
                      Forgot password?
                    </a>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-9 pr-4 py-2.5 bg-slate-50/50 border border-slate-200 rounded-lg text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all"
                      required
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="rounded text-indigo-600 focus:ring-indigo-500 w-4 h-4"
                    />
                    <span className="text-xs text-slate-600">Remember session</span>
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full mt-2 py-2.5 px-4 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-indigo-400 hover:opacity-95 text-white text-sm font-semibold flex items-center justify-center gap-2 shadow-md shadow-indigo-500/20 transition-all disabled:opacity-50 cursor-pointer"
                >
                  {isLoading ? (
                    <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                  ) : (
                    <>
                      Sign In to Swarm
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200"></div>
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="bg-white px-3 text-slate-400 font-medium">Or explore instantly</span>
                </div>
              </div>

              {/* Quick Demo Access */}
              <div className="space-y-2">
                <button
                  type="button"
                  onClick={() => handleQuickDemo("student")}
                  className="w-full py-2 px-3 rounded-lg border border-indigo-200 bg-indigo-50/50 hover:bg-indigo-50 text-indigo-700 text-xs font-semibold flex items-center justify-between transition-colors"
                >
                  <span className="flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                    Enter as Student Demo
                  </span>
                  <span className="text-[10px] bg-indigo-100 px-2 py-0.5 rounded-md font-mono">Instant Access</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickDemo("faculty")}
                  className="w-full py-2 px-3 rounded-lg border border-amber-200 bg-amber-50/50 hover:bg-amber-50 text-amber-800 text-xs font-semibold flex items-center justify-between transition-colors"
                >
                  <span className="flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
                    Enter as Faculty Demo
                  </span>
                  <span className="text-[10px] bg-amber-100 px-2 py-0.5 rounded-md font-mono">Admin Mode</span>
                </button>
              </div>
            </SpotlightCard>
          </TimelineAnimation>

          {/* Footer Note */}
          <TimelineAnimation animationNum={3} timelineRef={timelineRef} className="mt-6 text-center text-xs text-slate-500 flex items-center justify-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
            <span>End-to-end encrypted session with LangGraph Swarm Orchestrator</span>
          </TimelineAnimation>
        </div>
      </main>
    </div>
  );
}
