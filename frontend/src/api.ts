import axios from "axios";

// Determine environment (Vite sets MODE to 'development' or 'production')
const isProd = import.meta.env.MODE === "production";

// Prefer explicit env variables for each environment, then generic, then fallback
const baseURL =
  (isProd
    ? import.meta.env.VITE_API_BASE_URL_PROD
    : import.meta.env.VITE_API_BASE_URL_DEV) ||
  import.meta.env.VITE_API_BASE_URL ||
  (isProd
    ? "https://meshspire-core-prod.onrender.com/api/v0"
    : "http://localhost:8000/api/v0");

const API = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }

  return config;
});

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

export default API;
