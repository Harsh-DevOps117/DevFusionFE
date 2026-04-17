// src/services/apiClient.ts
import axios from "axios";

//const BASE_URL = "https://prepgird.in/v1";
const BASE_URL="http://localhost:3005/v1"

// 1. Create the central instance (Removed the hardcoded Content-Type here)
export const apiClient = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

// 2. Request Interceptor: Attach token and handle Content-Type dynamically
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // ✅ NEW: Automatically handle FormData (File Uploads) vs JSON
    if (config.data instanceof FormData) {
      // Let the browser automatically set 'multipart/form-data' with the correct boundary
      delete config.headers["Content-Type"];
    } else {
      config.headers["Content-Type"] = "application/json";
    }

    return config;
  },
  (error) => Promise.reject(error),
);

// 3. Response Interceptor: Handle Token Refreshing
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshResponse = await axios.get(`${BASE_URL}/refresh`, {
          withCredentials: true,
        });

        const newAccessToken = refreshResponse.data.accessToken;
        localStorage.setItem("accessToken", newAccessToken);
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        return apiClient(originalRequest);
      } catch (refreshError) {
        console.error("Session expired. Please log in again.");
        localStorage.removeItem("accessToken");
        localStorage.removeItem("user"); // Clear user too just in case
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);
