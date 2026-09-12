import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Compass } from 'lucide-react';

export default function FinalCTA() {
  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="py-20 px-4 max-w-7xl mx-auto bg-[#F9FAFB]">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="relative bg-gradient-to-br from-[#1F2937] to-[#111827] rounded-3xl p-8 sm:p-14 overflow-hidden text-center text-white border border-[#374151] shadow-xl"
      >
        {/* Subtle decorative glow */}
        <div className="absolute -top-24 -left-24 w-72 h-72 bg-[#4F46E5]/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-[#10B981]/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider bg-white/10 text-indigo-200 border border-white/15 backdrop-blur-sm">
            GET STARTED WITH CHIMERA
          </div>

          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white">
            Your Academic Questions Have a Route.
          </h2>

          <p className="text-base sm:text-xl text-gray-300 font-light italic">
            «Ask Chimera and let the right agent take it from there.»
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              type="button"
              onClick={() => scrollToSection('demo')}
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-[#4F46E5] text-white font-semibold hover:bg-[#4338CA] transition-all shadow-lg hover:shadow-indigo-500/25 flex items-center justify-center gap-2 text-base focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-[#1F2937]"
            >
              Start Chatting
              <ArrowRight className="w-5 h-5" />
            </button>

            <button
              type="button"
              onClick={() => scrollToSection('architecture')}
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-white/10 text-white font-semibold hover:bg-white/20 transition-all border border-white/20 backdrop-blur-sm flex items-center justify-center gap-2 text-base focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-[#1F2937]"
            >
              <Compass className="w-5 h-5" />
              Explore Architecture
            </button>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
