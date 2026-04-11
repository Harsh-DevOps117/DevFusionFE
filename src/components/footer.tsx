"use client";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import React from "react";

// --- Animation Variants ---
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.8,
      ease: "easeOut",
      staggerChildren: 0.05,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

const socialVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { type: "spring", stiffness: 200, damping: 10 },
  },
};

// --- Data & Raw SVG Icons ---
const footerData = {
  sections: [
    {
      title: "Platform",
      links: ["Practice", "AI Interviews", "Dashboard", "Pricing"],
    },
    {
      title: "Resources",
      links: ["Blog", "Documentation", "Community", "Help Center"],
    },
    { title: "Company", links: ["About Us", "Careers", "Contact", "Partners"] },
  ],
  social: [
    {
      href: "#",
      label: "Twitter",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
        </svg>
      ),
    },
    {
      href: "#",
      label: "LinkedIn",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
          <rect width="4" height="12" x="2" y="9" />
          <circle cx="4" cy="4" r="2" />
        </svg>
      ),
    },
    {
      href: "#",
      label: "YouTube",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" />
          <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" />
        </svg>
      ),
    },
    {
      href: "#",
      label: "GitHub",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
          <path d="M9 18c-4.51 2-5-2-7-2" />
        </svg>
      ),
    },
  ],
  brandText: "PREPGRID",
  copyright: "© 2026 PrepGrid. All rights reserved.",
};

// --- Reusable Sub-components ---
const NavSection = ({
  title,
  links,
  index,
}: {
  title: string;
  links: string[];
  index: number;
}) => (
  <motion.div
    variants={itemVariants}
    custom={index}
    className="flex flex-col gap-4"
  >
    <h3 className="text-white font-machina-bold text-sm sm:text-base tracking-wider uppercase mb-2">
      {title}
    </h3>
    <ul className="flex flex-col gap-3">
      {links.map((link, linkIndex) => (
        <li key={linkIndex}>
          <a
            href="#"
            className="text-white/50 hover:text-white transition-colors duration-300 font-machina-normal text-sm group relative inline-block pb-1"
          >
            {link}
            <motion.span
              className="absolute bottom-0 left-0 h-[1.5px] bg-[#f97316]"
              initial={{ width: 0, opacity: 0 }}
              whileHover={{ width: "100%", opacity: 1 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            />
          </a>
        </li>
      ))}
    </ul>
  </motion.div>
);

const SocialLink = ({
  href,
  label,
  icon,
  index,
}: {
  href: string;
  label: string;
  icon: React.ReactNode;
  index: number;
}) => (
  <motion.a
    variants={socialVariants}
    custom={index}
    href={href}
    whileHover={{
      scale: 1.15,
      y: -2,
      transition: { type: "spring", stiffness: 400, damping: 10 },
    }}
    whileTap={{ scale: 0.95 }}
    className="w-10 h-10 rounded-full bg-white/[0.03] border border-white/10 hover:border-[#f97316] hover:bg-[#f97316]/10 flex items-center justify-center text-white/50 hover:text-[#f97316] transition-all duration-300 shadow-[0_0_0_0_rgba(249,115,22,0)] hover:shadow-[0_0_20px_0_rgba(249,115,22,0.3)]"
    aria-label={label}
  >
    {icon}
  </motion.a>
);

export default function StickyFooter() {
  return (
    <div
      className="relative h-[85vh] sm:h-[80vh] bg-[#050505]"
      style={{ clipPath: "polygon(0% 0, 100% 0%, 100% 100%, 0 100%)" }}
    >
      <div className="relative h-[calc(100vh+85vh)] sm:h-[calc(100vh+80vh)] -top-[100vh]">
        <div className="h-[85vh] sm:h-[80vh] sticky top-[calc(100vh-85vh)] sm:top-[calc(100vh-80vh)] flex flex-col justify-between overflow-hidden">
          {/* Main Footer Content */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-10%" }}
            variants={containerVariants}
            className="w-full h-full flex flex-col justify-between pt-16 sm:pt-24 px-6 sm:px-12 max-w-7xl mx-auto relative z-10"
          >
            <div
              className="absolute inset-0 opacity-[0.03] pointer-events-none"
              style={{
                backgroundImage:
                  "radial-gradient(circle, #ffffff 1px, transparent 1px)",
                backgroundSize: "32px 32px",
              }}
            />

            <motion.div
              animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-0 right-[10%] w-[500px] h-[500px] bg-[#f97316]/10 blur-[150px] rounded-full pointer-events-none"
            />
            <div className="absolute bottom-[-20%] left-[-10%] w-[600px] h-[600px] bg-orange-600/5 blur-[150px] rounded-full pointer-events-none" />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 md:gap-8 w-full relative z-10">
              <div className="lg:col-span-7 grid grid-cols-2 md:grid-cols-3 gap-8">
                {footerData.sections.map((section, index) => (
                  <NavSection
                    key={section.title}
                    title={section.title}
                    links={section.links}
                    index={index}
                  />
                ))}
              </div>

              <motion.div
                variants={itemVariants}
                className="lg:col-span-5 flex flex-col items-start lg:items-end text-left lg:text-right"
              >
                <h3 className="text-white font-machina-bold text-xl sm:text-2xl mb-3">
                  Stay ahead of the curve.
                </h3>
                <p className="text-white/50 text-sm font-machina-light mb-6 max-w-sm">
                  Join 50,000+ developers receiving our weekly technical
                  interview insights and platform updates.
                </p>
                <div className="relative w-full max-w-sm group">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-[#f97316] to-orange-400 rounded-xl blur opacity-20 group-hover:opacity-40 transition duration-500"></div>
                  <div className="relative flex items-center bg-[#0f0f0f] border border-white/10 rounded-xl p-1 focus-within:border-[#f97316]/50 transition-colors">
                    <input
                      type="email"
                      placeholder="Enter your email"
                      className="bg-transparent text-white text-sm font-machina-light px-4 py-3 w-full outline-none placeholder:text-white/30"
                    />
                    <button className="bg-white/5 hover:bg-[#f97316] text-white p-3 rounded-lg transition-colors group-hover:text-white">
                      <ArrowRight size={18} />
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>

            <div className="w-full flex justify-center mt-auto pb-6 sm:pb-10 relative z-10 overflow-hidden">
              <motion.h1
                variants={itemVariants}
                animate={{
                  backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                }}
                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                className="text-[7vw] sm:text-[7vw] leading-none font-machina-bold italic select-none tracking-tighter"
                style={{
                  backgroundImage:
                    "linear-gradient(to right, #ffffff, #888888, #ffffff, #f97316, #ffffff)",
                  backgroundSize: "300% auto",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                {footerData.brandText}
              </motion.h1>
            </div>
            <div className="w-full border-t border-white/10 py-6 flex flex-col md:flex-row justify-between items-center gap-6 relative z-10">
              <div className="flex items-center gap-6">
                <motion.p
                  variants={itemVariants}
                  className="text-white/40 text-sm font-machina-light"
                >
                  {footerData.copyright}
                </motion.p>

                <motion.div
                  variants={itemVariants}
                  className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full border border-white/5 bg-white/[0.02]"
                >
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                  </span>
                  <span className="text-white/50 text-xs font-machina-light">
                    All systems operational
                  </span>
                </motion.div>
              </div>

              <div className="flex gap-3">
                {footerData.social.map((social, index) => (
                  <SocialLink
                    key={social.label}
                    href={social.href}
                    label={social.label}
                    icon={social.icon}
                    index={index}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
