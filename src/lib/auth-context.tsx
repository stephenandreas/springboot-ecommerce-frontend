"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

import { decodeRole, login as loginApi, register as registerApi } from "@/lib/auth";
import type { Role } from "@/types";

interface AuthState {
  token: string | null;
  email: string | null;
  role: Role | null;
  isReady: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, fullName: string) => Promise<void>;
  logout: () => void;
}

const STORAGE_KEY = "sc_auth";
const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as { token: string; email: string };
        // Client-only hydration from localStorage (not available during SSR), so this
        // one-time sync-in-effect is intentional.
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setToken(parsed.token);
        setEmail(parsed.email);
      }
    } catch {
      // ignore corrupt storage
    }
    setIsReady(true);
  }, []);

  const persist = useCallback((nextToken: string, nextEmail: string) => {
    setToken(nextToken);
    setEmail(nextEmail);
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ token: nextToken, email: nextEmail }));
  }, []);

  const login = useCallback(
    async (e: string, password: string) => {
      const tokens = await loginApi({ email: e, password });
      persist(tokens.accessToken, e);
    },
    [persist],
  );

  const register = useCallback(
    async (e: string, password: string, fullName: string) => {
      const tokens = await registerApi({ email: e, password, fullName });
      persist(tokens.accessToken, e);
    },
    [persist],
  );

  const logout = useCallback(() => {
    setToken(null);
    setEmail(null);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  const value = useMemo<AuthState>(
    () => ({
      token,
      email,
      role: token ? decodeRole(token) : null,
      isReady,
      login,
      register,
      logout,
    }),
    [token, email, isReady, login, register, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthState {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within <AuthProvider>");
  return ctx;
}
