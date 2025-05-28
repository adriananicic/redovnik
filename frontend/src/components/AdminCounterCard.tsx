import Link from "next/link";

export default function AdminCounterCard({
  id,
  label,
  queueName,
  queueId,
  onDelete,
}: {
  id: string;
  label: string;
  queueName: string;
  queueId: string;
  onDelete: (queueId: string) => void;
}) {
  return (
    <div className=" border-2 flex justify-between border-blue-600 p-4 rounded-xl bg-blue-600/5 hover:bg-blue-600/20 transition-all duration-200">
      <Link href={`/admin/counter/${id}`} className="w-full h-full">
        <p className="font-semibold">{label}</p>
        <p className="text-sm text-gray-500">{queueName}</p>
      </Link>
      <button
        className="text-red-500 hover:underline"
        onClick={() => onDelete(queueId)}
      >
        Obriši
      </button>
    </div>
  );
}
