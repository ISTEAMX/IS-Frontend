import { groupService } from "@/services/groupService";
import type { Group } from "@/types/Group.types";
import axios from "axios";
import { useCallback, useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";

export type SortOrder = "asc" | "desc" | null;

const useGroups = (sortOrder: SortOrder = "asc") => {
  const [groups, setGroups] = useState<Group[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchGroups = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await groupService.getAll();
      setGroups(Array.isArray(data) ? data : []);
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

  const sortedGroups = useMemo(() => {
    if (!sortOrder) return groups;

    return [...groups].sort((a, b) => {
      const valA = a.identifier.toLowerCase();
      const valB = b.identifier.toLowerCase();

      return sortOrder === "asc"
        ? valA.localeCompare(valB)
        : valB.localeCompare(valA);
    });
  }, [groups, sortOrder]);

  return {
    groups: sortedGroups,
    isLoading,
    error,
    refetch: fetchGroups,
  };
};

export default useGroups;
