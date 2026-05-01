import { teacherService } from "@/services/teacherService";
import type { Teacher } from "@/types/Teacher.types";
import axios from "axios";
import { useCallback, useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";

export type SortOrder = "asc" | "desc" | null;

const useTeachers = (sortOrder: SortOrder = "asc") => {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTeachers = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await teacherService.getAll();
      setTeachers(Array.isArray(data) ? data : []);
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

  const sortedTeachers = useMemo(() => {
    if (!sortOrder) return teachers;

    return [...teachers].sort((a, b) => {
      const lnA = a.lastName.toLowerCase();
      const lnB = b.lastName.toLowerCase();
      const lastNameComparison = lnA.localeCompare(lnB);

      if (lastNameComparison !== 0) {
        return sortOrder === "asc" ? lastNameComparison : -lastNameComparison;
      }

      const fnA = a.firstName.toLowerCase();
      const fnB = b.firstName.toLowerCase();
      const firstNameComparison = fnA.localeCompare(fnB);

      return sortOrder === "asc" ? firstNameComparison : -firstNameComparison;
    });
  }, [teachers, sortOrder]);

  return { teachers: sortedTeachers, isLoading, error, refetch: fetchTeachers };
};

export default useTeachers;
