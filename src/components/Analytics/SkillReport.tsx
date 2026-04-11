export default function SkillReport({ stats }: { stats: any }) {
  if (!stats)
    return (
      <div className="text-slate-500 animate-pulse">Loading Analytics...</div>
    );

  return (
    <div className="bg-slate-900/50 border border-white/10 p-6 rounded-3xl space-y-6">
      <h3 className="text-xs font-black text-indigo-400 uppercase tracking-widest">
        Weak Area Analysis
      </h3>
      {Object.entries(stats).map(([topic, stat]: any) => (
        <div key={topic} className="space-y-2">
          <div className="flex justify-between text-[10px] font-bold uppercase">
            <span className="text-slate-400">{topic}</span>
            <span
              className={stat.average < 5 ? "text-red-500" : "text-green-500"}
            >
              {stat.average}/10
            </span>
          </div>
          <div className="w-full bg-black h-1.5 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-1000 ${
                stat.average < 5 ? "bg-red-600" : "bg-green-600"
              }`}
              style={{ width: `${stat.average * 10}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
