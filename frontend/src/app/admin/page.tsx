"use client";
export const dynamic = "force-dynamic";
export const dynamicParams = true;

import { useCreateQueueForm } from "../../hooks/useCreateQueueForm";
import { useCounters } from "../../hooks/useCounters";
import Link from "next/link";
import AdminCounterCard from "@/components/AdminCounterCard";

export default function AdminHome() {
  const { counters, loading, deleteQueue, refetch } = useCounters();
  const {
    form: { name, location, startsAt, admins },
    setForm: { setName, setLocation, setStartsAt, setAdmins },
    addAdmin,
    handleSubmit,
    error,
  } = useCreateQueueForm(refetch);

  if (loading) return <p className="text-center mt-20">Učitavanje…</p>;

  return (
    <div className="max-w-md mx-auto flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold">Moji šalteri</h1>
        {counters.length === 0 && (
          <p className="text-gray-500">Nema dodijeljenih šaltera.</p>
        )}
        {counters.map((c) => (
          <AdminCounterCard
            key={c.id}
            id={c.id}
            label={c.label}
            queueName={c.queue.name}
            queueId={c.queue.id}
            onDelete={deleteQueue}
          />
        ))}
      </div>

      <div className="card">
        <h2 className="text-lg font-semibold">Kreiraj novi red</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-2">
          <input
            className="input"
            placeholder="Naziv reda"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            className="input"
            placeholder="Lokacija"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
          <input
            className="input"
            type="datetime-local"
            value={startsAt}
            onChange={(e) => setStartsAt(e.target.value)}
          />

          {admins.map((email, i) => (
            <input
              key={i}
              className="input"
              placeholder={`Email za šalter ${i + 1}`}
              value={email}
              onChange={(e) => {
                const updated = [...admins];
                updated[i] = e.target.value;
                setAdmins(updated);
              }}
            />
          ))}

          <button type="button" className="btn" onClick={addAdmin}>
            Dodaj šalter
          </button>
          <button type="submit" className="btn w-full">
            Kreiraj red
          </button>
        </form>

        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
      </div>
    </div>
  );
}
