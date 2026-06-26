import { useState } from "react";
import { Download, Edit2, Check, FileText } from "lucide-react";
import Navbar from "../components/Navbar";

// Define the template data type
interface ResumeData {
  name: string;
  phone: string;
  email: string;
  linkedin: string;
  website: string;
  objective: string;
  education: {
    institution: string;
    location: string;
    degree: string;
    duration: string;
    score: string;
  }[];
  skills: {
    languages: string;
    webTech: string;
    tools: string;
    databases: string;
    other: string;
  };
  projects: {
    title: string;
    link: string;
    duration: string;
    techStack: string;
    bullets: string[];
  }[];
  achievements: string[];
}

const defaultData: ResumeData = {
  name: "SAHIL CHAUDHARY",
  phone: "+91 99999 77777",
  email: "sahil@enginow.in",
  linkedin: "linkedin.com/company/enginow",
  website: "www.enginow.in",
  objective:
    "A software engineering graduate with a strong foundation in data structures, algorithms, and hands-on project experience, who enjoys solving real problems and writing code that is clean, efficient, and built to last. Eager to step into the professional world, contribute meaningfully from day one, and grow alongside a team that takes engineering seriously.",
  education: [
    {
      institution: "Army Institute of Technology, Pune",
      location: "",
      degree: "Bachelors of Technology in Computer Science and Engineering",
      duration: "2021 \u2013 2024",
      score: "Aggregate: 80.89% (Upto 5th Semester)",
    },
    {
      institution: "SJ Education Centre",
      location: "",
      degree: "Senior Secondary Education",
      duration: "2019 \u2013 2021",
      score: "Class 12: 77.75% | Class 10: 82.6%",
    },
  ],
  skills: {
    languages: "C++, Python, Java",
    webTech: "HTML, CSS, JavaScript, React.js, Node.js",
    tools: "Git, GitHub",
    databases: "MongoDB, MySQL",
    other: "Data Structures & Algorithms (DSA), Exploring Cloud Fundamentals",
  },
  projects: [
    {
      title: "Ried \u2013 Vehicle Booking Platform",
      link: "Link",
      duration: "March 2026 \u2013 Present",
      techStack: "Next.js, MongoDB, ZEGOCLOUD, REST API, WebSockets",
      bullets: [
        "Built a full-stack vehicle booking platform using Next.js and MongoDB, supporting 3 user roles \u2014 rider, driver, and admin \u2014 with seamless role-based access control.",
        "Integrated ZEGOCLOUD SDK for real-time video KYC, reducing driver onboarding verification time by 60% with low-latency audio/video signaling.",
        "Implemented booking lifecycle management via REST APIs and WebSockets, handling real-time ride tracking across concurrent sessions with sub-300ms response time.",
      ],
    },
    {
      title: "Host \u2013 House Price Predictor",
      link: "Link",
      duration: "November 2025 \u2013 February 2026",
      techStack: "Python, Scikit-learn, FastAPI, React.js, PostgreSQL, Socket.IO, Docker",
      bullets: [
        "Built ML-powered real estate platform using Python and Scikit-learn delivering accurate house price predictions with 85% model accuracy.",
        "Developed FastAPI backend with sub-200ms response and React.js dashboard displaying real-time property listings via PostgreSQL.",
        "Enabled real-time buyer-agent chat via Socket.IO and containerized application using Docker for scalable deployment.",
      ],
    },
  ],
  achievements: [
    "HTML, CSS \u2014 2024",
    "Python Part 1 & 2 Certificate \u2014 2024",
    "Participated in Flipkart GRiD 6.0 - Software Development Track, and TVS E.P.I.C 7.0. \u2014 2025",
    "Python for Data Science Certificate \u2014 2024",
    "JavaScript Certificate \u2014 2025",
  ],
};

