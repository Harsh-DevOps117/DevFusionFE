"use client";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  Loader2,
  Lock,
  Mail,
  ShieldCheck,
  User,
  Zap,
} from "lucide-react";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { AuthService } from "../services/index";
import { setCredentials } from "../store/authSlice";

export default function LoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = isLogin
        ? await AuthService.login({
            email: formData.email,
            password: formData.password,
          })
        : await AuthService.signup(formData);

      if (response.data.accessToken) {
        const { user, accessToken } = response.data;
        dispatch(setCredentials({ user, accessToken }));

        toast.success(
          isLogin ? "Neural Link Established" : "Identity Registered",
          {
            icon: <Zap size={16} className="text-[#f97316]" />,
            theme: "dark",
          },
        );

        navigate("/profile");
      }
    } catch (error: any) {
      const msg =
        error.response?.data?.message || "Protocol_Error: Access Denied";
      toast.error(msg, { theme: "dark" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center p-6 relative overflow-hidden font-['fontNormal']">
      {/* Background cyber grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1a1a1a_1px,transparent_1px),linear-gradient(to_bottom,#1a1a1a_1px,transparent_1px)] bg-[size:40px_40px] opacity-20" />

      {/* Ambient glow blobs */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#f97316]/8 blur-[140px] rounded-full pointer-events-none" />
      <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-[#f97316]/5 blur-[100px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[250px] h-[250px] bg-orange-900/10 blur-[100px] rounded-full pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-[440px] z-10"
      >
        {/* Main card */}
        <div className="relative bg-[#0d0d0d] border border-white/[0.06] rounded-[2.5rem] p-10 overflow-hidden">
          {/* Subtle top-edge highlight */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2/3 h-px bg-gradient-to-r from-transparent via-[#f97316]/40 to-transparent" />

          {/* Corner accent dots */}
          <div className="absolute top-6 right-6 w-1.5 h-1.5 rounded-full bg-[#f97316]/40" />
          <div className="absolute top-6 left-6 w-1.5 h-1.5 rounded-full bg-white/10" />

          {/* Top Branding */}
          <div className="text-center mb-10">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="inline-flex items-center gap-2 bg-[#f97316]/10 border border-[#f97316]/20 rounded-full px-4 py-1.5 mb-6"
            >
              <ShieldCheck size={13} className="text-[#f97316]" />
              <span className="text-[10px] font-black text-[#f97316] uppercase tracking-[0.3em]">
                Secure_Access_v4
              </span>
            </motion.div>

            <AnimatePresence mode="wait">
              <motion.h2
                key={isLogin ? "login" : "signup"}
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                transition={{ duration: 0.2 }}
                className="text-white text-4xl font-black tracking-tighter uppercase italic"
              >
                {isLogin ? "Login_Node" : "Join_Registry"}
              </motion.h2>
            </AnimatePresence>

            <p className="text-white/20 text-[10px] font-mono uppercase tracking-[0.2em] mt-2">
              {isLogin
                ? "Auth_Protocol :: JWT_v2"
                : "Init_Protocol :: Register"}
            </p>
          </div>

          <form onSubmit={handleAuth} className="space-y-3">
            <AnimatePresence mode="wait">
              {!isLogin && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.25 }}
                  className="relative group"
                >
                  <User
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-[#f97316]/60 transition-colors"
                    size={17}
                  />
                  <input
                    name="username"
                    type="text"
                    required
                    placeholder="USERNAME_ID"
                    className="w-full bg-white/[0.03] border border-white/[0.06] hover:border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white text-[13px] outline-none focus:border-[#f97316]/40 focus:bg-[#f97316]/[0.03] transition-all font-mono placeholder:text-white/20"
                    onChange={handleChange}
                  />
                </motion.div>
              )}
            </AnimatePresence>

            <div className="relative group">
              <Mail
                className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-[#f97316]/60 transition-colors"
                size={17}
              />
              <input
                name="email"
                type="email"
                required
                placeholder="IDENTITY_EMAIL"
                className="w-full bg-white/[0.03] border border-white/[0.06] hover:border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white text-[13px] outline-none focus:border-[#f97316]/40 focus:bg-[#f97316]/[0.03] transition-all font-mono placeholder:text-white/20"
                onChange={handleChange}
              />
            </div>

            <div className="relative group">
              <Lock
                className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-[#f97316]/60 transition-colors"
                size={17}
              />
              <input
                name="password"
                type="password"
                required
                placeholder="ACCESS_KEY"
                className="w-full bg-white/[0.03] border border-white/[0.06] hover:border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white text-[13px] outline-none focus:border-[#f97316]/40 focus:bg-[#f97316]/[0.03] transition-all font-mono placeholder:text-white/20"
                onChange={handleChange}
              />
            </div>

            {/* Submit button */}
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.97 }}
              disabled={loading}
              type="submit"
              className="w-full relative bg-[#f97316] hover:bg-orange-500 text-black font-black py-5 rounded-2xl flex items-center justify-center gap-3 transition-all mt-6 disabled:opacity-50 overflow-hidden group"
            >
              {/* Shimmer effect on hover */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />

              {loading ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                <>
                  <span className="uppercase text-xs tracking-widest relative z-10">
                    {isLogin ? "Authorize_Handshake" : "Initialize_Registry"}
                  </span>
                  <ArrowRight size={18} className="relative z-10" />
                </>
              )}
            </motion.button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-8">
            <div className="flex-1 h-px bg-white/[0.06]" />
            <span className="text-white/20 text-[9px] font-black uppercase tracking-[0.3em]">
              Switch_Protocol
            </span>
            <div className="flex-1 h-px bg-white/[0.06]" />
          </div>

          {/* Switch Mode */}
          <div className="text-center">
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="group inline-flex items-center gap-2 text-zinc-500 hover:text-[#f97316] text-[11px] font-black uppercase tracking-widest transition-colors"
            >
              <span>
                {isLogin ? "Create New Identity" : "Already in Registry? Login"}
              </span>
              <ArrowRight
                size={12}
                className="group-hover:translate-x-1 transition-transform"
              />
            </button>
          </div>

          {/* Bottom edge highlight */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/3 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        </div>

        {/* Footer */}
        <div className="mt-6 flex justify-between items-center px-4 opacity-25 text-[9px] font-black uppercase tracking-widest text-white">
          <span>Encrypted_TLS_1.3</span>
          <Link
            to="/"
            className="hover:text-[#f97316] hover:opacity-100 transition-colors"
          >
            Terminal_Home
          </Link>
          <span>Node_ID: 16.171.200.75</span>
        </div>
      </motion.div>
    </div>
  );
}
