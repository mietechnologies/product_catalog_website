import Link from "next/link";
import { features } from "@/lib/features";

/** "Retailer? Register here" prompt shown beneath the login form. */
export default function RetailerSignupPrompt() {
  if (!features.retail) return null;

  return (
    <p>
      Retailer?{" "}
      <Link
        href="/retailer/create"
        className="font-medium text-primary hover:text-primary-light transition-colors"
      >
        Register here
      </Link>
    </p>
  );
}
