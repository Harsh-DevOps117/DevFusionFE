// src/services/api.ts
import axios from "axios";

const API = axios.create({
  baseURL: "http://16.171.200.75/v1",
  withCredentials: true,
});

// ✅ REQUEST INTERCEPTOR (attach token)
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token"); // or "accessToken"

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

// ❌ OPTIONAL: RESPONSE INTERCEPTOR (handle 401)
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.error("Unauthorized! Redirecting...");
      // optional redirect
      window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);

// APIs
export const getProblems = () => API.get("/problem/get-all-problems");

export const getProblemById = (id: string) =>
  API.get(`/problem/get-problem/${id}`);

export const getSolvedProblems = () => API.get("/problem/get-solved-problems");

export const executeCode = (data: any) => API.post("/execute-code", data);

export const getSubmissions = () => API.get("/get-all-submission");

export const getSubmissionByProblem = (problemId: string) =>
  API.get(`/get-submission/${problemId}`);

export const getAllPlaylists = () => API.get("/playlist/all");

export const getPlaylist = (id: string) => API.get(`/playlist/${id}`);

export const createPlaylist = (data: any) =>
  API.post("/playlist/create-playlist", data);

export const addProblemToPlaylist = (id: string, problemIds: string[]) =>
  API.post(`/playlist/${id}/add-problem`, { problemIds });

export const removeProblemFromPlaylist = (id: string, problemIds: string[]) =>
  API.delete(`/playlist/${id}/remove-problem`, {
    data: { problemIds },
  });

export const deletePlaylist = (id: string) => API.delete(`/playlist/${id}`);

export const createProblem = (data: any) =>
  API.post(`/problem/create-problem`, data);

export const getAdminStats = () => API.get("/stats");

export default API;
