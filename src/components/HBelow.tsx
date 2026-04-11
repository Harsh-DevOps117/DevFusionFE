import { Bot, MoveRight, Terminal } from "lucide-react";
import React from "react";
import video from "../assets/v1.mp4";

const StatsBentoGrid: React.FC = () => {
  return (
    <section
      style={{
        fontFamily: "fontNormal",
      }}
      className="w-full bg-[#0a0a0a] px-4 py-12 flex justify-center font-machina-normal text-white"
    >
      <div className="w-full max-w-6xl bg-[#0f0f0f]/80 backdrop-blur-xl border border-white/5 rounded-[2rem] p-4 flex flex-col lg:flex-row gap-4">
        <div className="flex flex-col gap-4 lg:w-[55%]">
          <div className="flex flex-col sm:flex-row gap-4 h-full">
            <div className="flex-1 bg-[#141414] border border-white/5 rounded-[1.5rem] p-6 flex flex-col justify-between hover:bg-[#181818] transition-colors duration-300">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <div className="bg-orange-500/20 rounded-md p-1.5 flex items-center justify-center border border-orange-500/30">
                    <Terminal size={18} className="text-[#f97316]" />
                  </div>
                  <h3 className="text-[#f97316] text-3xl font-machina-light">
                    500+
                  </h3>
                </div>
                <p className="text-white/80 text-sm font-machina-light">
                  Practice Questions
                </p>
              </div>
              <p className="text-white/60 text-sm mt-8 font-machina-light leading-relaxed">
                In-browser Judge0 editor with Easy, Medium, and Hard difficulty
                levels.
              </p>
            </div>

            <div className="flex-1 bg-[#141414] border border-white/5 rounded-[1.5rem] p-6 flex flex-col justify-between hover:bg-[#181818] transition-colors duration-300">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <div className="bg-orange-500/20 rounded-md p-1.5 flex items-center justify-center border border-orange-500/30">
                    <Bot size={18} className="text-[#f97316]" />
                  </div>
                  <h3 className="text-[#f97316] text-3xl font-machina-light">
                    AI Mock
                  </h3>
                </div>
                <p className="text-white/80 text-sm font-machina-light">
                  Role-Based Interviews
                </p>
              </div>
              <p className="text-white/60 text-sm mt-8 font-machina-light leading-relaxed">
                Adaptive real-time questions, instant scoring, and personalised
                feedback.
              </p>
            </div>
          </div>

          <div className="bg-[#141414] border border-white/5 rounded-[1.5rem] p-6 sm:p-8 flex flex-col justify-center gap-3 hover:bg-[#181818] transition-colors duration-300 group">
            <div className="text-3xl sm:text-4xl md:text-5xl font-machina-light leading-[1.1] tracking-tight">
              MASTER{" "}
              <span className="inline-flex -space-x-2 sm:-space-x-3 align-middle mx-1">
                {[44, 11, 68, 33].map((img, index) => (
                  <img
                    key={img}
                    src={`https://i.pravatar.cc/100?img=${img}`}
                    alt="Student"
                    className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border border-[#141414] object-cover grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500 relative"
                    style={{ zIndex: 4 - index }}
                  />
                ))}
              </span>{" "}
              YOUR
            </div>

            <div className="my-1">
              <button className="w-16 h-7 sm:h-8 rounded-full border border-white/30 flex items-center justify-end pr-2 group-hover:w-20 group-hover:border-[#f97316] transition-all duration-500 ease-out">
                <MoveRight
                  size={30}
                  className="text-white group-hover:text-[#f97316] group-hover:translate-x-1 transition-all duration-500"
                />
              </button>
            </div>

            <div className="text-3xl sm:text-4xl md:text-5xl font-machina-light leading-[1.1] tracking-tight">
              TECH INTERVIEWS <br />& SECURE THE OFFER!
            </div>
          </div>
        </div>

        <div className="lg:w-[45%] bg-[#141414] border border-white/5 rounded-[1.5rem] p-8 flex flex-col justify-between relative overflow-hidden hover:bg-[#181818] transition-colors duration-300 min-h-[300px] lg:min-h-full">
          <h2 className="text-4xl sm:text-5xl font-machina-light leading-tight relative z-10">
            Start <br /> Practicing
          </h2>

          <div className="absolute inset-0 pointer-events-none opacity-40">
            <video
              src={video}
              autoPlay
              loop
              muted
              playsInline
              className="absolute inset-0 w-full h-full object-cover"
            ></video>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-[280px] font-machina-bold text-white/10 blur-[4px] select-none translate-x-4">
                P
              </span>
              <div className="absolute top-1/2 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/30 to-transparent blur-[1px]" />
              <div className="absolute top-1/2 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#f97316]/20 to-transparent" />
            </div>
          </div>

          <div className="relative z-10 mt-auto pt-24">
            <button className="px-6 py-2.5 rounded-xl border border-white/10 text-white/80 hover:text-[#f97316] hover:border-[#f97316]/50 transition-all duration-300 flex items-center gap-2 font-machina-light text-sm backdrop-blur-sm bg-black/20">
              Claim Free Tier Access
              <MoveRight size={16} className="text-[#f97316]" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StatsBentoGrid;
