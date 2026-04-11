import { motion } from "framer-motion";
import {
  ArrowRight,
  BookOpen,
  Bot,
  BrainCircuit,
  LayoutDashboard,
  Terminal,
  Trophy,
  Zap,
} from "lucide-react";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.05 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 90, damping: 18 },
  },
};

const topics = ["Arrays", "DP", "Graphs", "SQL", "Trees", "OS"];

const PrepGridFeatures = () => {
  return (
    <section className="w-full bg-[#0a0a0a] py-20 px-4 sm:px-6 font-machina-normal overflow-hidden">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-orange-500/25 bg-orange-500/[0.08] mb-5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#f97316] animate-pulse" />
            <span className="text-[#f97316] text-[11px] font-machina-bold tracking-[3px] uppercase">
              Everything You Need
            </span>
          </div>
          <h3 className="text-white text-4xl sm:text-5xl md:text-6xl font-machina-light leading-none">
            Built to{" "}
            <span className="font-machina-bold italic text-[#f97316]">
              crack placements
            </span>
          </h3>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="grid w-full grid-cols-1 gap-4 md:grid-cols-3 auto-rows-[minmax(180px,auto)]"
        >
          <motion.div
            variants={itemVariants}
            className="md:col-span-1 md:row-span-2"
          >
            <div className="group h-full bg-[#111111] border border-white/[0.08] rounded-2xl p-6 hover:border-orange-500/35 transition-all duration-500 relative overflow-hidden flex flex-col">
              <div className="absolute -top-8 -right-8 w-32 h-32 bg-orange-500/10 rounded-full blur-2xl group-hover:scale-150 group-hover:opacity-70 transition-all duration-700 opacity-40" />
              <div className="flex items-start justify-between mb-4">
                <div className="bg-[#0d0d0d] border border-white/[0.07] group-hover:border-orange-500/25 w-11 h-11 rounded-xl flex items-center justify-center transition-colors duration-300 relative">
                  <Terminal size={22} className="text-[#f97316]" />
                  <div className="absolute inset-0 bg-orange-500/15 blur-md rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>
                <span className="text-[10px] text-white/20 font-machina-light tracking-widest uppercase">
                  01
                </span>
              </div>

              <h3 className="text-xl font-machina-bold text-white mb-1.5 group-hover:text-orange-50 transition-colors duration-300">
                Practice Module
              </h3>
              <div className="h-[2px] w-6 group-hover:w-10 bg-gradient-to-r from-[#f97316] to-orange-400/40 rounded-full transition-all duration-500 mb-3" />
              <p className="text-white/50 text-sm leading-relaxed mb-5">
                Real-time editor via{" "}
                <span className="text-[#f97316] font-semibold">Judge0</span>.{" "}
                <span className="text-white/70 font-semibold">
                  500+ questions
                </span>{" "}
                across 12 topics.
              </p>

              <div className="grid grid-cols-3 gap-2 mb-4">
                {[
                  { label: "Easy", value: "148", color: "text-emerald-400" },
                  { label: "Med", value: "265", color: "text-amber-400" },
                  { label: "Hard", value: "87", color: "text-red-400" },
                ].map((s) => (
                  <div
                    key={s.label}
                    className="bg-white/[0.03] hover:bg-white/[0.06] rounded-xl p-3 border border-white/[0.06] hover:border-white/10 transition-all duration-200 text-center group/stat"
                  >
                    <div
                      className={`text-[10px] ${s.color} opacity-70 group-hover/stat:opacity-100 transition-opacity`}
                    >
                      {s.label}
                    </div>
                    <div className="text-xl font-machina-bold text-white mt-0.5">
                      {s.value}
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap gap-1.5 mb-4">
                {topics.map((topic) => (
                  <span
                    key={topic}
                    className="px-2.5 py-0.5 text-[10px] rounded-full bg-white/[0.03] border border-white/[0.07] text-white/50 hover:border-orange-500/30 hover:text-orange-200/70 hover:bg-orange-500/[0.05] transition-all duration-200 cursor-default"
                  >
                    {topic}
                  </span>
                ))}
              </div>

              <div className="mt-auto flex items-center gap-1.5 text-[11px] text-orange-400/70 group-hover:text-orange-400 transition-colors duration-300">
                <BookOpen size={13} />
                <span>Track Solved • Unsolved • Bookmarked</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="md:col-span-1 md:row-span-1"
          >
            <div className="group h-full bg-[#111111] border border-white/[0.08] rounded-2xl p-6 hover:border-orange-500/35 transition-all duration-300 flex flex-col relative overflow-hidden">
              <div className="absolute bottom-0 right-0 w-28 h-28 bg-orange-500/8 rounded-full blur-2xl group-hover:opacity-100 opacity-50 transition-opacity duration-500" />
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="text-lg font-machina-bold text-white group-hover:text-orange-50 transition-colors">
                    AI Interview
                  </h3>
                  <p className="text-white/40 text-xs mt-0.5">
                    Adaptive • Real-time feedback
                  </p>
                </div>
                <Bot
                  size={28}
                  className="text-orange-500 group-hover:scale-110 transition-transform duration-300"
                />
              </div>
              <div className="mt-auto flex items-end justify-between">
                <div>
                  <div className="text-5xl font-machina-bold text-[#f97316] leading-none">
                    ∞
                  </div>
                  <p className="text-white/40 text-xs mt-1">Unlimited on Pro</p>
                </div>
                <div className="flex items-center gap-1 text-[11px] text-orange-400/60 group-hover:text-orange-400 group-hover:gap-2 transition-all duration-300">
                  <span>Start session</span>
                  <ArrowRight size={12} />
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="md:col-span-1 md:row-span-1"
          >
            <div className="group h-full bg-[#111111] border border-white/[0.08] rounded-2xl p-6 hover:border-orange-500/35 transition-all duration-300 relative overflow-hidden flex items-center justify-center">
              <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="text-center relative z-10">
                <div className="text-[68px] font-machina-bold text-white tracking-tighter leading-none group-hover:text-orange-50 transition-colors duration-300">
                  10X
                </div>
                <p className="text-orange-400/80 text-sm -mt-1 group-hover:text-orange-400 transition-colors">
                  Faster Preparation
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="md:col-span-1 md:row-span-1"
          >
            <div className="group h-full bg-[#111111] border border-white/[0.08] rounded-2xl p-6 hover:border-orange-500/35 transition-all duration-300 relative overflow-hidden flex flex-col">
              <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/8 rounded-full blur-2xl opacity-50 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="flex items-start justify-between mb-3">
                <BrainCircuit
                  size={26}
                  className="text-orange-500 group-hover:scale-110 transition-transform duration-300"
                />
                <span className="text-[10px] text-white/20 tracking-widest">
                  03
                </span>
              </div>
              <h3 className="text-lg font-machina-bold text-white mb-1 group-hover:text-orange-50 transition-colors">
                Smart Quizzes
              </h3>
              <p className="text-white/45 text-xs leading-relaxed">
                AI-powered MCQs &amp;{" "}
                <span className="text-white/65">short-answer evaluation</span>
              </p>
              <div className="mt-auto flex items-center gap-1.5 text-[11px] text-orange-400/60 group-hover:text-orange-400 transition-colors duration-300">
                <Trophy size={13} />
                <span>Global Leaderboard</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="md:col-span-1 md:row-span-1"
          >
            <div className="group h-full bg-[#111111] border border-white/[0.08] rounded-2xl p-6 hover:border-orange-500/35 transition-all duration-300 relative overflow-hidden flex flex-col">
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-orange-600/8 rounded-full blur-2xl opacity-50 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="flex items-start justify-between mb-3">
                <LayoutDashboard
                  size={26}
                  className="text-orange-500 group-hover:scale-110 transition-transform duration-300"
                />
                <span className="text-[10px] text-white/20 tracking-widest">
                  04
                </span>
              </div>
              <h3 className="text-lg font-machina-bold text-white mb-1 group-hover:text-orange-50 transition-colors">
                Dashboard
              </h3>
              <p className="text-white/45 text-xs leading-relaxed">
                <span className="text-[#f97316]">Streak</span> •{" "}
                <span className="text-white/65">Weak Areas</span> •{" "}
                <span className="text-white/65">Performance Trends</span>
              </p>
            </div>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="md:col-span-3 md:row-span-1"
          >
            <div className="group h-full bg-[#111111] border border-white/[0.08] rounded-2xl p-6 sm:p-8 hover:border-orange-500/40 transition-all duration-300 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 relative overflow-hidden">
              {/* Background gradient sweep on hover */}
              <div className="absolute inset-0 bg-gradient-to-r from-orange-500/[0.04] via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-orange-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              <div className="relative z-10">
                <div className="inline-flex items-center gap-1.5 bg-orange-500/10 text-orange-400 px-3 py-1 rounded-full text-[11px] mb-3 border border-orange-500/20">
                  <Zap size={12} />
                  <span className="font-machina-bold tracking-wider">
                    RECOMMENDED
                  </span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-machina-bold text-white group-hover:text-orange-50 transition-colors">
                  Go Pro Today
                </h3>
                <p className="text-white/45 text-sm mt-1.5 max-w-md">
                  Unlimited AI interviews, priority questions &amp;{" "}
                  <span className="text-white/65">advanced analytics</span>
                </p>
              </div>

              <button className="relative z-10 group/btn bg-[#f97316] hover:bg-orange-500 active:scale-95 px-7 py-3.5 rounded-xl font-machina-bold text-base flex items-center gap-2.5 text-white transition-all duration-200 shadow-[0_0_24px_rgba(249,115,22,0.25)] hover:shadow-[0_0_32px_rgba(249,115,22,0.4)] shrink-0">
                <Zap
                  size={18}
                  className="group-hover/btn:rotate-12 transition-transform duration-200"
                />
                Upgrade — ₹499/mo
                <ArrowRight
                  size={16}
                  className="group-hover/btn:translate-x-1 transition-transform duration-200"
                />
              </button>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default PrepGridFeatures;
