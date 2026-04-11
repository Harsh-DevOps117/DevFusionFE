"use client";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowUpRight,
  Fingerprint,
  Search,
  ShieldCheck,
  Target,
  Zap,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../utils/api";

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
        const res = await api.get("/leader");
        const { top10: fetchedTop10, user: fetchedUser } = res.data.data || {};
        setTop10(fetchedTop10 || []);
        setCurrentUser(fetchedUser || null);
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
      <div className="h-screen bg-[#020202] flex items-center justify-center font-mono">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-[1px] bg-[#f97316] animate-pulse" />
          <span className="text-[9px] tracking-[0.5em] text-white/20 uppercase">
            Establishing_Sync
          </span>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-[#020202] text-[#ededed] font-['fontNormal'] selection:bg-[#f97316]/30 px-6 py-10 pb-40">
      <div className="max-w-4xl mx-auto space-y-16">
        <nav className="flex justify-between items-center">
          <button
            onClick={() => navigate(-1)}
            className="group flex items-center gap-2 bg-white/[0.03] border border-white/5 px-4 py-2 rounded-xl hover:bg-white/[0.08] transition-all"
          >
            <ArrowLeft
              size={14}
              className="text-white/20 group-hover:text-[#f97316]"
            />
            <span className="text-[10px] font-bold uppercase tracking-widest text-white/40">
              Terminal
            </span>
          </button>
          <div className="flex items-center gap-3 bg-white/[0.01] border border-white/5 px-4 py-1.5 rounded-full backdrop-blur-sm">
            <div className="h-1.5 w-1.5 rounded-full bg-[#f97316] shadow-[0_0_8px_#f97316] animate-pulse" />
            <span className="text-[9px] font-black uppercase tracking-[0.3em] text-white/20 italic">
              Registry_Live
            </span>
          </div>
        </nav>

        <header>
          <div className="flex items-center gap-3 mb-3">
            <ShieldCheck size={18} className="text-[#f97316]/50" />
            <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-white/20 italic">
              Global Efficiency Index
            </span>
          </div>
          <h1 className="text-6xl font-black tracking-tighter text-white leading-none">
            Leaderboard<span className="text-[#f97316]">.</span>
          </h1>
        </header>

        <div className="relative group max-w-sm">
          <Search
            className="absolute left-5 top-1/2 -translate-y-1/2 text-white/10 group-focus-within:text-[#f97316] transition-colors"
            size={14}
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search Identity..."
            className="w-full bg-[#050505] border border-white/5 rounded-2xl py-4 pl-14 pr-6 text-[11px] font-bold tracking-[0.2em] focus:outline-none focus:border-[#f97316]/30 transition-all placeholder:text-white/5 uppercase"
          />
        </div>

        <div className="bg-[#050505] border border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl relative">
          <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/5 to-transparent" />
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/[0.01] border-b border-white/5">
                <th className="px-12 py-8 text-[10px] uppercase tracking-[0.5em] text-white/10 font-black">
                  Rank
                </th>
                <th className="px-6 py-8 text-[10px] uppercase tracking-[0.5em] text-white/10 font-black">
                  Subject_Identity
                </th>
                <th className="px-12 py-8 text-[10px] uppercase tracking-[0.5em] text-white/10 font-black text-right">
                  Score
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.02]">
              <AnimatePresence>
                {filteredLeaders.map((user, idx) => (
                  <motion.tr
                    key={user.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className={`group transition-all duration-300 ${
                      idx < 3 ? "bg-white/[0.01]" : "hover:bg-white/[0.02]"
                    }`}
                  >
                    <td className="px-12 py-8">
                      {idx === 0 ? (
                        <Zap
                          size={14}
                          className="text-[#f97316] drop-shadow-[0_0_8px_#f97316]"
                        />
                      ) : (
                        <span className="font-mono text-[11px] text-white/10 group-hover:text-[#f97316] font-bold transition-colors">
                          #{String(idx + 1).padStart(2, "0")}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-8">
                      <div className="flex items-center gap-4">
                        <div
                          className={`w-10 h-10 rounded-xl border flex items-center justify-center text-[11px] font-black transition-all ${
                            idx < 3
                              ? "bg-[#f97316]/5 border-[#f97316]/20 text-[#f97316]"
                              : "bg-white/[0.03] border-white/5 text-white/20 group-hover:text-white group-hover:border-white/20"
                          }`}
                        >
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <span
                          className={`text-base font-bold tracking-tight transition-colors ${
                            idx < 3
                              ? "text-white"
                              : "text-white/40 group-hover:text-white"
                          }`}
                        >
                          {user.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-12 py-8 text-right">
                      <div className="flex items-center justify-end gap-4">
                        <span
                          className={`text-3xl font-black italic tabular-nums transition-all ${
                            idx < 3
                              ? "text-[#f97316]"
                              : "text-white/10 group-hover:text-white"
                          }`}
                        >
                          {user.totalScore}
                        </span>
                        <ArrowUpRight
                          size={14}
                          className="text-white/5 group-hover:text-[#f97316] transition-all"
                        />
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
          {filteredLeaders.length === 0 && (
            <div className="py-32 text-center">
              <Fingerprint size={24} className="mx-auto text-white/5 mb-4" />
              <p className="text-[10px] uppercase tracking-[0.5em] text-white/10 font-black italic">
                Null_Registry_Result
              </p>
            </div>
          )}
        </div>

        <footer className="mt-24 pb-12 border-t border-white/5 pt-12 flex flex-col md:flex-row justify-between items-center gap-6 opacity-30">
          <div className="flex items-center gap-4">
            <div className="w-px h-4 bg-white/10" />
            <span className="text-[10px] font-bold uppercase tracking-[0.4em]">
              Node_Calibrator_v4.5
            </span>
          </div>
          <p className="text-[10px] font-black uppercase tracking-[0.5em]">
            Secure_Infra // 2026
          </p>
        </footer>
      </div>

      <AnimatePresence>
        {currentUser && (
          <motion.div
            initial={{ y: 100, x: "-50%" }}
            animate={{ y: 0, x: "-50%" }}
            className="fixed bottom-10 left-1/2 w-full max-w-xl px-6 z-50"
          >
            <div className="bg-[#080808]/90 backdrop-blur-2xl border border-[#f97316]/30 p-5 rounded-3xl shadow-[0_25px_50px_rgba(0,0,0,0.8)] flex items-center justify-between">
              <div className="flex items-center gap-5">
                <div className="w-12 h-12 rounded-2xl bg-[#f97316]/5 border border-[#f97316]/20 flex items-center justify-center">
                  <Target size={20} className="text-[#f97316]" />
                </div>
                <div>
                  <h4 className="text-[9px] font-black text-[#f97316] uppercase tracking-[0.3em] mb-1">
                    Neural_Standing
                  </h4>
                  <div className="flex items-center gap-3">
                    <span className="text-lg font-black italic text-white leading-none">
                      {currentUser.name}
                    </span>
                    <span className="bg-white/5 px-2.5 py-0.5 rounded-lg text-[10px] font-bold text-white/40 border border-white/5 uppercase font-mono">
                      #{currentUser.rank}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-10 pr-4">
                <div className="text-right">
                  <p className="text-[9px] font-bold text-white/20 uppercase tracking-widest mb-1">
                    Efficiency
                  </p>
                  <p className="text-2xl font-black italic text-[#f97316] leading-none">
                    {currentUser.totalScore}
                  </p>
                </div>
                <div className="h-10 w-px bg-white/10" />
                <div className="text-right">
                  <p className="text-[9px] font-bold text-white/20 uppercase tracking-widest mb-1">
                    Nodes
                  </p>
                  <p className="text-2xl font-black italic text-white leading-none">
                    {currentUser.quizzesTaken}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
