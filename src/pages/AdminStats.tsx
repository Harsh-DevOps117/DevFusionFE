"use client";
import {
  Activity,
  BookOpen,
  DollarSign,
  Target,
  Trophy,
  Users,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

// IMPORTANT: Ensure this points to the file where you added the Interceptor!
import { getAdminStats } from "../services/api";

export default function AdminDashboard() {
  const [data, setData] = useState<any>(null);
  const navigate = useNavigate();

  // Get Auth state from Redux
  const { user, isAuthenticated } = useSelector((state: any) => state.auth);

  useEffect(() => {
    // 1. HARD GUARD: If not logged in, kick to home
    if (!isAuthenticated) {
      navigate("/");
      return;
    }

    // 2. ROLE GUARD: If logged in but NOT an Admin, kick to home
    // NOTE: If your DB says "USER", this will trigger.
    if (user?.role !== "ADMIN") {
      console.error("Current User Role:", user?.role); // Debugging
      toast.error("UNAUTHORIZED: ADMIN ACCESS ONLY");
      navigate("/");
      return;
    }

    // 3. EXECUTE: Fetch Admin Data
    const fetchStats = async () => {
      try {
        const res = await getAdminStats();
        setData(res.data);
      } catch (err: any) {
        console.error(
          "Dashboard Fetch Error:",
          err.response?.data || err.message,
        );

        if (err.response?.status === 401) {
          toast.error("Protocol Error: Token Invalid or Role Mismatch");
          // navigate("/");
        } else {
          toast.error("Failed to sync with Core Stats.");
        }
      }
    };

    fetchStats();
  }, [isAuthenticated, user, navigate]);

  // Loading State
  if (!data) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-2 border-[#f97316] border-t-transparent rounded-full animate-spin" />
          <p className="text-white/30 text-[10px] font-black tracking-[0.5em] uppercase">
            Initialising_Secure_Link...
          </p>
        </div>
      </div>
    );
  }

  const { stats, leaderboard, topCreators, mostAttempted, difficultyStats } =
    data;

  return (
    <div className="min-h-screen bg-[#050505] text-white pb-20 font-['fontNormal']">
      {/* HUD Background */}
      <div className="fixed inset-0 bg-[linear-gradient(to_right,#1a1a1a_1px,transparent_1px),linear-gradient(to_bottom,#1a1a1a_1px,transparent_1px)] bg-[size:50px_50px] opacity-20 pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-6 pt-10">
        {/* HEADER */}
        <div className="flex items-center justify-between mb-12">
          <div>
            <button
              onClick={() => navigate("/")}
              className="text-white/40 hover:text-[#f97316] text-[10px] font-bold uppercase tracking-widest transition-colors mb-4"
            >
              ← Return_To_Terminal
            </button>
            <h1 className="text-5xl font-black tracking-tighter uppercase italic">
              Admin_Dashboard
            </h1>
            <p className="text-white/20 text-xs mt-2 uppercase tracking-[0.2em]">
              Operator: <span className="text-white/60">{user?.name}</span> •
              Clearance: <span className="text-[#f97316]">{user?.role}</span>
            </p>
          </div>

          <div className="bg-white/5 border border-white/10 px-5 py-3 rounded-2xl flex items-center gap-3">
            <div className="w-2 h-2 bg-[#f97316] rounded-full animate-pulse shadow-[0_0_10px_#f97316]" />
            <span className="text-[10px] font-mono font-bold tracking-[0.3em] text-white/40">
              LIVE_DATA_STREAM
            </span>
          </div>
        </div>

        {/* MAIN STATS */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          <StatCard
            icon={<Users size={20} />}
            title="Registry_Users"
            value={stats.totalUsers}
          />
          <StatCard
            icon={<BookOpen size={20} />}
            title="Neural_Nodes"
            value={stats.totalProblems}
          />
          <StatCard
            icon={<Target size={20} />}
            title="Handshakes"
            value={stats.totalSubmissions}
          />
          <StatCard
            icon={<DollarSign size={20} />}
            title="Net_Efficiency"
            value={`₹${stats.revenue}`}
            color="#22c55e"
          />
        </div>

        {/* DATA GRID */}
        <div className="grid lg:grid-cols-2 gap-8">
          <DashboardSection
            title="🏆 Top_Solvers_Array"
            icon={<Trophy size={16} />}
          >
            {leaderboard?.map((l: any, i: number) => (
              <DataRow key={i} rank={i + 1}>
                <span className="text-white/80">{l.user?.name}</span>
                <span className="text-[#f97316] font-mono font-bold">
                  {l.solved}
                </span>
              </DataRow>
            ))}
          </DashboardSection>

          <DashboardSection
            title="📊 Difficulty_Weight"
            icon={<Activity size={16} />}
          >
            {difficultyStats?.map((d: any, i: number) => (
              <DataRow key={i} rank={i + 1}>
                <span className="capitalize text-white/80">{d.difficulty}</span>
                <span className="text-[#f97316] font-mono font-bold">
                  {d._count.difficulty}
                </span>
              </DataRow>
            ))}
          </DashboardSection>
        </div>
      </div>
    </div>
  );
}

/* --- Styled Sub-Components --- */

function StatCard({ icon, title, value, color = "#f97316" }: any) {
  return (
    <div className="bg-[#0a0a0a] border border-white/5 rounded-[2rem] p-8 hover:border-white/20 transition-all group">
      <div className="flex items-center gap-4 mb-6">
        <div className="text-white/20 group-hover:text-[#f97316] transition-colors">
          {icon}
        </div>
        <p className="text-[9px] font-black text-white/20 uppercase tracking-widest">
          {title}
        </p>
      </div>
      <h2
        className="text-4xl font-black italic tracking-tighter text-white"
        style={{ color: color === "#f97316" ? "white" : color }}
      >
        {value?.toLocaleString() || 0}
      </h2>
    </div>
  );
}

function DashboardSection({ title, icon, children }: any) {
  return (
    <div className="bg-[#0a0a0a] border border-white/5 rounded-[2.5rem] overflow-hidden">
      <div className="px-8 py-6 border-b border-white/5 flex items-center gap-3 bg-white/[0.02]">
        <div className="text-[#f97316]">{icon}</div>
        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">
          {title}
        </h3>
      </div>
      <div className="divide-y divide-white/5">{children}</div>
    </div>
  );
}

function DataRow({ rank, children }: any) {
  return (
    <div className="flex items-center justify-between px-8 py-5 hover:bg-white/[0.02] transition-colors">
      <div className="flex items-center gap-6">
        <span className="text-[10px] font-mono text-white/10">
          #{String(rank).padStart(2, "0")}
        </span>
        <div className="flex items-center justify-between w-[300px] sm:w-[400px]">
          {children}
        </div>
      </div>
    </div>
  );
}
