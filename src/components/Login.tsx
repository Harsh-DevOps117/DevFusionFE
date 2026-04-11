"use client";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Hash, Loader2, Lock, Mail, User, X } from "lucide-react";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { setCredentials } from "../store/authSlice";
import { api } from "../utils/api";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type AuthMode = "login" | "signup" | "forgot-password" | "reset-password";

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const [mode, setMode] = useState<AuthMode>("login");
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    otp: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (mode === "login" || mode === "signup") {
        const endpoint = mode === "login" ? "/login" : "/signup";
        const payload =
          mode === "login"
            ? { email: formData.email, password: formData.password }
            : {
                username: formData.fullName,
                email: formData.email,
                password: formData.password,
              };

        const response = await api.post(endpoint, payload);
        if (response.status === 200 || response.status === 201) {
          const { user, token } = response.data;
          dispatch(setCredentials({ user, token }));
          onClose();
        }
      } else if (mode === "forgot-password") {
        await api.post("/forgot-password", { email: formData.email });
        alert("OTP sent to your email!");
        setMode("reset-password");
      } else if (mode === "reset-password") {
        await api.post("/reset-password", {
          email: formData.email,
          otp: formData.otp,
          newPassword: formData.password,
        });
        alert("Password reset successful! Please login.");
        setMode("login");
      }
    } catch (error: any) {
      alert(error.response?.data?.message || "Action Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/90 backdrop-blur-sm z-[200] cursor-pointer"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[95%] max-w-[420px] bg-[#0d0d0d] border border-white/10 rounded-[2.5rem] p-8 sm:p-10 z-[210] overflow-hidden shadow-2xl"
          >
            <div className="absolute top-[-20%] right-[-20%] w-64 h-64 bg-orange-600/10 blur-[80px] rounded-full pointer-events-none" />

            <button
              onClick={onClose}
              className="absolute top-6 right-6 text-white/30 hover:text-white transition-colors"
            >
              <X size={24} />
            </button>

            <div className="text-center mb-8">
              <h2 className="text-white text-3xl font-machina-bold mb-2 tracking-tight">
                {mode === "login" && "Welcome Back"}
                {mode === "signup" && "Create Account"}
                {mode === "forgot-password" && "Recover Access"}
                {mode === "reset-password" && "Reset Password"}
              </h2>
              <p className="text-white/50 text-sm font-machina-light">
                {mode === "login" && "Sign in to continue mastery."}
                {mode === "signup" && "Join the next generation."}
                {mode === "forgot-password" && "Enter email to receive OTP."}
                {mode === "reset-password" && "Enter the OTP and new password."}
              </p>
            </div>

            <form className="space-y-4" onSubmit={handleSubmit}>
              {mode === "signup" && (
                <div className="relative">
                  <User
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20"
                    size={18}
                  />
                  <input
                    name="fullName"
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="Full Name"
                    className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white text-sm outline-none focus:border-[#f97316]/50 transition-all font-machina-normal"
                  />
                </div>
              )}

              <div className="relative">
                <Mail
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20"
                  size={18}
                />
                <input
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Email Address"
                  className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white text-sm outline-none focus:border-[#f97316]/50 transition-all font-machina-normal"
                />
              </div>

              {mode === "reset-password" && (
                <div className="relative">
                  <Hash
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20"
                    size={18}
                  />
                  <input
                    name="otp"
                    type="text"
                    required
                    value={formData.otp}
                    onChange={handleChange}
                    placeholder="Enter OTP"
                    className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white text-sm outline-none focus:border-[#f97316]/50 transition-all font-machina-normal"
                  />
                </div>
              )}

              {mode !== "forgot-password" && (
                <div className="relative">
                  <Lock
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20"
                    size={18}
                  />
                  <input
                    name="password"
                    type="password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    placeholder={
                      mode === "reset-password" ? "New Password" : "Password"
                    }
                    className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white text-sm outline-none focus:border-[#f97316]/50 transition-all font-machina-normal"
                  />
                </div>
              )}

              {mode === "login" && (
                <div className="text-right">
                  <button
                    type="button"
                    onClick={() => setMode("forgot-password")}
                    className="text-[10px] font-machina-bold text-white/30 hover:text-[#f97316] uppercase tracking-widest transition-colors"
                  >
                    Forgot Password?
                  </button>
                </div>
              )}

              <button
                disabled={loading}
                type="submit"
                className="w-full bg-[#f97316] hover:bg-[#fb923c] text-white font-machina-bold py-4 rounded-2xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-orange-500/20 active:scale-[0.98] mt-4 disabled:opacity-70"
              >
                {loading ? (
                  <Loader2 className="animate-spin" size={20} />
                ) : (
                  <>
                    {mode === "login" && "Sign In"}
                    {mode === "signup" && "Get Started"}
                    {mode === "forgot-password" && "Send OTP"}
                    {mode === "reset-password" && "Update Password"}
                    <ArrowRight size={18} />
                  </>
                )}
              </button>
            </form>

            <div className="flex items-center gap-4 my-8">
              <div className="h-[1px] flex-1 bg-white/5" />
              <span className="text-white/20 text-[10px] font-machina-bold uppercase tracking-[0.2em]">
                OR
              </span>
              <div className="h-[1px] flex-1 bg-white/5" />
            </div>

            <p className="text-center text-white/40 text-sm font-machina-light">
              {mode === "login" && (
                <>
                  New here?{" "}
                  <button
                    type="button"
                    onClick={() => setMode("signup")}
                    className="text-[#f97316] font-machina-bold hover:text-orange-400"
                  >
                    Create one
                  </button>
                </>
              )}
              {mode !== "login" && (
                <>
                  Remember password?{" "}
                  <button
                    type="button"
                    onClick={() => setMode("login")}
                    className="text-[#f97316] font-machina-bold hover:text-orange-400"
                  >
                    Log in
                  </button>
                </>
              )}
            </p>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default AuthModal;
