"use client";
import {
  AlertTriangle,
  BrainCircuit,
  CheckCircle2,
  Layers,
  Terminal,
  Trophy,
  Zap,
} from "lucide-react";
import { useEffect, useState } from "react";
import { api } from "../utils/api";

// const api = axios.create({
//   baseURL: "http://16.171.200.75/v1",
//   withCredentials: true,
// });

type Step = "setup" | "generating" | "active" | "result";
type Difficulty = "easy" | "medium" | "hard";

export default function QuizPage() {
  // State Management
  const [step, setStep] = useState<Step>("setup");
  const [topic, setTopic] = useState("");
  const [difficulty, setDifficulty] = useState<Difficulty>("medium");
  const [jobId, setJobId] = useState<string | null>(null);
  const [quizData, setQuizData] = useState<any>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [score, setScore] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [timeLeft, setTimeLeft] = useState(0);
  const [totalTime, setTotalTime] = useState(0);

  // --- 1. INITIAL GENERATION ---
  const handleGenerate = async () => {
    if (!topic.trim()) return;
    setStep("generating");
    try {
      const res = await api.post("/generate", { topic, difficulty });
      const id = res.data.data?.jobId;
      if (id) setJobId(id);
      else throw new Error("Job ID missing");
    } catch (err) {
      setStep("setup");
      alert("Failed to initialize neural synthesis.");
    }
  };

  // --- 2. POLLING ENGINE ---
  useEffect(() => {
    let interval: any;
    if (step === "generating" && jobId) {
      interval = setInterval(async () => {
        try {
          const res = await api.get(`/status/${jobId}`);
          if (res.data.success && res.data.data.state === "completed") {
            clearInterval(interval);
            const qId = res.data.data.result?.quizId;
            if (qId) {
              const quizRes = await api.get(`/${qId}`);
              const data = quizRes.data.data || quizRes.data;
              setQuizData(data);
              setTotalTime(data.questions.length * 30);
              setTimeLeft(data.questions.length * 30);
              setStep("active");
            }
          } else if (res.data.data.state === "failed") {
            clearInterval(interval);
            setStep("setup");
            alert("AI Generation failed.");
          }
        } catch (err) {
          console.error("Heartbeat lost");
        }
      }, 2000);
    }
    return () => clearInterval(interval);
  }, [step, jobId]);

  // --- 3. TIMER LOGIC ---
  useEffect(() => {
    if (step === "active" && timeLeft > 0) {
      const t = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
      return () => clearInterval(t);
    } else if (step === "active" && timeLeft === 0) {
      handleSubmit();
    }
  }, [step, timeLeft]);

  // --- 4. SUBMISSION ---
  const handleSubmit = async () => {
    setIsSubmitting(true);
    const formatted = quizData.questions.map((q: any) => ({
      questionId: q.id,
      selected: answers[q.id] || "",
    }));

    try {
      const res = await api.post("/submit", {
        quizId: quizData.id,
        answers: formatted,
      });
      setScore(res.data.data.score);
      setStep("result");
    } catch (err) {
      alert("Evaluation failed.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const timerPct = totalTime > 0 ? (timeLeft / totalTime) * 100 : 0;
  const timerColor =
    timeLeft / totalTime > 0.5
      ? "#22c55e"
      : timeLeft / totalTime > 0.25
        ? "#f97316"
        : "#ef4444";

  // ==========================================
  // RENDER: SETUP
  // ==========================================
  if (step === "setup")
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center p-6 font-['fontNormal']">
        <div className="w-full max-w-[460px] bg-[#0d0d0d] border border-white/10 rounded-[32px] p-12 relative overflow-hidden">
          <div className="absolute -top-20 -right-20 w-[220px] h-[220px] bg-[#f97316]/10 blur-[60px] rounded-full pointer-events-none" />

          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 bg-[#f97316]/10 border border-[#f97316]/20 rounded-xl px-3 py-1.5 mb-6">
              <Zap size={16} className="text-[#f97316]" />
              <span className="text-[10px] font-bold text-[#f97316] uppercase tracking-widest">
                Quiz_Enclave
              </span>
            </div>

            <h2 className="text-3xl font-extrabold text-white tracking-tighter leading-tight mb-2">
              PrepGrid MCQ
              <br />
            </h2>
            <p className="text-[9px] font-bold text-white/20 uppercase tracking-[0.4em] mb-10">
              Automated Assessment Synthesis
            </p>

            <div className="space-y-6">
              <div>
                <label className="text-[9px] font-bold text-[#f97316] uppercase tracking-widest block mb-3">
                  Target_Subject
                </label>
                <input
                  className="w-full bg-[#0a0a0a] border border-white/5 p-5 rounded-2xl text-white text-sm outline-none focus:border-[#f97316]/40 transition-all placeholder:text-white/10"
                  placeholder="e.g. System_Design"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                />
              </div>

              <div>
                <label className="text-[9px] font-bold text-[#f97316] uppercase tracking-widest block mb-3">
                  Difficulty_Mode
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    {
                      id: "easy",
                      label: "Easy",
                      color: "#22c55e",
                      desc: "Fundamentals",
                    },
                    {
                      id: "medium",
                      label: "Medium",
                      color: "#f97316",
                      desc: "Applied",
                    },
                    {
                      id: "hard",
                      label: "Hard",
                      color: "#ef4444",
                      desc: "Expert",
                    },
                  ].map((d) => (
                    <button
                      key={d.id}
                      onClick={() => setDifficulty(d.id as Difficulty)}
                      className={`flex flex-col items-center gap-1.5 p-4 rounded-2xl border transition-all ${
                        difficulty === d.id
                          ? `bg-white/5 border-[${d.color}]/50`
                          : "bg-[#0a0a0a] border-white/5 hover:border-white/10"
                      }`}
                      style={{
                        borderColor: difficulty === d.id ? d.color : "",
                      }}
                    >
                      <div
                        className="w-2 h-2 rounded-full"
                        style={{ background: d.color }}
                      />
                      <span
                        className="text-[10px] font-bold uppercase"
                        style={{
                          color:
                            difficulty === d.id
                              ? d.color
                              : "rgba(255,255,255,0.4)",
                        }}
                      >
                        {d.label}
                      </span>
                      <span className="text-[8px] text-white/20 uppercase tracking-tighter">
                        {d.desc}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={handleGenerate}
                disabled={!topic.trim()}
                className="w-full py-5 bg-white text-black rounded-2xl font-black uppercase text-[11px] tracking-widest hover:bg-[#f97316] hover:text-white transition-all disabled:opacity-10 active:scale-95 shadow-2xl"
              >
                Initialize_Synthesis
              </button>
            </div>
          </div>
        </div>
      </div>
    );

  // ==========================================
  // RENDER: GENERATING
  // ==========================================
  if (step === "generating")
    return (
      <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center font-['fontNormal']">
        <div className="relative w-28 h-28 mb-10">
          <div className="absolute inset-0 border-[1.5px] border-white/5 border-t-[#f97316] rounded-full animate-spin" />
          <div className="absolute inset-4 border border-[#f97316]/20 border-b-[#f97316] rounded-full animate-[spin_0.8s_linear_infinite_reverse]" />
          <BrainCircuit
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[#f97316] animate-pulse"
            size={24}
          />
        </div>
        <div className="text-center space-y-2">
          <h2 className="text-[10px] font-bold tracking-[0.5em] uppercase text-[#f97316]">
            Synthesizing Questions
          </h2>
          <p className="text-[9px] text-white/20 uppercase tracking-widest">
            Neural workers structuring assessment...
          </p>
        </div>
      </div>
    );

  // ==========================================
  // RENDER: ACTIVE
  // ==========================================
  if (step === "active" && quizData)
    return (
      <div className="min-h-screen bg-[#050505] text-white p-4 py-8 font-['fontNormal']">
        <div className="max-w-[860px] mx-auto space-y-4">
          {/* HUD HEADER */}
          <header className="sticky top-4 z-50 bg-[#0a0a0a]/80 backdrop-blur-2xl border border-white/5 p-5 rounded-3xl flex justify-between items-center shadow-2xl">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center">
                <Layers size={18} className="text-[#f97316]" />
              </div>
              <div>
                <h1 className="text-base font-black uppercase tracking-tight leading-none">
                  {quizData.topic}
                </h1>
                <p className="text-[8px] text-[#f97316] font-bold uppercase tracking-[0.3em] mt-2">
                  Assessment_Stream_Live
                </p>
              </div>
            </div>

            <div className="flex items-center gap-6">
              <div className="text-right">
                <div className="text-2xl font-black italic">
                  {Object.keys(answers).length}
                  <span className="text-white/10 not-italic text-sm">
                    {" "}
                    / {quizData.questions.length}
                  </span>
                </div>
                <p className="text-[8px] uppercase tracking-widest text-white/20">
                  Resolved
                </p>
              </div>
              <div className="w-px h-8 bg-white/5" />
              <button
                onClick={handleSubmit}
                className="bg-[#f97316] text-black px-6 py-2.5 rounded-xl font-bold uppercase text-[10px] tracking-widest hover:bg-white transition-all active:scale-95"
              >
                Commit_Now
              </button>
            </div>
          </header>

          {/* TIMER BAR */}
          <div className="px-2 space-y-1.5 mb-6">
            <div className="flex justify-between items-end">
              <span className="text-[9px] font-bold text-white/20 uppercase tracking-widest">
                Session_Timer
              </span>
              <span
                className="text-xs font-mono font-bold"
                style={{ color: timerColor }}
              >
                {Math.floor(timeLeft / 60)}:
                {String(timeLeft % 60).padStart(2, "0")}
              </span>
            </div>
            <div className="h-0.5 bg-white/5 rounded-full overflow-hidden">
              <div
                className="h-full transition-all duration-1000"
                style={{ width: `${timerPct}%`, backgroundColor: timerColor }}
              />
            </div>
          </div>

          {/* FEED */}
          <div className="space-y-3">
            {quizData.questions.map((q: any, i: number) => (
              <div
                key={q.id}
                className={`p-10 rounded-[2.5rem] border transition-all duration-500 ${answers[q.id] ? "bg-[#0a0a0a] border-white/10" : "bg-[#080808] border-white/5"}`}
              >
                <div className="flex justify-between items-center mb-6">
                  <div className="flex items-center gap-2">
                    <Terminal size={12} className="text-[#f97316]/40" />
                    <span className="text-[9px] font-bold text-white/20 uppercase tracking-[0.4em]">
                      Node_{String(i + 1).padStart(2, "0")}
                    </span>
                  </div>
                  {answers[q.id] && (
                    <CheckCircle2 size={14} className="text-[#f97316]" />
                  )}
                </div>

                <h3 className="text-xl font-medium mb-10 leading-relaxed text-white/90">
                  {q.question}
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {q.options.map((opt: string) => (
                    <button
                      key={opt}
                      onClick={() => setAnswers({ ...answers, [q.id]: opt })}
                      className={`p-5 rounded-2xl border text-left text-sm font-bold transition-all flex justify-between items-center group ${
                        answers[q.id] === opt
                          ? "bg-[#f97316] border-[#f97316] text-black"
                          : "bg-black/40 border-white/5 text-white/40 hover:border-white/20"
                      }`}
                    >
                      <span>{opt}</span>
                      <div
                        className={`w-4 h-4 rounded-full border flex items-center justify-center ${answers[q.id] === opt ? "border-black/20" : "border-white/10"}`}
                      >
                        {answers[q.id] === opt && (
                          <div className="w-2 h-2 bg-black rounded-full" />
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* PARTIAL WARN */}
          {Object.keys(answers).length < quizData.questions.length && (
            <div className="p-5 bg-[#f97316]/5 border border-[#f97316]/10 rounded-2xl flex items-center gap-4 animate-pulse">
              <AlertTriangle className="text-[#f97316]" size={18} />
              <p className="text-[9px] text-[#f97316]/80 uppercase tracking-widest">
                Partial Session —{" "}
                {quizData.questions.length - Object.keys(answers).length}{" "}
                unresolved nodes will be marked inefficient.
              </p>
            </div>
          )}
        </div>
      </div>
    );

  // ==========================================
  // RENDER: RESULT
  // ==========================================
  if (step === "result")
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center p-6 font-['fontNormal']">
        <div className="w-full max-w-[460px] bg-[#0d0d0d] border border-white/10 rounded-[48px] p-16 text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-[#f97316] to-transparent" />
          <div className="w-16 h-16 bg-[#f97316]/10 border border-[#f97316]/20 rounded-2xl flex items-center justify-center mx-auto mb-10">
            <Trophy size={32} className="text-[#f97316]" />
          </div>
          <h1 className="text-[120px] font-black italic italic leading-none tracking-tighter text-white">
            {score}
          </h1>
          <p className="text-[#f97316] text-[10px] font-bold tracking-[0.6em] uppercase mt-2">
            System_Efficiency_%
          </p>

          <div className="mt-12 flex gap-3">
            <button
              onClick={() => window.location.reload()}
              className="flex-1 py-4 bg-white text-black rounded-2xl font-bold uppercase text-[10px] tracking-widest hover:bg-[#f97316] hover:text-white transition-all"
            >
              New_Session
            </button>
            <button
              onClick={() => (window.location.href = "/")}
              className="flex-1 py-4 bg-white/5 border border-white/10 text-white rounded-2xl font-bold uppercase text-[10px] tracking-widest hover:bg-white/10 transition-all"
            >
              Exit_Lab
            </button>
          </div>
        </div>
      </div>
    );

  return null;
}
