"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Card from "@/components/ui/Card";
import { useToast } from "@/components/ui/Toast";
import { useAuth } from "@/lib/auth/AuthContext";
import { fetchUnfulfilledOrders } from "@/lib/auth/api";
import type { Order } from "@/lib/auth/types";

export default function PendingOrdersPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { auth, ready } = useAuth();

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  // Redirect non-admin users
  useEffect(() => {
    if (ready && (!auth || auth.user.accountType !== "admin")) {
      router.replace("/login");
    }
  }, [ready, auth, router]);

  // Fetch unfulfilled orders
  useEffect(() => {
    if (!auth) return;

    async function load() {
      setLoading(true);
      const result = await fetchUnfulfilledOrders(auth!.token);
      if (result.ok) {
        setOrders(result.data.orders);
      } else {
        toast(result.error, "error");
      }
      setLoading(false);
    }

    load();
  }, [auth, toast]);

  if (!ready || !auth || auth.user.accountType !== "admin") {
    return null;
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="text-2xl font-bold text-primary mb-6">
        Pending Orders
      </h1>

      {loading ? (
        <p className="text-neutral">Loading...</p>
      ) : orders.length === 0 ? (
        <Card className="p-6 text-center">
          <p className="text-neutral">No pending orders.</p>
        </Card>
      ) : (
        <Card className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead>
              <tr className="border-b border-neutral/15">
                <th className="px-4 py-3 text-xs font-medium text-neutral uppercase tracking-wide">Order ID</th>
                <th className="px-4 py-3 text-xs font-medium text-neutral uppercase tracking-wide">Name</th>
                <th className="px-4 py-3 text-xs font-medium text-neutral uppercase tracking-wide">Total Items</th>
                <th className="px-4 py-3 text-xs font-medium text-neutral uppercase tracking-wide text-right">Total Cost</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.id} className="border-b border-neutral/10 last:border-0 hover:bg-neutral/5 transition-colors">
                  <td className="px-4 py-3">
                    <Link
                      href={`/admin/orders/${o.id}`}
                      className="font-medium text-accent hover:underline"
                    >
                      {o.id}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-neutral-dark whitespace-nowrap">{o.name}</td>
                  <td className="px-4 py-3 text-neutral-dark">
                    {o.items.reduce((sum, item) => sum + item.quantity, 0)}
                  </td>
                  <td className="px-4 py-3 text-neutral-dark text-right whitespace-nowrap">
                    ${o.totalOrderCost.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}
    </div>
  );
}
