import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import { useAuthStore } from "@/store/useAuthStore";
import type { AuthState, User } from "@/types/Auth.types";

vi.mock("@/store/useAuthStore", () => ({
  useAuthStore: vi.fn(),
}));

const mockedUseAuthStore = vi.mocked(useAuthStore);

const createMockAuthStore = (overrides: Partial<AuthState> = {}) => {
  const defaultUser: User = {
    id: 1,
    professorId: 101,
    firstName: "Test",
    lastName: "User",
    role: "ADMIN",
  };

  return {
    token: "fake-token",
    userData: defaultUser,
    isAuthenticated: true,
    setAuth: vi.fn(),
    logout: vi.fn(),
    ...overrides,
  };
};

describe("ProtectedRoute", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should redirect to /login if users is not authenticated", () => {
    mockedUseAuthStore.mockReturnValue(
      createMockAuthStore({
        isAuthenticated: false,
        userData: null,
        token: null,
      }),
    );

    render(
      <MemoryRouter initialEntries={["/admin"]}>
        <Routes>
          <Route element={<ProtectedRoute allowedRoles={["ADMIN"]} />}>
            <Route path="/admin" element={<div>Admin Content</div>} />
          </Route>
          <Route path="/login" element={<div>Login Page</div>} />
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByText("Login Page")).toBeInTheDocument();
    expect(screen.queryByText("Admin Content")).not.toBeInTheDocument();
  });

  it("should redirect to home (/) if user has an unauthorized role", () => {
    mockedUseAuthStore.mockReturnValue(
      createMockAuthStore({
        isAuthenticated: true,
        userData: {
          id: 2,
          professorId: 102,
          firstName: "Profe",
          lastName: "Sor",
          role: "PROFESSOR",
        },
      }),
    );

    render(
      <MemoryRouter initialEntries={["/admin"]}>
        <Routes>
          <Route element={<ProtectedRoute allowedRoles={["ADMIN"]} />}>
            <Route path="/admin" element={<div>Admin Content</div>} />
          </Route>
          <Route path="/" element={<div>Home Page</div>} />
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByText("Home Page")).toBeInTheDocument();
    expect(screen.queryByText("Admin Content")).not.toBeInTheDocument();
  });

  it("should allow access if user is authenticated and has the correct role", () => {
    mockedUseAuthStore.mockReturnValue(
      createMockAuthStore({
        isAuthenticated: true,
        userData: {
          id: 1,
          professorId: 101,
          firstName: "Admin",
          lastName: "User",
          role: "ADMIN",
        },
      }),
    );

    render(
      <MemoryRouter initialEntries={["/admin"]}>
        <Routes>
          <Route element={<ProtectedRoute allowedRoles={["ADMIN"]} />}>
            <Route path="/admin" element={<div>Admin Content</div>} />
          </Route>
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByText("Admin Content")).toBeInTheDocument();
  });
});
