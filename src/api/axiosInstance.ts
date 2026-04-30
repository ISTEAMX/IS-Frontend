import { useAuthStore } from "@/store/useAuthStore";
import { reportError } from "@/services/errorReportService";
import axios, { type InternalAxiosRequestConfig } from "axios";

export interface CustomConfig extends InternalAxiosRequestConfig {
  noAuth?: boolean;
}

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL
    ? `${import.meta.env.VITE_API_URL}/api`
    : "/api",
  timeout: 15000,
});

api.interceptors.request.use((config: CustomConfig) => {
  if (config.noAuth) {
    return config;
  }

  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().logout();

      if (!window.location.pathname.includes("/login")) {
        window.location.href = "/login";
      }
    } else {
      reportError(error, `api:${error.config?.method?.toUpperCase()} ${error.config?.url}`);
    }

    return Promise.reject(error);
  },
);

export default api;
