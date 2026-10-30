"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { useAuth } from "@/lib/auth/AuthContext";
import {
  RetailAdminMenuLinks,
  RetailCustomerMenuLinks,
} from "@/modules/retail";
import { cn } from "@/lib/utils";

interface SlideMenuProps {
  open: boolean;
  onClose: () => void;
}

export default function SlideMenu({ open, onClose }: SlideMenuProps) {
  const { auth } = useAuth();
  const [mounted, setMounted] = useState(false);

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

          <RetailCustomerMenuLinks onClose={onClose} linkClass={linkClass} />

          {auth && auth.user.role === "admin" && (
            <>
              <Link
                href="/admin/miniatures/add"
                onClick={onClose}
                className={linkClass}
              >
                Add Miniature
              </Link>
              <Link
                href="/admin/prints/add"
                onClick={onClose}
                className={linkClass}
              >
                Add Print
              </Link>
              <RetailAdminMenuLinks onClose={onClose} linkClass={linkClass} />
            </>
          )}
        </nav>
      </div>
    </>,
    document.body,
  );
}
