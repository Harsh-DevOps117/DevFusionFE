"use client";

import { ArrowLeft, BookOpen, List, Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

// ✅ Import PlaylistService from our centralized index
import { PlaylistService } from "../services/index";

import AddProblemToPlaylistModal from "../components/AddProblemToPlaylistModal";
import CreatePlaylistModal from "../components/CreatePlaylistModal";

export default function PlaylistsPage() {
  const [playlists, setPlaylists] = useState<any[]>([]);
  const [openModal, setOpenModal] = useState<string | null>(null);
  const [openCreate, setOpenCreate] = useState(false);

  const navigate = useNavigate();

  const fetchPlaylists = async () => {
    try {
      // ✅ Use centralized service
      const res = await PlaylistService.getAll();
      setPlaylists(res.data.playlists || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchPlaylists();
  }, []);

  const handleDelete = async (id: string) => {
    const confirmDelete = confirm(
      "Are you sure you want to delete this playlist?",
    );
    if (!confirmDelete) return;

    try {
      // ✅ Use centralized service
      await PlaylistService.delete(id);
      fetchPlaylists();
    } catch (err) {
      console.error("Failed to delete playlist:", err);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white pb-20">
      {/* Background Grid */}
      <div className="fixed inset-0 bg-[linear-gradient(to_right,#1a1a1a_1px,transparent_1px),linear-gradient(to_bottom,#1a1a1a_1px,transparent_1px)] bg-[size:50px_50px] opacity-20 pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-6 pt-12">
        {/* BACK BUTTON + HEADER */}
        <div className="flex items-center justify-between mb-10">
          <button
            onClick={() => navigate("/")}
            className="group flex items-center gap-3 text-white/70 hover:text-white transition-all"
          >
            <div className="w-10 h-10 flex items-center justify-center bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl transition-all group-hover:-translate-x-1">
              <ArrowLeft size={20} />
            </div>
            <span className="font-medium tracking-wide">Back to Dashboard</span>
          </button>

          <div className="text-xs font-mono uppercase tracking-widest text-white/40">
            PLAYLIST MANAGEMENT
          </div>
        </div>

        {/* MAIN HEADER */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <h1 className="text-6xl font-black tracking-tighter bg-gradient-to-b from-white to-white/70 bg-clip-text text-transparent">
              PLAYLISTS
            </h1>
            <p className="text-white/40 mt-2 text-lg">
              Organize problems into curated collections
            </p>
          </div>

          <button
            onClick={() => setOpenCreate(true)}
            className="flex items-center gap-3 bg-[#f97316] hover:bg-orange-500 active:scale-95 transition-all text-black font-bold px-8 py-4 rounded-2xl shadow-xl shadow-[#f97316]/30"
          >
            <Plus size={22} />
            CREATE NEW PLAYLIST
          </button>
        </div>

        {/* PLAYLISTS GRID */}
        {playlists.length === 0 ? (
          <div className="h-96 flex flex-col items-center justify-center text-center border border-white/10 rounded-3xl">
            <List size={64} className="text-white/10 mb-6" />
            <p className="text-2xl font-medium text-white/40">
              No playlists yet
            </p>
            <p className="text-white/30 mt-2">
              Create your first playlist to get started
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {playlists.map((p) => (
              <div
                key={p.id}
                className="group relative bg-white/5 border border-white/10 hover:border-[#f97316]/30 rounded-3xl p-7 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-[#f97316]/10"
              >
                {/* Delete Button */}
                <button
                  onClick={() => handleDelete(p.id)}
                  className="absolute top-5 right-5 w-8 h-8 flex items-center justify-center text-red-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all hover:bg-white/10 rounded-xl z-10"
                >
                  <Trash2 size={18} />
                </button>

                {/* Card Content */}
                <div
                  onClick={() => navigate(`/playlist/${p.id}`)}
                  className="cursor-pointer"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-11 h-11 bg-gradient-to-br from-[#f97316]/10 to-orange-500/10 border border-[#f97316]/20 rounded-2xl flex items-center justify-center">
                      <BookOpen className="text-[#f97316]" size={24} />
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold tracking-tight group-hover:text-[#f97316] transition-colors">
                        {p.name}
                      </h2>
                      <p className="text-white/40 text-xs font-mono mt-0.5">
                        {p.problems?.length || 0} PROBLEMS
                      </p>
                    </div>
                  </div>

                  <p className="text-white/60 text-[15px] line-clamp-3 min-h-[66px]">
                    {p.description || "No description provided."}
                  </p>
                </div>

                {/* Add Problems Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setOpenModal(p.id);
                  }}
                  className="mt-6 w-full bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[#f97316]/30 py-3.5 rounded-2xl text-sm font-medium text-[#f97316] transition-all relative z-10"
                >
                  + ADD PROBLEMS
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* MODALS */}
      {openModal && (
        <AddProblemToPlaylistModal
          playlistId={openModal}
          onClose={() => setOpenModal(null)}
        />
      )}

      {openCreate && (
        <CreatePlaylistModal
          onClose={() => setOpenCreate(false)}
          onSuccess={fetchPlaylists}
        />
      )}
    </div>
  );
}
