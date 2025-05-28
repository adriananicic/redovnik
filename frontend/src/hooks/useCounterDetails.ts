import { useEffect, useState } from "react";
import { useAuth, api } from "@/context/AuthContext";

export function useCounterDetails(counterId: string) {
  const { auth } = useAuth();

  const [loading, setLoading] = useState(true);
  const [counter, setCounter] = useState<any>(null);
  const [lastCalled, setLastCalled] = useState<any>(null);
  const [queueLength, setQueueLength] = useState<number | null>(null);

  const fetchDetails = async (cid: string, queueId: string) => {
    const q = await api(`/api/queue/${queueId}`, {}, auth);
    const waitingCount = q.tickets.filter(
      (t: any) => t.status === "WAITING"
    ).length;
    const current = q.tickets.find(
      (t: any) => t.status === "CALLED" && t.counter?.id === cid
    );
    setQueueLength(waitingCount);
    setLastCalled(current || null);
  };

  useEffect(() => {
    if (!auth || !counterId) return;

    api(`/api/admin/counters`, {}, auth)
      .then((counters) => {
        const found = counters.find((c: any) => c.id === counterId);
        if (!found) return;
        setCounter(found);

        if (found.queue?.id) {
          fetchDetails(found.id, found.queue.id);
        }
      })
      .finally(() => setLoading(false));
  }, [auth, counterId]);

  return {
    counter,
    queueLength,
    lastCalled,
    setLastCalled,
    setQueueLength,
    loading,
    refreshQueueDetails: () => {
      if (counter?.queue?.id) {
        fetchDetails(counter.id, counter.queue.id);
      }
    },
  };
}
