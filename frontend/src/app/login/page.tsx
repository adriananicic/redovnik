"use client";
export const dynamic = "force-dynamic";
export const dynamicParams = true;
import { useLogin } from "@/hooks/useLogin";

export default function Login() {
  const { email, setEmail, password, setPassword, error, loading, submit } =
    useLogin();

  return (
    <div className="flex items-center justify-center min-h-[70vh]">
      <form className="card flex flex-col gap-2">
        <h1 className="text-2xl font-bold text-center">Prijava</h1>

        <input
          className="input"
          placeholder="E-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className="input"
          type="password"
          placeholder="Lozinka"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {error && <p className="text-red-600 text-sm">{error}</p>}

        <button
          className="btn"
          type="submit"
          onClick={submit}
          disabled={loading}
        >
          {loading ? "Provjera…" : "Prijavi se"}
        </button>
      </form>
    </div>
  );
}
