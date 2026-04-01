import api from "@/api/axiosInstance";
import type { Group } from "@/types/Group.types";
import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";

const useGroups = () => {
  const [groups, setGroups] = useState<Group[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchGroups = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await api.get<Group[]>("/group/user/groups");
      setGroups(response.data);
    } catch (err) {
      let message = "Nu s-au putut încărca grupele.";
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
    fetchGroups();
  }, [fetchGroups]);

  return { groups, isLoading, error, refetch: fetchGroups };
};

export default useGroups;
