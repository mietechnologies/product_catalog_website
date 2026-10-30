"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";
import { useAuth } from "@/lib/auth/AuthContext";
import { fetchMyOrders } from "../api";
import type { Order } from "../types";
import {
  getOrderStatus,
  ORDER_STATUS_BADGE_VARIANT,
  ORDER_STATUS_RANK,
} from "../orderStatus";
import { cn } from "@/lib/utils";

type SortKey = "id" | "createdAt" | "itemCount" | "status";
type SortDir = "asc" | "desc";

const columns: { key: SortKey; label: string; align?: "right" }[] = [
  { key: "id", label: "Order #" },
  { key: "createdAt", label: "Order Date" },
  { key: "itemCount", label: "# Items Ordered", align: "right" },
  { key: "status", label: "Status" },
];

function SortIcon({ direction }: { direction: SortDir }) {
  return (
    <svg
      className={cn("h-3 w-3 transition-transform", direction === "asc" && "rotate-180")}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M12 16.5 5 8.5h14z" />
    </svg>
  );
}

export default function MyOrdersScreen() {
  const router = useRouter();
  const { toast } = useToast();
  const { auth, ready } = useAuth();

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortKey, setSortKey] = useState<SortKey>("createdAt");
  const [sortDir, setSortDir] = useState<SortDir>("desc");

  // Redirect non-retailer users
  useEffect(() => {
    if (ready && (!auth || auth.user.role !== "retailer")) {
      router.replace("/login");
    }
  }, [ready, auth, router]);

  // Fetch the retailer's orders
  useEffect(() => {
    if (!auth) return;

    async function load() {
      setLoading(true);
      const result = await fetchMyOrders();
      if (result.ok) {
        setOrders(result.data.orders);
      } else {
        toast(result.error, "error");
      }
      setLoading(false);
    }

    load();
  }, [auth, toast]);

  function handleSort(key: SortKey) {
    if (key === sortKey) {
      setSortDir((d) => (d === "desc" ? "asc" : "desc"));
    } else {
      setSortKey(key);
      setSortDir("desc");
    }
  }

  const rows = useMemo(() => {
    const withDerived = orders.map((order) => ({
      order,
      itemCount: order.items.reduce((sum, item) => sum + item.quantity, 0),
      status: getOrderStatus(order),
    }));

    withDerived.sort((a, b) => {
      let cmp = 0;
      switch (sortKey) {
        case "id":
          cmp = a.order.id.localeCompare(b.order.id);
          break;
        case "createdAt":
          cmp = new Date(a.order.createdAt).getTime() - new Date(b.order.createdAt).getTime();
          break;
        case "itemCount":
          cmp = a.itemCount - b.itemCount;
          break;
        case "status":
          cmp = ORDER_STATUS_RANK[a.status] - ORDER_STATUS_RANK[b.status];
          break;
      }
      return sortDir === "asc" ? cmp : -cmp;
    });

    return withDerived;
  }, [orders, sortKey, sortDir]);

  if (!ready || !auth || auth.user.role !== "retailer") {
    return null;
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-primary">My Orders</h1>
        <Button onClick={() => router.push("/orders/create")}>
          Create Order
        </Button>
      </div>

      {loading ? (
        <p className="text-neutral">Loading...</p>
      ) : orders.length === 0 ? (
        <Card className="p-6 text-center">
          <p className="text-neutral mb-4">You haven&apos;t placed any orders yet.</p>
          <Button onClick={() => router.push("/orders/create")}>
            Create Your First Order
          </Button>
        </Card>
      ) : (
        <Card className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead>
              <tr className="border-b border-neutral/15">
                {columns.map((col) => {
                  const active = sortKey === col.key;
                  return (
                    <th
                      key={col.key}
                      scope="col"
                      aria-sort={active ? (sortDir === "asc" ? "ascending" : "descending") : "none"}
                      className={cn(
                        "px-4 py-3 text-xs font-medium text-neutral uppercase tracking-wide",
                        col.align === "right" && "text-right",
                      )}
                    >
                      <button
                        type="button"
                        onClick={() => handleSort(col.key)}
                        className={cn(
                          "inline-flex items-center gap-1 hover:text-primary transition-colors",
                          active && "text-primary",
                        )}
                      >
                        {col.label}
                        <span className={cn("inline-flex", !active && "invisible")}>
                          <SortIcon direction={sortDir} />
                        </span>
                      </button>
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {rows.map(({ order, itemCount, status }) => (
                <tr
                  key={order.id}
                  onClick={() => router.push(`/orders/${order.id}`)}
                  className="cursor-pointer border-b border-neutral/10 last:border-0 hover:bg-neutral/5 transition-colors"
                >
                  <td className="px-4 py-3">
                    <Link
                      href={`/orders/${order.id}`}
                      onClick={(e) => e.stopPropagation()}
                      className="font-medium text-accent hover:underline"
                    >
                      {order.id}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-neutral-dark whitespace-nowrap">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 text-neutral-dark text-right">{itemCount}</td>
                  <td className="px-4 py-3">
                    <Badge variant={ORDER_STATUS_BADGE_VARIANT[status]}>{status}</Badge>
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
