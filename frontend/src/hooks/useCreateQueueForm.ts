import { useState } from "react";
import { useAuth, api } from "../context/AuthContext";

export function useCreateQueueForm(onSuccess?: () => void) {
  const { auth } = useAuth();

  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [startsAt, setStartsAt] = useState("");
  const [admins, setAdmins] = useState<string[]>([""]);
  const [error, setError] = useState<string | null>(null);

  const addAdmin = () => setAdmins([...admins, ""]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const counters = admins.map((email, i) => ({
      label: `Šalter ${i + 1}`,
      adminEmail: email,
    }));

    try {
      await api(
        "/api/queue",
        {
          method: "POST",
          body: JSON.stringify({ name, location, startsAt, counters }),
        },
        auth
      );
      setName("");
      setLocation("");
      setStartsAt("");
      setAdmins([""]);
      onSuccess?.();
    } catch (err: any) {
      setError("Greška pri kreiranju reda.");
    }
  };

  return {
    form: { name, location, startsAt, admins },
    setForm: { setName, setLocation, setStartsAt, setAdmins },
    addAdmin,
    handleSubmit,
    error,
  };
}
