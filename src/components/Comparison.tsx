import { Bot, CheckCircle2, Layers, XCircle } from "lucide-react";
import React from "react";

const prepGridFeatures = [
  "AI-Adaptive Role-Based Interviews",
  "In-Browser Judge0 Code Editor",
  "Instant AI Quiz Evaluation",
  "Streak & Gap Analysis Dashboard",
  "Generous Free Tier to Start",
];

const competitorFeatures = [
  "Fixed Non-Adaptive Question Banks",
  "External IDE Required",
  "Slow Manual or Static Test Grading",
  "Basic Dashboard Lacking Analytics",
  "Limited Free Access",
];

const ComparisonSection: React.FC = () => {
  return (
    <section className="w-full bg-[#0a0a0a] py-10 px-4 sm:px-6 font-machina-normal relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-[300px] bg-green-900/5 blur-[120px] pointer-events-none" />
      <div className="max-w-4xl mx-auto text-center mb-16 sm:mb-24 relative z-10">
        <div className="inline-block border border-white/10 px-4 py-1.5 mb-8">
          <span className="text-[#a1a1aa] text-xs font-machina-bold tracking-[0.2em] uppercase">
            Comparison
          </span>
        </div>
        <h2 className="text-white text-3xl sm:text-4xl md:text-5xl font-machina-light leading-tight">
          Discover Why PrepGrid is Your <br className="hidden md:block" />
          Path to <span className="font-machina-bold">Tech Mastery</span>
        </h2>
      </div>

      <div className="max-w-5xl mx-auto flex flex-col md:flex-row relative z-10">
        <div className="flex-1 relative bg-gradient-to-br from-[#111111] to-[#0a0a0a] border border-white/5 rounded-t-3xl md:rounded-tr-none md:rounded-l-3xl p-8 sm:p-12 group transition-all duration-500 hover:bg-[#141414]">
          <div className="absolute top-0 left-0 w-[2px] h-full bg-green-500 shadow-[0_0_15px_rgba(34,197,94,0.6)] rounded-l-3xl" />

          <div className="flex items-center gap-4 mb-12">
            <Bot size={32} className="text-white" />
            <h3 className="text-white text-2xl sm:text-3xl font-machina-bold leading-tight">
              PrepGrid AI <br /> Platform
            </h3>
          </div>

          <ul className="space-y-6 sm:space-y-8">
            {prepGridFeatures.map((feature, idx) => (
              <li key={idx} className="flex items-start gap-4 group/item">
                <CheckCircle2
                  size={24}
                  className="text-green-500 shrink-0 mt-0.5 group-hover/item:scale-110 transition-transform"
                />
                <span className="text-white/90 text-base sm:text-lg font-machina-light leading-snug">
                  {feature}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Right Column: Competitor */}
        <div className="flex-1 relative bg-[#0d0d0d] border border-white/5 md:border-l-0 rounded-b-3xl md:rounded-bl-none md:rounded-r-3xl p-8 sm:p-12 transition-all duration-500 hover:bg-[#111111]">
          <div className="flex items-center gap-4 mb-12 opacity-70">
            <Layers size={32} className="text-white" />
            <h3 className="text-white text-2xl sm:text-3xl font-machina-light leading-tight">
              Generic <br /> Competitors
            </h3>
          </div>

          <ul className="space-y-6 sm:space-y-8">
            {competitorFeatures.map((feature, idx) => (
              <li key={idx} className="flex items-start gap-4 group/item">
                <XCircle
                  size={24}
                  className="text-[#f97316] shrink-0 mt-0.5 opacity-80 group-hover/item:scale-110 transition-transform"
                />
                <span className="text-white/60 text-base sm:text-lg font-machina-light leading-snug">
                  {feature}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
};

export default ComparisonSection;
