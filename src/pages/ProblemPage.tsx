import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { getProblems } from "../services/api";

export default function ProblemsPage() {
  const [problems, setProblems] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    getProblems()
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
    <div className="min-h-screen bg-[#0a0a0a] text-white px-6 pt-32">
      <Navbar></Navbar>

      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
        <h1 className="text-3xl font-machina-bold">Problems</h1>

        <input
          placeholder="Search problems..."
          className="px-4 py-3 bg-white/5 border border-white/10 rounded-xl
          w-full md:w-80 focus:outline-none focus:ring-1 focus:ring-[#f97316]"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-xl">
        {/* HEADER ROW */}
        <div className="grid grid-cols-12 px-6 py-4 text-white/50 text-sm border-b border-white/10">
          <span className="col-span-1">#</span>
          <span className="col-span-6">Title</span>
          <span className="col-span-3">Difficulty</span>
          <span className="col-span-2 text-right">Action</span>
        </div>

        {filtered.length === 0 ? (
          <div className="p-10 text-center text-white/40">
            No problems found 🚫
          </div>
        ) : (
          filtered.map((p, i) => (
            <div
              key={p.id}
              onClick={() => navigate(`/problem/${p.id}`)}
              className="grid grid-cols-12 px-6 py-4 border-b border-white/10
              hover:bg-white/5 transition cursor-pointer group"
            >
              {/* INDEX */}
              <span className="col-span-1 text-white/40">{i + 1}</span>

              {/* TITLE */}
              <span className="col-span-6 text-white group-hover:text-[#f97316] transition">
                {p.title}
              </span>

              {/* DIFFICULTY */}
              <span className="col-span-3">
                <span
                  className={`px-3 py-1 rounded-full text-xs border ${difficultyStyle(
                    p.difficulty,
                  )}`}
                >
                  {p.difficulty}
                </span>
              </span>

              {/* ACTION */}
              <span className="col-span-2 text-right text-[#f97316] opacity-0 group-hover:opacity-100 transition">
                Solve →
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
