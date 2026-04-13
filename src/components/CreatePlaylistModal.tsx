import { useState } from "react";
// ✅ Import PlaylistService from our centralized index
import { PlaylistService } from "../services/index";

// Optional but recommended: Typed props instead of 'any'
interface CreatePlaylistModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

export default function CreatePlaylistModal({
  onClose,
  onSuccess,
}: CreatePlaylistModalProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCreate = async () => {
    if (!name.trim() || !description.trim()) {
      alert("Name and Description are required");
      return;
    }

    try {
      setLoading(true);

      // ✅ Use the centralized service
      await PlaylistService.create({
        name,
        description,
      });

      onSuccess();
      onClose();
    } catch (err) {
      console.error(err);
      alert("Failed to create playlist");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur flex items-center justify-center z-50">
      <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl w-[420px] p-6">
        <h2 className="text-xl mb-5 text-white">Create Playlist</h2>

        <input
          placeholder="Playlist name"
          className="w-full mb-3 px-4 py-2 bg-black/50 border border-white/10 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#f97316] text-white placeholder:text-white/30 transition-all"
          value={name}
          onChange={(e) => setName(e.target.value)}
          disabled={loading}
        />

        <textarea
          placeholder="Description"
          className="w-full mb-4 px-4 py-2 bg-black/50 border border-white/10 rounded-xl resize-none focus:outline-none focus:ring-1 focus:ring-[#f97316] text-white placeholder:text-white/30 transition-all"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          disabled={loading}
        />

        <div className="flex justify-end gap-3 mt-2">
          <button
            onClick={onClose}
            disabled={loading}
            className="text-white/50 hover:text-white transition-colors px-3 py-2 disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            onClick={handleCreate}
            disabled={loading || !name.trim() || !description.trim()}
            className={`px-6 py-2 rounded-xl transition-all ${
              loading || !name.trim() || !description.trim()
                ? "bg-[#f97316]/50 text-black/50 cursor-not-allowed"
                : "bg-[#f97316] text-black shadow-[0_0_20px_rgba(249,115,22,0.3)] hover:bg-orange-500 hover:shadow-[0_0_25px_rgba(249,115,22,0.5)] active:scale-95"
            }`}
          >
            {loading ? "Creating..." : "Create"}
          </button>
        </div>
      </div>
    </div>
  );
}
