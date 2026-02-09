"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";
import { useAuth } from "@/lib/auth/AuthContext";
import {
  fetchPendingRetailers,
  approveRetailer,
  rejectRetailer,
} from "@/lib/auth/api";
import type { PendingRetailer } from "@/lib/auth/types";

export default function PendingRetailersPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { auth, ready } = useAuth();

  const [retailers, setRetailers] = useState<PendingRetailer[]>([]);
  const [loading, setLoading] = useState(true);
  const [actioningId, setActioningId] = useState<string | null>(null);

  // Redirect non-admin users
  useEffect(() => {
    if (ready && (!auth || auth.user.accountType !== "admin")) {
      router.replace("/login");
    }
  }, [ready, auth, router]);

  // Fetch pending retailers
  useEffect(() => {
    if (!auth) return;

    async function load() {
      setLoading(true);
      const result = await fetchPendingRetailers(auth!.token);
      if (result.ok) {
        setRetailers(result.data.retailers);
      } else {
        toast(result.error, "error");
      }
      setLoading(false);
    }

    load();
  }, [auth, toast]);

  async function handleApprove(id: string) {
    if (!auth) return;
    setActioningId(id);
    const result = await approveRetailer(id, auth.token);
    setActioningId(null);

    if (!result.ok) {
      toast(result.error, "error");
      return;
    }

    setRetailers((prev) => prev.filter((r) => r.id !== id));
    toast("Retailer approved", "success");
  }

  async function handleReject(id: string) {
    if (!auth) return;
    setActioningId(id);
    const result = await rejectRetailer(id, auth.token);
    setActioningId(null);

    if (!result.ok) {
      toast(result.error, "error");
      return;
    }

    setRetailers((prev) => prev.filter((r) => r.id !== id));
    toast("Retailer rejected", "success");
  }

  if (!ready || !auth || auth.user.accountType !== "admin") {
    return null;
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="text-2xl font-bold text-primary mb-6">
        Pending Retailers
      </h1>

      {loading ? (
        <p className="text-neutral">Loading...</p>
      ) : retailers.length === 0 ? (
        <Card className="p-6 text-center">
          <p className="text-neutral">No pending retailer applications.</p>
        </Card>
      ) : (
        <Card className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead>
              <tr className="border-b border-neutral/15">
                <th className="px-4 py-3 text-xs font-medium text-neutral uppercase tracking-wide">Merchant Name</th>
                <th className="px-4 py-3 text-xs font-medium text-neutral uppercase tracking-wide">First Name</th>
                <th className="px-4 py-3 text-xs font-medium text-neutral uppercase tracking-wide">Last Name</th>
                <th className="px-4 py-3 text-xs font-medium text-neutral uppercase tracking-wide">Email</th>
                <th className="px-4 py-3 text-xs font-medium text-neutral uppercase tracking-wide text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {retailers.map((r) => (
                <tr key={r.id || r.email} className="border-b border-neutral/10 last:border-0">
                  <td className="px-4 py-3 font-medium text-primary-dark whitespace-nowrap">{r.merchantName}</td>
                  <td className="px-4 py-3 text-neutral-dark whitespace-nowrap">{r.firstName}</td>
                  <td className="px-4 py-3 text-neutral-dark whitespace-nowrap">{r.lastName}</td>
                  <td className="px-4 py-3 text-neutral">{r.email}</td>
                  <td className="px-4 py-3 text-right whitespace-nowrap">
                    <div className="flex gap-2 justify-end">
                      <Button
                        onClick={() => handleApprove(r.id)}
                        disabled={actioningId === r.id}
                      >
                        {actioningId === r.id ? "..." : "Approve"}
                      </Button>
                      <button
                        onClick={() => handleReject(r.id)}
                        disabled={actioningId === r.id}
                        className="rounded-lg border border-red-300 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50"
                      >
                        {actioningId === r.id ? "..." : "Reject"}
                      </button>
                    </div>
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
