"use client";
import {
  AlertTriangle,
  BrainCircuit,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Layers,
  Terminal,
  Trophy,
  XCircle,
  Zap,
} from "lucide-react";
import { useEffect, useState } from "react";

import { QuizService } from "../services/index";

type Step = "setup" | "generating" | "active" | "result";
type Difficulty = "easy" | "medium" | "hard";

export default function QuizPage() {
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
  const [expandedExplanations, setExpandedExplanations] = useState<
    Record<string, boolean>
  >({});

  const handleGenerate = async () => {
    if (!topic.trim()) return;
    setStep("generating");
    try {
      const res = await QuizService.generate({ topic, difficulty });
      const id = res.data.data?.jobId;
      if (id) setJobId(id);
      else throw new Error("Job ID missing");
    } catch (err) {
      setStep("setup");
      alert("Failed to initialize neural synthesis.");
    }
  };

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (step === "generating" && jobId) {
      interval = setInterval(async () => {
        try {
          const res = await QuizService.getStatus(jobId);
          if (res.data.success && res.data.data.state === "completed") {
            clearInterval(interval);
            const qId = res.data.data.result?.quizId;
            if (qId) {
              const quizRes = await QuizService.getQuiz(qId);
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

  useEffect(() => {
    if (step === "active" && timeLeft > 0) {
      const t = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
      return () => clearInterval(t);
    } else if (step === "active" && timeLeft === 0) {
      handleSubmit();
    }
  }, [step, timeLeft]);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    const formatted = quizData.questions.map((q: any) => ({
      questionId: q.id,
      selected: answers[q.id] || "",
    }));

    try {
      const res = await QuizService.submit({
        quizId: quizData.id,
        answers: formatted,
      });
      setScore(res.data.data.score);

      if (res.data.data.quiz) {
        setQuizData(res.data.data.quiz);
      } else if (res.data.data.questions) {
        setQuizData({ ...quizData, questions: res.data.data.questions });
      }

      setStep("result");
    } catch (err) {
      alert("Evaluation failed.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleExplanation = (id: string) => {
    setExpandedExplanations((prev) => ({ ...prev, [id]: !prev[id] }));
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
      <div className="min-h-screen bg-[#050505] flex items-center justify-center p-4 sm:p-6 font-['fontNormal']">
        <div className="w-full max-w-[460px] bg-[#0d0d0d] border border-white/10 rounded-[24px] sm:rounded-[32px] p-6 sm:p-10 lg:p-12 relative overflow-hidden">
          <div className="absolute -top-20 -right-20 w-[220px] h-[220px] bg-[#f97316]/10 blur-[60px] rounded-full pointer-events-none" />

          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 bg-[#f97316]/10 border border-[#f97316]/20 rounded-xl px-3 py-1.5 mb-5 sm:mb-6">
              <Zap size={14} className="text-[#f97316]" />
              <span className="text-[10px] font-bold text-[#f97316] uppercase tracking-widest">
                Quiz_Enclave
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tighter leading-tight mb-2">
              PrepGrid MCQ
            </h2>
            <p className="text-[9px] font-bold text-white/20 uppercase tracking-[0.4em] mb-8 sm:mb-10">
              Automated Assessment Synthesis
            </p>

            <div className="space-y-5 sm:space-y-6">
              <div>
                <label className="text-[9px] font-bold text-[#f97316] uppercase tracking-widest block mb-2 sm:mb-3">
                  Target_Subject
                </label>
                <input
                  className="w-full bg-[#0a0a0a] border border-white/5 p-4 sm:p-5 rounded-2xl text-white text-sm outline-none focus:border-[#f97316]/40 transition-all placeholder:text-white/10"
                  placeholder="e.g. System_Design"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                />
              </div>

              <div>
                <label className="text-[9px] font-bold text-[#f97316] uppercase tracking-widest block mb-2 sm:mb-3">
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
                      className={`flex flex-col items-center gap-1.5 p-3 sm:p-4 rounded-2xl border transition-all ${
                        difficulty === d.id
                          ? "bg-white/5"
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
                      <span className="text-[8px] text-white/20 uppercase tracking-tighter hidden sm:block">
                        {d.desc}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={handleGenerate}
                disabled={!topic.trim()}
                className="w-full py-4 sm:py-5 bg-white text-black rounded-2xl font-black uppercase text-[11px] tracking-widest hover:bg-[#f97316] hover:text-white transition-all disabled:opacity-10 active:scale-95 shadow-2xl"
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
      <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center font-['fontNormal'] px-4">
        <div className="relative w-24 h-24 sm:w-28 sm:h-28 mb-8 sm:mb-10">
          <div className="absolute inset-0 border-[1.5px] border-white/5 border-t-[#f97316] rounded-full animate-spin" />
          <div className="absolute inset-4 border border-[#f97316]/20 border-b-[#f97316] rounded-full animate-[spin_0.8s_linear_infinite_reverse]" />
          <BrainCircuit
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[#f97316] animate-pulse"
            size={22}
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
      <div className="min-h-screen bg-[#050505] text-white p-3 sm:p-4 py-6 sm:py-8 font-['fontNormal']">
        <div className="max-w-[860px] mx-auto space-y-4">
          {/* HUD HEADER */}
          <header className="sticky top-3 sm:top-4 z-50 bg-[#0a0a0a]/80 backdrop-blur-2xl border border-white/5 p-4 sm:p-5 rounded-2xl sm:rounded-3xl shadow-2xl">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 sm:gap-0">
              {/* Left: Topic */}
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 sm:w-10 sm:h-10 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Layers size={16} className="text-[#f97316]" />
                </div>
                <div>
                  <h1 className="text-sm sm:text-base font-black uppercase tracking-tight leading-none">
                    {quizData.topic}
                  </h1>
                  <p className="text-[8px] text-[#f97316] font-bold uppercase tracking-[0.3em] mt-1.5">
                    Assessment_Stream_Live
                  </p>
                </div>
              </div>

              {/* Right: Counter + Button */}
              <div className="flex items-center justify-between sm:justify-end gap-4 sm:gap-6">
                <div className="text-left sm:text-right">
                  <div className="text-xl sm:text-2xl font-black italic">
                    {Object.keys(answers).length}
                    <span className="text-white/10 not-italic text-xs sm:text-sm">
                      {" "}
                      / {quizData.questions.length}
                    </span>
                  </div>
                  <p className="text-[8px] uppercase tracking-widest text-white/20">
                    Resolved
                  </p>
                </div>
                <div className="hidden sm:block w-px h-8 bg-white/5" />
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="bg-[#f97316] text-black px-4 sm:px-6 py-2 sm:py-2.5 rounded-xl font-bold uppercase text-[10px] tracking-widest hover:bg-white transition-all active:scale-95 disabled:opacity-50 whitespace-nowrap"
                >
                  {isSubmitting ? "Evaluating..." : "Commit_Now"}
                </button>
              </div>
            </div>
          </header>

          {/* TIMER BAR */}
          <div className="px-1 sm:px-2 space-y-1.5 mb-4 sm:mb-6">
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

          {/* QUESTION FEED */}
          <div className="space-y-3">
            {quizData.questions.map((q: any, i: number) => (
              <div
                key={q.id}
                className={`p-5 sm:p-8 lg:p-10 rounded-[2rem] sm:rounded-[2.5rem] border transition-all duration-500 ${
                  answers[q.id]
                    ? "bg-[#0a0a0a] border-white/10"
                    : "bg-[#080808] border-white/5"
                }`}
              >
                <div className="flex justify-between items-center mb-4 sm:mb-6">
                  <div className="flex items-center gap-2">
                    <Terminal size={11} className="text-[#f97316]/40" />
                    <span className="text-[9px] font-bold text-white/20 uppercase tracking-[0.4em]">
                      Node_{String(i + 1).padStart(2, "0")}
                    </span>
                  </div>
                  {answers[q.id] && (
                    <CheckCircle2 size={14} className="text-[#f97316]" />
                  )}
                </div>

                <h3 className="text-base sm:text-lg lg:text-xl font-medium mb-6 sm:mb-8 lg:mb-10 leading-relaxed text-white/90">
                  {q.question}
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {q.options.map((opt: string) => (
                    <button
                      key={opt}
                      onClick={() => setAnswers({ ...answers, [q.id]: opt })}
                      className={`p-4 sm:p-5 rounded-2xl border text-left text-xs sm:text-sm font-bold transition-all flex justify-between items-center gap-2 ${
                        answers[q.id] === opt
                          ? "bg-[#f97316] border-[#f97316] text-black"
                          : "bg-black/40 border-white/5 text-white/40 hover:border-white/20"
                      }`}
                    >
                      <span className="leading-snug">{opt}</span>
                      <div
                        className={`w-4 h-4 rounded-full border flex-shrink-0 flex items-center justify-center ${
                          answers[q.id] === opt
                            ? "border-black/20"
                            : "border-white/10"
                        }`}
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
            <div className="p-4 sm:p-5 bg-[#f97316]/5 border border-[#f97316]/10 rounded-2xl flex items-start sm:items-center gap-3 sm:gap-4 animate-pulse">
              <AlertTriangle
                className="text-[#f97316] flex-shrink-0 mt-0.5 sm:mt-0"
                size={16}
              />
              <p className="text-[9px] text-[#f97316]/80 uppercase tracking-widest leading-relaxed">
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
  if (step === "result" && quizData) {
    const totalQ = quizData.questions.length;

    const correctCount = quizData.questions.filter((q: any) => {
      const uAns = String(answers[q.id] || "")
        .trim()
        .toLowerCase();
      const cAns = String(q.correctAnswer || "")
        .trim()
        .toLowerCase();
      return uAns === cAns && uAns !== "";
    }).length;

    const wrongCount = totalQ - correctCount;

    return (
      <div className="min-h-screen bg-[#050505] text-white p-3 sm:p-6 py-8 sm:py-12 font-['fontNormal']">
        <div className="max-w-[720px] mx-auto space-y-4">
          {/* SCORE CARD */}
          <div className="bg-[#0d0d0d] border border-white/10 rounded-[32px] sm:rounded-[48px] p-8 sm:p-12 text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-[#f97316] to-transparent" />

            <div className="w-14 h-14 sm:w-16 sm:h-16 bg-[#f97316]/10 border border-[#f97316]/20 rounded-2xl flex items-center justify-center mx-auto mb-6 sm:mb-8">
              <Trophy size={28} className="text-[#f97316]" />
            </div>

            <h1 className="text-[72px] sm:text-[100px] font-black italic leading-none tracking-tighter text-white">
              {score}
            </h1>
            <p className="text-[#f97316] text-[10px] font-bold tracking-[0.6em] uppercase mt-2 mb-6 sm:mb-8">
              System_Efficiency_%
            </p>

            {/* STAT PILLS */}
            <div className="flex justify-center gap-2 sm:gap-3 flex-wrap">
              <div className="flex items-center gap-2 bg-green-500/10 border border-green-500/20 rounded-xl px-3 sm:px-4 py-2">
                <CheckCircle2 size={12} className="text-green-400" />
                <span className="text-green-400 text-[10px] sm:text-[11px] font-bold uppercase tracking-widest">
                  {correctCount} Correct
                </span>
              </div>
              <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 rounded-xl px-3 sm:px-4 py-2">
                <XCircle size={12} className="text-red-400" />
                <span className="text-red-400 text-[10px] sm:text-[11px] font-bold uppercase tracking-widest">
                  {wrongCount} Wrong
                </span>
              </div>
              <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-3 sm:px-4 py-2">
                <Layers size={12} className="text-white/40" />
                <span className="text-white/40 text-[10px] sm:text-[11px] font-bold uppercase tracking-widest">
                  {totalQ} Total
                </span>
              </div>
            </div>
          </div>

          {/* SECTION LABEL */}
          <div className="flex items-center gap-3 px-1 sm:px-2 pt-3 sm:pt-4">
            <Terminal size={11} className="text-[#f97316]/60" />
            <span className="text-[9px] font-bold text-white/30 uppercase tracking-[0.4em]">
              Answer_Review_Log
            </span>
            <div className="flex-1 h-px bg-white/5" />
          </div>

          {/* ANSWER REVIEW CARDS */}
          <div className="space-y-3">
            {quizData.questions.map((q: any, i: number) => {
              const userAnswerRaw = answers[q.id] || "";
              const correctRaw = q.correctAnswer || "";

              const userAnswerNorm = String(userAnswerRaw).trim().toLowerCase();
              const correctNorm = String(correctRaw).trim().toLowerCase();

              const isSkipped = !userAnswerRaw;
              const isCorrect = !isSkipped && userAnswerNorm === correctNorm;
              const isExpanded = expandedExplanations[q.id];

              return (
                <div
                  key={q.id}
                  className={`rounded-2xl sm:rounded-3xl border overflow-hidden transition-all duration-300 ${
                    isCorrect
                      ? "bg-green-500/[0.04] border-green-500/15"
                      : isSkipped
                        ? "bg-white/[0.02] border-white/8"
                        : "bg-red-500/[0.04] border-red-500/15"
                  }`}
                >
                  {/* CARD HEADER */}
                  <div className="p-4 sm:p-6 pb-3 sm:pb-4">
                    <div className="flex items-start justify-between gap-3 sm:gap-4 mb-3 sm:mb-4">
                      <div className="flex items-center gap-2">
                        {isCorrect ? (
                          <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-xl bg-green-500/15 flex items-center justify-center flex-shrink-0">
                            <CheckCircle2
                              size={12}
                              className="text-green-400"
                            />
                          </div>
                        ) : isSkipped ? (
                          <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-xl bg-white/5 flex items-center justify-center flex-shrink-0">
                            <AlertTriangle
                              size={12}
                              className="text-white/20"
                            />
                          </div>
                        ) : (
                          <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-xl bg-red-500/15 flex items-center justify-center flex-shrink-0">
                            <XCircle size={12} className="text-red-400" />
                          </div>
                        )}

                        <span
                          className={`text-[9px] font-bold uppercase tracking-[0.4em] ${
                            isCorrect
                              ? "text-green-400/60"
                              : isSkipped
                                ? "text-white/20"
                                : "text-red-400/60"
                          }`}
                        >
                          {isCorrect
                            ? "Correct"
                            : isSkipped
                              ? "Skipped"
                              : "Incorrect"}{" "}
                          · Node_{String(i + 1).padStart(2, "0")}
                        </span>
                      </div>

                      {q.explanation && (
                        <button
                          onClick={() => toggleExplanation(q.id)}
                          className="flex items-center gap-1 sm:gap-1.5 text-[9px] font-bold uppercase tracking-widest text-[#f97316]/60 hover:text-[#f97316] transition-colors flex-shrink-0"
                        >
                          {isExpanded ? (
                            <>
                              <span className="hidden sm:inline">Hide</span>
                              <ChevronUp size={11} />
                            </>
                          ) : (
                            <>
                              <span className="hidden sm:inline">Explain</span>
                              <ChevronDown size={11} />
                            </>
                          )}
                        </button>
                      )}
                    </div>

                    {/* QUESTION TEXT */}
                    <p className="text-sm sm:text-base font-medium text-white/80 leading-relaxed mb-4 sm:mb-5">
                      {q.question}
                    </p>

                    {/* OPTIONS */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {q.options.map((opt: string) => {
                        const optNorm = String(opt).trim().toLowerCase();
                        const isUserChoice = userAnswerNorm === optNorm;
                        const isCorrectOption = correctNorm === optNorm;

                        let optStyle =
                          "bg-black/20 border-white/5 text-white/20";
                        if (isCorrectOption && isUserChoice) {
                          optStyle =
                            "bg-green-500/15 border-green-500/40 text-green-300";
                        } else if (isCorrectOption && !isUserChoice) {
                          optStyle =
                            "bg-green-500/10 border-green-500/30 text-green-400/80 border-dashed";
                        } else if (isUserChoice && !isCorrectOption) {
                          optStyle =
                            "bg-red-500/15 border-red-500/40 text-red-300 line-through decoration-red-500/50";
                        }

                        return (
                          <div
                            key={opt}
                            className={`p-3 sm:p-4 rounded-2xl border text-xs sm:text-sm font-bold flex justify-between items-center gap-2 transition-all ${optStyle}`}
                          >
                            <span className="leading-snug">{opt}</span>
                            <div className="flex items-center gap-1 flex-shrink-0">
                              {isCorrectOption && isUserChoice && (
                                <CheckCircle2
                                  size={12}
                                  className="text-green-400"
                                />
                              )}
                              {isCorrectOption && !isUserChoice && (
                                <CheckCircle2
                                  size={12}
                                  className="text-green-400/60"
                                />
                              )}
                              {isUserChoice && !isCorrectOption && (
                                <XCircle size={12} className="text-red-400" />
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* CORRECT ANSWER CALLOUT */}
                  {!isCorrect && correctRaw && (
                    <div className="mx-4 sm:mx-6 mb-3 sm:mb-4 px-3 sm:px-4 py-2.5 sm:py-3 bg-green-500/8 border border-green-500/15 rounded-2xl flex items-center gap-2 sm:gap-3">
                      <CheckCircle2
                        size={12}
                        className="text-green-400 flex-shrink-0"
                      />
                      <div>
                        <span className="text-[9px] font-bold text-green-400/50 uppercase tracking-widest block mb-0.5">
                          Correct_Answer
                        </span>
                        <span className="text-xs sm:text-sm font-bold text-green-400">
                          {correctRaw}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* EXPLANATION PANEL */}
                  {q.explanation && isExpanded && (
                    <div className="mx-4 sm:mx-6 mb-4 sm:mb-5 px-4 sm:px-5 py-3 sm:py-4 bg-[#f97316]/5 border border-[#f97316]/15 rounded-2xl">
                      <p className="text-[9px] font-bold text-[#f97316]/50 uppercase tracking-widest mb-2">
                        Explanation
                      </p>
                      <p className="text-xs sm:text-sm text-white/50 leading-relaxed">
                        {q.explanation}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* ACTION BUTTONS */}
          <div className="flex flex-col sm:flex-row gap-3 pt-3 sm:pt-4">
            <button
              onClick={() => window.location.reload()}
              className="flex-1 py-4 bg-white text-black rounded-2xl font-bold uppercase text-[10px] tracking-widest hover:bg-[#f97316] hover:text-white transition-all active:scale-95"
            >
              New_Session
            </button>
            <button
              onClick={() => (window.location.href = "/")}
              className="flex-1 py-4 bg-white/5 border border-white/10 text-white rounded-2xl font-bold uppercase text-[10px] tracking-widest hover:bg-white/10 transition-all active:scale-95"
            >
              Exit_Lab
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
