import {
  AlertCircle,
  ArrowLeft,
  BarChart3,
  CheckCircle2,
  FileText,
  Loader2,
  ShieldCheck,
  Target,
  TrendingUp,
} from "lucide-react";
import * as pdfjs from "pdfjs-dist";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../App.css";

import { ResumeService } from "../../services/index";

pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.mjs";

export default function ResumePivot() {
  const navigate = useNavigate();
  const [file, setFile] = useState<File | null>(null);
  const [extractedText, setExtractedText] = useState("");
  const [targetRole, setTargetRole] = useState("");
  const [intent, setIntent] = useState("Switch Careers");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [jobId, setJobId] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;
    setFile(selectedFile);
    setResult(null);
    setProgress(0);

    if (selectedFile.type === "application/pdf") {
      const reader = new FileReader();
      reader.onload = async (event) => {
        try {
          const typedarray = new Uint8Array(
            event.target?.result as ArrayBuffer,
          );
          const loadingTask = pdfjs.getDocument({ data: typedarray });
          const pdf = await loadingTask.promise;
          let text = "";
          for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const content = await page.getTextContent();
            text += content.items.map((item: any) => item.str).join(" ");
          }
          setExtractedText(text);
        } catch (err) {
          console.error("PDF Read Error:", err);
        }
      };
      reader.readAsArrayBuffer(selectedFile);
    }
  };

  const handleExecute = async () => {
    if (!file || !targetRole) return alert("Missing Required Fields");
    setLoading(true);
    setResult(null);
    setProgress(12);

    let payload: any;
    if (file.type === "application/pdf") {
      payload = { extractedText, targetRole, intent };
    } else {
      payload = new FormData();
      payload.append("file", file);
      payload.append("targetRole", targetRole);
      payload.append("intent", intent);
    }

    try {
      const res = await ResumeService.analyze(payload);
      setJobId(res.data.data.jobId);
    } catch (err: any) {
      setLoading(false);
      alert(err.response?.data?.message || "Server Error");
    }
  };

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;
    if (jobId && !result) {
      interval = setInterval(async () => {
        try {
          const res = await ResumeService.getStatus(jobId);
          const job = res.data.data;

          if (job.progress) setProgress(job.progress);

          if (job.state === "completed" && job.result) {
            setResult(job.result);
            setLoading(false);
            clearInterval(interval!);
          } else if (job.state === "failed") {
            setLoading(false);
            clearInterval(interval!);
            alert("Analysis failed. Please try again.");
          }
        } catch (err) {
          console.error("Polling error:", err);
        }
      }, 1800);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [jobId, result]);

  return (
    <div
      style={{ fontFamily: "fontNormal" }}
      className="min-h-screen bg-[#0a0a0a] text-slate-400 p-4 md:p-8 font-machina-normal selection:bg-[#f97316]/30 overflow-x-hidden"
    >
      <div className="max-w-7xl mx-auto relative z-10 space-y-8">
        {/* TOP NAV */}
        <nav className="flex justify-between items-center px-2">
          <div className="flex items-center gap-6">
            <button
              onClick={() => navigate(-1)}
              className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/50 hover:text-white hover:bg-[#f97316] hover:border-[#f97316] transition-all"
            >
              <ArrowLeft size={18} />
            </button>
            <div className="flex items-center gap-3">
              <h2
                style={{ fontFamily: "fontNormal" }}
                className="text-white text-xl tracking-tighter uppercase flex items-baseline gap-2"
              >
                PrepGrid{" "}
              </h2>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-6 text-xs font-machina-bold uppercase">
            <div className="px-5 py-2 bg-white/[0.03] border border-white/5 rounded-3xl flex items-center gap-2 text-white/70">
              <ShieldCheck size={14} className="text-[#f97316]" />
              <span>Secure Analysis</span>
            </div>
          </div>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* LEFT COLUMN: Input Panel */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-[#0d0d0d] border border-white/5 backdrop-blur-xl p-8 rounded-[2.5rem] space-y-8 sticky top-8 shadow-2xl">
              {/* Target Role */}
              <div>
                <label className="text-[9px] font-machina-bold text-white/40 uppercase tracking-[0.5em] mb-3 block">
                  TARGET ROLE
                </label>
                <input
                  className="w-full bg-[#050505] border border-white/10 focus:border-[#f97316] focus:ring-1 focus:ring-[#f97316]/50 p-5 rounded-2xl outline-none text-white text-sm placeholder:text-white/20 transition-all font-machina-light"
                  value={targetRole}
                  onChange={(e) => setTargetRole(e.target.value)}
                  placeholder="e.g. Senior Backend Engineer"
                />
              </div>

              {/* Pivot Strategy */}
              <div>
                <label className="text-[9px] font-machina-bold text-white/40 uppercase tracking-[0.5em] mb-3 block">
                  PIVOT STRATEGY
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    "Optimize",
                    "Switch Careers",
                    "Promotion",
                    "Internship",
                  ].map((m) => (
                    <button
                      key={m}
                      onClick={() => setIntent(m)}
                      className={`py-4 px-2 text-[10px] font-machina-bold uppercase tracking-widest rounded-2xl border transition-all duration-200 ${
                        intent === m
                          ? "bg-[#f97316] border-[#f97316] text-black shadow-lg shadow-[#f97316]/20"
                          : "border-white/10 hover:border-white/30 text-white/50 hover:text-white hover:bg-white/5"
                      }`}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>

              {/* File Upload */}
              <div
                className={`border border-dashed rounded-[2rem] p-10 text-center transition-all group ${
                  file
                    ? "border-[#f97316] bg-[#f97316]/10 shadow-inner"
                    : "border-white/10 hover:border-white/30 hover:bg-white/5"
                }`}
              >
                <input
                  type="file"
                  id="cv"
                  hidden
                  accept=".pdf"
                  onChange={handleFileChange}
                />
                <label
                  htmlFor="cv"
                  className="cursor-pointer flex flex-col items-center"
                >
                  <div
                    className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-4 transition-colors ${
                      file
                        ? "bg-[#f97316]/20 text-[#f97316]"
                        : "bg-white/5 text-white/30 group-hover:text-white/50"
                    }`}
                  >
                    <FileText size={28} />
                  </div>
                  <p className="text-xs font-machina-bold text-white/70 uppercase tracking-wide truncate max-w-[200px]">
                    {file ? file.name : "Drop Resume PDF"}
                  </p>
                </label>
              </div>

              {/* Execute Button */}
              <button
                onClick={handleExecute}
                disabled={loading || !file || !targetRole}
                style={{ fontFamily: "fontNormal" }}
                className="w-full py-3 bg-white text-black rounded-2xl text-xs uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-[#f97316] hover:text-white disabled:opacity-20 transition-all active:scale-[0.98] shadow-xl"
              >
                {loading ? (
                  <Loader2 className="animate-spin" size={18} />
                ) : (
                  <Target size={18} />
                )}
                {loading ? "DECRYPTING..." : "RUN INTELLIGENCE SCAN"}
              </button>
            </div>
          </div>

          {/* RIGHT COLUMN: Results Dashboard */}
          <div className="lg:col-span-8">
            {result ? (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-6 duration-700">
                {/* Top Metrics Row */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                  {/* Overall Score */}
                  <div className="md:col-span-8 bg-[#0d0d0d] border border-white/5 p-8 rounded-[2.5rem] flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <BarChart3 className="text-[#f97316]" size={20} />
                        <p className="text-[10px] font-machina-bold text-[#f97316] uppercase tracking-[0.4em]">
                          ATS COMPLIANCE
                        </p>
                      </div>
                      <h2
                        style={{ fontFamily: "fontNormal" }}
                        className="text-[6rem] leading-none text-white italic"
                      >
                        {result.overallScore || 0}
                        <span className="text-2xl not-italic opacity-20 align-super ml-2">
                          /100
                        </span>
                      </h2>
                    </div>
                    <div className="text-right flex flex-col items-end">
                      <div className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-4 py-2 rounded-xl text-[10px] font-machina-bold uppercase tracking-widest flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                        SCANNED
                      </div>
                      <p className="mt-4 text-white/40 text-xs font-machina-bold uppercase tracking-widest">
                        Match:{" "}
                        <span
                          className={
                            result.overallScore > 75
                              ? "text-emerald-400"
                              : "text-amber-400"
                          }
                        >
                          {result.overallScore > 75 ? "ELITE" : "MODERATE"}
                        </span>
                      </p>
                    </div>
                  </div>

                  {/* Role Match */}
                  <div className="md:col-span-4 bg-[#f97316] p-8 rounded-[2.5rem] flex flex-col justify-between text-white shadow-xl shadow-[#f97316]/20">
                    <p className="text-[10px] font-machina-bold uppercase opacity-80 tracking-widest">
                      ROLE ALIGNMENT
                    </p>
                    <div>
                      <h3
                        style={{ fontFamily: "fontNormal" }}
                        className="text-6xl italic leading-none tracking-tighter"
                      >
                        {result.roleMatchPercentage || 0}%
                      </h3>
                    </div>
                  </div>
                </div>

                {/* Sub-Scores Bento Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  {[
                    {
                      label: "FORMAT",
                      val: result.atsAnalysis?.formattingScore || 0,
                      color: "bg-white/40",
                    },
                    {
                      label: "KEYWORDS",
                      val: result.atsAnalysis?.keywordDensity || 0,
                      color: "bg-[#f97316]",
                    },
                    {
                      label: "CLARITY",
                      val: result.atsAnalysis?.sectionClarity || 0,
                      color: "bg-emerald-500",
                    },
                    {
                      label: "IMPACT",
                      val: result.atsAnalysis?.impactBulletPoints || 0,
                      color: "bg-blue-500",
                    },
                  ].map((m) => (
                    <div
                      key={m.label}
                      className="bg-[#0d0d0d] border border-white/5 p-6 rounded-3xl"
                    >
                      <div className="flex justify-between text-[9px] font-machina-bold uppercase tracking-[0.2em] mb-4 text-white/50">
                        <span>{m.label}</span>
                        <span className="text-white">{m.val}%</span>
                      </div>
                      <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${m.color} transition-all duration-1000`}
                          style={{ width: `${m.val}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Strategic Insights */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white/[0.02] border border-white/5 p-8 rounded-[2rem]">
                    <p className="text-[#f97316] text-[10px] font-machina-bold uppercase tracking-widest mb-4">
                      PIVOT INTELLIGENCE
                    </p>
                    <p className="text-sm leading-relaxed text-white/70 italic font-machina-light">
                      “
                      {result.pivotAdvice ||
                        "No specific pivot advice generated."}
                      ”
                    </p>
                  </div>
                  <div className="bg-white/[0.02] border border-white/5 p-8 rounded-[2rem]">
                    <p className="text-blue-400 text-[10px] font-machina-bold uppercase tracking-widest mb-4">
                      MARKET PULSE
                    </p>
                    <p className="text-sm leading-relaxed text-white/70 italic font-machina-light">
                      “
                      {result.industryInsights ||
                        "Market insights currently unavailable."}
                      ”
                    </p>
                  </div>
                </div>

                {/* Gaps & Execution Plan */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-12">
                  <div className="bg-[#0d0d0d] border border-white/5 p-8 rounded-[2.5rem]">
                    <h4 className="flex items-center gap-2 text-red-500 text-[10px] font-machina-bold uppercase tracking-widest mb-6">
                      <AlertCircle size={14} /> CRITICAL GAPS
                    </h4>
                    <div className="space-y-3">
                      {(result.missingSkills || []).map(
                        (s: string, idx: number) => (
                          <div
                            key={idx}
                            className="flex items-center gap-4 bg-red-500/5 border border-red-500/10 px-5 py-4 rounded-2xl text-xs text-white/80"
                          >
                            <div className="w-1.5 h-1.5 bg-red-500 rounded-full" />{" "}
                            {s}
                          </div>
                        ),
                      )}
                    </div>
                  </div>

                  <div className="bg-[#0d0d0d] border border-white/5 p-8 rounded-[2.5rem]">
                    <h4 className="flex items-center gap-2 text-emerald-500 text-[10px] font-machina-bold uppercase tracking-widest mb-6">
                      <CheckCircle2 size={14} /> TACTICAL EXECUTION
                    </h4>
                    <div className="space-y-3">
                      {(result.actionPlan || []).map(
                        (p: string, idx: number) => (
                          <div
                            key={idx}
                            className="flex items-start gap-4 bg-emerald-500/5 border border-emerald-500/10 px-5 py-4 rounded-2xl"
                          >
                            <div className="mt-0.5 text-emerald-500 text-[10px] font-machina-bold">
                              0{idx + 1}
                            </div>
                            <p className="text-xs text-white/80 leading-relaxed">
                              {p}
                            </p>
                          </div>
                        ),
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ) : loading || jobId ? (
              /* LOADING STATE */
              <div className="h-full min-h-[600px] bg-[#0d0d0d] border border-white/5 rounded-[2.5rem] flex flex-col items-center justify-center relative overflow-hidden">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#f97316]/5 blur-[120px] rounded-full animate-pulse" />
                <div className="relative z-10 flex flex-col items-center text-center">
                  <div className="relative mb-8">
                    <Loader2 className="w-16 h-16 text-[#f97316] animate-spin" />
                  </div>
                  <p
                    style={{ fontFamily: "fontNormal" }}
                    className="text-xl text-white uppercase tracking-widest mb-2"
                  >
                    DECRYPTING SIGNALS
                  </p>
                  <p className="text-white/40 text-sm font-machina-light max-w-xs">
                    Matching neural nodes with{" "}
                    <span className="text-[#f97316]">{targetRole}</span>
                  </p>

                  <div className="mt-12 w-64">
                    <div className="flex justify-between text-[9px] font-machina-bold text-white/40 uppercase tracking-widest mb-2 px-1">
                      <span>Analyzing</span>
                      <span>{progress}%</span>
                    </div>
                    <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#f97316] transition-all duration-700"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              /* IDLE STATE */
              <div className="h-full min-h-[600px] bg-[#0d0d0d] border border-white/5 rounded-[2.5rem] flex flex-col items-center justify-center relative overflow-hidden group">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-[#f97316]/5 blur-[100px] rounded-full group-hover:scale-110 transition-transform duration-700" />
                <TrendingUp
                  size={64}
                  className="mb-6 text-white/10 group-hover:text-[#f97316]/30 transition-colors duration-500"
                  strokeWidth={1}
                />
                <p
                  style={{ fontFamily: "fontNormal" }}
                  className="text-sm uppercase tracking-[0.5em] text-white/20"
                >
                  SYSTEMS_READY
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
