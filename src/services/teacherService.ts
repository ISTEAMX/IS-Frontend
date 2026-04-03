import api, { type CustomConfig } from "@/api/axiosInstance";
import type { Teacher, TeacherDTO } from "@/types/Teacher.types";

export const teacherService = {
  getAll: async () => {
    const response = await api.get<Teacher[]>("/professor/user", {
      noAuth: true,
    } as CustomConfig);
    return response.data;
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
