import { describe, it, expect, vi, beforeEach } from "vitest";
import { authService } from "./authService";
import api from "@/api/axiosInstance";

vi.mock("@/api/axiosInstance");

describe("authService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("login", () => {
    it("should send login request with credentials", async () => {
      const mockResponse = {
        data: {
          token: "test-token",
          user: { id: 1, email: "test@example.com" },
        },
      };
      vi.mocked(api.post).mockResolvedValue(mockResponse);

      const credentials = {
        email: "test@example.com",
        password: "password123",
      };
      const result = await authService.login(credentials);

      expect(api.post).toHaveBeenCalledWith("/user/login", credentials, {
        noAuth: true,
      });
      expect(result).toEqual(mockResponse.data);
    });

    it("should handle login error", async () => {
      const error = new Error("Invalid credentials");
      vi.mocked(api.post).mockRejectedValue(error);

      await expect(
        authService.login({ email: "test@example.com", password: "wrong" }),
      ).rejects.toThrow("Invalid credentials");
    });
  });

  describe("register", () => {
    it("should register professor with department", async () => {
      vi.mocked(api.post).mockResolvedValue({ data: { success: true } });

      const registerDTO = {
        email: "professor@example.com",
        password: "securePass123",
        firstName: "Ion",
        lastName: "Popescu",
        role: "PROFESSOR",
        professor: {
          department: "Computer Science",
        },
      } as const;

      await authService.register(registerDTO);

      expect(api.post).toHaveBeenCalledWith("/user/register", registerDTO);
    });

    it("should register admin with department field", async () => {
      vi.mocked(api.post).mockResolvedValue({ data: { success: true } });

      const registerDTO = {
        email: "admin@example.com",
        password: "adminSecurePass123",
        firstName: "Admin",
        lastName: "User",
        role: "ADMIN",
        professor: {
          department: "Administration",
        },
      } as const;

      await authService.register(registerDTO);

      expect(api.post).toHaveBeenCalledWith("/user/register", registerDTO);
    });

    it("should handle duplicate email error", async () => {
      const error = new Error("Email already exists");
      vi.mocked(api.post).mockRejectedValue(error);

      const registerDTO = {
        email: "existing@example.com",
        password: "securePass123",
        firstName: "John",
        lastName: "Doe",
        role: "PROFESSOR",
        professor: {
          department: "Engineering",
        },
      } as const;

      await expect(authService.register(registerDTO)).rejects.toThrow(
        "Email already exists",
      );
    });

    it("should handle network error", async () => {
      const error = new Error("Network error");
      vi.mocked(api.post).mockRejectedValue(error);

      const registerDTO = {
        email: "user@example.com",
        password: "securePass123",
        firstName: "John",
        lastName: "Doe",
        role: "PROFESSOR",
        professor: {
          department: "Engineering",
        },
      } as const;

      await expect(authService.register(registerDTO)).rejects.toThrow(
        "Network error",
      );
    });
  });
});
