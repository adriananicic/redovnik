"use client";
export const dynamic = "force-dynamic";
export const dynamicParams = true;
import { useParams } from "next/navigation";
import { useCounterDetails } from "@/hooks/useCounterDetails";
import { useQueueSocket } from "@/hooks/useQueueSocket";
import { useCallNext } from "@/hooks/useCallNext";

export default function CounterPage() {
  const { id } = useParams();
  const {
    counter,
    queueLength,
    lastCalled,
    setLastCalled,
    setQueueLength,
    loading,
    refreshQueueDetails,
  } = useCounterDetails(id as string);

  useQueueSocket(counter?.queue?.id, refreshQueueDetails);

  const { callNext, busy, noMore, errorMessage } = useCallNext(
    id as string,
    setLastCalled,
    setQueueLength
  );

  if (loading || !counter)
    return <p className="text-center mt-10">Učitavanje…</p>;

  return (
    <div className="max-w-md mx-auto flex flex-col gap-1">
      <h1 className="text-4xl font-bold">{counter.label}</h1>
      <p className="text-gray-500 text-lg">{counter.queue.name}</p>

      <p className="text-gray-600 text-lg mt-6">
        Brojeva u redu:
        <span className="font-semibold px-1">{queueLength ?? "?"}</span>
      </p>

      <button onClick={callNext} className="btn w-full" disabled={busy}>
        {busy ? "Pozivanje…" : "Pozovi sljedeći broj"}
      </button>

      {lastCalled && (
        <div className="text-center mt-4">
          <p className="text-gray-600 text-sm">Pozvan broj:</p>
          <p className="text-4xl font-bold">{lastCalled.number}</p>
        </div>
      )}

      {noMore && (
        <p className="text-red-500 text-sm text-center">
          Trenutno nema novih brojeva.
        </p>
      )}

      {errorMessage && (
        <p className="text-red-500 text-sm text-center">{errorMessage}</p>
      )}
    </div>
  );
}
