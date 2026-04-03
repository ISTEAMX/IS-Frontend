import { teacherService } from "@/services/teacherService";
import type { Teacher } from "@/types/Teacher.types";
import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";

const useTeachers = () => {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTeachers = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await teacherService.getAll();
      setTeachers(data);
    } catch (err) {
      let message = "Nu s-au putut încărca profesorii.";
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
    fetchTeachers();
  }, [fetchTeachers]);

  return { teachers, isLoading, error, refetch: fetchTeachers };
};

export default useTeachers;
