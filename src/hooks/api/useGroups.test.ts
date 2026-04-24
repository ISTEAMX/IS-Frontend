import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import useGroups from "./useGroups";
import { groupService } from "@/services/groupService";
import toast from "react-hot-toast";

vi.mock("@/services/groupService");
vi.mock("react-hot-toast");

describe("useGroups", () => {
  const mockGroups = [
    {
      id: 1,
      identifier: "CTI-A1",
      specialization: "Computer Science",
      year: 1,
    },
    {
      id: 2,
      identifier: "CTI-B2",
      specialization: "Computer Science",
      year: 2,
    },
    {
      id: 3,
      identifier: "MTM-A1",
      specialization: "Mathematics",
      year: 1,
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe("initial state", () => {
    it("should start with loading state", () => {
      vi.mocked(groupService.getAll).mockImplementation(
        () =>
          new Promise(() => {
            /* never resolves */
          }),
      );

      const { result } = renderHook(() => useGroups());

      expect(result.current.isLoading).toBe(true);
      expect(result.current.groups).toEqual([]);
      expect(result.current.error).toBeNull();
    });
  });

  describe("successful fetch", () => {
    it("should fetch and return groups with ascending sort by default", async () => {
      vi.mocked(groupService.getAll).mockResolvedValue(mockGroups);

      const { result } = renderHook(() => useGroups());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.groups).toHaveLength(3);
      expect(result.current.error).toBeNull();

      // Check if sorted by identifier ascending
      expect(result.current.groups[0].identifier).toBe("CTI-A1");
      expect(result.current.groups[1].identifier).toBe("CTI-B2");
      expect(result.current.groups[2].identifier).toBe("MTM-A1");
    });

    it("should sort groups by identifier descending when sortOrder is 'desc'", async () => {
      vi.mocked(groupService.getAll).mockResolvedValue(mockGroups);

      const { result } = renderHook(() => useGroups("desc"));

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.groups[0].identifier).toBe("MTM-A1");
      expect(result.current.groups[1].identifier).toBe("CTI-B2");
      expect(result.current.groups[2].identifier).toBe("CTI-A1");
    });

    it("should handle case-insensitive sorting", async () => {
      const mixedCaseGroups = [
        { id: 1, identifier: "zeta", specialization: "CS", year: 1 },
        { id: 2, identifier: "Alpha", specialization: "CS", year: 1 },
        { id: 3, identifier: "Beta", specialization: "CS", year: 1 },
      ];

      vi.mocked(groupService.getAll).mockResolvedValue(mixedCaseGroups);

      const { result } = renderHook(() => useGroups("asc"));

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.groups[0].identifier).toBe("Alpha");
      expect(result.current.groups[1].identifier).toBe("Beta");
      expect(result.current.groups[2].identifier).toBe("zeta");
    });

    it("should not sort when sortOrder is null", async () => {
      vi.mocked(groupService.getAll).mockResolvedValue(mockGroups);

      const { result } = renderHook(() => useGroups(null));

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.groups).toEqual(mockGroups);
    });
  });

  describe("error handling", () => {
    it("should handle fetch error with default message", async () => {
      vi.mocked(groupService.getAll).mockRejectedValue(
        new Error("Network error"),
      );

      const { result } = renderHook(() => useGroups());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.error).toBe("Nu s-au putut încărca grupele.");
      expect(result.current.groups).toEqual([]);
      expect(toast.error).toHaveBeenCalledWith(
        "Nu s-au putut încărca grupele.",
      );
    });

    it("should extract axios error message", async () => {
      const axiosError = {
        response: {
          data: {
            message: "Groups not found",
          },
        },
        isAxiosError: true,
      };

      vi.mocked(groupService.getAll).mockRejectedValue(axiosError);

      const { result } = renderHook(() => useGroups());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.error).toBe("Groups not found");
      expect(toast.error).toHaveBeenCalledWith("Groups not found");
    });
  });

  describe("refetch functionality", () => {
    it("should refetch groups when refetch is called", async () => {
      vi.mocked(groupService.getAll).mockResolvedValueOnce([mockGroups[0]]);

      const { result } = renderHook(() => useGroups());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.groups).toHaveLength(1);

      vi.mocked(groupService.getAll).mockResolvedValueOnce(mockGroups);
      result.current.refetch();

      await waitFor(() => {
        expect(result.current.groups).toHaveLength(3);
      });

      expect(groupService.getAll).toHaveBeenCalledTimes(2);
    });
  });

  describe("empty state", () => {
    it("should handle empty groups array", async () => {
      vi.mocked(groupService.getAll).mockResolvedValue([]);

      const { result } = renderHook(() => useGroups());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.groups).toEqual([]);
      expect(result.current.error).toBeNull();
    });
  });
});