const ResumeBuilderPage = () => {
  const [data, setData] = useState<ResumeData>(defaultData);
  
  const handleChange = (field: keyof ResumeData, value: string) => {
    setData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSkillChange = (field: keyof ResumeData["skills"], value: string) => {
    setData((prev) => ({ ...prev, skills: { ...prev.skills, [field]: value } }));
  };

  const handleEducationChange = (index: number, field: keyof ResumeData["education"][0], value: string) => {
    const newEdu = [...data.education];
    newEdu[index] = { ...newEdu[index], [field]: value };
    setData((prev) => ({ ...prev, education: newEdu }));
  };

  const handleProjectChange = (index: number, field: keyof ResumeData["projects"][0], value: string | string[]) => {
    const newProj = [...data.projects];
    newProj[index] = { ...newProj[index], [field]: value };
    setData((prev) => ({ ...prev, projects: newProj }));
  };

  const [isEditing, setIsEditing] = useState(false);

  const handlePrint = () => {
    window.print();
  };

  const SectionHeading = ({ title }: { title: string }) => (
    <div className="mb-2 mt-4">
      <h2 className="text-[#3b7197] font-semibold text-lg tracking-widest uppercase" style={{ fontVariant: 'small-caps' }}>
        {title}
      </h2>
      <div className="h-[1px] w-full bg-[#3b7197]/40 mt-0.5"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0a0a0a] pt-24 pb-12 print:p-0 print:bg-white overflow-hidden">
      <Navbar />

      {/* Builder Header - Hidden on Print */}
      <div className="max-w-7xl mx-auto px-6 mb-8 print:hidden flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-machina-bold text-white flex items-center gap-3">
            <FileText className="text-[#f97316]" /> LaTeX Resume Generator
          </h1>
          <p className="text-white/60 mt-1">
            Generate a clean, professional, ATS-friendly resume.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-colors"
          >
            {isEditing ? <Check size={18} /> : <Edit2 size={18} />}
            {isEditing ? "View Preview" : "Edit Details"}
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#f97316] text-white font-medium hover:bg-[#ea580c] transition-colors shadow-[0_0_20px_rgba(249,115,22,0.3)]"
          >
            <Download size={18} />
            Download PDF
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 flex justify-center print:block print:p-0">
        
        {/* Editor Pane (Only visible when editing) */}
        {isEditing && (
          <div className="hidden lg:block w-1/3 bg-white/5 border border-white/10 rounded-2xl p-6 mr-6 overflow-y-auto max-h-[80vh] custom-scrollbar print:hidden">
            <h3 className="text-xl font-machina-bold text-white mb-4">Edit Info</h3>
            <p className="text-sm text-white/50 mb-6">Update the fields below to customize your resume. Features coming soon!</p>
            <div className="flex flex-col gap-6">
              
              {/* Personal Info */}
              <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                <h4 className="text-white font-bold mb-3 border-b border-white/10 pb-2">Personal Info</h4>
                <div className="flex flex-col gap-3">
                  <input type="text" value={data.name} onChange={(e) => handleChange("name", e.target.value)} placeholder="Full Name" className="bg-[#0a0a0a] text-white p-2 rounded-lg border border-white/10 text-sm focus:border-[#f97316] outline-none" />
                  <div className="grid grid-cols-2 gap-3">
                    <input type="text" value={data.phone} onChange={(e) => handleChange("phone", e.target.value)} placeholder="Phone" className="bg-[#0a0a0a] text-white p-2 rounded-lg border border-white/10 text-sm focus:border-[#f97316] outline-none" />
                    <input type="text" value={data.email} onChange={(e) => handleChange("email", e.target.value)} placeholder="Email" className="bg-[#0a0a0a] text-white p-2 rounded-lg border border-white/10 text-sm focus:border-[#f97316] outline-none" />
                    <input type="text" value={data.linkedin} onChange={(e) => handleChange("linkedin", e.target.value)} placeholder="LinkedIn" className="bg-[#0a0a0a] text-white p-2 rounded-lg border border-white/10 text-sm focus:border-[#f97316] outline-none" />
                    <input type="text" value={data.website} onChange={(e) => handleChange("website", e.target.value)} placeholder="Website" className="bg-[#0a0a0a] text-white p-2 rounded-lg border border-white/10 text-sm focus:border-[#f97316] outline-none" />
                  </div>
                  <textarea value={data.objective} onChange={(e) => handleChange("objective", e.target.value)} placeholder="Career Objective" rows={4} className="bg-[#0a0a0a] text-white p-2 rounded-lg border border-white/10 text-sm focus:border-[#f97316] outline-none resize-none" />
                </div>
              </div>

              {/* Education */}
              <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                <h4 className="text-white font-bold mb-3 border-b border-white/10 pb-2">Education</h4>
                {data.education.map((edu, idx) => (
                  <div key={idx} className="flex flex-col gap-2 mb-4 pb-4 border-b border-white/5 last:border-0 last:mb-0 last:pb-0">
                    <input type="text" value={edu.institution} onChange={(e) => handleEducationChange(idx, "institution", e.target.value)} placeholder="Institution" className="bg-[#0a0a0a] text-white p-2 rounded-lg border border-white/10 text-sm" />
                    <input type="text" value={edu.degree} onChange={(e) => handleEducationChange(idx, "degree", e.target.value)} placeholder="Degree" className="bg-[#0a0a0a] text-white p-2 rounded-lg border border-white/10 text-sm" />
                    <div className="grid grid-cols-2 gap-2">
                      <input type="text" value={edu.duration} onChange={(e) => handleEducationChange(idx, "duration", e.target.value)} placeholder="Duration" className="bg-[#0a0a0a] text-white p-2 rounded-lg border border-white/10 text-sm" />
                      <input type="text" value={edu.score} onChange={(e) => handleEducationChange(idx, "score", e.target.value)} placeholder="Score" className="bg-[#0a0a0a] text-white p-2 rounded-lg border border-white/10 text-sm" />
                    </div>
                  </div>
                ))}
              </div>

              {/* Skills */}
              <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                <h4 className="text-white font-bold mb-3 border-b border-white/10 pb-2">Technical Skills</h4>
                <div className="flex flex-col gap-2">
                  <input type="text" value={data.skills.languages} onChange={(e) => handleSkillChange("languages", e.target.value)} placeholder="Languages" className="bg-[#0a0a0a] text-white p-2 rounded-lg border border-white/10 text-sm" />
                  <input type="text" value={data.skills.webTech} onChange={(e) => handleSkillChange("webTech", e.target.value)} placeholder="Web Tech" className="bg-[#0a0a0a] text-white p-2 rounded-lg border border-white/10 text-sm" />
                  <input type="text" value={data.skills.tools} onChange={(e) => handleSkillChange("tools", e.target.value)} placeholder="Tools" className="bg-[#0a0a0a] text-white p-2 rounded-lg border border-white/10 text-sm" />
                  <input type="text" value={data.skills.databases} onChange={(e) => handleSkillChange("databases", e.target.value)} placeholder="Databases" className="bg-[#0a0a0a] text-white p-2 rounded-lg border border-white/10 text-sm" />
                  <input type="text" value={data.skills.other} onChange={(e) => handleSkillChange("other", e.target.value)} placeholder="Other" className="bg-[#0a0a0a] text-white p-2 rounded-lg border border-white/10 text-sm" />
                </div>
              </div>

              {/* Projects */}
              <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                <h4 className="text-white font-bold mb-3 border-b border-white/10 pb-2">Projects</h4>
                {data.projects.map((proj, idx) => (
                  <div key={idx} className="flex flex-col gap-2 mb-4 pb-4 border-b border-white/5 last:border-0 last:mb-0 last:pb-0">
                    <input type="text" value={proj.title} onChange={(e) => handleProjectChange(idx, "title", e.target.value)} placeholder="Project Title" className="bg-[#0a0a0a] text-white p-2 rounded-lg border border-white/10 text-sm" />
                    <input type="text" value={proj.techStack} onChange={(e) => handleProjectChange(idx, "techStack", e.target.value)} placeholder="Tech Stack" className="bg-[#0a0a0a] text-white p-2 rounded-lg border border-white/10 text-sm" />
                    <div className="grid grid-cols-2 gap-2">
                      <input type="text" value={proj.duration} onChange={(e) => handleProjectChange(idx, "duration", e.target.value)} placeholder="Duration" className="bg-[#0a0a0a] text-white p-2 rounded-lg border border-white/10 text-sm" />
                      <input type="text" value={proj.link} onChange={(e) => handleProjectChange(idx, "link", e.target.value)} placeholder="Link" className="bg-[#0a0a0a] text-white p-2 rounded-lg border border-white/10 text-sm" />
                    </div>
                    <textarea value={proj.bullets.join("\n")} onChange={(e) => handleProjectChange(idx, "bullets", e.target.value.split("\n"))} placeholder="Bullets (one per line)" rows={4} className="bg-[#0a0a0a] text-white p-2 rounded-lg border border-white/10 text-sm resize-none" />
                  </div>
                ))}
              </div>

              {/* Achievements */}
              <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                <h4 className="text-white font-bold mb-3 border-b border-white/10 pb-2">Achievements</h4>
                <textarea 
                  value={data.achievements.join("\n")} 
                  onChange={(e) => setData(prev => ({...prev, achievements: e.target.value.split("\n")}))} 
                  placeholder="Achievements (one per line)" 
                  rows={5} 
                  className="w-full bg-[#0a0a0a] text-white p-2 rounded-lg border border-white/10 text-sm resize-none" 
                />
              </div>

            </div>
          </div>
        )}

        {/* Resume Preview - The actual LaTeX style document */}
        <div className={`
          bg-white text-black 
          w-[210mm] min-h-[297mm] 
          shadow-2xl print:shadow-none 
          p-[12mm] sm:p-[15mm] md:p-[20mm] print:p-[10mm] 
          shrink-0 font-serif
          transform origin-top
          scale-[0.6] sm:scale-[0.8] lg:scale-100
          transition-transform duration-300
        `}>
          <style>
            {`
              @media print {
                @page { margin: 0; size: A4; }
                body { margin: 1cm; background: white; }
                .print\\:hidden { display: none !important; }
                .print\\:shadow-none { box-shadow: none !important; }
                .print\\:p-0 { padding: 0 !important; }
                .print\\:bg-white { background-color: white !important; }
                /* Reset scale for printing */
                .scale-\\[0\\.6\\], .sm\\:scale-\\[0\\.8\\], .lg\\:scale-100 { transform: scale(1) !important; width: 100% !important; }
              }
            `}
          </style>

          {/* Header */}
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold tracking-wider mb-2 uppercase" style={{ fontVariant: 'small-caps' }}>
              {data.name}
            </h1>
            <div className="text-[10pt] text-gray-800 flex flex-wrap justify-center items-center gap-1.5">
              <span>{data.phone}</span>
              <span className="text-gray-400">|</span>
              <a href={`mailto:${data.email}`} className="hover:underline">{data.email}</a>
              <span className="text-gray-400">|</span>
              <a href={`https://${data.linkedin}`} className="hover:underline">{data.linkedin}</a>
              <span className="text-gray-400">|</span>
              <a href={`https://${data.website}`} className="hover:underline">{data.website}</a>
            </div>
          </div>

          {/* Career Objective */}
          <SectionHeading title="Career Objectives" />
          <p className="text-[10.5pt] leading-[1.4] text-justify mb-4">
            {data.objective}
          </p>

          {/* Education */}
          <SectionHeading title="Education" />
          <div className="flex flex-col gap-3 mb-4">
            {data.education.map((edu, idx) => (
              <div key={idx} className="flex justify-between text-[10.5pt] leading-[1.3]">
                <div>
                  <div className="font-bold">{edu.institution}</div>
                  <div className="italic text-gray-800">{edu.degree}</div>
                </div>
                <div className="text-right">
                  <div className="font-bold">{edu.duration}</div>
                  <div className="italic text-gray-800">{edu.score}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Technical Skills */}
          <SectionHeading title="Technical Skills" />
          <div className="text-[10.5pt] leading-[1.5] mb-4">
            <div><span className="font-bold">Programming Languages:</span> {data.skills.languages}</div>
            <div><span className="font-bold">Web Technologies:</span> {data.skills.webTech}</div>
            <div><span className="font-bold">Tools:</span> {data.skills.tools}</div>
            <div><span className="font-bold">Databases:</span> {data.skills.databases}</div>
            <div><span className="font-bold">Other:</span> {data.skills.other}</div>
          </div>

          {/* Projects */}
          <SectionHeading title="Projects" />
          <div className="flex flex-col gap-4 mb-4">
            {data.projects.map((proj, idx) => (
              <div key={idx} className="text-[10.5pt]">
                <div className="flex justify-between items-baseline mb-1">
                  <div>
                    <span className="font-bold">{proj.title}</span>
                    <a href="#" className="ml-2 text-blue-600 hover:underline text-[9pt]">{proj.link}</a>
                  </div>
                  <div className="font-bold">{proj.duration}</div>
                </div>
                <div className="italic text-gray-800 mb-1">{`Tech Stack: ${proj.techStack}`}</div>
                <ul className="list-none pl-1 leading-[1.4]">
                  {proj.bullets.map((bullet, bIdx) => (
                    <li key={bIdx} className="mb-0.5 text-justify flex gap-2">
                      <span className="font-sans text-gray-800">–</span>
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Achievements */}
          <SectionHeading title="Achievements and Certifications" />
          <ul className="text-[10.5pt] leading-[1.5] list-disc pl-5">
            {data.achievements.map((ach, idx) => {
              // Highlight part before mdash
              const parts = ach.split("—");
              return (
                <li key={idx} className="pl-1 marker:text-black marker:text-[10pt]">
                  {parts.length > 1 ? (
                    <>
                      <span className="font-bold">{parts[0].trim()}</span> — {parts[1].trim()}
                    </>
                  ) : (
                    ach
                  )}
                </li>
              );
            })}
          </ul>

        </div>
      </div>
    </div>
  );
};

export default ResumeBuilderPage;
