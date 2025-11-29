import axios from "axios";

// Hardcoded backend URLs for dev and prod
const isProd = import.meta.env.MODE === "production";
const baseURL = isProd
  ? "https://meshspire-core-prod.onrender.com/api/v0" // prod backend
  : "https://meshspire-core-vjqd.onrender.com/api/v0"; // dev backend

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
