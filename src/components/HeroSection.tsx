"use client";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  Bot,
  FileText,
  Menu,
  Sparkles,
  User as UserIcon,
  X,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import AuthModal from "./Login";

const HeroSection: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const navigate = useNavigate();
  // Getting auth state from your central RTK store
  const { isAuthenticated, user } = useSelector((state: any) => state.auth);

  useEffect(() => {
    if (isMenuOpen || isAuthOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [isMenuOpen, isAuthOpen]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "HOME", href: "/" },
    { name: "MCQ", href: "/mcq" },
    { name: "DSA", href: "/problems" },
    { name: "CHAMPS", href: "/leader" },
  ];

  const handleSignInClick = () => {
    if (isAuthenticated) {
      navigate("/profile");
    } else {
      setIsAuthOpen(true);
      setIsMenuOpen(false);
    }
  };

  return (
    <section
      style={{ fontFamily: "fontNormal" }}
      className="relative min-h-screen bg-[#0a0a0a] flex flex-col overflow-hidden font-machina-normal selection:bg-[#f97316] selection:text-white"
    >
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-orange-500/10 blur-[120px] rounded-full animate-pulse" />
        <div
          className="absolute bottom-[-10%] right-[-5%] w-[500px] h-[500px] bg-orange-600/10 blur-[150px] rounded-full animate-pulse"
          style={{ animationDelay: "2s" }}
        />
        <div
          className="absolute inset-0 opacity-[0.15]"
          style={{
            backgroundImage:
              "radial-gradient(circle, #f97316 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        />
      </div>

      <nav
        className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 border-b ${
          scrolled
            ? "bg-[#0a0a0a]/90 backdrop-blur-xl py-3 border-white/10"
            : "bg-transparent py-5 border-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3 cursor-pointer group shrink-0 relative z-[110]">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center transition-transform group-hover:scale-105">
              <img
                src={logo}
                alt="PrepGrid Logo"
                className="w-full h-full object-contain"
              />
            </div>
            <span
              style={{ fontFamily: "fontNormal" }}
              className="text-white text-xl tracking-tight"
            >
              PrepGrid
            </span>
          </div>

          {/* Desktop Nav */}
          <div className="hidden lg:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 items-center gap-1 bg-white/5 border border-white/10 p-1 rounded-2xl">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className={`px-5 py-2 text-[13px] rounded-xl transition-all font-machina-normal tracking-wide ${
                  link.active
                    ? "bg-[#f97316] text-white shadow-md shadow-orange-500/20"
                    : "text-white/60 hover:text-white hover:bg-white/5"
                }`}
              >
                {link.name}
              </a>
            ))}
          </div>

          {/* Right Section: Auth State Toggle */}
          <div className="flex items-center gap-4 shrink-0 relative z-[110]">
            <div className="hidden lg:flex items-center gap-6 mr-2">
              <a
                href="/review"
                className="flex items-center gap-2 text-white/60 hover:text-white transition-colors font-machina-normal text-[13px]"
              >
                <FileText size={14} className="text-[#f97316]" />
                Resume Review
              </a>

              {isAuthenticated ? (
                /* USER ICON WHEN LOGGED IN */
                <button
                  onClick={() => navigate("/profile")}
                  className="w-10 h-10 rounded-full bg-[#f97316]/10 border border-[#f97316]/30 flex items-center justify-center overflow-hidden hover:shadow-[0_0_15px_rgba(249,115,22,0.4)] transition-all active:scale-95"
                >
                  {user?.avatar ? (
                    <img
                      src={user.avatar}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <UserIcon size={20} className="text-[#f97316]" />
                  )}
                </button>
              ) : (
                /* SIGN IN BUTTON WHEN LOGGED OUT */
                <button
                  onClick={handleSignInClick}
                  style={{ fontFamily: "fontNormal" }}
                  className="text-white text-[14px] bg-white/5 border border-white/10 rounded-full px-6 py-2.5 hover:bg-[#f97316] hover:border-[#f97316] hover:shadow-[0_0_20px_rgba(249,115,22,0.4)] transition-all"
                >
                  Sign In
                </button>
              )}
            </div>

            <button
              className="lg:hidden text-white p-2.5 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={26} /> : <Menu size={26} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, x: "100%" }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed inset-0 h-screen w-screen bg-[#0a0a0a] z-[105] flex flex-col items-center justify-center lg:hidden"
            >
              <div className="flex flex-col items-center gap-8 relative z-10">
                {[...navLinks, { name: "Resume Review" }].map((link, i) => (
                  <motion.a
                    key={link.name}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    href={link.name === "Resume Review" ? "/review" : link.href}
                    onClick={(e) => {
                      setIsMenuOpen(false);
                      if (link.name === "Resume Review") {
                        e.preventDefault();
                        navigate("/review");
                      }
                    }}
                    className="text-4xl font-machina-bold text-white hover:text-[#f97316] transition-colors tracking-tighter"
                  >
                    {link.name}
                  </motion.a>
                ))}

                <motion.button
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4 }}
                  onClick={handleSignInClick}
                  style={{ fontFamily: "fontbold" }}
                  className="mt-6 bg-[#f97316] text-white px-12 py-4 rounded-full text-xl shadow-xl shadow-orange-500/20 active:scale-95 transition-transform"
                >
                  {isAuthenticated ? "My Profile" : "Sign In"}
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Auth Modal */}
      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />

      {/* Hero Content */}
      <div className="flex-1 flex items-center justify-center px-6 relative z-10 py-32">
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 border border-[#f97316]/30 bg-[#f97316]/10 text-[#f97316] text-[10px] sm:text-xs font-machina-bold tracking-[3px] px-6 py-2.5 rounded-full mb-8 uppercase backdrop-blur-md">
            <Sparkles size={14} className="animate-pulse" />
            PrepGrid • AI Interviews & Resume Review
          </div>

          <h1
            style={{ fontFamily: "fontNormal" }}
            className="text-white text-xl sm:text-2xl md:text-4xl lg:text-6xl font-machina-bold tracking-tight leading-[1.1] mb-8"
          >
            Become The Software Engineer <br className="hidden md:block" />
            That{" "}
            <span className="inline-block relative">
              <span className="absolute inset-0 bg-[#f97316]/20 blur-lg rounded-full" />
              <span className="relative inline-block border-[1.5px] m-1 border-[#f97316] px-4 py-1.5 rounded-2xl sm:rounded-full font-machina-light italic text-[#f97316] bg-black/50 backdrop-blur-sm -rotate-2 hover:rotate-0 transition-transform duration-300">
                Companies
              </span>
            </span>{" "}
            Want To Hire!
          </h1>

          <p className="text-white/60 text-lg sm:text-xl md:text-xl max-w-3xl mx-auto mb-10 font-machina-light leading-relaxed">
            Master technical interviews with{" "}
            <strong className="text-white font-machina-normal">
              AI-powered role-based mock tests
            </strong>
            , our built-in coding practice module, and{" "}
            <strong className="text-white font-machina-normal">
              instant Resume PDF analysis
            </strong>
            .
          </p>

          {/* Social Proof */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <div className="flex -space-x-3">
              {[44, 11, 68, 33].map((img) => (
                <img
                  key={img}
                  src={`https://i.pravatar.cc/100?img=${img}`}
                  alt="Student"
                  className="w-11 h-11 rounded-full border-2 border-[#0a0a0a] object-cover"
                />
              ))}
            </div>
            <p className="text-white/70 text-base sm:text-lg">
              <span className="text-[#f97316] font-machina-bold">1K+</span>{" "}
              Students learning in our mastery programs
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-5 px-4 sm:px-0">
            <button
              onClick={() => navigate("/interview")}
              style={{ fontFamily: "fontNormal" }}
              className="w-full sm:w-auto group bg-[#f97316] hover:bg-[#fb923c] text-white px-8 py-4 rounded-full flex items-center justify-center gap-3 transition-all shadow-lg active:scale-95 text-lg"
            >
              <Bot size={22} />
              Start Free AI Interview
            </button>
            <button
              onClick={() => navigate("/review")}
              style={{ fontFamily: "fontNormal" }}
              className="w-full sm:w-auto px-8 py-4 rounded-full border border-white/20 text-white hover:bg-white/5 transition-all active:scale-95 text-lg flex items-center justify-center gap-3"
            >
              <FileText size={20} className="text-white/70" />
              Upload Resume PDF
              <ArrowRight
                size={20}
                className="opacity-70 group-hover:translate-x-1 transition-transform"
              />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
