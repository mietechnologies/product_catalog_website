"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Card from "@/components/ui/Card";
import { useToast } from "@/components/ui/Toast";
import { useAuth } from "@/lib/auth/AuthContext";
import { fetchOrderById } from "../api";
import type { Order } from "../types";

export default function AdminOrderDetailScreen() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { toast } = useToast();
  const { auth, ready } = useAuth();

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  // Redirect non-admin users
  useEffect(() => {
    if (ready && (!auth || auth.user.role !== "admin")) {
      router.replace("/login");
    }
  }, [ready, auth, router]);

  // Fetch order
  useEffect(() => {
    if (!auth || !id) return;

    async function load() {
      setLoading(true);
      const result = await fetchOrderById(id);
      if (result.ok) {
        setOrder(result.data.order);
      } else {
        toast(result.error, "error");
      }
      setLoading(false);
    }

    load();
  }, [auth, id, toast]);

  if (!ready || !auth || auth.user.role !== "admin") {
    return null;
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-10">
        <p className="text-neutral">Loading...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-10">
        <p className="text-neutral">Order not found.</p>
      </div>
    );
  }

  const totalItems = order.items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <Link
        href="/admin/orders/pending"
        className="text-sm text-accent hover:underline mb-4 inline-block"
      >
        &larr; Back to Pending Orders
      </Link>

      <h1 className="text-2xl font-bold text-primary mb-6">Order Details</h1>

      {/* Order summary */}
      <Card className="p-6 mb-6">
        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4 text-sm">
          <div>
            <dt className="text-xs font-medium text-neutral uppercase tracking-wide">Order ID</dt>
            <dd className="mt-1 text-primary-dark font-medium">{order.id}</dd>
          </div>
          <div>
            <dt className="text-xs font-medium text-neutral uppercase tracking-wide">Customer Name</dt>
            <dd className="mt-1 text-neutral-dark">{order.name}</dd>
          </div>
          <div>
            <dt className="text-xs font-medium text-neutral uppercase tracking-wide">Account Type</dt>
            <dd className="mt-1 text-neutral-dark capitalize">{order.accountType}</dd>
          </div>
          <div>
            <dt className="text-xs font-medium text-neutral uppercase tracking-wide">Order Date</dt>
            <dd className="mt-1 text-neutral-dark">
              {new Date(order.createdAt).toLocaleDateString()}
            </dd>
          </div>
          <div>
            <dt className="text-xs font-medium text-neutral uppercase tracking-wide">Total Items</dt>
            <dd className="mt-1 text-neutral-dark">{totalItems}</dd>
          </div>
          <div>
            <dt className="text-xs font-medium text-neutral uppercase tracking-wide">Total Cost</dt>
            <dd className="mt-1 text-neutral-dark font-medium">${order.totalOrderCost.toFixed(2)}</dd>
          </div>
          {order.invoicePaidDate && (
            <div>
              <dt className="text-xs font-medium text-neutral uppercase tracking-wide">Invoice Paid</dt>
              <dd className="mt-1 text-neutral-dark">
                {new Date(order.invoicePaidDate).toLocaleDateString()}
              </dd>
            </div>
          )}
        </dl>
      </Card>

      {/* Line items */}
      <h2 className="text-lg font-semibold text-primary mb-3">Line Items</h2>
      <Card className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead>
            <tr className="border-b border-neutral/15">
              <th className="px-4 py-3 text-xs font-medium text-neutral uppercase tracking-wide">Product Code</th>
              <th className="px-4 py-3 text-xs font-medium text-neutral uppercase tracking-wide">Quantity</th>
              <th className="px-4 py-3 text-xs font-medium text-neutral uppercase tracking-wide text-right">Unit Cost</th>
              <th className="px-4 py-3 text-xs font-medium text-neutral uppercase tracking-wide text-right">Total Cost</th>
            </tr>
          </thead>
          <tbody>
            {order.items.map((item, idx) => (
              <tr key={idx} className="border-b border-neutral/10 last:border-0">
                <td className="px-4 py-3 font-medium text-primary-dark whitespace-nowrap">{item.productCode}</td>
                <td className="px-4 py-3 text-neutral-dark">{item.quantity}</td>
                <td className="px-4 py-3 text-neutral-dark text-right">${item.unitCost.toFixed(2)}</td>
                <td className="px-4 py-3 text-neutral-dark text-right font-medium">${item.totalCost.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="border-t border-neutral/15">
              <td colSpan={3} className="px-4 py-3 text-right text-xs font-medium text-neutral uppercase tracking-wide">
                Order Total
              </td>
              <td className="px-4 py-3 text-right font-semibold text-primary-dark">
                ${order.totalOrderCost.toFixed(2)}
              </td>
            </tr>
          </tfoot>
        </table>
      </Card>
    </div>
  );
}
