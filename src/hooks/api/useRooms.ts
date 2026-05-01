import { roomService } from "@/services/roomService";
import type { Room } from "@/types/Room.types";
import axios from "axios";
import { useCallback, useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";

export type SortOrder = "asc" | "desc" | null;

const useRooms = (sortOrder: SortOrder = "asc") => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRooms = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await roomService.getAll();
      setRooms(Array.isArray(data) ? data : []);
    } catch (err) {
      let message = "Nu s-au putut încărca sălile.";
      if (axios.isAxiosError(err)) {
        message = err.response?.data?.message || message;
      }

      setError(message);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const sortedRooms = useMemo(() => {
    if (!sortOrder) return rooms;

    return [...rooms].sort((a, b) => {
      const valA = a.name.toLowerCase();
      const valB = b.name.toLowerCase();

      return sortOrder === "asc"
        ? valA.localeCompare(valB)
        : valB.localeCompare(valA);
    });
  }, [rooms, sortOrder]);

  useEffect(() => {
    fetchRooms();
  }, [fetchRooms]);

  return { rooms: sortedRooms, isLoading, error, refetch: fetchRooms };
};

export default useRooms;
