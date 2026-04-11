import Editor from "@monaco-editor/react";
import {
  ChevronRight,
  Cpu,
  Globe,
  Play,
  Terminal,
  Trash2,
  X,
} from "lucide-react";
import { useState } from "react";
import { executeCode } from "../../utils/api";

interface MonacoProps {
  initialCode?: string;
  onClose?: () => void;
}

export default function MonacoSandbox({ initialCode, onClose }: MonacoProps) {
  const [code, setCode] = useState(initialCode || "// Write your code here...");
  const [output, setOutput] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  const runCode = async () => {
    // 1. Prevent empty execution
    if (!code || code === "// Write your code here...") return;

    setIsLoading(true);
    setIsError(false);

    try {
      /**
       * ⚠️ CRITICAL FIX:
       * Judge0 requires a numeric language_id.
       * 63 = JavaScript (Node.js)
       * We pass 'code' as the second argument, NOT the string "javascript".
       */
      const result = await executeCode(code, 63);

      // Judge0 returns 'run' object based on your previous api.ts wrapper
      if (result.run) {
        const rawOutput =
          result.run.output || "Program executed with no output.";
        setOutput(rawOutput.split("\n"));

        // Check if exit code is non-zero (errors)
        if (result.run.code !== 0) {
          setIsError(true);
        }
      }
    } catch (err: any) {
      setIsError(true);
      if (err.response?.status === 401) {
        setOutput([
          "⚠️ [401] UNAUTHORIZED",
          "Your RapidAPI key is invalid or not subscribed to Judge0.",
        ]);
      } else if (err.response?.status === 422) {
        setOutput([
          "⚠️ [422] UNPROCESSABLE ENTITY",
          "Check if language_id (63) is correct in api.ts.",
        ]);
      } else {
        setOutput([
          "[SYSTEM ERROR]: Execution engine unreachable.",
          err.message,
        ]);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-[#0f0f0f] flex flex-col font-sans animate-in fade-in zoom-in duration-300">
      {/* HEADER TOOLBAR */}
      <div className="flex items-center justify-between px-6 py-3 bg-[#1e1e1e] border-b border-white/5 shadow-xl">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-indigo-500/10 rounded-lg">
              <Terminal size={18} className="text-indigo-400" />
            </div>
            <div>
              <h2 className="text-xs font-black text-white uppercase tracking-tighter">
                AI_Sandbox_v2
              </h2>
              <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">
                Environment: Node.js
              </p>
            </div>
          </div>

          <div className="h-6 w-[1px] bg-white/10" />

          <button
            onClick={runCode}
            disabled={isLoading}
            className={`flex items-center gap-2 px-6 py-2 rounded-xl text-xs font-black transition-all ${
              isLoading
                ? "bg-slate-800 text-slate-500 cursor-not-allowed"
                : "bg-indigo-600 text-white hover:bg-indigo-500 hover:shadow-[0_0_20px_rgba(79,70,229,0.4)] active:scale-95"
            }`}
          >
            <Play size={14} fill="currentColor" />
            {isLoading ? "COMPILING..." : "EXECUTE_CODE"}
          </button>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-4 text-[10px] font-bold text-slate-500 uppercase">
            <span className="flex items-center gap-1">
              <Cpu size={12} /> RAM: 512MB
            </span>
            <span className="flex items-center gap-1">
              <Globe size={12} /> Cloud: Judge0
            </span>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/5 rounded-full text-slate-500 hover:text-white transition-all"
            >
              <X size={20} />
            </button>
          )}
        </div>
      </div>

      {/* MAIN CONTENT AREA */}
      <div className="flex flex-1 overflow-hidden">
        {/* LEFT: TERMINAL OUTPUT */}
        <div className="w-1/3 min-w-[300px] bg-[#0a0a0a] flex flex-col border-r border-white/5">
          <div className="px-4 py-2 bg-[#141414] flex justify-between items-center border-b border-white/5">
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
              Standard_Output
            </span>
            <button
              onClick={() => setOutput([])}
              className="p-1 text-slate-600 hover:text-red-400 transition-colors"
            >
              <Trash2 size={14} />
            </button>
          </div>

          <div className="flex-1 p-6 overflow-y-auto font-mono text-[13px] leading-relaxed scrollbar-hide">
            {output.length > 0 ? (
              output.map((line, i) => (
                <div
                  key={i}
                  className={`flex gap-3 mb-1 ${isError ? "text-red-400" : "text-emerald-400"}`}
                >
                  <span className="text-slate-800 shrink-0 select-none">›</span>
                  <span className="whitespace-pre-wrap">{line || " "}</span>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-slate-800">
                <ChevronRight
                  size={48}
                  strokeWidth={0.5}
                  className="animate-pulse"
                />
                <p className="text-[10px] uppercase font-black tracking-[0.3em] mt-4 opacity-50">
                  Await Input
                </p>
              </div>
            )}
          </div>

          <div className="px-6 py-2 bg-[#141414] border-t border-white/5 flex items-center justify-between text-[10px] font-bold uppercase">
            <div className="flex items-center gap-2">
              <div
                className={`w-2 h-2 rounded-full ${isError ? "bg-red-500" : "bg-emerald-500"} shadow-[0_0_10px_rgba(16,185,129,0.3)]`}
              />
              <span className={isError ? "text-red-500" : "text-emerald-500"}>
                {isError ? "Runtime_Error" : "System_Ready"}
              </span>
            </div>
            <span className="text-slate-700">JS_V8_ENGINE</span>
          </div>
        </div>

        {/* RIGHT: MONACO EDITOR */}
        <div className="flex-1 relative bg-[#1e1e1e]">
          <Editor
            height="100%"
            theme="vs-dark"
            defaultLanguage="javascript"
            value={code}
            loading={
              <div className="h-full flex items-center justify-center text-slate-700 font-mono text-xs uppercase tracking-widest">
                Loading_Editor_Core...
              </div>
            }
            onChange={(val) => setCode(val || "")}
            options={{
              fontSize: 15,
              minimap: { enabled: false },
              automaticLayout: true,
              scrollBeyondLastLine: false,
              padding: { top: 30 },
              fontFamily: "'Fira Code', 'JetBrains Mono', monospace",
              fontLigatures: true,
              cursorBlinking: "expand",
              cursorSmoothCaretAnimation: "on",
              renderLineHighlight: "all",
              lineNumbersMinChars: 3,
              bracketPairColorization: { enabled: true },
            }}
          />
        </div>
      </div>
    </div>
  );
}
