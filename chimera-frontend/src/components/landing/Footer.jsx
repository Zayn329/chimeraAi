import React from 'react';

export default function Footer() {
  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <footer className="bg-white border-t border-[#E5E7EB] py-14 px-4">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10">
        {/* Brand column */}
        <div className="md:col-span-2 space-y-4">
          <div className="flex items-center gap-2.5">
            <span className="w-8 h-8 rounded-lg bg-[#4F46E5] text-white flex items-center justify-center font-black text-lg shadow-sm">
              C
            </span>
            <span className="text-xl font-extrabold text-[#1F2937] tracking-tight">
              Chimera AI
            </span>
          </div>
          <p className="text-sm text-[#6B7280] max-w-sm leading-relaxed">
            AI-powered academic assistance for autonomous institutes. Specialized agent routing for concepts, examinations, and institutional policies.
          </p>
        </div>

        {/* Product links */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-[#1F2937] mb-4">
            Product
          </h4>
          <ul className="space-y-2.5 text-sm text-[#6B7280]">
            <li>
              <button
                type="button"
                onClick={() => scrollToSection('demo')}
                className="hover:text-[#4F46E5] transition-colors focus:outline-none focus:underline"
              >
                Chat
              </button>
            </li>
            <li>
              <button
                type="button"
                onClick={() => scrollToSection('agents')}
                className="hover:text-[#4F46E5] transition-colors focus:outline-none focus:underline"
              >
                Agents
              </button>
            </li>
            <li>
              <button
                type="button"
                onClick={() => scrollToSection('how-it-works')}
                className="hover:text-[#4F46E5] transition-colors focus:outline-none focus:underline"
              >
                How It Works
              </button>
            </li>
          </ul>
        </div>

        {/* Resources links */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-[#1F2937] mb-4">
            Resources
          </h4>
          <ul className="space-y-2.5 text-sm text-[#6B7280]">
            <li>
              <button
                type="button"
                onClick={() => scrollToSection('faq')}
                className="hover:text-[#4F46E5] transition-colors focus:outline-none focus:underline"
              >
                Documentation
              </button>
            </li>
            <li>
              <button
                type="button"
                onClick={() => scrollToSection('architecture')}
                className="hover:text-[#4F46E5] transition-colors focus:outline-none focus:underline"
              >
                Architecture
              </button>
            </li>
            <li>
              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                className="hover:text-[#4F46E5] transition-colors focus:outline-none focus:underline"
              >
                GitHub
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-[#E5E7EB] flex flex-col sm:flex-row items-center justify-between text-xs text-[#6B7280] gap-4">
        <p>© 2026 Chimera AI. All rights reserved.</p>
        <p className="font-mono">Precision Multi-Agent Academic Intelligence</p>
      </div>
    </footer>
  );
}
