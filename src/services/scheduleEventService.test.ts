import { describe, it, expect, vi, beforeEach } from "vitest";
import { scheduleEventService } from "./scheduleEventService";
import api from "@/api/axiosInstance";

vi.mock("@/api/axiosInstance");

describe("scheduleEventService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getAll", () => {
    it("should fetch all schedule events", async () => {
      const mockEvents = [
        {
          id: 1,
          subjectDTO: { id: 1, name: "Algorithms", activityType: "Lecture" },
          professorDTO: {
            id: 1,
            firstName: "Ion",
            lastName: "Popescu",
            department: "Computer Science",
          },
          groups: [{ id: 1, identifier: "A1" }],
          roomDTO: {
            id: 1,
            name: "A101",
            location: "Corp A, Parter, Sala 101",
            type: "Amfiteatru",
            capacity: 200,
          },
          scheduleDay: "Luni",
          startingHour: 10,
          endingHour: 12,
          frequency: "SAPTAMANAL",
        },
        {
          id: 2,
          subjectDTO: { id: 2, name: "Data Structures", activityType: "Lab" },
          professorDTO: {
            id: 2,
            firstName: "Maria",
            lastName: "Gheorghiu",
            department: "Mathematics",
          },
          groups: [{ id: 2, identifier: "B2" }],
          roomDTO: {
            id: 2,
            name: "B205",
            location: "Corp B, Etaj 2, Sala 5",
            type: "Laborator",
            capacity: 30,
          },
          scheduleDay: "Marți",
          startingHour: 14,
          endingHour: 16,
          frequency: "PARA",
        },
      ];
      vi.mocked(api.get).mockResolvedValue({ data: mockEvents });

      const result = await scheduleEventService.getAll();

      expect(api.get).toHaveBeenCalledWith("/schedule/user", {
        noAuth: true,
      });
      expect(result).toEqual(mockEvents);
    });

    it("should handle empty schedule events list", async () => {
      vi.mocked(api.get).mockResolvedValue({ data: [] });

      const result = await scheduleEventService.getAll();

      expect(result).toEqual([]);
    });

    it("should handle fetch error", async () => {
      const error = new Error("Network error");
      vi.mocked(api.get).mockRejectedValue(error);

      await expect(scheduleEventService.getAll()).rejects.toThrow(
        "Network error",
      );
    });
  });

  describe("create", () => {
    it("should create a new schedule event", async () => {
      const newEvent = {
        id: 3,
        subjectId: 1,
        professorId: 1,
        groupIds: [1],
        roomId: 1,
        scheduleDay: "Miercuri",
        startingHour: 9,
        endingHour: 11,
        frequency: "SAPTAMANAL",
      };
      vi.mocked(api.post).mockResolvedValue({ data: newEvent });

      const result = await scheduleEventService.create({
        subjectId: 1,
        professorId: 1,
        groupIds: [1],
        roomId: 1,
        scheduleDay: "Miercuri",
        startingHour: 9,
        endingHour: 11,
        frequency: "SAPTAMANAL",
      });

      expect(api.post).toHaveBeenCalledWith("/schedule/add", {
        subjectId: 1,
        professorId: 1,
        groupIds: [1],
        roomId: 1,
        scheduleDay: "Miercuri",
        startingHour: 9,
        endingHour: 11,
        frequency: "SAPTAMANAL",
      });
      expect(result).toEqual(newEvent);
    });

    it("should handle creation error", async () => {
      const error = new Error("Schedule conflict");
      vi.mocked(api.post).mockRejectedValue(error);

      await expect(
        scheduleEventService.create({
          subjectId: 1,
          professorId: 1,
          groupIds: [1],
          roomId: 1,
          scheduleDay: "Luni",
          startingHour: 10,
          endingHour: 12,
          frequency: "SAPTAMANAL",
        }),
      ).rejects.toThrow("Schedule conflict");
    });
  });

  describe("update", () => {
    it("should update an existing schedule event", async () => {
      const updatedEvent = {
        id: 1,
        subjectId: 1,
        professorId: 1,
        groupIds: [1],
        roomId: 2,
        scheduleDay: "Luni",
        startingHour: 11,
        endingHour: 13,
        frequency: "SAPTAMANAL",
      };
      vi.mocked(api.put).mockResolvedValue({ data: updatedEvent });

      const result = await scheduleEventService.update({
        id: 1,
        subjectId: 1,
        professorId: 1,
        groupIds: [1],
        roomId: 2,
        scheduleDay: "Luni",
        startingHour: 11,
        endingHour: 13,
        frequency: "SAPTAMANAL",
      });

      expect(api.put).toHaveBeenCalledWith("/schedule/update", {
        id: 1,
        subjectId: 1,
        professorId: 1,
        groupIds: [1],
        roomId: 2,
        scheduleDay: "Luni",
        startingHour: 11,
        endingHour: 13,
        frequency: "SAPTAMANAL",
      });
      expect(result).toEqual(updatedEvent);
    });

    it("should handle update error", async () => {
      const error = new Error("Schedule event not found");
      vi.mocked(api.put).mockRejectedValue(error);

      await expect(
        scheduleEventService.update({
          id: 999,
          subjectId: 1,
          professorId: 1,
          groupIds: [1],
          roomId: 1,
          scheduleDay: "Luni",
          startingHour: 10,
          endingHour: 12,
          frequency: "SAPTAMANAL",
        }),
      ).rejects.toThrow("Schedule event not found");
    });

    it("should handle schedule conflict on update", async () => {
      const error = new Error("Schedule conflict");
      vi.mocked(api.put).mockRejectedValue(error);

      await expect(
        scheduleEventService.update({
          id: 1,
          subjectId: 1,
          professorId: 1,
          groupIds: [1],
          roomId: 1,
          scheduleDay: "Luni",
          startingHour: 10,
          endingHour: 12,
          frequency: "SAPTAMANAL",
        }),
      ).rejects.toThrow("Schedule conflict");
    });
  });

  describe("delete", () => {
    it("should delete a schedule event", async () => {
      vi.mocked(api.delete).mockResolvedValue({ data: { success: true } });

      const result = await scheduleEventService.delete(1);

      expect(api.delete).toHaveBeenCalledWith("/schedule/delete/1");
      expect(result).toEqual({ success: true });
    });

    it("should handle delete error", async () => {
      const error = new Error("Cannot delete schedule event");
      vi.mocked(api.delete).mockRejectedValue(error);

      await expect(scheduleEventService.delete(1)).rejects.toThrow(
        "Cannot delete schedule event",
      );
    });
  });
});
