import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock modules before import
vi.mock("@/store/useAuthStore", () => ({
  useAuthStore: {
    getState: vi.fn(() => ({
      token: "test-token",
      logout: vi.fn(),
    })),
  },
}));

vi.mock("@/services/errorReportService", () => ({
  reportError: vi.fn(),
}));

import api from "./axiosInstance";

describe("axiosInstance", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should create an axios instance", () => {
    expect(api).toBeDefined();
    expect(api.defaults.timeout).toBe(15000);
  });

  it("should have /api as base URL by default", () => {
    expect(api.defaults.baseURL).toContain("/api");
  });
});

