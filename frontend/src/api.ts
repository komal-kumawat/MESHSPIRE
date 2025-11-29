import axios from "axios";

// Use environment variable or fallback to localhost for development
const baseURL =
  import.meta.env.VITE_API_BASE_URL ||
  "https://meshspire-core-prod.onrender.com/api/v0";

const API = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

console.log("🌐 API Configuration:");
console.log("   Mode:", import.meta.env.MODE);
console.log("   VITE_API_BASE_URL:", import.meta.env.VITE_API_BASE_URL);
console.log("   Base URL:", baseURL);

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }
  console.log(`📤 API Request: ${config.method?.toUpperCase()} ${config.url}`);
  return config;
});

API.interceptors.response.use(
  (response) => {
    console.log(
      `✅ API Response: ${response.config.method?.toUpperCase()} ${
        response.config.url
      } - Status: ${response.status}`
    );
    return response;
  },
  (error) => {
    console.error(
      `❌ API Error: ${error.config?.method?.toUpperCase()} ${
        error.config?.url
      }`,
      error.response?.data || error.message
    );
    return Promise.reject(error);
  }
);

// Lesson API functions
export const createLesson = async (lessonData: {
  topic: string;
  subTopic?: string;
  subject: string;
  class: string;
  date: string;
  time: string;
}) => {
  const response = await API.post("/lesson/create", lessonData);
  return response.data;
};

export const getMyLessons = async () => {
  const response = await API.get("/lesson/my-lessons");
  return response.data;
};

export const getRelevantLessons = async () => {
  const response = await API.get("/lesson/relevant-lessons");
  return response.data;
};

export const confirmLesson = async (lessonId: string) => {
  const response = await API.post(`/lesson/confirm/${lessonId}`);
  return response.data;
};

export const cancelLesson = async (lessonId: string) => {
  const response = await API.post(`/lesson/cancel/${lessonId}`);
  return response.data;
};

export default API;
