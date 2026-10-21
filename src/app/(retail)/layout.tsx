import { notFound } from "next/navigation";
import { features } from "@/lib/features";

/** Gate for every retail route: 404 unless the retail feature flag is on. */
export default function RetailLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  if (!features.retail) notFound();
  return children;
}
