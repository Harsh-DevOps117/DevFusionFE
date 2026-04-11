import axios from "axios";
import {
  Activity,
  ArrowRight,
  BrainCircuit,
  CheckCircle,
  Sparkles,
} from "lucide-react";
import { useEffect, useState } from "react";

// ✅ FIXED BASE URL
const BASE_URL = "http://localhost:3007/v1";

export default function QuizPage() {
  const [step, setStep] = useState<
    "setup" | "generating" | "active" | "result"
  >("setup");
  const [topic, setTopic] = useState("");
  const [jobId, setJobId] = useState<string | null>(null);
  const [quizData, setQuizData] = useState<any>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [score, setScore] = useState<number | null>(null);

  // --- 1. INITIAL GENERATION ---
  const handleGenerate = async () => {
    if (!topic) return;
    console.log("[1/3] INITIALIZING: Topic ->", topic);
    setStep("generating");

    try {
      const res = await axios.post(`${BASE_URL}/generate`, {
        topic,
        difficulty: "medium",
      });

      console.log("📥 [1/3] SERVER RESPONSE:", res.data);

      // Accessing res.data.data.jobId per your backend helper
      const id = res.data.data?.jobId;

      if (id) {
        console.log("✅ [1/3] JOB ID CAPTURED:", id);
        setJobId(id);
      } else {
        console.error("❌ [1/3] ERROR: No jobId in response.");
        setStep("setup");
      }
    } catch (err: any) {
      console.error("❌ [1/3] NETWORK ERROR:", err.message);
      setStep("setup");
    }
  };

  // --- 2. CONCENTRATED POLLING & DATA FETCH ---
  useEffect(() => {
    let interval: any;

    if (step === "generating" && jobId) {
      console.log("🔄 [2/3] POLLING START: Job", jobId);

      interval = setInterval(async () => {
        try {
          const res = await axios.get(`${BASE_URL}/status/${jobId}`);
          const payload = res.data;

          console.log(
            `📡 [2/3] HEARTBEAT: ${payload.data?.state} | ${payload.data?.progress}%`,
          );

          if (payload.success && payload.data.state === "completed") {
            clearInterval(interval);
            console.log("✨ [2/3] WORKER FINISHED. Payload:", payload);

            const finalQuizId = payload.data.result?.quizId;

            if (finalQuizId) {
              console.log("📥 [2/3] FETCHING FINAL QUIZ DATA: ID", finalQuizId);
              const quizRes = await axios.get(`${BASE_URL}/${finalQuizId}`);

              // 🛡️ CRITICAL FIX: Extract data correctly even if nested
              const finalData = quizRes.data.data || quizRes.data;
              console.log("📝 [2/3] QUIZ OBJECT LOADED:", finalData);

              setQuizData(finalData);
              setStep("active");
            } else {
              console.error("❌ [2/3] ERROR: quizId missing from result.");
              setStep("setup");
            }
          } else if (payload.data.state === "failed") {
            clearInterval(interval);
            console.error("🛑 [2/3] WORKER FAILED:", payload.data.error);
            alert("Worker Error: Check backend logs.");
            setStep("setup");
          }
        } catch (err) {
          console.error("⚠️ [2/3] POLLING FAILED:", err);
        }
      }, 2000);
    }

    return () => clearInterval(interval);
  }, [step, jobId]);

  // --- 3. SUBMISSION ---
  const handleSubmit = async () => {
    // 1. Transform the Map {id: text} into the Array [{questionId: id, selected: text}]
    const formattedAnswers = Object.entries(answers).map(
      ([qId, selectedText]) => ({
        questionId: qId,
        selected: selectedText,
      }),
    );

    console.log("📤 [3/3] SUBMITTING FORMATTED:", formattedAnswers);

    try {
      const res = await axios.post(`${BASE_URL}/submit`, {
        quizId: quizData.id,
        answers: formattedAnswers, // ✅ NOW MATCHES BACKEND EXPECTATION
      });

      console.log("📊 [3/3] SCORE RECEIVED:", res.data.data.score);
      setScore(res.data.data.score);
      setStep("result");
    } catch (err: any) {
      console.error(
        "❌ [3/3] SUBMISSION ERROR:",
        err.response?.data || err.message,
      );
      alert(
        "Submission Failed: " +
          (err.response?.data?.message || "Check Console"),
      );
    }
  };

  // --- VIEW RENDERING ---

  if (step === "generating")
    return (
      <div className="h-screen bg-black flex flex-col items-center justify-center text-white font-mono">
        <BrainCircuit className="w-16 h-16 text-indigo-500 animate-pulse mb-6" />
        <h2 className="text-xs font-black tracking-[0.4em] uppercase">
          Processing_Assessment
        </h2>
        <div className="mt-8 w-48 bg-slate-900 h-1 rounded-full overflow-hidden">
          <div
            className="bg-indigo-500 h-full animate-pulse"
            style={{ width: "40%" }}
          />
        </div>
      </div>
    );

  if (step === "active" && quizData)
    return (
      <div className="min-h-screen bg-[#050505] text-white p-6 py-16">
        <div className="max-w-3xl mx-auto">
          <header className="mb-12 border-b border-white/5 pb-8 flex justify-between items-end">
            <div>
              <h1 className="text-3xl font-black italic uppercase tracking-tighter">
                {quizData?.topic || "Technical Quiz"}
              </h1>
              <p className="text-indigo-500 text-[10px] font-black tracking-widest mt-2 uppercase flex items-center gap-2">
                <Activity size={12} /> System_Evaluator_Ready
              </p>
            </div>
            <div className="text-right font-mono text-xl font-black text-indigo-400">
              {/* 🛡️ Optional Chaining fixed the .length crash */}
              {Object.keys(answers).length}/{quizData?.questions?.length || 0}
            </div>
          </header>

          <div className="space-y-8">
            {/* 🛡️ Safe check before mapping */}
            {quizData?.questions?.map((q: any, i: number) => (
              <div
                key={q.id || i}
                className="bg-slate-900/30 p-8 rounded-[2rem] border border-white/5 shadow-2xl transition-all"
              >
                <span className="text-[10px] font-black text-slate-700 uppercase mb-4 block tracking-widest">
                  Question_0{i + 1}
                </span>
                <h3 className="text-xl font-bold mb-8 leading-tight">
                  {q.questionText}
                </h3>
                <div className="grid gap-4">
                  {q.options?.map((opt: string) => (
                    <button
                      key={opt}
                      onClick={() => setAnswers({ ...answers, [q.id]: opt })}
                      className={`p-5 rounded-2xl border text-left text-sm font-bold transition-all duration-300 ${
                        answers[q.id] === opt
                          ? "bg-indigo-600 border-indigo-400 text-white shadow-xl shadow-indigo-500/20 scale-[1.01]"
                          : "bg-black/40 border-white/5 text-slate-400 hover:border-white/20"
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={handleSubmit}
            className="w-full mt-16 bg-white text-black py-6 rounded-3xl font-black uppercase text-xs tracking-widest hover:bg-indigo-400 hover:text-white transition-all shadow-2xl flex items-center justify-center gap-3"
          >
            Finalize Assessment <ArrowRight size={18} />
          </button>
        </div>
      </div>
    );

  if (step === "result")
    return (
      <div className="h-screen bg-black flex flex-col items-center justify-center text-white">
        <CheckCircle className="w-20 h-20 text-emerald-500 mb-8" />
        <h1 className="text-8xl font-black italic tracking-tighter">
          {score}%
        </h1>
        <p className="text-slate-500 text-[10px] font-black tracking-[0.5em] mt-6">
          ANALYSIS_COMPLETE
        </p>
        <button
          onClick={() => window.location.reload()}
          className="mt-16 px-12 py-5 bg-indigo-600 rounded-2xl font-black uppercase text-xs tracking-widest shadow-lg hover:bg-indigo-500 transition-all"
        >
          Restart Session
        </button>
      </div>
    );

  return (
    <div className="h-screen bg-black flex items-center justify-center p-4 font-sans">
      <div className="max-w-md w-full bg-slate-900 p-12 rounded-[3.5rem] border border-white/5 shadow-2xl relative overflow-hidden group">
        <Sparkles className="absolute top-8 right-8 text-indigo-500/20 group-hover:text-indigo-500/50 transition-all" />
        <h2 className="text-4xl font-black text-white uppercase tracking-tighter mb-2">
          Quiz_Lab
        </h2>
        <p className="text-slate-500 text-[10px] uppercase font-bold tracking-[0.2em] mb-12">
          Next-Gen Technical Evaluation
        </p>

        <div className="space-y-2">
          <label className="text-[10px] font-black text-indigo-400 uppercase tracking-widest ml-1">
            Focus_Topic
          </label>
          <input
            className="w-full bg-black border border-white/10 p-5 rounded-2xl text-white font-mono text-sm outline-none focus:border-indigo-500 transition-all"
            placeholder="e.g. Redux Sagas"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
          />
        </div>

        <button
          onClick={handleGenerate}
          disabled={!topic}
          className="w-full mt-8 bg-indigo-600 text-white py-5 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-indigo-500 transition-all disabled:opacity-20 shadow-xl shadow-indigo-600/10"
        >
          Initialize AI
        </button>
      </div>
    </div>
  );
}
