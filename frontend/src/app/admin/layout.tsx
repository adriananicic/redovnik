"use client";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <ProtectedRoute>{children}</ProtectedRoute>;
}
