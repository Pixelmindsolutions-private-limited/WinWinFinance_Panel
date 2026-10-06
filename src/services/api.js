import axios from "axios";
import { getAuth } from "./auth";

const api = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL || "http://localhost:5000/api",
  timeout: 30000
});

api.interceptors.request.use((config) => {
  const auth = getAuth();

  if (auth?.token) {
    config.headers.Authorization = `Bearer ${auth.token}`;
  }

  return config;
});

export default api;