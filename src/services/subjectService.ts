import api, { type CustomConfig } from "@/api/axiosInstance";
import type { Subject, SubjectDTO } from "@/types/Subject.types";
import type { PageResponse } from "@/types/Api.types";

export const subjectService = {
  getAll: async () => {
    const response = await api.get<PageResponse<Subject>>("/subject/user", {
      noAuth: true,
      params: { size: 200 },
    } as CustomConfig);
    return response.data.content;
  },

  create: async (data: SubjectDTO) => {
    const response = await api.post("/subject/create", data);
    return response.data;
  },

  update: async (data: SubjectDTO) => {
    const response = await api.put("/subject/update", data);
    return response.data;
  },

  delete: async (id: number) => {
    const response = await api.delete(`/subject/delete/${id}`);
    return response.data;
  },
};
