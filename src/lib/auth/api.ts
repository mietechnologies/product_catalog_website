/**
 * Auth API functions — login and admin creation.
 *
 * Follows the same fetchJson / ApiResult pattern used by the catalog client.
 */

import type { ApiResult } from "@/lib/types";
import type { AuthResponse, AuthUser } from "./types";
import { endpoints } from "@/lib/api/endpoints";

// ── Generic POST helper ──────────────────────────────────────────────

async function authFetch<T>(
  url: string,
  body: Record<string, string>,
  apiKeyOverride?: string,
): Promise<ApiResult<T>> {
  try {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    if (apiKeyOverride) {
      headers["x-api-key"] = apiKeyOverride;
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

export async function validateApiKey(apiKey: string): Promise<boolean> {
  try {
    const res = await fetch(endpoints.validateApiKey(), {
      method: "POST",
      headers: { "x-api-key": apiKey },
    });
    if (!res.ok) return false;
    const data = await res.json();
    return data.valid === true;
  } catch {
    return false;
  }
}

export function loginAdmin(email: string, password: string) {
  return authFetch<AuthResponse>(endpoints.login(), { email, password });
}

// ── User profile ────────────────────────────────────────────────────

export function authedHeaders(token: string): Record<string, string> {
  return { Authorization: `Bearer ${token}` };
}

export async function fetchMe(
  token: string,
): Promise<ApiResult<{ user: AuthUser }>> {
  try {
    const res = await fetch(endpoints.me(), {
      headers: authedHeaders(token),
    });

    if (!res.ok) {
      const body = await res.json().catch(() => null);
      return { ok: false, error: body?.message ?? res.statusText, status: res.status };
    }

    const json = await res.json();
    return { ok: true, data: { user: json.data.user } };
  } catch (err) {
    return { ok: false, error: (err as Error).message, status: 0 };
  }
}

export async function updateMe(
  token: string,
  fields: { firstName?: string; lastName?: string; email?: string; merchantName?: string },
): Promise<ApiResult<{ user: AuthUser }>> {
  try {
    const res = await fetch(endpoints.updateMe(), {
      method: "PATCH",
      headers: { ...authedHeaders(token), "Content-Type": "application/json" },
      body: JSON.stringify(fields),
    });

    if (!res.ok) {
      const body = await res.json().catch(() => null);
      return { ok: false, error: body?.message ?? res.statusText, status: res.status };
    }

    const json = await res.json();
    return { ok: true, data: { user: json.data.user } };
  } catch (err) {
    return { ok: false, error: (err as Error).message, status: 0 };
  }
}

export async function updatePassword(
  token: string,
  currentPassword: string,
  newPassword: string,
): Promise<ApiResult<{ token: string; user: AuthUser }>> {
  try {
    const res = await fetch(endpoints.updatePassword(), {
      method: "PATCH",
      headers: { ...authedHeaders(token), "Content-Type": "application/json" },
      body: JSON.stringify({ currentPassword, newPassword }),
    });

    if (!res.ok) {
      const body = await res.json().catch(() => null);
      return { ok: false, error: body?.message ?? res.statusText, status: res.status };
    }

    const json = await res.json();
    return { ok: true, data: { token: json.token, user: json.data.user } };
  } catch (err) {
    return { ok: false, error: (err as Error).message, status: 0 };
  }
}

export function createAdmin(
  fields: {
    email: string;
    firstName: string;
    lastName: string;
    password: string;
  },
  apiKey?: string,
) {
  return authFetch<AuthResponse>(endpoints.createAdmin(), fields, apiKey);
}
