import { scheduleEventService } from "@/services/scheduleEventService";
import type { ScheduleEvent } from "@/types/ScheduleEvent.types";
import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";

const useSchedules = () => {
  const [schedules, setSchedules] = useState<ScheduleEvent[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSchedules = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await scheduleEventService.getAll();
      if (Array.isArray(data)) {
        setSchedules(data);
      } else {
        console.error("Unexpected data format from API:", data);
        setSchedules([]);
        throw new Error("Datele primite nu sunt într-un format valid (Array expected).");
      }
    } catch (err) {
      let message = "Nu s-au putut încărca evenimentele.";
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
    fetchSchedules();
  }, [fetchSchedules]);

  return { schedules, isLoading, error, refetch: fetchSchedules };
};

export default useSchedules;
