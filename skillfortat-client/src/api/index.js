import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const readToken = () => {
  if (typeof localStorage === "undefined") {
    return null;
  }

  try {
    const raw = localStorage.getItem("skillfortat-auth");
    if (!raw) {
      return null;
    }

    const parsed = JSON.parse(raw);
    return parsed?.state?.token || null;
  } catch {
    return null;
  }
};

const api = axios.create({
  baseURL: API_BASE_URL,
});

api.interceptors.request.use((config) => {
  const token = readToken();

  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export const getApiErrorMessage = (error) =>
  error?.response?.data?.message ||
  error?.response?.data?.errors?.[0]?.msg ||
  error.message ||
  "Request failed";

export default api;
