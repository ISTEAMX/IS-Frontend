import { describe, it, expect, vi, beforeEach } from "vitest";
import { roomService } from "./roomService";
import api from "@/api/axiosInstance";

vi.mock("@/api/axiosInstance");

describe("roomService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getAll", () => {
    it("should fetch all rooms", async () => {
      const mockRooms = [
        {
          id: 1,
          name: "A101",
          location: "Corp A, Etaj 1, Sala 1",
          type: "Laborator",
          capacity: 30,
        },
        {
          id: 2,
          name: "B205",
          location: "Corp B, Etaj 2, Sala 5",
          type: "Amfiteatru",
          capacity: 200,
        },
      ];
      vi.mocked(api.get).mockResolvedValue({ data: { content: mockRooms, totalElements: 2, totalPages: 1 } });

      const result = await roomService.getAll();

      expect(api.get).toHaveBeenCalledWith("/room/user/rooms", {
        noAuth: true,
        params: { size: 200 },
      });
      expect(result).toEqual(mockRooms);
    });

    it("should handle empty rooms list", async () => {
      vi.mocked(api.get).mockResolvedValue({ data: { content: [], totalElements: 0, totalPages: 0 } });

      const result = await roomService.getAll();

      expect(result).toEqual([]);
    });

    it("should handle fetch error", async () => {
      const error = new Error("Network error");
      vi.mocked(api.get).mockRejectedValue(error);

      await expect(roomService.getAll()).rejects.toThrow("Network error");
    });
  });

  describe("create", () => {
    it("should create a new room", async () => {
      const newRoom = {
        id: 3,
        name: "C310",
        location: "Corp C, Etaj 3, Sala 10",
        type: "Seminar",
        capacity: 50,
      };
      vi.mocked(api.post).mockResolvedValue({ data: newRoom });

      const result = await roomService.create({
        name: "C310",
        location: "Corp C, Etaj 3, Sala 10",
        type: "Seminar",
        capacity: 50,
      });

      expect(api.post).toHaveBeenCalledWith("/room/create", {
        name: "C310",
        location: "Corp C, Etaj 3, Sala 10",
        type: "Seminar",
        capacity: 50,
      });
      expect(result).toEqual(newRoom);
    });

    it("should handle creation error", async () => {
      const error = new Error("Room already exists");
      vi.mocked(api.post).mockRejectedValue(error);

      await expect(
        roomService.create({
          name: "A101",
          location: "Corp A, Etaj 1, Sala 1",
          type: "Laborator",
          capacity: 30,
        }),
      ).rejects.toThrow("Room already exists");
    });
  });

  describe("update", () => {
    it("should update an existing room", async () => {
      const updatedRoom = {
        id: 1,
        name: "A101",
        location: "Corp A, Etaj 1, Sala 1",
        type: "Amfiteatru",
        capacity: 40,
      };
      vi.mocked(api.put).mockResolvedValue({ data: updatedRoom });

      const result = await roomService.update({
        id: 1,
        name: "A101",
        location: "Corp A, Etaj 1, Sala 1",
        type: "Amfiteatru",
        capacity: 40,
      });

      expect(api.put).toHaveBeenCalledWith("/room/update", {
        id: 1,
        name: "A101",
        location: "Corp A, Etaj 1, Sala 1",
        type: "Amfiteatru",
        capacity: 40,
      });
      expect(result).toEqual(updatedRoom);
    });

    it("should handle update error", async () => {
      const error = new Error("Room not found");
      vi.mocked(api.put).mockRejectedValue(error);

      await expect(
        roomService.update({
          id: 999,
          name: "NonExistent",
          location: "Unknown",
          type: "Laborator",
          capacity: 0,
        }),
      ).rejects.toThrow("Room not found");
    });
  });

  describe("delete", () => {
    it("should delete a room", async () => {
      vi.mocked(api.delete).mockResolvedValue({ data: { success: true } });

      const result = await roomService.delete(1);

      expect(api.delete).toHaveBeenCalledWith("/room/delete/1");
      expect(result).toEqual({ success: true });
    });

    it("should handle delete error", async () => {
      const error = new Error("Cannot delete room");
      vi.mocked(api.delete).mockRejectedValue(error);

      await expect(roomService.delete(1)).rejects.toThrow("Cannot delete room");
    });
  });
});
