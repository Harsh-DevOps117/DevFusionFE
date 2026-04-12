"use client";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  Hash,
  Loader2,
  Lock,
  Mail,
  ShieldCheck,
  User,
  X,
  Zap,
} from "lucide-react";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { setCredentials } from "../store/authSlice"; // Ensure this path is correct
import { api } from "../utils/api"; // Ensure this path is correct

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

        // Your backend returns: { success: true, accessToken: "...", user: {...} }
        if (response.data.accessToken) {
          const { user, accessToken } = response.data;

          // Push to Redux (which also saves to LocalStorage)
          dispatch(setCredentials({ user, accessToken }));

          toast.success(
            mode === "login" ? "Handshake Successful" : "Identity Registered",
            {
              icon: <Zap size={16} className="text-[#f97316]" />,
            },
          );

          onClose();
        }
      } else if (mode === "forgot-password") {
        await api.post("/forgot-password", { email: formData.email });
        toast.info("OTP Dispatched to your terminal.", {
          icon: <ShieldCheck size={16} className="text-blue-400" />,
        });
        setMode("reset-password");
      } else if (mode === "reset-password") {
        await api.post("/reset-password", {
          email: formData.email,
          otp: formData.otp,
          newPassword: formData.password,
        });
        toast.success("Encryption Keys Updated. Please Sign In.");
        setMode("login");
      }
    } catch (error: any) {
      const message =
        error.response?.data?.message || "Protocol_Failure: Access Denied";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/90 backdrop-blur-md z-[200] cursor-pointer"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[95%] max-w-[420px] bg-[#0d0d0d] border border-white/10 rounded-[2.5rem] p-8 sm:p-10 z-[210] overflow-hidden shadow-2xl"
          >
            {/* Ambient Glow */}
            <div className="absolute top-[-20%] right-[-20%] w-64 h-64 bg-orange-600/10 blur-[80px] rounded-full pointer-events-none" />

            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-6 right-6 text-white/30 hover:text-white transition-colors"
            >
              <X size={24} />
            </button>

            {/* Header */}
            <div className="text-center mb-8">
              <h2 className="text-white text-3xl font-machina-bold mb-2 tracking-tighter uppercase">
                {mode === "login" && "Login_Node"}
                {mode === "signup" && "Register_Node"}
                {mode === "forgot-password" && "Recover_Link"}
                {mode === "reset-password" && "Reset_Keys"}
              </h2>
              <p className="text-white/30 text-[10px] font-black uppercase tracking-[0.3em]">
                {mode === "login" && "Secure session handshake required."}
                {mode === "signup" && "Establish new identity in registry."}
                {mode === "forgot-password" && "Trigger OTP dispatch via SMTP."}
                {mode === "reset-password" && "Update encryption credentials."}
              </p>
            </div>

            {/* Form */}
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
                    placeholder="FULL_NAME"
                    className="w-full bg-white/[0.03] border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-white text-sm outline-none focus:border-[#f97316]/50 transition-all font-mono"
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
                  placeholder="IDENTITY_EMAIL"
                  className="w-full bg-white/[0.03] border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-white text-sm outline-none focus:border-[#f97316]/50 transition-all font-mono"
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
                    placeholder="SECURE_OTP"
                    className="w-full bg-white/[0.03] border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-white text-sm outline-none focus:border-[#f97316]/50 transition-all font-mono"
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
                      mode === "reset-password" ? "NEW_PASSWORD" : "ACCESS_KEY"
                    }
                    className="w-full bg-white/[0.03] border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-white text-sm outline-none focus:border-[#f97316]/50 transition-all font-mono"
                  />
                </div>
              )}

              {mode === "login" && (
                <div className="text-right">
                  <button
                    type="button"
                    onClick={() => setMode("forgot-password")}
                    className="text-[9px] font-black text-white/20 hover:text-[#f97316] uppercase tracking-widest transition-colors"
                  >
                    Lost_Access?
                  </button>
                </div>
              )}

              <button
                disabled={loading}
                type="submit"
                className="w-full bg-[#f97316] hover:bg-orange-500 text-black font-black py-4 rounded-2xl flex items-center justify-center gap-2 transition-all shadow-[0_0_20px_rgba(249,115,22,0.2)] active:scale-[0.98] mt-4 disabled:opacity-50"
              >
                {loading ? (
                  <Loader2 className="animate-spin" size={20} />
                ) : (
                  <>
                    <span className="text-xs uppercase tracking-widest">
                      {mode === "login" && "Authorize"}
                      {mode === "signup" && "Initialize"}
                      {mode === "forgot-password" && "Execute_Sync"}
                      {mode === "reset-password" && "Update_Protocol"}
                    </span>
                    <ArrowRight size={18} />
                  </>
                )}
              </button>
            </form>

            {/* Switch Mode Footer */}
            <div className="flex items-center gap-4 my-8">
              <div className="h-[1px] flex-1 bg-white/5" />
              <span className="text-white/10 text-[9px] font-black uppercase tracking-[0.3em]">
                Registry_Switch
              </span>
              <div className="h-[1px] flex-1 bg-white/5" />
            </div>

            <p className="text-center text-white/30 text-[10px] font-bold uppercase tracking-widest">
              {mode === "login" ? (
                <>
                  New Entity?{" "}
                  <button
                    type="button"
                    onClick={() => setMode("signup")}
                    className="text-[#f97316] hover:underline"
                  >
                    Register_Now
                  </button>
                </>
              ) : (
                <>
                  Known Entity?{" "}
                  <button
                    type="button"
                    onClick={() => setMode("login")}
                    className="text-[#f97316] hover:underline"
                  >
                    Login_Execute
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
