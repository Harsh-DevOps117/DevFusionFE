import Editor, { useMonaco } from "@monaco-editor/react";
import { useEffect } from "react";

export default function CodeEditor({
  code,
  setCode,
  language = "javascript",
}: any) {
  const monaco = useMonaco();

  useEffect(() => {
    if (!monaco) return;

    // 🔥 CUSTOM THEME (MATCH YOUR APP)
    monaco.editor.defineTheme("prepgird-dark", {
      base: "vs-dark",
      inherit: true,
      rules: [
        { token: "", background: "0a0a0a" },
        { token: "keyword", foreground: "f97316" },
        { token: "identifier", foreground: "ffffff" },
        { token: "string", foreground: "22c55e" },
        { token: "number", foreground: "eab308" },
        { token: "comment", foreground: "6b7280" },
      ],
      colors: {
        "editor.background": "#0a0a0a",
        "editorLineNumber.foreground": "#6b7280",
        "editorCursor.foreground": "#f97316",
        "editor.lineHighlightBackground": "#ffffff08",
        "editor.selectionBackground": "#f9731633",
      },
    });

    monaco.editor.setTheme("prepgird-dark");
  }, [monaco]);

  return (
    <div className="h-full w-full border-t border-white/10">
      <Editor
        height="100%"
        language={language}
        value={code}
        onChange={(value) => setCode(value || "")}
        theme="prepgird-dark"
        options={{
          fontSize: 15,
          fontFamily: "JetBrains Mono, monospace",
          minimap: { enabled: false },
          smoothScrolling: true,
          cursorSmoothCaretAnimation: "on",
          padding: { top: 12 },
          lineHeight: 22,
          scrollbar: {
            verticalScrollbarSize: 6,
          },
        }}
      />
    </div>
  );
}
