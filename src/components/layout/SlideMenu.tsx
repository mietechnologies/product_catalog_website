"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { useAuth } from "@/lib/auth/AuthContext";
import { cn } from "@/lib/utils";

interface SlideMenuProps {
  open: boolean;
  onClose: () => void;
}

export default function SlideMenu({ open, onClose }: SlideMenuProps) {
  const { auth } = useAuth();
  const [mounted, setMounted] = useState(false);
  const [retailOpen, setRetailOpen] = useState(false);

  useEffect(() => setMounted(true), []);

  const linkClass =
    "inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-white/80 hover:bg-white/10 hover:text-white transition-colors";

  if (!mounted) return null;

  return createPortal(
    <>
      {/* Backdrop */}
      <div
        className={cn(
          "fixed inset-0 z-[60] bg-black/40 transition-opacity duration-300",
          open ? "opacity-100" : "pointer-events-none opacity-0",
        )}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel */}
      <div
        className={cn(
          "fixed inset-y-0 right-0 z-[70] w-72 bg-primary-dark shadow-xl transition-all duration-300",
          open ? "translate-x-0" : "translate-x-full",
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/15 px-4 h-16">
          <span className="text-lg font-bold text-white">Menu</span>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-white/60 hover:bg-white/10 hover:text-white transition-colors"
            aria-label="Close menu"
          >
            <svg
              className="h-5 w-5"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18 18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Menu items */}
        <nav className="flex flex-col gap-1 p-4" aria-label="Slide menu">
          <Link href="/" onClick={onClose} className={linkClass}>
            Browse Catalog
          </Link>

          {auth && auth.user.accountType !== "admin" && (
            <Link
              href="/orders/create"
              onClick={onClose}
              className={linkClass}
            >
              Create Order
            </Link>
          )}

          {auth && auth.user.accountType === "admin" && (
            <>
              <Link
                href="/admin/miniatures/add"
                onClick={onClose}
                className={linkClass}
              >
                Add Miniature
              </Link>
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
          )}
        </nav>
      </div>
    </>,
    document.body,
  );
}
