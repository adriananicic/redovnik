import { useState } from "react";

export function useTakeTicket(
  queueId: string,
  setTickets: Function,
  setMyId: Function
) {
  const [taking, setTaking] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function takeTicket() {
    if (taking) return;

    setTaking(true);
    setError(null);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/queue/${queueId}/ticket`,
        {
          method: "POST",
        }
      );

      const t = await res.json();

      if (!t?.id) throw new Error("Neispravan odgovor s API-ja");

      localStorage.setItem(`ticket-${queueId}`, t.id);
      setMyId(t.id);
      setTickets((prev: any[]) => [...prev, t]);
    } catch (err) {
      setError("Greška prilikom uzimanja broja.");
    } finally {
      setTaking(false);
    }
  }

  return { takeTicket, taking, error };
}
