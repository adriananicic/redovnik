import { useEffect, useState } from "react";
import { getSocket } from "@/lib/socket";

type Ticket = {
  id: string;
  number: number;
  status: "WAITING" | "CALLED" | "DONE";
  counter?: { label: string; id: string };
};

export function useQueueData(queueId: string) {
  const [queue, setQueue] = useState<any>(null);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [myId, setMyId] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    console.log(
      "FETCHING:",
      `${process.env.NEXT_PUBLIC_API_URL}/api/queue/${queueId}`
    );

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/queue/${queueId}`)
      .then((r) => {
        console.log(r);
        return r.json();
      })
      .then((q) => {
        if (cancelled) return;
        setQueue(q);
        setTickets(q.tickets);
        setMyId(localStorage.getItem(`ticket-${queueId}`));
      })
      .catch((er) => console.log("er", er));

    const s = getSocket();
    const onCalled = (t: Ticket) => {
      setTickets((prev) => {
        const exists = prev.some((p) => p.id === t.id);
        if (exists) {
          return prev.map((p) => (p.id === t.id ? t : p));
        } else {
          return [...prev, t];
        }
      });
    };

    s.emit("join_queue", queueId);
    s.on("ticket_called", onCalled);

    return () => {
      cancelled = true;
      s.off("ticket_called", onCalled);
    };
  }, [queueId]);

  return { queue, tickets, setTickets, myId, setMyId };
}
