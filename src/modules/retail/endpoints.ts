/**
 * Retail API endpoint definitions — retailer accounts and orders.
 *
 * Uses the same backend base URL as the catalog endpoints.
 */

import { BASE_URL } from "@/lib/api/endpoints";

export const retailEndpoints = {
  /** POST /api/users/retailer — create retailer account (pending approval) */
  createRetailer: () => `${BASE_URL}/api/users/retailer`,

  /** GET /api/users/retailers/pending — list pending retailer accounts */
  pendingRetailers: () => `${BASE_URL}/api/users/retailers/pending`,

  /** GET /api/users/retailers/approved — list approved retailer accounts */
  approvedRetailers: () => `${BASE_URL}/api/users/retailers/approved`,

  /** PATCH /api/users/retailers/:id/approve — approve a retailer */
  approveRetailer: (id: string) =>
    `${BASE_URL}/api/users/retailers/${encodeURIComponent(id)}/approve`,

  /** PATCH /api/users/retailers/:id/reject — reject a retailer */
  rejectRetailer: (id: string) =>
    `${BASE_URL}/api/users/retailers/${encodeURIComponent(id)}/reject`,

  /** POST /api/orders — create a new order */
  createOrder: () => `${BASE_URL}/api/orders`,

  /** GET /api/orders/unfulfilled — list unfulfilled orders (paginated) */
  unfulfilledOrders: () => `${BASE_URL}/api/orders/unfulfilled`,

  /** GET /api/orders/:id — get a single order by ID */
  order: (id: string) =>
    `${BASE_URL}/api/orders/${encodeURIComponent(id)}`,

  /** GET /api/orders/mine — list the current user's own orders (paginated) */
  myOrders: () => `${BASE_URL}/api/orders/mine`,

  /** GET /api/orders/mine/:id — get one of the current user's own orders by ID */
  myOrder: (id: string) =>
    `${BASE_URL}/api/orders/mine/${encodeURIComponent(id)}`,
} as const;
