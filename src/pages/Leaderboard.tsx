"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowUpRight,
  Cpu,
  Fingerprint,
  Search,
  ShieldCheck,
  Target,
  Trophy,
  Zap,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

// ✅ 1. Import LeaderboardService
import { LeaderboardService } from "../services/index";

interface Leader {
  id: string | number;
  name: string;
  totalScore: number;
  quizzesTaken?: number;
  rank?: number;
}

export default function Leaderboard() {
  const navigate = useNavigate();
  const [top10, setTop10] = useState<Leader[]>([]);
  const [currentUser, setCurrentUser] = useState<Leader | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        // ✅ 2. Use the centralized service
        const res = await LeaderboardService.getLeaderboard();
        if (res.data.success) {
          const { top10: fetchedTop10, user: fetchedUser } = res.data.data;
          setTop10(fetchedTop10 || []);
          setCurrentUser(fetchedUser || null);
        }
      } catch (error) {
        console.error("Registry_Link_Failure");
      } finally {
        setLoading(false);
      }
    };
    fetchLeaderboard();
  }, []);

  const filteredLeaders = useMemo(() => {
    return top10.filter((l) =>
      l.name.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [top10, searchQuery]);

  if (loading)
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="flex flex-col items-center gap-6">
          <div className="relative">
            <div className="w-16 h-16 border-2 border-[#f97316]/30 rounded-full animate-spin" />
            <div className="absolute inset-0 flex items-center justify-center">
              <Zap className="w-8 h-8 text-[#f97316] animate-pulse" />
            </div>
          </div>
          <div className="text-center">
            <p className="text-[#f97316] text-sm font-bold tracking-[4px]">
              SYNCING NEURAL CORE
            </p>
            <p className="text-white/40 text-xs mt-1">
              ESTABLISHING QUANTUM LINK...
            </p>
          </div>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-[#050505] text-white overflow-hidden">
      {/* Background Grid */}
      <div className="fixed inset-0 bg-[linear-gradient(to_right,#1a1a1a_1px,transparent_1px),linear-gradient(to_bottom,#1a1a1a_1px,transparent_1px)] bg-[size:40px_40px] opacity-30 pointer-events-none" />

      <div className="relative max-w-5xl mx-auto px-6 py-12 pb-32">
        {/* TOP NAV */}
        <nav className="flex justify-between items-center mb-12">
          <button
            onClick={() => navigate(-1)}
            className="group flex items-center gap-3 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 px-6 py-3 rounded-2xl transition-all duration-300"
          >
            <ArrowLeft
              size={18}
              className="group-hover:-translate-x-1 transition-transform"
            />
            <span className="uppercase text-xs tracking-[2px] font-semibold">
              Back to Terminal
            </span>
          </button>

          <div className="flex items-center gap-3 px-5 py-2 bg-white/5 border border-white/10 rounded-full">
            <div className="w-2 h-2 bg-[#f97316] rounded-full animate-pulse" />
            <span className="text-xs font-mono tracking-widest text-white/60">
              LIVE REGISTRY
            </span>
          </div>
        </nav>

        {/* HEADER */}
        <div className="flex flex-col items-center text-center mb-16">
          <div className="inline-flex items-center gap-3 bg-white/5 px-6 py-2 rounded-full border border-white/10 mb-6">
            <ShieldCheck className="text-[#f97316]" size={22} />
            <span className="uppercase text-xs tracking-[3px] font-bold text-white/70">
              GLOBAL EFFICIENCY INDEX
            </span>
          </div>

          <h1 className="text-7xl md:text-8xl font-black tracking-tighter bg-gradient-to-b from-white to-white/70 bg-clip-text text-transparent leading-none">
            LEADERBOARD
          </h1>
          <p className="mt-3 text-white/40 text-lg">
            Top Performers • Neural Network 2026
          </p>
        </div>

        {/* SEARCH */}
        <div className="relative max-w-md mx-auto mb-12">
          <div className="absolute left-6 top-1/2 -translate-y-1/2 text-white/30">
            <Search size={18} />
          </div>
        </div>

        {/* PODIUM - TOP 3 */}
        {filteredLeaders.length > 0 && (
          <div className="mb-16">
            <div className="flex justify-center items-end gap-6 md:gap-8 mb-12">
              {/* 2nd Place */}
              {filteredLeaders[1] && (
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="text-center flex-1 max-w-[180px]"
                >
                  <div className="relative mx-auto w-20 h-20 mb-4">
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 flex items-center justify-center text-4xl font-black ring-1 ring-white/10">
                      {filteredLeaders[1].name[0].toUpperCase()}
                    </div>
                    <div className="absolute -top-2 -right-2 bg-[#f97316] text-black text-xs font-bold w-7 h-7 rounded-full flex items-center justify-center">
                      2
                    </div>
                  </div>
                  <p className="font-bold text-lg tracking-tight">
                    {filteredLeaders[1].name}
                  </p>
                  <p className="text-3xl font-black text-white/80 mt-1 tabular-nums">
                    {filteredLeaders[1].totalScore.toLocaleString()}
                  </p>
                  <Trophy className="mx-auto mt-3 text-amber-400" size={28} />
                </motion.div>
              )}

              {/* 1st Place */}
              {filteredLeaders[0] && (
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center flex-1 max-w-[200px] scale-110 z-10"
                >
                  <div className="relative mx-auto -mt-6">
                    <div className="w-28 h-28 mx-auto rounded-3xl bg-gradient-to-br from-[#f97316] via-orange-500 to-amber-500 flex items-center justify-center text-6xl font-black shadow-2xl shadow-[#f97316]/50 ring-8 ring-[#f97316]/20">
                      1
                    </div>
                    <div className="absolute -top-3 -right-3 bg-white text-black text-sm font-bold w-8 h-8 rounded-full flex items-center justify-center">
                      1
                    </div>
                  </div>
                  <p className="font-bold text-2xl mt-6 tracking-tighter">
                    {filteredLeaders[0].name}
                  </p>
                  <p className="text-5xl font-black bg-gradient-to-b from-[#f97316] to-orange-600 bg-clip-text text-transparent mt-1">
                    {filteredLeaders[0].totalScore.toLocaleString()}
                  </p>
                </motion.div>
              )}

              {/* 3rd Place */}
              {filteredLeaders[2] && (
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-center flex-1 max-w-[180px]"
                >
                  <div className="relative mx-auto w-20 h-20 mb-4">
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 flex items-center justify-center text-4xl font-black ring-1 ring-white/10">
                      {filteredLeaders[2].name[0].toUpperCase()}
                    </div>
                    <div className="absolute -top-2 -right-2 bg-white/80 text-black text-xs font-bold w-7 h-7 rounded-full flex items-center justify-center">
                      3
                    </div>
                  </div>
                  <p className="font-bold text-lg tracking-tight">
                    {filteredLeaders[2].name}
                  </p>
                  <p className="text-3xl font-black text-white/80 mt-1 tabular-nums">
                    {filteredLeaders[2].totalScore.toLocaleString()}
                  </p>
                  <Trophy className="mx-auto mt-3 text-amber-500" size={24} />
                </motion.div>
              )}
            </div>
          </div>
        )}

        {/* LEADERBOARD LIST */}
        <div className="bg-[#0a0a0a] border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
          <div className="px-10 py-6 border-b border-white/10 flex items-center justify-between bg-white/5">
            <div className="uppercase text-xs tracking-[2px] font-semibold text-white/50">
              RANK
            </div>
            <div className="uppercase text-xs tracking-[2px] font-semibold text-white/50">
              SUBJECT
            </div>
            <div className="uppercase text-xs tracking-[2px] font-semibold text-white/50 pr-12">
              EFFICIENCY SCORE
            </div>
          </div>

          <div className="divide-y divide-white/5">
            <AnimatePresence>
              {filteredLeaders.map((user, idx) => (
                <motion.div
                  key={user.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.03 }}
                  className={`group px-10 py-6 flex items-center justify-between hover:bg-white/5 transition-all duration-300 ${idx < 3 ? "bg-white/5" : ""}`}
                >
                  <div className="w-16 flex items-center gap-4">
                    {idx < 3 ? (
                      <div className="w-9 h-9 rounded-2xl bg-[#f97316] flex items-center justify-center text-black font-black">
                        {idx + 1}
                      </div>
                    ) : (
                      <span className="font-mono text-2xl font-bold text-white/20 group-hover:text-white/50 transition-colors">
                        #{String(idx + 1).padStart(2, "0")}
                      </span>
                    )}
                  </div>

                  <div className="flex-1 flex items-center gap-5">
                    <div
                      className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl font-bold border transition-all ${
                        idx < 3
                          ? "bg-[#f97316]/10 border-[#f97316]/30 text-white"
                          : "bg-white/5 border-white/10 group-hover:border-white/30"
                      }`}
                    >
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-semibold text-xl tracking-tight">
                        {user.name}
                      </p>
                      {user.quizzesTaken && (
                        <p className="text-xs text-white/40 font-mono">
                          {user.quizzesTaken} NODES CALIBRATED
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <span className="text-4xl font-black tabular-nums tracking-tighter text-white group-hover:text-[#f97316] transition-colors">
                        {user.totalScore.toLocaleString()}
                      </span>
                    </div>
                    <ArrowUpRight className="w-5 h-5 text-white/20 group-hover:text-[#f97316] transition-colors" />
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {filteredLeaders.length === 0 && (
            <div className="py-32 flex flex-col items-center justify-center text-center">
              <Fingerprint size={48} className="text-white/10 mb-6" />
              <p className="uppercase tracking-[3px] text-white/30 font-bold">
                NO MATCHING IDENTITY FOUND
              </p>
            </div>
          )}
        </div>

        {/* FOOTER */}
        <footer className="mt-20 flex flex-col md:flex-row items-center justify-between text-xs text-white/40">
          <div className="flex items-center gap-4">
            <Cpu size={18} />
            <span className="font-mono">NODE_CALIBRATOR_v4.7 • 2026</span>
          </div>
          <p className="mt-4 md:mt-0">SECURE • TRANSPARENT • UNSTOPPABLE</p>
        </footer>
      </div>

      {/* FLOATING CURRENT USER */}
      <AnimatePresence>
        {currentUser && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 w-full max-w-lg px-6"
          >
            <div className="bg-gradient-to-r from-[#0f0f0f] to-[#1a1a1a] border border-[#f97316]/40 rounded-3xl p-6 shadow-2xl shadow-black/80 backdrop-blur-xl flex items-center gap-6">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#f97316]/10 to-transparent border border-[#f97316]/30 flex items-center justify-center flex-shrink-0">
                <Target size={32} className="text-[#f97316]" />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3">
                  <p className="text-sm uppercase tracking-widest text-white/50">
                    YOUR STANDING
                  </p>
                  <span className="px-3 py-1 text-xs font-bold bg-white/10 rounded-full border border-white/10">
                    #{currentUser.rank || "—"}
                  </span>
                </div>
                <p className="text-2xl font-bold truncate mt-1">
                  {currentUser.name}
                </p>
              </div>

              <div className="text-right">
                <p className="text-xs uppercase tracking-widest text-white/50">
                  SCORE
                </p>
                <p className="text-4xl font-black text-[#f97316] tabular-nums tracking-tighter">
                  {currentUser.totalScore.toLocaleString()}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
