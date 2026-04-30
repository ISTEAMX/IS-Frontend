import api, { type CustomConfig } from "@/api/axiosInstance";
import type { Room, RoomDTO } from "@/types/Room.types";
import type { PageResponse } from "@/types/Api.types";

export const roomService = {
  getAll: async () => {
    const response = await api.get<PageResponse<Room>>("/room/user/rooms", {
      noAuth: true,
      params: { size: 200 },
    } as CustomConfig);
    return response.data.content;
  },

  create: async (data: RoomDTO) => {
    const response = await api.post("/room/create", data);
    return response.data;
  },

  update: async (data: RoomDTO) => {
    const response = await api.put("/room/update", data);
    return response.data;
  },

  delete: async (id: number) => {
    const response = await api.delete(`/room/delete/${id}`);
    return response.data;
  },
};
