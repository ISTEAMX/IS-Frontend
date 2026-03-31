import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { AuthState, User } from "@/types/Auth.types";

interface AuthActions {
  setAuth: (token: string, user?: User | null) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState & AuthActions>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      setAuth: (token, user = null) =>
        set({ user: user || null, token, isAuthenticated: !!token }),

      logout: () => set({ user: null, token: null, isAuthenticated: false }),
    }),
    {
      name: "auth-storage",
    },
  ),
);
