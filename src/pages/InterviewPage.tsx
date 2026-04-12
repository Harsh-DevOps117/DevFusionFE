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

  // State Management
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

  // Refs for Hardware and Engines
  const userVideoRef = useRef<HTMLVideoElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const recognitionRef = useRef<any>(null);
  const silenceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // NEW: Audio Ref to kill AI speech on hangup
  const currentAudioRef = useRef<HTMLAudioElement | null>(null);

  // Sync state to refs for engine callbacks
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

  // ==========================================
  // CLEAN TEARDOWN — The Kill Switch
  // ==========================================
  const teardown = useCallback(() => {
    // 1. Kill AI Audio immediately
    if (currentAudioRef.current) {
      currentAudioRef.current.pause();
      currentAudioRef.current.src = "";
      currentAudioRef.current = null;
    }

    // 2. Kill silence timer
    if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);

    // 3. Stop speech recognition
    if (recognitionRef.current) {
      recognitionRef.current.onend = null;
      recognitionRef.current.onerror = null;
      recognitionRef.current.onresult = null;
      try {
        recognitionRef.current.stop();
      } catch (e) {
        /* already stopped */
      }
    }

    // 4. Stop all hardware tracks
    streamRef.current?.getTracks().forEach((t) => t.stop());

    // 5. Socket Cleanup
    socket.emit("leave-interview");
    socket.off("audio-chunk");
    socket.off("interview-complete");

    setIsAiSpeaking(false);
    setIsListening(false);
  }, []);

  const endCall = useCallback(() => {
    teardown();
    navigate("/profile");
  }, [teardown, navigate]);

  // ==========================================
  // SEND MESSAGE LOGIC
  // ==========================================
  const handleSendMessage = useCallback(async (textOverride?: string) => {
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
  }, []);

  // ==========================================
  // SPEECH RECOGNITION SETUP
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

    recognition.onresult = (event: any) => {
      if (isAiSpeakingRef.current) return;

      let interimText = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal)
          finalTranscriptRef.current += result[0].transcript + " ";
        else interimText += result[0].transcript;
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

    recognition.onend = () => {
      if (isListeningRef.current && !isAiSpeakingRef.current) {
        try {
          recognition.start();
        } catch (e) {
          /* ignore */
        }
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
      setInputText("");
    } else {
      finalTranscriptRef.current = "";
      setIsListening(true);
      try {
        recognitionRef.current?.start();
      } catch (e) {
        /* ignore */
      }
    }
  }, []);

  // ==========================================
  // SOCKET & AUDIO LOGIC
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
        // Kill existing audio before playing new chunk
        if (currentAudioRef.current) {
          currentAudioRef.current.pause();
        }

        recognitionRef.current?.stop();
        setIsAiSpeaking(true);

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
              } catch (e) {
                /* ignore */
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

  // ==========================================
  // RENDER LOGIC
  // ==========================================

  // 1. Role Selection View
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
              const res = await api.post("/start", { role: targetRole });
              navigate(`/interview/${res.data.id}`);
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

  // 2. Evaluation View
  if (evaluation)
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col items-center justify-center p-10">
        <h1 className="text-[#f97316] uppercase tracking-[0.5em] mb-10">
          Report_Ready
        </h1>
        <div className="text-8xl font-black italic mb-6">
          {evaluation.totalScore}
          <span className="text-2xl opacity-20 not-italic">/10</span>
        </div>
        <div className="max-w-xl bg-[#0d0d0d] p-8 rounded-3xl border border-white/5 text-sm text-white/70 italic leading-relaxed">
          "{evaluation.evaluation}"
        </div>
        <button
          onClick={() => navigate("/profile")}
          className="mt-10 px-10 py-4 bg-white/5 rounded-full border border-white/10 hover:bg-white/10 transition-all uppercase text-[10px] font-bold tracking-widest"
        >
          Terminate_Session
        </button>
      </div>
    );

  // 3. Main Interview View
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
        {/* Sidebar: AI + User Video */}
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

          {/* Control HUD */}
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
            {/* HANG UP BUTTON */}
            <button
              onClick={endCall}
              className="p-3 bg-red-600 text-white rounded-xl hover:bg-red-500 transition-all shadow-lg shadow-red-900/20"
            >
              <PhoneOff size={20} />
            </button>
          </div>
        </div>

        {/* Main Content: Chat & Editor */}
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
                    className={`max-w-[80%] p-4 rounded-3xl text-sm leading-relaxed ${m.sender === "You" ? "bg-[#f97316]/10 border border-[#f97316]/20 text-white rounded-tr-sm" : "bg-white/5 border border-white/10 text-white/70 rounded-tl-sm"}`}
                  >
                    {m.text}
                  </div>
                </div>
              ))}
              <div ref={chatEndRef} />
            </div>

            {/* Input Section */}
            <div className="p-5 bg-black/40 border-t border-white/5">
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
