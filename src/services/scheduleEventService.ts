import api, { type CustomConfig } from "@/api/axiosInstance";
import type {
  ScheduleEvent,
  ScheduleEventDTO,
} from "@/types/ScheduleEvent.types";

export const scheduleEventService = {
  getAll: async () => {
    const response = await api.get<ScheduleEvent[]>("/schedule/user", {
      noAuth: true,
    } as CustomConfig);
    return response.data;
  },

  create: async (data: ScheduleEventDTO) => {
    const response = await api.post("/schedule/add", data);
    return response.data;
  },

  update: async (data: ScheduleEventDTO) => {
    const response = await api.put("/schedule/update", data);
    return response.data;
  },

  delete: async (id: number) => {
    const response = await api.delete(`/schedule/delete/${id}`);
    return response.data;
  },
};
