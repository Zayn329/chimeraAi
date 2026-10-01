import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, ArrowRight, LogIn, MessageSquare, UploadCloud, Activity } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export function Navbar({ onNavigate }) {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { label: "Chat Window", href: "/chat", isRoute: true, icon: MessageSquare },
    { label: "Ingest Docs", href: "/ingest", isRoute: true, icon: UploadCloud },
    { label: "Telemetry & Flow", href: "/telemetry", isRoute: true, icon: Activity },
    { label: "How It Works", href: "#how-it-works", isRoute: false },
    { label: "Architecture", href: "#architecture", isRoute: false },
  ];

  const handleAnchorClick = (e, href) => {
    e.preventDefault();
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    setIsOpen(false);
  };

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
        <nav className="hidden md:flex items-center gap-5 text-sm font-medium text-[#6B7280]">
          {navLinks.map((link) =>
            link.isRoute ? (
              <Link
                key={link.label}
                to={link.href}
                className="hover:text-[#4F46E5] transition-colors flex items-center gap-1.5"
              >
                {link.icon && <link.icon className="w-4 h-4" />}
                {link.label}
              </Link>
            ) : (
              <a
                key={link.label}
                href={link.href}
                onClick={(e) => handleAnchorClick(e, link.href)}
                className="hover:text-[#1F2937] transition-colors"
              >
                {link.label}
              </a>
            )
          )}
        </nav>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            to="/login"
            className="inline-flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-gray-700 hover:text-[#4F46E5] transition-colors"
          >
            <LogIn className="w-4 h-4" />
            Sign In
          </Link>
          <Link
            to="/chat"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#4F46E5] text-white text-sm font-medium hover:bg-[#4338CA] transition-colors shadow-xs"
          >
            Start Chat
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
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
              <div className="mt-8 flex flex-col gap-4">
                {navLinks.map((link) =>
                  link.isRoute ? (
                    <Link
                      key={link.label}
                      to={link.href}
                      onClick={() => setIsOpen(false)}
                      className="text-base font-medium text-[#1F2937] hover:text-[#4F46E5] py-2 border-b border-[#E5E7EB]/50 transition-colors flex items-center gap-2"
                    >
                      {link.icon && <link.icon className="w-5 h-5 text-[#4F46E5]" />}
                      {link.label}
                    </Link>
                  ) : (
                    <a
                      key={link.label}
                      href={link.href}
                      onClick={(e) => handleAnchorClick(e, link.href)}
                      className="text-base font-medium text-[#1F2937] hover:text-[#4F46E5] py-2 border-b border-[#E5E7EB]/50 transition-colors"
                    >
                      {link.label}
                    </a>
                  )
                )}
                <Link
                  to="/chat"
                  onClick={() => setIsOpen(false)}
                  className="mt-4 flex items-center justify-center gap-2 w-full py-2.5 rounded-lg bg-[#4F46E5] text-white font-medium hover:bg-[#4338CA] transition-colors text-center"
                >
                  Start Chat
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
