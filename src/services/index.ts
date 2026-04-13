// src/services/index.ts
import axios from "axios";
import { apiClient } from "./apiClient";

// --- AUTH APIS ---
export const AuthService = {
  login: (data: any) => apiClient.post("/login", data),
  signup: (data: any) => apiClient.post("/signup", data),
  forgotPassword: (data: { email: string }) =>
    apiClient.post("/forgot-password", data),
  resetPassword: (data: any) => apiClient.post("/reset-password", data),
  logout: () => {
    localStorage.removeItem("accessToken");
    return apiClient.post("/logout");
  },
};

// --- PROBLEM APIS ---
export const ProblemService = {
  getAll: () => apiClient.get("/problem/get-all-problems"),
  getById: (id: string) => apiClient.get(`/problem/get-problem/${id}`),
  getSolved: () => apiClient.get("/problem/get-solved-problems"),
  create: (data: any) => apiClient.post("/problem/create-problem", data),
};

// --- SUBMISSION APIS ---
export const SubmissionService = {
  getAll: () => apiClient.get("/get-all-submission"),
  getByProblem: (problemId: string) =>
    apiClient.get(`/get-submission/${problemId}`),
  // ✅ Executes code on YOUR backend (for grading/saving)
  execute: (data: any) => apiClient.post("/execute-code", data),
};

// --- PLAYLIST APIS ---
export const PlaylistService = {
  getAll: () => apiClient.get("/playlist/all"),
  getById: (id: string) => apiClient.get(`/playlist/${id}`),
  create: (data: any) => apiClient.post("/playlist/create-playlist", data),
  addProblem: (id: string, problemIds: string[]) =>
    apiClient.post(`/playlist/${id}/add-problem`, { problemIds }),
  removeProblem: (id: string, problemIds: string[]) =>
    apiClient.delete(`/playlist/${id}/remove-problem`, {
      data: { problemIds },
    }),
  delete: (id: string) => apiClient.delete(`/playlist/${id}`),
};

// --- ADMIN APIS ---
export const AdminService = {
  getStats: () => apiClient.get("/stats"),
};

// --- RESUME APIS ---
export const ResumeService = {
  analyze: (payload: any) => apiClient.post("/resume/analyze", payload),
  getStatus: (jobId: string) => apiClient.get(`/resume/status/${jobId}`),
};

// --- INTERVIEW APIS ---
export const InterviewService = {
  start: (data: { role: string }) => apiClient.post("/start", data),
  respond: (data: { interviewId: string; userInput: string }) =>
    apiClient.post("/respond", data),
};

// --- PAYMENT APIS ---
export const PaymentService = {
  createOrder: (amount: number) => apiClient.post("/create-order", { amount }),
  verifyPayment: (payload: any) => apiClient.post("/verify-payment", payload),
};

// --- USER & LEADERBOARD APIS ---
export const UserService = {
  getProfile: () => apiClient.get("/user/profile"),
};

export const LeaderboardService = {
  getLeaderboard: () => apiClient.get("/leader"),
};

// --- QUIZ APIS ---
export const QuizService = {
  generate: (data: { topic: string; difficulty: string }) =>
    apiClient.post("/generate", data),
  getStatus: (jobId: string) => apiClient.get(`/status/${jobId}`),
  getQuiz: (quizId: string) => apiClient.get(`/${quizId}`),
  submit: (data: { quizId: string; answers: any[] }) =>
    apiClient.post("/submit", data),
};

// --- EXTERNAL APIS (Sandbox Execution) ---
// This talks DIRECTLY to Judge0 (RapidAPI) bypassing your backend.
export const executeCodeDirect = async (
  sourceCode: string,
  languageId: number,
) => {
  return axios
    .post(
      "https://judge0-ce.p.rapidapi.com/submissions",
      {
        source_code: sourceCode,
        language_id: languageId,
        stdin: "",
      },
      {
        params: { wait: "true", fields: "*" },
        headers: {
          "Content-Type": "application/json",
          "x-rapidapi-key":
            "d8673e843bmsh30031b4c5a5470bp18e127jsn795ca12d35fe",
          "x-rapidapi-host": "judge0-ce.p.rapidapi.com",
        },
      },
    )
    .then((res) => res.data);
};
