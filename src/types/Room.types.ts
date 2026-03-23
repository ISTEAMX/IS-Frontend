import type { ROOM_TYPES } from "@/constants/rooms.constants";

export type RoomType = (typeof ROOM_TYPES)[number];

export type Room = {
  id: string;
  name: string;
  location: string;
  type: RoomType;
  capacity: number;
};
