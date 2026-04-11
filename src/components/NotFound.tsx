import { motion } from "framer-motion";
import { ArrowLeft, Home } from "lucide-react";
import React from "react";
import { useNavigate } from "react-router-dom";

const NotFound: React.FC = () => {
  const navigate = useNavigate();

  return (
    <section className="relative h-screen w-full bg-[#0a0a0a] flex flex-col items-center justify-center overflow-hidden">
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-orange-500/10 blur-[120px] rounded-full" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-orange-600/10 blur-[120px] rounded-full" />

      <div className="relative z-10 text-center px-6">
        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          style={{
            fontFamily: "fontbold",
            backgroundImage: "linear-gradient(to bottom, #ffffff, #333333)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
          className="text-[15vw] md:text-[12vw] leading-none select-none"
        >
          404
        </motion.h1>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <h2
            style={{ fontFamily: "fontbold" }}
            className="text-white text-2xl md:text-4xl mb-4 tracking-tight"
          >
            Lost in the{" "}
            <span
              style={{ fontFamily: "fontlight", color: "#f97316" }}
              className="italic"
            >
              Grid?
            </span>
          </h2>
          <p
            style={{ fontFamily: "fontNormal" }}
            className="text-white/50 text-base md:text-lg max-w-md mx-auto mb-12"
          >
            The page you are looking for doesn't exist or has been moved to a
            new coordinate.
          </p>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <button
            onClick={() => navigate(-1)}
            style={{ fontFamily: "fontbold" }}
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white/5 border border-white/10 text-white px-8 py-4 rounded-2xl hover:bg-white/10 transition-all active:scale-95"
          >
            <ArrowLeft size={20} />
            Go Back
          </button>

          <button
            onClick={() => navigate("/")}
            style={{ fontFamily: "fontbold" }}
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-[#f97316] text-white px-8 py-4 rounded-2xl shadow-lg shadow-orange-500/20 hover:bg-[#fb923c] transition-all active:scale-95"
          >
            <Home size={20} />
            Return Home
          </button>
        </motion.div>
      </div>

      <div
        className="absolute inset-0 opacity-[0.05] pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle, #f97316 1px, transparent 1px)",
          backgroundSize: "30px 30px",
        }}
      />
    </section>
  );
};

export default NotFound;
