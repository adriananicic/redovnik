"use client";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import React, { ReactNode } from "react";

const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const { push } = useRouter();
  const { auth } = useAuth();

  if (auth === "UNAUTHANTICATED") {
    push("/login");
  }
  return children;
};

export default ProtectedRoute;
