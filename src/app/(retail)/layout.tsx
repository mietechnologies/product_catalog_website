import { notFound } from "next/navigation";
import { features } from "@/lib/features";

/**
 * Backstop for every retail route: 404 unless the retail feature flag is on.
 * With the flag off, next.config.ts already leaves `page.retail.tsx` files out
 * of the build; this only matters if a retail route is added as a plain
 * `page.tsx`.
 */
export default function RetailLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  if (!features.retail) notFound();
  return children;
}
