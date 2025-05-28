"use client";

import { useParams } from "next/navigation";
import { useQueueData } from "@/hooks/useQueueData";
import { useTakeTicket } from "@/hooks/useTakeTicket";

interface Admin {
  name: string;
}
interface Counter {
  id: string;
  tickets: Ticket[];
  label: string;
  admin: Admin;
}
type Ticket = {
  id: string;
  number: number;
  status: "WAITING" | "CALLED" | "DONE";
  counter?: { label: string; id: string };
};

export default function QueueClient({ queueId }: { queueId: string }) {
  const { id } = useParams();

  if (!id) return <p>Greška: nedostaje ID</p>;

  const { queue, tickets, setTickets, myId, setMyId } = useQueueData(queueId);
  const { takeTicket, taking, error } = useTakeTicket(
    queueId,
    setTickets,
    setMyId
  );

  if (!queue) return <p className="text-center mt-20">Učitavanje…</p>;

  const lastByCounter: Record<string, Ticket | undefined> = {};
  tickets.forEach((t) => {
    if (t.status === "CALLED" && t.counter) lastByCounter[t.counter.id] = t;
  });

  const myTicket = tickets.find((x) => x.id === myId);
  const myNumber = myTicket?.number ?? 0;
  const inFrontCount = tickets.filter(
    (t) =>
      (t.status === "WAITING" || t.status === "CALLED") && t.number < myNumber
  ).length;

  return (
    <div className="max-w-md mx-auto flex flex-col gap-2">
      <h1 className="text-2xl font-bold text-blue-600">{queue.name}</h1>
      <p>
        {queue.location} – {new Date(queue.startsAt).toLocaleString("hr-HR")}
      </p>

      <div className="flex flex-col gap-3 mt-4">
        <h2 className="font-bold text-xl">Šalteri</h2>
        {queue.counters.map((c: Counter) => (
          <div
            key={c.id}
            className="flex justify-between items-center border-2 bg-blue-600/5 border-blue-600 rounded-xl p-4"
          >
            <div className="flex flex-col gap-1">
              <span className="font-semibold">{c.label}</span>
              <span className="font-light text-sm">{c.admin.name}</span>
            </div>
            <span className="font-bold text-2xl rounded-xl text-black bg-red-400 px-4 py-2 h-12 w-12 flex items-center justify-center">
              {lastByCounter[c.id]?.number ?? "—"}
            </span>
          </div>
        ))}
      </div>

      {myId ? (
        <>
          <p className="text-center text-lg">
            Vaš broj:&nbsp;
            <span className="font-bold">{myNumber}</span>
          </p>
          <p className="text-center text-sm text-gray-600">
            Brojeva ispred vas: {inFrontCount}
          </p>
        </>
      ) : (
        <>
          <button className="btn" onClick={takeTicket} disabled={taking}>
            {taking ? "Uzimam…" : "Uzmi svoj broj"}
          </button>
          {error && (
            <p className="text-red-600 text-sm text-center mt-1">{error}</p>
          )}
        </>
      )}
    </div>
  );
}
