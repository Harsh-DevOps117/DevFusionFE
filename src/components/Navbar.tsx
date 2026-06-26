"use client";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux"; // Added
import type { RootState } from "../store/store"; // Adjust path if needed

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Redux store se auth state fetch karna
  const { user, isAuthenticated } = useSelector(
    (state: RootState) => state.auth,
  );

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Admin routes ko conditionally array mein spread karna
  const navLinks = [
    { name: "HOME", href: "/" },
    { name: "MCQ", href: "/mcq" },
    { name: "DSA", href: "/problems" },
    { name: "CHAMPS", href: "/leader" },
    { name: "PLAYLIST", href: "/playlists" },
    { name: "RESUME", href: "/resume-builder" },
    ...(isAuthenticated && user?.role === "ADMIN"
      ? [
          { name: "STATS", href: "/stats" },
          { name: "CREATE QUES", href: "/create-problem" },
        ]
      : []),
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-300 border-b ${
        scrolled
          ? "bg-[#0a0805]/90 backdrop-blur-xl py-3 border-white/10"
          : "bg-transparent py-5 border-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
        <div className="flex items-center gap-2 group cursor-pointer shrink-0">
          <span className="text-white text-xl font-machina-bold tracking-tight hidden xs:block">
            PrepGrid
          </span>
        </div>

        <div className="hidden lg:flex items-center gap-1 bg-white/5 border border-white/10 p-1 rounded-2xl backdrop-blur-md">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className={`px-5 py-2 text-[13px] rounded-xl transition-all font-machina-normal tracking-wide text-white/60 hover:text-white hover:bg-white/5`}
            >
              {link.name}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden text-white p-2.5 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 bg-[#0a0a0a]/98 z-[110] flex flex-col items-center justify-center lg:hidden px-6"
          >
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-6 right-6 text-white/50 hover:text-white p-3 bg-white/5 rounded-full"
            >
              <X size={28} />
            </button>

            <div className="flex flex-col items-center gap-6 w-full">
              {navLinks.map((link, i) => (
                <motion.a
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="text-4xl font-machina-bold tracking-tighter text-white hover:text-[#f97316] transition-colors"
                >
                  {link.name}
                </motion.a>
              ))}
              <div className="h-[1px] w-20 bg-white/10 my-4" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
