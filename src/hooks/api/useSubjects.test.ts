import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import useSubjects from "./useSubjects";
import { subjectService } from "@/services/subjectService";
import toast from "react-hot-toast";
import type { Subject } from "@/types/Subject.types";
import type { AxiosError } from "axios";

vi.mock("@/services/subjectService", () => ({
  subjectService: {
    getAll: vi.fn(),
  },
}));

vi.mock("react-hot-toast", () => ({
  default: {
    error: vi.fn(),
  },
}));

describe("useSubjects", () => {
  const mockSubjects: Subject[] = [
    { id: 1, name: "Algorithms", activityType: "Curs" },
    { id: 2, name: "Database Design", activityType: "Seminar" },
    { id: 3, name: "Web Development", activityType: "Laborator" },
    { id: 4, name: "Algorithms", activityType: "Seminar" },
  ];

  const mockedSubjectService = vi.mocked(subjectService);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe("initial state", () => {
    it("should start with loading state", () => {
      mockedSubjectService.getAll.mockImplementation(
        () => new Promise<Subject[]>(() => {}),
      );

      const { result } = renderHook(() => useSubjects());

      expect(result.current.isLoading).toBe(true);
      expect(result.current.subjects).toEqual([]);
      expect(result.current.error).toBeNull();
    });
  });

  describe("successful fetch", () => {
    it("should fetch and return subjects sorted by name and activityType by default", async () => {
      mockedSubjectService.getAll.mockResolvedValue(mockSubjects);

      const { result } = renderHook(() => useSubjects("asc"));

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.subjects).toHaveLength(4);

      expect(result.current.subjects[0].name).toBe("Algorithms");
      expect(result.current.subjects[0].activityType).toBe("Curs");
      expect(result.current.subjects[1].name).toBe("Algorithms");
      expect(result.current.subjects[1].activityType).toBe("Seminar");
    });

    it("should sort subjects descending when sortOrder is 'desc'", async () => {
      mockedSubjectService.getAll.mockResolvedValue(mockSubjects);

      const { result } = renderHook(() => useSubjects("desc"));

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.subjects[0].name).toBe("Web Development");
      expect(result.current.subjects[1].name).toBe("Database Design");
    });

    it("should handle case-insensitive sorting", async () => {
      const mixedCase: Subject[] = [
        { id: 1, name: "ajax", activityType: "Curs" },
        { id: 2, name: "Basics", activityType: "Curs" },
        { id: 3, name: "Basics", activityType: "Laborator" },
      ];

      mockedSubjectService.getAll.mockResolvedValue(mixedCase);

      const { result } = renderHook(() => useSubjects("asc"));

      await waitFor(() => expect(result.current.isLoading).toBe(false));

      expect(result.current.subjects[0].name).toBe("ajax");
      expect(result.current.subjects[1].name).toBe("Basics");
    });
  });

  describe("error handling", () => {
    it("should extract error message from Axios error", async () => {
      const axiosError = {
        isAxiosError: true,
        response: {
          data: { message: "Server is down" },
        },
      } as unknown as AxiosError<{ message: string }>;

      mockedSubjectService.getAll.mockRejectedValue(axiosError);

      const { result } = renderHook(() => useSubjects());

      await waitFor(() => expect(result.current.isLoading).toBe(false));

      expect(result.current.error).toBe("Server is down");
      expect(toast.error).toHaveBeenCalledWith("Server is down");
    });

    it("should use default error message for generic errors", async () => {
      mockedSubjectService.getAll.mockRejectedValue(new Error("Generic Error"));

      const { result } = renderHook(() => useSubjects());

      await waitFor(() => expect(result.current.isLoading).toBe(false));

      expect(result.current.error).toBe("Nu s-au putut încărca disciplinele.");
    });
  });

  describe("refetch functionality", () => {
    it("should call service again when refetch is invoked", async () => {
      mockedSubjectService.getAll.mockResolvedValueOnce([mockSubjects[0]]);

      const { result } = renderHook(() => useSubjects());
      await waitFor(() => expect(result.current.isLoading).toBe(false));

      mockedSubjectService.getAll.mockResolvedValueOnce(mockSubjects);

      result.current.refetch();

      await waitFor(() => {
        expect(result.current.subjects).toHaveLength(4);
      });

      expect(mockedSubjectService.getAll).toHaveBeenCalledTimes(2);
    });
  });
});
