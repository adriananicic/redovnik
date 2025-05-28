import { useState } from "react";
import { useAuth, api } from "@/context/AuthContext";

export function useCallNext(
  counterId: string,
  setLastCalled: (t: any) => void,
  setQueueLength: (q: any) => void
) {
  const { auth } = useAuth();
  const [busy, setBusy] = useState(false);
  const [noMore, setNoMore] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const callNext = async () => {
    setBusy(true);
    setErrorMessage(null);
    setNoMore(false);

    try {
      const res = await api(
        `/api/queue/${counterId}/call-next`,
        { method: "POST" },
        auth
      );

      if (res?.message === "Nema više brojeva") {
        setNoMore(true);
        return;
      }

      setLastCalled(res);
      setQueueLength((prev: number | null) =>
        prev !== null ? prev - 1 : null
      );
    } catch (e: any) {
      setErrorMessage("Greška pri pozivanju broja.");
    } finally {
      setBusy(false);
    }
  };

  return {
    callNext,
    busy,
    noMore,
    errorMessage,
  };
}
