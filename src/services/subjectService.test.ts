import { describe, it, expect, vi, beforeEach } from "vitest";
import { subjectService } from "./subjectService";
import api from "@/api/axiosInstance";

vi.mock("@/api/axiosInstance");

describe("subjectService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getAll", () => {
    it("should fetch all subjects", async () => {
      const mockSubjects = [
        {
          id: 1,
          name: "Algorithms",
          activityType: "Curs",
        },
        {
          id: 2,
          name: "Data Structures",
          activityType: "Lab",
        },
      ];
      vi.mocked(api.get).mockResolvedValue({ data: mockSubjects });

      const result = await subjectService.getAll();

      expect(api.get).toHaveBeenCalledWith("/subject/user", {
        noAuth: true,
      });
      expect(result).toEqual(mockSubjects);
    });

    it("should handle empty subjects list", async () => {
      vi.mocked(api.get).mockResolvedValue({ data: [] });

      const result = await subjectService.getAll();

      expect(result).toEqual([]);
    });

    it("should handle fetch error", async () => {
      const error = new Error("Network error");
      vi.mocked(api.get).mockRejectedValue(error);

      await expect(subjectService.getAll()).rejects.toThrow("Network error");
    });
  });

  describe("create", () => {
    it("should create a new subject", async () => {
      const newSubject = {
        id: 3,
        name: "Database Systems",
        activityType: "Seminar",
      };
      vi.mocked(api.post).mockResolvedValue({ data: newSubject });

      const result = await subjectService.create({
        name: "Database Systems",
        activityType: "Seminar",
      });

      expect(api.post).toHaveBeenCalledWith("/subject/create", {
        name: "Database Systems",
        activityType: "Seminar",
      });
      expect(result).toEqual(newSubject);
    });

    it("should handle creation error", async () => {
      const error = new Error("Subject already exists");
      vi.mocked(api.post).mockRejectedValue(error);

      await expect(
        subjectService.create({
          name: "Algorithms",
          activityType: "Curs",
        }),
      ).rejects.toThrow("Subject already exists");
    });
  });

  describe("update", () => {
    it("should update an existing subject", async () => {
      const updatedSubject = {
        id: 1,
        name: "Advanced Algorithms",
        activityType: "Curs",
      };
      vi.mocked(api.put).mockResolvedValue({ data: updatedSubject });

      const result = await subjectService.update({
        id: 1,
        name: "Advanced Algorithms",
        activityType: "Curs",
      });

      expect(api.put).toHaveBeenCalledWith("/subject/update", {
        id: 1,
        name: "Advanced Algorithms",
        activityType: "Curs",
      });
      expect(result).toEqual(updatedSubject);
    });

    it("should handle update error", async () => {
      const error = new Error("Subject not found");
      vi.mocked(api.put).mockRejectedValue(error);

      await expect(
        subjectService.update({
          id: 999,
          name: "NonExistent",
          activityType: "Curs",
        }),
      ).rejects.toThrow("Subject not found");
    });
  });

  describe("delete", () => {
    it("should delete a subject", async () => {
      vi.mocked(api.delete).mockResolvedValue({ data: { success: true } });

      const result = await subjectService.delete(1);

      expect(api.delete).toHaveBeenCalledWith("/subject/delete/1");
      expect(result).toEqual({ success: true });
    });

    it("should handle delete error", async () => {
      const error = new Error("Cannot delete subject");
      vi.mocked(api.delete).mockRejectedValue(error);

      await expect(subjectService.delete(1)).rejects.toThrow(
        "Cannot delete subject",
      );
    });
  });
});
