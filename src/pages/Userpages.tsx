"use client";

import {
  ChevronRight,
  Flame,
  LogOut,
  Target,
  TrendingUp,
  Trophy,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../store/authSlice";
import { api } from "../utils/api";

export default function UserProfile() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get("/user/profile");
        console.log(res.data);
        if (res.data.success) setUser(res.data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleLogout = async () => {
    try {
      await api.post("/logout");
    } catch (err) {
      console.error("Logout error", err);
    } finally {
      dispatch(logout());
      navigate("/");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-zinc-800 border-t-[#f97316] rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-zinc-400 font-machina-normal">
      {/* Top Navigation */}
      <nav className="border-b border-white/5 bg-[#0a0a0a]/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="text-xl font-bold text-white tracking-tighter">
              PREPGRID
            </div>
            <div className="text-xs px-2.5 py-1 rounded-full bg-white/5 text-white/60">
              Console
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-sm text-zinc-400 hover:text-red-400 transition-colors px-4 py-2 rounded-2xl hover:bg-red-500/10"
          >
            <LogOut size={18} />
            <span className="font-medium">Sign Out</span>
          </button>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="flex flex-col lg:flex-row gap-10">
          {/* Left Sidebar - Profile Card */}
          <div className="lg:w-96 flex-shrink-0">
            <div className="bg-zinc-950 border border-white/10 rounded-3xl p-8 sticky top-24">
              <div className="flex flex-col items-center text-center">
                <div className="relative mb-6">
                  <div className="w-28 h-28 rounded-2xl bg-gradient-to-br from-zinc-900 to-black border border-white/10 flex items-center justify-center text-5xl font-bold text-white shadow-inner">
                    {user.name?.[0].toUpperCase()}
                  </div>
                  {user.plan === "PRO" && (
                    <div className="absolute -bottom-1 -right-1 bg-gradient-to-r from-[#f97316] to-orange-500 text-black text-[10px] font-bold px-3 py-1 rounded-xl shadow-lg">
                      PRO
                    </div>
                  )}
                </div>

                <h1 className="text-3xl font-bold text-white tracking-tighter">
                  {user.name}
                </h1>
                <p className="text-zinc-500 mt-1">{user.email}</p>
                <p className="text-xs uppercase tracking-widest text-[#f97316] mt-4 font-medium">
                  {user.role} • PREPGRID
                </p>
              </div>

              <div className="mt-10 grid grid-cols-2 gap-4">
                <div className="bg-zinc-900/50 border border-white/5 rounded-2xl p-4 text-center">
                  <p className="text-3xl font-bold text-emerald-400">
                    {user._count?.problemSolved || 0}
                  </p>
                  <p className="text-xs text-zinc-500 mt-1">Problems Solved</p>
                </div>
                <div className="bg-zinc-900/50 border border-white/5 rounded-2xl p-4 text-center">
                  <p className="text-3xl font-bold text-amber-400">
                    {user._count?.quizAttempts || 0}
                  </p>
                  <p className="text-xs text-zinc-500 mt-1">Quizzes Taken</p>
                </div>
              </div>

              {/* Streak Card */}
              <div className="mt-6 bg-gradient-to-br from-orange-500/10 to-transparent border border-[#f97316]/20 rounded-3xl p-6">
                <div className="flex items-center gap-3">
                  <Flame className="text-orange-500" size={28} />
                  <div>
                    <p className="text-sm text-orange-400 font-medium">
                      Current Streak
                    </p>
                    <p className="text-5xl font-bold text-white tracking-tighter mt-1">
                      {user.currentStreak}{" "}
                      <span className="text-lg font-normal text-orange-400/70">
                        days
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 space-y-10">
            {/* Recent Interviews */}
            <section>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <Target className="text-[#f97316]" size={22} />
                  <h2 className="text-lg font-semibold text-white">
                    Recent Interviews
                  </h2>
                </div>
                <button className="text-xs text-zinc-500 hover:text-white flex items-center gap-1 transition-colors">
                  View All <ChevronRight size={16} />
                </button>
              </div>

              <div className="space-y-3">
                {user.interviews?.length > 0 ? (
                  user.interviews.slice(0, 4).map((int: any) => (
                    <div
                      key={int.id}
                      className="bg-zinc-950 border border-white/5 hover:border-white/10 rounded-2xl p-6 flex items-center justify-between group transition-all"
                    >
                      <div className="flex items-center gap-5">
                        <div className="w-12 h-12 bg-zinc-900 rounded-xl flex items-center justify-center">
                          <Trophy size={22} className="text-amber-400" />
                        </div>
                        <div>
                          <p className="font-medium text-white">{int.role}</p>
                          <p className="text-xs text-zinc-500 mt-0.5">
                            {new Date(int.createdAt).toLocaleDateString(
                              "en-US",
                              {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              },
                            )}
                          </p>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="text-2xl font-bold text-white tabular-nums">
                          {int.totalScore || 0}
                          <span className="text-xs text-zinc-500">/10</span>
                        </div>
                        <div className="text-[10px] text-emerald-400">
                          Good Performance
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="bg-zinc-950 border border-white/5 rounded-3xl p-16 text-center">
                    <p className="text-zinc-500">
                      No interviews yet. Start practicing!
                    </p>
                  </div>
                )}
              </div>
            </section>

            {/* Performance Overview */}
            <section>
              <div className="flex items-center gap-3 mb-6">
                <TrendingUp className="text-[#f97316]" size={22} />
                <h2 className="text-lg font-semibold text-white">
                  Performance Overview
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {user.quizAttempts?.slice(0, 4).map((attempt: any) => (
                  <div
                    key={attempt.id}
                    className="bg-zinc-950 border border-white/5 rounded-3xl p-7 hover:border-white/10 transition-all group"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-[#f97316] text-sm font-medium tracking-wider">
                          {attempt.quiz.topic}
                        </p>
                        <p className="text-xs text-zinc-500 mt-1">
                          Attempt #{attempt.attemptNumber}
                        </p>
                      </div>
                      <div className="text-right">
                        <span className="text-4xl font-bold text-white tabular-nums">
                          {attempt.score}
                        </span>
                        <span className="text-zinc-500 text-sm">%</span>
                      </div>
                    </div>

                    <div className="mt-6 h-1.5 bg-zinc-900 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-[#f97316] to-orange-500 rounded-full transition-all duration-700"
                        style={{ width: `${attempt.score}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
