import axios from "axios";
import { Cpu, LayoutPanelLeft, MicOff } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
// 1. IMPORT YOUR CUSTOM SANDBOX
import MonacoSandbox from "./components/Interview/MonacoSandbox";

// --- Interfaces ---
interface Message {
  sender: "AI" | "You" | "System";
  text: string;
}
interface AudioChunkData {
  audio: string;
  text: string;
  metadata?: {
    command?: string;
    codeSnippet?: string;
    topic?: string;
    score?: number;
  };
}
interface EvaluationData {
  evaluation: string;
  totalScore: number;
}

axios.defaults.withCredentials = true;
const SOCKET_URL = "http://16.171.200.75";
const socket: Socket = io(SOCKET_URL, { withCredentials: true });

export default function InterviewDashboard() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState("Frontend Developer");
  const [interviewId, setInterviewId] = useState<string | null>(null);
  const [userInput, setUserInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isHandsFree, setIsHandsFree] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [evaluation, setEvaluation] = useState<EvaluationData | null>(null);

  // Monaco & Analytics
  const [showEditor, setShowEditor] = useState(false);
  const [code, setCode] = useState("// Write your solution here...");
  const [analytics, setAnalytics] = useState<any>(null);

  const audioQueue = useRef<string[]>([]);
  const isPlayingRef = useRef(false);
  const recognitionRef = useRef<any>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isProcessing]);

  // Socket Logic
  useEffect(() => {
    socket.on("audio-chunk", (data: AudioChunkData) => {
      setMessages((prev) => [...prev, { sender: "AI", text: data.text }]);

      if (data.metadata?.command === "OPEN_EDITOR") {
        setShowEditor(true);
        if (data.metadata.codeSnippet) setCode(data.metadata.codeSnippet);
      }

      audioQueue.current.push(data.audio);
      playNextChunk();
    });

    socket.on("interview-complete", (data: EvaluationData) => {
      setEvaluation(data);
      fetchAnalytics();
    });

    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        if (transcript.trim()) {
          setMessages((prev) => [...prev, { sender: "You", text: transcript }]);
          autoSendMessage(transcript);
        }
      };
      recognition.onend = () => {
        setIsListening(false);
        if (isHandsFree && !isPlayingRef.current && interviewId) {
          setTimeout(() => startListeningFlow(), 300);
        }
      };
      recognitionRef.current = recognition;
    }

    return () => {
      socket.off("audio-chunk");
      socket.off("interview-complete");
      stopMicHardware();
    };
  }, [isHandsFree, interviewId]);

  const fetchAnalytics = async () => {
    if (!interviewId) return;
    try {
      const res = await axios.get(`${SOCKET_URL}/v1/analytics/${interviewId}`);
      setAnalytics(res.data);
    } catch (err) {
      console.error("Analytics Error");
    }
  };

  const startListeningFlow = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });
      streamRef.current = stream;
      recognitionRef.current?.start();
      setIsListening(true);
    } catch (err) {
      setIsHandsFree(false);
    }
  };

  const stopMicHardware = () => {
    recognitionRef.current?.stop();
    streamRef.current?.getTracks().forEach((t) => t.stop());
    setIsListening(false);
  };

  const startSession = async () => {
    try {
      setIsProcessing(true);
      const res = await axios.post(`${SOCKET_URL}/v1/start`, { role });
      setInterviewId(res.data.id);
      socket.emit("join-interview", res.data.id);
      setMessages([{ sender: "System", text: `Session Started for ${role}` }]);
    } catch (err) {
      alert("Error starting session");
    } finally {
      setIsProcessing(false);
    }
  };

  const autoSendMessage = async (text: string) => {
    if (!interviewId || !text.trim()) return;
    setIsProcessing(true);
    setUserInput("");
    try {
      await axios.post(`${SOCKET_URL}/v1/respond`, {
        interviewId,
        userInput: text,
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const playNextChunk = () => {
    if (isPlayingRef.current || audioQueue.current.length === 0) return;
    isPlayingRef.current = true;
    const base64 = audioQueue.current.shift();
    if (base64) {
      const audioObj = new Audio(`data:audio/mp3;base64,${base64}`);
      audioObj.onended = () => {
        isPlayingRef.current = false;
        if (audioQueue.current.length === 0 && isHandsFree) {
          setTimeout(() => startListeningFlow(), 400);
        }
        playNextChunk();
      };
      audioObj.play().catch(() => {
        isPlayingRef.current = false;
        playNextChunk();
      });
    }
  };

  // --- RENDERING LOGIC ---

  if (!isLoggedIn)
    return (
      <div className="h-screen bg-slate-950 flex flex-col items-center justify-center p-4">
        <div className="text-center space-y-6">
          <div className="w-20 h-20 bg-indigo-600 rounded-3xl flex items-center justify-center mx-auto rotate-3 shadow-2xl">
            <Cpu className="text-white" size={40} />
          </div>
          <h1 className="text-4xl font-black text-white tracking-tighter">
            PREPGRID AI
          </h1>
          <button
            onClick={() => setIsLoggedIn(true)}
            className="bg-white text-black px-16 py-4 rounded-2xl font-black hover:bg-indigo-400 transition-all active:scale-95 shadow-xl"
          >
            ENTER SYSTEM
          </button>
        </div>
      </div>
    );

  if (!interviewId)
    return (
      <div className="h-screen bg-slate-950 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-slate-900 border border-slate-800 p-8 rounded-[2rem] shadow-2xl">
          <h2 className="text-white text-xl font-bold text-center mb-6 uppercase tracking-widest">
            Select Role
          </h2>
          <input
            className="w-full bg-black border border-slate-700 p-4 rounded-xl text-white outline-none focus:border-indigo-500 transition-all mb-6 text-center"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          />
          <button
            onClick={startSession}
            disabled={isProcessing}
            className="w-full bg-indigo-600 text-white py-4 rounded-xl font-black hover:bg-indigo-500 transition-all"
          >
            {isProcessing ? "SYNCING..." : "INITIALIZE"}
          </button>
        </div>
      </div>
    );

  if (evaluation)
    return (
      <div className="min-h-screen bg-black text-white p-6 md:px-20 py-12">
        <div className="max-w-5xl mx-auto space-y-8">
          <div className="text-center">
            <div className="text-7xl font-black text-indigo-500">
              {evaluation.totalScore}
              <span className="text-2xl text-slate-500">/10</span>
            </div>
            <h1 className="text-xl font-bold mt-4 text-slate-400">
              SESSION REPORT
            </h1>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-slate-900/50 border border-white/10 p-6 rounded-3xl whitespace-pre-wrap font-mono text-sm leading-relaxed max-h-[500px] overflow-y-auto">
              {evaluation.evaluation}
            </div>
            <div className="bg-slate-900/50 border border-white/10 p-6 rounded-3xl space-y-6">
              <h3 className="text-xs font-black text-indigo-400 uppercase tracking-widest">
                Weak Area Analysis
              </h3>
              {analytics?.stats &&
                Object.entries(analytics.stats).map(([topic, stat]: any) => (
                  <div key={topic} className="space-y-2">
                    <div className="flex justify-between text-[10px] font-bold uppercase">
                      <span className="text-slate-400">{topic}</span>
                      <span
                        className={
                          stat.average < 5 ? "text-red-500" : "text-green-500"
                        }
                      >
                        {stat.average}/10
                      </span>
                    </div>
                    <div className="w-full bg-black h-1.5 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all duration-1000 ${stat.average < 5 ? "bg-red-600" : "bg-green-600"}`}
                        style={{ width: `${stat.average * 10}%` }}
                      />
                    </div>
                  </div>
                ))}
            </div>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="w-full bg-white text-black py-5 rounded-2xl font-black"
          >
            RESTART SESSION
          </button>
        </div>
      </div>
    );

  return (
    <div className="flex h-screen bg-black text-slate-100 overflow-hidden">
      {/* LEFT: Chat Area */}
      <div
        className={`${showEditor ? "w-1/2 border-r border-white/10" : "w-full"} flex flex-col h-full transition-all duration-500 ease-in-out`}
      >
        <header className="px-6 py-4 border-b border-white/5 flex justify-between items-center bg-slate-900/40 backdrop-blur-xl">
          <div className="flex items-center gap-3">
            <div
              className={`w-2.5 h-2.5 rounded-full ${isPlayingRef.current ? "bg-indigo-400 animate-ping" : "bg-slate-700"}`}
            />
            <h1 className="text-[10px] font-black tracking-[0.2em] uppercase text-slate-400">
              AI_INTERVIEWER_v1.0
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowEditor(!showEditor)}
              className={`p-2 rounded-lg ${showEditor ? "bg-indigo-600" : "bg-slate-800"}`}
            >
              <LayoutPanelLeft size={18} />
            </button>
            <button
              onClick={() => setIsHandsFree(!isHandsFree)}
              className={`px-4 py-1.5 rounded-full text-[10px] font-black border ${isHandsFree ? "bg-indigo-600 border-indigo-400" : "bg-transparent border-slate-700 text-slate-500"}`}
            >
              {isHandsFree ? "VOICE_ON" : "MANUAL"}
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide">
          {messages.map((m, i) => (
            <div
              key={i}
              className={`flex ${m.sender === "You" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[85%] p-4 rounded-2xl ${m.sender === "You" ? "bg-indigo-600 shadow-lg shadow-indigo-500/10" : "bg-slate-900 border border-white/5"}`}
              >
                <p className="text-sm leading-relaxed">{m.text}</p>
              </div>
            </div>
          ))}
          <div ref={chatEndRef} />
        </main>

        <footer className="p-6 bg-gradient-to-t from-black to-transparent">
          <div className="flex gap-3 bg-slate-900/80 backdrop-blur-md p-2 rounded-2xl border border-white/5">
            <button
              onClick={isListening ? stopMicHardware : startListeningFlow}
              className={`p-3 rounded-xl transition-all ${isListening ? "bg-red-600 animate-pulse" : "bg-slate-800 text-slate-500 hover:text-white"}`}
            >
              <MicOff size={20} />
            </button>
            <input
              className="flex-1 bg-transparent border-none outline-none text-white text-sm px-2"
              placeholder="Describe your experience..."
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && autoSendMessage(userInput)}
            />
            <button
              onClick={() => autoSendMessage(userInput)}
              className="bg-white text-black px-6 rounded-xl font-bold text-xs"
            >
              SEND
            </button>
          </div>
        </footer>
      </div>

      {/* 2. RIGHT: INTEGRATED CUSTOM MONACO SANDBOX */}
      {showEditor && (
        <div className="w-1/2 h-full transition-all duration-500">
          <MonacoSandbox
            initialCode={code}
            onClose={() => setShowEditor(false)}
          />
        </div>
      )}
    </div>
  );
}
