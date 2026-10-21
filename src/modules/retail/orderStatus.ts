import type { Order } from "./types";

export type OrderStatus = "Pending" | "Paid" | "Fulfilled";

/** Order status derived from its fulfillment/invoice dates. */
export function getOrderStatus(order: Order): OrderStatus {
  if (order.fulfillmentDate) return "Fulfilled";
  if (order.invoicePaidDate) return "Paid";
  return "Pending";
}

export const ORDER_STATUS_RANK: Record<OrderStatus, number> = {
  Pending: 0,
  Paid: 1,
  Fulfilled: 2,
};

export const ORDER_STATUS_BADGE_VARIANT: Record<OrderStatus, "default" | "accent" | "outline"> = {
  Pending: "outline",
  Paid: "accent",
  Fulfilled: "default",
};
