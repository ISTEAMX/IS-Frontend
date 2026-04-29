import api, { type CustomConfig } from "@/api/axiosInstance";
import type {
  ScheduleEvent,
  ScheduleEventDTO,
} from "@/types/ScheduleEvent.types";
import type { ScheduleFilterValues } from "@/types/ScheduleFilters.types";

export const scheduleEventService = {
  get: async (filters: ScheduleFilterValues) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { specialization: _s, year: _y, semester: _sem, ...apiFilters } = filters;
    const cleanParams = Object.fromEntries(
      Object.entries(apiFilters).filter(([, v]) => v != null),
    );

    const response = await api.get<ScheduleEvent[]>("/schedule/user/filter", {
      params: cleanParams,
      noAuth: true,
    } as CustomConfig);
    return response.data;
  },

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

  approve: async (id: number) => {
    const response = await api.patch(`/schedule/approve/${id}`);
    return response.data;
  },

  reject: async (id: number) => {
    const response = await api.delete(`/schedule/delete/${id}`);
    return response.data;
  },
};
