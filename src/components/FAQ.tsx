import { AnimatePresence, motion } from "framer-motion";
import {
  Briefcase,
  Building2,
  ChevronDown,
  GraduationCap,
  Quote,
  Star,
} from "lucide-react";
import React, { useState } from "react";

const credentials = [
  { icon: <Building2 size={24} />, name: "Google" },
  { icon: <Briefcase size={24} />, name: "Amazon" },
  { icon: <Building2 size={24} />, name: "Microsoft" },
  { icon: <Briefcase size={24} />, name: "Meta" },
  { icon: <GraduationCap size={24} />, name: "Top Universities" },
];

const testimonials = [
  {
    id: 1,
    name: "Rahul Sharma",
    role: "SDE-1 @ Amazon",
    image: "https://i.pravatar.cc/150?img=11",
    text: "The AI mock interviews were incredibly accurate to my actual Amazon loop. The follow-up questions adapted to my code perfectly. I couldn't have cleared it without PrepGrid.",
  },
  {
    id: 2,
    name: "Priya Patel",
    role: "Frontend Developer",
    image: "https://i.pravatar.cc/150?img=44",
    text: "Having the Judge0 editor right inside the platform is a game-changer. I completely stopped switching between LeetCode and other sites. The streak tracker kept me disciplined.",
  },
  {
    id: 3,
    name: "Amit Kumar",
    role: "Placed via Campus Drive",
    image: "https://i.pravatar.cc/150?img=33",
    text: "The automated resume review told me exactly what I was missing. I used the Free Tier to prep for my college placements and secured two offers in a week!",
  },
];

const faqs = [
  {
    question: "Is the Free Tier actually free?",
    answer:
      "Yes! You get 5 full AI-powered mock interviews per month and access to 100+ basic practice questions completely free. No credit card is required to sign up.",
  },
  {
    question: "What roles do the AI interviews support?",
    answer:
      "Currently, our AI is trained to conduct rigorous technical interviews for Frontend, Backend, Full Stack, and pure DSA (Data Structures & Algorithms) roles. We are constantly adding more specializations.",
  },
  {
    question: "How does the in-browser code editor work?",
    answer:
      "We use the Judge0 API to compile and run your code securely in the cloud. It supports syntax highlighting and execution for over 40+ programming languages including C++, Java, Python, and JavaScript.",
  },
  {
    question: "Can I cancel my Pro subscription anytime?",
    answer:
      "Absolutely. You can manage your billing directly from your dashboard. If you cancel, you will retain your Pro access until the end of your current billing cycle.",
  },
];

const FAQItem = ({
  question,
  answer,
  isOpen,
  onClick,
}: {
  question: string;
  answer: string;
  isOpen: boolean;
  onClick: () => void;
}) => {
  return (
    <div className="border-b border-white/10 last:border-0">
      <button
        onClick={onClick}
        className="w-full flex items-center justify-between py-6 text-left focus:outline-none group"
      >
        <span className="text-white text-lg sm:text-xl font-machina-bold group-hover:text-[#f97316] transition-colors">
          {question}
        </span>
        <ChevronDown
          className={`text-white/50 shrink-0 transition-transform duration-300 ${isOpen ? "rotate-180 text-[#f97316]" : ""}`}
          size={24}
        />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <p className="text-white/60 text-base sm:text-lg font-machina-light pb-6 leading-relaxed">
              {answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const TestimonialsAndFAQ: React.FC = () => {
  const [openFAQ, setOpenFAQ] = useState<number | null>(0);

  return (
    <section className="w-full bg-[#0a0a0a] py-24 px-4 sm:px-6 relative overflow-hidden font-machina-normal">
      <div className="absolute top-[20%] left-[-10%] w-[500px] h-[500px] bg-orange-600/5 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[10%] right-[-10%] w-[600px] h-[600px] bg-orange-500/5 blur-[150px] rounded-full pointer-events-none" />

      {/* --- PART 1: CREDENTIALS (Logos) --- */}
      <div className="max-w-5xl mx-auto mb-32 relative z-10">
        <p className="text-center text-white/40 text-sm font-machina-bold tracking-widest uppercase mb-8">
          Our students have cracked interviews at
        </p>
        <div className="flex flex-wrap justify-center items-center gap-8 sm:gap-16 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
          {credentials.map((cred, idx) => (
            <div
              key={idx}
              className="flex items-center gap-2 text-white hover:text-[#f97316] transition-colors"
            >
              {cred.icon}
              <span className="text-lg sm:text-xl font-machina-bold">
                {cred.name}
              </span>
            </div>
          ))}
        </div>
      </div>
      <div className="max-w-6xl mx-auto mb-32 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-white text-4xl sm:text-5xl font-machina-bold mb-4">
            Don't just take{" "}
            <span className="italic font-machina-light text-[#f97316]">
              our word
            </span>{" "}
            for it.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <div
              key={t.id}
              className="bg-[#141414] border border-white/10 p-8 rounded-[2rem] flex flex-col justify-between hover:-translate-y-2 hover:border-orange-500/30 transition-all duration-300 shadow-xl"
            >
              <div>
                <div className="flex gap-1 mb-6">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      size={16}
                      fill="#f97316"
                      className="text-[#f97316]"
                    />
                  ))}
                </div>
                <Quote size={32} className="text-white/10 mb-4" />
                <p className="text-white/80 text-lg font-machina-light leading-relaxed mb-8">
                  "{t.text}"
                </p>
              </div>
              <div className="flex items-center gap-4 border-t border-white/5 pt-6 mt-auto">
                <img
                  src={t.image}
                  alt={t.name}
                  className="w-12 h-12 rounded-full object-cover border border-white/20"
                />
                <div>
                  <h4 className="text-white font-machina-bold text-base">
                    {t.name}
                  </h4>
                  <p className="text-[#f97316] text-sm font-machina-light">
                    {t.role}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="max-w-3xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <div className="inline-block border border-[#f97316]/30 bg-[#f97316]/5 text-[#f97316] text-xs font-machina-bold tracking-[3px] px-6 py-2 rounded-full mb-6 uppercase">
            Got Questions?
          </div>
          <h2 className="text-white text-4xl sm:text-5xl font-machina-bold">
            Frequently Asked{" "}
            <span className="italic font-machina-light">Questions</span>
          </h2>
        </div>

        <div className="bg-[#111111] border border-white/10 rounded-[2rem] p-6 sm:p-10 shadow-2xl">
          {faqs.map((faq, index) => (
            <FAQItem
              key={index}
              question={faq.question}
              answer={faq.answer}
              isOpen={openFAQ === index}
              onClick={() => setOpenFAQ(openFAQ === index ? null : index)}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsAndFAQ;
