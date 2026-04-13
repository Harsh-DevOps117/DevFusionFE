"use client";
import { motion } from "framer-motion";
import { CheckCircle2, Loader2, MoveRight, Zap } from "lucide-react";
import React, { useState } from "react";
import { toast } from "react-toastify";

// ✅ 1. Point to our centralized services
import { PaymentService } from "../services/index";
import { loadRazorpayScript, openRazorpay } from "../services/razorpay";

const plans = [
  {
    name: "Starter",
    description:
      "Perfect for students just getting started with interview prep.",
    priceMonthly: 0,
    priceYearly: 0,
    popular: false,
    buttonText: "Start for Free",
    features: [
      "5 AI Mock Interviews per month",
      "100+ Basic Practice Questions",
      "In-Browser Judge0 Editor",
      "Basic Performance Dashboard",
      "Community Support",
    ],
  },
  {
    name: "Pro",
    description:
      "Everything you need to master tech interviews and secure offers.",
    priceMonthly: 499,
    priceYearly: 5000,
    popular: true,
    buttonText: "Upgrade to Pro",
    features: [
      "Unlimited AI Mock Interviews",
      "Full Premium Question Bank",
      "Instant AI Quiz Evaluation",
      "Advanced Streak & Gap Analysis",
      "Custom Resume Parsing & Tips",
      "Priority Email Support",
    ],
  },
  {
    name: "Enterprise",
    description:
      "Built for coding clubs, bootcamps, and university placements.",
    priceMonthly: 1000,
    priceYearly: 7000,
    popular: false,
    buttonText: "Contact Sales",
    features: [
      "Everything in Pro",
      "Admin Analytics Dashboard",
      "Custom Question Bank Creation",
      "Bulk User Management",
      "Dedicated Account Manager",
      "API Access",
    ],
  },
];

