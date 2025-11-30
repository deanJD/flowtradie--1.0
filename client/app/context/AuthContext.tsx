// client/app/context/AuthContext.tsx
"use client";

import React, { createContext, useContext } from "react";
import { useQuery } from "@apollo/client";
import { ME_QUERY } from "@/app/lib/graphql/queries/me";

interface AuthContextType {
  user: any | null;
  loading: boolean;
  login: (token: string, userData: any) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { data, loading } = useQuery(ME_QUERY);
  const user = data?.me || null;

  // 🔐 LOGIN — STORE TOKEN + REBUILD APOLLO CLIENT
  async function login(token: string, userData: any) {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(userData)); // cache user (optional)

    // 🚀 IMPORTANT — FORCE APOLLO CLIENT TO READ TOKEN
    window.location.href = "/dashboard"; // instead of reload(), redirect here
  }

  // 🔓 LOGOUT — FULL CLEAN
  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login"; // go to login page after logout
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
