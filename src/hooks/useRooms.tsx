import api from "@/api/axiosInstance";
import type { Room } from "@/types/Room.types";
import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";

const useRooms = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRooms = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await api.get<Room[]>("/room/user/rooms");
      setRooms(response.data);
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

  useEffect(() => {
    fetchRooms();
  }, [fetchRooms]);

  return { rooms, isLoading, error, refetch: fetchRooms };
};

export default useRooms;
