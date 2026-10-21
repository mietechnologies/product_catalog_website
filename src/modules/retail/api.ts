/**
 * Retail API functions — retailer registration/approval and orders.
 *
 * Follows the same fetch / ApiResult pattern used by the auth client.
 */

import type { ApiResult } from "@/lib/types";
import type { AuthUser } from "@/lib/auth/types";
import { authedHeaders } from "@/lib/auth/api";
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

export async function fetchApprovedRetailers(
  token: string,
): Promise<ApiResult<{ retailers: PendingRetailer[] }>> {
  try {
    const res = await fetch(endpoints.approvedRetailers(), {
      headers: { Authorization: `Bearer ${token}` },
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

export async function fetchPendingRetailers(
  token: string,
): Promise<ApiResult<{ retailers: PendingRetailer[] }>> {
  try {
    const res = await fetch(endpoints.pendingRetailers(), {
      headers: { Authorization: `Bearer ${token}` },
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
  token: string,
): Promise<ApiResult<unknown>> {
  try {
    const res = await fetch(url, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${token}` },
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

export function approveRetailer(id: string, token: string) {
  return patchRetailer(endpoints.approveRetailer(id), token);
}

export function rejectRetailer(id: string, token: string) {
  return patchRetailer(endpoints.rejectRetailer(id), token);
}


// ── Orders ───────────────────────────────────────────────────────────

export async function createOrder(
  token: string,
  items: { productCode: string; quantity: number }[],
): Promise<ApiResult<{ order: Order }>> {
  try {
    const res = await fetch(endpoints.createOrder(), {
      method: "POST",
      headers: { ...authedHeaders(token), "Content-Type": "application/json" },
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
  token: string,
  page = 1,
  limit = 20,
): Promise<
  ApiResult<{ orders: Order[]; page: number; totalPages: number; totalItems: number }>
> {
  try {
    const url = `${endpoints.unfulfilledOrders()}?page=${page}&limit=${limit}`;
    const res = await fetch(url, {
      headers: authedHeaders(token),
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
  token: string,
): Promise<ApiResult<{ order: Order }>> {
  try {
    const res = await fetch(endpoints.order(id), {
      headers: authedHeaders(token),
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
  token: string,
  page = 1,
  limit = 100,
): Promise<
  ApiResult<{ orders: Order[]; page: number; totalPages: number; totalItems: number }>
> {
  try {
    const url = `${endpoints.myOrders()}?page=${page}&limit=${limit}`;
    const res = await fetch(url, {
      headers: authedHeaders(token),
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
  token: string,
): Promise<ApiResult<{ order: Order }>> {
  try {
    const res = await fetch(endpoints.myOrder(id), {
      headers: authedHeaders(token),
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
