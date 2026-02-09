"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import type { AuthState, AuthUser } from "./types";

// ── Types ────────────────────────────────────────────────────────────

interface AuthContextValue {
  auth: AuthState | null;
  ready: boolean;
  signIn: (user: AuthUser, token: string) => void;
  signOut: () => void;
}

// ── Context ──────────────────────────────────────────────────────────

const STORAGE_KEY = "mietech-auth";

const AuthContext = createContext<AuthContextValue | null>(null);

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within <AuthProvider>");
  return ctx;
}

// ── Provider ─────────────────────────────────────────────────────────

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [auth, setAuth] = useState<AuthState | null>(null);
  const [ready, setReady] = useState(false);

  // Hydrate from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setAuth(JSON.parse(stored) as AuthState);
      }
    } catch {
      // Ignore corrupt data
    }
    setReady(true);
  }, []);

  const signIn = useCallback((user: AuthUser, token: string) => {
    const state: AuthState = { user, token };
    setAuth(state);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, []);

  const signOut = useCallback(() => {
    setAuth(null);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  return (
    <AuthContext.Provider value={{ auth, ready, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}
