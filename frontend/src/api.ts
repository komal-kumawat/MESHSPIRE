import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api/v0",
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
