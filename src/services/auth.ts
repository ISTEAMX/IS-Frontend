import type { AuthResponse } from "@/types/Auth.types";
import api from "../api/axiosInstance";

export const authService = {
  async login(credentials: {
    email: string;
    password: string;
  }): Promise<AuthResponse> {
    const { data } = await api.post<AuthResponse>("/user/login", credentials);
    return data;
  },

  async register(credentials: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
  }): Promise<void> {
    await api.post("/user/register", credentials);
  },
};
