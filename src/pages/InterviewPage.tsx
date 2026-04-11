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
  const transcriptRef = useRef(""); // Latest voice data holder

  useEffect(() => {
    isAiSpeakingRef.current = isAiSpeaking;
  }, [isAiSpeaking]);

  // ==========================================
  // 1. SEND MESSAGE (TEXT + UI SYNC)
  // ==========================================
  const handleSendMessage = useCallback(
    async (textOverride?: string) => {
      const finalMsg = (textOverride ?? inputText).trim();
      if (!finalMsg) return;

      // Reset voice buffers immediately
      if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
      transcriptRef.current = "";
      setInputText("");

      // Update Chat UI
      setMessages((prev) => [...prev, { sender: "You", text: finalMsg }]);
      setIsAiSpeaking(true); // Orb glows while AI processes

      try {
        await api.post("/respond", { interviewId: id, userInput: finalMsg });
      } catch (err) {
        setIsAiSpeaking(false);
      }
    },
    [id, inputText],
  );

  // ==========================================
  // 2. VOICE-TO-TEXT ENGINE (REAL-TIME UI)
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
      if (isAiSpeakingRef.current) return; // Ignore AI's own voice

      let liveTranscript = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        liveTranscript += event.results[i][0].transcript;
      }

      // STEP A: Visual Update (Box me dikhega)
      setInputText(liveTranscript);
      transcriptRef.current = liveTranscript;

      // STEP B: Auto-Send Logic (1.8s silence)
      if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
      silenceTimerRef.current = setTimeout(() => {
        if (transcriptRef.current.trim().length > 2) {
          handleSendMessage(transcriptRef.current);
        }
      }, 1800);
    };

    recognition.onend = () => {
      if (isListening && !isAiSpeakingRef.current) {
        try {
          recognition.start();
        } catch (e) {}
      }
    };

    recognitionRef.current = recognition;
    return () => recognition.stop();
  }, [id, isListening, handleSendMessage]);

  const toggleVoice = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      setIsListening(true);
      setInputText("");
      transcriptRef.current = "";
      recognitionRef.current?.start();
    }
  };

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
        recognitionRef.current?.stop(); // Pause mic while AI talks
        setIsAiSpeaking(true);

        const audio = new Audio(`data:audio/mp3;base64,${data.audio}`);
        audio.play().catch(() => setIsAiSpeaking(false));
        audio.onended = () => {
          setIsAiSpeaking(false);
          if (isListening)
            setTimeout(() => recognitionRef.current?.start(), 300);
        };
      }
    });

    socket.on("interview-complete", (data) => setEvaluation(data));

    return () => {
      socket.off("audio-chunk");
      socket.off("interview-complete");
    };
  }, [id, isListening]);

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
          {/* CONTROL BAR */}
          <div className="h-16 flex items-center justify-between px-6 bg-[#0d0d0d] rounded-2xl border border-white/5">
            <button
              onClick={toggleVoice}
              className={`p-3 rounded-xl transition-all ${isListening ? "bg-red-500 text-white shadow-lg shadow-red-500/30" : "bg-[#f97316]/10 text-[#f97316]"}`}
            >
              {isListening ? <Mic size={20} /> : <MicOff size={20} />}
            </button>
            <div className="flex gap-2">
              <button
                onClick={() =>
                  streamRef.current
                    ?.getAudioTracks()
                    .forEach((t) => (t.enabled = isMuted)) ||
                  setIsMuted(!isMuted)
                }
                className="p-3 bg-white/5 rounded-xl text-white/40"
              >
                <MicOff size={18} />
              </button>
              <button
                onClick={() =>
                  streamRef.current
                    ?.getVideoTracks()
                    .forEach((t) => (t.enabled = isCameraOff)) ||
                  setIsCameraOff(!isCameraOff)
                }
                className="p-3 bg-white/5 rounded-xl text-white/40"
              >
                <VideoOff size={18} />
              </button>
              <button
                onClick={() => setShowEditor(!showEditor)}
                className={`p-3 rounded-xl ${showEditor ? "bg-[#f97316] text-black" : "bg-white/5 text-white/40"}`}
              >
                <Code2 size={18} />
              </button>
            </div>
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
            <div className="h-12 border-b border-white/5 flex items-center px-6 text-[10px] tracking-widest text-white/20 uppercase shrink-0">
              <Terminal size={12} className="mr-2" />
              COMMS_STREAM
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
                {/* THE INPUT BOX: Isme tumhare bolne par real-time text aayega */}
                <input
                  className="flex-1 bg-black border border-white/10 rounded-2xl p-4 text-sm outline-none focus:border-[#f97316]/50 transition-all text-white placeholder:text-white/5 disabled:opacity-50"
                  placeholder={
                    isAiSpeaking
                      ? "Sarah is speaking..."
                      : isListening
                        ? "Listening... speak now"
                        : "Type or click the Mic..."
                  }
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
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
