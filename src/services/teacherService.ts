import api, { type CustomConfig } from "@/api/axiosInstance";
import type { Teacher, TeacherDTO } from "@/types/Teacher.types";
import type { PageResponse } from "@/types/Api.types";

export const teacherService = {
  getAll: async () => {
    const response = await api.get<PageResponse<Teacher>>("/professor/user", {
      noAuth: true,
      params: { size: 200 },
    } as CustomConfig);
    return response.data.content;
  },

  update: async (data: TeacherDTO) => {
    const response = await api.put("/professor", data);
    return response.data;
  },

  delete: async (id: number) => {
    const response = await api.delete(`/professor/${id}`);
    return response.data;
  },
};
