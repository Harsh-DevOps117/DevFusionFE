import { motion } from "framer-motion";
import { CheckCircle2, MoveRight } from "lucide-react";
import React, { useState } from "react";

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
    priceMonthly: 12,
    priceYearly: 99,
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
    priceMonthly: 49,
    priceYearly: 499,
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
  const [isYearly, setIsYearly] = useState(false);

  return (
    <section className="w-full min-h-screen bg-[#0a0a0a] py-24 px-4 sm:px-6 font-machina-normal relative overflow-hidden flex flex-col items-center">
      {/* Background Subtle Glows */}
      <div className="absolute top-[10%] left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-orange-600/10 blur-[150px] rounded-full pointer-events-none" />

      {/* Header Area */}
      <div className="max-w-4xl mx-auto text-center mb-12 relative z-10">
        <div className="inline-block border border-white/10 px-5 py-2 rounded-full mb-8 bg-white/[0.02] backdrop-blur-md">
          <span className="text-[#f97316] text-xs font-machina-bold tracking-[0.2em] uppercase">
            Pricing Plans
          </span>
        </div>
        <h2 className="text-white text-4xl sm:text-5xl md:text-6xl font-machina-light leading-tight mb-6">
          Invest in your <br className="hidden md:block" />
          <span className="font-machina-bold italic">Tech Career</span>
        </h2>
        <p className="text-white/60 text-lg max-w-2xl mx-auto font-machina-light">
          Choose the perfect plan to accelerate your interview preparation and
          land your dream software engineering role.
        </p>
      </div>

      {/* Animated Billing Toggle */}
      <div className="relative z-10 flex items-center justify-center mb-16">
        <div className="flex bg-[#111111] border border-white/10 rounded-full p-1.5 relative shadow-inner">
          <button
            onClick={() => setIsYearly(false)}
            className={`relative w-40 h-12 rounded-full text-sm font-machina-bold transition-colors z-10 ${
              !isYearly ? "text-white" : "text-white/50 hover:text-white/80"
            }`}
          >
            Monthly
          </button>

          <button
            onClick={() => setIsYearly(true)}
            className={`relative w-48 h-12 rounded-full text-sm font-machina-bold transition-colors z-10 flex items-center justify-center gap-2 ${
              isYearly ? "text-white" : "text-white/50 hover:text-white/80"
            }`}
          >
            Yearly
            <span className="bg-orange-500/20 text-[#f97316] text-[10px] px-2 py-0.5 rounded-full border border-orange-500/30">
              Save 20%
            </span>
          </button>

          {/* The Sliding Background Pill */}
          <motion.div
            className="absolute top-1.5 left-1.5 h-12 bg-gradient-to-r from-orange-600 to-orange-500 rounded-full shadow-[0_0_20px_rgba(249,115,22,0.4)]"
            initial={false}
            animate={{
              width: isYearly ? "12rem" : "10rem",
              x: isYearly ? "10rem" : "0rem",
            }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            style={{ zIndex: 0 }}
          />
        </div>
      </div>

      {/* Pricing Cards Grid */}
      <div className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
        {plans.map((plan, index) => (
          <div
            key={plan.name}
            className={`relative flex flex-col p-8 sm:p-10 rounded-[2rem] transition-transform duration-300 hover:-translate-y-2 ${
              plan.popular
                ? "bg-[#141414] border border-[#f97316] shadow-[0_0_40px_-15px_rgba(249,115,22,0.3)] md:-mt-4 md:mb-4"
                : "bg-[#111111] border border-white/10"
            }`}
          >
            {/* Popular Badge */}
            {plan.popular && (
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-orange-600 to-orange-500 text-white text-xs font-machina-bold uppercase tracking-widest px-6 py-1.5 rounded-full shadow-lg">
                Most Popular
              </div>
            )}

            {/* Plan Header */}
            <h3 className="text-white text-2xl font-machina-bold mb-2">
              {plan.name}
            </h3>
            <p className="text-white/50 text-sm font-machina-light mb-8 min-h-[40px]">
              {plan.description}
            </p>

            {/* Price */}
            <div className="mb-8 flex items-end gap-2">
              <span className="text-white text-5xl font-machina-bold leading-none">
                ${isYearly ? plan.priceYearly : plan.priceMonthly}
              </span>
              <span className="text-white/40 text-sm font-machina-light mb-1">
                / {isYearly ? "year" : "month"}
              </span>
            </div>

            {/* CTA Button */}
            <button
              className={`w-full py-4 rounded-full font-machina-bold text-sm flex items-center justify-center gap-2 transition-all mb-10 group ${
                plan.popular
                  ? "bg-[#f97316] hover:bg-[#fb923c] text-white shadow-lg shadow-orange-500/20 active:scale-95"
                  : "bg-white/[0.03] hover:bg-white/10 border border-white/10 text-white active:scale-95"
              }`}
            >
              {plan.buttonText}
              <MoveRight
                size={16}
                className="group-hover:translate-x-1 transition-transform"
              />
            </button>

            {/* Features List */}
            <div className="flex flex-col gap-4 flex-1">
              <p className="text-white text-sm font-machina-bold mb-2">
                What's included:
              </p>
              {plan.features.map((feature, i) => (
                <div key={i} className="flex items-start gap-3">
                  <CheckCircle2
                    size={18}
                    className={`shrink-0 mt-0.5 ${plan.popular ? "text-[#f97316]" : "text-white/40"}`}
                  />
                  <span className="text-white/80 text-sm font-machina-light leading-relaxed">
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
