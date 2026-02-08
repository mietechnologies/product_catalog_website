"use client";

import { formatPrice } from "@/lib/utils";

interface PriceBlockProps {
  price: number;
}

export default function PriceBlock({ price }: PriceBlockProps) {
  return (
    <div className="space-y-3">
      <p className="text-2xl font-bold text-primary">{formatPrice(price)}</p>
      <div className="rounded-lg border border-accent/30 bg-accent/5 p-4">
        <p className="text-sm font-medium text-accent-dark">
          Purchase coming soon
        </p>
        <p className="text-xs text-neutral mt-1">
          Online ordering will be available in a future update.
        </p>
      </div>
    </div>
  );
}
