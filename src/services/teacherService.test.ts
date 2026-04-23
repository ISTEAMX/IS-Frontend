import { describe, it, expect, vi, beforeEach } from "vitest";
import { teacherService } from "./teacherService";
import api from "@/api/axiosInstance";

vi.mock("@/api/axiosInstance");

describe("teacherService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getAll", () => {
    it("should fetch all teachers", async () => {
      const mockTeachers = [
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
      ];
      vi.mocked(api.get).mockResolvedValue({ data: mockTeachers });

      const result = await teacherService.getAll();

      expect(api.get).toHaveBeenCalledWith("/professor/user", {
        noAuth: true,
      });
      expect(result).toEqual(mockTeachers);
    });

    it("should handle empty teachers list", async () => {
      vi.mocked(api.get).mockResolvedValue({ data: [] });

      const result = await teacherService.getAll();

      expect(result).toEqual([]);
    });

    it("should handle fetch error", async () => {
      const error = new Error("Network error");
      vi.mocked(api.get).mockRejectedValue(error);

      await expect(teacherService.getAll()).rejects.toThrow("Network error");
    });
  });

  describe("update", () => {
    it("should update an existing teacher", async () => {
      const updatedTeacher = {
        id: 1,
        firstName: "Ion",
        lastName: "Popescu",
        department: "Software Engineering",
      };
      vi.mocked(api.put).mockResolvedValue({ data: updatedTeacher });

      const result = await teacherService.update({
        id: 1,
        firstName: "Ion",
        lastName: "Popescu",
        department: "Software Engineering",
      });

      expect(api.put).toHaveBeenCalledWith("/professor", {
        id: 1,
        firstName: "Ion",
        lastName: "Popescu",
        department: "Software Engineering",
      });
      expect(result).toEqual(updatedTeacher);
    });

    it("should handle update error", async () => {
      const error = new Error("Teacher not found");
      vi.mocked(api.put).mockRejectedValue(error);

      await expect(
        teacherService.update({
          id: 999,
          firstName: "NonExistent",
          lastName: "Teacher",
          department: "Unknown",
        }),
      ).rejects.toThrow("Teacher not found");
    });

    it("should update teacher without id field", async () => {
      const updatedTeacher = {
        firstName: "Gheorghe",
        lastName: "Ionescu",
        department: "Physics",
      };
      vi.mocked(api.put).mockResolvedValue({
        data: { id: 3, ...updatedTeacher },
      });

      const result = await teacherService.update(updatedTeacher);

      expect(api.put).toHaveBeenCalledWith("/professor", updatedTeacher);
      expect(result).toEqual({ id: 3, ...updatedTeacher });
    });
  });

  describe("delete", () => {
    it("should delete a teacher", async () => {
      vi.mocked(api.delete).mockResolvedValue({ data: { success: true } });

      const result = await teacherService.delete(1);

      expect(api.delete).toHaveBeenCalledWith("/professor/1");
      expect(result).toEqual({ success: true });
    });

    it("should handle delete error", async () => {
      const error = new Error("Cannot delete teacher");
      vi.mocked(api.delete).mockRejectedValue(error);

      await expect(teacherService.delete(1)).rejects.toThrow(
        "Cannot delete teacher",
      );
    });
  });
});
