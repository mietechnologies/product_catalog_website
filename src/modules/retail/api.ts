/**
 * Retail API functions — retailer registration/approval and orders.
 *
 * Follows the same fetch / ApiResult pattern used by the auth client, and
 * relies on the shared MieTech session cookie for auth.
 *
 * NOTE: the retail routes have not been ported to the shared backend yet.
 * Retail is off by default (NEXT_PUBLIC_FEATURE_RETAIL), so these calls are
 * not reachable until that port happens.
 */

import type { ApiResult } from "@/lib/types";
import type { AuthUser } from "@/lib/auth/types";
import { retailEndpoints as endpoints } from "./endpoints";
import type { Order, PendingRetailer } from "./types";

export async function createRetailer(fields: {
  email: string;
  firstName: string;
  lastName: string;
  merchantName: string;
  password: string;
}): Promise<ApiResult<{ status: string; data: { user: AuthUser } }>> {
  try {
    const res = await fetch(endpoints.createRetailer(), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(fields),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => null);
      return {
        ok: false,
        error: data?.message ?? res.statusText,
        status: res.status,
      };
    }

    const data = await res.json();
    return { ok: true, data };
  } catch (err) {
    return { ok: false, error: (err as Error).message, status: 0 };
  }
}

// ── Retailer management (admin) ─────────────────────────────────────

export async function fetchApprovedRetailers(): Promise<ApiResult<{ retailers: PendingRetailer[] }>> {
  try {
    const res = await fetch(endpoints.approvedRetailers(), {
      credentials: "include",
    });

    if (!res.ok) {
      const body = await res.json().catch(() => null);
      return {
        ok: false,
        error: body?.message ?? res.statusText,
        status: res.status,
      };
    }

    const json = await res.json();
    return { ok: true, data: { retailers: json.data.retailers } };
  } catch (err) {
    return { ok: false, error: (err as Error).message, status: 0 };
  }
}

export async function fetchPendingRetailers(): Promise<ApiResult<{ retailers: PendingRetailer[] }>> {
  try {
    const res = await fetch(endpoints.pendingRetailers(), {
      credentials: "include",
    });

    if (!res.ok) {
      const body = await res.json().catch(() => null);
      return {
        ok: false,
        error: body?.message ?? res.statusText,
        status: res.status,
      };
    }

    const json = await res.json();
    return { ok: true, data: { retailers: json.data.retailers } };
  } catch (err) {
    return { ok: false, error: (err as Error).message, status: 0 };
  }
}

async function patchRetailer(
  url: string,
): Promise<ApiResult<unknown>> {
  try {
    const res = await fetch(url, {
      method: "PATCH",
      credentials: "include",
    });

    if (!res.ok) {
      const body = await res.json().catch(() => null);
      return {
        ok: false,
        error: body?.message ?? res.statusText,
        status: res.status,
      };
    }

    const data = await res.json();
    return { ok: true, data };
  } catch (err) {
    return { ok: false, error: (err as Error).message, status: 0 };
  }
}

export function approveRetailer(id: string) {
  return patchRetailer(endpoints.approveRetailer(id));
}

export function rejectRetailer(id: string) {
  return patchRetailer(endpoints.rejectRetailer(id));
}


// ── Orders ───────────────────────────────────────────────────────────

export async function createOrder(
  items: { productCode: string; quantity: number }[],
): Promise<ApiResult<{ order: Order }>> {
  try {
    const res = await fetch(endpoints.createOrder(), {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items }),
    });

    if (!res.ok) {
      const body = await res.json().catch(() => null);
      return {
        ok: false,
        error: body?.message ?? res.statusText,
        status: res.status,
      };
    }

    const json = await res.json();
    return { ok: true, data: { order: json.data.order } };
  } catch (err) {
    return { ok: false, error: (err as Error).message, status: 0 };
  }
}

export async function fetchUnfulfilledOrders(
  page = 1,
  limit = 20,
): Promise<
  ApiResult<{ orders: Order[]; page: number; totalPages: number; totalItems: number }>
> {
  try {
    const url = `${endpoints.unfulfilledOrders()}?page=${page}&limit=${limit}`;
    const res = await fetch(url, {
      credentials: "include",
    });

    if (!res.ok) {
      const body = await res.json().catch(() => null);
      return {
        ok: false,
        error: body?.message ?? res.statusText,
        status: res.status,
      };
    }

    const json = await res.json();
    return {
      ok: true,
      data: {
        orders: json.data.orders,
        page: json.page,
        totalPages: json.totalPages,
        totalItems: json.totalItems,
      },
    };
  } catch (err) {
    return { ok: false, error: (err as Error).message, status: 0 };
  }
}

export async function fetchOrderById(
  id: string,
): Promise<ApiResult<{ order: Order }>> {
  try {
    const res = await fetch(endpoints.order(id), {
      credentials: "include",
    });

    if (!res.ok) {
      const body = await res.json().catch(() => null);
      return {
        ok: false,
        error: body?.message ?? res.statusText,
        status: res.status,
      };
    }

    const json = await res.json();
    return { ok: true, data: { order: json.data.order } };
  } catch (err) {
    return { ok: false, error: (err as Error).message, status: 0 };
  }
}

export async function fetchMyOrders(
  page = 1,
  limit = 100,
): Promise<
  ApiResult<{ orders: Order[]; page: number; totalPages: number; totalItems: number }>
> {
  try {
    const url = `${endpoints.myOrders()}?page=${page}&limit=${limit}`;
    const res = await fetch(url, {
      credentials: "include",
    });

    if (!res.ok) {
      const body = await res.json().catch(() => null);
      return {
        ok: false,
        error: body?.message ?? res.statusText,
        status: res.status,
      };
    }

    const json = await res.json();
    return {
      ok: true,
      data: {
        orders: json.data.orders,
        page: json.page,
        totalPages: json.totalPages,
        totalItems: json.totalItems,
      },
    };
  } catch (err) {
    return { ok: false, error: (err as Error).message, status: 0 };
  }
}

export async function fetchMyOrderById(
  id: string,
): Promise<ApiResult<{ order: Order }>> {
  try {
    const res = await fetch(endpoints.myOrder(id), {
      credentials: "include",
    });

    if (!res.ok) {
      const body = await res.json().catch(() => null);
      return {
        ok: false,
        error: body?.message ?? res.statusText,
        status: res.status,
      };
    }

    const json = await res.json();
    return { ok: true, data: { order: json.data.order } };
  } catch (err) {
    return { ok: false, error: (err as Error).message, status: 0 };
  }
}
