"use client";

import { ArrowLeft, Code2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { PlaylistService } from "../services/index";

export default function PlaylistDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [playlist, setPlaylist] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlaylistData = async () => {
      if (!id) return;
      try {
        const res = await PlaylistService.getById(id);
        // Based on your console log, the data is inside res.data.playlist
        setPlaylist(res.data.playlist);
      } catch (err) {
        console.error("Error fetching playlist:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPlaylistData();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050505] text-white flex items-center justify-center">
        Loading playlist...
      </div>
    );
  }

  if (!playlist) {
    return (
      <div className="min-h-screen bg-[#050505] text-white flex items-center justify-center">
        Playlist not found.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white pb-20">
      <div className="relative max-w-7xl mx-auto px-6 pt-12">
        {/* Back Button */}
        <button
          onClick={() => navigate("/playlists")}
          className="group flex items-center gap-3 text-white/70 hover:text-white transition-all mb-10"
        >
          <div className="w-10 h-10 flex items-center justify-center bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl transition-all group-hover:-translate-x-1">
            <ArrowLeft size={20} />
          </div>
          <span className="font-medium tracking-wide">Back to Playlists</span>
        </button>

        {/* Playlist Header */}
        <div className="mb-12">
          <div className="text-xs font-mono uppercase tracking-widest text-[#f97316] mb-4">
            Playlist
          </div>
          <h1 className="text-6xl font-black tracking-tighter bg-gradient-to-b from-white to-white/70 bg-clip-text text-transparent">
            {playlist.name}
          </h1>
          <p className="text-white/40 mt-3 text-lg max-w-2xl">
            {playlist.description || "No description provided."}
          </p>
        </div>

        {/* Problems List */}
        <div className="bg-white/5 border border-white/10 rounded-3xl p-2 md:p-7">
          <h2 className="text-2xl font-bold mb-6 px-5 md:px-0">
            Problems ({playlist.problems?.length || 0})
          </h2>

          {playlist.problems?.length === 0 ? (
            <div className="p-10 text-center border border-dashed border-white/10 rounded-2xl">
              <p className="text-white/40">No problems added yet.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {playlist.problems?.map((item: any) => {
                // 👇 Extract the nested problem object here 👇
                const problem = item.problem;

                return (
                  <div
                    key={item.id} // Use the mapping ID for the React key
                    onClick={() => navigate(`/problem/${problem.id}`)} // Navigate to the actual problem
                    className="flex items-center justify-between p-5 bg-white/5 border border-white/5 rounded-2xl hover:bg-white/10 hover:border-[#f97316]/30 transition-all cursor-pointer group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center group-hover:bg-[#f97316]/10 group-hover:text-[#f97316] transition-colors">
                        <Code2 size={20} />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-white/90 group-hover:text-white">
                          {problem.title}
                        </h3>
                        {/* Render Tags if they exist */}
                        {problem.tags && problem.tags.length > 0 && (
                          <div className="flex gap-2 mt-2">
                            {problem.tags.map((tag: any, idx: number) => (
                              <span
                                key={idx}
                                className="text-[10px] uppercase font-mono px-2 py-0.5 bg-white/10 rounded-md text-white/50"
                              >
                                {tag.name || tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Difficulty Badge */}
                    <div
                      className={`px-3 py-1 rounded-lg text-xs font-bold tracking-wide uppercase ${
                        problem.difficulty === "Easy"
                          ? "bg-green-500/10 text-green-400"
                          : problem.difficulty === "Medium"
                            ? "bg-yellow-500/10 text-yellow-400"
                            : "bg-red-500/10 text-red-400"
                      }`}
                    >
                      {problem.difficulty}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
