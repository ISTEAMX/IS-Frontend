import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import useRooms from "./useRooms";
import { roomService } from "@/services/roomService";
import toast from "react-hot-toast";
import type { Room } from "@/types/Room.types";
import type { AxiosError } from "axios";

vi.mock("@/services/roomService", () => ({
  roomService: {
    getAll: vi.fn(),
  },
}));
vi.mock("react-hot-toast", () => ({
  default: {
    error: vi.fn(),
  },
}));

describe("useRooms", () => {
  const mockRooms: Room[] = [
    {
      id: 1,
      name: "A101",
      location: "Corp A, Etaj 1, Sala 1",
      type: "Amfiteatru",
      capacity: 100,
    },
    {
      id: 2,
      name: "B201",
      location: "Corp B, Etaj 2, Sala 1",
      type: "Laborator",
      capacity: 30,
    },
    {
      id: 3,
      name: "C301",
      location: "Corp C, Etaj 3, Sala 1",
      type: "Seminar",
      capacity: 50,
    },
  ];

  const mockedRoomService = vi.mocked(roomService);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe("initial state", () => {
    it("should start with loading state", () => {
      mockedRoomService.getAll.mockImplementation(
        () => new Promise<Room[]>(() => {}),
      );

      const { result } = renderHook(() => useRooms());

      expect(result.current.isLoading).toBe(true);
      expect(result.current.rooms).toEqual([]);
      expect(result.current.error).toBeNull();
    });
  });

  describe("successful fetch", () => {
    it("should fetch and return rooms with ascending sort by default", async () => {
      mockedRoomService.getAll.mockResolvedValue(mockRooms);

      const { result } = renderHook(() => useRooms());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.rooms).toHaveLength(3);
      expect(result.current.rooms[0].name).toBe("A101");
      expect(result.current.rooms[1].name).toBe("B201");
      expect(result.current.rooms[2].name).toBe("C301");
    });

    it("should sort rooms by name descending when sortOrder is 'desc'", async () => {
      mockedRoomService.getAll.mockResolvedValue(mockRooms);

      const { result } = renderHook(() => useRooms("desc"));

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.rooms[0].name).toBe("C301");
      expect(result.current.rooms[1].name).toBe("B201");
      expect(result.current.rooms[2].name).toBe("A101");
    });
  });

  describe("error handling", () => {
    it("should handle fetch error with default message", async () => {
      mockedRoomService.getAll.mockRejectedValue(new Error("Network error"));

      const { result } = renderHook(() => useRooms());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.error).toBe("Nu s-au putut încărca sălile.");
      expect(toast.error).toHaveBeenCalledWith("Nu s-au putut încărca sălile.");
    });

    it("should extract axios error message", async () => {
      const axiosError = {
        isAxiosError: true,
        response: {
          data: {
            message: "Unauthorized access",
          },
        },
      } as unknown as AxiosError<{ message: string }>;

      mockedRoomService.getAll.mockRejectedValue(axiosError);

      const { result } = renderHook(() => useRooms());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.error).toBe("Unauthorized access");
      expect(toast.error).toHaveBeenCalledWith("Unauthorized access");
    });
  });

  describe("refetch functionality", () => {
    it("should refetch rooms when refetch is called", async () => {
      mockedRoomService.getAll.mockResolvedValueOnce([mockRooms[0]]);

      const { result } = renderHook(() => useRooms());

      await waitFor(() => expect(result.current.isLoading).toBe(false));
      expect(result.current.rooms).toHaveLength(1);

      mockedRoomService.getAll.mockResolvedValueOnce(mockRooms);
      result.current.refetch();

      await waitFor(() => {
        expect(result.current.rooms).toHaveLength(3);
      });

      expect(mockedRoomService.getAll).toHaveBeenCalledTimes(2);
    });
  });

  describe("empty state", () => {
    it("should handle empty rooms array", async () => {
      vi.mocked(roomService.getAll).mockResolvedValue([]);

      const { result } = renderHook(() => useRooms());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.rooms).toEqual([]);
      expect(result.current.error).toBeNull();
    });
  });
});
