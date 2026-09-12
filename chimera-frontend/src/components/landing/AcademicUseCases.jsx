import React from 'react';
import { motion } from 'framer-motion';
import { GraduationCap, Presentation, Building2, ArrowRight } from 'lucide-react';

const useCases = [
  {
    role: "Students",
    icon: GraduationCap,
    badge: "LEARNERS",
    color: "#4F46E5",
    description: "Understand courses, prepare for exams, and find academic resources.",
    features: [
      "Syllabus & topic breakdown",
      "Past paper exam strategies",
      "Instant rule & credit lookup"
    ]
  },
  {
    role: "Teachers",
    icon: Presentation,
    badge: "FACULTY",
    color: "#10B981",
    description: "Find academic and institutional information faster.",
    features: [
      "Quick syllabus reference",
      "Department circular access",
      "Policy & grading lookup"
    ]
  },
  {
    role: "Institutes",
    icon: Building2,
    badge: "INSTITUTIONS",
    color: "#F59E0B",
    description: "Create a centralized AI interface for institution-specific academic knowledge.",
    features: [
      "Unified AI entry point",
      "Institutional policy grounding",
      "Modular multi-agent scale"
    ]
  }
];

export default function AcademicUseCases() {
  return (
    <section className="py-20 px-4 max-w-7xl mx-auto bg-[#F9FAFB]" id="use-cases">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-indigo-50 text-[#4F46E5] border border-indigo-100 mb-4">
          ACADEMIC WORKFLOWS
        </div>
        <h2 className="text-3xl sm:text-4xl font-bold text-[#1F2937] tracking-tight">
          Designed Around Academic Workflows
        </h2>
        <p className="mt-4 text-base sm:text-lg text-[#6B7280]">
          Specialized assistance engineered for every member of the academic community.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {useCases.map((item, idx) => {
          const Icon = item.icon;
          return (
            <motion.div
              key={item.role}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.1 }}
              className="bg-white rounded-2xl p-8 border border-[#E5E7EB] shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div
                    className="p-3 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: `${item.color}15`, color: item.color }}
                  >
                    <Icon className="w-6 h-6" />
                  </div>
                  <span
                    className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border"
                    style={{
                      borderColor: `${item.color}30`,
                      color: item.color,
                      backgroundColor: `${item.color}08`
                    }}
                  >
                    {item.badge}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-[#1F2937] mb-3 group-hover:text-[#4F46E5] transition-colors">
                  {item.role}
                </h3>
                <p className="text-sm text-[#6B7280] leading-relaxed mb-6">
                  {item.description}
                </p>

                <div className="border-t border-[#E5E7EB] pt-4 space-y-2">
                  {item.features.map((feat) => (
                    <div key={feat} className="flex items-center gap-2 text-xs text-[#1F2937] font-medium">
                      <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: item.color }} />
                      {feat}
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-8 pt-4 flex items-center text-xs font-semibold text-[#4F46E5] group-hover:translate-x-1 transition-transform">
                <span>Explore Workflow</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
