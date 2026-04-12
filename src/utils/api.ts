import axios from "axios";

// Helper to encode strings to Base64 (works in Browser and Node)
const encodeBase64 = (str: string) => btoa(unescape(encodeURIComponent(str)));

export const executeCode = async (sourceCode: string, languageId: number) => {
  const options = {
    method: "POST",
    url: "https://judge0-ce.p.rapidapi.com/submissions",
    params: {
      wait: "true",
      fields: "*",
    },
    headers: {
      "content-type": "application/json",
      "Content-Type": "application/json",
      "x-rapidapi-key": "d8673e843bmsh30031b4c5a5470bp18e127jsn795ca12d35fe", // Ensure this is valid
      "x-rapidapi-host": "judge0-ce.p.rapidapi.com",
    },
    data: {
      // Use base64 if your API setup requires it,
      // otherwise send raw source_code but ensure it's not empty
      source_code: sourceCode,
      language_id: 63, // ⚠️ MUST be an integer (e.g., 63)
      stdin: "",
    },
  };

  try {
    const response = await axios.request(options);
    console.log(response.data);
    return response.data;
  } catch (error: any) {
    // This will help you see EXACTLY why it failed (check error.response.data)
    console.error("Judge0 Detailed Error:", error.response?.data);
    throw error;
  }
};

// const BASE_URL = "http://16.171.200.75/v1";

// export const quizApi = {
//   // From quizController (generation)
//   generate: (data: { topic: string; difficulty: string }) => {
//     console.log(
//       `Generating quiz with topic: ${data.topic}, difficulty: ${data.difficulty}`,
//     );
//     return axios.post(`${BASE_URL}/generate`, data);
//   },

//   getStatus: (jobId: string) => {
//     console.log(`Getting status for job: ${jobId}`);
//     return axios.get(`${BASE_URL}/status/${jobId}`);
//   },

//   // From getQuizController (Interaction)
//   getQuiz: (quizId: string) => {
//     console.log(`Getting quiz with id: ${quizId}`);
//     return axios.get(`${BASE_URL}/${quizId}`);
//   },

//   submit: (quizId: string, answers: any) => {
//     console.log(`Submitting answers for quiz: ${quizId}`);
//     return axios.post(`${BASE_URL}/submit`, { quizId, answers });
//   },

//   getReview: (attemptId: string) => {
//     console.log(`Getting review for attempt: ${attemptId}`);
//     return axios.get(`${BASE_URL}/review/${attemptId}`);
//   },
// };

// import axios from "axios";

// const BASE_URL = "http://16.171.200.75/v1";

// export const api = axios.create({
//   baseURL: BASE_URL,
//   headers: {
//     "Content-Type": "application/json",
//   },
//   withCredentials: true, // Required for cookies/refresh tokens
// });

export const api = axios.create({
  baseURL: "http://16.171.200.75/v1",
  withCredentials: true,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);
