"use client";

import {
  Activity,
  Brain,
  ChevronRight,
  Clock,
  Code2,
  LayoutDashboard,
  LogOut,
  Trophy,
  Zap,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { logout } from "../store/authSlice";

// ✅ Import our centralized services
import { AuthService, UserService } from "../services/index";

export default function UserProfile() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        // ✅ Use centralized UserService
        const res = await UserService.getProfile();
        if (res.data.success) setUser(res.data.data);
      } catch (err) {
        console.error(err);
        toast.error("SYSTEM_ERROR: Data Link Severed.");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleLogout = async () => {
    try {
      // ✅ Use centralized AuthService
      await AuthService.logout();
    } catch (err) {
      console.error(err);
    } finally {
      dispatch(logout());
      toast.success("SESSION_TERMINATED.");
      navigate("/");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#020202] flex flex-col items-center justify-center font-mono">
        <div className="w-10 h-10 border-2 border-white/5 border-t-[#f97316] rounded-full animate-spin mb-4" />
        <p className="text-[9px] font-black uppercase tracking-[0.5em] text-white/20">
          Syncing_Neural_Profile
        </p>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-[#020202] text-zinc-400 font-['fontNormal'] selection:bg-[#f97316]/30">
      {/* NAV */}
      <nav className="border-b border-white/5 bg-[#020202]/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <a
              href="/"
              className="text-lg font-black text-white tracking-tighter"
            >
              PREPGRID<span className="text-[#f97316]">.</span>
            </a>
            <div className="hidden sm:flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.2em] text-white/20 border-l border-white/10 pl-6">
              <Activity size={12} className="text-[#f97316]/50" />
              Node: <span className="text-emerald-500/80">Active</span>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-zinc-500 hover:text-white transition-all px-4 py-2 rounded-lg border border-white/5 hover:bg-red-500/5"
          >
            <LogOut size={12} />
            <span>Logout</span>
          </button>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex flex-col lg:flex-row gap-12 items-start">
          {/* LEFT SIDEBAR (Profile + Stats + Test Scores) */}
          <div className="lg:w-[320px] w-full flex-shrink-0 space-y-6 lg:sticky lg:top-24">
            {/* 1. IDENTITY CARD */}
            <div className="bg-zinc-900/10 border border-white/5 rounded-2xl p-8 flex flex-col items-center text-center">
              <div className="relative mb-6">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-b from-zinc-800 to-zinc-950 border border-white/10 flex items-center justify-center text-3xl font-black text-white shadow-2xl">
                  {user.name?.[0].toUpperCase()}
                </div>
                {user.plan === "PRO" && (
                  <div className="absolute -bottom-1 -right-1 bg-[#f97316] text-black text-[8px] font-black px-2 py-0.5 rounded shadow-lg uppercase tracking-tighter">
                    PRO
                  </div>
                )}
              </div>
              <h1 className="text-xl font-black text-white tracking-tight uppercase italic">
                {user.name}
              </h1>
              <p className="text-zinc-600 text-[9px] font-bold uppercase tracking-widest mt-1">
                {user.email}
              </p>

              {/* Quick Summary Stats */}
              <div className="flex gap-4 mt-6 w-full pt-6 border-t border-white/5">
                <div className="flex-1">
                  <p className="text-[8px] font-black text-zinc-600 uppercase mb-1">
                    Solved
                  </p>
                  <p className="text-lg font-black text-white">
                    {user._count?.problemSolved || 0}
                  </p>
                </div>
                <div className="flex-1 border-l border-white/5">
                  <p className="text-[8px] font-black text-zinc-600 uppercase mb-1">
                    Streak
                  </p>
                  <p className="text-lg font-black text-[#f97316]">
                    {user.currentStreak}
                    <span className="text-[10px] ml-0.5">D</span>
                  </p>
                </div>
              </div>
            </div>

            {/* 2. TEST SCORES (Moved here as requested) */}
            <div className="bg-zinc-900/10 border border-white/5 rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-6">
                <LayoutDashboard size={14} className="text-[#f97316]/50" />
                <h2 className="text-[10px] font-black text-white uppercase tracking-[0.3em]">
                  Test_Metrics
                </h2>
              </div>

              <div className="space-y-5">
                {user.quizAttempts?.length > 0 ? (
                  user.quizAttempts.slice(0, 5).map((attempt: any) => (
                    <div key={attempt.id} className="group">
                      <div className="flex justify-between items-end mb-2">
                        <p className="text-[9px] font-black text-zinc-500 uppercase tracking-wider group-hover:text-white transition-colors truncate pr-2">
                          {attempt.quiz.topic}
                        </p>
                        <p className="text-xs font-black text-white italic">
                          {attempt.score}%
                        </p>
                      </div>
                      <div className="h-[2px] w-full bg-white/5 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-[#f97316]/40 to-[#f97316] rounded-full"
                          style={{ width: `${attempt.score}%` }}
                        />
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-[9px] font-black text-zinc-800 uppercase text-center py-4">
                    Null_Data
                  </p>
                )}
              </div>
            </div>

            {/* 3. QUICK LINKS */}
            <div className="bg-zinc-900/10 border border-white/5 rounded-2xl p-4 space-y-1">
              <button
                onClick={() => navigate("/problems")}
                className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-white/5 transition-all group"
              >
                <div className="flex items-center gap-3">
                  <Code2
                    size={14}
                    className="text-zinc-600 group-hover:text-[#f97316]"
                  />
                  <span className="text-[9px] font-black uppercase text-zinc-500 group-hover:text-zinc-300">
                    Registry_Problems
                  </span>
                </div>
                <ChevronRight size={12} className="text-white/10" />
              </button>
              <button
                onClick={() => navigate("/mcq")}
                className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-white/5 transition-all group"
              >
                <div className="flex items-center gap-3">
                  <Brain
                    size={14}
                    className="text-zinc-600 group-hover:text-[#f97316]"
                  />
                  <span className="text-[9px] font-black uppercase text-zinc-500 group-hover:text-zinc-300">
                    Neural_Tests
                  </span>
                </div>
                <ChevronRight size={12} className="text-white/10" />
              </button>
            </div>
          </div>

          {/* RIGHT MAIN CONTENT: INTERVIEW REGISTRY */}
          <div className="flex-1 w-full space-y-10">
            <section>
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#f97316] shadow-[0_0_10px_#f97316]" />
                  <h2 className="text-lg font-black text-white uppercase tracking-[0.4em] italic">
                    Interview_Registry
                  </h2>
                </div>
              </div>

              <div className="grid gap-4">
                {user.interviews?.length > 0 ? (
                  user.interviews.map((int: any) => (
                    <div
                      key={int.id}
                      className="group bg-zinc-900/5 border border-white/5 hover:border-[#f97316]/20 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between transition-all duration-300"
                    >
                      <div className="flex items-center gap-8 w-full sm:w-auto">
                        <div className="w-12 h-12 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-center group-hover:border-[#f97316]/30 transition-all">
                          {int.status === "COMPLETED" ? (
                            <Trophy
                              size={18}
                              className="text-amber-500/50 group-hover:text-amber-500 transition-colors"
                            />
                          ) : (
                            <Zap
                              size={18}
                              className="text-[#f97316] animate-pulse"
                            />
                          )}
                        </div>
                        <div>
                          <h3 className="text-sm font-black text-white uppercase tracking-widest group-hover:text-[#f97316] transition-colors">
                            {int.role}
                          </h3>
                          <div className="flex items-center gap-4 mt-1.5">
                            <div className="flex items-center gap-1.5 text-[8px] font-bold text-zinc-600 uppercase tracking-widest">
                              <Clock size={10} />
                              {new Date(int.createdAt).toLocaleDateString()}
                            </div>
                            <span
                              className={`text-[8px] font-black px-2 py-0.5 rounded uppercase tracking-tighter ${
                                int.status === "COMPLETED"
                                  ? "text-emerald-500/70"
                                  : "text-[#f97316]/70"
                              }`}
                            >
                              {int.status}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="mt-6 sm:mt-0 w-full sm:w-auto flex items-center justify-end">
                        {int.status === "IN_PROGRESS" ? (
                          <button
                            onClick={() => navigate(`/interview/${int.id}`)}
                            className="group/btn flex items-center gap-2 bg-[#f97316]/10 border border-[#f97316]/30 text-[#f97316] text-[9px] font-black uppercase tracking-[0.2em] px-6 py-3 rounded-xl hover:bg-[#f97316] hover:text-black transition-all"
                          >
                            Resume_Node{" "}
                            <ChevronRight
                              size={14}
                              className="group-hover/btn:translate-x-1 transition-transform"
                            />
                          </button>
                        ) : (
                          <div className="flex items-baseline gap-1">
                            <span className="text-2xl font-black text-white tabular-nums italic">
                              {int.totalScore || 0}
                            </span>
                            <span className="text-[10px] text-zinc-700 font-bold uppercase">
                              / 10
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="border border-dashed border-white/5 rounded-3xl p-20 text-center bg-zinc-900/5">
                    <p className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-800">
                      Void_Registry
                    </p>
                  </div>
                )}
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
