import api, { type CustomConfig } from "@/api/axiosInstance";
import type { Room, RoomDTO } from "@/types/Room.types";

export const roomService = {
  getAll: async () => {
    const response = await api.get<Room[]>("/room/user/rooms", {
      noAuth: true,
    } as CustomConfig);
    return response.data;
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
