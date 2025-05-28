import { useState, useCallback, useEffect } from "react";
import { api } from "@/context/AuthContext";

export function useQueues(auth: any) {
  const [queues, setQueues] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchQueues = useCallback(async () => {
    if (!auth) return;
    setLoading(true);
    const data = await api("/api/queue", {}, auth);
    setQueues(data);
    setLoading(false);
  }, [auth]);

  useEffect(() => {
    fetchQueues();
  }, [fetchQueues]);

  return { queues, loading, refetch: fetchQueues };
}
