import type { AuthResponse, RegisterDTO } from "@/types/Auth.types";
import api, { type CustomConfig } from "../api/axiosInstance";

export const authService = {
  async login(credentials: {
    email: string;
    password: string;
  }): Promise<AuthResponse> {
    const { data } = await api.post<AuthResponse>("/user/login", credentials, {
      noAuth: true,
    } as CustomConfig);
    return data;
  },

  async register(credentials: RegisterDTO): Promise<void> {
    await api.post("/user/register", credentials);
  },
};
