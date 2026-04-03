import { subjectService } from "@/services/subjectService";
import type { Subject } from "@/types/Subject.types";
import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";

const useSubjects = () => {
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

  return { subjects, isLoading, error, refetch: fetchSubjects };
};

export default useSubjects;
