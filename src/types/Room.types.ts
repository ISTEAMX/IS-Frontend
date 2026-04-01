import type { ROOM_TYPES } from "@/constants/rooms.constants";

export type RoomType = (typeof ROOM_TYPES)[number];

export interface Room {
  id: number;
  name: string;
  location: string;
  type: RoomType;
  capacity: number;
}

export interface RoomDTO extends Omit<Room, "id"> {
  id?: number;
}
