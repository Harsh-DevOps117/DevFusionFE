"use client";
import {
  Bot,
  Code2,
  Loader2,
  Mic,
  MicOff,
  PhoneOff,
  Send,
  Target,
  Terminal,
  VideoOff,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import MonacoSandbox from "../components/Interview/MonacoSandbox";
import { InterviewService } from "../services/index";
import { socket } from "../utils/socket";

// ── Speaking indicator ─────────────────────────────────────────
const SpeakingBars = ({ active }: { active: boolean }) => (
  <div
    style={{
      display: "flex",
      alignItems: "flex-end",
      gap: 3,
      height: 24,
      padding: "3px 5px",
    }}
  >
    {[0, 0.12, 0.24, 0.36, 0.48].map((delay, i) => (
      <div
        key={i}
        style={{
          width: 4,
          borderRadius: 2,
          background: "#f97316",
          transformOrigin: "bottom",
          height: active ? undefined : 4,
          opacity: active ? 1 : 0.2,
          animation: active
            ? `speakBounce 0.8s ease-in-out infinite ${delay}s`
            : "none",
        }}
      />
    ))}
    <style>{`
      @keyframes speakBounce {
        0%,100% { height: 4px; opacity: 0.4; }
        50%      { height: 20px; opacity: 1; }
      }
    `}</style>
  </div>
);

export default function InterviewPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [messages, setMessages] = useState<any[]>([]);
  const [evaluation, setEvaluation] = useState<any>(null);
  const [showEditor, setShowEditor] = useState(false);
  const [code, setCode] = useState("");
  const [inputText, setInputText] = useState("");
  const [targetRole, setTargetRole] = useState("");
  const [isStarting, setIsStarting] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOff, setIsCameraOff] = useState(false);
  const [isAiSpeaking, setIsAiSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  // NEW: tracks whether the user's voice is actively being detected
  const [isUserSpeaking, setIsUserSpeaking] = useState(false);

  const userVideoRef = useRef<HTMLVideoElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const recognitionRef = useRef<any>(null);
  const silenceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const currentAudioRef = useRef<HTMLAudioElement | null>(null);

  const isAiSpeakingRef = useRef(false);
  const isListeningRef = useRef(false);
  const inputTextRef = useRef("");
  const idRef = useRef(id);
  const finalTranscriptRef = useRef("");

  useEffect(() => {
    isAiSpeakingRef.current = isAiSpeaking;
  }, [isAiSpeaking]);
  useEffect(() => {
    isListeningRef.current = isListening;
  }, [isListening]);
  useEffect(() => {
    inputTextRef.current = inputText;
  }, [inputText]);
  useEffect(() => {
    idRef.current = id;
  }, [id]);

  // ── TEARDOWN ────────────────────────────────────────────────
  const teardown = useCallback(() => {
    // 1. Kill AI audio
    if (currentAudioRef.current) {
      currentAudioRef.current.pause();
      currentAudioRef.current.src = "";
      currentAudioRef.current = null;
    }

    // 2. Kill silence timer
    if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);

    // 3. Stop speech recognition — wipe handlers first so onend doesn't restart it
    if (recognitionRef.current) {
      recognitionRef.current.onend = null;
      recognitionRef.current.onerror = null;
      recognitionRef.current.onresult = null;
      try {
        recognitionRef.current.stop();
      } catch (_) {}
    }

    // 4. Stop ALL hardware tracks (camera + mic)
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    if (userVideoRef.current) userVideoRef.current.srcObject = null;

    // 5. Socket cleanup
    socket.emit("leave-interview");
    socket.off("audio-chunk");
    socket.off("interview-complete");

    setIsAiSpeaking(false);
    setIsListening(false);
    setIsUserSpeaking(false);
  }, []);

  const endCall = useCallback(() => {
    teardown();
    navigate("/profile");
  }, [teardown, navigate]);

  // ── SEND MESSAGE ────────────────────────────────────────────
  const handleSendMessage = useCallback(async (textOverride?: string) => {
    const finalMsg = (textOverride ?? inputTextRef.current).trim();
    if (!finalMsg) return;

    if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
    finalTranscriptRef.current = "";
    setInputText("");
    setIsUserSpeaking(false);

    setMessages((prev) => [...prev, { sender: "You", text: finalMsg }]);
    setIsAiSpeaking(true);

    try {
      await InterviewService.respond({
        interviewId: idRef.current as string,
        userInput: finalMsg,
      });
    } catch {
      setIsAiSpeaking(false);
    }
  }, []);

  // ── SPEECH RECOGNITION ──────────────────────────────────────
  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";
    // maxAlternatives helps pick the best transcript
    recognition.maxAlternatives = 1;

    recognition.onresult = (event: any) => {
      if (isAiSpeakingRef.current) return;

      let interimText = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) {
          finalTranscriptRef.current += result[0].transcript + " ";
        } else {
          interimText += result[0].transcript;
        }
      }

      const combined = (finalTranscriptRef.current + interimText).trim();
      setInputText(combined);

      // Show the speaking indicator whenever there's any activity
      setIsUserSpeaking(combined.length > 0);

      if (finalTranscriptRef.current.trim().length > 0) {
        if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
        silenceTimerRef.current = setTimeout(() => {
          const toSend = finalTranscriptRef.current.trim();
          if (toSend.length > 2) {
            setIsUserSpeaking(false);
            handleSendMessage(toSend);
          }
        }, 1800);
      }
    };

    recognition.onspeechstart = () => setIsUserSpeaking(true);
    recognition.onspeechend = () => setIsUserSpeaking(false);

    recognition.onerror = (e: any) => {
      // "no-speech" is a normal timeout, not a real error — just restart
      if (
        e.error === "no-speech" &&
        isListeningRef.current &&
        !isAiSpeakingRef.current
      ) {
        try {
          recognition.start();
        } catch (_) {}
      }
    };

    recognition.onend = () => {
      if (isListeningRef.current && !isAiSpeakingRef.current) {
        try {
          recognition.start();
        } catch (_) {}
      } else {
        setIsUserSpeaking(false);
      }
    };

    recognitionRef.current = recognition;
    return () => {
      recognition.onend = null;
      recognition.stop();
    };
  }, [handleSendMessage]);

  const toggleVoice = useCallback(() => {
    if (isListeningRef.current) {
      if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
      finalTranscriptRef.current = "";
      recognitionRef.current?.stop();
      setIsListening(false);
      setIsUserSpeaking(false);
      setInputText("");
    } else {
      finalTranscriptRef.current = "";
      setIsListening(true);
      try {
        recognitionRef.current?.start();
      } catch (_) {}
    }
  }, []);

  // ── SOCKET & AUDIO ──────────────────────────────────────────
  useEffect(() => {
    if (!id) return;
    socket.emit("join-interview", id);

    socket.on("audio-chunk", (data) => {
      setMessages((prev) => [...prev, { sender: "AI", text: data.text }]);

      if (data.metadata?.command === "OPEN_EDITOR") {
        setShowEditor(true);
        if (data.metadata.codeSnippet) setCode(data.metadata.codeSnippet);
      }

      if (data.audio) {
        if (currentAudioRef.current) currentAudioRef.current.pause();

        recognitionRef.current?.stop();
        setIsAiSpeaking(true);
        setIsUserSpeaking(false);

        const audio = new Audio(`data:audio/mp3;base64,${data.audio}`);
        currentAudioRef.current = audio;

        audio.play().catch(() => setIsAiSpeaking(false));
        audio.onended = () => {
          setIsAiSpeaking(false);
          currentAudioRef.current = null;
          if (isListeningRef.current) {
            setTimeout(() => {
              try {
                recognitionRef.current?.start();
              } catch (_) {}
            }, 300);
          }
        };
      }
    });

    socket.on("interview-complete", (data) => setEvaluation(data));

    return () => {
      socket.off("audio-chunk");
      socket.off("interview-complete");
    };
  }, [id]);

  // Hardware init
  useEffect(() => {
    if (!id) return;
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((s) => {
        streamRef.current = s;
        if (userVideoRef.current) userVideoRef.current.srcObject = s;
      });
    return () => streamRef.current?.getTracks().forEach((t) => t.stop());
  }, [id]);

  useEffect(
    () => chatEndRef.current?.scrollIntoView({ behavior: "smooth" }),
    [messages],
  );

  // ── VIEWS ────────────────────────────────────────────────────

  if (!id)
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-[#0d0d0d] border border-white/5 p-10 rounded-[2.5rem] text-center shadow-2xl">
          <Target className="text-[#f97316] mx-auto mb-6" size={32} />
          <h2 className="text-white text-2xl uppercase tracking-widest mb-8 font-bold">
            Role_Selection
          </h2>
          <input
            className="w-full bg-black border border-white/10 p-5 rounded-2xl text-white outline-none focus:border-[#f97316]/40 transition-all"
            placeholder="e.g. Mechatronics Engineer"
            value={targetRole}
            onChange={(e) => setTargetRole(e.target.value)}
          />
          <button
            onClick={async () => {
              setIsStarting(true);
              try {
                const res = await InterviewService.start({ role: targetRole });
                navigate(`/interview/${res.data.id}`);
              } catch {
                setIsStarting(false);
              }
            }}
            className="w-full py-5 bg-[#f97316] text-black rounded-2xl font-black mt-6 tracking-widest uppercase hover:bg-orange-500 transition-all active:scale-95"
          >
            {isStarting ? (
              <Loader2 className="animate-spin mx-auto" />
            ) : (
              "ESTABLISH CONNECTION"
            )}
          </button>
        </div>
      </div>
    );

  //
  // 2. Evaluation View
  // 2. Evaluation View
  if (evaluation) {
    const raw: string =
      typeof evaluation === "string"
        ? evaluation
        : (evaluation.evaluation ?? "");

    // ── parse helpers ──────────────────────────────────────────
    const getScore = () => {
      const m = raw.match(/Overall Score[:\s*]*([0-9.]+)\s*\/\s*10/i);
      return m ? m[1] : (evaluation.totalScore ?? "—");
    };

    const getHire = () => {
      const m = raw.match(/Hire Recommendation[:\s*]*(.*)/i);
      if (!m) return null;
      const val = m[1].replace(/[*#]/g, "").trim();
      const isHire = /yes hire|✅/i.test(val);
      return { label: isHire ? "Hire" : "No Hire", yes: isHire };
    };

    const getMeta = () => {
      const m = raw.match(/Interview Report[^·\n]*[—-]\s*(.*)/i);
      return m ? m[1].replace(/[*#]/g, "").trim() : "";
    };

    const getTable = () => {
      const rows: {
        phase: string;
        topic: string;
        score: string;
        signal: string;
      }[] = [];
      const lines = raw.split("\n");
      let inTable = false;
      for (const line of lines) {
        if (/\|\s*#\s*\|/i.test(line)) {
          inTable = true;
          continue;
        }
        if (/\|[-\s|]+\|/.test(line)) continue;
        if (inTable && line.trim().startsWith("|")) {
          const cols = line
            .split("|")
            .map((c) => c.trim())
            .filter(Boolean);
          if (cols.length >= 4) {
            rows.push({
              phase: cols[0],
              topic: cols[1],
              score: cols[2],
              signal: cols[3],
            });
          }
        } else if (inTable && !line.trim().startsWith("|")) {
          inTable = false;
        }
      }
      return rows;
    };

    const getSection = (heading: string) => {
      const re = new RegExp(`###?\\s*${heading}[\\s\\S]*?(?=###|$)`, "i");
      const m = raw.match(re);
      if (!m) return [];
      return m[0]
        .split("\n")
        .filter((l) => l.trim().startsWith("-"))
        .map((l) => l.replace(/^[-*]\s*/, "").trim());
    };

    const score = getScore();
    const hire = getHire();
    const meta = getMeta();
    const table = getTable();
    const strengths = getSection("Strengths");
    const concerns = getSection("Concerns");
    const followups = getSection("Suggested Follow-up");

    return (
      <div className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center p-6">
        <div className="w-full max-w-[580px] flex flex-col gap-5">
          {/* ── Score hero ── */}
          <div className="text-center pb-2">
            <div className="inline-flex items-center gap-2 border border-[#f97316]/25 rounded-full px-4 py-1.5 mb-5">
              <div className="w-1.5 h-1.5 rounded-full bg-[#f97316]" />
              <span className="text-[11px] text-[#f97316] tracking-[0.15em] uppercase font-semibold">
                Session Complete
              </span>
            </div>
            <div className="text-[80px] font-black italic leading-none tracking-[-3px]">
              {score}
              <span className="text-[24px] text-white/15 not-italic font-normal tracking-normal">
                /10
              </span>
            </div>
            {meta && (
              <p className="text-[11px] text-white/25 mt-2 tracking-[0.1em] uppercase">
                {meta}
              </p>
            )}
          </div>

          {/* ── Hire + phases count ── */}
          <div className="grid grid-cols-2 gap-3">
            {hire && (
              <div className="bg-[#0d0d0d] border border-white/[0.07] rounded-2xl p-4">
                <div className="text-[11px] text-white/25 uppercase tracking-widest mb-1.5">
                  Hire Decision
                </div>
                <div className="flex items-center gap-2">
                  <div
                    className={`w-2 h-2 rounded-full ${hire.yes ? "bg-green-500" : "bg-red-500"}`}
                  />
                  <span className="text-[15px] font-medium">{hire.label}</span>
                </div>
              </div>
            )}
            {table.length > 0 && (
              <div className="bg-[#0d0d0d] border border-white/[0.07] rounded-2xl p-4">
                <div className="text-[11px] text-white/25 uppercase tracking-widest mb-1.5">
                  Phases Scored
                </div>
                <div className="text-[15px] font-medium">
                  {table.length} of {table.length}
                </div>
              </div>
            )}
          </div>

          {/* ── Phase breakdown table ── */}
          {table.length > 0 && (
            <div className="bg-[#0d0d0d] border border-white/[0.07] rounded-2xl overflow-hidden">
              <div className="px-5 py-3 border-b border-white/[0.06]">
                <span className="text-[11px] text-white/25 uppercase tracking-widest">
                  Phase Breakdown
                </span>
              </div>
              {table.map((row, i) => {
                const s = parseFloat(row.score) || 0;
                return (
                  <div
                    key={i}
                    className="px-5 py-3 border-b border-white/[0.04] last:border-0"
                  >
                    <div className="grid grid-cols-[28px_1fr_1fr_72px] items-center gap-2 mb-2">
                      <span className="text-[12px] text-white/20">
                        #{row.phase}
                      </span>
                      <span className="text-[13px] text-white/50 capitalize">
                        {row.topic}
                      </span>
                      <span className="text-[13px] text-white/30 capitalize">
                        {row.topic}
                      </span>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-[3px] bg-white/[0.06] rounded-full">
                          <div
                            className="h-full bg-[#f97316] rounded-full"
                            style={{ width: `${(s / 10) * 100}%` }}
                          />
                        </div>
                        <span className="text-[12px] font-medium min-w-[16px] text-right">
                          {row.score}
                        </span>
                      </div>
                    </div>
                    {row.signal && (
                      <p className="text-[13px] text-white/30 italic leading-relaxed ml-7">
                        "{row.signal}"
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* ── Strengths + Concerns ── */}
          {(strengths.length > 0 || concerns.length > 0) && (
            <div className="grid grid-cols-2 gap-3">
              {strengths.length > 0 && (
                <div className="bg-[#0d0d0d] border border-white/[0.07] rounded-2xl p-4">
                  <div className="text-[11px] text-white/25 uppercase tracking-widest mb-3">
                    Strengths
                  </div>
                  <div className="flex flex-col gap-2.5">
                    {strengths.map((s, i) => (
                      <div key={i} className="flex gap-2 items-start">
                        <div className="w-1.5 h-1.5 rounded-full bg-green-500 mt-1.5 shrink-0" />
                        <span className="text-[13px] text-white/50 leading-relaxed">
                          {s}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {concerns.length > 0 && (
                <div className="bg-[#0d0d0d] border border-white/[0.07] rounded-2xl p-4">
                  <div className="text-[11px] text-white/25 uppercase tracking-widest mb-3">
                    Concerns
                  </div>
                  <div className="flex flex-col gap-2.5">
                    {concerns.map((c, i) => (
                      <div key={i} className="flex gap-2 items-start">
                        <div className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5 shrink-0" />
                        <span className="text-[13px] text-white/50 leading-relaxed">
                          {c}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ── Follow-up ── */}
          {followups.length > 0 && (
            <div className="bg-[#0d0d0d] border border-white/[0.07] rounded-2xl p-4">
              <div className="text-[11px] text-white/25 uppercase tracking-widest mb-3">
                Suggested Follow-up
              </div>
              <div className="flex flex-col gap-2.5">
                {followups.map((f, i) => (
                  <div key={i} className="flex gap-2 items-start">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#f97316] mt-1.5 shrink-0" />
                    <span className="text-[13px] text-white/50 leading-relaxed">
                      {f}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── CTA ── */}
          <button
            onClick={() => navigate("/profile")}
            className="w-full py-4 bg-transparent border border-white/[0.08] rounded-[14px] text-white/30 text-[11px] font-semibold tracking-[0.15em] uppercase hover:border-white/20 hover:text-white/50 transition-all"
          >
            Back to Profile
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-[#0a0a0a] text-white flex flex-col overflow-hidden font-machina-normal">
      <header className="h-16 border-b border-white/5 flex items-center justify-between px-6 bg-black/40">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          <span className="text-xs uppercase font-bold tracking-widest text-white/40">
            Live_Feed_Active
          </span>
        </div>
      </header>

      <div className="flex-1 flex p-4 gap-4 overflow-hidden">
        <div className="w-[320px] flex flex-col gap-4 shrink-0">
          <div className="flex-1 bg-[#0d0d0d] rounded-[2rem] border border-white/5 relative flex items-center justify-center shadow-2xl overflow-hidden">
            <div
              className={`absolute w-32 h-32 rounded-full bg-[#f97316]/20 blur-[50px] transition-all duration-500 ${isAiSpeaking ? "scale-150 opacity-100" : "scale-50 opacity-0"}`}
            />
            <Bot
              size={48}
              className={`relative z-10 transition-colors duration-500 ${isAiSpeaking ? "text-[#f97316]" : "text-white/5"}`}
            />
          </div>
          <div className="flex-1 bg-black rounded-[2rem] border border-white/5 relative overflow-hidden">
            <video
              ref={userVideoRef}
              autoPlay
              muted
              playsInline
              className={`w-full h-full object-cover scale-x-[-1] transition-opacity duration-500 ${isCameraOff ? "opacity-0" : "opacity-100"}`}
            />
            {isCameraOff && (
              <div className="absolute inset-0 flex items-center justify-center">
                <VideoOff className="text-white/10" />
              </div>
            )}
          </div>

          <div className="h-20 flex items-center justify-between px-6 bg-[#0d0d0d] rounded-3xl border border-white/5">
            <button
              onClick={toggleVoice}
              className={`p-3 rounded-xl transition-all ${isListening ? "bg-red-500 text-white shadow-lg shadow-red-500/20" : "bg-[#f97316]/10 text-[#f97316]"}`}
            >
              {isListening ? <Mic size={20} /> : <MicOff size={20} />}
            </button>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  streamRef.current
                    ?.getAudioTracks()
                    .forEach((t) => (t.enabled = isMuted));
                  setIsMuted(!isMuted);
                }}
                className={`p-3 rounded-xl transition-all ${isMuted ? "bg-yellow-500/20 text-yellow-400" : "bg-white/5 text-white/40"}`}
              >
                <MicOff size={18} />
              </button>
              <button
                onClick={() => {
                  streamRef.current
                    ?.getVideoTracks()
                    .forEach((t) => (t.enabled = isCameraOff));
                  setIsCameraOff(!isCameraOff);
                }}
                className={`p-3 rounded-xl transition-all ${isCameraOff ? "bg-yellow-500/20 text-yellow-400" : "bg-white/5 text-white/40"}`}
              >
                <VideoOff size={18} />
              </button>
              <button
                onClick={() => setShowEditor(!showEditor)}
                className={`p-3 rounded-xl transition-all ${showEditor ? "bg-[#f97316] text-black" : "bg-white/5 text-white/40"}`}
              >
                <Code2 size={18} />
              </button>
            </div>
            <button
              onClick={endCall}
              className="p-3 bg-red-600 text-white rounded-xl hover:bg-red-500 transition-all shadow-lg shadow-red-900/20"
            >
              <PhoneOff size={20} />
            </button>
          </div>
        </div>

        <div className="flex-1 flex gap-4 overflow-hidden">
          <div className="flex-1 bg-[#0d0d0d] rounded-[2rem] border border-white/5 flex flex-col overflow-hidden shadow-2xl">
            <div className="h-12 border-b border-white/5 flex items-center px-6 text-[10px] font-bold tracking-widest text-white/40 uppercase shrink-0 text-4xl">
              <Terminal size={12} className="mr-2" />
              <h1 className="text-3xl text-amber-50">
                Type - START to Start the Interview
              </h1>
            </div>
            <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-black/20 custom-scrollbar">
              {messages.map((m, i) => (
                <div
                  key={i}
                  className={`flex ${m.sender === "You" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] p-4 rounded-3xl text-sm leading-relaxed ${
                      m.sender === "You"
                        ? "bg-[#f97316]/10 border border-[#f97316]/20 text-white rounded-tr-sm"
                        : "bg-white/5 border border-white/10 text-white/70 rounded-tl-sm"
                    }`}
                  >
                    {m.text}
                  </div>
                </div>
              ))}
              <div ref={chatEndRef} />
            </div>

            {/* ── Input section with speaking indicator ── */}
            <div className="p-5 bg-black/40 border-t border-white/5">
              {/* Speaking indicator bar — only shown when mic is active */}
              {isListening && (
                <div className="flex items-center gap-3 mb-3 px-1">
                  <SpeakingBars active={isUserSpeaking && !isAiSpeaking} />
                  <span className="text-[11px] text-white/30 tracking-widest uppercase">
                    {isAiSpeaking
                      ? "AI speaking…"
                      : isUserSpeaking
                        ? "Detected…"
                        : "Listening"}
                  </span>
                </div>
              )}
              <div className="relative flex items-center gap-3">
                <input
                  className="flex-1 bg-black border border-white/10 rounded-2xl p-4 text-sm outline-none focus:border-[#f97316]/50 transition-all text-white placeholder:text-white/10 disabled:opacity-50"
                  placeholder={
                    isAiSpeaking
                      ? "Sarah is speaking..."
                      : isListening
                        ? "Listening… speak now"
                        : "Type or click the mic…"
                  }
                  value={inputText}
                  onChange={(e) => {
                    finalTranscriptRef.current = "";
                    setInputText(e.target.value);
                  }}
                  onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                  disabled={isAiSpeaking}
                />
                <button
                  onClick={() => handleSendMessage()}
                  disabled={!inputText.trim() || isAiSpeaking}
                  className="p-4 bg-[#f97316] text-black rounded-2xl hover:bg-orange-500 disabled:opacity-20 transition-all shadow-lg shadow-[#f97316]/20"
                >
                  <Send size={18} />
                </button>
              </div>
            </div>
          </div>

          {showEditor && (
            <div className="flex-1 bg-[#0d0d0d] rounded-[2rem] border border-white/5 overflow-hidden flex flex-col shadow-2xl">
              <div className="h-12 border-b border-white/5 flex items-center px-6 text-[10px] tracking-widest text-[#f97316] uppercase shrink-0 font-bold">
                <Code2 size={12} className="mr-2" /> Monaco_Sandbox
              </div>
              <div className="flex-1 relative">
                <MonacoSandbox
                  code={code}
                  onChange={setCode}
                  onClose={() => setShowEditor(false)}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
