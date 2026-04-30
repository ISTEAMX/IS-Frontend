import { describe, it, expect, vi, beforeEach } from "vitest";
import { reportError } from "./errorReportService";
import api from "@/api/axiosInstance";

vi.mock("@/api/axiosInstance");

describe("errorReportService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    Object.defineProperty(window, "location", {
      value: { href: "http://localhost:3000/test" },
      writable: true,
    });
  });

  it("should report an Error object with message and stack", () => {
    vi.mocked(api.post).mockReturnValue(Promise.resolve({ data: {} }) as never);
    const error = new Error("Something went wrong");

    reportError(error, "test-source");

    expect(api.post).toHaveBeenCalledWith("/monitoring/error", {
      message: "Something went wrong",
      stack: expect.any(String),
      source: "test-source",
      url: "http://localhost:3000/test",
    });
  });

  it("should report a string error", () => {
    vi.mocked(api.post).mockReturnValue(Promise.resolve({ data: {} }) as never);

    reportError("string error", "test-source");

    expect(api.post).toHaveBeenCalledWith("/monitoring/error", {
      message: "string error",
      stack: "",
      source: "test-source",
      url: "http://localhost:3000/test",
    });
  });

  it("should use default source when not provided", () => {
    vi.mocked(api.post).mockReturnValue(Promise.resolve({ data: {} }) as never);

    reportError(new Error("test"));

    expect(api.post).toHaveBeenCalledWith("/monitoring/error", {
      message: "test",
      stack: expect.any(String),
      source: "unknown",
      url: "http://localhost:3000/test",
    });
  });

  it("should truncate stack trace to 2000 characters", () => {
    vi.mocked(api.post).mockReturnValue(Promise.resolve({ data: {} }) as never);
    const error = new Error("test");
    error.stack = "x".repeat(3000);

    reportError(error, "test-source");

    expect(api.post).toHaveBeenCalledWith("/monitoring/error", {
      message: "test",
      stack: "x".repeat(2000),
      source: "test-source",
      url: "http://localhost:3000/test",
    });
  });

  it("should not throw if api.post fails", () => {
    vi.mocked(api.post).mockReturnValue(Promise.reject(new Error("network")) as never);

    expect(() => reportError(new Error("test"), "test-source")).not.toThrow();
  });
});

