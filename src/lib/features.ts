/**
 * Feature flags.
 *
 * Flags are resolved at build time from NEXT_PUBLIC_* environment variables
 * (Next.js inlines them into the client bundle), so changing one requires a
 * rebuild. Each flag is off unless its variable is exactly "true".
 *
 * Flags only control what this frontend builds and shows. They are not access
 * control: the backend enforces its own authentication and authorization.
 */

export const features = {
  /** Retail module: retailer accounts, wholesale ordering, order management. */
  retail: process.env.NEXT_PUBLIC_FEATURE_RETAIL === "true",
} as const;
