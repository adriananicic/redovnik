import { useEffect, useState, useCallback } from "react";
import { useAuth, api } from "../context/AuthContext";

export interface Counter {
  id: string;
  label: string;
  queue: { name: string; id: string };
}

export function useCounters() {
  const { auth } = useAuth();
  const [counters, setCounters] = useState<Counter[]>([]);
  const [loading, setLoading] = useState(true);

  const refetch = useCallback(() => {
    if (!auth) return;

    setLoading(true);
    api("/api/admin/counters", {}, auth)
      .then(setCounters)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [auth]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  const deleteQueue = async (queueId: string) => {
    if (!auth) return;
    await api(`/api/queue/${queueId}`, { method: "DELETE" }, auth);
    refetch();
  };

  return { counters, loading, deleteQueue, refetch };
}
