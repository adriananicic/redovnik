"use client";
import { AuthProvider } from "@/context/AuthContext";
import React, { ReactNode } from "react";
import Header from "../components/Header";

export const Providers = ({ children }: { children: ReactNode }) => {
  return (
    <AuthProvider>
      <Header />
      {children}
    </AuthProvider>
  );
};
