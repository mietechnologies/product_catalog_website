"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Card from "@/components/ui/Card";
import { useToast } from "@/components/ui/Toast";
import { useAuth } from "@/lib/auth/AuthContext";
import { fetchApprovedRetailers } from "../api";
import type { PendingRetailer } from "../types";

export default function ApprovedRetailersScreen() {
  const router = useRouter();
  const { toast } = useToast();
  const { auth, ready } = useAuth();

  const [retailers, setRetailers] = useState<PendingRetailer[]>([]);
  const [loading, setLoading] = useState(true);

  // Redirect non-admin users
  useEffect(() => {
    if (ready && (!auth || auth.user.role !== "admin")) {
      router.replace("/login");
    }
  }, [ready, auth, router]);

  // Fetch approved retailers
  useEffect(() => {
    if (!auth) return;

    async function load() {
      setLoading(true);
      const result = await fetchApprovedRetailers();
      if (result.ok) {
        setRetailers(result.data.retailers);
      } else {
        toast(result.error, "error");
      }
      setLoading(false);
    }

    load();
  }, [auth, toast]);

  if (!ready || !auth || auth.user.role !== "admin") {
    return null;
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="text-2xl font-bold text-primary mb-6">
        Approved Retailers
      </h1>

      {loading ? (
        <p className="text-neutral">Loading...</p>
      ) : retailers.length === 0 ? (
        <Card className="p-6 text-center">
          <p className="text-neutral">No approved retailers.</p>
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
              </tr>
            </thead>
            <tbody>
              {retailers.map((r) => (
                <tr key={r.id || r.email} className="border-b border-neutral/10 last:border-0">
                  <td className="px-4 py-3 font-medium text-primary-dark whitespace-nowrap">{r.merchantName}</td>
                  <td className="px-4 py-3 text-neutral-dark whitespace-nowrap">{r.firstName}</td>
                  <td className="px-4 py-3 text-neutral-dark whitespace-nowrap">{r.lastName}</td>
                  <td className="px-4 py-3 text-neutral">{r.email}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}
    </div>
  );
}
