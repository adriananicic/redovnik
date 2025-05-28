"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function Header() {
  const { auth, logout } = useAuth();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const Item = (href: string, label: string) => (
    <Link
      href={href}
      className={`px-4 py-2 rounded-md ${
        pathname === href ? "bg-gray-900 text-white" : "hover:bg-gray-200"
      }`}
    >
      {label}
    </Link>
  );

  return (
    <header className="sticky top-0 bg-white shadow z-50">
      <div className="max-w-5xl mx-auto flex justify-between items-center p-4">
        <Link
          href="/"
          className="font-black text-xl tracking-wider select-none"
        >
          <span className="text-blue-600">Red</span>ovnik
        </Link>

        {!mounted ? (
          <nav>{Item("/", "Redovi")}</nav>
        ) : (
          <nav className="flex gap-2 items-center">
            {auth === "UNAUTHANTICATED" && Item("/", "Redovi")}
            {auth !== "UNAUTHANTICATED" ? (
              <>
                {Item("/admin", "Admin")}
                <button
                  onClick={logout}
                  className="px-4 py-2 rounded-md text-red-500 hover:bg-red-100"
                >
                  Odjava
                </button>
              </>
            ) : (
              Item("/login", "Prijava")
            )}
          </nav>
        )}
      </div>
    </header>
  );
}
