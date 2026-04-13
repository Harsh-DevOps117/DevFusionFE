import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
// import Navbar from "../components/Navbar";

// ✅ 1. Import ProblemService from our centralized index
import { ProblemService } from "../services/index";

export default function ProblemsPage() {
  const [problems, setProblems] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    // ✅ 2. Use the centralized ProblemService
    ProblemService.getAll()
      .then((res) => setProblems(res.data.problems || []))
      .catch(console.error);
  }, []);

  const filtered = problems.filter((p) =>
    p.title.toLowerCase().includes(search.toLowerCase()),
  );

  const difficultyStyle = (d: string) => {
    if (d === "Easy")
      return "text-green-400 bg-green-400/10 border-green-400/20";
    if (d === "Medium")
      return "text-yellow-400 bg-yellow-400/10 border-yellow-400/20";
    return "text-red-400 bg-red-400/10 border-red-400/20";
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white px-6 pt-32 font-['fontNormal']">
      {/* <Navbar /> */}

      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-12 gap-6">
          <div>
            <h1
              style={{ fontFamily: "fontNormal" }}
              className="text-5xl font-black tracking-tighter uppercase"
            >
              Problems<span className="text-[#f97316]">.</span>
            </h1>
            <p className="text-white/20 text-[10px] font-black uppercase tracking-[0.3em] mt-2">
              Registry_Sync: {filtered.length} Neural_Nodes_Detected
            </p>
          </div>

          <input
            placeholder="SEARCH_REGISTRY..."
            className="px-6 py-4 bg-white/[0.02] border border-white/5 rounded-2xl
            w-full md:w-96 focus:outline-none focus:border-[#f97316]/50 transition-all
            font-mono text-sm placeholder:text-white/10 shadow-inner"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="bg-white/[0.01] border border-white/5 rounded-[2.5rem] overflow-hidden backdrop-blur-3xl shadow-2xl">
          {/* HEADER ROW */}
          <div className="grid grid-cols-12 px-8 py-5 text-white/20 text-[10px] font-black uppercase tracking-[0.2em] border-b border-white/5 bg-white/[0.02]">
            <span className="col-span-1">#</span>
            <span className="col-span-4">Title</span>
            <span className="col-span-3">Core_Tags</span>
            <span className="col-span-2">Difficulty</span>
            <span className="col-span-2 text-right">Access</span>
          </div>

          {filtered.length === 0 ? (
            <div className="p-20 text-center">
              <p className="text-white/10 text-xs font-black uppercase tracking-widest animate-pulse">
                Null_Result: No registry entries found.
              </p>
            </div>
          ) : (
            filtered.map((p, i) => (
              <div
                key={p.id}
                onClick={() => navigate(`/problem/${p.id}`)}
                className="grid grid-cols-12 px-8 py-6 border-b border-white/5
                hover:bg-[#f97316]/[0.02] transition-all duration-300 cursor-pointer group items-center"
              >
                {/* INDEX */}
                <span className="col-span-1 text-white/10 font-mono text-xs italic">
                  {String(i + 1).padStart(2, "0")}
                </span>

                {/* TITLE */}
                <div className="col-span-4 pr-4">
                  <span className="text-white font-black italic tracking-tight group-hover:text-[#f97316] transition-all duration-300 uppercase block truncate">
                    {p.title}
                  </span>
                </div>

                {/* TAGS */}
                <div className="col-span-3 flex flex-wrap gap-2">
                  {p.tags?.slice(0, 3).map((tag: string) => (
                    <span
                      key={tag}
                      className="px-2.5 py-1 text-[9px] font-black rounded-lg bg-white/[0.03] border border-white/5 text-white/30 uppercase tracking-tighter group-hover:border-white/10 group-hover:text-white/50 transition-all"
                    >
                      {tag}
                    </span>
                  ))}
                  {p.tags?.length > 3 && (
                    <span className="text-[9px] text-white/10 font-black">
                      +{p.tags.length - 3}
                    </span>
                  )}
                </div>

                {/* DIFFICULTY */}
                <div className="col-span-2">
                  <span
                    className={`px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest border transition-all ${difficultyStyle(
                      p.difficulty,
                    )}`}
                  >
                    {p.difficulty}
                  </span>
                </div>

                {/* ACTION */}
                <div className="col-span-2 text-right">
                  <span className="text-[10px] font-black uppercase tracking-widest text-[#f97316] opacity-0 group-hover:opacity-100 transition-all duration-500 translate-x-4 group-hover:translate-x-0 inline-block">
                    Solve_Node →
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
