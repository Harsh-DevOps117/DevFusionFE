"use client";

import {
  ArrowLeft,
  Award,
  Code2,
  FileText,
  Plus,
  Target,
  Trash2,
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

// ✅ 1. Import ProblemService from our centralized services
import { ProblemService } from "../services/index";

export default function CreateProblemPage() {
  const navigate = useNavigate();

  const [form, setForm] = useState<any>({
    title: "",
    description: "",
    difficulty: "Easy",
    tags: "",
    constraints: "",
    examples: [{ input: "", output: "", explanation: "" }],
    testcases: [{ input: "", output: "" }],
    codeSnippets: { javascript: "", python: "", cpp: "" },
    referenceSolutions: { javascript: "", python: "", cpp: "" },
  });

  const handleChange = (field: string, value: any) => {
    setForm({ ...form, [field]: value });
  };

  const handleArrayChange = (
    field: string,
    index: number,
    key: string,
    value: string,
  ) => {
    const updated = [...form[field]];
    updated[index][key] = value;
    setForm({ ...form, [field]: updated });
  };

  const addItem = (field: string, emptyObj: any) => {
    setForm({ ...form, [field]: [...form[field], emptyObj] });
  };

  const removeItem = (field: string, index: number) => {
    const updated = form[field].filter((_: any, i: number) => i !== index);
    setForm({ ...form, [field]: updated });
  };

  const handleSubmit = async () => {
    try {
      // ✅ Clean tags
      const tags = form.tags
        .split(",")
        .map((t: string) => t.trim())
        .filter(Boolean);

      // ✅ Remove empty testcases
      const validTestcases = form.testcases.filter(
        (tc: any) => tc.input.trim() && tc.output.trim(),
      );

      // ✅ Remove empty examples
      const validExamples = form.examples.filter(
        (ex: any) => ex.input.trim() && ex.output.trim(),
      );

      // ✅ Remove empty reference solutions (CRITICAL FIX)
      const validSolutions: any = {};
      Object.entries(form.referenceSolutions).forEach(([lang, code]: any) => {
        if (code && code.trim().length > 0) {
          validSolutions[lang] = code;
        }
      });

      // 🚨 Validations (prevent backend failure)
      if (!form.title.trim() || !form.description.trim()) {
        alert("Title and Description are required");
        return;
      }

      if (validTestcases.length === 0) {
        alert("At least one valid testcase is required");
        return;
      }

      if (Object.keys(validSolutions).length === 0) {
        alert("At least one reference solution is required");
        return;
      }

      const payload = {
        ...form,
        tags,
        testcases: validTestcases,
        examples: validExamples,
        referenceSolutions: validSolutions,
      };

      console.log("FINAL PAYLOAD:", payload); // 🔥 debug

      // ✅ 2. Use the centralized ProblemService
      const res = await ProblemService.create(payload);

      alert("✅ Problem Created Successfully!");
      console.log(res);

      // Optional: Redirect back to dashboard after success
      // navigate("/admin");
    } catch (err: any) {
      console.error(err);
      alert(err?.response?.data?.error || "Failed to create problem");
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white pb-20">
      <div className="fixed inset-0 bg-[linear-gradient(to_right,#1a1a1a_1px,transparent_1px),linear-gradient(to_bottom,#1a1a1a_1px,transparent_1px)] bg-[size:50px_50px] opacity-20 pointer-events-none" />

      <div className="relative max-w-5xl mx-auto px-6 pt-12">
        <div className="flex items-center justify-between mb-10">
          <button
            onClick={() => navigate("/")}
            className="group flex items-center gap-3 text-white/70 hover:text-white transition-all"
          >
            <div className="w-10 h-10 flex items-center justify-center bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl transition-all group-hover:-translate-x-1">
              <ArrowLeft size={20} />
            </div>
            <span className="font-medium tracking-wide">Back to Dashboard</span>
          </button>

          <div className="text-xs font-mono uppercase tracking-widest text-white/40">
            ADMIN MODE
          </div>
        </div>

        {/* HEADER */}
        <div className="mb-12">
          <h1 className="text-6xl font-black tracking-tighter bg-gradient-to-b from-white to-white/70 bg-clip-text text-transparent">
            CREATE PROBLEM
          </h1>
          <p className="text-white/40 mt-2 text-lg">
            Add a new challenge to the platform
          </p>
        </div>

        <div className="space-y-10">
          {/* BASIC INFORMATION */}
          <div className="bg-white/5 border border-white/10 rounded-3xl p-8">
            <div className="flex items-center gap-3 mb-6">
              <FileText className="text-[#f97316]" />
              <h2 className="text-xl font-semibold tracking-wide">
                Basic Information
              </h2>
            </div>

            <div className="space-y-6">
              <input
                type="text"
                placeholder="Problem Title"
                className="w-full bg-white/5 border border-white/10 focus:border-[#f97316] rounded-2xl px-6 py-4 text-lg placeholder:text-white/30 focus:outline-none transition-all"
                value={form.title}
                onChange={(e) => handleChange("title", e.target.value)}
              />

              <textarea
                placeholder="Problem Description..."
                className="w-full bg-white/5 border border-white/10 focus:border-[#f97316] rounded-3xl px-6 py-5 h-40 resize-y min-h-[140px] placeholder:text-white/30 focus:outline-none transition-all"
                value={form.description}
                onChange={(e) => handleChange("description", e.target.value)}
              />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <input
                  placeholder="Tags (comma separated)"
                  className="bg-white/5 border border-white/10 focus:border-[#f97316] rounded-2xl px-6 py-4 placeholder:text-white/30 focus:outline-none transition-all"
                  value={form.tags}
                  onChange={(e) => handleChange("tags", e.target.value)}
                />

                <select
                  className="bg-white/5 border border-white/10 focus:border-[#f97316] rounded-2xl px-6 py-4 focus:outline-none transition-all text-orange-500"
                  value={form.difficulty}
                  onChange={(e) => handleChange("difficulty", e.target.value)}
                >
                  <option value="Easy">Easy</option>
                  <option value="Medium">Medium</option>
                  <option value="Hard">Hard</option>
                </select>

                <textarea
                  placeholder="Constraints"
                  className="bg-white/5 border border-white/10 focus:border-[#f97316] rounded-2xl px-6 py-4 placeholder:text-white/30 focus:outline-none transition-all"
                  value={form.constraints}
                  onChange={(e) => handleChange("constraints", e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* EXAMPLES */}
          <Section title="Examples" icon={<Target className="w-5 h-5" />}>
            {form.examples.map((ex: any, i: number) => (
              <div
                key={i}
                className="mb-8 bg-white/5 border border-white/10 rounded-2xl p-6"
              >
                <div className="flex justify-between items-center mb-4">
                  <h4 className="text-[#f97316] font-semibold">
                    Example {i + 1}
                  </h4>
                  {form.examples.length > 1 && (
                    <button
                      onClick={() => removeItem("examples", i)}
                      className="text-red-400 hover:text-red-500 transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  )}
                </div>
                <div className="space-y-4">
                  <textarea
                    placeholder="Input"
                    value={ex.input}
                    onChange={(e) =>
                      handleArrayChange("examples", i, "input", e.target.value)
                    }
                    className="w-full bg-black/50 border border-white/10 rounded-xl p-4 text-sm font-mono focus:border-[#f97316]"
                  />
                  <textarea
                    placeholder="Output"
                    value={ex.output}
                    onChange={(e) =>
                      handleArrayChange("examples", i, "output", e.target.value)
                    }
                    className="w-full bg-black/50 border border-white/10 rounded-xl p-4 text-sm font-mono focus:border-[#f97316]"
                  />
                  <input
                    placeholder="Explanation (optional)"
                    value={ex.explanation}
                    onChange={(e) =>
                      handleArrayChange(
                        "examples",
                        i,
                        "explanation",
                        e.target.value,
                      )
                    }
                    className="w-full bg-black/50 border border-white/10 rounded-xl p-4"
                  />
                </div>
              </div>
            ))}
            <button
              onClick={() =>
                addItem("examples", { input: "", output: "", explanation: "" })
              }
              className="flex items-center gap-2 text-[#f97316] hover:text-orange-400 transition-colors"
            >
              <Plus size={18} /> Add Another Example
            </button>
          </Section>

          {/* TEST CASES */}
          <Section
            title="Hidden Test Cases"
            icon={<Code2 className="w-5 h-5" />}
          >
            {form.testcases.map((tc: any, i: number) => (
              <div
                key={i}
                className="mb-6 bg-white/5 border border-white/10 rounded-2xl p-6"
              >
                <div className="flex justify-between mb-4">
                  <h4 className="font-medium">Test Case {i + 1}</h4>
                  {form.testcases.length > 1 && (
                    <button
                      onClick={() => removeItem("testcases", i)}
                      className="text-red-400"
                    >
                      <Trash2 size={18} />
                    </button>
                  )}
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <textarea
                    placeholder="Input"
                    value={tc.input}
                    onChange={(e) =>
                      handleArrayChange("testcases", i, "input", e.target.value)
                    }
                    className="bg-black/50 border border-white/10 rounded-xl p-4 font-mono text-sm"
                  />
                  <textarea
                    placeholder="Output"
                    value={tc.output}
                    onChange={(e) =>
                      handleArrayChange(
                        "testcases",
                        i,
                        "output",
                        e.target.value,
                      )
                    }
                    className="bg-black/50 border border-white/10 rounded-xl p-4 font-mono text-sm"
                  />
                </div>
              </div>
            ))}
            <button
              onClick={() => addItem("testcases", { input: "", output: "" })}
              className="flex items-center gap-2 text-[#f97316] hover:text-orange-400 transition-colors"
            >
              <Plus size={18} /> Add Test Case
            </button>
          </Section>

          {/* CODE SNIPPETS & REFERENCE SOLUTIONS */}
          <div className="grid lg:grid-cols-2 gap-8">
            <Section title="Starter Code" icon={<Code2 className="w-5 h-5" />}>
              {["javascript", "python", "cpp"].map((lang) => (
                <div key={lang} className="mb-6">
                  <p className="text-white/50 text-sm mb-2 uppercase tracking-widest">
                    {lang}
                  </p>
                  <textarea
                    placeholder={`// ${lang} starter code`}
                    className="w-full h-52 font-mono bg-black/70 border border-white/10 rounded-2xl p-5 text-sm focus:border-[#f97316] focus:outline-none"
                    value={form.codeSnippets[lang]}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        codeSnippets: {
                          ...form.codeSnippets,
                          [lang]: e.target.value,
                        },
                      })
                    }
                  />
                </div>
              ))}
            </Section>

            <Section
              title="Reference Solutions"
              icon={<Award className="w-5 h-5" />}
            >
              {["javascript", "python", "cpp"].map((lang) => (
                <div key={lang} className="mb-6">
                  <p className="text-white/50 text-sm mb-2 uppercase tracking-widest">
                    {lang}
                  </p>
                  <textarea
                    placeholder={`// ${lang} solution`}
                    className="w-full h-52 font-mono bg-black/70 border border-white/10 rounded-2xl p-5 text-sm focus:border-[#f97316] focus:outline-none"
                    value={form.referenceSolutions[lang]}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        referenceSolutions: {
                          ...form.referenceSolutions,
                          [lang]: e.target.value,
                        },
                      })
                    }
                  />
                </div>
              ))}
            </Section>
          </div>
        </div>

        {/* SUBMIT BUTTON */}
        <div className="mt-12 flex justify-center">
          <button
            onClick={handleSubmit}
            className="bg-[#f97316] hover:bg-orange-500 active:scale-95 transition-all text-black font-bold text-lg px-16 py-6 rounded-2xl flex items-center gap-3 shadow-xl shadow-[#f97316]/30"
          >
            CREATE PROBLEM
          </button>
        </div>
      </div>
    </div>
  );
}

function Section({ title, icon, children }: any) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden">
      <div className="px-8 py-5 border-b border-white/10 bg-white/5 flex items-center gap-3">
        {icon}
        <h3 className="uppercase tracking-[2px] text-sm font-semibold">
          {title}
        </h3>
      </div>
      <div className="p-8">{children}</div>
    </div>
  );
}
