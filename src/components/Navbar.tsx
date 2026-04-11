"use client";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Menu, X } from "lucide-react";
import { useEffect, useState } from "react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Handle scroll effect for premium glassmorphism
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Home", href: "#", active: true },
    { name: "Courses", href: "#" },
    { name: "Bootcamp", href: "#" },
    { name: "Callback", href: "#" }, // Shortened for tablet safety
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
        {/* Logo Section - Flex-shrink-0 prevents it from squishing */}
        <div className="flex items-center gap-2 group cursor-pointer shrink-0">
          <div className="w-9 h-9 bg-gradient-to-br from-[#f97316] to-[#ea580c] rounded-xl flex items-center justify-center font-machina-bold text-white shadow-[0_0_20px_rgba(249,115,22,0.3)] transition-transform group-hover:scale-105">
            P
          </div>
          <span className="text-white text-xl font-machina-bold tracking-tight hidden xs:block">
            PrepGrid
          </span>
        </div>

        {/* Desktop Links - Optimized Breakpoints */}
        {/* We use 'lg:flex' to ensure that on iPad Mini/Pro (768px-1024px), it stays as a Hamburger */}
        <div className="hidden lg:flex items-center gap-1 bg-white/5 border border-white/10 p-1 rounded-2xl backdrop-blur-md">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className={`px-5 py-2 text-[13px] rounded-xl transition-all font-machina-normal tracking-wide ${
                link.active
                  ? "bg-[#f97316] text-white shadow-[0_0_15px_rgba(249,115,22,0.4)]"
                  : "text-white/60 hover:text-white hover:bg-white/5"
              }`}
            >
              {link.name}
            </a>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 shrink-0">
          <a
            href="#"
            className="hidden sm:flex items-center gap-2 text-sm font-machina-bold text-white/70 hover:text-[#f97316] transition-colors mr-2"
          >
            Sign In
          </a>

          <button className="hidden lg:flex items-center gap-2 bg-white text-black px-5 py-2.5 rounded-xl font-machina-bold text-xs hover:bg-[#f97316] hover:text-white transition-all active:scale-95">
            Join Now
            <ArrowRight size={14} />
          </button>

          {/* Hamburger - Visible on all Tablets/Phones below 1024px */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden text-white p-2.5 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile/Tablet Fullscreen Overlay */}
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
              <motion.a
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                href="#"
                onClick={() => setIsOpen(false)}
                className="text-2xl font-machina-bold text-[#f97316]"
              >
                Sign In
              </motion.a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
