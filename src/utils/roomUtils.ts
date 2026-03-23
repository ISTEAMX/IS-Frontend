import type { Room } from "@/types/Room.types";

export const calculateTotalCapacity = (rooms: Room[]): number => {
  return rooms.reduce((acc, room) => acc + room.capacity, 0);
};
