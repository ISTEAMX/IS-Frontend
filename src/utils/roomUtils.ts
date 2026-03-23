import type { Room } from "@/types/Room.types";

export const calculateTotalCapacity = (rooms: Room[]): number => {
  return rooms.reduce((acc, room) => acc + room.capacity, 0);
};

export const generateLocation = (name: string): string => {
  if (!name || name.length < 4) return "";

  const corp = name[0].toUpperCase();
  const etajChar = name[1];
  const salaRaw = name.slice(2);

  if (
    !/[A-Z]/.test(corp) ||
    !/[0-9]/.test(etajChar) ||
    !/^[0-9]+$/.test(salaRaw)
  ) {
    return "";
  }

  const etajLabel = etajChar === "0" ? "Parter" : `Etaj ${etajChar}`;
  const salaNumber = parseInt(salaRaw, 10);

  return `Corp ${corp}, ${etajLabel}, Sala ${salaNumber}`;
};
