export const dynamic = "force-dynamic";
import Link from "next/link";

export default async function Queues() {
  const queues = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/queue`
  ).then((r) => r.json());
  return (
    <div className="max-w-lg mx-auto flex flex-col gap-4">
      <h1 className="font-bold text-2xl">Dostupni redovi</h1>
      {queues.map((q: any) => (
        <Link
          key={q.id}
          href={`/queues/${q.id}`}
          className="block border-2 border-blue-600 p-4 rounded-xl bg-blue-600/10 hover:bg-blue-600/20 transition-all duration-200"
        >
          <h2 className="font-bold">{q.name}</h2>
          <p>
            {q.location} – {new Date(q.startsAt).toLocaleString()}
          </p>
        </Link>
      ))}
    </div>
  );
}
