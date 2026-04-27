import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import useSchedules from "./useSchedules";
import { scheduleEventService } from "@/services/scheduleEventService";
import { useAuthStore } from "@/store/useAuthStore";
import toast from "react-hot-toast";
import type { ScheduleFilterValues } from "@/types/ScheduleFilters.types";
import type { ScheduleEvent } from "@/types/ScheduleEvent.types";

vi.mock("@/services/scheduleEventService");
vi.mock("react-hot-toast");
vi.mock("@/store/useAuthStore");

describe("useSchedules", () => {
  const mockSchedules: ScheduleEvent[] = [
    {
      id: 1,
      subjectDTO: { id: 1, name: "Algorithms", activityType: "Curs" as const },
      professorDTO: {
        id: 1,
        firstName: "John",
        lastName: "Doe",
        department: "CS",
      },
      groupDTO: { id: 1, identifier: "CTI-A1", specialization: "CS", year: 1, semester: 1 },
      roomDTO: {
        id: 1,
        name: "Room A101",
        location: "Building A",
        type: "Amfiteatru" as const,
        capacity: 100,
      },
      scheduleDay: "Luni" as const,
      startingHour: 8,
      endingHour: 10,
      frequency: "SAPTAMANAL" as const,
    },
    {
      id: 2,
      subjectDTO: {
        id: 2,
        name: "Databases",
        activityType: "Seminar" as const,
      },
      professorDTO: {
        id: 2,
        firstName: "Jane",
        lastName: "Smith",
        department: "CS",
      },
      groupDTO: { id: 2, identifier: "CTI-B1", specialization: "CS", year: 1, semester: 1 },
      roomDTO: {
        id: 2,
        name: "Room B201",
        location: "Building B",
        type: "Seminar" as const,
        capacity: 50,
      },
      scheduleDay: "Marți" as const,
      startingHour: 10,
      endingHour: 12,
      frequency: "SAPTAMANAL" as const,
    },
  ];

  const mockFilters: ScheduleFilterValues = {
    professorId: undefined,
    groupId: undefined,
    roomId: undefined,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useAuthStore).mockReturnValue({
      userData: null,
      isAuthenticated: false,
      token: null,
      setAuth: vi.fn(),
      logout: vi.fn(),
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe("initial state", () => {
    it("should start with loading state", () => {
      vi.mocked(scheduleEventService.get).mockImplementation(
        () =>
          new Promise(() => {
            /* never resolves */
          }),
      );

      const { result } = renderHook(() => useSchedules(mockFilters));

      expect(result.current.isLoading).toBe(true);
      expect(result.current.schedules).toEqual([]);
      expect(result.current.error).toBeNull();
    });
  });

  describe("successful fetch", () => {
    it("should fetch and return schedules", async () => {
      vi.mocked(scheduleEventService.get).mockResolvedValue(mockSchedules);

      const { result } = renderHook(() => useSchedules(mockFilters));

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.schedules).toHaveLength(2);
      expect(result.current.error).toBeNull();
      expect(result.current.schedules[0].id).toBe(1);
    });
  });

  describe("professor filter auto-application", () => {
    it("should auto-apply professorId when user is authenticated professor and no filters are set", async () => {
      const professorUser = {
        id: 5,
        professorId: 5,
        firstName: "Prof",
        lastName: "User",
        role: "PROFESSOR" as const,
      };

      vi.mocked(useAuthStore).mockReturnValue({
        userData: professorUser,
        isAuthenticated: true,
        token: "token123",
        setAuth: vi.fn(),
        logout: vi.fn(),
      });

      vi.mocked(scheduleEventService.get).mockResolvedValue(mockSchedules);

      const defaultFilters: ScheduleFilterValues = {
        professorId: undefined,
        groupId: undefined,
        roomId: undefined,
      };

      renderHook(() => useSchedules(defaultFilters));

      await waitFor(() => {
        expect(scheduleEventService.get).toHaveBeenCalled();
      });

      const callArgs = vi.mocked(scheduleEventService.get).mock.calls[0][0];
      expect(callArgs.professorId).toBe(5);
    });

    it("should not auto-apply professorId when user is not a professor", async () => {
      const adminUser = {
        id: 3,
        professorId: 0,
        firstName: "Admin",
        lastName: "User",
        role: "ADMIN" as const,
      };

      vi.mocked(useAuthStore).mockReturnValue({
        userData: adminUser,
        isAuthenticated: true,
        token: "token123",
        setAuth: vi.fn(),
        logout: vi.fn(),
      });

      vi.mocked(scheduleEventService.get).mockResolvedValue([]);

      const defaultFilters: ScheduleFilterValues = {
        professorId: undefined,
        groupId: undefined,
        roomId: undefined,
      };

      renderHook(() => useSchedules(defaultFilters));

      await waitFor(() => {
        expect(scheduleEventService.get).toHaveBeenCalled();
      });

      const callArgs = vi.mocked(scheduleEventService.get).mock.calls[0][0];
      expect(callArgs.professorId).toBeUndefined();
    });

    it("should respect explicit professorId filter over auto-application", async () => {
      const professorUser = {
        id: 5,
        professorId: 5,
        firstName: "Prof",
        lastName: "User",
        role: "PROFESSOR" as const,
      };

      vi.mocked(useAuthStore).mockReturnValue({
        userData: professorUser,
        isAuthenticated: true,
        token: "token123",
        setAuth: vi.fn(),
        logout: vi.fn(),
      });

      vi.mocked(scheduleEventService.get).mockResolvedValue([]);

      const filtersWithExplicitId: ScheduleFilterValues = {
        professorId: 10,
        groupId: undefined,
        roomId: undefined,
      };

      renderHook(() => useSchedules(filtersWithExplicitId));

      await waitFor(() => {
        expect(scheduleEventService.get).toHaveBeenCalled();
      });

      const callArgs = vi.mocked(scheduleEventService.get).mock.calls[0][0];
      expect(callArgs.professorId).toBe(10);
    });
  });

  describe("error handling", () => {
    it("should handle fetch error with default message", async () => {
      vi.mocked(scheduleEventService.get).mockRejectedValue(
        new Error("Network error"),
      );

      const { result } = renderHook(() => useSchedules(mockFilters));

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.error).toBe("Nu s-au putut încărca evenimentele.");
      expect(result.current.schedules).toEqual([]);
      expect(toast.error).toHaveBeenCalledWith(
        "Nu s-au putut încărca evenimentele.",
      );
    });

    it("should extract axios error message", async () => {
      const axiosError = {
        response: {
          data: {
            message: "Invalid filters provided",
          },
        },
        isAxiosError: true,
      };

      vi.mocked(scheduleEventService.get).mockRejectedValue(axiosError);

      const { result } = renderHook(() => useSchedules(mockFilters));

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.error).toBe("Invalid filters provided");
      expect(toast.error).toHaveBeenCalledWith("Invalid filters provided");
    });

    it("should handle fetch error with invalid data format", async () => {
      vi.mocked(scheduleEventService.get).mockRejectedValue(
        new Error(
          "Datele primite nu sunt într-un format valid (Array expected).",
        ),
      );

      const { result } = renderHook(() => useSchedules(mockFilters));

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.schedules).toEqual([]);
      expect(result.current.error).toContain(
        "Nu s-au putut încărca evenimentele.",
      );
    });
  });

  describe("refetch functionality", () => {
    it("should refetch schedules when refetch is called", async () => {
      vi.mocked(scheduleEventService.get).mockResolvedValueOnce([
        mockSchedules[0],
      ]);

      const { result } = renderHook(() => useSchedules(mockFilters));

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.schedules).toHaveLength(1);

      vi.mocked(scheduleEventService.get).mockResolvedValueOnce(mockSchedules);
      result.current.refetch();

      await waitFor(() => {
        expect(result.current.schedules).toHaveLength(2);
      });

      expect(scheduleEventService.get).toHaveBeenCalledTimes(2);
    });

    it("should reset error on successful refetch", async () => {
      vi.mocked(scheduleEventService.get).mockRejectedValueOnce(
        new Error("Error"),
      );

      const { result } = renderHook(() => useSchedules(mockFilters));

      await waitFor(() => {
        expect(result.current.error).toBe(
          "Nu s-au putut încărca evenimentele.",
        );
      });

      vi.mocked(scheduleEventService.get).mockResolvedValueOnce(mockSchedules);
      result.current.refetch();

      await waitFor(() => {
        expect(result.current.error).toBeNull();
        expect(result.current.schedules).toHaveLength(2);
      });
    });
  });

  describe("empty state", () => {
    it("should handle empty schedules array", async () => {
      vi.mocked(scheduleEventService.get).mockResolvedValue([]);

      const { result } = renderHook(() => useSchedules(mockFilters));

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.schedules).toEqual([]);
      expect(result.current.error).toBeNull();
    });
  });

  describe("filter reactivity", () => {
    it("should refetch when filters change", async () => {
      vi.mocked(scheduleEventService.get).mockResolvedValue(mockSchedules);

      const initialFilters: ScheduleFilterValues = {
        professorId: undefined,
        groupId: undefined,
        roomId: undefined,
      };

      const { rerender } = renderHook((filters) => useSchedules(filters), {
        initialProps: initialFilters,
      });

      await waitFor(() => {
        expect(scheduleEventService.get).toHaveBeenCalledTimes(1);
      });

      const newFilters: ScheduleFilterValues = {
        professorId: 5,
        groupId: undefined,
        roomId: undefined,
      };

      rerender(newFilters);

      await waitFor(() => {
        expect(scheduleEventService.get).toHaveBeenCalledTimes(2);
      });
    });
  });
});
