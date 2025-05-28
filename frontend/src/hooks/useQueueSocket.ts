import { useEffect } from "react";
import { getSocket } from "@/lib/socket";

export function useQueueSocket(
  queueId: string | undefined,
  refresh: () => void
) {
  useEffect(() => {
    if (!queueId) return;

    const s = getSocket();
    s.emit("join_queue", queueId);

    s.on("ticket_taken", refresh);
    s.on("ticket_called", refresh);

    return () => {
      s.off("ticket_taken", refresh);
      s.off("ticket_called", refresh);
    };
  }, [queueId, refresh]);
}
