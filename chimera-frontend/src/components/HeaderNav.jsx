import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, LogIn, LogOut, MessageSquare, UploadCloud, Activity, Home, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export function HeaderNav() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("chimera_user") || "null");

  const handleLogout = () => {
    localStorage.removeItem("chimera_user");
    navigate("/");
  };

  const navLinks = [
    { label: "Home", href: "/", icon: Home },
    { label: "Chat Window", href: "/chat", icon: MessageSquare },
    { label: "Ingest Docs", href: "/ingest", icon: UploadCloud },
    { label: "Telemetry & Flow", href: "/telemetry", icon: Activity },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-[#DCE8F6]/90 backdrop-blur-md border-b border-[#B9D5F7]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo with Motion Hover Micro-interaction */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <motion.div
            whileHover={{ scale: 1.08, rotate: 3 }}
            whileTap={{ scale: 0.95 }}
            className="w-9 h-9 rounded-xl bg-[#333D4E] flex items-center justify-center text-white font-extrabold text-lg shadow-md shadow-slate-400/20 group-hover:bg-[#252D3A] transition-colors"
          >
            C
          </motion.div>
          <span className="font-bold text-lg text-[#333D4E] tracking-tight group-hover:text-[#5B9EE1] transition-colors flex items-center gap-1.5">
            Chimera AI
            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-[#5B9EE1]/20 text-[#333D4E] border border-[#5B9EE1]/40">
              v1.0
            </span>
          </span>
        </Link>

        {/* Desktop Navigation with Animated Active Pill Indicator */}
        <nav className="hidden md:flex items-center gap-1 text-sm font-semibold text-[#5A6A80]">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = location.pathname === link.href;
            return (
              <Link
                key={link.label}
                to={link.href}
                className="relative px-3.5 py-2 rounded-xl transition-colors flex items-center gap-2"
              >
                {isActive && (
                  <motion.div
                    layoutId="activeNavTab"
                    className="absolute inset-0 bg-[#333D4E] rounded-xl shadow-xs"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                <Icon
                  className={`w-4 h-4 relative z-10 transition-colors ${
                    isActive ? "text-white" : "text-[#5A6A80] group-hover:text-[#333D4E]"
                  }`}
                />
                <span
                  className={`relative z-10 transition-colors ${
                    isActive ? "text-white font-bold" : "hover:text-[#333D4E]"
                  }`}
                >
                  {link.label}
                </span>
              </Link>
            );
          })}
        </nav>

        {/* Desktop CTA / Auth with Motion Scale Micro-interactions */}
        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-3">
              <span className="text-xs font-semibold text-[#333D4E] bg-white border border-[#B9D5F7] px-3 py-1 rounded-full shadow-xs">
                {user.email || user.username}
              </span>
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                onClick={handleLogout}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-[#B9D5F7] bg-white text-[#333D4E] text-sm font-semibold hover:bg-slate-50 transition-colors shadow-xs"
              >
                <LogOut className="w-4 h-4 text-[#E54D4D]" />
                Logout
              </motion.button>
            </div>
          ) : (
            <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
              <Link
                to="/login"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#333D4E] text-white text-sm font-semibold hover:bg-[#252D3A] transition-colors shadow-md shadow-slate-400/20"
              >
                <LogIn className="w-4 h-4 text-[#5B9EE1]" />
                Sign In
              </Link>
            </motion.div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center gap-2">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <button
                type="button"
                className="p-2 rounded-md text-[#6B7280] hover:text-[#1F2937] hover:bg-[#E5E7EB]/50 focus:outline-none"
                aria-label="Open Navigation Menu"
              >
                <Menu className="w-6 h-6" />
              </button>
            </SheetTrigger>
            <SheetContent side="right">
              <SheetHeader>
                <SheetTitle className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-md bg-[#4F46E5] flex items-center justify-center text-white font-bold text-sm">
                    C
                  </div>
                  <span>Chimera AI</span>
                </SheetTitle>
              </SheetHeader>
              <div className="mt-8 flex flex-col gap-3">
                {navLinks.map((link) => {
                  const Icon = link.icon;
                  const isActive = location.pathname === link.href;
                  return (
                    <Link
                      key={link.label}
                      to={link.href}
                      onClick={() => setIsOpen(false)}
                      className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-base font-medium transition-colors ${
                        isActive
                          ? "text-[#4F46E5] bg-[#4F46E5]/10 font-semibold"
                          : "text-[#1F2937] hover:bg-gray-100"
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      {link.label}
                    </Link>
                  );
                })}
                <div className="mt-4 pt-4 border-t border-gray-200">
                  {user ? (
                    <button
                      onClick={() => {
                        handleLogout();
                        setIsOpen(false);
                      }}
                      className="flex items-center justify-center gap-2 w-full py-2.5 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      Logout
                    </button>
                  ) : (
                    <Link
                      to="/login"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center justify-center gap-2 w-full py-2.5 rounded-lg bg-[#4F46E5] text-white font-medium hover:bg-[#4338CA] transition-colors"
                    >
                      <LogIn className="w-4 h-4" />
                      Sign In
                    </Link>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
