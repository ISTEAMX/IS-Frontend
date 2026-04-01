import type { Room } from "@/types/Room.types";

export const calculateTotalCapacity = (rooms: Room[]): number => {
  return rooms.reduce((acc, room) => acc + room.capacity, 0);
};

export const generateLocation = (name: string): string => {
  if (!name || name.length < 4) return "";

  const corp = name[0].toUpperCase();
  const etajChar = name[1];
  const salaRaw = name.slice(2);

  const salaMatch = salaRaw.match(/^([0-9]+)([A-Za-z]?)$/);

  if (!/[A-Z]/.test(corp) || !/[0-9]/.test(etajChar) || !salaMatch) {
    return "";
  }

  const etajLabel = etajChar === "0" ? "Parter" : `Etaj ${etajChar}`;
  const numericPart = parseInt(salaMatch[1], 10);
  const letterPart = salaMatch[2].toUpperCase();

  return `Corp ${corp}, ${etajLabel}, Sala ${numericPart}${letterPart}`;
};
