import api, { type CustomConfig } from "@/api/axiosInstance";
import type {
  ScheduleEvent,
  ScheduleEventDTO,
} from "@/types/ScheduleEvent.types";
import type { ScheduleFilterValues } from "@/types/ScheduleFilters.types";
import type { PageResponse } from "@/types/Api.types";

/**
 * Ensures startingHour and endingHour are actual numbers.
 * The backend sends them as strings (e.g. "8"), but the frontend types expect numbers.
 */
function normalizeEvent(event: ScheduleEvent): ScheduleEvent {
  return {
    ...event,
    startingHour: Number(event.startingHour),
    endingHour: Number(event.endingHour),
  };
}

export const scheduleEventService = {
  get: async (filters: ScheduleFilterValues) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { specialization: _s, year: _y, semester: _sem, ...apiFilters } = filters;
    const cleanParams = Object.fromEntries(
      Object.entries(apiFilters).filter(([, v]) => v != null),
    );

    const response = await api.get<PageResponse<ScheduleEvent>>("/schedule/user/filter", {
      params: { ...cleanParams, size: 200 },
      noAuth: true,
    } as CustomConfig);
    return (response.data?.content ?? []).map(normalizeEvent);
  },

  getAll: async () => {
    const response = await api.get<PageResponse<ScheduleEvent>>("/schedule/user", {
      noAuth: true,
      params: { size: 200 },
    } as CustomConfig);
    return (response.data?.content ?? []).map(normalizeEvent);
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