const PricingSection: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [isYearly, setIsYearly] = useState(false);

  const handlePayment = async (amount: number, planName: string) => {
    if (amount === 0) {
      toast.info("Enjoy Free Tier!", { theme: "dark" });
      return;
    }

    if (planName === "Enterprise") {
      toast.info("Sales query dispatched. We'll contact you soon.", {
        theme: "dark",
      });
      return;
    }

    try {
      setLoading(true);

      // 1. Load Razorpay
      const loaded = await loadRazorpayScript();
      if (!loaded) {
        toast.error("SDK_LOAD_FAILURE: Check your connection.", {
          theme: "dark",
        });
        return;
      }

      // 2. Create Order
      // ✅ Unpacking the Axios response (.data)
      const res = await PaymentService.createOrder(amount);
      const order = res.data.order;

      // 3. Open Checkout
      openRazorpay({
        key: "rzp_test_SbdeoiPyxntZ27", // Consider moving to .env
        amount: order.amount,
        currency: "INR",
        name: "PrepGrid",
        description: `Upgrading to ${planName}`,
        order_id: order.id,

        handler: async function (response: any) {
          // ✅ Unpacking the Axios response (.data)
          const verifyRes = await PaymentService.verifyPayment({
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
          });

          if (verifyRes.data.success) {
            toast.success("Success Access Granted.", {
              theme: "dark",
              icon: <Zap size={18} className="text-[#f97316]" />,
            });
            setTimeout(() => window.location.reload(), 2000);
          } else {
            toast.error("FAILED: Security breach detected.", {
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
      toast.error("PAYMENT_CANCELLED: Link terminated.", { theme: "dark" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="w-full min-h-screen bg-[#020202] py-24 px-4 sm:px-6 font-machina-normal relative overflow-hidden flex flex-col items-center">
      {/* Background Glow */}
      <div className="absolute top-[10%] left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-orange-600/5 blur-[150px] rounded-full pointer-events-none" />

      {/* Header */}
      <div className="max-w-4xl mx-auto text-center mb-12 relative z-10">
        <div className="inline-block border border-white/5 px-5 py-2 rounded-full mb-8 bg-white/[0.02] backdrop-blur-md">
          <span className="text-white/40 text-[10px] font-black tracking-[0.4em] uppercase">
            Efficiency_Index
          </span>
        </div>
        <h2 className="text-white text-4xl sm:text-5xl md:text-8xl font-black tracking-tighter leading-[0.9] mb-8">
          Upgrade<span className="text-[#f97316]">.</span>
        </h2>
        <p className="text-white/40 text-lg max-w-2xl mx-auto font-bold uppercase tracking-widest text-[10px]">
          Select protocol to establish career dominance.
        </p>
      </div>

      {/* Billing Toggle */}
      <div className="relative z-10 flex items-center justify-center mb-16">
        <div className="flex bg-[#0d0d0d] border border-white/5 rounded-2xl p-1 relative">
          <button
            onClick={() => setIsYearly(false)}
            className={`relative w-32 h-10 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all z-10 ${
              !isYearly ? "text-white" : "text-white/20"
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setIsYearly(true)}
            className={`relative w-40 h-10 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all z-10 flex items-center justify-center gap-2 ${
              isYearly ? "text-white" : "text-white/20"
            }`}
          >
            Yearly
            <span className="text-[#f97316] opacity-60">-20%</span>
          </button>
          <motion.div
            className="absolute top-1 left-1 h-10 bg-white/[0.03] border border-white/10 rounded-xl"
            initial={false}
            animate={{
              width: isYearly ? "10rem" : "8rem",
              x: isYearly ? "8rem" : "0rem",
            }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
          />
        </div>
      </div>

      {/* Cards Grid */}
      <div className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={`relative flex flex-col p-10 rounded-[2.5rem] transition-all duration-500 hover:border-white/20 border ${
              plan.popular
                ? "bg-[#0d0d0d] border-[#f97316]/30 shadow-[0_0_80px_rgba(249,115,22,0.1)] md:-mt-4"
                : "bg-white/[0.01] border-white/5"
            }`}
          >
            {plan.popular && (
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#f97316] text-black text-[9px] font-black uppercase tracking-[0.3em] px-6 py-1.5 rounded-full">
                Alpha_Node
              </div>
            )}

            <h3 className="text-white text-2xl font-black italic mb-2 uppercase tracking-tighter">
              {plan.name}
            </h3>
            <p className="text-white/20 text-[10px] font-bold uppercase tracking-widest mb-10 leading-relaxed">
              {plan.description}
            </p>

            <div className="mb-10 flex items-end gap-2">
              <span className="text-white text-5xl font-black italic tracking-tighter tabular-nums leading-none">
                ₹{isYearly ? plan.priceYearly : plan.priceMonthly}
              </span>
              <span className="text-white/20 text-[9px] font-black uppercase tracking-widest mb-1">
                / {isYearly ? "Cycle" : "Tick"}
              </span>
            </div>

            <button
              onClick={() =>
                handlePayment(
                  isYearly ? plan.priceYearly : plan.priceMonthly,
                  plan.name,
                )
              }
              disabled={loading}
              className={`w-full py-5 rounded-2xl font-black text-[11px] uppercase tracking-[0.3em] flex items-center justify-center gap-2 transition-all mb-10 ${
                plan.popular
                  ? "bg-[#f97316] text-black hover:bg-orange-400 active:scale-95"
                  : "bg-white/5 text-white hover:bg-white/10 active:scale-95 border border-white/5"
              }`}
            >
              {loading ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                plan.buttonText
              )}
              <MoveRight size={14} />
            </button>

            <div className="space-y-4">
              <p className="text-[#f97316] text-[9px] font-black uppercase tracking-[0.3em] mb-4">
                Core_Payload:
              </p>
              {plan.features.map((feature, i) => (
                <div key={i} className="flex items-start gap-4">
                  <CheckCircle2
                    size={14}
                    className={`shrink-0 mt-0.5 ${plan.popular ? "text-[#f97316]" : "text-white/10"}`}
                  />
                  <span className="text-white/40 text-xs font-bold leading-relaxed uppercase tracking-tight">
                    {feature}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default PricingSection;
