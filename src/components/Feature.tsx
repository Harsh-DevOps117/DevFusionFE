"use client";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BookOpen,
  Bot,
  BrainCircuit,
  LayoutDashboard,
  Terminal,
  Trophy,
  Zap,
} from "lucide-react";
import { useState } from "react";
import { toast } from "react-toastify";
// ✅ Pointing to our centralized services
import { PaymentService } from "../services/index";
import { loadRazorpayScript, openRazorpay } from "../services/razorpay";
import PlanGate from "./PlanGate";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.05 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 90, damping: 18 },
  },
};

const topics = ["Arrays", "DP", "Graphs", "SQL", "Trees", "OS"];

const PrepGridFeatures = () => {
  const [loading, setLoading] = useState(false);
  const [isYearly, setIsYearly] = useState(false);

  const handlePayment = async (amount: number) => {
    try {
      setLoading(true);

      // 🔥 Initialization Toast
      toast.info("Initializing Payment Protocol...", {
        theme: "dark",
        autoClose: 2000,
      });

      // 1. Load Razorpay
      const loaded = await loadRazorpayScript();
      if (!loaded) {
        toast.error("SDK_LOAD_FAILURE: Razorpay terminal unreachable.", {
          theme: "dark",
        });
        return;
      }

      // 2. Create Order
      const data = await PaymentService.createOrder(amount);
      const order = data.order;

      // 3. Open Checkout
      openRazorpay({
        key: "rzp_test_SbdeoiPyxntZ27",
        amount: order.amount,
        currency: "INR",
        name: "PrepGrid",
        description: "Enclave Access: PRO",
        order_id: order.id,

        handler: async function (response: any) {
          // ✅ CRITICAL FIX: Added PaymentService. prefix here!
          const verifyRes = await PaymentService.verifyPayment({
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
          });

          if (verifyRes.success) {
            // 🔥 Success Toast
            toast.success("Transaction Verified. Welcome to the Pro Enclave.", {
              theme: "dark",
              icon: <Zap size={18} className="text-[#f97316]" />,
            });
            setTimeout(() => window.location.reload(), 2000);
          } else {
            toast.error("VERIFICATION_FAILURE: Checksum mismatch.", {
              theme: "dark",
            });
          }
        },

        theme: {
          color: "#f97316",
        },
      });
    } catch (err) {
      console.error(err);
      toast.error("GATEWAY_ERROR: Payment request terminated.", {
        theme: "dark",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="w-full bg-[#0a0a0a] py-20 px-4 sm:px-6 font-machina-normal overflow-hidden">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-orange-500/25 bg-orange-500/[0.08] mb-5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#f97316] animate-pulse" />
            <span className="text-[#f97316] text-[11px] font-machina-bold tracking-[3px] uppercase">
              Everything You Need
            </span>
          </div>
          <h3 className="text-white text-4xl sm:text-5xl md:text-6xl font-machina-light leading-none">
            Built to{" "}
            <span className="font-machina-bold italic text-[#f97316]">
              crack placements
            </span>
          </h3>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="grid w-full grid-cols-1 gap-4 md:grid-cols-3 auto-rows-[minmax(180px,auto)]"
        >
          {/* Practice Module Card */}
          <motion.div
            variants={itemVariants}
            className="md:col-span-1 md:row-span-2"
          >
            <div className="group h-full bg-[#111111] border border-white/[0.08] rounded-2xl p-6 hover:border-orange-500/35 transition-all duration-500 relative overflow-hidden flex flex-col">
              <div className="absolute -top-8 -right-8 w-32 h-32 bg-orange-500/10 rounded-full blur-2xl group-hover:scale-150 group-hover:opacity-70 transition-all duration-700 opacity-40" />
              <div className="flex items-start justify-between mb-4">
                <div className="bg-[#0d0d0d] border border-white/[0.07] group-hover:border-orange-500/25 w-11 h-11 rounded-xl flex items-center justify-center transition-colors duration-300 relative">
                  <Terminal size={22} className="text-[#f97316]" />
                </div>
                <span className="text-[10px] text-white/20 font-machina-light tracking-widest uppercase">
                  01
                </span>
              </div>
              <h3 className="text-xl font-machina-bold text-white mb-1.5 group-hover:text-orange-50 transition-colors">
                Practice Module
              </h3>
              <div className="h-[2px] w-6 group-hover:w-10 bg-[#f97316] rounded-full transition-all duration-500 mb-3" />
              <p className="text-white/50 text-sm leading-relaxed mb-5">
                Real-time editor via{" "}
                <span className="text-[#f97316] font-semibold">Judge0</span>.{" "}
                <span className="text-white/70 font-semibold">
                  500+ questions
                </span>{" "}
                across 12 topics.
              </p>
              <div className="grid grid-cols-3 gap-2 mb-4">
                {[
                  { label: "Easy", value: "148", color: "text-emerald-400" },
                  { label: "Med", value: "265", color: "text-amber-400" },
                  { label: "Hard", value: "87", color: "text-red-400" },
                ].map((s) => (
                  <div
                    key={s.label}
                    className="bg-white/[0.03] rounded-xl p-3 border border-white/[0.06] text-center"
                  >
                    <div className={`text-[10px] ${s.color} opacity-70`}>
                      {s.label}
                    </div>
                    <div className="text-xl font-machina-bold text-white mt-0.5">
                      {s.value}
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex flex-wrap gap-1.5 mb-4">
                {topics.map((topic) => (
                  <span
                    key={topic}
                    className="px-2.5 py-0.5 text-[10px] rounded-full bg-white/[0.03] border border-white/[0.07] text-white/50 uppercase"
                  >
                    {topic}
                  </span>
                ))}
              </div>
              <div className="mt-auto flex items-center gap-1.5 text-[11px] text-orange-400/70 group-hover:text-orange-400">
                <BookOpen size={13} />
                <span>Track Solved • Unsolved • Bookmarked</span>
              </div>
            </div>
          </motion.div>

          {/* AI Interview Card */}
          <motion.div variants={itemVariants}>
            <div className="group h-full bg-[#111111] border border-white/[0.08] rounded-2xl p-6 hover:border-orange-500/35 transition-all duration-300 flex flex-col relative overflow-hidden">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="text-lg font-machina-bold text-white group-hover:text-orange-50 transition-colors">
                    AI Interview
                  </h3>
                  <p className="text-white/40 text-xs mt-0.5">
                    Adaptive • Real-time feedback
                  </p>
                </div>
                <Bot
                  size={28}
                  className="text-orange-500 group-hover:scale-110 transition-transform"
                />
              </div>
              <div className="mt-auto flex items-end justify-between">
                <div>
                  <div className="text-5xl font-machina-bold text-[#f97316] leading-none">
                    ∞
                  </div>
                  <p className="text-white/40 text-xs mt-1">Unlimited on Pro</p>
                </div>
                <div className="flex items-center gap-1 text-[11px] text-orange-400/60 group-hover:text-orange-400 transition-all">
                  <span>Start session</span>
                  <ArrowRight size={12} />
                </div>
              </div>
            </div>
          </motion.div>

          {/* Prep Speed Card */}
          <motion.div variants={itemVariants}>
            <div className="group h-full bg-[#111111] border border-white/[0.08] rounded-2xl p-6 hover:border-orange-500/35 transition-all duration-300 flex items-center justify-center">
              <div className="text-center relative z-10">
                <div className="text-[68px] font-machina-bold text-white tracking-tighter leading-none group-hover:text-orange-50 transition-colors">
                  10X
                </div>
                <p className="text-orange-400/80 text-sm -mt-1 uppercase tracking-widest font-bold">
                  Faster Prep
                </p>
              </div>
            </div>
          </motion.div>

          {/* Smart Quizzes Card */}
          <motion.div variants={itemVariants}>
            <div className="group h-full bg-[#111111] border border-white/[0.08] rounded-2xl p-6 hover:border-orange-500/35 transition-all duration-300 flex flex-col">
              <div className="flex items-start justify-between mb-3">
                <BrainCircuit
                  size={26}
                  className="text-orange-500 group-hover:scale-110 transition-transform"
                />
                <span className="text-[10px] text-white/20 tracking-widest">
                  03
                </span>
              </div>
              <h3 className="text-lg font-machina-bold text-white mb-1 group-hover:text-orange-50 transition-colors">
                Smart Quizzes
              </h3>
              <p className="text-white/45 text-xs leading-relaxed italic uppercase tracking-tighter">
                AI-powered evaluation
              </p>
              <div className="mt-auto flex items-center gap-1.5 text-[11px] text-orange-400/60 group-hover:text-orange-400">
                <Trophy size={13} />
                <span>Global Leaderboard</span>
              </div>
            </div>
          </motion.div>

          {/* Dashboard Card */}
          <motion.div variants={itemVariants}>
            <div className="group h-full bg-[#111111] border border-white/[0.08] rounded-2xl p-6 hover:border-orange-500/35 transition-all duration-300 flex flex-col">
              <div className="flex items-start justify-between mb-3">
                <LayoutDashboard
                  size={26}
                  className="text-orange-500 group-hover:scale-110 transition-transform"
                />
                <span className="text-[10px] text-white/20 tracking-widest">
                  04
                </span>
              </div>
              <h3 className="text-lg font-machina-bold text-white mb-1 group-hover:text-orange-50 transition-colors">
                Dashboard
              </h3>
              <p className="text-white/45 text-xs leading-relaxed">
                <span className="text-[#f97316]">Streak</span> •{" "}
                <span className="text-white/65">Weak Areas</span>
              </p>
            </div>
          </motion.div>

          {/* ⚡ GO PRO BANNER */}
          <PlanGate hideFor="PRO">
            <motion.div variants={itemVariants} className="md:col-span-3">
              <div className="group h-full bg-[#0d0d0d] border border-[#f97316]/20 rounded-2xl p-6 sm:p-10 hover:border-orange-500/40 transition-all duration-300 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-[#f97316]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative z-10">
                  <div className="inline-flex items-center gap-1.5 bg-orange-500/10 text-orange-400 px-3 py-1 rounded-full text-[11px] mb-3 border border-orange-500/20">
                    <Zap size={12} className="animate-pulse" />
                    <span className="font-machina-bold tracking-wider">
                      RECOMMENDED
                    </span>
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-machina-bold text-white group-hover:text-orange-50">
                    Go Pro Today
                  </h3>
                  <p className="text-white/45 text-sm mt-1.5 max-w-md uppercase tracking-widest text-[10px]">
                    Unlimited AI interviews & Advanced analytics
                  </p>
                </div>

                <button
                  className="relative z-10 bg-[#f97316] hover:bg-orange-500 active:scale-95 px-8 py-4 rounded-xl font-machina-bold text-base flex items-center gap-3 text-white transition-all duration-200 shadow-[0_0_24px_rgba(249,115,22,0.3)] shrink-0 disabled:opacity-50"
                  onClick={() => handlePayment(499)}
                  disabled={loading}
                >
                  {loading ? (
                    <span className="animate-pulse">PROCESSING...</span>
                  ) : (
                    <>
                      <Zap size={18} />
                      <span>Upgrade — ₹499/mo</span>
                      <ArrowRight size={16} />
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </PlanGate>
        </motion.div>
      </div>
    </section>
  );
};

export default PrepGridFeatures;
