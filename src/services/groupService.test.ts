import { describe, it, expect, vi, beforeEach } from "vitest";
import { groupService } from "./groupService";
import api from "@/api/axiosInstance";

vi.mock("@/api/axiosInstance");

describe("groupService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getAll", () => {
    it("should fetch all groups", async () => {
      const mockGroups = [
        { id: 1, identifier: "A1" },
        { id: 2, identifier: "B2" },
      ];
      vi.mocked(api.get).mockResolvedValue({ data: mockGroups });

      const result = await groupService.getAll();

      expect(api.get).toHaveBeenCalledWith("/group/user/groups", {
        noAuth: true,
      });
      expect(result).toEqual(mockGroups);
    });

    it("should handle empty groups list", async () => {
      vi.mocked(api.get).mockResolvedValue({ data: [] });

      const result = await groupService.getAll();

      expect(result).toEqual([]);
    });

    it("should handle fetch error", async () => {
      const error = new Error("Network error");
      vi.mocked(api.get).mockRejectedValue(error);

      await expect(groupService.getAll()).rejects.toThrow("Network error");
    });
  });

  describe("create", () => {
    it("should create a new group", async () => {
      const newGroup = {
        id: 3,
        identifier: "C3",
        specialization: "IR",
        year: 1,
        semester: 1,
      };
      vi.mocked(api.post).mockResolvedValue({ data: newGroup });

      const result = await groupService.create({
        identifier: "C3",
        specialization: "IR",
        year: 1,
        semester: 1,
      });

      expect(api.post).toHaveBeenCalledWith("/group/create", {
        identifier: "C3",
        specialization: "IR",
        year: 1,
        semester: 1,
      });
      expect(result).toEqual(newGroup);
    });

    it("should handle creation error", async () => {
      const error = new Error("Group already exists");
      vi.mocked(api.post).mockRejectedValue(error);

      await expect(
        groupService.create({
          identifier: "A1",
          specialization: "IR",
          year: 1,
          semester: 1,
        }),
      ).rejects.toThrow("Group already exists");
    });
  });

  describe("update", () => {
    it("should update an existing group", async () => {
      const updatedGroup = {
        id: 1,
        identifier: "A1_UPDATED",
        specialization: "IR",
        year: 1,
        semester: 1,
      };
      vi.mocked(api.put).mockResolvedValue({ data: updatedGroup });

      const result = await groupService.update({
        id: 1,
        identifier: "A1_UPDATED",
        specialization: "IR",
        year: 1,
        semester: 1,
      });

      expect(api.put).toHaveBeenCalledWith("/group/update", {
        id: 1,
        identifier: "A1_UPDATED",
        specialization: "IR",
        year: 1,
        semester: 1,
      });
      expect(result).toEqual(updatedGroup);
    });

    it("should handle update error", async () => {
      const error = new Error("Group not found");
      vi.mocked(api.put).mockRejectedValue(error);

      await expect(
        groupService.update({
          id: 999,
          identifier: "X",
          specialization: "IR",
          year: 1,
          semester: 1,
        }),
      ).rejects.toThrow("Group not found");
    });
  });

  describe("delete", () => {
    it("should delete a group", async () => {
      vi.mocked(api.delete).mockResolvedValue({ data: { success: true } });

      const result = await groupService.delete(1);

      expect(api.delete).toHaveBeenCalledWith("/group/delete/1");
      expect(result).toEqual({ success: true });
    });

    it("should handle delete error", async () => {
      const error = new Error("Cannot delete group");
      vi.mocked(api.delete).mockRejectedValue(error);

      await expect(groupService.delete(1)).rejects.toThrow(
        "Cannot delete group",
      );
    });
  });
});
