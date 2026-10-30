/**
 * Auth API functions for the shared MieTech login.
 *
 * Sessions live in an httpOnly cookie set by the main backend, so every call
 * sends `credentials: "include"`. Signing in here also signs you in on the
 * main site, and the reverse.
 */

import type { ApiResult } from "@/lib/types";
import type { AuthLoginResponse, AuthSessionResponse, AuthUser } from "./types";
import { endpoints } from "@/lib/api/endpoints";
import { readError } from "@/lib/api/errors";

export async function loginAdmin(
  email: string,
  password: string,
): Promise<ApiResult<AuthLoginResponse>> {
  try {
    const res = await fetch(endpoints.login(), {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) return readError(res);
    return { ok: true, data: (await res.json()) as AuthLoginResponse };
  } catch (err) {
    return { ok: false, error: (err as Error).message, status: 0 };
  }
}

/** The signed-in user, or an error result (401 when signed out). */
export async function fetchMe(): Promise<ApiResult<{ user: AuthUser }>> {
  try {
    const res = await fetch(endpoints.me(), { credentials: "include" });
    if (!res.ok) return readError(res);
    const json = (await res.json()) as AuthSessionResponse;
    return { ok: true, data: { user: json.user } };
  } catch (err) {
    return { ok: false, error: (err as Error).message, status: 0 };
  }
}

export async function logout(): Promise<void> {
  try {
    await fetch(endpoints.logout(), { method: "POST", credentials: "include" });
  } catch {
    // Signing out locally still matters if the network call fails
  }
}
