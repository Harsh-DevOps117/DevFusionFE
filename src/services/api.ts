// src/services/api.ts
import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:3007/v1",
  withCredentials: true,
});

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

export default API;
