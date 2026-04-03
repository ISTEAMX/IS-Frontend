import api, { type CustomConfig } from "@/api/axiosInstance";
import type { Group, GroupDTO } from "@/types/Group.types";

export const groupService = {
  getAll: async () => {
    const response = await api.get<Group[]>("/group/user/groups", {
      noAuth: true,
    } as CustomConfig);
    return response.data;
  },

  create: async (data: GroupDTO) => {
    const response = await api.post("/group/create", data);
    return response.data;
  },

  update: async (data: GroupDTO) => {
    const response = await api.put("/group/update", data);
    return response.data;
  },

  delete: async (id: number) => {
    const response = await api.delete(`/group/delete/${id}`);
    return response.data;
  },
};
