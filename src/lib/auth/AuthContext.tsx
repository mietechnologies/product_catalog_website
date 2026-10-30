"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import type { AuthState, AuthUser } from "./types";
import { fetchMe, logout } from "./api";
import { BASE_URL } from "@/lib/api/endpoints";

// ── Types ────────────────────────────────────────────────────────────

interface AuthContextValue {
  auth: AuthState | null;
  ready: boolean;
  signIn: (user: AuthUser) => void;
  signOut: () => Promise<void>;
}

// ── Context ──────────────────────────────────────────────────────────

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

  // Ask the backend who is signed in. The session cookie is shared with the
  // main MieTech site, so a sign-in there shows up here too.
  useEffect(() => {
    if (!BASE_URL) {
      setReady(true);
      return;
    }
    let cancelled = false;
    fetchMe().then((result) => {
      if (cancelled) return;
      setAuth(result.ok ? { user: result.data.user } : null);
      setReady(true);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const signIn = useCallback((user: AuthUser) => {
    setAuth({ user });
  }, []);

  const signOut = useCallback(async () => {
    await logout();
    setAuth(null);
  }, []);

  return (
    <AuthContext.Provider value={{ auth, ready, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}
