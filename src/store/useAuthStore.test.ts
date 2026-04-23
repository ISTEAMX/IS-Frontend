import { describe, it, expect, beforeEach } from "vitest";
import { useAuthStore } from "./useAuthStore";
import type { User } from "@/types/Auth.types";

describe("useAuthStore", () => {
  beforeEach(() => {
    useAuthStore.setState({
      token: null,
      userData: null,
      isAuthenticated: false,
    });
  });

  describe("setAuth", () => {
    it("should set token and userData when authenticated", () => {
      const token = "test-token-123";
      const userData: User = {
        id: 1,
        professorId: 1,
        firstName: "John",
        lastName: "Doe",
        role: "PROFESSOR",
      };

      useAuthStore.getState().setAuth(token, userData);

      const state = useAuthStore.getState();
      expect(state.token).toBe(token);
      expect(state.userData).toEqual(userData);
      expect(state.isAuthenticated).toBe(true);
    });

    it("should not authenticate with empty token", () => {
      const userData: User = {
        id: 1,
        professorId: 1,
        firstName: "John",
        lastName: "Doe",
        role: "PROFESSOR",
      };

      useAuthStore.getState().setAuth("", userData);

      expect(useAuthStore.getState().isAuthenticated).toBe(false);
    });

    it("should handle different user roles", () => {
      const adminUser: User = {
        id: 2,
        professorId: 0,
        firstName: "Admin",
        lastName: "User",
        role: "ADMIN",
      };

      useAuthStore.getState().setAuth("admin-token", adminUser);

      expect(useAuthStore.getState().userData?.role).toBe("ADMIN");
      expect(useAuthStore.getState().isAuthenticated).toBe(true);
    });
  });

  describe("logout", () => {
    it("should clear all auth data", () => {
      const userData: User = {
        id: 1,
        professorId: 1,
        firstName: "John",
        lastName: "Doe",
        role: "PROFESSOR",
      };

      useAuthStore.getState().setAuth("token123", userData);
      useAuthStore.getState().logout();

      const state = useAuthStore.getState();
      expect(state.token).toBeNull();
      expect(state.userData).toBeNull();
      expect(state.isAuthenticated).toBe(false);
    });
  });

  describe("auth flow", () => {
    it("should complete full login-logout flow", () => {
      const user: User = {
        id: 1,
        professorId: 1,
        firstName: "John",
        lastName: "Doe",
        role: "PROFESSOR",
      };

      expect(useAuthStore.getState().isAuthenticated).toBe(false);

      useAuthStore.getState().setAuth("login-token", user);
      expect(useAuthStore.getState().isAuthenticated).toBe(true);

      useAuthStore.getState().logout();
      expect(useAuthStore.getState().isAuthenticated).toBe(false);
    });

    it("should handle switching between users", () => {
      const user1: User = {
        id: 1,
        professorId: 1,
        firstName: "John",
        lastName: "Doe",
        role: "PROFESSOR",
      };

      const user2: User = {
        id: 2,
        professorId: 0,
        firstName: "Admin",
        lastName: "User",
        role: "ADMIN",
      };

      useAuthStore.getState().setAuth("token1", user1);
      expect(useAuthStore.getState().userData?.id).toBe(1);

      useAuthStore.getState().setAuth("token2", user2);
      expect(useAuthStore.getState().userData?.id).toBe(2);
    });
  });
});
