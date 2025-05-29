export const dynamic = "force-dynamic";
export const dynamicParams = true;
import QueueClient from "../QueueClient";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <QueueClient queueId={id} />;
}
