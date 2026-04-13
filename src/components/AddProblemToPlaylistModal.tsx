import { useEffect, useState } from "react";
import { PlaylistService, ProblemService } from "../services/index";

interface Problem {
  id: string;
  title: string;
}

export default function AddProblemToPlaylistModal({
  playlistId,
  onClose,
}: any) {
  const [problems, setProblems] = useState<Problem[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  useEffect(() => {
    ProblemService.getAll()
      .then((res) => setProblems(res.data.problems || []))
      .catch((err) => console.error("Failed to load problems:", err));
  }, []);

  const toggle = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  const handleAdd = async () => {
    if (selected.length === 0) return;

    setIsSubmitting(true);
    try {
      await PlaylistService.addProblem(playlistId, selected);
      onClose();
    } catch (error) {
      console.error("Failed to add problems to playlist:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur flex items-center justify-center z-50">
      <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl w-[500px] p-6">
        <h2 className="text-xl mb-4">Add Problems</h2>

        <div className="max-h-80 overflow-y-auto space-y-2">
          {problems.map((p) => (
            <div
              key={p.id}
              onClick={() => toggle(p.id)}
              className={`p-3 rounded-xl cursor-pointer border transition-colors ${
                selected.includes(p.id)
                  ? "border-[#f97316] bg-[#f97316]/10"
                  : "border-white/10 bg-white/5 hover:bg-white/10"
              }`}
            >
              {p.title}
            </div>
          ))}

          {/* Helpful empty state */}
          {problems.length === 0 && (
            <div className="text-white/50 text-center py-4">
              Loading problems...
            </div>
          )}
        </div>

        <div className="flex justify-end mt-4 gap-2">
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="text-white/50 hover:text-white transition-colors px-4 py-2"
          >
            Cancel
          </button>

          <button
            onClick={handleAdd}
            disabled={isSubmitting || selected.length === 0}
            className={`px-4 py-2 rounded transition-all ${
              isSubmitting || selected.length === 0
                ? "bg-[#f97316]/50 cursor-not-allowed text-white/70"
                : "bg-[#f97316] hover:bg-[#ea580c] text-white"
            }`}
          >
            {isSubmitting ? "Adding..." : "Add"}
          </button>
        </div>
      </div>
    </div>
  );
}
