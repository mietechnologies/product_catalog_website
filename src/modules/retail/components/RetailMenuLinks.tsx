"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth/AuthContext";
import { features } from "@/lib/features";
import { cn } from "@/lib/utils";

interface RetailMenuLinksProps {
  onClose: () => void;
  linkClass: string;
}

/** Slide-menu links for signed-in non-admin accounts (order creation/history). */
export function RetailCustomerMenuLinks({
  onClose,
  linkClass,
}: RetailMenuLinksProps) {
  const { auth } = useAuth();

  if (!features.retail || !auth || auth.user.accountType === "admin") {
    return null;
  }

  return (
    <>
      <Link href="/orders/create" onClick={onClose} className={linkClass}>
        Create Order
      </Link>

      {auth.user.accountType === "retailer" && (
        <Link href="/orders" onClick={onClose} className={linkClass}>
          My Orders
        </Link>
      )}
    </>
  );
}

/** Slide-menu links for admins (retailer approval, order management). */
export function RetailAdminMenuLinks({
  onClose,
  linkClass,
}: RetailMenuLinksProps) {
  const { auth } = useAuth();
  const [retailOpen, setRetailOpen] = useState(false);

  if (!features.retail || auth?.user.accountType !== "admin") return null;

  return (
    <>
      {/* Retail Portal dropdown */}
      <button
        onClick={() => setRetailOpen((v) => !v)}
        className={cn(linkClass, "w-full justify-between")}
      >
        Retail Portal
        <svg
          className={cn(
            "h-4 w-4 transition-transform",
            retailOpen && "rotate-180",
          )}
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m19.5 8.25-7.5 7.5-7.5-7.5"
          />
        </svg>
      </button>
      {retailOpen && (
        <div className="ml-3 flex flex-col gap-1">
          <Link
            href="/admin/retailers/pending"
            onClick={onClose}
            className={linkClass}
          >
            Pending Retailers
          </Link>
          <Link
            href="/admin/retailers/approved"
            onClick={onClose}
            className={linkClass}
          >
            Approved Retailers
          </Link>
        </div>
      )}
      <Link
        href="/admin/orders/pending"
        onClick={onClose}
        className={linkClass}
      >
        Pending Orders
      </Link>
    </>
  );
}
