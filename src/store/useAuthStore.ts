import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { AuthState, User } from "@/types/Auth.types";

interface AuthActions {
  setAuth: (token: string, userData: User) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState & AuthActions>()(
  persist(
    (set) => ({
      token: null,
      userData: null,
      isAuthenticated: false,

      setAuth: (token, userData) =>
        set({ token, userData, isAuthenticated: !!token }),

      logout: () =>
        set({ token: null, userData: null, isAuthenticated: false }),
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => sessionStorage),
    },
  ),
);
