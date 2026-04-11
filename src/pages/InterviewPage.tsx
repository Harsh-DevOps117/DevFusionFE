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
import { api } from "../utils/api";
import { socket } from "../utils/socket";

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

  const userVideoRef = useRef<HTMLVideoElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const recognitionRef = useRef<any>(null);
  const silenceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const isAiSpeakingRef = useRef(false);
  const isListeningRef = useRef(false);
  // Accumulates only FINAL recognised sentences until we send
  const finalTranscriptRef = useRef("");

  useEffect(() => {
    isAiSpeakingRef.current = isAiSpeaking;
  }, [isAiSpeaking]);

  useEffect(() => {
    isListeningRef.current = isListening;
  }, [isListening]);

  // ==========================================
  // CLEAN TEARDOWN — used by end-call & unmount
  // ==========================================
  const teardown = useCallback(() => {
    // 1. Kill silence timer
    if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
    // 2. Stop speech recognition (prevent onend restart loop)
    if (recognitionRef.current) {
      recognitionRef.current.onend = null;
      recognitionRef.current.stop();
    }
    // 3. Stop all camera/mic hardware tracks
    streamRef.current?.getTracks().forEach((t) => t.stop());
    // 4. Leave socket room
    socket.emit("leave-interview");
    socket.off("audio-chunk");
    socket.off("interview-complete");
  }, []);

  const endCall = useCallback(() => {
    teardown();
    navigate("/profile");
  }, [teardown, navigate]);

  // ==========================================
  // 1. SEND MESSAGE (TEXT + UI SYNC)
  // ==========================================
  // Use refs so voice callbacks always see the latest version without
  // recreating the recognition engine on every render.
  const inputTextRef = useRef("");
  const idRef = useRef(id);
  useEffect(() => {
    inputTextRef.current = inputText;
  }, [inputText]);
  useEffect(() => {
    idRef.current = id;
  }, [id]);

  const handleSendMessage = useCallback(
    async (textOverride?: string) => {
      const finalMsg = (textOverride ?? inputTextRef.current).trim();
      if (!finalMsg) return;

      if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
      finalTranscriptRef.current = "";
      setInputText("");

      setMessages((prev) => [...prev, { sender: "You", text: finalMsg }]);
      setIsAiSpeaking(true);

      try {
        await api.post("/respond", {
          interviewId: idRef.current,
          userInput: finalMsg,
        });
      } catch {
        setIsAiSpeaking(false);
      }
    },
    [], // stable — reads via refs
  );

  // ==========================================
  // 2. ROBUST VOICE-TO-TEXT ENGINE
  // Initialised ONCE on mount. Callbacks read state via refs so the
  // engine never needs to be torn down & rebuilt.
  // ==========================================
  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";
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

      setInputText((finalTranscriptRef.current + interimText).trim());

      if (finalTranscriptRef.current.trim().length > 0) {
        if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
        silenceTimerRef.current = setTimeout(() => {
          const toSend = finalTranscriptRef.current.trim();
          if (toSend.length > 2) handleSendMessage(toSend);
        }, 1800);
      }
    };

    recognition.onerror = (event: any) => {
      if (event.error === "no-speech" || event.error === "aborted") return;
      console.warn("STT error:", event.error);
    };

    recognition.onend = () => {
      // Auto-restart only if user hasn't turned voice off and AI isn't talking
      if (isListeningRef.current && !isAiSpeakingRef.current) {
        try {
          recognition.start();
        } catch {
          /* already running */
        }
      }
    };

    recognitionRef.current = recognition;

    return () => {
      recognition.onend = null;
      recognition.stop();
    };
  }, []); // <-- empty deps: created once, reads everything via refs

  const toggleVoice = useCallback(() => {
    if (isListeningRef.current) {
      if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
      finalTranscriptRef.current = "";
      recognitionRef.current?.onend && (recognitionRef.current.onend = null);
      recognitionRef.current?.stop();
      // Re-attach onend after stop so future toggles work
      setTimeout(() => {
        if (recognitionRef.current) {
          recognitionRef.current.onend = () => {
            if (isListeningRef.current && !isAiSpeakingRef.current) {
              try {
                recognitionRef.current.start();
              } catch {
                /* ok */
              }
            }
          };
        }
      }, 100);
      setIsListening(false);
      setInputText("");
    } else {
      finalTranscriptRef.current = "";
      setInputText("");
      setIsListening(true);
      try {
        recognitionRef.current?.start();
      } catch {
        /* already running */
      }
    }
  }, []);

  // ==========================================
  // 3. SOCKET & AUDIO OUTPUT
  // ==========================================
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
        // Pause mic while AI plays audio
        recognitionRef.current?.stop();
        setIsAiSpeaking(true);

        const audio = new Audio(`data:audio/mp3;base64,${data.audio}`);
        audio.play().catch(() => setIsAiSpeaking(false));
        audio.onended = () => {
          setIsAiSpeaking(false);
          // Resume mic only if user had voice mode on
          if (isListeningRef.current) {
            setTimeout(() => {
              try {
                recognitionRef.current?.start();
              } catch {
                // already running
              }
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

  // ==========================================
  // HARDWARE & CAMERA
  // ==========================================
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

  // ==========================================
  // UI RENDER
  // ==========================================
  if (!id)
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="w-full max-w-md bg-[#0d0d0d] border border-white/5 p-10 rounded-[2.5rem] shadow-2xl text-center">
          <Target className="text-[#f97316] mx-auto mb-6" />
          <h2
            style={{ fontFamily: "fontbold" }}
            className="text-white text-2xl uppercase tracking-widest mb-8"
          >
            Role_Selection
          </h2>
          <input
            className="w-full bg-black border border-white/10 p-5 rounded-2xl text-white outline-none"
            placeholder="e.g. Mechatronics Engineer"
            value={targetRole}
            onChange={(e) => setTargetRole(e.target.value)}
          />
          <button
            onClick={async () => {
              setIsStarting(true);
              const res = await api.post("/start", { role: targetRole });
              navigate(`/interview/${res.data.id}`);
            }}
            className="w-full py-5 bg-[#f97316] text-black rounded-2xl font-bold mt-6"
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

  if (evaluation)
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col items-center justify-center p-10">
        <h1 className="text-[#f97316] uppercase tracking-[0.5em] mb-10">
          Report_Ready
        </h1>
        <div className="text-8xl font-bold italic mb-6">
          {evaluation.totalScore}
          <span className="text-2xl opacity-20">/10</span>
        </div>
        <div className="max-w-xl bg-[#0d0d0d] p-8 rounded-3xl border border-white/5 text-sm text-white/70 italic">
          "{evaluation.evaluation}"
        </div>
        <button
          onClick={() => navigate("/profile")}
          className="mt-10 px-10 py-4 bg-white/5 rounded-full border border-white/10"
        >
          Terminate_Session
        </button>
      </div>
    );

  return (
    <div className="h-screen bg-[#0a0a0a] text-white flex flex-col overflow-hidden font-machina-normal">
      <header className="h-16 border-b border-white/5 flex items-center justify-between px-6 bg-black/40">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          <span className="text-xs uppercase font-bold tracking-widest">
            Live_Feed
          </span>
        </div>
      </header>

      <div className="flex-1 flex p-4 gap-4 overflow-hidden">
        {/* AVATAR & VIDEO */}
        <div className="w-[320px] flex flex-col gap-4 shrink-0">
          <div className="flex-1 bg-[#0d0d0d] rounded-[2rem] border border-white/5 relative flex items-center justify-center shadow-2xl">
            <div
              className={`absolute w-32 h-32 rounded-full bg-[#f97316]/20 blur-[50px] transition-all ${isAiSpeaking ? "scale-150 opacity-100" : "scale-50 opacity-0"}`}
            />
            <Bot
              size={48}
              className={`relative z-10 ${isAiSpeaking ? "text-[#f97316]" : "text-white/5"}`}
            />
          </div>
          <div className="flex-1 bg-black rounded-[2rem] border border-white/5 relative overflow-hidden">
            <video
              ref={userVideoRef}
              autoPlay
              muted
              playsInline
              className={`w-full h-full object-cover scale-x-[-1] ${isCameraOff ? "opacity-0" : "opacity-100"}`}
            />
            {isCameraOff && (
              <div className="absolute inset-0 flex items-center justify-center">
                <VideoOff className="text-white/5" />
              </div>
            )}
          </div>

          {/* CONTROL BAR — single mic button, mute, camera, editor, hang-up */}
          <div className="h-16 flex items-center justify-between px-6 bg-[#0d0d0d] rounded-2xl border border-white/5">
            {/* SINGLE MIC TOGGLE — voice-to-text on/off */}
            <button
              onClick={toggleVoice}
              title={isListening ? "Stop voice" : "Start voice"}
              className={`p-3 rounded-xl transition-all ${
                isListening
                  ? "bg-red-500 text-white shadow-lg shadow-red-500/30"
                  : "bg-[#f97316]/10 text-[#f97316]"
              }`}
            >
              {isListening ? <Mic size={20} /> : <MicOff size={20} />}
            </button>

            <div className="flex gap-2">
              {/* HARDWARE MUTE — silences the actual mic track */}
              <button
                onClick={() => {
                  streamRef.current?.getAudioTracks().forEach((t) => {
                    t.enabled = isMuted; // toggle: if currently muted, re-enable
                  });
                  setIsMuted(!isMuted);
                }}
                title={isMuted ? "Unmute mic" : "Mute mic"}
                className={`p-3 rounded-xl transition-all ${
                  isMuted
                    ? "bg-yellow-500/20 text-yellow-400"
                    : "bg-white/5 text-white/40"
                }`}
              >
                <MicOff size={18} />
              </button>

              {/* CAMERA TOGGLE */}
              <button
                onClick={() => {
                  streamRef.current?.getVideoTracks().forEach((t) => {
                    t.enabled = isCameraOff;
                  });
                  setIsCameraOff(!isCameraOff);
                }}
                title={isCameraOff ? "Turn camera on" : "Turn camera off"}
                className={`p-3 rounded-xl transition-all ${
                  isCameraOff
                    ? "bg-yellow-500/20 text-yellow-400"
                    : "bg-white/5 text-white/40"
                }`}
              >
                <VideoOff size={18} />
              </button>

              {/* CODE EDITOR TOGGLE */}
              <button
                onClick={() => setShowEditor(!showEditor)}
                className={`p-3 rounded-xl ${showEditor ? "bg-[#f97316] text-black" : "bg-white/5 text-white/40"}`}
              >
                <Code2 size={18} />
              </button>
            </div>

            {/* HANG UP */}
            <button
              onClick={() => navigate("/profile")}
              className="p-3 bg-red-500 rounded-xl"
            >
              <PhoneOff size={20} />
            </button>
          </div>
        </div>

        {/* CHAT & EDITOR */}
        <div className="flex-1 flex gap-4 overflow-hidden">
          <div className="flex-1 bg-[#0d0d0d] rounded-[2rem] border border-white/5 flex flex-col overflow-hidden">
            <div className="h-12 border-b border-white/5 flex items-center px-6 text-[20px] tracking-widest text-white uppercase shrink-0">
              <Terminal size={12} className="mr-2" />
              Type - Start The Interview
            </div>
            <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-black/20 custom-scrollbar">
              {messages.map((m, i) => (
                <div
                  key={i}
                  className={`flex ${m.sender === "You" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] p-4 rounded-3xl text-sm ${m.sender === "You" ? "bg-[#f97316]/10 border border-[#f97316]/20 text-white rounded-tr-sm" : "bg-white/5 border border-white/10 text-white/80 rounded-tl-sm"}`}
                  >
                    {m.text}
                  </div>
                </div>
              ))}
              <div ref={chatEndRef} />
            </div>
            <div className="p-5 bg-black/40 border-t border-white/5">
              <div className="relative flex items-center gap-3">
                <input
                  className="flex-1 bg-black border border-white/10 rounded-2xl p-4 text-sm outline-none focus:border-[#f97316]/50 transition-all text-white placeholder:text-white/5 disabled:opacity-50"
                  placeholder={
                    isAiSpeaking
                      ? "Sarah is speaking..."
                      : isListening
                        ? "Listening… speak now"
                        : "Type or click the mic…"
                  }
                  value={inputText}
                  onChange={(e) => {
                    // Manual edits override voice buffer
                    finalTranscriptRef.current = "";
                    setInputText(e.target.value);
                  }}
                  onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                  disabled={isAiSpeaking}
                />
                <button
                  onClick={() => handleSendMessage()}
                  disabled={!inputText.trim() || isAiSpeaking}
                  className="p-4 bg-[#f97316] text-black rounded-2xl hover:bg-orange-500 disabled:opacity-20 active:scale-95 transition-all shadow-lg shadow-[#f97316]/20"
                >
                  <Send size={18} />
                </button>
              </div>
              <p className="mt-2 text-[8px] text-center uppercase tracking-[0.3em] text-white/10">
                {isListening ? "Voice Engine Active" : "Voice Engine Off"}
              </p>
            </div>
          </div>

          {showEditor && (
            <div className="flex-1 bg-[#0d0d0d] rounded-[2rem] border border-white/5 overflow-hidden flex flex-col shadow-2xl">
              <div className="h-12 border-b border-white/5 flex items-center px-6 text-[10px] tracking-widest text-[#f97316] uppercase shrink-0">
                <Code2 size={12} className="mr-2" />
                MONACO_ENV
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
