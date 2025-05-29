"use client";
import { useRouter } from "next/navigation";
import {
  createContext,
  useState,
  useContext,
  useEffect,
  ReactNode,
} from "react";

type Auth = { token: string; name: string };
type Ctx = {
  auth: Auth | "UNAUTHANTICATED" | undefined;
  login: (a: Auth) => void;
  logout: () => void;
};
const AuthCtx = createContext<Ctx>(null as any);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [auth, setAuth] = useState<Auth | "UNAUTHANTICATED">();

  useEffect(() => {
    const stored = localStorage.getItem("auth");
    if (stored) {
      setAuth(JSON.parse(stored));
    } else {
      setAuth("UNAUTHANTICATED");
    }
  }, []);

  const login = (a: Auth) => {
    localStorage.setItem("auth", JSON.stringify(a));
    setAuth(a);
  };
  const logout = () => {
    localStorage.removeItem("auth");
    setAuth("UNAUTHANTICATED");
  };

  return (
    <AuthCtx.Provider value={{ auth, login, logout }}>
      {children}
    </AuthCtx.Provider>
  );
}
export const useAuth = () => useContext(AuthCtx);

export async function api(
  url: string,
  init: RequestInit = {},
  auth?: Auth | "UNAUTHANTICATED"
) {
  if (!auth || auth === "UNAUTHANTICATED") {
    return;
  }
  const headers = { ...init.headers, Authorization: `Bearer ${auth.token}` };

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${url}`, {
    ...init,
    headers: { "Content-Type": "application/json", ...headers },
    cache: "no-store",
  });

  const json = await res.json();
  if (!res.ok) throw new Error(json?.error || "Greška");

  return json;
}
