import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, ArrowRight, LogIn, LogOut, MessageSquare, UploadCloud, Activity, Home } from "lucide-react";
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
    <header className="sticky top-0 z-40 w-full bg-[#F9FAFB]/90 backdrop-blur-md border-b border-[#E5E7EB]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-lg bg-[#4F46E5] flex items-center justify-center text-white font-bold text-lg shadow-xs group-hover:bg-[#4338CA] transition-colors">
            C
          </div>
          <span className="font-semibold text-lg text-[#1F2937] tracking-tight">
            Chimera AI
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1 text-sm font-medium text-[#6B7280]">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = location.pathname === link.href;
            return (
              <Link
                key={link.label}
                to={link.href}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-colors ${
                  isActive
                    ? "text-[#4F46E5] bg-[#4F46E5]/10 font-semibold"
                    : "hover:text-[#1F2937] hover:bg-gray-100/60"
                }`}
              >
                <Icon className="w-4 h-4" />
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Desktop CTA / Auth */}
        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-3">
              <span className="text-xs font-medium text-gray-600 bg-gray-100 border border-gray-200 px-2.5 py-1 rounded-full">
                {user.email || user.username}
              </span>
              <button
                onClick={handleLogout}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-gray-300 text-gray-700 text-sm font-medium hover:bg-gray-50 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#4F46E5] text-white text-sm font-medium hover:bg-[#4338CA] transition-colors shadow-xs"
            >
              <LogIn className="w-4 h-4" />
              Sign In
            </Link>
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
