import React, { useState } from "react";
import { Menu, ArrowRight, Layers } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";

export function Navbar({ onNavigate }) {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { label: "Home", href: "#home" },
    { label: "Agents", href: "#agents" },
    { label: "How It Works", href: "#how-it-works" },
    { label: "Architecture", href: "#architecture" },
    { label: "Docs", href: "#docs" },
  ];

  const handleLinkClick = (e, href) => {
    e.preventDefault();
    if (onNavigate) {
      onNavigate(href);
    } else {
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
    setIsOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-[#F9FAFB]/90 backdrop-blur-md border-b border-[#E5E7EB]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <a href="#home" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-lg bg-[#4F46E5] flex items-center justify-center text-white font-bold text-lg shadow-xs group-hover:bg-[#4338CA] transition-colors">
            C
          </div>
          <span className="font-semibold text-lg text-[#1F2937] tracking-tight">
            Chimera AI
          </span>
        </a>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-[#6B7280]">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={(e) => handleLinkClick(e, link.href)}
              className="hover:text-[#1F2937] transition-colors"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center">
          <a
            href="#hero-prompt"
            onClick={(e) => handleLinkClick(e, "#hero-prompt")}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#4F46E5] text-white text-sm font-medium hover:bg-[#4338CA] transition-colors shadow-xs"
          >
            Start Chat
            <ArrowRight className="w-4 h-4" />
          </a>
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
                {navLinks.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    onClick={(e) => handleLinkClick(e, link.href)}
                    className="text-base font-medium text-[#1F2937] hover:text-[#4F46E5] py-2 border-b border-[#E5E7EB]/50 transition-colors"
                  >
                    {link.label}
                  </a>
                ))}
                <a
                  href="#hero-prompt"
                  onClick={(e) => handleLinkClick(e, "#hero-prompt")}
                  className="mt-4 flex items-center justify-center gap-2 w-full py-2.5 rounded-lg bg-[#4F46E5] text-white font-medium hover:bg-[#4338CA] transition-colors text-center"
                >
                  Start Chat
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
