import { subjectService } from "@/services/subjectService";
import type { Subject } from "@/types/Subject.types";
import axios from "axios";
import { useCallback, useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";

export type SortOrder = "asc" | "desc" | null;

const useSubjects = (sortOrder: SortOrder = "asc") => {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSubjects = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await subjectService.getAll();
      setSubjects(data);
    } catch (err) {
      let message = "Nu s-au putut încărca disciplinele.";
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
    fetchSubjects();
  }, [fetchSubjects]);

  const sortedSubjects = useMemo(() => {
    if (!sortOrder) return subjects;

    return [...subjects].sort((a, b) => {
      const nameA = a.name.toLowerCase();
      const nameB = b.name.toLowerCase();
      const nameComparison = nameA.localeCompare(nameB);

      if (nameComparison !== 0) {
        return sortOrder === "asc" ? nameComparison : -nameComparison;
      }

      const typeA = a.activityType.toLowerCase();
      const typeB = b.activityType.toLowerCase();
      const typeComparison = typeA.localeCompare(typeB);

      return sortOrder === "asc" ? typeComparison : -typeComparison;
    });
  }, [subjects, sortOrder]);

  return { subjects: sortedSubjects, isLoading, error, refetch: fetchSubjects };
};

export default useSubjects;
