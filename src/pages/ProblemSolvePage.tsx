"use client";

import { HardDrive, Timer, Zap } from "lucide-react"; // 🔥 Added for stats icons
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify"; // 🔥 Added
import CodeEditor from "../components/CodeEditor";
import { executeCode, getProblemById } from "../services/api";

export default function ProblemSolvePage() {
  const { id } = useParams();

  const [problem, setProblem] = useState<any>(null);
  const [code, setCode] = useState("");
  const [results, setResults] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [language, setLanguage] = useState("javascript");

  const languageMap: any = {
    javascript: 63,
    python: 71,
    cpp: 54,
  };

  const safeParse = (data: any) => {
    try {
      if (!data) return [];
      if (typeof data === "string") return JSON.parse(data);
      if (Array.isArray(data)) return data;
      return [data];
    } catch {
      return [];
    }
  };

  const getStats = () => {
    try {
      if (!results) return { time: "-", memory: "-" };
      const times = JSON.parse(results.time || "[]").map((t: string) =>
        parseFloat(t),
      );
      const memory = JSON.parse(results.memory || "[]").map((m: string) =>
        parseInt(m),
      );

      return {
        time: times.length ? Math.min(...times).toFixed(3) + " s" : "-",
        memory: memory.length ? Math.max(...memory) + " KB" : "-",
      };
    } catch {
      return { time: "-", memory: "-" };
    }
  };

  const stats = getStats();

  useEffect(() => {
    if (!id) return;
    getProblemById(id)
      .then((res) => {
        const prob = res.data.problem;
        setProblem(prob);
        if (prob?.codeSnippets?.[language]) {
          setCode(prob.codeSnippets[language]);
        } else if (prob?.referenceSolutions?.[language]) {
          setCode(prob.referenceSolutions[language]);
        } else {
          setCode("// Write your code here");
        }
      })
      .catch(console.error);
  }, [id]);

  useEffect(() => {
    if (!problem) return;
    if (problem?.codeSnippets?.[language]) {
      setCode(problem.codeSnippets[language]);
    } else if (problem?.referenceSolutions?.[language]) {
      setCode(problem.referenceSolutions[language]);
    }
  }, [language]);

  const runCode = async () => {
    try {
      const testcases = safeParse(problem?.testcases);
      if (!testcases.length) {
        toast.error("NULL_POINTER: No testcases found in registry.");
        return;
      }

      setLoading(true);
      setResults(null);

      toast.info("Executing neural testcases...", { autoClose: 1500 });

      const res = await executeCode({
        source_code: code,
        language_id: languageMap[language],
        stdin: testcases.map((t: any) => t.input),
        expected_outputs: testcases.map((t: any) => t.output),
        problemId: id,
      });

      setResults(res.data.submission);
    } catch (err) {
      toast.error("EXECUTION_FAILURE: Node connection lost.");
    } finally {
      setLoading(false);
    }
  };

  const submitCode = async () => {
    try {
      const testcases = safeParse(problem?.testcases);
      if (!testcases.length) {
        toast.error("SUBMISSION_DENIED: Testset empty.");
        return;
      }

      setLoading(true);
      setResults(null);

      const res = await executeCode({
        source_code: code,
        language_id: languageMap[language],
        stdin: testcases.map((t: any) => t.input),
        expected_outputs: testcases.map((t: any) => t.output),
        problemId: id,
      });

      const submission = res.data.submission;
      setResults(submission);

      if (submission.status === "Accepted") {
        toast.success("ACCEPTED: All nodes synchronized.", {
          icon: <Zap size={18} className="text-[#f97316]" />,
          theme: "dark",
        });
      } else {
        toast.error(
          `${submission.status.toUpperCase()}: Check Logic Protocol.`,
          {
            theme: "dark",
          },
        );
      }
    } catch (err) {
      toast.error("HANDSHAKE_ERROR: Submission failed.");
    } finally {
      setLoading(false);
    }
  };

  if (!problem) {
    return (
      <div className="h-screen flex items-center justify-center bg-[#0a0a0a] text-white font-mono uppercase tracking-[0.4em] animate-pulse">
        Initializing_Node...
      </div>
    );
  }

  const examples = safeParse(problem.examples);

  return (
    <div className="flex h-screen bg-[#050505] text-white font-['fontNormal'] overflow-hidden">
      {/* LEFT PANEL: PROBLEM DESCRIPTION */}
      <div className="w-1/2 border-r border-white/5 flex flex-col bg-[#0a0a0a]">
        <div className="p-8 border-b border-white/5 bg-white/[0.02]">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em]">
              Module_01
            </span>
            <div className="h-[1px] w-8 bg-white/10" />
          </div>
          <h1 className="text-4xl font-black italic tracking-tighter uppercase">
            {problem.title}
          </h1>
          <div className="mt-4 flex items-center gap-4">
            <span
              className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-lg border ${
                problem.difficulty === "Easy"
                  ? "text-green-400 border-green-400/20 bg-green-400/5"
                  : problem.difficulty === "Medium"
                    ? "text-yellow-400 border-yellow-400/20 bg-yellow-400/5"
                    : "text-red-400 border-red-400/20 bg-red-400/5"
              }`}
            >
              {problem.difficulty}
            </span>
            <span className="text-white/20 text-[10px] font-bold uppercase tracking-widest italic">
              CPU_Time_Limit: 1.0s
            </span>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-8 text-white/40 leading-relaxed custom-scrollbar">
          <div className="prose prose-invert max-w-none mb-10">
            <p className="text-[15px] font-medium text-white/60">
              {problem.description}
            </p>
          </div>

          <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-[#f97316] mb-6">
            IO_Specifications
          </h3>

          {examples.map((ex: any, i: number) => (
            <div
              key={i}
              className="bg-white/[0.02] border border-white/5 p-6 mb-4 rounded-2xl group hover:border-[#f97316]/20 transition-all"
            >
              <div className="flex items-center gap-2 mb-4">
                <div className="w-1 h-1 rounded-full bg-[#f97316]" />
                <span className="text-[10px] font-black uppercase text-white/40 tracking-widest">
                  Case_0{i + 1}
                </span>
              </div>
              <div className="space-y-3 font-mono text-xs">
                <p>
                  <span className="text-[#f97316]/50">Input:</span>{" "}
                  <span className="text-white/80">{ex.input}</span>
                </p>
                <p>
                  <span className="text-[#f97316]/50">Output:</span>{" "}
                  <span className="text-white/80">{ex.output}</span>
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* RIGHT PANEL: EDITOR & RESULTS */}
      <div className="w-1/2 flex flex-col bg-[#050505]">
        <div className="flex justify-between items-center px-6 py-4 border-b border-white/5 bg-white/[0.01]">
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="bg-black/50 border border-white/10 text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-xl focus:outline-none focus:border-[#f97316]/50 transition-all"
          >
            <option value="javascript">JavaScript_V8</option>
            <option value="python">Python_3.10</option>
            <option value="cpp">C++_GCC_11</option>
          </select>

          <div className="flex gap-4">
            <button
              onClick={runCode}
              disabled={loading}
              className="bg-white/5 border border-white/10 px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all disabled:opacity-50"
            >
              {loading ? "Syncing..." : "Execute_Run"}
            </button>

            <button
              onClick={submitCode}
              disabled={loading}
              className="bg-[#f97316] border border-[#f97316] px-8 py-2.5 rounded-xl text-black text-[10px] font-black uppercase tracking-widest hover:bg-orange-400 transition-all shadow-lg shadow-[#f97316]/20 disabled:opacity-50"
            >
              Final_Submit
            </button>
          </div>
        </div>

        {/* EDITOR AREA */}
        <div className="flex-1 min-h-[50%]">
          <CodeEditor code={code} setCode={setCode} language={language} />
        </div>

        {/* RESULTS TERMINAL */}
        <div className="h-[35%] overflow-y-auto p-8 border-t border-white/5 bg-[#080808] custom-scrollbar">
          {!results && !loading && (
            <div className="flex flex-col items-center justify-center h-full text-white/10">
              <Zap size={32} strokeWidth={1} className="mb-4" />
              <p className="text-[10px] font-black uppercase tracking-[0.4em]">
                Ready_For_Execution
              </p>
            </div>
          )}

          {loading && (
            <div className="flex flex-col items-center justify-center h-full">
              <div className="w-8 h-8 border-2 border-[#f97316]/20 border-t-[#f97316] rounded-full animate-spin mb-4" />
              <p className="text-[10px] font-black uppercase tracking-widest text-white/20">
                Polling_Judge0_API...
              </p>
            </div>
          )}

          {results?.status && (
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <div
                  className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-[0.2em] border ${
                    results.status === "Accepted"
                      ? "bg-green-500/10 border-green-500/20 text-green-400"
                      : "bg-red-500/10 border-red-500/20 text-red-400"
                  }`}
                >
                  {results.status}
                </div>
                <div className="flex gap-6 text-[10px] font-black uppercase tracking-widest text-white/30">
                  <span className="flex items-center gap-2">
                    <Timer size={14} className="text-[#f97316]" /> {stats.time}
                  </span>
                  <span className="flex items-center gap-2">
                    <HardDrive size={14} className="text-[#f97316]" />{" "}
                    {stats.memory}
                  </span>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-4">
            {results?.testResults?.map((r: any, i: number) => (
              <div
                key={i}
                className={`p-6 rounded-2xl border transition-all ${
                  r.passed
                    ? "bg-green-500/[0.02] border-green-500/10"
                    : "bg-red-500/[0.02] border-red-500/10"
                }`}
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[10px] font-black uppercase tracking-widest text-white/20">
                    Test_Sequence_0{i + 1}
                  </span>
                  <span
                    className={`text-[9px] font-black uppercase ${r.passed ? "text-green-500" : "text-red-500"}`}
                  >
                    {r.passed ? "PROCESSED_OK" : "LOGIC_ERROR"}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-8 font-mono text-[11px]">
                  <div>
                    <p className="text-white/20 mb-1 uppercase text-[9px]">
                      Actual_Output
                    </p>
                    <div className="bg-black/40 p-3 rounded-lg border border-white/5 text-white/70 overflow-x-auto">
                      {r.stdout || "NULL"}
                    </div>
                  </div>
                  <div>
                    <p className="text-white/20 mb-1 uppercase text-[9px]">
                      Expected_Output
                    </p>
                    <div className="bg-black/40 p-3 rounded-lg border border-white/5 text-white/40 overflow-x-auto">
                      {r.expected}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
