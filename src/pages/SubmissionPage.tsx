import { useEffect, useState } from "react";

// ✅ Import SubmissionService from our centralized index
import { SubmissionService } from "../services/index";

export default function SubmissionsPage() {
  const [subs, setSubs] = useState<any[]>([]);

  useEffect(() => {
    // ✅ Use the centralized SubmissionService
    SubmissionService.getAll()
      .then((res) => setSubs(res.data.submissions || []))
      .catch(console.error);
  }, []);

  const statusStyle = (status: string) => {
    if (status === "Accepted")
      return "text-green-400 bg-green-400/10 border-green-400/20";
    if (status === "Wrong Answer")
      return "text-red-400 bg-red-400/10 border-red-400/20";
    return "text-yellow-400 bg-yellow-400/10 border-yellow-400/20";
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white px-6 pt-32">
      <h1 className="text-3xl font-machina-bold mb-8">Submissions</h1>

      {subs.length === 0 ? (
        <div className="text-center text-white/40 mt-20">
          No submissions yet 🚫
        </div>
      ) : (
        <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-xl">
          {/* TABLE HEADER */}
          <div className="grid grid-cols-12 px-6 py-4 text-white/50 text-sm border-b border-white/10">
            <span className="col-span-3">Problem</span>
            <span className="col-span-2">Status</span>
            <span className="col-span-2">Language</span>
            <span className="col-span-2">Runtime</span>
            <span className="col-span-3 text-right">Submitted</span>
          </div>

          {subs.map((s) => (
            <div
              key={s.id}
              className="grid grid-cols-12 px-6 py-4 border-b border-white/10 hover:bg-white/5 transition group items-center"
            >
              <span className="col-span-3 text-white group-hover:text-[#f97316] transition-colors">
                {s.problem?.title || "Unknown Problem"}
              </span>

              <span className="col-span-2">
                <span
                  className={`px-3 py-1 rounded-full text-xs border ${statusStyle(
                    s.status,
                  )}`}
                >
                  {s.status}
                </span>
              </span>

              {/* LANGUAGE */}
              <span className="col-span-2 text-white/70">{s.language}</span>

              <span className="col-span-2 text-white/60 font-mono text-sm">
                {s.time ? JSON.parse(s.time)?.[0] || "-" : "-"}
              </span>

              <span className="col-span-3 text-right text-white/40 text-sm">
                {new Date(s.createdAt).toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
