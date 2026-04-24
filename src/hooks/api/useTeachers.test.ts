import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import useTeachers from "./useTeachers";
import { teacherService } from "@/services/teacherService";
import toast from "react-hot-toast";
import type { Teacher } from "@/types/Teacher.types";
import type { AxiosError } from "axios";

vi.mock("@/services/teacherService", () => ({
  teacherService: {
    getAll: vi.fn(),
  },
}));

vi.mock("react-hot-toast", () => ({
  default: {
    error: vi.fn(),
  },
}));

describe("useTeachers", () => {
  const mockTeachers: Teacher[] = [
    {
      id: 1,
      firstName: "Ion",
      lastName: "Popescu",
      department: "Computer Science",
    },
    {
      id: 2,
      firstName: "Maria",
      lastName: "Gheorghiu",
      department: "Mathematics",
    },
    {
      id: 3,
      firstName: "Ana",
      lastName: "Andrei",
      department: "Physics",
    },
  ];

  const mockedTeacherService = vi.mocked(teacherService);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe("initial state", () => {
    it("should start with loading state", () => {
      mockedTeacherService.getAll.mockImplementation(
        () => new Promise<Teacher[]>(() => {}),
      );

      const { result } = renderHook(() => useTeachers());

      expect(result.current.isLoading).toBe(true);
      expect(result.current.teachers).toEqual([]);
      expect(result.current.error).toBeNull();
    });
  });

  describe("successful fetch and sorting", () => {
    it("should fetch and return teachers sorted by lastName ascending by default", async () => {
      mockedTeacherService.getAll.mockResolvedValue(mockTeachers);

      const { result } = renderHook(() => useTeachers());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.teachers).toHaveLength(3);
      expect(result.current.teachers[0].lastName).toBe("Andrei");
      expect(result.current.teachers[1].lastName).toBe("Gheorghiu");
      expect(result.current.teachers[2].lastName).toBe("Popescu");
    });

    it("should sort teachers by lastName descending when requested", async () => {
      mockedTeacherService.getAll.mockResolvedValue(mockTeachers);

      const { result } = renderHook(() => useTeachers("desc"));

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.teachers[0].lastName).toBe("Popescu");
      expect(result.current.teachers[2].lastName).toBe("Andrei");
    });

    it("should use firstName as a tie-breaker for same lastName", async () => {
      const sameLastName: Teacher[] = [
        { id: 1, firstName: "Zoe", lastName: "Smith", department: "IT" },
        { id: 2, firstName: "Alice", lastName: "Smith", department: "IT" },
      ];

      mockedTeacherService.getAll.mockResolvedValue(sameLastName);

      const { result } = renderHook(() => useTeachers("asc"));

      await waitFor(() => expect(result.current.isLoading).toBe(false));

      expect(result.current.teachers[0].firstName).toBe("Alice");
      expect(result.current.teachers[1].firstName).toBe("Zoe");
    });
  });

  describe("error handling", () => {
    it("should handle generic errors with default message", async () => {
      mockedTeacherService.getAll.mockRejectedValue(new Error("Crash"));

      const { result } = renderHook(() => useTeachers());

      await waitFor(() => expect(result.current.isLoading).toBe(false));

      expect(result.current.error).toBe("Nu s-au putut încărca profesorii.");
      expect(toast.error).toHaveBeenCalledWith(
        "Nu s-au putut încărca profesorii.",
      );
    });

    it("should extract error message from Axios response", async () => {
      const axiosError = {
        isAxiosError: true,
        response: {
          data: { message: "Database failure" },
        },
      } as unknown as AxiosError<{ message: string }>;

      mockedTeacherService.getAll.mockRejectedValue(axiosError);

      const { result } = renderHook(() => useTeachers());

      await waitFor(() => expect(result.current.isLoading).toBe(false));

      expect(result.current.error).toBe("Database failure");
      expect(toast.error).toHaveBeenCalledWith("Database failure");
    });
  });

  describe("refetch functionality", () => {
    it("should allow manual refetch of data", async () => {
      mockedTeacherService.getAll.mockResolvedValueOnce([mockTeachers[0]]);

      const { result } = renderHook(() => useTeachers());
      await waitFor(() => expect(result.current.isLoading).toBe(false));
      expect(result.current.teachers).toHaveLength(1);

      mockedTeacherService.getAll.mockResolvedValueOnce(mockTeachers);

      result.current.refetch();

      await waitFor(() => {
        expect(result.current.teachers).toHaveLength(3);
      });

      expect(mockedTeacherService.getAll).toHaveBeenCalledTimes(2);
    });
  });
});
