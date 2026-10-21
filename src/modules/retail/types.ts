/** Retail types — retailer accounts and orders */

/** A retailer account returned by the pending-retailers endpoint */
export interface PendingRetailer {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  merchantName: string;
  accountType: string;
  accountStatus: string;
  createdAt: string;
}

/** A line item within an order */
export interface OrderLineItem {
  productId: string;
  productCode: string;
  quantity: number;
  unitCost: number;
  totalCost: number;
}

/** An order returned by the orders endpoints */
export interface Order {
  id: string;
  userId: string;
  name: string;
  accountType: string;
  items: OrderLineItem[];
  totalOrderCost: number;
  createdAt: string;
  invoicePaidDate?: string;
  fulfillmentDate?: string;
}
