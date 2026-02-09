/**
 * Auth API functions — login and admin creation.
 *
 * Follows the same fetchJson / ApiResult pattern used by the catalog client.
 */

import type { ApiResult } from "@/lib/types";
import type { AuthResponse } from "./types";
import { endpoints, API_KEY } from "@/lib/api/endpoints";

// ── Generic POST helper ──────────────────────────────────────────────

async function authFetch<T>(
  url: string,
  body: Record<string, string>,
): Promise<ApiResult<T>> {
  try {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    if (API_KEY) {
      headers["x-api-key"] = API_KEY;
    }

    const res = await fetch(url, {
      method: "POST",
      headers,
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => null);
      return {
        ok: false,
        error: data?.message ?? res.statusText,
        status: res.status,
      };
    }

    const data: T = await res.json();
    return { ok: true, data };
  } catch (err) {
    return { ok: false, error: (err as Error).message, status: 0 };
  }
}

// ── Public API ───────────────────────────────────────────────────────

export function loginAdmin(email: string, password: string) {
  return authFetch<AuthResponse>(endpoints.login(), { email, password });
}

export function createAdmin(fields: {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
}) {
  return authFetch<AuthResponse>(endpoints.createAdmin(), fields);
}
