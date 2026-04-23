import { scheduleEventService } from "@/services/scheduleEventService";
import { useAuthStore } from "@/store/useAuthStore";
import type { ScheduleEvent } from "@/types/ScheduleEvent.types";
import type { ScheduleFilterValues } from "@/types/ScheduleFilters.types";
import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";

const useSchedules = (filters: ScheduleFilterValues) => {
  const { userData, isAuthenticated } = useAuthStore();
  const [schedules, setSchedules] = useState<ScheduleEvent[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSchedules = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const isDefaultState =
        !filters.professorId && !filters.groupId && !filters.roomId;
      const appliedFilters = {
        ...filters,
        professorId:
          isDefaultState && isAuthenticated && userData?.role === "PROFESSOR"
            ? userData.id
            : filters.professorId,
      };

      const data = await scheduleEventService.get(appliedFilters);
      if (Array.isArray(data)) {
        setSchedules(data);
      } else {
        console.error("Unexpected data format from API:", data);
        setSchedules([]);
        throw new Error(
          "Datele primite nu sunt într-un format valid (Array expected).",
        );
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
  }, [filters, userData, isAuthenticated]);

  useEffect(() => {
    fetchSchedules();
  }, [fetchSchedules]);

  return { schedules, isLoading, error, refetch: fetchSchedules };
};

export default useSchedules;
